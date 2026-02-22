import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ============================================================================
// ACE INSTRUCTOR QUALIFICATIONS - Queries & Mutations
// ============================================================================

const qualificationPathValidator = v.union(
  v.literal("active_bcba"),
  v.literal("doctorate_behavior_analysis"),
  v.literal("doctorate_with_coursework"),
  v.literal("doctorate_with_mentorship"),
  v.literal("doctorate_with_publications"),
  v.literal("doctorate_with_postdoc_hours")
);

const expertiseBasisValidator = v.union(
  v.literal("five_years_practice"),
  v.literal("three_years_teaching"),
  v.literal("published_research")
);

// Get all instructor qualifications for a provider
export const getByProvider = query({
  args: { providerId: v.id("aceProviders") },
  handler: async (ctx, args) => {
    const qualifications = await ctx.db
      .query("aceInstructorQualifications")
      .withIndex("by_provider", (q) => q.eq("providerId", args.providerId))
      .collect();

    // Attach user info to each qualification
    const withUsers = await Promise.all(
      qualifications.map(async (qual) => {
        const user = await ctx.db.get(qual.userId);
        return { ...qual, user };
      })
    );

    return withUsers;
  },
});

// Get qualifications for a specific user
export const getByUser = query({
  args: { userId: v.id("aceUsers") },
  handler: async (ctx, args) => {
    const qualifications = await ctx.db
      .query("aceInstructorQualifications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Attach provider info
    const withProviders = await Promise.all(
      qualifications.map(async (qual) => {
        const provider = await ctx.db.get(qual.providerId);
        return { ...qual, provider };
      })
    );

    return withProviders;
  },
});

// Get single qualification by ID
export const getById = query({
  args: { id: v.id("aceInstructorQualifications") },
  handler: async (ctx, args) => {
    const qual = await ctx.db.get(args.id);
    if (!qual) return null;

    const user = await ctx.db.get(qual.userId);
    const provider = await ctx.db.get(qual.providerId);

    // Get verifier info if verified
    let verifier = null;
    if (qual.verifiedBy) {
      verifier = await ctx.db.get(qual.verifiedBy);
    }

    return { ...qual, user, provider, verifier };
  },
});

// Get pending (unverified) qualifications for a provider
export const getPending = query({
  args: { providerId: v.id("aceProviders") },
  handler: async (ctx, args) => {
    const qualifications = await ctx.db
      .query("aceInstructorQualifications")
      .withIndex("by_provider", (q) => q.eq("providerId", args.providerId))
      .collect();

    // Filter to only unverified (no verifiedAt set)
    const pending = qualifications.filter((q) => !q.verifiedAt);

    // Attach user info
    const withUsers = await Promise.all(
      pending.map(async (qual) => {
        const user = await ctx.db.get(qual.userId);
        return { ...qual, user };
      })
    );

    return withUsers;
  },
});

// Submit new instructor qualification
export const submit = mutation({
  args: {
    userId: v.id("aceUsers"),
    providerId: v.id("aceProviders"),
    isBcba: v.boolean(),
    isBcbaD: v.boolean(),
    isPhDAba: v.boolean(),
    certificationNumber: v.optional(v.string()),
    certificationDate: v.optional(v.number()),
    certificationExpiration: v.optional(v.number()),
    cvUrl: v.optional(v.string()),
    transcriptUrl: v.optional(v.string()),
    certificationProofUrl: v.optional(v.string()),
    qualificationPath: v.optional(qualificationPathValidator),
    expertiseBasis: v.optional(expertiseBasisValidator),
    yearsExperienceInSubject: v.optional(v.number()),
    yearsTeachingSubject: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Update user role to instructor if not already
    const user = await ctx.db.get(args.userId);
    if (user && user.role !== "instructor" && user.role !== "admin" && user.role !== "ace_coordinator") {
      await ctx.db.patch(args.userId, {
        role: "instructor",
        updatedAt: now,
      });
    }

    return await ctx.db.insert("aceInstructorQualifications", {
      ...args,
      isApproved: false,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update instructor qualification
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
    qualificationPath: v.optional(qualificationPathValidator),
    expertiseBasis: v.optional(expertiseBasisValidator),
    yearsExperienceInSubject: v.optional(v.number()),
    yearsTeachingSubject: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Approve instructor qualification
export const approve = mutation({
  args: {
    id: v.id("aceInstructorQualifications"),
    verifiedBy: v.id("aceUsers"),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.patch(args.id, {
      isApproved: true,
      verifiedBy: args.verifiedBy,
      verifiedAt: now,
      qualificationReviewNotes: args.notes,
      updatedAt: now,
    });
  },
});

// Reject instructor qualification
export const reject = mutation({
  args: {
    id: v.id("aceInstructorQualifications"),
    verifiedBy: v.id("aceUsers"),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.patch(args.id, {
      isApproved: false,
      verifiedBy: args.verifiedBy,
      verifiedAt: now,
      qualificationReviewNotes: args.notes,
      updatedAt: now,
    });
  },
});
