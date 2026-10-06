import { withLambda } from '../lib/lambda-adapter.mjs'
import {
  bucketPaidSessions,
  buildWeeklyRevenueDigest,
  isWeeklyRevenueDryRun,
  lineItemPriceId,
  resolveTransformationPriceIds,
} from '../lib/weekly-revenue-report'

/**
 * Weekly Revenue Summary — Behavior School
 * ==========================================
 * Netlify Scheduled Function
 *
 * Schedule: cron "0 13 * * 1"  →  every Monday at 13:00 UTC (6:00 AM PT / 9:00 AM ET)
 *
 * What it does:
 *   1. Queries Stripe for paid checkout sessions in the lookback window
 *   2. Expands line items and buckets each sale as Transformation Program or Study / other
 *   3. Totals gross, count, and refunds per bucket
 *   4. Emails the digest via Resend, unless DRY_RUN is set
 *
 * Required env vars:
 *   STRIPE_RESTRICTED_KEY   Stripe restricted read-only key (preferred)
 *   STRIPE_SECRET_KEY       Stripe secret key used only if no restricted key is configured
 *   RESEND_API_KEY          Resend API key for outbound email (not required for dry run)
 *
 * Optional env vars:
 *   TRANSFORMATION_PRICE_IDS  Comma-separated price IDs that replace the catalog list
 *   TRANSFORMATION_PRICE_ID   Legacy single price ID, still added to the list
 *   LOOKBACK_DAYS             Number of days to look back (default: 7)
 *   DIGEST_TO_EMAIL           Override recipient email (default: rob@behaviorschool.com)
 *   DRY_RUN                   "true" returns the report and does not send email
 *
 * Manual invoke: /.netlify/functions/weekly-revenue-summary?dry_run=1
 *
 * FERPA note: No student data is touched. Aggregates payment totals only.
 */

const STRIPE_API = 'https://api.stripe.com/v1';
const RESEND_API = 'https://api.resend.com/emails';
const DEFAULT_TO = 'rob@behaviorschool.com';
const FROM_EMAIL = 'noreply@behaviorschool.com';

type StripeParams = Record<string, string | number | readonly string[]>;
type StripeItem = Record<string, unknown>;

type FunctionEvent = {
  queryStringParameters?: Record<string, string | undefined> | null;
};

type FunctionResult = {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
};

function stripeAuthHeader(key: string): Record<string, string> {
  const creds = Buffer.from(`${key}:`).toString('base64');
  return { Authorization: `Basic ${creds}` };
}

function stripeQuery(params: StripeParams): string {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      for (const item of value) qs.append(key, item);
    } else {
      qs.append(key, String(value));
    }
  }
  return qs.toString();
}

function redactSecrets(text: string): string {
  return text
    .replace(/\b(?:sk|rk)_(?:test|live)_[A-Za-z0-9]+/g, '[redacted]')
    .replace(/\bre_[A-Za-z0-9_]+/g, '[redacted]');
}

async function stripeGet(
  key: string,
  path: string,
  params: StripeParams = {},
): Promise<Record<string, unknown>> {
  const qs = stripeQuery(params);
  const url = `${STRIPE_API}/${path}${qs ? `?${qs}` : ''}`;
  const res = await fetch(url, { headers: stripeAuthHeader(key) });
  if (!res.ok) {
    const body = await res.text();
    let msg = body;
    try {
      msg = (JSON.parse(body) as { error?: { message?: string } }).error?.message ?? body;
    } catch { /* ignore */ }
    throw new Error(`Stripe ${res.status}: ${redactSecrets(msg)}`);
  }
  return res.json() as Promise<Record<string, unknown>>;
}

async function* stripePages(
  key: string,
  path: string,
  baseParams: StripeParams,
): AsyncGenerator<StripeItem> {
  let params: StripeParams = { ...baseParams, limit: 100 };
  while (true) {
    const page = await stripeGet(key, path, params);
    const items = (page.data ?? []) as StripeItem[];
    for (const item of items) yield item;
    if (!page.has_more || items.length === 0) break;
    const lastId = items[items.length - 1]?.id;
    if (typeof lastId !== 'string' || lastId.length === 0) break;
    params = { ...params, starting_after: lastId };
  }
}

function isCheckoutSessionId(id: unknown): id is string {
  return typeof id === 'string' && /^cs_[A-Za-z0-9_]+$/.test(id);
}

/** Use list-expanded line items only when every row has a price id. */
function usableEmbeddedLineItems(session: StripeItem): StripeItem[] | null {
  const lineItems = session.line_items;
  if (!lineItems || typeof lineItems !== 'object') return null;
  const record = lineItems as { data?: unknown; has_more?: unknown };
  if (!Array.isArray(record.data) || record.has_more === true) return null;
  const items = record.data as StripeItem[];
  if (items.length === 0) return null;
  if (!items.every((item) => lineItemPriceId(item))) return null;
  return items;
}

async function lineItemsForPaidSession(key: string, session: StripeItem): Promise<StripeItem[]> {
  const embedded = usableEmbeddedLineItems(session);
  if (embedded) return embedded;
  if (!isCheckoutSessionId(session.id)) return [];
  const items: StripeItem[] = [];
  for await (const item of stripePages(key, `checkout/sessions/${session.id}/line_items`, {
    'expand[]': ['data.price'],
  })) {
    items.push(item);
  }
  return items;
}

function jsonResult(statusCode: number, body: unknown): FunctionResult {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

const handler = async (event?: FunctionEvent): Promise<FunctionResult> => {
  const stripeKey = process.env.STRIPE_RESTRICTED_KEY || process.env.STRIPE_SECRET_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const lookback = parseInt(process.env.LOOKBACK_DAYS ?? '7', 10);
  const toEmail = process.env.DIGEST_TO_EMAIL ?? DEFAULT_TO;
  const dryRun = isWeeklyRevenueDryRun({
    dryRunEnv: process.env.DRY_RUN,
    dryRunQuery: event?.queryStringParameters?.dry_run,
  });

  if (!stripeKey || !/^(sk|rk)_(test|live)_/.test(stripeKey)) {
    console.error('[weekly-revenue-summary] No valid Stripe API key is configured');
    return { statusCode: 500, body: 'Missing valid Stripe API key' };
  }
  if (!dryRun && !resendKey) {
    console.error('[weekly-revenue-summary] RESEND_API_KEY is not set');
    return { statusCode: 500, body: 'Missing RESEND_API_KEY' };
  }

  const now = new Date();
  const startDt = new Date(now.getTime() - lookback * 24 * 60 * 60 * 1000);
  const tsStart = Math.floor(startDt.getTime() / 1000);

  const sessionParams: StripeParams = {
    status: 'complete',
    'created[gte]': tsStart,
    'expand[]': ['data.line_items'],
  };

  const allSessions: StripeItem[] = [];
  for await (const session of stripePages(stripeKey, 'checkout/sessions', sessionParams)) {
    allSessions.push(session);
  }

  const sessionsForBuckets: StripeItem[] = [];
  for (const session of allSessions) {
    if (session.payment_status !== 'paid') {
      sessionsForBuckets.push(session);
      continue;
    }
    const lineItems = await lineItemsForPaidSession(stripeKey, session);
    sessionsForBuckets.push({
      ...session,
      line_items: { data: lineItems, has_more: false },
    });
  }

  const allRefunds: StripeItem[] = [];
  for await (const refund of stripePages(stripeKey, 'refunds', { 'created[gte]': tsStart })) {
    allRefunds.push(refund);
  }

  const transformationPriceIds = resolveTransformationPriceIds({
    TRANSFORMATION_PRICE_IDS: process.env.TRANSFORMATION_PRICE_IDS,
    TRANSFORMATION_PRICE_ID: process.env.TRANSFORMATION_PRICE_ID,
  });
  const report = bucketPaidSessions(sessionsForBuckets, allRefunds, transformationPriceIds);

  const periodLabel = `${startDt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  const generatedAt = now.toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
  const digest = buildWeeklyRevenueDigest({
    report,
    periodLabel,
    lookbackDays: lookback,
    generatedAt,
  });

  if (dryRun) {
    console.log(`[weekly-revenue-summary] Dry run, email not sent — ${digest.subject}`);
    return jsonResult(200, {
      ok: true,
      dryRun: true,
      subject: digest.subject,
      text: digest.text,
      transformationPriceIds,
      transformation: report.transformation,
      study: report.study,
    });
  }

  const emailRes = await fetch(RESEND_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `Behavior School Finance <${FROM_EMAIL}>`,
      to: [toEmail],
      subject: digest.subject,
      text: digest.text,
    }),
  });

  if (!emailRes.ok) {
    const errBody = redactSecrets(await emailRes.text());
    console.error('[weekly-revenue-summary] Resend error:', emailRes.status, errBody);
    return { statusCode: 500, body: `Resend error: ${errBody}` };
  }

  console.log(`[weekly-revenue-summary] Sent digest to ${toEmail} — ${digest.subject}`);
  return jsonResult(200, {
    ok: true,
    dryRun: false,
    subject: digest.subject,
    transformation: report.transformation,
    study: report.study,
  });
};

export default withLambda(handler)
