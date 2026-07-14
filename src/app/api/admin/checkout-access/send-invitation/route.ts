import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  // Dynamic imports to avoid build-time issues
  const formData = (await import('form-data')).default;
  const Mailgun = (await import('mailgun.js')).default;
  
  try {
    // Check environment variables first
    if (!process.env.MAILGUN_API_KEY) {
      return NextResponse.json(
        { error: 'MAILGUN_API_KEY is not configured. Please add it to Netlify environment variables.' },
        { status: 500 }
      );
    }

    if (!process.env.MAILGUN_DOMAIN) {
      return NextResponse.json(
        { error: 'MAILGUN_DOMAIN is not configured. Please add it to Netlify environment variables.' },
        { status: 500 }
      );
    }

    if (!process.env.MAILGUN_FROM_EMAIL) {
      return NextResponse.json(
        { error: 'MAILGUN_FROM_EMAIL is not configured. Please add it to Netlify environment variables (e.g., support@robspain.com).' },
        { status: 500 }
      );
    }

    // Initialize Mailgun client inside handler (not at module level)
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({
      username: 'api',
      key: process.env.MAILGUN_API_KEY,
    });

    const { email, first_name, last_name } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const checkoutUrl = 'https://behaviorschool.com/transformation-program/checkout';

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Checkout Access is Ready</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; border-radius: 16px 16px 0 0; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                Checkout access is ready
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; color: #334155; font-size: 16px; line-height: 1.6;">
                Hi ${first_name || 'there'},
              </p>

              <p style="margin: 0 0 20px; color: #334155; font-size: 16px; line-height: 1.6;">
                Your checkout access for the School BCBA Transformation Program is ready.
              </p>

              <p style="margin: 0 0 30px; color: #334155; font-size: 16px; line-height: 1.6;">
                Use the button below when you are ready to complete enrollment.
              </p>

              <!-- CTA Button -->
              <table role="presentation" style="margin: 0 auto;">
                <tr>
                  <td style="border-radius: 8px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);">
                    <a href="${checkoutUrl}" style="display: inline-block; padding: 16px 48px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 18px;">
                      Open checkout
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 20px; color: #64748b; font-size: 14px; line-height: 1.6; padding: 20px; background-color: #f1f5f9; border-radius: 8px; border-left: 4px solid #10b981;">
                <strong style="color: #334155;">Important:</strong> Enter this email address on the checkout page: <strong>${email}</strong>.
              </p>

              <div style="margin: 30px 0; padding: 20px; background-color: #ecfdf5; border-radius: 8px; border: 1px solid #d1fae5;">
                <h3 style="margin: 0 0 10px; color: #059669; font-size: 18px;">What happens next</h3>
                <ul style="margin: 0; padding-left: 20px; color: #334155; font-size: 14px; line-height: 1.8;">
                  <li>Open the checkout page</li>
                  <li>Enter your email to verify access</li>
                  <li>Complete payment through Stripe</li>
                  <li>Watch for the next email with program access details</li>
                </ul>
              </div>

              <p style="margin: 30px 0 0; color: #334155; font-size: 16px; line-height: 1.6;">
                If anything does not work at checkout, reply to this email and I will help.
              </p>

              <p style="margin: 20px 0 0; color: #334155; font-size: 16px; line-height: 1.6;">
                Rob Spain, BCBA<br>
                <strong>Behavior School</strong>
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
                © ${new Date().getFullYear()} Behavior School. All rights reserved.
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
                <a href="${checkoutUrl}" style="color: #10b981; text-decoration: none; word-break: break-all;">${checkoutUrl}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const textContent = `
Hi ${first_name || 'there'},

Your checkout access for the School BCBA Transformation Program is ready.

Access your checkout page here:
${checkoutUrl}

Enter this email address on the checkout page: ${email}

What happens next:
- Open the checkout page
- Enter your email to verify access
- Complete payment through Stripe
- Watch for the next email with program access details

If anything does not work at checkout, reply to this email and I will help.

Rob Spain, BCBA
Behavior School

---
Questions? Reply to this email or visit behaviorschool.com
    `;

    const messageData = {
      from: `Behavior School <${process.env.MAILGUN_FROM_EMAIL}>`,
      to: email,
      subject: 'Your School BCBA program checkout access is ready',
      text: textContent,
      html: htmlContent,
    };

    const result = await mg.messages.create(
      process.env.MAILGUN_DOMAIN || '',
      messageData
    );

    console.log('Invitation email sent:', result);

    return NextResponse.json({
      success: true,
      message: 'Invitation email sent successfully',
    });
  } catch (error) {
    console.error('Error sending invitation email:', error);
    
    // Provide more detailed error message
    let errorMessage = 'Failed to send invitation email';
    if (error instanceof Error) {
      errorMessage += ': ' + error.message;
    }
    
    // Check for common Mailgun errors
    if (error && typeof error === 'object' && 'status' in error) {
      const mgError = error as { status?: number; message?: string };
      if (mgError.status === 401) {
        errorMessage = 'Mailgun authentication failed. Please check MAILGUN_API_KEY in environment variables.';
      } else if (mgError.status === 404) {
        errorMessage = 'Mailgun domain not found. Please check MAILGUN_DOMAIN in environment variables.';
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? error.message : 'Unknown error',
        hint: 'Check Netlify environment variables: MAILGUN_API_KEY, MAILGUN_DOMAIN, MAILGUN_FROM_EMAIL'
      },
      { status: 500 }
    );
  }
}
