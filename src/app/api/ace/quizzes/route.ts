import { NextRequest, NextResponse } from 'next/server';
import { createAceQuiz } from '@/lib/ace/queries';
import type { AceQuizFormData } from '@/lib/ace/types';

/**
 * POST /api/ace/quizzes
 * Create quiz for event
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AceQuizFormData;

    const quiz = await createAceQuiz(body);

    return NextResponse.json({
      success: true,
      data: quiz,
      message: 'Quiz created successfully',
    });
  } catch (error) {
    console.error('Quiz POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create quiz' },
      { status: 500 }
    );
  }
}
