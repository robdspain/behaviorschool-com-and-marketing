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
      // If already authenticated, check if user is authorized admin
      if (session && session.user?.email) {
        if (AUTHORIZED_ADMIN_EMAILS.includes(session.user.email)) {
          return NextResponse.redirect(new URL('/admin', request.url))
        } else {
          // Authenticated but not authorized - sign them out and show error
          const signOutUrl = new URL('/admin/login', request.url)
          signOutUrl.searchParams.set('error', 'unauthorized')
          return NextResponse.redirect(signOutUrl)
        }
      }
      return response
    }

    // For all other admin routes, require authentication and authorization
    if (!session || !session.user?.email) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Check if user is authorized admin
    if (!AUTHORIZED_ADMIN_EMAILS.includes(session.user.email)) {
      const signOutUrl = new URL('/admin/login', request.url)
      signOutUrl.searchParams.set('error', 'unauthorized')
      return NextResponse.redirect(signOutUrl)
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