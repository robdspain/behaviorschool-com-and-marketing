export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { RESEND_FROM_ROB, RESEND_REPLY_TO_ROB } from '@/lib/resend';

export async function POST(req: NextRequest) {
  try {
    const { name, email } = await req.json();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const firstName = name?.split(" ")[0] || "";

    await resend.emails.send({
      from: RESEND_FROM_ROB,
      to: [email],
      replyTo: RESEND_REPLY_TO_ROB,
      subject: "Your ACT-informed BIP link",
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1a1a; line-height: 1.7;">

<p>${firstName ? `Hi ${firstName},` : "Hi,"}</p>

<p>Your ACT-informed FBA and BIP link is below. You can come back to the tool when you need to run another case.</p>

<p>One quick question: <strong>what felt useful, and what felt clunky?</strong> Reply directly to this email. I read those notes and use them to improve the tool.</p>

<h3 style="font-family: sans-serif; color: #1a4731; margin-top: 32px;">Bookmark the tool</h3>
<p>You can run this for any student, anytime:</p>
<p><a href="https://behaviorschool.com/act-fba-bip" style="color:#1a4731; font-weight:600;">behaviorschool.com/act-fba-bip</a></p>

<h3 style="font-family: sans-serif; color: #1a4731; margin-top: 32px;">Want to go deeper?</h3>
<p>If this framework fits the kind of work you are trying to do, I'm running a 6-week cohort for school BCBAs starting August 12. We cover assessment, BIP design, implementation, and team training.</p>
<ul style="color:#555; font-size:15px; line-height:2;">
  <li>6 sessions — weekly, 6–8 PM Pacific</li>
  <li>August 12 – September 16, 2026</li>
  <li>Maximum 12 participants</li>
  <li>Founding tuition: $1,997</li>
</ul>
<p>
  <a href="https://behaviorschool.com/transformation-program" style="display:inline-block; background:#1a4731; color:white; padding:12px 24px; border-radius:6px; text-decoration:none; font-family:sans-serif; font-weight:600;">
    See the cohort
  </a>
</p>

<hr style="border:none; border-top:1px solid #eee; margin:40px 0;">
<p style="font-size:13px; color:#888;">Rob Spain, BCBA, IBA · BehaviorSchool · <a href="https://behaviorschool.com" style="color:#888;">behaviorschool.com</a></p>
<p style="font-size:12px; color:#aaa;">You're receiving this because you used the ACT-FBA tool. <a href="mailto:support@behaviorschool.com?subject=Unsubscribe" style="color:#aaa;">Unsubscribe</a></p>
</body>
</html>`,
      text: `${firstName ? `Hi ${firstName},` : "Hi,"}

Your ACT-informed FBA and BIP link is below. You can come back to the tool when you need to run another case.

One quick question: what felt useful, and what felt clunky? Reply to this email - I read those notes.

BOOKMARK THE TOOL: https://behaviorschool.com/act-fba-bip

WANT TO GO DEEPER?
School BCBA Transformation Program — 6 weeks starting August 12.
Weekly 6–8 PM Pacific · Max 12 participants · Founding tuition $1,997
https://behaviorschool.com/transformation-program

—
Rob Spain, BCBA, IBA · BehaviorSchool`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("FBA tool signup error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
