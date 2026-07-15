import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const role = v.union(
  v.literal("participant"),
  v.literal("instructor"),
  v.literal("co_presenter"),
  v.literal("ace_coordinator"),
  v.literal("admin")
);

const credentialType = v.union(
  v.literal("bcba"),
  v.literal("bcaba"),
  v.literal("rbt"),
  v.literal("other"),
  v.literal("pending")
);

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function now() {
  return Date.now();
}

export const getById = query({
  args: { id: v.id("aceUsers") },
  handler: async (ctx, args) => ctx.db.get(args.id),
});

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const email = normalizeEmail(args.email);
    return ctx.db
      .query("aceUsers")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
  },
});

export const listByRole = query({
  args: {
    role,
    activeOnly: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("aceUsers")
      .withIndex("by_role", (q) => q.eq("role", args.role))
      .collect();

    return rows
      .filter((row) => (args.activeOnly ? row.isActive : true))
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, Math.min(args.limit ?? 500, 1000));
  },
});

export const create = mutation({
  args: {
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    bacbId: v.optional(v.string()),
    role: v.optional(role),
    credentialType: v.optional(credentialType),
    credentialNumber: v.optional(v.string()),
    credentialVerified: v.optional(v.boolean()),
    credentialVerifiedAt: v.optional(v.number()),
    credentialExpiresAt: v.optional(v.number()),
    phone: v.optional(v.string()),
    organization: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const email = normalizeEmail(args.email);
    const existing = await ctx.db
      .query("aceUsers")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (existing) {
      throw new Error("A user with this email already exists");
    }

    const timestamp = now();
    return ctx.db.insert("aceUsers", {
      email,
      firstName: args.firstName.trim(),
      lastName: args.lastName.trim(),
      bacbId: args.bacbId?.trim() || undefined,
      role: args.role ?? "participant",
      credentialType: args.credentialType ?? "pending",
      credentialNumber: args.credentialNumber?.trim() || undefined,
      credentialVerified: args.credentialVerified ?? false,
      credentialVerifiedAt: args.credentialVerifiedAt,
      credentialExpiresAt: args.credentialExpiresAt,
      phone: args.phone?.trim() || undefined,
      organization: args.organization?.trim() || undefined,
      isActive: args.isActive ?? true,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  },
});

export const getOrCreate = mutation({
  args: {
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    bacbId: v.optional(v.string()),
    role: v.optional(role),
    credentialType: v.optional(credentialType),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const email = normalizeEmail(args.email);
    const existing = await ctx.db
      .query("aceUsers")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (existing) return existing._id;

    const timestamp = now();
    return ctx.db.insert("aceUsers", {
      email,
      firstName: args.firstName.trim(),
      lastName: args.lastName.trim(),
      bacbId: args.bacbId?.trim() || undefined,
      role: args.role ?? "participant",
      credentialType: args.credentialType ?? "pending",
      credentialVerified: false,
      isActive: args.isActive ?? true,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  },
});

export const updateParticipantCredential = mutation({
  args: {
    id: v.id("aceUsers"),
    credentialType: v.optional(credentialType),
    credentialNumber: v.optional(v.string()),
    credentialVerified: v.optional(v.boolean()),
    credentialVerifiedAt: v.optional(v.number()),
    clearCredentialVerifiedAt: v.optional(v.boolean()),
    credentialExpiresAt: v.optional(v.number()),
    clearCredentialExpiresAt: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Participant not found");
    if (existing.role !== "participant") throw new Error("User is not a participant");

    await ctx.db.patch(args.id, {
      credentialType: args.credentialType,
      credentialNumber: args.credentialNumber?.trim() || undefined,
      credentialVerified: args.credentialVerified,
      credentialVerifiedAt: args.clearCredentialVerifiedAt ? undefined : args.credentialVerifiedAt,
      credentialExpiresAt: args.clearCredentialExpiresAt ? undefined : args.credentialExpiresAt,
      updatedAt: now(),
    });

    return ctx.db.get(args.id);
  },
});
