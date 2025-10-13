-- Add archived column to signup_submissions table
ALTER TABLE signup_submissions
ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT false;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_signup_submissions_archived
ON signup_submissions(archived);

-- Add archived_at column to track when submission was archived
ALTER TABLE signup_submissions
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

-- Add archived_by column to track who archived it
ALTER TABLE signup_submissions
ADD COLUMN IF NOT EXISTS archived_by TEXT;
