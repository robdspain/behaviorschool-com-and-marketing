// ============================================================================
// ACE Platform - Database Queries
// ============================================================================

import { createClient } from '@/lib/supabase-server';
import type {
  AceProvider,
  AceEvent,
  AceEventType,
  AceEventCategory,
  AceEventModality,
  AceEventStatus,
  AceCertificate,
  AceAttendanceRecord,
  AceComplianceDashboard,
} from './types';

// ============================================================================
// AUTH & USER QUERIES
// ============================================================================

/**
 * Get the provider ID for the currently authenticated user
 * This looks up the ace_users record and finds their associated provider
 */
export async function getCurrentUserProviderId(): Promise<string | null> {
  const supabase = await createClient();

  // Get the authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return null;
  }

  // Find the ace_user record for this Supabase user
  const { data: aceUser, error: userError } = await supabase
    .from('ace_users')
    .select('id')
    .eq('supabase_user_id', user.id)
    .single();

  if (userError || !aceUser) {
    return null;
  }

  // Find the provider where this user is the coordinator
  const { data: provider, error: providerError } = await supabase
    .from('ace_providers')
    .select('id')
    .eq('coordinator_id', aceUser.id)
    .eq('is_active', true)
    .single();

  if (providerError || !provider) {
    return null;
  }

  return provider.id;
}

// ============================================================================
// PROVIDER QUERIES
// ============================================================================

export async function getProviders() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('ace_providers')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as AceProvider[];
}

export async function getProviderById(id: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('ace_providers')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as AceProvider;
}

export async function createProvider(provider: Partial<AceProvider>) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('ace_providers')
    .insert([provider])
    .select()
    .single();
  
  if (error) throw error;
  return data as AceProvider;
}

export async function updateProvider(id: string, updates: Partial<AceProvider>) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('ace_providers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as AceProvider;
}

// ============================================================================
// EVENT QUERIES
// ============================================================================

export async function getEvents(providerId?: string) {
  const supabase = await createClient();
  
  let query = supabase
    .from('ace_events')
    .select('*')
    .order('start_date', { ascending: false });
  
  if (providerId) {
    query = query.eq('provider_id', providerId);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data as AceEvent[];
}

export async function getEventById(id: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('ace_events')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as AceEvent;
}

export async function createEvent(event: Partial<AceEvent>) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('ace_events')
    .insert([event])
    .select()
    .single();
  
  if (error) throw error;
  return data as AceEvent;
}

export async function updateEvent(id: string, updates: Partial<AceEvent>) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('ace_events')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as AceEvent;
}

export async function deleteEvent(id: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('ace_events')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// ============================================================================
// ATTENDANCE QUERIES
// ============================================================================

export async function getAttendanceForEvent(eventId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('ace_attendance_records')
    .select(`
      *,
      participant:participant_id (
        id,
        first_name,
        last_name,
        email,
        bacb_id
      )
    `)
    .eq('event_id', eventId);
  
  if (error) throw error;
  return data as AceAttendanceRecord[];
}

export async function markAttendance(
  eventId: string,
  participantId: string,
  attended: boolean
) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('ace_attendance_records')
    .upsert({
      event_id: eventId,
      participant_id: participantId,
      verified: attended,
      verified_at: attended ? new Date().toISOString() : null,
      sign_in_timestamp: attended ? new Date().toISOString() : null,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data as AceAttendanceRecord;
}

// ============================================================================
// CERTIFICATE QUERIES
// ============================================================================

export async function getCertificates(providerId?: string) {
  const supabase = await createClient();
  
  let query = supabase
    .from('ace_certificates')
    .select('*')
    .order('issued_at', { ascending: false });
  
  if (providerId) {
    query = query.eq('provider_id', providerId);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data as AceCertificate[];
}

/**
 * Check if a participant is eligible for a certificate
 * Returns eligibility status and reasons
 */
export async function checkCertificateEligibility(
  eventId: string,
  participantId: string
): Promise<{
  eligible: boolean;
  reasons: string[];
  requirements: {
    registered: boolean;
    quizPassed: boolean;
    attendanceVerified: boolean;
    feedbackSubmitted: boolean;
  };
}> {
  const supabase = await createClient();

  const reasons: string[] = [];
  const requirements = {
    registered: false,
    quizPassed: false,
    attendanceVerified: false,
    feedbackSubmitted: false,
  };

  // Get event details
  const event = await getEventById(eventId);

  // Check registration
  const { data: registration } = await supabase
    .from('ace_registrations')
    .select('*')
    .eq('event_id', eventId)
    .eq('participant_id', participantId)
    .eq('status', 'confirmed')
    .single();

  if (!registration) {
    reasons.push('Not registered for this event');
  } else {
    requirements.registered = true;
  }

  // Check if quiz is required and if passed
  if (event.verification_method === 'quiz_completion') {
    const { data: quizSubmissions } = await supabase
      .from('ace_quiz_submissions')
      .select('*')
      .eq('event_id', eventId)
      .eq('participant_id', participantId)
      .order('submitted_at', { ascending: false })
      .limit(1);

    const latestSubmission = quizSubmissions?.[0];
    if (!latestSubmission) {
      reasons.push('Quiz not completed');
    } else if (!latestSubmission.passed) {
      reasons.push(`Quiz not passed (score: ${latestSubmission.score_percentage}%, required: ${event.passing_score_percentage}%)`);
    } else {
      requirements.quizPassed = true;
    }
  } else {
    requirements.quizPassed = true; // Not required
  }

  // Check attendance verification
  if (event.verification_method === 'attendance_log') {
    const { data: attendance } = await supabase
      .from('ace_attendance_records')
      .select('*')
      .eq('event_id', eventId)
      .eq('participant_id', participantId)
      .eq('verified', true)
      .single();

    if (!attendance) {
      reasons.push('Attendance not verified');
    } else {
      requirements.attendanceVerified = true;
    }
  } else {
    requirements.attendanceVerified = true; // Not required
  }

  // Check feedback submission (if required)
  const { data: feedback } = await supabase
    .from('ace_feedback_responses')
    .select('*')
    .eq('event_id', eventId)
    .eq('participant_id', participantId)
    .single();

  if (feedback) {
    requirements.feedbackSubmitted = true;
  }

  const eligible = requirements.registered && requirements.quizPassed && requirements.attendanceVerified;

  return {
    eligible,
    reasons,
    requirements,
  };
}

/**
 * Generate and issue a certificate for a participant
 * Checks eligibility first
 */
export async function generateCertificate(
  eventId: string,
  participantId: string
): Promise<AceCertificate> {
  const supabase = await createClient();

  // Check if certificate already exists
  const { data: existingCert } = await supabase
    .from('ace_certificates')
    .select('*')
    .eq('event_id', eventId)
    .eq('participant_id', participantId)
    .single();

  if (existingCert) {
    throw new Error('Certificate already issued for this participant');
  }

  // Check eligibility
  const eligibility = await checkCertificateEligibility(eventId, participantId);

  if (!eligibility.eligible) {
    throw new Error(`Participant not eligible for certificate: ${eligibility.reasons.join(', ')}`);
  }

  // Get event details
  const event = await getEventById(eventId);

  // Get provider details
  const { data: provider } = await supabase
    .from('ace_providers')
    .select('*')
    .eq('id', event.provider_id)
    .single();

  if (!provider) throw new Error('Provider not found');

  // Get participant details
  const { data: participant } = await supabase
    .from('ace_users')
    .select('*')
    .eq('id', participantId)
    .single();

  if (!participant) throw new Error('Participant not found');

  // Generate unique certificate number
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  const certificateNumber = `CE-${year}-${random}`;

  // Generate certificate
  const { data, error } = await supabase
    .from('ace_certificates')
    .insert([{
      event_id: eventId,
      participant_id: participantId,
      provider_id: event.provider_id,
      certificate_number: certificateNumber,
      participant_name: `${participant.first_name} ${participant.last_name}`,
      participant_email: participant.email,
      participant_bacb_id: participant.bacb_id,
      event_title: event.title,
      event_date: event.start_date,
      instructor_name: 'Rob Spain, M.S., BCBA, IBA',
      instructor_credentials: 'Board Certified Behavior Analyst',
      total_ceus: event.total_ceus,
      ce_category: event.ce_category,
      provider_name: provider.provider_name,
      provider_number: provider.bacb_provider_number,
      status: 'issued',
      issued_at: new Date().toISOString(),
    }])
    .select()
    .single();

  if (error) throw error;
  return data as AceCertificate;
}

/**
 * Get certificate by ID
 */
export async function getCertificateById(id: string): Promise<AceCertificate> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ace_certificates')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as AceCertificate;
}

/**
 * Get certificates for a specific participant
 */
export async function getParticipantCertificates(participantId: string): Promise<AceCertificate[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ace_certificates')
    .select('*')
    .eq('participant_id', participantId)
    .eq('status', 'issued')
    .order('issued_at', { ascending: false });

  if (error) throw error;
  return data as AceCertificate[];
}

// ============================================================================
// COMPLIANCE QUERIES
// ============================================================================

export async function getComplianceDashboard(providerId?: string) {
  const supabase = await createClient();
  
  let query = supabase
    .from('ace_compliance_dashboard')
    .select('*');
  
  if (providerId) {
    query = query.eq('provider_id', providerId);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data as AceComplianceDashboard[];
}

// ============================================================================
// STATISTICS QUERIES
// ============================================================================

export async function getProviderStats(providerId: string) {
  const supabase = await createClient();
  
  // Get event count
  const { count: eventCount } = await supabase
    .from('ace_events')
    .select('*', { count: 'exact', head: true })
    .eq('provider_id', providerId);
  
  // Get certificate count
  const { count: certCount } = await supabase
    .from('ace_certificates')
    .select('*', { count: 'exact', head: true })
    .eq('provider_id', providerId);
  
  // Get total CEUs issued
  const { data: ceuData } = await supabase
    .from('ace_certificates')
    .select('total_ceus')
    .eq('provider_id', providerId);
  
  const totalCEUs = ceuData?.reduce((sum, cert) => sum + (cert.total_ceus || 0), 0) || 0;
  
  return {
    eventCount: eventCount || 0,
    certificateCount: certCount || 0,
    totalCEUsIssued: totalCEUs,
  };
}
