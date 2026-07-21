import { createHmac, randomBytes, timingSafeEqual } from 'crypto';

const SESSION_MAX_AGE = 60 * 60 * 24;
const HANDOFF_MAX_AGE = 2 * 60;

function sessionSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.GOOGLE_CLIENT_SECRET ||
    process.env.ADMIN_GOOGLE_CLIENT_SECRET ||
    process.env.AUTH_GOOGLE_SECRET ||
    ''
  );
}

function sign(value: string) {
  const secret = sessionSecret();
  if (!secret) return null;
  return createHmac('sha256', secret).update(value).digest('base64url');
}

export function makeAdminSessionToken() {
  const issuedAt = Date.now().toString(36);
  const nonce = randomBytes(18).toString('hex');
  const payload = `${issuedAt}.${nonce}`;
  const signature = sign(payload);
  if (!signature) throw new Error('admin_session_secret_missing');
  return `${payload}.${signature}`;
}

export function makeAdminHandoffToken() {
  const issuedAt = Date.now().toString(36);
  const nonce = randomBytes(18).toString('hex');
  const payload = `${issuedAt}.${nonce}`;
  const signature = sign(`handoff.${payload}`);
  if (!signature) throw new Error('admin_session_secret_missing');
  return `${payload}.${signature}`;
}

export function isValidAdminHandoffToken(token: string | undefined | null) {
  if (!token) return false;

  const [issuedAt, nonce, signature] = token.split('.');
  if (!issuedAt || !nonce || !signature) return false;

  const timestamp = parseInt(issuedAt, 36);
  if (Number.isNaN(timestamp)) return false;
  const age = Date.now() - timestamp;
  if (age < 0 || age > HANDOFF_MAX_AGE * 1000) return false;

  const expected = sign(`handoff.${issuedAt}.${nonce}`);
  if (!expected) return false;

  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);
  if (expectedBuffer.length !== signatureBuffer.length) return false;

  return timingSafeEqual(expectedBuffer, signatureBuffer);
}

export function isValidAdminSessionToken(token: string | undefined | null) {
  if (!token) return false;

  const [issuedAt, nonce, signature] = token.split('.');
  if (!issuedAt || !nonce || !signature) return false;

  const timestamp = parseInt(issuedAt, 36);
  if (Number.isNaN(timestamp)) return false;
  if (Date.now() - timestamp > SESSION_MAX_AGE * 1000) return false;

  const expected = sign(`${issuedAt}.${nonce}`);
  if (!expected) return false;

  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);
  if (expectedBuffer.length !== signatureBuffer.length) return false;

  return timingSafeEqual(expectedBuffer, signatureBuffer);
}

export { SESSION_MAX_AGE as ADMIN_SESSION_MAX_AGE };
