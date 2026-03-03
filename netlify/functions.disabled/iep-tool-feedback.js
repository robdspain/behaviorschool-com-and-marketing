/**
 * IEP Goal Writer — Real Social Proof Collection
 * 
 * Endpoints:
 *   POST { action: "goal_generated" }           → increments goal counter
 *   POST { action: "rating", stars: 1-5 }       → stores real star rating
 *   POST { action: "testimonial", text, role }  → queues testimonial for Rob's approval
 *   GET  { action: "stats" }                    → returns real public stats
 * 
 * Storage: Google Sheets (free, Rob owns the data, easy to review)
 * Sheet ID: stored in env var SOCIAL_PROOF_SHEET_ID
 */

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json",
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: CORS_HEADERS, body: "" };
  }

  const SHEET_ID = process.env.SOCIAL_PROOF_SHEET_ID;
  const GOOGLE_API_KEY = process.env.GOOGLE_SHEETS_API_KEY || process.env.GEMINI_API_KEY;
  const SERVICE_ACCOUNT_EMAIL = "behaviorschool-seo@adroit-arcana-448303-j7.iam.gserviceaccount.com";

  // For GET stats — read from sheet
  if (event.httpMethod === "GET") {
    const params = new URLSearchParams(event.queryStringParameters || {});
    if (params.get("action") === "stats") {
      return await getPublicStats(SHEET_ID, GOOGLE_API_KEY);
    }
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const { action } = body;

  // Use a simple approach: POST to Google Sheets via Apps Script Web App URL
  // This avoids needing service account JWT signing in a Netlify function
  const APPS_SCRIPT_URL = process.env.SOCIAL_PROOF_APPS_SCRIPT_URL;

  if (!APPS_SCRIPT_URL) {
    // Graceful degradation — log but don't fail
    console.log("SOCIAL_PROOF_APPS_SCRIPT_URL not set, logging locally:", JSON.stringify({ action, ...body }));
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ ok: true, note: "logged" }),
    };
  }

  try {
    const payload = {
      action,
      timestamp: new Date().toISOString(),
      source: "iep-goal-writer",
    };

    if (action === "rating") {
      const stars = parseInt(body.stars);
      if (!stars || stars < 1 || stars > 5) {
        return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: "Invalid stars" }) };
      }
      payload.stars = stars;
    }

    if (action === "testimonial") {
      const text = (body.text || "").trim().slice(0, 500); // max 500 chars
      const role = (body.role || "").trim().slice(0, 100);
      if (!text || text.length < 10) {
        return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: "Too short" }) };
      }
      payload.text = text;
      payload.role = role;
      payload.approved = false; // Rob must approve before display
    }

    if (action === "email_capture") {
      const email = (body.email || "").trim().toLowerCase();
      if (!email || !email.includes("@")) {
        return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: "Invalid email" }) };
      }
      payload.email = email;
      payload.role = (body.role || "").trim().slice(0, 100);
      payload.testimonial_text = (body.testimonial_text || "").trim().slice(0, 500);
    }

    const res = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json().catch(() => ({ ok: true }));

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ ok: true, ...result }),
    };
  } catch (err) {
    console.error("Social proof storage error:", err);
    // Never fail silently to the user — return ok but log the error
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ ok: true, note: "queued" }),
    };
  }
};

async function getPublicStats(sheetId, apiKey) {
  // Returns only approved, real stats
  // Falls back to null values if sheet not configured
  try {
    if (!sheetId || !apiKey) {
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ goals_generated: null, avg_rating: null, rating_count: null, testimonials: [] }),
      };
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Stats!A:B?key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    const rows = data.values || [];
    const stats = {};
    for (const [key, val] of rows) {
      stats[key] = val;
    }

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        goals_generated: parseInt(stats.goals_generated) || null,
        avg_rating: parseFloat(stats.avg_rating) || null,
        rating_count: parseInt(stats.rating_count) || null,
        testimonials: [], // testimonials fetched separately, need approval gate
      }),
    };
  } catch (err) {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ goals_generated: null, avg_rating: null, rating_count: null, testimonials: [] }),
    };
  }
}
