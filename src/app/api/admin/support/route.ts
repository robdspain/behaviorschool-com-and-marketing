import { NextRequest, NextResponse } from 'next/server';
import { AdminAuthError, verifyAdminAuth } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

type SupportStatus =
  | 'new'
  | 'triaged'
  | 'waiting_on_support'
  | 'waiting_on_customer'
  | 'bug_logged'
  | 'resolved'
  | 'closed'
  | 'spam';
type SupportPriority = 'low' | 'normal' | 'high' | 'urgent';
type SupportEventType = 'status_changed' | 'priority_changed' | 'note_added' | 'reply_logged' | 'bug_linked';

const statuses = new Set<SupportStatus>([
  'new',
  'triaged',
  'waiting_on_support',
  'waiting_on_customer',
  'bug_logged',
  'resolved',
  'closed',
  'spam',
]);
const priorities = new Set<SupportPriority>(['low', 'normal', 'high', 'urgent']);
const eventTypes = new Set<SupportEventType>([
  'status_changed',
  'priority_changed',
  'note_added',
  'reply_logged',
  'bug_linked',
]);

function authErrorResponse(error: unknown) {
  if (error instanceof AdminAuthError) {
    return NextResponse.json({ error: error.message }, { status: error.statusCode });
  }
  return NextResponse.json({ error: 'Admin authentication failed' }, { status: 500 });
}

function unavailableResponse() {
  return NextResponse.json(
    {
      error: 'The central support queue is not configured yet.',
      detail: 'Set SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY on the Behavior School deployment.',
    },
    { status: 503 },
  );
}

export async function GET(request: NextRequest) {
  try {
    await verifyAdminAuth(request);
  } catch (error) {
    return authErrorResponse(error);
  }

  if (!supabaseAdmin) return unavailableResponse();

  const ticketId = request.nextUrl.searchParams.get('ticketId');
  if (ticketId) {
    const { data, error } = await supabaseAdmin
      .from('support_ticket_events')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Central support event query failed:', error);
      return NextResponse.json({ error: 'Unable to load ticket history' }, { status: 500 });
    }

    return NextResponse.json({ events: data || [] }, { headers: { 'Cache-Control': 'no-store' } });
  }

  const { data, error } = await supabaseAdmin
    .from('support_tickets')
    .select('*')
    .order('last_customer_message_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) {
    console.error('Central support ticket query failed:', error);
    return NextResponse.json({ error: 'Unable to load support tickets' }, { status: 500 });
  }

  return NextResponse.json({ tickets: data || [] }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function PATCH(request: NextRequest) {
  let admin;
  try {
    admin = await verifyAdminAuth(request);
  } catch (error) {
    return authErrorResponse(error);
  }

  if (!supabaseAdmin) return unavailableResponse();

  try {
    const body = await request.json();
    const ticketId = typeof body.ticketId === 'string' ? body.ticketId : '';
    const rawPatch = body.patch && typeof body.patch === 'object' ? body.patch : {};
    const eventType = body.eventType as SupportEventType | undefined;

    if (!ticketId) {
      return NextResponse.json({ error: 'ticketId is required' }, { status: 400 });
    }
    if (eventType && !eventTypes.has(eventType)) {
      return NextResponse.json({ error: 'Unsupported support event type' }, { status: 400 });
    }

    const patch: Record<string, unknown> = {};
    const allowedKeys = ['status', 'priority', 'product_area', 'internal_notes', 'last_response_at'] as const;
    for (const key of allowedKeys) {
      if (Object.prototype.hasOwnProperty.call(rawPatch, key)) patch[key] = rawPatch[key];
    }

    if (patch.status !== undefined && (typeof patch.status !== 'string' || !statuses.has(patch.status as SupportStatus))) {
      return NextResponse.json({ error: 'Unsupported support status' }, { status: 400 });
    }
    if (patch.priority !== undefined && (typeof patch.priority !== 'string' || !priorities.has(patch.priority as SupportPriority))) {
      return NextResponse.json({ error: 'Unsupported support priority' }, { status: 400 });
    }
    if (patch.product_area !== undefined && typeof patch.product_area !== 'string') {
      return NextResponse.json({ error: 'product_area must be a string' }, { status: 400 });
    }
    if (patch.internal_notes !== undefined && typeof patch.internal_notes !== 'string') {
      return NextResponse.json({ error: 'internal_notes must be a string' }, { status: 400 });
    }
    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: 'No supported ticket changes were supplied' }, { status: 400 });
    }

    const { data: ticket, error: updateError } = await supabaseAdmin
      .from('support_tickets')
      .update(patch)
      .eq('id', ticketId)
      .select('*')
      .single();

    if (updateError) {
      console.error('Central support ticket update failed:', updateError);
      return NextResponse.json({ error: 'Unable to update support ticket' }, { status: 500 });
    }

    if (eventType) {
      const { error: eventError } = await supabaseAdmin.from('support_ticket_events').insert({
        ticket_id: ticketId,
        actor_type: 'admin',
        actor_email: admin.email,
        event_type: eventType,
        body: eventType === 'note_added' ? String(patch.internal_notes || '') : null,
        metadata: patch,
      });

      if (eventError) {
        console.error('Central support event insert failed:', eventError);
        return NextResponse.json({ ticket, warning: 'Ticket updated, but history entry failed' });
      }
    }

    return NextResponse.json({ ticket });
  } catch (error) {
    console.error('Central support update request failed:', error);
    return NextResponse.json({ error: 'Invalid support update request' }, { status: 400 });
  }
}
