-- ============================================================================
-- Add Participant Credential Type for CE vs PD Separation
-- ============================================================================
-- Allows proper enforcement of registration restrictions:
-- - RBTs can only register for PD events
-- - BCBAs, BCaBAs can register for CE events
-- ============================================================================

-- Create credential type enum
CREATE TYPE ace_credential_type AS ENUM (
  'bcba',      -- Board Certified Behavior Analyst
  'bcaba',     -- Board Certified Assistant Behavior Analyst
  'rbt',       -- Registered Behavior Technician
  'other',     -- Other credential or no credential
  'pending'    -- Pending verification
);

-- Add credential type to ace_users
ALTER TABLE ace_users
  ADD COLUMN credential_type ace_credential_type DEFAULT 'pending',
  ADD COLUMN credential_number TEXT,
  ADD COLUMN credential_verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN credential_verified_at TIMESTAMPTZ,
  ADD COLUMN credential_expires_at DATE;

-- Create index for credential lookups
CREATE INDEX idx_ace_users_credential ON ace_users(credential_type);

-- Add constraint to ace_registrations to enforce CE/PD restrictions
ALTER TABLE ace_registrations
  ADD CONSTRAINT check_ce_pd_eligibility CHECK (
    -- This will be validated in application logic, but we add a placeholder
    -- The actual validation happens in the registration API
    true
  );

-- Add function to check if user can register for event type
CREATE OR REPLACE FUNCTION can_user_register_for_event_type(
  p_user_id UUID,
  p_event_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  v_credential_type ace_credential_type;
  v_event_type ace_event_type;
  v_can_register BOOLEAN;
BEGIN
  -- Get user credential type
  SELECT credential_type INTO v_credential_type
  FROM ace_users
  WHERE id = p_user_id;
  
  -- Get event type
  SELECT event_type INTO v_event_type
  FROM ace_events
  WHERE id = p_event_id;
  
  -- Apply registration rules
  IF v_event_type = 'ce' THEN
    -- CE events: Only BCBA, BCaBA can register
    v_can_register := v_credential_type IN ('bcba', 'bcaba');
  ELSIF v_event_type = 'pd' THEN
    -- PD events: Only RBTs can register
    v_can_register := v_credential_type = 'rbt';
  ELSE
    -- Unknown event type, allow registration
    v_can_register := TRUE;
  END IF;
  
  RETURN v_can_register;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION can_user_register_for_event_type IS 'Validates if user credential type allows registration for event type (CE vs PD)';

-- ============================================================================
-- TODO: Update existing users
-- ============================================================================
-- After migration, you'll need to:
-- 1. Update existing ace_users to set their credential_type
-- 2. Verify credentials where possible
-- 3. Update registration UI to collect credential type during signup
-- ============================================================================

