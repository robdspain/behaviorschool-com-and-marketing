/**
 * Transformation Program catalog constants (sales page + checkout display).
 *
 * ============================================================================
 * TODO (Rob): Confirm the public tuition before merge.
 * Live Stripe prices on Behavior School acct_1QeP6UAHZC9qJnAY (pulled Sep 2026)
 * do NOT match the old marketing figure of $1,997 / 3×$697:
 *
 *   - Standard one-time:     $2,997  price_1TAtWAAHZC9qJnAYRDuP6aoU
 *   - Early Bird one-time:   $2,499  price_1TAtWAAHZC9qJnAY24RKIcyo
 *   - Older one-time nick:   $2,497  price_1RygJFAHZC9qJnAYxwlOPltX
 *                            ("School BCBA Transformation Program")
 *   - Recurring 3-month:     $833/mo = $2,499 total
 *                            price_1TAtWBAHZC9qJnAYp9imDQy8
 *
 * PROVISIONAL marketing pair used below (for a consistent page until Rob picks):
 *   Early Bird one-time $2,499 + installment 3 × $833 (= $2,499).
 * This does NOT modify Stripe. Checkout still creates dynamic `price_data` from
 * these cents — wire Checkout to the chosen Stripe Price IDs after Rob decides.
 * ============================================================================
 */
export const TRANSFORMATION_PROGRAM = {
  name: "School BCBA Transformation Program",
  calendlyUrl: "https://calendly.com/robspain/behavior-school-transformation-system-phone-call",
  cohort: {
    id: "october-2026",
    startDate: "2026-10-08",
    endDate: "2026-11-12",
    label: "October 2026 cohort",
    startBadge: "Starts Oct 8",
    startFull: "Starts Thursday, October 8, 2026",
    endFull: "November 12, 2026",
    dateRange: "October 8 to November 12, 2026",
    sessionDates: ["Oct 8", "Oct 15", "Oct 22", "Oct 29", "Nov 5", "Nov 12"],
    sessionTime: "6:00 to 8:00 PM PT",
    seatCap: 5,
    applicationsCloseLabel: "Wednesday, October 1, 2026",
    applicationsCloseDate: "2026-10-01",
  },
  pricing: {
    /**
     * TODO (Rob): Provisional Early Bird display only.
     * Confirm whether public price is Standard $2,997, Early Bird $2,499,
     * older $2,497, or another figure before merge.
     */
    pricingStatus: "provisional_early_bird" as const,
    payInFullLabel: "Early Bird",
    payInFull: "$2,499",
    payInFullCents: 249900,
    stripePayInFullPriceId: "price_1TAtWAAHZC9qJnAY24RKIcyo",
    /** Matches live Stripe recurring price_1TAtWBAHZC9qJnAYp9imDQy8 */
    installment: "$833",
    installmentCents: 83300,
    installmentCount: 3,
    installmentSchedule: ["$833", "$833", "$833"] as const,
    installmentTotal: "$2,499 total",
    installmentTotalCents: 249900,
    stripeInstallmentPriceId: "price_1TAtWBAHZC9qJnAYp9imDQy8",
    stripeInstallmentTotalCents: 249900,
    stripeInstallmentTotal: "$2,499",
    /** Catalog reference only — not currently shown on the sales page. */
    stripeCatalog: {
      standardOneTime: { amount: "$2,997", priceId: "price_1TAtWAAHZC9qJnAYRDuP6aoU" },
      earlyBirdOneTime: { amount: "$2,499", priceId: "price_1TAtWAAHZC9qJnAY24RKIcyo" },
      olderOneTime: { amount: "$2,497", priceId: "price_1RygJFAHZC9qJnAYxwlOPltX" },
      installment3Month: { amount: "$833/mo", total: "$2,499", priceId: "price_1TAtWBAHZC9qJnAYp9imDQy8" },
    },
  },
} as const;

export const TRANSFORMATION_PROGRAM_URL = "https://behaviorschool.com/transformation-program";
export const TRANSFORMATION_CHECKOUT_URL = "https://behaviorschool.com/transformation-program/checkout";

export const TRANSFORMATION_PAYMENT_PLAN_LABEL = `${TRANSFORMATION_PROGRAM.pricing.installmentCount} payments of ${TRANSFORMATION_PROGRAM.pricing.installment} (${TRANSFORMATION_PROGRAM.pricing.installmentTotal})`;

export const TRANSFORMATION_PAYMENT_PLAN_DETAIL = `${TRANSFORMATION_PROGRAM.pricing.installmentSchedule.join(" + ")}`;
