/**
 * School BCBA Systems Transformation Program catalog constants (sales page + checkout).
 *
 * Public January 2027 tuition (confirmed): $1,997 one-time.
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
  name: "School BCBA Systems Transformation Program",
  calendlyUrl: "https://calendly.com/robspain/behavior-school-transformation-system-phone-call",
  cohort: {
    id: "january-2027",
    startDate: "2027-01-14",
    endDate: "2027-02-25",
    label: "January 2027 cohort",
    startBadge: "Starts Jan 14",
    startFull: "Starts Thursday, January 14, 2027",
    beginsOn: "Thursday, January 14, 2027",
    endFull: "February 25, 2027",
    dateRange: "January 14 to February 25, 2027",
    sessionDates: ["Jan 14", "Jan 21", "Jan 28", "Feb 11", "Feb 18", "Feb 25"],
    /** Thursday skipped for conference week. Display rows insert this between Jan 28 and Feb 11. */
    skippedDate: "Feb 4, 2027",
    sessionTime: "6 to 8 PM Pacific Time",
    scheduleLabel: "six live Thursday sessions over seven weeks (no session February 4)",
    summaryHeadline: "Six Thursdays, Jan 14 to Feb 25, 2027",
    summaryDetail: "6 to 8 PM Pacific Time, live online",
    seatCap: 5,
    applicationsCloseLabel: "Thursday, January 7, 2027",
    applicationsCloseShort: "Thursday, Jan 7, 2027",
    applicationsCloseDate: "2027-01-07",
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

export const TRANSFORMATION_PAYMENT_PLAN_LABEL = `${TRANSFORMATION_PROGRAM.pricing.installmentCount} payments of ${TRANSFORMATION_PROGRAM.pricing.installment} (${TRANSFORMATION_PROGRAM.pricing.installmentTotal})`;

export const TRANSFORMATION_PAYMENT_PLAN_DETAIL = `${TRANSFORMATION_PROGRAM.pricing.installmentSchedule.join(" + ")}`;

/** Public payment line. Does not repeat each installment amount. */
export const TRANSFORMATION_PAYMENT_PLAN_SENTENCE = `Or ${TRANSFORMATION_PROGRAM.pricing.installmentCount} monthly payments of ${TRANSFORMATION_PROGRAM.pricing.installment} (${TRANSFORMATION_PROGRAM.pricing.stripeInstallmentTotal} total).`;

export type CohortScheduleEntry = {
  shortDate: string;
  /** "Session 1" or "No session Feb 4" */
  label: string;
  /** "Session 1, Jan 14" for curriculum cards. Empty on the skipped row. */
  curriculumLabel: string;
  skipped: boolean;
  ariaLabel: string;
};

/** Six sessions plus the skipped Thursday, in calendar order. */
export function cohortScheduleEntries(): CohortScheduleEntry[] {
  const { sessionDates, skippedDate } = TRANSFORMATION_PROGRAM.cohort;
  const skippedShort = skippedDate.replace(/,?\s*\d{4}$/, "");
  const entries: CohortScheduleEntry[] = [];
  let sessionNumber = 1;
  let skipInserted = false;

  for (const shortDate of sessionDates) {
    if (!skipInserted && shortDate.startsWith("Feb")) {
      entries.push({
        shortDate: skippedShort,
        label: `No session ${skippedShort}`,
        curriculumLabel: "",
        skipped: true,
        ariaLabel: `No session on ${skippedDate}`,
      });
      skipInserted = true;
    }
    entries.push({
      shortDate,
      label: `Session ${sessionNumber}`,
      curriculumLabel: `Session ${sessionNumber}, ${shortDate}`,
      skipped: false,
      ariaLabel: `Session ${sessionNumber} on Thursday, ${shortDate}`,
    });
    sessionNumber += 1;
  }

  return entries;
}
