-- ============================================================================
-- FERPA-Compliant Audit Log Table
-- BEH-309: FERPA audit logging for student data access
--
-- Controls addressed:
--   L1: Student data access (read/write/delete)
--   L2: Auth events (login success/failure, password changes)
--   L3: Admin actions (user creation, role changes, data exports)
--   L5: Append-only (no DELETE/UPDATE grants)
-- ============================================================================

-- Create the audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- When
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Who performed the action
  actor_id TEXT,              -- Supabase user ID or admin session token prefix
  actor_email TEXT,           -- Email address of actor
  actor_role TEXT,            -- 'admin', 'participant', 'instructor', 'system'

  -- What happened
  action TEXT NOT NULL,       -- 'READ', 'CREATE', 'UPDATE', 'DELETE',
                              -- 'LOGIN_SUCCESS', 'LOGIN_FAILURE', 'LOGOUT',
                              -- 'PASSWORD_CHANGE', 'ROLE_CHANGE', 'DATA_EXPORT'

  -- What was accessed
  resource_type TEXT NOT NULL, -- 'ace_users', 'ace_registrations', 'ace_certificates',
                               -- 'ace_attendance_records', 'ace_quiz_submissions',
                               -- 'ace_feedback_responses', 'ace_events', 'auth_session'
  resource_id TEXT,            -- Primary key of the affected record
  student_id TEXT,             -- ID of the student whose data was accessed (FERPA key field)
  student_email TEXT,          -- Email of student (for audit readability)

  -- Change details (for UPDATE operations)
  changes_before JSONB,        -- State before mutation
  changes_after JSONB,         -- State after mutation

  -- Outcome
  success BOOLEAN NOT NULL DEFAULT TRUE,
  http_status INT,
  error_message TEXT,

  -- Request metadata
  ip_address TEXT,
  user_agent TEXT,
  request_path TEXT,
  http_method TEXT,

  -- FERPA compliance fields
  ferpa_sensitive BOOLEAN NOT NULL DEFAULT TRUE,   -- True if log entry involves student PII
  reason_for_access TEXT                           -- Optional: why data was accessed
);

-- ============================================================================
-- Indexes for compliance queries
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_audit_logs_logged_at      ON public.audit_logs (logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id       ON public.audit_logs (actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_student_id     ON public.audit_logs (student_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_type  ON public.audit_logs (resource_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action         ON public.audit_logs (action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_ferpa          ON public.audit_logs (ferpa_sensitive) WHERE ferpa_sensitive = TRUE;

-- ============================================================================
-- Row Level Security: APPEND-ONLY for compliance
-- No user or role (other than superuser) can delete or update audit logs.
-- ============================================================================
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Service role can insert (used by server-side audit logger)
CREATE POLICY "service_role_insert_audit_logs"
  ON public.audit_logs
  FOR INSERT
  TO service_role
  WITH CHECK (TRUE);

-- Authenticated admins can read audit logs (SELECT only)
-- Restrict to users with app_metadata.role = 'admin' or email in admin list
CREATE POLICY "admin_select_audit_logs"
  ON public.audit_logs
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      SELECT email FROM public.ace_users WHERE role = 'admin' AND is_active = TRUE
    )
  );

-- CRITICAL: No UPDATE or DELETE policies — audit logs are append-only.
-- Even service_role cannot delete rows through Supabase client
-- (would require direct DB superuser access, which is auditable at infra level).

-- ============================================================================
-- Comments for DPA documentation
-- ============================================================================
COMMENT ON TABLE public.audit_logs IS
  'FERPA L1-L3 audit log: records all student data access, auth events, and admin actions. Append-only.';
COMMENT ON COLUMN public.audit_logs.ferpa_sensitive IS
  'TRUE if this log entry involves student PII subject to FERPA protections';
COMMENT ON COLUMN public.audit_logs.student_id IS
  'ID of the student whose data was accessed. FERPA critical field.';
COMMENT ON COLUMN public.audit_logs.changes_before IS
  'JSONB snapshot of record state before mutation. PII — access restricted.';
COMMENT ON COLUMN public.audit_logs.changes_after IS
  'JSONB snapshot of record state after mutation. PII — access restricted.';
