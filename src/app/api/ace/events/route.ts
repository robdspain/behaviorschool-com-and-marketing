import { NextRequest, NextResponse } from 'next/server';
import { getAceEvents, createAceEvent } from '@/lib/ace/queries';
import type { AceEventFormData, EventFilter, PaginationParams } from '@/lib/ace/types';

/**
 * GET /api/ace/events
 * List events with filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Build filter object
    const filter: EventFilter = {};
    if (searchParams.get('category')) {
      filter.category = searchParams.get('category') as any;
    }
    if (searchParams.get('modality')) {
      filter.modality = searchParams.get('modality') as any;
    }
    if (searchParams.get('status')) {
      filter.status = searchParams.get('status') as any;
    }
    if (searchParams.get('provider_id')) {
      filter.provider_id = searchParams.get('provider_id')!;
    }
    if (searchParams.get('search')) {
      filter.search = searchParams.get('search')!;
    }

    // Build pagination object
    const pagination: PaginationParams = {};
    if (searchParams.get('page')) {
      pagination.page = parseInt(searchParams.get('page')!);
    }
    if (searchParams.get('limit')) {
      pagination.limit = parseInt(searchParams.get('limit')!);
    }
    if (searchParams.get('sort_by')) {
      pagination.sort_by = searchParams.get('sort_by')!;
    }
    if (searchParams.get('sort_order')) {
      pagination.sort_order = searchParams.get('sort_order') as 'asc' | 'desc';
    }

    const events = await getAceEvents(filter, pagination);

    return NextResponse.json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.error('Events GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ace/events
 * Create new event
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AceEventFormData;

    const event = await createAceEvent(body);

    return NextResponse.json({
      success: true,
      data: event,
      message: 'Event created successfully',
    });
  } catch (error) {
    console.error('Events POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
