export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import formData from 'form-data';
import Mailgun from 'mailgun.js';
import { verifyAdminSession } from '@/lib/admin-auth';
import { api, getConvexClient } from '@/lib/convex';


export async function POST(request: NextRequest) {
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({ username: "api", key: process.env.MAILGUN_API_KEY || "" });
  let recipientEmail = '';
  let firstName = '';
  let lastName = '';
  const checkoutUrl = 'https://behaviorschool.com/transformation-program/checkout';

  try {
    const admin = await verifyAdminSession();

    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    recipientEmail = body.email;
    firstName = body.firstName || '';
    lastName = body.lastName || '';

    if (!recipientEmail) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const client = getConvexClient();
    await client.mutation(api.email.ensureDefaultTemplates, {});
    const template = await client.query(api.email.getTemplateByName, {
      name: 'transformation_payment_link',
    });

    if (!template) {
      return NextResponse.json(
        { error: 'Email template not found.' },
        { status: 500 }
      );
    }

    const checkoutPassword = await client.query(api.checkoutAccess.getPassword, {});

    if (!checkoutPassword) {
      return NextResponse.json(
        { error: 'Checkout password is not configured.' },
        { status: 500 }
      );
    }

    // Replace template variables
    const replaceVariables = (text: string) => {
      return text
        .replace(/\$\{firstName\}/g, firstName || '')
        .replace(/\$\{lastName\}/g, lastName || '')
        .replace(/\$\{email\}/g, recipientEmail)
        .replace(/\$\{password\}/g, checkoutPassword);
    };

    const subject = replaceVariables(template.subject);
    const textContent = template.bodyText ? replaceVariables(template.bodyText) : '';
    const htmlContent = template.bodyHtml ? replaceVariables(template.bodyHtml) : '';

    const messageData = {
      from: `Behavior School <${process.env.MAILGUN_FROM_EMAIL}>`,
      to: recipientEmail,
      subject: subject,
      text: textContent,
      html: htmlContent,
    };

    const result = await mg.messages.create(
      process.env.MAILGUN_DOMAIN || '',
      messageData
    );

    console.log('Payment link email sent:', result);

    await client.mutation(api.email.logEmail, {
      templateId: template._id,
      templateName: template.name,
      recipientEmail,
      recipientName: firstName && lastName ? `${firstName} ${lastName}` : firstName || recipientEmail,
      subject,
      status: 'sent',
      sentBy: admin.id,
      mailgunId: result.id,
      metadata: {
        firstName,
        lastName,
        checkoutUrl,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Payment link sent successfully',
    });
  } catch (error) {
    console.error('Error sending payment link email:', error);

    try {
      const admin = await verifyAdminSession();
      if (recipientEmail) {
        await getConvexClient().mutation(api.email.logEmail, {
          templateName: 'transformation_payment_link',
          recipientEmail,
          recipientName: firstName && lastName ? `${firstName} ${lastName}` : firstName || recipientEmail,
          subject: 'Your Transformation Program payment link',
          status: 'failed',
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          sentBy: admin?.id,
          metadata: {
            firstName,
            lastName,
            checkoutUrl,
          },
        });
      }
    } catch (logError) {
      console.error('Error logging email failure:', logError);
    }

    return NextResponse.json(
      { error: 'Failed to send payment link email' },
      { status: 500 }
    );
  }
}
