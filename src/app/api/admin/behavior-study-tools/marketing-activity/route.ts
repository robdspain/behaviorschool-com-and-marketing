import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { isValidAdminSessionToken } from '@/lib/adminSession'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

const COOKIE_NAME = 'bs_admin_session'

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

  if (!supabaseAdmin) {
    return NextResponse.json({ success: true, entries: [], stored: false })
  }

  const { data, error } = await supabaseAdmin
    .from('behavior_study_tools_marketing_activity')
    .select('*')
    .order('activity_date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(30)

  if (error) {
    console.warn('Marketing activity log read failed:', error.message)
    return NextResponse.json({ success: true, entries: [], stored: false, warning: error.message })
  }

  return NextResponse.json({ success: true, entries: data || [], stored: true })
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

  if (!supabaseAdmin) {
    return NextResponse.json({ success: true, entry, stored: false }, { status: 202 })
  }

  const { data, error } = await supabaseAdmin
    .from('behavior_study_tools_marketing_activity')
    .insert(entry)
    .select()
    .single()

  if (error) {
    console.warn('Marketing activity log write failed:', error.message)
    return NextResponse.json({ success: true, entry, stored: false, warning: error.message }, { status: 202 })
  }

  return NextResponse.json({ success: true, entry: data, stored: true }, { status: 201 })
}
