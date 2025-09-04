-- Create downloads tracking table (run this in your Supabase SQL editor)
-- This is optional but helpful for analytics

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

-- Add RLS policy
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own download history
CREATE POLICY "Users can view own downloads" ON downloads
  FOR SELECT USING (auth.uid() = user_id);

-- Allow service role to insert download records
CREATE POLICY "Service role can insert downloads" ON downloads
  FOR INSERT WITH CHECK (true);

-- Add index for faster queries
CREATE INDEX idx_downloads_user_id ON downloads(user_id);
CREATE INDEX idx_downloads_resource ON downloads(resource);
CREATE INDEX idx_downloads_date ON downloads(downloaded_at);

-- Comment on table
COMMENT ON TABLE downloads IS 'Track PDF downloads for analytics and user access history';