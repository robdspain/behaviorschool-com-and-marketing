import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

// POST /api/ace/quizzes - Create or get quiz for an event
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const body = await request.json();

    if (!body.event_id) {
      return NextResponse.json(
        { error: 'Missing event_id' },
        { status: 400 }
      );
    }

    // Check if quiz already exists
    const { data: existingQuiz } = await supabase
      .from('ace_quizzes')
      .select('*')
      .eq('event_id', body.event_id)
      .single();

    if (existingQuiz) {
      return NextResponse.json({ success: true, data: existingQuiz }, { status: 200 });
    }

    // Create new quiz
    const quizData = {
      event_id: body.event_id,
      title: body.title || 'Event Assessment',
      description: body.description || null,
      passing_score_percentage: body.passing_score_percentage || 80,
      max_attempts: body.max_attempts || null,
      time_limit_minutes: body.time_limit_minutes || null,
      randomize_questions: body.randomize_questions ?? true,
      randomize_options: body.randomize_options ?? true,
      show_correct_answers_after_submission: body.show_correct_answers_after_submission ?? true,
      is_active: true,
      is_required: true,
    };

    const { data, error } = await supabase
      .from('ace_quizzes')
      .insert([quizData])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
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
    const supabase = await createClient();

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('event_id');

    if (!eventId) {
      return NextResponse.json(
        { error: 'Missing event_id' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('ace_quizzes')
      .select('*')
      .eq('event_id', eventId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500 }
    );
  }
}
