-- Download submissions table for tracking lead magnet downloads
-- This table stores information about users who download resources

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

-- Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_download_submissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
  SET search_path = public, pg_temp;

CREATE TRIGGER trigger_update_download_submissions_updated_at
  BEFORE UPDATE ON download_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_download_submissions_updated_at();

-- Add RLS (Row Level Security) policies if needed
-- ALTER TABLE download_submissions ENABLE ROW LEVEL SECURITY;

-- Grant permissions (adjust as needed for your setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON download_submissions TO your_app_user;
-- GRANT USAGE ON SEQUENCE download_submissions_id_seq TO your_app_user;
