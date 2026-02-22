import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ============================================================================
// ACE ATTENDANCE - Queries & Mutations
// ============================================================================

// Get attendance record by ID
export const getById = query({
  args: { id: v.id("aceAttendanceRecords") },
  handler: async (ctx, args) => {
    const record = await ctx.db.get(args.id);
    if (!record) return null;

    const participant = await ctx.db.get(record.participantId);
    return { ...record, participant };
  },
});

// Get attendance record for event and participant
export const getByEventAndParticipant = query({
  args: {
    eventId: v.id("aceEvents"),
    participantId: v.id("aceUsers"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("aceAttendanceRecords")
      .withIndex("by_event_participant", (q) =>
        q.eq("eventId", args.eventId).eq("participantId", args.participantId)
      )
      .first();
  },
});

// Get attendance records for event
export const getByEvent = query({
  args: { eventId: v.id("aceEvents") },
  handler: async (ctx, args) => {
    const records = await ctx.db
      .query("aceAttendanceRecords")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    // Get participant info
    const recordsWithParticipants = await Promise.all(
      records.map(async (rec) => {
        const participant = await ctx.db.get(rec.participantId);
        return { ...rec, participant };
      })
    );

    return recordsWithParticipants;
  },
});

// Mark attendance (check-in or check-out)
export const markAttendance = mutation({
  args: {
    eventId: v.id("aceEvents"),
    participantId: v.id("aceUsers"),
    checkIn: v.optional(v.boolean()),
    checkOut: v.optional(v.boolean()),
    verificationCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Get existing record
    const existing = await ctx.db
      .query("aceAttendanceRecords")
      .withIndex("by_event_participant", (q) =>
        q.eq("eventId", args.eventId).eq("participantId", args.participantId)
      )
      .first();

    if (existing) {
      // Update existing record
      const updates: Record<string, any> = { updatedAt: now };

      if (args.checkOut) {
        updates.signOutTimestamp = now;
      }

      if (args.verificationCode) {
        updates.verificationCodeEntered = args.verificationCode;
        updates.verificationCodeTimestamp = now;
      }

      await ctx.db.patch(existing._id, updates);
      return existing._id;
    }

    // Create new record
    const recordId = await ctx.db.insert("aceAttendanceRecords", {
      eventId: args.eventId,
      participantId: args.participantId,
      verificationMethod: "attendance_log",
      verified: true,
      verifiedAt: now,
      signInTimestamp: now,
      verificationCodeEntered: args.verificationCode,
      verificationCodeTimestamp: args.verificationCode ? now : undefined,
      createdAt: now,
      updatedAt: now,
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
        attendanceVerified: true,
        updatedAt: now,
      });
    }

    return recordId;
  },
});

// Verify attendance (by admin/coordinator)
export const verify = mutation({
  args: {
    id: v.id("aceAttendanceRecords"),
    verified: v.boolean(),
    verifiedBy: v.optional(v.id("aceUsers")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.patch(args.id, {
      verified: args.verified,
      verifiedAt: now,
      verifiedBy: args.verifiedBy,
      updatedAt: now,
    });
  },
});
