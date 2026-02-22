import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ============================================================================
// ACE FEEDBACK - Queries & Mutations
// ============================================================================

// Get feedback for event
export const getByEvent = query({
  args: { eventId: v.id("aceEvents") },
  handler: async (ctx, args) => {
    const feedback = await ctx.db
      .query("aceFeedbackResponses")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    // Get participant info
    const feedbackWithParticipants = await Promise.all(
      feedback.map(async (fb) => {
        const participant = await ctx.db.get(fb.participantId);
        return { ...fb, participant };
      })
    );

    return feedbackWithParticipants;
  },
});

// Get feedback by participant
export const getByParticipant = query({
  args: { participantId: v.id("aceUsers") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("aceFeedbackResponses")
      .withIndex("by_participant", (q) => q.eq("participantId", args.participantId))
      .collect();
  },
});

// Check if participant has submitted feedback
export const hasSubmitted = query({
  args: {
    eventId: v.id("aceEvents"),
    participantId: v.id("aceUsers"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("aceFeedbackResponses")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .filter((q) => q.eq(q.field("participantId"), args.participantId))
      .first();

    return !!existing;
  },
});

// Submit feedback
export const submit = mutation({
  args: {
    eventId: v.id("aceEvents"),
    participantId: v.id("aceUsers"),
    rating: v.number(),
    instructorRating: v.number(),
    contentRating: v.number(),
    relevanceRating: v.optional(v.number()),
    comments: v.optional(v.string()),
    suggestions: v.optional(v.string()),
    wouldRecommend: v.boolean(),
    applicationPlan: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check for existing feedback
    const existing = await ctx.db
      .query("aceFeedbackResponses")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .filter((q) => q.eq(q.field("participantId"), args.participantId))
      .first();

    if (existing) {
      throw new Error("Feedback already submitted for this event");
    }

    const feedbackId = await ctx.db.insert("aceFeedbackResponses", {
      eventId: args.eventId,
      participantId: args.participantId,
      rating: args.rating,
      instructorRating: args.instructorRating,
      contentRating: args.contentRating,
      relevanceRating: args.relevanceRating,
      comments: args.comments,
      suggestions: args.suggestions,
      wouldRecommend: args.wouldRecommend,
      applicationPlan: args.applicationPlan,
      submittedAt: now,
      createdAt: now,
    });

    // Update registration
    const registration = await ctx.db
      .query("aceRegistrations")
      .withIndex("by_event_participant", (q) =>
        q.eq("eventId", args.eventId).eq("participantId", args.participantId)
      )
      .first();

    if (registration) {
      await ctx.db.patch(registration._id, {
        feedbackCompleted: true,
        updatedAt: now,
      });
    }

    return feedbackId;
  },
});

// Get event feedback summary
export const getSummary = query({
  args: { eventId: v.id("aceEvents") },
  handler: async (ctx, args) => {
    const feedback = await ctx.db
      .query("aceFeedbackResponses")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    if (feedback.length === 0) {
      return {
        count: 0,
        averageRating: 0,
        averageInstructorRating: 0,
        averageContentRating: 0,
        recommendPercentage: 0,
      };
    }

    const totalRating = feedback.reduce((sum, fb) => sum + (fb.rating || 0), 0);
    const totalInstructorRating = feedback.reduce((sum, fb) => sum + (fb.instructorRating || 0), 0);
    const totalContentRating = feedback.reduce((sum, fb) => sum + (fb.contentRating || 0), 0);
    const wouldRecommendCount = feedback.filter((fb) => fb.wouldRecommend).length;

    return {
      count: feedback.length,
      averageRating: Math.round((totalRating / feedback.length) * 10) / 10,
      averageInstructorRating: Math.round((totalInstructorRating / feedback.length) * 10) / 10,
      averageContentRating: Math.round((totalContentRating / feedback.length) * 10) / 10,
      recommendPercentage: Math.round((wouldRecommendCount / feedback.length) * 100),
    };
  },
});
