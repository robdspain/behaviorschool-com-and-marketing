import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

const COOKIE_NAME = 'bs_admin_session'
const SESSION_MAX_AGE = 60 * 60 * 24
const MAX_BATCH_SIZE = 100

type GrowthSignalInput = Record<string, unknown>

function isValidToken(token: string): boolean {
  const [tsPart] = token.split('.')
  if (!tsPart) return false
  const ts = parseInt(tsPart, 36)
  if (Number.isNaN(ts)) return false
  return Date.now() - ts < SESSION_MAX_AGE * 1000
}

async function isAdminAuthenticated(request: NextRequest) {
  const monitorSecret = process.env.BST_DAILY_MONITOR_SECRET
  const authorization = request.headers.get('authorization') || ''
  if (monitorSecret && authorization === `Bearer ${monitorSecret}`) return true

  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  return !!token && isValidToken(token)
}

function cleanString(value: unknown, max = 1000) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function cleanNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return null
}

function cleanDate(value: unknown) {
  const input = cleanString(value, 40)
  if (!input) return new Date().toISOString().slice(0, 10)
  const parsed = new Date(input)
  if (Number.isNaN(parsed.getTime())) return new Date().toISOString().slice(0, 10)
  return parsed.toISOString().slice(0, 10)
}

function cleanMetadata(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return value as Record<string, unknown>
}

function cleanSignal(input: GrowthSignalInput) {
  const metricValue = cleanNumber(input.metricValue ?? input.metric_value)
  const previousValue = cleanNumber(input.previousValue ?? input.previous_value)
  const changeValue = cleanNumber(input.changeValue ?? input.change_value)
  const changePercent = cleanNumber(input.changePercent ?? input.change_percent)

  return {
    signal_date: cleanDate(input.signalDate ?? input.signal_date),
    source: cleanString(input.source, 80),
    signal_type: cleanString(input.signalType ?? input.signal_type, 100),
    channel: cleanString(input.channel, 100) || null,
    url: cleanString(input.url, 1000) || null,
    keyword: cleanString(input.keyword, 300) || null,
    topic: cleanString(input.topic, 300) || null,
    metric_name: cleanString(input.metricName ?? input.metric_name, 120) || null,
    metric_value: metricValue,
    previous_value: previousValue,
    change_value: changeValue,
    change_percent: changePercent,
    metadata: cleanMetadata(input.metadata),
    recommendation: cleanString(input.recommendation, 1500) || null,
    status: cleanString(input.status, 60) || 'new',
  }
}

function toApiSignal(row: Record<string, unknown>) {
  return {
    id: row.id,
    signalDate: row.signal_date,
    source: row.source,
    signalType: row.signal_type,
    channel: row.channel,
    url: row.url,
    keyword: row.keyword,
    topic: row.topic,
    metricName: row.metric_name,
    metricValue: row.metric_value,
    previousValue: row.previous_value,
    changeValue: row.change_value,
    changePercent: row.change_percent,
    metadata: row.metadata,
    recommendation: row.recommendation,
    status: row.status,
    createdAt: row.created_at,
  }
}

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ success: true, signals: [], stored: false })
  }

  const { searchParams } = new URL(request.url)
  const source = cleanString(searchParams.get('source'), 80)
  const since = cleanString(searchParams.get('since'), 40)
  const limit = Math.min(Number(searchParams.get('limit') || 100), 500)

  let query = supabaseAdmin
    .from('behavior_study_tools_growth_signals')
    .select('*')
    .order('signal_date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(Number.isFinite(limit) ? limit : 100)

  if (source) query = query.eq('source', source)
  if (since) query = query.gte('signal_date', cleanDate(since))

  const { data, error } = await query

  if (error) {
    console.warn('Growth signal read failed:', error.message)
    return NextResponse.json({ success: true, signals: [], stored: false, warning: error.message })
  }

  return NextResponse.json({
    success: true,
    stored: true,
    signals: (data || []).map((row) => toApiSignal(row as Record<string, unknown>)),
  })
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const rawSignals = Array.isArray(body) ? body : Array.isArray(body?.signals) ? body.signals : body ? [body] : []
  if (!rawSignals.length) {
    return NextResponse.json({ error: 'At least one signal is required' }, { status: 400 })
  }

  const signals = rawSignals
    .slice(0, MAX_BATCH_SIZE)
    .map((signal: GrowthSignalInput) => cleanSignal(signal))
    .filter((signal) => signal.source && signal.signal_type)

  if (!signals.length) {
    return NextResponse.json({ error: 'Each signal requires source and signalType' }, { status: 400 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ success: true, signals, stored: false }, { status: 202 })
  }

  const { data, error } = await supabaseAdmin
    .from('behavior_study_tools_growth_signals')
    .insert(signals)
    .select()

  if (error) {
    console.warn('Growth signal write failed:', error.message)
    return NextResponse.json({ success: true, signals, stored: false, warning: error.message }, { status: 202 })
  }

  return NextResponse.json({
    success: true,
    stored: true,
    signals: (data || []).map((row) => toApiSignal(row as Record<string, unknown>)),
  }, { status: 201 })
}
