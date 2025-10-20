# Database Migration Instructions

## Problem
The admin page at https://behaviorschool.com/admin/content is showing 500 errors because database tables don't exist.

## Solution
Run all SQL migrations in Supabase to create the required tables.

## Steps

### 1. Open Supabase SQL Editor
Go to: https://supabase.com/dashboard/project/dugolglucuzolzvuqxmi/sql/new

### 2. Run All Migrations at Once

Copy and paste the entire SQL script below into the SQL editor and click "Run":

```sql
-- ============================================================================
-- MIGRATION 1: Checkout Access Setup (20251010215547)
-- ============================================================================

-- Checkout Settings Table (stores the master password)
CREATE TABLE IF NOT EXISTS checkout_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default password
INSERT INTO checkout_settings (setting_key, setting_value, description)
VALUES ('checkout_password', 'Transform2025', 'Master password for checkout access')
ON CONFLICT (setting_key) DO NOTHING;

-- Checkout Access Table (approved users who can bypass password)
CREATE TABLE IF NOT EXISTS checkout_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  approved_by TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Checkout Access Logs Table (track all access attempts)
CREATE TABLE IF NOT EXISTS checkout_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  access_type TEXT NOT NULL, -- 'password' or 'email'
  identifier TEXT NOT NULL, -- the password or email used
  success BOOLEAN NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_checkout_access_email ON checkout_access(email);
CREATE INDEX IF NOT EXISTS idx_checkout_access_active ON checkout_access(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_checkout_logs_created ON checkout_access_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_checkout_logs_success ON checkout_access_logs(success);

-- Enable Row Level Security
ALTER TABLE checkout_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkout_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkout_access_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies (only service role can access these tables)
DROP POLICY IF EXISTS "Service role can do everything on checkout_settings" ON checkout_settings;
CREATE POLICY "Service role can do everything on checkout_settings"
  ON checkout_settings
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can do everything on checkout_access" ON checkout_access;
CREATE POLICY "Service role can do everything on checkout_access"
  ON checkout_access
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can do everything on checkout_access_logs" ON checkout_access_logs;
CREATE POLICY "Service role can do everything on checkout_access_logs"
  ON checkout_access_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_checkout_settings_updated_at ON checkout_settings;
CREATE TRIGGER update_checkout_settings_updated_at BEFORE UPDATE ON checkout_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_checkout_access_updated_at ON checkout_access;
CREATE TRIGGER update_checkout_access_updated_at BEFORE UPDATE ON checkout_access
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- All migrations applied successfully!
-- ============================================================================
```

### 3. Verify Tables Were Created

After running the SQL, verify the tables exist by running this query:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('checkout_access', 'checkout_access_logs', 'checkout_settings')
ORDER BY table_name;
```

You should see all three tables listed.

### 4. Test the Admin Page

After applying the migrations, test the admin page:
- Go to: https://behaviorschool.com/admin/content
- The page should load without 500 errors
- Blog posts should display (if any exist in Ghost CMS)

## Troubleshooting

### If you still see 500 errors after migrations:

1. **Check Netlify Environment Variables**
   - Go to: https://app.netlify.com/sites/[your-site]/configuration/env
   - Verify these variables are set:
     - `SUPABASE_SERVICE_ROLE`
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `GHOST_ADMIN_KEY`
     - `GHOST_CONTENT_URL`

2. **Check Netlify Function Logs**
   - Go to: https://app.netlify.com/sites/[your-site]/logs/functions
   - Look for specific error messages

3. **Redeploy the Site**
   - After setting environment variables, trigger a new deployment
   - The changes won't take effect until redeployed

## Additional Migrations

If you need other features, you may also want to run these optional migrations:

- `20251013_add_archived_to_submissions.sql` - Adds archiving to submissions
- `20251014_create_email_logs_table.sql` - Email logging system
- `20251016_create_archived_activities_table.sql` - Archived activities
- `20251019_create_certificates_issued_table.sql` - Certificate tracking

These are located in `supabase/migrations/` directory.

