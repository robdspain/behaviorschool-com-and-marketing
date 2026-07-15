import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

function nowIso() {
  return new Date().toISOString();
}

function toDocRow(doc: any) {
  return {
    id: doc._id,
    title: doc.title,
    template: doc.template,
    data: doc.data,
    created_at: doc.createdAt,
    updated_at: doc.updatedAt,
  };
}

export const listDocs = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const docs = await ctx.db.query("presentationDocs").collect();
    return docs
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, args.limit ?? 200)
      .map((doc) => {
        const row = toDocRow(doc);
        return {
          id: row.id,
          title: row.title,
          template: row.template,
          created_at: row.created_at,
          updated_at: row.updated_at,
        };
      });
  },
});

export const getDoc = query({
  args: {
    id: v.id("presentationDocs"),
  },
  handler: async (ctx, args) => {
    const doc = await ctx.db.get(args.id);
    return doc ? toDocRow(doc) : null;
  },
});

export const upsertDoc = mutation({
  args: {
    id: v.optional(v.id("presentationDocs")),
    title: v.string(),
    template: v.optional(v.string()),
    data: v.any(),
  },
  handler: async (ctx, args) => {
    const timestamp = nowIso();
    if (args.id) {
      const existing = await ctx.db.get(args.id);
      if (!existing) throw new Error("Presentation document not found");
      await ctx.db.patch(args.id, {
        title: args.title,
        template: args.template || "modern",
        data: args.data,
        updatedAt: timestamp,
      });
      return args.id;
    }

    return ctx.db.insert("presentationDocs", {
      title: args.title,
      template: args.template || "modern",
      data: args.data,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  },
});

export const updateDoc = mutation({
  args: {
    id: v.id("presentationDocs"),
    title: v.optional(v.string()),
    template: v.optional(v.string()),
    data: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Presentation document not found");
    await ctx.db.patch(args.id, {
      title: args.title ?? existing.title,
      template: args.template ?? existing.template,
      data: args.data ?? existing.data,
      updatedAt: nowIso(),
    });
    return { ok: true };
  },
});

export const deleteDoc = mutation({
  args: {
    id: v.id("presentationDocs"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { ok: true };
  },
});

export const cloneDoc = mutation({
  args: {
    id: v.id("presentationDocs"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Presentation document not found");
    const timestamp = nowIso();
    return ctx.db.insert("presentationDocs", {
      title: `${existing.title} (Copy)`,
      template: existing.template,
      data: existing.data,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  },
});
