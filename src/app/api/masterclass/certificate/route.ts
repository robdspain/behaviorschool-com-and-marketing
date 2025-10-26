import { NextRequest, NextResponse } from 'next/server';
import { issueCertificateForEnrollment } from '@/lib/masterclass/certificate-service';

export async function GET(request: NextRequest) {
  const enrollmentId = request.nextUrl.searchParams.get('enrollmentId');

  if (!enrollmentId) {
    return NextResponse.json(
      { success: false, error: 'enrollmentId is required' },
      { status: 400 }
    );
  }

  try {
    const { certificate, downloadPath, emailSent } = await issueCertificateForEnrollment(enrollmentId);

    return NextResponse.json({
      success: true,
      data: {
        certificateId: certificate.certificate_id,
        recipientName: certificate.recipient_name,
        courseTitle: certificate.course_title,
        completionDate: certificate.completion_date,
        ceuCredits: certificate.ceu_credits,
        downloadPath,
        emailSent,
      },
    });
  } catch (error) {
    console.error('Certificate GET error:', error);
    const message = error instanceof Error ? error.message : 'Failed to prepare certificate';
    const status = message.includes('not completed') ? 400 : 500;

    return NextResponse.json(
      { success: false, error: message },
      { status }
    );
  }
}
