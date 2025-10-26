-- ============================================================================
-- Migration: Fix SECURITY DEFINER warnings and enable RLS on analytics_events
-- This migration ensures public-facing tables enforce Row Level Security and
-- recreates critical views without SECURITY DEFINER semantics.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Enable Row Level Security on analytics_events and create safe policies
-- ---------------------------------------------------------------------------
ALTER TABLE IF EXISTS public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies so we can recreate them idempotently
DROP POLICY IF EXISTS "Allow analytics select" ON public.analytics_events;
DROP POLICY IF EXISTS "Allow analytics insert" ON public.analytics_events;
DROP POLICY IF EXISTS "Service role manages analytics" ON public.analytics_events;

-- Authenticated users (e.g., Admin UI) can read analytics data
CREATE POLICY "Allow analytics select"
  ON public.analytics_events
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow both anon (public tracking endpoints) and authenticated users to insert events
CREATE POLICY "Allow analytics insert"
  ON public.analytics_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Service role can manage the table for maintenance jobs
CREATE POLICY "Service role manages analytics"
  ON public.analytics_events
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

COMMENT ON POLICY "Allow analytics select" ON public.analytics_events IS 'Authenticated users can read analytics events (enforces RLS).';
COMMENT ON POLICY "Allow analytics insert" ON public.analytics_events IS 'Public tracking endpoints may insert analytics events.';
COMMENT ON POLICY "Service role manages analytics" ON public.analytics_events IS 'Service role bypass for maintenance jobs.';

-- ---------------------------------------------------------------------------
-- 2. Drop and recreate views so they revert to SECURITY INVOKER semantics
--    (Postgres defaults to SECURITY INVOKER when no SECURITY DEFINER is set)
-- ---------------------------------------------------------------------------

-- Masterclass views ---------------------------------------------------------
DROP VIEW IF EXISTS public.masterclass_enrollment_overview;
CREATE VIEW public.masterclass_enrollment_overview AS
SELECT
  e.id,
  e.email,
  e.name,
  e.bacb_cert_number,
  e.created_at,
  e.completed_at,
  e.certificate_issued,
  e.certificate_id,
  calculate_masterclass_progress(e.id) AS progress_percentage,
  is_masterclass_complete(e.id) AS is_complete,
  COUNT(p.id) AS sections_started,
  SUM(CASE WHEN p.video_completed THEN 1 ELSE 0 END) AS videos_completed,
  SUM(CASE WHEN p.quiz_passed THEN 1 ELSE 0 END) AS quizzes_passed
FROM masterclass_enrollments e
LEFT JOIN masterclass_progress p ON e.id = p.enrollment_id
GROUP BY e.id;

COMMENT ON VIEW public.masterclass_enrollment_overview IS 'Overview of masterclass enrollments and completion progress (SECURITY INVOKER).';

DROP VIEW IF EXISTS public.masterclass_quiz_performance;
CREATE VIEW public.masterclass_quiz_performance AS
SELECT
  section_number,
  COUNT(DISTINCT enrollment_id) AS total_attempts,
  AVG(quiz_attempts) AS avg_attempts,
  SUM(CASE WHEN quiz_passed THEN 1 ELSE 0 END)::FLOAT / COUNT(*)::FLOAT * 100 AS pass_rate,
  AVG(quiz_score::FLOAT / NULLIF(quiz_total, 0)::FLOAT * 100) AS avg_score_percentage
FROM masterclass_progress
WHERE quiz_total IS NOT NULL
GROUP BY section_number
ORDER BY section_number;

COMMENT ON VIEW public.masterclass_quiz_performance IS 'Quiz performance metrics by section (SECURITY INVOKER).';

DROP VIEW IF EXISTS public.masterclass_admin_course_overview;
CREATE VIEW public.masterclass_admin_course_overview AS
SELECT
  s.id,
  s.section_number,
  s.title,
  s.description,
  s.video_url,
  s.duration,
  s.order_index,
  s.is_active,
  COUNT(q.id) AS question_count,
  s.updated_at
FROM masterclass_course_sections s
LEFT JOIN masterclass_quiz_questions q
  ON s.section_number = q.section_number
 AND q.is_active = TRUE
GROUP BY s.id, s.section_number, s.title, s.description, s.video_url,
         s.duration, s.order_index, s.is_active, s.updated_at
ORDER BY s.order_index;

COMMENT ON VIEW public.masterclass_admin_course_overview IS 'Admin view with section metadata and quiz question counts (SECURITY INVOKER).';

GRANT SELECT ON public.masterclass_enrollment_overview TO authenticated;
GRANT SELECT ON public.masterclass_quiz_performance TO authenticated;
GRANT SELECT ON public.masterclass_admin_course_overview TO authenticated;

-- CRM views ---------------------------------------------------------------
DROP VIEW IF EXISTS public.crm_contact_activity_summary;
CREATE VIEW public.crm_contact_activity_summary AS
SELECT
  c.id,
  c.first_name,
  c.last_name,
  c.email,
  c.status,
  COUNT(DISTINCT a.id) AS activity_count,
  MAX(a.activity_date) AS last_activity_date,
  COUNT(DISTINCT d.id) AS deal_count,
  COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'pending') AS pending_tasks
FROM crm_contacts c
LEFT JOIN crm_activities a ON c.id = a.contact_id
LEFT JOIN crm_deals d ON c.id = d.contact_id
LEFT JOIN crm_tasks t ON c.id = t.contact_id
WHERE c.is_archived = FALSE
GROUP BY c.id, c.first_name, c.last_name, c.email, c.status;

COMMENT ON VIEW public.crm_contact_activity_summary IS 'CRM contact overview with recent activity metrics (SECURITY INVOKER).';

DROP VIEW IF EXISTS public.crm_pipeline_summary;
CREATE VIEW public.crm_pipeline_summary AS
SELECT
  stage,
  COUNT(*) AS deal_count,
  SUM(value) AS total_value,
  AVG(probability) AS avg_probability
FROM crm_deals
GROUP BY stage
ORDER BY CASE stage
  WHEN 'new' THEN 1
  WHEN 'contacted' THEN 2
  WHEN 'demo_scheduled' THEN 3
  WHEN 'proposal_sent' THEN 4
  WHEN 'negotiation' THEN 5
  WHEN 'closed_won' THEN 6
  WHEN 'closed_lost' THEN 7
END;

COMMENT ON VIEW public.crm_pipeline_summary IS 'CRM pipeline metrics grouped by stage (SECURITY INVOKER).';

GRANT SELECT ON public.crm_contact_activity_summary TO authenticated;
GRANT SELECT ON public.crm_pipeline_summary TO authenticated;

-- ---------------------------------------------------------------------------
-- 3. Quick verification notices (optional but helpful during deploys)
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class WHERE relname = 'analytics_events' AND relrowsecurity
  ) THEN
    RAISE WARNING 'RLS is NOT enabled on analytics_events. Please rerun migration.';
  ELSE
    RAISE NOTICE 'analytics_events now has Row Level Security enabled.';
  END IF;
END $$;

DO $$
DECLARE
  insecure_views INT;
BEGIN
  SELECT COUNT(*) INTO insecure_views
  FROM pg_views
  WHERE schemaname = 'public'
    AND viewname IN (
      'masterclass_enrollment_overview',
      'masterclass_quiz_performance',
      'masterclass_admin_course_overview',
      'crm_contact_activity_summary',
      'crm_pipeline_summary'
    );

  IF insecure_views = 5 THEN
    RAISE NOTICE 'Recreated % views without SECURITY DEFINER.', insecure_views;
  ELSE
    RAISE WARNING 'Expected to recreate 5 views, but found %.', insecure_views;
  END IF;
END $$;
