import { NextRequest, NextResponse } from 'next/server';
import { getConvexClient, api } from '@/lib/convex';
import type { Id } from '../../../../../../convex/_generated/dataModel';

export const dynamic = 'force-dynamic';

/**
 * GET /api/ace/complaints/[id]
 * Get a single complaint by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = getConvexClient();
    const { id } = params;

    const complaint = await client.query(api.aceComplaints.getById, {
      id: id as Id<"aceComplaints">,
    });

    if (!complaint) {
      return NextResponse.json(
        { error: 'Complaint not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: complaint });
  } catch (error) {
    console.error('Error fetching complaint:', error);
    return NextResponse.json(
      { error: 'Failed to fetch complaint' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/ace/complaints/[id]
 * Update complaint status/resolution
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = getConvexClient();
    const { id } = params;
    const body = await request.json();

    const { status, resolution_notes, resolved_by } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    const validStatuses = [
      'submitted',
      'under_review',
      'resolved',
      'escalated_to_bacb',
    ] as const;

    if (!validStatuses.includes(status as typeof validStatuses[number])) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    const result = await client.mutation(api.aceComplaints.updateStatus, {
      id: id as Id<"aceComplaints">,
      status: status as typeof validStatuses[number],
      resolutionNotes: resolution_notes || undefined,
      resolvedBy: resolved_by
        ? (resolved_by as Id<"aceUsers">)
        : undefined,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error updating complaint:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to update complaint';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
