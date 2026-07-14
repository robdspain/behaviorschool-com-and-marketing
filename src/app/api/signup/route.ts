export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { api, getConvexClient } from '@/lib/convex';

// Rate limiting: track IPs and timestamps
const submissionTracker = new Map<string, number>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, role, currentChallenges, website } = body;

    // SPAM PROTECTION 1: Honeypot field check
    // If the "website" field is filled (invisible to humans), it's a bot
    if (website) {
      console.log('🚫 Spam blocked: Honeypot field filled');
      return NextResponse.json(
        { message: 'Application submitted successfully' }, // Fake success to fool bots
        { status: 200 }
      );
    }

    // SPAM PROTECTION 2: Rate limiting (1 submission per IP per 5 minutes)
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const now = Date.now();
    const lastSubmission = submissionTracker.get(ip);
    
    if (lastSubmission && (now - lastSubmission) < 5 * 60 * 1000) {
      const waitMinutes = Math.ceil((5 * 60 * 1000 - (now - lastSubmission)) / 60000);
      console.log(`🚫 Rate limit: IP ${ip} tried to submit again after ${(now - lastSubmission) / 1000}s`);
      return NextResponse.json(
        { message: `Please wait ${waitMinutes} minute(s) before submitting again.` },
        { status: 429 }
      );
    }

    // Validate required fields
    if (!firstName || !lastName || !email || !role) {
      return NextResponse.json(
        { message: 'Please fill in all required fields' },
        { status: 400 }
      );
    }

    // SPAM PROTECTION 3: Email validation (enhanced)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Block suspicious email patterns (common spam indicators)
    const suspiciousPatterns = [
      /^[a-z]\.[a-z]{2,}\.[a-z]{2,}\.[a-z]{2,}\.\d+@/i, // o.j.a.s.kal.e.123.4@
      /^[a-z]{2,}\.[a-z]{2,}\.[a-z]{2,}\.\d+@/i, // mo.xada.m.u.l.6.24@
      /\d{3,}@/i, // napafagova846@
      /@(test|spam|fake|temp|disposable)\./i
    ];

    if (suspiciousPatterns.some(pattern => pattern.test(email))) {
      console.log(`🚫 Spam blocked: Suspicious email pattern: ${email}`);
      return NextResponse.json(
        { message: 'Application submitted successfully' }, // Fake success
        { status: 200 }
      );
    }

    // Block if first/last name contains random gibberish (>15 chars of random letters)
    const gibberishPattern = /^[A-Za-z]{15,}$/;
    if (gibberishPattern.test(firstName) || gibberishPattern.test(lastName)) {
      console.log(`🚫 Spam blocked: Gibberish name: ${firstName} ${lastName}`);
      return NextResponse.json(
        { message: 'Application submitted successfully' }, // Fake success
        { status: 200 }
      );
    }

    // Record this IP submission
    submissionTracker.set(ip, now);

    const convex = getConvexClient();
    const submittedAt = new Date().toISOString();

    try {
      await convex.mutation(api.submissions.createSignupSubmission, {
        firstName,
        lastName,
        email,
        phone: phone || undefined,
        organization: 'Not collected',
        role,
        currentChallenges: currentChallenges || undefined,
        status: 'new',
        submittedAt,
      });
    } catch (signupError) {
      console.error('Convex signup submission error:', signupError);
      return NextResponse.json(
        { message: 'Failed to save application. Please try again.' },
        { status: 500 }
      );
    }

    const emailTemplates = await convex.query(api.email.listTemplates, {
      category: 'signup',
      activeOnly: true,
      showArchived: false,
    });
    const adminTemplate = await convex.query(api.email.getTemplateByName, {
      name: 'signup_admin_notification',
    });

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
      submittedAt: new Date(submittedAt).toLocaleString(),
    };

    // Function to replace placeholders in template
    const renderTemplate = (template: string, data: Record<string, string>) => {
      let rendered = template;
      for (const key in data) {
        rendered = rendered.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), data[key]);
      }
      return rendered;
    };

    const logEmailSafe = async (args: {
      templateId?: string;
      templateName?: string;
      recipientEmail: string;
      recipientName?: string;
      subject: string;
      status: string;
      mailgunId?: string;
      errorMessage?: string;
      metadata?: Record<string, unknown>;
    }) => {
      try {
        await convex.mutation(api.email.logEmail, args);
      } catch (logError) {
        console.error('Error logging email send:', logError);
      }
    };

    // Log signup notification for immediate visibility
    console.log('NEW SIGNUP NOTIFICATION:', {
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
      const adminEmailText = adminTemplate.bodyText ? renderTemplate(adminTemplate.bodyText, templateData) : '';
      const adminEmailHtml = adminTemplate.bodyHtml ? renderTemplate(adminTemplate.bodyHtml, templateData) : '';

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
        await logEmailSafe({
          templateId: adminTemplate._id,
          templateName: adminTemplate.name,
          recipientEmail: process.env.NOTIFICATION_EMAIL || 'admin@behaviorschool.com',
          subject: adminEmailSubject,
          status: 'failed',
          errorMessage: errorText,
          metadata: { source: 'signup_admin_notification', signupEmail: email },
        });
      } else {
        const resultText = await mailgunResponse.text();
        let mailgunId: string | undefined;
        try {
          mailgunId = JSON.parse(resultText).id;
        } catch {}
        await logEmailSafe({
          templateId: adminTemplate._id,
          templateName: adminTemplate.name,
          recipientEmail: process.env.NOTIFICATION_EMAIL || 'admin@behaviorschool.com',
          subject: adminEmailSubject,
          status: 'sent',
          mailgunId,
          metadata: { source: 'signup_admin_notification', signupEmail: email },
        });
      }
    }

    // Send all emails from database templates
    if (process.env.MAILGUN_DOMAIN && process.env.MAILGUN_API_KEY && emailTemplates) {
      for (const template of emailTemplates) {
        const deliveryTime = template.sendDelayMinutes === 0
          ? new Date()
          : new Date(Date.now() + template.sendDelayMinutes * 60 * 1000);
        const rfc2822Time = deliveryTime.toUTCString();

        const emailSubject = renderTemplate(template.subject, templateData);
        const emailText = template.bodyText ? renderTemplate(template.bodyText, templateData) : '';
        const emailHtml = template.bodyHtml ? renderTemplate(template.bodyHtml, templateData) : '';

        const emailParams: Record<string, string> = {
          from: `Rob Spain - Behavior School <robspain@${process.env.MAILGUN_DOMAIN}>`,
          to: email,
          subject: emailSubject,
          text: emailText,
          html: emailHtml,
        };

        // Only add deliverytime if it's not immediate
        if (template.sendDelayMinutes > 0) {
          emailParams['o:deliverytime'] = rfc2822Time;
        }

        const emailResponse = await fetch(`https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${Buffer.from(`api:${process.env.MAILGUN_API_KEY}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams(emailParams),
        });

        if (!emailResponse.ok) {
          const errorText = await emailResponse.text();
          console.error(`Mailgun error for template ${template.name}:`, {
            status: emailResponse.status,
            error: errorText,
            scheduledFor: template.sendDelayMinutes > 0 ? rfc2822Time : 'immediate'
          });
          await logEmailSafe({
            templateId: template._id,
            templateName: template.name,
            recipientEmail: email,
            recipientName: `${firstName} ${lastName}`,
            subject: emailSubject,
            status: 'failed',
            errorMessage: errorText,
            metadata: {
              source: 'signup_sequence',
              scheduledFor: template.sendDelayMinutes > 0 ? rfc2822Time : 'immediate',
            },
          });
        } else {
          const resultText = await emailResponse.text();
          let mailgunId: string | undefined;
          try {
            mailgunId = JSON.parse(resultText).id;
          } catch {}
          await logEmailSafe({
            templateId: template._id,
            templateName: template.name,
            recipientEmail: email,
            recipientName: `${firstName} ${lastName}`,
            subject: emailSubject,
            status: 'sent',
            mailgunId,
            metadata: {
              source: 'signup_sequence',
              scheduledFor: template.sendDelayMinutes > 0 ? rfc2822Time : 'immediate',
            },
          });
          console.log(`Email sent: ${template.name} (delay: ${template.sendDelayMinutes} min)`);
        }
      }
    }

    // Keep legacy hardcoded immediate confirmation as fallback
    if (process.env.MAILGUN_DOMAIN && process.env.MAILGUN_API_KEY && (!emailTemplates || emailTemplates.length === 0)) {
      const confirmSubject = `${firstName}, I received your application`;
      const confirmText = `Hi ${firstName},

Thanks for applying to the School BCBA Transformation System. I received your application and will review it.

NEXT STEP: Schedule your consultation call

You should see a booking calendar on your screen right now. If you haven't already, pick a time that works best for you:
https://calendly.com/robspain/behavior-school-transformation-system-phone-call

What to expect on the call:
→ We'll discuss your specific challenges and goals
→ We will talk through whether the program is a fit
→ You can ask questions before making any decision

This is a 15-minute conversation to make sure the program fits what you need.

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
              <p style="margin: 0 0 20px; font-size: 16px; color: #334155;">Thanks for applying to the <strong>School BCBA Transformation System</strong>. I received your application and will review it.</p>
              <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 16px; margin: 24px 0;">
                <p style="margin: 0; font-size: 16px; color: #166534; font-weight: 600;">NEXT STEP: Schedule your consultation call</p>
              </div>
              <p style="margin: 0 0 20px; font-size: 16px; color: #334155;">You should see a booking calendar on your screen right now. If you haven't already, pick a time that works best for you:</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
                <tr>
                  <td align="center">
                    <a href="https://calendly.com/robspain/behavior-school-transformation-system-phone-call" style="display: inline-block; padding: 16px 32px; background-color: #10b981; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Schedule Your Call</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 20px 0 10px; font-size: 16px; color: #334155; font-weight: 600;">What to expect on the call:</p>
              <ul style="margin: 0 0 20px; padding-left: 20px; color: #334155;">
                <li style="margin-bottom: 8px;">We'll discuss your specific challenges and goals</li>
                <li style="margin-bottom: 8px;">We will talk through whether the program is a fit</li>
                <li style="margin-bottom: 8px;">You can ask questions before making any decision</li>
              </ul>
              <p style="margin: 20px 0 0; font-size: 14px; color: #64748b;"><em>This is a 15-minute conversation to make sure the program fits what you need.</em></p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 40px;">
              <div style="border-top: 1px solid #e2e8f0; padding-top: 24px;">
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
        await logEmailSafe({
          templateName: 'legacy_signup_immediate_confirmation',
          recipientEmail: email,
          recipientName: `${firstName} ${lastName}`,
          subject: confirmSubject,
          status: 'failed',
          errorMessage: errorText,
          metadata: { source: 'legacy_signup_fallback' },
        });
      } else {
        const resultText = await immediateConfirmation.text();
        let mailgunId: string | undefined;
        try {
          mailgunId = JSON.parse(resultText).id;
        } catch {}
        await logEmailSafe({
          templateName: 'legacy_signup_immediate_confirmation',
          recipientEmail: email,
          recipientName: `${firstName} ${lastName}`,
          subject: confirmSubject,
          status: 'sent',
          mailgunId,
          metadata: { source: 'legacy_signup_fallback' },
        });
        console.log('Immediate confirmation email sent to:', email);
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
      const followUpSubject = `${firstName}, next step for your School BCBA application`;
      const followUpText = `Hi ${firstName},

I just saw your application for the School BCBA Transformation System come through.

The next useful step is a short fit call. We can talk through what is hard right now, what you want to change, and whether the program is the right tool for that.

If you haven't booked yet, choose a time here:
→ Understand your specific challenges and goals
→ Talk through what support would actually help
→ Answer questions before you decide

If you haven't already scheduled, book a time that works for you here:
https://calendly.com/robspain/behavior-school-transformation-system-phone-call

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

              <p style="margin: 0 0 20px; font-size: 16px; color: #334155;">I just saw your application for the <strong>School BCBA Transformation System</strong> come through.</p>

              <p style="margin: 0 0 20px; font-size: 16px; color: #334155;">The next useful step is a short fit call. We can talk through what is hard right now, what you want to change, and whether the program is the right tool for that.</p>

              <p style="margin: 0 0 10px; font-size: 16px; color: #334155;">If you haven't booked yet, choose a time here:</p>

              <ul style="margin: 0 0 24px; padding-left: 20px; color: #334155;">
                <li style="margin-bottom: 8px; font-size: 16px;">Understand your specific challenges and goals</li>
                <li style="margin-bottom: 8px; font-size: 16px;">Talk through what support would actually help</li>
                <li style="margin-bottom: 8px; font-size: 16px;">Answer questions before you decide</li>
              </ul>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0;">
                <tr>
                  <td align="center">
                    <a href="https://calendly.com/robspain/behavior-school-transformation-system-phone-call" style="display: inline-block; padding: 16px 32px; background-color: #10b981; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Book Your Call Now</a>
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 0; font-size: 14px; color: #64748b; text-align: center;"><em>If none of the times work, reply and tell me what your schedule looks like.</em></p>
            </td>
          </tr>

          <!-- Signature -->
          <tr>
            <td style="padding: 0 40px 40px;">
              <div style="border-top: 1px solid #e2e8f0; padding-top: 24px;">
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
        await logEmailSafe({
          templateName: 'legacy_signup_10_minute_follow_up',
          recipientEmail: email,
          recipientName: `${firstName} ${lastName}`,
          subject: followUpSubject,
          status: 'failed',
          errorMessage: errorText,
          metadata: { source: 'legacy_signup_fallback', scheduledFor: rfc2822Time },
        });
      } else {
        const resultText = await followUpResponse.text();
        let mailgunId: string | undefined;
        try {
          mailgunId = JSON.parse(resultText).id;
        } catch {}
        await logEmailSafe({
          templateName: 'legacy_signup_10_minute_follow_up',
          recipientEmail: email,
          recipientName: `${firstName} ${lastName}`,
          subject: followUpSubject,
          status: 'sent',
          mailgunId,
          metadata: { source: 'legacy_signup_fallback', scheduledFor: rfc2822Time },
        });
        console.log('Follow-up email scheduled for:', rfc2822Time, `(10 minutes from now for ${email})`);
      }
    }

    // Schedule 24-hour reminder email
    if (process.env.MAILGUN_DOMAIN && process.env.MAILGUN_API_KEY) {
      const delivery24h = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const rfc24h = delivery24h.toUTCString();

      const reminder24Subject = `${firstName}, did you want to talk through the program?`;
      const reminder24Text = `Hi ${firstName},

I wanted to follow up on your School BCBA Transformation System application.

I did not see a fit call scheduled yet. No problem if now is not the right time.

If you do want to talk it through, the call is 15 minutes. We can look at what you are trying to change and whether the program makes sense.

Book your call here:
https://calendly.com/robspain/behavior-school-transformation-system-phone-call

If you have a question before booking, reply here.

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
              <p style="margin: 0 0 20px; font-size: 16px; color: #334155;">I wanted to follow up on your School BCBA Transformation System application.</p>
              <p style="margin: 0 0 20px; font-size: 16px; color: #334155;">I did not see a fit call scheduled yet. No problem if now is not the right time.</p>
              <p style="margin: 0 0 20px; font-size: 16px; color: #334155;">If you do want to talk it through, the call is 15 minutes. We can look at what you are trying to change and whether the program makes sense.</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0;">
                <tr>
                  <td align="center">
                    <a href="https://calendly.com/robspain/behavior-school-transformation-system-phone-call" style="display: inline-block; padding: 16px 32px; background-color: #10b981; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Book Your 15-Minute Call</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 20px 0 0; font-size: 14px; color: #64748b; text-align: center;"><em>If you have a question before booking, reply here.</em></p>
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

      const reminder24Response = await fetch(`https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`, {
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

      if (!reminder24Response.ok) {
        const errorText = await reminder24Response.text();
        await logEmailSafe({
          templateName: 'legacy_signup_24_hour_reminder',
          recipientEmail: email,
          recipientName: `${firstName} ${lastName}`,
          subject: reminder24Subject,
          status: 'failed',
          errorMessage: errorText,
          metadata: { source: 'legacy_signup_fallback', scheduledFor: rfc24h },
        });
      } else {
        const resultText = await reminder24Response.text();
        let mailgunId: string | undefined;
        try {
          mailgunId = JSON.parse(resultText).id;
        } catch {}
        await logEmailSafe({
          templateName: 'legacy_signup_24_hour_reminder',
          recipientEmail: email,
          recipientName: `${firstName} ${lastName}`,
          subject: reminder24Subject,
          status: 'sent',
          mailgunId,
          metadata: { source: 'legacy_signup_fallback', scheduledFor: rfc24h },
        });
      }

      console.log('24-hour reminder scheduled for:', rfc24h);
    }

    // Schedule 48-hour systems follow-up email
    if (process.env.MAILGUN_DOMAIN && process.env.MAILGUN_API_KEY) {
      const delivery48h = new Date(Date.now() + 48 * 60 * 60 * 1000);
      const rfc48h = delivery48h.toUTCString();

      const systems48Subject = `${firstName}, thinking about systems after your application`;
      const caseStudy48Text = `Hi ${firstName},

I wanted to follow up with one more thought after your School BCBA Transformation System application.

The program is built around a practical question:

What systems would make your school-based BCBA role more sustainable and easier to explain to teachers and administrators?

That includes things like FBA/BIP workflows, consultation routines, documentation habits, and ways to decide what needs your attention first.

If you want to see whether this would fit your role, book a 15-minute call:
https://calendly.com/robspain/behavior-school-transformation-system-phone-call

We can talk through what is hard right now, what you need, and whether the program is actually a fit.

Rob Spain
Creator, School BCBA Transformation System

P.S. If you have a question before booking, you can reply to this email.`;

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
              <p style="margin: 0 0 20px; font-size: 16px; color: #334155;">I wanted to follow up with one more thought after your School BCBA Transformation System application.</p>
              <p style="margin: 0 0 10px; font-size: 16px; color: #334155;">The program is built around a practical question: what systems would make your school-based BCBA role more sustainable and easier to explain to teachers and administrators?</p>
              <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 24px 0;">
                <p style="margin: 0 0 12px; font-size: 16px; color: #166534; font-weight: 600;">That includes things like:</p>
                <ul style="margin: 0; padding-left: 20px; color: #166534;">
                  <li style="margin-bottom: 8px;">FBA/BIP workflows</li>
                  <li style="margin-bottom: 8px;">Consultation routines</li>
                  <li style="margin-bottom: 8px;">Documentation habits</li>
                  <li>Ways to decide what needs your attention first</li>
                </ul>
              </div>
              <p style="margin: 0 0 20px; font-size: 16px; color: #334155;">If you want to see whether this would fit your role, book a 15-minute call:</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
                <tr>
                  <td align="center">
                    <a href="https://calendly.com/robspain/behavior-school-transformation-system-phone-call" style="display: inline-block; padding: 16px 32px; background-color: #10b981; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Book Your Call (15 Minutes)</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 20px 0 0; font-size: 14px; color: #64748b; text-align: center;"><em>We can talk through what is hard right now, what you need, and whether the program is actually a fit.</em></p>
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0;">
                <p style="margin: 0; font-size: 14px; color: #92400e;"><strong>P.S.</strong> If you have a question before booking, you can reply to this email.</p>
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

      const caseStudy48Response = await fetch(`https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`api:${process.env.MAILGUN_API_KEY}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          from: `Rob Spain - Behavior School <robspain@${process.env.MAILGUN_DOMAIN}>`,
          to: email,
          subject: systems48Subject,
          text: caseStudy48Text,
          html: caseStudy48Html,
          'o:deliverytime': rfc48h,
        }),
      });

      if (!caseStudy48Response.ok) {
        const errorText = await caseStudy48Response.text();
        await logEmailSafe({
          templateName: 'legacy_signup_48_hour_systems_email',
          recipientEmail: email,
          recipientName: `${firstName} ${lastName}`,
          subject: systems48Subject,
          status: 'failed',
          errorMessage: errorText,
          metadata: { source: 'legacy_signup_fallback', scheduledFor: rfc48h },
        });
      } else {
        const resultText = await caseStudy48Response.text();
        let mailgunId: string | undefined;
        try {
          mailgunId = JSON.parse(resultText).id;
        } catch {}
        await logEmailSafe({
          templateName: 'legacy_signup_48_hour_systems_email',
          recipientEmail: email,
          recipientName: `${firstName} ${lastName}`,
          subject: systems48Subject,
          status: 'sent',
          mailgunId,
          metadata: { source: 'legacy_signup_fallback', scheduledFor: rfc48h },
        });
      }

      console.log('48-hour systems email scheduled for:', rfc48h);
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
