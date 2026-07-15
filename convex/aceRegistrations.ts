import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";

const registrationStatus = v.union(
  v.literal("pending"),
  v.literal("confirmed"),
  v.literal("cancelled"),
  v.literal("completed")
);

function now() {
  return Date.now();
}

function confirmationCode(prefix = "REG") {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let index = 0; index < 8; index += 1) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${Date.now()}-${suffix}`;
}

async function withDetails(
  ctx: QueryCtx | MutationCtx,
  row: Doc<"aceRegistrations"> | null
) {
  if (!row) return null;
  const [participant, event] = await Promise.all([
    ctx.db.get(row.participantId),
    ctx.db.get(row.eventId),
  ]);
  return { ...row, participant, event };
}

async function adjustEventCount(
  ctx: MutationCtx,
  eventId: Id<"aceEvents">,
  delta: number
) {
  const event = await ctx.db.get(eventId);
  if (!event) return;
  const current = event.currentParticipants ?? 0;
  await ctx.db.patch(eventId, {
    currentParticipants: Math.max(0, current + delta),
    updatedAt: now(),
  });
}

function isEligibleForEvent(credentialType: string | undefined, eventType: string | undefined) {
  if (!credentialType || credentialType === "pending" || credentialType === "other") {
    return {
      eligible: false,
      error: "Please verify your credential before registering for events.",
      requiresCredentialVerification: true,
    };
  }

  if ((eventType ?? "ce") === "pd") {
    return credentialType === "rbt"
      ? { eligible: true }
      : {
          eligible: false,
          error: "PD events are only available for RBTs.",
          requiresCredentialVerification: false,
        };
  }

  return credentialType === "bcba" || credentialType === "bcaba"
    ? { eligible: true }
    : {
        eligible: false,
        error: "CE events are only available for BCBAs and BCaBAs.",
        requiresCredentialVerification: false,
      };
}

async function findExisting(
  ctx: QueryCtx | MutationCtx,
  eventId: Id<"aceEvents">,
  participantId: Id<"aceUsers">
) {
  return ctx.db
    .query("aceRegistrations")
    .withIndex("by_event_participant", (q) =>
      q.eq("eventId", eventId).eq("participantId", participantId)
    )
    .unique();
}

export const getAll = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const rows = await ctx.db.query("aceRegistrations").collect();
    const sorted = rows
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, Math.min(args.limit ?? 500, 1000));
    const result = [];
    for (const row of sorted) result.push(await withDetails(ctx, row));
    return result;
  },
});

export const getById = query({
  args: { id: v.id("aceRegistrations") },
  handler: async (ctx, args) => withDetails(ctx, await ctx.db.get(args.id)),
});

export const getByConfirmationCode = query({
  args: { confirmationCode: v.string() },
  handler: async (ctx, args) => {
    const row = await ctx.db
      .query("aceRegistrations")
      .withIndex("by_confirmation_code", (q) =>
        q.eq("confirmationCode", args.confirmationCode)
      )
      .unique();
    return withDetails(ctx, row);
  },
});

export const getByEvent = query({
  args: {
    eventId: v.id("aceEvents"),
    includeAllStatuses: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("aceRegistrations")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();
    const visibleRows = args.includeAllStatuses
      ? rows
      : rows.filter((row) => row.status === "confirmed" || row.status === "completed");
    const result = [];
    for (const row of visibleRows.sort((a, b) => b.createdAt - a.createdAt)) {
      result.push(await withDetails(ctx, row));
    }
    return result;
  },
});

export const getByParticipant = query({
  args: { participantId: v.id("aceUsers") },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("aceRegistrations")
      .withIndex("by_participant", (q) => q.eq("participantId", args.participantId))
      .collect();
    const result = [];
    for (const row of rows.sort((a, b) => b.createdAt - a.createdAt)) {
      result.push(await withDetails(ctx, row));
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
    withDetails(ctx, await findExisting(ctx, args.eventId, args.participantId)),
});

export const register = mutation({
  args: {
    eventId: v.id("aceEvents"),
    participantId: v.id("aceUsers"),
    credentialType: v.optional(v.string()),
    adminConfirmed: v.optional(v.boolean()),
    waitlist: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const [event, participant, existing] = await Promise.all([
      ctx.db.get(args.eventId),
      ctx.db.get(args.participantId),
      findExisting(ctx, args.eventId, args.participantId),
    ]);

    if (!event) return { success: false, error: "Event not found" };
    if (!participant) return { success: false, error: "Participant not found" };
    if (existing) {
      return {
        success: false,
        error: "You are already registered for this event",
        registrationId: existing._id,
        confirmationCode: existing.confirmationCode,
      };
    }

    if (!["approved", "in_progress", "draft"].includes(event.status)) {
      return { success: false, error: "This event is not available for registration" };
    }

    const confirmedCount = (await ctx.db
      .query("aceRegistrations")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect())
      .filter((row) => row.status === "confirmed" || row.status === "completed").length;

    if (!args.waitlist && event.maxParticipants && confirmedCount >= event.maxParticipants) {
      return { success: false, error: "This event is full" };
    }

    const credentialType = args.credentialType ?? participant.credentialType ?? "pending";
    const eligibility = isEligibleForEvent(credentialType, event.eventType);
    if (!eligibility.eligible) return { success: false, ...eligibility };

    if (args.adminConfirmed && !participant.credentialVerified) {
      return {
        success: false,
        error: "Credential must be verified before registering this participant.",
        requiresCredentialVerification: true,
      };
    }

    const timestamp = now();
    const feeAmount = event.fee ?? 0;
    const isConfirmed = !args.waitlist && (args.adminConfirmed || feeAmount === 0);
    const id = await ctx.db.insert("aceRegistrations", {
      eventId: args.eventId,
      participantId: args.participantId,
      confirmationCode: confirmationCode(),
      status: isConfirmed ? "confirmed" : "pending",
      feeAmount,
      feePaid: isConfirmed,
      paymentDate: isConfirmed ? timestamp : undefined,
      credentialType,
      attendanceVerified: false,
      quizCompleted: false,
      feedbackCompleted: false,
      certificateIssued: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    if (isConfirmed) await adjustEventCount(ctx, args.eventId, 1);

    return {
      success: true,
      registrationId: id,
      confirmationCode: (await ctx.db.get(id))?.confirmationCode,
      requiresPayment: feeAmount > 0 && !isConfirmed,
      waitlisted: args.waitlist ?? false,
    };
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("aceRegistrations"),
    status: registrationStatus,
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Registration not found");
    const wasActive = existing.status !== "cancelled";
    const willBeActive = args.status !== "cancelled";

    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: now(),
    });

    if (!wasActive && willBeActive) await adjustEventCount(ctx, existing.eventId, 1);
    if (wasActive && !willBeActive) await adjustEventCount(ctx, existing.eventId, -1);

    return withDetails(ctx, await ctx.db.get(args.id));
  },
});

export const updateCompletion = mutation({
  args: {
    id: v.id("aceRegistrations"),
    attendanceVerified: v.optional(v.boolean()),
    quizCompleted: v.optional(v.boolean()),
    feedbackCompleted: v.optional(v.boolean()),
    certificateIssued: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Registration not found");

    await ctx.db.patch(args.id, {
      attendanceVerified: args.attendanceVerified ?? existing.attendanceVerified,
      quizCompleted: args.quizCompleted ?? existing.quizCompleted,
      feedbackCompleted: args.feedbackCompleted ?? existing.feedbackCompleted,
      certificateIssued: args.certificateIssued ?? existing.certificateIssued,
      updatedAt: now(),
    });

    return withDetails(ctx, await ctx.db.get(args.id));
  },
});

export const markPaymentComplete = mutation({
  args: {
    id: v.id("aceRegistrations"),
    stripeSessionId: v.optional(v.string()),
    stripePaymentIntentId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Registration not found");

    const timestamp = now();
    const shouldIncrement = existing.status === "pending";
    await ctx.db.patch(args.id, {
      status: "confirmed",
      feePaid: true,
      paymentDate: timestamp,
      stripeSessionId: args.stripeSessionId ?? existing.stripeSessionId,
      stripePaymentIntentId: args.stripePaymentIntentId ?? existing.stripePaymentIntentId,
      updatedAt: timestamp,
    });

    if (shouldIncrement) await adjustEventCount(ctx, existing.eventId, 1);

    return withDetails(ctx, await ctx.db.get(args.id));
  },
});

export const cancel = mutation({
  args: {
    id: v.id("aceRegistrations"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Registration not found");

    const timestamp = now();
    const wasActive = existing.status !== "cancelled";
    await ctx.db.patch(args.id, {
      status: "cancelled",
      cancellationDate: timestamp,
      cancellationReason: args.reason?.trim() || "Admin cancelled",
      updatedAt: timestamp,
    });

    if (wasActive) await adjustEventCount(ctx, existing.eventId, -1);

    return withDetails(ctx, await ctx.db.get(args.id));
  },
});
