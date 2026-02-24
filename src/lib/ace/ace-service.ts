// ============================================================================
// ACE Platform - Service Layer (Convex)
// ============================================================================
// Centralizes all business logic for the ACE CEU Platform using Convex
// ============================================================================

import { getConvexClient, api } from "@/lib/convex";
import type { Id } from "@/lib/convex";
import type {
  AceEvent,
  AceUser,
  AceProvider,
  AceCertificate,
  AceQuiz,
  AceQuizQuestion,
  AceEventCategory,
  AceEventModality,
  AceEventStatus,
  AceCertificateStatus,
} from "./types";

// ============================================================================
// USER SERVICE
// ============================================================================

export async function getOrCreateAceUser(
  email: string,
  firstName: string,
  lastName: string,
  bacbId?: string
): Promise<{ _id: Id<"aceUsers">; [key: string]: unknown }> {
  const client = getConvexClient();

  const userId = await client.mutation(api.aceUsers.getOrCreate, {
    email: email.toLowerCase(),
    firstName,
    lastName,
    bacbId,
  });

  // Fetch the user to return the full object
  const user = await client.query(api.aceUsers.getById, { id: userId });
  if (!user) throw new Error("Failed to create or get user");

  return user;
}

export async function getUserByEmail(email: string): Promise<AceUser | null> {
  const client = getConvexClient();
  const user = await client.query(api.aceUsers.getByEmail, {
    email: email.toLowerCase(),
  });

  if (!user) return null;

  // Transform Convex user to AceUser type
  return transformUser(user);
}

// ============================================================================
// EVENT SERVICE
// ============================================================================

export async function getPublicEvents(filters?: {
  category?: AceEventCategory;
  modality?: AceEventModality;
  upcoming?: boolean;
}): Promise<AceEvent[]> {
  const client = getConvexClient();

  const events = await client.query(api.aceEvents.getPublic, {
    category: filters?.category,
    modality: filters?.modality,
    upcoming: filters?.upcoming,
  });

  return events.map(transformEvent);
}

export async function getEventWithDetails(eventId: string): Promise<
  | (AceEvent & {
      provider: AceProvider;
      quiz?: AceQuiz;
      instructors?: AceUser[];
    })
  | null
> {
  const client = getConvexClient();

  const event = await client.query(api.aceEvents.getWithDetails, {
    id: eventId as Id<"aceEvents">,
  });

  if (!event) return null;

  return {
    ...transformEvent(event),
    provider: event.provider ? transformProvider(event.provider) : ({} as AceProvider),
    quiz: event.quiz ? transformQuiz(event.quiz) : undefined,
    instructors: event.instructors?.map(transformUser) || [],
  };
}

// ============================================================================
// REGISTRATION SERVICE
// ============================================================================

export interface RegistrationResult {
  success: boolean;
  registration_id?: string;
  confirmation_code?: string;
  error?: string;
  requires_payment?: boolean;
  checkout_url?: string;
}

export async function registerForEvent(
  eventId: string,
  userData: {
    email: string;
    firstName: string;
    lastName: string;
    bacbId?: string;
    credentialType?: string;
  }
): Promise<RegistrationResult> {
  const client = getConvexClient();

  // Get or create user
  const user = await getOrCreateAceUser(
    userData.email,
    userData.firstName,
    userData.lastName,
    userData.bacbId
  );

  // Register for event
  const result = await client.mutation(api.aceRegistrations.register, {
    eventId: eventId as Id<"aceEvents">,
    participantId: user._id,
    credentialType: userData.credentialType,
  });

  if (!result.success) {
    return {
      success: false,
      error: result.error,
      registration_id: result.registrationId,
      confirmation_code: result.confirmationCode,
    };
  }

  return {
    success: true,
    registration_id: result.registrationId,
    confirmation_code: result.confirmationCode,
    requires_payment: result.requiresPayment,
  };
}

export async function getRegistration(registrationId: string) {
  const client = getConvexClient();

  const registration = await client.query(api.aceRegistrations.getById, {
    id: registrationId as Id<"aceRegistrations">,
  });

  return registration;
}

export async function getEventRegistrations(eventId: string) {
  const client = getConvexClient();

  const registrations = await client.query(api.aceRegistrations.getByEvent, {
    eventId: eventId as Id<"aceEvents">,
  });

  return registrations;
}

// ============================================================================
// QUIZ SERVICE
// ============================================================================

export async function getQuizForEvent(eventId: string): Promise<AceQuiz | null> {
  const client = getConvexClient();

  const quiz = await client.query(api.aceQuizzes.getByEvent, {
    eventId: eventId as Id<"aceEvents">,
  });

  return quiz ? transformQuiz(quiz) : null;
}

export async function getQuizQuestions(quizId: string): Promise<AceQuizQuestion[]> {
  const client = getConvexClient();

  const questions = await client.query(api.aceQuizzes.getQuestions, {
    quizId: quizId as Id<"aceQuizzes">,
  });

  return questions.map(transformQuizQuestion);
}

export async function createQuiz(
  eventId: string,
  quizData: Partial<AceQuiz>
): Promise<AceQuiz> {
  const client = getConvexClient();

  const quizId = await client.mutation(api.aceQuizzes.create, {
    eventId: eventId as Id<"aceEvents">,
    title: quizData.title || "Event Quiz",
    description: quizData.description,
    passingScorePercentage: quizData.passing_score_percentage || 80,
    maxAttempts: quizData.max_attempts,
    timeLimitMinutes: quizData.time_limit_minutes,
    shuffleQuestions: quizData.shuffle_questions ?? true,
    showCorrectAnswers: quizData.show_correct_answers ?? true,
    isRequired: quizData.is_required ?? true,
  });

  const quiz = await client.query(api.aceQuizzes.getById, { id: quizId });
  if (!quiz) throw new Error("Failed to create quiz");

  return transformQuiz(quiz);
}

export async function addQuizQuestion(
  quizId: string,
  questionData: Partial<AceQuizQuestion>
): Promise<AceQuizQuestion> {
  const client = getConvexClient();

  const questionId = await client.mutation(api.aceQuizzes.addQuestion, {
    quizId: quizId as Id<"aceQuizzes">,
    questionText: questionData.question_text || "",
    questionType: (questionData.question_type as "multiple_choice" | "true_false" | "multiple_select") || "multiple_choice",
    options: (questionData.options || []).map((opt) => ({
      id: opt.id,
      text: opt.text,
    })),
    correctAnswers: questionData.correct_answers || [],
    explanation: questionData.explanation,
    points: questionData.points || 1,
  });

  // Return the question data (Convex doesn't return the full object on insert)
  return {
    id: questionId as string,
    quiz_id: quizId,
    question_text: questionData.question_text || "",
    question_type: questionData.question_type || "multiple_choice",
    options: questionData.options || [],
    correct_answers: questionData.correct_answers || [],
    explanation: questionData.explanation,
    points: questionData.points || 1,
    order_index: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export interface QuizSubmissionResult {
  passed: boolean;
  score: number;
  totalQuestions: number;
  scorePercentage: number;
  passingScore: number;
  correctAnswers: Record<string, string[]>;
  explanations: Record<string, string>;
}

export async function submitQuiz(
  quizId: string,
  participantId: string,
  answers: Record<string, string[]>
): Promise<QuizSubmissionResult> {
  const client = getConvexClient();

  const result = await client.mutation(api.aceQuizzes.submit, {
    quizId: quizId as Id<"aceQuizzes">,
    participantId: participantId as Id<"aceUsers">,
    answers,
  });

  return result;
}

// ============================================================================
// ATTENDANCE SERVICE
// ============================================================================

export async function markAttendance(
  eventId: string,
  participantId: string,
  data: {
    checkIn?: boolean;
    checkOut?: boolean;
    verificationCode?: string;
  }
): Promise<void> {
  const client = getConvexClient();

  await client.mutation(api.aceAttendance.markAttendance, {
    eventId: eventId as Id<"aceEvents">,
    participantId: participantId as Id<"aceUsers">,
    checkIn: data.checkIn,
    checkOut: data.checkOut,
    verificationCode: data.verificationCode,
  });
}

export async function getAttendanceRecord(recordId: string) {
  const client = getConvexClient();
  return await client.query(api.aceAttendance.getById, {
    id: recordId as Id<"aceAttendanceRecords">,
  });
}

export async function getAttendanceByEventAndParticipant(
  eventId: string,
  participantId: string
) {
  const client = getConvexClient();
  return await client.query(api.aceAttendance.getByEventAndParticipant, {
    eventId: eventId as Id<"aceEvents">,
    participantId: participantId as Id<"aceUsers">,
  });
}

export async function getEventAttendanceRecords(eventId: string) {
  const client = getConvexClient();
  return await client.query(api.aceAttendance.getByEvent, {
    eventId: eventId as Id<"aceEvents">,
  });
}

export async function verifyAttendance(
  recordId: string,
  verified: boolean,
  verifiedBy?: string
) {
  const client = getConvexClient();
  await client.mutation(api.aceAttendance.verify, {
    id: recordId as Id<"aceAttendanceRecords">,
    verified,
    verifiedBy: verifiedBy as Id<"aceUsers"> | undefined,
  });
}

// ============================================================================
// FEEDBACK SERVICE
// ============================================================================

export async function submitFeedback(
  eventId: string,
  participantId: string,
  feedbackData: {
    rating: number;
    instructorRating: number;
    contentRating: number;
    comments?: string;
    suggestions?: string;
    wouldRecommend: boolean;
  }
): Promise<void> {
  const client = getConvexClient();

  await client.mutation(api.aceFeedback.submit, {
    eventId: eventId as Id<"aceEvents">,
    participantId: participantId as Id<"aceUsers">,
    rating: feedbackData.rating,
    instructorRating: feedbackData.instructorRating,
    contentRating: feedbackData.contentRating,
    comments: feedbackData.comments,
    suggestions: feedbackData.suggestions,
    wouldRecommend: feedbackData.wouldRecommend,
  });
}

// ============================================================================
// CERTIFICATE SERVICE
// ============================================================================

export async function checkCertificateEligibility(
  eventId: string,
  participantId: string
): Promise<{
  eligible: boolean;
  reasons: string[];
  requirements: {
    registered: boolean;
    attendanceVerified: boolean;
    quizPassed: boolean;
    feedbackSubmitted: boolean;
  };
}> {
  const client = getConvexClient();

  return await client.query(api.aceCertificates.checkEligibility, {
    eventId: eventId as Id<"aceEvents">,
    participantId: participantId as Id<"aceUsers">,
  });
}

export async function issueCertificate(
  eventId: string,
  participantId: string
): Promise<AceCertificate> {
  const client = getConvexClient();

  // Check eligibility first
  const eligibility = await checkCertificateEligibility(eventId, participantId);
  if (!eligibility.eligible) {
    throw new Error(`Not eligible: ${eligibility.reasons.join(", ")}`);
  }

  const certificateId = await client.mutation(api.aceCertificates.issue, {
    eventId: eventId as Id<"aceEvents">,
    participantId: participantId as Id<"aceUsers">,
  });

  const certificate = await client.query(api.aceCertificates.getById, {
    id: certificateId,
  });

  if (!certificate) throw new Error("Failed to issue certificate");

  return transformCertificate(certificate);
}

export async function getCertificateByNumber(
  certificateNumber: string
): Promise<AceCertificate | null> {
  const client = getConvexClient();

  const certificate = await client.query(api.aceCertificates.getByNumber, {
    certificateNumber,
  });

  return certificate ? transformCertificate(certificate) : null;
}

// ============================================================================
// PROVIDER SERVICE
// ============================================================================

export async function getProviderDashboard(providerId: string) {
  const client = getConvexClient();

  return await client.query(api.aceProviders.getDashboard, {
    providerId: providerId as Id<"aceProviders">,
  });
}

// ============================================================================
// TRANSFORM FUNCTIONS
// ============================================================================
// Convert Convex data to the existing AceType interfaces

function transformUser(user: any): AceUser {
  return {
    id: user._id,
    supabase_user_id: undefined,
    first_name: user.firstName,
    last_name: user.lastName,
    email: user.email,
    bacb_id: user.bacbId,
    role: user.role,
    credential_type: user.credentialType,
    credential_number: user.credentialNumber,
    credential_verified: user.credentialVerified,
    credential_verified_at: user.credentialVerifiedAt
      ? new Date(user.credentialVerifiedAt).toISOString()
      : undefined,
    credential_expires_at: user.credentialExpiresAt
      ? new Date(user.credentialExpiresAt).toISOString()
      : undefined,
    is_active: user.isActive,
    phone: user.phone,
    organization: user.organization,
    created_at: new Date(user.createdAt).toISOString(),
    updated_at: new Date(user.updatedAt).toISOString(),
    last_login_at: user.lastLoginAt
      ? new Date(user.lastLoginAt).toISOString()
      : undefined,
  };
}

function transformEvent(event: any): AceEvent {
  return {
    id: event._id,
    provider_id: event.providerId,
    title: event.title,
    description: event.description,
    total_ceus: event.totalCeus,
    ce_category: event.ceCategory,
    modality: event.modality,
    event_type: event.eventType,
    event_subtype: event.eventSubtype,
    start_date: new Date(event.startDate).toISOString(),
    end_date: event.endDate ? new Date(event.endDate).toISOString() : undefined,
    registration_deadline: event.registrationDeadline
      ? new Date(event.registrationDeadline).toISOString()
      : undefined,
    max_participants: event.maxParticipants,
    current_participants: event.currentParticipants,
    location: event.location,
    online_meeting_url: event.onlineMeetingUrl,
    fee: event.fee,
    verification_method: event.verificationMethod,
    passing_score_percentage: event.passingScorePercentage,
    status: event.status,
    minimum_questions_required: event.minimumQuestionsRequired,
    actual_questions_count: event.actualQuestionsCount,
    learning_objectives: event.learningObjectives,
    instructor_qualifications_summary: event.instructorQualificationsSummary,
    instructor_affiliations: event.instructorAffiliations,
    conflicts_of_interest: event.conflictsOfInterest,
    created_at: new Date(event.createdAt).toISOString(),
    updated_at: new Date(event.updatedAt).toISOString(),
  };
}

function transformProvider(provider: any): AceProvider {
  return {
    id: provider._id,
    provider_name: provider.providerName,
    provider_type: provider.providerType,
    bacb_provider_number: provider.bacbProviderNumber,
    coordinator_id: provider.coordinatorId,
    coordinator_years_certified: provider.coordinatorYearsCertified,
    coordinator_certification_date: provider.coordinatorCertificationDate
      ? new Date(provider.coordinatorCertificationDate).toISOString().split("T")[0]
      : undefined,
    coordinator_certification_expires: provider.coordinatorCertificationExpires
      ? new Date(provider.coordinatorCertificationExpires).toISOString().split("T")[0]
      : undefined,
    coordinator_certification_verified: provider.coordinatorCertificationVerified,
    primary_email: provider.primaryEmail,
    primary_phone: provider.primaryPhone,
    website: provider.website,
    address_line1: provider.addressLine1,
    address_line2: provider.addressLine2,
    city: provider.city,
    state: provider.state,
    zip_code: provider.zipCode,
    country: provider.country,
    application_date: provider.applicationDate
      ? new Date(provider.applicationDate).toISOString().split("T")[0]
      : undefined,
    approval_date: provider.approvalDate
      ? new Date(provider.approvalDate).toISOString().split("T")[0]
      : undefined,
    expiration_date: provider.expirationDate
      ? new Date(provider.expirationDate).toISOString().split("T")[0]
      : undefined,
    is_active: provider.isActive,
    application_fee_paid: provider.applicationFeePaid,
    application_fee_amount: provider.applicationFeeAmount,
    application_fee_paid_date: provider.applicationFeePaidDate
      ? new Date(provider.applicationFeePaidDate).toISOString().split("T")[0]
      : undefined,
    renewal_fee_paid: provider.renewalFeePaid,
    last_renewal_date: provider.lastRenewalDate
      ? new Date(provider.lastRenewalDate).toISOString().split("T")[0]
      : undefined,
    next_renewal_date: provider.nextRenewalDate
      ? new Date(provider.nextRenewalDate).toISOString().split("T")[0]
      : undefined,
    grace_period_end_date: provider.gracePeriodEndDate
      ? new Date(provider.gracePeriodEndDate).toISOString().split("T")[0]
      : undefined,
    reinstatement_date: provider.reinstatementDate
      ? new Date(provider.reinstatementDate).toISOString().split("T")[0]
      : undefined,
    late_fee_paid: provider.lateFeePaid,
    late_fee_amount: provider.lateFeeAmount,
    late_fee_paid_date: provider.lateFeePaidDate
      ? new Date(provider.lateFeePaidDate).toISOString().split("T")[0]
      : undefined,
    can_publish_events: provider.canPublishEvents,
    can_issue_certificates: provider.canIssueCertificates,
    lapse_start_date: provider.lapseStartDate
      ? new Date(provider.lapseStartDate).toISOString().split("T")[0]
      : undefined,
    lapse_end_date: provider.lapseEndDate
      ? new Date(provider.lapseEndDate).toISOString().split("T")[0]
      : undefined,
    ein: provider.ein,
    incorporation_doc_url: provider.incorporationDocUrl,
    legal_entity_verified: provider.legalEntityVerified,
    legal_entity_verified_at: provider.legalEntityVerifiedAt
      ? new Date(provider.legalEntityVerifiedAt).toISOString()
      : undefined,
    legal_entity_verified_by: provider.legalEntityVerifiedBy,
    leadership_attestation_url: provider.leadershipAttestationUrl,
    leadership_attestation_date: provider.leadershipAttestationDate
      ? new Date(provider.leadershipAttestationDate).toISOString().split("T")[0]
      : undefined,
    leadership_name: provider.leadershipName,
    leadership_title: provider.leadershipTitle,
    created_at: new Date(provider.createdAt).toISOString(),
    updated_at: new Date(provider.updatedAt).toISOString(),
  };
}

function transformQuiz(quiz: any): AceQuiz {
  return {
    id: quiz._id,
    event_id: quiz.eventId,
    title: quiz.title,
    description: quiz.description,
    passing_score_percentage: quiz.passingScorePercentage,
    max_attempts: quiz.maxAttempts,
    time_limit_minutes: quiz.timeLimitMinutes,
    shuffle_questions: quiz.shuffleQuestions,
    show_correct_answers: quiz.showCorrectAnswers,
    is_required: quiz.isRequired,
    is_active: quiz.isActive,
    created_at: new Date(quiz.createdAt).toISOString(),
    updated_at: new Date(quiz.updatedAt).toISOString(),
  };
}

function transformQuizQuestion(question: any): AceQuizQuestion {
  return {
    id: question._id,
    quiz_id: question.quizId,
    question_text: question.questionText,
    question_type: question.questionType,
    options: question.options,
    correct_answers: question.correctAnswers,
    explanation: question.explanation,
    points: question.points,
    order_index: question.orderIndex,
    is_active: question.isActive,
    created_at: new Date(question.createdAt).toISOString(),
    updated_at: new Date(question.updatedAt).toISOString(),
  };
}

function transformCertificate(cert: any): AceCertificate {
  return {
    id: cert._id,
    event_id: cert.eventId,
    participant_id: cert.participantId,
    certificate_number: cert.certificateNumber,
    participant_name: cert.participantName,
    participant_email: cert.participantEmail,
    participant_bacb_id: cert.participantBacbId,
    event_title: cert.eventTitle,
    event_date: cert.eventDate,
    instructor_name: cert.instructorName,
    provider_name: cert.providerName,
    provider_number: cert.providerNumber,
    total_ceus: cert.totalCeus,
    ce_category: cert.ceCategory as AceEventCategory,
    status: cert.status as AceCertificateStatus,
    certificate_url: cert.certificateUrl,
    issued_at: cert.issuedAt
      ? new Date(cert.issuedAt).toISOString()
      : undefined,
    revoked_at: cert.revokedAt
      ? new Date(cert.revokedAt).toISOString()
      : undefined,
    revoked_by: cert.revokedBy,
    revocation_reason: cert.revocationReason,
    created_at: new Date(cert.createdAt).toISOString(),
  };
}
