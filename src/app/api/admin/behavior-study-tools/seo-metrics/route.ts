import { createSign } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

const COOKIE_NAME = 'bs_admin_session'
const SESSION_MAX_AGE = 60 * 60 * 24
const DEFAULT_LIMIT = 100
const GSC_SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly'

type SeoSignal = {
  signal_date: string
  source: 'google_search_console' | 'ahrefs'
  signal_type: 'seo_metric'
  channel: string
  url: string | null
  keyword: string | null
  topic: string | null
  metric_name: string
  metric_value: number | null
  previous_value: number | null
  change_value: number | null
  change_percent: number | null
  metadata: Record<string, unknown>
  recommendation: string
  status: string
}

type SearchConsoleRow = {
  keys?: string[]
  clicks?: number
  impressions?: number
  ctr?: number
  position?: number
}

type CollectorResult = {
  source: string
  stored: boolean
  imported: number
  signals: SeoSignal[]
  warning?: string
}

function isValidToken(token: string): boolean {
  const [tsPart] = token.split('.')
  if (!tsPart) return false
  const ts = parseInt(tsPart, 36)
  if (Number.isNaN(ts)) return false
  return Date.now() - ts < SESSION_MAX_AGE * 1000
}

async function isAuthorized(request: NextRequest) {
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

function numberValue(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value.replace(/[$,%\s,]/g, ''))
    if (Number.isFinite(parsed)) return parsed
  }
  return null
}

function dateDaysAgo(daysAgo: number) {
  return new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
}

function base64Url(value: string | Buffer) {
  return Buffer.from(value)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function googleServiceAccount() {
  const json = cleanString(process.env.BST_GOOGLE_SERVICE_ACCOUNT_JSON, 10000)
  if (json) {
    try {
      const parsed = JSON.parse(json) as { client_email?: string; private_key?: string }
      if (parsed.client_email && parsed.private_key) {
        return {
          email: parsed.client_email,
          privateKey: parsed.private_key.replace(/\\n/g, '\n'),
        }
      }
    } catch {
      // Fall back to individual env vars below.
    }
  }

  const email = cleanString(process.env.BST_GSC_SERVICE_ACCOUNT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL, 500)
  const privateKey = cleanString(process.env.BST_GSC_PRIVATE_KEY || process.env.GOOGLE_PRIVATE_KEY, 5000)
  if (!email || !privateKey) return null
  return {
    email,
    privateKey: privateKey.replace(/\\n/g, '\n'),
  }
}

async function googleAccessToken() {
  const account = googleServiceAccount()
  if (!account) return null

  const now = Math.floor(Date.now() / 1000)
  const header = base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const claim = base64Url(JSON.stringify({
    iss: account.email,
    scope: GSC_SCOPE,
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  }))
  const unsigned = `${header}.${claim}`
  const signer = createSign('RSA-SHA256')
  signer.update(unsigned)
  const signature = signer.sign(account.privateKey)
  const assertion = `${unsigned}.${base64Url(signature)}`

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok || typeof data.access_token !== 'string') {
    throw new Error(typeof data.error_description === 'string' ? data.error_description : 'Google token request failed')
  }
  return data.access_token as string
}

async function searchConsoleQuery({
  accessToken,
  siteUrl,
  startDate,
  endDate,
  limit,
}: {
  accessToken: string
  siteUrl: string
  startDate: string
  endDate: string
  limit: number
}) {
  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      startDate,
      endDate,
      dimensions: ['query', 'page'],
      rowLimit: limit,
      searchType: 'web',
    }),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(typeof data.error?.message === 'string' ? data.error.message : `Search Console returned ${response.status}`)
  }
  return Array.isArray(data.rows) ? data.rows as SearchConsoleRow[] : []
}

function gscRecommendation(row: SearchConsoleRow, query: string, page: string) {
  const clicks = row.clicks || 0
  const impressions = row.impressions || 0
  const ctrPercent = (row.ctr || 0) * 100
  const position = row.position || 0

  if (impressions >= 50 && clicks < 3) {
    return `High impressions but weak clicks for "${query}". Rewrite the title/meta and make the first CTA match the search intent.`
  }
  if (ctrPercent > 0 && ctrPercent < 2 && impressions >= 25) {
    return `CTR is low for "${query}". Make the snippet promise the exact study action candidates get on this page.`
  }
  if (position > 8 && position <= 20) {
    return `This page is close to page one for "${query}". Add a focused FAQ, internal link, and product screenshot.`
  }
  return `Use this Search Console query/page signal to improve the matching headline, FAQ, internal link, or CTA on ${page}.`
}

async function collectSearchConsole(limit: number): Promise<CollectorResult> {
  const siteUrl = cleanString(process.env.BST_GSC_SITE_URL || 'https://behaviorstudytools.com/', 500)
  const accessToken = await googleAccessToken()
  if (!accessToken) {
    return {
      source: 'google_search_console',
      stored: false,
      imported: 0,
      signals: [],
      warning: 'GSC service account env vars are not configured.',
    }
  }

  const endDate = dateDaysAgo(Number(process.env.BST_SEO_DATA_DELAY_DAYS || 3))
  const startDate = dateDaysAgo(Number(process.env.BST_SEO_DATA_DELAY_DAYS || 3) + 6)
  const previousEndDate = dateDaysAgo(Number(process.env.BST_SEO_DATA_DELAY_DAYS || 3) + 7)
  const previousStartDate = dateDaysAgo(Number(process.env.BST_SEO_DATA_DELAY_DAYS || 3) + 13)
  const [currentRows, previousRows] = await Promise.all([
    searchConsoleQuery({ accessToken, siteUrl, startDate, endDate, limit }),
    searchConsoleQuery({ accessToken, siteUrl, startDate: previousStartDate, endDate: previousEndDate, limit }),
  ])

  const previousByKey = new Map(previousRows.map((row) => [row.keys?.join('\t') || '', row]))
  const signalDate = new Date().toISOString().slice(0, 10)
  const signals = currentRows.map((row): SeoSignal => {
    const [query = '', page = ''] = row.keys || []
    const previous = previousByKey.get(row.keys?.join('\t') || '')
    const clicks = row.clicks ?? null
    const previousClicks = previous?.clicks ?? null
    const change = clicks !== null && previousClicks !== null ? clicks - previousClicks : null
    const changePercent = change !== null && previousClicks ? Math.round((change / previousClicks) * 1000) / 10 : null

    return {
      signal_date: signalDate,
      source: 'google_search_console',
      signal_type: 'seo_metric',
      channel: 'organic_search',
      url: page || null,
      keyword: query || null,
      topic: query || page || 'Search Console query/page movement',
      metric_name: 'clicks',
      metric_value: clicks,
      previous_value: previousClicks,
      change_value: change,
      change_percent: changePercent,
      metadata: {
        startDate,
        endDate,
        previousStartDate,
        previousEndDate,
        impressions: row.impressions ?? null,
        previousImpressions: previous?.impressions ?? null,
        ctr: row.ctr ?? null,
        previousCtr: previous?.ctr ?? null,
        position: row.position ?? null,
        previousPosition: previous?.position ?? null,
      },
      recommendation: gscRecommendation(row, query, page),
      status: 'collected',
    }
  })

  return storeSeoSignals('google_search_console', signals)
}

function ahrefsRowsFrom(data: unknown): Record<string, unknown>[] {
  if (!data || typeof data !== 'object') return []
  const record = data as Record<string, unknown>
  const candidates = [record.rows, record.data, record.keywords, record.organic_keywords, record.results]
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate.filter((row): row is Record<string, unknown> => !!row && typeof row === 'object' && !Array.isArray(row))
  }
  return []
}

function ahrefsRecommendation(keyword: string, position: number | null, previous: number | null) {
  if (position !== null && previous !== null && position > previous) {
    return `Ranking fell for "${keyword}". Refresh the page with stronger intent match, internal links, and proof that candidates can start practice immediately.`
  }
  if (position !== null && position > 8 && position <= 20) {
    return `Keyword "${keyword}" is near page one. Add one focused section and link to it from the homepage or matching comparison page.`
  }
  return `Use this Ahrefs keyword movement to choose the next page refresh, comparison angle, or internal link.`
}

async function collectAhrefs(limit: number): Promise<CollectorResult> {
  const token = cleanString(process.env.AHREFS_API_TOKEN || process.env.BST_AHREFS_API_TOKEN, 1000)
  if (!token) {
    return {
      source: 'ahrefs',
      stored: false,
      imported: 0,
      signals: [],
      warning: 'AHREFS_API_TOKEN or BST_AHREFS_API_TOKEN is not configured.',
    }
  }

  const baseUrl = cleanString(process.env.BST_AHREFS_ORGANIC_KEYWORDS_URL || 'https://api.ahrefs.com/v3/site-explorer/organic-keywords', 1000)
  const url = new URL(baseUrl)
  if (!url.searchParams.has('target')) url.searchParams.set('target', cleanString(process.env.BST_AHREFS_TARGET || 'behaviorstudytools.com', 300))
  if (!url.searchParams.has('mode')) url.searchParams.set('mode', cleanString(process.env.BST_AHREFS_MODE || 'domain', 40))
  if (!url.searchParams.has('country')) url.searchParams.set('country', cleanString(process.env.BST_AHREFS_COUNTRY || 'us', 20))
  if (!url.searchParams.has('limit')) url.searchParams.set('limit', String(limit))
  if (!url.searchParams.has('output')) url.searchParams.set('output', 'json')

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    return {
      source: 'ahrefs',
      stored: false,
      imported: 0,
      signals: [],
      warning: typeof data.error === 'string' ? data.error : `Ahrefs returned ${response.status}. Set BST_AHREFS_ORGANIC_KEYWORDS_URL if your workspace endpoint differs.`,
    }
  }

  const signalDate = new Date().toISOString().slice(0, 10)
  const signals = ahrefsRowsFrom(data).slice(0, limit).map((row): SeoSignal => {
    const keyword = cleanString(row.keyword || row.query, 300)
    const page = cleanString(row.url || row.page || row.landing_page, 1000)
    const position = numberValue(row.position || row.rank)
    const previous = numberValue(row.previous_position || row.prev_position || row.previous || row.previous_rank)
    const changeValue = position !== null && previous !== null ? previous - position : null
    const changePercent = changeValue !== null && previous ? Math.round((changeValue / previous) * 1000) / 10 : null

    return {
      signal_date: signalDate,
      source: 'ahrefs',
      signal_type: 'seo_metric',
      channel: 'organic_search',
      url: page || null,
      keyword: keyword || null,
      topic: keyword || page || 'Ahrefs organic keyword movement',
      metric_name: 'position',
      metric_value: position,
      previous_value: previous,
      change_value: changeValue,
      change_percent: changePercent,
      metadata: {
        volume: numberValue(row.volume || row.search_volume),
        traffic: numberValue(row.traffic || row.organic_traffic),
        difficulty: numberValue(row.keyword_difficulty || row.kd),
        raw: row,
      },
      recommendation: ahrefsRecommendation(keyword || 'this keyword', position, previous),
      status: 'collected',
    }
  })

  return storeSeoSignals('ahrefs', signals)
}

async function storeSeoSignals(source: CollectorResult['source'], signals: SeoSignal[]): Promise<CollectorResult> {
  if (!supabaseAdmin) {
    return { source, stored: false, imported: signals.length, signals }
  }
  if (!signals.length) {
    return { source, stored: true, imported: 0, signals }
  }

  const { data, error } = await supabaseAdmin
    .from('behavior_study_tools_growth_signals')
    .insert(signals)
    .select()

  if (error) {
    return {
      source,
      stored: false,
      imported: 0,
      signals,
      warning: error.message,
    }
  }

  return {
    source,
    stored: true,
    imported: data?.length || 0,
    signals,
  }
}

async function collectSeoMetrics(limit = DEFAULT_LIMIT) {
  const boundedLimit = Math.max(10, Math.min(limit, 250))
  const results = await Promise.allSettled([
    collectSearchConsole(boundedLimit),
    collectAhrefs(Math.min(boundedLimit, 100)),
  ])

  return results.map((result, index) => {
    if (result.status === 'fulfilled') return result.value
    return {
      source: index === 0 ? 'google_search_console' : 'ahrefs',
      stored: false,
      imported: 0,
      signals: [],
      warning: result.reason instanceof Error ? result.reason.message : 'SEO collector failed',
    }
  })
}

export async function GET(request: NextRequest) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const limit = numberValue(searchParams.get('limit')) || DEFAULT_LIMIT
  const results = await collectSeoMetrics(limit)
  return NextResponse.json({
    success: true,
    results,
    imported: results.reduce((total, result) => total + result.imported, 0),
    warnings: results.map((result) => result.warning).filter(Boolean),
  })
}

export async function POST(request: NextRequest) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const limit = numberValue((body as Record<string, unknown>).limit) || DEFAULT_LIMIT
  const results = await collectSeoMetrics(limit)
  return NextResponse.json({
    success: true,
    results,
    imported: results.reduce((total, result) => total + result.imported, 0),
    warnings: results.map((result) => result.warning).filter(Boolean),
  })
}
