import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { isValidAdminSessionToken } from '@/lib/adminSession'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

const COOKIE_NAME = 'bs_admin_session'

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

async function generateDrafts(limit = 10) {
  if (!supabaseAdmin) return { stored: false, created: 0, drafts: [] }

  const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  const [{ data: actions, error: actionError }, { data: existing, error: existingError }] = await Promise.all([
    supabaseAdmin
      .from('behavior_study_tools_growth_signals')
      .select('*')
      .gte('signal_date', since)
      .eq('source', 'seo_action_queue')
      .eq('signal_type', 'page_improvement_action')
      .in('status', ['queued', 'reviewing', 'new'])
      .order('metric_value', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit),
    supabaseAdmin
      .from('behavior_study_tools_growth_signals')
      .select('metadata')
      .gte('signal_date', since)
      .eq('source', 'seo_content_draft')
      .eq('signal_type', 'page_copy_draft')
      .limit(500),
  ])

  if (actionError) throw actionError
  if (existingError) throw existingError

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

  const { data, error } = await supabaseAdmin
    .from('behavior_study_tools_growth_signals')
    .insert(rows)
    .select('*')

  if (error) throw error
  return {
    stored: true,
    created: data?.length || 0,
    drafts: ((data || []) as SignalRow[]).map(toApiDraft),
  }
}

async function listDrafts(limit = 10) {
  if (!supabaseAdmin) return { stored: false, drafts: [] }
  const { data, error } = await supabaseAdmin
    .from('behavior_study_tools_growth_signals')
    .select('*')
    .eq('source', 'seo_content_draft')
    .eq('signal_type', 'page_copy_draft')
    .order('signal_date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return {
    stored: true,
    drafts: ((data || []) as SignalRow[]).map(toApiDraft),
  }
}

async function updateDraftStatus(id: string, status: string) {
  if (!supabaseAdmin) return { stored: false, draft: null }
  if (!id) throw new Error('Draft id is required.')
  if (!['draft', 'reviewing', 'approved', 'applied', 'rejected'].includes(status)) {
    throw new Error('Unsupported draft status.')
  }

  const { data, error } = await supabaseAdmin
    .from('behavior_study_tools_growth_signals')
    .update({ status })
    .eq('id', id)
    .eq('source', 'seo_content_draft')
    .eq('signal_type', 'page_copy_draft')
    .select('*')
    .single()

  if (error) throw error
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
