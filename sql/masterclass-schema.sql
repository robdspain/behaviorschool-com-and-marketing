-- ============================================================================
-- BEHAVIOR SCHOOL MASTERCLASS SYSTEM
-- Database Schema for Free CEU Masterclass Platform
-- ============================================================================
-- Created: 2025-01-21
-- Description: Handles enrollment, progress tracking, quiz responses, and
--              certificate generation for free 1-hour masterclass courses
-- ============================================================================

-- ============================================================================
-- TABLE: masterclass_enrollments
-- Purpose: Store user enrollment information and certificate status
-- ============================================================================
CREATE TABLE IF NOT EXISTS masterclass_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  bacb_cert_number TEXT NOT NULL,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),

  -- Certificate tracking
  certificate_issued BOOLEAN DEFAULT FALSE,
  certificate_id TEXT UNIQUE,
  certificate_generated_at TIMESTAMPTZ,
  certificate_emailed BOOLEAN DEFAULT FALSE,
  certificate_emailed_at TIMESTAMPTZ,

  -- Analytics
  ip_address TEXT,
  user_agent TEXT,
  referral_source TEXT,

  -- Constraints
  CONSTRAINT unique_email_enrollment UNIQUE(email),
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_masterclass_enrollments_email ON masterclass_enrollments(email);
CREATE INDEX IF NOT EXISTS idx_masterclass_enrollments_created_at ON masterclass_enrollments(created_at);
CREATE INDEX IF NOT EXISTS idx_masterclass_enrollments_certificate_id ON masterclass_enrollments(certificate_id);
CREATE INDEX IF NOT EXISTS idx_masterclass_enrollments_completed_at ON masterclass_enrollments(completed_at);

-- ============================================================================
-- TABLE: masterclass_progress
-- Purpose: Track video completion and quiz results for each section
-- ============================================================================
CREATE TABLE IF NOT EXISTS masterclass_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES masterclass_enrollments(id) ON DELETE CASCADE,
  section_number INTEGER NOT NULL CHECK (section_number BETWEEN 1 AND 4),

  -- Video tracking
  video_completed BOOLEAN DEFAULT FALSE,
  video_watched_percentage INTEGER DEFAULT 0 CHECK (video_watched_percentage BETWEEN 0 AND 100),
  video_watch_time_seconds INTEGER DEFAULT 0,
  video_completed_at TIMESTAMPTZ,

  -- Quiz tracking
  quiz_attempts INTEGER DEFAULT 0,
  quiz_score INTEGER,
  quiz_total INTEGER,
  quiz_passed BOOLEAN DEFAULT FALSE,
  quiz_completed_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Constraints
  CONSTRAINT unique_enrollment_section UNIQUE(enrollment_id, section_number),
  CONSTRAINT valid_quiz_score CHECK (quiz_score IS NULL OR (quiz_score >= 0 AND quiz_score <= quiz_total))
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_masterclass_progress_enrollment ON masterclass_progress(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_masterclass_progress_section ON masterclass_progress(section_number);

-- ============================================================================
-- TABLE: masterclass_quiz_responses
-- Purpose: Store individual quiz question responses for analytics
-- ============================================================================
CREATE TABLE IF NOT EXISTS masterclass_quiz_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES masterclass_enrollments(id) ON DELETE CASCADE,
  section_number INTEGER NOT NULL CHECK (section_number BETWEEN 1 AND 4),

  -- Quiz attempt tracking
  attempt_number INTEGER NOT NULL DEFAULT 1,
  question_number INTEGER NOT NULL CHECK (question_number >= 1),
  question_id TEXT NOT NULL,

  -- Response data
  selected_answer INTEGER NOT NULL,
  correct_answer INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_spent_seconds INTEGER,

  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Constraints
  CONSTRAINT valid_answer_index CHECK (selected_answer >= 0 AND correct_answer >= 0)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_masterclass_quiz_enrollment ON masterclass_quiz_responses(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_masterclass_quiz_section ON masterclass_quiz_responses(section_number);
CREATE INDEX IF NOT EXISTS idx_masterclass_quiz_question ON masterclass_quiz_responses(question_id);

-- ============================================================================
-- TABLE: masterclass_certificates
-- Purpose: Store certificate metadata and verification info
-- ============================================================================
CREATE TABLE IF NOT EXISTS masterclass_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id TEXT UNIQUE NOT NULL,
  enrollment_id UUID NOT NULL REFERENCES masterclass_enrollments(id) ON DELETE CASCADE,

  -- Certificate details
  recipient_name TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  bacb_cert_number TEXT NOT NULL,

  -- Masterclass details
  course_title TEXT NOT NULL,
  ceu_credits DECIMAL(3,1) NOT NULL DEFAULT 1.0,
  completion_date DATE NOT NULL,

  -- File storage
  pdf_url TEXT,
  pdf_generated BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Verification tracking
  verification_count INTEGER DEFAULT 0,
  last_verified_at TIMESTAMPTZ,

  CONSTRAINT unique_enrollment_certificate UNIQUE(enrollment_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_masterclass_certificates_cert_id ON masterclass_certificates(certificate_id);
CREATE INDEX IF NOT EXISTS idx_masterclass_certificates_enrollment ON masterclass_certificates(enrollment_id);

-- ============================================================================
-- TABLE: masterclass_analytics_events
-- Purpose: Track user interactions and events for analytics
-- ============================================================================
CREATE TABLE IF NOT EXISTS masterclass_analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID REFERENCES masterclass_enrollments(id) ON DELETE SET NULL,

  -- Event details
  event_type TEXT NOT NULL, -- 'page_view', 'video_start', 'video_complete', 'quiz_submit', etc.
  event_data JSONB,

  -- Context
  section_number INTEGER,
  session_id TEXT,

  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_masterclass_analytics_enrollment ON masterclass_analytics_events(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_masterclass_analytics_event_type ON masterclass_analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_masterclass_analytics_created_at ON masterclass_analytics_events(created_at);

-- ============================================================================
-- FUNCTIONS: Helper functions for common operations
-- ============================================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_masterclass_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on masterclass_progress
DROP TRIGGER IF EXISTS trigger_update_masterclass_progress_updated_at ON masterclass_progress;
CREATE TRIGGER trigger_update_masterclass_progress_updated_at
  BEFORE UPDATE ON masterclass_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_masterclass_updated_at();

-- Function to check if enrollment is complete
CREATE OR REPLACE FUNCTION is_masterclass_complete(enrollment_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  completed_sections INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO completed_sections
  FROM masterclass_progress
  WHERE enrollment_id = enrollment_uuid
    AND video_completed = TRUE
    AND quiz_passed = TRUE;

  RETURN completed_sections = 4;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate enrollment progress percentage
CREATE OR REPLACE FUNCTION calculate_masterclass_progress(enrollment_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  total_steps INTEGER := 8; -- 4 sections × 2 steps (video + quiz)
  completed_steps INTEGER;
BEGIN
  SELECT
    COALESCE(SUM(
      CASE WHEN video_completed THEN 1 ELSE 0 END +
      CASE WHEN quiz_passed THEN 1 ELSE 0 END
    ), 0)
  INTO completed_steps
  FROM masterclass_progress
  WHERE enrollment_id = enrollment_uuid;

  RETURN (completed_steps * 100 / total_steps);
END;
$$ LANGUAGE plpgsql;

-- Function to generate unique certificate ID
CREATE OR REPLACE FUNCTION generate_certificate_id()
RETURNS TEXT AS $$
DECLARE
  date_part TEXT;
  random_part TEXT;
  cert_id TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- Generate date part (YYYYMMDD)
    date_part := TO_CHAR(CURRENT_DATE, 'YYYYMMDD');

    -- Generate random 6-character alphanumeric string
    random_part := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));

    -- Combine into certificate ID format: BS-MC-YYYYMMDD-XXXXXX
    cert_id := 'BS-MC-' || date_part || '-' || random_part;

    -- Check if this ID already exists
    SELECT EXISTS(
      SELECT 1 FROM masterclass_certificates WHERE certificate_id = cert_id
    ) INTO exists_check;

    -- Exit loop if ID is unique
    EXIT WHEN NOT exists_check;
  END LOOP;

  RETURN cert_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE masterclass_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE masterclass_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE masterclass_quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE masterclass_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE masterclass_analytics_events ENABLE ROW LEVEL SECURITY;

-- Public can insert new enrollments (registration)
CREATE POLICY "Anyone can enroll in masterclass"
  ON masterclass_enrollments
  FOR INSERT
  WITH CHECK (true);

-- Public can view their own enrollment (by email match)
CREATE POLICY "Users can view own enrollment"
  ON masterclass_enrollments
  FOR SELECT
  USING (true); -- We'll filter by email in application code

-- Public can update their own enrollment (for last_accessed_at)
CREATE POLICY "Users can update own enrollment"
  ON masterclass_enrollments
  FOR UPDATE
  USING (true);

-- Public can insert/update progress
CREATE POLICY "Anyone can insert progress"
  ON masterclass_progress
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view progress"
  ON masterclass_progress
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update progress"
  ON masterclass_progress
  FOR UPDATE
  USING (true);

-- Public can insert quiz responses
CREATE POLICY "Anyone can insert quiz responses"
  ON masterclass_quiz_responses
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view quiz responses"
  ON masterclass_quiz_responses
  FOR SELECT
  USING (true);

-- Public can view and insert certificates
CREATE POLICY "Anyone can view certificates"
  ON masterclass_certificates
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert certificates"
  ON masterclass_certificates
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update certificates"
  ON masterclass_certificates
  FOR UPDATE
  USING (true);

-- Public can insert analytics events
CREATE POLICY "Anyone can insert analytics events"
  ON masterclass_analytics_events
  FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- SAMPLE DATA (for testing - comment out in production)
-- ============================================================================

-- Sample enrollment
-- INSERT INTO masterclass_enrollments (email, name, bacb_cert_number)
-- VALUES ('test@example.com', 'Test User', '1-12-12345');

-- ============================================================================
-- VIEWS: Useful views for analytics and reporting
-- ============================================================================

-- View: Enrollment overview with completion status
CREATE OR REPLACE VIEW masterclass_enrollment_overview AS
SELECT
  e.id,
  e.email,
  e.name,
  e.bacb_cert_number,
  e.created_at,
  e.completed_at,
  e.certificate_issued,
  e.certificate_id,
  calculate_masterclass_progress(e.id) as progress_percentage,
  is_masterclass_complete(e.id) as is_complete,
  COUNT(p.id) as sections_started,
  SUM(CASE WHEN p.video_completed THEN 1 ELSE 0 END) as videos_completed,
  SUM(CASE WHEN p.quiz_passed THEN 1 ELSE 0 END) as quizzes_passed
FROM masterclass_enrollments e
LEFT JOIN masterclass_progress p ON e.id = p.enrollment_id
GROUP BY e.id;

-- View: Quiz performance by section
CREATE OR REPLACE VIEW masterclass_quiz_performance AS
SELECT
  section_number,
  COUNT(DISTINCT enrollment_id) as total_attempts,
  AVG(quiz_attempts) as avg_attempts,
  SUM(CASE WHEN quiz_passed THEN 1 ELSE 0 END)::FLOAT / COUNT(*)::FLOAT * 100 as pass_rate,
  AVG(quiz_score::FLOAT / NULLIF(quiz_total, 0)::FLOAT * 100) as avg_score_percentage
FROM masterclass_progress
WHERE quiz_total IS NOT NULL
GROUP BY section_number
ORDER BY section_number;

-- ============================================================================
-- COMMENTS: Add descriptions to tables and columns
-- ============================================================================

COMMENT ON TABLE masterclass_enrollments IS 'Stores user enrollment information for the free masterclass';
COMMENT ON TABLE masterclass_progress IS 'Tracks video and quiz completion status for each section';
COMMENT ON TABLE masterclass_quiz_responses IS 'Stores individual quiz question responses for analytics';
COMMENT ON TABLE masterclass_certificates IS 'Stores generated certificate metadata and verification info';
COMMENT ON TABLE masterclass_analytics_events IS 'Tracks user interaction events for analytics';

COMMENT ON FUNCTION is_masterclass_complete IS 'Returns true if all 4 sections (video + quiz) are complete';
COMMENT ON FUNCTION calculate_masterclass_progress IS 'Returns progress percentage (0-100) for an enrollment';
COMMENT ON FUNCTION generate_certificate_id IS 'Generates unique certificate ID in format BS-MC-YYYYMMDD-XXXXXX';

-- ============================================================================
-- GRANTS: Ensure appropriate permissions (adjust based on your setup)
-- ============================================================================

-- Grant access to authenticated users (if using Supabase auth)
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Grant access to anonymous users (for public masterclass)
-- GRANT SELECT, INSERT, UPDATE ON masterclass_enrollments TO anon;
-- GRANT SELECT, INSERT, UPDATE ON masterclass_progress TO anon;
-- GRANT SELECT, INSERT ON masterclass_quiz_responses TO anon;
-- GRANT SELECT, INSERT, UPDATE ON masterclass_certificates TO anon;
-- GRANT INSERT ON masterclass_analytics_events TO anon;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
