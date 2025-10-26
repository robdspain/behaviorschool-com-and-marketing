import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { getCertificateById } from '@/lib/ace/queries';
import { generateCertificateHTML, formatEventModality } from '@/lib/ace/certificate-generator';
import type { AceEvent } from '@/lib/ace/types';

/**
 * GET /api/ace/certificates/[id]/html
 * Get certificate HTML for preview or download
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const certificateId = id;

    // Get certificate from database
    const certificate = await getCertificateById(certificateId);

    if (!certificate) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    const { data: eventDetails } = await supabase
      .from('ace_events')
      .select('modality')
      .eq('id', certificate.event_id)
      .maybeSingle();

    const providerName = certificate.provider_name || 'Behavior School';
    const providerNumber = certificate.provider_number || 'OP-25-11420';
    const aceCoordinator = 'Rob Spain, M.S., BCBA, IBA';
    const eventModality = formatEventModality(eventDetails?.modality as AceEvent['modality']);

    // Generate HTML
    const html = generateCertificateHTML({
      certificateNumber: certificate.certificate_number,
      participantName: certificate.participant_name,
      participantEmail: certificate.participant_email,
      bacbNumber: certificate.participant_bacb_id,
      eventTitle: certificate.event_title,
      eventDate: certificate.event_date,
      instructorName: certificate.instructor_name,
      instructorCredentials: '', // Not stored in database
      totalCeus: certificate.total_ceus,
      ceCategory: certificate.ce_category.charAt(0).toUpperCase() + certificate.ce_category.slice(1),
      providerName,
      providerNumber,
      eventModality,
      aceCoordinator,
      issuedDate: certificate.issued_at || new Date().toISOString(),
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
