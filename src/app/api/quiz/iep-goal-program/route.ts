export const dynamic = "force-dynamic";

/**
 * Quiz 01: IEP goal program check
 *
 * Storage (Convex marketing deployment):
 * - Table `iepGoalProgramQuizResponses`: full answers + email + priorityAccess
 * - Table `crmContacts`: upsert with tags for segmentation:
 *     iep-goal-program-quiz, quiz-01,
 *     quiz_role:*, quiz_setting:*, quiz_runnable:*, quiz_challenge:*,
 *     result_band:*, priority_access (when checked), transformation-program
 * - Newsletter subscribe via Convex newsletter delivery
 * - Transformation nurture when priority_access=true
 */

import { NextRequest, NextResponse } from "next/server";
import { api, getConvexClient } from "@/lib/convex";
import { subscribeToNewsletter } from "@/lib/convex-newsletter";
import { startTransformationNurture } from "@/lib/transformation-nurture";

const QUIZ_SLUG = "iep-goal-program";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

const runnableScores: Record<string, number> = {
  yes: 2,
  sometimes: 1,
  no: 0,
};

const resultBands: Record<string, string> = {
  yes: "can_travel",
  sometimes: "needs_you",
  no: "not_a_program",
};

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
    const body = (await request.json()) as Record<string, unknown>;
    const email = cleanOptional(body.email, 320)?.toLowerCase();
    const name = cleanOptional(body.name, 120);
    const priorityAccess = body.priorityAccess === true || body.priority_access === true;

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
    const quizRunnableScore = runnableScores[quizRunnable] ?? 0;
    const resultBand = resultBands[quizRunnable] ?? "not_a_program";
    const page =
      cleanOptional(body.page, 400) ||
      request.headers.get("referer") ||
      "/quiz/iep-goal-program";
    const userAgent = request.headers.get("user-agent") || undefined;

    const id = await getConvexClient().mutation(api.iepGoalProgramQuiz.createResponse, {
      quizSlug: QUIZ_SLUG,
      quizRole,
      quizSetting,
      quizRunnable,
      quizRunnableScore,
      quizChallenge,
      resultBand,
      name,
      email,
      priorityAccess,
      page,
      userAgent,
    });

    const tags = [
      "iep-goal-program-quiz",
      "quiz-01",
      `quiz_role:${quizRole}`,
      `quiz_setting:${quizSetting}`,
      `quiz_runnable:${quizRunnable}`,
      `quiz_challenge:${quizChallenge}`,
      `result_band:${resultBand}`,
    ];
    if (priorityAccess) {
      tags.push("priority_access", "transformation-program");
    }

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

    if (priorityAccess) {
      try {
        await startTransformationNurture({
          email,
          name,
          role: quizRole === "school_bcba" ? "School BCBA" : quizRole,
          source: "iep_goal_program_quiz",
          tags: Array.from(new Set([...tags, "priority_access"])),
          notes: `Priority access from IEP goal program quiz. Band: ${resultBand}. Challenge: ${quizChallenge}.`,
          metadata: {
            quizResponseId: id,
            quiz_role: quizRole,
            quiz_setting: quizSetting,
            quiz_runnable: quizRunnable,
            quiz_challenge: quizChallenge,
            result_band: resultBand,
            priority_access: true,
          },
        });
      } catch (error) {
        console.error("Unable to start Transformation nurture from IEP goal quiz:", error);
      }
    }

    return NextResponse.json({ ok: true, id, resultBand, priorityAccess });
  } catch (error) {
    console.error("iep-goal-program quiz submission error:", error);
    const message =
      error instanceof Error && error.message.startsWith("Invalid ")
        ? error.message
        : "Unable to save your quiz response.";
    const status =
      error instanceof Error && error.message.startsWith("Invalid ") ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
