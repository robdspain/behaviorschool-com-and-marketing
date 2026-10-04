/**
 * Free School FA starter kit delivered at /fba.
 *
 * The PDF is Rob Spain's "School FA Starter Kit" (task analyses, datasheets,
 * and blank graph pages). The graphing template is the current Google Sheet,
 * "School FA Graphing Template - Robert Spain (v2)".
 *
 * SCHOOL_FA_KIT_STEP_ZERO_SUBJECT must match the subject chosen in
 * convex/transformationNurture.ts for this source.
 */

export const SCHOOL_FA_KIT_SOURCE = "school-fa-starter-kit";

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
    title: "Analog / formal FA",
    detail: "Specialist-led conditions, with rate or interval data and a multielement graph.",
  },
  {
    title: "Synthesized FA (PFA / IISCA)",
    detail: "An interview-built control and test, ended at the first precursor or target.",
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
    detail: "The analysis stops at a safe earlier response instead of the severe behavior.",
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
