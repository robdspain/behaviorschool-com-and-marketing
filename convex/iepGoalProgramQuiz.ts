import { mutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import type { MutationCtx } from "./_generated/server";

function nowIso() {
  return new Date().toISOString();
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function compact<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined)
  ) as Partial<T>;
}

function mergeTags(existing: string[], additions: string[]) {
  return Array.from(new Set([...existing, ...additions]));
}

async function getContactByEmailLower(ctx: MutationCtx, emailLower: string) {
  return ctx.db
    .query("crmContacts")
    .withIndex("by_email_lower", (q) => q.eq("emailLower", emailLower))
    .first();
}

function splitName(name: string | undefined) {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts.shift() ?? "",
    lastName: parts.join(" "),
  };
}

const responseDoc = v.object({
  _id: v.id("iepGoalProgramQuizResponses"),
  _creationTime: v.number(),
  quizSlug: v.string(),
  quizRole: v.string(),
  quizSetting: v.string(),
  quizRunnable: v.string(),
  quizRunnableScore: v.number(),
  quizChallenge: v.string(),
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

export const createResponse = mutation({
  args: {
    quizSlug: v.string(),
    quizRole: v.string(),
    quizSetting: v.string(),
    quizRunnable: v.string(),
    quizRunnableScore: v.number(),
    quizChallenge: v.string(),
    resultBand: v.string(),
    name: v.optional(v.string()),
    email: v.string(),
    priorityAccess: v.boolean(),
    page: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  },
  returns: v.id("iepGoalProgramQuizResponses"),
  handler: async (ctx, args) => {
    const timestamp = nowIso();
    const email = args.email.trim();
    const emailLower = normalizeEmail(email);
    const name = args.name?.trim() || undefined;
    const { firstName, lastName } = splitName(name);

    const responseId = await ctx.db.insert("iepGoalProgramQuizResponses", {
      quizSlug: args.quizSlug,
      quizRole: args.quizRole,
      quizSetting: args.quizSetting,
      quizRunnable: args.quizRunnable,
      quizRunnableScore: args.quizRunnableScore,
      quizChallenge: args.quizChallenge,
      resultBand: args.resultBand,
      name,
      email,
      emailLower,
      priorityAccess: args.priorityAccess,
      page: args.page?.trim() || undefined,
      userAgent: args.userAgent?.trim() || undefined,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    const tags = [
      "iep-goal-program-quiz",
      "quiz-01",
      `quiz_role:${args.quizRole}`,
      `quiz_setting:${args.quizSetting}`,
      `quiz_runnable:${args.quizRunnable}`,
      `quiz_challenge:${args.quizChallenge}`,
      `result_band:${args.resultBand}`,
    ];
    if (args.priorityAccess) {
      tags.push("priority_access", "transformation-program");
    }

    const notesPayload = {
      quizResponseId: String(responseId),
      quizSlug: args.quizSlug,
      quiz_role: args.quizRole,
      quiz_setting: args.quizSetting,
      quiz_runnable: args.quizRunnable,
      quiz_runnable_score: args.quizRunnableScore,
      quiz_challenge: args.quizChallenge,
      result_band: args.resultBand,
      priority_access: args.priorityAccess,
    };
    const noteLine = `IEP goal program quiz: ${JSON.stringify(notesPayload)}`;

    const existing = await getContactByEmailLower(ctx, emailLower);
    if (existing) {
      await ctx.db.patch(
        existing._id,
        compact({
          firstName: firstName || existing.firstName,
          lastName: lastName || existing.lastName,
          email,
          role: args.quizRole === "school_bcba" ? "School BCBA" : existing.role,
          leadSource: existing.leadSource ?? "iep_goal_program_quiz",
          tags: mergeTags(existing.tags, tags),
          notes: existing.notes ? `${existing.notes}\n\n${noteLine}` : noteLine,
          priority: args.priorityAccess
            ? existing.priority === "urgent"
              ? "urgent"
              : "high"
            : existing.priority,
          isArchived: false,
          updatedAt: timestamp,
        })
      );
    } else {
      await ctx.db.insert("crmContacts", {
        firstName: firstName || "Quiz",
        lastName: lastName || "Lead",
        email,
        emailLower,
        role: args.quizRole === "school_bcba" ? "School BCBA" : undefined,
        status: "lead",
        leadSource: "iep_goal_program_quiz",
        tags,
        notes: noteLine,
        leadScore: args.priorityAccess ? 40 : 20,
        priority: args.priorityAccess ? "high" : "medium",
        revenue: 0,
        isArchived: false,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
    }

    return responseId;
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
