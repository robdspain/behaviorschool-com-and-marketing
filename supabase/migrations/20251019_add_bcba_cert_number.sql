-- Migration: Add BCBA certification number fields
-- Purpose: Store BCBA certification numbers for professional certificates
-- Date: 2025-10-19

-- Add BCBA cert number to signup_submissions table
ALTER TABLE public.signup_submissions
ADD COLUMN IF NOT EXISTS bcba_cert_number TEXT;

-- Add index for lookups
CREATE INDEX IF NOT EXISTS idx_signup_submissions_bcba_cert
  ON public.signup_submissions(bcba_cert_number);

-- Add BCBA cert number to certificates_issued table
ALTER TABLE public.certificates_issued
ADD COLUMN IF NOT EXISTS bcba_cert_number TEXT;

-- Add index for certificate lookups
CREATE INDEX IF NOT EXISTS idx_certificates_bcba_cert
  ON public.certificates_issued(bcba_cert_number);

-- Add helpful comments
COMMENT ON COLUMN public.signup_submissions.bcba_cert_number IS 'BCBA certification number (format: 1-11-9398)';
COMMENT ON COLUMN public.certificates_issued.bcba_cert_number IS 'BCBA certification number included on certificate';
