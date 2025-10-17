import { NextRequest, NextResponse } from 'next/server';
import formData from 'form-data';
import Mailgun from 'mailgun.js';
import { createClient } from '@/lib/supabase-server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { email, firstName, lastName } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Fetch template from database
    const adminClient = createSupabaseAdminClient();
    const { data: template, error: templateError } = await adminClient
      .from('email_templates')
      .select('*')
      .eq('name', 'transformation_payment_link')
      .single();

    if (templateError || !template) {
      console.error('Error fetching template:', templateError);
      return NextResponse.json(
        { error: 'Email template not found. Please run the database migration.' },
        { status: 500 }
      );
    }

    // Replace template variables
    const replaceVariables = (text: string) => {
      return text
        .replace(/\$\{firstName\}/g, firstName || '')
        .replace(/\$\{lastName\}/g, lastName || '')
        .replace(/\$\{email\}/g, email);
    };

    const subject = replaceVariables(template.subject);
    const textContent = template.body_text ? replaceVariables(template.body_text) : '';
    const htmlContent = template.body_html ? replaceVariables(template.body_html) : '';

    const checkoutUrl = 'https://behaviorschool.com/transformation-program/checkout';

    const messageData = {
      from: `Behavior School <${process.env.MAILGUN_FROM_EMAIL}>`,
      to: email,
      subject: subject,
      text: textContent,
      html: htmlContent,
    };

    const result = await mg.messages.create(
      process.env.MAILGUN_DOMAIN || '',
      messageData
    );

    console.log('Payment link email sent:', result);

    // Log the email send in database
    const { error: logError } = await adminClient
      .from('email_logs')
      .insert({
        template_id: template.id,
        template_name: template.name,
        recipient_email: email,
        recipient_name: firstName && lastName ? `${firstName} ${lastName}` : firstName || email,
        subject: subject,
        status: 'sent',
        sent_by: session.user.id,
        mailgun_id: result.id,
        metadata: {
          firstName,
          lastName,
          checkoutUrl
        }
      });

    if (logError) {
      console.error('Error logging email send:', logError);
      // Don't fail the request if logging fails
    }

    return NextResponse.json({
      success: true,
      message: 'Payment link sent successfully',
    });
  } catch (error) {
    console.error('Error sending payment link email:', error);

    // Log the failure
    try {
      const supabase = await createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const adminClient = createSupabaseAdminClient();
      const { email: recipientEmail } = await request.json();

      await adminClient
        .from('email_logs')
        .insert({
          template_name: 'transformation_payment_link',
          recipient_email: recipientEmail,
          subject: '🎉 Your Payment Link for the Transformation Program',
          status: 'failed',
          error_message: error instanceof Error ? error.message : 'Unknown error',
          sent_by: session?.user?.id || null
        });
    } catch (logError) {
      console.error('Error logging email failure:', logError);
    }

    return NextResponse.json(
      { error: 'Failed to send payment link email' },
      { status: 500 }
    );
  }
}
