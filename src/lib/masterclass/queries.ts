/**
 * Supabase Query Helpers for Masterclass System
 *
 * These functions provide a clean interface for database operations
 */

import { createClient } from '@supabase/supabase-js';
import type {
  MasterclassEnrollment,
  MasterclassProgress,
  MasterclassQuizResponse,
  MasterclassCertificate,
  MasterclassAnalyticsEvent,
  EnrollmentFormData,
  QuizSubmission,
  AnalyticsEvent,
} from './types';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================================================
// ENROLLMENT OPERATIONS
// ============================================================================

/**
 * Create a new masterclass enrollment
 */
export async function createEnrollment(
  data: EnrollmentFormData
): Promise<MasterclassEnrollment> {
  const { data: enrollment, error } = await supabase
    .from('masterclass_enrollments')
    .insert({
      email: data.email.toLowerCase().trim(),
      name: data.name.trim(),
      bacb_cert_number: data.bacbCertNumber.trim(),
    })
    .select()
    .single();

  if (error) {
    // Check if user already exists
    if (error.code === '23505') { // Unique constraint violation
      throw new Error('An enrollment with this email already exists. Please use the same email to continue.');
    }
    throw new Error(`Failed to create enrollment: ${error.message}`);
  }

  return enrollment;
}

/**
 * Get enrollment by email
 */
export async function getEnrollmentByEmail(
  email: string
): Promise<MasterclassEnrollment | null> {
  const { data, error } = await supabase
    .from('masterclass_enrollments')
    .select('*')
    .eq('email', email.toLowerCase().trim())
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // Not found
      return null;
    }
    throw new Error(`Failed to fetch enrollment: ${error.message}`);
  }

  return data;
}

/**
 * Get enrollment by ID
 */
export async function getEnrollmentById(
  enrollmentId: string
): Promise<MasterclassEnrollment | null> {
  const { data, error } = await supabase
    .from('masterclass_enrollments')
    .select('*')
    .eq('id', enrollmentId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch enrollment: ${error.message}`);
  }

  return data;
}

/**
 * Update last accessed timestamp
 */
export async function updateLastAccessed(enrollmentId: string): Promise<void> {
  const { error } = await supabase
    .from('masterclass_enrollments')
    .update({ last_accessed_at: new Date().toISOString() })
    .eq('id', enrollmentId);

  if (error) {
    console.error('Failed to update last accessed:', error);
  }
}

/**
 * Mark enrollment as completed
 */
export async function markEnrollmentComplete(enrollmentId: string): Promise<void> {
  const { error } = await supabase
    .from('masterclass_enrollments')
    .update({ completed_at: new Date().toISOString() })
    .eq('id', enrollmentId);

  if (error) {
    throw new Error(`Failed to mark enrollment complete: ${error.message}`);
  }
}

/**
 * Mark certificate email status for an enrollment
 */
export async function markCertificateEmailed(
  enrollmentId: string
): Promise<void> {
  const { error } = await supabase
    .from('masterclass_enrollments')
    .update({
      certificate_emailed: true,
      certificate_emailed_at: new Date().toISOString(),
    })
    .eq('id', enrollmentId);

  if (error) {
    throw new Error(`Failed to update certificate email status: ${error.message}`);
  }
}

// ============================================================================
// PROGRESS OPERATIONS
// ============================================================================

/**
 * Get all progress for an enrollment
 */
export async function getEnrollmentProgress(
  enrollmentId: string
): Promise<MasterclassProgress[]> {
  const { data, error } = await supabase
    .from('masterclass_progress')
    .select('*')
    .eq('enrollment_id', enrollmentId)
    .order('section_number', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch progress: ${error.message}`);
  }

  return data || [];
}

/**
 * Get progress for a specific section
 */
export async function getSectionProgress(
  enrollmentId: string,
  sectionNumber: number
): Promise<MasterclassProgress | null> {
  const { data, error } = await supabase
    .from('masterclass_progress')
    .select('*')
    .eq('enrollment_id', enrollmentId)
    .eq('section_number', sectionNumber)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch section progress: ${error.message}`);
  }

  return data;
}

/**
 * Update video progress
 */
export async function updateVideoProgress(
  enrollmentId: string,
  sectionNumber: number,
  watchedPercentage: number,
  watchTimeSeconds: number
): Promise<void> {
  const { error } = await supabase
    .from('masterclass_progress')
    .upsert({
      enrollment_id: enrollmentId,
      section_number: sectionNumber,
      video_watched_percentage: watchedPercentage,
      video_watch_time_seconds: watchTimeSeconds,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'enrollment_id,section_number'
    });

  if (error) {
    throw new Error(`Failed to update video progress: ${error.message}`);
  }
}

/**
 * Mark video as completed
 */
export async function markVideoComplete(
  enrollmentId: string,
  sectionNumber: number
): Promise<void> {
  const { error } = await supabase
    .from('masterclass_progress')
    .upsert({
      enrollment_id: enrollmentId,
      section_number: sectionNumber,
      video_completed: true,
      video_completed_at: new Date().toISOString(),
      video_watched_percentage: 100,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'enrollment_id,section_number'
    });

  if (error) {
    throw new Error(`Failed to mark video complete: ${error.message}`);
  }
}

/**
 * Save quiz results
 */
export async function saveQuizResults(
  enrollmentId: string,
  sectionNumber: number,
  score: number,
  total: number,
  passed: boolean,
  attemptNumber: number
): Promise<void> {
  const { error } = await supabase
    .from('masterclass_progress')
    .upsert({
      enrollment_id: enrollmentId,
      section_number: sectionNumber,
      quiz_attempts: attemptNumber,
      quiz_score: score,
      quiz_total: total,
      quiz_passed: passed,
      quiz_completed_at: passed ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'enrollment_id,section_number'
    });

  if (error) {
    throw new Error(`Failed to save quiz results: ${error.message}`);
  }
}

// ============================================================================
// QUIZ RESPONSE OPERATIONS
// ============================================================================

/**
 * Save individual quiz responses
 */
export async function saveQuizResponses(
  enrollmentId: string,
  sectionNumber: number,
  attemptNumber: number,
  responses: {
    questionId: string;
    questionNumber: number;
    selectedAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
    timeSpent?: number;
  }[]
): Promise<void> {
  const records = responses.map(r => ({
    enrollment_id: enrollmentId,
    section_number: sectionNumber,
    attempt_number: attemptNumber,
    question_number: r.questionNumber,
    question_id: r.questionId,
    selected_answer: r.selectedAnswer,
    correct_answer: r.correctAnswer,
    is_correct: r.isCorrect,
    time_spent_seconds: r.timeSpent || null,
  }));

  const { error } = await supabase
    .from('masterclass_quiz_responses')
    .insert(records);

  if (error) {
    console.error('Failed to save quiz responses:', error);
    // Don't throw - this is for analytics only
  }
}

/**
 * Get quiz responses for a section
 */
export async function getQuizResponses(
  enrollmentId: string,
  sectionNumber: number
): Promise<MasterclassQuizResponse[]> {
  const { data, error } = await supabase
    .from('masterclass_quiz_responses')
    .select('*')
    .eq('enrollment_id', enrollmentId)
    .eq('section_number', sectionNumber)
    .order('attempt_number', { ascending: true })
    .order('question_number', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch quiz responses: ${error.message}`);
  }

  return data || [];
}

// ============================================================================
// CERTIFICATE OPERATIONS
// ============================================================================

/**
 * Generate certificate record
 */
export async function generateCertificate(
  enrollmentId: string,
  certificateId: string,
  certificateData: {
    recipientName: string;
    recipientEmail: string;
    bacbCertNumber: string;
    courseTitle: string;
    ceuCredits: number;
    completionDate: string;
  }
): Promise<MasterclassCertificate> {
  const { data, error } = await supabase
    .from('masterclass_certificates')
    .insert({
      certificate_id: certificateId,
      enrollment_id: enrollmentId,
      recipient_name: certificateData.recipientName,
      recipient_email: certificateData.recipientEmail,
      bacb_cert_number: certificateData.bacbCertNumber,
      course_title: certificateData.courseTitle,
      ceu_credits: certificateData.ceuCredits,
      completion_date: certificateData.completionDate,
      pdf_generated: false,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to generate certificate: ${error.message}`);
  }

  // Update enrollment
  await supabase
    .from('masterclass_enrollments')
    .update({
      certificate_issued: true,
      certificate_id: certificateId,
      certificate_generated_at: new Date().toISOString(),
    })
    .eq('id', enrollmentId);

  return data;
}

/**
 * Get certificate by certificate ID
 */
export async function getCertificateById(
  certificateId: string
): Promise<MasterclassCertificate | null> {
  const { data, error } = await supabase
    .from('masterclass_certificates')
    .select('*')
    .eq('certificate_id', certificateId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch certificate: ${error.message}`);
  }

  return data;
}

/**
 * Get certificate by enrollment ID
 */
export async function getCertificateByEnrollment(
  enrollmentId: string
): Promise<MasterclassCertificate | null> {
  const { data, error } = await supabase
    .from('masterclass_certificates')
    .select('*')
    .eq('enrollment_id', enrollmentId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch certificate: ${error.message}`);
  }

  return data;
}

/**
 * Update certificate PDF URL
 */
export async function updateCertificatePDF(
  certificateId: string,
  pdfUrl: string
): Promise<void> {
  const { error } = await supabase
    .from('masterclass_certificates')
    .update({
      pdf_url: pdfUrl,
      pdf_generated: true,
    })
    .eq('certificate_id', certificateId);

  if (error) {
    throw new Error(`Failed to update certificate PDF: ${error.message}`);
  }
}

/**
 * Record certificate verification
 */
export async function recordCertificateVerification(
  certificateId: string
): Promise<void> {
  const { error } = await supabase.rpc('increment_certificate_verification', {
    cert_id: certificateId
  });

  if (error) {
    // Fallback to manual increment if function doesn't exist
    const { data: cert } = await supabase
      .from('masterclass_certificates')
      .select('verification_count')
      .eq('certificate_id', certificateId)
      .single();

    if (cert) {
      await supabase
        .from('masterclass_certificates')
        .update({
          verification_count: (cert.verification_count || 0) + 1,
          last_verified_at: new Date().toISOString(),
        })
        .eq('certificate_id', certificateId);
    }
  }
}

// ============================================================================
// ANALYTICS OPERATIONS
// ============================================================================

/**
 * Track analytics event
 */
export async function trackEvent(event: AnalyticsEvent): Promise<void> {
  const { error } = await supabase
    .from('masterclass_analytics_events')
    .insert({
      enrollment_id: event.enrollmentId || null,
      event_type: event.eventType,
      event_data: event.eventData || null,
      section_number: event.sectionNumber || null,
      session_id: event.sessionId || null,
    });

  if (error) {
    console.error('Failed to track event:', error);
    // Don't throw - analytics failures shouldn't break user experience
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if enrollment can generate certificate
 * (all 4 sections complete with passed quizzes)
 */
export async function canGenerateCertificate(
  enrollmentId: string
): Promise<boolean> {
  const { data, error } = await supabase.rpc('is_masterclass_complete', {
    enrollment_uuid: enrollmentId
  });

  if (error) {
    // Fallback to manual check
    const progress = await getEnrollmentProgress(enrollmentId);
    const completedSections = progress.filter(
      p => p.video_completed && p.quiz_passed
    );
    return completedSections.length === 4;
  }

  return data as boolean;
}

/**
 * Calculate overall progress percentage
 */
export async function calculateProgress(
  enrollmentId: string
): Promise<number> {
  const { data, error } = await supabase.rpc('calculate_masterclass_progress', {
    enrollment_uuid: enrollmentId
  });

  if (error) {
    // Fallback to manual calculation
    const progress = await getEnrollmentProgress(enrollmentId);
    const totalSteps = 8; // 4 sections × 2 steps (video + quiz)
    const completedSteps = progress.reduce((acc, p) => {
      return acc +
        (p.video_completed ? 1 : 0) +
        (p.quiz_passed ? 1 : 0);
    }, 0);
    return Math.round((completedSteps / totalSteps) * 100);
  }

  return data as number;
}

/**
 * Get next quiz attempt number
 */
export async function getNextAttemptNumber(
  enrollmentId: string,
  sectionNumber: number
): Promise<number> {
  const progress = await getSectionProgress(enrollmentId, sectionNumber);
  return (progress?.quiz_attempts || 0) + 1;
}
