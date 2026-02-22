import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ============================================================================
// ACE REGISTRATIONS - Queries & Mutations
// ============================================================================

// Generate confirmation code
function generateConfirmationCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Get registration by ID
export const getById = query({
  args: { id: v.id("aceRegistrations") },
  handler: async (ctx, args) => {
    const registration = await ctx.db.get(args.id);
    if (!registration) return null;

    const event = await ctx.db.get(registration.eventId);
    const participant = await ctx.db.get(registration.participantId);

    return { ...registration, event, participant };
  },
});

// Get registration by event and participant
export const getByEventAndParticipant = query({
  args: {
    eventId: v.id("aceEvents"),
    participantId: v.id("aceUsers"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("aceRegistrations")
      .withIndex("by_event_participant", (q) =>
        q.eq("eventId", args.eventId).eq("participantId", args.participantId)
      )
      .first();
  },
});

// Get registrations for event
export const getByEvent = query({
  args: { eventId: v.id("aceEvents") },
  handler: async (ctx, args) => {
    const registrations = await ctx.db
      .query("aceRegistrations")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .filter((q) => q.eq(q.field("status"), "confirmed"))
      .collect();

    // Get participant info
    const regsWithParticipants = await Promise.all(
      registrations.map(async (reg) => {
        const participant = await ctx.db.get(reg.participantId);
        return { ...reg, participant };
      })
    );

    return regsWithParticipants;
  },
});

// Get registrations for participant
export const getByParticipant = query({
  args: { participantId: v.id("aceUsers") },
  handler: async (ctx, args) => {
    const registrations = await ctx.db
      .query("aceRegistrations")
      .withIndex("by_participant", (q) => q.eq("participantId", args.participantId))
      .collect();

    // Get event info
    const regsWithEvents = await Promise.all(
      registrations.map(async (reg) => {
        const event = await ctx.db.get(reg.eventId);
        return { ...reg, event };
      })
    );

    return regsWithEvents;
  },
});

// Register for event
export const register = mutation({
  args: {
    eventId: v.id("aceEvents"),
    participantId: v.id("aceUsers"),
    credentialType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if already registered
    const existing = await ctx.db
      .query("aceRegistrations")
      .withIndex("by_event_participant", (q) =>
        q.eq("eventId", args.eventId).eq("participantId", args.participantId)
      )
      .first();

    if (existing) {
      return {
        success: false,
        error: "Already registered for this event",
        registrationId: existing._id,
        confirmationCode: existing.confirmationCode,
      };
    }

    // Get event
    const event = await ctx.db.get(args.eventId);
    if (!event) {
      return { success: false, error: "Event not found" };
    }

    // Check capacity
    if (event.maxParticipants && (event.currentParticipants || 0) >= event.maxParticipants) {
      return { success: false, error: "Event is at capacity" };
    }

    const now = Date.now();
    const confirmationCode = generateConfirmationCode();
    const isFreeEvent = !event.fee || event.fee === 0;

    // Create registration
    const registrationId = await ctx.db.insert("aceRegistrations", {
      eventId: args.eventId,
      participantId: args.participantId,
      confirmationCode,
      status: isFreeEvent ? "confirmed" : "pending",
      feeAmount: event.fee || 0,
      feePaid: isFreeEvent,
      credentialType: args.credentialType,
      attendanceVerified: false,
      quizCompleted: false,
      feedbackCompleted: false,
      certificateIssued: false,
      createdAt: now,
      updatedAt: now,
    });

    // Increment participant count
    await ctx.db.patch(args.eventId, {
      currentParticipants: (event.currentParticipants || 0) + 1,
      updatedAt: now,
    });

    return {
      success: true,
      registrationId,
      confirmationCode,
      requiresPayment: !isFreeEvent,
    };
  },
});

// Update registration status
export const updateStatus = mutation({
  args: {
    id: v.id("aceRegistrations"),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("cancelled"),
      v.literal("completed")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

// Mark payment complete
export const markPaymentComplete = mutation({
  args: {
    id: v.id("aceRegistrations"),
    stripeSessionId: v.optional(v.string()),
    stripePaymentIntentId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.patch(args.id, {
      feePaid: true,
      paymentDate: now,
      stripeSessionId: args.stripeSessionId,
      stripePaymentIntentId: args.stripePaymentIntentId,
      status: "confirmed",
      updatedAt: now,
    });
  },
});

// Update completion flags
export const updateCompletion = mutation({
  args: {
    id: v.id("aceRegistrations"),
    attendanceVerified: v.optional(v.boolean()),
    quizCompleted: v.optional(v.boolean()),
    feedbackCompleted: v.optional(v.boolean()),
    certificateIssued: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    // Filter out undefined values
    const filteredUpdates: Record<string, any> = { updatedAt: Date.now() };
    if (updates.attendanceVerified !== undefined) {
      filteredUpdates.attendanceVerified = updates.attendanceVerified;
    }
    if (updates.quizCompleted !== undefined) {
      filteredUpdates.quizCompleted = updates.quizCompleted;
    }
    if (updates.feedbackCompleted !== undefined) {
      filteredUpdates.feedbackCompleted = updates.feedbackCompleted;
    }
    if (updates.certificateIssued !== undefined) {
      filteredUpdates.certificateIssued = updates.certificateIssued;
    }

    return await ctx.db.patch(id, filteredUpdates);
  },
});

// Get all registrations (admin)
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const registrations = await ctx.db
      .query("aceRegistrations")
      .order("desc")
      .collect();

    // Get participant and event info
    const regsWithDetails = await Promise.all(
      registrations.map(async (reg) => {
        const participant = await ctx.db.get(reg.participantId);
        const event = await ctx.db.get(reg.eventId);
        return { ...reg, participant, event };
      })
    );

    return regsWithDetails;
  },
});

// Cancel registration
export const cancel = mutation({
  args: { id: v.id("aceRegistrations") },
  handler: async (ctx, args) => {
    const registration = await ctx.db.get(args.id);
    if (!registration) throw new Error("Registration not found");

    // Decrement participant count on event
    const event = await ctx.db.get(registration.eventId);
    if (event && (event.currentParticipants || 0) > 0) {
      await ctx.db.patch(registration.eventId, {
        currentParticipants: (event.currentParticipants || 0) - 1,
        updatedAt: Date.now(),
      });
    }

    await ctx.db.patch(args.id, {
      status: "cancelled",
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Get registration by confirmation code
export const getByConfirmationCode = query({
  args: { confirmationCode: v.string() },
  handler: async (ctx, args) => {
    const registration = await ctx.db
      .query("aceRegistrations")
      .withIndex("by_confirmation_code", (q) =>
        q.eq("confirmationCode", args.confirmationCode)
      )
      .first();

    if (!registration) return null;

    const event = await ctx.db.get(registration.eventId);
    const participant = await ctx.db.get(registration.participantId);

    return { ...registration, event, participant };
  },
});
