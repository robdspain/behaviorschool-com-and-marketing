export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth-server';
import { isAuthorizedAdmin, requiresAdminMfa } from '@/lib/admin-config';
import { supabase } from '@/lib/masterclass/queries';

/**
 * GET /api/masterclass/check-access
 *
 * Check if user has access to masterclass (either as admin or enrolled user)
 * Returns enrollment ID if enrolled, or admin flag if admin
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();

    if (!user) {
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
    const requiresMfaEnrollment = requiresAdminMfa(user);

    if (isAdmin) {
      return NextResponse.json({
        hasAccess: true,
        isAdmin: true,
        requiresMfaEnrollment,
        user: {
          id: user.id,
          email: user.email,
          twoFactorEnabled: user.twoFactorEnabled,
        },
      });
    }

    // Not admin — check enrollment by email (works for both legacy Supabase IDs
    // and new Better Auth user IDs since email is the stable identifier)
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('masterclass_enrollments')
      .select('id, name, email, created_at')
      .eq('email', user.email.toLowerCase())
      .single();

    if (enrollmentError || !enrollment) {
      return NextResponse.json(
        {
          error: 'Not enrolled',
          hasAccess: false,
          isAdmin: false,
          requiresMfaEnrollment: false,
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      hasAccess: true,
      isAdmin: false,
      requiresMfaEnrollment: false,
      enrollmentId: enrollment.id,
      user: {
        id: user.id,
        email: enrollment.email,
        name: enrollment.name,
        twoFactorEnabled: user.twoFactorEnabled,
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
