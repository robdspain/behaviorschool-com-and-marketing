export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { name, email, studentName, grade, result, observationCount } = await req.json();

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

    const functionLabel = result?.function
      ? result.function.charAt(0).toUpperCase() + result.function.slice(1)
      : "Unknown";
    const studentLabel = studentName || "Your Student";
    const gradeLabel = grade || "";

    const { error } = await resend.emails.send({
      from: "Rob Spain, BCBA <rob@behaviorschool.com>",
      to: [email],
      subject: "Your ABC Function Analysis — BehaviorSchool",
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1a1a; line-height: 1.7;">

<p>${name ? `Hi ${name.split(" ")[0]},` : "Hi,"}</p>

<p>Here's your ABC function analysis from BehaviorSchool.</p>

<div style="background:#f8f9fa; border-left:4px solid #1a4731; padding:16px 20px; margin:24px 0; border-radius:4px;">
  <p style="margin:0 0 4px; font-size:12px; color:#888; text-transform:uppercase; letter-spacing:1px; font-family:sans-serif;">Function Hypothesis Report</p>
  <p style="margin:0 0 4px; font-size:13px; color:#555; font-family:sans-serif;">Student: <strong>${studentLabel}</strong>${gradeLabel ? ` | Grade: <strong>${gradeLabel}</strong>` : ""}</p>
  <p style="margin:0 0 12px; font-size:13px; color:#555; font-family:sans-serif;">Observations analyzed: <strong>${observationCount || "?"}</strong></p>
  <p style="margin:0 0 4px; font-size:13px; font-family:sans-serif; color:#555; text-transform:uppercase; letter-spacing:1px;">Hypothesized Function</p>
  <p style="margin:0 0 4px; font-size:28px; font-weight:900; color:#1a4731; font-family:sans-serif;">${functionLabel.toUpperCase()}</p>
  <p style="margin:0; font-size:13px; color:#555; font-family:sans-serif;">Confidence: <strong>${result?.confidence ?? "?"}%</strong></p>
</div>

<h3 style="font-family:sans-serif; color:#1a4731; margin-top:32px;">Next Step: ACT-Informed FBA</h3>
<p>This analysis identifies the function. To build a complete, values-aligned BIP, use the ACT-Informed FBA Generator — free, no account required.</p>
<p>
  <a href="https://behaviorschool.com/act-fba-bip" style="display:inline-block; background:#1a4731; color:white; padding:12px 24px; border-radius:6px; text-decoration:none; font-family:sans-serif; font-weight:600;">
    Try the ACT-FBA Tool →
  </a>
</p>

<h3 style="font-family:sans-serif; color:#1a4731; margin-top:32px;">The School BCBA Transformation Program</h3>
<p>Want to implement this systematically with your whole team? I'm running a 6-week cohort for school-based BCBAs starting March 26.</p>
<ul style="color:#555; font-size:15px;">
  <li>6 sessions — Thursdays, 6–8 PM Pacific</li>
  <li>March 26 – May 7, 2026</li>
  <li>Maximum 20 participants</li>
  <li>Early bird: $2,499 through March 21</li>
</ul>
<p>
  <a href="https://behaviorschool.com/transformation-program" style="display:inline-block; background:#e4b63d; color:#1a1a1a; padding:12px 24px; border-radius:6px; text-decoration:none; font-family:sans-serif; font-weight:600;">
    Learn More →
  </a>
</p>

<hr style="border:none; border-top:1px solid #eee; margin:40px 0;">
<p style="font-size:13px; color:#888;">
  Rob Spain, BCBA, IBA<br>
  BehaviorSchool<br>
  <a href="https://behaviorschool.com" style="color:#888;">behaviorschool.com</a>
</p>
<p style="font-size:12px; color:#aaa;">You're receiving this because you used the ABC Function Finder at BehaviorSchool. <a href="#" style="color:#aaa;">Unsubscribe</a></p>

</body>
</html>
      `,
      text: `${name ? `Hi ${name.split(" ")[0]},` : "Hi,"}

Here's your ABC function analysis from BehaviorSchool.

FUNCTION HYPOTHESIS REPORT
Student: ${studentLabel}${gradeLabel ? ` | Grade: ${gradeLabel}` : ""}
Observations analyzed: ${observationCount || "?"}

Hypothesized Function: ${functionLabel.toUpperCase()}
Confidence: ${result?.confidence ?? "?"}%

NEXT STEP: ACT-INFORMED FBA
https://behaviorschool.com/act-fba-bip

THE SCHOOL BCBA TRANSFORMATION PROGRAM
6 weeks starting March 26. Early bird $2,499 through March 21.
https://behaviorschool.com/transformation-program

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
    console.error("ABC signup error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
