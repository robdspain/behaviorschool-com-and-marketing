import { NextRequest, NextResponse } from 'next/server';
import { getConvexClient, api } from '@/lib/convex';
import type { Id } from '@/lib/convex';

export const dynamic = 'force-dynamic';

// GET /api/admin/ace/events - List all events
export async function GET(request: NextRequest) {
  try {
    const client = getConvexClient();
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get('provider_id');

    let events;

    if (providerId) {
      events = await client.query(api.aceEvents.getByProvider, {
        providerId: providerId as Id<'aceProviders'>,
      });
    } else {
      events = await client.query(api.aceEvents.getPublic, {});
    }

    return NextResponse.json({ data: events }, { status: 200 });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST /api/admin/ace/events - Create a new event
export async function POST(request: NextRequest) {
  try {
    const client = getConvexClient();
    const body = await request.json();

    if (!body.provider_id || !body.title || !body.total_ceus) {
      return NextResponse.json(
        { error: 'Missing required fields: provider_id, title, total_ceus' },
        { status: 400 }
      );
    }

    const startDate = new Date(body.start_date).getTime();
    const endDate = body.end_date ? new Date(body.end_date).getTime() : undefined;

    const eventId = await client.mutation(api.aceEvents.create, {
      providerId: body.provider_id as Id<'aceProviders'>,
      title: body.title,
      description: body.description,
      totalCeus: body.total_ceus,
      ceCategory: body.ce_category || 'learning',
      modality: body.modality || 'synchronous',
      eventType: body.event_type || 'ce',
      startDate,
      endDate,
      maxParticipants: body.max_participants ? Number(body.max_participants) : undefined,
      location: body.location,
      onlineMeetingUrl: body.online_meeting_url,
      fee: body.fee !== undefined ? Number(body.fee) : undefined,
      verificationMethod: body.verification_method,
      learningObjectives: body.learning_objectives,
    });

    const event = await client.query(api.aceEvents.getWithDetails, {
      id: eventId,
    });

    return NextResponse.json({ success: true, data: event }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/ace/events - Update an event
export async function PUT(request: NextRequest) {
  try {
    const client = getConvexClient();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: 'Missing required field: id' },
        { status: 400 }
      );
    }

    await client.mutation(api.aceEvents.update, {
      id: body.id as Id<'aceEvents'>,
      title: body.title,
      description: body.description,
      totalCeus: body.total_ceus,
      ceCategory: body.ce_category,
      modality: body.modality,
      startDate: body.start_date ? new Date(body.start_date).getTime() : undefined,
      endDate: body.end_date ? new Date(body.end_date).getTime() : undefined,
      maxParticipants: body.max_participants,
      location: body.location,
      onlineMeetingUrl: body.online_meeting_url,
      fee: body.fee,
    });

    const event = await client.query(api.aceEvents.getWithDetails, {
      id: body.id as Id<'aceEvents'>,
    });

    return NextResponse.json({ data: event }, { status: 200 });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/ace/events?id=xxx - Archive an event
export async function DELETE(request: NextRequest) {
  try {
    const client = getConvexClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing required parameter: id' },
        { status: 400 }
      );
    }

    await client.mutation(api.aceEvents.update, {
      id: id as Id<'aceEvents'>,
      status: 'archived',
    });

    return NextResponse.json({ message: 'Event archived successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error archiving event:', error);
    return NextResponse.json(
      { error: 'Failed to archive event' },
      { status: 500 }
    );
  }
}
