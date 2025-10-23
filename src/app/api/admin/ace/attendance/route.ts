import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

// GET /api/admin/ace/attendance?event_id=xxx - Get attendance for an event
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
    
    if (!eventId) {
      return NextResponse.json(
        { error: 'Missing required parameter: event_id' },
        { status: 400 }
      );
    }
    
    // Get attendance records with participant details
    const { data, error } = await supabase
      .from('ace_attendance_records')
      .select(`
        *,
        participant:participant_id (
          id,
          first_name,
          last_name,
          email,
          bacb_id
        )
      `)
      .eq('event_id', eventId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    return NextResponse.json({ data: data || [] }, { status: 200 });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendance' },
      { status: 500 }
    );
  }
}

// POST /api/admin/ace/attendance - Mark attendance
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.event_id || !body.participant_id) {
      return NextResponse.json(
        { error: 'Missing required fields: event_id, participant_id' },
        { status: 400 }
      );
    }
    
    // Upsert attendance record
    const attendanceData = {
      event_id: body.event_id,
      participant_id: body.participant_id,
      verified: body.verified ?? false,
      verification_method: 'attendance_log',
      verified_at: body.verified ? new Date().toISOString() : null,
      sign_in_timestamp: body.sign_in_timestamp || null,
      sign_out_timestamp: body.sign_out_timestamp || null,
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      user_agent: request.headers.get('user-agent'),
    };
    
    const { data, error } = await supabase
      .from('ace_attendance_records')
      .upsert(attendanceData, {
        onConflict: 'event_id,participant_id',
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('Error marking attendance:', error);
    return NextResponse.json(
      { error: 'Failed to mark attendance' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/ace/attendance?id=xxx - Remove attendance record
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing required parameter: id' },
        { status: 400 }
      );
    }
    
    const { error } = await supabase
      .from('ace_attendance_records')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return NextResponse.json(
      { message: 'Attendance record deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting attendance:', error);
    return NextResponse.json(
      { error: 'Failed to delete attendance record' },
      { status: 500 }
    );
  }
}

