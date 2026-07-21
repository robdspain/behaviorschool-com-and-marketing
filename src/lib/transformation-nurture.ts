import { api, getConvexClient } from "@/lib/convex";
import { RESEND_FROM_ROB, RESEND_REPLY_TO_ROB } from "@/lib/resend";

export const TRANSFORMATION_CALENDLY_URL =
  "https://calendly.com/robspain/behavior-school-transformation-system-phone-call";
export const TRANSFORMATION_PACKET_URL =
  "https://behaviorschool.com/transformation-program-pd-packet.pdf";
export const TRANSFORMATION_PROGRAM_URL =
  "https://behaviorschool.com/transformation-program";

type StartTransformationNurtureInput = {
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  organization?: string;
  role?: string;
  source: string;
  tags?: string[];
  notes?: string;
  metadata?: Record<string, unknown>;
  sendDueNow?: boolean;
};

type QueuedTransformationEmail = {
  _id: string;
  email: string;
  firstName?: string;
  step: number;
  subject: string;
  shouldSkip?: boolean;
  enrollmentStatus?: string;
  contactStatus?: string;
};

function firstNameOrThere(firstName?: string) {
  return firstName?.trim() || "there";
}

function textToHtml(text: string) {
  return text
    .split("\n\n")
    .map((paragraph) => `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#334155;">${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function linkButton(href: string, label: string) {
  return `<p style="margin:24px 0;"><a href="${href}" style="display:inline-block;background:#1f4d3f;color:#ffffff;text-decoration:none;padding:14px 22px;border-radius:8px;font-weight:700;">${label}</a></p>`;
}

function wrapEmail(opts: { title: string; bodyText: string; buttonHref?: string; buttonLabel?: string }) {
  const button = opts.buttonHref && opts.buttonLabel ? linkButton(opts.buttonHref, opts.buttonLabel) : "";
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;">
  <table role="presentation" style="width:100%;border-collapse:collapse;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" style="max-width:620px;width:100%;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;">
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 10px;color:#1f4d3f;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;">Behavior School</p>
              <h1 style="margin:0 0 20px;color:#0f172a;font-size:24px;line-height:1.25;">${escapeHtml(opts.title)}</h1>
              ${textToHtml(opts.bodyText)}
              ${button}
              <p style="margin:28px 0 0;font-size:16px;line-height:1.6;color:#334155;">Rob Spain, BCBA, IBA<br>Behavior School</p>
              <p style="margin:24px 0 0;font-size:12px;line-height:1.5;color:#94a3b8;">You are receiving this because you requested information about the School BCBA Transformation Program. Reply to this email if you want me to stop following up.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function renderTransformationNurtureEmail(email: QueuedTransformationEmail) {
  const name = firstNameOrThere(email.firstName);

  switch (email.step) {
    case 0: {
      const bodyText = `Hi ${name},

Here is the district approval packet for the School BCBA Transformation Program:
${TRANSFORMATION_PACKET_URL}

The fastest next step is to get a short fit call on the calendar. We can talk through your setting, whether the August cohort is a fit, and what your district needs for approval.

Book a time here:
${TRANSFORMATION_CALENDLY_URL}

If your district needs a W-9, invoice language, or a purchase-order path, reply here and I will help.`;
      return {
        subject: email.subject,
        text: bodyText,
        html: wrapEmail({
          title: "Your district packet and next step",
          bodyText,
          buttonHref: TRANSFORMATION_CALENDLY_URL,
          buttonLabel: "Book a fit call",
        }),
      };
    }
    case 1: {
      const bodyText = `Hi ${name},

Most school BCBAs I talk with are not struggling because they lack skill. They are carrying work that was never designed as a system.

The pattern is familiar: referrals arrive with uneven data, FBAs get rushed by timelines, BIPs have to be usable by people who were not in the assessment, and the BCBA becomes the person holding every loose thread.

That is the problem the Transformation Program is built around. Not more theory for its own sake. A repeatable way to move from referral to assessment decision, from hypothesis to BIP, and from written plan to staff implementation.

If that is the work you are trying to clean up this year, grab a call time and we can see if the August cohort fits your role.`;
      return {
        subject: email.subject,
        text: `${bodyText}\n\n${TRANSFORMATION_CALENDLY_URL}`,
        html: wrapEmail({
          title: "The workload problem is not a personal failure",
          bodyText,
          buttonHref: TRANSFORMATION_CALENDLY_URL,
          buttonLabel: "Talk through the fit",
        }),
      };
    }
    case 2: {
      const bodyText = `Hi ${name},

Here is what changes during the 6-week cohort:

You build a clearer intake and triage process so every referral does not become a full rebuild.

You practice testing a functional hypothesis before jumping to a BIP.

You study school-relevant functional-analysis formats and the safeguards around using them responsibly.

You connect assessment evidence to intervention components staff can actually implement.

You leave with routines for staff training, fidelity checks, progress review, and caseload management.

If you want to talk through whether this matches your current caseload, book a fit call here.`;
      return {
        subject: email.subject,
        text: `${bodyText}\n\n${TRANSFORMATION_CALENDLY_URL}`,
        html: wrapEmail({
          title: "What changes during the 6-week program",
          bodyText,
          buttonHref: TRANSFORMATION_CALENDLY_URL,
          buttonLabel: "Book a fit call",
        }),
      };
    }
    case 3: {
      const bodyText = `Hi ${name},

Quick district approval reminder.

If you are asking your district to cover the August cohort, the packet includes the program description, six-week curriculum, learning objectives, district billing language, invoice template, and W-9 request instructions.

Packet:
${TRANSFORMATION_PACKET_URL}

The cleanest approval ask is usually: "I want to attend this 6-week school BCBA professional-development cohort because it directly addresses FBA quality, BIP implementation, staff training, and caseload systems."

If you want me to help with exact wording for your director or business office, reply with the name of your district and what they require.`;
      return {
        subject: email.subject,
        text: bodyText,
        html: wrapEmail({
          title: "A quick district approval reminder",
          bodyText,
          buttonHref: TRANSFORMATION_PACKET_URL,
          buttonLabel: "Open the district packet",
        }),
      };
    }
    default: {
      const bodyText = `Hi ${name},

Last note from me for now.

If the School BCBA Transformation Program is potentially useful, the next step is a short call. I want to understand your setting before pointing you toward enrollment.

The August cohort is small by design, so I would rather have a real conversation than push you through a generic checkout page.

Book a time here:
${TRANSFORMATION_CALENDLY_URL}

If now is not the right time, no problem. You can reply and tell me what you are working on, and I will point you to the best free resource instead.`;
      return {
        subject: email.subject,
        text: bodyText,
        html: wrapEmail({
          title: "Want to talk through the August cohort?",
          bodyText,
          buttonHref: TRANSFORMATION_CALENDLY_URL,
          buttonLabel: "Book a fit call",
        }),
      };
    }
  }
}

async function sendViaResend(opts: { to: string; subject: string; html: string; text: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, status: 0, body: "resend_not_configured" };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: RESEND_FROM_ROB,
      to: [opts.to],
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
      reply_to: RESEND_REPLY_TO_ROB,
    }),
  });

  const body = await response.text();
  let id: string | undefined;
  try {
    const parsed = JSON.parse(body);
    id = parsed.id;
  } catch {}

  return { ok: response.ok, status: response.status, body, id };
}

async function sendNurtureEmail(email: QueuedTransformationEmail) {
  const rendered = renderTransformationNurtureEmail(email);
  const resend = await sendViaResend({
    to: email.email,
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
  });

  if (resend.ok) {
    return { ok: true, providerMessageId: resend.id, provider: "resend" };
  }

  return {
    ok: false,
    error: `Resend failed (${resend.status}: ${String(resend.body)})`,
  };
}

export async function startTransformationNurture(input: StartTransformationNurtureInput) {
  const result = await getConvexClient().mutation(api.transformationNurture.start, {
    email: input.email,
    name: input.name,
    firstName: input.firstName,
    lastName: input.lastName,
    phone: input.phone,
    organization: input.organization,
    role: input.role,
    source: input.source,
    tags: input.tags,
    notes: input.notes,
    metadata: input.metadata,
  });

  if (input.sendDueNow ?? true) {
    await processTransformationNurture({ limit: 5 });
  }

  return result;
}

export async function processTransformationNurture(opts: { limit?: number } = {}) {
  const now = new Date().toISOString();
  const due = await getConvexClient().query(api.transformationNurture.listDueEmails, {
    now,
    limit: opts.limit ?? 25,
  }) as QueuedTransformationEmail[];

  const result = {
    checked: due.length,
    sent: 0,
    skipped: 0,
    failed: 0,
  };

  for (const email of due) {
    if (email.shouldSkip) {
      result.skipped += 1;
      await getConvexClient().mutation(api.transformationNurture.markEmailSkipped, {
        id: email._id,
        reason: `Skipped because enrollment=${email.enrollmentStatus || "missing"} contact=${email.contactStatus || "missing"}`,
      });
      continue;
    }

    const sent = await sendNurtureEmail(email);
    if (sent.ok) {
      result.sent += 1;
      await getConvexClient().mutation(api.transformationNurture.markEmailSent, {
        id: email._id,
        providerMessageId: sent.providerMessageId,
        sentAt: new Date().toISOString(),
      });
    } else {
      result.failed += 1;
      await getConvexClient().mutation(api.transformationNurture.markEmailFailed, {
        id: email._id,
        errorMessage: sent.error || "Unknown email send failure",
      });
    }
  }

  return result;
}
