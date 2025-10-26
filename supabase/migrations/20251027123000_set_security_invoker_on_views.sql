-- ==========================================================================
-- Migration: Ensure critical views use SECURITY INVOKER semantics
-- ==========================================================================
-- Supabase rule 0010 warns when a view executes with the definer's privileges.
-- PostgreSQL 15 introduces the security_invoker attribute for views so that
-- queries run as the caller rather than the view owner. This migration updates
-- the five public views flagged by the linter to explicitly enable
-- security_invoker.
-- ==========================================================================

ALTER VIEW public.masterclass_enrollment_overview SET (security_invoker = true);
ALTER VIEW public.masterclass_quiz_performance SET (security_invoker = true);
ALTER VIEW public.masterclass_admin_course_overview SET (security_invoker = true);
ALTER VIEW public.crm_contact_activity_summary SET (security_invoker = true);
ALTER VIEW public.crm_pipeline_summary SET (security_invoker = true);

DO $$
DECLARE
  remaining INT;
BEGIN
  SELECT COUNT(*) INTO remaining
  FROM pg_views
  WHERE schemaname = 'public'
    AND viewname IN (
      'masterclass_enrollment_overview',
      'masterclass_quiz_performance',
      'masterclass_admin_course_overview',
      'crm_contact_activity_summary',
      'crm_pipeline_summary'
    )
    AND security_invoker = false;

  IF remaining = 0 THEN
    RAISE NOTICE 'All five admin/CRM views now use SECURITY INVOKER.';
  ELSE
    RAISE WARNING '% view(s) still lack SECURITY INVOKER. Re-run migration.', remaining;
  END IF;
END $$;
