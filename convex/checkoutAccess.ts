import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const CHECKOUT_PASSWORD_KEY = "checkout_password";

function nowIso() {
  return new Date().toISOString();
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function fullName(firstName?: string, lastName?: string) {
  return [firstName, lastName].filter(Boolean).join(" ").trim();
}

async function getPasswordSetting(ctx: any) {
  return ctx.db
    .query("checkoutSettings")
    .withIndex("by_setting_key", (q: any) => q.eq("settingKey", CHECKOUT_PASSWORD_KEY))
    .first();
}

async function getApprovedUserByEmail(ctx: any, email: string) {
  return ctx.db
    .query("checkoutAccess")
    .withIndex("by_email_lower", (q: any) => q.eq("emailLower", normalizeEmail(email)))
    .first();
}

export const getPassword = query({
  args: {},
  handler: async (ctx) => {
    const setting = await getPasswordSetting(ctx);
    return setting?.settingValue ?? null;
  },
});

export const getPasswordStatus = query({
  args: {},
  handler: async (ctx) => {
    const setting = await getPasswordSetting(ctx);
    return {
      configured: Boolean(setting?.settingValue),
      updatedAt: setting?.updatedAt ?? null,
    };
  },
});

export const setPassword = mutation({
  args: { password: v.string() },
  handler: async (ctx, { password }) => {
    const timestamp = nowIso();
    const existing = await getPasswordSetting(ctx);
    if (existing) {
      await ctx.db.patch(existing._id, {
        settingValue: password,
        updatedAt: timestamp,
      });
      return existing._id;
    }

    return ctx.db.insert("checkoutSettings", {
      settingKey: CHECKOUT_PASSWORD_KEY,
      settingValue: password,
      description: "Master password for checkout access",
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  },
});

export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("checkoutAccess").collect();
    return users.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
});

export const addUser = mutation({
  args: {
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    notes: v.optional(v.string()),
    expiresAt: v.optional(v.string()),
    approvedBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const emailLower = normalizeEmail(args.email);
    const timestamp = nowIso();
    const existing = await getApprovedUserByEmail(ctx, emailLower);

    if (existing) {
      await ctx.db.patch(existing._id, {
        email: args.email.trim(),
        emailLower,
        firstName: args.firstName || undefined,
        lastName: args.lastName || undefined,
        notes: args.notes || undefined,
        expiresAt: args.expiresAt || undefined,
        approvedBy: args.approvedBy || existing.approvedBy,
        isActive: true,
        updatedAt: timestamp,
      });
      return existing._id;
    }

    return ctx.db.insert("checkoutAccess", {
      email: args.email.trim(),
      emailLower,
      firstName: args.firstName || undefined,
      lastName: args.lastName || undefined,
      approvedBy: args.approvedBy || "Admin",
      notes: args.notes || undefined,
      isActive: true,
      expiresAt: args.expiresAt || undefined,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  },
});

export const updateUserStatus = mutation({
  args: {
    id: v.id("checkoutAccess"),
    isActive: v.boolean(),
  },
  handler: async (ctx, { id, isActive }) => {
    await ctx.db.patch(id, {
      isActive,
      updatedAt: nowIso(),
    });
  },
});

export const deleteUser = mutation({
  args: { id: v.id("checkoutAccess") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

export const listLogs = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    return ctx.db
      .query("checkoutAccessLogs")
      .withIndex("by_created_at")
      .order("desc")
      .take(Math.min(limit ?? 50, 200));
  },
});

export const verifyAccess = mutation({
  args: {
    email: v.optional(v.string()),
    password: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let accessGranted = false;
    let accessType = "unknown";
    let identifier = "none";
    let errorMessage = "";

    if (args.email) {
      accessType = "email";
      identifier = normalizeEmail(args.email);
      const approvedUser = await getApprovedUserByEmail(ctx, args.email);

      if (approvedUser?.isActive) {
        if (!approvedUser.expiresAt || new Date(approvedUser.expiresAt) > new Date()) {
          accessGranted = true;
        } else {
          errorMessage = "Access expired";
        }
      }
    }

    if (!accessGranted && args.password) {
      accessType = "password";
      identifier = "password_attempt";
      const setting = await getPasswordSetting(ctx);
      const configuredPassword = setting?.settingValue;

      if (!configuredPassword) {
        errorMessage = "Checkout password is not configured";
      } else if (args.password === configuredPassword) {
        accessGranted = true;
      } else {
        errorMessage = "Incorrect password";
      }
    }

    await ctx.db.insert("checkoutAccessLogs", {
      accessType,
      identifier,
      success: accessGranted,
      ipAddress: args.ipAddress,
      userAgent: args.userAgent,
      errorMessage: errorMessage || undefined,
      createdAt: nowIso(),
    });

    return {
      accessGranted,
      message: accessGranted ? "Access granted" : errorMessage || "Access denied",
    };
  },
});

export const displayName = query({
  args: { id: v.id("checkoutAccess") },
  handler: async (ctx, { id }) => {
    const user = await ctx.db.get(id);
    return user ? fullName(user.firstName, user.lastName) || user.email : null;
  },
});
