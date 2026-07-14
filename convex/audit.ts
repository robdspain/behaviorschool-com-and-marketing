import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { writeAuditLog } from "./audit_logger";

const category = v.union(
  v.literal("auth"),
  v.literal("student_data"),
  v.literal("admin_action")
);

const status = v.union(v.literal("success"), v.literal("failure"));

export const logEvent = mutation({
  args: {
    timestamp: v.optional(v.number()),
    category,
    actionType: v.string(),
    resource: v.string(),
    status,
    actorUserId: v.optional(v.string()),
    actorEmail: v.optional(v.string()),
    resourceId: v.optional(v.string()),
    method: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    await writeAuditLog(ctx, args);
  },
});

export const recent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    return ctx.db
      .query("auditLogs")
      .withIndex("by_timestamp")
      .order("desc")
      .take(Math.min(limit ?? 50, 200));
  },
});
