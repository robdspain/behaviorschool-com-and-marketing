import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

function nowIso() {
  return new Date().toISOString();
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function getByLegacyId(ctx: any, legacyId: string) {
  return ctx.db
    .query("downloadSubmissions")
    .withIndex("by_legacy_id", (q: any) => q.eq("legacyId", legacyId))
    .first();
}

export const createDownloadSubmission = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    resource: v.string(),
    source: v.string(),
    userAgent: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    createdAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const timestamp = nowIso();
    const createdAt = args.createdAt ?? timestamp;
    return ctx.db.insert("downloadSubmissions", {
      email: args.email.trim(),
      emailLower: normalizeEmail(args.email),
      name: args.name || undefined,
      resource: args.resource,
      source: args.source,
      userAgent: args.userAgent || undefined,
      ipAddress: args.ipAddress || undefined,
      createdAt,
      updatedAt: timestamp,
    });
  },
});

export const importDownloadSubmission = mutation({
  args: {
    legacyId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    resource: v.string(),
    source: v.string(),
    userAgent: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await getByLegacyId(ctx, args.legacyId);
    const payload = {
      legacyId: args.legacyId,
      email: args.email.trim(),
      emailLower: normalizeEmail(args.email),
      name: args.name || undefined,
      resource: args.resource,
      source: args.source,
      userAgent: args.userAgent || undefined,
      ipAddress: args.ipAddress || undefined,
      createdAt: args.createdAt,
      updatedAt: args.updatedAt || nowIso(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, payload);
      return existing._id;
    }

    return ctx.db.insert("downloadSubmissions", payload);
  },
});

export const downloadStats = query({
  args: {},
  handler: async (ctx) => {
    const downloads = await ctx.db.query("downloadSubmissions").collect();
    return { totalDownloads: downloads.length };
  },
});

export const recentDownloads = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 5;
    const downloads = await ctx.db.query("downloadSubmissions").collect();
    return downloads
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
  },
});

export const topResources = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    const downloads = await ctx.db.query("downloadSubmissions").collect();
    const stats = new Map<string, { downloads: number; key: string }>();

    for (const download of downloads) {
      const key = download.resource || download.source;
      if (!key) continue;
      const existing = stats.get(key) || { downloads: 0, key };
      existing.downloads += 1;
      stats.set(key, existing);
    }

    return Array.from(stats.values())
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, limit);
  },
});
