import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

function nowIso() {
  return new Date().toISOString();
}

function toRow(activity: any) {
  return {
    id: activity._id,
    activity_type: activity.activityType,
    activity_id: activity.activityId,
    title: activity.title,
    description: activity.description,
    original_timestamp: activity.originalTimestamp,
    archived_at: activity.archivedAt,
    created_at: activity.createdAt,
    updated_at: activity.updatedAt,
  };
}

export const listArchivedActivities = query({
  args: {},
  handler: async (ctx) => {
    const activities = await ctx.db.query("archivedActivities").collect();
    return activities
      .sort((a, b) => b.archivedAt.localeCompare(a.archivedAt))
      .map(toRow);
  },
});

export const archiveActivity = mutation({
  args: {
    activityType: v.string(),
    activityId: v.string(),
    title: v.string(),
    description: v.string(),
    timestamp: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("archivedActivities")
      .withIndex("by_activity", (q) =>
        q.eq("activityType", args.activityType).eq("activityId", args.activityId)
      )
      .first();
    const timestamp = nowIso();
    const payload = {
      activityType: args.activityType,
      activityId: args.activityId,
      title: args.title,
      description: args.description,
      originalTimestamp: args.timestamp,
      archivedAt: timestamp,
      updatedAt: timestamp,
    };

    if (existing) {
      await ctx.db.patch(existing._id, payload);
      const updated = await ctx.db.get(existing._id);
      return updated ? toRow(updated) : null;
    }

    const id = await ctx.db.insert("archivedActivities", {
      ...payload,
      createdAt: timestamp,
    });
    const inserted = await ctx.db.get(id);
    return inserted ? toRow(inserted) : null;
  },
});

export const unarchiveActivity = mutation({
  args: {
    id: v.id("archivedActivities"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});
