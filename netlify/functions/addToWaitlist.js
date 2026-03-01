/**
 * Netlify Function: addToWaitlist
 *
 * Adds an email address to the Resend audience (waitlist).
 *
 * Required env vars:
 *   RESEND_API_KEY            — your Resend API key
 *   RESEND_WAITLIST_AUDIENCE_ID — the Resend audience ID for the waitlist
 */

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let email;
  try {
    const body = JSON.parse(event.body || '{}');
    email = (body.email || '').trim();
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  if (!email || !email.includes('@')) {
    return { statusCode: 400, body: JSON.stringify({ error: 'A valid email is required' }) };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_WAITLIST_AUDIENCE_ID;

  if (!apiKey || !audienceId) {
    console.error('Missing RESEND_API_KEY or RESEND_WAITLIST_AUDIENCE_ID env vars');
    return { statusCode: 500, body: JSON.stringify({ error: 'Server configuration error' }) };
  }

  try {
    const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, unsubscribed: false }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Resend error:', errText);
      return { statusCode: 502, body: JSON.stringify({ error: 'Failed to add contact to waitlist' }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Added to waitlist successfully' }),
    };
  } catch (err) {
    console.error('addToWaitlist error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};
