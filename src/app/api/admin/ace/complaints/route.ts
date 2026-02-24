export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

// GET /api/admin/ace/complaints - List all complaints
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { session } } = await getSupabase().auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get('provider_id');

    let query = supabase
      .from('ace_complaints')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (providerId) {
      query = query.eq('provider_id', providerId);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Calculate is_overdue for each complaint
    const complaintsWithOverdue = data?.map(complaint => {
      const isOverdue = complaint.response_due_date && 
        new Date(complaint.response_due_date) < new Date() && 
        !complaint.resolved_at;
      return {
        ...complaint,
        is_overdue: isOverdue,
      };
    });

    return NextResponse.json({ success: true, data: complaintsWithOverdue }, { status: 200 });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    return NextResponse.json(
      { error: 'Failed to fetch complaints' },
      { status: 500 }
    );
  }
}

// POST /api/admin/ace/complaints - Create a new complaint
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const body = await request.json();

    // Validate required fields
    if (!body.submitter_name || !body.submitter_email || !body.complaint_text || !body.provider_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate response due date (45 days from now)
    const responseDueDate = new Date();
    responseDueDate.setDate(responseDueDate.getDate() + 45);

    const complaintData = {
      ...body,
      status: 'submitted',
      submitted_at: new Date().toISOString(),
      response_due_date: responseDueDate.toISOString().split('T')[0],
    };

    const { data, error } = await supabase
      .from('ace_complaints')
      .insert([complaintData])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Error creating complaint:', error);
    return NextResponse.json(
      { error: 'Failed to create complaint' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/ace/complaints - Update a complaint
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { session } } = await getSupabase().auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    if (!body.complaint_id) {
      return NextResponse.json(
        { error: 'Missing complaint_id' },
        { status: 400 }
      );
    }

    const { complaint_id, ...updates } = body;

    const { data, error } = await supabase
      .from('ace_complaints')
      .update(updates)
      .eq('id', complaint_id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error updating complaint:', error);
    return NextResponse.json(
      { error: 'Failed to update complaint' },
      { status: 500 }
    );
  }
}
