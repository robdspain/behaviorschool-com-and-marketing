export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { isAuthorizedAdmin } from '@/lib/admin-config';

/**
 * GET /api/masterclass/check-access
 *
 * Check if user has access to masterclass (either as admin or enrolled user)
 * Returns enrollment ID if enrolled, or admin flag if admin
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await getSupabase().auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          error: 'Not authenticated',
          hasAccess: false,
        },
        { status: 401 }
      );
    }

    // Check if user is an authorized admin
    const isAdmin = isAuthorizedAdmin(user.email);

    if (isAdmin) {
      // Admin has access without enrollment
      return NextResponse.json({
        hasAccess: true,
        isAdmin: true,
        user: {
          id: user.id,
          email: user.email,
        },
      });
    }

    // Not admin, check for enrollment
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('masterclass_enrollments')
      .select('id, name, email, created_at')
      .eq('user_id', user.id)
      .single();

    if (enrollmentError || !enrollment) {
      return NextResponse.json(
        {
          error: 'Not enrolled',
          hasAccess: false,
          isAdmin: false,
        },
        { status: 403 }
      );
    }

    // User is enrolled
    return NextResponse.json({
      hasAccess: true,
      isAdmin: false,
      enrollmentId: enrollment.id,
      user: {
        id: user.id,
        email: enrollment.email,
        name: enrollment.name,
      },
    });
  } catch (error) {
    console.error('Check access error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
