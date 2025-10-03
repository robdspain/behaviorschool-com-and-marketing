import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Add X-Robots-Tag for non-primary hosts and admin routes
export async function middleware(request: NextRequest) {
  const host = request.headers.get('host')?.toLowerCase() || '';
  const pathname = request.nextUrl.pathname || '';

  // Admin route protection - redirect to login if not authenticated
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    // Check for Supabase auth session cookies
    const supabaseAuthToken = request.cookies.get('sb-dugolglucuzolzvuqxmi-auth-token');
    const supabaseAccessToken = request.cookies.get('sb-access-token');
    const supabaseRefreshToken = request.cookies.get('sb-refresh-token');

    // If no Supabase auth cookies found, redirect to login
    if (!supabaseAuthToken && !supabaseAccessToken && !supabaseRefreshToken) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('error', 'unauthorized');
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

