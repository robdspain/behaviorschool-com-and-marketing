import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isAuthorizedAdmin } from '@/lib/admin-config'

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

  // Refresh session if needed
  const { data: { user } } = await supabase.auth.getUser()

  // Protect masterclass course routes
  if (request.nextUrl.pathname.startsWith('/masterclass/course') ||
      request.nextUrl.pathname.startsWith('/masterclass/certificate')) {
    if (!user) {
      // Not authenticated, redirect to masterclass landing
      const redirectUrl = new URL('/masterclass', request.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Check if user is an authorized admin - admins can access without enrollment
    const isAdmin = isAuthorizedAdmin(user.email)

    if (!isAdmin) {
      // Not an admin, check if user is enrolled
      const { data: enrollment } = await supabase
        .from('masterclass_enrollments')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!enrollment && request.nextUrl.pathname !== '/masterclass/enroll') {
        // Not enrolled, redirect to enrollment
        const redirectUrl = new URL('/masterclass/enroll', request.url)
        return NextResponse.redirect(redirectUrl)
      }
    }
    // Admins bypass enrollment check and can access directly
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
