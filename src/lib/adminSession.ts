import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from 'crypto';

const SESSION_MAX_AGE = 60 * 60 * 24;
const HANDOFF_MAX_AGE = 2 * 60;
const NEWSLETTER_GRANT_MAX_AGE = 60 * 60 * 24 * 7;

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

function signHex(value: string) {
  const secret = sessionSecret();
  if (!secret) return null;
  return createHmac('sha256', secret).update(value).digest('hex');
}

export function makeAdminSessionToken() {
  const issuedAt = Date.now().toString(36);
  const nonce = randomBytes(18).toString('hex');
  const payload = `${issuedAt}.${nonce}`;
  const signature = signHex(payload);
  if (!signature) throw new Error('admin_session_secret_missing');
  return `${issuedAt}_${nonce}_${signature}`;
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

  const isHexToken = token.includes('_');
  const [issuedAt, nonce, signature] = token.split(isHexToken ? '_' : '.');
  if (!issuedAt || !nonce || !signature) return false;

  const timestamp = parseInt(issuedAt, 36);
  if (Number.isNaN(timestamp)) return false;
  const age = Date.now() - timestamp;
  if (age < 0 || age > SESSION_MAX_AGE * 1000) return false;

  const expected = isHexToken
    ? signHex(`${issuedAt}.${nonce}`)
    : sign(`${issuedAt}.${nonce}`);
  if (!expected) return false;

  const encoding = isHexToken ? 'hex' : 'utf8';
  const expectedBuffer = Buffer.from(expected, encoding);
  const signatureBuffer = Buffer.from(signature, encoding);
  if (expectedBuffer.length !== signatureBuffer.length) return false;

  return timingSafeEqual(expectedBuffer, signatureBuffer);
}

function newsletterGrantKey() {
  const secret = sessionSecret();
  if (!secret) throw new Error('admin_session_secret_missing');
  return createHash('sha256')
    .update(`${secret}:newsletter-auth-grant`)
    .digest();
}

export function makeNewsletterAuthGrant(sessionToken: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', newsletterGrantKey(), iv);
  const plaintext = `${Date.now().toString(36)}.${sessionToken}`;
  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return [
    iv.toString('base64url'),
    tag.toString('base64url'),
    encrypted.toString('base64url'),
  ].join('.');
}

export function readNewsletterAuthGrant(grant: string | undefined | null) {
  if (!grant) return null;
  const [ivValue, tagValue, encryptedValue] = grant.split('.');
  if (!ivValue || !tagValue || !encryptedValue) return null;

  try {
    const decipher = createDecipheriv(
      'aes-256-gcm',
      newsletterGrantKey(),
      Buffer.from(ivValue, 'base64url'),
    );
    decipher.setAuthTag(Buffer.from(tagValue, 'base64url'));
    const plaintext = Buffer.concat([
      decipher.update(Buffer.from(encryptedValue, 'base64url')),
      decipher.final(),
    ]).toString('utf8');
    const separator = plaintext.indexOf('.');
    if (separator < 1) return null;

    const issuedAt = parseInt(plaintext.slice(0, separator), 36);
    const sessionToken = plaintext.slice(separator + 1);
    const age = Date.now() - issuedAt;
    if (
      Number.isNaN(issuedAt) ||
      age < 0 ||
      age > NEWSLETTER_GRANT_MAX_AGE * 1000 ||
      !sessionToken
    ) {
      return null;
    }
    return sessionToken;
  } catch {
    return null;
  }
}

export { SESSION_MAX_AGE as ADMIN_SESSION_MAX_AGE };
