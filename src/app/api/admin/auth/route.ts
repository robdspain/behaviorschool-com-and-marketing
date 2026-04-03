export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { logAuthEvent, extractRequestMeta } from '@/lib/audit-logger';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'behavior-school-admin-2024';
const COOKIE_NAME = 'bs_admin_session';
const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours

function makeToken(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2);
  return `${ts}.${rand}`;
}

function isValidToken(token: string): boolean {
  // Token format: "<timestamp_base36>.<random>"
  // Valid for SESSION_MAX_AGE seconds
  const [tsPart] = token.split('.');
  if (!tsPart) return false;
  const ts = parseInt(tsPart, 36);
  if (isNaN(ts)) return false;
  return Date.now() - ts < SESSION_MAX_AGE * 1000;
}

// POST /api/admin/auth — login with password
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({ password: '', email: '' }));
  const { password, email } = body;
  const requestMeta = extractRequestMeta(request);

  if (!password || password !== ADMIN_PASSWORD) {
    // L2: Log failed login attempt
    logAuthEvent({
      action: 'LOGIN_FAILURE',
      actorEmail: email || 'unknown',
      actorRole: 'admin',
      success: false,
      httpStatus: 401,
      errorMessage: 'Invalid password',
      ...requestMeta,
    });
    return NextResponse.json({ ok: false, error: 'Invalid password' }, { status: 401 });
  }

  const token = makeToken();
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });

  // L2: Log successful admin login
  logAuthEvent({
    action: 'LOGIN_SUCCESS',
    actorEmail: email || 'admin',
    actorRole: 'admin',
    success: true,
    httpStatus: 200,
    ...requestMeta,
  });

  return NextResponse.json({ ok: true });
}

// GET /api/admin/auth — check if session is valid
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const authenticated = !!token && isValidToken(token);
  return NextResponse.json({ authenticated });
}

// DELETE /api/admin/auth — logout
export async function DELETE(request: NextRequest) {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);

  // L2: Log logout
  logAuthEvent({
    action: 'LOGOUT',
    actorEmail: 'admin',
    actorRole: 'admin',
    success: true,
    httpStatus: 200,
    ...extractRequestMeta(request),
  });

  return NextResponse.json({ ok: true });
}
