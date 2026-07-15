import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

const questionType = v.union(
  v.literal("multiple_choice"),
  v.literal("true_false"),
  v.literal("multiple_select")
);

const option = v.object({
  id: v.string(),
  text: v.string(),
});

function now() {
  return Date.now();
}

function compact<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined)
  ) as Partial<T>;
}

function sameAnswers(a: string[], b: string[]) {
  if (a.length !== b.length) return false;
  const left = [...a].sort();
  const right = [...b].sort();
  return left.every((value, index) => value === right[index]);
}

export const getById = query({
  args: { id: v.id("aceQuizzes") },
  handler: async (ctx, args) => ctx.db.get(args.id),
});

export const getByEvent = query({
  args: { eventId: v.id("aceEvents") },
  handler: async (ctx, args) =>
    ctx.db
      .query("aceQuizzes")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .first(),
});

export const getQuestions = query({
  args: {
    quizId: v.id("aceQuizzes"),
    activeOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("aceQuizQuestions")
      .withIndex("by_quiz_order", (q) => q.eq("quizId", args.quizId))
      .collect();

    return rows
      .filter((row) => (args.activeOnly === false ? true : row.isActive))
      .sort((a, b) => a.orderIndex - b.orderIndex);
  },
});

export const create = mutation({
  args: {
    eventId: v.id("aceEvents"),
    title: v.string(),
    description: v.optional(v.string()),
    passingScorePercentage: v.optional(v.number()),
    maxAttempts: v.optional(v.number()),
    timeLimitMinutes: v.optional(v.number()),
    shuffleQuestions: v.optional(v.boolean()),
    showCorrectAnswers: v.optional(v.boolean()),
    isRequired: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error("Event not found");

    const existing = await ctx.db
      .query("aceQuizzes")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .first();
    if (existing) return existing._id;

    const timestamp = now();
    return ctx.db.insert("aceQuizzes", {
      eventId: args.eventId,
      title: args.title.trim(),
      description: args.description?.trim() || undefined,
      passingScorePercentage: args.passingScorePercentage ?? 80,
      maxAttempts: args.maxAttempts,
      timeLimitMinutes: args.timeLimitMinutes,
      shuffleQuestions: args.shuffleQuestions ?? true,
      showCorrectAnswers: args.showCorrectAnswers ?? true,
      isRequired: args.isRequired ?? true,
      isActive: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  },
});

export const addQuestion = mutation({
  args: {
    quizId: v.id("aceQuizzes"),
    questionText: v.string(),
    questionType: v.optional(questionType),
    options: v.array(option),
    correctAnswers: v.array(v.string()),
    explanation: v.optional(v.string()),
    points: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const quiz = await ctx.db.get(args.quizId);
    if (!quiz) throw new Error("Quiz not found");

    const existingQuestions = await ctx.db
      .query("aceQuizQuestions")
      .withIndex("by_quiz", (q) => q.eq("quizId", args.quizId))
      .collect();
    const timestamp = now();

    return ctx.db.insert("aceQuizQuestions", {
      quizId: args.quizId,
      questionText: args.questionText.trim(),
      questionType: args.questionType ?? "multiple_choice",
      options: args.options,
      correctAnswers: args.correctAnswers,
      explanation: args.explanation?.trim() || undefined,
      points: args.points ?? 1,
      orderIndex: existingQuestions.length,
      isActive: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  },
});

export const updateQuestion = mutation({
  args: {
    questionId: v.id("aceQuizQuestions"),
    questionText: v.optional(v.string()),
    questionType: v.optional(questionType),
    options: v.optional(v.array(option)),
    correctAnswers: v.optional(v.array(v.string())),
    explanation: v.optional(v.string()),
    points: v.optional(v.number()),
    orderIndex: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.questionId);
    if (!existing) throw new Error("Quiz question not found");

    await ctx.db.patch(args.questionId, compact({
      questionText: args.questionText?.trim(),
      questionType: args.questionType,
      options: args.options,
      correctAnswers: args.correctAnswers,
      explanation: args.explanation?.trim() || undefined,
      points: args.points,
      orderIndex: args.orderIndex,
      isActive: args.isActive,
      updatedAt: now(),
    }));

    return ctx.db.get(args.questionId);
  },
});

export const deactivateQuestion = mutation({
  args: { questionId: v.id("aceQuizQuestions") },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.questionId);
    if (!existing) throw new Error("Quiz question not found");
    await ctx.db.patch(args.questionId, { isActive: false, updatedAt: now() });
    return { success: true };
  },
});

export const submit = mutation({
  args: {
    quizId: v.id("aceQuizzes"),
    participantId: v.id("aceUsers"),
    answers: v.any(),
  },
  handler: async (ctx, args) => {
    const [quiz, participant] = await Promise.all([
      ctx.db.get(args.quizId),
      ctx.db.get(args.participantId),
    ]);
    if (!quiz) throw new Error("Quiz not found");
    if (!participant) throw new Error("Participant not found");

    const questions = (
      await ctx.db
        .query("aceQuizQuestions")
        .withIndex("by_quiz_order", (q) => q.eq("quizId", args.quizId))
        .collect()
    ).filter((question) => question.isActive);

    const submittedAnswers = args.answers as Record<string, string[]>;
    let score = 0;
    let possibleScore = 0;
    const correctAnswers: Record<string, string[]> = {};
    const explanations: Record<string, string> = {};

    for (const question of questions) {
      possibleScore += question.points;
      correctAnswers[question._id] = question.correctAnswers;
      if (question.explanation) explanations[question._id] = question.explanation;

      const answer = submittedAnswers[question._id] ?? submittedAnswers[String(question._id)] ?? [];
      if (Array.isArray(answer) && sameAnswers(answer, question.correctAnswers)) {
        score += question.points;
      }
    }

    const scorePercentage = possibleScore > 0 ? Math.round((score / possibleScore) * 100) : 0;
    const passed = scorePercentage >= quiz.passingScorePercentage;
    const previousAttempts = await ctx.db
      .query("aceQuizSubmissions")
      .withIndex("by_quiz_participant", (q) =>
        q.eq("quizId", args.quizId).eq("participantId", args.participantId)
      )
      .collect();

    const timestamp = now();
    await ctx.db.insert("aceQuizSubmissions", {
      quizId: args.quizId,
      participantId: args.participantId,
      eventId: quiz.eventId,
      attemptNumber: previousAttempts.length + 1,
      answers: submittedAnswers,
      score,
      totalQuestions: questions.length,
      scorePercentage,
      passed,
      submittedAt: timestamp,
      createdAt: timestamp,
    });

    const registration = await ctx.db
      .query("aceRegistrations")
      .withIndex("by_event_participant", (q) =>
        q.eq("eventId", quiz.eventId).eq("participantId", args.participantId)
      )
      .unique();

    if (registration && passed) {
      await ctx.db.patch(registration._id, {
        quizCompleted: true,
        updatedAt: timestamp,
      });
    }

    return {
      passed,
      score,
      totalQuestions: questions.length,
      scorePercentage,
      passingScore: quiz.passingScorePercentage,
      correctAnswers,
      explanations,
    };
  },
});
