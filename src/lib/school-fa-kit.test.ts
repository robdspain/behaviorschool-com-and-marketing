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
import { renderTransformationNurtureEmail } from "./transformation-nurture";

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
  });

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
  });

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
  });

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
  });

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
  });
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

test("non-kit step 1 plain text remains exactly unchanged", () => {
  for (const source of ["transformation-program", "website", undefined]) {
    const rendered = renderStepOne(source);
    assert.equal(rendered.text, `${originalStepOneBody}\n\n${oldFinalParagraph}\n\n${calendlyUrl}`);
    assert.ok(rendered.html.includes(oldFinalParagraph));
    assert.doesNotMatch(rendered.text, /P\.S\./);
    assert.doesNotMatch(rendered.html, /P\.S\./);
  }
});
