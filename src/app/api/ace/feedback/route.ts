import { NextRequest, NextResponse } from 'next/server';
import { createFeedbackForm, submitFeedbackResponse } from '@/lib/ace/queries';
import type { AceFeedbackFormData } from '@/lib/ace/types';

/**
 * POST /api/ace/feedback
 * Create feedback form for event
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AceFeedbackFormData;

    const feedbackForm = await createFeedbackForm(body);

    return NextResponse.json({
      success: true,
      data: feedbackForm,
      message: 'Feedback form created successfully',
    });
  } catch (error) {
    console.error('Feedback form POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create feedback form' },
      { status: 500 }
    );
  }
}
