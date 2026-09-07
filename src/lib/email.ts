import {
  getResend,
  RESEND_FROM_NO_REPLY,
  RESEND_FROM_ROB,
  RESEND_REPLY_TO_ROB,
} from '@/lib/resend';

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
      from: RESEND_FROM_ROB,
      to: [email],
      replyTo: RESEND_REPLY_TO_ROB,
      subject: 'A quick welcome from Behavior School',
      headers: getComplianceHeaders(email),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">Glad you are here</h2>
          <p>Hey${name ? ` ${name}` : ''},</p>
          <p>Thanks for confirming your email. I am Rob Spain, the school BCBA behind Behavior School.</p>
          <p>I send practical resources for BCBA candidates and school behavior teams: study tools, FBA and BIP materials, and training updates when there is something worth sharing. I will not fill your inbox just to stay on a schedule.</p>
          <div style="background: #f0fdf4; border-left: 4px solid #059669; padding: 20px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Good place to start:</strong></p>
            <p style="margin: 10px 0 0 0;">
              <a href="https://behaviorschool.com/blog" style="color: #059669; text-decoration: none;">
                Read the latest resources
              </a>
            </p>
          </div>
          <p style="color: #666; font-size: 14px; margin-top: 40px;">
            If you are looking for something specific, reply and tell me what you are working on.<br><br>
            Rob Spain, M.S., BCBA, IBA<br>
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
      from: options?.from || RESEND_FROM_ROB,
      to: recipients,
      replyTo: options?.replyTo || RESEND_REPLY_TO_ROB,
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
      from: options?.from || RESEND_FROM_NO_REPLY,
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

export async function sendIepGoalProgramChecklistEmail(
  email: string,
  options: {
    name?: string;
    checklist: Array<{
      label: string;
      status: "ready" | "review" | "not-included";
      detail: string;
    }>;
    resultTitle: string;
    resultSummary: string;
  }
) {
  const goalWriterUrl = "https://behaviorschool.com/iep-goals";
  const checklistHtml = options.checklist
    .map((item) => {
      const icon =
        item.status === "ready"
          ? "✓"
          : item.status === "not-included"
            ? "—"
            : "→";
      const color =
        item.status === "ready"
          ? "#059669"
          : item.status === "not-included"
            ? "#6b7280"
            : "#b45309";
      return `
        <li style="margin-bottom: 16px; list-style: none; padding-left: 0;">
          <p style="margin: 0 0 4px 0; font-weight: 600; color: ${color};">
            ${icon} ${item.label}
          </p>
          <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.5;">
            ${item.detail}
          </p>
        </li>
      `;
    })
    .join("");

  return sendTransactionalEmail(
    email,
    "Your IEP goal readiness checklist",
    `
      <h2 style="color: #123628; margin-top: 0;">${options.resultTitle}</h2>
      <p style="color: #374151; line-height: 1.6;">${options.resultSummary}</p>
      <h3 style="color: #123628; margin-bottom: 12px;">Your checklist</h3>
      <ul style="padding: 0; margin: 0 0 24px 0;">
        ${checklistHtml}
      </ul>
      <div style="background: #f0fdf4; border-left: 4px solid #059669; padding: 20px; margin: 24px 0;">
        <p style="margin: 0 0 12px 0; font-weight: 600; color: #123628;">
          Free Behavior Goal Writer
        </p>
        <p style="margin: 0 0 16px 0; color: #374151; font-size: 14px; line-height: 1.5;">
          Draft or tighten your next goal with the same quality checks used in this quiz.
        </p>
        <a href="${goalWriterUrl}" style="display: inline-block; background: #1F4D3F; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-weight: 600;">
          Open the free Goal Writer
        </a>
      </div>
      <p style="color: #666; font-size: 14px; margin-top: 32px;">
        Rob Spain, M.S., BCBA, IBA<br>
        Behavior School
      </p>
    `,
    { replyTo: RESEND_REPLY_TO_ROB }
  );
}

export async function sendContactFormEmail(
  name: string,
  email: string,
  message: string
) {
  const resend = getResend();
  try {
    const { data, error } = await resend.emails.send({
      from: RESEND_FROM_NO_REPLY,
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
