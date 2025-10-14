-- Step 1: Create the basic table
CREATE TABLE email_logs (
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
