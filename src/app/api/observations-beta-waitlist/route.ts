export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { Resend } from "resend";
import { RESEND_FROM_ROB, RESEND_REPLY_TO_ROB } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const { name, email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const firstName = name?.trim().split(/\s+/)[0] || "";

    // Save to local JSON file as backup
    const dataDir = path.join(process.cwd(), "data");
    const filePath = path.join(dataDir, "observations-beta-waitlist.json");
    await fs.mkdir(dataDir, { recursive: true });

    let current: unknown[] = [];
    try {
      const existing = await fs.readFile(filePath, "utf-8");
      const parsed = JSON.parse(existing);
      if (Array.isArray(parsed)) current = parsed;
    } catch {
      current = [];
    }

    current.unshift({
      name: name?.trim() || "",
      email: normalizedEmail,
      source: "observations-pro-beta",
      createdAt: new Date().toISOString(),
    });
    await fs.writeFile(filePath, JSON.stringify(current, null, 2), "utf-8");

    // Add to Resend audience
    const resend = new Resend(process.env.RESEND_API_KEY);
    const audienceId = process.env.RESEND_OBSERVATIONS_BETA_AUDIENCE_ID;
    if (audienceId) {
      try {
        await resend.contacts.create({
          audienceId,
          email: normalizedEmail,
          firstName: firstName || undefined,
          unsubscribed: false,
        });
      } catch (err) {
        console.error("Resend audience add error (non-fatal):", err);
      }
    }

    // Send confirmation email to user
    await resend.emails.send({
      from: RESEND_FROM_ROB,
      to: normalizedEmail,
      replyTo: RESEND_REPLY_TO_ROB,
      subject: "You're on the Observations Pro beta list",
      html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1a1a; line-height: 1.7;">

<p>${firstName ? `Hi ${firstName},` : "Hi,"}</p>

<p>You're on the list. When Observations Pro opens TestFlight in May, you'll be the first to know.</p>

<p>Beta testers get early access before the public launch, and your feedback will shape what gets built next. If something's clunky or missing, I want to hear it.</p>

<p>Until then — if you have questions or want to tell me what your observation workflow looks like right now, just reply to this email. That kind of thing genuinely helps.</p>

<p>— Rob Spain, BCBA<br>
<a href="https://behaviorschool.com" style="color:#1a4731;">BehaviorSchool</a></p>

<hr style="border:none; border-top:1px solid #eee; margin:40px 0;">
<p style="font-size:12px; color:#999;">
  Behavior School LLC · 8 The Green #20473 · Dover, DE 19901<br>
  <a href="https://behaviorschool.com/email-preferences" style="color:#999;">Manage email preferences</a>
</p>
</body>
</html>`,
    });

    // Notify Rob
    await resend.emails.send({
      from: RESEND_FROM_ROB,
      to: "rob@behaviorschool.com",
      replyTo: RESEND_REPLY_TO_ROB,
      subject: `Observations Pro beta signup: ${normalizedEmail}`,
      text: `New beta waitlist signup\n\nName: ${name?.trim() || "Not provided"}\nEmail: ${normalizedEmail}\nTime: ${new Date().toISOString()}`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("observations-beta-waitlist error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
