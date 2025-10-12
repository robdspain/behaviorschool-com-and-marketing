
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const pathname = request.nextUrl.pathname
  const isLogin = pathname === '/admin/login' || pathname.startsWith('/admin/login/')
  const isAuthCallback = pathname.startsWith('/auth/callback')
  const isClearAuth = pathname === '/admin/clear-auth'

  // Always allow login, auth callback, and clear-auth pages
  if (isAuthCallback || isLogin || isClearAuth) {
    return response
  }

  // For implicit flow, we can't reliably check auth server-side
  // Let client-side handle auth checks
  // Only protect /admin routes that need it
  const isAdmin = pathname.startsWith('/admin')
  
  if (isAdmin) {
    // Try to get session from cookies
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

    const { data: { user } } = await supabase.auth.getUser()
    
    console.log('[Middleware] Admin route check:', {
      pathname,
      hasUser: !!user,
      hasCookies: request.cookies.getAll().length > 0
    })

    // Only redirect if definitively no user
    // Client-side will handle session detection from URL fragment
    if (!user) {
      console.log('[Middleware] No user found, allowing through for client-side check')
      // Don't redirect - let client-side handle it
      return response
    }
  }

  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/auth/callback',
  ],
}
