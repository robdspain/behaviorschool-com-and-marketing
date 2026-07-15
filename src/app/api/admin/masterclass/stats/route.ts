export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/admin-auth';
import { api, getConvexClient } from '@/lib/convex';

/**
 * GET /api/admin/masterclass/stats
 * Get masterclass statistics for admin dashboard
 */
export async function GET() {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Get enrollments in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const data = await getConvexClient().query(api.masterclassAdmin.stats, {
      weekStartIso: sevenDaysAgo.toISOString(),
    });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Stats GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
