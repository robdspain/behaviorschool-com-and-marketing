import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    // Use Supabase admin client so RLS can remain strict on public tables
    const supabase = createSupabaseAdminClient();
    const body = await request.json();
    const { firstName, lastName, email, phone, role, currentChallenges } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !role) {
      return NextResponse.json(
        { message: 'Please fill in all required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Store in Supabase
    const { error: signupError } = await supabase
      .from('signup_submissions')
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phone || null,
          organization: 'Not collected',
          role: role,
          caseload_size: null,
          current_challenges: currentChallenges || null,
          status: 'new',
          submitted_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (signupError) {
      console.error('Supabase error:', signupError);
      return NextResponse.json(
        { message: 'Failed to save application. Please try again.' },
        { status: 500 }
      );
    }

    // Fetch email templates
    const { data: adminTemplate, error: adminTemplateError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('name', 'signup_admin_notification')
      .single();

    const { data: userTemplate, error: userTemplateError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('name', 'signup_confirmation')
      .single();

    if (adminTemplateError || userTemplateError) {
      console.error('Error fetching email templates:', adminTemplateError || userTemplateError);
      // Proceed without sending emails if templates are not found, or handle as an error
    }

    // Prepare data for templates
    const templateData = {
      firstName,
      lastName,
      email,
      phone: phone || 'Not provided',
      organization: 'Not collected',
      role,
      caseloadSize: 'Not collected',
      currentChallenges: currentChallenges || 'Not provided',
      submittedAt: new Date().toLocaleString(),
    };

    // Function to replace placeholders in template
    const renderTemplate = (template: string, data: Record<string, string>) => {
      let rendered = template;
      for (const key in data) {
        rendered = rendered.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), data[key]);
      }
      return rendered;
    };

    // Log signup notification for immediate visibility
    console.log('🎯 NEW SIGNUP NOTIFICATION:', {
      name: `${firstName} ${lastName}`,
      email: email,
      phone: phone || 'Not provided',
      role: role,
      challenges: currentChallenges,
      timestamp: new Date().toLocaleString(),
      actionRequired: phone ? '📞 CALL PREFERRED - Phone provided!' : 'Follow up within 24 hours!'
    });

    // Send admin notification email (if configured and template found)
    if (process.env.MAILGUN_DOMAIN && process.env.MAILGUN_API_KEY && adminTemplate) {
      const adminEmailSubject = renderTemplate(adminTemplate.subject, templateData);
      const adminEmailText = adminTemplate.body_text ? renderTemplate(adminTemplate.body_text, templateData) : '';
      const adminEmailHtml = adminTemplate.body_html ? renderTemplate(adminTemplate.body_html, templateData) : '';

      const mailgunResponse = await fetch(`https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`api:${process.env.MAILGUN_API_KEY}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          from: `Behavior School <noreply@${process.env.MAILGUN_DOMAIN}>`,
          to: process.env.NOTIFICATION_EMAIL || 'admin@behaviorschool.com',
          subject: adminEmailSubject,
          text: adminEmailText,
          html: adminEmailHtml,
        }),
      });

      if (!mailgunResponse.ok) {
        const errorText = await mailgunResponse.text();
        console.error('Mailgun admin email error:', {
          status: mailgunResponse.status,
          statusText: mailgunResponse.statusText,
          error: errorText
        });
      }
    }

    // Send immediate confirmation email to applicant
    if (process.env.MAILGUN_DOMAIN && process.env.MAILGUN_API_KEY) {
      const confirmSubject = `${firstName}, your application has been received!`;
      const confirmText = `Hi ${firstName},

Thanks for applying to the School BCBA Transformation System! Your application has been received and we're excited to learn more about your goals.

🎯 NEXT STEP: Schedule your consultation call

You should see a booking calendar on your screen right now. If you haven't already, pick a time that works best for you:
https://calendly.com/robspain/behavior-school-transformation-system-phone-call

What to expect on the call:
→ We'll discuss your specific challenges and goals
→ You'll see exactly how the system can help you
→ Get all your questions answered (no pressure!)

This will be a 15-minute conversation to make sure we're a great fit for each other.

Looking forward to connecting,
Rob Spain
Creator, School BCBA Transformation System
Behavior School`;

      const confirmHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 3px solid #10b981;">
              <h1 style="margin: 0; font-size: 24px; color: #0f172a; font-weight: 700;">Behavior School</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; font-size: 18px; color: #0f172a;">Hi ${firstName},</p>
              <p style="margin: 0 0 20px; font-size: 16px; color: #334155;">Thanks for applying to the <strong>School BCBA Transformation System</strong>! Your application has been received and we're excited to learn more about your goals.</p>
              <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 16px; margin: 24px 0;">
                <p style="margin: 0; font-size: 16px; color: #166534; font-weight: 600;">🎯 NEXT STEP: Schedule your consultation call</p>
              </div>
              <p style="margin: 0 0 20px; font-size: 16px; color: #334155;">You should see a booking calendar on your screen right now. If you haven't already, pick a time that works best for you:</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
                <tr>
                  <td align="center">
                    <a href="https://calendly.com/robspain/behavior-school-transformation-system-phone-call" style="display: inline-block; padding: 16px 32px; background-color: #10b981; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">📅 Schedule Your Call</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 20px 0 10px; font-size: 16px; color: #334155; font-weight: 600;">What to expect on the call:</p>
              <ul style="margin: 0 0 20px; padding-left: 20px; color: #334155;">
                <li style="margin-bottom: 8px;">We'll discuss your specific challenges and goals</li>
                <li style="margin-bottom: 8px;">You'll see exactly how the system can help you</li>
                <li style="margin-bottom: 8px;">Get all your questions answered (no pressure!)</li>
              </ul>
              <p style="margin: 20px 0 0; font-size: 14px; color: #64748b;"><em>This will be a 15-minute conversation to make sure we're a great fit for each other.</em></p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 40px;">
              <div style="border-top: 1px solid #e2e8f0; padding-top: 24px;">
                <p style="margin: 0 0 8px; font-size: 16px; color: #0f172a; font-weight: 600;">Looking forward to connecting,</p>
                <p style="margin: 0 0 4px; font-size: 16px; color: #0f172a; font-weight: 600;">Rob Spain</p>
                <p style="margin: 0; font-size: 14px; color: #64748b;">Creator, School BCBA Transformation System<br>Behavior School</p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">Behavior School | Empowering BCBAs in Schools</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

      const immediateConfirmation = await fetch(`https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`api:${process.env.MAILGUN_API_KEY}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          from: `Rob Spain - Behavior School <robspain@${process.env.MAILGUN_DOMAIN}>`,
          to: email,
          subject: confirmSubject,
          text: confirmText,
          html: confirmHtml,
        }),
      });

      if (!immediateConfirmation.ok) {
        const errorText = await immediateConfirmation.text();
        console.error('Mailgun immediate confirmation error:', {
          status: immediateConfirmation.status,
          statusText: immediateConfirmation.statusText,
          error: errorText
        });
      } else {
        console.log('✅ Immediate confirmation email sent to:', email);
      }
    }

    // Send SMS with Calendly link if phone number provided
    if (phone && process.env.MAILGUN_DOMAIN && process.env.MAILGUN_API_KEY) {
      // Using Mailgun SMS (if configured) or we'll add Twilio later
      // For now, log that SMS should be sent
      console.log('📱 SMS should be sent to:', phone, '- Calendly link');
      // TODO: Implement Twilio SMS integration
    }

    // Schedule follow-up email for 10 minutes later with Calendly booking link
    if (process.env.MAILGUN_DOMAIN && process.env.MAILGUN_API_KEY) {
      // Calculate delivery time (10 minutes from now)
      const deliveryTime = new Date(Date.now() + 10 * 60 * 1000);
      const rfc2822Time = deliveryTime.toUTCString();

      // Personal follow-up email content
      const followUpSubject = `${firstName}, let's get your School BCBA transformation started`;
      const followUpText = `Hi ${firstName},

I just saw your application for the School BCBA Transformation System come through, and I wanted to reach out personally.

I know what it's like to feel overwhelmed by the demands of a school BCBA role—the endless FBAs, the pressure to show measurable results, and the challenge of getting buy-in from teachers and administrators. That's exactly why I created this system.

If you haven't already booked your consultation call, I'd love to jump on a quick call with you to:
→ Understand your specific challenges and goals
→ Show you exactly how the system can transform your practice
→ Answer any questions you have about the program

If you haven't already scheduled, book a time that works for you here:
https://calendly.com/robspain/behavior-school-transformation-system-phone-call

These spots fill up quickly, so grab a time while they're available.

Looking forward to connecting,
Rob Spain
Creator, School BCBA Transformation System
Behavior School`;

      const followUpHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">

          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 3px solid #10b981;">
              <h1 style="margin: 0; font-size: 24px; color: #0f172a; font-weight: 700;">Behavior School</h1>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; font-size: 18px; color: #0f172a;">Hi ${firstName},</p>

              <p style="margin: 0 0 20px; font-size: 16px; color: #334155;">I just saw your application for the <strong>School BCBA Transformation System</strong> come through, and I wanted to reach out personally.</p>

              <p style="margin: 0 0 20px; font-size: 16px; color: #334155;">I know what it's like to feel overwhelmed by the demands of a school BCBA role—the endless FBAs, the pressure to show measurable results, and the challenge of getting buy-in from teachers and administrators. <strong>That's exactly why I created this system.</strong></p>

              <p style="margin: 0 0 10px; font-size: 16px; color: #334155;">If you haven't already booked your consultation call, I'd love to jump on a quick call with you to:</p>

              <ul style="margin: 0 0 24px; padding-left: 20px; color: #334155;">
                <li style="margin-bottom: 8px; font-size: 16px;">Understand your specific challenges and goals</li>
                <li style="margin-bottom: 8px; font-size: 16px;">Show you exactly how the system can transform your practice</li>
                <li style="margin-bottom: 8px; font-size: 16px;">Answer any questions you have about the program</li>
              </ul>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0;">
                <tr>
                  <td align="center">
                    <a href="https://calendly.com/robspain/behavior-school-transformation-system-phone-call" style="display: inline-block; padding: 16px 32px; background-color: #10b981; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">📅 Book Your Call Now</a>
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 0; font-size: 14px; color: #64748b; text-align: center;"><em>If you haven't already scheduled, these spots fill up quickly, so grab a time while they're available.</em></p>
            </td>
          </tr>

          <!-- Signature -->
          <tr>
            <td style="padding: 0 40px 40px;">
              <div style="border-top: 1px solid #e2e8f0; padding-top: 24px;">
                <p style="margin: 0 0 8px; font-size: 16px; color: #0f172a; font-weight: 600;">Looking forward to connecting,</p>
                <p style="margin: 0 0 4px; font-size: 16px; color: #0f172a; font-weight: 600;">Rob Spain</p>
                <p style="margin: 0; font-size: 14px; color: #64748b;">Creator, School BCBA Transformation System<br>Behavior School</p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">
                Behavior School | Empowering BCBAs in Schools
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

      const followUpResponse = await fetch(`https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`api:${process.env.MAILGUN_API_KEY}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          from: `Rob Spain - Behavior School <robspain@${process.env.MAILGUN_DOMAIN}>`,
          to: email,
          subject: followUpSubject,
          text: followUpText,
          html: followUpHtml,
          'o:deliverytime': rfc2822Time,
        }),
      });

      if (!followUpResponse.ok) {
        const errorText = await followUpResponse.text();
        console.error('Mailgun follow-up email scheduling error:', {
          status: followUpResponse.status,
          statusText: followUpResponse.statusText,
          error: errorText,
          scheduledFor: rfc2822Time
        });
      } else {
        console.log('✅ Follow-up email scheduled for:', rfc2822Time, `(10 minutes from now for ${email})`);
      }
    }

    // Schedule 24-hour reminder email
    if (process.env.MAILGUN_DOMAIN && process.env.MAILGUN_API_KEY) {
      const delivery24h = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const rfc24h = delivery24h.toUTCString();

      const reminder24Subject = `${firstName}, did you get a chance to book your call?`;
      const reminder24Text = `Hi ${firstName},

I wanted to follow up on your application for the School BCBA Transformation System.

I noticed you haven't scheduled your consultation call yet. No worries - I know how busy school schedules can be!

I'd really love to hear about your challenges and show you how the system can help. The call is just 15 minutes and there's absolutely no pressure.

Book your call here:
https://calendly.com/robspain/behavior-school-transformation-system-phone-call

If you have any questions or concerns before booking, just hit reply to this email. I read every single one.

Talk soon,
Rob Spain
Creator, School BCBA Transformation System`;

      const reminder24Html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 3px solid #10b981;">
              <h1 style="margin: 0; font-size: 24px; color: #0f172a; font-weight: 700;">Behavior School</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; font-size: 18px; color: #0f172a;">Hi ${firstName},</p>
              <p style="margin: 0 0 20px; font-size: 16px; color: #334155;">I wanted to follow up on your application for the School BCBA Transformation System.</p>
              <p style="margin: 0 0 20px; font-size: 16px; color: #334155;">I noticed you haven't scheduled your consultation call yet. No worries - I know how busy school schedules can be!</p>
              <p style="margin: 0 0 20px; font-size: 16px; color: #334155;">I'd really love to hear about your challenges and show you how the system can help. <strong>The call is just 15 minutes and there's absolutely no pressure.</strong></p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0;">
                <tr>
                  <td align="center">
                    <a href="https://calendly.com/robspain/behavior-school-transformation-system-phone-call" style="display: inline-block; padding: 16px 32px; background-color: #10b981; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">📅 Book Your 15-Minute Call</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 20px 0 0; font-size: 14px; color: #64748b; text-align: center;"><em>If you have any questions or concerns before booking, just hit reply to this email. I read every single one.</em></p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 40px;">
              <div style="border-top: 1px solid #e2e8f0; padding-top: 24px;">
                <p style="margin: 0 0 8px; font-size: 16px; color: #0f172a; font-weight: 600;">Talk soon,</p>
                <p style="margin: 0 0 4px; font-size: 16px; color: #0f172a; font-weight: 600;">Rob Spain</p>
                <p style="margin: 0; font-size: 14px; color: #64748b;">Creator, School BCBA Transformation System</p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">Behavior School | Empowering BCBAs in Schools</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

      await fetch(`https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`api:${process.env.MAILGUN_API_KEY}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          from: `Rob Spain - Behavior School <robspain@${process.env.MAILGUN_DOMAIN}>`,
          to: email,
          subject: reminder24Subject,
          text: reminder24Text,
          html: reminder24Html,
          'o:deliverytime': rfc24h,
        }),
      });

      console.log('✅ 24-hour reminder scheduled for:', rfc24h);
    }

    // Schedule 48-hour case study email
    if (process.env.MAILGUN_DOMAIN && process.env.MAILGUN_API_KEY) {
      const delivery48h = new Date(Date.now() + 48 * 60 * 60 * 1000);
      const rfc48h = delivery48h.toUTCString();

      const caseStudy48Subject = `${firstName}, how Sarah went from overwhelmed to confident in 8 weeks`;
      const caseStudy48Text = `Hi ${firstName},

I wanted to share a quick story with you.

Sarah was a school BCBA in Oregon, drowning in FBAs and feeling like she was always playing catch-up. Teachers resisted her recommendations. Admins questioned her value. She was working 60-hour weeks and still felt behind.

8 weeks after joining the School BCBA Transformation System:

→ She built a sustainable behavior tracking system that runs itself
→ Teachers started ASKING for her support (instead of avoiding her)
→ Her district expanded her role to 3 additional schools
→ She left work at 4pm every day with everything under control

Sarah's not special. She just had the right systems.

The same systems that transformed her practice are waiting for you in our program.

If you're ready to stop feeling overwhelmed and start feeling confident, let's talk:
https://calendly.com/robspain/behavior-school-transformation-system-phone-call

Just 15 minutes. No pressure. Let's see if this is right for you.

Rob Spain
Creator, School BCBA Transformation System

P.S. Sarah told me the biggest game-changer was the "5-Minute FBA Framework." It's one of 12 systems you'll get access to. Want to hear more about it? Book your call above.`;

      const caseStudy48Html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 3px solid #10b981;">
              <h1 style="margin: 0; font-size: 24px; color: #0f172a; font-weight: 700;">Behavior School</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; font-size: 18px; color: #0f172a;">Hi ${firstName},</p>
              <p style="margin: 0 0 20px; font-size: 16px; color: #334155;">I wanted to share a quick story with you.</p>
              <p style="margin: 0 0 10px; font-size: 16px; color: #334155;"><strong>Sarah was a school BCBA in Oregon</strong>, drowning in FBAs and feeling like she was always playing catch-up. Teachers resisted her recommendations. Admins questioned her value. She was working 60-hour weeks and still felt behind.</p>
              <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 24px 0;">
                <p style="margin: 0 0 12px; font-size: 16px; color: #166534; font-weight: 600;">8 weeks after joining the School BCBA Transformation System:</p>
                <ul style="margin: 0; padding-left: 20px; color: #166534;">
                  <li style="margin-bottom: 8px;">She built a sustainable behavior tracking system that runs itself</li>
                  <li style="margin-bottom: 8px;">Teachers started ASKING for her support (instead of avoiding her)</li>
                  <li style="margin-bottom: 8px;">Her district expanded her role to 3 additional schools</li>
                  <li>She left work at 4pm every day with everything under control</li>
                </ul>
              </div>
              <p style="margin: 20px 0; font-size: 16px; color: #334155;"><strong>Sarah's not special. She just had the right systems.</strong></p>
              <p style="margin: 0 0 20px; font-size: 16px; color: #334155;">The same systems that transformed her practice are waiting for you in our program.</p>
              <p style="margin: 0 0 20px; font-size: 16px; color: #334155;">If you're ready to stop feeling overwhelmed and start feeling confident, let's talk:</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
                <tr>
                  <td align="center">
                    <a href="https://calendly.com/robspain/behavior-school-transformation-system-phone-call" style="display: inline-block; padding: 16px 32px; background-color: #10b981; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">📅 Book Your Call (15 Minutes)</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 20px 0 0; font-size: 14px; color: #64748b; text-align: center;"><em>Just 15 minutes. No pressure. Let's see if this is right for you.</em></p>
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0;">
                <p style="margin: 0; font-size: 14px; color: #92400e;"><strong>P.S.</strong> Sarah told me the biggest game-changer was the "5-Minute FBA Framework." It's one of 12 systems you'll get access to. Want to hear more about it? Book your call above.</p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 40px;">
              <div style="border-top: 1px solid #e2e8f0; padding-top: 24px;">
                <p style="margin: 0 0 4px; font-size: 16px; color: #0f172a; font-weight: 600;">Rob Spain</p>
                <p style="margin: 0; font-size: 14px; color: #64748b;">Creator, School BCBA Transformation System</p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">Behavior School | Empowering BCBAs in Schools</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

      await fetch(`https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`api:${process.env.MAILGUN_API_KEY}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          from: `Rob Spain - Behavior School <robspain@${process.env.MAILGUN_DOMAIN}>`,
          to: email,
          subject: caseStudy48Subject,
          text: caseStudy48Text,
          html: caseStudy48Html,
          'o:deliverytime': rfc48h,
        }),
      });

      console.log('✅ 48-hour case study email scheduled for:', rfc48h);
    }

    return NextResponse.json(
      { message: 'Application submitted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
