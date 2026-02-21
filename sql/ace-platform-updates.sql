-- ============================================================================
-- ACE Platform - Schema Updates
-- ============================================================================
-- Run this migration to add missing columns and tables for the full platform
-- ============================================================================

-- Add missing columns to ace_registrations
ALTER TABLE ace_registrations ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE ace_registrations ADD COLUMN IF NOT EXISTS fee_amount DECIMAL(10,2) DEFAULT 0;
ALTER TABLE ace_registrations ADD COLUMN IF NOT EXISTS fee_paid BOOLEAN DEFAULT FALSE;
ALTER TABLE ace_registrations ADD COLUMN IF NOT EXISTS payment_date TIMESTAMPTZ;
ALTER TABLE ace_registrations ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;
ALTER TABLE ace_registrations ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;
ALTER TABLE ace_registrations ADD COLUMN IF NOT EXISTS credential_type TEXT;
ALTER TABLE ace_registrations ADD COLUMN IF NOT EXISTS attendance_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE ace_registrations ADD COLUMN IF NOT EXISTS quiz_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE ace_registrations ADD COLUMN IF NOT EXISTS feedback_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE ace_registrations ADD COLUMN IF NOT EXISTS certificate_issued BOOLEAN DEFAULT FALSE;

-- Add missing columns to ace_events
ALTER TABLE ace_events ADD COLUMN IF NOT EXISTS fee DECIMAL(10,2) DEFAULT 0;
ALTER TABLE ace_events ADD COLUMN IF NOT EXISTS event_type TEXT DEFAULT 'ce';
ALTER TABLE ace_events ADD COLUMN IF NOT EXISTS event_subtype TEXT;
ALTER TABLE ace_events ADD COLUMN IF NOT EXISTS actual_questions_count INTEGER DEFAULT 0;
ALTER TABLE ace_events ADD COLUMN IF NOT EXISTS minimum_questions_required INTEGER DEFAULT 0;

-- Add missing columns to ace_feedback_responses
ALTER TABLE ace_feedback_responses ADD COLUMN IF NOT EXISTS rating INTEGER;
ALTER TABLE ace_feedback_responses ADD COLUMN IF NOT EXISTS instructor_rating INTEGER;
ALTER TABLE ace_feedback_responses ADD COLUMN IF NOT EXISTS content_rating INTEGER;
ALTER TABLE ace_feedback_responses ADD COLUMN IF NOT EXISTS relevance_rating INTEGER;
ALTER TABLE ace_feedback_responses ADD COLUMN IF NOT EXISTS comments TEXT;
ALTER TABLE ace_feedback_responses ADD COLUMN IF NOT EXISTS suggestions TEXT;
ALTER TABLE ace_feedback_responses ADD COLUMN IF NOT EXISTS would_recommend BOOLEAN DEFAULT TRUE;
ALTER TABLE ace_feedback_responses ADD COLUMN IF NOT EXISTS application_plan TEXT;
ALTER TABLE ace_feedback_responses ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ DEFAULT NOW();

-- Add provider_id to ace_certificates if not exists
ALTER TABLE ace_certificates ADD COLUMN IF NOT EXISTS provider_id UUID REFERENCES ace_providers(id);

-- Create quiz submissions table if not exists
CREATE TABLE IF NOT EXISTS ace_quiz_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES ace_quizzes(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES ace_users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES ace_events(id) ON DELETE CASCADE,
  attempt_number INTEGER DEFAULT 1,
  answers JSONB,
  score INTEGER,
  total_questions INTEGER,
  score_percentage INTEGER,
  passed BOOLEAN DEFAULT FALSE,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_submissions_quiz ON ace_quiz_submissions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_submissions_participant ON ace_quiz_submissions(participant_id);
CREATE INDEX IF NOT EXISTS idx_quiz_submissions_event ON ace_quiz_submissions(event_id);

-- Add total_ceus to ace_events if it uses a different column name
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ace_events' AND column_name = 'total_ceus'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ace_events' AND column_name = 'ceus_offered'
  ) THEN
    ALTER TABLE ace_events RENAME COLUMN ceus_offered TO total_ceus;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ace_events' AND column_name = 'total_ceus'
  ) THEN
    ALTER TABLE ace_events ADD COLUMN total_ceus DECIMAL(4,2) DEFAULT 0;
  END IF;
END $$;

-- Ensure ace_users has credential tracking
ALTER TABLE ace_users ADD COLUMN IF NOT EXISTS credential_type TEXT;
ALTER TABLE ace_users ADD COLUMN IF NOT EXISTS credential_number TEXT;
ALTER TABLE ace_users ADD COLUMN IF NOT EXISTS credential_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE ace_users ADD COLUMN IF NOT EXISTS credential_verified_at TIMESTAMPTZ;
ALTER TABLE ace_users ADD COLUMN IF NOT EXISTS credential_expires_at TIMESTAMPTZ;

-- Add grace period and renewal fields to providers
ALTER TABLE ace_providers ADD COLUMN IF NOT EXISTS grace_period_end_date DATE;
ALTER TABLE ace_providers ADD COLUMN IF NOT EXISTS reinstatement_date DATE;
ALTER TABLE ace_providers ADD COLUMN IF NOT EXISTS late_fee_paid BOOLEAN DEFAULT FALSE;
ALTER TABLE ace_providers ADD COLUMN IF NOT EXISTS late_fee_amount DECIMAL(10,2);
ALTER TABLE ace_providers ADD COLUMN IF NOT EXISTS late_fee_paid_date DATE;
ALTER TABLE ace_providers ADD COLUMN IF NOT EXISTS can_publish_events BOOLEAN DEFAULT TRUE;
ALTER TABLE ace_providers ADD COLUMN IF NOT EXISTS can_issue_certificates BOOLEAN DEFAULT TRUE;
ALTER TABLE ace_providers ADD COLUMN IF NOT EXISTS lapse_start_date DATE;
ALTER TABLE ace_providers ADD COLUMN IF NOT EXISTS lapse_end_date DATE;

-- Legal entity verification for organizations
ALTER TABLE ace_providers ADD COLUMN IF NOT EXISTS ein TEXT;
ALTER TABLE ace_providers ADD COLUMN IF NOT EXISTS incorporation_doc_url TEXT;
ALTER TABLE ace_providers ADD COLUMN IF NOT EXISTS legal_entity_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE ace_providers ADD COLUMN IF NOT EXISTS legal_entity_verified_at TIMESTAMPTZ;
ALTER TABLE ace_providers ADD COLUMN IF NOT EXISTS legal_entity_verified_by UUID;
ALTER TABLE ace_providers ADD COLUMN IF NOT EXISTS leadership_attestation_url TEXT;
ALTER TABLE ace_providers ADD COLUMN IF NOT EXISTS leadership_attestation_date DATE;
ALTER TABLE ace_providers ADD COLUMN IF NOT EXISTS leadership_name TEXT;
ALTER TABLE ace_providers ADD COLUMN IF NOT EXISTS leadership_title TEXT;

-- Coordinator certification tracking
ALTER TABLE ace_providers ADD COLUMN IF NOT EXISTS coordinator_certification_date DATE;
ALTER TABLE ace_providers ADD COLUMN IF NOT EXISTS coordinator_certification_expires DATE;
ALTER TABLE ace_providers ADD COLUMN IF NOT EXISTS coordinator_certification_verified BOOLEAN DEFAULT FALSE;

-- Update RLS policies
ALTER TABLE ace_quiz_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view own quiz submissions"
  ON ace_quiz_submissions
  FOR SELECT
  USING (auth.uid() = (SELECT supabase_user_id FROM ace_users WHERE id = participant_id));

CREATE POLICY IF NOT EXISTS "Users can create quiz submissions"
  ON ace_quiz_submissions
  FOR INSERT
  WITH CHECK (auth.uid() = (SELECT supabase_user_id FROM ace_users WHERE id = participant_id));

-- Grant necessary permissions
GRANT SELECT ON ace_quiz_submissions TO authenticated;
GRANT INSERT ON ace_quiz_submissions TO authenticated;

-- Create helper function for calculating minimum questions
CREATE OR REPLACE FUNCTION calculate_min_questions(ceus DECIMAL, modality TEXT, event_type TEXT)
RETURNS INTEGER AS $$
BEGIN
  -- 2026 BACB requirement: 3 questions per CEU for async CE events
  IF event_type = 'ce' AND modality = 'asynchronous' THEN
    RETURN CEIL(ceus * 3)::INTEGER;
  END IF;
  RETURN 0;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger to auto-calculate minimum questions
CREATE OR REPLACE FUNCTION update_min_questions()
RETURNS TRIGGER AS $$
BEGIN
  NEW.minimum_questions_required := calculate_min_questions(
    NEW.total_ceus, 
    NEW.modality::TEXT, 
    COALESCE(NEW.event_type, 'ce')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS calc_min_questions ON ace_events;
CREATE TRIGGER calc_min_questions
  BEFORE INSERT OR UPDATE OF total_ceus, modality, event_type ON ace_events
  FOR EACH ROW
  EXECUTE FUNCTION update_min_questions();

COMMENT ON TABLE ace_quiz_submissions IS 'Stores quiz attempt submissions from participants';
COMMENT ON COLUMN ace_registrations.attendance_verified IS 'Set to true when attendance is confirmed';
COMMENT ON COLUMN ace_registrations.quiz_completed IS 'Set to true when quiz is passed';
COMMENT ON COLUMN ace_registrations.feedback_completed IS 'Set to true when feedback is submitted';
