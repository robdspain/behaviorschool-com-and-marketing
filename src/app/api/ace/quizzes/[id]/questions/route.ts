import { NextRequest, NextResponse } from 'next/server';
import { getConvexClient, api } from '@/lib/convex';
import { getQuizQuestions, addQuizQuestion } from '@/lib/ace/ace-service';
import type { Id } from '../../../../../../convex/_generated/dataModel';

export const dynamic = 'force-dynamic';

// GET /api/ace/quizzes/[id]/questions - Get questions for a quiz
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: quizId } = await params;

    const questions = await getQuizQuestions(quizId);

    return NextResponse.json({ success: true, data: questions });
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
    const body = await request.json();

    // Validate required fields
    if (!body.question_text || !body.options || !body.correct_answers) {
      return NextResponse.json(
        { error: 'Missing required fields: question_text, options, correct_answers' },
        { status: 400 }
      );
    }

    // Add question using the Convex-powered service
    const question = await addQuizQuestion(quizId, {
      question_text: body.question_text,
      question_type: body.question_type || 'multiple_choice',
      options: body.options,
      correct_answers: body.correct_answers,
      explanation: body.explanation,
      points: body.points || 1,
    });

    return NextResponse.json({ success: true, data: question }, { status: 201 });
  } catch (error) {
    console.error('Error adding question:', error);
    return NextResponse.json(
      { error: 'Failed to add question' },
      { status: 500 }
    );
  }
}

// DELETE /api/ace/quizzes/[id]/questions - Delete a question (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: quizId } = await params;
    const client = getConvexClient();

    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get('question_id');

    if (!questionId) {
      return NextResponse.json(
        { error: 'Missing question_id' },
        { status: 400 }
      );
    }

    // Soft delete - deactivate the question
    await client.mutation(api.aceQuizzes.deactivateQuestion, {
      questionId: questionId as Id<"aceQuizQuestions">,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json(
      { error: 'Failed to delete question' },
      { status: 500 }
    );
  }
}
