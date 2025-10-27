-- ============================================================================
-- MASTERCLASS AUTH MIGRATION
-- Links masterclass enrollments to Supabase Auth users
-- ============================================================================
-- Created: 2025-01-26
-- Description: Adds user_id column to link enrollments with Supabase auth.users
-- ============================================================================

-- Add user_id column to masterclass_enrollments
ALTER TABLE masterclass_enrollments
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for user_id lookups
CREATE INDEX IF NOT EXISTS idx_masterclass_enrollments_user_id
ON masterclass_enrollments(user_id);

-- Update the unique constraint to include user_id
-- Drop old constraint if exists
ALTER TABLE masterclass_enrollments
DROP CONSTRAINT IF EXISTS unique_email_enrollment;

-- Add new unique constraint (one enrollment per user)
ALTER TABLE masterclass_enrollments
ADD CONSTRAINT unique_user_enrollment UNIQUE(user_id);

-- Update RLS policies to use auth.uid()
DROP POLICY IF EXISTS "Users can view own enrollment" ON masterclass_enrollments;
DROP POLICY IF EXISTS "Users can update own enrollment" ON masterclass_enrollments;
DROP POLICY IF EXISTS "Anyone can view progress" ON masterclass_progress;
DROP POLICY IF EXISTS "Anyone can update progress" ON masterclass_progress;

-- New RLS policies with auth
CREATE POLICY "Authenticated users can view own enrollment"
  ON masterclass_enrollments
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can update own enrollment"
  ON masterclass_enrollments
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can view own progress"
  ON masterclass_progress
  FOR SELECT
  TO authenticated
  USING (
    enrollment_id IN (
      SELECT id FROM masterclass_enrollments WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can update own progress"
  ON masterclass_progress
  FOR UPDATE
  TO authenticated
  USING (
    enrollment_id IN (
      SELECT id FROM masterclass_enrollments WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can insert own progress"
  ON masterclass_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (
    enrollment_id IN (
      SELECT id FROM masterclass_enrollments WHERE user_id = auth.uid()
    )
  );

-- Quiz responses policies
DROP POLICY IF EXISTS "Anyone can view quiz responses" ON masterclass_quiz_responses;
DROP POLICY IF EXISTS "Anyone can insert quiz responses" ON masterclass_quiz_responses;

CREATE POLICY "Authenticated users can view own quiz responses"
  ON masterclass_quiz_responses
  FOR SELECT
  TO authenticated
  USING (
    enrollment_id IN (
      SELECT id FROM masterclass_enrollments WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can insert own quiz responses"
  ON masterclass_quiz_responses
  FOR INSERT
  TO authenticated
  WITH CHECK (
    enrollment_id IN (
      SELECT id FROM masterclass_enrollments WHERE user_id = auth.uid()
    )
  );

-- Certificates policies
DROP POLICY IF EXISTS "Anyone can view certificates" ON masterclass_certificates;
DROP POLICY IF EXISTS "Anyone can insert certificates" ON masterclass_certificates;
DROP POLICY IF EXISTS "Anyone can update certificates" ON masterclass_certificates;

CREATE POLICY "Authenticated users can view own certificates"
  ON masterclass_certificates
  FOR SELECT
  TO authenticated
  USING (
    enrollment_id IN (
      SELECT id FROM masterclass_enrollments WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can insert own certificates"
  ON masterclass_certificates
  FOR INSERT
  TO authenticated
  WITH CHECK (
    enrollment_id IN (
      SELECT id FROM masterclass_enrollments WHERE user_id = auth.uid()
    )
  );

-- Function to get or create enrollment for authenticated user
CREATE OR REPLACE FUNCTION get_or_create_enrollment(
  p_user_id UUID,
  p_email TEXT,
  p_name TEXT,
  p_bacb_cert_number TEXT
)
RETURNS UUID AS $$
DECLARE
  v_enrollment_id UUID;
BEGIN
  -- Try to get existing enrollment
  SELECT id INTO v_enrollment_id
  FROM masterclass_enrollments
  WHERE user_id = p_user_id;

  -- If not found, create new enrollment
  IF v_enrollment_id IS NULL THEN
    INSERT INTO masterclass_enrollments (
      user_id,
      email,
      name,
      bacb_cert_number,
      created_at,
      last_accessed_at
    ) VALUES (
      p_user_id,
      p_email,
      p_name,
      p_bacb_cert_number,
      NOW(),
      NOW()
    )
    RETURNING id INTO v_enrollment_id;
  END IF;

  RETURN v_enrollment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_or_create_enrollment TO authenticated;

COMMENT ON FUNCTION get_or_create_enrollment IS 'Gets existing enrollment or creates new one for authenticated user';
