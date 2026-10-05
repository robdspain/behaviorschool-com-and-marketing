// True until Rob supplies the real kit and the page is approved for publication.
// While gated, the form only collects a notify-me request and does not email a file.
export const FBA_KIT_GATED = true;
export const FBA_KIT_SOURCE = 'calaba-fba-20261009';
// Not delivered while FBA_KIT_GATED is true. Swap this only after the real kit is approved.
export const FBA_KIT_DOWNLOAD_PATH = '/downloads/school-fa-starter-kit.pdf';
export const FBA_KIT_GRAPHING_TEMPLATE_COPY_URL = 'https://docs.google.com/spreadsheets/d/1zcAQRlsqUSJxuYEQWXlYciby4kIzQsrnZURgUFn3GPs/copy';
export const FBA_KIT_DOWNLOAD_URL = `https://behaviorschool.com${FBA_KIT_DOWNLOAD_PATH}`;
export const FBA_KIT_EMAIL_LINK_STYLE = 'display:inline-block;min-height:44px;line-height:44px;color:#1f4d3f;text-decoration:underline';

export const FBA_KIT_ROLES = ['school BCBA', 'clinic BCBA', 'student', 'other'] as const;
export type FbaKitRole = (typeof FBA_KIT_ROLES)[number];

export type FbaKitInput = {
  name?: unknown;
  email?: unknown;
  role?: unknown;
  consent?: unknown;
  website?: unknown;
};

export type FbaKitContactInput = {
  firstName: string;
  lastName: string;
  email: string;
  role: FbaKitRole;
};

export type FbaKitExistingContact = {
  firstName?: string | null;
  lastName?: string | null;
  tags?: string[] | null;
  notes?: string | null;
  status?: string | null;
  revenue?: number | null;
};

const FBA_KIT_DELIVERY_CONSENT_NOTE = 'Consent: Email me the School FA starter kit. Consent recorded through the event page.';
const FBA_KIT_NOTIFY_CONSENT_NOTE = 'Consent: Notify me when the School FA starter kit is ready. Consent recorded through the event page.';
const MAX_CRM_NOTES_LENGTH = 8000;

export const FBA_KIT_GATED_INTRO = 'The School FA starter kit is coming soon. Notify me when it is ready.';
export const FBA_KIT_GATED_CONSENT = 'Notify me when the School FA starter kit is ready. I understand Behavior School will store my name, email, and role.';
export const FBA_KIT_GATED_BUTTON = 'Notify me';
export const FBA_KIT_GATED_SUCCESS = "You're on the list. The School FA starter kit is coming soon.";
export const FBA_KIT_DELIVERY_INTRO = 'Get the starter kit by email.';
export const FBA_KIT_DELIVERY_CONSENT = 'Email me the School FA starter kit. I understand Behavior School will store my name, email, and role.';
export const FBA_KIT_DELIVERY_BUTTON = 'Email me the starter kit';
export const FBA_KIT_DELIVERY_SUCCESS = 'We emailed the starter kit to you.';
export const FBA_KIT_FETCH_ERROR = 'We could not reach the server. Check your connection and try again.';

export function fbaKitConsentNote(gated = FBA_KIT_GATED) {
  return gated ? FBA_KIT_NOTIFY_CONSENT_NOTE : FBA_KIT_DELIVERY_CONSENT_NOTE;
}

export function fbaKitSendsDeliveryEmail(gated = FBA_KIT_GATED) {
  return !gated;
}

export function fbaKitSuccessShowsDownload(gated = FBA_KIT_GATED) {
  return !gated;
}

export function buildFbaKitContactArgs(
  existing: FbaKitExistingContact | null,
  input: FbaKitContactInput,
  now = new Date(),
  gated = FBA_KIT_GATED,
) {
  const consentNote = fbaKitConsentNote(gated);
  const note = `${now.toISOString()}: ${consentNote}`;
  const notes = existing?.notes ? `${existing.notes}\n${note}` : note;
  const mergedNotes = notes.length > MAX_CRM_NOTES_LENGTH ? notes.slice(-MAX_CRM_NOTES_LENGTH) : notes;
  const tags = Array.from(new Set([...(existing?.tags ?? []), FBA_KIT_SOURCE]));

  if (existing) {
    // upsertContact requires firstName and patches every supplied field.
    // Pass the stored first name so the submitted name is not written.
    // Omit lastName, role, status, leadSource, and revenue so those stay as stored.
    return {
      firstName: existing.firstName ?? '',
      email: input.email,
      tags,
      notes: mergedNotes,
    };
  }

  return {
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    role: input.role,
    status: 'lead' as const,
    leadSource: FBA_KIT_SOURCE,
    tags: [FBA_KIT_SOURCE],
    notes: consentNote,
    revenue: 0,
  };
}

export function validateFbaKitInput(input: FbaKitInput) {
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
  const role = typeof input.role === 'string' ? input.role : '';
  const website = typeof input.website === 'string' ? input.website.trim() : '';

  if (website) return { ok: false as const, error: 'Please leave the hidden field blank.' };
  if (!name || name.length > 120) return { ok: false as const, error: 'Name is required.' };
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false as const, error: 'Enter a valid email address.' };
  }
  if (!FBA_KIT_ROLES.includes(role as FbaKitRole)) {
    return { ok: false as const, error: 'Select your role.' };
  }
  if (input.consent !== true) return { ok: false as const, error: 'Consent is required.' };

  return { ok: true as const, name, email, role: role as FbaKitRole };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function buildFbaKitDeliveryEmail(firstNameForEmail: string) {
  const safeName = escapeHtml(firstNameForEmail);
  const subject = 'Your School FA starter kit';
  const text = `Hi${firstNameForEmail},

Thanks for joining the Oct 9 CEU, Functional Behavior Assessment in a School Setting, Friday, October 9, 2026, 12 to 1 PM Pacific Time.

Download your School FA starter kit:
${FBA_KIT_DOWNLOAD_URL}

Make your own copy of the graphing template:
${FBA_KIT_GRAPHING_TEMPLATE_COPY_URL}

Event page:
https://behaviorschool.com/events/fba-in-a-school-setting

Robert Spain, BCBA, IBA
Behavior School`;
  const html = `<p>Hi${safeName},</p>
<p>Thanks for joining the Oct 9 CEU, Functional Behavior Assessment in a School Setting, Friday, October 9, 2026, 12 to 1 PM Pacific Time.</p>
<p><a href="${FBA_KIT_DOWNLOAD_URL}" style="${FBA_KIT_EMAIL_LINK_STYLE}">Download your School FA starter kit</a></p>
<p><a href="${FBA_KIT_GRAPHING_TEMPLATE_COPY_URL}" style="${FBA_KIT_EMAIL_LINK_STYLE}">Make your own copy of the graphing template</a></p>
<p><a href="https://behaviorschool.com/events/fba-in-a-school-setting" style="color:#1f4d3f;text-decoration:underline">Visit the event page</a></p>
<p>Robert Spain, BCBA, IBA<br>Behavior School</p>
<hr style="border:0;border-top:1px solid #d9cdb8"><p style="font-size:14px;color:#365548">Behavior School LLC<br>8 The Green #20473<br>Dover, DE 19901<br>United States</p>
<p style="font-size:14px;color:#365548">This is a transactional delivery email. <a href="mailto:support@behaviorschool.com?subject=Unsubscribe" style="color:#1f4d3f;text-decoration:underline">Unsubscribe</a></p>`;

  return { subject, text, html };
}
