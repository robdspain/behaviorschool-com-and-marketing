import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

/**
 * POST /api/ace/feedback
 * Submit feedback for an event
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const {
      event_id,
      participant_id,
      overallRating,
      instructorRating,
      contentRating,
      relevanceRating,
      comments,
      suggestions,
      wouldRecommend,
      applicationPlan,
    } = body;

    // Validate required fields
    if (!event_id || !participant_id) {
      return NextResponse.json(
        { error: 'Missing required fields: event_id, participant_id' },
        { status: 400 }
      );
    }

    if (!overallRating || !instructorRating || !contentRating || !relevanceRating) {
      return NextResponse.json(
        { error: 'Please provide all required ratings' },
        { status: 400 }
      );
    }

    // Check if feedback already submitted
    const { data: existingFeedback } = await supabase
      .from('ace_feedback_responses')
      .select('id')
      .eq('event_id', event_id)
      .eq('participant_id', participant_id)
      .single();

    if (existingFeedback) {
      return NextResponse.json(
        { error: 'Feedback already submitted for this event' },
        { status: 400 }
      );
    }

    // Create feedback record
    const { data: feedback, error: feedbackError } = await supabase
      .from('ace_feedback_responses')
      .insert([{
        event_id,
        participant_id,
        rating: overallRating,
        instructor_rating: instructorRating,
        content_rating: contentRating,
        relevance_rating: relevanceRating,
        comments: comments || null,
        suggestions: suggestions || null,
        would_recommend: wouldRecommend,
        application_plan: applicationPlan || null,
        submitted_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (feedbackError) {
      console.error('Feedback error:', feedbackError);
      return NextResponse.json(
        { error: 'Failed to submit feedback' },
        { status: 500 }
      );
    }

    // Update registration to mark feedback as completed
    await supabase
      .from('ace_registrations')
      .update({ feedback_completed: true })
      .eq('event_id', event_id)
      .eq('participant_id', participant_id);

    return NextResponse.json({
      success: true,
      feedback_id: feedback.id,
    });
  } catch (error) {
    console.error('Feedback submission error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ace/feedback
 * Get feedback for an event (admin)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('event_id');
    const participantId = searchParams.get('participant_id');

    let query = supabase
      .from('ace_feedback_responses')
      .select(`
        *,
        participant:ace_users (
          id,
          first_name,
          last_name,
          email
        )
      `)
      .order('submitted_at', { ascending: false });

    if (eventId) {
      query = query.eq('event_id', eventId);
    }

    if (participantId) {
      query = query.eq('participant_id', participantId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Fetch feedback error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch feedback' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Fetch feedback error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
