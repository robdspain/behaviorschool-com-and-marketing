export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { api, getConvexClient } from "@/lib/convex";
import { startTransformationNurture } from "@/lib/transformation-nurture";

const SURVEY_SLUG = "2026-school-bcba-burnout-workload";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const allowed = {
  role: new Set(["bcba", "bcaba", "bcba_d", "student_analyst", "other"]),
  schoolSetting: new Set([
    "public_district",
    "charter_school",
    "nonpublic_school",
    "private_school",
    "clinic_school",
    "multiple_settings",
    "other",
  ]),
  yearsInSchools: new Set(["0_1", "2_4", "5_9", "10_plus"]),
  caseloadRange: new Set(["0_10", "11_20", "21_30", "31_40", "41_plus", "not_applicable"]),
  schoolsServedRange: new Set(["1", "2", "3", "4_plus", "not_applicable"]),
  weeklyHoursRange: new Set(["under_40", "40_45", "46_50", "51_60", "over_60"]),
  workloadRating: new Set(["much_too_high", "somewhat_too_high", "about_right", "somewhat_too_low", "much_too_low"]),
  burnoutFrequency: new Set(["rarely", "sometimes", "often", "daily_or_nearly_daily"]),
  challengeAreas: new Set([
    "caseload_size",
    "documentation",
    "meetings",
    "travel_scheduling",
    "crisis_response",
    "staff_buy_in",
    "materials_resources",
    "administrative_tasks",
    "role_clarity",
    "other",
  ]),
  allocation: new Set(["0_10", "11_25", "26_40", "41_60", "61_plus", "not_applicable"]),
};

function cleanString(value: unknown, max = 2000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function cleanOptional(value: unknown, max = 500) {
  const cleaned = cleanString(value, max);
  return cleaned || undefined;
}

function requireAllowed(body: Record<string, unknown>, key: keyof typeof allowed) {
  const value = cleanString(body[key], 120);
  if (!allowed[key].has(value)) {
    throw new Error(`Invalid ${key}`);
  }
  return value;
}

function cleanAllocation(value: unknown) {
  const input = typeof value === "object" && value !== null ? value as Record<string, unknown> : {};
  const output: Record<string, string | undefined> = {};

  for (const key of [
    "directStudentSupport",
    "documentation",
    "meetingsConsultation",
    "assessments",
    "staffTraining",
    "travelScheduling",
    "crisisResponse",
    "other",
  ]) {
    const raw = cleanString(input[key], 40);
    output[key] = allowed.allocation.has(raw) ? raw : undefined;
  }

  return output;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const challengeAreas = Array.isArray(body.challengeAreas)
      ? body.challengeAreas
          .map((item) => cleanString(item, 120))
          .filter((item) => allowed.challengeAreas.has(item))
          .slice(0, 3)
      : [];
    const supportsNeeded = cleanString(body.supportsNeeded, 2500);
    const wantsResults = body.wantsResults === true;
    const consentToContact = body.consentToContact === true;
    const firstName = cleanOptional(body.firstName, 120);
    const lastName = cleanOptional(body.lastName, 120);
    const email = cleanOptional(body.email, 320)?.toLowerCase();

    if (!challengeAreas.length) {
      return NextResponse.json({ error: "Choose at least one challenge area." }, { status: 400 });
    }

    if (supportsNeeded.length < 10) {
      return NextResponse.json({ error: "Please add a short note about support needs." }, { status: 400 });
    }

    if ((wantsResults || consentToContact || email) && (!email || !emailRegex.test(email))) {
      return NextResponse.json({ error: "Enter a valid email address or leave contact fields blank." }, { status: 400 });
    }

    if (consentToContact && (!firstName || !email)) {
      return NextResponse.json({ error: "First name and email are required for follow-up." }, { status: 400 });
    }

    const id = await getConvexClient().mutation(api.schoolBcbaSurvey.createResponse, {
      surveySlug: SURVEY_SLUG,
      role: requireAllowed(body, "role"),
      roleOther: cleanOptional(body.roleOther, 200),
      schoolSetting: requireAllowed(body, "schoolSetting"),
      schoolSettingOther: cleanOptional(body.schoolSettingOther, 200),
      state: cleanOptional(body.state, 80),
      yearsInSchools: requireAllowed(body, "yearsInSchools"),
      caseloadRange: requireAllowed(body, "caseloadRange"),
      schoolsServedRange: requireAllowed(body, "schoolsServedRange"),
      weeklyHoursRange: requireAllowed(body, "weeklyHoursRange"),
      workloadRating: requireAllowed(body, "workloadRating"),
      burnoutFrequency: requireAllowed(body, "burnoutFrequency"),
      activityAllocation: cleanAllocation(body.activityAllocation),
      challengeAreas,
      supportsNeeded,
      additionalNotes: cleanOptional(body.additionalNotes, 2500),
      referralSource: cleanOptional(body.referralSource, 200),
      wantsResults,
      consentToContact,
      firstName,
      lastName,
      email,
    });

    if (consentToContact && email) {
      try {
        await startTransformationNurture({
          email,
          firstName,
          lastName,
          role: cleanString(body.role, 120),
          source: "school_bcba_survey",
          tags: ["school-bcba-survey", "transformation-program"],
          notes: `School BCBA survey opt-in. Challenge areas: ${challengeAreas.join(", ")}.`,
          metadata: {
            surveyResponseId: id,
            challengeAreas,
            workloadRating: cleanString(body.workloadRating, 120),
            burnoutFrequency: cleanString(body.burnoutFrequency, 120),
          },
        });
      } catch (error) {
        console.error("Unable to start Transformation nurture from school BCBA survey:", error);
      }
    }

    return NextResponse.json({ ok: true, id });
  } catch (error) {
    console.error("school-bcba-survey submission error:", error);
    return NextResponse.json({ error: "Unable to save this survey response." }, { status: 500 });
  }
}
