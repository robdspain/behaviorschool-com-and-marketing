import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";

const qualificationPath = v.union(
  v.literal("active_bcba"),
  v.literal("doctorate_behavior_analysis"),
  v.literal("doctorate_with_coursework"),
  v.literal("doctorate_with_mentorship"),
  v.literal("doctorate_with_publications"),
  v.literal("doctorate_with_postdoc_hours")
);

const expertiseBasis = v.union(
  v.literal("five_years_practice"),
  v.literal("three_years_teaching"),
  v.literal("published_research")
);

function now() {
  return Date.now();
}

function compact<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined)
  ) as Partial<T>;
}

async function withUser(
  ctx: QueryCtx | MutationCtx,
  qualification: Doc<"aceInstructorQualifications"> | null
) {
  if (!qualification) return null;
  const user = await ctx.db.get(qualification.userId);
  return { ...qualification, user };
}

async function assertRelatedRows(
  ctx: MutationCtx,
  userId: Id<"aceUsers">,
  providerId: Id<"aceProviders">
) {
  const [user, provider] = await Promise.all([
    ctx.db.get(userId),
    ctx.db.get(providerId),
  ]);
  if (!user) throw new Error("Instructor user not found");
  if (!provider) throw new Error("ACE provider not found");
}

export const getById = query({
  args: { id: v.id("aceInstructorQualifications") },
  handler: async (ctx, args) => withUser(ctx, await ctx.db.get(args.id)),
});

export const getByUser = query({
  args: { userId: v.id("aceUsers") },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("aceInstructorQualifications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    const result = [];
    for (const row of rows.sort((a, b) => b.createdAt - a.createdAt)) {
      result.push(await withUser(ctx, row));
    }
    return result;
  },
});

export const getByProvider = query({
  args: { providerId: v.id("aceProviders") },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("aceInstructorQualifications")
      .withIndex("by_provider", (q) => q.eq("providerId", args.providerId))
      .collect();
    const result = [];
    for (const row of rows.sort((a, b) => b.createdAt - a.createdAt)) {
      result.push(await withUser(ctx, row));
    }
    return result;
  },
});

export const getPending = query({
  args: { providerId: v.optional(v.id("aceProviders")) },
  handler: async (ctx, args) => {
    const rows = args.providerId
      ? await ctx.db
          .query("aceInstructorQualifications")
          .withIndex("by_provider", (q) => q.eq("providerId", args.providerId!))
          .collect()
      : await ctx.db.query("aceInstructorQualifications").collect();
    const pending = rows.filter((row) => !row.isApproved && !row.verifiedAt);
    const result = [];
    for (const row of pending.sort((a, b) => b.createdAt - a.createdAt)) {
      result.push(await withUser(ctx, row));
    }
    return result;
  },
});

export const getAll = query({
  args: { providerId: v.optional(v.id("aceProviders")) },
  handler: async (ctx, args) => {
    const rows = args.providerId
      ? await ctx.db
          .query("aceInstructorQualifications")
          .withIndex("by_provider", (q) => q.eq("providerId", args.providerId!))
          .collect()
      : await ctx.db.query("aceInstructorQualifications").collect();
    const result = [];
    for (const row of rows.sort((a, b) => b.createdAt - a.createdAt)) {
      result.push(await withUser(ctx, row));
    }
    return result;
  },
});

export const submit = mutation({
  args: {
    userId: v.id("aceUsers"),
    providerId: v.id("aceProviders"),
    isBcba: v.optional(v.boolean()),
    isBcbaD: v.optional(v.boolean()),
    isPhDAba: v.optional(v.boolean()),
    certificationNumber: v.optional(v.string()),
    certificationDate: v.optional(v.number()),
    certificationExpiration: v.optional(v.number()),
    cvUrl: v.optional(v.string()),
    transcriptUrl: v.optional(v.string()),
    certificationProofUrl: v.optional(v.string()),
    qualificationPath: v.optional(qualificationPath),
    expertiseBasis: v.optional(expertiseBasis),
    yearsExperienceInSubject: v.optional(v.number()),
    yearsTeachingSubject: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await assertRelatedRows(ctx, args.userId, args.providerId);
    const timestamp = now();
    return ctx.db.insert("aceInstructorQualifications", {
      userId: args.userId,
      providerId: args.providerId,
      isBcba: args.isBcba ?? false,
      isBcbaD: args.isBcbaD ?? false,
      isPhDAba: args.isPhDAba ?? false,
      certificationNumber: args.certificationNumber?.trim() || undefined,
      certificationDate: args.certificationDate,
      certificationExpiration: args.certificationExpiration,
      cvUrl: args.cvUrl?.trim() || undefined,
      transcriptUrl: args.transcriptUrl?.trim() || undefined,
      certificationProofUrl: args.certificationProofUrl?.trim() || undefined,
      qualificationPath: args.qualificationPath,
      expertiseBasis: args.expertiseBasis,
      yearsExperienceInSubject: args.yearsExperienceInSubject,
      yearsTeachingSubject: args.yearsTeachingSubject,
      isApproved: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("aceInstructorQualifications"),
    isBcba: v.optional(v.boolean()),
    isBcbaD: v.optional(v.boolean()),
    isPhDAba: v.optional(v.boolean()),
    certificationNumber: v.optional(v.string()),
    certificationDate: v.optional(v.number()),
    certificationExpiration: v.optional(v.number()),
    cvUrl: v.optional(v.string()),
    transcriptUrl: v.optional(v.string()),
    certificationProofUrl: v.optional(v.string()),
    qualificationPath: v.optional(qualificationPath),
    expertiseBasis: v.optional(expertiseBasis),
    yearsExperienceInSubject: v.optional(v.number()),
    yearsTeachingSubject: v.optional(v.number()),
    isApproved: v.optional(v.boolean()),
    verifiedBy: v.optional(v.id("aceUsers")),
    verifiedAt: v.optional(v.number()),
    qualificationReviewNotes: v.optional(v.string()),
    expertiseReviewNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Instructor qualification not found");

    await ctx.db.patch(args.id, compact({
      isBcba: args.isBcba,
      isBcbaD: args.isBcbaD,
      isPhDAba: args.isPhDAba,
      certificationNumber: args.certificationNumber?.trim() || undefined,
      certificationDate: args.certificationDate,
      certificationExpiration: args.certificationExpiration,
      cvUrl: args.cvUrl?.trim() || undefined,
      transcriptUrl: args.transcriptUrl?.trim() || undefined,
      certificationProofUrl: args.certificationProofUrl?.trim() || undefined,
      qualificationPath: args.qualificationPath,
      expertiseBasis: args.expertiseBasis,
      yearsExperienceInSubject: args.yearsExperienceInSubject,
      yearsTeachingSubject: args.yearsTeachingSubject,
      isApproved: args.isApproved,
      verifiedBy: args.verifiedBy,
      verifiedAt: args.verifiedAt,
      qualificationReviewNotes: args.qualificationReviewNotes,
      expertiseReviewNotes: args.expertiseReviewNotes,
      updatedAt: now(),
    }));

    return withUser(ctx, await ctx.db.get(args.id));
  },
});

export const approve = mutation({
  args: {
    id: v.id("aceInstructorQualifications"),
    verifiedBy: v.optional(v.id("aceUsers")),
    notes: v.optional(v.string()),
    expertiseNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Instructor qualification not found");
    await ctx.db.patch(args.id, compact({
      isApproved: true,
      verifiedBy: args.verifiedBy,
      verifiedAt: now(),
      qualificationReviewNotes: args.notes,
      expertiseReviewNotes: args.expertiseNotes,
      updatedAt: now(),
    }));
    return withUser(ctx, await ctx.db.get(args.id));
  },
});

export const reject = mutation({
  args: {
    id: v.id("aceInstructorQualifications"),
    verifiedBy: v.optional(v.id("aceUsers")),
    notes: v.optional(v.string()),
    expertiseNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Instructor qualification not found");
    await ctx.db.patch(args.id, compact({
      isApproved: false,
      verifiedBy: args.verifiedBy,
      verifiedAt: now(),
      qualificationReviewNotes: args.notes,
      expertiseReviewNotes: args.expertiseNotes,
      updatedAt: now(),
    }));
    return withUser(ctx, await ctx.db.get(args.id));
  },
});
