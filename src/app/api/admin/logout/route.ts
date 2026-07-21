import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const COOKIE_NAME = 'bs_admin_auth';

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/admin/login', request.url), 303);
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
