-- Add archived column to email_templates table
ALTER TABLE email_templates
ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS archived_by TEXT;

-- Create index for filtering archived templates
CREATE INDEX IF NOT EXISTS idx_email_templates_archived ON email_templates(archived);

COMMENT ON COLUMN email_templates.archived IS 'Whether the template has been archived';
COMMENT ON COLUMN email_templates.archived_at IS 'Timestamp when the template was archived';
COMMENT ON COLUMN email_templates.archived_by IS 'Admin user who archived the template';
