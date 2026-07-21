export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { startTransformationNurture } from "@/lib/transformation-nurture";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_ROB_NOTIFICATION_EMAILS = ["rob@behaviorschool.com", "robspain@gmail.com"];

function robNotificationEmails() {
  const configured =
    process.env.TRANSFORMATION_LEAD_NOTIFICATION_EMAILS ||
    process.env.ROB_NOTIFICATION_EMAILS ||
    "";

  const emails = configured
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter((email) => emailRegex.test(email));

  return emails.length > 0 ? Array.from(new Set(emails)) : DEFAULT_ROB_NOTIFICATION_EMAILS;
}

function cleanString(value: unknown, max = 1000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function uniqueTags(tags: string[]) {
  return Array.from(new Set(tags.map((tag) => tag.trim()).filter(Boolean)));
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function notifyRobOfPacketLead(input: {
  name?: string;
  email: string;
  organization?: string;
  source: string;
  notes?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, skipped: true, reason: "missing_resend_api_key" };

  const name = input.name || "Unknown name";
  const organization = input.organization || "Not provided";
  const notes = input.notes || "Requested the district approval packet.";
  const recipients = robNotificationEmails();
  const html = `
    <h2>New Transformation packet lead</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> <a href="mailto:${escapeHtml(input.email)}">${escapeHtml(input.email)}</a></p>
    <p><strong>District / organization:</strong> ${escapeHtml(organization)}</p>
    <p><strong>Source:</strong> ${escapeHtml(input.source)}</p>
    <p><strong>Next step:</strong> Follow up personally and get this lead onto a fit call.</p>
    <p><strong>Notes:</strong><br>${escapeHtml(notes).replace(/\n/g, "<br>")}</p>
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
      subject: `New packet lead: ${name}`,
      html,
      reply_to: input.email,
    }),
  });

  if (!response.ok) {
    return { ok: false, skipped: false, reason: await response.text() };
  }

  return { ok: true, skipped: false, recipients };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = cleanString(body?.email, 320).toLowerCase();

    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Valid email address is required" }, { status: 400 });
    }

    const source = cleanString(body?.source, 120) || "transformation_nurture";
    const requestedPacket = body?.requestedPacket === true;
    const tags = uniqueTags([
      ...(Array.isArray(body?.tags)
        ? body.tags.map((tag: unknown) => cleanString(tag, 80)).filter(Boolean)
        : ["transformation-program"]),
      ...(requestedPacket ? ["transformation_packet", "district-approval-packet"] : []),
    ]);
    const name = cleanString(body?.name, 200) || undefined;
    const organization = cleanString(body?.organization || body?.district, 200) || undefined;
    const notes = cleanString(body?.notes, 2000) || undefined;

    const result = await startTransformationNurture({
      email,
      name,
      firstName: cleanString(body?.firstName, 120) || undefined,
      lastName: cleanString(body?.lastName, 120) || undefined,
      phone: cleanString(body?.phone, 80) || undefined,
      organization,
      role: cleanString(body?.role, 200) || undefined,
      source,
      tags,
      notes,
      metadata: {
        page: cleanString(body?.page, 400) || request.headers.get("referer"),
        requestedPacket,
      },
    });

    const notification = requestedPacket
      ? await notifyRobOfPacketLead({ name, email, organization, source, notes }).catch((error) => ({
          ok: false,
          skipped: false,
          reason: error instanceof Error ? error.message : String(error),
        }))
      : { ok: false, skipped: true };

    return NextResponse.json({
      ok: true,
      ...result,
      notification,
      packetUrl: "/transformation-program-pd-packet.pdf",
      calendlyUrl: "https://calendly.com/robspain/behavior-school-transformation-system-phone-call",
    });
  } catch (error) {
    console.error("Transformation nurture start error:", error);
    return NextResponse.json({ error: "Unable to start follow-up sequence" }, { status: 500 });
  }
}
