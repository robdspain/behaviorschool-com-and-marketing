import { mutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import type { MutationCtx } from "./_generated/server";
import {
  ALLOWED_GEN_MAINT,
  ALLOWED_ROLES,
  ALLOWED_SETTINGS,
  ALLOWED_TRI_STATE,
  RESULT_BANDS,
  RUNNABLE_SCORES,
  buildQuizAnswerTags,
  deriveQualityScore,
} from "./lib/iepGoalProgramQuizLogic";

const QUIZ_SLUG = "iep-goal-program";
const MAX_NAME_LEN = 120;
const MAX_EMAIL_LEN = 320;
const MAX_PAGE_LEN = 400;
const MAX_UA_LEN = 500;
const MIN_SUBMIT_INTERVAL_MS = 5_000;
const MAX_SUBMITS_PER_EMAIL_PER_HOUR = 8;

const REPLACEABLE_TAG_PREFIXES = [
  "quiz_role:",
  "quiz_setting:",
  "quiz_observable:",
  "quiz_context:",
  "quiz_measurement_method:",
  "quiz_matching_units:",
  "quiz_supports:",
  "quiz_runnable:",
  "quiz_generalization_maintenance:",
  "quiz_challenge:",
  "result_band:",
  "quality_score:",
] as const;

const REPLACEABLE_EXACT_TAGS = new Set([
  "iep-goal-program-quiz",
  "quiz-01",
  "priority_access",
  "transformation-program",
]);

function nowIso() {
  return new Date().toISOString();
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string) {
  return (
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= MAX_EMAIL_LEN
  );
}

function compact<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined)
  ) as Partial<T>;
}

function requireAllowed(value: string, allowed: Set<string>, field: string) {
  if (!allowed.has(value)) {
    throw new Error(`Invalid ${field}`);
  }
  return value;
}

function sanitizeOptionalString(value: string | undefined, max: number) {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return undefined;
  return trimmed.slice(0, max);
}

function splitName(name: string | undefined) {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts.shift() ?? "",
    lastName: parts.join(" "),
  };
}

function buildQuizTags(input: {
  quizRole: string;
  quizSetting: string;
  quizObservable: string;
  quizContext: string;
  quizMeasurementMethod: string;
  quizMatchingUnits: string;
  quizSupports: string;
  quizRunnable: string;
  quizGeneralizationMaintenance: string;
  resultBand: string;
  qualityScore: number;
  priorityAccess: boolean;
}) {
  const tags = [
    "iep-goal-program-quiz",
    "quiz-01",
    ...buildQuizAnswerTags(input),
    `result_band:${input.resultBand}`,
    `quality_score:${input.qualityScore}`,
  ];
  if (input.priorityAccess) {
    tags.push("priority_access", "transformation-program");
  }
  return tags;
}

function isReplaceableQuizTag(tag: string) {
  if (REPLACEABLE_EXACT_TAGS.has(tag)) return true;
  return REPLACEABLE_TAG_PREFIXES.some((prefix) => tag.startsWith(prefix));
}

function replaceQuizTags(existing: string[], nextQuizTags: string[]) {
  const preserved = existing.filter((tag) => !isReplaceableQuizTag(tag));
  return Array.from(new Set([...preserved, ...nextQuizTags]));
}

function contactHasPriorityAccess(tags: string[] | undefined) {
  if (!tags) return false;
  return (
    tags.includes("priority_access") || tags.includes("transformation-program")
  );
}

async function getContactByEmailLower(ctx: MutationCtx, emailLower: string) {
  return ctx.db
    .query("crmContacts")
    .withIndex("by_email_lower", (q) => q.eq("emailLower", emailLower))
    .first();
}

async function assertRateLimit(ctx: MutationCtx, emailLower: string) {
  const prior = await ctx.db
    .query("iepGoalProgramQuizResponses")
    .withIndex("by_email_lower", (q) => q.eq("emailLower", emailLower))
    .collect();

  if (prior.length === 0) return;

  const sorted = [...prior].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
  const latest = sorted[0];
  if (latest) {
    const latestMs = Date.parse(latest.createdAt);
    if (
      Number.isFinite(latestMs) &&
      Date.now() - latestMs < MIN_SUBMIT_INTERVAL_MS
    ) {
      throw new Error("Please wait a moment before submitting again.");
    }
  }

  const hourAgo = Date.now() - 60 * 60 * 1000;
  const recentHourCount = prior.filter((row) => {
    const ms = Date.parse(row.createdAt);
    return Number.isFinite(ms) && ms >= hourAgo;
  }).length;

  if (recentHourCount >= MAX_SUBMITS_PER_EMAIL_PER_HOUR) {
    throw new Error(
      "Too many submissions from this email. Please try again later."
    );
  }
}

const responseDoc = v.object({
  _id: v.id("iepGoalProgramQuizResponses"),
  _creationTime: v.number(),
  quizSlug: v.string(),
  quizRole: v.string(),
  quizSetting: v.string(),
  quizObservable: v.string(),
  quizContext: v.string(),
  quizMeasurementMethod: v.string(),
  quizMatchingUnits: v.string(),
  quizSupports: v.string(),
  quizRunnable: v.string(),
  quizRunnableScore: v.number(),
  quizGeneralizationMaintenance: v.string(),
  qualityScore: v.number(),
  quizChallenge: v.optional(v.string()),
  resultBand: v.string(),
  name: v.optional(v.string()),
  email: v.string(),
  emailLower: v.string(),
  priorityAccess: v.boolean(),
  page: v.optional(v.string()),
  userAgent: v.optional(v.string()),
  createdAt: v.string(),
  updatedAt: v.string(),
});

/**
 * Public quiz submit mutation.
 * Validates allowlists, derives score/band server-side, rate-limits by email,
 * upserts CRM with replaced quiz tags on retake, and returns nurture flags.
 */
export const createResponse = mutation({
  args: {
    quizSlug: v.string(),
    quizRole: v.string(),
    quizSetting: v.string(),
    quizObservable: v.string(),
    quizContext: v.string(),
    quizMeasurementMethod: v.string(),
    quizMatchingUnits: v.string(),
    quizSupports: v.string(),
    quizRunnable: v.string(),
    quizGeneralizationMaintenance: v.string(),
    // Optional legacy / client fields; ignored for scoring.
    quizRunnableScore: v.optional(v.number()),
    quizChallenge: v.optional(v.string()),
    resultBand: v.optional(v.string()),
    qualityScore: v.optional(v.number()),
    name: v.optional(v.string()),
    email: v.string(),
    priorityAccess: v.boolean(),
    page: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  },
  returns: v.object({
    responseId: v.id("iepGoalProgramQuizResponses"),
    resultBand: v.string(),
    qualityScore: v.number(),
    priorityAccess: v.boolean(),
    shouldStartNurture: v.boolean(),
  }),
  handler: async (ctx, args) => {
    const timestamp = nowIso();

    if (args.quizSlug !== QUIZ_SLUG) {
      throw new Error("Invalid quizSlug");
    }

    const emailLower = normalizeEmail(args.email);
    if (!isValidEmail(emailLower)) {
      throw new Error("Invalid email");
    }

    await assertRateLimit(ctx, emailLower);

    const quizRole = requireAllowed(
      args.quizRole.trim(),
      ALLOWED_ROLES,
      "quizRole"
    );
    const quizSetting = requireAllowed(
      args.quizSetting.trim(),
      ALLOWED_SETTINGS,
      "quizSetting"
    );
    const quizObservable = requireAllowed(
      args.quizObservable.trim(),
      ALLOWED_TRI_STATE,
      "quizObservable"
    );
    const quizContext = requireAllowed(
      args.quizContext.trim(),
      ALLOWED_TRI_STATE,
      "quizContext"
    );
    const quizMeasurementMethod = requireAllowed(
      args.quizMeasurementMethod.trim(),
      ALLOWED_TRI_STATE,
      "quizMeasurementMethod"
    );
    const quizMatchingUnits = requireAllowed(
      args.quizMatchingUnits.trim(),
      ALLOWED_TRI_STATE,
      "quizMatchingUnits"
    );
    const quizSupports = requireAllowed(
      args.quizSupports.trim(),
      ALLOWED_TRI_STATE,
      "quizSupports"
    );
    const quizRunnable = requireAllowed(
      args.quizRunnable.trim(),
      ALLOWED_TRI_STATE,
      "quizRunnable"
    );
    const quizGeneralizationMaintenance = requireAllowed(
      args.quizGeneralizationMaintenance.trim(),
      ALLOWED_GEN_MAINT,
      "quizGeneralizationMaintenance"
    );

    const answerInput = {
      quizRole,
      quizSetting,
      quizObservable,
      quizContext,
      quizMeasurementMethod,
      quizMatchingUnits,
      quizSupports,
      quizRunnable,
      quizGeneralizationMaintenance,
    };

    const quizRunnableScore = RUNNABLE_SCORES[quizRunnable] ?? 0;
    const resultBand = RESULT_BANDS[quizRunnable] ?? "not_a_program";
    const qualityScore = deriveQualityScore(answerInput);
    const priorityAccessRequested = args.priorityAccess === true;
    const name = sanitizeOptionalString(args.name, MAX_NAME_LEN);
    const page = sanitizeOptionalString(args.page, MAX_PAGE_LEN);
    const userAgent = sanitizeOptionalString(args.userAgent, MAX_UA_LEN);
    const { firstName, lastName } = splitName(name);

    const existing = await getContactByEmailLower(ctx, emailLower);
    const priorResponses = await ctx.db
      .query("iepGoalProgramQuizResponses")
      .withIndex("by_email_lower", (q) => q.eq("emailLower", emailLower))
      .collect();
    const hadPriorityAccess =
      contactHasPriorityAccess(existing?.tags) ||
      priorResponses.some((row) => row.priorityAccess === true);

    const responseId = await ctx.db.insert("iepGoalProgramQuizResponses", {
      quizSlug: QUIZ_SLUG,
      quizRole,
      quizSetting,
      quizObservable,
      quizContext,
      quizMeasurementMethod,
      quizMatchingUnits,
      quizSupports,
      quizRunnable,
      quizRunnableScore,
      quizGeneralizationMaintenance,
      qualityScore,
      resultBand,
      name,
      email: emailLower,
      emailLower,
      priorityAccess: priorityAccessRequested,
      page,
      userAgent,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    const effectivePriorityAccess =
      priorityAccessRequested || hadPriorityAccess;
    const shouldStartNurture = priorityAccessRequested && !hadPriorityAccess;

    const quizTags = buildQuizTags({
      ...answerInput,
      resultBand,
      qualityScore,
      priorityAccess: effectivePriorityAccess,
    });

    const notesPayload = {
      quizResponseId: String(responseId),
      quizSlug: QUIZ_SLUG,
      ...answerInput,
      quiz_runnable_score: quizRunnableScore,
      quality_score: qualityScore,
      result_band: resultBand,
      priority_access: effectivePriorityAccess,
      upgraded_to_priority_access: shouldStartNurture,
    };
    const noteLine = `IEP goal program quiz: ${JSON.stringify(notesPayload)}`;

    if (existing) {
      await ctx.db.patch(
        existing._id,
        compact({
          firstName: firstName || existing.firstName,
          lastName: lastName || existing.lastName,
          email: emailLower,
          role: quizRole === "school_bcba" ? "School BCBA" : existing.role,
          leadSource: existing.leadSource ?? "iep_goal_program_quiz",
          tags: replaceQuizTags(existing.tags, quizTags),
          notes: existing.notes ? `${existing.notes}\n\n${noteLine}` : noteLine,
          priority: effectivePriorityAccess
            ? existing.priority === "urgent"
              ? "urgent"
              : "high"
            : existing.priority,
          leadScore: Math.max(
            existing.leadScore ?? 0,
            effectivePriorityAccess ? 40 : 20
          ),
          isArchived: false,
          updatedAt: timestamp,
        })
      );
    } else {
      await ctx.db.insert("crmContacts", {
        firstName: firstName || "Quiz",
        lastName: lastName || "Lead",
        email: emailLower,
        emailLower,
        role: quizRole === "school_bcba" ? "School BCBA" : undefined,
        status: "lead",
        leadSource: "iep_goal_program_quiz",
        tags: quizTags,
        notes: noteLine,
        leadScore: effectivePriorityAccess ? 40 : 20,
        priority: effectivePriorityAccess ? "high" : "medium",
        revenue: 0,
        isArchived: false,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
    }

    return {
      responseId,
      resultBand,
      qualityScore,
      priorityAccess: effectivePriorityAccess,
      shouldStartNurture,
    };
  },
});

/** Internal only: responses include emails. Use Convex dashboard or admin routes. */
export const listResponses = internalQuery({
  args: {
    quizSlug: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  returns: v.array(responseDoc),
  handler: async (ctx, args) => {
    const limit = Math.min(args.limit ?? 100, 500);
    const rows = args.quizSlug
      ? await ctx.db
          .query("iepGoalProgramQuizResponses")
          .withIndex("by_quiz_slug", (q) => q.eq("quizSlug", args.quizSlug!))
          .collect()
      : await ctx.db.query("iepGoalProgramQuizResponses").collect();

    return rows
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
  },
});
