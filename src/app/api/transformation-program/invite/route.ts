import { NextRequest, NextResponse } from "next/server";
import { api, getConvexClient } from "@/lib/convex";
import { RESEND_FROM_ROB, RESEND_REPLY_TO_ROB } from "@/lib/resend";

export const dynamic = "force-dynamic";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_ROB_NOTIFICATION_EMAILS = ["rob@behaviorschool.com", "robspain@gmail.com"];

function cleanString(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function splitName(name: string) {
  const [firstName, ...rest] = name.split(/\s+/).filter(Boolean);
  return { firstName: firstName || "", lastName: rest.join(" ") };
}

function parseAttribution(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const raw = value as Record<string, unknown>;
  const allowed = ["source", "medium", "campaign", "term", "content", "landingPage"];
  const attribution = Object.fromEntries(
    allowed
      .map((key) => [key, cleanString(raw[key], 200)])
      .filter(([, entry]) => Boolean(entry)),
  );
  return Object.keys(attribution).length > 0 ? attribution : undefined;
}

function robNotificationEmails() {
  const configured =
    process.env.TRANSFORM_LEAD_NOTIFICATION_EMAILS ||
    process.env.ROB_NOTIFICATION_EMAILS ||
    "";

  const emails = configured
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter((email) => emailPattern.test(email));

  return emails.length > 0 ? Array.from(new Set(emails)) : DEFAULT_ROB_NOTIFICATION_EMAILS;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function notifyRobOfInvite(input: {
  fullName: string;
  email: string;
  role: string;
  systemsProblem?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, skipped: true, reason: "missing_resend_api_key" };

  const systemsProblem = input.systemsProblem || "Not provided";
  const recipients = robNotificationEmails();
  const html = `
    <h2>New Transformation Priority Access List join</h2>
    <p><strong>Name:</strong> ${escapeHtml(input.fullName)}</p>
    <p><strong>Email:</strong> <a href="mailto:${escapeHtml(input.email)}">${escapeHtml(input.email)}</a></p>
    <p><strong>Role / title:</strong> ${escapeHtml(input.role)}</p>
    <p><strong>Caseload or systems problem:</strong><br>${escapeHtml(systemsProblem).replace(/\n/g, "<br>")}</p>
    <p><strong>Next step:</strong> Keep this contact on Priority Access. They get the exclusive early window before a wider announcement — do not treat this as a full application.</p>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "BehaviorSchool Leads <noreply@updates.behaviorschool.com>",
      to: recipients,
      subject: `Priority Access: ${input.fullName}`,
      html,
      reply_to: input.email,
    }),
  });

  if (!response.ok) {
    return { ok: false, skipped: false, reason: await response.text() };
  }

  return { ok: true, skipped: false };
}

async function sendInviteConfirmation(input: {
  firstName: string;
  email: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, skipped: true, reason: "missing_resend_api_key" };

  const greeting = input.firstName ? `Hi ${input.firstName},` : "Hi,";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: RESEND_FROM_ROB,
      to: input.email,
      reply_to: RESEND_REPLY_TO_ROB,
      subject: "You're on Priority Access for the School BCBA Transformation Program",
      html: `<p>${escapeHtml(greeting)}</p><p>You're on Priority Access for the School BCBA Transformation Program.</p><p>You'll get an email when seats open — before a wider announcement. No Thursday commitment and no payment step are required to stay on the list.</p><p>Rob Spain, BCBA<br>Behavior School<br>${escapeHtml(RESEND_REPLY_TO_ROB)}</p>`,
    }),
  });

  if (!response.ok) {
    return { ok: false, skipped: false, reason: await response.text() };
  }

  return { ok: true, skipped: false };
}

async function notifyTelegram(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID || "8181098703";
  if (!token) return { ok: false, skipped: true };

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message }),
    });
    return { ok: response.ok, skipped: false };
  } catch (error) {
    console.error("Telegram Priority Access notification error:", error);
    return { ok: false, skipped: false };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const fullName = cleanString(body?.fullName ?? body?.name, 160);
    const email = cleanString(body?.email, 320).toLowerCase();
    const role = cleanString(body?.currentRole ?? body?.role, 160);
    const systemsProblem = cleanString(body?.systemsProblem ?? body?.caseloadProblem, 500) || undefined;

    if (!fullName || !emailPattern.test(email) || !role) {
      return NextResponse.json(
        { error: "Name, valid email, and current role are required." },
        { status: 400 },
      );
    }

    const { firstName, lastName } = splitName(fullName);
    const attribution = parseAttribution(body?.attribution);
    const client = getConvexClient();
    const inviteNotes = [
      "Transformation Program Priority Access List request",
      `Role: ${role}`,
      systemsProblem
        ? `Caseload or systems problem:\n${systemsProblem}`
        : "Caseload or systems problem: (not provided)",
    ].join("\n");

    let contactId: string | undefined;
    try {
      const invite = await client.mutation(api.crm.recordTransformationInvite, {
        firstName,
        lastName,
        email,
        role,
        systemsProblem,
        attribution,
      });
      contactId = invite?.contactId;
    } catch (inviteError) {
      console.error("Transformation Priority Access CRM mutation error:", inviteError);
      contactId = await client.mutation(api.crm.upsertContact, {
        firstName,
        lastName,
        email,
        role,
        leadSource: "transformation_priority_access",
        status: "lead",
        tags: ["transformation-program", "transformation-priority-access", "school-bcba-program"],
        notes: inviteNotes,
      });
    }

    await Promise.all([
      client.mutation(api.submissions.createSignupSubmission, {
        firstName,
        lastName,
        email,
        role,
        currentChallenges: systemsProblem,
        status: "transformation_priority_access",
      }),
      client.mutation(api.analytics.createConversionEvent, {
        eventType: "course_inquiry",
        eventName: "transformation_priority_access_joined",
        sourcePage: "/transformation-program",
        resourceName: "School BCBA Transformation Program Priority Access List",
        additionalData: {
          attribution,
          contactId,
          hasSystemsProblem: Boolean(systemsProblem),
        },
      }),
    ]);

    const notificationText = [
      "TRANSFORMATION PRIORITY ACCESS",
      "",
      `Name: ${fullName}`,
      `Email: ${email}`,
      `Role: ${role}`,
      `Systems problem: ${systemsProblem || "Not provided"}`,
    ].join("\n");

    await Promise.allSettled([
      notifyRobOfInvite({ fullName, email, role, systemsProblem }),
      sendInviteConfirmation({ firstName, email }),
      notifyTelegram(notificationText),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Transformation Priority Access error:", error);
    return NextResponse.json(
      { error: "Unable to join Priority Access right now. Please try again shortly." },
      { status: 500 },
    );
  }
}
