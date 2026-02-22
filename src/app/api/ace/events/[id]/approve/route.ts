import { NextRequest, NextResponse } from 'next/server';
import { getConvexClient, api } from '@/lib/convex';
import type { Id } from '../../../../../../../convex/_generated/dataModel';

export const dynamic = 'force-dynamic';

/**
 * POST /api/ace/events/[id]/approve
 * Approve or reject an event
 *
 * Body: { action: "approve" | "reject", feedback?: string }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const client = getConvexClient();
    const { id } = await params;
    const body = await request.json();
    const { action, feedback } = body;

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "approve" or "reject".' },
        { status: 400 }
      );
    }

    const eventId = id as Id<'aceEvents'>;

    // Verify the event exists and is in pending_approval status
    const event = await client.query(api.aceEvents.getWithDetails, {
      id: eventId,
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    if (event.status !== 'pending_approval') {
      return NextResponse.json(
        {
          error: `Event is not pending approval. Current status: ${event.status}`,
        },
        { status: 400 }
      );
    }

    // Update event status
    const newStatus = action === 'approve' ? 'approved' : 'archived';

    await client.mutation(api.aceEvents.update, {
      id: eventId,
      status: newStatus as any,
    });

    return NextResponse.json({
      success: true,
      data: {
        eventId: id,
        action,
        newStatus,
        feedback: feedback || null,
      },
      message: `Event ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
    });
  } catch (error) {
    console.error('Error processing event approval:', error);
    return NextResponse.json(
      { error: 'Failed to process event approval' },
      { status: 500 }
    );
  }
}
