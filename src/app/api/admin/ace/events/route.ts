import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { getEvents, createEvent, updateEvent, deleteEvent, getCurrentUserProviderId } from '@/lib/ace/queries';

// GET /api/admin/ace/events - List all events
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get provider_id from query params (optional)
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get('provider_id') || undefined;
    
    const events = await getEvents(providerId);
    
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
    const supabase = await createClient();

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the provider ID for the current user
    const providerId = await getCurrentUserProviderId();
    if (!providerId) {
      return NextResponse.json(
        { error: 'No provider found for current user' },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.total_ceus) {
      return NextResponse.json(
        { error: 'Missing required fields: title, total_ceus' },
        { status: 400 }
      );
    }

    // Add the provider_id from the authenticated user
    const eventData = {
      ...body,
      provider_id: providerId,
    };

    const event = await createEvent(eventData);

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
    const supabase = await createClient();
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'Missing required field: id' },
        { status: 400 }
      );
    }
    
    const { id, ...updates } = body;
    const event = await updateEvent(id, updates);
    
    return NextResponse.json({ data: event }, { status: 200 });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/ace/events?id=xxx - Delete an event
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing required parameter: id' },
        { status: 400 }
      );
    }
    
    await deleteEvent(id);
    
    return NextResponse.json({ message: 'Event deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}

