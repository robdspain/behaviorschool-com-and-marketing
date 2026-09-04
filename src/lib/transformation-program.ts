/**
 * Transformation Program catalog constants (sales page + checkout).
 *
 * Public October 2026 tuition (confirmed): $1,997 one-time.
 * Payment plan: 3 × $665.67 = $1,997.01 (equal Stripe subscription amounts).
 *
 * Live Stripe Price IDs (active):
 *   - One-time $1,997:     price_1UBltAAHZC9qJnAYfebmUlRa
 *   - 3-month $665.67/mo:  price_1UBltBAHZC9qJnAY3F8ovX5m
 *
 * Older mismatched prices (Standard $2997, Early Bird $2499, older $2497,
 * installment $833) were deactivated and must not be used.
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
    /**
     * Manual remaining-seat count for public display.
     * There is no live enrollment counter wired yet — update this when someone
     * enrolls (or set seatsSold and derive remaining). Do not invent scarcity.
     */
    seatsRemaining: 5,
    applicationsCloseLabel: "Wednesday, October 1, 2026",
    applicationsCloseDate: "2026-10-01",
  },
  pricing: {
    payInFull: "$1,997",
    payInFullCents: 199700,
    stripePayInFullPriceId: "price_1UBltAAHZC9qJnAYfebmUlRa",
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
    stripeInstallmentPriceId: "price_1UBltBAHZC9qJnAY3F8ovX5m",
    stripeInstallmentTotalCents: 199701,
    stripeInstallmentTotal: "$1,997.01",
  },
} as const;

export const TRANSFORMATION_PROGRAM_URL = "https://behaviorschool.com/transformation-program";
export const TRANSFORMATION_CHECKOUT_URL = "https://behaviorschool.com/transformation-program/checkout";

/** Public inventory line, e.g. "5 seats · 5 remaining". Update cohort.seatsRemaining when enrollment changes. */
export const TRANSFORMATION_SEATS_INVENTORY_LABEL = `${TRANSFORMATION_PROGRAM.cohort.seatCap} seats · ${TRANSFORMATION_PROGRAM.cohort.seatsRemaining} remaining`;

export const TRANSFORMATION_PAYMENT_PLAN_LABEL = `${TRANSFORMATION_PROGRAM.pricing.installmentCount} payments of ${TRANSFORMATION_PROGRAM.pricing.installment} (${TRANSFORMATION_PROGRAM.pricing.installmentTotal})`;

export const TRANSFORMATION_PAYMENT_PLAN_DETAIL = `${TRANSFORMATION_PROGRAM.pricing.installmentSchedule.join(" + ")}`;
