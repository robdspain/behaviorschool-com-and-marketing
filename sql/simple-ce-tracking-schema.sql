-- ============================================================================
-- Simple CE/CEU Tracking Schema
-- ============================================================================
-- For tracking CE credits in mastermind groups and courses
-- Participants report CEUs to BACB on their own
-- Does NOT require BACB ACE Provider status
-- ============================================================================

-- ============================================================================
-- ENUMS
-- ============================================================================

-- Type of CE activity
CREATE TYPE ce_activity_type AS ENUM (
  'mastermind_session',    -- Group mastermind meeting
  'course_module',         -- Online course module
  'live_training',         -- Live training session
  'workshop',              -- Workshop or seminar
  'study_group'            -- Study group meeting
);

-- CE category (for BCBA reporting)
CREATE TYPE ce_category AS ENUM (
  'general',      -- General continuing education
  'ethics',       -- Ethics-specific content
  'supervision'   -- Supervision-related content
);

-- Delivery method
CREATE TYPE ce_delivery_method AS ENUM (
  'in_person',
  'zoom_live',
  'asynchronous'
);

-- Certificate status
CREATE TYPE ce_certificate_status AS ENUM (
  'pending',
  'issued',
  'revoked'
);

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- CE Programs (Mastermind, Course, etc.)
CREATE TABLE ce_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Program info
  name TEXT NOT NULL,
  description TEXT,
  program_type TEXT NOT NULL, -- 'mastermind', 'course', 'workshop'
  
  -- CE details
  total_ceus DECIMAL(4,1) NOT NULL CHECK (total_ceus >= 0),
  ce_category ce_category DEFAULT 'general',
  
  -- Instructor
  instructor_name TEXT NOT NULL,
  instructor_credentials TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Dates
  start_date DATE,
  end_date DATE,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_ce_programs_active ON ce_programs(is_active);
CREATE INDEX idx_ce_programs_type ON ce_programs(program_type);

-- CE Sessions (individual meetings/modules)
CREATE TABLE ce_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES ce_programs(id) ON DELETE CASCADE,
  
  -- Session info
  title TEXT NOT NULL,
  description TEXT,
  session_number INTEGER,
  
  -- CE details
  ceus_awarded DECIMAL(3,1) NOT NULL CHECK (ceus_awarded >= 0),
  duration_minutes INTEGER NOT NULL,
  ce_category ce_category DEFAULT 'general',
  
  -- Delivery
  delivery_method ce_delivery_method NOT NULL,
  session_date TIMESTAMPTZ,
  zoom_link TEXT,
  recording_url TEXT,
  
  -- Materials
  materials_urls JSONB DEFAULT '[]'::jsonb,
  
  -- Status
  is_completed BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_ce_sessions_program ON ce_sessions(program_id);
CREATE INDEX idx_ce_sessions_date ON ce_sessions(session_date);
CREATE INDEX idx_ce_sessions_completed ON ce_sessions(is_completed);

-- Participant Enrollment
CREATE TABLE ce_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES ce_programs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Participant info
  participant_name TEXT NOT NULL,
  participant_email TEXT NOT NULL,
  bacb_number TEXT, -- Optional, for certificate
  
  -- Enrollment status
  enrolled_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  status TEXT DEFAULT 'active', -- 'active', 'completed', 'dropped'
  
  -- Progress
  sessions_completed INTEGER DEFAULT 0,
  total_ceus_earned DECIMAL(4,1) DEFAULT 0.0,
  
  -- Certificate
  certificate_issued BOOLEAN DEFAULT FALSE,
  certificate_issued_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  CONSTRAINT unique_enrollment UNIQUE (program_id, user_id)
);

CREATE INDEX idx_ce_enrollments_program ON ce_enrollments(program_id);
CREATE INDEX idx_ce_enrollments_user ON ce_enrollments(user_id);
CREATE INDEX idx_ce_enrollments_status ON ce_enrollments(status);

-- Session Attendance
CREATE TABLE ce_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES ce_sessions(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES ce_enrollments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Attendance
  attended BOOLEAN DEFAULT FALSE,
  attended_at TIMESTAMPTZ,
  
  -- For async: completion tracking
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  time_spent_minutes INTEGER DEFAULT 0,
  
  -- For live: check-in/out
  checked_in_at TIMESTAMPTZ,
  checked_out_at TIMESTAMPTZ,
  
  -- Verification
  verification_code TEXT,
  verified_by UUID REFERENCES auth.users(id),
  
  -- CEUs awarded (calculated)
  ceus_earned DECIMAL(3,1) DEFAULT 0.0,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  CONSTRAINT unique_session_attendance UNIQUE (session_id, user_id)
);

CREATE INDEX idx_ce_attendance_session ON ce_attendance(session_id);
CREATE INDEX idx_ce_attendance_user ON ce_attendance(user_id);
CREATE INDEX idx_ce_attendance_enrollment ON ce_attendance(enrollment_id);

-- CE Certificates
CREATE TABLE ce_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES ce_programs(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES ce_enrollments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Certificate info
  certificate_number TEXT UNIQUE NOT NULL,
  
  -- Participant details
  participant_name TEXT NOT NULL,
  participant_email TEXT NOT NULL,
  bacb_number TEXT,
  
  -- Program details
  program_name TEXT NOT NULL,
  instructor_name TEXT NOT NULL,
  
  -- CE details
  total_ceus DECIMAL(4,1) NOT NULL,
  ce_category ce_category NOT NULL,
  completion_date DATE NOT NULL,
  
  -- Certificate breakdown (JSON array of sessions)
  sessions_breakdown JSONB DEFAULT '[]'::jsonb,
  -- Example: [{"title": "Session 1", "ceus": 1.5, "date": "2024-10-23"}, ...]
  
  -- Status
  status ce_certificate_status DEFAULT 'issued',
  
  -- Files
  certificate_url TEXT, -- PDF URL
  
  -- Metadata
  issued_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  issued_by UUID REFERENCES auth.users(id),
  revoked_at TIMESTAMPTZ,
  revoked_by UUID REFERENCES auth.users(id),
  revocation_reason TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_ce_certificates_program ON ce_certificates(program_id);
CREATE INDEX idx_ce_certificates_user ON ce_certificates(user_id);
CREATE INDEX idx_ce_certificates_enrollment ON ce_certificates(enrollment_id);
CREATE INDEX idx_ce_certificates_status ON ce_certificates(status);
CREATE INDEX idx_ce_certificates_number ON ce_certificates(certificate_number);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to calculate CEUs based on duration (simple 1 hour = 1 CEU)
CREATE OR REPLACE FUNCTION calculate_ceus_simple(duration_minutes INTEGER)
RETURNS DECIMAL(3,1) AS $$
BEGIN
  -- Simple rule: 60 minutes = 1.0 CEU
  RETURN ROUND((duration_minutes / 60.0)::numeric, 1);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to update enrollment progress
CREATE OR REPLACE FUNCTION update_enrollment_progress(p_enrollment_id UUID)
RETURNS VOID AS $$
DECLARE
  v_sessions_completed INTEGER;
  v_total_ceus DECIMAL(4,1);
BEGIN
  -- Count completed sessions
  SELECT 
    COUNT(*),
    COALESCE(SUM(ceus_earned), 0.0)
  INTO v_sessions_completed, v_total_ceus
  FROM ce_attendance
  WHERE enrollment_id = p_enrollment_id
    AND attended = TRUE;
  
  -- Update enrollment
  UPDATE ce_enrollments
  SET 
    sessions_completed = v_sessions_completed,
    total_ceus_earned = v_total_ceus,
    updated_at = NOW()
  WHERE id = p_enrollment_id;
END;
$$ LANGUAGE plpgsql;

-- Function to check if enrollment is ready for certificate
CREATE OR REPLACE FUNCTION is_ready_for_certificate(p_enrollment_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_required_sessions INTEGER;
  v_completed_sessions INTEGER;
  v_required_ceus DECIMAL(4,1);
  v_earned_ceus DECIMAL(4,1);
BEGIN
  -- Get requirements
  SELECT 
    (SELECT COUNT(*) FROM ce_sessions WHERE program_id = e.program_id),
    e.sessions_completed,
    p.total_ceus,
    e.total_ceus_earned
  INTO v_required_sessions, v_completed_sessions, v_required_ceus, v_earned_ceus
  FROM ce_enrollments e
  JOIN ce_programs p ON e.program_id = p.id
  WHERE e.id = p_enrollment_id;
  
  -- Check if requirements met (completed all sessions OR earned all CEUs)
  RETURN (v_completed_sessions >= v_required_sessions) OR (v_earned_ceus >= v_required_ceus);
END;
$$ LANGUAGE plpgsql;

-- Function to generate certificate number
CREATE OR REPLACE FUNCTION generate_certificate_number()
RETURNS TEXT AS $$
DECLARE
  v_prefix TEXT := 'CE';
  v_year TEXT := TO_CHAR(NOW(), 'YYYY');
  v_sequence TEXT;
  v_certificate_number TEXT;
  v_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate random 6-digit sequence
    v_sequence := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
    v_certificate_number := v_prefix || '-' || v_year || '-' || v_sequence;
    
    -- Check if exists
    SELECT EXISTS(
      SELECT 1 FROM ce_certificates WHERE certificate_number = v_certificate_number
    ) INTO v_exists;
    
    -- If unique, return it
    IF NOT v_exists THEN
      RETURN v_certificate_number;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger: Update enrollment progress when attendance changes
CREATE OR REPLACE FUNCTION trigger_update_enrollment_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Update progress
  PERFORM update_enrollment_progress(NEW.enrollment_id);
  
  -- Check if ready for certificate
  IF is_ready_for_certificate(NEW.enrollment_id) THEN
    UPDATE ce_enrollments
    SET status = 'completed'
    WHERE id = NEW.enrollment_id
      AND status = 'active';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_ce_attendance_update_progress
  AFTER INSERT OR UPDATE OF attended
  ON ce_attendance
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_enrollment_progress();

-- Trigger: Auto-calculate CEUs when attendance is marked
CREATE OR REPLACE FUNCTION trigger_calculate_attendance_ceus()
RETURNS TRIGGER AS $$
DECLARE
  v_session_ceus DECIMAL(3,1);
BEGIN
  IF NEW.attended = TRUE AND NEW.ceus_earned = 0.0 THEN
    -- Get session CEUs
    SELECT ceus_awarded
    INTO v_session_ceus
    FROM ce_sessions
    WHERE id = NEW.session_id;
    
    -- Award CEUs
    NEW.ceus_earned := v_session_ceus;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_ce_attendance_calculate_ceus
  BEFORE INSERT OR UPDATE OF attended
  ON ce_attendance
  FOR EACH ROW
  EXECUTE FUNCTION trigger_calculate_attendance_ceus();

-- Trigger: Auto-generate certificate number
CREATE OR REPLACE FUNCTION trigger_generate_cert_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.certificate_number IS NULL OR NEW.certificate_number = '' THEN
    NEW.certificate_number := generate_certificate_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_ce_certificates_generate_number
  BEFORE INSERT
  ON ce_certificates
  FOR EACH ROW
  EXECUTE FUNCTION trigger_generate_cert_number();

-- Trigger: Update updated_at timestamp
CREATE OR REPLACE FUNCTION trigger_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_ce_programs_updated_at
  BEFORE UPDATE ON ce_programs
  FOR EACH ROW EXECUTE FUNCTION trigger_update_updated_at();

CREATE TRIGGER trg_ce_sessions_updated_at
  BEFORE UPDATE ON ce_sessions
  FOR EACH ROW EXECUTE FUNCTION trigger_update_updated_at();

CREATE TRIGGER trg_ce_enrollments_updated_at
  BEFORE UPDATE ON ce_enrollments
  FOR EACH ROW EXECUTE FUNCTION trigger_update_updated_at();

CREATE TRIGGER trg_ce_attendance_updated_at
  BEFORE UPDATE ON ce_attendance
  FOR EACH ROW EXECUTE FUNCTION trigger_update_updated_at();

-- ============================================================================
-- VIEWS
-- ============================================================================

-- View: Participant Progress Dashboard
CREATE OR REPLACE VIEW ce_participant_dashboard AS
SELECT
  e.id AS enrollment_id,
  e.user_id,
  e.participant_name,
  e.participant_email,
  e.bacb_number,
  
  p.id AS program_id,
  p.name AS program_name,
  p.program_type,
  p.total_ceus AS program_total_ceus,
  
  e.enrolled_at,
  e.status,
  e.sessions_completed,
  e.total_ceus_earned,
  
  -- Progress percentage
  CASE 
    WHEN p.total_ceus > 0 THEN ROUND((e.total_ceus_earned / p.total_ceus * 100)::numeric, 1)
    ELSE 0
  END AS progress_percentage,
  
  -- Certificate status
  e.certificate_issued,
  e.certificate_issued_at,
  
  -- Ready for certificate?
  is_ready_for_certificate(e.id) AS ready_for_certificate

FROM ce_enrollments e
JOIN ce_programs p ON e.program_id = p.id;

-- View: Program Statistics
CREATE OR REPLACE VIEW ce_program_stats AS
SELECT
  p.id AS program_id,
  p.name AS program_name,
  p.program_type,
  p.total_ceus,
  p.is_active,
  
  -- Enrollment stats
  COUNT(DISTINCT e.id) AS total_enrollments,
  COUNT(DISTINCT e.id) FILTER (WHERE e.status = 'active') AS active_enrollments,
  COUNT(DISTINCT e.id) FILTER (WHERE e.status = 'completed') AS completed_enrollments,
  
  -- Session stats
  COUNT(DISTINCT s.id) AS total_sessions,
  COUNT(DISTINCT s.id) FILTER (WHERE s.is_completed = TRUE) AS completed_sessions,
  
  -- Certificate stats
  COUNT(DISTINCT cert.id) AS certificates_issued,
  
  -- Engagement
  COALESCE(AVG(e.sessions_completed), 0) AS avg_sessions_per_participant,
  COALESCE(AVG(e.total_ceus_earned), 0) AS avg_ceus_per_participant

FROM ce_programs p
LEFT JOIN ce_enrollments e ON p.id = e.program_id
LEFT JOIN ce_sessions s ON p.id = s.program_id
LEFT JOIN ce_certificates cert ON p.id = cert.program_id
GROUP BY p.id, p.name, p.program_type, p.total_ceus, p.is_active;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE ce_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ce_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ce_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ce_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE ce_certificates ENABLE ROW LEVEL SECURITY;

-- Programs: Public read, admin write
CREATE POLICY ce_programs_select_policy ON ce_programs
  FOR SELECT USING (is_active = TRUE OR auth.uid() IN (
    SELECT user_id FROM ce_enrollments WHERE program_id = ce_programs.id
  ));

CREATE POLICY ce_programs_insert_policy ON ce_programs
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY ce_programs_update_policy ON ce_programs
  FOR UPDATE USING (auth.uid() = created_by);

-- Sessions: Public read for enrolled programs
CREATE POLICY ce_sessions_select_policy ON ce_sessions
  FOR SELECT USING (
    program_id IN (
      SELECT program_id FROM ce_enrollments WHERE user_id = auth.uid()
    )
    OR program_id IN (
      SELECT id FROM ce_programs WHERE created_by = auth.uid()
    )
  );

-- Enrollments: Own enrollments only
CREATE POLICY ce_enrollments_select_policy ON ce_enrollments
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY ce_enrollments_insert_policy ON ce_enrollments
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY ce_enrollments_update_policy ON ce_enrollments
  FOR UPDATE USING (user_id = auth.uid());

-- Attendance: Own attendance only
CREATE POLICY ce_attendance_select_policy ON ce_attendance
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY ce_attendance_insert_policy ON ce_attendance
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY ce_attendance_update_policy ON ce_attendance
  FOR UPDATE USING (user_id = auth.uid());

-- Certificates: Own certificates only
CREATE POLICY ce_certificates_select_policy ON ce_certificates
  FOR SELECT USING (user_id = auth.uid());

-- ============================================================================
-- SAMPLE DATA (for testing)
-- ============================================================================

-- Uncomment to insert sample data
/*
-- Sample Program: Mastermind Group
INSERT INTO ce_programs (name, description, program_type, total_ceus, ce_category, instructor_name, instructor_credentials, start_date, end_date)
VALUES (
  'School BCBA Mastermind Group',
  'Monthly mastermind sessions for school-based BCBAs focusing on ethical leadership, systems building, and burnout reduction.',
  'mastermind',
  12.0,
  'general',
  'Rob Spain, M.S., BCBA, IBA',
  'BCBA, IBA, President of CalABA Education SIG',
  '2024-11-01',
  '2025-10-31'
);

-- Sample Program: CE Course
INSERT INTO ce_programs (name, description, program_type, total_ceus, ce_category, instructor_name, instructor_credentials, start_date, end_date)
VALUES (
  'School BCBA Transformation Program',
  '8-week transformation program for school-based BCBAs covering crisis management, teacher buy-in, and school-wide systems.',
  'course',
  16.0,
  'general',
  'Rob Spain, M.S., BCBA, IBA',
  'BCBA, IBA, Adjunct Professor at Fresno Pacific University',
  '2024-11-15',
  '2025-01-15'
);
*/

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE ce_programs IS 'CE programs (mastermind groups, courses, workshops)';
COMMENT ON TABLE ce_sessions IS 'Individual sessions within a CE program';
COMMENT ON TABLE ce_enrollments IS 'Participant enrollments in CE programs';
COMMENT ON TABLE ce_attendance IS 'Session attendance tracking and CEU awarding';
COMMENT ON TABLE ce_certificates IS 'CE certificates issued to participants';

COMMENT ON FUNCTION calculate_ceus_simple(INTEGER) IS 'Calculate CEUs: 60 minutes = 1.0 CEU';
COMMENT ON FUNCTION update_enrollment_progress(UUID) IS 'Recalculate enrollment progress based on attendance';
COMMENT ON FUNCTION is_ready_for_certificate(UUID) IS 'Check if enrollment meets certificate requirements';

-- ============================================================================
-- MIGRATION RECORD
-- ============================================================================

-- Create migrations table if it doesn't exist
CREATE TABLE IF NOT EXISTS schema_migrations (
  version TEXT PRIMARY KEY,
  description TEXT,
  applied_at TIMESTAMPTZ DEFAULT NOW()
);

-- Record this migration
INSERT INTO schema_migrations (version, description, applied_at)
VALUES ('1.0.0', 'Simple CE Tracking Schema', NOW())
ON CONFLICT (version) DO NOTHING;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================

