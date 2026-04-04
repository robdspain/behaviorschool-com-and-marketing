import { internalMutation, internalQuery } from "convex/server";
import { v } from "convex/values";

// FERPA A4: Keep last N password hashes per user for reuse enforcement
const MAX_HISTORY = 12;

/**
 * Store a new password hash for a user and prune older entries beyond MAX_HISTORY.
 * Called from auth.ts databaseHooks after account create/update.
 */
export const store = internalMutation({
  args: {
    userId: v.string(),
    passwordHash: v.string(),
  },
  handler: async (ctx, { userId, passwordHash }) => {
    await ctx.db.insert("passwordHistory", {
      userId,
      passwordHash,
      createdAt: Date.now(),
    });

    // Prune entries older than the last MAX_HISTORY
    const history = await ctx.db
      .query("passwordHistory")
      .withIndex("by_user_created", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    const toDelete = history.slice(MAX_HISTORY);
    for (const entry of toDelete) {
      await ctx.db.delete(entry._id);
    }
  },
});

/**
 * Retrieve the last MAX_HISTORY password hashes for a user.
 * Used for reuse checking at the application layer.
 */
export const getHistory = internalQuery({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return ctx.db
      .query("passwordHistory")
      .withIndex("by_user_created", (q) => q.eq("userId", userId))
      .order("desc")
      .take(MAX_HISTORY);
  },
});
