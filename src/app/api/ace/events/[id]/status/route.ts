import { NextRequest, NextResponse } from 'next/server';
import { getConvexClient, api } from '@/lib/convex';
import type { Id } from '../../../../../../../convex/_generated/dataModel';
import type { AceEventStatus } from '@/lib/ace/types';

export const dynamic = 'force-dynamic';

// Valid status transitions
const VALID_TRANSITIONS: Record<AceEventStatus, AceEventStatus[]> = {
  draft: ['pending_approval', 'archived'],
  pending_approval: ['approved', 'draft', 'archived'],
  approved: ['in_progress', 'archived'],
  in_progress: ['completed', 'archived'],
  completed: ['archived'],
  archived: [], // Terminal state - no transitions allowed
};

// Status labels for error messages
const STATUS_LABELS: Record<AceEventStatus, string> = {
  draft: 'Draft',
  pending_approval: 'Pending Approval',
  approved: 'Approved',
  in_progress: 'In Progress',
  completed: 'Completed',
  archived: 'Archived',
};

// POST /api/ace/events/[id]/status - Change event status
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = getConvexClient();
    const body = await request.json();

    const newStatus = body.status as AceEventStatus;

    // Validate status value
    if (!newStatus) {
      return NextResponse.json(
        { error: 'Missing required field: status' },
        { status: 400 }
      );
    }

    const validStatuses: AceEventStatus[] = [
      'draft',
      'pending_approval',
      'approved',
      'in_progress',
      'completed',
      'archived',
    ];

    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json(
        {
          error: `Invalid status: "${newStatus}". Valid statuses are: ${validStatuses.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Get existing event
    const event = await client.query(api.aceEvents.getWithDetails, {
      id: id as Id<"aceEvents">,
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    const currentStatus = event.status as AceEventStatus;

    // Check if transition is valid
    const allowedTransitions = VALID_TRANSITIONS[currentStatus] || [];
    if (!allowedTransitions.includes(newStatus)) {
      const currentLabel = STATUS_LABELS[currentStatus] || currentStatus;
      const newLabel = STATUS_LABELS[newStatus] || newStatus;
      const allowedLabels = allowedTransitions.map(
        (s) => `${STATUS_LABELS[s]} (${s})`
      );

      return NextResponse.json(
        {
          error: `Cannot transition from "${currentLabel}" to "${newLabel}". Allowed transitions from "${currentLabel}": ${allowedLabels.length > 0 ? allowedLabels.join(', ') : 'none (terminal state)'}`,
          current_status: currentStatus,
          requested_status: newStatus,
          allowed_transitions: allowedTransitions,
        },
        { status: 400 }
      );
    }

    // Additional validation for specific transitions
    if (newStatus === 'pending_approval') {
      // Validate minimum requirements for submission
      const errors: string[] = [];

      if (!event.title || event.title.trim().length === 0) {
        errors.push('Event must have a title');
      }

      if (!event.learningObjectives || event.learningObjectives.length < 3) {
        errors.push('Event must have at least 3 learning objectives');
      }

      if (event.totalCeus <= 0) {
        errors.push('Event must award at least some CEUs/PDUs');
      }

      if (errors.length > 0) {
        return NextResponse.json(
          {
            error: 'Event does not meet minimum requirements for approval submission',
            validation_errors: errors,
          },
          { status: 400 }
        );
      }
    }

    // Perform the status update
    await client.mutation(api.aceEvents.update, {
      id: id as Id<"aceEvents">,
      status: newStatus,
    });

    // Fetch updated event
    const updated = await client.query(api.aceEvents.getWithDetails, {
      id: id as Id<"aceEvents">,
    });

    return NextResponse.json({
      success: true,
      data: updated,
      transition: {
        from: currentStatus,
        to: newStatus,
        from_label: STATUS_LABELS[currentStatus],
        to_label: STATUS_LABELS[newStatus],
      },
    });
  } catch (error) {
    console.error('Error changing event status:', error);
    return NextResponse.json(
      { error: 'Failed to change event status' },
      { status: 500 }
    );
  }
}
