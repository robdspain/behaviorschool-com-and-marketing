export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { api, getConvexClient } from "@/lib/convex";

function toSurveyRow(response: any) {
  return {
    id: response._id,
    survey_slug: response.surveySlug,
    role: response.role,
    role_other: response.roleOther ?? null,
    school_setting: response.schoolSetting,
    school_setting_other: response.schoolSettingOther ?? null,
    state: response.state ?? null,
    years_in_schools: response.yearsInSchools,
    caseload_range: response.caseloadRange,
    schools_served_range: response.schoolsServedRange,
    weekly_hours_range: response.weeklyHoursRange,
    workload_rating: response.workloadRating,
    burnout_frequency: response.burnoutFrequency,
    activity_allocation: response.activityAllocation,
    challenge_areas: response.challengeAreas,
    supports_needed: response.supportsNeeded,
    additional_notes: response.additionalNotes ?? null,
    referral_source: response.referralSource ?? null,
    wants_results: response.wantsResults,
    consent_to_contact: response.consentToContact,
    first_name: response.firstName ?? null,
    last_name: response.lastName ?? null,
    email: response.email ?? null,
    created_at: response.createdAt,
    updated_at: response.updatedAt,
  };
}

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit") || 250);
    const responses = await getConvexClient().query(api.schoolBcbaSurvey.listResponses, {
      surveySlug: "2026-school-bcba-burnout-workload",
      limit: Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 1000) : 250,
    });

    return NextResponse.json({ responses: (responses || []).map(toSurveyRow) });
  } catch (error) {
    console.error("Error fetching school BCBA survey responses:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
