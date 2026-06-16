export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'bs_admin_session';
const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours

function isValidToken(token: string): boolean {
  // Token format: "<timestamp_base36>.<random>"
  // Valid for SESSION_MAX_AGE seconds
  const [tsPart] = token.split('.');
  if (!tsPart) return false;
  const ts = parseInt(tsPart, 36);
  if (isNaN(ts)) return false;
  return Date.now() - ts < SESSION_MAX_AGE * 1000;
}

// POST /api/admin/auth — legacy password login is disabled. Use Google OAuth.
export async function POST(request: NextRequest) {
  await request.json().catch(() => ({}));
  return NextResponse.json(
    { ok: false, error: 'Admin password login has been replaced with Google sign-in.' },
    { status: 410 },
  );
}

// GET /api/admin/auth — check if session is valid
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const authenticated = !!token && isValidToken(token);
  return NextResponse.json({ authenticated });
}

// DELETE /api/admin/auth — logout
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  return NextResponse.json({ ok: true });
}
