import { createHash } from "node:crypto";
import { Resend } from "resend";
import { api, getConvexClient } from "@/lib/convex";
import { RESEND_FROM_SUPPORT, RESEND_REPLY_TO_ROB } from "@/lib/resend";
import { W9_PENDING_MESSAGE, W9_SENT_MESSAGE } from "@/lib/transformation-program";

/**
 * Private W-9 delivery.
 *
 * The PDF contains the business tax ID. It is not committed to the repo and
 * is not served from a public URL. At runtime the route reads one object from
 * a site-scoped Netlify Blob store:
 *
 *   store: private-documents
 *   key:   behavior-school-llc-w9.pdf
 *
 * One-time upload, linked to the behaviorschool.com site (Netlify project
 * `behavior-school`, site id b84cb106-68f5-4adb-bd66-20dcdaf346f3):
 *
 *   netlify link --id b84cb106-68f5-4adb-bd66-20dcdaf346f3
 *   netlify blobs:set private-documents behavior-school-llc-w9.pdf --input /absolute/path/to/Behavior-School-LLC-W-9.pdf
 *   netlify blobs:list private-documents
 *
 * The store is site-scoped, so production and deploy previews can read it, and
 * a new deploy does not delete it. Do not pass --input with a path inside this
 * repository.
 *
 * From address: the requested mailbox is support@behaviorschool.com. Resend's
 * apex domain behaviorschool.com is unverified (DKIM and SPF failed), so a
 * send from that address is rejected. The mailer tries
 * `Behavior School <support@behaviorschool.com>` first, then the existing
 * verified support sender on updates.behaviorschool.com (`RESEND_FROM_SUPPORT`).
 * Reply-To on the requester email is rob@behaviorschool.com.
 */

export const W9_BLOB_STORE = "private-documents";
export const W9_BLOB_KEY = "behavior-school-llc-w9.pdf";
export const W9_ATTACHMENT_FILENAME = "Behavior-School-LLC-W-9.pdf";
export const W9_SUBJECT = "Behavior School LLC W-9";
export const W9_NOTIFY_SUBJECT = "W-9 requested";
export const W9_NOTIFY_TO = "rob@behaviorschool.com";
export const W9_FROM = "Behavior School <support@behaviorschool.com>";
export const W9_REPLY_TO = RESEND_REPLY_TO_ROB;
export const W9_RATE_LIMIT = 3;
export const W9_RATE_WINDOW_MS = 60 * 60 * 1000;
const MAX_PDF_BYTES = 2_000_000;

const MAILING_ADDRESS = `Behavior School LLC
8 The Green #20473
Dover, DE 19901
United States`;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type W9Attachment = {
  filename: string;
  content: Uint8Array;
};

export type W9OutboundEmail = {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
  attachments?: W9Attachment[];
};

export type W9Mailer = {
  send(message: W9OutboundEmail): Promise<{ ok: true } | { ok: false; error: string }>;
};

export type RateLimitStore = {
  get(key: string): Promise<number[] | null>;
  set(key: string, timestamps: number[]): Promise<void>;
};

export type W9LeadEntry = {
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  pdfDelivered: boolean;
};

export type W9RequestBody = {
  ok?: true;
  delivered?: boolean;
  message?: string;
  error?: string;
};

export type W9RequestResult = {
  status: 200 | 400 | 403 | 429;
  body: W9RequestBody;
};

type ValidW9Request = {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
};

export function memoryRateLimitStore(): RateLimitStore {
  const buckets = new Map<string, number[]>();
  return {
    async get(key) {
      const stored = buckets.get(key);
      return stored ? [...stored] : null;
    },
    async set(key, timestamps) {
      buckets.set(key, [...timestamps]);
    },
  };
}

export function clientIpFromHeaders(headers: Headers): string {
  const netlifyIp = headers.get("x-nf-client-connection-ip")?.trim();
  if (netlifyIp) return netlifyIp.slice(0, 80);
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (forwarded) return forwarded.slice(0, 80);
  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) return realIp.slice(0, 80);
  return "unknown";
}

export function isAllowedW9Origin(origin: string | null): boolean {
  if (!origin) return true;
  try {
    const hostname = new URL(origin).hostname;
    if (hostname === "behaviorschool.com" || hostname === "www.behaviorschool.com") return true;
    if (hostname === "localhost" || hostname === "127.0.0.1") return true;
    return hostname.endsWith(".netlify.app");
  } catch {
    return false;
  }
}

export function fromAddressesToTry(preferred: string): string[] {
  if (preferred === RESEND_FROM_SUPPORT) return [preferred];
  return [preferred, RESEND_FROM_SUPPORT];
}

function cleanSingleLine(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, maxLength);
}

function splitName(name: string): { firstName: string; lastName: string } {
  const [firstName, ...rest] = name.split(/\s+/).filter(Boolean);
  return { firstName: firstName || "", lastName: rest.join(" ") };
}

export function parseW9Request(input: unknown): { ok: true; value: ValidW9Request } | { ok: false; error: string } | { ok: false; honeypot: true } {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, error: "Enter your name, work email, and organization." };
  }
  const record = input as Record<string, unknown>;
  if (cleanSingleLine(record.faxNumber, 200)) {
    return { ok: false, honeypot: true };
  }

  const name = cleanSingleLine(record.name, 120);
  const email = cleanSingleLine(record.email, 320).toLowerCase();
  const organization = cleanSingleLine(record.organization, 200);

  if (name.length < 2 || organization.length < 2 || !emailPattern.test(email)) {
    return { ok: false, error: "Enter your name, work email, and organization." };
  }

  const { firstName, lastName } = splitName(name);
  return { ok: true, value: { name, firstName, lastName, email, organization } };
}

function rateLimitKey(kind: "ip" | "email", value: string): string {
  const digest = createHash("sha256").update(`w9:${kind}:${value}`).digest("hex");
  return `${kind}:${digest}`;
}

export async function enforceW9RateLimit(
  store: RateLimitStore,
  args: { ip: string; email: string; now: number },
): Promise<{ allowed: boolean }> {
  const keys = [rateLimitKey("email", args.email)];
  if (args.ip !== "unknown") keys.push(rateLimitKey("ip", args.ip));

  try {
    const recentByKey = new Map<string, number[]>();
    for (const key of keys) {
      const existing = (await store.get(key)) ?? [];
      const recent = existing.filter((stamp) => args.now - stamp < W9_RATE_WINDOW_MS && stamp <= args.now);
      if (recent.length >= W9_RATE_LIMIT) return { allowed: false };
      recentByKey.set(key, recent);
    }
    for (const [key, recent] of recentByKey) {
      await store.set(key, [...recent, args.now]);
    }
    return { allowed: true };
  } catch (error) {
    console.error("W-9 rate limit check failed", error instanceof Error ? error.message : "unknown");
    return { allowed: true };
  }
}

export function isPdfBytes(bytes: Uint8Array | null): bytes is Uint8Array {
  if (!bytes || bytes.byteLength < 5 || bytes.byteLength > MAX_PDF_BYTES) return false;
  return String.fromCharCode(bytes[0] ?? 0, bytes[1] ?? 0, bytes[2] ?? 0, bytes[3] ?? 0) === "%PDF";
}

export function requesterW9Text(): string {
  return `Here is the Behavior School LLC W-9 you requested.\n\n${MAILING_ADDRESS}`;
}

export function robW9NotificationText(args: {
  name: string;
  email: string;
  organization: string;
  delivery: "sent" | "file_missing" | "send_failed";
}): string {
  const attachment =
    args.delivery === "sent"
      ? "Attachment: sent to the requester."
      : args.delivery === "file_missing"
        ? "Attachment: not sent. The private W-9 file is not in Netlify Blobs yet. Email it to this person after you upload the file."
        : "Attachment: not sent. The email to the requester failed. Please email the W-9 to this person.";
  return `A W-9 was requested.\n\nName: ${args.name}\nWork email: ${args.email}\nOrganization: ${args.organization}\n${attachment}`;
}

export function w9CrmNote(entry: W9LeadEntry, now = new Date()): string {
  const status = entry.pdfDelivered ? "emailed" : "pending private file";
  return `W-9 requested ${now.toISOString()} for ${entry.organization}. PDF ${status}.`;
}

export async function loadPrivateW9Pdf(): Promise<Uint8Array | null> {
  try {
    const { getStore } = await import("@netlify/blobs");
    const store = getStore({ name: W9_BLOB_STORE, consistency: "strong" });
    const data = await store.get(W9_BLOB_KEY, { type: "arrayBuffer" });
    if (!data) return null;
    const bytes = new Uint8Array(data);
    return isPdfBytes(bytes) ? bytes : null;
  } catch (error) {
    console.error("W-9 private file could not be read", error instanceof Error ? error.message : "unknown");
    return null;
  }
}

export async function getW9RateLimitStore(): Promise<RateLimitStore> {
  try {
    const { getStore } = await import("@netlify/blobs");
    const store = getStore({ name: "w9-request-limits", consistency: "strong" });
    await store.get("healthcheck", { type: "text" });
    return {
      async get(key) {
        const value = await store.get(key, { type: "json" });
        if (!Array.isArray(value)) return null;
        return value.filter((item): item is number => typeof item === "number");
      },
      async set(key, timestamps) {
        await store.setJSON(key, timestamps);
      },
    };
  } catch (error) {
    console.error("W-9 rate limit store unavailable; using process memory", error instanceof Error ? error.message : "unknown");
    return memoryRateLimitStore();
  }
}

export function createResendW9Mailer(): W9Mailer {
  return {
    async send(message) {
      const apiKey = process.env.RESEND_API_KEY;
      if (!apiKey || apiKey === "placeholder") {
        return { ok: false, error: "resend_not_configured" };
      }
      const resend = new Resend(apiKey);
      let lastError = "resend_failed";
      for (const from of fromAddressesToTry(message.from)) {
        const { error } = await resend.emails.send({
          from,
          to: [message.to],
          replyTo: message.replyTo,
          subject: message.subject,
          text: message.text,
          attachments: message.attachments?.map((file) => ({
            filename: file.filename,
            content: Buffer.from(file.content),
          })),
        });
        if (!error) return { ok: true };
        lastError = error.message;
        console.error("W-9 email send failed", { from, error: error.message });
      }
      return { ok: false, error: lastError };
    },
  };
}

function readExistingContact(value: unknown): { tags: string[]; notes?: string; leadSource?: string } | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const tags = Array.isArray(record.tags) ? record.tags.filter((tag): tag is string => typeof tag === "string") : [];
  const notes = typeof record.notes === "string" ? record.notes : undefined;
  const leadSource = typeof record.leadSource === "string" ? record.leadSource : undefined;
  return { tags, notes, leadSource };
}

export async function logW9Lead(entry: W9LeadEntry): Promise<void> {
  try {
    const client = getConvexClient();
    const existing = readExistingContact(await client.query(api.crm.getContactByEmail, { email: entry.email }));
    const tags = Array.from(new Set([...(existing?.tags ?? []), "w9-request", "transformation-program"]));
    const line = w9CrmNote(entry);
    const combined = existing?.notes ? `${existing.notes}\n${line}` : line;
    const notes = combined.length > 8000 ? combined.slice(combined.length - 8000) : combined;
    await client.mutation(api.crm.upsertContact, {
      firstName: entry.firstName,
      lastName: entry.lastName,
      email: entry.email,
      organization: entry.organization,
      ...(existing?.leadSource ? {} : { leadSource: "w9_request" }),
      tags,
      notes,
    });
  } catch (error) {
    console.error("W-9 CRM log failed", error instanceof Error ? error.message : "unknown");
  }
}

const pendingResult = (): W9RequestResult => ({
  status: 200,
  body: { ok: true, delivered: false, message: W9_PENDING_MESSAGE },
});

export async function processW9Request(args: {
  input: unknown;
  ip: string;
  origin: string | null;
  now?: number;
  loadPdf: () => Promise<Uint8Array | null>;
  rateLimitStore: RateLimitStore;
  mailer: W9Mailer;
  logLead?: (entry: W9LeadEntry) => Promise<void>;
}): Promise<W9RequestResult> {
  if (!isAllowedW9Origin(args.origin)) {
    return { status: 403, body: { error: "Request could not be completed." } };
  }

  const parsed = parseW9Request(args.input);
  if (!parsed.ok) {
    if ("honeypot" in parsed) return pendingResult();
    return { status: 400, body: { error: parsed.error } };
  }

  const now = args.now ?? Date.now();
  const limit = await enforceW9RateLimit(args.rateLimitStore, {
    ip: args.ip,
    email: parsed.value.email,
    now,
  });
  if (!limit.allowed) {
    return {
      status: 429,
      body: { error: "You can request the W-9 three times an hour. Please try again later." },
    };
  }

  const pdf = await args.loadPdf();
  const pdfReady = isPdfBytes(pdf);
  let delivery: "sent" | "file_missing" | "send_failed" = pdfReady ? "sent" : "file_missing";

  if (pdfReady) {
    const sent = await args.mailer.send({
      from: W9_FROM,
      to: parsed.value.email,
      replyTo: W9_REPLY_TO,
      subject: W9_SUBJECT,
      text: requesterW9Text(),
      attachments: [{ filename: W9_ATTACHMENT_FILENAME, content: pdf }],
    });
    if (!sent.ok) delivery = "send_failed";
  }

  const notified = await args.mailer.send({
    from: W9_FROM,
    to: W9_NOTIFY_TO,
    replyTo: parsed.value.email,
    subject: W9_NOTIFY_SUBJECT,
    text: robW9NotificationText({
      name: parsed.value.name,
      email: parsed.value.email,
      organization: parsed.value.organization,
      delivery,
    }),
  });

  await (args.logLead ?? logW9Lead)({
    firstName: parsed.value.firstName,
    lastName: parsed.value.lastName,
    email: parsed.value.email,
    organization: parsed.value.organization,
    pdfDelivered: delivery === "sent",
  });

  if (!notified.ok && delivery !== "sent") {
    console.error("W-9 request needs manual follow-up", {
      name: parsed.value.name,
      email: parsed.value.email,
      organization: parsed.value.organization,
      delivery,
    });
  }

  if (delivery === "sent") {
    return { status: 200, body: { ok: true, delivered: true, message: W9_SENT_MESSAGE } };
  }
  return pendingResult();
}
