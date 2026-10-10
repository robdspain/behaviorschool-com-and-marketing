import assert from "node:assert/strict";
import test from "node:test";
import {
  hasResendKey,
  isSchoolFaStarterKitSource,
  SCHOOL_FA_GRAPHING_TEMPLATE_COPY_URL,
  SCHOOL_FA_KIT_PDF_URL,
  SCHOOL_FA_KIT_PAGE_PATH,
  SCHOOL_FA_KIT_STEP_ZERO_SUBJECT,
  schoolFaKitNurtureSubject,
} from "./school-fa-kit";
import { renderTransformationNurtureEmail, transformationUnsubscribeUrl, nurtureComplianceHeaders, NURTURE_FROM, processTransformationNurture } from "./transformation-nurture";

import { MAILING_ADDRESS } from "./email-compliance";

import {
  start,
  prepareEmailForSend,
  unsubscribeByToken,
  unsubscribeEnrollmentById,
  markEmailSent,
} from "../../convex/transformationNurture";
import { GET, POST } from "../app/api/transformation-program/unsubscribe/route";
import { NextRequest } from "next/server";


const unsubscribeUrl = transformationUnsubscribeUrl("TESTTOKEN");
const districtPacketSubject = "Here is the district packet you asked for";

test("school FA kit source uses its own first-email subject", () => {
  assert.equal(isSchoolFaStarterKitSource("school-fa-starter-kit"), true);
  assert.equal(isSchoolFaStarterKitSource("website"), false);
  assert.equal(
    schoolFaKitNurtureSubject(0, "school-fa-starter-kit", districtPacketSubject),
    SCHOOL_FA_KIT_STEP_ZERO_SUBJECT,
  );
  assert.equal(
    schoolFaKitNurtureSubject(1, "school-fa-starter-kit", "The part of school BCBA work nobody owns"),
    "The part of school BCBA work nobody owns",
  );
  assert.equal(
    schoolFaKitNurtureSubject(0, "transformation-program", districtPacketSubject),
    districtPacketSubject,
  );
});

test("hasResendKey is false when the key is missing or blank", () => {
  assert.equal(hasResendKey({}), false);
  assert.equal(hasResendKey({ RESEND_API_KEY: undefined }), false);
  assert.equal(hasResendKey({ RESEND_API_KEY: "" }), false);
  assert.equal(hasResendKey({ RESEND_API_KEY: "   " }), false);
  assert.equal(hasResendKey({ RESEND_API_KEY: "re_test_key" }), true);
});

test("school FA kit email delivers the kit and does not claim a district packet request", () => {
  const rendered = renderTransformationNurtureEmail({
    _id: "email-1",
    email: "ada@school.edu",
    firstName: "Ada",
    step: 0,
    subject: districtPacketSubject,
    metadata: { source: "school-fa-starter-kit" },
  }, unsubscribeUrl);

  assert.equal(rendered.subject, SCHOOL_FA_KIT_STEP_ZERO_SUBJECT);
  assert.match(rendered.text, /Hi Ada/);
  assert.match(
    rendered.text,
    /School FA starter kit from the October 9 CalABA - Behavior Analysts in Education SIG \(BAE\) presentation is ready/,
  );
  assert.match(rendered.text, new RegExp(SCHOOL_FA_KIT_PDF_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(rendered.text, /docs.google.com\/spreadsheets/);
  assert.match(rendered.text, new RegExp(SCHOOL_FA_GRAPHING_TEMPLATE_COPY_URL.split("/d/")[1].split("/")[0]));
  assert.doesNotMatch(rendered.text, /district packet you asked for/i);
  assert.match(rendered.text, /Transformation Program/);
  assert.match(rendered.html, /behaviorschool.com\/FA/);
  assert.doesNotMatch(rendered.html, /behaviorschool.com\/fba(?:[.\s<"]|$)/);
});

test("school FA kit uses the approved uppercase /FA path", () => {
  assert.equal(SCHOOL_FA_KIT_PAGE_PATH, "/FA");
});

test("other Transformation inquiries still get the district packet email", () => {
  const rendered = renderTransformationNurtureEmail({
    _id: "email-2",
    email: "ada@school.edu",
    firstName: "Ada",
    step: 0,
    subject: districtPacketSubject,
    metadata: { source: "transformation-program" },
  }, unsubscribeUrl);

  assert.equal(rendered.subject, districtPacketSubject);
  assert.match(rendered.text, /I put the district packet here/);
  assert.doesNotMatch(rendered.text, /School FA starter kit is ready/);
});

test("school FA kit step 1 keeps the queued subject", () => {
  const stepSubject = "The part of school BCBA work nobody owns";
  const rendered = renderTransformationNurtureEmail({
    _id: "email-4",
    email: "ada@school.edu",
    firstName: "Ada",
    step: 1,
    subject: stepSubject,
    metadata: { source: "school-fa-starter-kit" },
  }, unsubscribeUrl);

  assert.equal(rendered.subject, stepSubject);
});

test("school FA kit approval email does not assume the packet was already downloaded", () => {
  const rendered = renderTransformationNurtureEmail({
    _id: "email-3",
    email: "ada@school.edu",
    firstName: "Ada",
    step: 3,
    subject: "Need help getting district approval?",
    metadata: { source: "school-fa-starter-kit" },
  }, unsubscribeUrl);

  assert.doesNotMatch(rendered.text, /sitting in your downloads folder/);
  assert.match(rendered.text, /approval packet is here/);
});

const originalStepOneBody = `Hi Sam,

One thing I have learned in school systems: the BCBA often becomes the person who catches everything nobody else owns.

The referral comes in with thin data. The FBA clock is already running. The plan has to make sense to staff who were not part of the assessment. Then the BCBA is expected to keep the whole thing moving.

That is the work we address in the School BCBA Systems Transformation Program. We build a repeatable process from referral to assessment, from hypothesis to BIP, and from the written plan to what staff actually do.`;
const oldFinalParagraph = "If this is the part of your job that keeps spilling into nights and weekends, book a call and tell me what is happening in your setting.";
const calendlyUrl = "https://calendly.com/robspain/behavior-school-transformation-system-phone-call";
const question = "One question from the end of Friday's talk: how do you see yourself using functional analysis in your day to day? Hit reply and tell me. I read every one.";
const postscript = "P.S. If you liked the research in Friday's talk, I write a free Weekly Research Brief for school BCBAs. You can join here: https://robspain.com/newsletter/";

function renderStepOne(source?: string) {
  return renderTransformationNurtureEmail({
    _id: "step-one-test",
    email: "sam@example.com",
    firstName: "Sam",
    step: 1,
    subject: "The part of school BCBA work nobody owns",
    metadata: source ? { source } : undefined,
  }, unsubscribeUrl);
}

test("kit step 1 has the approved question and linked postscript in order", () => {
  const rendered = renderStepOne("school-fa-starter-kit");
  assert.ok(rendered.text.startsWith(`${originalStepOneBody}\n\n${question}\n\n${calendlyUrl}\n\n${postscript}\n\nRob Spain, BCBA, IBA\nBehavior School\n\n`));
  assert.ok(!rendered.text.includes(oldFinalParagraph));
  assert.ok(!rendered.html.includes(oldFinalParagraph));
  assert.ok(rendered.html.includes(question));
  assert.ok(rendered.html.includes('<a href="https://robspain.com/newsletter/">https://robspain.com/newsletter/</a>'));
  assert.ok(rendered.html.indexOf("Talk through the fit") < rendered.html.indexOf("P.S."));
  assert.ok(rendered.html.indexOf("P.S.") < rendered.html.indexOf("Rob Spain, BCBA, IBA"));
  assert.match(rendered.text, /You are receiving this because you requested the free School FA starter kit/);
  assert.doesNotMatch(rendered.text, /[—·]/);
  assert.doesNotMatch(rendered.html, /[—·]/);
});

test("non-kit step 1 body remains unchanged before the compliance footer", () => {
  for (const source of ["transformation-program", "website", undefined]) {
    const rendered = renderStepOne(source);
    assert.equal(rendered.text.split("\n\nYou are receiving")[0], `${originalStepOneBody}\n\n${oldFinalParagraph}\n\n${calendlyUrl}`);
    assert.ok(rendered.html.includes(oldFinalParagraph));
    assert.doesNotMatch(rendered.text, /P\.S\./);
    assert.doesNotMatch(rendered.html, /P\.S\./);
  }
});

for (const source of ["school-fa-starter-kit", "transformation-program", "website", undefined]) {
  for (let step = 0; step <= 4; step++) {
    test(`compliance footer: ${source ?? "unspecified"} step ${step}`, () => {
      const rendered = renderTransformationNurtureEmail({
        _id: "footer-test", email: "ada@school.edu", firstName: "Ada", step,
        subject: "Existing subject", metadata: source ? { source } : undefined,
      }, unsubscribeUrl);
      for (const output of [rendered.text, rendered.html]) {
        assert.ok(output.includes("Unsubscribe"));
        assert.ok(output.includes(unsubscribeUrl));
        assert.ok(output.includes("Reply to this email if you want me to stop following up."));
        assert.equal(output.split("You are receiving this because").length - 1, 1);
        for (const line of MAILING_ADDRESS.split("\n")) assert.ok(output.includes(line));
        assert.doesNotMatch(output, /[—·]/);
      }
      assert.ok(rendered.text.endsWith(MAILING_ADDRESS));
      assert.ok(rendered.html.includes(`<a href="${unsubscribeUrl}">Unsubscribe</a>`));
      assert.doesNotMatch(unsubscribeUrl, /@/);
    });
  }
}

test("nurture sender and one-click headers", () => {
  assert.equal(NURTURE_FROM, "Rob Spain, Behavior School <rob@updates.behaviorschool.com>");
  assert.equal(unsubscribeUrl, "https://behaviorschool.com/api/transformation-program/unsubscribe?token=TESTTOKEN");
  assert.deepEqual(nurtureComplianceHeaders(unsubscribeUrl), {
    "List-Unsubscribe": `<${unsubscribeUrl}>, <mailto:rob@behaviorschool.com?subject=unsubscribe>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  });
  assert.throws(() => transformationUnsubscribeUrl("ada@school.edu"));
});

test("processor rechecks every row and includes compliance headers in the Resend payload", async () => {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.RESEND_API_KEY;
  const calls: string[] = [];
  const token = "a".repeat(64);
  process.env.RESEND_API_KEY = "re_test_no_network";
  globalThis.fetch = async (input, init) => {
    const body = JSON.parse(String(init?.body));
    if (String(input) === "https://api.resend.com/emails") {
      calls.push("resend");
      assert.equal(body.from, NURTURE_FROM);
      assert.equal(body.reply_to, "rob@behaviorschool.com");
      assert.deepEqual(body.headers, nurtureComplianceHeaders(transformationUnsubscribeUrl(token)));
      assert.ok(body.text.includes(transformationUnsubscribeUrl(token)));
      assert.ok(body.html.includes(transformationUnsubscribeUrl(token)));
      return Response.json({ id: "mock-message" });
    }
    calls.push(body.path);
    let value: unknown = null;
    if (body.path === "transformationNurture:listDueEmails") {
      value = ["suppressed", "eligible"].map((_id) => ({
        _id, email: "ada@school.edu", step: 0, subject: districtPacketSubject,
      }));
    } else if (body.path === "transformationNurture:prepareEmailForSend") {
      value = { unsubscribeToken: body.args.id === "eligible" ? token : null };
    } else {
      assert.equal(body.path, "transformationNurture:markEmailSent");
    }
    return Response.json({ status: "success", value });
  };
  try {
    assert.deepEqual(await processTransformationNurture(), { checked: 2, skipped: 1, sent: 1, failed: 0 });
    assert.deepEqual(calls, [
      "transformationNurture:listDueEmails",
      "transformationNurture:prepareEmailForSend",
      "transformationNurture:prepareEmailForSend",
      "resend",
      "transformationNurture:markEmailSent",
    ]);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = originalKey;
  }
});

// Exercise registered handlers with an in-memory database only. No deployment calls.

type TestRow = Record<string, any>;
function nurtureDatabase() {
  const rows: Record<string, TestRow[]> = {
    transformationNurtureEnrollments: [{
      _id: "enrollment", contactId: "contact", status: "active", source: "website",
      unsubscribeToken: "a".repeat(64), createdAt: "2026-01-01", emailLower: "ada@school.edu",
    }],
    crmContacts: [{ _id: "contact", status: "lead", tags: [], emailLower: "ada@school.edu" }],
    transformationNurtureEmails: Array.from({ length: 5 }, (_, step) => ({
      _id: `email-${step}`, enrollmentId: "enrollment", contactId: "contact",
      status: "queued", step, scheduledFor: "2026-01-01", subject: "Existing subject", email: "ada@school.edu",
    })),
  };
  const db = {
    get: async (id: string) => Object.values(rows).flat().find((row) => row._id === id) ?? null,
    patch: async (id: string, update: TestRow) => Object.assign((await db.get(id))!, update),
    insert: async (table: string, row: TestRow) => {
      const id = `${table}-${(rows[table] ?? []).length}`;
      (rows[table] ??= []).push({ ...row, _id: id });
      return id;
    },
    query: (table: string) => {
      let selected = rows[table] ?? [];
      const query = {
        withIndex: (_name: string, callback: (q: any) => unknown) => {
          const index = { eq: (field: string, value: unknown) => {
            selected = selected.filter((row) => row[field] === value);
            return index;
          } };
          callback(index);
          return query;
        },
        unique: async () => selected[0] ?? null,
        first: async () => selected[0] ?? null,
        collect: async () => selected,
        [Symbol.asyncIterator]: async function* () { yield* selected; },
      };
      return query;
    },
  };
  return { rows, ctx: { db } };
}

async function invoke(fn: unknown, ctx: unknown, args: Record<string, unknown>): Promise<any> {
  return (fn as { _handler: (ctx: unknown, args: Record<string, unknown>) => Promise<unknown> })._handler(ctx, args);
}

test("token unsubscribe skips all queued rows, updates consent, and is idempotent", async () => {
  const { rows, ctx } = nurtureDatabase();
  rows.transformationNurtureEmails[0].status = "sent";
  await invoke(unsubscribeByToken, ctx, { token: "a".repeat(64) });
  assert.equal(rows.transformationNurtureEnrollments[0].status, "unsubscribed");
  assert.ok(rows.transformationNurtureEnrollments[0].unsubscribedAt);
  assert.deepEqual(rows.transformationNurtureEmails.map((r) => r.status), ["sent", "skipped", "skipped", "skipped", "skipped"]);
  assert.equal(rows.crmContacts[0].marketingConsentStatus, "unsubscribed");
  assert.equal(rows.crmContacts[0].marketingConsentSource, "transformation-nurture-unsubscribe");
  assert.ok(rows.crmContacts[0].marketingConsentAt);
  const snapshot = JSON.stringify(rows);
  await invoke(unsubscribeByToken, ctx, { token: "a".repeat(64) });
  await invoke(unsubscribeByToken, ctx, { token: "b".repeat(64) });
  await invoke(unsubscribeByToken, ctx, { token: "invalid" });
  assert.equal(JSON.stringify(rows), snapshot);
  assert.deepEqual(await invoke(unsubscribeEnrollmentById, ctx, { enrollmentId: "enrollment", source: "admin" }), {
    rowsSkipped: 0, contactUpdated: false,
  });
});

test("internal unsubscribe returns counts and records the admin source", async () => {
  const { rows, ctx } = nurtureDatabase();
  assert.deepEqual(await invoke(unsubscribeEnrollmentById, ctx, { enrollmentId: "enrollment", source: "admin" }), {
    rowsSkipped: 5, contactUpdated: true,
  });
  assert.equal(rows.crmContacts[0].marketingConsentSource, "admin");
});

test("send preparation backfills and reuses a 32-byte token", async () => {
  const { rows, ctx } = nurtureDatabase();
  delete rows.transformationNurtureEnrollments[0].unsubscribeToken;
  const first = await invoke(prepareEmailForSend, ctx, { id: "email-1" });
  assert.match(first.unsubscribeToken, /^[a-f0-9]{64}$/);
  assert.deepEqual(await invoke(prepareEmailForSend, ctx, { id: "email-2" }), first);
});

test("new enrollments receive a token and retain the five-step schedule", async () => {
  const { rows, ctx } = nurtureDatabase();
  rows.transformationNurtureEnrollments = [];
  rows.transformationNurtureEmails = [];
  await invoke(start, ctx, { email: "ada@school.edu", source: "website" });
  const enrollment = rows.transformationNurtureEnrollments[0];
  assert.match(enrollment.unsubscribeToken, /^[a-f0-9]{64}$/);
  assert.deepEqual(rows.transformationNurtureEmails.map((row) =>
    (Date.parse(row.scheduledFor) - Date.parse(enrollment.startedAt)) / 86400000), [0, 1, 3, 5, 7]);
});

for (const suppression of ["unsubscribed", "do-not-contact", "enrollment-unsubscribed", "paused", "customer", "missing-contact"]) {
  test(`send preparation skips ${suppression}`, async () => {
    const { rows, ctx } = nurtureDatabase();
    if (suppression === "unsubscribed") rows.crmContacts[0].marketingConsentStatus = "unsubscribed";
    if (suppression === "do-not-contact") rows.crmContacts[0].tags = ["do-not-contact"];
    if (suppression === "enrollment-unsubscribed") rows.transformationNurtureEnrollments[0].status = "unsubscribed";
    if (suppression === "paused") rows.transformationNurtureEnrollments[0].status = "paused";
    if (suppression === "customer") rows.crmContacts[0].status = "customer";
    if (suppression === "missing-contact") rows.crmContacts = [];
    assert.deepEqual(await invoke(prepareEmailForSend, ctx, { id: "email-1" }), { unsubscribeToken: null });
    assert.equal(rows.transformationNurtureEmails[1].status, "skipped");
    assert.ok(rows.transformationNurtureEmails[1].errorMessage);
  });
}

test("a late send response cannot reactivate an unsubscribed enrollment", async () => {
  const { rows, ctx } = nurtureDatabase();
  await invoke(unsubscribeByToken, ctx, { token: "a".repeat(64) });
  await invoke(markEmailSent, ctx, { id: "email-4", providerMessageId: "mock-in-flight" });
  assert.equal(rows.transformationNurtureEnrollments[0].status, "unsubscribed");
  assert.equal(rows.crmContacts[0].marketingConsentStatus, "unsubscribed");
  assert.equal(rows.crmTasks, undefined);
});

test("GET and RFC 8058 POST confirm unsubscribe without disclosing the recipient", async () => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async (_input, init) => {
    calls += 1;
    const body = JSON.parse(String(init?.body));
    assert.equal(body.path, "transformationNurture:unsubscribeByToken");
    assert.deepEqual(body.args, { token: "a".repeat(64) });
    return Response.json({ status: "success", value: null });
  };
  try {
    for (const handler of [GET, POST]) {
      const request = new NextRequest(transformationUnsubscribeUrl("a".repeat(64)), handler === POST
        ? { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: "List-Unsubscribe=One-Click" }
        : undefined);
      const response = await handler(request);
      assert.equal(response.status, 200);
      assert.equal(response.headers.get("X-Robots-Tag"), "noindex, nofollow");
      assert.equal(response.headers.get("Cache-Control"), "no-store");
      const body = await response.text();
      assert.ok(body.includes("You are unsubscribed."));
      assert.ok(body.includes("You will not get more of these emails from Rob."));
      assert.doesNotMatch(body, /@/);
    }
    assert.equal(calls, 2);
    const invalid = await GET(new NextRequest(transformationUnsubscribeUrl("TESTTOKEN")));
    assert.equal(invalid.status, 200);
    assert.equal(calls, 2);
    globalThis.fetch = async () => { throw new Error("Mock persistence failure"); };
    assert.equal((await POST(new NextRequest(transformationUnsubscribeUrl("a".repeat(64)), { method: "POST" }))).status, 503);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
