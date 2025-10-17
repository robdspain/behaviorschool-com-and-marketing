-- Create archived_activities table to store archived events from the admin dashboard
CREATE TABLE IF NOT EXISTS archived_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_type VARCHAR(50) NOT NULL,
  activity_id VARCHAR(255) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  original_timestamp TIMESTAMPTZ NOT NULL,
  archived_at TIMESTAMPTZ DEFAULT NOW(),
  archived_by UUID REFERENCES auth.users(id),
  UNIQUE(activity_type, activity_id)
);

-- Create index for faster queries
CREATE INDEX idx_archived_activities_archived_at ON archived_activities(archived_at DESC);
CREATE INDEX idx_archived_activities_type ON archived_activities(activity_type);

-- Add RLS policies
ALTER TABLE archived_activities ENABLE ROW LEVEL SECURITY;

-- Admin users can read archived activities
CREATE POLICY "Admin users can read archived activities"
  ON archived_activities
  FOR SELECT
  TO authenticated
  USING (true);

-- Admin users can insert archived activities
CREATE POLICY "Admin users can insert archived activities"
  ON archived_activities
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Admin users can delete archived activities (unarchive)
CREATE POLICY "Admin users can delete archived activities"
  ON archived_activities
  FOR DELETE
  TO authenticated
  USING (true);
