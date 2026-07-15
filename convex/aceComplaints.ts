import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const complaintStatus = v.union(
  v.literal("submitted"),
  v.literal("under_review"),
  v.literal("resolved"),
  v.literal("escalated_to_bacb")
);

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

export const list = query({
  args: {
    providerId: v.optional(v.id("aceProviders")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const rows = args.providerId
      ? await ctx.db
          .query("aceComplaints")
          .withIndex("by_provider", (q) => q.eq("providerId", args.providerId!))
          .collect()
      : await ctx.db.query("aceComplaints").collect();

    return rows
      .sort((a, b) => b.submittedAt - a.submittedAt)
      .slice(0, Math.min(args.limit ?? 500, 1000));
  },
});

export const create = mutation({
  args: {
    providerId: v.id("aceProviders"),
    eventId: v.optional(v.id("aceEvents")),
    submitterName: v.string(),
    submitterEmail: v.string(),
    submitterBacbId: v.optional(v.string()),
    submitterPhone: v.optional(v.string()),
    complaintText: v.string(),
  },
  handler: async (ctx, args) => {
    const provider = await ctx.db.get(args.providerId);
    if (!provider) throw new Error("Provider not found");
    if (args.eventId) {
      const event = await ctx.db.get(args.eventId);
      if (!event) throw new Error("Event not found");
    }

    const timestamp = now();
    const id = await ctx.db.insert("aceComplaints", {
      providerId: args.providerId,
      eventId: args.eventId,
      submitterName: args.submitterName.trim(),
      submitterEmail: args.submitterEmail.trim().toLowerCase(),
      submitterBacbId: args.submitterBacbId?.trim() || undefined,
      submitterPhone: args.submitterPhone?.trim() || undefined,
      complaintText: args.complaintText.trim(),
      status: "submitted",
      responseDueDate: daysFromNow(45),
      navEscalationNotified: false,
      submittedAt: timestamp,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    return ctx.db.get(id);
  },
});

export const update = mutation({
  args: {
    id: v.id("aceComplaints"),
    status: v.optional(complaintStatus),
    resolutionNotes: v.optional(v.string()),
    resolvedAt: v.optional(v.number()),
    clearResolvedAt: v.optional(v.boolean()),
    navEscalationNotified: v.optional(v.boolean()),
    navEscalationNotifiedAt: v.optional(v.number()),
    navNotificationMethod: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Complaint not found");

    const patch = compact({
      status: args.status,
      resolutionNotes: args.resolutionNotes?.trim(),
      resolvedAt: args.resolvedAt,
      navEscalationNotified: args.navEscalationNotified,
      navEscalationNotifiedAt: args.navEscalationNotifiedAt,
      navNotificationMethod: args.navNotificationMethod,
      updatedAt: now(),
    });

    if (args.clearResolvedAt) patch.resolvedAt = undefined;

    await ctx.db.patch(args.id, patch);

    return ctx.db.get(args.id);
  },
});
