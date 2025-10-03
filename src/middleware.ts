import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Add X-Robots-Tag for non-primary hosts and admin routes
export async function middleware(request: NextRequest) {
  const host = request.headers.get('host')?.toLowerCase() || '';
  const pathname = request.nextUrl.pathname || '';

  // Admin route protection - redirect to login if not authenticated
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Check for auth session cookie
    const sessionCookie = request.cookies.get('next-auth.session-token') ||
                         request.cookies.get('__Secure-next-auth.session-token');

    if (!sessionCookie) {
      // Redirect to login page with callback URL
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const res = NextResponse.next();
  const allowedHosts = new Set(['behaviorschool.com', 'www.behaviorschool.com']);
  let shouldNoIndex = false;

  // Noindex all non-primary hosts (e.g., staging, ghost subdomain if ever proxied)
  if (!allowedHosts.has(host)) {
    shouldNoIndex = true;
  }

  // Noindex admin routes and related API endpoints
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    shouldNoIndex = true;
  }

  if (shouldNoIndex) {
    res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|sw.js).*)'],
};

