export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const TOOL_CONFIGS: Record<string, { subject: string; toolName: string; toolUrl: string }> = {
  "act-matrix-builder": {
    subject: "Your ACT Matrix — save this link",
    toolName: "ACT Matrix Builder",
    toolUrl: "https://behaviorschool.com/act-matrix-builder",
  },
  "caseload-analyzer": {
    subject: "Your BCBA Caseload Analysis Results",
    toolName: "BCBA Caseload Analyzer",
    toolUrl: "https://behaviorschool.com/caseload-analyzer",
  },
  "iep-goal-writer": {
    subject: "Your IEP Behavior Goals — save this link",
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
      subject: "Thanks for using BehaviorSchool tools",
      toolName: "BehaviorSchool Tool",
      toolUrl: "https://behaviorschool.com",
    };

    const resend = new Resend(process.env.RESEND_API_KEY);
    const firstName = name?.split(" ")[0] || "";

    await resend.emails.send({
      from: "Rob Spain, BCBA <rob@behaviorschool.com>",
      to: [email],
      subject: config.subject,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1a1a; line-height: 1.7;">

<p>${firstName ? `Hi ${firstName},` : "Hi,"}</p>

<p>Your results from the <strong>${config.toolName}</strong> are ready. Bookmark this link to run it again for any student:</p>
<p><a href="${config.toolUrl}" style="color:#1a4731; font-weight:600;">${config.toolUrl}</a></p>

<p>I'd love to hear how it went — just reply to this email.</p>

<h3 style="font-family: sans-serif; color: #1a4731; margin-top: 32px;">Want to go deeper?</h3>
<p>I'm running a 6-week cohort for school-based BCBAs starting March 26. We cover assessment, BIP design, implementation, and team training — systematically.</p>
<ul style="color:#555; font-size:15px; line-height:2;">
  <li>6 sessions — Thursdays, 6–8 PM Pacific</li>
  <li>March 26 – May 7, 2026</li>
  <li>Maximum 20 participants</li>
  <li>Early bird: $2,499 through March 21</li>
</ul>
<p>
  <a href="https://behaviorschool.com/transformation-program" style="display:inline-block; background:#1a4731; color:white; padding:12px 24px; border-radius:6px; text-decoration:none; font-family:sans-serif; font-weight:600;">
    Learn More →
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
