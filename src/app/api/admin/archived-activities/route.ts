export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { api, getConvexClient } from '@/lib/convex';

export async function GET() {
  try {
    const archivedActivities = await getConvexClient().query(api.activityArchive.listArchivedActivities, {});

    return NextResponse.json({
      success: true,
      activities: archivedActivities || []
    });
  } catch (error) {
    console.error('Fetch archived activities error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch archived activities' },
      { status: 500 }
    );
  }
}
