import { NextRequest, NextResponse } from 'next/server';
import { getConvexClient, api } from '@/lib/convex';
import { submitFeedback } from '@/lib/ace/ace-service';
import type { Id } from '../../../../convex/_generated/dataModel';

export const dynamic = 'force-dynamic';

/**
 * POST /api/ace/feedback
 * Submit feedback for an event
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      event_id,
      participant_id,
      overallRating,
      instructorRating,
      contentRating,
      relevanceRating,
      comments,
      suggestions,
      wouldRecommend,
      applicationPlan,
    } = body;

    // Validate required fields
    if (!event_id || !participant_id) {
      return NextResponse.json(
        { error: 'Missing required fields: event_id, participant_id' },
        { status: 400 }
      );
    }

    if (!overallRating || !instructorRating || !contentRating) {
      return NextResponse.json(
        { error: 'Please provide all required ratings' },
        { status: 400 }
      );
    }

    const client = getConvexClient();

    // Check if feedback already submitted
    const hasSubmitted = await client.query(api.aceFeedback.hasSubmitted, {
      eventId: event_id as Id<"aceEvents">,
      participantId: participant_id as Id<"aceUsers">,
    });

    if (hasSubmitted) {
      return NextResponse.json(
        { error: 'Feedback already submitted for this event' },
        { status: 400 }
      );
    }

    // Submit feedback using the Convex-powered service
    await submitFeedback(event_id, participant_id, {
      rating: overallRating,
      instructorRating,
      contentRating,
      comments,
      suggestions,
      wouldRecommend: wouldRecommend ?? true,
    });

    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully',
    });
  } catch (error) {
    console.error('Feedback submission error:', error);
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ace/feedback
 * Get feedback for an event
 */
export async function GET(request: NextRequest) {
  try {
    const client = getConvexClient();
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('event_id');
    const participantId = searchParams.get('participant_id');

    if (eventId) {
      // Get feedback for a specific event
      const feedback = await client.query(api.aceFeedback.getByEvent, {
        eventId: eventId as Id<"aceEvents">,
      });
      return NextResponse.json({ success: true, data: feedback });
    }

    if (participantId) {
      // Get feedback by a specific participant
      const feedback = await client.query(api.aceFeedback.getByParticipant, {
        participantId: participantId as Id<"aceUsers">,
      });
      return NextResponse.json({ success: true, data: feedback });
    }

    return NextResponse.json(
      { error: 'Please provide event_id or participant_id parameter' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Fetch feedback error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
