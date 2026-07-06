export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isValidAdminSessionToken } from '@/lib/adminSession';

const COOKIE_NAME = 'bs_admin_session';

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
  const authenticated = isValidAdminSessionToken(token);
  return NextResponse.json({ authenticated });
}

// DELETE /api/admin/auth — logout
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  return NextResponse.json({ ok: true });
}
