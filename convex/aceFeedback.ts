import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Doc } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";

function now() {
  return Date.now();
}

function daysFromNow(days: number) {
  return now() + days * 24 * 60 * 60 * 1000;
}

function compact<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined)
  ) as Partial<T>;
}

async function withDetails(
  ctx: QueryCtx | MutationCtx,
  row: Doc<"aceFeedbackResponses">
) {
  const event = await ctx.db.get(row.eventId);
  const participant = await ctx.db.get(row.participantId);
  return {
    ...row,
    eventTitle: event?.title ?? null,
    participantName: participant
      ? [participant.firstName, participant.lastName].filter(Boolean).join(" ")
      : null,
    participantEmail: participant?.email ?? null,
  };
}

export const list = query({
  args: {
    eventId: v.optional(v.id("aceEvents")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const rows = args.eventId
      ? await ctx.db
          .query("aceFeedbackResponses")
          .withIndex("by_event", (q) => q.eq("eventId", args.eventId!))
          .collect()
      : await ctx.db.query("aceFeedbackResponses").collect();

    const sorted = rows
      .sort((a, b) => b.submittedAt - a.submittedAt)
      .slice(0, Math.min(args.limit ?? 500, 1000));

    const result = [];
    for (const row of sorted) result.push(await withDetails(ctx, row));
    return result;
  },
});

export const create = mutation({
  args: {
    eventId: v.id("aceEvents"),
    participantId: v.id("aceUsers"),
    rating: v.optional(v.number()),
    instructorRating: v.optional(v.number()),
    contentRating: v.optional(v.number()),
    relevanceRating: v.optional(v.number()),
    comments: v.optional(v.string()),
    suggestions: v.optional(v.string()),
    wouldRecommend: v.optional(v.boolean()),
    applicationPlan: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error("Event not found");
    const participant = await ctx.db.get(args.participantId);
    if (!participant) throw new Error("Participant not found");

    const timestamp = now();
    const id = await ctx.db.insert("aceFeedbackResponses", {
      eventId: args.eventId,
      participantId: args.participantId,
      rating: args.rating,
      instructorRating: args.instructorRating,
      contentRating: args.contentRating,
      relevanceRating: args.relevanceRating,
      comments: args.comments?.trim() || undefined,
      suggestions: args.suggestions?.trim() || undefined,
      wouldRecommend: args.wouldRecommend,
      applicationPlan: args.applicationPlan?.trim() || undefined,
      submittedAt: timestamp,
      coordinatorReviewDueDate: daysFromNow(45),
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    const registrations = await ctx.db
      .query("aceRegistrations")
      .withIndex("by_event_participant", (q) =>
        q.eq("eventId", args.eventId).eq("participantId", args.participantId)
      )
      .collect();
    for (const registration of registrations) {
      await ctx.db.patch(registration._id, {
        feedbackCompleted: true,
        updatedAt: timestamp,
      });
    }

    const row = await ctx.db.get(id);
    return row ? withDetails(ctx, row) : null;
  },
});

export const review = mutation({
  args: {
    id: v.id("aceFeedbackResponses"),
    coordinatorNotes: v.optional(v.string()),
    coordinatorActionTaken: v.optional(v.string()),
    coordinatorReviewedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Feedback not found");

    await ctx.db.patch(args.id, compact({
      coordinatorNotes: args.coordinatorNotes?.trim(),
      coordinatorActionTaken: args.coordinatorActionTaken?.trim(),
      coordinatorReviewedAt: args.coordinatorReviewedAt ?? now(),
      updatedAt: now(),
    }));

    return ctx.db.get(args.id);
  },
});
