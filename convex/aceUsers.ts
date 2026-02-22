import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ============================================================================
// ACE USERS - Queries & Mutations
// ============================================================================

// Get user by email
export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("aceUsers")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();
  },
});

// Get user by ID
export const getById = query({
  args: { id: v.id("aceUsers") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get user by BACB ID
export const getByBacbId = query({
  args: { bacbId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("aceUsers")
      .withIndex("by_bacb_id", (q) => q.eq("bacbId", args.bacbId))
      .first();
  },
});

// Get or create user
export const getOrCreate = mutation({
  args: {
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    bacbId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user exists
    const existing = await ctx.db
      .query("aceUsers")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();

    if (existing) {
      // Update BACB ID if provided and not set
      if (args.bacbId && !existing.bacbId) {
        await ctx.db.patch(existing._id, { 
          bacbId: args.bacbId,
          updatedAt: Date.now(),
        });
      }
      return existing._id;
    }

    // Create new user
    const now = Date.now();
    return await ctx.db.insert("aceUsers", {
      email: args.email.toLowerCase(),
      firstName: args.firstName,
      lastName: args.lastName,
      bacbId: args.bacbId,
      role: "participant",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Create user with specific role
export const create = mutation({
  args: {
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    role: v.union(
      v.literal("participant"),
      v.literal("instructor"),
      v.literal("co_presenter"),
      v.literal("ace_coordinator"),
      v.literal("admin")
    ),
    bacbId: v.optional(v.string()),
    credentialType: v.optional(v.union(
      v.literal("bcba"),
      v.literal("bcaba"),
      v.literal("rbt"),
      v.literal("other"),
      v.literal("pending")
    )),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("aceUsers", {
      email: args.email.toLowerCase(),
      firstName: args.firstName,
      lastName: args.lastName,
      role: args.role,
      bacbId: args.bacbId,
      credentialType: args.credentialType,
      isActive: args.isActive,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update user
export const update = mutation({
  args: {
    id: v.id("aceUsers"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    bacbId: v.optional(v.string()),
    phone: v.optional(v.string()),
    organization: v.optional(v.string()),
    credentialType: v.optional(v.union(
      v.literal("bcba"),
      v.literal("bcaba"),
      v.literal("rbt"),
      v.literal("other"),
      v.literal("pending")
    )),
    credentialNumber: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Update last login
export const updateLastLogin = mutation({
  args: { id: v.id("aceUsers") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      lastLoginAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// List users by role
export const listByRole = query({
  args: {
    role: v.union(
      v.literal("participant"),
      v.literal("instructor"),
      v.literal("co_presenter"),
      v.literal("ace_coordinator"),
      v.literal("admin")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("aceUsers")
      .withIndex("by_role", (q) => q.eq("role", args.role))
      .collect();
  },
});
