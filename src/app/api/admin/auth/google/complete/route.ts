import { serialize } from 'cookie'
import { NextRequest, NextResponse } from 'next/server'
import {
  ADMIN_SESSION_MAX_AGE,
  isValidAdminHandoffToken,
  makeAdminSessionToken,
} from '@/lib/adminSession'

export const dynamic = 'force-dynamic'

const SESSION_COOKIE = 'bs_admin_auth'

function safeReturnTo(value: string | null) {
  if (!value || !value.startsWith('/admin')) return '/admin'
  if (value.startsWith('//')) return '/admin'
  return value.slice(0, 500)
}

function requestBaseUrl(request: NextRequest) {
  const configured = process.env.ADMIN_OAUTH_BASE_URL || process.env.NEXTAUTH_URL
  if (configured) return configured.replace(/\/$/, '')

  const host = request.headers.get('x-forwarded-host') || request.headers.get('host')
  if (host) {
    const proto = request.headers.get('x-forwarded-proto') || 'https'
    return `${proto}://${host}`
  }

  return request.nextUrl.origin
}

export async function GET(request: NextRequest) {
  const handoff = request.nextUrl.searchParams.get('handoff')
  if (!isValidAdminHandoffToken(handoff)) {
    return NextResponse.redirect(new URL('/admin/login?error=invalid_state', requestBaseUrl(request)), 303)
  }

  const returnTo = safeReturnTo(request.nextUrl.searchParams.get('returnTo'))
  const response = NextResponse.redirect(new URL(returnTo, requestBaseUrl(request)), 303)
  response.headers.append('Set-Cookie', serialize(SESSION_COOKIE, makeAdminSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: ADMIN_SESSION_MAX_AGE,
    path: '/',
  }))
  response.headers.set('Cache-Control', 'no-store, max-age=0')
  return response
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as { handoff?: string } | null
  if (!isValidAdminHandoffToken(body?.handoff)) {
    return NextResponse.json({ ok: false, error: 'invalid_state' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(SESSION_COOKIE, makeAdminSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: ADMIN_SESSION_MAX_AGE,
    path: '/',
  })
  response.headers.set('Cache-Control', 'no-store, max-age=0')
  return response
}
