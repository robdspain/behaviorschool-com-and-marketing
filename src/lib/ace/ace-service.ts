// ============================================================================
// ACE Platform - Service Layer
// ============================================================================
// Centralizes all business logic for the ACE CEU Platform
// ============================================================================

import { createClient } from '@/lib/supabase-server';
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
} from './types';

// ============================================================================
// USER SERVICE
// ============================================================================

export async function getOrCreateAceUser(
  email: string,
  firstName: string,
  lastName: string,
  bacbId?: string
): Promise<AceUser> {
  const supabase = await createClient();

  // Check if user already exists
  const { data: existingUser } = await supabase
    .from('ace_users')
    .select('*')
    .eq('email', email.toLowerCase())
    .single();

  if (existingUser) {
    // Update BACB ID if provided and not set
    if (bacbId && !existingUser.bacb_id) {
      const { data: updatedUser } = await supabase
        .from('ace_users')
        .update({ bacb_id: bacbId })
        .eq('id', existingUser.id)
        .select()
        .single();
      return updatedUser as AceUser;
    }
    return existingUser as AceUser;
  }

  // Create new user
  const { data: newUser, error } = await supabase
    .from('ace_users')
    .insert([{
      first_name: firstName,
      last_name: lastName,
      email: email.toLowerCase(),
      bacb_id: bacbId,
      role: 'participant',
      is_active: true,
    }])
    .select()
    .single();

  if (error) throw new Error(`Failed to create user: ${error.message}`);
  return newUser as AceUser;
}

export async function getUserByEmail(email: string): Promise<AceUser | null> {
  const supabase = await createClient();
  
  const { data } = await supabase
    .from('ace_users')
    .select('*')
    .eq('email', email.toLowerCase())
    .single();
  
  return data as AceUser | null;
}

// ============================================================================
// EVENT SERVICE
// ============================================================================

export async function getPublicEvents(filters?: {
  category?: AceEventCategory;
  modality?: AceEventModality;
  upcoming?: boolean;
}): Promise<AceEvent[]> {
  const supabase = await createClient();

  let query = supabase
    .from('ace_events')
    .select(`
      *,
      provider:ace_providers (
        id,
        provider_name,
        bacb_provider_number
      )
    `)
    .in('status', ['approved', 'in_progress']);

  if (filters?.category) {
    query = query.eq('ce_category', filters.category);
  }

  if (filters?.modality) {
    query = query.eq('modality', filters.modality);
  }

  if (filters?.upcoming) {
    query = query.gte('start_date', new Date().toISOString());
  }

  const { data, error } = await query.order('start_date', { ascending: true });

  if (error) throw error;
  return data as AceEvent[];
}

export async function getEventWithDetails(eventId: string): Promise<AceEvent & {
  provider: AceProvider;
  quiz?: AceQuiz;
  instructors?: AceUser[];
}> {
  const supabase = await createClient();

  const { data: event, error } = await supabase
    .from('ace_events')
    .select(`
      *,
      provider:ace_providers (*),
      quiz:ace_quizzes (*),
      event_instructors:ace_event_instructors (
        user:ace_users (*)
      )
    `)
    .eq('id', eventId)
    .single();

  if (error) throw error;

  // Transform instructors array
  const instructors = event.event_instructors?.map((ei: { user: AceUser }) => ei.user) || [];

  return {
    ...event,
    instructors,
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
  const supabase = await createClient();

  // Get or create user
  const user = await getOrCreateAceUser(
    userData.email,
    userData.firstName,
    userData.lastName,
    userData.bacbId
  );

  // Get event details
  const { data: event } = await supabase
    .from('ace_events')
    .select('*')
    .eq('id', eventId)
    .single();

  if (!event) {
    return { success: false, error: 'Event not found' };
  }

  // Check if already registered
  const { data: existingReg } = await supabase
    .from('ace_registrations')
    .select('*')
    .eq('event_id', eventId)
    .eq('participant_id', user.id)
    .single();

  if (existingReg) {
    return {
      success: false,
      error: 'Already registered for this event',
      registration_id: existingReg.id,
      confirmation_code: existingReg.confirmation_code,
    };
  }

  // Check capacity
  if (event.max_participants && event.current_participants >= event.max_participants) {
    return { success: false, error: 'Event is at capacity' };
  }

  // Generate confirmation code
  const confirmationCode = generateConfirmationCode();

  // Create registration
  const { data: registration, error } = await supabase
    .from('ace_registrations')
    .insert([{
      event_id: eventId,
      participant_id: user.id,
      confirmation_code: confirmationCode,
      status: 'pending',
      fee_amount: event.fee || 0,
      fee_paid: event.fee === 0 || !event.fee,
    }])
    .select()
    .single();

  if (error) {
    return { success: false, error: `Registration failed: ${error.message}` };
  }

  // Increment participant count
  await supabase
    .from('ace_events')
    .update({ current_participants: (event.current_participants || 0) + 1 })
    .eq('id', eventId);

  // If free event, confirm immediately
  if (!event.fee || event.fee === 0) {
    await supabase
      .from('ace_registrations')
      .update({ status: 'confirmed' })
      .eq('id', registration.id);

    return {
      success: true,
      registration_id: registration.id,
      confirmation_code: confirmationCode,
    };
  }

  // For paid events, return checkout URL
  return {
    success: true,
    registration_id: registration.id,
    confirmation_code: confirmationCode,
    requires_payment: true,
  };
}

export async function getRegistration(registrationId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ace_registrations')
    .select(`
      *,
      event:ace_events (*),
      participant:ace_users (*)
    `)
    .eq('id', registrationId)
    .single();

  if (error) throw error;
  return data;
}

export async function getEventRegistrations(eventId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ace_registrations')
    .select(`
      *,
      participant:ace_users (*)
    `)
    .eq('event_id', eventId)
    .eq('status', 'confirmed')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

// ============================================================================
// QUIZ SERVICE
// ============================================================================

export async function getQuizForEvent(eventId: string): Promise<AceQuiz | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('ace_quizzes')
    .select('*')
    .eq('event_id', eventId)
    .eq('is_active', true)
    .single();

  return data as AceQuiz | null;
}

export async function getQuizQuestions(quizId: string): Promise<AceQuizQuestion[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ace_quiz_questions')
    .select('*')
    .eq('quiz_id', quizId)
    .eq('is_active', true)
    .order('order_index', { ascending: true });

  if (error) throw error;
  return data as AceQuizQuestion[];
}

export async function createQuiz(eventId: string, quizData: Partial<AceQuiz>): Promise<AceQuiz> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ace_quizzes')
    .insert([{
      event_id: eventId,
      title: quizData.title || 'Event Quiz',
      description: quizData.description,
      passing_score_percentage: quizData.passing_score_percentage || 80,
      max_attempts: quizData.max_attempts,
      time_limit_minutes: quizData.time_limit_minutes,
      shuffle_questions: quizData.shuffle_questions ?? true,
      show_correct_answers: quizData.show_correct_answers ?? true,
      is_required: quizData.is_required ?? true,
      is_active: true,
    }])
    .select()
    .single();

  if (error) throw error;
  return data as AceQuiz;
}

export async function addQuizQuestion(
  quizId: string,
  questionData: Partial<AceQuizQuestion>
): Promise<AceQuizQuestion> {
  const supabase = await createClient();

  // Get current max order index
  const { data: existing } = await supabase
    .from('ace_quiz_questions')
    .select('order_index')
    .eq('quiz_id', quizId)
    .order('order_index', { ascending: false })
    .limit(1);

  const nextOrder = (existing?.[0]?.order_index || 0) + 1;

  const { data, error } = await supabase
    .from('ace_quiz_questions')
    .insert([{
      quiz_id: quizId,
      question_text: questionData.question_text,
      question_type: questionData.question_type || 'multiple_choice',
      options: questionData.options || [],
      correct_answers: questionData.correct_answers || [],
      explanation: questionData.explanation,
      points: questionData.points || 1,
      order_index: nextOrder,
      is_active: true,
    }])
    .select()
    .single();

  if (error) throw error;
  return data as AceQuizQuestion;
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
  const supabase = await createClient();

  // Get quiz and questions
  const { data: quiz } = await supabase
    .from('ace_quizzes')
    .select('*')
    .eq('id', quizId)
    .single();

  if (!quiz) throw new Error('Quiz not found');

  const questions = await getQuizQuestions(quizId);

  // Score the quiz
  let correctCount = 0;
  const correctAnswers: Record<string, string[]> = {};
  const explanations: Record<string, string> = {};

  for (const question of questions) {
    const submitted = answers[question.id] || [];
    const correct = question.correct_answers;
    
    correctAnswers[question.id] = correct;
    if (question.explanation) {
      explanations[question.id] = question.explanation;
    }

    // Check if answers match (order independent)
    const isCorrect = 
      submitted.length === correct.length &&
      submitted.every(a => correct.includes(a));

    if (isCorrect) {
      correctCount++;
    }
  }

  const scorePercentage = Math.round((correctCount / questions.length) * 100);
  const passed = scorePercentage >= quiz.passing_score_percentage;

  // Get attempt number
  const { count } = await supabase
    .from('ace_quiz_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('quiz_id', quizId)
    .eq('participant_id', participantId);

  const attemptNumber = (count || 0) + 1;

  // Save submission
  await supabase
    .from('ace_quiz_submissions')
    .insert([{
      quiz_id: quizId,
      participant_id: participantId,
      event_id: quiz.event_id,
      attempt_number: attemptNumber,
      answers: answers,
      score: correctCount,
      total_questions: questions.length,
      score_percentage: scorePercentage,
      passed: passed,
      submitted_at: new Date().toISOString(),
    }]);

  // If passed, update registration
  if (passed) {
    await supabase
      .from('ace_registrations')
      .update({ quiz_completed: true })
      .eq('event_id', quiz.event_id)
      .eq('participant_id', participantId);
  }

  return {
    passed,
    score: correctCount,
    totalQuestions: questions.length,
    scorePercentage,
    passingScore: quiz.passing_score_percentage,
    correctAnswers,
    explanations,
  };
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
  const supabase = await createClient();
  const now = new Date().toISOString();

  // Get or create attendance record
  const { data: existing } = await supabase
    .from('ace_attendance_records')
    .select('*')
    .eq('event_id', eventId)
    .eq('participant_id', participantId)
    .single();

  if (existing) {
    // Update existing record
    const updates: Record<string, unknown> = {};
    if (data.checkOut) {
      updates.sign_out_timestamp = now;
    }
    if (data.verificationCode) {
      updates.verification_code_entered = data.verificationCode;
      updates.verification_code_timestamp = now;
    }

    await supabase
      .from('ace_attendance_records')
      .update(updates)
      .eq('id', existing.id);
  } else {
    // Create new record
    await supabase
      .from('ace_attendance_records')
      .insert([{
        event_id: eventId,
        participant_id: participantId,
        sign_in_timestamp: now,
        verified: true,
        verification_method: 'attendance_log',
      }]);
  }

  // Update registration
  await supabase
    .from('ace_registrations')
    .update({ attendance_verified: true })
    .eq('event_id', eventId)
    .eq('participant_id', participantId);
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
  const supabase = await createClient();

  await supabase
    .from('ace_feedback_responses')
    .insert([{
      event_id: eventId,
      participant_id: participantId,
      rating: feedbackData.rating,
      instructor_rating: feedbackData.instructorRating,
      content_rating: feedbackData.contentRating,
      comments: feedbackData.comments,
      suggestions: feedbackData.suggestions,
      would_recommend: feedbackData.wouldRecommend,
      submitted_at: new Date().toISOString(),
    }]);

  // Update registration
  await supabase
    .from('ace_registrations')
    .update({ feedback_completed: true })
    .eq('event_id', eventId)
    .eq('participant_id', participantId);
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
  const supabase = await createClient();
  const reasons: string[] = [];

  // Get registration
  const { data: registration } = await supabase
    .from('ace_registrations')
    .select('*')
    .eq('event_id', eventId)
    .eq('participant_id', participantId)
    .eq('status', 'confirmed')
    .single();

  const requirements = {
    registered: !!registration,
    attendanceVerified: registration?.attendance_verified || false,
    quizPassed: registration?.quiz_completed || false,
    feedbackSubmitted: registration?.feedback_completed || false,
  };

  if (!requirements.registered) {
    reasons.push('Not registered for this event');
  }

  if (!requirements.attendanceVerified) {
    reasons.push('Attendance not verified');
  }

  // Get event to check if quiz is required
  const { data: event } = await supabase
    .from('ace_events')
    .select('verification_method, modality')
    .eq('id', eventId)
    .single();

  if (event?.verification_method === 'quiz_completion' && !requirements.quizPassed) {
    reasons.push('Quiz not completed/passed');
  }

  // Async events always require quiz
  if (event?.modality === 'asynchronous' && !requirements.quizPassed) {
    reasons.push('Quiz required for asynchronous events');
  }

  const eligible = reasons.length === 0;

  return { eligible, reasons, requirements };
}

export async function issueCertificate(
  eventId: string,
  participantId: string
): Promise<AceCertificate> {
  const supabase = await createClient();

  // Check eligibility first
  const eligibility = await checkCertificateEligibility(eventId, participantId);
  if (!eligibility.eligible) {
    throw new Error(`Not eligible: ${eligibility.reasons.join(', ')}`);
  }

  // Check if certificate already exists
  const { data: existing } = await supabase
    .from('ace_certificates')
    .select('*')
    .eq('event_id', eventId)
    .eq('participant_id', participantId)
    .single();

  if (existing) {
    return existing as AceCertificate;
  }

  // Get event and participant details
  const { data: event } = await supabase
    .from('ace_events')
    .select(`
      *,
      provider:ace_providers (*)
    `)
    .eq('id', eventId)
    .single();

  const { data: participant } = await supabase
    .from('ace_users')
    .select('*')
    .eq('id', participantId)
    .single();

  if (!event || !participant) {
    throw new Error('Event or participant not found');
  }

  // Generate certificate number
  const certificateNumber = generateCertificateNumber();

  // Create certificate
  const { data: certificate, error } = await supabase
    .from('ace_certificates')
    .insert([{
      event_id: eventId,
      participant_id: participantId,
      certificate_number: certificateNumber,
      participant_name: `${participant.first_name} ${participant.last_name}`,
      participant_email: participant.email,
      participant_bacb_id: participant.bacb_id,
      event_title: event.title,
      event_date: event.start_date,
      instructor_name: 'Rob Spain, M.S., BCBA, IBA',
      total_ceus: event.total_ceus,
      ce_category: event.ce_category,
      provider_name: event.provider?.provider_name || 'Behavior School',
      provider_number: event.provider?.bacb_provider_number,
      status: 'issued' as AceCertificateStatus,
      issued_at: new Date().toISOString(),
    }])
    .select()
    .single();

  if (error) throw error;

  // Update registration
  await supabase
    .from('ace_registrations')
    .update({ certificate_issued: true })
    .eq('event_id', eventId)
    .eq('participant_id', participantId);

  return certificate as AceCertificate;
}

export async function getCertificateByNumber(certificateNumber: string): Promise<AceCertificate | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('ace_certificates')
    .select('*')
    .eq('certificate_number', certificateNumber)
    .single();

  return data as AceCertificate | null;
}

// ============================================================================
// PROVIDER SERVICE
// ============================================================================

export async function getProviderDashboard(providerId: string) {
  const supabase = await createClient();

  // Get provider details
  const { data: provider } = await supabase
    .from('ace_providers')
    .select('*')
    .eq('id', providerId)
    .single();

  if (!provider) throw new Error('Provider not found');

  // Get stats
  const { count: eventCount } = await supabase
    .from('ace_events')
    .select('*', { count: 'exact', head: true })
    .eq('provider_id', providerId);

  const { count: certCount } = await supabase
    .from('ace_certificates')
    .select('*', { count: 'exact', head: true })
    .eq('provider_id', providerId);

  const { data: registrations } = await supabase
    .from('ace_registrations')
    .select('event_id')
    .in('event_id', await getProviderEventIds(providerId));

  const { data: ceuData } = await supabase
    .from('ace_certificates')
    .select('total_ceus')
    .eq('provider_id', providerId);

  const totalCEUs = ceuData?.reduce((sum, c) => sum + (c.total_ceus || 0), 0) || 0;

  return {
    provider,
    stats: {
      totalEvents: eventCount || 0,
      activeEvents: await getActiveEventCount(providerId),
      totalRegistrations: registrations?.length || 0,
      totalCertificates: certCount || 0,
      totalCEUsIssued: totalCEUs,
    },
  };
}

async function getProviderEventIds(providerId: string): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('ace_events')
    .select('id')
    .eq('provider_id', providerId);
  return data?.map(e => e.id) || [];
}

async function getActiveEventCount(providerId: string): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from('ace_events')
    .select('*', { count: 'exact', head: true })
    .eq('provider_id', providerId)
    .in('status', ['approved', 'in_progress'])
    .gte('start_date', new Date().toISOString());
  return count || 0;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateConfirmationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function generateCertificateNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `CE-${year}-${random}`;
}
