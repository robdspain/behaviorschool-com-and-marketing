/**
 * Netlify Function: submitApplication
 *
 * Receives a Transformation Program application and emails it to Rob via Resend.
 *
 * Required env vars:
 *   RESEND_API_KEY — your Resend API key
 */

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { fullName, email, bcbaCertNumber, currentRole, whyJoin } = body;

  if (!fullName || !email || !currentRole || !whyJoin) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('Missing RESEND_API_KEY env var');
    return { statusCode: 500, body: JSON.stringify({ error: 'Server configuration error' }) };
  }

  const submittedAt = new Date().toISOString();
  const htmlBody = `
    <h2>New Transformation Program Application</h2>
    <p><strong>Cohort:</strong> August 12 – September 16, 2026</p>
    <p><strong>Submitted:</strong> ${escapeHtml(submittedAt)}</p>
    <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px;">
      <tr><td style="padding:8px;font-weight:bold;width:200px;">Full Name</td><td style="padding:8px;">${escapeHtml(fullName)}</td></tr>
      <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;">Email</td><td style="padding:8px;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
      <tr><td style="padding:8px;font-weight:bold;">BCBA Cert #</td><td style="padding:8px;">${escapeHtml(bcbaCertNumber || '(not provided)')}</td></tr>
      <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;">Current Role / Title</td><td style="padding:8px;">${escapeHtml(currentRole)}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;vertical-align:top;">Why Join?</td><td style="padding:8px;white-space:pre-wrap;">${escapeHtml(whyJoin)}</td></tr>
    </table>
  `;
  const applicantHtml = `
    <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;color:#1a1a1a;line-height:1.6;">
      <h2 style="color:#1f4d3f;">Application received</h2>
      <p>Hi ${escapeHtml(firstName(fullName))},</p>
      <p>Thanks for applying for the <strong>School BCBA Transformation Program</strong>.</p>
      <p>I received your application for the August 12 cohort and will review it personally. If it looks like a fit, I will reply with next steps for a fit call, district paperwork, or checkout access.</p>
      <div style="background:#f0fdf4;border-left:4px solid #1f4d3f;padding:16px 18px;margin:22px 0;">
        <p style="margin:0;"><strong>Next cohort:</strong> August 12 – September 16, 2026</p>
        <p style="margin:8px 0 0;"><strong>Live sessions:</strong> Wednesdays, 6:00–8:00 PM Pacific</p>
        <p style="margin:8px 0 0;"><strong>Seats:</strong> 12 participants max</p>
      </div>
      <p>If your district needs a W-9, invoice, or professional development description, reply to this email and I will send the paperwork.</p>
      <p style="margin-top:28px;">Rob Spain, BCBA, IBA<br>Behavior School</p>
    </div>
  `;
  const applicantText = `Hi ${firstName(fullName)},

Thanks for applying for the School BCBA Transformation Program.

I received your application for the August 12 cohort and will review it personally. If it looks like a fit, I will reply with next steps for a fit call, district paperwork, or checkout access.

Next cohort: August 12 – September 16, 2026
Live sessions: Wednesdays, 6:00–8:00 PM Pacific
Seats: 12 participants max

If your district needs a W-9, invoice, or professional development description, reply to this email and I will send the paperwork.

Rob Spain, BCBA, IBA
Behavior School`;

  try {
    const notificationRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'BehaviorSchool Applications <noreply@behaviorschool.com>',
        to: ['rob@behaviorschool.com'],
        subject: `New Transformation Program Application — ${fullName}`,
        html: htmlBody,
        reply_to: email,
      }),
    });

    if (!notificationRes.ok) {
      const errText = await notificationRes.text();
      console.error('Resend notification error:', errText);
      return { statusCode: 502, body: JSON.stringify({ error: 'Failed to send application email' }) };
    }

    const confirmationRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Rob Spain, BCBA <rob@updates.behaviorschool.com>',
        to: [email],
        subject: 'Application received — School BCBA Transformation Program',
        html: applicantHtml,
        text: applicantText,
        reply_to: 'rob@behaviorschool.com',
      }),
    });

    if (!confirmationRes.ok) {
      const errText = await confirmationRes.text();
      console.error('Resend applicant confirmation error:', errText);
      await notifyConfirmationFailure(apiKey, { fullName, email, errText });

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: 'Application submitted successfully',
          confirmationSent: false,
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Application submitted successfully' }),
    };
  } catch (err) {
    console.error('submitApplication error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function firstName(str) {
  return String(str || '').trim().split(/\s+/)[0] || 'there';
}

async function notifyConfirmationFailure(apiKey, { fullName, email, errText }) {
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'BehaviorSchool Applications <noreply@behaviorschool.com>',
        to: ['rob@behaviorschool.com'],
        subject: `Application confirmation failed — ${fullName}`,
        html: `
          <h2>Applicant confirmation email failed</h2>
          <p>The Transformation Program application was received and Rob was notified, but the applicant confirmation email failed.</p>
          <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
          <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
          <p><strong>Resend response:</strong></p>
          <pre style="white-space:pre-wrap;">${escapeHtml(errText)}</pre>
        `,
        reply_to: email,
      }),
    });
  } catch (err) {
    console.error('Failed to send confirmation failure alert:', err);
  }
}
