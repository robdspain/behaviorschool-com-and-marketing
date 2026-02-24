export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { getCertificatePdfById } from '@/lib/masterclass/certificate-service';

export async function GET(request: NextRequest) {
  try {
    const certificateId = request.nextUrl.searchParams.get('certificateId');
    if (!certificateId) {
      return NextResponse.json(
        { success: false, error: 'Certificate ID is required' },
        { status: 400 }
      );
    }

    const result = await getCertificatePdfById(certificateId);
    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Certificate not found' },
        { status: 404 }
      );
    }

    const { certificate, pdfBytes } = result;

    const newPdfBytes = new Uint8Array(pdfBytes);
    const pdfBlob = new Blob([newPdfBytes.buffer], { type: 'application/pdf' });

    return new NextResponse(pdfBlob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="BehaviorSchool-${certificate.certificate_id}.pdf"`,
        'Cache-Control': 'private, max-age=0, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Certificate download error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate certificate PDF' },
      { status: 500 }
    );
  }
}