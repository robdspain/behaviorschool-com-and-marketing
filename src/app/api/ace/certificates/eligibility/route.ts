import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

/**
 * GET /api/ace/certificates/eligibility?event_id=xxx&participant_id=xxx
 * Check if a participant is eligible for a certificate
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('event_id');
    const participantId = searchParams.get('participant_id');

    if (!eventId || !participantId) {
      return NextResponse.json(
        { error: 'Missing required parameters: event_id, participant_id' },
        { status: 400 }
      );
    }

    const reasons: string[] = [];

    // Get registration
    const { data: registration } = await supabase
      .from('ace_registrations')
      .select('*')
      .eq('event_id', eventId)
      .eq('participant_id', participantId)
      .single();

    const requirements = {
      registered: !!registration && registration.status === 'confirmed',
      attendanceVerified: registration?.attendance_verified || false,
      quizPassed: registration?.quiz_completed || false,
      feedbackSubmitted: registration?.feedback_completed || false,
    };

    if (!requirements.registered) {
      reasons.push('Not registered for this event or registration not confirmed');
    }

    // Get event to check verification requirements
    const { data: event } = await supabase
      .from('ace_events')
      .select('verification_method, modality')
      .eq('id', eventId)
      .single();

    // For live events, check attendance
    if (event?.modality !== 'asynchronous' && !requirements.attendanceVerified) {
      reasons.push('Attendance not verified');
    }

    // For async events or quiz-verified events, check quiz
    if ((event?.verification_method === 'quiz_completion' || event?.modality === 'asynchronous') && !requirements.quizPassed) {
      reasons.push('Quiz not completed or not passed');
    }

    // Check if certificate already exists
    const { data: existingCert } = await supabase
      .from('ace_certificates')
      .select('id, certificate_number')
      .eq('event_id', eventId)
      .eq('participant_id', participantId)
      .single();

    if (existingCert) {
      return NextResponse.json({
        eligible: true,
        already_issued: true,
        certificate_number: existingCert.certificate_number,
        requirements,
        reasons: [],
      }, { status: 200 });
    }

    const eligible = reasons.length === 0;

    return NextResponse.json({
      eligible,
      already_issued: false,
      requirements,
      reasons,
    }, { status: 200 });
  } catch (error) {
    console.error('Error checking certificate eligibility:', error);
    return NextResponse.json(
      { error: 'Failed to check certificate eligibility' },
      { status: 500 }
    );
  }
}
