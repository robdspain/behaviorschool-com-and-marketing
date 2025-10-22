import { NextRequest, NextResponse } from 'next/server';
import { createEnrollment, getEnrollmentByEmail } from '@/lib/masterclass/queries';
import type { EnrollmentFormData } from '@/lib/masterclass/types';

/**
 * POST /api/masterclass/enroll
 *
 * Creates a new masterclass enrollment or returns existing enrollment
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as EnrollmentFormData;

    // Validate required fields
    if (!body.email || !body.name || !body.bacbCertNumber) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: email, name, and BACB certification number are required',
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email address format',
        },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const enrollmentData: EnrollmentFormData = {
      email: body.email.toLowerCase().trim(),
      name: body.name.trim(),
      bacbCertNumber: body.bacbCertNumber.trim(),
    };

    // Check if user already exists
    const existingEnrollment = await getEnrollmentByEmail(enrollmentData.email);

    if (existingEnrollment) {
      // User already enrolled, return their enrollment ID
      // Frontend can redirect them to continue their course
      return NextResponse.json(
        {
          success: true,
          message: 'Welcome back! Redirecting to your course...',
          data: {
            enrollmentId: existingEnrollment.id,
            email: existingEnrollment.email,
            name: existingEnrollment.name,
            existing: true,
          },
        },
        { status: 409 } // 409 Conflict - user exists
      );
    }

    // Create new enrollment
    const enrollment = await createEnrollment(enrollmentData);

    // Return success with enrollment ID
    return NextResponse.json(
      {
        success: true,
        message: 'Enrollment successful! Welcome to the masterclass.',
        data: {
          enrollmentId: enrollment.id,
          email: enrollment.email,
          name: enrollment.name,
          existing: false,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Enrollment API error:', error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('already exists')) {
        return NextResponse.json(
          {
            success: false,
            error: 'An account with this email already exists. Please use the login option.',
          },
          { status: 409 }
        );
      }

      if (error.message.includes('database')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Database error. Please try again later.',
          },
          { status: 500 }
        );
      }
    }

    // Generic error response
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/masterclass/enroll?email=xxx
 *
 * Check if an email is already enrolled
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email parameter is required',
        },
        { status: 400 }
      );
    }

    const enrollment = await getEnrollmentByEmail(email);

    if (!enrollment) {
      return NextResponse.json(
        {
          success: true,
          data: {
            enrolled: false,
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          enrolled: true,
          enrollmentId: enrollment.id,
          name: enrollment.name,
          createdAt: enrollment.created_at,
          completed: !!enrollment.completed_at,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Enrollment check API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check enrollment status',
      },
      { status: 500 }
    );
  }
}
