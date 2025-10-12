import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/admin'
  
  console.log('[Auth Callback] Received request with code:', code ? 'present' : 'missing')
  console.log('[Auth Callback] All cookies:', request.cookies.getAll().map(c => c.name))

  if (!code) {
    console.log('[Auth Callback] No code provided, redirecting to login')
    const redirectUrl = new URL(`/admin/login?error=missing_code`, request.url)
    return NextResponse.redirect(redirectUrl)
  }

  try {
    const cookieStore = await cookies()
    
    // Create supabase client with proper cookie handling
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            const value = cookieStore.get(name)?.value
            console.log(`[Auth Callback] Getting cookie ${name}:`, value ? 'present' : 'missing')
            return value
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value, ...options })
              console.log(`[Auth Callback] Set cookie ${name}`)
            } catch (error) {
              console.error(`[Auth Callback] Failed to set cookie ${name}:`, error)
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value: '', ...options })
              console.log(`[Auth Callback] Removed cookie ${name}`)
            } catch (error) {
              console.error(`[Auth Callback] Failed to remove cookie ${name}:`, error)
            }
          },
        },
      }
    )

    console.log('[Auth Callback] Exchanging code for session...')
    
    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('[Auth Callback] Error exchanging code:', error)
      const redirectUrl = new URL(`/admin/login?error=${encodeURIComponent(error.message)}`, request.url)
      return NextResponse.redirect(redirectUrl)
    }

    if (!data.session) {
      console.error('[Auth Callback] No session created')
      const redirectUrl = new URL(`/admin/login?error=no_session`, request.url)
      return NextResponse.redirect(redirectUrl)
    }

    console.log('[Auth Callback] ✓ Session created successfully for user:', data.user?.email)
    
    // Create response with session cookies
    const response = NextResponse.redirect(new URL(next, request.url))
    
    // Manually set auth cookies in response
    if (data.session) {
      response.cookies.set({
        name: 'sb-access-token',
        value: data.session.access_token,
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
      
      response.cookies.set({
        name: 'sb-refresh-token',
        value: data.session.refresh_token,
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
    }

    return response
    
  } catch (error) {
    console.error('[Auth Callback] Exception:', error)
    const redirectUrl = new URL(`/admin/login?error=callback_exception`, request.url)
    return NextResponse.redirect(redirectUrl)
  }
}

