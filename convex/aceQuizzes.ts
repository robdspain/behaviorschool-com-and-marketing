import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ============================================================================
// ACE QUIZZES - Queries & Mutations
// ============================================================================

// Get quiz for event
export const getByEvent = query({
  args: { eventId: v.id("aceEvents") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("aceQuizzes")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();
  },
});

// Get quiz by ID
export const getById = query({
  args: { id: v.id("aceQuizzes") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get quiz questions
export const getQuestions = query({
  args: { quizId: v.id("aceQuizzes") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("aceQuizQuestions")
      .withIndex("by_quiz_order", (q) => q.eq("quizId", args.quizId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

// Create quiz
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
    const now = Date.now();
    return await ctx.db.insert("aceQuizzes", {
      eventId: args.eventId,
      title: args.title,
      description: args.description,
      passingScorePercentage: args.passingScorePercentage ?? 80,
      maxAttempts: args.maxAttempts,
      timeLimitMinutes: args.timeLimitMinutes,
      shuffleQuestions: args.shuffleQuestions ?? true,
      showCorrectAnswers: args.showCorrectAnswers ?? true,
      isRequired: args.isRequired ?? true,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Add question to quiz
export const addQuestion = mutation({
  args: {
    quizId: v.id("aceQuizzes"),
    questionText: v.string(),
    questionType: v.union(
      v.literal("multiple_choice"),
      v.literal("true_false"),
      v.literal("multiple_select")
    ),
    options: v.array(v.object({
      id: v.string(),
      text: v.string(),
    })),
    correctAnswers: v.array(v.string()),
    explanation: v.optional(v.string()),
    points: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Get current max order
    const existing = await ctx.db
      .query("aceQuizQuestions")
      .withIndex("by_quiz", (q) => q.eq("quizId", args.quizId))
      .collect();

    const maxOrder = existing.reduce((max, q) => Math.max(max, q.orderIndex), 0);
    const now = Date.now();

    const questionId = await ctx.db.insert("aceQuizQuestions", {
      quizId: args.quizId,
      questionText: args.questionText,
      questionType: args.questionType,
      options: args.options,
      correctAnswers: args.correctAnswers,
      explanation: args.explanation,
      points: args.points ?? 1,
      orderIndex: maxOrder + 1,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    // Update event's actual question count
    const quiz = await ctx.db.get(args.quizId);
    if (quiz) {
      const event = await ctx.db.get(quiz.eventId);
      if (event) {
        await ctx.db.patch(quiz.eventId, {
          actualQuestionsCount: (event.actualQuestionsCount || 0) + 1,
          updatedAt: now,
        });
      }
    }

    return questionId;
  },
});

// Submit quiz
export const submit = mutation({
  args: {
    quizId: v.id("aceQuizzes"),
    participantId: v.id("aceUsers"),
    answers: v.any(), // Record<string, string[]>
  },
  handler: async (ctx, args) => {
    const quiz = await ctx.db.get(args.quizId);
    if (!quiz) throw new Error("Quiz not found");

    const questions = await ctx.db
      .query("aceQuizQuestions")
      .withIndex("by_quiz", (q) => q.eq("quizId", args.quizId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    // Score the quiz
    let correctCount = 0;
    const correctAnswers: Record<string, string[]> = {};
    const explanations: Record<string, string> = {};

    for (const question of questions) {
      const submitted = args.answers[question._id] || [];
      const correct = question.correctAnswers;

      correctAnswers[question._id] = correct;
      if (question.explanation) {
        explanations[question._id] = question.explanation;
      }

      // Check if answers match (order independent)
      const isCorrect =
        submitted.length === correct.length &&
        submitted.every((a: string) => correct.includes(a));

      if (isCorrect) {
        correctCount++;
      }
    }

    const scorePercentage = Math.round((correctCount / questions.length) * 100);
    const passed = scorePercentage >= quiz.passingScorePercentage;

    // Get attempt number
    const previousAttempts = await ctx.db
      .query("aceQuizSubmissions")
      .withIndex("by_quiz_participant", (q) =>
        q.eq("quizId", args.quizId).eq("participantId", args.participantId)
      )
      .collect();

    const attemptNumber = previousAttempts.length + 1;
    const now = Date.now();

    // Save submission
    await ctx.db.insert("aceQuizSubmissions", {
      quizId: args.quizId,
      participantId: args.participantId,
      eventId: quiz.eventId,
      attemptNumber,
      answers: args.answers,
      score: correctCount,
      totalQuestions: questions.length,
      scorePercentage,
      passed,
      submittedAt: now,
      createdAt: now,
    });

    // If passed, update registration
    if (passed) {
      const registration = await ctx.db
        .query("aceRegistrations")
        .withIndex("by_event_participant", (q) =>
          q.eq("eventId", quiz.eventId).eq("participantId", args.participantId)
        )
        .first();

      if (registration) {
        await ctx.db.patch(registration._id, {
          quizCompleted: true,
          updatedAt: now,
        });
      }
    }

    return {
      passed,
      score: correctCount,
      totalQuestions: questions.length,
      scorePercentage,
      passingScore: quiz.passingScorePercentage,
      correctAnswers,
      explanations,
    };
  },
});

// Get quiz submissions for participant
export const getSubmissions = query({
  args: {
    quizId: v.id("aceQuizzes"),
    participantId: v.id("aceUsers"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("aceQuizSubmissions")
      .withIndex("by_quiz_participant", (q) =>
        q.eq("quizId", args.quizId).eq("participantId", args.participantId)
      )
      .collect();
  },
});

// Deactivate a question (soft delete)
export const deactivateQuestion = mutation({
  args: {
    questionId: v.id("aceQuizQuestions"),
  },
  handler: async (ctx, args) => {
    const question = await ctx.db.get(args.questionId);
    if (!question) throw new Error("Question not found");

    const now = Date.now();

    // Deactivate the question
    await ctx.db.patch(args.questionId, {
      isActive: false,
      updatedAt: now,
    });

    // Update the event's question count
    const quiz = await ctx.db.get(question.quizId);
    if (quiz) {
      const activeQuestions = await ctx.db
        .query("aceQuizQuestions")
        .withIndex("by_quiz", (q) => q.eq("quizId", question.quizId))
        .filter((q) => q.eq(q.field("isActive"), true))
        .collect();

      const event = await ctx.db.get(quiz.eventId);
      if (event) {
        await ctx.db.patch(quiz.eventId, {
          actualQuestionsCount: activeQuestions.length,
          updatedAt: now,
        });
      }
    }

    return args.questionId;
  },
});
