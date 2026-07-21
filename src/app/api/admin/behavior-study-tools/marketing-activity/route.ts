import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { isValidAdminSessionToken } from '@/lib/adminSession'
import { api, getConvexClient } from '@/lib/convex'

export const dynamic = 'force-dynamic'

const COOKIE_NAME = 'bs_admin_auth'

async function isAdminAuthenticated() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  return isValidAdminSessionToken(token)
}

function cleanString(value: unknown, max = 1000) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function cleanEntry(body: Record<string, unknown>) {
  return {
    activity_date: cleanString(body.activityDate, 40) || new Date().toISOString().slice(0, 10),
    channel: cleanString(body.channel, 80),
    primary_action: cleanString(body.primaryAction, 280),
    published_url: cleanString(body.publishedUrl, 1000),
    customer_signal: cleanString(body.customerSignal, 1500),
    competitor_signal: cleanString(body.competitorSignal, 1500),
    seo_improvement: cleanString(body.seoImprovement, 1500),
    next_step: cleanString(body.nextStep, 1000),
    status: cleanString(body.status, 40) || 'logged',
    created_at: new Date().toISOString(),
  }
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const entries = await getConvexClient().query(api.bstMarketing.listMarketingActivity, {
      limit: 30,
    })
    return NextResponse.json({ success: true, entries, stored: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Marketing activity log read failed'
    console.warn('Marketing activity log read failed:', message)
    return NextResponse.json({ success: true, entries: [], stored: false, warning: message })
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const entry = cleanEntry(body as Record<string, unknown>)
  if (!entry.channel || !entry.primary_action) {
    return NextResponse.json({ error: 'Channel and primary action are required' }, { status: 400 })
  }

  try {
    const data = await getConvexClient().mutation(api.bstMarketing.createMarketingActivity, {
      activityDate: entry.activity_date,
      channel: entry.channel,
      primaryAction: entry.primary_action,
      publishedUrl: entry.published_url,
      customerSignal: entry.customer_signal,
      competitorSignal: entry.competitor_signal,
      seoImprovement: entry.seo_improvement,
      nextStep: entry.next_step,
      status: entry.status,
      createdAt: entry.created_at,
    })
    return NextResponse.json({ success: true, entry: data, stored: true }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Marketing activity log write failed'
    console.warn('Marketing activity log write failed:', message)
    return NextResponse.json({ success: true, entry, stored: false, warning: message }, { status: 202 })
  }
}
