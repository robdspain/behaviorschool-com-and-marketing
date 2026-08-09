import { NextResponse } from 'next/server'

type ConvexCall = 'query' | 'mutation' | 'action'

function getNewsletterConvexUrl() {
  return (
    process.env.NEWSLETTER_CONVEX_URL ??
    process.env.CONVEX_URL ??
    process.env.NEXT_PUBLIC_CONVEX_URL ??
    'https://modest-malamute-868.convex.cloud'
  ).replace(/\/$/, '')
}

function getNewsletterAdminToken() {
  const token = process.env.NEWSLETTER_CONVEX_ADMIN_TOKEN
  if (!token) throw new Error('NEWSLETTER_CONVEX_ADMIN_TOKEN is not configured on BehaviorSchool.com.')
  return token
}

export async function callNewsletterConvex<T>(
  kind: ConvexCall,
  path: string,
  args: Record<string, unknown> = {},
): Promise<T> {
  const response = await fetch(`${getNewsletterConvexUrl()}/api/${kind}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    body: JSON.stringify({
      path,
      args: { ...args, accessToken: getNewsletterAdminToken() },
      format: 'json',
    }),
  })

  const body = await response.json().catch(() => ({})) as {
    value?: T
    errorMessage?: string
    errorData?: unknown
  }

  if (!response.ok || body.errorMessage) {
    const detail = body.errorMessage ?? `Convex ${kind} ${path} failed with HTTP ${response.status}.`
    throw new Error(detail)
  }

  return body.value as T
}

export function newsletterErrorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
  const status = /not configured|unauthorized|authentication/i.test(message) ? 503 : 500
  return NextResponse.json({ ok: false, error: message }, { status })
}
