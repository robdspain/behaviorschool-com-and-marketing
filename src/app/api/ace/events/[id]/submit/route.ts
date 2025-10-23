import { NextRequest, NextResponse } from 'next/server';
import { submitEventForApproval } from '@/lib/ace/queries';

/**
 * POST /api/ace/events/[id]/submit
 * Submit event for approval
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const event = await submitEventForApproval(id);

    return NextResponse.json({
      success: true,
      data: event,
      message: 'Event submitted for approval',
    });
  } catch (error) {
    console.error('Event submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit event' },
      { status: 500 }
    );
  }
}
