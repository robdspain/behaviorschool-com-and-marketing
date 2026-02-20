import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

// GET /api/ace/quizzes/[id]/questions - Get questions for a quiz
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: quizId } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('ace_quiz_questions')
      .select('*')
      .eq('quiz_id', quizId)
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

// POST /api/ace/quizzes/[id]/questions - Add a question to a quiz
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: quizId } = await params;
    const supabase = await createClient();

    const body = await request.json();

    // Validate required fields
    if (!body.question_text || !body.options || !body.correct_answers) {
      return NextResponse.json(
        { error: 'Missing required fields: question_text, options, correct_answers' },
        { status: 400 }
      );
    }

    // Get current question count for order_index
    const { count } = await supabase
      .from('ace_quiz_questions')
      .select('*', { count: 'exact', head: true })
      .eq('quiz_id', quizId);

    const questionData = {
      quiz_id: quizId,
      question_text: body.question_text,
      question_type: body.question_type || 'multiple_choice',
      options: body.options,
      correct_answers: body.correct_answers,
      explanation: body.explanation || null,
      points: body.points || 1,
      order_index: (count || 0) + 1,
      is_active: true,
    };

    const { data, error } = await supabase
      .from('ace_quiz_questions')
      .insert([questionData])
      .select()
      .single();

    if (error) throw error;

    // Update actual_questions_count on the event
    const { data: quiz } = await supabase
      .from('ace_quizzes')
      .select('event_id')
      .eq('id', quizId)
      .single();

    if (quiz?.event_id) {
      const { count: totalQuestions } = await supabase
        .from('ace_quiz_questions')
        .select('*', { count: 'exact', head: true })
        .eq('quiz_id', quizId)
        .eq('is_active', true);

      await supabase
        .from('ace_events')
        .update({ actual_questions_count: totalQuestions })
        .eq('id', quiz.event_id);
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Error adding question:', error);
    return NextResponse.json(
      { error: 'Failed to add question' },
      { status: 500 }
    );
  }
}

// DELETE /api/ace/quizzes/[id]/questions - Delete a question
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: quizId } = await params;
    const supabase = await createClient();

    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get('question_id');

    if (!questionId) {
      return NextResponse.json(
        { error: 'Missing question_id' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('ace_quiz_questions')
      .update({ is_active: false })
      .eq('id', questionId)
      .eq('quiz_id', quizId);

    if (error) throw error;

    // Update actual_questions_count on the event
    const { data: quiz } = await supabase
      .from('ace_quizzes')
      .select('event_id')
      .eq('id', quizId)
      .single();

    if (quiz?.event_id) {
      const { count: totalQuestions } = await supabase
        .from('ace_quiz_questions')
        .select('*', { count: 'exact', head: true })
        .eq('quiz_id', quizId)
        .eq('is_active', true);

      await supabase
        .from('ace_events')
        .update({ actual_questions_count: totalQuestions })
        .eq('id', quiz.event_id);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json(
      { error: 'Failed to delete question' },
      { status: 500 }
    );
  }
}
