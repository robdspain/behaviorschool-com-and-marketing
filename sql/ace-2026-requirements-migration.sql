-- ============================================================================
-- ACE CEU Platform - V2 Migration for 2026 BACB Requirements
-- ============================================================================
-- This script updates the schema from V1 to V2 to comply with the updated PRD.
-- ============================================================================

BEGIN;

-- ============================================================================
-- ENUMS & TYPES
-- ============================================================================

CREATE TYPE ace_event_type AS ENUM ('ce', 'pd');
CREATE TYPE ace_event_subtype AS ENUM ('standard', 'journal_club', 'podcast');
CREATE TYPE ace_qualification_path AS ENUM ('bcba', 'doctorate', 'doctorate_plus');
CREATE TYPE ace_qualifying_experience_type AS ENUM ('coursework', 'mentorship', 'publications', 'hours');
CREATE TYPE ace_expertise_basis AS ENUM ('practice', 'teaching', 'publications');
CREATE TYPE ace_report_type AS ENUM ('attendance', 'qualifications', 'feedback', 'certificates', 'complaints', 'full_audit');


-- ============================================================================
-- TABLE ALTERATIONS
-- ============================================================================

-- 1. Update ace_providers table
ALTER TABLE ace_providers
  ADD COLUMN ein TEXT,
  ADD COLUMN incorporation_doc_url TEXT,
  ADD COLUMN legal_entity_verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN leadership_attestation_url TEXT,
  ADD COLUMN leadership_attestation_date TIMESTAMPTZ,
  ADD COLUMN coordinator_certification_date DATE,
  ADD COLUMN coordinator_certification_expires DATE,
  ADD COLUMN grace_period_end_date DATE,
  ADD COLUMN reinstatement_date DATE,
  ADD COLUMN late_fee_paid BOOLEAN DEFAULT FALSE;

-- 2. Deprecate old instructor qualifications and create new one
ALTER TABLE ace_instructor_qualifications RENAME TO ace_instructor_qualifications_v1_deprecated;

CREATE TABLE ace_instructor_qualifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES ace_users(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES ace_providers(id) ON DELETE CASCADE,
  
  qualification_path ace_qualification_path,
  
  -- Doctorate Details
  doctorate_type TEXT,
  institution_name TEXT,
  graduation_year INTEGER,
  transcript_url TEXT,
  
  -- Doctorate+ Details
  qualifying_experience_type ace_qualifying_experience_type,
  experience_documentation_urls TEXT[],
  
  -- Expertise Details
  expertise_basis ace_expertise_basis,
  years_experience INTEGER,
  expertise_documentation_urls TEXT[],
  
  -- Common Fields
  cv_url TEXT,
  certification_proof_url TEXT,
  verified_by UUID REFERENCES ace_users(id),
  verified_at TIMESTAMPTZ,
  is_approved BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_instructor_qualifications_v2_user ON ace_instructor_qualifications(user_id);
CREATE INDEX idx_instructor_qualifications_v2_provider ON ace_instructor_qualifications(provider_id);


-- 3. Update ace_events table
ALTER TABLE ace_events
  ADD COLUMN event_type ace_event_type,
  ADD COLUMN event_subtype ace_event_subtype,
  ADD COLUMN instructor_affiliations TEXT[],
  ADD COLUMN publication_date DATE,
  ADD COLUMN rbt_alignment_checklist JSONB;

-- 4. Update ace_certificates table
ALTER TABLE ace_certificates
  ADD COLUMN instructor_subcategories JSONB;

-- 5. Update ace_feedback_responses table
ALTER TABLE ace_feedback_responses
  ADD COLUMN coordinator_reviewed_at TIMESTAMPTZ,
  ADD COLUMN coordinator_notes TEXT;

-- 6. Update ace_complaints table
ALTER TABLE ace_complaints
  ADD COLUMN submitter_bacb_id TEXT,
  ADD COLUMN nav_escalation_notified BOOLEAN DEFAULT FALSE,
  ADD COLUMN response_due_date DATE;

-- ============================================================================
-- NEW TABLES
-- ============================================================================

-- 7. New table: ace_compliance_reports
CREATE TABLE ace_compliance_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES ace_providers(id),
  report_type ace_report_type NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  date_range_start DATE,
  date_range_end DATE,
  pdf_url TEXT,
  excel_url TEXT,
  zip_url TEXT,
  compliance_score INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_compliance_reports_provider ON ace_compliance_reports(provider_id);
CREATE INDEX idx_compliance_reports_type ON ace_compliance_reports(report_type);

-- ============================================================================
-- Update retention policy comments and logic
-- ============================================================================
-- The PRD specifies a 3-year retention, updating from the V1 schema's 5 years.

-- Mark old records for archival (3+ years)
CREATE OR REPLACE FUNCTION mark_records_for_archival_v2()
RETURNS void AS $$
BEGIN
  -- Update events older than 3 years
  UPDATE ace_events
  SET status = 'archived'
  WHERE end_date < NOW() - INTERVAL '3 years'
  AND status = 'completed';

  -- Set retention dates for materials
  UPDATE ace_event_materials
  SET retention_delete_after = (
    SELECT e.end_date + INTERVAL '3 years'
    FROM ace_events e
    WHERE e.id = event_id
  )
  WHERE retention_delete_after IS NULL;
END;
$$ LANGUAGE plpgsql;


COMMIT;

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
