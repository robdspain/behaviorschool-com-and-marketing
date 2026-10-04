import { api, getConvexClient } from "@/lib/convex";
import { RESEND_FROM_ROB, RESEND_REPLY_TO_ROB } from "@/lib/resend";
import {
  isSchoolFaStarterKitSource,
  SCHOOL_FA_GRAPHING_TEMPLATE_COPY_URL,
  SCHOOL_FA_KIT_PDF_URL,
  SCHOOL_FA_KIT_STEP_ZERO_SUBJECT,
} from "@/lib/school-fa-kit";
import { TRANSFORMATION_PROGRAM } from "@/lib/transformation-program";

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
  metadata?: { source?: string } | null;
};

function queuedSource(email: QueuedTransformationEmail) {
  const source = email.metadata?.source;
  return typeof source === "string" ? source : "";
}

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

function wrapEmail(opts: {
  title: string;
  bodyText: string;
  buttonHref?: string;
  buttonLabel?: string;
  footer?: string;
}) {
  const button = opts.buttonHref && opts.buttonLabel ? linkButton(opts.buttonHref, opts.buttonLabel) : "";
  const footer = opts.footer
    ?? "You are receiving this because you requested information about the School BCBA Systems Transformation Program. Reply to this email if you want me to stop following up.";
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(opts.title)}</div>
  <table role="presentation" style="width:100%;border-collapse:collapse;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" style="max-width:620px;width:100%;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;">
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 10px;color:#1f4d3f;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;">Behavior School</p>
              ${textToHtml(opts.bodyText)}
              ${button}
              <p style="margin:28px 0 0;font-size:16px;line-height:1.6;color:#334155;">Rob Spain, BCBA, IBA<br>Behavior School</p>
              <p style="margin:24px 0 0;font-size:12px;line-height:1.5;color:#94a3b8;">${escapeHtml(footer)}</p>
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
  const schoolFaKit = isSchoolFaStarterKitSource(queuedSource(email));
  const footer = schoolFaKit
    ? "You are receiving this because you requested the free School FA starter kit at behaviorschool.com/fba. These notes are about the School BCBA Systems Transformation Program. Reply to this email if you want me to stop following up."
    : undefined;

  switch (email.step) {
    case 0: {
      if (schoolFaKit) {
        const bodyText = `Hi ${name},

The School FA starter kit from the October 9 CalABA BehaviorLive presentation is ready.

The PDF has the five task analyses, a printable datasheet for each format, and a blank graph page for each format:
${SCHOOL_FA_KIT_PDF_URL}

The editable graphing template is a Google Sheet. Make a copy for each student:
${SCHOOL_FA_GRAPHING_TEMPLATE_COPY_URL}

Use it with a qualified behavior analyst supervising the work. Get consent, and write stop criteria before any session.

If you want this built into a system across a caseload, that is what the School BCBA Systems Transformation Program is for:
${TRANSFORMATION_PROGRAM_URL}

I will send a few short notes about the program. Reply if you want me to stop.`;
        return {
          subject: email.subject,
          text: bodyText,
          html: wrapEmail({
            title: SCHOOL_FA_KIT_STEP_ZERO_SUBJECT,
            bodyText,
            buttonHref: SCHOOL_FA_KIT_PDF_URL,
            buttonLabel: "Download the starter kit",
            footer,
          }),
        };
      }

      const bodyText = `Hi ${name},

I put the district packet here:
${TRANSFORMATION_PACKET_URL}

It includes the program overview, learning objectives, schedule, and the information a district usually asks for.

If you are trying to decide whether the cohort fits your job, book a short call. I will ask about your caseload and tell you plainly whether I think the program makes sense for you.

Book a time here:
${TRANSFORMATION_CALENDLY_URL}

If your business office needs a W-9, invoice language, or a purchase-order path, reply to this email. I will help you get it to the right person.`;
      return {
        subject: email.subject,
        text: bodyText,
        html: wrapEmail({
          title: "Here is the district packet you asked for",
          bodyText,
          buttonHref: TRANSFORMATION_CALENDLY_URL,
          buttonLabel: "Book a fit call",
          footer,
        }),
      };
    }
    case 1: {
      const bodyText = `Hi ${name},

One thing I have learned in school systems: the BCBA often becomes the person who catches everything nobody else owns.

The referral comes in with thin data. The FBA clock is already running. The plan has to make sense to staff who were not part of the assessment. Then the BCBA is expected to keep the whole thing moving.

That is the work we address in the School BCBA Systems Transformation Program. We build a repeatable process from referral to assessment, from hypothesis to BIP, and from the written plan to what staff actually do.

If this is the part of your job that keeps spilling into nights and weekends, book a call and tell me what is happening in your setting.`;
      return {
        subject: email.subject,
        text: `${bodyText}\n\n${TRANSFORMATION_CALENDLY_URL}`,
        html: wrapEmail({
          title: "The part of school BCBA work nobody owns",
          bodyText,
          buttonHref: TRANSFORMATION_CALENDLY_URL,
          buttonLabel: "Talk through the fit",
          footer,
        }),
      };
    }
    case 2: {
      const bodyText = `Hi ${name},

Here is what we actually work on across ${TRANSFORMATION_PROGRAM.cohort.scheduleLabel}:

- A cleaner intake and triage process, so every referral does not start from zero.

- How to test a functional hypothesis before jumping to a BIP.

- School-appropriate functional analysis options and the safeguards that go with them.

- How to connect assessment results to a plan staff can use on a regular school day.

- Practical routines for staff training, fidelity checks, progress review, and caseload management.

This is working time, not a run of slides. If you want to compare it with your current caseload, book a call and we can talk it through.`;
      return {
        subject: email.subject,
        text: `${bodyText}\n\n${TRANSFORMATION_CALENDLY_URL}`,
        html: wrapEmail({
          title: "What we actually work on in six live Thursday sessions",
          bodyText,
          buttonHref: TRANSFORMATION_CALENDLY_URL,
          buttonLabel: "Book a fit call",
          footer,
        }),
      };
    }
    case 3: {
      const bodyText = schoolFaKit
        ? `Hi ${name},

If a district needs to review the School BCBA Systems Transformation Program, the approval packet is here:
${TRANSFORMATION_PACKET_URL}

It includes the program description, curriculum, learning objectives, billing language, invoice template, and W-9 instructions.

Here is a straightforward approval request you can use: "I would like to attend this cohort of ${TRANSFORMATION_PROGRAM.cohort.scheduleLabel} because it directly addresses FBA quality, BIP implementation, staff training, and caseload systems in schools."

If your director or business office needs different wording, reply with what they asked for. I will help you write it.`
        : `Hi ${name},

If the district packet is sitting in your downloads folder, I can help you move it forward.

The packet includes the program description, curriculum, learning objectives, billing language, invoice template, and W-9 instructions.

Packet:
${TRANSFORMATION_PACKET_URL}

Here is a straightforward approval request you can use: "I would like to attend this cohort of ${TRANSFORMATION_PROGRAM.cohort.scheduleLabel} because it directly addresses FBA quality, BIP implementation, staff training, and caseload systems in schools."

If your director or business office needs different wording, reply with what they asked for. I will help you write it.`;
      return {
        subject: email.subject,
        text: bodyText,
        html: wrapEmail({
          title: "Need help getting district approval?",
          bodyText,
          buttonHref: TRANSFORMATION_PACKET_URL,
          buttonLabel: "Open the district packet",
          footer,
        }),
      };
    }
    default: {
      const bodyText = `Hi ${name},

I do not want to keep filling your inbox, so this is my last note about the January cohort.

If the program might help, book a short call. I want to hear about your setting before I tell you to enroll.

If it is not a fit, I will tell you. If there is a free resource that fits better, I will point you there.

Book a time here:
${TRANSFORMATION_CALENDLY_URL}

If now is not the right time, you do not need to do anything. I will stop following up about this cohort.`;
      return {
        subject: email.subject,
        text: bodyText,
        html: wrapEmail({
          title: "Should we talk about the January cohort?",
          bodyText,
          buttonHref: TRANSFORMATION_CALENDLY_URL,
          buttonLabel: "Book a fit call",
          footer,
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
