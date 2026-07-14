export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { api, getConvexClient } from '@/lib/convex';

export async function POST(request: NextRequest) {
  try {
    const { activityType, activityId, title, description, timestamp } = await request.json();

    if (!activityType || !activityId || !title || !description || !timestamp) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const data = await getConvexClient().mutation(api.activityArchive.archiveActivity, {
      activityType,
      activityId,
      title,
      description,
      timestamp,
    });

    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Archive activity error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to archive activity' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing activity ID' },
        { status: 400 }
      );
    }

    await getConvexClient().mutation(api.activityArchive.unarchiveActivity, { id });

    return NextResponse.json({
      success: true
    });
  } catch (error) {
    console.error('Unarchive activity error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to unarchive activity' },
      { status: 500 }
    );
  }
}
