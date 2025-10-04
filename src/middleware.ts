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
  const hasAuthCallback = request.nextUrl.searchParams.has('code'); // OAuth callback

  // Only protect admin routes that are NOT login/auth/callback
  const needsAuth = pathname.startsWith('/admin') && !isLoginPage && !isAuthRoute && !hasAuthCallback;

  if (needsAuth) {
    // Check for any Supabase auth cookies (they follow pattern sb-{project-ref}-auth-token*)
    const cookies = request.cookies.getAll();
    const hasSupabaseAuth = cookies.some(cookie =>
      cookie.name.startsWith('sb-') && cookie.name.includes('auth-token')
    );

    // If no Supabase auth cookies found, redirect to login
    if (!hasSupabaseAuth) {
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

