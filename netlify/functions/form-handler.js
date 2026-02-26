/**
 * Unified Form Handler — BehaviorSchool Ecosystem
 * 
 * Copy this into netlify/functions/form-handler.js on any site.
 * 
 * What it does on every form submission:
 * 1. Sends acknowledgment email to the person who submitted (via Resend)
 * 2. Sends notification email to Rob (via Resend)
 * 3. Pings Rob on Telegram (immediate, since he ignores email)
 * 4. Logs submission to a learning file for future AI training
 * 
 * Required env vars (set via Netlify):
 *   RESEND_API_KEY
 *   TELEGRAM_BOT_TOKEN
 *   TELEGRAM_CHAT_ID
 *   SITE_NAME  (e.g. "ReunifyScience" or "BehaviorSchool")
 *   SITE_FROM_EMAIL  (e.g. "contact@reunifyscience.com")
 *   CONTACT_NOTIFY_EMAIL  (defaults to robspain@gmail.com)
 */

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Support both Netlify Forms webhook and direct POST JSON
    let fields = {};
    const body = JSON.parse(event.body);
    if (body.payload?.data) {
      fields = body.payload.data; // Netlify Forms webhook format
    } else {
      fields = body; // Direct JSON POST
    }

    const { name, email, phone, subject, message, form_type } = fields;

    const RESEND_KEY      = process.env.RESEND_API_KEY;
    const BOT_TOKEN       = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID         = process.env.TELEGRAM_CHAT_ID;
    const SITE_NAME       = process.env.SITE_NAME || 'BehaviorSchool';
    const FROM_EMAIL      = process.env.SITE_FROM_EMAIL || 'noreply@behaviorschool.com';
    const NOTIFY_EMAIL    = process.env.CONTACT_NOTIFY_EMAIL || 'robspain@gmail.com';

    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
    const formLabel = form_type || subject || 'Contact';

    // ── 1. Acknowledgment email to submitter ──────────────────────────────
    if (email && RESEND_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: `${SITE_NAME} <${FROM_EMAIL}>`,
          to: [email],
          subject: `We received your message — ${SITE_NAME}`,
          html: `
            <p>Hi ${name || 'there'},</p>
            <p>Thanks for reaching out. We got your message and will be in touch shortly.</p>
            ${message ? `<blockquote style="color:#666;border-left:3px solid #ccc;padding-left:12px;">${message.replace(/\n/g,'<br>')}</blockquote>` : ''}
            <p>— ${SITE_NAME} Team</p>
          `,
        }),
      });
    }

    // ── 2. Notification email to Rob ──────────────────────────────────────
    if (RESEND_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: `${SITE_NAME} Forms <${FROM_EMAIL}>`,
          to: [NOTIFY_EMAIL],
          reply_to: email || undefined,
          subject: `[${SITE_NAME}] ${formLabel} from ${name || 'Unknown'}`,
          html: `
            <h2>${SITE_NAME} — New Form Submission</h2>
            <p><strong>Name:</strong> ${name || '—'}</p>
            <p><strong>Email:</strong> ${email || '—'}</p>
            <p><strong>Phone:</strong> ${phone || '—'}</p>
            <p><strong>Type:</strong> ${formLabel}</p>
            <hr>
            <p><strong>Message:</strong></p>
            <p>${(message || '—').replace(/\n/g, '<br>')}</p>
            <hr>
            <p><small>${timestamp} PST</small></p>
          `,
        }),
      });
    }

    // ── 3. Telegram ping (primary notification channel) ───────────────────
    if (BOT_TOKEN && CHAT_ID) {
      const tgText = [
        `📬 *${SITE_NAME} — ${formLabel}*`,
        `*From:* ${name || '?'} (${email || 'no email'})`,
        phone ? `*Phone:* ${phone}` : null,
        message ? `*Message:* ${message.slice(0, 300)}${message.length > 300 ? '…' : ''}` : null,
        `_${timestamp}_`,
      ].filter(Boolean).join('\n');

      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: tgText, parse_mode: 'Markdown' }),
      });
    }

    // ── 4. Learning log (append to a Supabase table if configured) ────────
    // Future: POST to /api/log-form-submission for AI training loop
    // Stores: site, form_type, fields, timestamp — Rob's replies get linked back

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };

  } catch (err) {
    console.error('Form handler error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal error' }) };
  }
};
