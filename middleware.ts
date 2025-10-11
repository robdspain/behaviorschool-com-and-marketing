import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  await supabase.auth.getSession()

  // Import the centralized authorized admin emails list
  const AUTHORIZED_ADMIN_EMAILS = [
    'robspain@gmail.com',
    'behaviorschoolcommunity@gmail.com',
    'rob@behaviorschool.com'
  ]

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Allow access to login page
    if (request.nextUrl.pathname === '/admin/login') {
      // Check for admin session cookie (Google Identity Services)
      const adminSessionCookie = request.cookies.get('admin_session')?.value

      if (adminSessionCookie) {
        try {
          const sessionData = JSON.parse(adminSessionCookie)
          const userEmail = sessionData.email?.toLowerCase().trim()
          const isAuthorized = AUTHORIZED_ADMIN_EMAILS.includes(userEmail)

          console.log('[Admin Auth] Login page - existing session:', {
            email: userEmail,
            isAuthorized
          })

          if (isAuthorized) {
            // Already logged in with authorized email, redirect to admin
            return NextResponse.redirect(new URL('/admin', request.url))
          }
        } catch (e) {
          console.error('[Admin Auth] Invalid session cookie:', e)
        }
      }

      // No session or unauthorized - show login page
      return response
    }

    // For all other admin routes, check admin_session cookie
    const adminSessionCookie = request.cookies.get('admin_session')?.value

    console.log('[Admin Auth] Checking route access:', {
      path: request.nextUrl.pathname,
      hasCookie: !!adminSessionCookie,
      cookiePreview: adminSessionCookie?.substring(0, 50)
    })

    if (!adminSessionCookie) {
      console.log('[Admin Auth] No admin session, redirecting to login')
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    try {
      const sessionData = JSON.parse(adminSessionCookie)
      const userEmail = sessionData.email?.toLowerCase().trim()
      const isAuthorized = AUTHORIZED_ADMIN_EMAILS.includes(userEmail)

      console.log('[Admin Auth] Route access check:', {
        path: request.nextUrl.pathname,
        email: userEmail,
        isAuthorized,
        sessionData: JSON.stringify(sessionData).substring(0, 100)
      })

      if (!isAuthorized) {
        console.log('[Admin Auth] UNAUTHORIZED - Email not in allowed list:', {
          email: userEmail,
          allowedEmails: AUTHORIZED_ADMIN_EMAILS
        })
        const signOutUrl = new URL('/admin/login', request.url)
        signOutUrl.searchParams.set('error', 'unauthorized')
        const signOutResponse = NextResponse.redirect(signOutUrl)
        signOutResponse.cookies.delete('admin_session')
        return signOutResponse
      }
    } catch (e) {
      console.error('[Admin Auth] Invalid session cookie:', e)
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return response
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