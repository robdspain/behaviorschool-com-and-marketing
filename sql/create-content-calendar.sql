-- Content Calendar Table
CREATE TABLE IF NOT EXISTS content_calendar (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  caption TEXT,
  platforms TEXT[] NOT NULL, -- Array of platforms: TikTok, Instagram, YouTube, LinkedIn, Facebook, Twitter
  content_type TEXT NOT NULL, -- Video Clip, Blog Post, Carousel, Text Post, Story
  media_url TEXT, -- URL to video file or image
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  timezone TEXT DEFAULT 'America/Los_Angeles',
  status TEXT DEFAULT 'draft', -- draft, scheduled, posted, failed
  tags TEXT[] DEFAULT '{}', -- Exam Prep, IEP Tools, BCBA Tips, Product Updates, Testimonials
  notes TEXT,
  character_counts JSONB DEFAULT '{}', -- Platform-specific character counts
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_content_calendar_scheduled_date ON content_calendar(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_content_calendar_status ON content_calendar(status);
CREATE INDEX IF NOT EXISTS idx_content_calendar_platforms ON content_calendar USING GIN(platforms);
CREATE INDEX IF NOT EXISTS idx_content_calendar_tags ON content_calendar USING GIN(tags);

-- Weekly Template Table
CREATE TABLE IF NOT EXISTS weekly_posting_template (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day_of_week INTEGER NOT NULL, -- 0 = Sunday, 1 = Monday, etc.
  time_slot TEXT NOT NULL, -- e.g., "7-9 AM", "12-1 PM"
  platform TEXT NOT NULL,
  content_type TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default weekly template
INSERT INTO weekly_posting_template (day_of_week, time_slot, platform, content_type, description, is_active) VALUES
  -- Monday
  (1, '7-9 AM', 'LinkedIn', 'Text Post', 'Professional tip or case study', true),
  (1, '12-1 PM', 'TikTok', 'Video Clip', 'Question clip', true),
  
  -- Tuesday
  (2, '9-11 AM', 'Instagram', 'Video Clip', 'Question clip Reel', true),
  (2, '10 AM-12 PM', 'Twitter', 'Text Post', 'Quick tip thread or poll', true),
  
  -- Wednesday
  (3, '7-9 AM', 'YouTube', 'Video Clip', 'Explainer Short', true),
  (3, '10-11 AM', 'Facebook', 'Blog Post', 'Blog post share to educator groups', true),
  (3, '7-9 PM', 'TikTok', 'Video Clip', 'Trending format adaptation', true),
  
  -- Thursday
  (4, '12-1 PM', 'TikTok', 'Video Clip', 'Question clip', true),
  (4, '5-6 PM', 'LinkedIn', 'Carousel', 'Carousel or document post', true),
  
  -- Friday
  (5, '2-4 PM', 'Instagram', 'Video Clip', 'Fun/engaging/relatable Reel', true),
  (5, '11 AM-1 PM', 'Twitter', 'Text Post', 'Poll or engagement question', true),
  
  -- Saturday
  (6, '9-11 AM', 'TikTok', 'Video Clip', 'Trending format or evergreen', true),
  
  -- Sunday
  (0, 'Optional', 'All', 'Text Post', 'Rest or evergreen reshare', false)
ON CONFLICT DO NOTHING;

-- Posting time recommendations table
CREATE TABLE IF NOT EXISTS posting_time_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  day_of_week INTEGER NOT NULL, -- 0 = Sunday
  time_window TEXT NOT NULL, -- e.g., "7-9 AM PST"
  priority TEXT NOT NULL, -- primary, secondary, avoid
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert posting recommendations based on research
INSERT INTO posting_time_recommendations (platform, day_of_week, time_window, priority, reason) VALUES
  -- TikTok
  ('TikTok', 2, '7-9 AM', 'primary', 'Peak engagement for educational content before work'),
  ('TikTok', 2, '12-1 PM', 'primary', 'Lunch break browsing'),
  ('TikTok', 2, '7-9 PM', 'primary', 'Evening wind-down'),
  ('TikTok', 3, '7-9 AM', 'primary', 'Morning commute'),
  ('TikTok', 3, '12-1 PM', 'primary', 'Lunch break'),
  ('TikTok', 3, '7-9 PM', 'primary', 'Evening engagement'),
  ('TikTok', 4, '7-9 AM', 'primary', 'Peak mid-week engagement'),
  ('TikTok', 4, '12-1 PM', 'primary', 'Lunch peak'),
  ('TikTok', 4, '7-9 PM', 'primary', 'Evening peak'),
  ('TikTok', 1, '9-11 AM', 'secondary', 'Monday morning'),
  ('TikTok', 5, '9-11 AM', 'secondary', 'Friday morning'),
  
  -- Instagram
  ('Instagram', 1, '9-11 AM', 'primary', 'Professional browsing during work break'),
  ('Instagram', 2, '9-11 AM', 'primary', 'Morning engagement'),
  ('Instagram', 3, '9-11 AM', 'primary', 'Mid-week peak'),
  ('Instagram', 4, '9-11 AM', 'primary', 'Thursday engagement'),
  ('Instagram', 5, '2-4 PM', 'primary', 'Friday afternoon wind-down'),
  ('Instagram', 6, '10 AM-12 PM', 'secondary', 'Saturday morning'),
  
  -- LinkedIn
  ('LinkedIn', 2, '7-9 AM', 'primary', 'Pre-work browsing'),
  ('LinkedIn', 2, '12-1 PM', 'primary', 'Lunch break'),
  ('LinkedIn', 3, '7-9 AM', 'primary', 'Morning commute'),
  ('LinkedIn', 3, '5-6 PM', 'primary', 'After work'),
  ('LinkedIn', 4, '7-9 AM', 'primary', 'Peak professional engagement'),
  ('LinkedIn', 4, '5-6 PM', 'primary', 'Evening peak'),
  ('LinkedIn', 1, '8-10 AM', 'secondary', 'Monday morning'),
  
  -- Twitter
  ('Twitter', 2, '7-9 AM', 'primary', 'Morning news check'),
  ('Twitter', 2, '10 AM-12 PM', 'primary', 'Mid-morning engagement'),
  ('Twitter', 3, '10 AM-12 PM', 'primary', 'Wednesday peak'),
  ('Twitter', 3, '1-3 PM', 'primary', 'Afternoon browsing'),
  ('Twitter', 4, '7-9 AM', 'primary', 'Morning peak'),
  ('Twitter', 4, '1-3 PM', 'primary', 'Afternoon engagement'),
  
  -- YouTube
  ('YouTube', 1, '6-9 AM', 'primary', 'Morning commute'),
  ('YouTube', 2, '12-2 PM', 'primary', 'Lunch break discovery'),
  ('YouTube', 3, '6-10 PM', 'primary', 'Evening viewing'),
  ('YouTube', 6, '9 AM-12 PM', 'secondary', 'Saturday morning'),
  
  -- Facebook
  ('Facebook', 3, '9-11 AM', 'primary', 'Mid-morning educator browsing'),
  ('Facebook', 3, '1-3 PM', 'primary', 'Afternoon break'),
  ('Facebook', 4, '9-11 AM', 'primary', 'Thursday peak'),
  ('Facebook', 4, '10 AM-12 PM', 'primary', 'Late morning'),
  ('Facebook', 2, '10 AM-12 PM', 'secondary', 'Tuesday engagement')
ON CONFLICT DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_content_calendar_updated_at
  BEFORE UPDATE ON content_calendar
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (adjust based on your setup)
-- GRANT ALL ON content_calendar TO authenticated;
-- GRANT ALL ON weekly_posting_template TO authenticated;
-- GRANT ALL ON posting_time_recommendations TO authenticated;
