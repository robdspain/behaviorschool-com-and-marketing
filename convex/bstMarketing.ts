import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

function nowIso() {
  return new Date().toISOString();
}

function toMarketingActivityRow(entry: any) {
  return {
    id: entry._id,
    activity_date: entry.activityDate,
    channel: entry.channel,
    primary_action: entry.primaryAction,
    published_url: entry.publishedUrl,
    customer_signal: entry.customerSignal,
    competitor_signal: entry.competitorSignal,
    seo_improvement: entry.seoImprovement,
    next_step: entry.nextStep,
    status: entry.status,
    created_at: entry.createdAt,
  };
}

async function getActivityByLegacyId(ctx: any, legacyId: string) {
  return ctx.db
    .query("behaviorStudyToolsMarketingActivity")
    .withIndex("by_legacy_id", (q: any) => q.eq("legacyId", legacyId))
    .first();
}

export const listMarketingActivity = query({
  args: {
    sinceDate: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 30;
    const entries = args.sinceDate
      ? await ctx.db
        .query("behaviorStudyToolsMarketingActivity")
        .withIndex("by_activity_date", (q) => q.gte("activityDate", args.sinceDate!))
        .collect()
      : await ctx.db.query("behaviorStudyToolsMarketingActivity").collect();

    return entries
      .sort((a, b) => {
        const dateCompare = b.activityDate.localeCompare(a.activityDate);
        if (dateCompare !== 0) return dateCompare;
        return b.createdAt.localeCompare(a.createdAt);
      })
      .slice(0, limit)
      .map(toMarketingActivityRow);
  },
});

export const createMarketingActivity = mutation({
  args: {
    activityDate: v.string(),
    channel: v.string(),
    primaryAction: v.string(),
    publishedUrl: v.optional(v.string()),
    customerSignal: v.optional(v.string()),
    competitorSignal: v.optional(v.string()),
    seoImprovement: v.optional(v.string()),
    nextStep: v.optional(v.string()),
    status: v.optional(v.string()),
    createdAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const timestamp = nowIso();
    const id = await ctx.db.insert("behaviorStudyToolsMarketingActivity", {
      activityDate: args.activityDate,
      channel: args.channel,
      primaryAction: args.primaryAction,
      publishedUrl: args.publishedUrl || "",
      customerSignal: args.customerSignal || "",
      competitorSignal: args.competitorSignal || "",
      seoImprovement: args.seoImprovement || "",
      nextStep: args.nextStep || "",
      status: args.status || "logged",
      createdAt: args.createdAt || timestamp,
      updatedAt: timestamp,
    });
    const entry = await ctx.db.get(id);
    return entry ? toMarketingActivityRow(entry) : null;
  },
});

export const importMarketingActivity = mutation({
  args: {
    legacyId: v.string(),
    activityDate: v.string(),
    channel: v.string(),
    primaryAction: v.string(),
    publishedUrl: v.optional(v.string()),
    customerSignal: v.optional(v.string()),
    competitorSignal: v.optional(v.string()),
    seoImprovement: v.optional(v.string()),
    nextStep: v.optional(v.string()),
    status: v.optional(v.string()),
    createdAt: v.optional(v.string()),
    updatedAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await getActivityByLegacyId(ctx, args.legacyId);
    const timestamp = nowIso();
    const payload = {
      legacyId: args.legacyId,
      activityDate: args.activityDate,
      channel: args.channel,
      primaryAction: args.primaryAction,
      publishedUrl: args.publishedUrl || "",
      customerSignal: args.customerSignal || "",
      competitorSignal: args.competitorSignal || "",
      seoImprovement: args.seoImprovement || "",
      nextStep: args.nextStep || "",
      status: args.status || "logged",
      createdAt: args.createdAt || timestamp,
      updatedAt: args.updatedAt || timestamp,
    };

    if (existing) {
      await ctx.db.patch(existing._id, payload);
      return existing._id;
    }

    return ctx.db.insert("behaviorStudyToolsMarketingActivity", payload);
  },
});
