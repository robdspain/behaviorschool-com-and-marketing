/**
 * Free School FA starter kit delivered at /FA.
 *
 * The corrected, expanded PDF is 29 pages, titled "School FA Starter Kit"
 * (Robert Spain, BCBA, IBA). It includes five task analyses, printable
 * datasheets, graph pages, and assessment workflows. The graphing template is the
 * current Google Sheet, "School FA Graphing Template - Robert Spain (v2)".
 *
 * SCHOOL_FA_KIT_STEP_ZERO_SUBJECT must match the subject chosen in
 * convex/transformationNurture.ts for this source.
 */

export const SCHOOL_FA_KIT_SOURCE = "school-fa-starter-kit";

export const SCHOOL_FA_KIT_PAGE_PATH = "/FA";

export const SCHOOL_FA_KIT_STEP_ZERO_SUBJECT = "Your School FA starter kit is ready";

export const SCHOOL_FA_KIT_PDF_PATH = "/lead-magnets/school-fa-starter-kit.pdf";

export const SCHOOL_FA_KIT_PDF_FILENAME = "school-fa-starter-kit.pdf";

export const SCHOOL_FA_KIT_PDF_URL =
  "https://behaviorschool.com/lead-magnets/school-fa-starter-kit.pdf";

/** Anyone-with-the-link reader access. /copy asks the visitor to make their own copy. */
export const SCHOOL_FA_GRAPHING_TEMPLATE_COPY_URL =
  "https://docs.google.com/spreadsheets/d/1zcAQRlsqUSJxuYEQWXlYciby4kIzQsrnZURgUFn3GPs/copy";

export const SCHOOL_FA_KIT_FORMATS = [
  {
    title: "Extended FA (session-based)",
    detail: "Specialist-led conditions, with rate or interval data and a multielement graph.",
  },
  {
    title: "Synthesized FA (PFA / IISCA)",
    detail: "Interview-informed test and control conditions. Original and performance-based procedures differ.",
  },
  {
    title: "Trial-based FA",
    detail: "Short control and test segments inside a classroom routine.",
  },
  {
    title: "Latency-based FA",
    detail: "Time to the first response. The session ends when that response occurs.",
  },
  {
    title: "Precursor FA",
    detail: "Analysis of an empirically supported earlier response that may reduce exposure to severe behavior.",
  },
] as const;

export function isSchoolFaStarterKitSource(source: string) {
  return source.toLowerCase().includes(SCHOOL_FA_KIT_SOURCE);
}

export function schoolFaKitNurtureSubject(step: number, source: string, defaultSubject: string) {
  if (step === 0 && isSchoolFaStarterKitSource(source)) {
    return SCHOOL_FA_KIT_STEP_ZERO_SUBJECT;
  }
  return defaultSubject;
}

/** True when env has a non-blank Resend key. Does not read or log the key value. */
export function hasResendKey(env: { RESEND_API_KEY?: string | null }) {
  const key = env.RESEND_API_KEY;
  return typeof key === "string" && key.trim().length > 0;
}
