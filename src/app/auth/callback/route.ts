import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/admin'

  if (!code) {
    // No code present; send back to login with error
    const redirectUrl = new URL(`/admin/login?error=missing_code`, request.url)
    return NextResponse.redirect(redirectUrl)
  }

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
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Exchange the code for a session and set the cookies
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    const redirectUrl = new URL(`/admin/login?error=${encodeURIComponent(error.message)}`, request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect to the intended destination
  const redirectUrl = new URL(next, request.url)
  return NextResponse.redirect(redirectUrl)
}

