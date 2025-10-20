-- Migration: Create certificates_issued table
-- Purpose: Track all certificates issued through Certifier.io via Mighty Networks webhook
-- Date: 2025-10-19
-- Note: Certifier.io will poll this table and auto-issue certificates for new rows

-- Create certificates_issued table
-- IMPORTANT: Certifier requires specific column names and types
CREATE TABLE IF NOT EXISTS public.certificates_issued (
  id BIGSERIAL PRIMARY KEY,  -- Certifier requires int8 (bigint) with auto-increment
  recipient_email TEXT NOT NULL,  -- Required by Certifier
  recipient_name TEXT NOT NULL,   -- Required by Certifier
  course_name TEXT NOT NULL,
  certificate_id TEXT,            -- Populated by Certifier after issuance
  certificate_url TEXT,           -- Populated by Certifier after issuance
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  provider TEXT DEFAULT 'certifier',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_certificates_id
  ON public.certificates_issued(id);  -- Certifier orders by id

CREATE INDEX IF NOT EXISTS idx_certificates_recipient_email
  ON public.certificates_issued(recipient_email);

CREATE INDEX IF NOT EXISTS idx_certificates_course_name
  ON public.certificates_issued(course_name);

CREATE INDEX IF NOT EXISTS idx_certificates_issued_at
  ON public.certificates_issued(issued_at DESC);

CREATE INDEX IF NOT EXISTS idx_certificates_provider
  ON public.certificates_issued(provider);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_certificates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER certificates_updated_at_trigger
  BEFORE UPDATE ON public.certificates_issued
  FOR EACH ROW
  EXECUTE FUNCTION update_certificates_updated_at();

-- Enable Row Level Security
ALTER TABLE public.certificates_issued ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role full access
CREATE POLICY "Service role has full access to certificates_issued"
  ON public.certificates_issued
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Admin users can view all certificates
CREATE POLICY "Admin users can view all certificates"
  ON public.certificates_issued
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email IN (
        'rob@behaviorschool.com',
        'edward@edwardsturm.com'
      )
    )
  );

-- Policy: Admin users can insert certificates (for manual entries)
CREATE POLICY "Admin users can insert certificates"
  ON public.certificates_issued
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email IN (
        'rob@behaviorschool.com',
        'edward@edwardsturm.com'
      )
    )
  );

-- Add helpful comments
COMMENT ON TABLE public.certificates_issued IS 'Tracks all certificates issued via Certifier.io webhook from Mighty Networks';
COMMENT ON COLUMN public.certificates_issued.recipient_email IS 'Email address of certificate recipient';
COMMENT ON COLUMN public.certificates_issued.recipient_name IS 'Full name of certificate recipient';
COMMENT ON COLUMN public.certificates_issued.course_name IS 'Name of the course completed';
COMMENT ON COLUMN public.certificates_issued.certificate_id IS 'Unique ID from Certifier.io';
COMMENT ON COLUMN public.certificates_issued.certificate_url IS 'Public URL to view/download certificate';
COMMENT ON COLUMN public.certificates_issued.issued_at IS 'When the certificate was issued (course completion date)';
COMMENT ON COLUMN public.certificates_issued.provider IS 'Certificate provider (default: certifier)';
COMMENT ON COLUMN public.certificates_issued.metadata IS 'Additional data from webhook payload';
