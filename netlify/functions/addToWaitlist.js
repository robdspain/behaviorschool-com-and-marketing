/**
 * Netlify Function: addToWaitlist
 *
 * Adds an email address to the shared Behavior School Convex CRM.
 */

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const email = String(payload.email || '').trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'A valid email is required' }) };
  }

  try {
    const res = await fetch('https://modest-malamute-868.convex.site/api/product-waitlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        product: payload.product || 'plan',
        sourceDomain: payload.sourceDomain || 'behaviorschool.com',
        name: payload.name,
        firstName: payload.firstName,
        lastName: payload.lastName,
        organization: payload.organization,
        newsletterOptIn: payload.newsletterOptIn === true,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Behavior School CRM error:', errText);
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
