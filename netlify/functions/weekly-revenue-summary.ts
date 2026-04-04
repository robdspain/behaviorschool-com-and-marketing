/**
 * Weekly Revenue Summary — Behavior School
 * ==========================================
 * Netlify Scheduled Function
 *
 * Schedule: cron "0 13 * * 1"  →  every Monday at 13:00 UTC (8:00 AM ET, 9:00 AM EDT)
 *
 * What it does:
 *   1. Queries Stripe for last 7 days of completed Transformation Program sales
 *   2. Calculates gross revenue, net revenue (after refunds), sales count, AOV
 *   3. Sends a plain-text markdown digest to Rob's email via Resend
 *
 * Required env vars:
 *   STRIPE_RESTRICTED_KEY   — Stripe restricted read-only key (see BEH-433)
 *   RESEND_API_KEY          — Resend API key for outbound email
 *
 * Optional env vars:
 *   TRANSFORMATION_PRICE_ID — Stripe price ID to filter to one product (recommended)
 *   LOOKBACK_DAYS           — Number of days to look back (default: 7)
 *   DIGEST_TO_EMAIL         — Override recipient email (default: rob@behaviorschool.com)
 *
 * FERPA note: No student data is touched. Aggregates payment totals only.
 */

const STRIPE_API = 'https://api.stripe.com/v1';
const RESEND_API = 'https://api.resend.com/emails';
const DEFAULT_TO = 'rob@behaviorschool.com';
const FROM_EMAIL = 'noreply@behaviorschool.com';

// ── Stripe helpers ─────────────────────────────────────────────────────────

function stripeAuthHeader(key: string): Record<string, string> {
  const creds = Buffer.from(`${key}:`).toString('base64');
  return { Authorization: `Basic ${creds}` };
}

async function stripeGet(
  key: string,
  path: string,
  params: Record<string, string | number> = {}
): Promise<Record<string, unknown>> {
  const qs = new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)])
  ).toString();
  const url = `${STRIPE_API}/${path}${qs ? `?${qs}` : ''}`;
  const res = await fetch(url, { headers: stripeAuthHeader(key) });
  if (!res.ok) {
    const body = await res.text();
    let msg = body;
    try {
      msg = (JSON.parse(body) as { error?: { message?: string } }).error?.message ?? body;
    } catch { /* ignore */ }
    throw new Error(`Stripe ${res.status}: ${msg}`);
  }
  return res.json() as Promise<Record<string, unknown>>;
}

type StripeItem = Record<string, unknown>;

async function* stripePages(
  key: string,
  path: string,
  baseParams: Record<string, string | number>
): AsyncGenerator<StripeItem> {
  let params = { ...baseParams, limit: 100 } as Record<string, string | number>;
  while (true) {
    const page = await stripeGet(key, path, params);
    const items = (page.data ?? []) as StripeItem[];
    for (const item of items) yield item;
    if (!page.has_more) break;
    params = { ...params, starting_after: items[items.length - 1].id as string };
  }
}

// ── Money formatting ───────────────────────────────────────────────────────

function fmtUsd(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ── Main handler ───────────────────────────────────────────────────────────

export const handler = async (): Promise<{ statusCode: number; body: string }> => {
  const stripeKey = process.env.STRIPE_RESTRICTED_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const priceId   = process.env.TRANSFORMATION_PRICE_ID;
  const lookback  = parseInt(process.env.LOOKBACK_DAYS ?? '7', 10);
  const toEmail   = process.env.DIGEST_TO_EMAIL ?? DEFAULT_TO;

  if (!stripeKey) {
    console.error('[weekly-revenue-summary] STRIPE_RESTRICTED_KEY is not set');
    return { statusCode: 500, body: 'Missing STRIPE_RESTRICTED_KEY' };
  }
  if (!resendKey) {
    console.error('[weekly-revenue-summary] RESEND_API_KEY is not set');
    return { statusCode: 500, body: 'Missing RESEND_API_KEY' };
  }

  const now      = new Date();
  const startDt  = new Date(now.getTime() - lookback * 24 * 60 * 60 * 1000);
  const tsStart  = Math.floor(startDt.getTime() / 1000);

  // ── Fetch completed checkout sessions ────────────────────────────────────

  const sessionParams: Record<string, string | number> = {
    status:          'complete',
    'created[gte]':  tsStart,
  };
  if (priceId) {
    // Expand line_items to filter by price ID
    sessionParams['expand[]'] = 'data.line_items';
  }

  const allSessions: StripeItem[] = [];
  for await (const s of stripePages(stripeKey, 'checkout/sessions', sessionParams)) {
    allSessions.push(s);
  }

  // ── Fetch refunds for the same window ────────────────────────────────────

  const allRefunds: StripeItem[] = [];
  for await (const r of stripePages(stripeKey, 'refunds', { 'created[gte]': tsStart })) {
    allRefunds.push(r);
  }

  // ── Filter & aggregate ───────────────────────────────────────────────────

  const matched: StripeItem[] = [];
  for (const s of allSessions) {
    if (s.payment_status !== 'paid') continue;

    if (priceId) {
      const lineItems = ((s.line_items as Record<string, unknown>)?.data ?? []) as StripeItem[];
      const priceIds  = lineItems.map((li) => (li.price as Record<string, unknown>)?.id);
      if (!priceIds.includes(priceId)) continue;
    }

    matched.push(s);
  }

  const piIds = new Set(matched.map((s) => s.payment_intent).filter(Boolean));

  const refundCents = allRefunds
    .filter((r) => piIds.has(r.payment_intent) && r.status === 'succeeded')
    .reduce((sum, r) => sum + ((r.amount as number) ?? 0), 0);

  const grossCents  = matched.reduce((sum, s) => sum + ((s.amount_total as number) ?? 0), 0);
  const numSales    = matched.length;
  const netCents    = grossCents - refundCents;
  const aovCents    = numSales > 0 ? Math.floor(grossCents / numSales) : 0;
  const numRefunds  = allRefunds.filter(
    (r) => piIds.has(r.payment_intent) && r.status === 'succeeded'
  ).length;

  // ── Format digest ─────────────────────────────────────────────────────────

  const periodLabel  = `${startDt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  const filterLabel  = priceId ? priceId : 'all completed sessions';
  const generatedAt  = now.toISOString().replace('T', ' ').slice(0, 16) + ' UTC';

  const digest = `# Weekly Revenue Summary — Behavior School

**Period:** ${periodLabel} (${lookback} days)
**Filter:** ${filterLabel}
**Generated:** ${generatedAt}

---

## Transformation Program

| Metric | Value |
|---|---|
| Gross Revenue | **${fmtUsd(grossCents)}** |
| Net Revenue (after refunds) | **${fmtUsd(netCents)}** |
| Sales | **${numSales}** |
| Average Order Value | **${fmtUsd(aovCents)}** |
| Refunds | ${numRefunds} (-${fmtUsd(refundCents)}) |

---

## Notes

- Gross only. Stripe fees (~2.9% + $0.30/txn) are not deducted.
- Refunds are attributed to sessions within this window by payment_intent ID.
- Source: Stripe checkout/sessions (status=complete, payment_status=paid).
- To filter to the Transformation Program price, set TRANSFORMATION_PRICE_ID in Netlify env vars.
`;

  // ── Send via Resend ───────────────────────────────────────────────────────

  const subject = `📊 Weekly Revenue — ${numSales} sales, ${fmtUsd(grossCents)} gross (${periodLabel})`;

  const emailRes = await fetch(RESEND_API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendKey}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({
      from:    `Behavior School Finance <${FROM_EMAIL}>`,
      to:      [toEmail],
      subject,
      text:    digest,
    }),
  });

  if (!emailRes.ok) {
    const errBody = await emailRes.text();
    console.error('[weekly-revenue-summary] Resend error:', errBody);
    return { statusCode: 500, body: `Resend error: ${errBody}` };
  }

  console.log(`[weekly-revenue-summary] Sent digest to ${toEmail} — ${numSales} sales, ${fmtUsd(grossCents)} gross`);
  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true, sales: numSales, grossCents, netCents }),
  };
};
