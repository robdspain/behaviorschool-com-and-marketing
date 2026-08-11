import { NextResponse } from 'next/server'

type ConvexCall = 'query' | 'mutation' | 'action'

export type RobSpainDeliveryRecord = {
  issueKey: string
  subject: string
  status: string
  scheduledFor: number | null
  sentAt: number | null
  recipientCount: number
  failed: number
  archiveUrl: string | null
}

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
      // Convex's HTTP API expects a positional argument array, even though
      // Convex functions receive a single object argument.
      args: [{ ...args, accessToken: getNewsletterAdminToken() }],
      format: 'convex_encoded_json',
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

export async function listRobSpainDeliveryRecords(): Promise<RobSpainDeliveryRecord[]> {
  const convexUrl = (process.env.ROBSPAIN_NEWSLETTER_CONVEX_URL ?? 'https://precious-clownfish-797.convex.cloud').replace(/\/$/, '')
  const accessToken = process.env.ROBSPAIN_NEWSLETTER_ADMIN_TOKEN
  if (!accessToken) throw new Error('ROBSPAIN_NEWSLETTER_ADMIN_TOKEN is not configured on BehaviorSchool.com.')

  const response = await fetch(`${convexUrl}/api/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    body: JSON.stringify({
      path: 'newsletter:adminDashboard',
      args: { accessToken },
      format: 'json',
    }),
  })
  const body = await response.json().catch(() => ({})) as {
    value?: { issues?: Array<Partial<RobSpainDeliveryRecord>> }
    errorMessage?: string
  }

  if (!response.ok || body.errorMessage || !body.value?.issues) {
    throw new Error(body.errorMessage ?? `RobSpain newsletter delivery query failed with HTTP ${response.status}.`)
  }

  return body.value.issues.map((issue) => ({
    issueKey: issue.issueKey ?? 'Unknown issue',
    subject: issue.subject ?? 'Untitled issue',
    status: issue.status ?? 'unknown',
    scheduledFor: issue.scheduledFor ?? null,
    sentAt: issue.sentAt ?? null,
    recipientCount: issue.recipientCount ?? 0,
    failed: issue.failed ?? 0,
    archiveUrl: issue.archiveUrl ?? null,
  }))
}
