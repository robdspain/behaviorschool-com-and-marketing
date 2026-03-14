const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

const RBT_PLAN = [
  "Day 1: RBT Task List orientation + 20 practice Qs",
  "Day 2: Measurement & data collection deep-dive",
  "Day 3: Skill acquisition - DTT, NET, chaining",
  "Day 4: Behavior reduction - antecedents, consequences",
  "Day 5: Documentation & professional conduct",
  "Day 6: Full mock exam (75 questions)",
  "Day 7: Review weak areas + confidence assessment",
];

const BCBA_PLAN = [
  "Day 1: BACB exam structure + domain overview",
  "Day 2: Behavior assessment & measurement (30%)",
  "Day 3: Behavior change procedures (24%)",
  "Day 4: Selecting & implementing interventions (22%)",
  "Day 5: Ethics, supervision & professional practice",
  "Day 6: Systems support + generalization",
  "Day 7: Full timed mock exam + score analysis",
];

const SUBJECTS = {
  rbt: "Your Free 7-Day RBT Study Plan is here 🎓",
  bcba: "Your Free 7-Day BCBA Study Plan is here 🎓",
  both: "Your Free 7-Day RBT + BCBA Study Plans are here 🎓",
};

function json(statusCode, payload) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    },
    body: JSON.stringify(payload),
  };
}

function buildScheduleTable(title, items) {
  const rows = items
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 12px;border:1px solid #e8e2d5;color:#1f4d3f;font-weight:600;">${item.split(":")[0]}</td>
          <td style="padding:10px 12px;border:1px solid #e8e2d5;color:#2b2b2b;">${item.split(":")[1]?.trim() || ""}</td>
        </tr>
      `
    )
    .join("");

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:18px 0;">
      <thead>
        <tr>
          <th colspan="2" align="left" style="padding:12px 12px;background:#f6f2ea;color:#1f4d3f;border:1px solid #e8e2d5;font-size:16px;">
            ${title}
          </th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

function buildButton(href, label) {
  return `
    <a href="${href}" style="display:inline-block;margin-right:12px;margin-bottom:12px;background:#1f4d3f;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:700;">
      ${label}
    </a>
  `;
}

function buildEmailHtml({ name, role }) {
  const safeName = name || "there";
  const tables = [];
  const buttons = [];

  if (role === "rbt" || role === "both") {
    tables.push(buildScheduleTable("RBT 7-Day Plan", RBT_PLAN));
    buttons.push(buildButton("https://rbtstudy.behaviorschool.com", "Start Studying Free Today"));
  }

  if (role === "bcba" || role === "both") {
    tables.push(buildScheduleTable("BCBA 7-Day Plan", BCBA_PLAN));
    buttons.push(buildButton("https://study.behaviorschool.com", "Start Studying Free Today"));
  }

  return `
    <div style="font-family:Inter,Segoe UI,Arial,sans-serif;background:#ffffff;padding:24px;color:#2b2b2b;">
      <div style="max-width:640px;margin:0 auto;">
        <div style="font-size:20px;font-weight:800;color:#1f4d3f;">Behavior Study Tools</div>
        <p style="margin-top:24px;font-size:16px;">Hi ${safeName},</p>
        <p style="margin-top:8px;font-size:16px;">Here is your personalized 7-day study plan.</p>
        ${tables.join("")}
        <div style="margin:16px 0 8px;">
          ${buttons.join("")}
        </div>
        <p style="margin-top:28px;font-size:12px;color:#6b6b6b;">
          Behavior Study Tools - study.behaviorschool.com - Unsubscribe
        </p>
      </div>
    </div>
  `;
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return json(200, { ok: true });
  }

  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method Not Allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return json(500, { error: "Missing RESEND_API_KEY" });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch (error) {
    return json(400, { error: "Invalid JSON body" });
  }

  const name = String(payload?.name || "").trim();
  const email = String(payload?.email || "").trim();
  const role = String(payload?.role || "").trim().toLowerCase();

  if (!name || !email || !role) {
    return json(422, { error: "Missing required fields" });
  }

  if (!EMAIL_REGEX.test(email)) {
    return json(422, { error: "Invalid email address" });
  }

  if (!["rbt", "bcba", "both"].includes(role)) {
    return json(422, { error: "Invalid role" });
  }

  const subject = SUBJECTS[role];
  const html = buildEmailHtml({ name, role });

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Behavior Study Tools <hello@updates.behaviorschool.com>",
        reply_to: "hello@behaviorschool.com",
        to: email,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return json(500, { error: `Resend error: ${errorText}` });
    }

    return json(200, { success: true });
  } catch (error) {
    return json(500, { error: "Unexpected server error" });
  }
};
