import { NextRequest, NextResponse } from 'next/server';
import { submitQuizAttempt } from '@/lib/ace/queries';

/**
 * POST /api/ace/quizzes/[id]/submit
 * Submit quiz attempt
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: quizId } = await params;
    const body = await request.json();
    const { registrationId, userId, answers } = body;

    if (!registrationId || !userId || !answers) {
      return NextResponse.json(
        { success: false, error: 'registrationId, userId, and answers are required' },
        { status: 400 }
      );
    }

    const attempt = await submitQuizAttempt(quizId, registrationId, userId, answers);

    return NextResponse.json({
      success: true,
      data: attempt,
      message: attempt.passed ? 'Quiz passed!' : 'Quiz did not pass. Please try again.',
    });
  } catch (error) {
    console.error('Quiz submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit quiz' },
      { status: 500 }
    );
  }
}
