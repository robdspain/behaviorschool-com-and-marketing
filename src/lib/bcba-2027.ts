export const BACB_2027_EFFECTIVE = "2027-01-01T00:00:00-07:00";

export function isPostBcba2027(now = new Date()): boolean {
  return now.getTime() >= Date.parse(BACB_2027_EFFECTIVE);
}

export function buildDate(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export function buildYear(now = new Date()): number {
  return now.getUTCFullYear();
}
