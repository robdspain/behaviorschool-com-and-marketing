import { NextResponse, type NextRequest } from 'next/server'

// Authorized admin emails
const AUTHORIZED_ADMIN_EMAILS = [
  'robspain@gmail.com',
  'behaviorschoolcommunity@gmail.com',
  'rob@behaviorschool.com'
]

export async function middleware(request: NextRequest) {
  // Only protect admin routes
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // Always allow access to login page
  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next()
  }

  // For all other admin routes, check admin_session cookie
  const adminSessionCookie = request.cookies.get('admin_session')?.value

  console.log('[Middleware] Checking admin access:', {
    path: request.nextUrl.pathname,
    hasCookie: !!adminSessionCookie
  })

  if (!adminSessionCookie) {
    console.log('[Middleware] No session cookie - redirecting to login')
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  try {
    const sessionData = JSON.parse(adminSessionCookie)
    const userEmail = sessionData.email?.toLowerCase().trim()
    const isAuthorized = AUTHORIZED_ADMIN_EMAILS.includes(userEmail)

    console.log('[Middleware] Session check:', {
      email: userEmail,
      isAuthorized,
      allowedEmails: AUTHORIZED_ADMIN_EMAILS
    })

    if (!isAuthorized) {
      console.log('[Middleware] UNAUTHORIZED - clearing cookie and redirecting')
      const response = NextResponse.redirect(new URL('/admin/login?error=unauthorized', request.url))
      response.cookies.delete('admin_session')
      return response
    }

    // Authorized - allow access
    console.log('[Middleware] Access granted')
    return NextResponse.next()
  } catch (e) {
    console.error('[Middleware] Invalid session cookie:', e)
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
