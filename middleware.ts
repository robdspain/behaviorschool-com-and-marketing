import { NextResponse, type NextRequest } from 'next/server'

// Routes requiring authentication
function isProtectedRoute(request: NextRequest): boolean {
  const { pathname } = request.nextUrl;
  return (
    pathname.startsWith('/masterclass/course') ||
    pathname.startsWith('/masterclass/certificate')
  );
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add noindex header for admin and test pages
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/admin') || pathname.startsWith('/test')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  if (isProtectedRoute(request)) {
    // Check for Better Auth JWT cookie (set by the convex plugin)
    const jwtCookie = request.cookies.get('convex_jwt')?.value;
    if (!jwtCookie) {
      // Not authenticated — redirect to masterclass landing
      return NextResponse.redirect(new URL('/masterclass', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Exclude API routes and static assets from middleware
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
