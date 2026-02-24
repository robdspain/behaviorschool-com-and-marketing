import { NextRequest, NextResponse } from 'next/server';
import { getConvexClient, api } from '@/lib/convex';
import { checkCertificateEligibility } from '@/lib/ace/ace-service';
import type { Id } from '@/lib/convex';

export const dynamic = 'force-dynamic';

/**
 * GET /api/ace/certificates/eligibility?event_id=xxx&participant_id=xxx
 * Check if a participant is eligible for a certificate
 */
export async function GET(request: NextRequest) {
  try {
    const client = getConvexClient();

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('event_id');
    const participantId = searchParams.get('participant_id');

    if (!eventId || !participantId) {
      return NextResponse.json(
        { error: 'Missing required parameters: event_id, participant_id' },
        { status: 400 }
      );
    }

    // Check if certificate already exists
    const certificates = await client.query(api.aceCertificates.getByEvent, {
      eventId: eventId as Id<"aceEvents">,
    });

    const existingCert = certificates.find(
      (cert: any) => cert.participantId === participantId
    );

    if (existingCert) {
      // Get eligibility requirements for display
      const eligibility = await checkCertificateEligibility(eventId, participantId);

      return NextResponse.json({
        eligible: true,
        already_issued: true,
        certificate_number: existingCert.certificateNumber,
        requirements: eligibility.requirements,
        reasons: [],
      });
    }

    // Check eligibility using the Convex-powered service
    const eligibility = await checkCertificateEligibility(eventId, participantId);

    return NextResponse.json({
      eligible: eligibility.eligible,
      already_issued: false,
      requirements: eligibility.requirements,
      reasons: eligibility.reasons,
    });
  } catch (error) {
    console.error('Error checking certificate eligibility:', error);
    return NextResponse.json(
      { error: 'Failed to check certificate eligibility' },
      { status: 500 }
    );
  }
}
