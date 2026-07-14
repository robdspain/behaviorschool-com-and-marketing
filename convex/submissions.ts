import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

function nowIso() {
  return new Date().toISOString();
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function compact<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, v]) => v !== undefined)
  ) as Partial<T>;
}

async function getByLegacyId(ctx: any, legacyId: string) {
  return ctx.db
    .query("signupSubmissions")
    .withIndex("by_legacy_id", (q: any) => q.eq("legacyId", legacyId))
    .first();
}

export const createSignupSubmission = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    organization: v.optional(v.string()),
    role: v.string(),
    caseloadSize: v.optional(v.string()),
    currentChallenges: v.optional(v.string()),
    bcbaCertNumber: v.optional(v.string()),
    status: v.optional(v.string()),
    submittedAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const timestamp = nowIso();
    const submittedAt = args.submittedAt ?? timestamp;

    return ctx.db.insert("signupSubmissions", {
      firstName: args.firstName.trim(),
      lastName: args.lastName.trim(),
      email: args.email.trim(),
      emailLower: normalizeEmail(args.email),
      phone: args.phone || undefined,
      organization: args.organization || undefined,
      role: args.role,
      caseloadSize: args.caseloadSize || undefined,
      currentChallenges: args.currentChallenges || undefined,
      bcbaCertNumber: args.bcbaCertNumber || undefined,
      status: args.status || "new",
      submittedAt,
      archived: false,
      createdAt: submittedAt,
      updatedAt: timestamp,
    });
  },
});

export const importSignupSubmission = mutation({
  args: {
    legacyId: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    organization: v.optional(v.string()),
    role: v.string(),
    caseloadSize: v.optional(v.string()),
    currentChallenges: v.optional(v.string()),
    bcbaCertNumber: v.optional(v.string()),
    status: v.optional(v.string()),
    submittedAt: v.string(),
    archived: v.optional(v.boolean()),
    archivedAt: v.optional(v.string()),
    archivedBy: v.optional(v.string()),
    createdAt: v.optional(v.string()),
    updatedAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await getByLegacyId(ctx, args.legacyId);
    const timestamp = nowIso();
    const payload = {
      legacyId: args.legacyId,
      firstName: args.firstName.trim(),
      lastName: args.lastName.trim(),
      email: args.email.trim(),
      emailLower: normalizeEmail(args.email),
      phone: args.phone || undefined,
      organization: args.organization || undefined,
      role: args.role,
      caseloadSize: args.caseloadSize || undefined,
      currentChallenges: args.currentChallenges || undefined,
      bcbaCertNumber: args.bcbaCertNumber || undefined,
      status: args.status || "new",
      submittedAt: args.submittedAt,
      archived: args.archived ?? false,
      archivedAt: args.archivedAt || undefined,
      archivedBy: args.archivedBy || undefined,
      createdAt: args.createdAt || args.submittedAt,
      updatedAt: args.updatedAt || timestamp,
    };

    if (existing) {
      await ctx.db.patch(existing._id, payload);
      return existing._id;
    }

    return ctx.db.insert("signupSubmissions", payload);
  },
});

export const listSignupSubmissions = query({
  args: {
    showArchived: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const submissions = await ctx.db.query("signupSubmissions").collect();

    return submissions
      .filter((submission) => args.showArchived || !submission.archived)
      .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  },
});

export const updateSignupSubmission = mutation({
  args: {
    id: v.id("signupSubmissions"),
    archived: v.optional(v.boolean()),
    status: v.optional(v.string()),
    archivedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const patch: Record<string, unknown> = compact({
      archived: args.archived,
      status: args.status,
      updatedAt: nowIso(),
    });

    if (args.archived !== undefined) {
      patch.archivedAt = args.archived ? nowIso() : undefined;
      patch.archivedBy = args.archived ? args.archivedBy || "Admin" : undefined;
    }

    await ctx.db.patch(args.id, patch);
    return ctx.db.get(args.id);
  },
});

export const submissionStats = query({
  args: {
    weekStartIso: v.string(),
  },
  handler: async (ctx, args) => {
    const submissions = await ctx.db.query("signupSubmissions").collect();
    return {
      totalSubmissions: submissions.length,
      weekSubmissions: submissions.filter(
        (submission) => submission.submittedAt >= args.weekStartIso
      ).length,
    };
  },
});

export const recentSignupActivity = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    const submissions = await ctx.db.query("signupSubmissions").collect();

    return submissions
      .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
      .slice(0, limit);
  },
});
