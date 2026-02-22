import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ============================================================================
// ACE EVENTS - Queries & Mutations
// ============================================================================

// Get public events (approved or in_progress)
export const getPublic = query({
  args: {
    category: v.optional(v.union(
      v.literal("learning"),
      v.literal("ethics"),
      v.literal("supervision"),
      v.literal("teaching")
    )),
    modality: v.optional(v.union(
      v.literal("in_person"),
      v.literal("synchronous"),
      v.literal("asynchronous")
    )),
    upcoming: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let events = await ctx.db
      .query("aceEvents")
      .withIndex("by_status")
      .filter((q) => 
        q.or(
          q.eq(q.field("status"), "approved"),
          q.eq(q.field("status"), "in_progress")
        )
      )
      .collect();

    // Filter by category
    if (args.category) {
      events = events.filter((e) => e.ceCategory === args.category);
    }

    // Filter by modality
    if (args.modality) {
      events = events.filter((e) => e.modality === args.modality);
    }

    // Filter upcoming
    if (args.upcoming) {
      const now = Date.now();
      events = events.filter((e) => e.startDate >= now);
    }

    // Sort by start date
    events.sort((a, b) => a.startDate - b.startDate);

    // Get provider info for each event
    const eventsWithProviders = await Promise.all(
      events.map(async (event) => {
        const provider = await ctx.db.get(event.providerId);
        return { ...event, provider };
      })
    );

    return eventsWithProviders;
  },
});

// Get event by ID with full details
export const getWithDetails = query({
  args: { id: v.id("aceEvents") },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.id);
    if (!event) return null;

    // Get provider
    const provider = await ctx.db.get(event.providerId);

    // Get quiz
    const quiz = await ctx.db
      .query("aceQuizzes")
      .withIndex("by_event", (q) => q.eq("eventId", args.id))
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();

    // Get instructors
    const eventInstructors = await ctx.db
      .query("aceEventInstructors")
      .withIndex("by_event", (q) => q.eq("eventId", args.id))
      .collect();

    const instructors = await Promise.all(
      eventInstructors.map(async (ei) => {
        const user = await ctx.db.get(ei.userId);
        return { ...user, role: ei.role };
      })
    );

    return {
      ...event,
      provider,
      quiz,
      instructors,
    };
  },
});

// Get events by provider
export const getByProvider = query({
  args: { providerId: v.id("aceProviders") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("aceEvents")
      .withIndex("by_provider", (q) => q.eq("providerId", args.providerId))
      .collect();
  },
});

// Create event
export const create = mutation({
  args: {
    providerId: v.id("aceProviders"),
    title: v.string(),
    description: v.optional(v.string()),
    totalCeus: v.number(),
    ceCategory: v.union(
      v.literal("learning"),
      v.literal("ethics"),
      v.literal("supervision"),
      v.literal("teaching")
    ),
    modality: v.union(
      v.literal("in_person"),
      v.literal("synchronous"),
      v.literal("asynchronous")
    ),
    eventType: v.optional(v.union(v.literal("ce"), v.literal("pd"))),
    startDate: v.number(),
    endDate: v.optional(v.number()),
    registrationDeadline: v.optional(v.number()),
    maxParticipants: v.optional(v.number()),
    location: v.optional(v.string()),
    onlineMeetingUrl: v.optional(v.string()),
    fee: v.optional(v.number()),
    verificationMethod: v.optional(v.union(
      v.literal("attendance_log"),
      v.literal("quiz_completion"),
      v.literal("verification_code"),
      v.literal("time_on_task"),
      v.literal("check_in_prompts")
    )),
    passingScorePercentage: v.optional(v.number()),
    learningObjectives: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Calculate minimum questions for async events
    let minimumQuestionsRequired = 0;
    if (args.modality === "asynchronous" && args.eventType === "ce") {
      minimumQuestionsRequired = Math.ceil(args.totalCeus * 3);
    }

    return await ctx.db.insert("aceEvents", {
      ...args,
      status: "draft",
      currentParticipants: 0,
      minimumQuestionsRequired,
      actualQuestionsCount: 0,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update event
export const update = mutation({
  args: {
    id: v.id("aceEvents"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    totalCeus: v.optional(v.number()),
    ceCategory: v.optional(v.union(
      v.literal("learning"),
      v.literal("ethics"),
      v.literal("supervision"),
      v.literal("teaching")
    )),
    modality: v.optional(v.union(
      v.literal("in_person"),
      v.literal("synchronous"),
      v.literal("asynchronous")
    )),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    maxParticipants: v.optional(v.number()),
    fee: v.optional(v.number()),
    status: v.optional(v.union(
      v.literal("draft"),
      v.literal("pending_approval"),
      v.literal("approved"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("archived")
    )),
    learningObjectives: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    // Recalculate minimum questions if modality or CEUs changed
    const event = await ctx.db.get(id);
    if (event) {
      const modality = updates.modality || event.modality;
      const ceus = updates.totalCeus || event.totalCeus;
      const eventType = event.eventType || "ce";
      
      if (modality === "asynchronous" && eventType === "ce") {
        (updates as any).minimumQuestionsRequired = Math.ceil(ceus * 3);
      }
    }

    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Increment participant count
export const incrementParticipants = mutation({
  args: { id: v.id("aceEvents") },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.id);
    if (!event) throw new Error("Event not found");
    
    return await ctx.db.patch(args.id, {
      currentParticipants: (event.currentParticipants || 0) + 1,
      updatedAt: Date.now(),
    });
  },
});

// Get active event count for provider
export const getActiveCount = query({
  args: { providerId: v.id("aceProviders") },
  handler: async (ctx, args) => {
    const now = Date.now();
    const events = await ctx.db
      .query("aceEvents")
      .withIndex("by_provider", (q) => q.eq("providerId", args.providerId))
      .filter((q) =>
        q.and(
          q.or(
            q.eq(q.field("status"), "approved"),
            q.eq(q.field("status"), "in_progress")
          ),
          q.gte(q.field("startDate"), now)
        )
      )
      .collect();
    
    return events.length;
  },
});
