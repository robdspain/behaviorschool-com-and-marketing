import { mutation, query } from "convex/server";
import { v } from "convex/values";

export const getSchoolBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query("schools").withIndex("by_slug", (q) => q.eq("slug", args.slug)).first();
  },
});

export const createSchool = mutation({
  args: {
    slug: v.string(),
    name: v.string(),
    teamKeyHash: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("schools").withIndex("by_slug", (q) => q.eq("slug", args.slug)).first();
    if (existing) return existing;
    const now = Date.now();
    const id = await ctx.db.insert("schools", {
      slug: args.slug,
      name: args.name,
      teamKeyHash: args.teamKeyHash,
      createdAt: now,
    });
    return await ctx.db.get(id);
  },
});

export const upsertMember = mutation({
  args: {
    schoolId: v.id("schools"),
    email: v.string(),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("school_members")
      .withIndex("by_school_email", (q) => q.eq("schoolId", args.schoolId).eq("email", args.email))
      .first();
    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, { role: args.role, lastActiveAt: now });
      return existing;
    }
    const id = await ctx.db.insert("school_members", {
      schoolId: args.schoolId,
      email: args.email,
      role: args.role,
      createdAt: now,
      lastActiveAt: now,
    });
    return await ctx.db.get(id);
  },
});

export const createIepGoalDoc = mutation({
  args: {
    schoolId: v.id("schools"),
    title: v.string(),
    createdBy: v.string(),
    payload: v.string(),
    payloadVersion: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const id = await ctx.db.insert("iep_goal_docs", {
      schoolId: args.schoolId,
      title: args.title,
      createdBy: args.createdBy,
      payload: args.payload,
      payloadVersion: args.payloadVersion,
      createdAt: now,
      updatedAt: now,
    });
    return await ctx.db.get(id);
  },
});

export const listIepGoalDocs = query({
  args: { schoolId: v.id("schools") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("iep_goal_docs")
      .withIndex("by_school", (q) => q.eq("schoolId", args.schoolId))
      .order("desc")
      .take(50);
  },
});

export const getIepGoalDoc = query({
  args: { id: v.id("iep_goal_docs") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const createBipDoc = mutation({
  args: {
    schoolId: v.id("schools"),
    title: v.string(),
    createdBy: v.string(),
    payload: v.string(),
    payloadVersion: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const id = await ctx.db.insert("bip_docs", {
      schoolId: args.schoolId,
      title: args.title,
      createdBy: args.createdBy,
      payload: args.payload,
      payloadVersion: args.payloadVersion,
      createdAt: now,
      updatedAt: now,
    });
    return await ctx.db.get(id);
  },
});

export const listBipDocs = query({
  args: { schoolId: v.id("schools") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bip_docs")
      .withIndex("by_school", (q) => q.eq("schoolId", args.schoolId))
      .order("desc")
      .take(50);
  },
});

export const getBipDoc = query({
  args: { id: v.id("bip_docs") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
