-- Create email_logs table to track all sent emails
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID,
  template_name VARCHAR(255),
  recipient_email VARCHAR(255) NOT NULL,
  recipient_name VARCHAR(255),
  subject TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'sent',
  error_message TEXT,
  sent_by UUID,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  mailgun_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient_email ON email_logs(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_template_id ON email_logs(template_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_template_name ON email_logs(template_name);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_by ON email_logs(sent_by);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);

-- Enable RLS
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Create policies (allow service role and authenticated users full access)
DROP POLICY IF EXISTS "Service role full access to email_logs" ON email_logs;
CREATE POLICY "Service role full access to email_logs" ON email_logs
  FOR ALL USING (true);

DROP POLICY IF EXISTS "Authenticated users can view email_logs" ON email_logs;
CREATE POLICY "Authenticated users can view email_logs" ON email_logs
  FOR SELECT USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT ALL ON email_logs TO service_role;
GRANT SELECT ON email_logs TO authenticated;

COMMENT ON TABLE email_logs IS 'Tracks all emails sent through the system with timestamps and delivery status';
COMMENT ON COLUMN email_logs.template_id IS 'Reference to the email template used (nullable if template deleted)';
COMMENT ON COLUMN email_logs.template_name IS 'Name of the template for historical tracking';
COMMENT ON COLUMN email_logs.status IS 'Delivery status: sent, failed, bounced, etc.';
COMMENT ON COLUMN email_logs.sent_by IS 'Admin user who triggered the email (for manual sends)';
COMMENT ON COLUMN email_logs.metadata IS 'Additional context like submission_id, campaign_id, etc.';
