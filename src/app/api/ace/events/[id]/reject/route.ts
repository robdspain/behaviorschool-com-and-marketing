import { NextRequest, NextResponse } from 'next/server';
import { rejectEvent } from '@/lib/ace/queries';

/**
 * POST /api/ace/events/[id]/reject
 * Reject event with reason (ACE Coordinator only)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { reason } = body;

    if (!reason) {
      return NextResponse.json(
        { success: false, error: 'Rejection reason is required' },
        { status: 400 }
      );
    }

    const event = await rejectEvent(id, reason);

    return NextResponse.json({
      success: true,
      data: event,
      message: 'Event rejected',
    });
  } catch (error) {
    console.error('Event rejection error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reject event' },
      { status: 500 }
    );
  }
}
