/**
 * FERPA-Compliant Audit Logger
 * BEH-309: Implements audit controls L1, L2, L3 from FERPA technical checklist (BEH-169).
 *
 * L1 — logDataAccess: every read/write/delete on Student Data with user ID + timestamp
 * L2 — logAuthEvent: auth events (login success/failure, password changes)
 * L3 — logAdminAction: admin actions (user creation, role changes, data exports)
 *
 * Uses supabaseAdmin (service role) so logs bypass RLS and are tamper-resistant.
 * Writes are fire-and-forget to avoid adding latency to request handlers.
 */

import { supabaseAdmin } from './supabase-admin';
import { NextRequest } from 'next/server';

// ============================================================================
// Types
// ============================================================================

export type AuditAction =
  // L1: Student data access
  | 'READ'
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  // L2: Auth events
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILURE'
  | 'LOGOUT'
  | 'PASSWORD_CHANGE'
  // L3: Admin actions
  | 'ROLE_CHANGE'
  | 'DATA_EXPORT'
  | 'ADMIN_CREATE_USER'
  | 'ADMIN_UPDATE_USER'
  | 'ADMIN_DEACTIVATE_USER';

export type ResourceType =
  | 'ace_users'
  | 'ace_registrations'
  | 'ace_certificates'
  | 'ace_attendance_records'
  | 'ace_quiz_submissions'
  | 'ace_feedback_responses'
  | 'ace_events'
  | 'ace_providers'
  | 'ace_complaints'
  | 'auth_session';

interface BaseAuditParams {
  actorId?: string;
  actorEmail?: string;
  actorRole?: string;
  success?: boolean;
  httpStatus?: number;
  errorMessage?: string;
  ipAddress?: string;
  userAgent?: string;
  requestPath?: string;
  httpMethod?: string;
  reasonForAccess?: string;
}

export interface DataAccessParams extends BaseAuditParams {
  action: 'READ' | 'CREATE' | 'UPDATE' | 'DELETE';
  resourceType: ResourceType;
  resourceId?: string;
  studentId?: string;
  studentEmail?: string;
  changesBefore?: Record<string, unknown>;
  changesAfter?: Record<string, unknown>;
}

export interface AuthEventParams extends BaseAuditParams {
  action: 'LOGIN_SUCCESS' | 'LOGIN_FAILURE' | 'LOGOUT' | 'PASSWORD_CHANGE';
  actorEmail: string;
}

export interface AdminActionParams extends BaseAuditParams {
  action: 'ROLE_CHANGE' | 'DATA_EXPORT' | 'ADMIN_CREATE_USER' | 'ADMIN_UPDATE_USER' | 'ADMIN_DEACTIVATE_USER';
  resourceType: ResourceType;
  resourceId?: string;
  studentId?: string;
  studentEmail?: string;
  changesBefore?: Record<string, unknown>;
  changesAfter?: Record<string, unknown>;
}

interface AuditLogRow {
  actor_id?: string;
  actor_email?: string;
  actor_role?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  student_id?: string;
  student_email?: string;
  changes_before?: Record<string, unknown>;
  changes_after?: Record<string, unknown>;
  success: boolean;
  http_status?: number;
  error_message?: string;
  ip_address?: string;
  user_agent?: string;
  request_path?: string;
  http_method?: string;
  ferpa_sensitive: boolean;
  reason_for_access?: string;
}

// ============================================================================
// Internal write function
// ============================================================================

function writeAuditLog(row: AuditLogRow): void {
  if (!supabaseAdmin) {
    // Supabase admin client not configured — log to console as fallback
    console.warn('[AUDIT-FALLBACK]', JSON.stringify(row));
    return;
  }

  // Fire-and-forget: intentionally not awaited so callers are not slowed down.
  // Errors are logged to console for monitoring pickup.
  supabaseAdmin
    .from('audit_logs')
    .insert(row)
    .then(({ error }) => {
      if (error) {
        console.error('[AUDIT-ERROR] Failed to write audit log:', error.message, JSON.stringify(row));
      }
    });
}

// ============================================================================
// Helper to extract request metadata
// ============================================================================

export function extractRequestMeta(request: NextRequest): Pick<BaseAuditParams, 'ipAddress' | 'userAgent' | 'requestPath' | 'httpMethod'> {
  return {
    ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0].trim()
      ?? request.headers.get('x-real-ip')
      ?? undefined,
    userAgent: request.headers.get('user-agent') ?? undefined,
    requestPath: request.nextUrl.pathname,
    httpMethod: request.method,
  };
}

// ============================================================================
// L1: Student data access logging
// ============================================================================

/**
 * Log a student data access event (L1).
 * Call this whenever student data is read, created, updated, or deleted.
 */
export function logDataAccess(params: DataAccessParams): void {
  writeAuditLog({
    actor_id: params.actorId,
    actor_email: params.actorEmail,
    actor_role: params.actorRole,
    action: params.action,
    resource_type: params.resourceType,
    resource_id: params.resourceId,
    student_id: params.studentId,
    student_email: params.studentEmail,
    changes_before: params.changesBefore,
    changes_after: params.changesAfter,
    success: params.success ?? true,
    http_status: params.httpStatus,
    error_message: params.errorMessage,
    ip_address: params.ipAddress,
    user_agent: params.userAgent,
    request_path: params.requestPath,
    http_method: params.httpMethod,
    ferpa_sensitive: true,
    reason_for_access: params.reasonForAccess,
  });
}

// ============================================================================
// L2: Auth event logging
// ============================================================================

/**
 * Log an authentication event (L2).
 * Call this for login attempts, logouts, and password changes.
 */
export function logAuthEvent(params: AuthEventParams): void {
  writeAuditLog({
    actor_id: params.actorId,
    actor_email: params.actorEmail,
    actor_role: params.actorRole ?? 'unknown',
    action: params.action,
    resource_type: 'auth_session',
    success: params.success ?? true,
    http_status: params.httpStatus,
    error_message: params.errorMessage,
    ip_address: params.ipAddress,
    user_agent: params.userAgent,
    request_path: params.requestPath,
    http_method: params.httpMethod,
    ferpa_sensitive: false, // Auth events don't directly contain student PII
  });
}

// ============================================================================
// L3: Admin action logging
// ============================================================================

/**
 * Log an administrative action (L3).
 * Call this for user creation, role changes, and data exports.
 */
export function logAdminAction(params: AdminActionParams): void {
  writeAuditLog({
    actor_id: params.actorId,
    actor_email: params.actorEmail,
    actor_role: params.actorRole ?? 'admin',
    action: params.action,
    resource_type: params.resourceType,
    resource_id: params.resourceId,
    student_id: params.studentId,
    student_email: params.studentEmail,
    changes_before: params.changesBefore,
    changes_after: params.changesAfter,
    success: params.success ?? true,
    http_status: params.httpStatus,
    error_message: params.errorMessage,
    ip_address: params.ipAddress,
    user_agent: params.userAgent,
    request_path: params.requestPath,
    http_method: params.httpMethod,
    ferpa_sensitive: true,
    reason_for_access: params.reasonForAccess,
  });
}
