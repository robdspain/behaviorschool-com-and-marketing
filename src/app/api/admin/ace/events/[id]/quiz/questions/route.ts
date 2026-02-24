export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

// GET /api/admin/ace/events/[id]/quiz/questions - Get questions for an event's quiz
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    const supabase = await createClient();

    // Check authentication
    const { data: { session } } = await getSupabase().auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get quiz for this event
    const { data: quiz, error: quizError } = await supabase
      .from('ace_quizzes')
      .select('id')
      .eq('event_id', eventId)
      .single();

    if (quizError && quizError.code !== 'PGRST116') throw quizError;

    if (!quiz) {
      return NextResponse.json({ success: true, data: [] }, { status: 200 });
    }

    // Get questions
    const { data: questions, error: questionsError } = await supabase
      .from('ace_quiz_questions')
      .select('*')
      .eq('quiz_id', quiz.id)
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (questionsError) throw questionsError;

    return NextResponse.json({ success: true, data: questions }, { status: 200 });
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz questions' },
      { status: 500 }
    );
  }
}
