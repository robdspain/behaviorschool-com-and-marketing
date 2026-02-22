import { NextRequest, NextResponse } from 'next/server';
import { submitQuiz } from '@/lib/ace/ace-service';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: quizId } = await params;
    const body = await request.json();
    const { participant_id, answers } = body;

    if (!participant_id || !answers) {
      return NextResponse.json(
        { error: 'Missing required fields: participant_id, answers' },
        { status: 400 }
      );
    }

    // Submit the quiz using the Convex-powered service
    const result = await submitQuiz(quizId, participant_id, answers);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Quiz submission error:', error);
    const message = error instanceof Error ? error.message : 'Failed to submit quiz';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
