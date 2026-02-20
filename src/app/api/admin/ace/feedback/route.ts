import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

// GET /api/admin/ace/feedback - List all feedback responses
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('event_id');

    let query = supabase
      .from('ace_feedback_responses')
      .select(`
        *,
        event:event_id (
          id,
          title
        ),
        participant:participant_id (
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

    const { data, error } = await query;

    if (error) throw error;

    // Transform data for the frontend
    const transformedData = data?.map(fb => ({
      ...fb,
      event_title: fb.event?.title,
      participant_name: fb.participant ? `${fb.participant.first_name} ${fb.participant.last_name}` : null,
      participant_email: fb.participant?.email,
    }));

    return NextResponse.json({ success: true, data: transformedData }, { status: 200 });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    );
  }
}

// POST /api/admin/ace/feedback - Submit feedback
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const body = await request.json();

    // Validate required fields
    if (!body.event_id || !body.participant_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate review due date (45 days from submission)
    const reviewDueDate = new Date();
    reviewDueDate.setDate(reviewDueDate.getDate() + 45);

    const feedbackData = {
      ...body,
      submitted_at: new Date().toISOString(),
      coordinator_review_due_date: reviewDueDate.toISOString().split('T')[0],
    };

    const { data, error } = await supabase
      .from('ace_feedback_responses')
      .insert([feedbackData])
      .select()
      .single();

    if (error) throw error;

    // Update registration to mark feedback as completed
    await supabase
      .from('ace_registrations')
      .update({ feedback_completed: true })
      .eq('event_id', body.event_id)
      .eq('participant_id', body.participant_id);

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/ace/feedback - Review feedback (coordinator)
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    if (!body.feedback_id) {
      return NextResponse.json(
        { error: 'Missing feedback_id' },
        { status: 400 }
      );
    }

    const { feedback_id, ...updates } = body;

    const { data, error } = await supabase
      .from('ace_feedback_responses')
      .update(updates)
      .eq('id', feedback_id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error updating feedback:', error);
    return NextResponse.json(
      { error: 'Failed to update feedback' },
      { status: 500 }
    );
  }
}
