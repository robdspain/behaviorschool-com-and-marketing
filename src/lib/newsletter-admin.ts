import { NextResponse } from 'next/server'

type ConvexCall = 'query' | 'mutation' | 'action'

export type RobSpainDeliveryRecord = {
  issueId: string
  issueKey: string
  subject: string
  status: string
  version: number
  previewedVersion: number | null
  approvedAt: number | null
  archiveVerifiedAt: number | null
  scheduledFor: number | null
  sentAt: number | null
  recipientCount: number
  failed: number
  archiveUrl: string | null
}

export type RobSpainNewsletterDashboard = {
  issues: Array<Record<string, any>>
  selected: {
    issue: Record<string, any>
    sources: Array<Record<string, any>>
    analytics: Record<string, any> | null
    preflight: { ready?: boolean; checks?: Array<Record<string, any>> } | null
  } | null
  audience: Record<string, number>
  onboarding?: {
    sequenceVersion: string
    started: number
    welcomeSent: number
    resourcesSent: number
    questionSent: number
    shareSent: number
    responses: Array<{
      id: string
      email: string
      question: string
      answer: string
      createdAt: number
      updatedAt: number
    }>
  }
  evidence?: Record<string, unknown>
  measurement?: Record<string, unknown>
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

export async function callRobSpainNewsletterConvex<T>(
  kind: ConvexCall,
  path: string,
  args: Record<string, unknown> = {},
): Promise<T> {
  const convexUrl = (process.env.ROBSPAIN_NEWSLETTER_CONVEX_URL ?? 'https://precious-clownfish-797.convex.cloud').replace(/\/$/, '')
  const accessToken = process.env.ROBSPAIN_NEWSLETTER_ADMIN_TOKEN
  if (!accessToken) throw new Error('ROBSPAIN_NEWSLETTER_ADMIN_TOKEN is not configured on BehaviorSchool.com.')

  const response = await fetch(`${convexUrl}/api/${kind}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    body: JSON.stringify({
      path,
      args: { ...args, accessToken },
      format: 'json',
    }),
  })
  const body = await response.json().catch(() => ({})) as {
    value?: T
    errorMessage?: string
  }

  if (!response.ok || body.errorMessage) {
    throw new Error(body.errorMessage ?? `RobSpain newsletter ${kind} ${path} failed with HTTP ${response.status}.`)
  }

  return body.value as T
}

export async function getRobSpainNewsletterDashboard(issueId?: string): Promise<RobSpainNewsletterDashboard> {
  return callRobSpainNewsletterConvex('query', 'newsletter:adminDashboard', issueId ? { issueId } : {})
}

export function robSpainDeliveryRecordsFromDashboard(dashboard: RobSpainNewsletterDashboard): RobSpainDeliveryRecord[] {
  return dashboard.issues.map((issue) => ({
    issueId: String(issue._id ?? ''),
    issueKey: issue.issueKey ?? 'Unknown issue',
    subject: issue.subject ?? 'Untitled issue',
    status: issue.status ?? 'unknown',
    version: Number(issue.version ?? 0),
    previewedVersion: issue.previewedVersion ?? null,
    approvedAt: issue.approvedAt ?? null,
    archiveVerifiedAt: issue.archiveVerifiedAt ?? null,
    scheduledFor: issue.scheduledFor ?? null,
    sentAt: issue.sentAt ?? null,
    recipientCount: issue.recipientCount ?? 0,
    failed: issue.failed ?? 0,
    archiveUrl: issue.archiveUrl ?? null,
  }))
}

export async function listRobSpainDeliveryRecords(): Promise<RobSpainDeliveryRecord[]> {
  return robSpainDeliveryRecordsFromDashboard(await getRobSpainNewsletterDashboard())
}
