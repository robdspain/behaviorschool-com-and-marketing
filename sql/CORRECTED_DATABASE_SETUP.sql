-- ========================================
-- CORRECTED DATABASE SETUP FOR CONVERSION TRACKING
-- Run this in your Supabase SQL editor
-- ========================================

-- First, let's clean up any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own downloads" ON downloads;
DROP POLICY IF EXISTS "Service role can insert downloads" ON downloads;
DROP POLICY IF EXISTS "Users can create signup submissions" ON signup_submissions;
DROP POLICY IF EXISTS "Service role can manage signup submissions" ON signup_submissions;

-- ========================================
-- 1. DOWNLOAD SUBMISSIONS TABLE (For Lead Magnets)
-- ========================================

CREATE TABLE IF NOT EXISTS download_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  resource VARCHAR(255) NOT NULL, -- The resource being downloaded (e.g., 'act-matrix-guide')
  source VARCHAR(255) NOT NULL, -- The page/source where the download was initiated
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_download_submissions_email ON download_submissions(email);
CREATE INDEX IF NOT EXISTS idx_download_submissions_resource ON download_submissions(resource);
CREATE INDEX IF NOT EXISTS idx_download_submissions_source ON download_submissions(source);
CREATE INDEX IF NOT EXISTS idx_download_submissions_created_at ON download_submissions(created_at);

-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION update_download_submissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate trigger to avoid conflicts
DROP TRIGGER IF EXISTS trigger_update_download_submissions_updated_at ON download_submissions;
CREATE TRIGGER trigger_update_download_submissions_updated_at
  BEFORE UPDATE ON download_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_download_submissions_updated_at();

-- Enable RLS
ALTER TABLE download_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "download_submissions_insert_policy" ON download_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "download_submissions_select_policy" ON download_submissions
  FOR SELECT USING (true);

-- ========================================
-- 2. SIGNUP SUBMISSIONS TABLE (For Course Applications)
-- ========================================

CREATE TABLE IF NOT EXISTS signup_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  organization TEXT,
  role TEXT NOT NULL,
  caseload_size TEXT,
  current_challenges TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'enrolled', 'rejected')),
  notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source TEXT -- Add source tracking
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_signup_submissions_email ON signup_submissions(email);
CREATE INDEX IF NOT EXISTS idx_signup_submissions_status ON signup_submissions(status);
CREATE INDEX IF NOT EXISTS idx_signup_submissions_submitted_at ON signup_submissions(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_signup_submissions_updated_at ON signup_submissions(updated_at DESC);

-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop and recreate trigger to avoid conflicts
DROP TRIGGER IF EXISTS update_signup_submissions_updated_at ON signup_submissions;
CREATE TRIGGER update_signup_submissions_updated_at 
    BEFORE UPDATE ON signup_submissions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE signup_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for signup_submissions
CREATE POLICY "signup_submissions_insert_policy" ON signup_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "signup_submissions_select_policy" ON signup_submissions
  FOR SELECT USING (true);

CREATE POLICY "signup_submissions_update_policy" ON signup_submissions
  FOR UPDATE USING (true);

-- ========================================
-- 3. OPTIONAL: DOWNLOADS TABLE (For Authenticated Users)
-- ========================================

CREATE TABLE IF NOT EXISTS downloads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT,
  resource TEXT NOT NULL,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_downloads_user_id ON downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_downloads_resource ON downloads(resource);
CREATE INDEX IF NOT EXISTS idx_downloads_date ON downloads(downloaded_at);

-- Enable RLS for downloads table
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

-- Create policies for downloads table
CREATE POLICY "downloads_view_own_policy" ON downloads
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "downloads_insert_policy" ON downloads
  FOR INSERT WITH CHECK (true);

-- ========================================
-- 4. GRANT PERMISSIONS
-- ========================================

-- Grant permissions to service role (for API access)
GRANT ALL ON download_submissions TO service_role;
GRANT ALL ON signup_submissions TO service_role;
GRANT ALL ON downloads TO service_role;

-- Grant permissions to authenticated users
GRANT SELECT, INSERT ON download_submissions TO authenticated;
GRANT SELECT, INSERT ON signup_submissions TO authenticated;
GRANT SELECT, INSERT ON downloads TO authenticated;

-- Grant permissions to anonymous users (for lead capture)
GRANT INSERT ON download_submissions TO anon;
GRANT INSERT ON signup_submissions TO anon;

-- ========================================
-- 5. COMMENTS FOR DOCUMENTATION
-- ========================================

COMMENT ON TABLE download_submissions IS 'Tracks lead magnet downloads with email capture for conversion analytics';
COMMENT ON TABLE signup_submissions IS 'Stores applications for the Behavior School Operating System program';
COMMENT ON TABLE downloads IS 'Optional: Track authenticated user download history';

-- ========================================
-- 6. VERIFY SETUP
-- ========================================

-- Test that tables were created successfully
SELECT 'download_submissions' as table_name, count(*) as row_count FROM download_submissions
UNION ALL
SELECT 'signup_submissions' as table_name, count(*) as row_count FROM signup_submissions
UNION ALL
SELECT 'downloads' as table_name, count(*) as row_count FROM downloads;

-- ========================================
-- SETUP COMPLETE!
-- ========================================

-- Next steps:
-- 1. Test the download flow on your ACT Matrix page
-- 2. Check the admin dashboard at /admin/analytics
-- 3. Configure GA4 conversion goals
-- 4. Start tracking real conversions!