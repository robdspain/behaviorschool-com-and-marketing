export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth-server';
import { isAuthorizedAdmin } from '@/lib/admin-config';
import { getMasterclassFeedbackStats } from '@/lib/masterclass/queries';

/**
 * GET /api/masterclass/feedback/stats
 * Get aggregated feedback statistics (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user || !isAuthorizedAdmin(user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stats = await getMasterclassFeedbackStats();

    return NextResponse.json(
      {
        success: true,
        data: stats,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in feedback stats:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching statistics' },
      { status: 500 }
    );
  }
}
