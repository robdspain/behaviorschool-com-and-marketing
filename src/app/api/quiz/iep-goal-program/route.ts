export const dynamic = "force-dynamic";

/**
 * Quiz 01: IEP goal program check
 *
 * Storage (Convex marketing deployment):
 * - Table `iepGoalProgramQuizResponses`: full answers + email + priorityAccess
 * - Table `crmContacts`: upsert with replaced quiz_* / result_band tags on retake
 * - Newsletter: ONLY when Priority Access is opted in on this submit (not tip-only)
 * - Transformation nurture: when Priority Access is newly checked (idempotent upgrade)
 *
 * Deploy note: push schema + iepGoalProgramQuiz functions to marketing Convex after merge.
 */

import { NextRequest, NextResponse } from "next/server";
import { api, getConvexClient } from "@/lib/convex";
import { subscribeToNewsletter } from "@/lib/convex-newsletter";
import { startTransformationNurture } from "@/lib/transformation-nurture";

const QUIZ_SLUG = "iep-goal-program";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BODY_BYTES = 8_000;

const allowed = {
  quizRole: new Set([
    "school_bcba",
    "behavior_specialist",
    "school_psychologist",
    "other",
  ]),
  quizSetting: new Set([
    "preschool_early_childhood",
    "elementary",
    "middle",
    "high_school",
    "mixed_multiple",
    "other",
  ]),
  quizRunnable: new Set(["yes", "sometimes", "no"]),
  quizChallenge: new Set([
    "goal_writing",
    "making_datasheets",
    "staff_coaching",
    "fielding_referrals",
  ]),
} as const;

function cleanString(value: unknown, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function cleanOptional(value: unknown, max = 200) {
  const cleaned = cleanString(value, max);
  return cleaned || undefined;
}

function requireAllowed(
  body: Record<string, unknown>,
  key: keyof typeof allowed
) {
  const value = cleanString(body[key], 80);
  if (!allowed[key].has(value)) {
    throw new Error(`Invalid ${key}`);
  }
  return value;
}

export async function POST(request: NextRequest) {
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json(
        { error: "Request payload is too large." },
        { status: 413 }
      );
    }

    let body: Record<string, unknown>;
    try {
      body = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    if (body === null || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const email = cleanOptional(body.email, 320)?.toLowerCase();
    const name = cleanOptional(body.name, 120);
    const priorityAccess =
      body.priorityAccess === true || body.priority_access === true;

    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    const quizRole = requireAllowed(body, "quizRole");
    const quizSetting = requireAllowed(body, "quizSetting");
    const quizRunnable = requireAllowed(body, "quizRunnable");
    const quizChallenge = requireAllowed(body, "quizChallenge");
    const page =
      cleanOptional(body.page, 400) ||
      request.headers.get("referer") ||
      "/quiz/iep-goal-program";
    const userAgent = request.headers.get("user-agent") || undefined;

    const result = await getConvexClient().mutation(
      api.iepGoalProgramQuiz.createResponse,
      {
        quizSlug: QUIZ_SLUG,
        quizRole,
        quizSetting,
        quizRunnable,
        quizChallenge,
        name,
        email,
        priorityAccess,
        page,
        userAgent,
      }
    );

    const tags = [
      "iep-goal-program-quiz",
      "quiz-01",
      `quiz_role:${quizRole}`,
      `quiz_setting:${quizSetting}`,
      `quiz_runnable:${quizRunnable}`,
      `quiz_challenge:${quizChallenge}`,
      `result_band:${result.resultBand}`,
    ];
    if (result.priorityAccess) {
      tags.push("priority_access", "transformation-program");
    }

    // Tip-only submits do NOT join the newsletter. Only explicit Priority Access opt-in.
    if (priorityAccess) {
      try {
        await subscribeToNewsletter({
          email,
          name: name || email.split("@")[0] || "Quiz lead",
          source: "iep-goal-program-quiz",
          page,
          tags,
        });
      } catch (error) {
        console.error("Newsletter subscribe failed for IEP goal quiz:", error);
      }
    }

    if (result.shouldStartNurture) {
      try {
        await startTransformationNurture({
          email,
          name,
          role: quizRole === "school_bcba" ? "School BCBA" : quizRole,
          source: "iep_goal_program_quiz",
          tags: Array.from(new Set([...tags, "priority_access"])),
          notes: `Priority Access from IEP goal program quiz. Band: ${result.resultBand}. Challenge: ${quizChallenge}.`,
          metadata: {
            quizResponseId: result.responseId,
            quiz_role: quizRole,
            quiz_setting: quizSetting,
            quiz_runnable: quizRunnable,
            quiz_challenge: quizChallenge,
            result_band: result.resultBand,
            priority_access: true,
          },
        });
      } catch (error) {
        console.error(
          "Unable to start Transformation nurture from IEP goal quiz:",
          error
        );
      }
    }

    return NextResponse.json({
      ok: true,
      id: result.responseId,
      resultBand: result.resultBand,
      priorityAccess: result.priorityAccess,
    });
  } catch (error) {
    console.error("iep-goal-program quiz submission error:", error);
    const message = error instanceof Error ? error.message : "";
    if (
      message.startsWith("Invalid ") ||
      message.includes("wait a moment") ||
      message.includes("Too many submissions")
    ) {
      const status = message.includes("Too many submissions") ? 429 : 400;
      return NextResponse.json({ error: message }, { status });
    }
    return NextResponse.json(
      { error: "Unable to save your quiz response." },
      { status: 500 }
    );
  }
}
