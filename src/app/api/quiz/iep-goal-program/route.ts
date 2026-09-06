export const dynamic = "force-dynamic";

/**
 * Quiz 01: IEP goal program check (goal quality + plan readiness)
 *
 * Storage (Convex marketing deployment):
 * - Table `iepGoalProgramQuizResponses`: full answers + email + priorityAccess
 * - Table `crmContacts`: upsert with replaced quiz_* / result_band tags on retake
 * - Transactional email: checklist + /iep-goals link on every email submit
 * - Newsletter: ONLY when Priority Access is opted in on this submit
 * - Transformation nurture: when Priority Access is newly checked (idempotent upgrade)
 */

import { NextRequest, NextResponse } from "next/server";
import { api, getConvexClient } from "@/lib/convex";
import { subscribeToNewsletter } from "@/lib/convex-newsletter";
import { startTransformationNurture } from "@/lib/transformation-nurture";
import { sendIepGoalProgramChecklistEmail } from "@/lib/email";
import {
  buildQuizChecklist,
  deriveResultBand,
  RESULT_BAND_COPY,
  type IepGoalProgramAnswers,
} from "@/lib/iep-goal-program-quiz";

const QUIZ_SLUG = "iep-goal-program";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BODY_BYTES = 12_000;

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
  triState: new Set(["yes", "sometimes", "no"]),
  quizGeneralizationMaintenance: new Set(["yes", "not_needed", "not_yet"]),
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
  key: string,
  set: Set<string>
) {
  const value = cleanString(body[key], 80);
  if (!set.has(value)) {
    throw new Error(`Invalid ${key}`);
  }
  return value;
}

function parseAnswers(body: Record<string, unknown>) {
  return {
    quizRole: requireAllowed(body, "quizRole", allowed.quizRole),
    quizSetting: requireAllowed(body, "quizSetting", allowed.quizSetting),
    quizObservable: requireAllowed(body, "quizObservable", allowed.triState),
    quizContext: requireAllowed(body, "quizContext", allowed.triState),
    quizMeasurementMethod: requireAllowed(
      body,
      "quizMeasurementMethod",
      allowed.triState
    ),
    quizMatchingUnits: requireAllowed(body, "quizMatchingUnits", allowed.triState),
    quizSupports: requireAllowed(body, "quizSupports", allowed.triState),
    quizRunnable: requireAllowed(body, "quizRunnable", allowed.triState),
    quizGeneralizationMaintenance: requireAllowed(
      body,
      "quizGeneralizationMaintenance",
      allowed.quizGeneralizationMaintenance
    ),
  };
}

function buildTags(
  answers: ReturnType<typeof parseAnswers>,
  resultBand: string,
  qualityScore: number,
  priorityAccess: boolean
) {
  const tags = [
    "iep-goal-program-quiz",
    "quiz-01",
    `quiz_role:${answers.quizRole}`,
    `quiz_setting:${answers.quizSetting}`,
    `quiz_observable:${answers.quizObservable}`,
    `quiz_context:${answers.quizContext}`,
    `quiz_measurement_method:${answers.quizMeasurementMethod}`,
    `quiz_matching_units:${answers.quizMatchingUnits}`,
    `quiz_supports:${answers.quizSupports}`,
    `quiz_runnable:${answers.quizRunnable}`,
    `quiz_generalization_maintenance:${answers.quizGeneralizationMaintenance}`,
    `result_band:${resultBand}`,
    `quality_score:${qualityScore}`,
  ];
  if (priorityAccess) {
    tags.push("priority_access", "transformation-program");
  }
  return tags;
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

    const answers = parseAnswers(body);
    const page =
      cleanOptional(body.page, 400) ||
      request.headers.get("referer") ||
      "/quiz/iep-goal-program";
    const userAgent = request.headers.get("user-agent") || undefined;

    const result = await getConvexClient().mutation(
      api.iepGoalProgramQuiz.createResponse,
      {
        quizSlug: QUIZ_SLUG,
        ...answers,
        name,
        email,
        priorityAccess,
        page,
        userAgent,
      }
    );

    const typedAnswers = answers as IepGoalProgramAnswers;
    const checklist = buildQuizChecklist(typedAnswers);
    const bandCopy = RESULT_BAND_COPY[deriveResultBand(typedAnswers)];

    try {
      await sendIepGoalProgramChecklistEmail(email, {
        name,
        checklist,
        resultTitle: bandCopy.title,
        resultSummary: bandCopy.summary,
      });
    } catch (error) {
      console.error("IEP goal quiz checklist email failed:", error);
    }

    const tags = buildTags(
      answers,
      result.resultBand,
      result.qualityScore,
      result.priorityAccess
    );

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
          role: answers.quizRole === "school_bcba" ? "School BCBA" : answers.quizRole,
          source: "iep_goal_program_quiz",
          tags: Array.from(new Set([...tags, "priority_access"])),
          notes: `Priority Access from IEP goal program quiz. Band: ${result.resultBand}. Quality score: ${result.qualityScore}.`,
          metadata: {
            quizResponseId: result.responseId,
            ...answers,
            result_band: result.resultBand,
            quality_score: result.qualityScore,
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
      qualityScore: result.qualityScore,
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
