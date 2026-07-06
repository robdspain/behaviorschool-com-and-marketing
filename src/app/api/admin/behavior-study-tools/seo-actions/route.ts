import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { isValidAdminSessionToken } from '@/lib/adminSession'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { behaviorStudyToolsMarketing } from '@/data/behaviorStudyToolsMarketing'

export const dynamic = 'force-dynamic'

const COOKIE_NAME = 'bs_admin_session'

type SeoSignalRow = {
  id: string
  signal_date: string | null
  source: string | null
  signal_type: string | null
  url: string | null
  keyword: string | null
  topic: string | null
  metric_name: string | null
  metric_value: number | null
  previous_value: number | null
  change_value: number | null
  change_percent: number | null
  metadata: Record<string, unknown> | null
  recommendation: string | null
  status: string | null
  created_at: string | null
}

type SeoPage = (typeof behaviorStudyToolsMarketing.seoPages)[number]


async function isAuthorized(request: NextRequest) {
  const monitorSecret = process.env.BST_DAILY_MONITOR_SECRET
  const authorization = request.headers.get('authorization') || ''
  if (monitorSecret && authorization === `Bearer ${monitorSecret}`) return true

  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  return isValidAdminSessionToken(token)
}

function cleanString(value: unknown, max = 1000) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function todayDate() {
  return new Date().toISOString().slice(0, 10)
}

function pagePath(url: string) {
  try {
    return new URL(url).pathname.replace(/\/$/, '') || '/'
  } catch {
    return url.replace(/^https?:\/\/[^/]+/i, '').replace(/\/$/, '') || '/'
  }
}

function words(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2)
}

function matchPage(signal: SeoSignalRow): SeoPage {
  const signalPath = signal.url ? pagePath(signal.url) : ''
  const keywordWords = new Set(words(`${signal.keyword || ''} ${signal.topic || ''}`))
  const urlMatch = behaviorStudyToolsMarketing.seoPages.find((page) => pagePath(page.href) === signalPath)
  if (urlMatch) return urlMatch

  const scored = behaviorStudyToolsMarketing.seoPages
    .map((page) => {
      const pageTerms = words(`${page.keyword} ${page.title} ${page.intent}`)
      const score = pageTerms.filter((term) => keywordWords.has(term)).length
      return { page, score }
    })
    .sort((a, b) => b.score - a.score)

  return scored[0]?.score ? scored[0].page : behaviorStudyToolsMarketing.seoPages[0]
}

function metadataNumber(signal: SeoSignalRow, key: string) {
  const value = signal.metadata?.[key]
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return null
}

function priorityFor(signal: SeoSignalRow) {
  const impressions = metadataNumber(signal, 'impressions') || 0
  const position = metadataNumber(signal, 'position')
  const ctr = metadataNumber(signal, 'ctr')
  const clicks = signal.metric_name === 'clicks' ? signal.metric_value || 0 : 0
  const falling = typeof signal.change_percent === 'number' && signal.change_percent < 0

  if ((impressions >= 50 && clicks < 3) || falling) return { label: 'high', score: 90 }
  if ((position !== null && position > 8 && position <= 20) || (ctr !== null && ctr < 0.02 && impressions >= 25)) {
    return { label: 'medium', score: 60 }
  }
  return { label: 'low', score: 30 }
}

function actionFor(signal: SeoSignalRow, page: SeoPage) {
  const keyword = signal.keyword || page.keyword
  const priority = priorityFor(signal)
  const position = metadataNumber(signal, 'position')
  const impressions = metadataNumber(signal, 'impressions')
  const ctr = metadataNumber(signal, 'ctr')
  const evidenceParts = [
    signal.source ? `${signal.source}` : 'SEO signal',
    keyword ? `keyword "${keyword}"` : '',
    impressions !== null ? `${impressions} impressions` : '',
    signal.metric_value !== null ? `${signal.metric_value} ${signal.metric_name || 'metric'}` : '',
    position !== null ? `position ${Math.round(position * 10) / 10}` : '',
    ctr !== null ? `${Math.round(ctr * 1000) / 10}% CTR` : '',
    signal.change_percent !== null ? `${signal.change_percent}% change` : '',
  ].filter(Boolean).join(' · ')

  const suggestedHeadline = page.title.includes('Free')
    ? `Start a free ${keyword} and know what to study next`
    : `${page.title}: practice, review, and see your next study step`
  const suggestedMeta = `${page.message} Use Behavior Study Tools to practice, review rationales, and move toward exam readiness.`
  const suggestedFaq = `How does this help me pass? It turns ${keyword} practice into a clear next step: what you missed, why it was missed, and which domain to study next.`
  const suggestedCta = page.keyword.toLowerCase().includes('rbt')
    ? 'Start free RBT practice'
    : page.keyword.toLowerCase().includes('mock')
      ? 'Start a BCBA mock exam'
      : 'Start free BCBA practice'

  return {
    priority,
    evidence: evidenceParts,
    recommendation: signal.recommendation || `Update ${page.title} using the latest ${signal.source || 'SEO'} movement.`,
    suggestedHeadline,
    suggestedMeta,
    suggestedFaq,
    suggestedCta,
  }
}

function toApiAction(row: SeoSignalRow) {
  const metadata = row.metadata || {}
  return {
    id: row.id,
    signalDate: row.signal_date,
    pageTitle: cleanString(metadata.pageTitle),
    pageHref: row.url,
    keyword: row.keyword,
    priority: cleanString(metadata.priority, 20) || 'medium',
    evidence: cleanString(metadata.evidence, 1200),
    suggestedHeadline: cleanString(metadata.suggestedHeadline, 300),
    suggestedMeta: cleanString(metadata.suggestedMeta, 500),
    suggestedFaq: cleanString(metadata.suggestedFaq, 800),
    suggestedCta: cleanString(metadata.suggestedCta, 120),
    recommendation: row.recommendation,
    status: row.status,
    createdAt: row.created_at,
  }
}

async function generateActions(limit = 20) {
  if (!supabaseAdmin) return { stored: false, created: 0, actions: [] }

  const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  const [{ data: signals, error: signalError }, { data: existing, error: existingError }] = await Promise.all([
    supabaseAdmin
      .from('behavior_study_tools_growth_signals')
      .select('*')
      .gte('signal_date', since)
      .eq('signal_type', 'seo_metric')
      .in('source', ['google_search_console', 'gsc', 'ahrefs'])
      .order('created_at', { ascending: false })
      .limit(limit),
    supabaseAdmin
      .from('behavior_study_tools_growth_signals')
      .select('metadata')
      .gte('signal_date', since)
      .eq('source', 'seo_action_queue')
      .eq('signal_type', 'page_improvement_action')
      .limit(500),
  ])

  if (signalError) throw signalError
  if (existingError) throw existingError

  const existingSourceIds = new Set(
    ((existing || []) as Array<{ metadata: Record<string, unknown> | null }>)
      .map((row) => cleanString(row.metadata?.sourceSignalId, 80))
      .filter(Boolean)
  )

  const actionRows = ((signals || []) as SeoSignalRow[])
    .filter((signal) => !existingSourceIds.has(signal.id))
    .map((signal) => {
      const page = matchPage(signal)
      const action = actionFor(signal, page)
      return {
        signal_date: todayDate(),
        source: 'seo_action_queue',
        signal_type: 'page_improvement_action',
        channel: 'seo',
        url: page.href,
        keyword: signal.keyword || page.keyword,
        topic: `Improve ${page.title}`,
        metric_name: 'priority_score',
        metric_value: action.priority.score,
        previous_value: null,
        change_value: signal.change_value,
        change_percent: signal.change_percent,
        metadata: {
          sourceSignalId: signal.id,
          source: signal.source,
          pageTitle: page.title,
          pageIntent: page.intent,
          pageMessage: page.message,
          priority: action.priority.label,
          evidence: action.evidence,
          suggestedHeadline: action.suggestedHeadline,
          suggestedMeta: action.suggestedMeta,
          suggestedFaq: action.suggestedFaq,
          suggestedCta: action.suggestedCta,
        },
        recommendation: action.recommendation,
        status: 'queued',
      }
    })
    .sort((a, b) => (b.metric_value || 0) - (a.metric_value || 0))
    .slice(0, 12)

  if (!actionRows.length) return { stored: true, created: 0, actions: [] }

  const { data, error } = await supabaseAdmin
    .from('behavior_study_tools_growth_signals')
    .insert(actionRows)
    .select('*')

  if (error) throw error
  return {
    stored: true,
    created: data?.length || 0,
    actions: ((data || []) as SeoSignalRow[]).map(toApiAction),
  }
}

async function listActions(limit = 20) {
  if (!supabaseAdmin) return { stored: false, actions: [] }
  const { data, error } = await supabaseAdmin
    .from('behavior_study_tools_growth_signals')
    .select('*')
    .eq('source', 'seo_action_queue')
    .eq('signal_type', 'page_improvement_action')
    .order('signal_date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return {
    stored: true,
    actions: ((data || []) as SeoSignalRow[]).map(toApiAction),
  }
}

export async function GET(request: NextRequest) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(Number(searchParams.get('limit') || 20), 100)
    const result = await listActions(Number.isFinite(limit) ? limit : 20)
    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'SEO actions could not be loaded',
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json().catch(() => ({}))
    const action = cleanString((body as Record<string, unknown>).action, 80) || 'generate'
    if (action !== 'generate') {
      return NextResponse.json({ error: 'Unsupported action' }, { status: 400 })
    }
    const limit = Math.min(Number((body as Record<string, unknown>).limit || 20), 100)
    const result = await generateActions(Number.isFinite(limit) ? limit : 20)
    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'SEO actions could not be generated',
    }, { status: 500 })
  }
}
