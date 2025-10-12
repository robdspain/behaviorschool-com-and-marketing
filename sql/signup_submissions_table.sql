-- Create signup_submissions table for School BCBA Transformation System applications
-- Run this in your Supabase SQL editor

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

-- Add RLS policy
ALTER TABLE signup_submissions ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (for admin operations)
CREATE POLICY "Service role can manage signup submissions" ON signup_submissions
  FOR ALL USING (true);

-- Allow authenticated users to insert their own submissions
CREATE POLICY "Users can create signup submissions" ON signup_submissions
  FOR INSERT WITH CHECK (true);

-- Add indexes for better performance
CREATE INDEX idx_signup_submissions_email ON signup_submissions(email);
CREATE INDEX idx_signup_submissions_status ON signup_submissions(status);
CREATE INDEX idx_signup_submissions_submitted_at ON signup_submissions(submitted_at DESC);
CREATE INDEX idx_signup_submissions_updated_at ON signup_submissions(updated_at DESC);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_signup_submissions_updated_at 
    BEFORE UPDATE ON signup_submissions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Comment on table
COMMENT ON TABLE signup_submissions IS 'Store applications for the School BCBA Transformation System';
