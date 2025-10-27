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
BEGIN
  RAISE NOTICE 'Applied SECURITY INVOKER settings to admin/CRM views.';
END $$;
