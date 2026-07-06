const COOKIE_NAME = 'bs_admin_session';
const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const DEFAULT_SUMMARY_URL =
  'https://study.behaviorschool.com/.netlify/functions/signup-nurture-summary';
const DEFAULT_NURTURE_URL =
  'https://study.behaviorschool.com/.netlify/functions/signup-nurture';
const MAX_MANUAL_SEND_LIMIT = 5;

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
    body: JSON.stringify(body),
  };
}

function parseCookies(header = '') {
  return header.split(';').reduce((cookies, part) => {
    const index = part.indexOf('=');
    if (index === -1) return cookies;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    if (key) cookies[key] = decodeURIComponent(value);
    return cookies;
  }, {});
}

function isValidToken(token) {
  const [tsPart] = String(token || '').split('.');
  if (!tsPart) return false;
  const ts = parseInt(tsPart, 36);
  return !Number.isNaN(ts) && Date.now() - ts < SESSION_MAX_AGE_MS;
}

exports.handler = async (event) => {
  const cookies = parseCookies(event.headers.cookie || event.headers.Cookie || '');
  if (!isValidToken(cookies[COOKIE_NAME])) {
    return json(401, { error: 'Admin authentication required' });
  }

  if (event.httpMethod === 'POST') {
    return handlePost(event);
  }

  if (event.httpMethod !== 'GET') {
    return json(405, { error: 'Method not allowed' });
  }

  return handleGet(event);
};

async function handleGet(event) {
  const windowDays = event.queryStringParameters?.windowDays || '14';
  const summaryUrl = process.env.STUDY_NURTURE_SUMMARY_URL || DEFAULT_SUMMARY_URL;
  const nurtureSecret = process.env.SIGNUP_NURTURE_SECRET;
  const url = new URL(summaryUrl);
  url.searchParams.set('windowDays', windowDays);

  try {
    const response = await fetch(url.toString(), {
      headers: nurtureSecret ? { 'X-Signup-Nurture-Secret': nurtureSecret } : undefined,
    });
    const text = await response.text();
    let payload;

    try {
      payload = text ? JSON.parse(text) : {};
    } catch {
      return json(502, {
        error: 'Behavior Study Tools lifecycle source returned non-JSON',
        status: response.status,
        sourceHost: url.host,
        sourcePath: url.pathname,
      });
    }

    return json(response.status, payload);
  } catch (error) {
    return json(502, {
      error: 'Unable to load Behavior Study Tools lifecycle data',
      detail: error instanceof Error ? error.message : 'Unknown error',
      sourceHost: url.host,
      sourcePath: url.pathname,
    });
  }
}

async function handlePost(event) {
  const body = parseBody(event.body);
  if (body.action !== 'send_nurture_batch') {
    return json(400, { error: 'Unsupported Behavior Study Tools action' });
  }

  if (body.confirm !== 'SEND_REAL_NURTURE') {
    return json(400, { error: 'Manual confirmation is required before sending nurture emails' });
  }

  const nurtureSecret = process.env.SIGNUP_NURTURE_SECRET;
  if (!nurtureSecret) {
    return json(500, { error: 'SIGNUP_NURTURE_SECRET is not configured' });
  }

  const limit = clamp(Number(body.limit || 1), 1, MAX_MANUAL_SEND_LIMIT);
  const windowDays = clamp(Number(body.windowDays || 14), 1, 90);
  const nurtureUrl = process.env.STUDY_NURTURE_SEND_URL || DEFAULT_NURTURE_URL;

  try {
    const response = await fetch(nurtureUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Signup-Nurture-Secret': nurtureSecret,
      },
      body: JSON.stringify({
        send: true,
        limit,
        windowDays,
        source: 'behaviorschool-admin',
      }),
    });
    const text = await response.text();
    let payload;

    try {
      payload = text ? JSON.parse(text) : {};
    } catch {
      return json(502, {
        error: 'Behavior Study Tools nurture sender returned non-JSON',
        status: response.status,
      });
    }

    return json(response.status, payload);
  } catch (error) {
    return json(502, {
      error: 'Unable to send Behavior Study Tools nurture batch',
      detail: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

function parseBody(body) {
  try {
    return JSON.parse(body || '{}');
  } catch {
    return {};
  }
}

function clamp(value, min, max) {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}
