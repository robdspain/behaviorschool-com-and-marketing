import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ============================================================================
// ACE COMPLAINTS - Queries & Mutations
// ============================================================================

const FORTY_FIVE_DAYS_MS = 45 * 24 * 60 * 60 * 1000;

// Get complaints by provider
export const getByProvider = query({
  args: { providerId: v.id("aceProviders") },
  handler: async (ctx, args) => {
    const complaints = await ctx.db
      .query("aceComplaints")
      .withIndex("by_provider", (q) => q.eq("providerId", args.providerId))
      .collect();

    // Enrich with event info
    const enriched = await Promise.all(
      complaints.map(async (complaint) => {
        const event = complaint.eventId
          ? await ctx.db.get(complaint.eventId)
          : null;
        const responseDueDate = complaint.submittedAt + FORTY_FIVE_DAYS_MS;
        const now = Date.now();
        const daysUntilResponseDue = Math.ceil(
          (responseDueDate - now) / (24 * 60 * 60 * 1000)
        );
        const isOverdue =
          daysUntilResponseDue < 0 &&
          complaint.status !== "resolved" &&
          complaint.status !== "escalated_to_bacb";

        return {
          ...complaint,
          event,
          responseDueDate,
          daysUntilResponseDue,
          isOverdue,
        };
      })
    );

    return enriched;
  },
});

// Get complaint by ID
export const getById = query({
  args: { id: v.id("aceComplaints") },
  handler: async (ctx, args) => {
    const complaint = await ctx.db.get(args.id);
    if (!complaint) return null;

    const event = complaint.eventId
      ? await ctx.db.get(complaint.eventId)
      : null;
    const responseDueDate = complaint.submittedAt + FORTY_FIVE_DAYS_MS;
    const now = Date.now();
    const daysUntilResponseDue = Math.ceil(
      (responseDueDate - now) / (24 * 60 * 60 * 1000)
    );
    const isOverdue =
      daysUntilResponseDue < 0 &&
      complaint.status !== "resolved" &&
      complaint.status !== "escalated_to_bacb";

    return {
      ...complaint,
      event,
      responseDueDate,
      daysUntilResponseDue,
      isOverdue,
    };
  },
});

// Get complaints by status
export const getByStatus = query({
  args: {
    status: v.union(
      v.literal("submitted"),
      v.literal("under_review"),
      v.literal("resolved"),
      v.literal("escalated_to_bacb")
    ),
  },
  handler: async (ctx, args) => {
    const complaints = await ctx.db
      .query("aceComplaints")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();

    const enriched = await Promise.all(
      complaints.map(async (complaint) => {
        const event = complaint.eventId
          ? await ctx.db.get(complaint.eventId)
          : null;
        const responseDueDate = complaint.submittedAt + FORTY_FIVE_DAYS_MS;
        const now = Date.now();
        const daysUntilResponseDue = Math.ceil(
          (responseDueDate - now) / (24 * 60 * 60 * 1000)
        );
        const isOverdue =
          daysUntilResponseDue < 0 &&
          complaint.status !== "resolved" &&
          complaint.status !== "escalated_to_bacb";

        return {
          ...complaint,
          event,
          responseDueDate,
          daysUntilResponseDue,
          isOverdue,
        };
      })
    );

    return enriched;
  },
});

// Submit a new complaint
export const submit = mutation({
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
    const now = Date.now();

    const complaintId = await ctx.db.insert("aceComplaints", {
      providerId: args.providerId,
      eventId: args.eventId,
      submitterName: args.submitterName,
      submitterEmail: args.submitterEmail,
      submitterBacbId: args.submitterBacbId,
      submitterPhone: args.submitterPhone,
      complaintText: args.complaintText,
      status: "submitted",
      submittedAt: now,
      createdAt: now,
      updatedAt: now,
    });

    return {
      complaintId,
      responseDueDate: now + FORTY_FIVE_DAYS_MS,
    };
  },
});

// Update complaint status
export const updateStatus = mutation({
  args: {
    id: v.id("aceComplaints"),
    status: v.union(
      v.literal("submitted"),
      v.literal("under_review"),
      v.literal("resolved"),
      v.literal("escalated_to_bacb")
    ),
    resolutionNotes: v.optional(v.string()),
    resolvedBy: v.optional(v.id("aceUsers")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const updateData: Record<string, unknown> = {
      status: args.status,
      updatedAt: now,
    };

    if (args.resolutionNotes) {
      updateData.resolutionNotes = args.resolutionNotes;
    }

    if (args.status === "resolved" || args.status === "escalated_to_bacb") {
      updateData.resolvedAt = now;
      if (args.resolvedBy) {
        updateData.resolvedBy = args.resolvedBy;
      }
    }

    await ctx.db.patch(args.id, updateData);

    return { success: true };
  },
});

// Get overdue complaints for a provider
export const getOverdue = query({
  args: { providerId: v.id("aceProviders") },
  handler: async (ctx, args) => {
    const complaints = await ctx.db
      .query("aceComplaints")
      .withIndex("by_provider", (q) => q.eq("providerId", args.providerId))
      .collect();

    const now = Date.now();

    return complaints.filter((complaint) => {
      if (
        complaint.status === "resolved" ||
        complaint.status === "escalated_to_bacb"
      ) {
        return false;
      }
      const responseDueDate = complaint.submittedAt + FORTY_FIVE_DAYS_MS;
      return now > responseDueDate;
    });
  },
});

// Get all complaints (for admin dashboard)
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const complaints = await ctx.db.query("aceComplaints").collect();

    const enriched = await Promise.all(
      complaints.map(async (complaint) => {
        const event = complaint.eventId
          ? await ctx.db.get(complaint.eventId)
          : null;
        const responseDueDate = complaint.submittedAt + FORTY_FIVE_DAYS_MS;
        const now = Date.now();
        const daysUntilResponseDue = Math.ceil(
          (responseDueDate - now) / (24 * 60 * 60 * 1000)
        );
        const isOverdue =
          daysUntilResponseDue < 0 &&
          complaint.status !== "resolved" &&
          complaint.status !== "escalated_to_bacb";

        return {
          ...complaint,
          event,
          responseDueDate,
          daysUntilResponseDue,
          isOverdue,
        };
      })
    );

    return enriched;
  },
});
