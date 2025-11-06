-- ============================================================================
-- Migration: Harden function search_path + restrict materialized views
-- ============================================================================
-- Addresses Supabase warnings for mutable search_path and public materialized
-- views exposed to anon/authenticated roles.
-- ============================================================================

-- 1. Force safe search_path on key helper functions
DO $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN
    SELECT p.oid::regprocedure AS func_ident
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname = ANY (ARRAY[
        'update_download_submissions_updated_at',
        'update_analytics_events_updated_at',
        'get_or_create_enrollment',
        'update_masterclass_updated_at',
        'update_updated_at_column',
        'is_masterclass_complete',
        'calculate_masterclass_progress',
        'generate_certificate_id',
        'update_masterclass_admin_updated_at',
        'enqueue_broadcast'
      ])
  LOOP
    EXECUTE format(
      'ALTER FUNCTION %s SET search_path = public, pg_temp;',
      rec.func_ident
    );
  END LOOP;

  FOR rec IN
    SELECT p.oid::regprocedure AS func_ident
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'listmonk'
      AND p.proname = 'varchar_to_list_optin'
  LOOP
    EXECUTE format(
      'ALTER FUNCTION %s SET search_path = listmonk, public, pg_temp;',
      rec.func_ident
    );
  END LOOP;
END $$;

-- 2. Restrict materialized views from anon/authenticated API roles
DO $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN
    SELECT format('%I.%I', schemaname, matviewname) AS matview_name
    FROM pg_matviews
    WHERE schemaname = 'public'
      AND matviewname IN (
        'mat_dashboard_counts',
        'mat_dashboard_charts',
        'mat_list_subscriber_stats'
      )
  LOOP
    EXECUTE format('REVOKE ALL ON MATERIALIZED VIEW %s FROM anon, authenticated;', rec.matview_name);
    EXECUTE format('GRANT SELECT ON MATERIALIZED VIEW %s TO service_role;', rec.matview_name);
  END LOOP;
END $$;
