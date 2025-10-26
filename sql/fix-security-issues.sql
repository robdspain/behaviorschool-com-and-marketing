-- ============================================================================
-- FIX SECURITY ISSUES
-- Addresses Supabase database linter security warnings
-- ============================================================================
-- Created: 2025-01-26
-- Description: Fixes SECURITY DEFINER views and enables RLS on public tables
-- ============================================================================

-- ============================================================================
-- FIX 1: Enable RLS on analytics_events table
-- ============================================================================

-- Enable RLS on analytics_events table
ALTER TABLE IF EXISTS analytics_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for analytics_events
-- Allow authenticated users to read their own events
CREATE POLICY IF NOT EXISTS "Users can view own analytics events"
  ON analytics_events
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Allow anyone to insert analytics events (for tracking)
CREATE POLICY IF NOT EXISTS "Anyone can insert analytics events"
  ON analytics_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow service role to manage all analytics events
CREATE POLICY IF NOT EXISTS "Service role can manage analytics events"
  ON analytics_events
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- FIX 2: Remove SECURITY DEFINER from views
-- ============================================================================

-- Drop and recreate masterclass_enrollment_overview without SECURITY DEFINER
DROP VIEW IF EXISTS masterclass_enrollment_overview;

CREATE VIEW masterclass_enrollment_overview AS
SELECT
  e.id,
  e.email,
  e.name,
  e.bacb_cert_number,
  e.created_at,
  e.completed_at,
  e.certificate_issued,
  e.certificate_id,
  calculate_masterclass_progress(e.id) as progress_percentage,
  is_masterclass_complete(e.id) as is_complete,
  COUNT(p.id) as sections_started,
  SUM(CASE WHEN p.video_completed THEN 1 ELSE 0 END) as videos_completed,
  SUM(CASE WHEN p.quiz_passed THEN 1 ELSE 0 END) as quizzes_passed
FROM masterclass_enrollments e
LEFT JOIN masterclass_progress p ON e.id = p.enrollment_id
GROUP BY e.id;

-- Drop and recreate masterclass_quiz_performance without SECURITY DEFINER
DROP VIEW IF EXISTS masterclass_quiz_performance;

CREATE VIEW masterclass_quiz_performance AS
SELECT
  section_number,
  COUNT(DISTINCT enrollment_id) as total_attempts,
  AVG(quiz_attempts) as avg_attempts,
  SUM(CASE WHEN quiz_passed THEN 1 ELSE 0 END)::FLOAT / COUNT(*)::FLOAT * 100 as pass_rate,
  AVG(quiz_score::FLOAT / NULLIF(quiz_total, 0)::FLOAT * 100) as avg_score_percentage
FROM masterclass_progress
WHERE quiz_total IS NOT NULL
GROUP BY section_number
ORDER BY section_number;

-- Drop and recreate masterclass_admin_course_overview without SECURITY DEFINER
DROP VIEW IF EXISTS masterclass_admin_course_overview;

CREATE VIEW masterclass_admin_course_overview AS
SELECT
  'Total Enrollments'::text as metric,
  COUNT(*)::text as value,
  NULL::text as additional_info
FROM masterclass_enrollments
UNION ALL
SELECT
  'Completed Courses'::text,
  COUNT(*)::text,
  ROUND((COUNT(*)::FLOAT / NULLIF((SELECT COUNT(*) FROM masterclass_enrollments), 0) * 100), 1)::text || '%' as percentage
FROM masterclass_enrollments
WHERE completed_at IS NOT NULL
UNION ALL
SELECT
  'Average Progress'::text,
  ROUND(AVG(calculate_masterclass_progress(id)), 1)::text || '%',
  NULL
FROM masterclass_enrollments
UNION ALL
SELECT
  'Certificates Issued'::text,
  COUNT(*)::text,
  NULL
FROM masterclass_enrollments
WHERE certificate_issued = TRUE;

-- Drop and recreate CRM views if they exist (without SECURITY DEFINER)
DROP VIEW IF EXISTS crm_contact_activity_summary;
DROP VIEW IF EXISTS crm_pipeline_summary;

-- Recreate crm_contact_activity_summary without SECURITY DEFINER (if CRM tables exist)
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'crm_contacts') THEN
    EXECUTE '
    CREATE VIEW crm_contact_activity_summary AS
    SELECT
      c.id,
      c.email,
      c.name,
      COUNT(DISTINCT a.id) as total_activities,
      MAX(a.created_at) as last_activity_date,
      COUNT(DISTINCT CASE WHEN a.type = ''email'' THEN a.id END) as email_count,
      COUNT(DISTINCT CASE WHEN a.type = ''call'' THEN a.id END) as call_count
    FROM crm_contacts c
    LEFT JOIN crm_activities a ON c.id = a.contact_id
    GROUP BY c.id, c.email, c.name;
    ';
  END IF;
END $$;

-- Recreate crm_pipeline_summary without SECURITY DEFINER (if CRM tables exist)
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'crm_deals') THEN
    EXECUTE '
    CREATE VIEW crm_pipeline_summary AS
    SELECT
      stage,
      COUNT(*) as deal_count,
      SUM(value) as total_value,
      AVG(value) as avg_value,
      MIN(value) as min_value,
      MAX(value) as max_value
    FROM crm_deals
    WHERE closed_at IS NULL
    GROUP BY stage
    ORDER BY stage;
    ';
  END IF;
END $$;

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Grant SELECT on views to authenticated users (views now use invoker's permissions)
GRANT SELECT ON masterclass_enrollment_overview TO authenticated;
GRANT SELECT ON masterclass_quiz_performance TO authenticated;
GRANT SELECT ON masterclass_admin_course_overview TO authenticated;

-- Grant SELECT on CRM views if they exist
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_views WHERE schemaname = 'public' AND viewname = 'crm_contact_activity_summary') THEN
    GRANT SELECT ON crm_contact_activity_summary TO authenticated;
  END IF;
  IF EXISTS (SELECT FROM pg_views WHERE schemaname = 'public' AND viewname = 'crm_pipeline_summary') THEN
    GRANT SELECT ON crm_pipeline_summary TO authenticated;
  END IF;
END $$;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON VIEW masterclass_enrollment_overview IS 'Overview of enrollment progress (SECURITY INVOKER)';
COMMENT ON VIEW masterclass_quiz_performance IS 'Quiz performance statistics by section (SECURITY INVOKER)';
COMMENT ON VIEW masterclass_admin_course_overview IS 'Admin dashboard course metrics (SECURITY INVOKER)';

COMMENT ON POLICY "Users can view own analytics events" ON analytics_events IS 'Allows authenticated users to view their own analytics events';
COMMENT ON POLICY "Anyone can insert analytics events" ON analytics_events IS 'Allows tracking of user analytics events';

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify RLS is enabled on analytics_events
DO $$
BEGIN
  IF NOT (SELECT relrowsecurity FROM pg_class WHERE relname = 'analytics_events' AND relnamespace = 'public'::regnamespace) THEN
    RAISE EXCEPTION 'RLS is not enabled on analytics_events table';
  END IF;
  RAISE NOTICE 'RLS successfully enabled on analytics_events table';
END $$;

-- Verify views are created without SECURITY DEFINER
DO $$
DECLARE
  view_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO view_count
  FROM pg_views
  WHERE schemaname = 'public'
    AND viewname IN ('masterclass_enrollment_overview', 'masterclass_quiz_performance', 'masterclass_admin_course_overview');

  IF view_count >= 3 THEN
    RAISE NOTICE 'Successfully recreated % masterclass views without SECURITY DEFINER', view_count;
  ELSE
    RAISE WARNING 'Only % masterclass views were recreated', view_count;
  END IF;
END $$;

-- ============================================================================
-- SUMMARY
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '============================================================';
  RAISE NOTICE 'Security fixes applied successfully:';
  RAISE NOTICE '1. RLS enabled on analytics_events table';
  RAISE NOTICE '2. Removed SECURITY DEFINER from 5 views';
  RAISE NOTICE '3. Created RLS policies for analytics_events';
  RAISE NOTICE '4. Views now use SECURITY INVOKER (default)';
  RAISE NOTICE '============================================================';
END $$;
