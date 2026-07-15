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

function toMarketingEventRow(entry: any) {
  return {
    id: entry._id,
    event_name: entry.eventName,
    source: entry.source,
    page_path: entry.pagePath ?? null,
    page_url: entry.pageUrl ?? null,
    page_title: entry.pageTitle ?? null,
    visitor_id: entry.visitorId ?? null,
    session_id: entry.sessionId ?? null,
    location: entry.location ?? null,
    intent: entry.intent ?? null,
    destination: entry.destination ?? null,
    payload: entry.payload ?? {},
    received_at: entry.receivedAt,
    created_at: entry.createdAt,
  };
}

function optionalString(value: string | null | undefined) {
  return value || undefined;
}

function optionalNumber(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function toGrowthSignalRow(signal: any) {
  return {
    id: signal._id,
    signal_date: signal.signalDate,
    source: signal.source,
    signal_type: signal.signalType,
    channel: signal.channel ?? null,
    url: signal.url ?? null,
    keyword: signal.keyword ?? null,
    topic: signal.topic ?? null,
    metric_name: signal.metricName ?? null,
    metric_value: signal.metricValue ?? null,
    previous_value: signal.previousValue ?? null,
    change_value: signal.changeValue ?? null,
    change_percent: signal.changePercent ?? null,
    metadata: signal.metadata ?? {},
    recommendation: signal.recommendation ?? null,
    status: signal.status,
    created_at: signal.createdAt,
  };
}

async function getActivityByLegacyId(ctx: any, legacyId: string) {
  return ctx.db
    .query("behaviorStudyToolsMarketingActivity")
    .withIndex("by_legacy_id", (q: any) => q.eq("legacyId", legacyId))
    .first();
}

async function getGrowthSignalByLegacyId(ctx: any, legacyId: string) {
  return ctx.db
    .query("behaviorStudyToolsGrowthSignals")
    .withIndex("by_legacy_id", (q: any) => q.eq("legacyId", legacyId))
    .first();
}

async function getMarketingEventByLegacyId(ctx: any, legacyId: string) {
  return ctx.db
    .query("behaviorStudyToolsMarketingEvents")
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

const marketingEventInput = v.object({
  eventName: v.string(),
  source: v.string(),
  pagePath: v.optional(v.union(v.string(), v.null())),
  pageUrl: v.optional(v.union(v.string(), v.null())),
  pageTitle: v.optional(v.union(v.string(), v.null())),
  visitorId: v.optional(v.union(v.string(), v.null())),
  sessionId: v.optional(v.union(v.string(), v.null())),
  location: v.optional(v.union(v.string(), v.null())),
  intent: v.optional(v.union(v.string(), v.null())),
  destination: v.optional(v.union(v.string(), v.null())),
  payload: v.optional(v.any()),
  receivedAt: v.optional(v.string()),
});

function marketingEventPayload(args: any, timestamp: string) {
  return {
    eventName: args.eventName,
    source: args.source,
    pagePath: optionalString(args.pagePath),
    pageUrl: optionalString(args.pageUrl),
    pageTitle: optionalString(args.pageTitle),
    visitorId: optionalString(args.visitorId),
    sessionId: optionalString(args.sessionId),
    location: optionalString(args.location),
    intent: optionalString(args.intent),
    destination: optionalString(args.destination),
    payload: args.payload ?? undefined,
    receivedAt: args.receivedAt || timestamp,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export const listMarketingEvents = query({
  args: {
    sinceIso: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 5000;
    const entries = args.sinceIso
      ? await ctx.db
        .query("behaviorStudyToolsMarketingEvents")
        .withIndex("by_received_at", (q) => q.gte("receivedAt", args.sinceIso!))
        .collect()
      : await ctx.db.query("behaviorStudyToolsMarketingEvents").collect();

    return entries
      .sort((a, b) => b.receivedAt.localeCompare(a.receivedAt))
      .slice(0, limit)
      .map(toMarketingEventRow);
  },
});

export const createMarketingEvent = mutation({
  args: marketingEventInput,
  handler: async (ctx, args) => {
    const timestamp = nowIso();
    const id = await ctx.db.insert("behaviorStudyToolsMarketingEvents", marketingEventPayload(args, timestamp));
    const entry = await ctx.db.get(id);
    return entry ? toMarketingEventRow(entry) : null;
  },
});

export const importMarketingEvent = mutation({
  args: {
    legacyId: v.string(),
    eventName: v.string(),
    source: v.string(),
    pagePath: v.optional(v.union(v.string(), v.null())),
    pageUrl: v.optional(v.union(v.string(), v.null())),
    pageTitle: v.optional(v.union(v.string(), v.null())),
    visitorId: v.optional(v.union(v.string(), v.null())),
    sessionId: v.optional(v.union(v.string(), v.null())),
    location: v.optional(v.union(v.string(), v.null())),
    intent: v.optional(v.union(v.string(), v.null())),
    destination: v.optional(v.union(v.string(), v.null())),
    payload: v.optional(v.any()),
    receivedAt: v.optional(v.string()),
    createdAt: v.optional(v.string()),
    updatedAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await getMarketingEventByLegacyId(ctx, args.legacyId);
    const timestamp = nowIso();
    const payload = {
      legacyId: args.legacyId,
      ...marketingEventPayload(args, args.createdAt || timestamp),
      updatedAt: args.updatedAt || timestamp,
    };

    if (existing) {
      await ctx.db.patch(existing._id, payload);
      return existing._id;
    }

    return ctx.db.insert("behaviorStudyToolsMarketingEvents", payload);
  },
});

const growthSignalInput = v.object({
  signalDate: v.string(),
  source: v.string(),
  signalType: v.string(),
  channel: v.optional(v.union(v.string(), v.null())),
  url: v.optional(v.union(v.string(), v.null())),
  keyword: v.optional(v.union(v.string(), v.null())),
  topic: v.optional(v.union(v.string(), v.null())),
  metricName: v.optional(v.union(v.string(), v.null())),
  metricValue: v.optional(v.union(v.number(), v.null())),
  previousValue: v.optional(v.union(v.number(), v.null())),
  changeValue: v.optional(v.union(v.number(), v.null())),
  changePercent: v.optional(v.union(v.number(), v.null())),
  metadata: v.optional(v.any()),
  recommendation: v.optional(v.union(v.string(), v.null())),
  status: v.optional(v.string()),
  createdAt: v.optional(v.string()),
});

function growthSignalPayload(args: any, timestamp: string) {
  return {
    signalDate: args.signalDate,
    source: args.source,
    signalType: args.signalType,
    channel: optionalString(args.channel),
    url: optionalString(args.url),
    keyword: optionalString(args.keyword),
    topic: optionalString(args.topic),
    metricName: optionalString(args.metricName),
    metricValue: optionalNumber(args.metricValue),
    previousValue: optionalNumber(args.previousValue),
    changeValue: optionalNumber(args.changeValue),
    changePercent: optionalNumber(args.changePercent),
    metadata: args.metadata ?? undefined,
    recommendation: optionalString(args.recommendation),
    status: args.status || "new",
    createdAt: args.createdAt || timestamp,
    updatedAt: timestamp,
  };
}

export const listGrowthSignals = query({
  args: {
    source: v.optional(v.string()),
    sinceDate: v.optional(v.string()),
    signalTypes: v.optional(v.array(v.string())),
    statuses: v.optional(v.array(v.string())),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 100;
    const entries = args.sinceDate
      ? await ctx.db
        .query("behaviorStudyToolsGrowthSignals")
        .withIndex("by_signal_date", (q) => q.gte("signalDate", args.sinceDate!))
        .collect()
      : await ctx.db.query("behaviorStudyToolsGrowthSignals").collect();

    return entries
      .filter((signal) => !args.source || signal.source === args.source)
      .filter((signal) => !args.signalTypes?.length || args.signalTypes.includes(signal.signalType))
      .filter((signal) => !args.statuses?.length || args.statuses.includes(signal.status))
      .sort((a, b) => {
        const dateCompare = b.signalDate.localeCompare(a.signalDate);
        if (dateCompare !== 0) return dateCompare;
        return b.createdAt.localeCompare(a.createdAt);
      })
      .slice(0, limit)
      .map(toGrowthSignalRow);
  },
});

export const createGrowthSignals = mutation({
  args: {
    signals: v.array(growthSignalInput),
  },
  handler: async (ctx, args) => {
    const timestamp = nowIso();
    const rows = [];
    for (const signal of args.signals) {
      const id = await ctx.db.insert("behaviorStudyToolsGrowthSignals", growthSignalPayload(signal, timestamp));
      const row = await ctx.db.get(id);
      if (row) rows.push(toGrowthSignalRow(row));
    }
    return rows;
  },
});

export const importGrowthSignal = mutation({
  args: {
    legacyId: v.string(),
    signalDate: v.string(),
    source: v.string(),
    signalType: v.string(),
    channel: v.optional(v.union(v.string(), v.null())),
    url: v.optional(v.union(v.string(), v.null())),
    keyword: v.optional(v.union(v.string(), v.null())),
    topic: v.optional(v.union(v.string(), v.null())),
    metricName: v.optional(v.union(v.string(), v.null())),
    metricValue: v.optional(v.union(v.number(), v.null())),
    previousValue: v.optional(v.union(v.number(), v.null())),
    changeValue: v.optional(v.union(v.number(), v.null())),
    changePercent: v.optional(v.union(v.number(), v.null())),
    metadata: v.optional(v.any()),
    recommendation: v.optional(v.union(v.string(), v.null())),
    status: v.optional(v.string()),
    createdAt: v.optional(v.string()),
    updatedAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await getGrowthSignalByLegacyId(ctx, args.legacyId);
    const timestamp = nowIso();
    const payload = {
      legacyId: args.legacyId,
      ...growthSignalPayload(args, timestamp),
      updatedAt: args.updatedAt || timestamp,
    };

    if (existing) {
      await ctx.db.patch(existing._id, payload);
      return existing._id;
    }

    return ctx.db.insert("behaviorStudyToolsGrowthSignals", payload);
  },
});

export const updateGrowthSignalStatus = mutation({
  args: {
    id: v.id("behaviorStudyToolsGrowthSignals"),
    status: v.string(),
    source: v.optional(v.string()),
    signalType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) return null;
    if (args.source && existing.source !== args.source) return null;
    if (args.signalType && existing.signalType !== args.signalType) return null;

    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: nowIso(),
    });

    const updated = await ctx.db.get(args.id);
    return updated ? toGrowthSignalRow(updated) : null;
  },
});
