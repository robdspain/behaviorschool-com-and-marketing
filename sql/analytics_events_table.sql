-- Analytics events table for tracking conversion events
-- This table stores all conversion events from the website

CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL, -- email_signup, download, course_inquiry, study_app_signup, tool_usage
  event_name VARCHAR(255) NOT NULL, -- Friendly name of the event
  source_page VARCHAR(500) NOT NULL, -- The page/URL where the event occurred
  user_email VARCHAR(255), -- User's email if available
  resource_name VARCHAR(255), -- Name of resource (for downloads)
  value NUMERIC(10, 2) DEFAULT 0, -- Monetary value assigned to this conversion
  additional_data JSONB, -- Additional event data stored as JSON
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_source_page ON analytics_events(source_page);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_email ON analytics_events(user_email);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name ON analytics_events(event_name);

-- Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_analytics_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_analytics_events_updated_at
  BEFORE UPDATE ON analytics_events
  FOR EACH ROW
  EXECUTE FUNCTION update_analytics_events_updated_at();

-- Add RLS (Row Level Security) policies if needed
-- ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Grant permissions (adjust as needed for your setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON analytics_events TO your_app_user;

-- Sample data for testing (optional - remove in production)
-- INSERT INTO analytics_events (event_type, event_name, source_page, user_email, value) VALUES
-- ('email_signup', 'Newsletter Signup', '/act-matrix', 'test@example.com', 5.00),
-- ('download', 'ACT Matrix Guide Download', '/act-matrix', 'test@example.com', 10.00),
-- ('course_inquiry', 'Course Information Request', '/supervisors', 'test2@example.com', 25.00);

