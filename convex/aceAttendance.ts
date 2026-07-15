import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";

const verificationMethod = v.union(
  v.literal("attendance_log"),
  v.literal("quiz_completion"),
  v.literal("verification_code"),
  v.literal("time_on_task"),
  v.literal("check_in_prompts")
);

function now() {
  return Date.now();
}

function compact<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined)
  ) as Partial<T>;
}

async function withParticipant(
  ctx: QueryCtx | MutationCtx,
  row: Doc<"aceAttendanceRecords"> | null
) {
  if (!row) return null;
  const participant = await ctx.db.get(row.participantId);
  return { ...row, participant };
}

async function getByEventAndParticipantInternal(
  ctx: QueryCtx | MutationCtx,
  eventId: Id<"aceEvents">,
  participantId: Id<"aceUsers">
) {
  return ctx.db
    .query("aceAttendanceRecords")
    .withIndex("by_event_participant", (q) =>
      q.eq("eventId", eventId).eq("participantId", participantId)
    )
    .unique();
}

async function patchRegistrationAttendance(
  ctx: MutationCtx,
  eventId: Id<"aceEvents">,
  participantId: Id<"aceUsers">,
  attendanceVerified: boolean
) {
  const registration = await ctx.db
    .query("aceRegistrations")
    .withIndex("by_event_participant", (q) =>
      q.eq("eventId", eventId).eq("participantId", participantId)
    )
    .unique();

  if (!registration) return;

  await ctx.db.patch(registration._id, {
    attendanceVerified,
    updatedAt: now(),
  });
}

export const getById = query({
  args: { id: v.id("aceAttendanceRecords") },
  handler: async (ctx, args) => withParticipant(ctx, await ctx.db.get(args.id)),
});

export const getByEvent = query({
  args: { eventId: v.id("aceEvents") },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("aceAttendanceRecords")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();
    const result = [];
    for (const row of rows.sort((a, b) => a.createdAt - b.createdAt)) {
      result.push(await withParticipant(ctx, row));
    }
    return result;
  },
});

export const getByParticipant = query({
  args: { participantId: v.id("aceUsers") },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("aceAttendanceRecords")
      .withIndex("by_participant", (q) => q.eq("participantId", args.participantId))
      .collect();
    const result = [];
    for (const row of rows.sort((a, b) => b.createdAt - a.createdAt)) {
      result.push(await withParticipant(ctx, row));
    }
    return result;
  },
});

export const getByEventAndParticipant = query({
  args: {
    eventId: v.id("aceEvents"),
    participantId: v.id("aceUsers"),
  },
  handler: async (ctx, args) =>
    withParticipant(
      ctx,
      await getByEventAndParticipantInternal(ctx, args.eventId, args.participantId)
    ),
});

export const markAttendance = mutation({
  args: {
    eventId: v.id("aceEvents"),
    participantId: v.id("aceUsers"),
    checkIn: v.optional(v.boolean()),
    checkOut: v.optional(v.boolean()),
    verificationCode: v.optional(v.string()),
    verified: v.optional(v.boolean()),
    verificationMethod: v.optional(verificationMethod),
    signInTimestamp: v.optional(v.number()),
    signOutTimestamp: v.optional(v.number()),
    clearSignInTimestamp: v.optional(v.boolean()),
    clearSignOutTimestamp: v.optional(v.boolean()),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const [event, participant, existing] = await Promise.all([
      ctx.db.get(args.eventId),
      ctx.db.get(args.participantId),
      getByEventAndParticipantInternal(ctx, args.eventId, args.participantId),
    ]);

    if (!event) throw new Error("Event not found");
    if (!participant) throw new Error("Participant not found");

    const timestamp = now();
    const verificationCode = args.verificationCode?.trim();
    const verified = args.verified ?? existing?.verified ?? Boolean(verificationCode);
    const signInTimestamp = args.checkIn
      ? (args.signInTimestamp ?? timestamp)
      : args.signInTimestamp ?? existing?.signInTimestamp;
    const signOutTimestamp = args.checkOut
      ? (args.signOutTimestamp ?? timestamp)
      : args.signOutTimestamp ?? existing?.signOutTimestamp;

    const patch = compact({
      verificationMethod: args.verificationMethod ?? (verificationCode ? "verification_code" : "attendance_log"),
      verified,
      verifiedAt: verified ? (existing?.verifiedAt ?? timestamp) : undefined,
      signInTimestamp,
      signOutTimestamp,
      verificationCodeEntered: verificationCode,
      verificationCodeTimestamp: verificationCode ? timestamp : undefined,
      ipAddress: args.ipAddress,
      userAgent: args.userAgent,
      updatedAt: timestamp,
    });

    if (!verified) patch.verifiedAt = undefined;
    if (args.clearSignInTimestamp) patch.signInTimestamp = undefined;
    if (args.clearSignOutTimestamp) patch.signOutTimestamp = undefined;

    let id: Id<"aceAttendanceRecords">;
    if (existing) {
      await ctx.db.patch(existing._id, patch);
      id = existing._id;
    } else {
      id = await ctx.db.insert("aceAttendanceRecords", {
        eventId: args.eventId,
        participantId: args.participantId,
        verificationMethod: args.verificationMethod ?? (verificationCode ? "verification_code" : "attendance_log"),
        verified,
        verifiedAt: verified ? timestamp : undefined,
        signInTimestamp,
        signOutTimestamp,
        verificationCodeEntered: verificationCode,
        verificationCodeTimestamp: verificationCode ? timestamp : undefined,
        ipAddress: args.ipAddress,
        userAgent: args.userAgent,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
    }

    await patchRegistrationAttendance(ctx, args.eventId, args.participantId, verified);

    return withParticipant(ctx, await ctx.db.get(id));
  },
});

export const verify = mutation({
  args: {
    id: v.id("aceAttendanceRecords"),
    verified: v.boolean(),
    verifiedBy: v.optional(v.id("aceUsers")),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Attendance record not found");

    const timestamp = now();
    await ctx.db.patch(args.id, {
      verified: args.verified,
      verifiedAt: args.verified ? timestamp : undefined,
      verifiedBy: args.verified ? args.verifiedBy : undefined,
      updatedAt: timestamp,
    });

    await patchRegistrationAttendance(
      ctx,
      existing.eventId,
      existing.participantId,
      args.verified
    );

    return withParticipant(ctx, await ctx.db.get(args.id));
  },
});

export const remove = mutation({
  args: { id: v.id("aceAttendanceRecords") },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Attendance record not found");

    await ctx.db.delete(args.id);
    await patchRegistrationAttendance(ctx, existing.eventId, existing.participantId, false);

    return { success: true };
  },
});
