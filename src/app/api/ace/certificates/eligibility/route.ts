import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { checkCertificateEligibility } from '@/lib/ace/queries';

/**
 * GET /api/ace/certificates/eligibility?event_id=xxx&participant_id=xxx
 * Check if a participant is eligible for a certificate
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('event_id');
    const participantId = searchParams.get('participant_id');

    if (!eventId || !participantId) {
      return NextResponse.json(
        { error: 'Missing required parameters: event_id, participant_id' },
        { status: 400 }
      );
    }

    const eligibility = await checkCertificateEligibility(eventId, participantId);

    return NextResponse.json({ success: true, data: eligibility }, { status: 200 });
  } catch (error) {
    console.error('Error checking certificate eligibility:', error);
    return NextResponse.json(
      { error: 'Failed to check certificate eligibility' },
      { status: 500 }
    );
  }
}
