// Netlify Function: mighty-certifier
// Purpose: Receive Mighty Networks course completion webhook -> insert to Supabase
// Certifier.io polls the Supabase table and auto-issues certificates
// Runtime: Node 18+ (fetch + crypto available)

const HEX = "hex";

const REQUIRED_ENVS = [
  "MIGHTY_WEBHOOK_SECRET",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
];

const COURSE_NAME_FILTER = (process.env.COURSE_NAME_FILTER || "").toLowerCase();
const LOG_LEVEL = (process.env.LOG_LEVEL || "info").toLowerCase();
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function log(level, ...args) {
  const order = { error: 0, warn: 1, info: 2, debug: 3 };
  if (order[level] <= order[LOG_LEVEL]) console[level](...args);
}

function missingEnv() {
  const missing = REQUIRED_ENVS.filter((k) => !process.env[k]);
  return missing.length ? `Missing required env(s): ${missing.join(", ")}` : null;
}

function hmacSha256Hex(secret, data) {
  const hmac = require("crypto").createHmac("sha256", secret);
  hmac.update(data, "utf8");
  return hmac.digest(HEX);
}

function isValidSignature({ secret, body, header }) {
  if (!header) return false;
  const expected = hmacSha256Hex(secret, body);
  // Most providers send the hex digest directly. If MN prefixes like "sha256=", handle that too.
  const normalizedHeader = header.replace(/^sha256=/i, "").trim();
  return normalizedHeader === expected;
}

function json(statusCode, payload) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  };
}

function pickNameEmail(payload) {
  const name =
    payload?.data?.member?.name ||
    payload?.data?.user?.full_name ||
    payload?.data?.user?.name ||
    null;

  const email =
    payload?.data?.member?.email || payload?.data?.user?.email || null;

  return { name, email };
}

// Insert certificate request to Supabase
// Certifier.io will poll this table and auto-issue certificates
async function insertCertificateRequest({ email, name, courseName, completionDate }) {
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
        issued_at: completionDate,
        provider: "certifier"
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Supabase error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    log("info", "Certificate request inserted to Supabase:", data[0]?.id);
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
      return json(200, { ok: true, message: "mighty-certifier alive" });
    }
    if (event.httpMethod !== "POST") {
      return json(405, { ok: false, error: "Method Not Allowed" });
    }

    // 2) Env checks
    const envErr = missingEnv();
    if (envErr) return json(500, { ok: false, error: envErr });

    const SECRET = process.env.MIGHTY_WEBHOOK_SECRET;

    // 3) Verify signature with raw body
    const signature = event.headers["x-mighty-signature"] || event.headers["X-Mighty-Signature"];
    const rawBody = event.isBase64Encoded
      ? Buffer.from(event.body || "", "base64").toString("utf8")
      : (event.body || "");

    if (!isValidSignature({ secret: SECRET, body: rawBody, header: signature })) {
      log("warn", "Signature verification failed.");
      return json(401, { ok: false, error: "Invalid signature" });
    }

    // 4) Parse payload
    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch (e) {
      return json(400, { ok: false, error: "Invalid JSON body" });
    }

    const status = String(payload?.data?.status || "").toLowerCase();
    if (status !== "completed") {
      log("info", "Ignoring non-completed status:", status);
      return json(200, { ok: true, message: `Ignored status=${status}` });
    }

    const courseName = String(payload?.data?.course?.name || "");
    if (COURSE_NAME_FILTER && !courseName.toLowerCase().includes(COURSE_NAME_FILTER)) {
      log("info", `Ignored course "${courseName}" due to filter "${COURSE_NAME_FILTER}"`);
      return json(200, {
        ok: true,
        message: "Ignored by course filter",
        courseName,
        filter: COURSE_NAME_FILTER,
      });
    }

    const { name, email } = pickNameEmail(payload);
    if (!name || !email) {
      return json(422, {
        ok: false,
        error: "Missing recipient name or email in payload",
        got: { name, email },
      });
    }

    const completionDate =
      payload?.data?.completed_at ||
      payload?.data?.course?.completed_at ||
      new Date().toISOString();

    // 5) Insert to Supabase - Certifier will auto-issue certificate
    const insertedRow = await insertCertificateRequest({
      email,
      name,
      courseName,
      completionDate
    });

    // 6) Success
    log("info", "Certificate request queued:", {
      id: insertedRow?.id,
      email,
      course: courseName,
    });

    return json(200, {
      ok: true,
      message: "Certificate request queued - Certifier will process within 15 minutes",
      request: {
        id: insertedRow?.id,
        recipient: { name, email },
        course: courseName,
        completion_date: completionDate,
      },
      note: "Certifier.io polls Supabase every 15 minutes and will auto-issue certificate"
    });
  } catch (err) {
    log("error", "Unhandled error:", err);
    return json(500, { ok: false, error: "Server error" });
  }
};
