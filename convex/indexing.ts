import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

function nowIso() {
  return new Date().toISOString();
}

function toRow(setting: any) {
  return {
    id: setting._id,
    path: setting.path,
    index: setting.index,
    in_sitemap: setting.inSitemap,
    deleted: setting.deleted,
    created_at: setting.createdAt,
    updated_at: setting.updatedAt,
  };
}

async function getByPath(ctx: any, path: string) {
  return ctx.db
    .query("pageIndexSettings")
    .withIndex("by_path", (q: any) => q.eq("path", path))
    .first();
}

export const listSettings = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db.query("pageIndexSettings").collect();
    return settings
      .sort((a, b) => a.path.localeCompare(b.path))
      .map(toRow);
  },
});

export const upsertSetting = mutation({
  args: {
    path: v.string(),
    index: v.optional(v.boolean()),
    inSitemap: v.optional(v.boolean()),
    deleted: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await getByPath(ctx, args.path);
    const timestamp = nowIso();

    if (existing) {
      await ctx.db.patch(existing._id, {
        index: args.index ?? existing.index,
        inSitemap: args.inSitemap ?? existing.inSitemap,
        deleted: args.deleted ?? existing.deleted,
        updatedAt: timestamp,
      });
      const updated = await ctx.db.get(existing._id);
      return updated ? toRow(updated) : null;
    }

    const id = await ctx.db.insert("pageIndexSettings", {
      path: args.path,
      index: args.index ?? true,
      inSitemap: args.inSitemap ?? false,
      deleted: args.deleted ?? false,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    const inserted = await ctx.db.get(id);
    return inserted ? toRow(inserted) : null;
  },
});
