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

  const htmlBody = `
    <h2>New Transformation Program Application</h2>
    <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px;">
      <tr><td style="padding:8px;font-weight:bold;width:200px;">Full Name</td><td style="padding:8px;">${escapeHtml(fullName)}</td></tr>
      <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;">Email</td><td style="padding:8px;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
      <tr><td style="padding:8px;font-weight:bold;">BCBA Cert #</td><td style="padding:8px;">${escapeHtml(bcbaCertNumber || '(not provided)')}</td></tr>
      <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;">Current Role / Title</td><td style="padding:8px;">${escapeHtml(currentRole)}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;vertical-align:top;">Why Join?</td><td style="padding:8px;white-space:pre-wrap;">${escapeHtml(whyJoin)}</td></tr>
    </table>
  `;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'BehaviorSchool Applications <noreply@behaviorschool.com>',
        to: ['rob@behaviorschool.com'],
        subject: 'New Transformation Program Application',
        html: htmlBody,
        reply_to: email,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Resend error:', errText);
      return { statusCode: 502, body: JSON.stringify({ error: 'Failed to send application email' }) };
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
