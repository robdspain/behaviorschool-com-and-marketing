import { NextRequest, NextResponse } from 'next/server';
import { approveEvent } from '@/lib/ace/queries';

/**
 * POST /api/ace/events/[id]/approve
 * Approve event (ACE Coordinator only)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { approvedBy } = body;

    if (!approvedBy) {
      return NextResponse.json(
        { success: false, error: 'approvedBy is required' },
        { status: 400 }
      );
    }

    const event = await approveEvent(id, approvedBy);

    return NextResponse.json({
      success: true,
      data: event,
      message: 'Event approved successfully',
    });
  } catch (error) {
    console.error('Event approval error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to approve event' },
      { status: 500 }
    );
  }
}
