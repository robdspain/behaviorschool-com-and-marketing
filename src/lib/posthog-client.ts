import posthog from "posthog-js";
import { POSTHOG_API_HOST, shouldInitializePostHog } from "@/lib/posthog-env";
import { isAnalyticsPathBlocked, preparePostHogEvent } from "@/lib/posthog-privacy";

export function initPostHog(): void {
  if (typeof window === "undefined" || posthog.__loaded) return;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim() ?? "";
  if (
    !shouldInitializePostHog({
      key,
      hostname: window.location.hostname,
      enableDev: process.env.NEXT_PUBLIC_POSTHOG_ENABLE_DEV,
    })
  ) {
    return;
  }
  if (isAnalyticsPathBlocked(window.location.pathname)) return;

  posthog.init(key, {
    api_host: POSTHOG_API_HOST,
    defaults: "2026-05-30",
    capture_pageview: "history_change",
    autocapture: true,
    person_profiles: "identified_only",
    disable_session_recording: true,
    session_recording: {
      maskAllInputs: true,
    },
    disable_surveys: true,
    capture_exceptions: false,
    capture_heatmaps: false,
    respect_dnt: true,
    mask_all_text: true,
    mask_all_element_attributes: true,
    property_denylist: ["email", "$email", "name", "$name", "password", "token", "secret"],
    before_send: preparePostHogEvent,
  });
}
