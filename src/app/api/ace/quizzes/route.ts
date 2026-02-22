import { NextRequest, NextResponse } from 'next/server';
import { getConvexClient, api } from '@/lib/convex';
import { createQuiz, getQuizForEvent } from '@/lib/ace/ace-service';
import type { Id } from '../../../../convex/_generated/dataModel';

export const dynamic = 'force-dynamic';

// POST /api/ace/quizzes - Create or get quiz for an event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.event_id) {
      return NextResponse.json(
        { error: 'Missing event_id' },
        { status: 400 }
      );
    }

    // Check if quiz already exists
    const existingQuiz = await getQuizForEvent(body.event_id);

    if (existingQuiz) {
      return NextResponse.json({ success: true, data: existingQuiz }, { status: 200 });
    }

    // Create new quiz using the Convex-powered service
    const quiz = await createQuiz(body.event_id, {
      title: body.title || 'Event Assessment',
      description: body.description,
      passing_score_percentage: body.passing_score_percentage || 80,
      max_attempts: body.max_attempts,
      time_limit_minutes: body.time_limit_minutes,
      shuffle_questions: body.randomize_questions ?? true,
      show_correct_answers: body.show_correct_answers_after_submission ?? true,
      is_required: true,
    });

    return NextResponse.json({ success: true, data: quiz }, { status: 201 });
  } catch (error) {
    console.error('Error creating quiz:', error);
    return NextResponse.json(
      { error: 'Failed to create quiz' },
      { status: 500 }
    );
  }
}

// GET /api/ace/quizzes - Get quiz by event_id
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('event_id');

    if (!eventId) {
      return NextResponse.json(
        { error: 'Missing event_id' },
        { status: 400 }
      );
    }

    const quiz = await getQuizForEvent(eventId);

    return NextResponse.json({ success: true, data: quiz }, { status: 200 });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500 }
    );
  }
}
