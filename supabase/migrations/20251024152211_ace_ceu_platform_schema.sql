-- ============================================================================
-- ACE CEU Platform - Complete Database Schema
-- ============================================================================
-- BACB ACE Provider Handbook Compliant
-- Version 1.0 - Full PRD Implementation
-- Retention: 5 years minimum for all records
-- ============================================================================

-- ============================================================================
-- ENUMS & TYPES
-- ============================================================================

-- User roles in the system
CREATE TYPE ace_user_role AS ENUM (
  'participant',      -- Attendees of CE events
  'instructor',       -- BCBA or qualified instructor
  'co_presenter',     -- Assistant under supervision
  'ace_coordinator',  -- BCBA ≥5 years, manages ACE provider
  'admin'            -- System administrator
);

-- ACE provider types
CREATE TYPE ace_provider_type AS ENUM (
  'individual',      -- Single BCBA ($100 application, $50 renewal)
  'organization'     -- Organization ($200 application, $100 renewal)
);

-- CE event categories per BACB
CREATE TYPE ace_event_category AS ENUM (
  'learning',        -- General continuing education
  'ethics',          -- Ethics-specific content
  'supervision',     -- Supervision-related content
  'teaching'         -- Teaching/instruction content
);

-- Event delivery modalities
CREATE TYPE ace_event_modality AS ENUM (
  'in_person',       -- Physical attendance
  'synchronous',     -- Live online (Zoom, etc.)
  'asynchronous'     -- Self-paced online
);

-- Event status
CREATE TYPE ace_event_status AS ENUM (
  'draft',           -- Being created
  'pending_approval', -- Submitted for coordinator review
  'approved',        -- Ready for registration
  'in_progress',     -- Currently running
  'completed',       -- Finished
  'archived'         -- Past retention period
);

-- Participation verification methods
CREATE TYPE ace_verification_method AS ENUM (
  'attendance_log',   -- Manual attendance tracking
  'quiz_completion',  -- Quiz with passing score
  'verification_code', -- Random code entry
  'time_on_task',     -- Timed content tracking
  'check_in_prompts'  -- Periodic verification
);

-- Complaint status
CREATE TYPE ace_complaint_status AS ENUM (
  'submitted',
  'under_review',
  'resolved',
  'escalated_to_bacb'
);

-- Certificate status
CREATE TYPE ace_certificate_status AS ENUM (
  'pending',         -- Waiting for quiz/feedback completion
  'issued',          -- Certificate generated and available
  'revoked'          -- Certificate invalidated
);

-- ============================================================================
-- CORE USER MANAGEMENT
-- ============================================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE ace_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supabase_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Personal Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  bacb_id TEXT, -- BACB certification number (required for participants)

  -- Role & Status
  role ace_user_role NOT NULL DEFAULT 'participant',
  is_active BOOLEAN DEFAULT TRUE,

  -- Contact
  phone TEXT,
  organization TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_login_at TIMESTAMPTZ,

  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_ace_users_email ON ace_users(email);
CREATE INDEX idx_ace_users_bacb_id ON ace_users(bacb_id);
CREATE INDEX idx_ace_users_role ON ace_users(role);

-- ============================================================================
-- ACE PROVIDER MANAGEMENT
-- ============================================================================

-- ACE Providers (approved by BACB)
CREATE TABLE ace_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Provider Information
  provider_name TEXT NOT NULL,
  provider_type ace_provider_type NOT NULL,
  bacb_provider_number TEXT UNIQUE, -- Assigned by BACB after approval

  -- Coordinator (must be BCBA ≥5 years)
  coordinator_id UUID NOT NULL REFERENCES ace_users(id),
  coordinator_years_certified INTEGER NOT NULL CHECK (coordinator_years_certified >= 5),

  -- Contact Information
  primary_email TEXT NOT NULL,
  primary_phone TEXT,
  website TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'USA',

  -- Application & Renewal
  application_date DATE,
  approval_date DATE,
  expiration_date DATE,
  is_active BOOLEAN DEFAULT TRUE,

  -- Fees
  application_fee_paid BOOLEAN DEFAULT FALSE,
  application_fee_amount DECIMAL(10,2),
  application_fee_paid_date DATE,

  -- Renewal
  last_renewal_date DATE,
  next_renewal_date DATE,
  renewal_fee_paid BOOLEAN DEFAULT FALSE,
  renewal_reminder_sent_45_days BOOLEAN DEFAULT FALSE,
  renewal_reminder_sent_15_days BOOLEAN DEFAULT FALSE,
  renewal_reminder_sent_5_days BOOLEAN DEFAULT FALSE,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT valid_provider_email CHECK (primary_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_ace_providers_coordinator ON ace_providers(coordinator_id);
CREATE INDEX idx_ace_providers_active ON ace_providers(is_active);
CREATE INDEX idx_ace_providers_expiration ON ace_providers(expiration_date);

-- ============================================================================
-- INSTRUCTOR QUALIFICATIONS
-- ============================================================================

-- Instructor qualification documentation
CREATE TABLE ace_instructor_qualifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES ace_users(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES ace_providers(id) ON DELETE CASCADE,

  -- Qualification Type
  is_bcba BOOLEAN DEFAULT FALSE,
  is_bcba_d BOOLEAN DEFAULT FALSE,
  is_phd_aba BOOLEAN DEFAULT FALSE,
  is_doctoral_student_ms_complete BOOLEAN DEFAULT FALSE,

  -- Certification Details
  certification_number TEXT,
  certification_date DATE,
  certification_expiration DATE,

  -- Credentials Documentation (file storage URLs)
  cv_url TEXT,
  transcript_url TEXT,
  certification_proof_url TEXT,

  -- Verification
  verified_by UUID REFERENCES ace_users(id), -- ACE coordinator who verified
  verified_at TIMESTAMPTZ,
  is_approved BOOLEAN DEFAULT FALSE,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT at_least_one_qualification CHECK (
    is_bcba OR is_bcba_d OR is_phd_aba OR is_doctoral_student_ms_complete
  )
);

CREATE INDEX idx_instructor_qualifications_user ON ace_instructor_qualifications(user_id);
CREATE INDEX idx_instructor_qualifications_provider ON ace_instructor_qualifications(provider_id);

-- ============================================================================
-- EVENT MANAGEMENT
-- ============================================================================

-- CE Events
CREATE TABLE ace_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES ace_providers(id) ON DELETE CASCADE,

  -- Event Details
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category ace_event_category NOT NULL,
  modality ace_event_modality NOT NULL,
  status ace_event_status DEFAULT 'draft',

  -- CEU Calculation (0.5 CEU per 25 minutes)
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  ceus_offered DECIMAL(4,2) NOT NULL, -- Auto-calculated: duration_minutes / 50

  -- Schedule
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'America/New_York',
  registration_deadline TIMESTAMPTZ,

  -- Capacity
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,

  -- Learning Objectives (behaviorally stated)
  learning_objectives TEXT[] NOT NULL, -- Array of objectives

  -- Disclosures
  conflicts_of_interest TEXT,
  commercial_support TEXT,
  affiliations TEXT,

  -- Verification Method
  verification_method ace_verification_method NOT NULL DEFAULT 'quiz_completion',
  passing_score_percentage INTEGER DEFAULT 80 CHECK (passing_score_percentage BETWEEN 0 AND 100),

  -- Content Delivery
  content_url TEXT, -- Link to video/materials
  live_meeting_url TEXT, -- Zoom/Teams link for synchronous
  verification_code TEXT, -- Random code for live events

  -- Pricing
  fee DECIMAL(10,2) DEFAULT 0.00,
  is_free BOOLEAN GENERATED ALWAYS AS (fee = 0.00) STORED,

  -- Approval
  submitted_for_approval_at TIMESTAMPTZ,
  approved_by UUID REFERENCES ace_users(id), -- Coordinator
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,

  -- Metadata
  created_by UUID NOT NULL REFERENCES ace_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT valid_dates CHECK (end_date > start_date),
  CONSTRAINT valid_registration_deadline CHECK (
    registration_deadline IS NULL OR registration_deadline <= start_date
  )
);

CREATE INDEX idx_ace_events_provider ON ace_events(provider_id);
CREATE INDEX idx_ace_events_category ON ace_events(category);
CREATE INDEX idx_ace_events_status ON ace_events(status);
CREATE INDEX idx_ace_events_start_date ON ace_events(start_date);
CREATE INDEX idx_ace_events_created_by ON ace_events(created_by);

-- ============================================================================
-- EVENT INSTRUCTORS (Many-to-Many)
-- ============================================================================

CREATE TABLE ace_event_instructors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES ace_events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES ace_users(id) ON DELETE CASCADE,

  -- Role
  is_primary_instructor BOOLEAN DEFAULT FALSE,
  is_co_presenter BOOLEAN DEFAULT FALSE,

  -- Bio for event marketing
  bio TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT unique_event_instructor UNIQUE(event_id, user_id)
);

CREATE INDEX idx_event_instructors_event ON ace_event_instructors(event_id);
CREATE INDEX idx_event_instructors_user ON ace_event_instructors(user_id);

-- ============================================================================
-- EVENT MATERIALS (5-year retention)
-- ============================================================================

CREATE TABLE ace_event_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES ace_events(id) ON DELETE CASCADE,

  -- Material Details
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL, -- Storage URL (Supabase Storage, S3, etc.)
  file_type TEXT, -- pdf, pptx, video, etc.
  file_size_bytes BIGINT,

  -- Classification
  is_syllabus BOOLEAN DEFAULT FALSE,
  is_handout BOOLEAN DEFAULT FALSE,
  is_recording BOOLEAN DEFAULT FALSE,
  is_marketing_material BOOLEAN DEFAULT FALSE,

  -- Retention
  retention_delete_after DATE, -- 5 years from event end

  uploaded_by UUID REFERENCES ace_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_event_materials_event ON ace_event_materials(event_id);
CREATE INDEX idx_event_materials_retention ON ace_event_materials(retention_delete_after);

-- ============================================================================
-- REGISTRATION & ENROLLMENT
-- ============================================================================

CREATE TABLE ace_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES ace_events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES ace_users(id) ON DELETE CASCADE,

  -- Registration Details
  registration_date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  confirmation_code TEXT UNIQUE NOT NULL, -- Auto-generated

  -- Payment
  fee_paid BOOLEAN DEFAULT FALSE,
  payment_amount DECIMAL(10,2),
  payment_date TIMESTAMPTZ,
  stripe_payment_intent_id TEXT,

  -- Status
  is_confirmed BOOLEAN DEFAULT FALSE,
  is_cancelled BOOLEAN DEFAULT FALSE,
  cancellation_date TIMESTAMPTZ,
  cancellation_reason TEXT,

  -- Completion Tracking
  has_attended BOOLEAN DEFAULT FALSE,
  quiz_completed BOOLEAN DEFAULT FALSE,
  feedback_completed BOOLEAN DEFAULT FALSE,
  certificate_issued BOOLEAN DEFAULT FALSE,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT unique_registration UNIQUE(event_id, user_id)
);

CREATE INDEX idx_registrations_event ON ace_registrations(event_id);
CREATE INDEX idx_registrations_user ON ace_registrations(user_id);
CREATE INDEX idx_registrations_confirmation ON ace_registrations(confirmation_code);

-- ============================================================================
-- ATTENDANCE TRACKING
-- ============================================================================

CREATE TABLE ace_attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES ace_registrations(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES ace_events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES ace_users(id) ON DELETE CASCADE,

  -- Attendance Details
  check_in_time TIMESTAMPTZ,
  check_out_time TIMESTAMPTZ,
  duration_minutes INTEGER, -- Calculated from check-in/out

  -- Verification
  verification_code_entered TEXT,
  verification_code_timestamp TIMESTAMPTZ,
  ip_address INET,
  user_agent TEXT,

  -- Time on Task (for asynchronous)
  time_on_task_seconds INTEGER DEFAULT 0,
  last_activity_at TIMESTAMPTZ,

  -- Progress
  content_progress_percentage INTEGER DEFAULT 0 CHECK (content_progress_percentage BETWEEN 0 AND 100),

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_attendance_registration ON ace_attendance_records(registration_id);
CREATE INDEX idx_attendance_event ON ace_attendance_records(event_id);
CREATE INDEX idx_attendance_user ON ace_attendance_records(user_id);

-- ============================================================================
-- QUIZ & ASSESSMENT ENGINE
-- ============================================================================

-- Quizzes (one per event)
CREATE TABLE ace_quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES ace_events(id) ON DELETE CASCADE,

  -- Quiz Configuration
  title TEXT NOT NULL,
  description TEXT,
  passing_score_percentage INTEGER NOT NULL DEFAULT 80 CHECK (passing_score_percentage BETWEEN 0 AND 100),
  max_attempts INTEGER, -- NULL = unlimited
  time_limit_minutes INTEGER, -- NULL = no limit
  randomize_questions BOOLEAN DEFAULT TRUE,
  randomize_options BOOLEAN DEFAULT TRUE,
  show_correct_answers_after_submission BOOLEAN DEFAULT TRUE,

  -- Status
  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT one_quiz_per_event UNIQUE(event_id)
);

CREATE INDEX idx_quizzes_event ON ace_quizzes(event_id);

-- Quiz Questions
CREATE TABLE ace_quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES ace_quizzes(id) ON DELETE CASCADE,

  -- Question Content
  question_text TEXT NOT NULL,
  question_type TEXT DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'true_false', 'multiple_select')),

  -- Options (stored as JSON array)
  options JSONB NOT NULL, -- [{"id": "a", "text": "Option A"}, ...]
  correct_answers JSONB NOT NULL, -- ["a"] or ["a", "c"] for multiple select

  -- Metadata
  explanation TEXT, -- Shown after submission
  points INTEGER DEFAULT 1,
  order_index INTEGER,

  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_quiz_questions_quiz ON ace_quiz_questions(quiz_id);
CREATE INDEX idx_quiz_questions_order ON ace_quiz_questions(quiz_id, order_index);

-- Quiz Attempts
CREATE TABLE ace_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES ace_quizzes(id) ON DELETE CASCADE,
  registration_id UUID NOT NULL REFERENCES ace_registrations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES ace_users(id) ON DELETE CASCADE,

  -- Attempt Details
  attempt_number INTEGER NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMPTZ,
  time_spent_seconds INTEGER,

  -- Scoring
  score INTEGER, -- Correct answers count
  total_questions INTEGER,
  score_percentage DECIMAL(5,2), -- Calculated: (score / total) * 100
  passed BOOLEAN,

  -- Answers (stored as JSON)
  answers JSONB, -- {"question_id": "selected_option_id", ...}

  -- Metadata
  ip_address INET,
  user_agent TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT unique_attempt_number UNIQUE(quiz_id, user_id, attempt_number)
);

CREATE INDEX idx_quiz_attempts_quiz ON ace_quiz_attempts(quiz_id);
CREATE INDEX idx_quiz_attempts_registration ON ace_quiz_attempts(registration_id);
CREATE INDEX idx_quiz_attempts_user ON ace_quiz_attempts(user_id);

-- ============================================================================
-- FEEDBACK SYSTEM (REQUIRED BEFORE CERTIFICATE)
-- ============================================================================

CREATE TABLE ace_feedback_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES ace_events(id) ON DELETE CASCADE,

  -- Configuration
  is_required BOOLEAN DEFAULT TRUE,

  -- Questions (stored as JSON for flexibility)
  questions JSONB NOT NULL,
  /* Example structure:
  [
    {"id": "q1", "type": "rating", "text": "Instructor effectiveness", "scale": 5},
    {"id": "q2", "type": "rating", "text": "Content relevance", "scale": 5},
    {"id": "q3", "type": "text", "text": "How will you apply this?"},
    {"id": "q4", "type": "text", "text": "Additional feedback"}
  ]
  */

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT one_feedback_form_per_event UNIQUE(event_id)
);

CREATE INDEX idx_feedback_forms_event ON ace_feedback_forms(event_id);

-- Feedback Responses
CREATE TABLE ace_feedback_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_form_id UUID NOT NULL REFERENCES ace_feedback_forms(id) ON DELETE CASCADE,
  registration_id UUID NOT NULL REFERENCES ace_registrations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES ace_users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES ace_events(id) ON DELETE CASCADE,

  -- Response Data
  responses JSONB NOT NULL, -- {"q1": 5, "q2": 4, "q3": "text response", ...}

  -- Metadata
  submitted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  ip_address INET,

  CONSTRAINT unique_feedback_response UNIQUE(feedback_form_id, user_id)
);

CREATE INDEX idx_feedback_responses_form ON ace_feedback_responses(feedback_form_id);
CREATE INDEX idx_feedback_responses_registration ON ace_feedback_responses(registration_id);
CREATE INDEX idx_feedback_responses_event ON ace_feedback_responses(event_id);

-- ============================================================================
-- CERTIFICATE GENERATION
-- ============================================================================

CREATE TABLE ace_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES ace_registrations(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES ace_events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES ace_users(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES ace_providers(id) ON DELETE CASCADE,

  -- Certificate Details
  certificate_number TEXT UNIQUE NOT NULL, -- Auto-generated unique ID

  -- Participant Info
  participant_name TEXT NOT NULL,
  participant_bacb_id TEXT NOT NULL,

  -- Event Info
  event_title TEXT NOT NULL,
  event_date_start DATE NOT NULL,
  event_date_end DATE NOT NULL,
  event_modality ace_event_modality NOT NULL,

  -- CEUs Breakdown
  ceus_learning DECIMAL(4,2) DEFAULT 0.00,
  ceus_ethics DECIMAL(4,2) DEFAULT 0.00,
  ceus_supervision DECIMAL(4,2) DEFAULT 0.00,
  ceus_total DECIMAL(4,2) NOT NULL,

  -- Provider Info
  provider_name TEXT NOT NULL,
  provider_number TEXT NOT NULL,
  coordinator_name TEXT NOT NULL,
  coordinator_signature_url TEXT,

  -- Instructors
  instructor_names TEXT[] NOT NULL,

  -- Status
  status ace_certificate_status DEFAULT 'pending',
  issued_date DATE,
  issue_timestamp TIMESTAMPTZ,
  days_to_issue INTEGER, -- Track 45-day compliance

  -- PDF Storage
  pdf_url TEXT, -- Supabase Storage URL
  pdf_generated_at TIMESTAMPTZ,

  -- Verification
  verification_url TEXT, -- Public verification link

  -- Revocation
  revoked_at TIMESTAMPTZ,
  revocation_reason TEXT,
  revoked_by UUID REFERENCES ace_users(id),

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT unique_certificate_per_registration UNIQUE(registration_id),
  CONSTRAINT valid_ceus CHECK (ceus_total = ceus_learning + ceus_ethics + ceus_supervision)
);

CREATE INDEX idx_certificates_registration ON ace_certificates(registration_id);
CREATE INDEX idx_certificates_user ON ace_certificates(user_id);
CREATE INDEX idx_certificates_event ON ace_certificates(event_id);
CREATE INDEX idx_certificates_number ON ace_certificates(certificate_number);
CREATE INDEX idx_certificates_status ON ace_certificates(status);

-- ============================================================================
-- COMPLAINTS & RESOLUTION
-- ============================================================================

CREATE TABLE ace_complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Complainant
  submitted_by_user_id UUID REFERENCES ace_users(id),
  submitted_by_name TEXT NOT NULL,
  submitted_by_email TEXT NOT NULL,

  -- Target
  event_id UUID REFERENCES ace_events(id),
  provider_id UUID REFERENCES ace_providers(id),
  instructor_id UUID REFERENCES ace_users(id),

  -- Complaint Details
  complaint_type TEXT, -- 'content', 'instructor', 'certificate', 'other'
  complaint_text TEXT NOT NULL,
  supporting_documents_urls TEXT[], -- Array of file URLs

  -- Status
  status ace_complaint_status DEFAULT 'submitted',

  -- Resolution
  assigned_to UUID REFERENCES ace_users(id), -- Coordinator
  assigned_at TIMESTAMPTZ,
  resolution_notes TEXT,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES ace_users(id),

  -- BACB Escalation
  escalated_to_bacb BOOLEAN DEFAULT FALSE,
  escalation_date TIMESTAMPTZ,
  bacb_case_number TEXT,

  -- Metadata
  submitted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_complaints_event ON ace_complaints(event_id);
CREATE INDEX idx_complaints_provider ON ace_complaints(provider_id);
CREATE INDEX idx_complaints_status ON ace_complaints(status);
CREATE INDEX idx_complaints_submitted_at ON ace_complaints(submitted_at);

-- ============================================================================
-- AUDIT LOGS & COMPLIANCE
-- ============================================================================

CREATE TABLE ace_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Entity Tracking
  entity_type TEXT NOT NULL, -- 'event', 'certificate', 'user', etc.
  entity_id UUID NOT NULL,

  -- Action
  action TEXT NOT NULL, -- 'created', 'updated', 'deleted', 'approved', etc.
  actor_id UUID REFERENCES ace_users(id),
  actor_role ace_user_role,

  -- Details
  changes JSONB, -- Old and new values
  metadata JSONB, -- Additional context

  -- Context
  ip_address INET,
  user_agent TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_audit_logs_entity ON ace_audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_actor ON ace_audit_logs(actor_id);
CREATE INDEX idx_audit_logs_created ON ace_audit_logs(created_at);

-- ============================================================================
-- RENEWAL REMINDERS (Automated)
-- ============================================================================

CREATE TABLE ace_renewal_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES ace_providers(id) ON DELETE CASCADE,

  -- Reminder Type
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('45_days', '15_days', '5_days', 'expired')),

  -- Status
  sent_at TIMESTAMPTZ,
  email_sent_to TEXT,
  is_acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_at TIMESTAMPTZ,

  -- Next Renewal Date
  renewal_due_date DATE NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_renewal_reminders_provider ON ace_renewal_reminders(provider_id);
CREATE INDEX idx_renewal_reminders_due_date ON ace_renewal_reminders(renewal_due_date);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Calculate CEUs from duration (0.5 CEU per 25 minutes)
CREATE OR REPLACE FUNCTION calculate_ceus(duration_minutes INTEGER)
RETURNS DECIMAL(4,2) AS $$
BEGIN
  RETURN ROUND((duration_minutes::DECIMAL / 50.0), 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Generate unique certificate number
CREATE OR REPLACE FUNCTION generate_certificate_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- Format: BS-YYYYMMDD-XXXX (BS = BehaviorSchool)
    new_number := 'BS-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');

    SELECT EXISTS(SELECT 1 FROM ace_certificates WHERE certificate_number = new_number) INTO exists_check;

    EXIT WHEN NOT exists_check;
  END LOOP;

  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Check if user meets instructor qualifications
CREATE OR REPLACE FUNCTION is_qualified_instructor(user_id_param UUID)
RETURNS BOOLEAN AS $$
DECLARE
  is_qualified BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1
    FROM ace_instructor_qualifications
    WHERE user_id = user_id_param
    AND is_approved = TRUE
    AND (is_bcba OR is_bcba_d OR is_phd_aba OR is_doctoral_student_ms_complete)
  ) INTO is_qualified;

  RETURN is_qualified;
END;
$$ LANGUAGE plpgsql;

-- Check if registration is eligible for certificate
CREATE OR REPLACE FUNCTION is_eligible_for_certificate(registration_id_param UUID)
RETURNS BOOLEAN AS $$
DECLARE
  reg RECORD;
BEGIN
  SELECT
    has_attended,
    quiz_completed,
    feedback_completed
  INTO reg
  FROM ace_registrations
  WHERE id = registration_id_param;

  RETURN (reg.has_attended AND reg.quiz_completed AND reg.feedback_completed);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_ace_users_updated_at BEFORE UPDATE ON ace_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ace_providers_updated_at BEFORE UPDATE ON ace_providers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ace_events_updated_at BEFORE UPDATE ON ace_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ace_registrations_updated_at BEFORE UPDATE ON ace_registrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ace_attendance_updated_at BEFORE UPDATE ON ace_attendance_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-calculate CEUs when event duration changes
CREATE OR REPLACE FUNCTION auto_calculate_event_ceus()
RETURNS TRIGGER AS $$
BEGIN
  NEW.ceus_offered := calculate_ceus(NEW.duration_minutes);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_event_ceus
BEFORE INSERT OR UPDATE OF duration_minutes ON ace_events
FOR EACH ROW
EXECUTE FUNCTION auto_calculate_event_ceus();

-- Generate certificate number on insert
CREATE OR REPLACE FUNCTION auto_generate_certificate_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.certificate_number IS NULL THEN
    NEW.certificate_number := generate_certificate_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_cert_number
BEFORE INSERT ON ace_certificates
FOR EACH ROW
EXECUTE FUNCTION auto_generate_certificate_number();

-- Track days to issue certificate (45-day compliance)
CREATE OR REPLACE FUNCTION calculate_days_to_issue()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.issued_date IS NOT NULL AND OLD.issued_date IS NULL THEN
    SELECT EXTRACT(DAY FROM (NEW.issued_date - e.end_date))::INTEGER
    INTO NEW.days_to_issue
    FROM ace_events e
    WHERE e.id = NEW.event_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_certificate_issue_time
BEFORE UPDATE OF issued_date ON ace_certificates
FOR EACH ROW
EXECUTE FUNCTION calculate_days_to_issue();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE ace_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ace_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ace_instructor_qualifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ace_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ace_event_instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE ace_event_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE ace_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ace_attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ace_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ace_quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ace_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ace_feedback_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE ace_feedback_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE ace_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE ace_complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE ace_audit_logs ENABLE ROW LEVEL SECURITY;

-- Public read for approved events
CREATE POLICY "Public can view approved events"
  ON ace_events
  FOR SELECT
  USING (status = 'approved');

-- Users can view their own data
CREATE POLICY "Users can view own profile"
  ON ace_users
  FOR SELECT
  USING (auth.uid() = supabase_user_id);

CREATE POLICY "Users can view own registrations"
  ON ace_registrations
  FOR SELECT
  USING (auth.uid() = (SELECT supabase_user_id FROM ace_users WHERE id = user_id));

CREATE POLICY "Users can view own certificates"
  ON ace_certificates
  FOR SELECT
  USING (auth.uid() = (SELECT supabase_user_id FROM ace_users WHERE id = user_id));

-- Instructors can manage their events
CREATE POLICY "Instructors can view their events"
  ON ace_events
  FOR SELECT
  USING (created_by IN (SELECT id FROM ace_users WHERE supabase_user_id = auth.uid()));

-- Coordinators can manage their provider
CREATE POLICY "Coordinators can manage provider events"
  ON ace_events
  FOR ALL
  USING (provider_id IN (SELECT id FROM ace_providers WHERE coordinator_id IN (SELECT id FROM ace_users WHERE supabase_user_id = auth.uid())));

-- Admin has full access (implement via service role key)

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Event overview with participant count
CREATE OR REPLACE VIEW ace_event_overview AS
SELECT
  e.*,
  p.provider_name,
  p.bacb_provider_number,
  u.first_name || ' ' || u.last_name AS creator_name,
  COUNT(DISTINCT r.id) AS total_registrations,
  COUNT(DISTINCT r.id) FILTER (WHERE r.has_attended) AS total_attended,
  COUNT(DISTINCT r.id) FILTER (WHERE r.certificate_issued) AS total_certificates_issued
FROM ace_events e
LEFT JOIN ace_providers p ON e.provider_id = p.id
LEFT JOIN ace_users u ON e.created_by = u.id
LEFT JOIN ace_registrations r ON e.id = r.event_id
GROUP BY e.id, p.provider_name, p.bacb_provider_number, u.first_name, u.last_name;

-- User CEU transcript
CREATE OR REPLACE VIEW ace_user_transcript AS
SELECT
  u.id AS user_id,
  u.first_name,
  u.last_name,
  u.bacb_id,
  c.certificate_number,
  c.event_title,
  c.event_date_start,
  c.event_date_end,
  c.ceus_learning,
  c.ceus_ethics,
  c.ceus_supervision,
  c.ceus_total,
  c.issued_date,
  c.provider_name,
  c.provider_number
FROM ace_users u
JOIN ace_certificates c ON u.id = c.user_id
WHERE c.status = 'issued'
ORDER BY c.issued_date DESC;

-- Provider dashboard stats
CREATE OR REPLACE VIEW ace_provider_dashboard AS
SELECT
  p.id AS provider_id,
  p.provider_name,
  p.bacb_provider_number,
  COUNT(DISTINCT e.id) AS total_events,
  COUNT(DISTINCT e.id) FILTER (WHERE e.status = 'approved') AS active_events,
  COUNT(DISTINCT r.id) AS total_registrations,
  COUNT(DISTINCT c.id) AS total_certificates_issued,
  SUM(r.payment_amount) AS total_revenue
FROM ace_providers p
LEFT JOIN ace_events e ON p.id = e.provider_id
LEFT JOIN ace_registrations r ON e.id = r.event_id
LEFT JOIN ace_certificates c ON r.id = c.registration_id
GROUP BY p.id, p.provider_name, p.bacb_provider_number;

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Composite indexes for common queries
CREATE INDEX idx_registrations_event_user ON ace_registrations(event_id, user_id);
CREATE INDEX idx_certificates_user_issued ON ace_certificates(user_id, issued_date) WHERE status = 'issued';
CREATE INDEX idx_events_provider_status ON ace_events(provider_id, status);
CREATE INDEX idx_attendance_event_user ON ace_attendance_records(event_id, user_id);

-- Full-text search on events
CREATE INDEX idx_events_title_search ON ace_events USING gin(to_tsvector('english', title || ' ' || description));

-- ============================================================================
-- DATA RETENTION POLICY HELPER
-- ============================================================================

-- Mark old records for archival (5+ years)
CREATE OR REPLACE FUNCTION mark_records_for_archival()
RETURNS void AS $$
BEGIN
  -- Update events older than 5 years
  UPDATE ace_events
  SET status = 'archived'
  WHERE end_date < NOW() - INTERVAL '5 years'
  AND status = 'completed';

  -- Set retention dates for materials
  UPDATE ace_event_materials
  SET retention_delete_after = (
    SELECT e.end_date + INTERVAL '5 years'
    FROM ace_events e
    WHERE e.id = event_id
  )
  WHERE retention_delete_after IS NULL;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
