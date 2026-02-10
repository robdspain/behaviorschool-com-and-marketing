import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const getSupabase = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE) {
    throw new Error('Supabase env vars missing');
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE
  );
};

export async function POST(request: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json(
        { success: false, error: 'Supabase not configured' },
        { status: 503 }
      );
    }

    const supabase = getSupabase();
    const { activityType, activityId, title, description, timestamp } = await request.json();

    if (!activityType || !activityId || !title || !description || !timestamp) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert into archived_activities table
    const { data, error } = await supabase
      .from('archived_activities')
      .insert({
        activity_type: activityType,
        activity_id: activityId,
        title,
        description,
        original_timestamp: timestamp,
      })
      .select()
      .single();

    if (error) {
      console.error('Archive activity error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to archive activity' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Archive activity error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to archive activity' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json(
        { success: false, error: 'Supabase not configured' },
        { status: 503 }
      );
    }

    const supabase = getSupabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing activity ID' },
        { status: 400 }
      );
    }

    // Delete from archived_activities table (unarchive)
    const { error } = await supabase
      .from('archived_activities')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Unarchive activity error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to unarchive activity' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true
    });
  } catch (error) {
    console.error('Unarchive activity error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to unarchive activity' },
      { status: 500 }
    );
  }
}
