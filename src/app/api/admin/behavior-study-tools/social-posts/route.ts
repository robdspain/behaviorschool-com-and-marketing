import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { behaviorStudyToolsMarketing } from '@/data/behaviorStudyToolsMarketing'

export const dynamic = 'force-dynamic'

const COOKIE_NAME = 'bs_admin_session'
const SESSION_MAX_AGE = 60 * 60 * 24
const dayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

type SocialPostRow = {
  id: string
  post_date: string
  scheduled_at: string
  platform: string
  status: string
  hook: string
  body: string
  cta_label: string | null
  cta_url: string | null
  asset: string | null
  source: string
  external_url: string | null
  publish_result: Record<string, unknown> | null
  feedback_metrics: Record<string, unknown> | null
  error_message: string | null
  published_at: string | null
  created_at: string
}

type DailyMonitorSignal = {
  id: string
  recommendation: string | null
  metadata: {
    actions?: Array<{
      lane?: string
      title?: string
      evidence?: string
      action?: string
      href?: string
    }>
  } | null
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

function cleanDate(value: unknown) {
  const input = cleanString(value, 60)
  const parsed = input ? new Date(input) : new Date()
  if (Number.isNaN(parsed.getTime())) return new Date().toISOString().slice(0, 10)
  return parsed.toISOString().slice(0, 10)
}

function toApiPost(row: SocialPostRow) {
  return {
    id: row.id,
    postDate: row.post_date,
    scheduledAt: row.scheduled_at,
    platform: row.platform,
    status: row.status,
    hook: row.hook,
    body: row.body,
    ctaLabel: row.cta_label,
    ctaUrl: row.cta_url,
    asset: row.asset,
    source: row.source,
    externalUrl: row.external_url,
    publishResult: row.publish_result || {},
    feedbackMetrics: row.feedback_metrics || {},
    errorMessage: row.error_message,
    publishedAt: row.published_at,
    createdAt: row.created_at,
  }
}

function todayPlan() {
  const today = dayOrder[new Date().getDay()]
  return behaviorStudyToolsMarketing.postPlan.find((post) => post.day === today) || behaviorStudyToolsMarketing.postPlan[0]
}

function postText({
  hook,
  body,
  ctaLabel,
  ctaUrl,
  insight,
}: {
  hook: string
  body: string
  ctaLabel: string
  ctaUrl: string
  insight?: string
}) {
  const insightBlock = insight ? `\n\nToday's signal: ${insight}` : ''
  return `${hook}\n\n${body}${insightBlock}\n\n${ctaLabel}: ${ctaUrl}\n\n#BCBA #RBT #BehaviorAnalysis #ExamPrep`
}

async function latestDailySignal() {
  if (!supabaseAdmin) return null
  const { data } = await supabaseAdmin
    .from('behavior_study_tools_growth_signals')
    .select('id,recommendation,metadata')
    .eq('source', 'daily_monitor')
    .eq('signal_type', 'daily_growth_report')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return (data || null) as DailyMonitorSignal | null
}

async function generateTodayPost() {
  if (!supabaseAdmin) return { post: null, stored: false, skipped: 'supabase_not_configured' }

  const plan = todayPlan()
  const postDate = new Date().toISOString().slice(0, 10)
  const existing = await supabaseAdmin
    .from('behavior_study_tools_social_posts')
    .select('*')
    .eq('post_date', postDate)
    .eq('platform', plan.platform)
    .in('status', ['queued', 'published', 'needs_publisher'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (existing.data) {
    return { post: toApiPost(existing.data as SocialPostRow), stored: true, skipped: 'already_exists' }
  }

  const dailySignal = await latestDailySignal()
  const primaryAction = dailySignal?.metadata?.actions?.[0]
  const insight = primaryAction?.title || dailySignal?.recommendation || ''
  const body = postText({
    hook: plan.hook,
    body: plan.post,
    ctaLabel: plan.ctaLabel,
    ctaUrl: plan.ctaHref,
    insight,
  })

  const { data, error } = await supabaseAdmin
    .from('behavior_study_tools_social_posts')
    .insert({
      post_date: postDate,
      scheduled_at: new Date().toISOString(),
      platform: plan.platform,
      status: 'queued',
      hook: plan.hook,
      body,
      cta_label: plan.ctaLabel,
      cta_url: plan.ctaHref,
      asset: plan.asset,
      source: 'daily_generator',
      source_signal_id: dailySignal?.id || null,
    })
    .select()
    .single()

  if (error) throw error
  return { post: toApiPost(data as SocialPostRow), stored: true, skipped: null }
}

async function publishPost(row: SocialPostRow) {
  const webhookUrl = process.env.BST_SOCIAL_POST_WEBHOOK_URL
  if (!supabaseAdmin) return toApiPost(row)

  if (!webhookUrl) {
    const { data } = await supabaseAdmin
      .from('behavior_study_tools_social_posts')
      .update({
        status: 'needs_publisher',
        error_message: 'BST_SOCIAL_POST_WEBHOOK_URL is not configured.',
        updated_at: new Date().toISOString(),
      })
      .eq('id', row.id)
      .select()
      .single()
    return toApiPost((data || row) as SocialPostRow)
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: row.id,
        platform: row.platform,
        text: row.body,
        hook: row.hook,
        ctaLabel: row.cta_label,
        ctaUrl: row.cta_url,
        asset: row.asset,
        scheduledAt: row.scheduled_at,
      }),
    })
    const result = await response.json().catch(async () => ({ body: await response.text() }))
    if (!response.ok) {
      throw new Error(typeof result?.error === 'string' ? result.error : `Publisher returned ${response.status}`)
    }

    const externalUrl = cleanString(result?.url || result?.permalink || result?.externalUrl, 1000) || null
    const { data } = await supabaseAdmin
      .from('behavior_study_tools_social_posts')
      .update({
        status: 'published',
        external_url: externalUrl,
        publish_result: result || {},
        error_message: null,
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', row.id)
      .select()
      .single()
    return toApiPost((data || row) as SocialPostRow)
  } catch (error) {
    const { data } = await supabaseAdmin
      .from('behavior_study_tools_social_posts')
      .update({
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Publish failed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', row.id)
      .select()
      .single()
    return toApiPost((data || row) as SocialPostRow)
  }
}

async function publishDuePosts(limit = 5) {
  if (!supabaseAdmin) return []
  const { data, error } = await supabaseAdmin
    .from('behavior_study_tools_social_posts')
    .select('*')
    .eq('status', 'queued')
    .lte('scheduled_at', new Date().toISOString())
    .order('scheduled_at', { ascending: true })
    .limit(limit)

  if (error) throw error

  const results = []
  for (const row of (data || []) as SocialPostRow[]) {
    results.push(await publishPost(row))
  }
  return results
}

export async function GET(request: NextRequest) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ success: true, stored: false, posts: [] })
  }

  const { searchParams } = new URL(request.url)
  const status = cleanString(searchParams.get('status'), 40)
  const limit = Math.min(Number(searchParams.get('limit') || 20), 100)
  let query = supabaseAdmin
    .from('behavior_study_tools_social_posts')
    .select('*')
    .order('scheduled_at', { ascending: false })
    .limit(Number.isFinite(limit) ? limit : 20)

  if (status) query = query.eq('status', status)

  const { data, error } = await query
  if (error) {
    return NextResponse.json({ success: true, stored: false, posts: [], warning: error.message })
  }

  return NextResponse.json({
    success: true,
    stored: true,
    posts: ((data || []) as SocialPostRow[]).map(toApiPost),
  })
}

export async function POST(request: NextRequest) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const action = cleanString(body.action, 80)

  try {
    if (action === 'generate_today') {
      const result = await generateTodayPost()
      return NextResponse.json({ success: true, ...result })
    }

    if (action === 'publish_due') {
      const posts = await publishDuePosts()
      return NextResponse.json({ success: true, posts })
    }

    if (action === 'run_daily') {
      const generated = await generateTodayPost()
      const published = await publishDuePosts()
      return NextResponse.json({ success: true, generated, published })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ success: true, stored: false }, { status: 202 })
    }

    const hook = cleanString(body.hook, 300)
    const rawBody = cleanString(body.body, 5000)
    const platform = cleanString(body.platform, 80)
    if (!hook || !rawBody || !platform) {
      return NextResponse.json({ error: 'platform, hook, and body are required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('behavior_study_tools_social_posts')
      .insert({
        post_date: cleanDate(body.postDate),
        scheduled_at: body.scheduledAt ? new Date(cleanString(body.scheduledAt, 80)).toISOString() : new Date().toISOString(),
        platform,
        status: cleanString(body.status, 40) || 'queued',
        hook,
        body: rawBody,
        cta_label: cleanString(body.ctaLabel, 120) || null,
        cta_url: cleanString(body.ctaUrl, 1000) || null,
        asset: cleanString(body.asset, 300) || null,
        source: cleanString(body.source, 80) || 'manual',
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ success: true, stored: true, post: toApiPost(data as SocialPostRow) }, { status: 201 })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Social post operation failed',
    }, { status: 500 })
  }
}
