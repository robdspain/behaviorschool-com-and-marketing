export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

/**
 * POST /api/masterclass/feedback
 * Submit feedback for the masterclass
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

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

    // Get enrollment details to verify it exists and get participant info
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('masterclass_enrollments')
      .select('*')
      .eq('id', enrollment_id)
      .single();

    if (enrollmentError || !enrollment) {
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 }
      );
    }

    // Check if feedback already exists
    const { data: existingFeedback } = await supabase
      .from('masterclass_feedback')
      .select('id')
      .eq('enrollment_id', enrollment_id)
      .single();

    if (existingFeedback) {
      return NextResponse.json(
        { error: 'Feedback already submitted for this enrollment' },
        { status: 409 }
      );
    }

    // Insert feedback
    const { data: feedback, error: feedbackError } = await supabase
      .from('masterclass_feedback')
      .insert([
        {
          enrollment_id,
          participant_email: enrollment.email,
          participant_name: enrollment.name,
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
        },
      ])
      .select()
      .single();

    if (feedbackError) {
      console.error('Error inserting feedback:', feedbackError);
      return NextResponse.json(
        { error: 'Failed to submit feedback' },
        { status: 500 }
      );
    }

    // Mark enrollment as feedback_submitted
    await supabase
      .from('masterclass_enrollments')
      .update({ feedback_submitted: true })
      .eq('id', enrollment_id);

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
    return NextResponse.json(
      { error: 'An error occurred while submitting feedback' },
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
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const enrollmentId = searchParams.get('enrollment_id');

    if (enrollmentId) {
      // Get specific feedback
      const { data, error } = await supabase
        .from('masterclass_feedback')
        .select('*')
        .eq('enrollment_id', enrollmentId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return NextResponse.json(
            { success: true, data: null, message: 'No feedback found' },
            { status: 200 }
          );
        }
        throw error;
      }

      return NextResponse.json({ success: true, data }, { status: 200 });
    }

    // Get all feedback (admin only)
    const { data, error } = await supabase
      .from('masterclass_feedback')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    );
  }
}
