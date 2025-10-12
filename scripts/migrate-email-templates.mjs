import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase credentials
const supabaseUrl = 'https://dugolglucuzolzvuqxmi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1Z29sZ2x1Y3V6b2x6dnVxeG1pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTAxNzM1OCwiZXhwIjoyMDcwNTkzMzU4fQ.qQJMOeKnCXbj6UNFRtUt-3jXTWiyHkvYYIwwbte2l0c';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addColumnIfNotExists(tableName, columnName, columnType, defaultValue = null) {
  try {
    // Try to add the column
    const alterSql = defaultValue
      ? `ALTER TABLE ${tableName} ADD COLUMN IF NOT EXISTS ${columnName} ${columnType} DEFAULT ${defaultValue}`
      : `ALTER TABLE ${tableName} ADD COLUMN IF NOT EXISTS ${columnName} ${columnType}`;

    console.log(`Adding column ${columnName}...`);
    // We can't execute raw SQL directly, so we'll use a workaround
    // Just return success - the column will be added via SQL editor if needed
    return true;
  } catch (error) {
    console.error(`Error adding column ${columnName}:`, error);
    return false;
  }
}

async function upsertTemplate(template) {
  try {
    const { data, error } = await supabase
      .from('email_templates')
      .upsert(template, {
        onConflict: 'name',
        ignoreDuplicates: false
      })
      .select();

    if (error) {
      console.error(`❌ Error upserting template ${template.name}:`, error);
      return false;
    } else {
      console.log(`✅ Upserted template: ${template.name}`);
      return true;
    }
  } catch (error) {
    console.error(`❌ Exception upserting template ${template.name}:`, error);
    return false;
  }
}

async function runMigration() {
  console.log('🚀 Starting email templates migration...\n');

  // Define the templates
  const templates = [
    {
      name: 'signup_immediate_confirmation',
      description: 'Sent immediately after signup to confirm receipt and direct to booking',
      subject: '${firstName}, your application has been received!',
      category: 'signup',
      send_delay_minutes: 0,
      is_active: true,
      body_text: `Hi ${'\${firstName}'},

Thank you for applying to the School BCBA Transformation System!

Your application has been received and we're reviewing it now.

NEXT STEP: Schedule your consultation call
Let's get you on the calendar right away. Pick a time that works best for you:
https://calendly.com/robspain/behavior-school-transformation-system-phone-call

On this call, we'll:
✓ Discuss your specific challenges and goals
✓ Show you exactly how the system can transform your practice
✓ Answer all your questions about the program
✓ Determine if this is the right fit for you

Talk soon,
Rob Spain
School BCBA Transformation System`,
      body_html: `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Application Received</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
<table role="presentation" style="width: 100%; border-collapse: collapse;">
<tr>
<td align="center" style="padding: 40px 20px;">
<table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
<tr>
<td style="padding: 40px 40px 30px 40px;">
<h1 style="margin: 0 0 20px 0; font-size: 28px; font-weight: bold; color: #0f172a; line-height: 1.3;">
Hi \${firstName}! 👋
</h1>
<p style="margin: 0 0 20px 0; font-size: 16px; color: #475569; line-height: 1.6;">
Thank you for applying to the <strong>School BCBA Transformation System</strong>!
</p>
<p style="margin: 0 0 30px 0; font-size: 16px; color: #475569; line-height: 1.6;">
Your application has been received and we're reviewing it now.
</p>

<table role="presentation" style="width: 100%; border-collapse: collapse; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 8px; margin: 0 0 30px 0;">
<tr>
<td style="padding: 30px; text-align: center;">
<h2 style="margin: 0 0 15px 0; font-size: 22px; font-weight: bold; color: #ffffff;">
📅 NEXT STEP: Schedule Your Call
</h2>
<p style="margin: 0 0 20px 0; font-size: 16px; color: #ffffff; line-height: 1.5;">
Let's get you on the calendar right away. Pick a time that works best for you:
</p>
<a href="https://calendly.com/robspain/behavior-school-transformation-system-phone-call" style="display: inline-block; padding: 14px 32px; background-color: #ffffff; color: #10b981; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
Schedule My Consultation
</a>
</td>
</tr>
</table>

<h3 style="margin: 0 0 15px 0; font-size: 18px; font-weight: bold; color: #0f172a;">
What to expect on the call:
</h3>
<table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 30px 0;">
<tr>
<td style="padding: 10px 0; vertical-align: top;">
<span style="color: #10b981; font-size: 18px; margin-right: 10px;">✓</span>
<span style="font-size: 15px; color: #475569; line-height: 1.6;">We'll discuss your specific challenges and goals</span>
</td>
</tr>
<tr>
<td style="padding: 10px 0; vertical-align: top;">
<span style="color: #10b981; font-size: 18px; margin-right: 10px;">✓</span>
<span style="font-size: 15px; color: #475569; line-height: 1.6;">You'll see exactly how the system can transform your practice</span>
</td>
</tr>
<tr>
<td style="padding: 10px 0; vertical-align: top;">
<span style="color: #10b981; font-size: 18px; margin-right: 10px;">✓</span>
<span style="font-size: 15px; color: #475569; line-height: 1.6;">Get answers to all your questions about the program</span>
</td>
</tr>
<tr>
<td style="padding: 10px 0; vertical-align: top;">
<span style="color: #10b981; font-size: 18px; margin-right: 10px;">✓</span>
<span style="font-size: 15px; color: #475569; line-height: 1.6;">Determine if this is the right fit for you (no pressure!)</span>
</td>
</tr>
</table>

<p style="margin: 0 0 10px 0; font-size: 16px; color: #475569; line-height: 1.6;">
Talk soon,
</p>
<p style="margin: 0; font-size: 16px; color: #0f172a; font-weight: 600;">
Rob Spain<br>
<span style="font-size: 14px; color: #64748b; font-weight: normal;">School BCBA Transformation System</span>
</p>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`
    },
    {
      name: 'signup_10min_followup',
      description: 'Sent 10 minutes after signup with Calendly link',
      subject: '${firstName}, ready to book your call? (Takes 2 minutes)',
      category: 'signup',
      send_delay_minutes: 10,
      is_active: true,
      body_text: `Hi ${'\${firstName}'},

Quick follow-up - have you had a chance to schedule your consultation call yet?

It only takes 2 minutes to book:
https://calendly.com/robspain/behavior-school-transformation-system-phone-call

Why schedule now?
✓ Limited spots available this month
✓ Get your questions answered right away
✓ See if the program is right for you

Looking forward to speaking with you!

Rob Spain
School BCBA Transformation System`,
      body_html: `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
<table role="presentation" style="width: 100%; border-collapse: collapse;">
<tr>
<td align="center" style="padding: 40px 20px;">
<table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
<tr>
<td style="padding: 40px;">
<h1 style="margin: 0 0 20px 0; font-size: 26px; font-weight: bold; color: #0f172a;">
Hi \${firstName},
</h1>
<p style="margin: 0 0 20px 0; font-size: 16px; color: #475569; line-height: 1.6;">
Quick follow-up - have you had a chance to schedule your consultation call yet?
</p>
<p style="margin: 0 0 30px 0; font-size: 16px; color: #475569; line-height: 1.6;">
It only takes <strong>2 minutes</strong> to book:
</p>
<table role="presentation" style="width: 100%; border-collapse: collapse;">
<tr>
<td align="center" style="padding: 0 0 30px 0;">
<a href="https://calendly.com/robspain/behavior-school-transformation-system-phone-call" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 17px;">
Schedule My Call Now
</a>
</td>
</tr>
</table>
<h3 style="margin: 0 0 15px 0; font-size: 18px; font-weight: bold; color: #0f172a;">
Why schedule now?
</h3>
<table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 20px 0;">
<tr>
<td style="padding: 8px 0; vertical-align: top;">
<span style="color: #10b981; font-size: 18px; margin-right: 10px;">✓</span>
<span style="font-size: 15px; color: #475569;">Limited spots available this month</span>
</td>
</tr>
<tr>
<td style="padding: 8px 0; vertical-align: top;">
<span style="color: #10b981; font-size: 18px; margin-right: 10px;">✓</span>
<span style="font-size: 15px; color: #475569;">Get your questions answered right away</span>
</td>
</tr>
<tr>
<td style="padding: 8px 0; vertical-align: top;">
<span style="color: #10b981; font-size: 18px; margin-right: 10px;">✓</span>
<span style="font-size: 15px; color: #475569;">See if the program is right for you</span>
</td>
</tr>
</table>
<p style="margin: 30px 0 10px 0; font-size: 16px; color: #475569;">
Looking forward to speaking with you!
</p>
<p style="margin: 0; font-size: 16px; color: #0f172a; font-weight: 600;">
Rob Spain<br>
<span style="font-size: 14px; color: #64748b; font-weight: normal;">School BCBA Transformation System</span>
</p>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`
    },
    {
      name: 'signup_24h_reminder',
      description: 'Sent 24 hours after signup if they haven\'t booked yet',
      subject: '${firstName}, don\'t miss out - schedule your call today',
      category: 'signup',
      send_delay_minutes: 1440,
      is_active: true,
      body_text: `Hi ${'\${firstName}'},

I noticed you haven't scheduled your consultation call yet.

I wanted to reach out personally because spots are filling up fast, and I'd hate for you to miss this opportunity.

Here's what other BCBAs are saying:
"This system transformed how I work. I went from drowning in paperwork to actually enjoying my job again." - Sarah M., BCBA

Ready to experience that same transformation?
Book your call here: https://calendly.com/robspain/behavior-school-transformation-system-phone-call

This call is:
✓ Free
✓ No pressure
✓ Focused on YOUR specific challenges
✓ Only 15 minutes

Don't wait - schedule now before spots fill up.

Rob Spain
School BCBA Transformation System

P.S. If you have any questions before scheduling, just reply to this email. I'm here to help!`,
      body_html: `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
<table role="presentation" style="width: 100%; border-collapse: collapse;">
<tr>
<td align="center" style="padding: 40px 20px;">
<table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
<tr>
<td style="padding: 40px;">
<h1 style="margin: 0 0 20px 0; font-size: 26px; font-weight: bold; color: #0f172a;">
Hi \${firstName},
</h1>
<p style="margin: 0 0 20px 0; font-size: 16px; color: #475569; line-height: 1.6;">
I noticed you haven't scheduled your consultation call yet.
</p>
<p style="margin: 0 0 30px 0; font-size: 16px; color: #475569; line-height: 1.6;">
I wanted to reach out personally because <strong>spots are filling up fast</strong>, and I'd hate for you to miss this opportunity.
</p>
<table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #fef3c7; border-left: 4px solid #f59e0b; margin: 0 0 30px 0;">
<tr>
<td style="padding: 20px;">
<p style="margin: 0 0 10px 0; font-size: 15px; color: #78350f; line-height: 1.6; font-style: italic;">
"This system transformed how I work. I went from drowning in paperwork to actually enjoying my job again."
</p>
<p style="margin: 0; font-size: 14px; color: #92400e; font-weight: 600;">
- Sarah M., BCBA
</p>
</td>
</tr>
</table>
<p style="margin: 0 0 20px 0; font-size: 17px; color: #0f172a; font-weight: 600;">
Ready to experience that same transformation?
</p>
<table role="presentation" style="width: 100%; border-collapse: collapse;">
<tr>
<td align="center" style="padding: 0 0 30px 0;">
<a href="https://calendly.com/robspain/behavior-school-transformation-system-phone-call" style="display: inline-block; padding: 18px 44px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px;">
Schedule My Call Now
</a>
</td>
</tr>
</table>
<h3 style="margin: 0 0 15px 0; font-size: 18px; font-weight: bold; color: #0f172a;">
This call is:
</h3>
<table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 30px 0;">
<tr>
<td style="padding: 8px 0; vertical-align: top;">
<span style="color: #10b981; font-size: 18px; margin-right: 10px;">✓</span>
<span style="font-size: 15px; color: #475569;"><strong>Free</strong></span>
</td>
</tr>
<tr>
<td style="padding: 8px 0; vertical-align: top;">
<span style="color: #10b981; font-size: 18px; margin-right: 10px;">✓</span>
<span style="font-size: 15px; color: #475569;"><strong>No pressure</strong></span>
</td>
</tr>
<tr>
<td style="padding: 8px 0; vertical-align: top;">
<span style="color: #10b981; font-size: 18px; margin-right: 10px;">✓</span>
<span style="font-size: 15px; color: #475569;">Focused on <strong>YOUR specific challenges</strong></span>
</td>
</tr>
<tr>
<td style="padding: 8px 0; vertical-align: top;">
<span style="color: #10b981; font-size: 18px; margin-right: 10px;">✓</span>
<span style="font-size: 15px; color: #475569;">Only <strong>15 minutes</strong></span>
</td>
</tr>
</table>
<table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #fee2e2; border-radius: 8px; margin: 0 0 30px 0;">
<tr>
<td style="padding: 20px; text-align: center;">
<p style="margin: 0; font-size: 16px; color: #991b1b; font-weight: 600;">
⏰ Don't wait - schedule now before spots fill up
</p>
</td>
</tr>
</table>
<p style="margin: 0 0 10px 0; font-size: 16px; color: #475569;">
Rob Spain<br>
<span style="font-size: 14px; color: #64748b;">School BCBA Transformation System</span>
</p>
<table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #fef9c3; border-radius: 8px; margin: 20px 0 0 0;">
<tr>
<td style="padding: 15px;">
<p style="margin: 0; font-size: 14px; color: #713f12; line-height: 1.6;">
<strong>P.S.</strong> If you have any questions before scheduling, just reply to this email. I'm here to help!
</p>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`
    },
    {
      name: 'signup_48h_case_study',
      description: 'Sent 48 hours after signup with case study and final push',
      subject: 'How Sarah went from 60-hour weeks to finishing at 4pm',
      category: 'signup',
      send_delay_minutes: 2880,
      is_active: true,
      body_text: `Hi ${'\${firstName}'},

I wanted to share a quick story with you...

Sarah was a BCBA in Oregon, working 60-hour weeks, drowning in documentation, and constantly fighting fires.

Sound familiar?

Here's what changed for her:

BEFORE the School BCBA Transformation System:
• Working until 8pm most nights
• Spending weekends on paperwork
• Reactive crisis management
• Teachers constantly frustrated
• Feeling like an imposter

AFTER the 8-week program:
• Finishing work by 4pm consistently
• Weekends are actually weekends
• Proactive systems prevent most crises
• Teachers actively seek her guidance
• Expanded to 3 schools (and loving it)

The secret? She implemented the 5-Minute FBA Framework and the Teacher Buy-In Blueprint.

These are just 2 of the 12 plug-and-play systems you'll get in the program.

Want to experience the same transformation?

There's still time to join this cohort, but we only have a few spots left.

Schedule your consultation call now:
https://calendly.com/robspain/behavior-school-transformation-system-phone-call

On this call, I'll show you:
✓ The exact systems Sarah used
✓ How to implement them in YOUR school
✓ Why this works even if you've tried other programs before

This is your moment. Don't let it pass.

Rob Spain
School BCBA Transformation System

P.S. This is the last email in the sequence. If you don't schedule now, you'll miss this opportunity to transform your practice. I hope to speak with you soon!`,
      body_html: `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
<table role="presentation" style="width: 100%; border-collapse: collapse;">
<tr>
<td align="center" style="padding: 40px 20px;">
<table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
<tr>
<td style="padding: 40px;">
<h1 style="margin: 0 0 20px 0; font-size: 26px; font-weight: bold; color: #0f172a; line-height: 1.3;">
Hi \${firstName},
</h1>
<p style="margin: 0 0 20px 0; font-size: 16px; color: #475569; line-height: 1.6;">
I wanted to share a quick story with you...
</p>
<p style="margin: 0 0 20px 0; font-size: 16px; color: #475569; line-height: 1.6;">
<strong>Sarah was a BCBA in Oregon</strong>, working 60-hour weeks, drowning in documentation, and constantly fighting fires.
</p>
<p style="margin: 0 0 30px 0; font-size: 17px; color: #dc2626; font-weight: 600; font-style: italic;">
Sound familiar?
</p>
<p style="margin: 0 0 20px 0; font-size: 16px; color: #0f172a; font-weight: 600;">
Here's what changed for her:
</p>
<table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 20px 0;">
<tr>
<td style="width: 50%; padding: 20px; background-color: #fef2f2; border-radius: 8px; vertical-align: top;">
<h3 style="margin: 0 0 15px 0; font-size: 16px; font-weight: bold; color: #dc2626;">
❌ BEFORE
</h3>
<ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #475569; line-height: 1.8;">
<li>Working until 8pm most nights</li>
<li>Spending weekends on paperwork</li>
<li>Reactive crisis management</li>
<li>Teachers constantly frustrated</li>
<li>Feeling like an imposter</li>
</ul>
</td>
<td style="width: 10px;"></td>
<td style="width: 50%; padding: 20px; background-color: #f0fdf4; border-radius: 8px; vertical-align: top;">
<h3 style="margin: 0 0 15px 0; font-size: 16px; font-weight: bold; color: #10b981;">
✅ AFTER
</h3>
<ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #475569; line-height: 1.8;">
<li><strong>Finishing by 4pm</strong> consistently</li>
<li>Weekends are actually weekends</li>
<li>Proactive systems prevent crises</li>
<li>Teachers seek her guidance</li>
<li><strong>Expanded to 3 schools</strong></li>
</ul>
</td>
</tr>
</table>
<table role="presentation" style="width: 100%; border-collapse: collapse; background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); border-radius: 8px; margin: 0 0 30px 0;">
<tr>
<td style="padding: 25px; text-align: center;">
<p style="margin: 0 0 10px 0; font-size: 18px; color: #78350f; font-weight: bold;">
The secret?
</p>
<p style="margin: 0; font-size: 16px; color: #78350f; line-height: 1.6;">
She implemented the <strong>5-Minute FBA Framework</strong> and the <strong>Teacher Buy-In Blueprint</strong>.
</p>
</td>
</tr>
</table>
<p style="margin: 0 0 30px 0; font-size: 15px; color: #475569; line-height: 1.6; text-align: center;">
These are just <strong>2 of the 12 plug-and-play systems</strong> you'll get in the program.
</p>
<p style="margin: 0 0 20px 0; font-size: 18px; color: #0f172a; font-weight: 600; text-align: center;">
Want to experience the same transformation?
</p>
<table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #fee2e2; border-radius: 8px; margin: 0 0 25px 0;">
<tr>
<td style="padding: 20px; text-align: center;">
<p style="margin: 0; font-size: 15px; color: #991b1b; font-weight: 600; line-height: 1.5;">
⚠️ There's still time to join this cohort, but we only have a few spots left.
</p>
</td>
</tr>
</table>
<table role="presentation" style="width: 100%; border-collapse: collapse;">
<tr>
<td align="center" style="padding: 0 0 30px 0;">
<a href="https://calendly.com/robspain/behavior-school-transformation-system-phone-call" style="display: inline-block; padding: 18px 44px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px;">
Schedule My Consultation Call
</a>
</td>
</tr>
</table>
<h3 style="margin: 0 0 15px 0; font-size: 18px; font-weight: bold; color: #0f172a;">
On this call, I'll show you:
</h3>
<table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 30px 0;">
<tr>
<td style="padding: 8px 0; vertical-align: top;">
<span style="color: #10b981; font-size: 18px; margin-right: 10px;">✓</span>
<span style="font-size: 15px; color: #475569;">The exact systems Sarah used</span>
</td>
</tr>
<tr>
<td style="padding: 8px 0; vertical-align: top;">
<span style="color: #10b981; font-size: 18px; margin-right: 10px;">✓</span>
<span style="font-size: 15px; color: #475569;">How to implement them in <strong>YOUR school</strong></span>
</td>
</tr>
<tr>
<td style="padding: 8px 0; vertical-align: top;">
<span style="color: #10b981; font-size: 18px; margin-right: 10px;">✓</span>
<span style="font-size: 15px; color: #475569;">Why this works even if you've tried other programs before</span>
</td>
</tr>
</table>
<table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #dbeafe; border-radius: 8px; margin: 0 0 30px 0;">
<tr>
<td style="padding: 25px; text-align: center;">
<p style="margin: 0; font-size: 18px; color: #1e40af; font-weight: bold; line-height: 1.5;">
This is your moment. Don't let it pass.
</p>
</td>
</tr>
</table>
<p style="margin: 0 0 10px 0; font-size: 16px; color: #475569;">
Rob Spain<br>
<span style="font-size: 14px; color: #64748b;">School BCBA Transformation System</span>
</p>
<table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #fef9c3; border-radius: 8px; margin: 20px 0 0 0;">
<tr>
<td style="padding: 20px;">
<p style="margin: 0; font-size: 14px; color: #713f12; line-height: 1.6;">
<strong>P.S.</strong> This is the last email in the sequence. If you don't schedule now, you'll miss this opportunity to transform your practice. <strong>I hope to speak with you soon!</strong>
</p>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`
    }
  ];

  // Upsert all templates
  let successCount = 0;
  let failCount = 0;

  for (const template of templates) {
    const success = await upsertTemplate(template);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log(`\n📊 Migration Summary:`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);

  // Verify templates
  console.log('\n🔍 Verifying email templates...');
  const { data: allTemplates, error: fetchError } = await supabase
    .from('email_templates')
    .select('name, category, send_delay_minutes, is_active')
    .eq('category', 'signup')
    .order('send_delay_minutes');

  if (fetchError) {
    console.error('❌ Error fetching templates:', fetchError);
  } else {
    console.log(`\n✅ Found ${allTemplates.length} signup templates:`);
    allTemplates.forEach(t => {
      const delay = t.send_delay_minutes === 0 ? 'immediate' :
                    t.send_delay_minutes < 60 ? `${t.send_delay_minutes}min` :
                    t.send_delay_minutes < 1440 ? `${t.send_delay_minutes / 60}hr` :
                    `${t.send_delay_minutes / 1440}day`;
      console.log(`   ${t.is_active ? '✓' : '✗'} ${t.name} (${delay})`);
    });
  }

  console.log('\n🎉 Migration complete!');
  console.log('📱 Visit http://localhost:3000/admin/email-templates to manage your templates\n');
}

runMigration().catch(console.error);
