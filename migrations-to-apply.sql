
🗄️  DATABASE MIGRATION RUNNER

This script will show you all SQL migrations that need to be applied.

════════════════════════════════════════════════════════════════════════════════

Found 10 migration files:

1. 20251010215547_checkout_access_setup.sql
2. 20251013_add_archived_to_submissions.sql
3. 20251014_add_payment_email_template_and_logs.sql
4. 20251014_add_payment_template.sql
5. 20251014_create_email_logs_table.sql
6. 20251016_create_archived_activities_table.sql
7. 20251017_add_archived_to_email_templates.sql
8. 20251017_update_payment_email_with_password.sql
9. 20251019_add_bcba_cert_number.sql
10. 20251019_create_certificates_issued_table.sql

════════════════════════════════════════════════════════════════════════════════

📝 INSTRUCTIONS:

1. Go to: https://supabase.com/dashboard/project/dugolglucuzolzvuqxmi/sql/new
2. Copy ALL the SQL below (it contains all migrations)
3. Paste it into the SQL Editor
4. Click "Run" to execute all migrations at once

────────────────────────────────────────────────────────────────────────────────

-- START OF COMBINED MIGRATION SQL --

────────────────────────────────────────────────────────────────────────────────

-- Migration: 20251010215547_checkout_access_setup.sql
-- Date: 20251010215547

-- Checkout Settings Table (stores the master password)
CREATE TABLE IF NOT EXISTS checkout_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default password
INSERT INTO checkout_settings (setting_key, setting_value, description)
VALUES ('checkout_password', 'Transform2025', 'Master password for checkout access')
ON CONFLICT (setting_key) DO NOTHING;

-- Checkout Access Table (approved users who can bypass password)
CREATE TABLE IF NOT EXISTS checkout_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  approved_by TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Checkout Access Logs Table (track all access attempts)
CREATE TABLE IF NOT EXISTS checkout_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  access_type TEXT NOT NULL, -- 'password' or 'email'
  identifier TEXT NOT NULL, -- the password or email used
  success BOOLEAN NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_checkout_access_email ON checkout_access(email);
CREATE INDEX IF NOT EXISTS idx_checkout_access_active ON checkout_access(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_checkout_logs_created ON checkout_access_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_checkout_logs_success ON checkout_access_logs(success);

-- Enable Row Level Security
ALTER TABLE checkout_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkout_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkout_access_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies (only service role can access these tables)
CREATE POLICY "Service role can do everything on checkout_settings"
  ON checkout_settings
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can do everything on checkout_access"
  ON checkout_access
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can do everything on checkout_access_logs"
  ON checkout_access_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_checkout_settings_updated_at BEFORE UPDATE ON checkout_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_checkout_access_updated_at BEFORE UPDATE ON checkout_access
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


────────────────────────────────────────────────────────────────────────────────

-- Migration: 20251013_add_archived_to_submissions.sql
-- Date: 20251013

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


────────────────────────────────────────────────────────────────────────────────

-- Migration: 20251014_add_payment_email_template_and_logs.sql
-- Date: 20251014

-- Add Transformation Program Payment Link Email Template and Logging System
-- This migration adds:
-- 1. New email template for transformation program payment links
-- 2. Email logs table to track all sent emails
-- 3. Indexes for efficient querying

-- Insert payment link email template
INSERT INTO email_templates (name, description, subject, body_text, body_html, category, send_delay_minutes, is_active)
VALUES (
  'transformation_payment_link',
  'Sent manually after phone consultation to provide checkout access',
  '🎉 Your Payment Link for the Transformation Program',
  'Hi ${firstName},

Thank you for taking the time to speak with us about the School BCBA Transformation Program! After our conversation, we''re excited to move forward together.

You can now proceed to secure your spot in the program. Access the payment page here:
https://behaviorschool.com/transformation-program/checkout

Next Steps:
- Click the link above to access the payment page
- Enter your access credentials (email: ${email})
- Complete your secure payment through Stripe
- Get immediate access to the program materials

Important: This link grants you exclusive access to enroll in the program. If you have any questions before proceeding, feel free to reach out!

We can''t wait to support you on your journey!

Best regards,
The Behavior School Team

---
Questions? Reply to this email or visit behaviorschool.com',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ready to Begin Your Transformation?</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, ''Helvetica Neue'', Arial, sans-serif; background-color: #f8fafc;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; border-radius: 16px 16px 0 0; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                🎉 Let''s Get Started!
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; color: #334155; font-size: 16px; line-height: 1.6;">
                Hi ${firstName},
              </p>

              <p style="margin: 0 0 20px; color: #334155; font-size: 16px; line-height: 1.6;">
                Thank you for taking the time to speak with us about the School BCBA Transformation Program! After our conversation, we''re excited to move forward together.
              </p>

              <p style="margin: 0 0 30px; color: #334155; font-size: 16px; line-height: 1.6;">
                You can now proceed to secure your spot in the program. Click the button below to access the payment page:
              </p>

              <!-- CTA Button -->
              <table role="presentation" style="margin: 0 auto;">
                <tr>
                  <td style="border-radius: 8px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);">
                    <a href="https://behaviorschool.com/transformation-program/checkout" style="display: inline-block; padding: 16px 48px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 18px;">
                      Proceed to Payment →
                    </a>
                  </td>
                </tr>
              </table>

              <div style="margin: 30px 0; padding: 20px; background-color: #ecfdf5; border-radius: 8px; border: 1px solid #d1fae5;">
                <h3 style="margin: 0 0 10px; color: #059669; font-size: 18px;">Next Steps:</h3>
                <ul style="margin: 0; padding-left: 20px; color: #334155; font-size: 14px; line-height: 1.8;">
                  <li>Click the button above to access the payment page</li>
                  <li>Enter your access credentials (email: <strong>${email}</strong>)</li>
                  <li>Complete your secure payment through Stripe</li>
                  <li>Get immediate access to the program materials</li>
                </ul>
              </div>

              <p style="margin: 30px 0 20px; color: #64748b; font-size: 14px; line-height: 1.6; padding: 20px; background-color: #f1f5f9; border-radius: 8px; border-left: 4px solid #10b981;">
                <strong style="color: #334155;">Important:</strong> This link grants you exclusive access to enroll in the program. If you have any questions before proceeding, feel free to reach out!
              </p>

              <p style="margin: 30px 0 0; color: #334155; font-size: 16px; line-height: 1.6;">
                We can''t wait to support you on your journey to becoming an exceptional School BCBA!
              </p>

              <p style="margin: 20px 0 0; color: #334155; font-size: 16px; line-height: 1.6;">
                Best regards,<br>
                <strong>The Behavior School Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f8fafc; border-radius: 0 0 16px 16px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 10px; color: #64748b; font-size: 12px;">
                Questions? Reply to this email or visit
                <a href="https://behaviorschool.com" style="color: #10b981; text-decoration: none;">behaviorschool.com</a>
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 11px;">
                © 2025 Behavior School. All rights reserved.
              </p>
            </td>
          </tr>
        </table>

        <!-- Backup Link -->
        <table role="presentation" style="max-width: 600px; width: 100%; margin-top: 20px;">
          <tr>
            <td style="text-align: center; padding: 20px;">
              <p style="margin: 0; color: #64748b; font-size: 13px;">
                Button not working? Copy and paste this link into your browser:<br>
                <a href="https://behaviorschool.com/transformation-program/checkout" style="color: #10b981; text-decoration: none; word-break: break-all;">https://behaviorschool.com/transformation-program/checkout</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>',
  'marketing',
  0,
  true
) ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  subject = EXCLUDED.subject,
  body_text = EXCLUDED.body_text,
  body_html = EXCLUDED.body_html,
  category = EXCLUDED.category,
  send_delay_minutes = EXCLUDED.send_delay_minutes,
  is_active = EXCLUDED.is_active;

-- Create email_logs table to track all sent emails
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID REFERENCES email_templates(id) ON DELETE SET NULL,
  template_name VARCHAR(255),
  recipient_email VARCHAR(255) NOT NULL,
  recipient_name VARCHAR(255),
  subject TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'sent',
  error_message TEXT,
  sent_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
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


────────────────────────────────────────────────────────────────────────────────

-- Migration: 20251014_add_payment_template.sql
-- Date: 20251014

-- Insert payment link email template
INSERT INTO email_templates (name, description, subject, body_text, body_html, category, send_delay_minutes, is_active)
VALUES (
  'transformation_payment_link',
  'Sent manually after phone consultation to provide checkout access',
  '🎉 Your Payment Link for the Transformation Program',
  'Hi ${firstName},

Thank you for taking the time to speak with us about the School BCBA Transformation Program! After our conversation, we''re excited to move forward together.

You can now proceed to secure your spot in the program. Access the payment page here:
https://behaviorschool.com/transformation-program/checkout

Next Steps:
- Click the link above to access the payment page
- Enter your access credentials (email: ${email})
- Complete your secure payment through Stripe
- Get immediate access to the program materials

Questions Before You Proceed?
If you have any questions or want to discuss anything before enrolling, feel free to schedule another call with us:
https://calendly.com/robspain/behavior-school-transformation-system-phone-call

Important: This link grants you exclusive access to enroll in the program. We''re here to support you every step of the way!

We can''t wait to support you on your journey!

Best regards,
The Behavior School Team

---
Questions? Reply to this email or visit behaviorschool.com',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ready to Begin Your Transformation?</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, ''Helvetica Neue'', Arial, sans-serif; background-color: #f8fafc;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; border-radius: 16px 16px 0 0; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                🎉 Let''s Get Started!
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; color: #334155; font-size: 16px; line-height: 1.6;">
                Hi ${firstName},
              </p>

              <p style="margin: 0 0 20px; color: #334155; font-size: 16px; line-height: 1.6;">
                Thank you for taking the time to speak with us about the School BCBA Transformation Program! After our conversation, we''re excited to move forward together.
              </p>

              <p style="margin: 0 0 30px; color: #334155; font-size: 16px; line-height: 1.6;">
                You can now proceed to secure your spot in the program. Click the button below to access the payment page:
              </p>

              <!-- CTA Button -->
              <table role="presentation" style="margin: 0 auto;">
                <tr>
                  <td style="border-radius: 8px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);">
                    <a href="https://behaviorschool.com/transformation-program/checkout" style="display: inline-block; padding: 16px 48px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 18px;">
                      Proceed to Payment →
                    </a>
                  </td>
                </tr>
              </table>

              <div style="margin: 30px 0; padding: 20px; background-color: #ecfdf5; border-radius: 8px; border: 1px solid #d1fae5;">
                <h3 style="margin: 0 0 10px; color: #059669; font-size: 18px;">Next Steps:</h3>
                <ul style="margin: 0; padding-left: 20px; color: #334155; font-size: 14px; line-height: 1.8;">
                  <li>Click the button above to access the payment page</li>
                  <li>Enter your access credentials (email: <strong>${email}</strong>)</li>
                  <li>Complete your secure payment through Stripe</li>
                  <li>Get immediate access to the program materials</li>
                </ul>
              </div>

              <div style="margin: 30px 0; padding: 20px; background-color: #fef3c7; border-radius: 8px; border: 1px solid #fde68a;">
                <h3 style="margin: 0 0 10px; color: #92400e; font-size: 16px;">Questions Before You Proceed?</h3>
                <p style="margin: 0 0 16px; color: #78350f; font-size: 14px; line-height: 1.6;">
                  If you have any questions or want to discuss anything before enrolling, feel free to schedule another call with us:
                </p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center">
                      <a href="https://calendly.com/robspain/behavior-school-transformation-system-phone-call" style="display: inline-block; padding: 12px 24px; background-color: #f59e0b; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">
                        📅 Schedule a Call
                      </a>
                    </td>
                  </tr>
                </table>
              </div>

              <p style="margin: 30px 0 20px; color: #64748b; font-size: 14px; line-height: 1.6; padding: 20px; background-color: #f1f5f9; border-radius: 8px; border-left: 4px solid #10b981;">
                <strong style="color: #334155;">Important:</strong> This link grants you exclusive access to enroll in the program. We''re here to support you every step of the way!
              </p>

              <p style="margin: 30px 0 0; color: #334155; font-size: 16px; line-height: 1.6;">
                We can''t wait to support you on your journey to becoming an exceptional School BCBA!
              </p>

              <p style="margin: 20px 0 0; color: #334155; font-size: 16px; line-height: 1.6;">
                Best regards,<br>
                <strong>The Behavior School Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f8fafc; border-radius: 0 0 16px 16px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 10px; color: #64748b; font-size: 12px;">
                Questions? Reply to this email or visit
                <a href="https://behaviorschool.com" style="color: #10b981; text-decoration: none;">behaviorschool.com</a>
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 11px;">
                © 2025 Behavior School. All rights reserved.
              </p>
            </td>
          </tr>
        </table>

        <!-- Backup Link -->
        <table role="presentation" style="max-width: 600px; width: 100%; margin-top: 20px;">
          <tr>
            <td style="text-align: center; padding: 20px;">
              <p style="margin: 0; color: #64748b; font-size: 13px;">
                Button not working? Copy and paste this link into your browser:<br>
                <a href="https://behaviorschool.com/transformation-program/checkout" style="color: #10b981; text-decoration: none; word-break: break-all;">https://behaviorschool.com/transformation-program/checkout</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>',
  'marketing',
  0,
  true
) ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  subject = EXCLUDED.subject,
  body_text = EXCLUDED.body_text,
  body_html = EXCLUDED.body_html,
  category = EXCLUDED.category,
  send_delay_minutes = EXCLUDED.send_delay_minutes,
  is_active = EXCLUDED.is_active;


────────────────────────────────────────────────────────────────────────────────

-- Migration: 20251014_create_email_logs_table.sql
-- Date: 20251014

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


────────────────────────────────────────────────────────────────────────────────

-- Migration: 20251016_create_archived_activities_table.sql
-- Date: 20251016

-- Create archived_activities table to store archived events from the admin dashboard
CREATE TABLE IF NOT EXISTS archived_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_type VARCHAR(50) NOT NULL,
  activity_id VARCHAR(255) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  original_timestamp TIMESTAMPTZ NOT NULL,
  archived_at TIMESTAMPTZ DEFAULT NOW(),
  archived_by UUID REFERENCES auth.users(id),
  UNIQUE(activity_type, activity_id)
);

-- Create index for faster queries
CREATE INDEX idx_archived_activities_archived_at ON archived_activities(archived_at DESC);
CREATE INDEX idx_archived_activities_type ON archived_activities(activity_type);

-- Add RLS policies
ALTER TABLE archived_activities ENABLE ROW LEVEL SECURITY;

-- Admin users can read archived activities
CREATE POLICY "Admin users can read archived activities"
  ON archived_activities
  FOR SELECT
  TO authenticated
  USING (true);

-- Admin users can insert archived activities
CREATE POLICY "Admin users can insert archived activities"
  ON archived_activities
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Admin users can delete archived activities (unarchive)
CREATE POLICY "Admin users can delete archived activities"
  ON archived_activities
  FOR DELETE
  TO authenticated
  USING (true);


────────────────────────────────────────────────────────────────────────────────

-- Migration: 20251017_add_archived_to_email_templates.sql
-- Date: 20251017

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


────────────────────────────────────────────────────────────────────────────────

-- Migration: 20251017_update_payment_email_with_password.sql
-- Date: 20251017

-- Update payment link email template to include password
UPDATE email_templates
SET
  body_text = 'Hi ${firstName},

Thank you for taking the time to speak with us about the School BCBA Transformation Program! After our conversation, we''re excited to move forward together.

You can now proceed to secure your spot in the program. Access the payment page here:
https://behaviorschool.com/transformation-program/checkout

Your Access Credentials:
- Email: ${email}
- Password: ${password}

Next Steps:
- Click the link above to access the payment page
- Enter your email and password when prompted
- Complete your secure payment through Stripe
- Get immediate access to the program materials

Important: This link grants you exclusive access to enroll in the program. If you have any questions before proceeding, feel free to reach out!

We can''t wait to support you on your journey!

Best regards,
The Behavior School Team

---
Questions? Reply to this email or visit behaviorschool.com',

  body_html = '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ready to Begin Your Transformation?</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, ''Helvetica Neue'', Arial, sans-serif; background-color: #f8fafc;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; border-radius: 16px 16px 0 0; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                🎉 Let''s Get Started!
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; color: #334155; font-size: 16px; line-height: 1.6;">
                Hi ${firstName},
              </p>

              <p style="margin: 0 0 20px; color: #334155; font-size: 16px; line-height: 1.6;">
                Thank you for taking the time to speak with us about the School BCBA Transformation Program! After our conversation, we''re excited to move forward together.
              </p>

              <p style="margin: 0 0 30px; color: #334155; font-size: 16px; line-height: 1.6;">
                You can now proceed to secure your spot in the program. Click the button below to access the payment page:
              </p>

              <!-- CTA Button -->
              <table role="presentation" style="margin: 0 auto;">
                <tr>
                  <td style="border-radius: 8px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);">
                    <a href="https://behaviorschool.com/transformation-program/checkout" style="display: inline-block; padding: 16px 48px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 18px;">
                      Proceed to Payment →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Access Credentials Box -->
              <div style="margin: 30px 0; padding: 20px; background-color: #fef3c7; border-radius: 8px; border: 2px solid #fbbf24;">
                <h3 style="margin: 0 0 15px; color: #92400e; font-size: 18px; text-align: center;">🔐 Your Access Credentials</h3>
                <table role="presentation" style="width: 100%;">
                  <tr>
                    <td style="padding: 8px 0; color: #78350f; font-size: 14px; font-weight: 600;">Email:</td>
                    <td style="padding: 8px 0; color: #78350f; font-size: 14px;"><strong>${email}</strong></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #78350f; font-size: 14px; font-weight: 600;">Password:</td>
                    <td style="padding: 8px 0; color: #78350f; font-size: 14px;"><strong>${password}</strong></td>
                  </tr>
                </table>
                <p style="margin: 15px 0 0; color: #92400e; font-size: 12px; text-align: center;">
                  💡 Keep these credentials safe - you''ll need them to access the checkout page
                </p>
              </div>

              <div style="margin: 30px 0; padding: 20px; background-color: #ecfdf5; border-radius: 8px; border: 1px solid #d1fae5;">
                <h3 style="margin: 0 0 10px; color: #059669; font-size: 18px;">Next Steps:</h3>
                <ul style="margin: 0; padding-left: 20px; color: #334155; font-size: 14px; line-height: 1.8;">
                  <li>Click the button above to access the payment page</li>
                  <li>Enter your email and password when prompted</li>
                  <li>Complete your secure payment through Stripe</li>
                  <li>Get immediate access to the program materials</li>
                </ul>
              </div>

              <p style="margin: 30px 0 20px; color: #64748b; font-size: 14px; line-height: 1.6; padding: 20px; background-color: #f1f5f9; border-radius: 8px; border-left: 4px solid #10b981;">
                <strong style="color: #334155;">Important:</strong> This link grants you exclusive access to enroll in the program. If you have any questions before proceeding, feel free to reach out!
              </p>

              <p style="margin: 30px 0 0; color: #334155; font-size: 16px; line-height: 1.6;">
                We can''t wait to support you on your journey to becoming an exceptional School BCBA!
              </p>

              <p style="margin: 20px 0 0; color: #334155; font-size: 16px; line-height: 1.6;">
                Best regards,<br>
                <strong>The Behavior School Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f8fafc; border-radius: 0 0 16px 16px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 10px; color: #64748b; font-size: 12px;">
                Questions? Reply to this email or visit
                <a href="https://behaviorschool.com" style="color: #10b981; text-decoration: none;">behaviorschool.com</a>
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 11px;">
                © 2025 Behavior School. All rights reserved.
              </p>
            </td>
          </tr>
        </table>

        <!-- Backup Link -->
        <table role="presentation" style="max-width: 600px; width: 100%; margin-top: 20px;">
          <tr>
            <td style="text-align: center; padding: 20px;">
              <p style="margin: 0; color: #64748b; font-size: 13px;">
                Button not working? Copy and paste this link into your browser:<br>
                <a href="https://behaviorschool.com/transformation-program/checkout" style="color: #10b981; text-decoration: none; word-break: break-all;">https://behaviorschool.com/transformation-program/checkout</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>'

WHERE name = 'transformation_payment_link';


────────────────────────────────────────────────────────────────────────────────

-- Migration: 20251019_add_bcba_cert_number.sql
-- Date: 20251019

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


────────────────────────────────────────────────────────────────────────────────

-- Migration: 20251019_create_certificates_issued_table.sql
-- Date: 20251019

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


────────────────────────────────────────────────────────────────────────────────

-- END OF COMBINED MIGRATION SQL --

────────────────────────────────────────────────────────────────────────────────

✅ After running the SQL, all database tables will be ready!
💡 TIP: The migrations are idempotent (safe to run multiple times)

