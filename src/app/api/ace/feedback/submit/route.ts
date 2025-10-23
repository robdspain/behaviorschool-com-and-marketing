import { NextRequest, NextResponse } from 'next/server';
import { submitFeedbackResponse } from '@/lib/ace/queries';

/**
 * POST /api/ace/feedback/submit
 * Submit feedback response
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { feedbackFormId, registrationId, userId, eventId, responses } = body;

    if (!feedbackFormId || !registrationId || !userId || !eventId || !responses) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    const feedbackResponse = await submitFeedbackResponse(
      feedbackFormId,
      registrationId,
      userId,
      eventId,
      responses
    );

    return NextResponse.json({
      success: true,
      data: feedbackResponse,
      message: 'Feedback submitted successfully',
    });
  } catch (error) {
    console.error('Feedback submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}
