import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";
import { POST } from "./route";

function request(body: unknown) {
  return new NextRequest("http://localhost/api/transformation-program/apply", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validApplication = {
  fullName: "Ada Lovelace",
  email: "Ada@Example.com",
  employer: "Springfield USD",
  roleCategory: "school_bcba",
  currentRole: "Lead district BCBA",
  payer: "self",
  urgencyWindow: "this_quarter",
  thursdayCapacity: "yes_all_sessions",
  systemToRebuild: "Referral triage",
  whyJoin: "The referral queue has no owner.",
  bcbaCertNumber: "1-23-45678",
  marketingConsent: false,
};

test("required cash fields block submit", async () => {
  const res = await POST(request({
    ...validApplication,
    employer: " ",
    roleCategory: "",
    payer: "",
    urgencyWindow: "",
  }));
  assert.equal(res.status, 400);
});

test("unknown payment and role values are rejected", async () => {
  const badPayment = await POST(request({ ...validApplication, payer: "scholarship" }));
  assert.equal(badPayment.status, 400);

  const badRole = await POST(request({ ...validApplication, roleCategory: "teacher" }));
  assert.equal(badRole.status, 400);
});

test("maps legacy payer and stores canonical cash fields without student details in analytics", async () => {
  const calls: Array<{ path: string; args: Record<string, unknown> }> = [];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async (_url: string | URL, init?: RequestInit) => {
    const body = JSON.parse(String(init?.body ?? "{}")) as {
      path: string;
      args: Record<string, unknown>;
    };
    calls.push(body);
    const value = body.path === "crm:recordTransformationApplication"
      ? { contactId: "contacts_test" }
      : { id: "event_test" };
    return new Response(JSON.stringify({ status: "success", value }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }) as typeof fetch;

  try {
    const res = await POST(request(validApplication));
    assert.equal(res.status, 200);
  } finally {
    globalThis.fetch = originalFetch;
  }

  const crm = calls.find((call) => call.path === "crm:recordTransformationApplication");
  assert.ok(crm);
  assert.equal(crm.args.employer, "Springfield USD");
  assert.equal(crm.args.roleCategory, "school_bcba");
  assert.equal(crm.args.role, "Lead district BCBA");
  assert.equal(crm.args.paymentPath, "self_pay");
  assert.equal(crm.args.urgencyWindow, "this_quarter");
  assert.equal(crm.args.email, "ada@example.com");

  const submission = calls.find((call) => call.path === "submissions:createSignupSubmission");
  assert.ok(submission);
  assert.equal(submission.args.employer, "Springfield USD");
  assert.equal(submission.args.paymentPath, "self_pay");
  assert.equal(submission.args.organization, "Springfield USD");

  const applyEvent = calls.find((call) => (
    call.path === "analytics:createConversionEvent" &&
    call.args.eventName === "transformation_apply_submitted"
  ));
  assert.ok(applyEvent);
  const data = applyEvent.args.additionalData as Record<string, unknown>;
  assert.deepEqual(data, {
    employer: "Springfield USD",
    role: "school_bcba",
    payment_path: "self_pay",
    urgency_window: "this_quarter",
  });
  assert.equal("email" in data, false);
  assert.equal("whyJoin" in data, false);
  assert.equal("bcbaCertNumber" in data, false);

  const keptEvent = calls.find((call) => call.args.eventName === "transformation_application_submitted");
  assert.ok(keptEvent);
});
