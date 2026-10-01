import assert from "node:assert/strict";
import test from "node:test";
import { isDeployPreviewHostname, isLocalHostname, shouldInitializePostHog } from "./posthog-env";

test("treats localhost and deploy previews as non-production hosts", () => {
  assert.equal(isLocalHostname("localhost"), true);
  assert.equal(isLocalHostname("127.0.0.1"), true);
  assert.equal(isLocalHostname("[::1]"), true);
  assert.equal(isLocalHostname("behaviorschool.com"), false);
  assert.equal(isDeployPreviewHostname("deploy-preview-114--behavior-school.netlify.app"), true);
  assert.equal(isDeployPreviewHostname("main--behavior-school.netlify.app"), false);
});

test("skips initialization when the public key is missing", () => {
  assert.equal(
    shouldInitializePostHog({
      key: undefined,
      hostname: "behaviorschool.com",
      enableDev: undefined,
    }),
    false,
  );
  assert.equal(
    shouldInitializePostHog({
      key: "   ",
      hostname: "behaviorschool.com",
      enableDev: "true",
    }),
    false,
  );
});

test("loads on production and only on localhost or previews when the dev flag is set", () => {
  assert.equal(
    shouldInitializePostHog({
      key: "phc_public",
      hostname: "behaviorschool.com",
      enableDev: undefined,
    }),
    true,
  );
  assert.equal(
    shouldInitializePostHog({
      key: "phc_public",
      hostname: "localhost",
      enableDev: undefined,
    }),
    false,
  );
  assert.equal(
    shouldInitializePostHog({
      key: "phc_public",
      hostname: "deploy-preview-114--behavior-school.netlify.app",
      enableDev: "false",
    }),
    false,
  );
  assert.equal(
    shouldInitializePostHog({
      key: "phc_public",
      hostname: "localhost",
      enableDev: "true",
    }),
    true,
  );
});
