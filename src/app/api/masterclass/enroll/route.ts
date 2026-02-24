export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

/**
 * POST /api/masterclass/enroll
 *
 * Creates a new masterclass enrollment for authenticated user
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await getSupabase().auth.getUser();

    if (authError || !user) {
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

    // Check if user already enrolled
    const { data: existingEnrollment } = await supabase
      .from('masterclass_enrollments')
      .select('id')
      .eq('user_id', user.id)
      .single();

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
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('masterclass_enrollments')
      .insert({
        user_id: user.id,
        email: user.email!,
        name: name.trim(),
        bacb_cert_number: bacbCertNumber.trim(),
        created_at: new Date().toISOString(),
        last_accessed_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (enrollmentError) {
      console.error('Enrollment error:', enrollmentError);
      return NextResponse.json(
        { error: 'Failed to create enrollment' },
        { status: 500 }
      );
    }

    // Initialize progress records for all 4 sections
    const progressRecords = [1, 2, 3, 4].map(section => ({
      enrollment_id: enrollment.id,
      section_number: section,
      video_completed: false,
      video_watched_percentage: 0,
      quiz_attempts: 0,
      quiz_passed: false,
    }));

    const { error: progressError } = await supabase
      .from('masterclass_progress')
      .insert(progressRecords);

    if (progressError) {
      console.error('Progress initialization error:', progressError);
      // Continue anyway, progress can be created on-demand
    }

    // Log analytics event
    await supabase
      .from('masterclass_analytics_events')
      .insert({
        enrollment_id: enrollment.id,
        event_type: 'enrollment_complete',
        event_data: {
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
