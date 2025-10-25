import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import {
  generateCertificate,
  getCertificates,
  getParticipantCertificates
} from '@/lib/ace/queries';

/**
 * GET /api/ace/certificates
 * Get all certificates (admin) or participant's own certificates
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
    const participantId = searchParams.get('participant_id');

    // If participant_id provided, get their certificates
    if (participantId) {
      const certificates = await getParticipantCertificates(participantId);
      return NextResponse.json({ success: true, data: certificates }, { status: 200 });
    }

    // Otherwise get all certificates (admin view)
    const certificates = await getCertificates();
    return NextResponse.json({ success: true, data: certificates }, { status: 200 });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch certificates' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ace/certificates
 * Generate a new certificate for a participant
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { event_id, participant_id } = body;

    if (!event_id || !participant_id) {
      return NextResponse.json(
        { error: 'Missing required fields: event_id, participant_id' },
        { status: 400 }
      );
    }

    // Generate the certificate
    const certificate = await generateCertificate(event_id, participant_id);

    return NextResponse.json({ success: true, data: certificate }, { status: 201 });
  } catch (error) {
    console.error('Error generating certificate:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate certificate';
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}
