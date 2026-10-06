import { TRANSFORMATION_PROGRAM } from "../../src/lib/transformation-program";

/**
 * Live Transformation Program prices. TRANSFORMATION_PRICE_IDS replaces this
 * list when set. TRANSFORMATION_PRICE_ID is still read and added so an older
 * single-price env var keeps matching.
 */
export const DEFAULT_TRANSFORMATION_PRICE_IDS = [
  TRANSFORMATION_PROGRAM.pricing.stripePayInFullPriceId,
  TRANSFORMATION_PROGRAM.pricing.stripeInstallmentPriceId,
] as const;

export type RevenueBucketName = "transformation" | "study";

export type BucketTotals = {
  grossCents: number;
  sales: number;
  refundCents: number;
  refundCount: number;
  netCents: number;
  aovCents: number;
};

export type RevenueReport = {
  transformation: BucketTotals;
  study: BucketTotals;
};

export type RevenueDigest = {
  subject: string;
  text: string;
};

type PriceEnv = {
  TRANSFORMATION_PRICE_IDS?: string;
  TRANSFORMATION_PRICE_ID?: string;
};

function splitPriceIds(value: string | undefined): string[] {
  if (!value) return [];
  const seen = new Set<string>();
  const ids: string[] = [];
  for (const part of value.split(",")) {
    const id = part.trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    ids.push(id);
  }
  return ids;
}

export function resolveTransformationPriceIds(env: PriceEnv = {}): string[] {
  const override = splitPriceIds(env.TRANSFORMATION_PRICE_IDS);
  const base = override.length > 0 ? override : [...DEFAULT_TRANSFORMATION_PRICE_IDS];
  const legacy = env.TRANSFORMATION_PRICE_ID?.trim() ?? "";
  if (legacy && !base.includes(legacy)) base.push(legacy);
  return base;
}

export function lineItemPriceId(lineItem: unknown): string | null {
  if (!lineItem || typeof lineItem !== "object") return null;
  const price = (lineItem as { price?: unknown }).price;
  if (typeof price === "string" && price.startsWith("price_")) return price;
  if (!price || typeof price !== "object") return null;
  const id = (price as { id?: unknown }).id;
  if (typeof id === "string" && id.startsWith("price_")) return id;
  return null;
}

function expandableId(value: unknown): string | null {
  if (typeof value === "string" && value.length > 0) return value;
  if (!value || typeof value !== "object") return null;
  const id = (value as { id?: unknown }).id;
  return typeof id === "string" && id.length > 0 ? id : null;
}

function cents(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? Math.trunc(value) : 0;
}

function emptyBucket(): BucketTotals {
  return {
    grossCents: 0,
    sales: 0,
    refundCents: 0,
    refundCount: 0,
    netCents: 0,
    aovCents: 0,
  };
}

function finalizeBucket(bucket: BucketTotals): BucketTotals {
  return {
    ...bucket,
    netCents: bucket.grossCents - bucket.refundCents,
    aovCents: bucket.sales > 0 ? Math.floor(bucket.grossCents / bucket.sales) : 0,
  };
}

function lineItemsOf(session: Record<string, unknown>): unknown[] {
  const lineItems = session.line_items;
  if (!lineItems || typeof lineItems !== "object") return [];
  const data = (lineItems as { data?: unknown }).data;
  return Array.isArray(data) ? data : [];
}

/** A paid session is Transformation when any line item price is in the list. */
export function sessionBucket(
  session: Record<string, unknown>,
  transformationPriceIds: ReadonlySet<string>,
): RevenueBucketName {
  for (const lineItem of lineItemsOf(session)) {
    const priceId = lineItemPriceId(lineItem);
    if (priceId && transformationPriceIds.has(priceId)) return "transformation";
  }
  return "study";
}

/**
 * Bucket paid checkout sessions. Unpaid sessions are ignored.
 * Gross, count, and refunds are totaled per bucket. A refund counts in the
 * bucket of the paid session that shares its payment_intent.
 */
export function bucketPaidSessions(
  sessions: readonly Record<string, unknown>[],
  refunds: readonly Record<string, unknown>[],
  transformationPriceIds: readonly string[],
): RevenueReport {
  const priceIds = new Set(transformationPriceIds);
  const transformation = emptyBucket();
  const study = emptyBucket();
  const intentBucket = new Map<string, RevenueBucketName>();

  for (const session of sessions) {
    if (session.payment_status !== "paid") continue;
    const name = sessionBucket(session, priceIds);
    const bucket = name === "transformation" ? transformation : study;
    bucket.sales += 1;
    bucket.grossCents += cents(session.amount_total);
    const intent = expandableId(session.payment_intent);
    if (intent && !intentBucket.has(intent)) intentBucket.set(intent, name);
  }

  for (const refund of refunds) {
    if (refund.status !== "succeeded") continue;
    const intent = expandableId(refund.payment_intent);
    if (!intent) continue;
    const name = intentBucket.get(intent);
    if (!name) continue;
    const bucket = name === "transformation" ? transformation : study;
    bucket.refundCount += 1;
    bucket.refundCents += cents(refund.amount);
  }

  return {
    transformation: finalizeBucket(transformation),
    study: finalizeBucket(study),
  };
}

export function fmtUsd(centsAmount: number): string {
  const formatted = (centsAmount / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `$${formatted}`;
}

export function weeklyRevenueSubject(report: RevenueReport): string {
  const transformation = report.transformation;
  const study = report.study;
  return `Weekly Revenue: Transformation ${fmtUsd(transformation.grossCents)} (${transformation.sales}) | Study ${fmtUsd(study.grossCents)} (${study.sales})`;
}

function bucketSection(title: string, bucket: BucketTotals): string {
  return `## ${title}

| Metric | Value |
|---|---|
| Gross Revenue | **${fmtUsd(bucket.grossCents)}** |
| Net Revenue (after refunds) | **${fmtUsd(bucket.netCents)}** |
| Sales | **${bucket.sales}** |
| Average Order Value | **${fmtUsd(bucket.aovCents)}** |
| Refunds | ${bucket.refundCount} (-${fmtUsd(bucket.refundCents)}) |`;
}

export function buildWeeklyRevenueDigest(input: {
  report: RevenueReport;
  periodLabel: string;
  lookbackDays: number;
  generatedAt: string;
}): RevenueDigest {
  const { report, periodLabel, lookbackDays, generatedAt } = input;
  const text = `# Weekly Revenue Summary — Behavior School

**Period:** ${periodLabel} (${lookbackDays} days)
**Generated:** ${generatedAt}

---

${bucketSection("Transformation Program", report.transformation)}

---

${bucketSection("Study / other", report.study)}

---

## Notes

- Gross only. Stripe fees (~2.9% + $0.30/txn) are not deducted.
- Refunds in this window are counted in the same bucket as the paid session with the same payment_intent.
- Transformation Program is a checkout with any line item on a Transformation price (pay-in-full or installments). Every other paid checkout is Study / other.
- Source: Stripe checkout sessions (status=complete, payment_status=paid) with line items expanded.
`;

  return { subject: weeklyRevenueSubject(report), text };
}

/** DRY_RUN=true or ?dry_run=1. Anything else sends the email. */
export function isWeeklyRevenueDryRun(input: {
  dryRunEnv?: string;
  dryRunQuery?: string | null;
}): boolean {
  return input.dryRunEnv === "true" || input.dryRunQuery === "1";
}
