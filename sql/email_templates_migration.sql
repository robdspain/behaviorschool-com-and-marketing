-- Migration script to add missing columns and update email_templates table
-- Run this in your Supabase SQL editor

-- Add missing columns if they don't exist
ALTER TABLE email_templates ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'signup';
ALTER TABLE email_templates ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE email_templates ADD COLUMN IF NOT EXISTS send_delay_minutes INTEGER DEFAULT 0;
ALTER TABLE email_templates ADD COLUMN IF NOT EXISTS description TEXT;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_email_templates_name ON email_templates(name);
CREATE INDEX IF NOT EXISTS idx_email_templates_category ON email_templates(category);
CREATE INDEX IF NOT EXISTS idx_email_templates_active ON email_templates(is_active);

-- Update or insert the 4 signup sequence templates
-- Email 1: Immediate Confirmation
INSERT INTO email_templates (name, description, subject, body_text, body_html, category, send_delay_minutes, is_active)
VALUES (
  'signup_immediate_confirmation',
  'Sent immediately after signup to confirm receipt and direct to booking',
  '${firstName}, your application has been received!',
  'Hi ${firstName},

Thanks for applying to the School BCBA Transformation System! Your application has been received and we''re excited to learn more about your goals.

🎯 NEXT STEP: Schedule your consultation call

You should see a booking calendar on your screen right now. If you haven''t already, pick a time that works best for you:
https://calendly.com/robspain/behavior-school-transformation-system-phone-call

What to expect on the call:
→ We''ll discuss your specific challenges and goals
→ You''ll see exactly how the system can help you
→ Get all your questions answered (no pressure!)

This will be a 15-minute conversation to make sure we''re a great fit for each other.

Looking forward to connecting,
Rob Spain
Creator, School BCBA Transformation System
Behavior School',
  '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, ''Helvetica Neue'', Arial, sans-serif; line-height: 1.6; color: #1e293b;"><table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;"><tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);"><tr><td style="padding: 40px 40px 20px; text-align: center; border-bottom: 3px solid #10b981;"><h1 style="margin: 0; font-size: 24px; color: #0f172a; font-weight: 700;">Behavior School</h1></td></tr><tr><td style="padding: 40px;"><p style="margin: 0 0 20px; font-size: 18px; color: #0f172a;">Hi ${firstName},</p><p style="margin: 0 0 20px; font-size: 16px; color: #334155;">Thanks for applying to the <strong>School BCBA Transformation System</strong>! Your application has been received and we''re excited to learn more about your goals.</p><div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 16px; margin: 24px 0;"><p style="margin: 0; font-size: 16px; color: #166534; font-weight: 600;">🎯 NEXT STEP: Schedule your consultation call</p></div><p style="margin: 0 0 20px; font-size: 16px; color: #334155;">You should see a booking calendar on your screen right now. If you haven''t already, pick a time that works best for you:</p><table width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0;"><tr><td align="center"><a href="https://calendly.com/robspain/behavior-school-transformation-system-phone-call" style="display: inline-block; padding: 16px 32px; background-color: #10b981; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">📅 Schedule Your Call</a></td></tr></table><p style="margin: 20px 0 10px; font-size: 16px; color: #334155; font-weight: 600;">What to expect on the call:</p><ul style="margin: 0 0 20px; padding-left: 20px; color: #334155;"><li style="margin-bottom: 8px;">We''ll discuss your specific challenges and goals</li><li style="margin-bottom: 8px;">You''ll see exactly how the system can help you</li><li style="margin-bottom: 8px;">Get all your questions answered (no pressure!)</li></ul><p style="margin: 20px 0 0; font-size: 14px; color: #64748b;"><em>This will be a 15-minute conversation to make sure we''re a great fit for each other.</em></p></td></tr><tr><td style="padding: 0 40px 40px;"><div style="border-top: 1px solid #e2e8f0; padding-top: 24px;"><p style="margin: 0 0 8px; font-size: 16px; color: #0f172a; font-weight: 600;">Looking forward to connecting,</p><p style="margin: 0 0 4px; font-size: 16px; color: #0f172a; font-weight: 600;">Rob Spain</p><p style="margin: 0; font-size: 14px; color: #64748b;">Creator, School BCBA Transformation System<br>Behavior School</p></div></td></tr><tr><td style="padding: 20px 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; border-radius: 0 0 8px 8px;"><p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">Behavior School | Empowering BCBAs in Schools</p></td></tr></table></td></tr></table></body></html>',
  'signup',
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

-- Email 2: 10-Minute Follow-up
INSERT INTO email_templates (name, description, subject, body_text, body_html, category, send_delay_minutes, is_active)
VALUES (
  'signup_10min_followup',
  'Personal follow-up 10 minutes after signup with empathy and Calendly link',
  '${firstName}, let''s get your School BCBA transformation started',
  'Hi ${firstName},

I just saw your application for the School BCBA Transformation System come through, and I wanted to reach out personally.

I know what it''s like to feel overwhelmed by the demands of a school BCBA role—the endless FBAs, the pressure to show measurable results, and the challenge of getting buy-in from teachers and administrators. That''s exactly why I created this system.

If you haven''t already booked your consultation call, I''d love to jump on a quick call with you to:
→ Understand your specific challenges and goals
→ Show you exactly how the system can transform your practice
→ Answer any questions you have about the program

If you haven''t already scheduled, book a time that works for you here:
https://calendly.com/robspain/behavior-school-transformation-system-phone-call

These spots fill up quickly, so grab a time while they''re available.

Looking forward to connecting,
Rob Spain
Creator, School BCBA Transformation System
Behavior School',
  '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, ''Helvetica Neue'', Arial, sans-serif; line-height: 1.6; color: #1e293b;"><table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;"><tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);"><tr><td style="padding: 40px 40px 20px; text-align: center; border-bottom: 3px solid #10b981;"><h1 style="margin: 0; font-size: 24px; color: #0f172a; font-weight: 700;">Behavior School</h1></td></tr><tr><td style="padding: 40px;"><p style="margin: 0 0 20px; font-size: 18px; color: #0f172a;">Hi ${firstName},</p><p style="margin: 0 0 20px; font-size: 16px; color: #334155;">I just saw your application for the <strong>School BCBA Transformation System</strong> come through, and I wanted to reach out personally.</p><p style="margin: 0 0 20px; font-size: 16px; color: #334155;">I know what it''s like to feel overwhelmed by the demands of a school BCBA role—the endless FBAs, the pressure to show measurable results, and the challenge of getting buy-in from teachers and administrators. <strong>That''s exactly why I created this system.</strong></p><p style="margin: 0 0 10px; font-size: 16px; color: #334155;">If you haven''t already booked your consultation call, I''d love to jump on a quick call with you to:</p><ul style="margin: 0 0 24px; padding-left: 20px; color: #334155;"><li style="margin-bottom: 8px; font-size: 16px;">Understand your specific challenges and goals</li><li style="margin-bottom: 8px; font-size: 16px;">Show you exactly how the system can transform your practice</li><li style="margin-bottom: 8px; font-size: 16px;">Answer any questions you have about the program</li></ul><table width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0;"><tr><td align="center"><a href="https://calendly.com/robspain/behavior-school-transformation-system-phone-call" style="display: inline-block; padding: 16px 32px; background-color: #10b981; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">📅 Book Your Call Now</a></td></tr></table><p style="margin: 24px 0 0; font-size: 14px; color: #64748b; text-align: center;"><em>If you haven''t already scheduled, these spots fill up quickly, so grab a time while they''re available.</em></p></td></tr><tr><td style="padding: 0 40px 40px;"><div style="border-top: 1px solid #e2e8f0; padding-top: 24px;"><p style="margin: 0 0 8px; font-size: 16px; color: #0f172a; font-weight: 600;">Looking forward to connecting,</p><p style="margin: 0 0 4px; font-size: 16px; color: #0f172a; font-weight: 600;">Rob Spain</p><p style="margin: 0; font-size: 14px; color: #64748b;">Creator, School BCBA Transformation System<br>Behavior School</p></div></td></tr><tr><td style="padding: 20px 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; border-radius: 0 0 8px 8px;"><p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">Behavior School | Empowering BCBAs in Schools</p></td></tr></table></td></tr></table></body></html>',
  'signup',
  10,
  true
) ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  subject = EXCLUDED.subject,
  body_text = EXCLUDED.body_text,
  body_html = EXCLUDED.body_html,
  category = EXCLUDED.category,
  send_delay_minutes = EXCLUDED.send_delay_minutes,
  is_active = EXCLUDED.is_active;

-- Email 3: 24-Hour Reminder
INSERT INTO email_templates (name, description, subject, body_text, body_html, category, send_delay_minutes, is_active)
VALUES (
  'signup_24h_reminder',
  'Gentle reminder sent 24 hours after signup for those who haven''t booked',
  '${firstName}, did you get a chance to book your call?',
  'Hi ${firstName},

I wanted to follow up on your application for the School BCBA Transformation System.

I noticed you haven''t scheduled your consultation call yet. No worries - I know how busy school schedules can be!

I''d really love to hear about your challenges and show you how the system can help. The call is just 15 minutes and there''s absolutely no pressure.

Book your call here:
https://calendly.com/robspain/behavior-school-transformation-system-phone-call

If you have any questions or concerns before booking, just hit reply to this email. I read every single one.

Talk soon,
Rob Spain
Creator, School BCBA Transformation System',
  '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, ''Helvetica Neue'', Arial, sans-serif; line-height: 1.6; color: #1e293b;"><table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;"><tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);"><tr><td style="padding: 40px 40px 20px; text-align: center; border-bottom: 3px solid #10b981;"><h1 style="margin: 0; font-size: 24px; color: #0f172a; font-weight: 700;">Behavior School</h1></td></tr><tr><td style="padding: 40px;"><p style="margin: 0 0 20px; font-size: 18px; color: #0f172a;">Hi ${firstName},</p><p style="margin: 0 0 20px; font-size: 16px; color: #334155;">I wanted to follow up on your application for the School BCBA Transformation System.</p><p style="margin: 0 0 20px; font-size: 16px; color: #334155;">I noticed you haven''t scheduled your consultation call yet. No worries - I know how busy school schedules can be!</p><p style="margin: 0 0 20px; font-size: 16px; color: #334155;">I''d really love to hear about your challenges and show you how the system can help. <strong>The call is just 15 minutes and there''s absolutely no pressure.</strong></p><table width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0;"><tr><td align="center"><a href="https://calendly.com/robspain/behavior-school-transformation-system-phone-call" style="display: inline-block; padding: 16px 32px; background-color: #10b981; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">📅 Book Your 15-Minute Call</a></td></tr></table><p style="margin: 20px 0 0; font-size: 14px; color: #64748b; text-align: center;"><em>If you have any questions or concerns before booking, just hit reply to this email. I read every single one.</em></p></td></tr><tr><td style="padding: 0 40px 40px;"><div style="border-top: 1px solid #e2e8f0; padding-top: 24px;"><p style="margin: 0 0 8px; font-size: 16px; color: #0f172a; font-weight: 600;">Talk soon,</p><p style="margin: 0 0 4px; font-size: 16px; color: #0f172a; font-weight: 600;">Rob Spain</p><p style="margin: 0; font-size: 14px; color: #64748b;">Creator, School BCBA Transformation System</p></div></td></tr><tr><td style="padding: 20px 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; border-radius: 0 0 8px 8px;"><p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">Behavior School | Empowering BCBAs in Schools</p></td></tr></table></td></tr></table></body></html>',
  'signup',
  1440,
  true
) ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  subject = EXCLUDED.subject,
  body_text = EXCLUDED.body_text,
  body_html = EXCLUDED.body_html,
  category = EXCLUDED.category,
  send_delay_minutes = EXCLUDED.send_delay_minutes,
  is_active = EXCLUDED.is_active;

-- Email 4: 48-Hour Case Study
INSERT INTO email_templates (name, description, subject, body_text, body_html, category, send_delay_minutes, is_active)
VALUES (
  'signup_48h_case_study',
  'Social proof email with transformation story sent 48 hours after signup',
  '${firstName}, how Sarah went from overwhelmed to confident in 8 weeks',
  'Hi ${firstName},

I wanted to share a quick story with you.

Sarah was a school BCBA in Oregon, drowning in FBAs and feeling like she was always playing catch-up. Teachers resisted her recommendations. Admins questioned her value. She was working 60-hour weeks and still felt behind.

8 weeks after joining the School BCBA Transformation System:

→ She built a sustainable behavior tracking system that runs itself
→ Teachers started ASKING for her support (instead of avoiding her)
→ Her district expanded her role to 3 additional schools
→ She left work at 4pm every day with everything under control

Sarah''s not special. She just had the right systems.

The same systems that transformed her practice are waiting for you in our program.

If you''re ready to stop feeling overwhelmed and start feeling confident, let''s talk:
https://calendly.com/robspain/behavior-school-transformation-system-phone-call

Just 15 minutes. No pressure. Let''s see if this is right for you.

Rob Spain
Creator, School BCBA Transformation System

P.S. Sarah told me the biggest game-changer was the "5-Minute FBA Framework." It''s one of 12 systems you''ll get access to. Want to hear more about it? Book your call above.',
  '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, ''Helvetica Neue'', Arial, sans-serif; line-height: 1.6; color: #1e293b;"><table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;"><tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);"><tr><td style="padding: 40px 40px 20px; text-align: center; border-bottom: 3px solid #10b981;"><h1 style="margin: 0; font-size: 24px; color: #0f172a; font-weight: 700;">Behavior School</h1></td></tr><tr><td style="padding: 40px;"><p style="margin: 0 0 20px; font-size: 18px; color: #0f172a;">Hi ${firstName},</p><p style="margin: 0 0 20px; font-size: 16px; color: #334155;">I wanted to share a quick story with you.</p><p style="margin: 0 0 10px; font-size: 16px; color: #334155;"><strong>Sarah was a school BCBA in Oregon</strong>, drowning in FBAs and feeling like she was always playing catch-up. Teachers resisted her recommendations. Admins questioned her value. She was working 60-hour weeks and still felt behind.</p><div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 24px 0;"><p style="margin: 0 0 12px; font-size: 16px; color: #166534; font-weight: 600;">8 weeks after joining the School BCBA Transformation System:</p><ul style="margin: 0; padding-left: 20px; color: #166534;"><li style="margin-bottom: 8px;">She built a sustainable behavior tracking system that runs itself</li><li style="margin-bottom: 8px;">Teachers started ASKING for her support (instead of avoiding her)</li><li style="margin-bottom: 8px;">Her district expanded her role to 3 additional schools</li><li>She left work at 4pm every day with everything under control</li></ul></div><p style="margin: 20px 0; font-size: 16px; color: #334155;"><strong>Sarah''s not special. She just had the right systems.</strong></p><p style="margin: 0 0 20px; font-size: 16px; color: #334155;">The same systems that transformed her practice are waiting for you in our program.</p><p style="margin: 0 0 20px; font-size: 16px; color: #334155;">If you''re ready to stop feeling overwhelmed and start feeling confident, let''s talk:</p><table width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0;"><tr><td align="center"><a href="https://calendly.com/robspain/behavior-school-transformation-system-phone-call" style="display: inline-block; padding: 16px 32px; background-color: #10b981; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">📅 Book Your Call (15 Minutes)</a></td></tr></table><p style="margin: 20px 0 0; font-size: 14px; color: #64748b; text-align: center;"><em>Just 15 minutes. No pressure. Let''s see if this is right for you.</em></p><div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0;"><p style="margin: 0; font-size: 14px; color: #92400e;"><strong>P.S.</strong> Sarah told me the biggest game-changer was the "5-Minute FBA Framework." It''s one of 12 systems you''ll get access to. Want to hear more about it? Book your call above.</p></div></td></tr><tr><td style="padding: 0 40px 40px;"><div style="border-top: 1px solid #e2e8f0; padding-top: 24px;"><p style="margin: 0 0 4px; font-size: 16px; color: #0f172a; font-weight: 600;">Rob Spain</p><p style="margin: 0; font-size: 14px; color: #64748b;">Creator, School BCBA Transformation System</p></div></td></tr><tr><td style="padding: 20px 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; border-radius: 0 0 8px 8px;"><p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">Behavior School | Empowering BCBAs in Schools</p></td></tr></table></td></tr></table></body></html>',
  'signup',
  2880,
  true
) ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  subject = EXCLUDED.subject,
  body_text = EXCLUDED.body_text,
  body_html = EXCLUDED.body_html,
  category = EXCLUDED.category,
  send_delay_minutes = EXCLUDED.send_delay_minutes,
  is_active = EXCLUDED.is_active;

-- Verify the templates were inserted/updated
SELECT name, category, send_delay_minutes, is_active,
       LEFT(subject, 50) as subject_preview
FROM email_templates
WHERE category = 'signup'
ORDER BY send_delay_minutes;
