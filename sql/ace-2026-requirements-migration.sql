-- ============================================================================
-- ACE Platform - 2026 BACB Requirements Migration
-- ============================================================================
-- Effective Date: January 1, 2026
-- Implementation Date: October 23, 2024 (Ready for testing)
-- Version: 2.0
-- ============================================================================
--
-- This migration adds all new requirements from the BACB ACE Handbook 2026:
-- 1. Coordinator certification tracking
-- 2. Legal entity verification for organizations
-- 3. Expanded instructor qualification paths
-- 4. Strict CEU/PDU calculation rules
-- 5. Enhanced attendance verification
-- 6. Certificate subcategory display
-- 7. RBT Professional Development (PD) separation
-- 8. Feedback timeline requirements
-- 9. Complaint resolution with NAV notification
-- 10. Compliance dashboard & audit reports
-- 11. Renewal process changes with grace period
-- 12. Marketing & transparency requirements
--
-- ============================================================================

-- ============================================================================
-- NEW ENUMS FOR 2026
-- ============================================================================

-- Event type: CE vs PD (cannot mix)
CREATE TYPE ace_event_type AS ENUM (
  'ce',    -- Continuing Education (for BCBAs, BCaBAs)
  'pd'     -- Professional Development (for RBTs only)
);

-- Event subtypes with specific limits
CREATE TYPE ace_event_subtype AS ENUM (
  'standard',      -- Regular CE/PD event
  'journal_club',  -- Limited to 1 CEU/PDU per article
  'podcast'        -- Limited to 1 CEU/PDU per episode
);

-- Instructor qualification paths (2026 expanded)
CREATE TYPE ace_instructor_qualification_path AS ENUM (
  'active_bcba',                    -- Currently certified BCBA
  'doctorate_behavior_analysis',    -- PhD/EdD in Behavior Analysis
  'doctorate_with_coursework',      -- Doctorate + qualifying coursework
  'doctorate_with_mentorship',      -- Doctorate + mentorship experience
  'doctorate_with_publications',    -- Doctorate + ABA publications
  'doctorate_with_postdoc_hours'    -- Doctorate + 1800+ postdoc ABA hours
);

-- Expertise basis for non-BCBA instructors
CREATE TYPE ace_expertise_basis AS ENUM (
  'five_years_practice',    -- 5+ years in subject area
  'three_years_teaching',   -- 3+ years teaching subject
  'published_research'      -- Published research in subject
);

-- ============================================================================
-- UPDATE EXISTING TABLES FOR 2026
-- ============================================================================

-- ============================================================================
-- 1. ACE PROVIDERS - Add 2026 Fields
-- ============================================================================

ALTER TABLE ace_providers
  -- Coordinator certification tracking (Req #1)
  ADD COLUMN coordinator_certification_date DATE,
  ADD COLUMN coordinator_certification_expires DATE,
  ADD COLUMN coordinator_certification_verified BOOLEAN DEFAULT FALSE,
  
  -- Legal entity verification for organizations (Req #2)
  ADD COLUMN ein TEXT,
  ADD COLUMN incorporation_doc_url TEXT,
  ADD COLUMN legal_entity_verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN legal_entity_verified_at TIMESTAMPTZ,
  ADD COLUMN legal_entity_verified_by UUID REFERENCES ace_users(id),
  
  -- Leadership attestation (Req #2)
  ADD COLUMN leadership_attestation_url TEXT,
  ADD COLUMN leadership_attestation_date DATE,
  ADD COLUMN leadership_name TEXT,
  ADD COLUMN leadership_title TEXT,
  
  -- Renewal grace period (Req #11)
  ADD COLUMN grace_period_end_date DATE,
  ADD COLUMN reinstatement_date DATE,
  ADD COLUMN late_fee_paid BOOLEAN DEFAULT FALSE,
  ADD COLUMN late_fee_amount DECIMAL(10,2),
  ADD COLUMN late_fee_paid_date DATE,
  
  -- Event publishing control during lapse (Req #11)
  ADD COLUMN can_publish_events BOOLEAN DEFAULT TRUE,
  ADD COLUMN can_issue_certificates BOOLEAN DEFAULT TRUE,
  ADD COLUMN lapse_start_date DATE,
  ADD COLUMN lapse_end_date DATE;

-- Add constraints
ALTER TABLE ace_providers
  ADD CONSTRAINT coordinator_cert_dates_logical 
    CHECK (coordinator_certification_date IS NULL OR 
           coordinator_certification_expires IS NULL OR 
           coordinator_certification_expires > coordinator_certification_date),
  
  ADD CONSTRAINT grace_period_logical
    CHECK (grace_period_end_date IS NULL OR 
           expiration_date IS NULL OR 
           grace_period_end_date >= expiration_date);

-- Add indexes for performance
CREATE INDEX idx_ace_providers_coordinator_cert_expires 
  ON ace_providers(coordinator_certification_expires) 
  WHERE coordinator_certification_expires IS NOT NULL;

CREATE INDEX idx_ace_providers_grace_period 
  ON ace_providers(grace_period_end_date) 
  WHERE grace_period_end_date IS NOT NULL;

CREATE INDEX idx_ace_providers_lapsed 
  ON ace_providers(lapse_start_date, lapse_end_date) 
  WHERE lapse_start_date IS NOT NULL;

-- ============================================================================
-- 2. INSTRUCTOR QUALIFICATIONS - Expand for 2026
-- ============================================================================

ALTER TABLE ace_instructor_qualifications
  -- New qualification path (Req #3)
  ADD COLUMN qualification_path ace_instructor_qualification_path,
  
  -- Doctorate information (Req #3)
  ADD COLUMN doctorate_type TEXT,
  ADD COLUMN doctorate_field TEXT,
  ADD COLUMN institution_name TEXT,
  ADD COLUMN graduation_year INTEGER,
  ADD COLUMN qualifying_coursework_doc_url TEXT,
  
  -- Alternative qualifying experience (Req #3)
  ADD COLUMN mentorship_documentation_url TEXT,
  ADD COLUMN mentorship_years INTEGER,
  ADD COLUMN publications_documentation_url TEXT,
  ADD COLUMN publications_count INTEGER,
  ADD COLUMN postdoc_hours_documentation_url TEXT,
  ADD COLUMN postdoc_hours INTEGER,
  
  -- Subject matter expertise (Req #3)
  ADD COLUMN expertise_basis ace_expertise_basis,
  ADD COLUMN years_experience_in_subject INTEGER,
  ADD COLUMN years_teaching_subject INTEGER,
  ADD COLUMN expertise_documentation_urls JSONB DEFAULT '[]'::jsonb,
  
  -- Enhanced verification
  ADD COLUMN qualification_review_notes TEXT,
  ADD COLUMN expertise_review_notes TEXT;

-- Add constraint to ensure proper qualification documentation
ALTER TABLE ace_instructor_qualifications
  ADD CONSTRAINT valid_qualification_path
    CHECK (
      (qualification_path = 'active_bcba' AND is_bcba = TRUE) OR
      (qualification_path IN ('doctorate_behavior_analysis', 'doctorate_with_coursework', 
                               'doctorate_with_mentorship', 'doctorate_with_publications', 
                               'doctorate_with_postdoc_hours') 
       AND doctorate_type IS NOT NULL)
    );

-- ============================================================================
-- 3. EVENTS - Add CE/PD Separation & New Requirements
-- ============================================================================

ALTER TABLE ace_events
  -- Event type: CE vs PD (Req #7)
  ADD COLUMN event_type ace_event_type DEFAULT 'ce',
  ADD COLUMN event_subtype ace_event_subtype DEFAULT 'standard',
  
  -- RBT alignment for PD events (Req #7)
  ADD COLUMN rbt_alignment_checklist JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN aligns_with_rbt_2026_outline BOOLEAN DEFAULT FALSE,
  ADD COLUMN aligns_with_ethics_code_2_0 BOOLEAN DEFAULT FALSE,
  
  -- Marketing & transparency (Req #12)
  ADD COLUMN instructor_qualifications_summary TEXT,
  ADD COLUMN instructor_affiliations TEXT,
  ADD COLUMN conflicts_of_interest TEXT,
  ADD COLUMN publication_date DATE,
  
  -- Learning objectives (required display - Req #12)
  ADD COLUMN learning_objectives TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Minimum questions per CEU for async (Req #5)
  ADD COLUMN minimum_questions_required INTEGER DEFAULT 0,
  ADD COLUMN actual_questions_count INTEGER DEFAULT 0,
  
  -- Journal club / podcast limits (Req #4)
  ADD COLUMN content_item_count INTEGER DEFAULT 1, -- Number of articles/episodes
  ADD COLUMN max_ceu_per_item DECIMAL(3,1) DEFAULT 1.0;

-- Add constraints
ALTER TABLE ace_events
  ADD CONSTRAINT ce_pd_separation
    CHECK (
      (event_type = 'ce' AND rbt_alignment_checklist IS NULL) OR
      (event_type = 'pd' AND rbt_alignment_checklist IS NOT NULL)
    ),
  
  ADD CONSTRAINT async_question_requirement
    CHECK (
      modality != 'asynchronous' OR 
      (event_type = 'ce' AND actual_questions_count >= (FLOOR(total_ceus) * 3)) OR
      (event_type = 'pd')
    ),
  
  ADD CONSTRAINT subtype_ceu_limits
    CHECK (
      event_subtype = 'standard' OR
      (event_subtype IN ('journal_club', 'podcast') AND 
       total_ceus <= (content_item_count * max_ceu_per_item))
    );

-- Add indexes
CREATE INDEX idx_ace_events_type ON ace_events(event_type);
CREATE INDEX idx_ace_events_subtype ON ace_events(event_subtype);
CREATE INDEX idx_ace_events_publication_date ON ace_events(publication_date) 
  WHERE publication_date IS NOT NULL;

-- ============================================================================
-- 4. ATTENDANCE RECORDS - Enhanced Verification
-- ============================================================================

ALTER TABLE ace_attendance_records
  -- Timestamped sign-in/out for synchronous (Req #5)
  ADD COLUMN sign_in_timestamp TIMESTAMPTZ,
  ADD COLUMN sign_out_timestamp TIMESTAMPTZ,
  ADD COLUMN ip_address INET,
  ADD COLUMN user_agent TEXT,
  
  -- Engagement checks for verification (Req #5)
  ADD COLUMN engagement_checks_completed INTEGER DEFAULT 0,
  ADD COLUMN engagement_checks_required INTEGER DEFAULT 0,
  ADD COLUMN engagement_check_timestamps JSONB DEFAULT '[]'::jsonb,
  
  -- Quiz completion for async (Req #5)
  ADD COLUMN quiz_questions_answered INTEGER DEFAULT 0,
  ADD COLUMN quiz_questions_required INTEGER DEFAULT 0,
  ADD COLUMN quiz_attempts INTEGER DEFAULT 0;

-- Add constraints
ALTER TABLE ace_attendance_records
  ADD CONSTRAINT sign_in_out_logical
    CHECK (sign_in_timestamp IS NULL OR 
           sign_out_timestamp IS NULL OR 
           sign_out_timestamp > sign_in_timestamp),
  
  ADD CONSTRAINT engagement_checks_met
    CHECK (engagement_checks_completed <= engagement_checks_required);

-- Add indexes
CREATE INDEX idx_ace_attendance_sign_in ON ace_attendance_records(sign_in_timestamp);
CREATE INDEX idx_ace_attendance_sign_out ON ace_attendance_records(sign_out_timestamp);

-- ============================================================================
-- 5. CERTIFICATES - Add Subcategory Display
-- ============================================================================

ALTER TABLE ace_certificates
  -- Instructor per subcategory (Req #6)
  ADD COLUMN instructor_subcategories JSONB DEFAULT '{}'::jsonb,
  -- Format: {"ethics": {"instructor_name": "Dr. Jane Smith", "ceus": 2.0}, 
  --          "supervision": {"instructor_name": "Dr. John Doe", "ceus": 1.5}}
  
  -- Certificate issuance timeline (Req #6)
  ADD COLUMN must_be_issued_by DATE,
  ADD COLUMN days_until_due INTEGER,
  
  -- Feedback requirement before issuance
  ADD COLUMN feedback_completed BOOLEAN DEFAULT FALSE,
  ADD COLUMN feedback_completed_at TIMESTAMPTZ;

-- Add constraint: must issue within 45 days
ALTER TABLE ace_certificates
  ADD CONSTRAINT certificate_45_day_rule
    CHECK (issued_at IS NULL OR 
           (issued_at - created_at) <= INTERVAL '45 days');

-- Add index
CREATE INDEX idx_ace_certificates_due_date ON ace_certificates(must_be_issued_by) 
  WHERE status = 'pending';

-- ============================================================================
-- 6. FEEDBACK RESPONSES - Add Coordinator Review Timeline
-- ============================================================================

ALTER TABLE ace_feedback_responses
  -- Coordinator review requirement (Req #8)
  ADD COLUMN coordinator_reviewed_at TIMESTAMPTZ,
  ADD COLUMN coordinator_review_due_date DATE,
  ADD COLUMN coordinator_notes TEXT,
  ADD COLUMN coordinator_action_taken TEXT,
  ADD COLUMN days_until_review_due INTEGER;

-- Add constraint: must review within 45 days
ALTER TABLE ace_feedback_responses
  ADD CONSTRAINT feedback_45_day_review
    CHECK (coordinator_reviewed_at IS NULL OR 
           (coordinator_reviewed_at - submitted_at) <= INTERVAL '45 days');

-- Add index
CREATE INDEX idx_ace_feedback_review_due ON ace_feedback_responses(coordinator_review_due_date) 
  WHERE coordinator_reviewed_at IS NULL;

-- ============================================================================
-- 7. COMPLAINTS - Add NAV Notification
-- ============================================================================

ALTER TABLE ace_complaints
  -- NAV escalation notification (Req #9)
  ADD COLUMN nav_escalation_notified BOOLEAN DEFAULT FALSE,
  ADD COLUMN nav_escalation_notified_at TIMESTAMPTZ,
  ADD COLUMN nav_notification_method TEXT, -- 'email', 'in_app', 'both'
  
  -- Response timeline (Req #9)
  ADD COLUMN response_due_date DATE,
  ADD COLUMN days_until_response_due INTEGER,
  ADD COLUMN is_overdue BOOLEAN GENERATED ALWAYS AS (
    response_due_date IS NOT NULL AND 
    response_due_date < CURRENT_DATE AND 
    resolved_at IS NULL
  ) STORED,
  
  -- Enhanced submitter info
  ADD COLUMN submitter_bacb_id TEXT,
  ADD COLUMN submitter_phone TEXT;

-- Add constraint: must respond within 45 days
ALTER TABLE ace_complaints
  ADD CONSTRAINT complaint_45_day_response
    CHECK (resolved_at IS NULL OR 
           (resolved_at - submitted_at) <= INTERVAL '45 days');

-- Add index
CREATE INDEX idx_ace_complaints_overdue ON ace_complaints(is_overdue) 
  WHERE is_overdue = TRUE;

CREATE INDEX idx_ace_complaints_response_due ON ace_complaints(response_due_date) 
  WHERE resolved_at IS NULL;

-- ============================================================================
-- NEW TABLES FOR 2026
-- ============================================================================

-- ============================================================================
-- LEADERSHIP ATTESTATIONS (Req #2)
-- ============================================================================

CREATE TABLE ace_leadership_attestations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES ace_providers(id) ON DELETE CASCADE,
  
  -- Attestation details
  attested_by_name TEXT NOT NULL,
  attested_by_title TEXT NOT NULL,
  attested_by_email TEXT NOT NULL,
  
  -- What they're attesting to
  attests_legal_entity BOOLEAN NOT NULL DEFAULT FALSE,
  attests_coordinator_appointment BOOLEAN NOT NULL DEFAULT FALSE,
  attests_compliance_commitment BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Signatures & Documents
  signature_url TEXT,
  attestation_document_url TEXT,
  ip_address INET,
  
  -- Metadata
  attested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  valid_until DATE,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  CONSTRAINT valid_attestation_email 
    CHECK (attested_by_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_ace_leadership_attestations_provider ON ace_leadership_attestations(provider_id);
CREATE INDEX idx_ace_leadership_attestations_valid ON ace_leadership_attestations(valid_until);

-- ============================================================================
-- COMPLIANCE REPORTS (Req #10)
-- ============================================================================

CREATE TABLE ace_compliance_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES ace_providers(id) ON DELETE CASCADE,
  
  -- Report metadata
  report_type TEXT NOT NULL, -- 'audit', 'annual_review', 'self_assessment', 'bacb_request'
  report_period_start DATE NOT NULL,
  report_period_end DATE NOT NULL,
  
  -- Compliance score
  compliance_score DECIMAL(5,2), -- 0.00 to 100.00
  total_checks INTEGER,
  passed_checks INTEGER,
  failed_checks INTEGER,
  
  -- Report data (JSON export of all audit data)
  attendance_data JSONB DEFAULT '{}'::jsonb,
  instructor_qualifications_data JSONB DEFAULT '{}'::jsonb,
  feedback_data JSONB DEFAULT '{}'::jsonb,
  certificate_data JSONB DEFAULT '{}'::jsonb,
  complaint_data JSONB DEFAULT '{}'::jsonb,
  
  -- Findings & Issues
  findings TEXT[],
  recommendations TEXT[],
  action_items TEXT[],
  
  -- Generated by
  generated_by UUID REFERENCES ace_users(id),
  generated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Export
  report_url TEXT,
  exported_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  CONSTRAINT valid_report_period CHECK (report_period_end >= report_period_start),
  CONSTRAINT valid_compliance_score CHECK (compliance_score >= 0 AND compliance_score <= 100)
);

CREATE INDEX idx_ace_compliance_reports_provider ON ace_compliance_reports(provider_id);
CREATE INDEX idx_ace_compliance_reports_period ON ace_compliance_reports(report_period_start, report_period_end);
CREATE INDEX idx_ace_compliance_reports_score ON ace_compliance_reports(compliance_score);

-- ============================================================================
-- RENEWAL HISTORY (Req #11)
-- ============================================================================

CREATE TABLE ace_renewal_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES ace_providers(id) ON DELETE CASCADE,
  
  -- Renewal details
  renewal_date DATE NOT NULL,
  previous_expiration_date DATE NOT NULL,
  new_expiration_date DATE NOT NULL,
  
  -- Timing
  renewed_within_45_day_window BOOLEAN DEFAULT FALSE,
  renewed_during_grace_period BOOLEAN DEFAULT FALSE,
  days_past_expiration INTEGER DEFAULT 0,
  
  -- Fees
  renewal_fee_amount DECIMAL(10,2) NOT NULL,
  late_fee_amount DECIMAL(10,2) DEFAULT 0.00,
  total_amount_paid DECIMAL(10,2) NOT NULL,
  payment_date DATE,
  payment_method TEXT,
  payment_reference TEXT,
  
  -- Metadata
  renewed_by UUID REFERENCES ace_users(id),
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  CONSTRAINT valid_renewal_dates CHECK (new_expiration_date > previous_expiration_date),
  CONSTRAINT valid_late_fee CHECK (late_fee_amount >= 0)
);

CREATE INDEX idx_ace_renewal_history_provider ON ace_renewal_history(provider_id);
CREATE INDEX idx_ace_renewal_history_date ON ace_renewal_history(renewal_date);

-- ============================================================================
-- ENGAGEMENT CHECKS (Req #5)
-- ============================================================================

CREATE TABLE ace_engagement_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES ace_events(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES ace_users(id) ON DELETE CASCADE,
  
  -- Check details
  check_number INTEGER NOT NULL,
  prompt_text TEXT NOT NULL,
  prompt_shown_at TIMESTAMPTZ NOT NULL,
  
  -- Response
  response_text TEXT,
  responded_at TIMESTAMPTZ,
  response_time_seconds INTEGER,
  
  -- Verification
  is_correct BOOLEAN,
  is_timely BOOLEAN DEFAULT TRUE, -- Responded within required timeframe
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  CONSTRAINT unique_participant_check UNIQUE (event_id, participant_id, check_number)
);

CREATE INDEX idx_ace_engagement_checks_event ON ace_engagement_checks(event_id);
CREATE INDEX idx_ace_engagement_checks_participant ON ace_engagement_checks(participant_id);

-- ============================================================================
-- RBT ALIGNMENT CRITERIA (Req #7)
-- ============================================================================

CREATE TABLE ace_rbt_alignment_criteria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES ace_events(id) ON DELETE CASCADE,
  
  -- RBT 2026 40-Hour Training Outline alignment
  training_outline_section TEXT,
  training_outline_competency TEXT,
  alignment_notes TEXT,
  
  -- Ethics Code 2.0 alignment
  ethics_code_section TEXT,
  ethics_code_reference TEXT,
  ethics_alignment_notes TEXT,
  
  -- Verification
  verified_by UUID REFERENCES ace_users(id),
  verified_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_ace_rbt_alignment_event ON ace_rbt_alignment_criteria(event_id);

-- ============================================================================
-- FUNCTIONS FOR 2026 COMPLIANCE
-- ============================================================================

-- Function to calculate minimum questions required for async CE events
CREATE OR REPLACE FUNCTION calculate_minimum_questions_async_ce(p_event_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_total_ceus DECIMAL(3,1);
  v_event_type ace_event_type;
  v_modality ace_event_modality;
  v_minimum_questions INTEGER;
BEGIN
  SELECT total_ceus, event_type, modality
  INTO v_total_ceus, v_event_type, v_modality
  FROM ace_events
  WHERE id = p_event_id;
  
  -- Requirement: 3 questions per CEU for asynchronous CE events
  IF v_modality = 'asynchronous' AND v_event_type = 'ce' THEN
    v_minimum_questions := FLOOR(v_total_ceus) * 3;
  ELSE
    v_minimum_questions := 0;
  END IF;
  
  RETURN v_minimum_questions;
END;
$$ LANGUAGE plpgsql;

-- Function to check if provider can publish events (not lapsed)
CREATE OR REPLACE FUNCTION can_provider_publish_events(p_provider_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_is_active BOOLEAN;
  v_expiration_date DATE;
  v_grace_period_end DATE;
BEGIN
  SELECT is_active, expiration_date, grace_period_end_date
  INTO v_is_active, v_expiration_date, v_grace_period_end
  FROM ace_providers
  WHERE id = p_provider_id;
  
  -- Provider must be active and not past grace period
  IF NOT v_is_active THEN
    RETURN FALSE;
  END IF;
  
  -- Check if within valid period or grace period
  IF v_expiration_date IS NULL THEN
    RETURN TRUE; -- No expiration set yet (pending approval)
  END IF;
  
  IF CURRENT_DATE <= v_expiration_date THEN
    RETURN TRUE; -- Within valid period
  END IF;
  
  IF v_grace_period_end IS NOT NULL AND CURRENT_DATE <= v_grace_period_end THEN
    RETURN TRUE; -- Within grace period
  END IF;
  
  RETURN FALSE; -- Lapsed
END;
$$ LANGUAGE plpgsql;

-- Function to calculate CEUs based on strict 25-minute rule
CREATE OR REPLACE FUNCTION calculate_ceus_2026(p_duration_minutes INTEGER)
RETURNS DECIMAL(3,1) AS $$
DECLARE
  v_ceus DECIMAL(3,1);
BEGIN
  -- 2026 Rule: 25 minutes = 0.5 CEU, round DOWN
  v_ceus := FLOOR(p_duration_minutes / 25.0) * 0.5;
  
  RETURN v_ceus;
END;
$$ LANGUAGE plpgsql;

-- Function to check if certificate can be issued
CREATE OR REPLACE FUNCTION can_issue_certificate_2026(p_event_id UUID, p_participant_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_event_type ace_event_type;
  v_modality ace_event_modality;
  v_feedback_completed BOOLEAN;
  v_quiz_passed BOOLEAN;
  v_attendance_verified BOOLEAN;
  v_min_questions INTEGER;
  v_questions_answered INTEGER;
BEGIN
  -- Get event details
  SELECT event_type, modality, minimum_questions_required
  INTO v_event_type, v_modality, v_min_questions
  FROM ace_events
  WHERE id = p_event_id;
  
  -- Check feedback completion (required)
  SELECT COUNT(*) > 0
  INTO v_feedback_completed
  FROM ace_feedback_responses
  WHERE event_id = p_event_id AND participant_id = p_participant_id;
  
  IF NOT v_feedback_completed THEN
    RETURN FALSE;
  END IF;
  
  -- Check attendance/quiz based on modality
  IF v_modality = 'asynchronous' THEN
    -- Must complete minimum questions
    SELECT quiz_questions_answered >= quiz_questions_required
    INTO v_attendance_verified
    FROM ace_attendance_records
    WHERE event_id = p_event_id AND participant_id = p_participant_id;
  ELSE
    -- Must have verified attendance
    SELECT verified = TRUE
    INTO v_attendance_verified
    FROM ace_attendance_records
    WHERE event_id = p_event_id AND participant_id = p_participant_id;
  END IF;
  
  RETURN COALESCE(v_attendance_verified, FALSE);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS FOR 2026 COMPLIANCE
-- ============================================================================

-- Trigger: Auto-calculate minimum questions when event is created/updated
CREATE OR REPLACE FUNCTION trigger_calculate_minimum_questions()
RETURNS TRIGGER AS $$
BEGIN
  NEW.minimum_questions_required := calculate_minimum_questions_async_ce(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_ace_events_minimum_questions
  BEFORE INSERT OR UPDATE OF total_ceus, modality, event_type
  ON ace_events
  FOR EACH ROW
  EXECUTE FUNCTION trigger_calculate_minimum_questions();

-- Trigger: Auto-set certificate due date (45 days after event completion)
CREATE OR REPLACE FUNCTION trigger_set_certificate_due_date()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'pending' AND NEW.must_be_issued_by IS NULL THEN
    NEW.must_be_issued_by := CURRENT_DATE + INTERVAL '45 days';
  END IF;
  
  NEW.days_until_due := NEW.must_be_issued_by - CURRENT_DATE;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_ace_certificates_due_date
  BEFORE INSERT OR UPDATE
  ON ace_certificates
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_certificate_due_date();

-- Trigger: Auto-set feedback review due date (45 days after submission)
CREATE OR REPLACE FUNCTION trigger_set_feedback_review_due()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.submitted_at IS NOT NULL AND NEW.coordinator_review_due_date IS NULL THEN
    NEW.coordinator_review_due_date := (NEW.submitted_at::date) + INTERVAL '45 days';
  END IF;
  
  NEW.days_until_review_due := NEW.coordinator_review_due_date - CURRENT_DATE;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_ace_feedback_review_due
  BEFORE INSERT OR UPDATE
  ON ace_feedback_responses
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_feedback_review_due();

-- Trigger: Auto-set complaint response due date (45 days after submission)
CREATE OR REPLACE FUNCTION trigger_set_complaint_response_due()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.submitted_at IS NOT NULL AND NEW.response_due_date IS NULL THEN
    NEW.response_due_date := (NEW.submitted_at::date) + INTERVAL '45 days';
  END IF;
  
  NEW.days_until_response_due := NEW.response_due_date - CURRENT_DATE;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_ace_complaints_response_due
  BEFORE INSERT OR UPDATE
  ON ace_complaints
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_complaint_response_due();

-- Trigger: Auto-set grace period when provider expires
CREATE OR REPLACE FUNCTION trigger_set_provider_grace_period()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.expiration_date < CURRENT_DATE AND 
     OLD.expiration_date >= CURRENT_DATE AND
     NEW.grace_period_end_date IS NULL THEN
    -- Provider just expired, set 30-day grace period
    NEW.grace_period_end_date := NEW.expiration_date + INTERVAL '30 days';
    NEW.lapse_start_date := NEW.expiration_date;
  END IF;
  
  -- Check if provider is lapsed
  IF CURRENT_DATE > COALESCE(NEW.grace_period_end_date, NEW.expiration_date) THEN
    NEW.can_publish_events := FALSE;
    NEW.can_issue_certificates := FALSE;
    IF NEW.lapse_start_date IS NULL THEN
      NEW.lapse_start_date := COALESCE(NEW.grace_period_end_date, NEW.expiration_date);
    END IF;
  ELSE
    NEW.can_publish_events := TRUE;
    NEW.can_issue_certificates := TRUE;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_ace_providers_grace_period
  BEFORE UPDATE OF expiration_date
  ON ace_providers
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_provider_grace_period();

-- ============================================================================
-- VIEWS FOR 2026 REPORTING
-- ============================================================================

-- View: Compliance Dashboard Summary
CREATE OR REPLACE VIEW ace_compliance_dashboard AS
SELECT
  p.id AS provider_id,
  p.provider_name,
  p.provider_type,
  p.is_active,
  
  -- Coordinator certification status
  p.coordinator_certification_expires,
  (p.coordinator_certification_expires < CURRENT_DATE + INTERVAL '90 days') AS coordinator_cert_expiring_soon,
  
  -- Legal entity verification (for organizations)
  CASE 
    WHEN p.provider_type = 'organization' THEN p.legal_entity_verified
    ELSE TRUE -- Not applicable for individuals
  END AS legal_entity_compliant,
  
  -- Renewal status
  p.expiration_date,
  p.grace_period_end_date,
  p.can_publish_events,
  p.can_issue_certificates,
  CASE
    WHEN p.expiration_date >= CURRENT_DATE THEN 'Active'
    WHEN p.grace_period_end_date >= CURRENT_DATE THEN 'Grace Period'
    ELSE 'Lapsed'
  END AS provider_status,
  
  -- Compliance metrics
  (SELECT COUNT(*) FROM ace_certificates c 
   WHERE c.provider_id = p.id AND c.days_until_due < 0 AND c.status = 'pending') AS overdue_certificates,
  
  (SELECT COUNT(*) FROM ace_feedback_responses fr
   JOIN ace_events e ON fr.event_id = e.id
   WHERE e.provider_id = p.id AND fr.coordinator_reviewed_at IS NULL 
     AND fr.days_until_review_due < 0) AS overdue_feedback_reviews,
  
  (SELECT COUNT(*) FROM ace_complaints cmp
   WHERE cmp.provider_id = p.id AND cmp.is_overdue = TRUE) AS overdue_complaint_responses,
  
  -- Overall compliance score (0-100)
  CASE
    WHEN NOT p.can_issue_certificates THEN 0 -- Lapsed = 0%
    ELSE
      100 -
      (CASE WHEN p.coordinator_certification_expires < CURRENT_DATE THEN 25 ELSE 0 END) -
      (CASE WHEN p.provider_type = 'organization' AND NOT p.legal_entity_verified THEN 25 ELSE 0 END) -
      (CASE WHEN (SELECT COUNT(*) FROM ace_certificates c WHERE c.provider_id = p.id AND c.days_until_due < 0) > 0 THEN 15 ELSE 0 END) -
      (CASE WHEN (SELECT COUNT(*) FROM ace_complaints cmp WHERE cmp.provider_id = p.id AND cmp.is_overdue = TRUE) > 0 THEN 15 ELSE 0 END)
  END AS compliance_score
  
FROM ace_providers p;

-- View: Events Requiring Attention
CREATE OR REPLACE VIEW ace_events_requiring_attention AS
SELECT
  e.id AS event_id,
  e.title,
  e.provider_id,
  p.provider_name,
  e.start_date,
  e.status,
  
  -- Issues
  CASE WHEN e.modality = 'asynchronous' AND e.actual_questions_count < e.minimum_questions_required 
    THEN 'Insufficient questions for async CE' END AS question_issue,
  
  CASE WHEN e.event_subtype IN ('journal_club', 'podcast') AND e.total_ceus > (e.content_item_count * e.max_ceu_per_item)
    THEN 'CEU limit exceeded for subtype' END AS ceu_limit_issue,
  
  CASE WHEN e.learning_objectives = '{}' OR CARDINALITY(e.learning_objectives) = 0
    THEN 'Missing learning objectives' END AS objectives_issue,
  
  CASE WHEN e.event_type = 'pd' AND NOT e.aligns_with_rbt_2026_outline AND NOT e.aligns_with_ethics_code_2_0
    THEN 'Missing RBT alignment' END AS rbt_alignment_issue

FROM ace_events e
JOIN ace_providers p ON e.provider_id = p.id
WHERE e.status IN ('draft', 'pending_approval', 'approved')
  AND (
    (e.modality = 'asynchronous' AND e.actual_questions_count < e.minimum_questions_required) OR
    (e.event_subtype IN ('journal_club', 'podcast') AND e.total_ceus > (e.content_item_count * e.max_ceu_per_item)) OR
    (e.learning_objectives = '{}' OR CARDINALITY(e.learning_objectives) = 0) OR
    (e.event_type = 'pd' AND NOT e.aligns_with_rbt_2026_outline AND NOT e.aligns_with_ethics_code_2_0)
  );

-- ============================================================================
-- COMMENTS & DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE ace_leadership_attestations IS 'Stores digital attestations from organization leadership (2026 Req #2)';
COMMENT ON TABLE ace_compliance_reports IS 'Audit-ready compliance reports with full data export (2026 Req #10)';
COMMENT ON TABLE ace_renewal_history IS 'Tracks renewal history including grace period and late fees (2026 Req #11)';
COMMENT ON TABLE ace_engagement_checks IS 'Timestamped engagement verification for synchronous events (2026 Req #5)';
COMMENT ON TABLE ace_rbt_alignment_criteria IS 'Documents RBT PD event alignment with 2026 training outline (2026 Req #7)';

COMMENT ON COLUMN ace_providers.coordinator_certification_expires IS 'Must be tracked and valid for provider to operate (2026 Req #1)';
COMMENT ON COLUMN ace_providers.ein IS 'Required for organization-type providers (2026 Req #2)';
COMMENT ON COLUMN ace_providers.grace_period_end_date IS '30-day grace period after expiration, $50 late fee (2026 Req #11)';
COMMENT ON COLUMN ace_providers.can_publish_events IS 'FALSE during lapse period (2026 Req #11)';

COMMENT ON COLUMN ace_events.event_type IS 'CE (for BCBAs) vs PD (for RBTs only) - cannot mix (2026 Req #7)';
COMMENT ON COLUMN ace_events.event_subtype IS 'Journal clubs and podcasts limited to 1 CEU per item (2026 Req #4)';
COMMENT ON COLUMN ace_events.minimum_questions_required IS 'Async CE events require 3 questions per CEU (2026 Req #5)';

COMMENT ON COLUMN ace_certificates.instructor_subcategories IS 'Must list instructor name per subcategory (Ethics, Supervision) (2026 Req #6)';
COMMENT ON COLUMN ace_certificates.must_be_issued_by IS 'Certificates must be issued within 45 days (2026 Req #6)';

COMMENT ON COLUMN ace_complaints.nav_escalation_notified IS 'Participants must be informed about NAV escalation option (2026 Req #9)';
COMMENT ON COLUMN ace_complaints.response_due_date IS 'Must respond within 45 days (2026 Req #9)';

-- ============================================================================
-- DATA RETENTION POLICY UPDATE
-- ============================================================================

COMMENT ON DATABASE postgres IS 'ACE Platform - Data retention reduced from 5 to 3 years per 2026 BACB requirements';

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Insert migration record
INSERT INTO public.schema_migrations (version, description, applied_at)
VALUES ('2026.01', 'ACE Platform 2026 BACB Requirements', NOW());

-- ============================================================================
-- POST-MIGRATION TASKS
-- ============================================================================

-- TODO: Update existing events to set event_type = 'ce' (default)
-- TODO: Notify all providers about new coordinator certification tracking
-- TODO: Email organizations about EIN and incorporation document requirements
-- TODO: Update instructor qualification forms to include new paths
-- TODO: Create admin UI for compliance dashboard
-- TODO: Build certificate generator with subcategory display
-- TODO: Implement automated NAV notification in complaint workflow
-- TODO: Create audit report export functionality
-- TODO: Set up renewal reminder system with grace period logic
-- TODO: Update event creation form with new fields (learning objectives, etc.)

-- ============================================================================
-- ROLLBACK INSTRUCTIONS (if needed)
-- ============================================================================

-- To rollback this migration:
-- DROP VIEW ace_compliance_dashboard CASCADE;
-- DROP VIEW ace_events_requiring_attention CASCADE;
-- DROP TABLE ace_rbt_alignment_criteria CASCADE;
-- DROP TABLE ace_engagement_checks CASCADE;
-- DROP TABLE ace_renewal_history CASCADE;
-- DROP TABLE ace_compliance_reports CASCADE;
-- DROP TABLE ace_leadership_attestations CASCADE;
-- DROP FUNCTION can_issue_certificate_2026(UUID, UUID) CASCADE;
-- DROP FUNCTION calculate_ceus_2026(INTEGER) CASCADE;
-- DROP FUNCTION can_provider_publish_events(UUID) CASCADE;
-- DROP FUNCTION calculate_minimum_questions_async_ce(UUID) CASCADE;
-- DROP TYPE ace_expertise_basis CASCADE;
-- DROP TYPE ace_instructor_qualification_path CASCADE;
-- DROP TYPE ace_event_subtype CASCADE;
-- DROP TYPE ace_event_type CASCADE;
-- [Then revert all ALTER TABLE statements manually]

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================

