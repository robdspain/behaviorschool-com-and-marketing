import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { getCertificateById } from '@/lib/ace/queries';
import { generateCertificateHTML } from '@/lib/ace/certificate-generator';

/**
 * GET /api/ace/certificates/[id]/html
 * Get certificate HTML for preview or download
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const certificateId = params.id;

    // Get certificate from database
    const certificate = await getCertificateById(certificateId);

    if (!certificate) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    // Generate HTML
    const html = generateCertificateHTML({
      certificateNumber: certificate.certificate_number,
      participantName: certificate.participant_name,
      participantEmail: certificate.participant_email,
      bacbNumber: certificate.participant_bacb_id,
      eventTitle: certificate.event_title,
      eventDate: certificate.event_date,
      instructorName: certificate.instructor_name,
      instructorCredentials: certificate.instructor_credentials,
      totalCeus: certificate.total_ceus,
      ceCategory: certificate.ce_category.charAt(0).toUpperCase() + certificate.ce_category.slice(1),
      providerName: certificate.provider_name,
      providerNumber: certificate.provider_number,
      issuedDate: certificate.issued_at,
    });

    // Return HTML
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
