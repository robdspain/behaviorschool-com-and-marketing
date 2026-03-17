import { Resend } from 'resend';

// ============================================
// EMAIL COMPLIANCE RULES (CAN-SPAM + Gmail 2024)
// ============================================
// 1. All marketing emails MUST include List-Unsubscribe header
// 2. All emails MUST include physical mailing address
// 3. Unsubscribes MUST be honored within 10 business days
// 4. From address MUST clearly identify sender
// 5. Subject lines MUST NOT be deceptive
// ============================================

const MAILING_ADDRESS = `Behavior School LLC
8 The Green #20473
Dover, DE 19901
United States`;

const UNSUBSCRIBE_URL = 'https://behaviorschool.com/unsubscribe';
const PREFERENCES_URL = 'https://behaviorschool.com/email-preferences';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY || 'placeholder');
}

// Standard headers for ALL marketing emails (Gmail 2024 requirement)
function getComplianceHeaders(recipientEmail: string) {
  const unsubscribeUrl = `${UNSUBSCRIBE_URL}?email=${encodeURIComponent(recipientEmail)}`;
  return {
    'List-Unsubscribe': `<${unsubscribeUrl}>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
  };
}

// Standard footer for ALL marketing emails
function getEmailFooter(recipientEmail: string) {
  const unsubscribeUrl = `${UNSUBSCRIBE_URL}?email=${encodeURIComponent(recipientEmail)}`;
  const preferencesUrl = `${PREFERENCES_URL}?email=${encodeURIComponent(recipientEmail)}`;
  
  return `
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e5e5;">
      <p style="color: #666; font-size: 12px; line-height: 1.5;">
        ${MAILING_ADDRESS.replace(/\n/g, '<br>')}
      </p>
      <p style="color: #999; font-size: 11px; margin-top: 15px;">
        <a href="${preferencesUrl}" style="color: #666; text-decoration: underline;">Email Preferences</a>
        &nbsp;|&nbsp;
        <a href="${unsubscribeUrl}" style="color: #666; text-decoration: underline;">Unsubscribe</a>
      </p>
    </div>
  `;
}

// ===================
// PUBLIC EMAIL FUNCTIONS
// ===================

export async function sendWelcomeEmail(email: string, name?: string) {
  const resend = getResend();
  try {
    const { data, error } = await resend.emails.send({
      from: 'Behavior School <rob@updates.behaviorschool.com>',
      to: [email],
      replyTo: 'rob@behaviorschool.com',
      subject: 'Welcome to Behavior School!',
      headers: getComplianceHeaders(email),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">Welcome to Behavior School!</h2>
          <p>Hey${name ? ` ${name}` : ''},</p>
          <p>Thanks for subscribing to our newsletter! You'll now receive:</p>
          <ul>
            <li>Weekly evidence-based ABA strategies</li>
            <li>Free BCBA exam prep tips</li>
            <li>IEP goal templates and behavior tools</li>
            <li>Exclusive community updates</li>
          </ul>
          <div style="background: #f0fdf4; border-left: 4px solid #059669; padding: 20px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Get Started:</strong></p>
            <p style="margin: 10px 0 0 0;">
              <a href="https://behaviorschool.com/blog" style="color: #059669; text-decoration: none;">
                Read Our Latest Blog Posts
              </a>
            </p>
          </div>
          <p style="color: #666; font-size: 14px; margin-top: 40px;">
            Questions? Just reply to this email!<br><br>
            - Rob Spain, M.S., BCBA, IBA<br>
            Behavior School
          </p>
          ${getEmailFooter(email)}
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

export async function sendMarketingEmail(
  to: string | string[],
  subject: string,
  htmlContent: string,
  options?: {
    from?: string;
    replyTo?: string;
  }
) {
  const resend = getResend();
  const recipients = Array.isArray(to) ? to : [to];
  const primaryRecipient = recipients[0];
  
  try {
    const { data, error } = await resend.emails.send({
      from: options?.from || 'Rob Spain <rob@updates.behaviorschool.com>',
      to: recipients,
      replyTo: options?.replyTo || 'rob@behaviorschool.com',
      subject,
      headers: getComplianceHeaders(primaryRecipient),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          ${htmlContent}
          ${getEmailFooter(primaryRecipient)}
        </div>
      `,
    });

    if (error) {
      console.error('Marketing email error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Marketing email exception:', error);
    return { success: false, error };
  }
}

export async function sendNewsletterEmail(
  emails: string[],
  subject: string,
  html: string
) {
  // Use the new compliant marketing email function
  return sendMarketingEmail(emails, subject, html);
}

// Transactional emails (no unsubscribe needed - these are required communications)
export async function sendTransactionalEmail(
  to: string | string[],
  subject: string,
  htmlContent: string,
  options?: {
    from?: string;
    replyTo?: string;
  }
) {
  const resend = getResend();
  
  try {
    const { data, error } = await resend.emails.send({
      from: options?.from || 'Behavior School <noreply@updates.behaviorschool.com>',
      to: Array.isArray(to) ? to : [to],
      replyTo: options?.replyTo,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          ${htmlContent}
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e5e5;">
            <p style="color: #666; font-size: 12px; line-height: 1.5;">
              ${MAILING_ADDRESS.replace(/\n/g, '<br>')}
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Transactional email error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Transactional email exception:', error);
    return { success: false, error };
  }
}

export async function sendContactFormEmail(
  name: string,
  email: string,
  message: string
) {
  const resend = getResend();
  try {
    const { data, error } = await resend.emails.send({
      from: 'Contact Form <noreply@updates.behaviorschool.com>',
      to: ['rob@behaviorschool.com'],
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

// Export constants for use in other files
export { MAILING_ADDRESS, UNSUBSCRIBE_URL, PREFERENCES_URL };
