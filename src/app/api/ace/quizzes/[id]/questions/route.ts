import { NextRequest, NextResponse } from 'next/server';
import { createQuizQuestion, getQuizQuestions } from '@/lib/ace/queries';
import type { AceQuizQuestionFormData } from '@/lib/ace/types';

/**
 * GET /api/ace/quizzes/[id]/questions
 * Get all questions for a quiz
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const questions = await getQuizQuestions(id);

    return NextResponse.json({
      success: true,
      data: questions,
    });
  } catch (error) {
    console.error('Quiz questions GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ace/quizzes/[id]/questions
 * Add question to quiz
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: quizId } = await params;
    const body = (await request.json()) as Omit<AceQuizQuestionFormData, 'quiz_id'>;

    const questionData: AceQuizQuestionFormData = {
      ...body,
      quiz_id: quizId,
    };

    const question = await createQuizQuestion(questionData);

    return NextResponse.json({
      success: true,
      data: question,
      message: 'Question added successfully',
    });
  } catch (error) {
    console.error('Quiz question POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add question' },
      { status: 500 }
    );
  }
}
