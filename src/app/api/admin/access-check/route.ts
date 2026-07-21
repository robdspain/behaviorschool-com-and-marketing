export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isValidAdminSessionToken } from '@/lib/adminSession';

const COOKIE_NAME = 'bs_admin_auth';

export async function GET() {
  const cookieStore = await cookies();
  const tokens = cookieStore.getAll(COOKIE_NAME).map((cookie) => cookie.value);
  const authenticated = tokens.some((token) => isValidAdminSessionToken(token));

  return NextResponse.json({ authenticated }, {
    headers: { 'Cache-Control': 'no-store, max-age=0' },
  });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  return NextResponse.json({ ok: true }, {
    headers: { 'Cache-Control': 'no-store, max-age=0' },
  });
}
