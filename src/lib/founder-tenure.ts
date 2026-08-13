const EDUCATION_START_UTC = Date.UTC(2000, 10, 1);
const AVERAGE_DAYS_PER_YEAR = 365.2425;

export const FOUNDER_EDUCATION_START_LABEL = 'November 2000';

/** Returns completed time in education rounded to the nearest year. */
export function getFounderEducationYears(asOf = new Date()): number {
  const asOfUtc = Date.UTC(asOf.getUTCFullYear(), asOf.getUTCMonth(), asOf.getUTCDate());
  const elapsedYears = (asOfUtc - EDUCATION_START_UTC) / (AVERAGE_DAYS_PER_YEAR * 24 * 60 * 60 * 1000);
  return Math.max(0, Math.round(elapsedYears));
}
