import { NextRequest, NextResponse } from 'next/server';
import { getConvexClient, api } from '@/lib/convex';
import { generateCertificateHTML } from '@/lib/ace/certificate-generator';
import type { Id } from '../../../../../../convex/_generated/dataModel';

export const dynamic = 'force-dynamic';

/**
 * GET /api/ace/certificates/[id]/html
 * Get certificate HTML for preview or download
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = getConvexClient();

    const certificate = await client.query(api.aceCertificates.getById, {
      id: id as Id<'aceCertificates'>,
    });

    if (!certificate) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    // Generate HTML
    const html = generateCertificateHTML({
      certificateNumber: certificate.certificateNumber,
      participantName: certificate.participantName,
      participantEmail: certificate.participantEmail,
      bacbNumber: certificate.participantBacbId,
      eventTitle: certificate.eventTitle,
      eventDate: certificate.eventDate,
      instructorName: certificate.instructorName || 'Rob Spain, M.S., BCBA, IBA',
      instructorCredentials: '',
      totalCeus: certificate.totalCeus,
      ceCategory: certificate.ceCategory.charAt(0).toUpperCase() + certificate.ceCategory.slice(1),
      providerName: certificate.providerName || 'Unknown Provider',
      providerNumber: certificate.providerNumber || '',
      issuedDate: certificate.issuedAt
        ? new Date(certificate.issuedAt).toISOString()
        : new Date().toISOString(),
    });

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Error generating certificate HTML:', error);
    return NextResponse.json(
      { error: 'Failed to generate certificate HTML' },
      { status: 500 }
    );
  }
}
