import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { isValidAdminSessionToken } from '@/lib/adminSession'
import { api, getConvexClient } from '@/lib/convex'

export const dynamic = 'force-dynamic'

const COOKIE_NAME = 'bs_admin_auth'

type SignalRow = {
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

const pageFileMap: Record<string, string> = {
  '/': 'src/app/behavior-study-tools/page.tsx',
  '/free-bcba-practice-exam': 'src/app/free-bcba-practice-exam/page.tsx',
  '/bcba-mock-exam-6th-edition': 'src/app/bcba-mock-exam-6th-edition/page.tsx',
  '/bcba-study-app-school-based-bcbas': 'src/app/bcba-study-app-school-based-bcbas/page.tsx',
  '/compare/behaviorschool-vs-aba-wizard': 'src/app/compare/behaviorschool-vs-aba-wizard/page.tsx',
  '/compare/behaviorschool-vs-bds-modules': 'src/app/compare/behaviorschool-vs-bds-modules/page.tsx',
}


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

function pagePath(url: string | null) {
  if (!url) return '/'
  try {
    return new URL(url).pathname.replace(/\/$/, '') || '/'
  } catch {
    return url.replace(/^https?:\/\/[^/]+/i, '').replace(/\/$/, '') || '/'
  }
}

function targetFileFor(url: string | null) {
  return pageFileMap[pagePath(url)] || 'src/data/behaviorStudyToolsMarketing.ts'
}

function todayDate() {
  return new Date().toISOString().slice(0, 10)
}

function draftMetadata(action: SignalRow) {
  const metadata = action.metadata || {}
  const pageTitle = cleanString(metadata.pageTitle, 300) || action.topic || 'Behavior Study Tools page'
  const suggestedHeadline = cleanString(metadata.suggestedHeadline, 300)
  const suggestedMeta = cleanString(metadata.suggestedMeta, 500)
  const suggestedFaq = cleanString(metadata.suggestedFaq, 800)
  const suggestedCta = cleanString(metadata.suggestedCta, 120)
  const evidence = cleanString(metadata.evidence, 1200)
  const targetFile = targetFileFor(action.url)

  return {
    actionId: action.id,
    pageTitle,
    pageHref: action.url,
    targetFile,
    keyword: action.keyword,
    priority: cleanString(metadata.priority, 20) || 'medium',
    evidence,
    proposed: {
      heroHeadline: suggestedHeadline,
      metaDescription: suggestedMeta,
      faqAnswer: suggestedFaq,
      primaryCta: suggestedCta,
    },
    implementationNotes: [
      `Target file: ${targetFile}`,
      'Update the first visible message so it promises a concrete study outcome.',
      'Keep one primary CTA above the fold and repeat it after the first proof section.',
      'Add or update one FAQ answer using the generated wording if the page has an FAQ block.',
    ],
  }
}

function toApiDraft(row: SignalRow) {
  const metadata = row.metadata || {}
  const proposed = metadata.proposed && typeof metadata.proposed === 'object' && !Array.isArray(metadata.proposed)
    ? metadata.proposed as Record<string, unknown>
    : {}

  return {
    id: row.id,
    signalDate: row.signal_date,
    pageTitle: cleanString(metadata.pageTitle, 300),
    pageHref: cleanString(metadata.pageHref, 1000) || row.url,
    targetFile: cleanString(metadata.targetFile, 500),
    keyword: row.keyword,
    priority: cleanString(metadata.priority, 20) || 'medium',
    evidence: cleanString(metadata.evidence, 1200),
    heroHeadline: cleanString(proposed.heroHeadline, 300),
    metaDescription: cleanString(proposed.metaDescription, 500),
    faqAnswer: cleanString(proposed.faqAnswer, 800),
    primaryCta: cleanString(proposed.primaryCta, 120),
    implementationNotes: Array.isArray(metadata.implementationNotes) ? metadata.implementationNotes.map((item) => cleanString(item, 500)).filter(Boolean) : [],
    recommendation: row.recommendation,
    status: row.status,
    createdAt: row.created_at,
  }
}

function toConvexSignal(row: Record<string, unknown>) {
  return {
    signalDate: cleanString(row.signal_date, 40),
    source: cleanString(row.source, 80),
    signalType: cleanString(row.signal_type, 100),
    channel: cleanString(row.channel, 100) || null,
    url: cleanString(row.url, 1000) || null,
    keyword: cleanString(row.keyword, 300) || null,
    topic: cleanString(row.topic, 300) || null,
    metricName: cleanString(row.metric_name, 120) || null,
    metricValue: typeof row.metric_value === 'number' && Number.isFinite(row.metric_value) ? row.metric_value : null,
    previousValue: typeof row.previous_value === 'number' && Number.isFinite(row.previous_value) ? row.previous_value : null,
    changeValue: typeof row.change_value === 'number' && Number.isFinite(row.change_value) ? row.change_value : null,
    changePercent: typeof row.change_percent === 'number' && Number.isFinite(row.change_percent) ? row.change_percent : null,
    metadata: row.metadata && typeof row.metadata === 'object' && !Array.isArray(row.metadata) ? row.metadata : {},
    recommendation: cleanString(row.recommendation, 1500) || null,
    status: cleanString(row.status, 60) || 'new',
  }
}

async function generateDrafts(limit = 10) {
  const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  const [actions, existing] = await Promise.all([
    getConvexClient().query(api.bstMarketing.listGrowthSignals, {
      sinceDate: since,
      source: 'seo_action_queue',
      signalTypes: ['page_improvement_action'],
      statuses: ['queued', 'reviewing', 'new'],
      limit,
    }),
    getConvexClient().query(api.bstMarketing.listGrowthSignals, {
      sinceDate: since,
      source: 'seo_content_draft',
      signalTypes: ['page_copy_draft'],
      limit: 500,
    }),
  ])

  const existingActionIds = new Set(
    ((existing || []) as Array<{ metadata: Record<string, unknown> | null }>)
      .map((row) => cleanString(row.metadata?.actionId, 80))
      .filter(Boolean)
  )

  const rows = ((actions || []) as SignalRow[])
    .filter((action) => !existingActionIds.has(action.id))
    .map((action) => {
      const metadata = draftMetadata(action)
      return {
        signal_date: todayDate(),
        source: 'seo_content_draft',
        signal_type: 'page_copy_draft',
        channel: 'seo',
        url: metadata.pageHref,
        keyword: metadata.keyword,
        topic: `Draft update for ${metadata.pageTitle}`,
        metric_name: 'priority_score',
        metric_value: action.metric_value,
        previous_value: null,
        change_value: action.change_value,
        change_percent: action.change_percent,
        metadata,
        recommendation: `Review and apply the proposed copy update for ${metadata.pageTitle}.`,
        status: 'draft',
      }
    })

  if (!rows.length) return { stored: true, created: 0, drafts: [] }

  const data = await getConvexClient().mutation(api.bstMarketing.createGrowthSignals, {
    signals: rows.map(toConvexSignal),
  })
  return {
    stored: true,
    created: data?.length || 0,
    drafts: ((data || []) as SignalRow[]).map(toApiDraft),
  }
}

async function listDrafts(limit = 10) {
  const data = await getConvexClient().query(api.bstMarketing.listGrowthSignals, {
    source: 'seo_content_draft',
    signalTypes: ['page_copy_draft'],
    limit,
  })
  return {
    stored: true,
    drafts: ((data || []) as SignalRow[]).map(toApiDraft),
  }
}

async function updateDraftStatus(id: string, status: string) {
  if (!id) throw new Error('Draft id is required.')
  if (!['draft', 'reviewing', 'approved', 'applied', 'rejected'].includes(status)) {
    throw new Error('Unsupported draft status.')
  }

  const data = await getConvexClient().mutation(api.bstMarketing.updateGrowthSignalStatus, {
    id: id as never,
    status,
    source: 'seo_content_draft',
    signalType: 'page_copy_draft',
  })

  if (!data) throw new Error('Draft was not found.')
  return {
    stored: true,
    draft: toApiDraft(data as SignalRow),
  }
}

export async function GET(request: NextRequest) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(Number(searchParams.get('limit') || 10), 50)
    const result = await listDrafts(Number.isFinite(limit) ? limit : 10)
    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'SEO drafts could not be loaded',
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
    if (action === 'generate') {
      const limit = Math.min(Number((body as Record<string, unknown>).limit || 10), 50)
      const result = await generateDrafts(Number.isFinite(limit) ? limit : 10)
      return NextResponse.json({ success: true, ...result })
    }

    if (action === 'set_status') {
      const result = await updateDraftStatus(
        cleanString((body as Record<string, unknown>).id, 80),
        cleanString((body as Record<string, unknown>).status, 40)
      )
      return NextResponse.json({ success: true, ...result })
    }

    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'SEO draft action failed',
    }, { status: 500 })
  }
}
