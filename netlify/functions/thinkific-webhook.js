// Netlify Function: thinkific-webhook
// Purpose: Receive Thinkific course completion webhook → insert to Supabase
// Certifier.io polls the Supabase table and auto-issues certificates
// Runtime: Node 18+ (fetch + crypto available)

const crypto = require('crypto');

const REQUIRED_ENVS = [
  "THINKIFIC_WEBHOOK_SECRET",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
];

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const WEBHOOK_SECRET = process.env.THINKIFIC_WEBHOOK_SECRET;
const LOG_LEVEL = (process.env.LOG_LEVEL || "info").toLowerCase();

function log(level, ...args) {
  const order = { error: 0, warn: 1, info: 2, debug: 3 };
  if (order[level] <= order[LOG_LEVEL]) console[level](...args);
}

function missingEnv() {
  const missing = REQUIRED_ENVS.filter((k) => !process.env[k]);
  return missing.length ? `Missing required env(s): ${missing.join(", ")}` : null;
}

function verifyThinkificSignature(secret, body, headerSignature) {
  if (!headerSignature) {
    log("warn", "No X-Thinkific-Hmac-Sha256 header found");
    return false;
  }

  // Compute HMAC-SHA256
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(body, 'utf8');
  const computed = hmac.digest('hex');

  // Timing-safe comparison
  try {
    return crypto.timingSafeEqual(
      Buffer.from(computed, 'hex'),
      Buffer.from(headerSignature, 'hex')
    );
  } catch (err) {
    log("error", "Signature comparison failed:", err.message);
    return false;
  }
}

function json(statusCode, payload) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  };
}

// Fetch BCBA certification number from signup_submissions table
async function getBCBACertNumber(email) {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/signup_submissions?email=eq.${encodeURIComponent(email)}&select=bcba_cert_number`,
      {
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
        }
      }
    );

    if (!response.ok) {
      log("warn", `Failed to fetch BCBA cert # for ${email}`);
      return null;
    }

    const data = await response.json();
    if (data && data.length > 0 && data[0].bcba_cert_number) {
      return data[0].bcba_cert_number;
    }

    log("debug", `No BCBA cert # found for ${email}`);
    return null;
  } catch (error) {
    log("error", "Error fetching BCBA cert #:", error.message);
    return null;
  }
}

// Insert certificate request to Supabase
async function insertCertificateRequest({ email, name, courseName, completionDate, bcbaCertNumber }) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/certificates_issued`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Prefer": "return=representation"
      },
      body: JSON.stringify({
        recipient_email: email,
        recipient_name: name,
        course_name: courseName,
        bcba_cert_number: bcbaCertNumber,
        issued_at: completionDate,
        provider: "certifier"
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Supabase error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    log("info", "Certificate request inserted:", {
      id: data[0]?.id,
      email,
      bcba_cert_number: bcbaCertNumber
    });
    return data[0];
  } catch (error) {
    log("error", "Failed to insert certificate request:", error.message);
    throw error;
  }
}

exports.handler = async (event) => {
  try {
    // 1) Basic method/health
    if (event.httpMethod === "GET") {
      return json(200, {
        ok: true,
        message: "thinkific-webhook alive",
        service: "Thinkific course completion → Certifier via Supabase"
      });
    }

    if (event.httpMethod !== "POST") {
      return json(405, { ok: false, error: "Method Not Allowed" });
    }

    // 2) Env checks
    const envErr = missingEnv();
    if (envErr) {
      return json(500, { ok: false, error: envErr });
    }

    // 3) Get raw body for signature verification
    const rawBody = event.isBase64Encoded
      ? Buffer.from(event.body || "", "base64").toString("utf8")
      : (event.body || "");

    // 4) Verify Thinkific HMAC signature
    const thinkificSignature =
      event.headers["x-thinkific-hmac-sha256"] ||
      event.headers["X-Thinkific-Hmac-Sha256"];

    if (!verifyThinkificSignature(WEBHOOK_SECRET, rawBody, thinkificSignature)) {
      log("warn", "Thinkific signature verification failed");
      return json(401, { ok: false, error: "Invalid signature" });
    }

    // 5) Parse payload
    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch (e) {
      return json(400, { ok: false, error: "Invalid JSON body" });
    }

    log("debug", "Thinkific webhook received:", {
      resource: payload.resource,
      action: payload.action,
      course: payload.payload?.course?.name
    });

    // 6) Only process enrollment.completed events
    if (payload.resource !== "enrollment" || payload.action !== "completed") {
      log("info", `Ignoring event: ${payload.resource}.${payload.action}`);
      return json(200, {
        ok: true,
        message: `Ignored event: ${payload.resource}.${payload.action}`
      });
    }

    // 7) Extract data from payload
    const enrollmentData = payload.payload;
    const user = enrollmentData.user;
    const course = enrollmentData.course;

    const email = user.email;
    const firstName = user.first_name || "";
    const lastName = user.last_name || "";
    const name = `${firstName} ${lastName}`.trim() || email;
    const courseName = course.name;
    const completionDate = enrollmentData.completed_at || new Date().toISOString();

    if (!email || !courseName) {
      return json(422, {
        ok: false,
        error: "Missing required data",
        got: { email, courseName }
      });
    }

    // 8) Fetch BCBA certification number from signup form
    const bcbaCertNumber = await getBCBACertNumber(email);

    if (!bcbaCertNumber) {
      log("warn", `No BCBA cert # found for ${email}. Certificate will be issued without it.`);
    }

    // 9) Insert to Supabase - Certifier will auto-issue certificate
    const insertedRow = await insertCertificateRequest({
      email,
      name,
      courseName,
      completionDate,
      bcbaCertNumber
    });

    // 10) Success
    log("info", "Certificate request queued:", {
      id: insertedRow?.id,
      email,
      course: courseName,
      bcba_cert: bcbaCertNumber || "not provided"
    });

    return json(200, {
      ok: true,
      message: "Certificate request queued - Certifier will process within 15 minutes",
      request: {
        id: insertedRow?.id,
        recipient: { name, email },
        course: courseName,
        bcba_cert_number: bcbaCertNumber,
        completion_date: completionDate,
      },
      note: "Certifier.io polls Supabase every 15 minutes and will auto-issue certificate"
    });

  } catch (err) {
    log("error", "Unhandled error:", err);
    return json(500, {
      ok: false,
      error: "Server error",
      details: err.message
    });
  }
};
