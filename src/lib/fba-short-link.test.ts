import assert from 'node:assert/strict';
import test from 'node:test';
import { buildFbaShortLinkDestination } from './fba-short-link';

test('adds default UTM parameters when the short link has no query', () => {
  assert.equal(
    buildFbaShortLinkDestination('https://behaviorschool.com/fba'),
    'https://behaviorschool.com/events/fba-in-a-school-setting?utm_source=calaba&utm_medium=slide&utm_campaign=fba-20261009',
  );
});

test('keeps an incoming QR medium and other parameters', () => {
  assert.equal(
    buildFbaShortLinkDestination('https://behaviorschool.com/fba?utm_medium=qr&utm_content=deck'),
    'https://behaviorschool.com/events/fba-in-a-school-setting?utm_medium=qr&utm_content=deck&utm_source=calaba&utm_campaign=fba-20261009',
  );
});

test('incoming source, campaign, and content values win over defaults', () => {
  assert.equal(
    buildFbaShortLinkDestination('https://behaviorschool.com/fba?utm_source=x&utm_campaign=y&utm_content=z'),
    'https://behaviorschool.com/events/fba-in-a-school-setting?utm_source=x&utm_campaign=y&utm_content=z&utm_medium=slide',
  );
});

test('supports a trailing slash', () => {
  assert.equal(
    buildFbaShortLinkDestination('https://behaviorschool.com/fba/'),
    'https://behaviorschool.com/events/fba-in-a-school-setting?utm_source=calaba&utm_medium=slide&utm_campaign=fba-20261009',
  );
});
