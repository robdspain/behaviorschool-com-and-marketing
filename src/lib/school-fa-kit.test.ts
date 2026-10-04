import assert from "node:assert/strict";
import test from "node:test";
import {
  isSchoolFaStarterKitSource,
  SCHOOL_FA_GRAPHING_TEMPLATE_COPY_URL,
  SCHOOL_FA_KIT_PDF_URL,
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

test("school FA kit email delivers the kit and does not claim a district packet request", () => {
  const rendered = renderTransformationNurtureEmail({
    _id: "email-1",
    email: "ada@school.edu",
    firstName: "Ada",
    step: 0,
    subject: SCHOOL_FA_KIT_STEP_ZERO_SUBJECT,
    metadata: { source: "school-fa-starter-kit" },
  });

  assert.equal(rendered.subject, SCHOOL_FA_KIT_STEP_ZERO_SUBJECT);
  assert.match(rendered.text, /Hi Ada/);
  assert.match(
    rendered.text,
    /School FA starter kit from the October 9 CalABA BehaviorLive presentation is ready/,
  );
  assert.match(rendered.text, new RegExp(SCHOOL_FA_KIT_PDF_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(rendered.text, /docs.google.com\/spreadsheets/);
  assert.match(rendered.text, new RegExp(SCHOOL_FA_GRAPHING_TEMPLATE_COPY_URL.split("/d/")[1].split("/")[0]));
  assert.doesNotMatch(rendered.text, /district packet you asked for/i);
  assert.match(rendered.text, /Transformation Program/);
  assert.match(rendered.html, /behaviorschool.com\/fba/);
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

  assert.match(rendered.text, /I put the district packet here/);
  assert.doesNotMatch(rendered.text, /School FA starter kit is ready/);
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
