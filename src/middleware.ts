import { NextResponse, type NextRequest } from 'next/server'

const ADMIN_COOKIE_NAME = 'bs_admin_auth'
const ADMIN_SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000

function adminSessionSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.GOOGLE_CLIENT_SECRET ||
    process.env.ADMIN_GOOGLE_CLIENT_SECRET ||
    process.env.AUTH_GOOGLE_SECRET ||
    ''
  )
}

function constantTimeEqual(left: string, right: string) {
  if (left.length !== right.length) return false
  let difference = 0
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index)
  }
  return difference === 0
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

async function isValidAdminCookie(token: string) {
  const isHexToken = token.includes('_')
  const [issuedAt, nonce, signature] = token.split(isHexToken ? '_' : '.')
  if (!issuedAt || !nonce || !signature) return false

  const timestamp = Number.parseInt(issuedAt, 36)
  const age = Date.now() - timestamp
  if (Number.isNaN(timestamp) || age < 0 || age > ADMIN_SESSION_MAX_AGE_MS) return false

  const secret = adminSessionSecret()
  if (!secret) return false

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signed = new Uint8Array(await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(`${issuedAt}.${nonce}`),
  ))
  const expected = isHexToken ? bytesToHex(signed) : bytesToBase64Url(signed)
  return constantTimeEqual(signature, expected)
}

async function hasValidAdminSession(request: NextRequest) {
  const tokens = request.cookies.getAll(ADMIN_COOKIE_NAME).map((cookie) => cookie.value)
  if (!tokens.length) return false
  const results = await Promise.all(tokens.map((token) => isValidAdminCookie(token)))
  return results.some(Boolean)
}

function isAdminAuthRoute(pathname: string) {
  return pathname === '/admin/login' || pathname === '/admin/clear-auth'
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  if (!isAdminAuthRoute(pathname) && !(await hasValidAdminSession(request))) {
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('returnTo', `${pathname}${search}`.slice(0, 500))
    return NextResponse.redirect(loginUrl, 307)
  }

  const response = NextResponse.next()
  response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  return response
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
