import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Add X-Robots-Tag for non-primary hosts and admin routes
export function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const host = request.headers.get('host')?.toLowerCase() || '';
  const pathname = request.nextUrl.pathname || '';

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

