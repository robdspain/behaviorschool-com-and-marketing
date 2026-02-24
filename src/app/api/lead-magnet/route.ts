export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const STUDY_PLAN = [
  { day: 1, topic: "Measurement", hours: 4 },
  { day: 2, topic: "Experimental Design", hours: 3 },
  { day: 3, topic: "Behavior Assessment", hours: 4 },
  { day: 4, topic: "Behavior Change Procedures", hours: 5 },
  { day: 5, topic: "Personnel Supervision", hours: 3 },
  { day: 6, topic: "Ethics", hours: 4 },
  { day: 7, topic: "Full Mock Exam", hours: 6 },
];

function buildPlanRows(): string {
  return STUDY_PLAN.map(
    ({ day, topic, hours }) => `
    <tr>
      <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;">
        <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:#1f4d3f;color:#fff;font-size:12px;font-weight:700;">${day}</span>
      </td>
      <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;font-weight:600;color:#0f172a;">Day ${day}: ${topic}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;color:#64748b;text-align:right;">${hours} hrs</td>
    </tr>`
  ).join("");
}

export async function POST(request: NextRequest) {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    return NextResponse.json({ success: false, error: "RESEND_API_KEY not configured" }, { status: 500 });
  }
  const resend = new Resend(resendApiKey);
  try {
    const body = await request.json();

    // Support both old transformation-checklist shape and new study-plan shape
    const { name, email, role, lead_type } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    // Legacy: transformation checklist — keep working
    if (lead_type === "transformation_checklist") {
      const { error } = await resend.emails.send({
        from: "Behavior School <hello@updates.behaviorschool.com>",
        replyTo: "hello@behaviorschool.com",
        to: [email],
        subject: "Your BCBA School Systems Checklist is here",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#0f172a;">
            <h1 style="color:#1f4d3f;">BCBA School Systems Checklist</h1>
            <p style="font-size:16px;line-height:1.6;">The 47-point checklist used by high-impact BCBAs to build sustainable school behavior systems.</p>
            <div style="margin-top:24px;padding:16px;background:#f8fafc;border-left:4px solid #e4b63d;">
              <p style="margin:0;font-size:14px;color:#334155;">
                Want live coaching and implementation support? The 6-week Transformation cohort is built for school-based BCBAs.
              </p>
              <a href="https://behaviorschool.com/transformation-program" style="display:inline-block;margin-top:12px;padding:10px 20px;background:#1f4d3f;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Learn More →</a>
            </div>
          </div>
        `,
      });
      if (error) {
        console.error("Lead magnet email failed:", error);
        return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
      }
      return NextResponse.json({ success: true });
    }

    // New: 7-day study plan
    const firstName = name ? name.split(" ")[0] : "there";

    const { error } = await resend.emails.send({
      from: "Behavior School <hello@updates.behaviorschool.com>",
      replyTo: "hello@behaviorschool.com",
      to: [email],
      subject: "Your Free 7-Day BCBA Study Plan",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#0f172a;">
          <div style="background:linear-gradient(135deg,#123628,#1f4d3f);padding:36px 32px;border-radius:12px 12px 0 0;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:26px;font-weight:800;letter-spacing:-0.5px;">Your Free 7-Day BCBA Study Plan</h1>
            <p style="color:#e4b63d;margin:8px 0 0;font-size:15px;font-weight:600;">BACB-aligned · Structured · Ready to go</p>
          </div>

          <div style="background:#ffffff;padding:32px;border:1px solid #e2e8f0;border-top:none;">
            <p style="font-size:16px;line-height:1.7;color:#334155;margin-top:0;">
              Hi ${firstName}, here is your personalized 7-day study schedule. Stick to it and you'll cover every major BCBA domain before exam day.
            </p>

            <table style="width:100%;border-collapse:collapse;margin-top:20px;font-size:14px;">
              <thead>
                <tr style="background:#f8fafc;">
                  <th style="padding:10px 14px;text-align:left;color:#64748b;font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">#</th>
                  <th style="padding:10px 14px;text-align:left;color:#64748b;font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Topic</th>
                  <th style="padding:10px 14px;text-align:right;color:#64748b;font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Study Time</th>
                </tr>
              </thead>
              <tbody>
                ${buildPlanRows()}
              </tbody>
            </table>

            <div style="margin-top:28px;padding:20px 24px;background:#fff7dd;border:1px solid #f0e2bf;border-radius:12px;">
              <p style="margin:0 0 8px;font-size:15px;font-weight:700;color:#1f4d3f;">Ready to start studying?</p>
              <p style="margin:0 0 16px;font-size:14px;color:#334155;line-height:1.6;">
                BehaviorSchool has hundreds of BCBA practice questions, mock exams, and fluency drills — all BACB-aligned.
              </p>
              <a href="https://study.behaviorschool.com" style="display:inline-block;padding:12px 24px;background:#1f4d3f;color:#fff;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;">
                Start Studying Now →
              </a>
            </div>
          </div>

          <div style="background:#f8fafc;padding:20px 32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;">
            <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6;">
              You're receiving this because you requested a free study plan at behaviorschool.com.
              <br />Reply to this email if you have questions — we read every one.
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Lead magnet email failed:", error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Lead magnet API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
