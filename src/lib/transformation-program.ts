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
    applicationsCloseLabel: "Thursday, January 7, 2027",
    applicationsCloseShort: "Thursday, Jan 7, 2027",
    applicationsCloseDate: "2027-01-07",
    /** ISO dates for the six live Thursdays. Order matches sessionDates. */
    sessionIsoDates: ["2027-01-14", "2027-01-21", "2027-01-28", "2027-02-11", "2027-02-18", "2027-02-25"],
    /** Thursday skipped for conference week, ISO form of skippedDate. */
    skippedIsoDate: "2027-02-04",
    /** Pacific standard time in January and February 2027. Daylight time starts March 14, 2027. */
    sessionStartTime: "18:00:00",
    sessionEndTime: "20:00:00",
    scheduleTimezone: "America/Los_Angeles",
    timeZoneOffset: "-08:00",
    timeRequired: "P7W",
    courseWorkload: "PT12H",
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

export const TRANSFORMATION_SESSION_TITLES = [
  "Assessment Architecture",
  "Data Collection Systems",
  "Functional Behavior Assessment to Hypothesis",
  "Behavior Intervention Plan Design by Function",
  "Implementation and Staff Training",
  "School-Based Functional Analysis",
] as const;

const MONTHS_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const MONTH_ABBREV_TO_LONG: Record<string, string> = {
  Jan: "January",
  Feb: "February",
  Mar: "March",
  Apr: "April",
  May: "May",
  Jun: "June",
  Jul: "July",
  Aug: "August",
  Sep: "September",
  Sept: "September",
  Oct: "October",
  Nov: "November",
  Dec: "December",
};

/** Keep a month and day on one line, for example "Feb\u00a025, 2027". */
export function keepMonthAndDayTogether(text: string): string {
  return text.replace(
    /\b(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\s+(\d{1,2})\b/g,
    (_match, month: string, day: string) => `${month}\u00a0${day}`,
  );
}

function skippedSessionLongDate(): string {
  const [, month, day] = TRANSFORMATION_PROGRAM.cohort.skippedIsoDate.split("-");
  const monthName = MONTHS_LONG[Number(month) - 1];
  return `${monthName} ${Number(day)}`;
}

/**
 * Compact schedule line: "Jan 14, 21, 28, Feb 11, 18, 25, 2027 (no session Feb 4)".
 * Month and day pairs use a non-breaking space.
 */
export function cohortCompactDateLine(): string {
  const groups = new Map<string, string[]>();
  for (const shortDate of TRANSFORMATION_PROGRAM.cohort.sessionDates) {
    const [abbrev, day] = shortDate.split(" ");
    const days = groups.get(abbrev) ?? [];
    days.push(day);
    groups.set(abbrev, days);
  }
  const year = TRANSFORMATION_PROGRAM.cohort.endDate.slice(0, 4);
  const parts = [...groups.entries()].map(([abbrev, days]) => {
    const [first, ...rest] = days;
    const head = `${abbrev}\u00a0${first}`;
    return rest.length > 0 ? `${head}, ${rest.join(", ")}` : head;
  });
  const skippedShort = TRANSFORMATION_PROGRAM.cohort.skippedDate.replace(/,?\s*\d{4}$/, "");
  return `${parts.join(", ")}, ${year} (no session ${keepMonthAndDayTogether(skippedShort)})`;
}

/** "January 14, 21, and 28, then February 11, 18, and 25, 2027" */
export function cohortSessionDayList(): string {
  const groups = new Map<string, string[]>();
  for (const shortDate of TRANSFORMATION_PROGRAM.cohort.sessionDates) {
    const [abbrev, day] = shortDate.split(" ");
    const month = MONTH_ABBREV_TO_LONG[abbrev] ?? abbrev;
    const days = groups.get(month) ?? [];
    days.push(day);
    groups.set(month, days);
  }
  const year = TRANSFORMATION_PROGRAM.cohort.endDate.slice(0, 4);
  const parts = [...groups.entries()].map(([month, days], index, all) => {
    const joined = days.length <= 1 ? days.join("") : `${days.slice(0, -1).join(", ")}, and ${days[days.length - 1]}`;
    const yearSuffix = index === all.length - 1 ? `, ${year}` : "";
    return `${month} ${joined}${yearSuffix}`;
  });
  if (parts.length === 2) return `${parts[0]}, then ${parts[1]}`;
  return parts.join(", then ");
}

export type TransformationFaqItem = {
  question: string;
  answer: string;
};

/** In-page form for the W-9 FAQ. Visible FAQ and FAQPage JSON-LD both use the answer string. */
export const W9_REQUEST_ANCHOR = "request-w9";

export const TRANSFORMATION_DISTRICT_PAYMENT_FAQ_ANSWER =
  "Yes. This program provides BCBA continuing education units (Learning CEUs from Behavior School, a Behavior Analyst Certification Board Authorized Continuing Education Provider). District purchase orders and invoice payments are accepted. Your place is held after a signed purchase order or written district payment approval is received, and invoices are due on the invoice terms shown. Contact us to request district paperwork.";

export const TRANSFORMATION_W9_FAQ_ANSWER =
  "Yes. Request it here and it arrives in your inbox right away.";

export const W9_PENDING_MESSAGE = "We'll email it to you shortly.";
export const W9_SENT_MESSAGE = "The W-9 is on its way to your inbox.";

/** Visible FAQ copy and FAQPage JSON-LD share this list. */
export function transformationProgramFaqItems(): TransformationFaqItem[] {
  const cohort = TRANSFORMATION_PROGRAM.cohort;
  return [
    {
      question: "When does the next cohort start?",
      answer: `The ${cohort.label} meets live online on six Thursdays from ${cohort.sessionTime}: ${cohortSessionDayList()}. There is no session on ${skippedSessionLongDate()}. Apply by ${cohort.applicationsCloseLabel}.`,
    },
    {
      question: "What is the order of operations to enroll?",
      answer: "Apply first using the application form on this page. After we review your application, we schedule a fit call. Acceptance requires that call; we may decline applicants who are not ready or not a fit. Fit call booking is for applicants already in review.",
    },
    {
      question: "Who is this program for?",
      answer: `Practicing school BCBAs with a current caseload or systems problem and capacity to attend Thursday evenings from ${cohort.sessionTime}. It is not for Registered Behavior Technicians, Board Certified Assistant Behavior Analysts, BCBA candidates who are not yet certified, general education staff, or clinic-only BCBAs without a school role.`,
    },
    {
      question: "What participation is expected between sessions?",
      answer: "Bring real work from your school setting to apply between sessions. Later sessions include share-outs on the systems you are rebuilding.",
    },
    {
      question: "What if I miss a live session?",
      answer: "Use the Learning dashboard for the posted session materials and participation requirements. Contact support if you cannot attend so the available completion options can be reviewed.",
    },
    {
      question: "What is the refund window?",
      answer: "You have a five-day refund window after payment. Contact us within five calendar days of payment to request a refund. After that window, enrollment is considered committed and is not refundable except where required by law.",
    },
    {
      question: "Can my district pay for this?",
      answer: TRANSFORMATION_DISTRICT_PAYMENT_FAQ_ANSWER,
    },
    {
      question: "Is a W-9 available?",
      answer: TRANSFORMATION_W9_FAQ_ANSWER,
    },
    {
      question: "Do you offer bulk enrollment for districts?",
      answer: "Yes. Contact us via the fit call link after applying, or through the contact form, to discuss district group pricing.",
    },
    {
      question: "How are continuing education units documented?",
      answer: "Each session is structured for 1.5 Learning continuing education units after verified attendance and active participation. Provider registry status is confirmed before documentation is issued, and documentation is issued within 45 days of verified completion.",
    },
  ];
}

export function buildTransformationCourseJsonLd(siteUrl: string) {
  const origin = siteUrl.replace(/\/$/, "");
  const pageUrl = `${origin}/transformation-program`;
  const image = `${origin}/optimized/Course/transformation-program-og-1200x630.webp`;
  const cohort = TRANSFORMATION_PROGRAM.cohort;
  const price = String(TRANSFORMATION_PROGRAM.pricing.payInFullCents / 100);
  const offset = cohort.timeZoneOffset;
  const organizationId = `${origin}/#organization`;
  const instanceId = `${pageUrl}#cohort-${cohort.startDate.slice(0, 7)}`;
  const instructor = {
    "@type": "Person",
    name: "Rob Spain",
    jobTitle: "BCBA, International Behavior Analyst",
  };
  const location = {
    "@type": "VirtualLocation",
    url: pageUrl,
  };
  const offer = {
    "@type": "Offer",
    category: "Paid",
    price,
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    validThrough: `${cohort.applicationsCloseDate}T23:59:59${offset}`,
    url: `${pageUrl}#apply`,
  };

  if (cohort.sessionIsoDates.length !== TRANSFORMATION_SESSION_TITLES.length) {
    throw new Error("Transformation session dates and titles are out of sync");
  }

  const sessions = TRANSFORMATION_SESSION_TITLES.map((title, index) => {
    const isoDate = cohort.sessionIsoDates[index];
    const sessionNumber = index + 1;
    return {
      "@type": "Event",
      "@id": `${pageUrl}#session-${sessionNumber}`,
      name: `${TRANSFORMATION_PROGRAM.name}, Session ${sessionNumber}: ${title}`,
      description: `Live online session ${sessionNumber} of ${TRANSFORMATION_SESSION_TITLES.length} for school BCBAs in the ${cohort.label}, ${cohort.sessionTime}. Open to accepted participants.`,
      startDate: `${isoDate}T${cohort.sessionStartTime}${offset}`,
      endDate: `${isoDate}T${cohort.sessionEndTime}${offset}`,
      eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location,
      image,
      organizer: { "@id": organizationId },
      performer: instructor,
      superEvent: { "@id": instanceId },
    };
  });

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Course",
        "@id": `${pageUrl}#course`,
        name: TRANSFORMATION_PROGRAM.name,
        url: pageUrl,
        description: `Live online training for certified school BCBAs in kindergarten through 12th grade schools and districts. Six Thursday sessions from ${cohort.dateRange}, ${cohort.sessionTime}, with no session on ${skippedSessionLongDate()}. Build assessment, functional behavior assessment, behavior intervention plan, data, and staff implementation systems.`,
        image,
        inLanguage: "en-US",
        provider: {
          "@type": "EducationalOrganization",
          "@id": organizationId,
          name: "Behavior School",
          url: origin,
        },
        instructor,
        courseMode: "online",
        timeRequired: cohort.timeRequired,
        coursePrerequisites: "BCBA certification",
        audience: {
          "@type": "EducationalAudience",
          audienceType: "Certified BCBAs working in kindergarten through 12th grade schools or districts",
        },
        teaches: [
          "School assessment decisions",
          "School-adapted functional analysis",
          "Functional behavior assessment informed by acceptance and commitment training",
          "Evidence-to-intervention alignment",
          "Staff training and implementation systems",
        ],
        offers: offer,
        hasCourseInstance: { "@id": instanceId },
      },
      {
        "@type": "CourseInstance",
        "@id": instanceId,
        name: `${TRANSFORMATION_PROGRAM.name}, ${cohort.label}`,
        courseMode: "online",
        eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        startDate: `${cohort.startDate}T${cohort.sessionStartTime}${offset}`,
        endDate: `${cohort.endDate}T${cohort.sessionEndTime}${offset}`,
        location,
        courseSchedule: {
          "@type": "Schedule",
          repeatFrequency: "P1W",
          repeatCount: TRANSFORMATION_SESSION_TITLES.length,
          byDay: "https://schema.org/Thursday",
          startDate: cohort.startDate,
          endDate: cohort.endDate,
          startTime: cohort.sessionStartTime,
          endTime: cohort.sessionEndTime,
          scheduleTimezone: cohort.scheduleTimezone,
          exceptDate: cohort.skippedIsoDate,
        },
        courseWorkload: cohort.courseWorkload,
        instructor,
        organizer: { "@id": organizationId },
        offers: offer,
        subEvent: sessions.map((session) => ({ "@id": session["@id"] })),
      },
      ...sessions,
    ],
  };
}

export function buildTransformationFaqJsonLd(siteUrl: string) {
  const origin = siteUrl.replace(/\/$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${origin}/transformation-program#faq`,
    mainEntity: transformationProgramFaqItems().map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

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
    const displayDate = keepMonthAndDayTogether(shortDate);
    if (!skipInserted && shortDate.startsWith("Feb")) {
      const skippedDisplay = keepMonthAndDayTogether(skippedShort);
      entries.push({
        shortDate: skippedDisplay,
        label: `No session ${skippedDisplay}`,
        curriculumLabel: "",
        skipped: true,
        ariaLabel: `No session on ${keepMonthAndDayTogether(skippedDate)}`,
      });
      skipInserted = true;
    }
    entries.push({
      shortDate: displayDate,
      label: `Session ${sessionNumber}`,
      curriculumLabel: `Session ${sessionNumber}, ${displayDate}`,
      skipped: false,
      ariaLabel: `Session ${sessionNumber} on Thursday, ${displayDate}`,
    });
    sessionNumber += 1;
  }

  return entries;
}
