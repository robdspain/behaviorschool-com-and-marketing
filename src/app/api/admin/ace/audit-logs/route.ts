/**
 * GET /api/admin/ace/audit-logs
 * Query FERPA audit logs (L6: monthly log review)
 *
 * FERPA compliance note: Access to this endpoint is itself audit-logged.
 * Only admin sessions may query logs.
 *
 * Query params:
 *   start_date  — ISO date string (default: 30 days ago)
 *   end_date    — ISO date string (default: now)
 *   actor_id    — filter by actor
 *   resource_type — filter by resource type
 *   action      — filter by action (READ, CREATE, UPDATE, etc.)
 *   student_id  — filter by student
 *   ferpa_only  — 'true' to return only ferpa_sensitive=true entries
 *   limit       — max rows (default 100, max 1000)
 *   offset      — pagination offset
 */
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { logDataAccess, extractRequestMeta } from '@/lib/audit-logger';

export async function GET(request: NextRequest) {
  const requestMeta = extractRequestMeta(request);

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Audit log service unavailable' }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);

  const startDate = searchParams.get('start_date')
    ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const endDate = searchParams.get('end_date') ?? new Date().toISOString();
  const actorId = searchParams.get('actor_id');
  const resourceType = searchParams.get('resource_type');
  const action = searchParams.get('action');
  const studentId = searchParams.get('student_id');
  const ferpaOnly = searchParams.get('ferpa_only') === 'true';
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '100', 10), 1000);
  const offset = parseInt(searchParams.get('offset') ?? '0', 10);

  let query = supabaseAdmin
    .from('audit_logs')
    .select('*', { count: 'exact' })
    .gte('logged_at', startDate)
    .lte('logged_at', endDate)
    .order('logged_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (actorId) query = query.eq('actor_id', actorId);
  if (resourceType) query = query.eq('resource_type', resourceType);
  if (action) query = query.eq('action', action);
  if (studentId) query = query.eq('student_id', studentId);
  if (ferpaOnly) query = query.eq('ferpa_sensitive', true);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error querying audit logs:', error);
    return NextResponse.json({ error: 'Failed to query audit logs' }, { status: 500 });
  }

  // L6: Log the audit log review itself (meta-audit)
  logDataAccess({
    action: 'READ',
    resourceType: 'ace_users', // closest resource type for admin activity
    success: true,
    httpStatus: 200,
    reasonForAccess: 'ferpa_log_review',
    ...requestMeta,
  });

  return NextResponse.json({
    data,
    count,
    pagination: { limit, offset },
    filters: { startDate, endDate, actorId, resourceType, action, studentId, ferpaOnly },
  });
}
