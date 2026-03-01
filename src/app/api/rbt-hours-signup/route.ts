export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { name, email, supervisorEmail, result, hoursPerWeek } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Add to Resend contacts
    try {
      await resend.contacts.create({
        email,
        firstName: name?.split(" ")[0] || "",
        lastName: name?.split(" ").slice(1).join(" ") || "",
        unsubscribed: false,
        audienceId: process.env.RESEND_AUDIENCE_ID || "",
      });
    } catch (contactErr) {
      console.error("Contact create error:", contactErr);
    }

    const completionDateStr = result?.completionDate
      ? new Date(result.completionDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })
      : "N/A";

    const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1a1a; line-height: 1.7;">

<p>${name ? `Hi ${name.split(" ")[0]},` : "Hi,"}</p>

<p>Here's your RBT supervision hour summary from BehaviorSchool.</p>

<div style="background:#f8f9fa; border-left:4px solid #1a4731; padding:16px 20px; margin:24px 0; border-radius:4px; font-family:sans-serif;">
  <p style="margin:0 0 4px; font-size:12px; color:#888; text-transform:uppercase; letter-spacing:1px;">Your RBT Hour Progress</p>
  <table style="width:100%; font-size:13px; color:#333; border-collapse:collapse; margin:8px 0;">
    <tr><td style="padding:2px 0; color:#555;">Pathway:</td><td style="text-align:right; font-weight:600;">${result?.pathway || "RBT"}</td></tr>
    <tr><td style="padding:2px 0; color:#555;">Hours completed:</td><td style="text-align:right; font-weight:600;">${result?.hoursCompleted?.toLocaleString() || 0}</td></tr>
    <tr><td style="padding:2px 0; color:#555;">Hours required:</td><td style="text-align:right; font-weight:600;">${result?.hoursRequired?.toLocaleString() || 1500}</td></tr>
    <tr><td style="padding:2px 0; color:#555;">Hours remaining:</td><td style="text-align:right; font-weight:600;">${result?.hoursRemaining?.toLocaleString() || 0}</td></tr>
    <tr><td style="padding:2px 0; color:#555;">Progress:</td><td style="text-align:right; font-weight:600; color:#1a4731;">${result?.progressPct || 0}%</td></tr>
  </table>
  ${result?.hoursRemaining > 0 ? `
  <p style="margin:8px 0 0; font-size:12px; color:#888; text-transform:uppercase; letter-spacing:1px;">Projected Completion</p>
  <p style="margin:4px 0; font-size:18px; font-weight:900; color:#1a4731;">~${completionDateStr}</p>
  <p style="margin:0; font-size:12px; color:#666;">At ${hoursPerWeek} hrs/week — ${result?.weeksRemaining} weeks from today</p>
  ` : ""}
  ${result?.belowMinimum ? `
  <p style="margin:12px 0 0; font-size:13px; color:#c0392b; background:#fdf0ef; padding:8px 12px; border-radius:4px;">
    Your supervision rate is below the BACB minimum of 5%. Talk to your supervisor about increasing supervised hours.
  </p>
  ` : `
  <p style="margin:12px 0 0; font-size:13px; color:#555;">
    Monthly supervision needed: <strong>${result?.minSupervisionHours || 1} hrs/month</strong> (BACB 5% minimum)
  </p>
  `}
</div>

<h3 style="font-family:sans-serif; color:#1a4731; margin-top:32px;">Preparing for your RBT exam?</h3>
<p>SchoolRBT.com has 500+ practice questions built specifically for school settings.</p>
<p>
  <a href="https://rbtstudy.behaviorschool.com" style="display:inline-block; background:#1a4731; color:white; padding:12px 24px; border-radius:6px; text-decoration:none; font-family:sans-serif; font-weight:600;">
    Try SchoolRBT Free →
  </a>
</p>

<hr style="border:none; border-top:1px solid #eee; margin:40px 0;">
<p style="font-size:13px; color:#888;">
  Rob Spain, BCBA, IBA<br>
  BehaviorSchool<br>
  <a href="https://behaviorschool.com" style="color:#888;">behaviorschool.com</a>
</p>
<p style="font-size:12px; color:#aaa;">You're receiving this because you used the RBT Hours Calculator at BehaviorSchool. <a href="#" style="color:#aaa;">Unsubscribe</a></p>

</body>
</html>
    `;

    const recipients = [email];
    if (supervisorEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supervisorEmail)) {
      recipients.push(supervisorEmail);
    }

    const { error } = await resend.emails.send({
      from: "Rob Spain, BCBA <rob@behaviorschool.com>",
      to: recipients,
      subject: "Your RBT Supervision Hour Summary — BehaviorSchool",
      html: htmlBody,
      text: `${name ? `Hi ${name.split(" ")[0]},` : "Hi,"}

Here's your RBT supervision hour summary.

PATHWAY: ${result?.pathway || "RBT"}
Hours completed: ${result?.hoursCompleted?.toLocaleString() || 0}
Hours required: ${result?.hoursRequired?.toLocaleString() || 1500}
Hours remaining: ${result?.hoursRemaining?.toLocaleString() || 0}
Progress: ${result?.progressPct || 0}%
Projected completion: ${completionDateStr}
Monthly supervision needed: ${result?.minSupervisionHours || 1} hrs/month

${result?.belowMinimum ? "WARNING: Your supervision rate is below the BACB minimum of 5%." : ""}

PREPARING FOR YOUR RBT EXAM?
https://rbtstudy.behaviorschool.com

—
Rob Spain, BCBA, IBA
behaviorschool.com`,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("RBT hours signup error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
