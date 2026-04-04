import type { NextRequest } from 'next/server';
import { getConvexClient } from '@/lib/convex';

export type AuditLogCategory = 'auth' | 'student_data' | 'admin_action';

export type AuditLogEntry = {
  category: AuditLogCategory;
  actionType: string;
  resource: string;
  status: 'success' | 'failure';
  actorUserId?: string;
  actorEmail?: string;
  resourceId?: string;
  method?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: unknown;
};

function getRequestIp(request: Request | NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim();
  }

  return request.headers.get('x-real-ip') ?? undefined;
}

export async function recordAuditEvent(entry: AuditLogEntry) {
  try {
    await getConvexClient().mutation('audit:logEvent', {
      ...entry,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('[audit] Failed to record audit event', error);
  }
}

export async function recordRequestAuditEvent(request: Request | NextRequest, entry: AuditLogEntry) {
  await recordAuditEvent({
    ...entry,
    method: entry.method ?? request.method,
    ipAddress: entry.ipAddress ?? getRequestIp(request),
    userAgent: entry.userAgent ?? request.headers.get('user-agent') ?? undefined,
  });
}
