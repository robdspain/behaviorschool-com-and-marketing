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
