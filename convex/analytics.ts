import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

function nowIso() {
  return new Date().toISOString();
}

function toAnalyticsEventRow(event: any) {
  return {
    id: event._id,
    event_type: event.eventType,
    event_name: event.eventName,
    source_page: event.sourcePage,
    user_email: event.userEmail ?? null,
    resource_name: event.resourceName ?? null,
    value: event.value,
    timestamp: event.createdAt,
    additional_data: event.additionalData ?? null,
  };
}

async function getByLegacyId(ctx: any, legacyId: string) {
  return ctx.db
    .query("analyticsEvents")
    .withIndex("by_legacy_id", (q: any) => q.eq("legacyId", legacyId))
    .first();
}

function countByType(events: any[], eventType: string) {
  return events.filter((event) => event.eventType === eventType).length;
}

function calculateTrend(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

export const createConversionEvent = mutation({
  args: {
    eventType: v.string(),
    eventName: v.string(),
    sourcePage: v.string(),
    userEmail: v.optional(v.string()),
    resourceName: v.optional(v.string()),
    value: v.optional(v.number()),
    additionalData: v.optional(v.any()),
    userAgent: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    createdAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const timestamp = nowIso();
    const id = await ctx.db.insert("analyticsEvents", {
      eventType: args.eventType,
      eventName: args.eventName,
      sourcePage: args.sourcePage,
      userEmail: args.userEmail || undefined,
      resourceName: args.resourceName || undefined,
      value: args.value ?? 0,
      additionalData: args.additionalData ?? undefined,
      userAgent: args.userAgent || undefined,
      ipAddress: args.ipAddress || undefined,
      createdAt: args.createdAt || timestamp,
      updatedAt: timestamp,
    });
    const event = await ctx.db.get(id);
    return event ? toAnalyticsEventRow(event) : null;
  },
});

export const conversionSummary = query({
  args: {
    days: v.number(),
    startDateIso: v.string(),
    previousStartDateIso: v.string(),
    previousEndDateIso: v.string(),
  },
  handler: async (ctx, args) => {
    const currentEvents = await ctx.db
      .query("analyticsEvents")
      .withIndex("by_created_at", (q) => q.gte("createdAt", args.startDateIso))
      .collect();

    const previousEvents = await ctx.db
      .query("analyticsEvents")
      .withIndex("by_created_at", (q) => q.gte("createdAt", args.previousStartDateIso))
      .collect();
    const boundedPreviousEvents = previousEvents.filter(
      (event) => event.createdAt < args.previousEndDateIso
    );

    const emailSignups = countByType(currentEvents, "email_signup");
    const downloads = countByType(currentEvents, "download");
    const courseInquiries = countByType(currentEvents, "course_inquiry");
    const studyAppSignups = countByType(currentEvents, "study_app_signup");
    const toolUsage = countByType(currentEvents, "tool_usage");
    const totalConversions = currentEvents.length;
    const totalValue = currentEvents.reduce((sum, event) => sum + (event.value || 0), 0);

    const prevEmailSignups = countByType(boundedPreviousEvents, "email_signup");
    const prevDownloads = countByType(boundedPreviousEvents, "download");
    const prevCourseInquiries = countByType(boundedPreviousEvents, "course_inquiry");
    const prevStudyAppSignups = countByType(boundedPreviousEvents, "study_app_signup");

    const recentEvents = currentEvents
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 10)
      .map(toAnalyticsEventRow);

    return {
      conversionData: {
        totalConversions,
        emailSignups,
        downloads,
        courseInquiries,
        studyAppSignups,
        toolUsage,
        conversionRate: null,
        totalValue: Number(totalValue.toFixed(2)),
        period: `Last ${args.days} days`,
        trends: {
          emailSignups: calculateTrend(emailSignups, prevEmailSignups),
          downloads: calculateTrend(downloads, prevDownloads),
          courseInquiries: calculateTrend(courseInquiries, prevCourseInquiries),
          studyAppSignups: calculateTrend(studyAppSignups, prevStudyAppSignups),
        },
      },
      recentEvents,
    };
  },
});

export const importConversionEvent = mutation({
  args: {
    legacyId: v.string(),
    eventType: v.string(),
    eventName: v.string(),
    sourcePage: v.string(),
    userEmail: v.optional(v.string()),
    resourceName: v.optional(v.string()),
    value: v.optional(v.number()),
    additionalData: v.optional(v.any()),
    userAgent: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await getByLegacyId(ctx, args.legacyId);
    const payload = {
      legacyId: args.legacyId,
      eventType: args.eventType,
      eventName: args.eventName,
      sourcePage: args.sourcePage,
      userEmail: args.userEmail || undefined,
      resourceName: args.resourceName || undefined,
      value: args.value ?? 0,
      additionalData: args.additionalData ?? undefined,
      userAgent: args.userAgent || undefined,
      ipAddress: args.ipAddress || undefined,
      createdAt: args.createdAt,
      updatedAt: args.updatedAt || nowIso(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, payload);
      return existing._id;
    }

    return ctx.db.insert("analyticsEvents", payload);
  },
});
