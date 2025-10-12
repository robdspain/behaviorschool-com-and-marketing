import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/admin'

  if (!code) {
    // No code present; send back to login with error
    console.log('[Auth Callback] No code provided')
    const redirectUrl = new URL(`/admin/login?error=missing_code`, request.url)
    return NextResponse.redirect(redirectUrl)
  }

  console.log('[Auth Callback] Processing OAuth code')

  // Create response object first
  let response = NextResponse.redirect(new URL(next, request.url))

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // Set cookie in both cookieStore and response
          cookieStore.set({ name, value, ...options })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          // Remove from both
          cookieStore.set({ name, value: '', ...options })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Exchange the code for a session and set the cookies
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)
  
  if (error) {
    console.error('[Auth Callback] Error exchanging code:', error.message)
    const redirectUrl = new URL(`/admin/login?error=${encodeURIComponent(error.message)}`, request.url)
    return NextResponse.redirect(redirectUrl)
  }

  if (!data.session) {
    console.error('[Auth Callback] No session created')
    const redirectUrl = new URL(`/admin/login?error=no_session`, request.url)
    return NextResponse.redirect(redirectUrl)
  }

  console.log('[Auth Callback] Session created successfully for user:', data.user?.email)

  // Return response with cookies
  return response
}

