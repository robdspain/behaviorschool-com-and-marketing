import type { CaptureResult } from "posthog-js";

const BLOCKED_PATH_PREFIXES = ["/admin", "/api"];
const URL_PROPERTY_KEYS = ["$current_url", "$referrer", "$initial_current_url", "url"];
const SENSITIVE_QUERY_KEY = /email|e-mail|token|secret|password|passwd|otp|code|auth|session|jwt|key/i;
const SENSITIVE_PROPERTY_KEY = /^(email|\$email|name|\$name|password|token|secret)$/i;
const DROPPED_EVENTS = new Set([
  "$snapshot",
  "$exception",
  "$$heatmap",
  "$heatmaps_data",
]);

export function isAnalyticsPathBlocked(pathname: string): boolean {
  return BLOCKED_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function redactSensitiveUrl(url: string): string {
  try {
    const parsed = new URL(url, "https://behaviorschool.com");
    for (const key of [...parsed.searchParams.keys()]) {
      if (SENSITIVE_QUERY_KEY.test(key)) {
        parsed.searchParams.set(key, "[redacted]");
      }
    }
    if (parsed.hash && SENSITIVE_QUERY_KEY.test(parsed.hash)) {
      parsed.hash = "";
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

function stringProperty(properties: CaptureResult["properties"], key: string): string | null {
  const value = properties[key];
  return typeof value === "string" ? value : null;
}

function pathnameFromUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url, "https://behaviorschool.com").pathname;
  } catch {
    return null;
  }
}

/**
 * Drops admin, API, replay, and exception events, and strips credential-like
 * query values before anything is sent to PostHog.
 */
export function preparePostHogEvent(event: CaptureResult | null): CaptureResult | null {
  if (!event || DROPPED_EVENTS.has(event.event)) return null;

  const properties = { ...event.properties };
  const pathname =
    stringProperty(properties, "$pathname") ?? pathnameFromUrl(stringProperty(properties, "$current_url"));

  if (pathname && isAnalyticsPathBlocked(pathname)) return null;

  for (const key of URL_PROPERTY_KEYS) {
    const value = properties[key];
    if (typeof value === "string") {
      properties[key] = redactSensitiveUrl(value);
    }
  }

  for (const key of Object.keys(properties)) {
    if (SENSITIVE_PROPERTY_KEY.test(key)) {
      delete properties[key];
    }
  }

  return { ...event, properties };
}
