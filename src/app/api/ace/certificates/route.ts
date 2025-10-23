import { NextRequest, NextResponse } from 'next/server';
import { getUserCertificates, getCertificateByNumber } from '@/lib/ace/queries';

/**
 * GET /api/ace/certificates
 * Get certificates by user_id or certificate_number
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('user_id');
    const certificateNumber = searchParams.get('certificate_number');

    if (certificateNumber) {
      // Verify certificate by number (public endpoint)
      const certificate = await getCertificateByNumber(certificateNumber);

      if (!certificate) {
        return NextResponse.json(
          { success: false, error: 'Certificate not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: certificate,
      });
    }

    if (userId) {
      // Get user&apos;s certificates
      const certificates = await getUserCertificates(userId);

      return NextResponse.json({
        success: true,
        data: certificates,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Either user_id or certificate_number is required' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Certificates GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch certificates' },
      { status: 500 }
    );
  }
}
