import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Add X-Robots-Tag for non-primary hosts and admin routes
export async function middleware(request: NextRequest) {
  const host = request.headers.get('host')?.toLowerCase() || '';
  const pathname = request.nextUrl.pathname || '';

  // Admin route protection - redirect to login if not authenticated
  // IMPORTANT: Check exclusions BEFORE checking if it's an admin route
  const isAuthRoute = pathname.startsWith('/api/auth');
  const isLoginPage = pathname.includes('/login'); // More permissive - catches any login path

  // Only protect admin routes that are NOT login/auth
  const needsAuth = pathname.startsWith('/admin') && !isLoginPage && !isAuthRoute;

  if (needsAuth) {
    // Check for admin session cookie (set by Google Identity Services)
    const adminSession = request.cookies.get('admin_session');

    // If no admin session found, redirect to login
    if (!adminSession) {
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

