-- Robust Database Setup Script for Conversion Tracking
-- This script handles existing tables and missing columns gracefully
-- Run this in your Supabase SQL editor

-- First, create the update function (it's safe to recreate)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create download_submissions table with all required columns
CREATE TABLE IF NOT EXISTS download_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  resource VARCHAR(255) NOT NULL,
  source VARCHAR(255) NOT NULL,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add updated_at column to download_submissions if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'download_submissions' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE download_submissions ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Create signup_submissions table with all required columns
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add updated_at column to signup_submissions if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'signup_submissions' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE signup_submissions ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Create downloads table (for analytics tracking)
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

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view own downloads" ON downloads;
DROP POLICY IF EXISTS "Service role can insert downloads" ON downloads;
DROP POLICY IF EXISTS "Service role can manage signup submissions" ON signup_submissions;
DROP POLICY IF EXISTS "Users can create signup submissions" ON signup_submissions;

-- Enable RLS on all tables
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE signup_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE download_submissions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for downloads table
CREATE POLICY "Users can view own downloads" ON downloads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert downloads" ON downloads
  FOR INSERT WITH CHECK (true);

-- Create RLS policies for signup_submissions table  
CREATE POLICY "Service role can manage signup submissions" ON signup_submissions
  FOR ALL USING (true);

CREATE POLICY "Users can create signup submissions" ON signup_submissions
  FOR INSERT WITH CHECK (true);

-- Create RLS policies for download_submissions table
CREATE POLICY "Service role can manage download submissions" ON download_submissions
  FOR ALL USING (true);

CREATE POLICY "Users can create download submissions" ON download_submissions
  FOR INSERT WITH CHECK (true);

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_signup_submissions_updated_at ON signup_submissions;
DROP TRIGGER IF EXISTS trigger_update_download_submissions_updated_at ON download_submissions;

-- Create triggers for updated_at columns
CREATE TRIGGER update_signup_submissions_updated_at 
    BEFORE UPDATE ON signup_submissions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_download_submissions_updated_at
  BEFORE UPDATE ON download_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_downloads_user_id ON downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_downloads_resource ON downloads(resource);
CREATE INDEX IF NOT EXISTS idx_downloads_date ON downloads(downloaded_at);

CREATE INDEX IF NOT EXISTS idx_signup_submissions_email ON signup_submissions(email);
CREATE INDEX IF NOT EXISTS idx_signup_submissions_status ON signup_submissions(status);
CREATE INDEX IF NOT EXISTS idx_signup_submissions_submitted_at ON signup_submissions(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_signup_submissions_updated_at ON signup_submissions(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_download_submissions_email ON download_submissions(email);
CREATE INDEX IF NOT EXISTS idx_download_submissions_resource ON download_submissions(resource);
CREATE INDEX IF NOT EXISTS idx_download_submissions_source ON download_submissions(source);
CREATE INDEX IF NOT EXISTS idx_download_submissions_created_at ON download_submissions(created_at);

-- Add comments
COMMENT ON TABLE downloads IS 'Track PDF downloads for analytics and user access history';
COMMENT ON TABLE signup_submissions IS 'Store applications for the Behavior School Operating System program';
COMMENT ON TABLE download_submissions IS 'Store information about users who download lead magnet resources';