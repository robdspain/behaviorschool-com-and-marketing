export const ANALYTICS_CONSENT_STORAGE_KEY = "analytics-consent";

export type AnalyticsConsent = "granted" | "denied" | "unknown";

export function readAnalyticsConsent(): AnalyticsConsent {
  if (typeof window === "undefined") return "unknown";

  try {
    const stored = window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY);
    if (stored === "true") return "granted";
    if (stored === "false") return "denied";
    return "unknown";
  } catch {
    return "unknown";
  }
}

export function writeAnalyticsConsent(granted: boolean): void {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, granted ? "true" : "false");
}
