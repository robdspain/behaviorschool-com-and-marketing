import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

const COOKIE_NAME = 'bs_admin_session'
const SESSION_MAX_AGE = 60 * 60 * 24
const WINDOW_DAYS = 30

type MarketingEventRow = {
  event_name: string | null
  page_path: string | null
  page_url: string | null
  visitor_id: string | null
  session_id: string | null
  location: string | null
  intent: string | null
  destination: string | null
  source: string | null
  received_at: string | null
  payload: Record<string, unknown> | null
}

function isValidToken(token: string): boolean {
  const [tsPart] = token.split('.')
  if (!tsPart) return false
  const ts = parseInt(tsPart, 36)
  if (Number.isNaN(ts)) return false
  return Date.now() - ts < SESSION_MAX_AGE * 1000
}

async function isAdminAuthenticated() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  return !!token && isValidToken(token)
}

function addCount(map: Map<string, number>, key: string | null | undefined) {
  const cleanKey = key?.trim() || 'Unknown'
  map.set(cleanKey, (map.get(cleanKey) || 0) + 1)
}

function topItems(map: Map<string, number>, limit = 5) {
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }))
}

function getAttributionSource(event: MarketingEventRow) {
  const attribution = event.payload?.attribution
  if (attribution && typeof attribution === 'object' && !Array.isArray(attribution)) {
    const source = (attribution as Record<string, unknown>).utm_source
    if (typeof source === 'string' && source.trim()) return source
  }
  return event.source
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json({
      success: true,
      stored: false,
      windowDays: WINDOW_DAYS,
      summary: null,
      events: [],
      warning: 'Supabase is not configured.',
    })
  }

  const since = new Date(Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString()
  const { data, error } = await supabaseAdmin
    .from('behavior_study_tools_marketing_events')
    .select('event_name,page_path,page_url,visitor_id,session_id,location,intent,destination,source,received_at,payload')
    .gte('received_at', since)
    .order('received_at', { ascending: false })
    .limit(5000)

  if (error) {
    console.warn('Behavior Study Tools marketing report read failed:', error.message)
    return NextResponse.json({
      success: true,
      stored: false,
      windowDays: WINDOW_DAYS,
      summary: null,
      events: [],
      warning: error.message,
    })
  }

  const events = (data || []) as MarketingEventRow[]
  const pageViews = events.filter((event) => event.event_name === 'page_view')
  const ctaClicks = events.filter((event) => event.event_name === 'cta_click')
  const visitors = new Set(events.map((event) => event.visitor_id).filter(Boolean))
  const sessions = new Set(events.map((event) => event.session_id).filter(Boolean))
  const pages = new Map<string, number>()
  const ctas = new Map<string, number>()
  const intents = new Map<string, number>()
  const sources = new Map<string, number>()

  pageViews.forEach((event) => addCount(pages, event.page_path))
  ctaClicks.forEach((event) => {
    addCount(ctas, event.location)
    addCount(intents, event.intent)
  })
  events.forEach((event) => addCount(sources, getAttributionSource(event)))

  const summary = {
    totalEvents: events.length,
    pageViews: pageViews.length,
    ctaClicks: ctaClicks.length,
    uniqueVisitors: visitors.size,
    sessions: sessions.size,
    clickRate: pageViews.length ? Math.round((ctaClicks.length / pageViews.length) * 1000) / 10 : 0,
    topPages: topItems(pages),
    topCtas: topItems(ctas),
    topIntents: topItems(intents),
    topSources: topItems(sources),
  }

  return NextResponse.json({
    success: true,
    stored: true,
    windowDays: WINDOW_DAYS,
    generatedAt: new Date().toISOString(),
    summary,
    events: events.slice(0, 20),
  })
}
