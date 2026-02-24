export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { generateCertificateNumber } from '@/lib/ace/certificate-generator';

// GET /api/admin/ace/certificates?event_id=xxx - Get certificates for an event
// GET /api/admin/ace/certificates?participant_id=xxx - Get certificates for a participant
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { session } } = await getSupabase().auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('event_id');
    const participantId = searchParams.get('participant_id');
    
    let query = getSupabase().from('ace_certificates').select('*');
    
    if (eventId) {
      query = query.eq('event_id', eventId);
    }
    
    if (participantId) {
      query = query.eq('participant_id', participantId);
    }
    
    const { data, error } = await query.order('issued_at', { ascending: false });
    
    if (error) throw error;
    
    return NextResponse.json({ data: data || [] }, { status: 200 });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch certificates' },
      { status: 500 }
    );
  }
}

// POST /api/admin/ace/certificates - Generate a certificate
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
    if (!body.event_id || !body.participant_id) {
      return NextResponse.json(
        { error: 'Missing required fields: event_id, participant_id' },
        { status: 400 }
      );
    }
    
    // Check if certificate already exists
    const { data: existing } = await supabase
      .from('ace_certificates')
      .select('*')
      .eq('event_id', body.event_id)
      .eq('participant_id', body.participant_id)
      .maybeSingle();
    
    if (existing) {
      return NextResponse.json(
        { error: 'Certificate already exists for this participant and event' },
        { status: 400 }
      );
    }
    
    // Get event details
    const { data: event, error: eventError } = await supabase
      .from('ace_events')
      .select('*')
      .eq('id', body.event_id)
      .single();
    
    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    // Get participant details
    const { data: participant, error: participantError } = await supabase
      .from('ace_users')
      .select('*')
      .eq('id', body.participant_id)
      .single();
    
    if (participantError || !participant) {
      return NextResponse.json(
        { error: 'Participant not found' },
        { status: 404 }
      );
    }
    
    // Verify attendance
    const { data: attendance } = await supabase
      .from('ace_attendance_records')
      .select('*')
      .eq('event_id', body.event_id)
      .eq('participant_id', body.participant_id)
      .eq('verified', true)
      .maybeSingle();
    
    if (!attendance) {
      return NextResponse.json(
        { error: 'Participant must have attended the event to receive a certificate' },
        { status: 400 }
      );
    }
    
    // Generate certificate
    const certificateData = {
      event_id: body.event_id,
      participant_id: body.participant_id,
      certificate_number: generateCertificateNumber(),
      participant_name: `${participant.first_name} ${participant.last_name}`,
      participant_email: participant.email,
      participant_bacb_id: participant.bacb_id,
      event_title: event.title,
      event_date: event.start_date,
      instructor_name: body.instructor_name || 'Rob Spain, M.S., BCBA, IBA',
      total_ceus: event.total_ceus,
      ce_category: event.ce_category,
      status: 'issued',
      issued_at: new Date().toISOString(),
    };
    
    const { data: certificate, error: certError } = await supabase
      .from('ace_certificates')
      .insert([certificateData])
      .select()
      .single();
    
    if (certError) throw certError;
    
    return NextResponse.json({ data: certificate }, { status: 201 });
  } catch (error) {
    console.error('Error generating certificate:', error);
    return NextResponse.json(
      { error: 'Failed to generate certificate' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/ace/certificates?id=xxx - Revoke a certificate
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { session } } = await getSupabase().auth.getSession();
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
    
    // Update status to revoked instead of deleting
    const { data, error } = await supabase
      .from('ace_certificates')
      .update({
        status: 'revoked',
        revoked_at: new Date().toISOString(),
        revoked_by: session.user.id,
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json(
      { message: 'Certificate revoked successfully', data },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error revoking certificate:', error);
    return NextResponse.json(
      { error: 'Failed to revoke certificate' },
      { status: 500 }
    );
  }
}

