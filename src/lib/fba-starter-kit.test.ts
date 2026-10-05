import assert from 'node:assert/strict';
import test from 'node:test';
import {
  FBA_KIT_DELIVERY_BUTTON,
  FBA_KIT_DELIVERY_CONSENT,
  FBA_KIT_DOWNLOAD_PATH,
  FBA_KIT_DOWNLOAD_URL,
  FBA_KIT_EMAIL_LINK_STYLE,
  FBA_KIT_FETCH_ERROR,
  FBA_KIT_GATED,
  FBA_KIT_GATED_BUTTON,
  FBA_KIT_GATED_CONSENT,
  FBA_KIT_GATED_INTRO,
  FBA_KIT_GATED_SUCCESS,
  FBA_KIT_GRAPHING_TEMPLATE_COPY_URL,
  buildFbaKitContactArgs,
  buildFbaKitDeliveryEmail,
  fbaKitSendsDeliveryEmail,
  fbaKitSuccessShowsDownload,
  validateFbaKitInput,
} from './fba-starter-kit';

const valid = { name: 'Taylor Example', email: 'taylor@example.com', role: 'school BCBA', consent: true, website: '' };

test('accepts valid starter kit input', () => {
  assert.equal(validateFbaKitInput(valid).ok, true);
});

test('rejects missing consent', () => {
  assert.equal(validateFbaKitInput({ ...valid, consent: false }).ok, false);
});

test('rejects an invalid role', () => {
  assert.equal(validateFbaKitInput({ ...valid, role: 'teacher' }).ok, false);
});

test('rejects an invalid email', () => {
  assert.equal(validateFbaKitInput({ ...valid, email: 'not-an-email' }).ok, false);
});

test('rejects a filled honeypot', () => {
  assert.equal(validateFbaKitInput({ ...valid, website: 'spam' }).ok, false);
});

const contactInput = {
  firstName: 'Taylor',
  lastName: 'Example',
  email: 'taylor@example.com',
  role: 'school BCBA' as const,
};
const now = new Date('2026-10-03T12:34:56.000Z');

test('builds the current create behavior for a new contact', () => {
  assert.deepEqual(buildFbaKitContactArgs(null, contactInput, now, false), {
    ...contactInput,
    status: 'lead',
    leadSource: 'calaba-fba-20261009',
    tags: ['calaba-fba-20261009'],
    notes: 'Consent: Email me the School FA starter kit. Consent recorded through the event page.',
    revenue: 0,
  });
});

test('creates a lead with notify consent while the kit is gated', () => {
  assert.equal(FBA_KIT_GATED, true);
  const args = buildFbaKitContactArgs(null, contactInput, now);
  assert.equal(args.status, 'lead');
  assert.equal(args.leadSource, 'calaba-fba-20261009');
  assert.equal(args.revenue, 0);
  assert.equal(args.role, contactInput.role);
  assert.equal(args.firstName, contactInput.firstName);
  assert.equal(args.notes, 'Consent: Notify me when the School FA starter kit is ready. Consent recorded through the event page.');
});

type StoredContact = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  leadSource: string;
  tags: string[];
  notes: string;
  revenue: number;
};

function applyUpsert(existing: StoredContact | null, args: {
  firstName: string;
  lastName?: string;
  email: string;
  role?: string;
  status?: string;
  leadSource?: string;
  tags?: string[];
  notes?: string;
  revenue?: number;
}): StoredContact {
  if (!existing) {
    return {
      firstName: args.firstName.trim(),
      lastName: args.lastName?.trim() ?? '',
      email: args.email.trim(),
      role: args.role ?? '',
      status: args.status ?? 'lead',
      leadSource: args.leadSource ?? '',
      tags: args.tags ?? [],
      notes: args.notes ?? '',
      revenue: args.revenue ?? 0,
    };
  }

  return {
    ...existing,
    firstName: args.firstName.trim(),
    lastName: args.lastName !== undefined ? args.lastName.trim() : existing.lastName,
    email: args.email.trim(),
    role: args.role ?? existing.role,
    status: args.status ?? existing.status,
    leadSource: args.leadSource ?? existing.leadSource,
    tags: args.tags ?? existing.tags,
    notes: args.notes ?? existing.notes,
    revenue: args.revenue ?? existing.revenue,
  };
}

test('preserves existing customer fields while adding the kit request', () => {
  const existing: StoredContact = {
    firstName: 'Existing',
    lastName: 'Customer',
    email: 'taylor@example.com',
    role: 'District BCBA',
    status: 'customer',
    leadSource: 'transformation-program',
    tags: ['transformation-2027-01'],
    notes: 'Original CRM note',
    revenue: 1997,
  };
  const args = buildFbaKitContactArgs(existing, contactInput, now, false);

  assert.equal(args.firstName, 'Existing');
  assert.equal('lastName' in args, false);
  assert.equal('role' in args, false);
  assert.equal('status' in args, false);
  assert.equal('leadSource' in args, false);
  assert.equal('revenue' in args, false);
  assert.deepEqual(args.tags, ['transformation-2027-01', 'calaba-fba-20261009']);
  assert.equal(
    args.notes,
    'Original CRM note\n2026-10-03T12:34:56.000Z: Consent: Email me the School FA starter kit. Consent recorded through the event page.',
  );

  const saved = applyUpsert(existing, args);
  assert.equal(saved.status, 'customer');
  assert.equal(saved.revenue, 1997);
  assert.equal(saved.firstName, 'Existing');
  assert.equal(saved.lastName, 'Customer');
  assert.equal(saved.role, 'District BCBA');
  assert.equal(saved.leadSource, 'transformation-program');
  assert.deepEqual(saved.tags, ['transformation-2027-01', 'calaba-fba-20261009']);
  assert.ok(saved.notes.startsWith('Original CRM note\n'));
  assert.ok(saved.notes.includes('Consent: Email me the School FA starter kit.'));
});

test('a new email becomes a lead and an existing email keeps customer fields', () => {
  const created = applyUpsert(null, buildFbaKitContactArgs(null, contactInput, now, false));
  assert.equal(created.status, 'lead');
  assert.equal(created.revenue, 0);
  assert.equal(created.leadSource, 'calaba-fba-20261009');
  assert.equal(created.role, 'school BCBA');
  assert.deepEqual(created.tags, ['calaba-fba-20261009']);

  const customer: StoredContact = {
    firstName: 'Paying',
    lastName: 'Customer',
    email: 'paying@example.com',
    role: 'Director',
    status: 'customer',
    leadSource: 'stripe',
    tags: ['cohort-2026'],
    notes: 'Paid in full',
    revenue: 1997,
  };
  const saved = applyUpsert(customer, buildFbaKitContactArgs(customer, {
    ...contactInput,
    firstName: 'Different',
    lastName: 'Name',
    role: 'student',
  }, now));
  assert.equal(saved.status, 'customer');
  assert.equal(saved.revenue, 1997);
  assert.equal(saved.firstName, 'Paying');
  assert.equal(saved.lastName, 'Customer');
  assert.equal(saved.role, 'Director');
  assert.equal(saved.leadSource, 'stripe');
  assert.deepEqual(saved.tags, ['cohort-2026', 'calaba-fba-20261009']);
  assert.ok(saved.notes.startsWith('Paid in full\n'));
});

test('delivery email lists the kit first, then the graphing template, with a shared 44px link style', () => {
  assert.equal(FBA_KIT_DOWNLOAD_PATH, '/downloads/school-fa-starter-kit.pdf');
  assert.equal(FBA_KIT_DOWNLOAD_URL, 'https://behaviorschool.com/downloads/school-fa-starter-kit.pdf');
  assert.ok(FBA_KIT_GRAPHING_TEMPLATE_COPY_URL.endsWith('/copy'));

  const { html, text } = buildFbaKitDeliveryEmail(' Taylor');
  const kitHref = 'https://behaviorschool.com/downloads/school-fa-starter-kit.pdf';
  const sheetHref = 'https://docs.google.com/spreadsheets/d/1zcAQRlsqUSJxuYEQWXlYciby4kIzQsrnZURgUFn3GPs/copy';
  const sharedStyle = 'display:inline-block;min-height:44px;line-height:44px;color:#1f4d3f;text-decoration:underline';
  assert.equal(FBA_KIT_EMAIL_LINK_STYLE, sharedStyle);

  const kitIndex = html.indexOf(`href="${kitHref}"`);
  const sheetIndex = html.indexOf(`href="${sheetHref}"`);
  assert.ok(kitIndex > -1);
  assert.ok(sheetIndex > kitIndex);
  assert.ok(html.includes(`href="${kitHref}" style="${sharedStyle}"`));
  assert.ok(html.includes(`href="${sheetHref}" style="${sharedStyle}"`));
  assert.ok(kitHref.endsWith('/downloads/school-fa-starter-kit.pdf'));
  assert.ok(sheetHref.endsWith('/copy'));
  assert.ok(text.includes(kitHref));
  assert.ok(text.includes(sheetHref));
  assert.ok(text.indexOf(kitHref) < text.indexOf(sheetHref));
  assert.ok(html.includes('Robert Spain, BCBA, IBA'));
  assert.ok(text.includes('Robert Spain, BCBA, IBA'));
  assert.equal(buildFbaKitDeliveryEmail(' <script>').html.includes('<script>'), false);
  assert.ok(buildFbaKitDeliveryEmail(' <script>').html.includes('&lt;script&gt;'));
});

test('gated copy does not promise an immediate download and does not send the file', () => {
  assert.equal(FBA_KIT_GATED, true);
  assert.equal(fbaKitSendsDeliveryEmail(), false);
  assert.equal(fbaKitSuccessShowsDownload(), false);
  for (const copy of [FBA_KIT_GATED_INTRO, FBA_KIT_GATED_CONSENT, FBA_KIT_GATED_BUTTON, FBA_KIT_GATED_SUCCESS, FBA_KIT_FETCH_ERROR]) {
    assert.equal(/download/i.test(copy), false, copy);
  }
  assert.match(FBA_KIT_GATED_INTRO, /coming soon/i);
  assert.match(FBA_KIT_GATED_BUTTON, /Notify me/);
  assert.match(FBA_KIT_DELIVERY_CONSENT, /Email me the School FA starter kit/);
  assert.equal(FBA_KIT_DELIVERY_BUTTON, 'Email me the starter kit');
});

test('preview event page stays out of the sitemap', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () => {
    throw new Error('indexing api unavailable in test');
  }) as typeof fetch;
  try {
    const { buildSitemap } = await import('../app/sitemap');
    const entries = await buildSitemap('https://behaviorschool.com', '2026-10-05T00:00:00.000Z');
    assert.equal(
      entries.some((entry) => entry.url.includes('/events/fba-in-a-school-setting')),
      false,
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('does not duplicate the kit tag for an existing contact', () => {
  const args = buildFbaKitContactArgs({
    firstName: 'Existing',
    tags: ['calaba-fba-20261009'],
  }, contactInput, now);

  assert.deepEqual(args.tags, ['calaba-fba-20261009']);
});
