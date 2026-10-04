import assert from 'node:assert/strict';
import test from 'node:test';
import {
  FBA_KIT_DOWNLOAD_PATH,
  FBA_KIT_DOWNLOAD_URL,
  FBA_KIT_EMAIL_LINK_STYLE,
  FBA_KIT_GRAPHING_TEMPLATE_COPY_URL,
  buildFbaKitContactArgs,
  buildFbaKitDeliveryEmail,
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
  assert.deepEqual(buildFbaKitContactArgs(null, contactInput, now), {
    ...contactInput,
    status: 'lead',
    leadSource: 'calaba-fba-20261009',
    tags: ['calaba-fba-20261009'],
    notes: 'Consent: Email me the School FA starter kit. Consent recorded through the event page.',
    revenue: 0,
  });
});

test('preserves existing customer fields while adding the kit request', () => {
  const args = buildFbaKitContactArgs({
    firstName: 'Existing',
    lastName: 'Customer',
    tags: ['transformation-2027-01'],
    notes: 'Original CRM note',
    status: 'customer',
    revenue: 1997,
  }, contactInput, now);

  assert.deepEqual(args, {
    firstName: 'Existing',
    lastName: 'Customer',
    email: contactInput.email,
    role: contactInput.role,
    tags: ['transformation-2027-01', 'calaba-fba-20261009'],
    notes: 'Original CRM note\n2026-10-03T12:34:56.000Z: requested School FA starter kit (calaba-fba-20261009), consent given on the event page',
  });
  assert.equal('status' in args, false);
  assert.equal('revenue' in args, false);
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
});

test('does not duplicate the kit tag for an existing contact', () => {
  const args = buildFbaKitContactArgs({
    firstName: 'Existing',
    tags: ['calaba-fba-20261009'],
  }, contactInput, now);

  assert.deepEqual(args.tags, ['calaba-fba-20261009']);
});
