import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

function nowIso() {
  return new Date().toISOString();
}

function toResourceRow(resource: any) {
  return {
    id: resource._id,
    section_id: resource.sectionId ?? null,
    name: resource.name,
    url: resource.url,
    file_type: resource.fileType,
    order_index: resource.orderIndex,
    created_at: resource.createdAt,
    updated_at: resource.updatedAt,
  };
}

async function getResourceByLegacyId(ctx: any, legacyId: string) {
  return ctx.db
    .query("masterclassResources")
    .withIndex("by_legacy_id", (q: any) => q.eq("legacyId", legacyId))
    .first();
}

async function getEnrollmentByLegacyId(ctx: any, legacyId: string) {
  return ctx.db
    .query("masterclassEnrollments")
    .withIndex("by_legacy_id", (q: any) => q.eq("legacyId", legacyId))
    .first();
}

async function getSectionByLegacyId(ctx: any, legacyId: string) {
  return ctx.db
    .query("masterclassCourseSections")
    .withIndex("by_legacy_id", (q: any) => q.eq("legacyId", legacyId))
    .first();
}

async function getQuestionByLegacyId(ctx: any, legacyId: string) {
  return ctx.db
    .query("masterclassQuizQuestions")
    .withIndex("by_legacy_id", (q: any) => q.eq("legacyId", legacyId))
    .first();
}

export const listResources = query({
  args: {},
  handler: async (ctx) => {
    const resources = await ctx.db.query("masterclassResources").collect();
    return resources
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map(toResourceRow);
  },
});

export const createResource = mutation({
  args: {
    sectionId: v.optional(v.string()),
    name: v.string(),
    url: v.string(),
    fileType: v.optional(v.string()),
    orderIndex: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const timestamp = nowIso();
    const resources = await ctx.db.query("masterclassResources").collect();
    const maxOrder = resources.reduce((max, resource) => Math.max(max, resource.orderIndex), 0);
    const id = await ctx.db.insert("masterclassResources", {
      sectionId: args.sectionId || undefined,
      name: args.name,
      url: args.url,
      fileType: args.fileType || "link",
      orderIndex: args.orderIndex ?? maxOrder + 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    const resource = await ctx.db.get(id);
    return resource ? toResourceRow(resource) : null;
  },
});

export const updateResource = mutation({
  args: {
    id: v.id("masterclassResources"),
    sectionId: v.optional(v.string()),
    name: v.optional(v.string()),
    url: v.optional(v.string()),
    fileType: v.optional(v.string()),
    orderIndex: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Resource not found");

    await ctx.db.patch(args.id, {
      sectionId: args.sectionId ?? existing.sectionId,
      name: args.name ?? existing.name,
      url: args.url ?? existing.url,
      fileType: args.fileType ?? existing.fileType,
      orderIndex: args.orderIndex ?? existing.orderIndex,
      updatedAt: nowIso(),
    });
    const resource = await ctx.db.get(args.id);
    return resource ? toResourceRow(resource) : null;
  },
});

export const reorderResources = mutation({
  args: {
    idsInOrder: v.array(v.id("masterclassResources")),
  },
  handler: async (ctx, args) => {
    for (let index = 0; index < args.idsInOrder.length; index += 1) {
      await ctx.db.patch(args.idsInOrder[index], {
        orderIndex: index + 1,
        updatedAt: nowIso(),
      });
    }
    return { success: true };
  },
});

export const deleteResource = mutation({
  args: {
    id: v.id("masterclassResources"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

export const stats = query({
  args: {
    weekStartIso: v.string(),
  },
  handler: async (ctx, args) => {
    const [enrollments, sections, questions] = await Promise.all([
      ctx.db.query("masterclassEnrollments").collect(),
      ctx.db.query("masterclassCourseSections").collect(),
      ctx.db.query("masterclassQuizQuestions").collect(),
    ]);

    const totalEnrollments = enrollments.length;
    const completedEnrollments = enrollments.filter((enrollment) => enrollment.completedAt).length;
    const certificatesIssued = enrollments.filter((enrollment) => enrollment.certificateIssued).length;
    const recentEnrollments = enrollments.filter((enrollment) => enrollment.createdAt >= args.weekStartIso).length;
    const completionRate = totalEnrollments > 0
      ? Math.round((completedEnrollments / totalEnrollments) * 100)
      : 0;

    return {
      totalEnrollments,
      completedEnrollments,
      certificatesIssued,
      recentEnrollments,
      completionRate,
      totalSections: sections.filter((section) => section.isActive).length,
      totalQuestions: questions.filter((question) => question.isActive).length,
    };
  },
});

export const importResource = mutation({
  args: {
    legacyId: v.string(),
    sectionId: v.optional(v.string()),
    name: v.string(),
    url: v.string(),
    fileType: v.optional(v.string()),
    orderIndex: v.optional(v.number()),
    createdAt: v.optional(v.string()),
    updatedAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await getResourceByLegacyId(ctx, args.legacyId);
    const timestamp = nowIso();
    const payload = {
      legacyId: args.legacyId,
      sectionId: args.sectionId || undefined,
      name: args.name,
      url: args.url,
      fileType: args.fileType || "link",
      orderIndex: args.orderIndex ?? 0,
      createdAt: args.createdAt || timestamp,
      updatedAt: args.updatedAt || timestamp,
    };

    if (existing) {
      await ctx.db.patch(existing._id, payload);
      return existing._id;
    }
    return ctx.db.insert("masterclassResources", payload);
  },
});

export const importEnrollment = mutation({
  args: {
    legacyId: v.string(),
    createdAt: v.string(),
    completedAt: v.optional(v.string()),
    certificateIssued: v.optional(v.boolean()),
    updatedAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await getEnrollmentByLegacyId(ctx, args.legacyId);
    const payload = {
      legacyId: args.legacyId,
      createdAt: args.createdAt,
      completedAt: args.completedAt || undefined,
      certificateIssued: args.certificateIssued ?? false,
      updatedAt: args.updatedAt || nowIso(),
    };
    if (existing) {
      await ctx.db.patch(existing._id, payload);
      return existing._id;
    }
    return ctx.db.insert("masterclassEnrollments", payload);
  },
});

export const importSection = mutation({
  args: {
    legacyId: v.string(),
    sectionNumber: v.number(),
    title: v.string(),
    description: v.string(),
    videoUrl: v.string(),
    duration: v.string(),
    orderIndex: v.number(),
    isActive: v.optional(v.boolean()),
    createdAt: v.optional(v.string()),
    updatedAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await getSectionByLegacyId(ctx, args.legacyId);
    const timestamp = nowIso();
    const payload = {
      legacyId: args.legacyId,
      sectionNumber: args.sectionNumber,
      title: args.title,
      description: args.description,
      videoUrl: args.videoUrl,
      duration: args.duration,
      orderIndex: args.orderIndex,
      isActive: args.isActive ?? true,
      createdAt: args.createdAt || timestamp,
      updatedAt: args.updatedAt || timestamp,
    };
    if (existing) {
      await ctx.db.patch(existing._id, payload);
      return existing._id;
    }
    return ctx.db.insert("masterclassCourseSections", payload);
  },
});

export const importQuestion = mutation({
  args: {
    legacyId: v.string(),
    sectionNumber: v.number(),
    questionNumber: v.number(),
    questionText: v.string(),
    optionA: v.string(),
    optionB: v.string(),
    optionC: v.string(),
    optionD: v.string(),
    correctAnswer: v.number(),
    explanation: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    createdAt: v.optional(v.string()),
    updatedAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await getQuestionByLegacyId(ctx, args.legacyId);
    const timestamp = nowIso();
    const payload = {
      legacyId: args.legacyId,
      sectionNumber: args.sectionNumber,
      questionNumber: args.questionNumber,
      questionText: args.questionText,
      optionA: args.optionA,
      optionB: args.optionB,
      optionC: args.optionC,
      optionD: args.optionD,
      correctAnswer: args.correctAnswer,
      explanation: args.explanation || undefined,
      isActive: args.isActive ?? true,
      createdAt: args.createdAt || timestamp,
      updatedAt: args.updatedAt || timestamp,
    };
    if (existing) {
      await ctx.db.patch(existing._id, payload);
      return existing._id;
    }
    return ctx.db.insert("masterclassQuizQuestions", payload);
  },
});
