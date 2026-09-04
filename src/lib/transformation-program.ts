/**
 * Transformation Program catalog constants (sales page + checkout source of truth).
 *
 * Payment plan math (October 2026):
 * - Sticker / pay-in-full: $1,997 (199700 cents).
 * - Displayed plan: three payments totaling exactly $1,997
 *   ($665.67 + $665.67 + $665.66).
 * - Stripe Checkout `mode: "subscription"` requires equal recurring amounts, so
 *   checkout charges 3 × $665.67 = $1,997.01 (1¢ over sticker). CRM deal /
 *   contract value for the plan uses the sticker total ($1,997); Stripe webhook
 *   amounts reflect actual charged cents.
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
    payInFull: "$1,997",
    payInFullCents: 199700,
    /** Equal Stripe subscription installment (see file header for 1¢ note). */
    installment: "$665.67",
    installmentCents: 66567,
    installmentCount: 3,
    /** Marketing / sales display: payments that sum exactly to sticker. */
    installmentSchedule: ["$665.67", "$665.67", "$665.66"] as const,
    installmentTotal: "$1,997 total",
    installmentTotalCents: 199700,
    /** Actual Stripe equal-subscription total (3 × installmentCents). */
    stripeInstallmentTotalCents: 199701,
    stripeInstallmentTotal: "$1,997.01",
  },
} as const;

export const TRANSFORMATION_PROGRAM_URL = "https://behaviorschool.com/transformation-program";
export const TRANSFORMATION_CHECKOUT_URL = "https://behaviorschool.com/transformation-program/checkout";

export const TRANSFORMATION_PAYMENT_PLAN_LABEL = `${TRANSFORMATION_PROGRAM.pricing.installmentCount} payments totaling ${TRANSFORMATION_PROGRAM.pricing.payInFull}`;

export const TRANSFORMATION_PAYMENT_PLAN_DETAIL = `${TRANSFORMATION_PROGRAM.pricing.installmentSchedule.join(" + ")}`;
