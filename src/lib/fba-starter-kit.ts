export const FBA_KIT_GATED = true;
export const FBA_KIT_SOURCE = 'calaba-fba-20261009';
export const FBA_KIT_DOWNLOAD_PATH = '/downloads/school-fa-starter-kit-PLACEHOLDER.pdf';
export const FBA_KIT_DOWNLOAD_URL = `https://behaviorschool.com${FBA_KIT_DOWNLOAD_PATH}`;

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

const FBA_KIT_NOTE = 'requested School FA starter kit (calaba-fba-20261009), consent given on the event page';
const MAX_CRM_NOTES_LENGTH = 8000;

export function buildFbaKitContactArgs(
  existing: FbaKitExistingContact | null,
  input: FbaKitContactInput,
  now = new Date(),
) {
  const note = `${now.toISOString()}: ${FBA_KIT_NOTE}`;
  const notes = existing?.notes ? `${existing.notes}\n${note}` : note;
  const mergedNotes = notes.length > MAX_CRM_NOTES_LENGTH ? notes.slice(-MAX_CRM_NOTES_LENGTH) : notes;
  const tags = Array.from(new Set([...(existing?.tags ?? []), FBA_KIT_SOURCE]));

  if (existing) {
    return {
      firstName: existing.firstName || input.firstName,
      lastName: existing.lastName || input.lastName,
      email: input.email,
      role: input.role,
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
    notes: 'Consent: Email me the School FA starter kit. Consent recorded through the event page.',
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
