import { NextRequest, NextResponse } from 'next/server';
import { getConvexClient, api } from '@/lib/convex';
import { issueCertificate, getCertificateByNumber } from '@/lib/ace/ace-service';
import type { Id } from '../../../../convex/_generated/dataModel';

export const dynamic = 'force-dynamic';

/**
 * GET /api/ace/certificates
 * Get certificates by participant or certificate number
 */
export async function GET(request: NextRequest) {
  try {
    const client = getConvexClient();
    const { searchParams } = new URL(request.url);
    const participantId = searchParams.get('participant_id');
    const certificateNumber = searchParams.get('number');
    const eventId = searchParams.get('event_id');

    // Get by certificate number
    if (certificateNumber) {
      const certificate = await getCertificateByNumber(certificateNumber);
      return NextResponse.json({ 
        success: true, 
        data: certificate ? [certificate] : [] 
      });
    }

    // Get by participant
    if (participantId) {
      const certificates = await client.query(api.aceCertificates.getByParticipant, {
        participantId: participantId as Id<"aceUsers">,
      });
      return NextResponse.json({ success: true, data: certificates });
    }

    // Get by event
    if (eventId) {
      const certificates = await client.query(api.aceCertificates.getByEvent, {
        eventId: eventId as Id<"aceEvents">,
      });
      return NextResponse.json({ success: true, data: certificates });
    }

    return NextResponse.json(
      { error: 'Please provide participant_id, number, or event_id parameter' },
      { status: 400 }
    );
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
    const body = await request.json();
    const { event_id, participant_id } = body;

    if (!event_id || !participant_id) {
      return NextResponse.json(
        { error: 'Missing required fields: event_id, participant_id' },
        { status: 400 }
      );
    }

    // Generate the certificate using the Convex-powered service
    const certificate = await issueCertificate(event_id, participant_id);

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
