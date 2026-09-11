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

/**
 * Public FAQ for the sales page. Rendered visibly by the page and as FAQPage
 * JSON-LD by the layout, so both stay in sync from a single source.
 */
export const TRANSFORMATION_PROGRAM_FAQ: ReadonlyArray<{ question: string; answer: string }> = [
  {
    question: "When does the next cohort start?",
    answer: `The ${TRANSFORMATION_PROGRAM.cohort.label} begins ${TRANSFORMATION_PROGRAM.cohort.startFull.replace("Starts ", "")}. Sessions run weekly on Thursdays from 6 to 8 PM PT for six weeks, ending ${TRANSFORMATION_PROGRAM.cohort.endFull}.`,
  },
  {
    question: "How many seats are available?",
    answer: `There are ${TRANSFORMATION_PROGRAM.cohort.seatCap} seats for the ${TRANSFORMATION_PROGRAM.cohort.label}. Applications close when seats fill or by ${TRANSFORMATION_PROGRAM.cohort.applicationsCloseLabel}, whichever comes first.`,
  },
  {
    question: "How much does the School BCBA Transformation Program cost?",
    answer: `Tuition is ${TRANSFORMATION_PROGRAM.pricing.payInFull} paid in full, or ${TRANSFORMATION_PROGRAM.pricing.installmentCount} payments of ${TRANSFORMATION_PROGRAM.pricing.installment} (${TRANSFORMATION_PROGRAM.pricing.installmentTotal}). District purchase orders and invoices are accepted.`,
  },
  {
    question: "What is the order of operations to enroll?",
    answer: "Apply first using the application form on this page. After we review your application, we schedule a fit call. Acceptance requires that call; we may decline applicants who are not ready or not a fit. Fit Call booking is for applicants already in review.",
  },
  {
    question: "Who is this program for?",
    answer: "Practicing school BCBAs with a current caseload or systems problem and capacity to attend Thursday evenings from 6 to 8 PM PT. It is not for RBTs, BCaBAs who are not yet certified, general-ed staff, or clinic-only BCBAs without a school role.",
  },
  {
    question: "What participation is expected between sessions?",
    answer: "Bring real work from your school setting to apply between sessions. Later weeks include share-outs on the systems you are rebuilding.",
  },
  {
    question: "What if I miss a live session?",
    answer: "Use the Learning dashboard for the posted session materials and participation requirements. Contact support if you cannot attend so the available completion options can be reviewed.",
  },
  {
    question: "What is the refund window?",
    answer: "You have a five-day refund window after payment. Contact us within five calendar days of payment to request a refund. After that window, cohort seats are considered committed and are not refundable except where required by law.",
  },
  {
    question: "Can my district pay for this?",
    answer: "Yes. This program qualifies as professional development. District purchase orders and invoice payments are accepted. Seats are held after a signed purchase order or written district payment approval is received, and invoices are due on the invoice terms shown. Contact us to request district paperwork.",
  },
  {
    question: "Is a W-9 available?",
    answer: "Yes, available on request. Contact us and we'll send it same day.",
  },
  {
    question: "Do you offer bulk enrollment for districts?",
    answer: "Yes. Contact us via the fit call link after applying, or through the contact form, to discuss district group pricing.",
  },
  {
    question: "How are Learning CEUs documented?",
    answer: "Each session is structured for 1.5 Learning CEUs after verified attendance and active participation. Provider registry status is confirmed before documentation is issued, and documentation is issued within 45 days of verified completion.",
  },
];

export const TRANSFORMATION_PROGRAM_URL = "https://behaviorschool.com/transformation-program";
export const TRANSFORMATION_CHECKOUT_URL = "https://behaviorschool.com/transformation-program/checkout";

export const TRANSFORMATION_PAYMENT_PLAN_LABEL = `${TRANSFORMATION_PROGRAM.pricing.installmentCount} payments of ${TRANSFORMATION_PROGRAM.pricing.installment} (${TRANSFORMATION_PROGRAM.pricing.installmentTotal})`;

export const TRANSFORMATION_PAYMENT_PLAN_DETAIL = `${TRANSFORMATION_PROGRAM.pricing.installmentSchedule.join(" + ")}`;
