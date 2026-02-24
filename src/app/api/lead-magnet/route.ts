import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const checklistItems = [
  "Define caseload tiers by intensity and service minutes.",
  "Maintain a live caseload dashboard updated weekly.",
  "Use a referral intake form with required operational definitions.",
  "Confirm referral data with baseline observations within 10 days.",
  "Screen referrals for function and severity before full FBA.",
  "Document teacher strategies tried prior to referral.",
  "Set clear criteria for when to initiate an FBA.",
  "Use interview, record review, and direct observation as the standard triad.",
  "Select assessment tools aligned to suspected function.",
  "Summarize FBA hypotheses in a one-page format for teams.",
  "Review the hypothesis with stakeholders before BIP drafting.",
  "Align replacement behaviors with function and student skill level.",
  "Build BIP steps that can be implemented in natural routines.",
  "Define antecedent strategies tied to environmental variables.",
  "Specify teaching procedures with measurable steps.",
  "Include reinforcement systems that are feasible for staff.",
  "Plan for generalization across settings and staff.",
  "Embed safety and crisis protocols where needed.",
  "Ensure BIP goals align with IEP goals.",
  "Integrate BIP progress monitoring into IEP reporting cycles.",
  "Use operational definitions for all target and replacement behaviors.",
  "Collect baseline data for at least three sessions prior to intervention.",
  "Choose data systems (frequency, duration, latency, interval) by behavior type.",
  "Train staff on data collection with fidelity checks.",
  "Graph data weekly and review for trend and level.",
  "Schedule routine BIP review meetings every 4-6 weeks.",
  "Use treatment integrity checklists twice monthly.",
  "Define decision rules for changing interventions.",
  "Maintain parent or guardian communication logs.",
  "Coordinate with related services to avoid conflicting plans.",
  "Map supports to MTSS tiers and document rationale.",
  "Use universal supports before moving to targeted supports.",
  "Identify classroom systems that reduce referral volume.",
  "Set response timelines for each tier of support.",
  "Create clear role descriptions for each team member.",
  "Provide teacher-friendly one-page implementation guides.",
  "Document consent and data privacy procedures.",
  "Keep all documents in a secure, centralized location.",
  "Track meeting minutes with action items and owners.",
  "Include culturally responsive practices in assessment and planning.",
  "Establish professional boundaries for availability and crisis response.",
  "Use supervision time to build staff competency, not just case updates.",
  "Align intervention plans with district policy and legal requirements.",
  "Prepare summary reports for admin that show outcomes and ROI.",
  "Review behavior support plans at student transition points.",
  "Maintain a personal workload cap and escalation process.",
  "Schedule professional development on priority skill gaps."
];

export async function POST(request: NextRequest) {
  try {
    const { email, lead_type } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    if (lead_type !== "transformation_checklist") {
      return NextResponse.json({ error: "Invalid lead type" }, { status: 400 });
    }

    const checklistHtml = checklistItems
      .map((item) => `<li style="margin-bottom: 8px;">${item}</li>`)
      .join("");

    const { error } = await resend.emails.send({
      from: "Behavior School <hello@updates.behaviorschool.com>",
      to: [email],
      subject: "Your BCBA School Systems Checklist is here",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #0f172a;">
          <h1 style="color: #1f4d3f; margin-bottom: 12px;">BCBA School Systems Checklist</h1>
          <p style="font-size: 16px; line-height: 1.6;">
            Here is your 47-point checklist for building sustainable, evidence-based behavior systems in schools.
          </p>
          <ol style="padding-left: 18px; font-size: 15px; line-height: 1.6; color: #334155;">
            ${checklistHtml}
          </ol>
          <div style="margin-top: 28px; padding: 16px; background: #f8fafc; border-left: 4px solid #e4b63d;">
            <p style="margin: 0; font-size: 14px; color: #334155;">
              If you want live coaching, templates, and implementation support, the 6-week Transformation cohort is built for school-based BCBAs.
            </p>
          </div>
          <p style="margin-top: 24px; font-size: 13px; color: #64748b;">
            You are receiving this because you requested the checklist at behaviorschool.com.
          </p>
        </div>
      `
    });

    if (error) {
      console.error("Lead magnet email failed:", error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead magnet API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
