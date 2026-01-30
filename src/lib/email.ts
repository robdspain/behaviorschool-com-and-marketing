import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, name?: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Behavior School <[email protected]>',
      to: [email],
      subject: '🎉 Welcome to Behavior School!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">Welcome to Behavior School!</h2>
          <p>Hey${name ? ` ${name}` : ''},</p>
          <p>Thanks for subscribing to our newsletter! You'll now receive:</p>
          <ul>
            <li>✅ Weekly evidence-based ABA strategies</li>
            <li>✅ Free BCBA exam prep tips</li>
            <li>✅ IEP goal templates and behavior tools</li>
            <li>✅ Exclusive community updates</li>
          </ul>
          <div style="background: #f0fdf4; border-left: 4px solid #059669; padding: 20px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Get Started:</strong></p>
            <p style="margin: 10px 0 0 0;">
              <a href="https://behaviorschool.com/blog" style="color: #059669; text-decoration: none;">
                📚 Read Our Latest Blog Posts →
              </a>
            </p>
          </div>
          <p style="color: #666; font-size: 14px; margin-top: 40px;">
            Questions? Just reply to this email!<br><br>
            - Rob Spain, M.S., BCBA, IBA<br>
            Behavior School
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 20px;">
            You're receiving this because you subscribed at behaviorschool.com
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Email send error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email send exception:', error);
    return { success: false, error };
  }
}

export async function sendNewsletterEmail(
  emails: string[],
  subject: string,
  html: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Rob Spain <[email protected]>',
      to: emails,
      subject,
      html,
    });

    if (error) {
      console.error('Newsletter send error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Newsletter send exception:', error);
    return { success: false, error };
  }
}

export async function sendContactFormEmail(
  name: string,
  email: string,
  message: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Contact Form <[email protected]>',
      to: ['[email protected]'],
      replyTo: email,
      subject: `New Contact Form: ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          <p style="color: #666; font-size: 12px;">
            Reply directly to this email to respond to ${name}
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Contact form email error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Contact form exception:', error);
    return { success: false, error };
  }
}
