import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { isValidAdminSessionToken } from '@/lib/adminSession'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

const COOKIE_NAME = 'bs_admin_session'
const MAX_IMPORT_ROWS = 250

type ImportProvider = 'gsc' | 'ahrefs' | 'social' | 'trend' | 'competitor'
type CsvRow = Record<string, string>


async function isAdminAuthenticated(request: NextRequest) {
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

function cleanDate(value: unknown) {
  const input = cleanString(value, 60)
  if (!input) return new Date().toISOString().slice(0, 10)
  const parsed = new Date(input)
  if (Number.isNaN(parsed.getTime())) return new Date().toISOString().slice(0, 10)
  return parsed.toISOString().slice(0, 10)
}

function parseNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value !== 'string') return null
  const normalized = value.replace(/[$,%\s,]/g, '')
  if (!normalized) return null
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : null
}

function normalizeHeader(header: string) {
  return header.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
}

function parseCsv(text: string): CsvRow[] {
  const rows: string[][] = []
  let current = ''
  let row: string[] = []
  let inQuotes = false

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index]
    const nextChar = text[index + 1]

    if (char === '"' && inQuotes && nextChar === '"') {
      current += '"'
      index += 1
      continue
    }

    if (char === '"') {
      inQuotes = !inQuotes
      continue
    }

    if (char === ',' && !inQuotes) {
      row.push(current)
      current = ''
      continue
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') index += 1
      row.push(current)
      current = ''
      if (row.some((cell) => cell.trim())) rows.push(row)
      row = []
      continue
    }

    current += char
  }

  row.push(current)
  if (row.some((cell) => cell.trim())) rows.push(row)

  const [headerRow, ...bodyRows] = rows
  if (!headerRow?.length) return []
  const headers = headerRow.map(normalizeHeader)
  return bodyRows.map((cells) => {
    const parsed: CsvRow = {}
    headers.forEach((header, index) => {
      parsed[header] = cells[index]?.trim() || ''
    })
    return parsed
  })
}

function get(row: CsvRow, keys: string[]) {
  for (const key of keys) {
    const value = row[normalizeHeader(key)]
    if (value) return value
  }
  return ''
}

function recommendationFor(provider: ImportProvider, row: CsvRow) {
  if (provider === 'gsc') {
    const query = get(row, ['query', 'queries', 'keyword'])
    const page = get(row, ['page', 'url', 'landing page'])
    const clicks = parseNumber(get(row, ['clicks']))
    const impressions = parseNumber(get(row, ['impressions']))
    const ctr = parseNumber(get(row, ['ctr']))
    const position = parseNumber(get(row, ['position', 'average position']))

    if (impressions && impressions >= 50 && (!clicks || clicks < 3)) {
      return `High impressions but weak clicks. Improve the title, meta description, and first CTA for ${query || page}.`
    }
    if (ctr !== null && ctr < 2 && impressions && impressions >= 25) {
      return `CTR is low. Rewrite the search snippet around the candidate's pain point and direct study outcome.`
    }
    if (position !== null && position > 8 && position <= 20) {
      return `Ranking is close to page one. Add a focused FAQ, internal link, and product screenshot to improve this page.`
    }
    return 'Use this query/page movement to improve the matching headline, FAQ, internal link, or CTA.'
  }

  if (provider === 'ahrefs') {
    const keyword = get(row, ['keyword', 'query'])
    const position = parseNumber(get(row, ['position', 'rank']))
    const previous = parseNumber(get(row, ['previous position', 'previous', 'prev position']))
    if (position !== null && previous !== null && position > previous) {
      return `Ranking fell for ${keyword || 'this keyword'}. Refresh the page with clearer intent match and stronger internal links.`
    }
    return 'Use this Ahrefs movement to pick the next keyword, page refresh, or competitor comparison improvement.'
  }

  if (provider === 'social') {
    return 'Turn this feedback into one post that answers the objection and links to the matching BCBA or RBT path.'
  }

  if (provider === 'competitor') {
    return 'Turn this competitor claim or gap into clearer proof, comparison copy, or a stronger FAQ answer.'
  }

  return 'Turn this trend into a short post and a matching page improvement.'
}

function sourceFor(provider: ImportProvider, row: CsvRow) {
  if (provider === 'gsc') return 'google_search_console'
  if (provider === 'ahrefs') return 'ahrefs'
  if (provider === 'trend') return 'trend_research'
  if (provider === 'competitor') return 'competitor_research'
  return 'social'
}

function signalTypeFor(provider: ImportProvider) {
  if (provider === 'gsc' || provider === 'ahrefs') return 'seo_metric'
  if (provider === 'social') return 'social_feedback'
  if (provider === 'competitor') return 'competitor_signal'
  return 'trend_research'
}

function metricNameFor(provider: ImportProvider, row: CsvRow) {
  if (provider === 'gsc') return get(row, ['metric', 'metric name']) || 'clicks'
  if (provider === 'ahrefs') return get(row, ['metric', 'metric name']) || 'position'
  if (provider === 'social') return get(row, ['metric', 'metric name']) || 'engagement'
  return get(row, ['metric', 'metric name']) || 'signal_strength'
}

function metricValueFor(provider: ImportProvider, row: CsvRow) {
  if (provider === 'gsc') {
    return parseNumber(get(row, ['clicks'])) ?? parseNumber(get(row, ['impressions']))
  }
  if (provider === 'ahrefs') {
    return parseNumber(get(row, ['position', 'rank'])) ?? parseNumber(get(row, ['traffic', 'volume']))
  }
  if (provider === 'social') {
    return parseNumber(get(row, ['engagements', 'engagement', 'clicks', 'comments', 'saves', 'replies']))
  }
  return parseNumber(get(row, ['score', 'volume', 'mentions', 'metric value']))
}

function mapRow(provider: ImportProvider, row: CsvRow, signalDate: string) {
  const keyword = cleanString(get(row, ['query', 'queries', 'keyword']), 300) || null
  const url = cleanString(get(row, ['page', 'url', 'landing page', 'post url', 'published url']), 1000) || null
  const topic = cleanString(get(row, ['topic', 'post', 'headline', 'title', 'comment', 'feedback']), 300) || keyword
  const metricValue = metricValueFor(provider, row)
  const previousValue = parseNumber(get(row, ['previous', 'previous value', 'previous position', 'prev position']))
  const changeValue = parseNumber(get(row, ['change', 'change value', 'position change']))
  const changePercent = parseNumber(get(row, ['change percent', 'change percentage', 'delta percent', 'ctr change']))

  return {
    signal_date: cleanDate(get(row, ['date', 'signal date']) || signalDate),
    source: sourceFor(provider, row),
    signal_type: signalTypeFor(provider),
    channel: cleanString(get(row, ['channel', 'platform']), 100) || null,
    url,
    keyword,
    topic,
    metric_name: metricNameFor(provider, row),
    metric_value: metricValue,
    previous_value: previousValue,
    change_value: changeValue,
    change_percent: changePercent,
    metadata: {
      provider,
      raw: row,
      impressions: parseNumber(get(row, ['impressions'])),
      ctr: parseNumber(get(row, ['ctr'])),
      position: parseNumber(get(row, ['position', 'average position', 'rank'])),
      volume: parseNumber(get(row, ['volume', 'search volume'])),
      comments: parseNumber(get(row, ['comments'])),
      saves: parseNumber(get(row, ['saves'])),
      replies: parseNumber(get(row, ['replies'])),
    },
    recommendation: cleanString(get(row, ['recommendation', 'next step']), 1500) || recommendationFor(provider, row),
    status: 'imported',
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const provider = cleanString((body as Record<string, unknown>).provider, 40) as ImportProvider
  if (!['gsc', 'ahrefs', 'social', 'trend', 'competitor'].includes(provider)) {
    return NextResponse.json({ error: 'Provider must be gsc, ahrefs, social, trend, or competitor' }, { status: 400 })
  }

  const signalDate = cleanDate((body as Record<string, unknown>).signalDate)
  const csvText = cleanString((body as Record<string, unknown>).csv, 200000)
  const jsonRows = (body as Record<string, unknown>).rows
  const rows = Array.isArray(jsonRows)
    ? (jsonRows as CsvRow[])
    : parseCsv(csvText)

  if (!rows.length) {
    return NextResponse.json({ error: 'No import rows found' }, { status: 400 })
  }

  const signals = rows.slice(0, MAX_IMPORT_ROWS).map((row) => mapRow(provider, row, signalDate))

  if (!supabaseAdmin) {
    return NextResponse.json({ success: true, stored: false, imported: signals.length, signals }, { status: 202 })
  }

  const { data, error } = await supabaseAdmin
    .from('behavior_study_tools_growth_signals')
    .insert(signals)
    .select()

  if (error) {
    console.warn('Growth signal import failed:', error.message)
    return NextResponse.json({ success: true, stored: false, imported: signals.length, warning: error.message, signals }, { status: 202 })
  }

  return NextResponse.json({
    success: true,
    stored: true,
    imported: data?.length || 0,
    signals: data || [],
  }, { status: 201 })
}
