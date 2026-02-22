import { NextRequest, NextResponse } from 'next/server';
import { getConvexClient, api } from '@/lib/convex';
import { calculateCEUs, calculateMinimumQuestions } from '@/lib/ace/ceu-calculator';
import type { Id } from '../../../../../convex/_generated/dataModel';

export const dynamic = 'force-dynamic';

// GET /api/ace/events - List events with filters
export async function GET(request: NextRequest) {
  try {
    const client = getConvexClient();
    const { searchParams } = new URL(request.url);

    const providerId = searchParams.get('provider_id');
    const status = searchParams.get('status');
    const eventType = searchParams.get('event_type');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let events;

    if (providerId) {
      // Get events for a specific provider
      events = await client.query(api.aceEvents.getByProvider, {
        providerId: providerId as Id<"aceProviders">,
      });
    } else {
      // Get public events (approved/in_progress)
      events = await client.query(api.aceEvents.getPublic, {
        category: category as "learning" | "ethics" | "supervision" | "teaching" | undefined,
        upcoming: searchParams.get('upcoming') === 'true',
      });
    }

    // Apply additional filters client-side
    let filtered = events;

    if (status && status !== 'all') {
      filtered = filtered.filter((e: any) => e.status === status);
    }

    if (eventType) {
      filtered = filtered.filter((e: any) => e.eventType === eventType);
    }

    if (category && providerId) {
      // Only filter by category if we got provider events (getPublic already filters)
      filtered = filtered.filter((e: any) => e.ceCategory === category);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter((e: any) =>
        e.title?.toLowerCase().includes(searchLower) ||
        e.description?.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({
      success: true,
      data: filtered,
      total: filtered.length,
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST /api/ace/events - Create a new event
export async function POST(request: NextRequest) {
  try {
    const client = getConvexClient();
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['provider_id', 'title', 'ce_category', 'modality', 'start_date'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Auto-calculate CEUs from duration if provided
    let totalCeus = body.total_ceus;
    if (body.duration_minutes && !totalCeus) {
      totalCeus = calculateCEUs(body.duration_minutes);

      // Cap for journal_club and podcast subtypes
      if (
        (body.event_subtype === 'journal_club' || body.event_subtype === 'podcast') &&
        totalCeus > 1.0
      ) {
        totalCeus = 1.0;
      }
    }

    if (totalCeus === undefined || totalCeus === null) {
      return NextResponse.json(
        { error: 'Either total_ceus or duration_minutes must be provided' },
        { status: 400 }
      );
    }

    // Calculate minimum questions for async CE events
    const minimumQuestionsRequired =
      body.modality === 'asynchronous' ? calculateMinimumQuestions(totalCeus) : 0;

    // Parse dates
    const startDate = new Date(body.start_date).getTime();
    const endDate = body.end_date ? new Date(body.end_date).getTime() : undefined;
    const registrationDeadline = body.registration_deadline
      ? new Date(body.registration_deadline).getTime()
      : undefined;

    // Create event via Convex
    const eventId = await client.mutation(api.aceEvents.create, {
      providerId: body.provider_id as Id<"aceProviders">,
      title: body.title,
      description: body.description,
      totalCeus: totalCeus,
      ceCategory: body.ce_category,
      modality: body.modality,
      eventType: body.event_type || 'ce',
      startDate,
      endDate,
      registrationDeadline,
      maxParticipants: body.max_participants ? Number(body.max_participants) : undefined,
      location: body.location,
      onlineMeetingUrl: body.online_meeting_url,
      fee: body.fee !== undefined ? Number(body.fee) : undefined,
      verificationMethod: body.verification_method,
      passingScorePercentage: body.passing_score_percentage
        ? Number(body.passing_score_percentage)
        : undefined,
      learningObjectives: body.learning_objectives,
    });

    // Fetch the created event
    const event = await client.query(api.aceEvents.getWithDetails, {
      id: eventId,
    });

    return NextResponse.json(
      {
        success: true,
        data: event,
        meta: {
          calculated_ceus: totalCeus,
          minimum_questions_required: minimumQuestionsRequired,
          duration_minutes: body.duration_minutes,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
