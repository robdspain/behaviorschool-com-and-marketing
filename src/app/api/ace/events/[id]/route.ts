import { NextRequest, NextResponse } from 'next/server';
import { getConvexClient, api } from '@/lib/convex';
import { calculateCEUs, calculateMinimumQuestions } from '@/lib/ace/ceu-calculator';
import type { Id } from '@/lib/convex';

export const dynamic = 'force-dynamic';

// GET /api/ace/events/[id] - Get event with details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = getConvexClient();

    const event = await client.query(api.aceEvents.getWithDetails, {
      id: id as Id<"aceEvents">,
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

// PUT /api/ace/events/[id] - Update event
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = getConvexClient();
    const body = await request.json();

    // Verify event exists
    const existing = await client.query(api.aceEvents.getWithDetails, {
      id: id as Id<"aceEvents">,
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Only allow editing of draft events
    if (existing.status !== 'draft') {
      return NextResponse.json(
        { error: 'Only draft events can be edited. Current status: ' + existing.status },
        { status: 400 }
      );
    }

    // Build update object
    const updates: Record<string, unknown> = {};

    if (body.title !== undefined) updates.title = body.title;
    if (body.description !== undefined) updates.description = body.description;
    if (body.ce_category !== undefined) updates.ceCategory = body.ce_category;
    if (body.modality !== undefined) updates.modality = body.modality;
    if (body.max_participants !== undefined) updates.maxParticipants = Number(body.max_participants);
    if (body.fee !== undefined) updates.fee = Number(body.fee);
    if (body.learning_objectives !== undefined) updates.learningObjectives = body.learning_objectives;

    // Handle date fields
    if (body.start_date !== undefined) updates.startDate = new Date(body.start_date).getTime();
    if (body.end_date !== undefined) updates.endDate = new Date(body.end_date).getTime();

    // Handle CEU recalculation
    if (body.duration_minutes) {
      let ceus = calculateCEUs(body.duration_minutes);
      const subtype = body.event_subtype || existing.eventSubtype;
      if ((subtype === 'journal_club' || subtype === 'podcast') && ceus > 1.0) {
        ceus = 1.0;
      }
      updates.totalCeus = ceus;
    } else if (body.total_ceus !== undefined) {
      updates.totalCeus = body.total_ceus;
    }

    await client.mutation(api.aceEvents.update, {
      id: id as Id<"aceEvents">,
      ...updates,
    } as any);

    // Fetch updated event
    const updated = await client.query(api.aceEvents.getWithDetails, {
      id: id as Id<"aceEvents">,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

// DELETE /api/ace/events/[id] - Archive event (set status to archived)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = getConvexClient();

    // Verify event exists
    const existing = await client.query(api.aceEvents.getWithDetails, {
      id: id as Id<"aceEvents">,
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Archive the event
    await client.mutation(api.aceEvents.update, {
      id: id as Id<"aceEvents">,
      status: 'archived',
    });

    return NextResponse.json({
      success: true,
      message: 'Event archived successfully',
    });
  } catch (error) {
    console.error('Error archiving event:', error);
    return NextResponse.json(
      { error: 'Failed to archive event' },
      { status: 500 }
    );
  }
}
