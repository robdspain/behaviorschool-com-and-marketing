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
  const { data: { session }, error } = await supabase.auth.getSession()

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
      // If there's an error parameter, always show the login page (prevents redirect loop)
      if (request.nextUrl.searchParams.has('error')) {
        // Clear any existing session to ensure clean login
        if (session) {
          await supabase.auth.signOut()
        }
        const cleanResponse = NextResponse.next({
          request: { headers: request.headers }
        })
        cleanResponse.cookies.delete('sb-access-token')
        cleanResponse.cookies.delete('sb-refresh-token')
        return cleanResponse
      }

      // If already authenticated, check if user is authorized admin
      if (session && session.user?.email) {
        const userEmail = session.user.email.toLowerCase().trim()
        const isAuthorized = AUTHORIZED_ADMIN_EMAILS.includes(userEmail)

        // Debug logging
        console.log('[Admin Auth] Login page check:', {
          email: userEmail,
          isAuthorized,
          authorizedEmails: AUTHORIZED_ADMIN_EMAILS
        })

        if (isAuthorized) {
          return NextResponse.redirect(new URL('/admin', request.url))
        } else {
          // Authenticated but not authorized - sign them out
          console.log('[Admin Auth] Unauthorized email, signing out:', userEmail)
          await supabase.auth.signOut()
          const signOutUrl = new URL('/admin/login', request.url)
          signOutUrl.searchParams.set('error', 'unauthorized')
          const signOutResponse = NextResponse.redirect(signOutUrl)
          // Clear all auth cookies
          signOutResponse.cookies.delete('sb-access-token')
          signOutResponse.cookies.delete('sb-refresh-token')
          return signOutResponse
        }
      }
      return response
    }

    // For all other admin routes, require authentication and authorization
    if (!session || !session.user?.email) {
      console.log('[Admin Auth] No session, redirecting to login')
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Check if user is authorized admin
    const userEmail = session.user.email.toLowerCase().trim()
    const isAuthorized = AUTHORIZED_ADMIN_EMAILS.includes(userEmail)

    console.log('[Admin Auth] Route access check:', {
      path: request.nextUrl.pathname,
      email: userEmail,
      isAuthorized
    })

    if (!isAuthorized) {
      console.log('[Admin Auth] Unauthorized access attempt, signing out:', userEmail)
      await supabase.auth.signOut()
      const signOutUrl = new URL('/admin/login', request.url)
      signOutUrl.searchParams.set('error', 'unauthorized')
      const signOutResponse = NextResponse.redirect(signOutUrl)
      // Clear all auth cookies
      signOutResponse.cookies.delete('sb-access-token')
      signOutResponse.cookies.delete('sb-refresh-token')
      return signOutResponse
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