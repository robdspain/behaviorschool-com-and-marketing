import { mutation } from "convex/server";
import { v } from "convex/values";

export const addSubmission = mutation({
  args: {
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    role: v.string(),
    organization: v.optional(v.string()),
    source: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("waitlist_submissions")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        firstName: args.firstName ?? existing.firstName,
        lastName: args.lastName ?? existing.lastName,
        role: args.role,
        organization: args.organization ?? existing.organization,
        source: args.source ?? existing.source,
        notes: args.notes ?? existing.notes,
        createdAt: existing.createdAt ?? Date.now(),
      });
      return existing._id;
    }

    return await ctx.db.insert("waitlist_submissions", {
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
      role: args.role,
      organization: args.organization ?? "Behavior School",
      source: args.source ?? "behaviorschool_rbt_waitlist_business",
      notes: args.notes,
      createdAt: Date.now(),
    });
  },
});
