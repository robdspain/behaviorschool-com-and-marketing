export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import {
  getMasterclassFeedbackByEnrollment,
  listMasterclassFeedback,
  submitMasterclassFeedback,
} from '@/lib/masterclass/queries';

/**
 * POST /api/masterclass/feedback
 * Submit feedback for the masterclass
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      enrollment_id,
      overall_satisfaction,
      content_quality,
      instructor_effectiveness,
      relevance_to_practice,
      would_recommend,
      section_1_rating,
      section_2_rating,
      section_3_rating,
      section_4_rating,
      most_valuable_learning,
      suggestions_for_improvement,
      topics_for_future_courses,
      additional_comments,
      learned_ethics_concepts,
      learned_teacher_collaboration,
      learned_data_systems,
      learned_crisis_management,
      will_apply_immediately,
      will_apply_within_month,
      will_share_with_team,
    } = body;

    // Validate required fields
    if (!enrollment_id) {
      return NextResponse.json(
        { error: 'Enrollment ID is required' },
        { status: 400 }
      );
    }

    const feedback = await submitMasterclassFeedback({
      enrollment_id,
      overall_satisfaction,
      content_quality,
      instructor_effectiveness,
      relevance_to_practice,
      would_recommend,
      section_1_rating,
      section_2_rating,
      section_3_rating,
      section_4_rating,
      most_valuable_learning,
      suggestions_for_improvement,
      topics_for_future_courses,
      additional_comments,
      learned_ethics_concepts,
      learned_teacher_collaboration,
      learned_data_systems,
      learned_crisis_management,
      will_apply_immediately,
      will_apply_within_month,
      will_share_with_team,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Feedback submitted successfully',
        data: { id: feedback.id },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in feedback submission:', error);
    const message = error instanceof Error ? error.message : 'An error occurred while submitting feedback';
    if (message.includes('Enrollment not found')) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
    }
    if (message.includes('Feedback already submitted')) {
      return NextResponse.json({ error: 'Feedback already submitted for this enrollment' }, { status: 409 });
    }
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/masterclass/feedback?enrollment_id=xxx
 * Get feedback for a specific enrollment (or all if admin)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const enrollmentId = searchParams.get('enrollment_id');

    if (enrollmentId) {
      // Get specific feedback
      const data = await getMasterclassFeedbackByEnrollment(enrollmentId);

      if (!data) {
        return NextResponse.json(
          { success: true, data: null, message: 'No feedback found' },
          { status: 200 }
        );
      }

      return NextResponse.json({ success: true, data }, { status: 200 });
    }

    // Get all feedback (admin only)
    const data = await listMasterclassFeedback();

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    );
  }
}
