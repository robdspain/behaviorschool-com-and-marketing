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
