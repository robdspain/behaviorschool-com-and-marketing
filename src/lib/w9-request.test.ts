import assert from "node:assert/strict";
import test from "node:test";
import {
  buildTransformationFaqJsonLd,
  TRANSFORMATION_DISTRICT_PAYMENT_FAQ_ANSWER,
  TRANSFORMATION_W9_FAQ_ANSWER,
  transformationProgramFaqItems,
  W9_PENDING_MESSAGE,
  W9_SENT_MESSAGE,
} from "./transformation-program";
import {
  W9_ATTACHMENT_FILENAME,
  W9_FROM,
  W9_NOTIFY_TO,
  W9_REPLY_TO,
  W9_SUBJECT,
  enforceW9RateLimit,
  isPdfBytes,
  memoryRateLimitStore,
  processW9Request,
  requesterW9Text,
  W9_ADMIN_URL,
  w9AdminRecordUrl,
  type W9Mailer,
  type W9OutboundEmail,
  type W9RecordInput,
} from "./w9-request";

const samplePdf = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34]);

function recordingMailer(options?: { failTo?: string }) {
  const sent: W9OutboundEmail[] = [];
  const mailer: W9Mailer = {
    async send(message) {
      sent.push(message);
      if (options?.failTo && message.to === options.failTo) return { ok: false, error: "rejected" };
      return { ok: true };
    },
  };
  return { sent, mailer };
}

function recordingRecorder(id = "w9_test_record") {
  const records: W9RecordInput[] = [];
  return {
    records,
    recordRequest: async (entry: W9RecordInput) => {
      records.push(entry);
      return { id };
    },
  };
}

const validInput = {
  name: "Ada Lovelace",
  email: "ada@district.example",
  organization: "Example School District",
  faxNumber: "",
};

test("district payment and W-9 FAQ answers are shared with FAQPage JSON-LD", () => {
  const items = transformationProgramFaqItems();
  const district = items.find((item) => item.question === "Can my district pay for this?");
  const w9 = items.find((item) => item.question === "Is a W-9 available?");
  assert.equal(district?.answer, TRANSFORMATION_DISTRICT_PAYMENT_FAQ_ANSWER);
  assert.equal(w9?.answer, TRANSFORMATION_W9_FAQ_ANSWER);
  assert.match(district?.answer ?? "", /BCBA continuing education units/);
  assert.match(district?.answer ?? "", /Behavior Analyst Certification Board Authorized Continuing Education Provider/);
  assert.doesNotMatch(district?.answer ?? "", /qualifies as professional development/i);
  assert.doesNotMatch(district?.answer ?? "", /\d/);
  assert.equal(w9?.answer, "Yes. Request it here and it arrives in your inbox right away.");

  const jsonLd = buildTransformationFaqJsonLd("https://behaviorschool.com");
  const jsonDistrict = jsonLd.mainEntity.find((item) => item.name === "Can my district pay for this?");
  const jsonW9 = jsonLd.mainEntity.find((item) => item.name === "Is a W-9 available?");
  assert.equal(jsonDistrict?.acceptedAnswer.text, district?.answer);
  assert.equal(jsonW9?.acceptedAnswer.text, w9?.answer);
});

test("missing private PDF returns the graceful message, notifies Rob, and does not email an attachment", async () => {
  const { sent, mailer } = recordingMailer();
  const recorder = recordingRecorder("w9_missing_pdf");
  const leads: Array<{ pdfDelivered: boolean; email: string }> = [];
  const result = await processW9Request({
    input: validInput,
    ip: "203.0.113.10",
    origin: "https://behaviorschool.com",
    now: 1_700_000_000_000,
    loadPdf: async () => null,
    rateLimitStore: memoryRateLimitStore(),
    mailer,
    logLead: async (entry) => {
      leads.push({ pdfDelivered: entry.pdfDelivered, email: entry.email });
    },
    recordRequest: recorder.recordRequest,
  });

  assert.equal(result.status, 200);
  assert.equal(result.body.message, W9_PENDING_MESSAGE);
  assert.equal(result.body.delivered, false);
  assert.equal(sent.length, 1);
  assert.equal(sent[0]?.to, W9_NOTIFY_TO);
  assert.equal(sent[0]?.attachments, undefined);
  assert.match(sent[0]?.text ?? "", /Ada Lovelace/);
  assert.match(sent[0]?.text ?? "", /ada@district.example/);
  assert.match(sent[0]?.text ?? "", /Example School District/);
  assert.match(sent[0]?.text ?? "", /Request ID: w9_missing_pdf/);
  assert.match(sent[0]?.text ?? "", new RegExp(w9AdminRecordUrl("w9_missing_pdf").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.doesNotMatch(JSON.stringify(result.body), /w9_missing_pdf/);
  assert.doesNotMatch(JSON.stringify(result), /%PDF/);
  assert.equal(leads[0]?.pdfDelivered, false);
  assert.equal(recorder.records[0]?.status, "pending");
  assert.equal(recorder.records[0]?.autoSendResult, "fallback_no_pdf");
  assert.equal(recorder.records[0]?.sentBy, undefined);
  assert.equal(recorder.records[0]?.sourcePage, "/transformation-program");
});

test("a present PDF is emailed only to the requester, with Rob notified and no attachment on that notice", async () => {
  const { sent, mailer } = recordingMailer();
  const recorder = recordingRecorder("w9_sent_pdf");
  const result = await processW9Request({
    input: validInput,
    ip: "203.0.113.11",
    origin: null,
    now: 1_700_000_000_000,
    loadPdf: async () => samplePdf,
    rateLimitStore: memoryRateLimitStore(),
    mailer,
    logLead: async () => undefined,
    recordRequest: recorder.recordRequest,
  });

  assert.equal(result.status, 200);
  assert.equal(result.body.message, W9_SENT_MESSAGE);
  assert.equal(sent.length, 2);
  assert.equal(sent[0]?.from, W9_FROM);
  assert.equal(sent[0]?.to, "ada@district.example");
  assert.equal(sent[0]?.replyTo, W9_REPLY_TO);
  assert.equal(sent[0]?.subject, W9_SUBJECT);
  assert.equal(sent[0]?.text, requesterW9Text());
  assert.equal(sent[0]?.attachments?.[0]?.filename, W9_ATTACHMENT_FILENAME);
  assert.equal(sent[1]?.to, W9_NOTIFY_TO);
  assert.equal(sent[1]?.replyTo, "ada@district.example");
  assert.equal(sent[1]?.attachments, undefined);
  assert.match(sent[1]?.text ?? "", /Request ID: w9_sent_pdf/);
  assert.match(sent[1]?.text ?? "", /https:\/\/behaviorschool.com\/admin\/w9-requests#w9_sent_pdf/);
  assert.doesNotMatch(sent[1]?.text ?? "", /%PDF/);
  assert.doesNotMatch(JSON.stringify(result.body), /w9_sent_pdf/);
  assert.equal(recorder.records[0]?.status, "sent");
  assert.equal(recorder.records[0]?.sentBy, "auto");
  assert.equal(recorder.records[0]?.autoSendResult, "sent");
  assert.equal(recorder.records[0]?.sentAt, 1_700_000_000_000);
  assert.equal(isPdfBytes(samplePdf), true);
  assert.equal(isPdfBytes(new Uint8Array([1, 2, 3, 4])), false);
});

test("a failed requester email stays pending, records an error, and still notifies Rob", async () => {
  const { sent, mailer } = recordingMailer({ failTo: "ada@district.example" });
  const recorder = recordingRecorder("w9_send_error");
  const result = await processW9Request({
    input: validInput,
    ip: "203.0.113.15",
    origin: "https://behaviorschool.com",
    now: 1_700_000_000_000,
    loadPdf: async () => samplePdf,
    rateLimitStore: memoryRateLimitStore(),
    mailer,
    logLead: async () => undefined,
    recordRequest: recorder.recordRequest,
  });

  assert.equal(result.status, 200);
  assert.equal(result.body.delivered, false);
  assert.equal(result.body.message, W9_PENDING_MESSAGE);
  assert.equal(recorder.records[0]?.status, "pending");
  assert.equal(recorder.records[0]?.autoSendResult, "error");
  assert.equal(recorder.records[0]?.sentBy, undefined);
  assert.equal(sent[1]?.to, W9_NOTIFY_TO);
  assert.match(sent[1]?.text ?? "", /Request ID: w9_send_error/);
  assert.equal(sent[1]?.attachments, undefined);
  assert.doesNotMatch(JSON.stringify(result.body), /w9_send_error/);
});

test("a tracking failure still notifies Rob without a request id", async () => {
  const { sent, mailer } = recordingMailer();
  const result = await processW9Request({
    input: validInput,
    ip: "203.0.113.16",
    origin: "https://behaviorschool.com",
    now: 1_700_000_000_000,
    loadPdf: async () => null,
    rateLimitStore: memoryRateLimitStore(),
    mailer,
    logLead: async () => undefined,
    recordRequest: async () => {
      throw new Error("table missing");
    },
  });

  assert.equal(result.status, 200);
  assert.equal(sent.length, 1);
  assert.match(sent[0]?.text ?? "", /Request ID: not stored/);
  assert.match(sent[0]?.text ?? "", new RegExp(W9_ADMIN_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.doesNotMatch(sent[0]?.text ?? "", /#/);
});

test("honeypot and invalid submissions do not send mail", async () => {
  const { sent, mailer } = recordingMailer();
  const store = memoryRateLimitStore();
  const honeypot = await processW9Request({
    input: { ...validInput, faxNumber: "http://spam.example" },
    ip: "203.0.113.12",
    origin: "https://behaviorschool.com",
    now: 1_700_000_000_000,
    loadPdf: async () => samplePdf,
    rateLimitStore: store,
    mailer,
    logLead: async () => {
      throw new Error("lead should not be written");
    },
    recordRequest: async () => {
      throw new Error("record should not be written");
    },
  });
  const invalid = await processW9Request({
    input: { ...validInput, email: "not-an-email" },
    ip: "203.0.113.12",
    origin: "https://behaviorschool.com",
    now: 1_700_000_000_000,
    loadPdf: async () => samplePdf,
    rateLimitStore: store,
    mailer,
    recordRequest: async () => {
      throw new Error("record should not be written");
    },
  });

  assert.equal(honeypot.status, 200);
  assert.equal(honeypot.body.message, W9_PENDING_MESSAGE);
  assert.equal(invalid.status, 400);
  assert.equal(sent.length, 0);
});

test("the fourth request from the same email or IP in an hour is refused", async () => {
  const store = memoryRateLimitStore();
  const now = 1_700_000_000_000;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const result = await enforceW9RateLimit(store, {
      ip: "203.0.113.20",
      email: `person${attempt}@district.example`,
      now: now + attempt,
    });
    assert.equal(result.allowed, true);
  }
  const blockedIp = await enforceW9RateLimit(store, {
    ip: "203.0.113.20",
    email: "someone-else@district.example",
    now: now + 4,
  });
  assert.equal(blockedIp.allowed, false);

  const emailStore = memoryRateLimitStore();
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const result = await enforceW9RateLimit(emailStore, {
      ip: `203.0.113.${30 + attempt}`,
      email: "ada@district.example",
      now: now + attempt,
    });
    assert.equal(result.allowed, true);
  }
  const blockedEmail = await enforceW9RateLimit(emailStore, {
    ip: "198.51.100.8",
    email: "ada@district.example",
    now: now + 10,
  });
  assert.equal(blockedEmail.allowed, false);
});

test("cross-site origins are rejected before any email is sent", async () => {
  const { sent, mailer } = recordingMailer();
  const result = await processW9Request({
    input: validInput,
    ip: "203.0.113.40",
    origin: "https://evil.example",
    now: 1_700_000_000_000,
    loadPdf: async () => samplePdf,
    rateLimitStore: memoryRateLimitStore(),
    mailer,
    logLead: async () => undefined,
    recordRequest: async () => {
      throw new Error("record should not be written");
    },
  });
  assert.equal(result.status, 403);
  assert.equal(sent.length, 0);
});
