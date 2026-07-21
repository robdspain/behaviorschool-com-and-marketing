import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie';

export const dynamic = 'force-dynamic';

const COOKIE_NAMES = ['bs_admin_auth', 'bs_admin_session'];

export async function GET(request: NextRequest) {
  const baseUrl = (process.env.ADMIN_OAUTH_BASE_URL || process.env.NEXTAUTH_URL || request.url)
    .replace(/\/$/, '');
  const loginUrl = new URL('/admin/login', baseUrl).toString();
  const response = new NextResponse(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="refresh" content="0;url=${loginUrl}">
    <title>Signing out</title>
  </head>
  <body>
    <script>window.location.replace(${JSON.stringify(loginUrl)});</script>
  </body>
</html>`, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
  for (const cookieName of COOKIE_NAMES) {
    response.cookies.set(cookieName, '', {
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });
    response.headers.append('Set-Cookie', serialize(cookieName, '', {
      domain: 'behaviorschool.com',
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    }));
  }
  response.headers.set('Cache-Control', 'no-store, max-age=0');
  return response;
}
