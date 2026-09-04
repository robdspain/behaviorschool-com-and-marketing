/**
 * Transformation Program catalog constants (sales page + checkout display).
 *
 * Public October 2026 tuition (confirmed by Rob): $1,997 one-time.
 * Payment plan: 3 × $665.67 = $1,997.01 (equal Stripe subscription amounts).
 *
 * Stripe Price IDs for the $1,997 catalog are being created separately.
 * Leave placeholders empty until Rob pastes the new Price IDs in a follow-up.
 * Do not wire checkout to the older $2,499 / $2,997 / $833 Stripe prices.
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
    /** Confirmed public October tuition. */
    payInFull: "$1,997",
    payInFullCents: 199700,
    /** Placeholder — paste new Stripe one-time Price ID when created. */
    stripePayInFullPriceId: "" as string,
    /**
     * Equal 3-payment plan for Stripe subscription checkout.
     * 3 × $665.67 = $1,997.01 (1¢ over sticker; documented).
     */
    installment: "$665.67",
    installmentCents: 66567,
    installmentCount: 3,
    installmentSchedule: ["$665.67", "$665.67", "$665.67"] as const,
    installmentTotal: "$1,997.01 total",
    installmentTotalCents: 199701,
    /** Placeholder — paste new Stripe recurring Price ID when created. */
    stripeInstallmentPriceId: "" as string,
    stripeInstallmentTotalCents: 199701,
    stripeInstallmentTotal: "$1,997.01",
  },
} as const;

export const TRANSFORMATION_PROGRAM_URL = "https://behaviorschool.com/transformation-program";
export const TRANSFORMATION_CHECKOUT_URL = "https://behaviorschool.com/transformation-program/checkout";

export const TRANSFORMATION_PAYMENT_PLAN_LABEL = `${TRANSFORMATION_PROGRAM.pricing.installmentCount} payments of ${TRANSFORMATION_PROGRAM.pricing.installment} (${TRANSFORMATION_PROGRAM.pricing.installmentTotal})`;

export const TRANSFORMATION_PAYMENT_PLAN_DETAIL = `${TRANSFORMATION_PROGRAM.pricing.installmentSchedule.join(" + ")}`;
