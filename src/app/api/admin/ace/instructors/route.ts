export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

// GET /api/admin/ace/instructors - List all instructor qualifications
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
      .from('ace_instructor_qualifications')
      .select(`
        *,
        user:user_id (
          id,
          first_name,
          last_name,
          email,
          bacb_id
        )
      `)
      .order('created_at', { ascending: false });

    if (providerId) {
      query = query.eq('provider_id', providerId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error fetching instructors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch instructors' },
      { status: 500 }
    );
  }
}

// POST /api/admin/ace/instructors - Add instructor qualification
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { session } } = await getSupabase().auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.user_id || !body.provider_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate qualification path
    const validPaths = [
      'active_bcba',
      'doctorate_behavior_analysis',
      'doctorate_with_coursework',
      'doctorate_with_mentorship',
      'doctorate_with_publications',
      'doctorate_with_postdoc_hours',
    ];

    if (body.qualification_path && !validPaths.includes(body.qualification_path)) {
      return NextResponse.json(
        { error: 'Invalid qualification path' },
        { status: 400 }
      );
    }

    // Validate expertise basis
    const validExpertise = [
      'five_years_practice',
      'three_years_teaching',
      'published_research',
    ];

    if (body.expertise_basis && !validExpertise.includes(body.expertise_basis)) {
      return NextResponse.json(
        { error: 'Invalid expertise basis' },
        { status: 400 }
      );
    }

    const qualificationData = {
      ...body,
      is_approved: false,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('ace_instructor_qualifications')
      .insert([qualificationData])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Error creating instructor qualification:', error);
    return NextResponse.json(
      { error: 'Failed to create instructor qualification' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/ace/instructors - Review/update instructor qualification
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { session } } = await getSupabase().auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    if (!body.qualification_id) {
      return NextResponse.json(
        { error: 'Missing qualification_id' },
        { status: 400 }
      );
    }

    const { qualification_id, ...updates } = body;

    // If approving, set the verified_by to current user
    if (updates.is_approved) {
      // Get ace_user for the current Supabase user
      const { data: aceUser } = await supabase
        .from('ace_users')
        .select('id')
        .eq('supabase_user_id', session.user.id)
        .single();

      if (aceUser) {
        updates.verified_by = aceUser.id;
        updates.verified_at = new Date().toISOString();
      }
    }

    const { data, error } = await supabase
      .from('ace_instructor_qualifications')
      .update(updates)
      .eq('id', qualification_id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error updating instructor qualification:', error);
    return NextResponse.json(
      { error: 'Failed to update instructor qualification' },
      { status: 500 }
    );
  }
}
