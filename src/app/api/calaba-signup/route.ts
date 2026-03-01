export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { name, email, subscribeNewsletter } = await req.json();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Add to Resend Contacts (audience)
    // Audience ID for CalABA leads - create one called "CalABA 2026" in Resend dashboard
    // or use the contacts API without audience
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
      // Don't fail the whole request if contact creation fails
    }

    // Send welcome email immediately
    const { error } = await resend.emails.send({
      from: "Rob Spain, BCBA <rob@behaviorschool.com>",
      to: [email],
      subject: "Here's the ACT-FBA tool from today's talk",
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1a1a; line-height: 1.7;">

<p>${name ? `Hi ${name.split(" ")[0]},` : "Hi,"}</p>

<p>Thank you for attending the session today. Here's everything I promised:</p>

<h3 style="font-family: sans-serif; color: #1a4731; margin-top: 32px;">The ACT-Informed FBA Tool</h3>
<p>This is the tool I demonstrated — it walks you through a complete, ACT-informed FBA and generates a printable BIP. Free, no account required.</p>
<p>
  <a href="https://behaviorschool.com/act-fba-bip" style="display:inline-block; background:#1a4731; color:white; padding:12px 24px; border-radius:6px; text-decoration:none; font-family:sans-serif; font-weight:600;">
    Try the ACT-FBA Tool →
  </a>
</p>
<p style="font-size:14px; color:#555;">Tip: Click "Load Sample Case" to see a pre-filled 7th-grade escape case and jump straight to the output.</p>

<h3 style="font-family: sans-serif; color: #1a4731; margin-top: 32px;">Presentation References</h3>
<p>All citations from today's talk are on the session page:</p>
<p><a href="https://behaviorschool.com/calaba-2026" style="color:#1a4731;">behaviorschool.com/calaba-2026</a></p>

<h3 style="font-family: sans-serif; color: #1a4731; margin-top: 32px;">The School BCBA Transformation Program</h3>
<p>If today's content resonated with you, I'm running a 6-week cohort starting March 26 for school-based BCBAs who want to implement this systematically with their teams.</p>
<ul style="color:#555; font-size:15px;">
  <li>6 sessions — Thursdays, 6–8 PM Pacific</li>
  <li>March 26 – May 7, 2026</li>
  <li>Maximum 20 participants</li>
  <li>Early bird: $2,499 through March 21 (then $2,997)</li>
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
<p style="font-size:12px; color:#aaa;">You're receiving this because you signed up at a CalABA 2026 session. <a href="#" style="color:#aaa;">Unsubscribe</a></p>

</body>
</html>
      `,
      text: `${name ? `Hi ${name.split(" ")[0]},` : "Hi,"}

Thank you for attending the session today. Here's everything I promised:

THE ACT-INFORMED FBA TOOL
https://behaviorschool.com/act-fba-bip
(Click "Load Sample Case" to jump straight to the output)

PRESENTATION REFERENCES
https://behaviorschool.com/calaba-2026

THE SCHOOL BCBA TRANSFORMATION PROGRAM
6 weeks, Thursdays 6–8 PM Pacific, March 26 – May 7
Early bird: $2,499 through March 21
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
    console.error("CalABA signup error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
