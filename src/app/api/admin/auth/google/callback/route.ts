import { NextRequest, NextResponse } from 'next/server'
import { serialize } from 'cookie'
import { ADMIN_SESSION_MAX_AGE, makeAdminSessionToken } from '@/lib/adminSession'

export const dynamic = 'force-dynamic'

const SESSION_COOKIE = 'bs_admin_session'
const STATE_COOKIE = 'bs_admin_oauth_state'
const RETURN_TO_COOKIE = 'bs_admin_oauth_return_to'

type GoogleTokenResponse = {
  access_token?: string
  id_token?: string
  error?: string
  error_description?: string
}

type GoogleUserInfo = {
  email?: string
  email_verified?: boolean
  hd?: string
}

function oauthBaseUrl(request: NextRequest) {
  const configured = process.env.ADMIN_OAUTH_BASE_URL || process.env.NEXTAUTH_URL
  if (configured) return configured.replace(/\/$/, '')

  const host = request.headers.get('x-forwarded-host') || request.headers.get('host')
  if (host) {
    const proto = request.headers.get('x-forwarded-proto') || 'https'
    return `${proto}://${host}`
  }

  return request.nextUrl.origin
}

function allowedEmails() {
  return (process.env.ADMIN_GOOGLE_ALLOWED_EMAILS || process.env.ADMIN_GOOGLE_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

function safeReturnTo(value: string | undefined) {
  if (!value || !value.startsWith('/admin')) return '/admin'
  if (value.startsWith('//')) return '/admin'
  return value.slice(0, 500)
}

function loginRedirect(request: NextRequest, error: string) {
  return NextResponse.redirect(new URL(`/admin/login?error=${encodeURIComponent(error)}`, request.url))
}

async function fetchGoogleUser(code: string, request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.ADMIN_GOOGLE_CLIENT_ID || process.env.AUTH_GOOGLE_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || process.env.ADMIN_GOOGLE_CLIENT_SECRET || process.env.AUTH_GOOGLE_SECRET
  if (!clientId || !clientSecret) {
    throw new Error('google_not_configured')
  }

  const redirectUri = new URL('/api/admin/auth/google/callback', oauthBaseUrl(request)).toString()
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })
  const tokenData = await tokenResponse.json().catch(() => ({})) as GoogleTokenResponse
  if (!tokenResponse.ok || !tokenData.access_token) {
    throw new Error(tokenData.error_description || tokenData.error || 'google_token_failed')
  }

  const userResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  })
  const userData = await userResponse.json().catch(() => ({})) as GoogleUserInfo
  if (!userResponse.ok || !userData.email) {
    throw new Error('google_user_failed')
  }

  return userData
}

export async function GET(request: NextRequest) {
  const expectedState = request.cookies.get(STATE_COOKIE)?.value
  const receivedState = request.nextUrl.searchParams.get('state')
  const code = request.nextUrl.searchParams.get('code')

  if (!expectedState || !receivedState || expectedState !== receivedState) {
    return loginRedirect(request, 'invalid_state')
  }
  if (!code) {
    return loginRedirect(request, 'missing_code')
  }

  try {
    const allowlist = allowedEmails()
    if (!allowlist.length) {
      return loginRedirect(request, 'allowlist_missing')
    }

    const googleUser = await fetchGoogleUser(code, request)
    const email = googleUser.email?.toLowerCase()
    if (!email || !googleUser.email_verified || !allowlist.includes(email)) {
      return loginRedirect(request, 'unauthorized_google_account')
    }

    const returnTo = safeReturnTo(request.cookies.get(RETURN_TO_COOKIE)?.value)
    const destination = new URL(returnTo, oauthBaseUrl(request)).toString()
    const destinationJson = JSON.stringify(destination).replace(/</g, '\\u003c')
    const response = new NextResponse(
      `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="robots" content="noindex,nofollow">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Admin sign-in complete</title>
  </head>
  <body>
    <p>Sign-in complete. Opening the Behavior School admin...</p>
    <p><a href=${destinationJson}>Continue to the admin</a></p>
    <script>window.setTimeout(function () { window.location.replace(${destinationJson}) }, 1000)</script>
  </body>
</html>`,
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
          'Content-Type': 'text/html; charset=utf-8',
        },
      },
    )
    const sessionToken = makeAdminSessionToken()
    response.headers.append('Set-Cookie', serialize(SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: ADMIN_SESSION_MAX_AGE,
      path: '/',
    }))
    console.error('[admin-auth-diagnostic] OAuth callback prepared session cookie', {
      sessionCookieSet: true,
      destination: returnTo,
    })

    // Netlify's Next.js adapter was dropping this cookie on a redirect response.
    // A normal HTML response commits the cookie before navigating to the admin.
    // The short-lived OAuth state cookies expire naturally.
    return response
  } catch (error) {
    const message = error instanceof Error ? error.message : 'google_login_failed'
    return loginRedirect(request, message || 'google_login_failed')
  }
}
