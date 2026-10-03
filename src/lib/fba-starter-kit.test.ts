import assert from 'node:assert/strict';
import test from 'node:test';
import { validateFbaKitInput } from './fba-starter-kit';

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
