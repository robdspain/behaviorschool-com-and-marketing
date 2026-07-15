export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth-server';
import {
  createEnrollment,
  getEnrollmentByEmail,
  initializeEnrollmentProgress,
  trackEvent,
} from '@/lib/masterclass/queries';

/**
 * POST /api/masterclass/enroll
 *
 * Creates a new masterclass enrollment for authenticated user
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in first.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, bacbCertNumber } = body;

    // Validation
    if (!name || !name.trim() || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Full name is required' },
        { status: 400 }
      );
    }

    if (!bacbCertNumber || !bacbCertNumber.trim() || bacbCertNumber.trim().length < 3) {
      return NextResponse.json(
        { error: 'Valid BACB certification number is required' },
        { status: 400 }
      );
    }

    // Check if user already enrolled (by email — stable across auth providers)
    const existingEnrollment = await getEnrollmentByEmail(user.email);

    if (existingEnrollment) {
      return NextResponse.json(
        {
          success: true,
          enrollmentId: existingEnrollment.id,
          message: 'Already enrolled',
        },
        { status: 200 }
      );
    }

    // Create new enrollment
    const enrollment = await createEnrollment({
      userId: user.id,
      email: user.email.toLowerCase(),
      name: name.trim(),
      bacbCertNumber: bacbCertNumber.trim(),
    });

    await initializeEnrollmentProgress(enrollment.id);

    // Log analytics event
    await trackEvent({
      enrollmentId: enrollment.id,
      eventType: 'enrollment_completed',
      eventData: {
        user_id: user.id,
        email: user.email,
      },
    });

    return NextResponse.json(
      {
        success: true,
        enrollmentId: enrollment.id,
        message: 'Enrollment successful',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Enrollment API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
