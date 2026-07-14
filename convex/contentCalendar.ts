import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

function nowIso() {
  return new Date().toISOString();
}

function compact<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, v]) => v !== undefined)
  ) as Partial<T>;
}

function toPostRow(post: any) {
  return {
    id: post._id,
    title: post.title,
    caption: post.caption ?? null,
    platforms: post.platforms,
    content_type: post.contentType,
    media_url: post.mediaUrl ?? null,
    scheduled_date: post.scheduledDate,
    timezone: post.timezone,
    status: post.status,
    tags: post.tags,
    notes: post.notes ?? null,
    character_counts: post.characterCounts ?? {},
    created_at: post.createdAt,
    updated_at: post.updatedAt,
  };
}

function toRecommendationRow(recommendation: any) {
  return {
    id: recommendation._id,
    platform: recommendation.platform,
    day_of_week: recommendation.dayOfWeek,
    time_window: recommendation.timeWindow,
    priority: recommendation.priority,
    reason: recommendation.reason,
    created_at: recommendation.createdAt,
    updated_at: recommendation.updatedAt,
  };
}

async function getPostByLegacyId(ctx: any, legacyId: string) {
  return ctx.db
    .query("contentCalendarPosts")
    .withIndex("by_legacy_id", (q: any) => q.eq("legacyId", legacyId))
    .first();
}

async function getRecommendationByLegacyId(ctx: any, legacyId: string) {
  return ctx.db
    .query("postingTimeRecommendations")
    .withIndex("by_legacy_id", (q: any) => q.eq("legacyId", legacyId))
    .first();
}

export const listPosts = query({
  args: {
    platform: v.optional(v.string()),
    status: v.optional(v.string()),
    contentType: v.optional(v.string()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const posts = await ctx.db.query("contentCalendarPosts").collect();

    return posts
      .filter((post) => !args.platform || post.platforms.includes(args.platform))
      .filter((post) => !args.status || post.status === args.status)
      .filter((post) => !args.contentType || post.contentType === args.contentType)
      .filter((post) => !args.startDate || post.scheduledDate >= args.startDate)
      .filter((post) => !args.endDate || post.scheduledDate <= args.endDate)
      .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate))
      .map(toPostRow);
  },
});

export const getPost = query({
  args: {
    id: v.id("contentCalendarPosts"),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.id);
    return post ? toPostRow(post) : null;
  },
});

export const createPost = mutation({
  args: {
    title: v.string(),
    caption: v.optional(v.string()),
    platforms: v.array(v.string()),
    contentType: v.string(),
    mediaUrl: v.optional(v.string()),
    scheduledDate: v.string(),
    timezone: v.optional(v.string()),
    status: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
    characterCounts: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const timestamp = nowIso();
    const id = await ctx.db.insert("contentCalendarPosts", {
      title: args.title,
      caption: args.caption || undefined,
      platforms: args.platforms,
      contentType: args.contentType,
      mediaUrl: args.mediaUrl || undefined,
      scheduledDate: args.scheduledDate,
      timezone: args.timezone || "America/Los_Angeles",
      status: args.status || "draft",
      tags: args.tags || [],
      notes: args.notes || undefined,
      characterCounts: args.characterCounts || {},
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    const post = await ctx.db.get(id);
    return post ? toPostRow(post) : null;
  },
});

export const updatePost = mutation({
  args: {
    id: v.id("contentCalendarPosts"),
    title: v.optional(v.string()),
    caption: v.optional(v.string()),
    platforms: v.optional(v.array(v.string())),
    contentType: v.optional(v.string()),
    mediaUrl: v.optional(v.string()),
    scheduledDate: v.optional(v.string()),
    timezone: v.optional(v.string()),
    status: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
    characterCounts: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, compact({
      ...updates,
      caption: updates.caption || undefined,
      mediaUrl: updates.mediaUrl || undefined,
      notes: updates.notes || undefined,
      updatedAt: nowIso(),
    }));
    const post = await ctx.db.get(id);
    return post ? toPostRow(post) : null;
  },
});

export const deletePost = mutation({
  args: {
    id: v.id("contentCalendarPosts"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

export const importPost = mutation({
  args: {
    legacyId: v.string(),
    title: v.string(),
    caption: v.optional(v.string()),
    platforms: v.array(v.string()),
    contentType: v.string(),
    mediaUrl: v.optional(v.string()),
    scheduledDate: v.string(),
    timezone: v.optional(v.string()),
    status: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
    characterCounts: v.optional(v.any()),
    createdAt: v.optional(v.string()),
    updatedAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await getPostByLegacyId(ctx, args.legacyId);
    const payload = {
      legacyId: args.legacyId,
      title: args.title,
      caption: args.caption || undefined,
      platforms: args.platforms,
      contentType: args.contentType,
      mediaUrl: args.mediaUrl || undefined,
      scheduledDate: args.scheduledDate,
      timezone: args.timezone || "America/Los_Angeles",
      status: args.status || "draft",
      tags: args.tags || [],
      notes: args.notes || undefined,
      characterCounts: args.characterCounts || {},
      createdAt: args.createdAt || nowIso(),
      updatedAt: args.updatedAt || nowIso(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, payload);
      return existing._id;
    }

    return ctx.db.insert("contentCalendarPosts", payload);
  },
});

export const listRecommendations = query({
  args: {
    platform: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const recommendations = await ctx.db.query("postingTimeRecommendations").collect();
    return recommendations
      .filter((recommendation) => !args.platform || recommendation.platform === args.platform)
      .sort((a, b) => {
        const dayCompare = a.dayOfWeek - b.dayOfWeek;
        if (dayCompare !== 0) return dayCompare;
        return a.priority.localeCompare(b.priority);
      })
      .map(toRecommendationRow);
  },
});

export const importRecommendation = mutation({
  args: {
    legacyId: v.string(),
    platform: v.string(),
    dayOfWeek: v.number(),
    timeWindow: v.string(),
    priority: v.string(),
    reason: v.string(),
    createdAt: v.optional(v.string()),
    updatedAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await getRecommendationByLegacyId(ctx, args.legacyId);
    const payload = {
      legacyId: args.legacyId,
      platform: args.platform,
      dayOfWeek: args.dayOfWeek,
      timeWindow: args.timeWindow,
      priority: args.priority,
      reason: args.reason,
      createdAt: args.createdAt || nowIso(),
      updatedAt: args.updatedAt || nowIso(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, payload);
      return existing._id;
    }

    return ctx.db.insert("postingTimeRecommendations", payload);
  },
});
