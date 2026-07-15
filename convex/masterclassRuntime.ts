import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

function nowIso() {
  return new Date().toISOString();
}

function normalizeEmail(email: string) {
  return email.toLowerCase().trim();
}

function optionalString(value?: string | null) {
  const trimmed = typeof value === "string" ? value.trim() : "";
  return trimmed || undefined;
}

function toEnrollmentRow(enrollment: any) {
  return {
    id: enrollment._id,
    legacy_id: enrollment.legacyId ?? null,
    email: enrollment.email ?? "",
    name: enrollment.name ?? "",
    bacb_cert_number: enrollment.bacbCertNumber ?? "",
    created_at: enrollment.createdAt,
    completed_at: enrollment.completedAt ?? null,
    last_accessed_at: enrollment.lastAccessedAt ?? enrollment.createdAt,
    certificate_issued: enrollment.certificateIssued,
    certificate_id: enrollment.certificateId ?? null,
    certificate_generated_at: enrollment.certificateGeneratedAt ?? null,
    certificate_emailed: enrollment.certificateEmailed ?? false,
    certificate_emailed_at: enrollment.certificateEmailedAt ?? null,
    ip_address: enrollment.ipAddress ?? null,
    user_agent: enrollment.userAgent ?? null,
    referral_source: enrollment.referralSource ?? null,
    feedback_submitted: enrollment.feedbackSubmitted ?? false,
  };
}

function toProgressRow(progress: any) {
  return {
    id: progress._id,
    enrollment_id: progress.enrollmentId,
    section_number: progress.sectionNumber,
    video_completed: progress.videoCompleted,
    video_watched_percentage: progress.videoWatchedPercentage,
    video_watch_time_seconds: progress.videoWatchTimeSeconds,
    video_completed_at: progress.videoCompletedAt ?? null,
    quiz_attempts: progress.quizAttempts,
    quiz_score: progress.quizScore ?? null,
    quiz_total: progress.quizTotal ?? null,
    quiz_passed: progress.quizPassed,
    quiz_completed_at: progress.quizCompletedAt ?? null,
    created_at: progress.createdAt,
    updated_at: progress.updatedAt,
  };
}

function toQuizResponseRow(response: any) {
  return {
    id: response._id,
    enrollment_id: response.enrollmentId,
    section_number: response.sectionNumber,
    attempt_number: response.attemptNumber,
    question_number: response.questionNumber,
    question_id: response.questionId,
    selected_answer: response.selectedAnswer,
    correct_answer: response.correctAnswer,
    is_correct: response.isCorrect,
    time_spent_seconds: response.timeSpentSeconds ?? null,
    created_at: response.createdAt,
  };
}

function toCertificateRow(certificate: any) {
  return {
    id: certificate._id,
    certificate_id: certificate.certificateId,
    enrollment_id: certificate.enrollmentId,
    recipient_name: certificate.recipientName,
    recipient_email: certificate.recipientEmail,
    bacb_cert_number: certificate.bacbCertNumber,
    course_title: certificate.courseTitle,
    ceu_credits: certificate.ceuCredits,
    completion_date: certificate.completionDate,
    pdf_url: certificate.pdfUrl ?? null,
    pdf_generated: certificate.pdfGenerated,
    created_at: certificate.createdAt,
    verification_count: certificate.verificationCount,
    last_verified_at: certificate.lastVerifiedAt ?? null,
  };
}

function toFeedbackRow(feedback: any) {
  return {
    id: feedback._id,
    enrollment_id: feedback.enrollmentId,
    participant_email: feedback.participantEmail,
    participant_name: feedback.participantName,
    overall_satisfaction: feedback.overallSatisfaction ?? null,
    content_quality: feedback.contentQuality ?? null,
    instructor_effectiveness: feedback.instructorEffectiveness ?? null,
    relevance_to_practice: feedback.relevanceToPractice ?? null,
    would_recommend: feedback.wouldRecommend ?? null,
    section_1_rating: feedback.section1Rating ?? null,
    section_2_rating: feedback.section2Rating ?? null,
    section_3_rating: feedback.section3Rating ?? null,
    section_4_rating: feedback.section4Rating ?? null,
    most_valuable_learning: feedback.mostValuableLearning ?? null,
    suggestions_for_improvement: feedback.suggestionsForImprovement ?? null,
    topics_for_future_courses: feedback.topicsForFutureCourses ?? null,
    additional_comments: feedback.additionalComments ?? null,
    learned_ethics_concepts: feedback.learnedEthicsConcepts ?? false,
    learned_teacher_collaboration: feedback.learnedTeacherCollaboration ?? false,
    learned_data_systems: feedback.learnedDataSystems ?? false,
    learned_crisis_management: feedback.learnedCrisisManagement ?? false,
    will_apply_immediately: feedback.willApplyImmediately ?? false,
    will_apply_within_month: feedback.willApplyWithinMonth ?? false,
    will_share_with_team: feedback.willShareWithTeam ?? false,
    submitted_at: feedback.submittedAt,
  };
}

async function getEnrollmentDoc(ctx: any, enrollmentId: string) {
  try {
    const byId = await ctx.db.get(enrollmentId as any);
    if (byId) return byId;
  } catch {
    // Legacy Supabase UUIDs are not Convex IDs; fall through to legacy lookup.
  }

  return ctx.db
    .query("masterclassEnrollments")
    .withIndex("by_legacy_id", (q: any) => q.eq("legacyId", enrollmentId))
    .first();
}

async function getEnrollmentDocByEmail(ctx: any, email: string) {
  return ctx.db
    .query("masterclassEnrollments")
    .withIndex("by_email_lower", (q: any) => q.eq("emailLower", normalizeEmail(email)))
    .first();
}

async function getProgressDoc(ctx: any, enrollmentId: string, sectionNumber: number) {
  return ctx.db
    .query("masterclassProgress")
    .withIndex("by_enrollment_section", (q: any) =>
      q.eq("enrollmentId", enrollmentId).eq("sectionNumber", sectionNumber)
    )
    .first();
}

async function getCertificateByEnrollmentDoc(ctx: any, enrollmentId: string) {
  return ctx.db
    .query("masterclassCertificates")
    .withIndex("by_enrollment", (q: any) => q.eq("enrollmentId", enrollmentId))
    .first();
}

async function getCertificateByIdDoc(ctx: any, certificateId: string) {
  return ctx.db
    .query("masterclassCertificates")
    .withIndex("by_certificate_id", (q: any) => q.eq("certificateId", certificateId))
    .first();
}

async function listProgressDocs(ctx: any, enrollmentId: string) {
  const progress = await ctx.db
    .query("masterclassProgress")
    .withIndex("by_enrollment", (q: any) => q.eq("enrollmentId", enrollmentId))
    .collect();

  return progress.sort((a: any, b: any) => a.sectionNumber - b.sectionNumber);
}

function calculateProgressFromRows(progress: any[]) {
  const completedSteps = progress.reduce((acc, row) => (
    acc + (row.videoCompleted ? 1 : 0) + (row.quizPassed ? 1 : 0)
  ), 0);

  return Math.round((completedSteps / 8) * 100);
}

function canGenerateFromRows(progress: any[]) {
  return [1, 2, 3, 4].every((sectionNumber) => {
    const row = progress.find((item) => item.sectionNumber === sectionNumber);
    return row?.videoCompleted && row?.quizPassed;
  });
}

async function ensureProgressRow(ctx: any, enrollmentId: string, sectionNumber: number) {
  const existing = await getProgressDoc(ctx, enrollmentId, sectionNumber);
  if (existing) return existing;

  const timestamp = nowIso();
  const id = await ctx.db.insert("masterclassProgress", {
    enrollmentId,
    sectionNumber,
    videoCompleted: false,
    videoWatchedPercentage: 0,
    videoWatchTimeSeconds: 0,
    quizAttempts: 0,
    quizPassed: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  return ctx.db.get(id);
}

function average(values: Array<number | undefined>) {
  const numbers = values.filter((value): value is number => typeof value === "number" && value > 0);
  if (numbers.length === 0) return null;
  return Number((numbers.reduce((sum, value) => sum + value, 0) / numbers.length).toFixed(2));
}

export const createEnrollment = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    bacbCertNumber: v.string(),
    userId: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    referralSource: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const emailLower = normalizeEmail(args.email);
    const existing = await getEnrollmentDocByEmail(ctx, emailLower);
    if (existing) {
      throw new Error("An enrollment with this email already exists. Please use the same email to continue.");
    }

    const timestamp = nowIso();
    const id = await ctx.db.insert("masterclassEnrollments", {
      userId: optionalString(args.userId),
      email: emailLower,
      emailLower,
      name: args.name.trim(),
      bacbCertNumber: args.bacbCertNumber.trim(),
      createdAt: timestamp,
      lastAccessedAt: timestamp,
      certificateIssued: false,
      certificateEmailed: false,
      ipAddress: optionalString(args.ipAddress),
      userAgent: optionalString(args.userAgent),
      referralSource: optionalString(args.referralSource),
      feedbackSubmitted: false,
      updatedAt: timestamp,
    });

    const enrollment = await ctx.db.get(id);
    return enrollment ? toEnrollmentRow(enrollment) : null;
  },
});

export const initializeProgress = mutation({
  args: { enrollmentId: v.string() },
  handler: async (ctx, args) => {
    for (const sectionNumber of [1, 2, 3, 4]) {
      await ensureProgressRow(ctx, args.enrollmentId, sectionNumber);
    }
    return { success: true };
  },
});

export const getEnrollmentByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const enrollment = await getEnrollmentDocByEmail(ctx, args.email);
    return enrollment ? toEnrollmentRow(enrollment) : null;
  },
});

export const getEnrollmentById = query({
  args: { enrollmentId: v.string() },
  handler: async (ctx, args) => {
    const enrollment = await getEnrollmentDoc(ctx, args.enrollmentId);
    return enrollment ? toEnrollmentRow(enrollment) : null;
  },
});

export const updateLastAccessed = mutation({
  args: { enrollmentId: v.string() },
  handler: async (ctx, args) => {
    const enrollment = await getEnrollmentDoc(ctx, args.enrollmentId);
    if (!enrollment) return { success: false };
    const timestamp = nowIso();
    await ctx.db.patch(enrollment._id, { lastAccessedAt: timestamp, updatedAt: timestamp });
    return { success: true };
  },
});

export const markEnrollmentComplete = mutation({
  args: { enrollmentId: v.string() },
  handler: async (ctx, args) => {
    const enrollment = await getEnrollmentDoc(ctx, args.enrollmentId);
    if (!enrollment) throw new Error("Enrollment not found");
    const timestamp = nowIso();
    await ctx.db.patch(enrollment._id, { completedAt: timestamp, updatedAt: timestamp });
    return { success: true };
  },
});

export const markCertificateEmailed = mutation({
  args: { enrollmentId: v.string() },
  handler: async (ctx, args) => {
    const enrollment = await getEnrollmentDoc(ctx, args.enrollmentId);
    if (!enrollment) throw new Error("Enrollment not found");
    const timestamp = nowIso();
    await ctx.db.patch(enrollment._id, {
      certificateEmailed: true,
      certificateEmailedAt: timestamp,
      updatedAt: timestamp,
    });
    return { success: true };
  },
});

export const getEnrollmentProgress = query({
  args: { enrollmentId: v.string() },
  handler: async (ctx, args) => {
    return (await listProgressDocs(ctx, args.enrollmentId)).map(toProgressRow);
  },
});

export const getSectionProgress = query({
  args: {
    enrollmentId: v.string(),
    sectionNumber: v.number(),
  },
  handler: async (ctx, args) => {
    const progress = await getProgressDoc(ctx, args.enrollmentId, args.sectionNumber);
    return progress ? toProgressRow(progress) : null;
  },
});

export const updateVideoProgress = mutation({
  args: {
    enrollmentId: v.string(),
    sectionNumber: v.number(),
    watchedPercentage: v.number(),
    watchTimeSeconds: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ensureProgressRow(ctx, args.enrollmentId, args.sectionNumber);
    const timestamp = nowIso();
    await ctx.db.patch(existing._id, {
      videoWatchedPercentage: args.watchedPercentage,
      videoWatchTimeSeconds: args.watchTimeSeconds,
      updatedAt: timestamp,
    });
    return { success: true };
  },
});

export const markVideoComplete = mutation({
  args: {
    enrollmentId: v.string(),
    sectionNumber: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ensureProgressRow(ctx, args.enrollmentId, args.sectionNumber);
    const timestamp = nowIso();
    await ctx.db.patch(existing._id, {
      videoCompleted: true,
      videoCompletedAt: timestamp,
      videoWatchedPercentage: 100,
      updatedAt: timestamp,
    });
    return { success: true };
  },
});

export const saveQuizResults = mutation({
  args: {
    enrollmentId: v.string(),
    sectionNumber: v.number(),
    score: v.number(),
    total: v.number(),
    passed: v.boolean(),
    attemptNumber: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ensureProgressRow(ctx, args.enrollmentId, args.sectionNumber);
    const timestamp = nowIso();
    await ctx.db.patch(existing._id, {
      quizAttempts: args.attemptNumber,
      quizScore: args.score,
      quizTotal: args.total,
      quizPassed: args.passed,
      quizCompletedAt: args.passed ? timestamp : undefined,
      updatedAt: timestamp,
    });
    return { success: true };
  },
});

export const saveQuizResponses = mutation({
  args: {
    enrollmentId: v.string(),
    sectionNumber: v.number(),
    attemptNumber: v.number(),
    responses: v.array(v.object({
      questionId: v.string(),
      questionNumber: v.number(),
      selectedAnswer: v.number(),
      correctAnswer: v.number(),
      isCorrect: v.boolean(),
      timeSpent: v.optional(v.number()),
    })),
  },
  handler: async (ctx, args) => {
    const timestamp = nowIso();
    for (const response of args.responses) {
      await ctx.db.insert("masterclassQuizResponses", {
        enrollmentId: args.enrollmentId,
        sectionNumber: args.sectionNumber,
        attemptNumber: args.attemptNumber,
        questionNumber: response.questionNumber,
        questionId: response.questionId,
        selectedAnswer: response.selectedAnswer,
        correctAnswer: response.correctAnswer,
        isCorrect: response.isCorrect,
        timeSpentSeconds: response.timeSpent,
        createdAt: timestamp,
      });
    }
    return { success: true };
  },
});

export const getQuizResponses = query({
  args: {
    enrollmentId: v.string(),
    sectionNumber: v.number(),
  },
  handler: async (ctx, args) => {
    const responses = await ctx.db
      .query("masterclassQuizResponses")
      .withIndex("by_enrollment_section", (q: any) =>
        q.eq("enrollmentId", args.enrollmentId).eq("sectionNumber", args.sectionNumber)
      )
      .collect();

    return responses
      .sort((a: any, b: any) =>
        a.attemptNumber - b.attemptNumber || a.questionNumber - b.questionNumber
      )
      .map(toQuizResponseRow);
  },
});

export const generateCertificate = mutation({
  args: {
    enrollmentId: v.string(),
    certificateId: v.string(),
    recipientName: v.string(),
    recipientEmail: v.string(),
    bacbCertNumber: v.string(),
    courseTitle: v.string(),
    ceuCredits: v.number(),
    completionDate: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await getCertificateByEnrollmentDoc(ctx, args.enrollmentId);
    if (existing) return toCertificateRow(existing);

    const duplicateCertificate = await getCertificateByIdDoc(ctx, args.certificateId);
    if (duplicateCertificate) {
      throw new Error("Certificate ID already exists");
    }

    const timestamp = nowIso();
    const id = await ctx.db.insert("masterclassCertificates", {
      certificateId: args.certificateId,
      enrollmentId: args.enrollmentId,
      recipientName: args.recipientName,
      recipientEmail: args.recipientEmail,
      bacbCertNumber: args.bacbCertNumber,
      courseTitle: args.courseTitle,
      ceuCredits: args.ceuCredits,
      completionDate: args.completionDate,
      pdfGenerated: false,
      verificationCount: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    const enrollment = await getEnrollmentDoc(ctx, args.enrollmentId);
    if (enrollment) {
      await ctx.db.patch(enrollment._id, {
        certificateIssued: true,
        certificateId: args.certificateId,
        certificateGeneratedAt: timestamp,
        updatedAt: timestamp,
      });
    }

    const certificate = await ctx.db.get(id);
    return certificate ? toCertificateRow(certificate) : null;
  },
});

export const getCertificateById = query({
  args: { certificateId: v.string() },
  handler: async (ctx, args) => {
    const certificate = await getCertificateByIdDoc(ctx, args.certificateId);
    return certificate ? toCertificateRow(certificate) : null;
  },
});

export const getCertificateByEnrollment = query({
  args: { enrollmentId: v.string() },
  handler: async (ctx, args) => {
    const certificate = await getCertificateByEnrollmentDoc(ctx, args.enrollmentId);
    return certificate ? toCertificateRow(certificate) : null;
  },
});

export const updateCertificatePDF = mutation({
  args: {
    certificateId: v.string(),
    pdfUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const certificate = await getCertificateByIdDoc(ctx, args.certificateId);
    if (!certificate) throw new Error("Certificate not found");
    await ctx.db.patch(certificate._id, {
      pdfUrl: args.pdfUrl,
      pdfGenerated: true,
      updatedAt: nowIso(),
    });
    return { success: true };
  },
});

export const recordCertificateVerification = mutation({
  args: { certificateId: v.string() },
  handler: async (ctx, args) => {
    const certificate = await getCertificateByIdDoc(ctx, args.certificateId);
    if (!certificate) return { success: false };
    await ctx.db.patch(certificate._id, {
      verificationCount: (certificate.verificationCount || 0) + 1,
      lastVerifiedAt: nowIso(),
      updatedAt: nowIso(),
    });
    return { success: true };
  },
});

export const trackEvent = mutation({
  args: {
    enrollmentId: v.optional(v.string()),
    eventType: v.string(),
    eventData: v.optional(v.any()),
    sectionNumber: v.optional(v.number()),
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("masterclassAnalyticsEvents", {
      enrollmentId: optionalString(args.enrollmentId),
      eventType: args.eventType,
      eventData: args.eventData,
      sectionNumber: args.sectionNumber,
      sessionId: optionalString(args.sessionId),
      createdAt: nowIso(),
    });
    return { success: true };
  },
});

export const canGenerateCertificate = query({
  args: { enrollmentId: v.string() },
  handler: async (ctx, args) => canGenerateFromRows(await listProgressDocs(ctx, args.enrollmentId)),
});

export const calculateProgress = query({
  args: { enrollmentId: v.string() },
  handler: async (ctx, args) => calculateProgressFromRows(await listProgressDocs(ctx, args.enrollmentId)),
});

export const submitFeedback = mutation({
  args: {
    enrollmentId: v.string(),
    overallSatisfaction: v.optional(v.number()),
    contentQuality: v.optional(v.number()),
    instructorEffectiveness: v.optional(v.number()),
    relevanceToPractice: v.optional(v.number()),
    wouldRecommend: v.optional(v.number()),
    section1Rating: v.optional(v.number()),
    section2Rating: v.optional(v.number()),
    section3Rating: v.optional(v.number()),
    section4Rating: v.optional(v.number()),
    mostValuableLearning: v.optional(v.string()),
    suggestionsForImprovement: v.optional(v.string()),
    topicsForFutureCourses: v.optional(v.string()),
    additionalComments: v.optional(v.string()),
    learnedEthicsConcepts: v.optional(v.boolean()),
    learnedTeacherCollaboration: v.optional(v.boolean()),
    learnedDataSystems: v.optional(v.boolean()),
    learnedCrisisManagement: v.optional(v.boolean()),
    willApplyImmediately: v.optional(v.boolean()),
    willApplyWithinMonth: v.optional(v.boolean()),
    willShareWithTeam: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const enrollment = await getEnrollmentDoc(ctx, args.enrollmentId);
    if (!enrollment) {
      throw new Error("Enrollment not found");
    }

    const existing = await ctx.db
      .query("masterclassFeedback")
      .withIndex("by_enrollment", (q: any) => q.eq("enrollmentId", args.enrollmentId))
      .first();

    if (existing) {
      throw new Error("Feedback already submitted for this enrollment");
    }

    const timestamp = nowIso();
    const id = await ctx.db.insert("masterclassFeedback", {
      enrollmentId: args.enrollmentId,
      participantEmail: enrollment.email ?? "",
      participantName: enrollment.name ?? "",
      overallSatisfaction: args.overallSatisfaction,
      contentQuality: args.contentQuality,
      instructorEffectiveness: args.instructorEffectiveness,
      relevanceToPractice: args.relevanceToPractice,
      wouldRecommend: args.wouldRecommend,
      section1Rating: args.section1Rating,
      section2Rating: args.section2Rating,
      section3Rating: args.section3Rating,
      section4Rating: args.section4Rating,
      mostValuableLearning: optionalString(args.mostValuableLearning),
      suggestionsForImprovement: optionalString(args.suggestionsForImprovement),
      topicsForFutureCourses: optionalString(args.topicsForFutureCourses),
      additionalComments: optionalString(args.additionalComments),
      learnedEthicsConcepts: args.learnedEthicsConcepts,
      learnedTeacherCollaboration: args.learnedTeacherCollaboration,
      learnedDataSystems: args.learnedDataSystems,
      learnedCrisisManagement: args.learnedCrisisManagement,
      willApplyImmediately: args.willApplyImmediately,
      willApplyWithinMonth: args.willApplyWithinMonth,
      willShareWithTeam: args.willShareWithTeam,
      submittedAt: timestamp,
    });

    await ctx.db.patch(enrollment._id, {
      feedbackSubmitted: true,
      updatedAt: timestamp,
    });

    const feedback = await ctx.db.get(id);
    return feedback ? toFeedbackRow(feedback) : null;
  },
});

export const getFeedbackByEnrollment = query({
  args: { enrollmentId: v.string() },
  handler: async (ctx, args) => {
    const feedback = await ctx.db
      .query("masterclassFeedback")
      .withIndex("by_enrollment", (q: any) => q.eq("enrollmentId", args.enrollmentId))
      .first();
    return feedback ? toFeedbackRow(feedback) : null;
  },
});

export const listFeedback = query({
  args: {},
  handler: async (ctx) => {
    const feedback = await ctx.db.query("masterclassFeedback").collect();
    return feedback
      .sort((a: any, b: any) => b.submittedAt.localeCompare(a.submittedAt))
      .map(toFeedbackRow);
  },
});

export const feedbackStats = query({
  args: {},
  handler: async (ctx) => {
    const feedback = await ctx.db.query("masterclassFeedback").collect();
    const satisfactionDistribution = [0, 0, 0, 0, 0];
    const recommendDistribution = [0, 0, 0, 0, 0];

    for (const row of feedback) {
      if (row.overallSatisfaction && row.overallSatisfaction >= 1 && row.overallSatisfaction <= 5) {
        satisfactionDistribution[row.overallSatisfaction - 1] += 1;
      }
      if (row.wouldRecommend && row.wouldRecommend >= 1 && row.wouldRecommend <= 5) {
        recommendDistribution[row.wouldRecommend - 1] += 1;
      }
    }

    return {
      total_feedback: feedback.length,
      average_overall_satisfaction: average(feedback.map((row) => row.overallSatisfaction)),
      average_content_quality: average(feedback.map((row) => row.contentQuality)),
      average_instructor_effectiveness: average(feedback.map((row) => row.instructorEffectiveness)),
      average_relevance_to_practice: average(feedback.map((row) => row.relevanceToPractice)),
      average_would_recommend: average(feedback.map((row) => row.wouldRecommend)),
      satisfaction_distribution: satisfactionDistribution,
      recommend_distribution: recommendDistribution,
    };
  },
});
