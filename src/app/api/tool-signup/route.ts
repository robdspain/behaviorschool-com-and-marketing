export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { RESEND_FROM_ROB, RESEND_REPLY_TO_ROB } from '@/lib/resend';

const TOOL_CONFIGS: Record<string, { subject: string; toolName: string; toolUrl: string }> = {
  "act-matrix-builder": {
    subject: "Your ACT Matrix link",
    toolName: "ACT Matrix Builder",
    toolUrl: "https://behaviorschool.com/act-matrix-builder",
  },
  "iep-goal-writer": {
    subject: "Your IEP behavior goals link",
    toolName: "IEP Behavior Goal Writer",
    toolUrl: "https://behaviorschool.com/iep-goal-writer",
  },
};

export async function POST(req: NextRequest) {
  try {
    const { name, email, tool } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const config = TOOL_CONFIGS[tool] || {
      subject: "Your BehaviorSchool tool link",
      toolName: "BehaviorSchool Tool",
      toolUrl: "https://behaviorschool.com",
    };

    const resend = new Resend(process.env.RESEND_API_KEY);
    const firstName = name?.split(" ")[0] || "";

    await resend.emails.send({
      from: RESEND_FROM_ROB,
      to: [email],
      replyTo: RESEND_REPLY_TO_ROB,
      subject: config.subject,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1a1a; line-height: 1.7;">

<p>${firstName ? `Hi ${firstName},` : "Hi,"}</p>

<p>Here is the link for the <strong>${config.toolName}</strong>. Save it if you want to run it again for another student:</p>
<p><a href="${config.toolUrl}" style="color:#1a4731; font-weight:600;">${config.toolUrl}</a></p>

<p>If something worked well or felt off, reply and tell me. That feedback is useful.</p>

<h3 style="font-family: sans-serif; color: #1a4731; margin-top: 32px;">Want to go deeper?</h3>
<p>I'm running a 6-week cohort for school BCBAs starting August 12. We cover assessment, BIP design, implementation, and team training in a structured way.</p>
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
</body>
</html>`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("tool-signup error:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
