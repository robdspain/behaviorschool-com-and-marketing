import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const COOKIE_NAME = 'bs_admin_auth';

export async function GET(request: NextRequest) {
  const baseUrl = (process.env.ADMIN_OAUTH_BASE_URL || process.env.NEXTAUTH_URL || request.url)
    .replace(/\/$/, '');
  const response = NextResponse.redirect(new URL('/admin/login', baseUrl), 303);
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  response.headers.set('Cache-Control', 'no-store, max-age=0');
  return response;
}
