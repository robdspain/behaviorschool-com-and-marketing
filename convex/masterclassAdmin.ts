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

function toSectionRow(section: any, questionCount = 0) {
  return {
    id: section._id,
    section_number: section.sectionNumber,
    title: section.title,
    description: section.description,
    video_url: section.videoUrl,
    duration: section.duration,
    order_index: section.orderIndex,
    is_active: section.isActive,
    created_at: section.createdAt,
    updated_at: section.updatedAt,
    question_count: questionCount,
  };
}

function toQuestionRow(question: any) {
  return {
    id: question._id,
    section_number: question.sectionNumber,
    question_number: question.questionNumber,
    question_text: question.questionText,
    option_a: question.optionA,
    option_b: question.optionB,
    option_c: question.optionC,
    option_d: question.optionD,
    correct_answer: question.correctAnswer,
    explanation: question.explanation ?? null,
    is_active: question.isActive,
    created_at: question.createdAt,
    updated_at: question.updatedAt,
  };
}

function toCertificateConfigRow(config: any) {
  return {
    id: config._id,
    course_title: config.courseTitle,
    ceu_credits: config.ceuCredits,
    bacb_provider_number: config.bacbProviderNumber,
    certificate_subtitle: config.certificateSubtitle ?? null,
    completion_statement: config.completionStatement,
    signature_name: config.signatureName ?? null,
    signature_title: config.signatureTitle ?? null,
    organization_name: config.organizationName,
    organization_website: config.organizationWebsite,
    introduction_video_url: config.introductionVideoUrl ?? null,
    template_version: config.templateVersion,
    is_active: config.isActive,
    created_at: config.createdAt,
    updated_at: config.updatedAt,
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

async function getCertificateConfigByLegacyId(ctx: any, legacyId: string) {
  return ctx.db
    .query("masterclassCertificateConfigs")
    .withIndex("by_legacy_id", (q: any) => q.eq("legacyId", legacyId))
    .first();
}

export const listSections = query({
  args: {},
  handler: async (ctx) => {
    const [sections, questions] = await Promise.all([
      ctx.db.query("masterclassCourseSections").collect(),
      ctx.db.query("masterclassQuizQuestions").collect(),
    ]);

    return sections
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map((section) => toSectionRow(
        section,
        questions.filter((question) =>
          question.isActive && question.sectionNumber === section.sectionNumber
        ).length
      ));
  },
});

export const listActiveSections = query({
  args: {},
  handler: async (ctx) => {
    const sections = await ctx.db
      .query("masterclassCourseSections")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();

    return sections
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map((section) => toSectionRow(section));
  },
});

export const getSection = query({
  args: { id: v.id("masterclassCourseSections") },
  handler: async (ctx, args) => {
    const section = await ctx.db.get(args.id);
    return section ? toSectionRow(section) : null;
  },
});

export const getSectionByNumber = query({
  args: { sectionNumber: v.number() },
  handler: async (ctx, args) => {
    const section = await ctx.db
      .query("masterclassCourseSections")
      .withIndex("by_section_number", (q) => q.eq("sectionNumber", args.sectionNumber))
      .first();

    return section ? toSectionRow(section) : null;
  },
});

export const createSection = mutation({
  args: {
    sectionNumber: v.optional(v.number()),
    title: v.string(),
    description: v.string(),
    videoUrl: v.string(),
    duration: v.string(),
    orderIndex: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const timestamp = nowIso();
    const sections = await ctx.db.query("masterclassCourseSections").collect();
    const maxSectionNumber = sections.reduce((max, section) => Math.max(max, section.sectionNumber), 0);
    const maxOrder = sections.reduce((max, section) => Math.max(max, section.orderIndex), 0);
    const id = await ctx.db.insert("masterclassCourseSections", {
      sectionNumber: args.sectionNumber ?? maxSectionNumber + 1,
      title: args.title,
      description: args.description,
      videoUrl: args.videoUrl,
      duration: args.duration,
      orderIndex: args.orderIndex ?? maxOrder + 1,
      isActive: args.isActive ?? true,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    const section = await ctx.db.get(id);
    return section ? toSectionRow(section) : null;
  },
});

export const updateSection = mutation({
  args: {
    id: v.id("masterclassCourseSections"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    videoUrl: v.optional(v.string()),
    duration: v.optional(v.string()),
    orderIndex: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Section not found");
    await ctx.db.patch(args.id, {
      title: args.title ?? existing.title,
      description: args.description ?? existing.description,
      videoUrl: args.videoUrl ?? existing.videoUrl,
      duration: args.duration ?? existing.duration,
      orderIndex: args.orderIndex ?? existing.orderIndex,
      isActive: args.isActive ?? existing.isActive,
      updatedAt: nowIso(),
    });
    const section = await ctx.db.get(args.id);
    return section ? toSectionRow(section) : null;
  },
});

export const deleteSection = mutation({
  args: { id: v.id("masterclassCourseSections") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isActive: false, updatedAt: nowIso() });
    return { success: true };
  },
});

export const reorderSections = mutation({
  args: { sectionIds: v.array(v.id("masterclassCourseSections")) },
  handler: async (ctx, args) => {
    for (let index = 0; index < args.sectionIds.length; index += 1) {
      await ctx.db.patch(args.sectionIds[index], {
        orderIndex: index + 1,
        updatedAt: nowIso(),
      });
    }
    return { success: true };
  },
});

export const listQuestionsBySection = query({
  args: { sectionNumber: v.number() },
  handler: async (ctx, args) => {
    const questions = await ctx.db.query("masterclassQuizQuestions").collect();
    return questions
      .filter((question) => question.isActive && question.sectionNumber === args.sectionNumber)
      .sort((a, b) => a.questionNumber - b.questionNumber)
      .map(toQuestionRow);
  },
});

export const listAllActiveQuestions = query({
  args: {},
  handler: async (ctx) => {
    const questions = await ctx.db
      .query("masterclassQuizQuestions")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();

    return questions
      .sort((a, b) =>
        a.sectionNumber === b.sectionNumber
          ? a.questionNumber - b.questionNumber
          : a.sectionNumber - b.sectionNumber
      )
      .map(toQuestionRow);
  },
});

export const getQuestion = query({
  args: { id: v.id("masterclassQuizQuestions") },
  handler: async (ctx, args) => {
    const question = await ctx.db.get(args.id);
    return question ? toQuestionRow(question) : null;
  },
});

export const createQuestion = mutation({
  args: {
    sectionNumber: v.number(),
    questionNumber: v.optional(v.number()),
    questionText: v.string(),
    optionA: v.string(),
    optionB: v.string(),
    optionC: v.string(),
    optionD: v.string(),
    correctAnswer: v.number(),
    explanation: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const timestamp = nowIso();
    const questions = await ctx.db.query("masterclassQuizQuestions").collect();
    const maxQuestionNumber = questions
      .filter((question) => question.sectionNumber === args.sectionNumber)
      .reduce((max, question) => Math.max(max, question.questionNumber), 0);
    const id = await ctx.db.insert("masterclassQuizQuestions", {
      sectionNumber: args.sectionNumber,
      questionNumber: args.questionNumber ?? maxQuestionNumber + 1,
      questionText: args.questionText,
      optionA: args.optionA,
      optionB: args.optionB,
      optionC: args.optionC,
      optionD: args.optionD,
      correctAnswer: args.correctAnswer,
      explanation: args.explanation || undefined,
      isActive: args.isActive ?? true,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    const question = await ctx.db.get(id);
    return question ? toQuestionRow(question) : null;
  },
});

export const updateQuestion = mutation({
  args: {
    id: v.id("masterclassQuizQuestions"),
    questionText: v.optional(v.string()),
    optionA: v.optional(v.string()),
    optionB: v.optional(v.string()),
    optionC: v.optional(v.string()),
    optionD: v.optional(v.string()),
    correctAnswer: v.optional(v.number()),
    explanation: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Question not found");
    await ctx.db.patch(args.id, {
      questionText: args.questionText ?? existing.questionText,
      optionA: args.optionA ?? existing.optionA,
      optionB: args.optionB ?? existing.optionB,
      optionC: args.optionC ?? existing.optionC,
      optionD: args.optionD ?? existing.optionD,
      correctAnswer: args.correctAnswer ?? existing.correctAnswer,
      explanation: args.explanation ?? existing.explanation,
      isActive: args.isActive ?? existing.isActive,
      updatedAt: nowIso(),
    });
    const question = await ctx.db.get(args.id);
    return question ? toQuestionRow(question) : null;
  },
});

export const deleteQuestion = mutation({
  args: { id: v.id("masterclassQuizQuestions") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isActive: false, updatedAt: nowIso() });
    return { success: true };
  },
});

export const reorderQuestions = mutation({
  args: { questionIds: v.array(v.id("masterclassQuizQuestions")) },
  handler: async (ctx, args) => {
    for (let index = 0; index < args.questionIds.length; index += 1) {
      await ctx.db.patch(args.questionIds[index], {
        questionNumber: index + 1,
        updatedAt: nowIso(),
      });
    }
    return { success: true };
  },
});

export const getActiveCertificateConfig = query({
  args: {},
  handler: async (ctx) => {
    const configs = await ctx.db
      .query("masterclassCertificateConfigs")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
    const config = configs.sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
    return config ? toCertificateConfigRow(config) : null;
  },
});

export const getCertificateConfig = query({
  args: { id: v.id("masterclassCertificateConfigs") },
  handler: async (ctx, args) => {
    const config = await ctx.db.get(args.id);
    return config ? toCertificateConfigRow(config) : null;
  },
});

export const createCertificateConfig = mutation({
  args: {
    courseTitle: v.string(),
    ceuCredits: v.number(),
    bacbProviderNumber: v.string(),
    certificateSubtitle: v.optional(v.string()),
    completionStatement: v.string(),
    signatureName: v.optional(v.string()),
    signatureTitle: v.optional(v.string()),
    organizationName: v.string(),
    organizationWebsite: v.string(),
    introductionVideoUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const activeConfigs = await ctx.db
      .query("masterclassCertificateConfigs")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
    const timestamp = nowIso();

    for (const config of activeConfigs) {
      await ctx.db.patch(config._id, {
        isActive: false,
        updatedAt: timestamp,
      });
    }

    const id = await ctx.db.insert("masterclassCertificateConfigs", {
      courseTitle: args.courseTitle,
      ceuCredits: args.ceuCredits,
      bacbProviderNumber: args.bacbProviderNumber,
      certificateSubtitle: args.certificateSubtitle || undefined,
      completionStatement: args.completionStatement,
      signatureName: args.signatureName || undefined,
      signatureTitle: args.signatureTitle || undefined,
      organizationName: args.organizationName,
      organizationWebsite: args.organizationWebsite,
      introductionVideoUrl: args.introductionVideoUrl || undefined,
      templateVersion: 1,
      isActive: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    const config = await ctx.db.get(id);
    return config ? toCertificateConfigRow(config) : null;
  },
});

export const updateCertificateConfig = mutation({
  args: {
    id: v.id("masterclassCertificateConfigs"),
    courseTitle: v.optional(v.string()),
    ceuCredits: v.optional(v.number()),
    bacbProviderNumber: v.optional(v.string()),
    certificateSubtitle: v.optional(v.string()),
    completionStatement: v.optional(v.string()),
    signatureName: v.optional(v.string()),
    signatureTitle: v.optional(v.string()),
    organizationName: v.optional(v.string()),
    organizationWebsite: v.optional(v.string()),
    introductionVideoUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Certificate configuration not found");
    await ctx.db.patch(args.id, {
      courseTitle: args.courseTitle ?? existing.courseTitle,
      ceuCredits: args.ceuCredits ?? existing.ceuCredits,
      bacbProviderNumber: args.bacbProviderNumber ?? existing.bacbProviderNumber,
      certificateSubtitle: args.certificateSubtitle ?? existing.certificateSubtitle,
      completionStatement: args.completionStatement ?? existing.completionStatement,
      signatureName: args.signatureName ?? existing.signatureName,
      signatureTitle: args.signatureTitle ?? existing.signatureTitle,
      organizationName: args.organizationName ?? existing.organizationName,
      organizationWebsite: args.organizationWebsite ?? existing.organizationWebsite,
      introductionVideoUrl: args.introductionVideoUrl ?? existing.introductionVideoUrl,
      updatedAt: nowIso(),
    });
    const config = await ctx.db.get(args.id);
    return config ? toCertificateConfigRow(config) : null;
  },
});

export const listResources = query({
  args: {},
  handler: async (ctx) => {
    const resources = await ctx.db.query("masterclassResources").collect();
    return resources
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map(toResourceRow);
  },
});

export const listResourcesBySectionIds = query({
  args: { sectionIds: v.array(v.string()) },
  handler: async (ctx, args) => {
    if (args.sectionIds.length === 0) return [];
    const sectionIds = new Set(args.sectionIds);
    const resources = await ctx.db.query("masterclassResources").collect();
    return resources
      .filter((resource) => resource.sectionId !== undefined && sectionIds.has(resource.sectionId))
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

export const importCertificateConfig = mutation({
  args: {
    legacyId: v.string(),
    courseTitle: v.string(),
    ceuCredits: v.number(),
    bacbProviderNumber: v.string(),
    certificateSubtitle: v.optional(v.string()),
    completionStatement: v.string(),
    signatureName: v.optional(v.string()),
    signatureTitle: v.optional(v.string()),
    organizationName: v.string(),
    organizationWebsite: v.string(),
    introductionVideoUrl: v.optional(v.string()),
    templateVersion: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
    createdAt: v.optional(v.string()),
    updatedAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await getCertificateConfigByLegacyId(ctx, args.legacyId);
    const timestamp = nowIso();
    const payload = {
      legacyId: args.legacyId,
      courseTitle: args.courseTitle,
      ceuCredits: args.ceuCredits,
      bacbProviderNumber: args.bacbProviderNumber,
      certificateSubtitle: args.certificateSubtitle || undefined,
      completionStatement: args.completionStatement,
      signatureName: args.signatureName || undefined,
      signatureTitle: args.signatureTitle || undefined,
      organizationName: args.organizationName,
      organizationWebsite: args.organizationWebsite,
      introductionVideoUrl: args.introductionVideoUrl || undefined,
      templateVersion: args.templateVersion ?? 1,
      isActive: args.isActive ?? true,
      createdAt: args.createdAt || timestamp,
      updatedAt: args.updatedAt || timestamp,
    };
    if (existing) {
      await ctx.db.patch(existing._id, payload);
      return existing._id;
    }
    return ctx.db.insert("masterclassCertificateConfigs", payload);
  },
});
