import assert from "node:assert/strict";
import test from "node:test";
import type { CaptureResult } from "posthog-js";
import { isAnalyticsPathBlocked, preparePostHogEvent, redactSensitiveUrl } from "./posthog-privacy";

const event = (overrides: Partial<CaptureResult> = {}): CaptureResult => ({
  uuid: "00000000-0000-4000-8000-000000000000",
  event: "$pageview",
  properties: {
    $pathname: "/blog",
    $current_url: "https://behaviorschool.com/blog",
  },
  ...overrides,
});

test("blocks admin and API paths and allows public pages", () => {
  assert.equal(isAnalyticsPathBlocked("/admin"), true);
  assert.equal(isAnalyticsPathBlocked("/admin/analytics"), true);
  assert.equal(isAnalyticsPathBlocked("/api/checkout"), true);
  assert.equal(isAnalyticsPathBlocked("/blog"), false);
  assert.equal(isAnalyticsPathBlocked("/administrator"), false);
});

test("redacts credential-like query parameters and hash fragments", () => {
  assert.equal(
    redactSensitiveUrl("https://behaviorschool.com/signup?email=ada@example.com&plan=school&token=abc"),
    "https://behaviorschool.com/signup?email=%5Bredacted%5D&plan=school&token=%5Bredacted%5D",
  );
  assert.equal(
    redactSensitiveUrl("https://behaviorschool.com/reset#token=secret"),
    "https://behaviorschool.com/reset",
  );
});

test("drops admin, replay, and exception events", () => {
  assert.equal(preparePostHogEvent(event({ properties: { $pathname: "/admin/users" } })), null);
  assert.equal(preparePostHogEvent(event({ event: "$snapshot" })), null);
  assert.equal(preparePostHogEvent(event({ event: "$exception" })), null);
  assert.equal(preparePostHogEvent(null), null);
});

test("keeps public pageviews and strips email properties and query values", () => {
  const prepared = preparePostHogEvent(
    event({
      properties: {
        $pathname: "/signup",
        $current_url: "https://behaviorschool.com/signup?email=ada@example.com&source=blog",
        email: "ada@example.com",
        source: "blog",
      },
    }),
  );

  assert.ok(prepared);
  assert.equal(prepared?.properties.email, undefined);
  assert.equal(prepared?.properties.source, "blog");
  assert.equal(
    prepared?.properties.$current_url,
    "https://behaviorschool.com/signup?email=%5Bredacted%5D&source=blog",
  );
});
