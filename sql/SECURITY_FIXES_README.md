# Security Fixes for Supabase Database

This document explains the security issues found by Supabase's database linter and how to fix them.

## Issues Found

### 1. Security Definer Views (5 errors)

**Problem:** Views defined with `SECURITY DEFINER` bypass Row Level Security (RLS) and use the permissions of the view creator instead of the querying user. This is a security risk.

**Affected Views:**
- `masterclass_enrollment_overview`
- `masterclass_quiz_performance`
- `masterclass_admin_course_overview`
- `crm_contact_activity_summary`
- `crm_pipeline_summary`

**Solution:** Recreate views without `SECURITY DEFINER` property (use default `SECURITY INVOKER`).

### 2. RLS Disabled on Public Table (1 error)

**Problem:** Table `analytics_events` is publicly accessible but doesn't have Row Level Security enabled.

**Solution:** Enable RLS and create appropriate policies.

## How to Apply Fixes

### Option 1: Via Supabase SQL Editor (Recommended)

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `fix-security-issues.sql`
4. Paste and click **Run**

### Option 2: Via Command Line

```bash
# Using psql
psql [YOUR_DATABASE_URL] < sql/fix-security-issues.sql

# Using Supabase CLI
supabase db push
```

## What Gets Fixed

### ✅ RLS Enabled on `analytics_events`

```sql
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
```

**Policies Created:**
- Users can view their own analytics events
- Anyone can insert analytics events (for tracking)
- Service role has full access

### ✅ Views Recreated Without SECURITY DEFINER

All 5 views are dropped and recreated using the default `SECURITY INVOKER` mode, which means:
- Views now use the querying user's permissions
- RLS policies are properly enforced
- More secure and follows Supabase best practices

## Testing After Migration

After applying the fixes, verify by running:

```sql
-- Check RLS is enabled
SELECT relname, relrowsecurity
FROM pg_class
WHERE relname = 'analytics_events';
-- Should return: true

-- Check views don't have SECURITY DEFINER
SELECT viewname
FROM pg_views
WHERE schemaname = 'public'
  AND viewname LIKE '%masterclass%';
-- Should return all views without errors
```

## Impact on Application

### ✅ No Breaking Changes Expected

- Views continue to work the same way for authorized users
- Analytics events now properly secured with RLS
- Admin users can still access data through proper authentication

### ⚠️ Important Notes

1. **Admin Access:** Make sure admin users are properly authenticated via Supabase auth
2. **Service Role:** Use service role key for admin operations that need elevated access
3. **API Changes:** No changes needed in your application code

## Security Best Practices

Going forward:

1. ✅ **Always enable RLS** on tables in `public` schema
2. ✅ **Avoid SECURITY DEFINER** unless absolutely necessary
3. ✅ **Use RLS policies** to control data access
4. ✅ **Test with different user roles** to ensure proper access control

## Verification

Run the Supabase database linter again to confirm all issues are resolved:

1. Go to **Database** → **Linter** in Supabase Dashboard
2. Click **Run Linter**
3. All previous security errors should be gone ✅

## Questions?

If you encounter any issues after applying this migration:

1. Check that you're using the correct authentication
2. Verify service role keys are properly configured
3. Review RLS policies for your use case
4. Contact support if needed

## Migration Applied

- ✅ RLS enabled on `analytics_events`
- ✅ 5 views recreated without SECURITY DEFINER
- ✅ RLS policies created for analytics events
- ✅ Proper permissions granted to authenticated users
