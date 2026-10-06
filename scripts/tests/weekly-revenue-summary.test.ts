import assert from "node:assert/strict";
import test from "node:test";
import { TRANSFORMATION_PROGRAM } from "../../src/lib/transformation-program";
import {
  bucketPaidSessions,
  buildWeeklyRevenueDigest,
  isWeeklyRevenueDryRun,
  resolveTransformationPriceIds,
  sessionBucket,
} from "../../netlify/lib/weekly-revenue-report";

const PAY_IN_FULL = "price_1UBltAAHZC9qJnAYfebmUlRa";
const INSTALLMENT = "price_1UBltBAHZC9qJnAY3F8ovX5m";
const STUDY_PRICE = "price_study_other";

test("catalog defaults are the live pay-in-full and installment prices", () => {
  assert.equal(TRANSFORMATION_PROGRAM.pricing.stripePayInFullPriceId, PAY_IN_FULL);
  assert.equal(TRANSFORMATION_PROGRAM.pricing.stripeInstallmentPriceId, INSTALLMENT);
  assert.deepEqual(resolveTransformationPriceIds({}), [PAY_IN_FULL, INSTALLMENT]);
});

test("TRANSFORMATION_PRICE_IDS overrides the catalog list and the legacy var is still added", () => {
  assert.deepEqual(
    resolveTransformationPriceIds({ TRANSFORMATION_PRICE_IDS: " price_a, price_b, price_a " }),
    ["price_a", "price_b"],
  );
  assert.deepEqual(
    resolveTransformationPriceIds({ TRANSFORMATION_PRICE_ID: "price_legacy" }),
    [PAY_IN_FULL, INSTALLMENT, "price_legacy"],
  );
  assert.deepEqual(
    resolveTransformationPriceIds({
      TRANSFORMATION_PRICE_IDS: "price_a,price_b",
      TRANSFORMATION_PRICE_ID: "price_legacy",
    }),
    ["price_a", "price_b", "price_legacy"],
  );
  assert.deepEqual(resolveTransformationPriceIds({ TRANSFORMATION_PRICE_IDS: " , " }), [
    PAY_IN_FULL,
    INSTALLMENT,
  ]);
});

test("buckets pay-in-full, installments, and study sales separately", () => {
  const priceIds = resolveTransformationPriceIds({});
  const sessions = [
    {
      payment_status: "paid",
      amount_total: 199700,
      payment_intent: "pi_full",
      line_items: { data: [{ price: { id: PAY_IN_FULL } }] },
    },
    {
      payment_status: "paid",
      amount_total: 66567,
      payment_intent: { id: "pi_installment" },
      line_items: { data: [{ price: INSTALLMENT }] },
    },
    {
      payment_status: "paid",
      amount_total: 553,
      payment_intent: "pi_study_1",
      line_items: { data: [{ price: STUDY_PRICE }] },
    },
    {
      payment_status: "paid",
      amount_total: 553,
      payment_intent: "pi_study_2",
      line_items: { data: [{ price: { id: STUDY_PRICE } }] },
    },
    {
      payment_status: "unpaid",
      amount_total: 199700,
      payment_intent: "pi_unpaid",
      line_items: { data: [{ price: PAY_IN_FULL }] },
    },
    {
      payment_status: "paid",
      amount_total: 1106,
      payment_intent: "pi_no_lines",
    },
    {
      payment_status: "paid",
      amount_total: 200253,
      payment_intent: "pi_mixed",
      line_items: {
        data: [{ price: STUDY_PRICE }, { price: { id: PAY_IN_FULL } }],
      },
    },
  ];
  const refunds = [
    { status: "succeeded", amount: 553, payment_intent: "pi_study_1" },
    { status: "succeeded", amount: 1000, payment_intent: { id: "pi_full" } },
    { status: "pending", amount: 66567, payment_intent: "pi_installment" },
    { status: "succeeded", amount: 999, payment_intent: "pi_outside_window" },
    { status: "succeeded", amount: 199700, payment_intent: "pi_unpaid" },
  ];

  assert.equal(sessionBucket(sessions[0], new Set(priceIds)), "transformation");
  assert.equal(sessionBucket(sessions[2], new Set(priceIds)), "study");

  const report = bucketPaidSessions(sessions, refunds, priceIds);

  assert.deepEqual(report.transformation, {
    grossCents: 199700 + 66567 + 200253,
    sales: 3,
    refundCents: 1000,
    refundCount: 1,
    netCents: 199700 + 66567 + 200253 - 1000,
    aovCents: Math.floor((199700 + 66567 + 200253) / 3),
  });
  assert.deepEqual(report.study, {
    grossCents: 553 + 553 + 1106,
    sales: 3,
    refundCents: 553,
    refundCount: 1,
    netCents: 553 + 553 + 1106 - 553,
    aovCents: Math.floor((553 + 553 + 1106) / 3),
  });
});

test("digest splits Transformation and Study and the subject carries both totals", () => {
  const report = bucketPaidSessions(
    [
      {
        payment_status: "paid",
        amount_total: 199700,
        payment_intent: "pi_full",
        line_items: { data: [{ price: PAY_IN_FULL }] },
      },
      {
        payment_status: "paid",
        amount_total: 553,
        payment_intent: "pi_study",
        line_items: { data: [{ price: STUDY_PRICE }] },
      },
    ],
    [{ status: "succeeded", amount: 553, payment_intent: "pi_study" }],
    [PAY_IN_FULL, INSTALLMENT],
  );
  const digest = buildWeeklyRevenueDigest({
    report,
    periodLabel: "Sep 29 – Oct 6, 2026",
    lookbackDays: 7,
    generatedAt: "2026-10-06 13:00 UTC",
  });

  assert.equal(digest.subject, "Weekly Revenue: Transformation $1,997.00 (1) | Study $5.53 (1)");
  assert.match(digest.text, /## Transformation Program/);
  assert.match(digest.text, /## Study \/ other/);
  assert.doesNotMatch(digest.text, /TRANSFORMATION_PRICE_ID/);

  const studySection = digest.text.split("## Study / other")[1] ?? "";
  assert.match(digest.text.split("## Study / other")[0] ?? "", /Gross Revenue \| \*\*\$1,997\.00\*\*/);
  assert.match(studySection, /Gross Revenue \| \*\*\$5\.53\*\*/);
  assert.match(studySection, /Sales \| \*\*1\*\*/);
  assert.match(studySection, /Refunds \| 1 \(-\$5\.53\)/);
  assert.match(studySection, /Net Revenue \(after refunds\) \| \*\*\$0\.00\*\*/);
});

test("dry run is only DRY_RUN=true or dry_run=1", () => {
  assert.equal(isWeeklyRevenueDryRun({ dryRunEnv: "true" }), true);
  assert.equal(isWeeklyRevenueDryRun({ dryRunQuery: "1" }), true);
  assert.equal(isWeeklyRevenueDryRun({ dryRunEnv: "false", dryRunQuery: "0" }), false);
  assert.equal(isWeeklyRevenueDryRun({ dryRunEnv: "1", dryRunQuery: "true" }), false);
  assert.equal(isWeeklyRevenueDryRun({}), false);
});
