import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    // Lazily create the admin client at request time to avoid build-time env lookups
    const supabase = await createClient();
    const body = await request.json();
    const { firstName, lastName, email, role, currentChallenges } = body;

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
          phone: null,
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
      phone: 'Not collected',
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
        rendered = rendered.replace(new RegExp(`\$\{${key}\}`, 'g'), data[key]);
      }
      return rendered;
    };

    // Log signup notification for immediate visibility
    console.log('🎯 NEW SIGNUP NOTIFICATION:', {
      name: `${firstName} ${lastName}`,
      email: email,
      role: role,
      challenges: currentChallenges,
      timestamp: new Date().toLocaleString(),
      actionRequired: 'Follow up within 24 hours!'
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

    // Send confirmation email to applicant (if configured and template found)
    if (process.env.MAILGUN_DOMAIN && process.env.MAILGUN_API_KEY && userTemplate) {
      const userEmailSubject = renderTemplate(userTemplate.subject, templateData);
      const userEmailText = userTemplate.body_text ? renderTemplate(userTemplate.body_text, templateData) : '';
      const userEmailHtml = userTemplate.body_html ? renderTemplate(userTemplate.body_html, templateData) : '';

      const confirmationResponse = await fetch(`https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`api:${process.env.MAILGUN_API_KEY}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          from: `Behavior School <noreply@${process.env.MAILGUN_DOMAIN}>`,
          to: email,
          subject: userEmailSubject,
          text: userEmailText,
          html: userEmailHtml,
        }),
      });

      if (!confirmationResponse.ok) {
        const errorText = await confirmationResponse.text();
        console.error('Mailgun confirmation email error:', {
          status: confirmationResponse.status,
          statusText: confirmationResponse.statusText,
          error: errorText
        });
      }
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
