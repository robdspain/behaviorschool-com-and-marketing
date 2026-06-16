import { randomBytes } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const STATE_COOKIE = 'bs_admin_oauth_state'
const RETURN_TO_COOKIE = 'bs_admin_oauth_return_to'
const OAUTH_MAX_AGE = 10 * 60

function safeReturnTo(value: string | null) {
  if (!value || !value.startsWith('/admin')) return '/admin'
  if (value.startsWith('//')) return '/admin'
  return value.slice(0, 500)
}

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.ADMIN_GOOGLE_CLIENT_ID
  if (!clientId) {
    return NextResponse.redirect(new URL('/admin/login?error=google_not_configured', request.url))
  }

  const state = randomBytes(24).toString('hex')
  const redirectUri = new URL('/api/admin/auth/google/callback', request.url).toString()
  const returnTo = safeReturnTo(request.nextUrl.searchParams.get('returnTo') || request.nextUrl.searchParams.get('redirect'))
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')

  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('scope', 'openid email profile')
  authUrl.searchParams.set('state', state)
  authUrl.searchParams.set('access_type', 'online')
  authUrl.searchParams.set('prompt', 'select_account')

  const response = NextResponse.redirect(authUrl)
  response.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: OAUTH_MAX_AGE,
    path: '/',
  })
  response.cookies.set(RETURN_TO_COOKIE, returnTo, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: OAUTH_MAX_AGE,
    path: '/',
  })

  return response
}
