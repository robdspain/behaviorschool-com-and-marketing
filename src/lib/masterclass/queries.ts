import { api, getConvexClient } from '@/lib/convex';
import type {
  MasterclassEnrollment,
  MasterclassProgress,
  MasterclassQuizResponse,
  MasterclassCertificate,
  EnrollmentFormData,
  AnalyticsEvent,
} from './types';

type QuizResponseInput = {
  questionId: string;
  questionNumber: number;
  selectedAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  timeSpent?: number;
};

type CertificateInput = {
  recipientName: string;
  recipientEmail: string;
  bacbCertNumber: string;
  courseTitle: string;
  ceuCredits: number;
  completionDate: string;
};

type MasterclassFeedbackInput = {
  enrollment_id: string;
  overall_satisfaction?: number;
  content_quality?: number;
  instructor_effectiveness?: number;
  relevance_to_practice?: number;
  would_recommend?: number;
  section_1_rating?: number;
  section_2_rating?: number;
  section_3_rating?: number;
  section_4_rating?: number;
  most_valuable_learning?: string;
  suggestions_for_improvement?: string;
  topics_for_future_courses?: string;
  additional_comments?: string;
  learned_ethics_concepts?: boolean;
  learned_teacher_collaboration?: boolean;
  learned_data_systems?: boolean;
  learned_crisis_management?: boolean;
  will_apply_immediately?: boolean;
  will_apply_within_month?: boolean;
  will_share_with_team?: boolean;
};

export async function createEnrollment(
  data: EnrollmentFormData & {
    userId?: string;
    ipAddress?: string;
    userAgent?: string;
    referralSource?: string;
  }
): Promise<MasterclassEnrollment> {
  const enrollment = await getConvexClient().mutation(api.masterclassRuntime.createEnrollment, {
    email: data.email,
    name: data.name,
    bacbCertNumber: data.bacbCertNumber,
    userId: data.userId,
    ipAddress: data.ipAddress,
    userAgent: data.userAgent,
    referralSource: data.referralSource,
  });

  if (!enrollment) {
    throw new Error('Failed to create enrollment');
  }

  return enrollment;
}

export async function initializeEnrollmentProgress(enrollmentId: string): Promise<void> {
  await getConvexClient().mutation(api.masterclassRuntime.initializeProgress, {
    enrollmentId,
  });
}

export async function getEnrollmentByEmail(
  email: string
): Promise<MasterclassEnrollment | null> {
  return getConvexClient().query(api.masterclassRuntime.getEnrollmentByEmail, {
    email,
  });
}

export async function getEnrollmentById(
  enrollmentId: string
): Promise<MasterclassEnrollment | null> {
  return getConvexClient().query(api.masterclassRuntime.getEnrollmentById, {
    enrollmentId,
  });
}

export async function updateLastAccessed(enrollmentId: string): Promise<void> {
  await getConvexClient().mutation(api.masterclassRuntime.updateLastAccessed, {
    enrollmentId,
  });
}

export async function markEnrollmentComplete(enrollmentId: string): Promise<void> {
  await getConvexClient().mutation(api.masterclassRuntime.markEnrollmentComplete, {
    enrollmentId,
  });
}

export async function markCertificateEmailed(enrollmentId: string): Promise<void> {
  await getConvexClient().mutation(api.masterclassRuntime.markCertificateEmailed, {
    enrollmentId,
  });
}

export async function getEnrollmentProgress(
  enrollmentId: string
): Promise<MasterclassProgress[]> {
  return getConvexClient().query(api.masterclassRuntime.getEnrollmentProgress, {
    enrollmentId,
  });
}

export async function getSectionProgress(
  enrollmentId: string,
  sectionNumber: number
): Promise<MasterclassProgress | null> {
  return getConvexClient().query(api.masterclassRuntime.getSectionProgress, {
    enrollmentId,
    sectionNumber,
  });
}

export async function updateVideoProgress(
  enrollmentId: string,
  sectionNumber: number,
  watchedPercentage: number,
  watchTimeSeconds: number
): Promise<void> {
  await getConvexClient().mutation(api.masterclassRuntime.updateVideoProgress, {
    enrollmentId,
    sectionNumber,
    watchedPercentage,
    watchTimeSeconds,
  });
}

export async function markVideoComplete(
  enrollmentId: string,
  sectionNumber: number
): Promise<void> {
  await getConvexClient().mutation(api.masterclassRuntime.markVideoComplete, {
    enrollmentId,
    sectionNumber,
  });
}

export async function saveQuizResults(
  enrollmentId: string,
  sectionNumber: number,
  score: number,
  total: number,
  passed: boolean,
  attemptNumber: number
): Promise<void> {
  await getConvexClient().mutation(api.masterclassRuntime.saveQuizResults, {
    enrollmentId,
    sectionNumber,
    score,
    total,
    passed,
    attemptNumber,
  });
}

export async function saveQuizResponses(
  enrollmentId: string,
  sectionNumber: number,
  attemptNumber: number,
  responses: QuizResponseInput[]
): Promise<void> {
  await getConvexClient().mutation(api.masterclassRuntime.saveQuizResponses, {
    enrollmentId,
    sectionNumber,
    attemptNumber,
    responses,
  });
}

export async function getQuizResponses(
  enrollmentId: string,
  sectionNumber: number
): Promise<MasterclassQuizResponse[]> {
  return getConvexClient().query(api.masterclassRuntime.getQuizResponses, {
    enrollmentId,
    sectionNumber,
  });
}

export async function generateCertificate(
  enrollmentId: string,
  certificateId: string,
  certificateData: CertificateInput
): Promise<MasterclassCertificate> {
  const certificate = await getConvexClient().mutation(api.masterclassRuntime.generateCertificate, {
    enrollmentId,
    certificateId,
    recipientName: certificateData.recipientName,
    recipientEmail: certificateData.recipientEmail,
    bacbCertNumber: certificateData.bacbCertNumber,
    courseTitle: certificateData.courseTitle,
    ceuCredits: certificateData.ceuCredits,
    completionDate: certificateData.completionDate,
  });

  if (!certificate) {
    throw new Error('Failed to generate certificate');
  }

  return certificate;
}

export async function getCertificateById(
  certificateId: string
): Promise<MasterclassCertificate | null> {
  return getConvexClient().query(api.masterclassRuntime.getCertificateById, {
    certificateId,
  });
}

export async function getCertificateByEnrollment(
  enrollmentId: string
): Promise<MasterclassCertificate | null> {
  return getConvexClient().query(api.masterclassRuntime.getCertificateByEnrollment, {
    enrollmentId,
  });
}

export async function updateCertificatePDF(
  certificateId: string,
  pdfUrl: string
): Promise<void> {
  await getConvexClient().mutation(api.masterclassRuntime.updateCertificatePDF, {
    certificateId,
    pdfUrl,
  });
}

export async function recordCertificateVerification(
  certificateId: string
): Promise<void> {
  await getConvexClient().mutation(api.masterclassRuntime.recordCertificateVerification, {
    certificateId,
  });
}

export async function trackEvent(event: AnalyticsEvent): Promise<void> {
  await getConvexClient().mutation(api.masterclassRuntime.trackEvent, {
    enrollmentId: event.enrollmentId || undefined,
    eventType: event.eventType,
    eventData: event.eventData || undefined,
    sectionNumber: event.sectionNumber || undefined,
    sessionId: event.sessionId || undefined,
  });
}

export async function canGenerateCertificate(
  enrollmentId: string
): Promise<boolean> {
  return getConvexClient().query(api.masterclassRuntime.canGenerateCertificate, {
    enrollmentId,
  });
}

export async function calculateProgress(
  enrollmentId: string
): Promise<number> {
  return getConvexClient().query(api.masterclassRuntime.calculateProgress, {
    enrollmentId,
  });
}

export async function getNextAttemptNumber(
  enrollmentId: string,
  sectionNumber: number
): Promise<number> {
  const progress = await getSectionProgress(enrollmentId, sectionNumber);
  return (progress?.quiz_attempts || 0) + 1;
}

export async function submitMasterclassFeedback(feedback: MasterclassFeedbackInput) {
  return getConvexClient().mutation(api.masterclassRuntime.submitFeedback, {
    enrollmentId: feedback.enrollment_id,
    overallSatisfaction: feedback.overall_satisfaction,
    contentQuality: feedback.content_quality,
    instructorEffectiveness: feedback.instructor_effectiveness,
    relevanceToPractice: feedback.relevance_to_practice,
    wouldRecommend: feedback.would_recommend,
    section1Rating: feedback.section_1_rating,
    section2Rating: feedback.section_2_rating,
    section3Rating: feedback.section_3_rating,
    section4Rating: feedback.section_4_rating,
    mostValuableLearning: feedback.most_valuable_learning,
    suggestionsForImprovement: feedback.suggestions_for_improvement,
    topicsForFutureCourses: feedback.topics_for_future_courses,
    additionalComments: feedback.additional_comments,
    learnedEthicsConcepts: feedback.learned_ethics_concepts,
    learnedTeacherCollaboration: feedback.learned_teacher_collaboration,
    learnedDataSystems: feedback.learned_data_systems,
    learnedCrisisManagement: feedback.learned_crisis_management,
    willApplyImmediately: feedback.will_apply_immediately,
    willApplyWithinMonth: feedback.will_apply_within_month,
    willShareWithTeam: feedback.will_share_with_team,
  });
}

export async function getMasterclassFeedbackByEnrollment(enrollmentId: string) {
  return getConvexClient().query(api.masterclassRuntime.getFeedbackByEnrollment, {
    enrollmentId,
  });
}

export async function listMasterclassFeedback() {
  return getConvexClient().query(api.masterclassRuntime.listFeedback, {});
}

export async function getMasterclassFeedbackStats() {
  return getConvexClient().query(api.masterclassRuntime.feedbackStats, {});
}
