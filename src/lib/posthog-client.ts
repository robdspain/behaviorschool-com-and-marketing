import posthog from "posthog-js";
import { isAnalyticsPathBlocked, preparePostHogEvent } from "@/lib/posthog-privacy";

export function initPostHog(): void {
  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  if (!token || posthog.__loaded) return;
  if (typeof window !== "undefined" && isAnalyticsPathBlocked(window.location.pathname)) return;

  posthog.init(token, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    defaults: "2026-05-30",
    person_profiles: "identified_only",
    // School tools can contain student information. Record pages and clicks only.
    disable_session_recording: true,
    disable_surveys: true,
    capture_exceptions: false,
    capture_heatmaps: false,
    respect_dnt: true,
    mask_all_text: true,
    mask_all_element_attributes: true,
    autocapture: {
      dom_event_allowlist: ["click"],
      element_allowlist: ["a", "button"],
      css_selector_ignorelist: [".ph-no-autocapture", "[data-ph-no-autocapture]"],
    },
    property_denylist: ["email", "$email", "name", "$name", "password", "token", "secret"],
    before_send: preparePostHogEvent,
  });
}
