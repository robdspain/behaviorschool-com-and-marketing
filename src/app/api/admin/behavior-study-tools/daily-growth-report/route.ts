import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

const COOKIE_NAME = 'bs_admin_session'
const SESSION_MAX_AGE = 60 * 60 * 24
const WINDOW_DAYS = 7

type MarketingEventRow = {
  event_name: string | null
  page_path: string | null
  visitor_id: string | null
  session_id: string | null
  location: string | null
  intent: string | null
  destination: string | null
  source: string | null
  received_at: string | null
  payload: Record<string, unknown> | null
}

type ActivityRow = {
  activity_date: string | null
  channel: string | null
  primary_action: string | null
  published_url: string | null
  customer_signal: string | null
  competitor_signal: string | null
  seo_improvement: string | null
  next_step: string | null
  status: string | null
  created_at: string | null
}

type GrowthSignalRow = {
  signal_date: string | null
  source: string | null
  signal_type: string | null
  channel: string | null
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

type DailyAction = {
  priority: 'high' | 'medium' | 'low'
  lane: 'Conversion' | 'SEO' | 'Social' | 'Retention' | 'Research' | 'Data'
  title: string
  evidence: string
  action: string
  href?: string
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

function cleanDate(value: string | null | undefined) {
  const parsed = value ? new Date(value) : null
  if (!parsed || Number.isNaN(parsed.getTime())) return ''
  return parsed.toISOString().slice(0, 10)
}

function isFilled(value: string | null | undefined) {
  return Boolean(value && value.trim())
}

function rate(numerator: number, denominator: number) {
  return denominator ? Math.round((numerator / denominator) * 1000) / 10 : 0
}

function payloadString(event: MarketingEventRow, key: string) {
  const value = event.payload?.[key]
  return typeof value === 'string' ? value : ''
}

function getStudyPath(event: MarketingEventRow) {
  const explicitPath = payloadString(event, 'studyPath')
  if (explicitPath) return explicitPath
  if (event.destination?.includes('/onboarding/rbt')) return 'rbt'
  if (event.destination?.includes('/onboarding/bcba')) return 'bcba'
  const legacyPath = payloadString(event, 'path')
  if (legacyPath === 'bcba' || legacyPath === 'rbt') return legacyPath
  return 'unknown'
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

function sourceFreshness(signals: GrowthSignalRow[], source: string, aliases = [source]) {
  const latest = signals
    .filter((signal) => aliases.includes(signal.source || '') || (source === 'social' && signal.signal_type === 'social_feedback'))
    .map((signal) => cleanDate(signal.signal_date || signal.created_at))
    .filter(Boolean)
    .sort()
    .at(-1)

  if (!latest) return { source, status: 'missing' as const, latest: null, ageDays: null }

  const ageMs = Date.now() - new Date(`${latest}T00:00:00.000Z`).getTime()
  const ageDays = Math.max(0, Math.floor(ageMs / (24 * 60 * 60 * 1000)))
  return {
    source,
    status: ageDays <= 1 ? 'fresh' as const : ageDays <= 7 ? 'stale' as const : 'missing' as const,
    latest,
    ageDays,
  }
}

function strongestSeoSignal(signals: GrowthSignalRow[]) {
  const actionSignal = signals
    .filter((signal) => signal.source === 'seo_action_queue' && signal.signal_type === 'page_improvement_action')
    .sort((a, b) => (b.metric_value ?? 0) - (a.metric_value ?? 0))[0]
  if (actionSignal) return actionSignal

  const seoSignals = signals.filter((signal) =>
    ['google_search_console', 'gsc', 'ahrefs'].includes(signal.source || '')
  )

  return seoSignals
    .filter((signal) => isFilled(signal.keyword) || isFilled(signal.url) || isFilled(signal.recommendation))
    .sort((a, b) => {
      const aMagnitude = Math.abs(a.change_percent ?? a.change_value ?? a.metric_value ?? 0)
      const bMagnitude = Math.abs(b.change_percent ?? b.change_value ?? b.metric_value ?? 0)
      return bMagnitude - aMagnitude
    })[0]
}

function strongestSocialSignal(signals: GrowthSignalRow[]) {
  return signals
    .filter((signal) => ['linkedin', 'instagram', 'facebook', 'tiktok', 'youtube', 'email', 'social'].includes(signal.source || '') || signal.signal_type === 'social_feedback')
    .sort((a, b) => (b.metric_value ?? 0) - (a.metric_value ?? 0))[0]
}

function buildDailyActions({
  events,
  activities,
  signals,
}: {
  events: MarketingEventRow[]
  activities: ActivityRow[]
  signals: GrowthSignalRow[]
}): DailyAction[] {
  const actions: DailyAction[] = []
  const pageViews = events.filter((event) => event.event_name === 'page_view')
  const ctaClicks = events.filter((event) => event.event_name === 'cta_click')
  const appStarts = ctaClicks.filter((event) => event.destination?.includes('study.behaviorschool.com'))
  const signups = events.filter((event) => ['account_created', 'study_app_signup', 'signup_complete', 'free_trial_start'].includes(event.event_name || ''))
  const trials = events.filter((event) => ['free_trial_start', 'trial_start'].includes(event.event_name || ''))
  const paid = events.filter((event) => ['paid_conversion', 'subscription_started', 'trial_converted', 'purchase'].includes(event.event_name || ''))
  const retention = events.filter((event) => ['practice_session_started', 'quiz_completed', 'mock_completed', 'returning_user_session'].includes(event.event_name || ''))
  const pages = new Map<string, number>()
  const pageClicks = new Map<string, number>()
  pageViews.forEach((event) => addCount(pages, event.page_path))
  ctaClicks.forEach((event) => addCount(pageClicks, event.page_path))

  const weakPage = Array.from(pages.entries())
    .map(([path, views]) => ({ path, views, clicks: pageClicks.get(path) || 0 }))
    .filter((page) => page.views >= 2 && page.clicks === 0)
    .sort((a, b) => b.views - a.views)[0]

  if (weakPage) {
    actions.push({
      priority: 'high',
      lane: 'Conversion',
      title: `Fix the CTA on ${weakPage.path}.`,
      evidence: `${weakPage.views} visits and 0 app starts in the last ${WINDOW_DAYS} days.`,
      action: 'Make the first CTA specific to the candidate path: start free BCBA practice or start RBT practice.',
      href: `https://behaviorstudytools.com${weakPage.path === '/' ? '' : weakPage.path}`,
    })
  } else if (pageViews.length > 0 && appStarts.length === 0) {
    actions.push({
      priority: 'high',
      lane: 'Conversion',
      title: 'Traffic is not becoming app starts.',
      evidence: `${pageViews.length} tracked visits and 0 app-start clicks.`,
      action: 'Rewrite the hero CTA to say exactly what happens next: answer free practice questions in the web app.',
      href: 'https://behaviorstudytools.com',
    })
  }

  if (appStarts.length > 0 && signups.length === 0) {
    actions.push({
      priority: 'high',
      lane: 'Conversion',
      title: 'App starts are not becoming tracked signups yet.',
      evidence: `${appStarts.length} app starts and 0 signup/free-trial events.`,
      action: 'Run a live onboarding test and confirm account_created and free_trial_start events appear in this report.',
      href: 'https://study.behaviorschool.com',
    })
  }

  if (trials.length > 0 && paid.length === 0) {
    actions.push({
      priority: 'high',
      lane: 'Retention',
      title: 'Trials are not proving paid conversion yet.',
      evidence: `${trials.length} trial starts and 0 paid conversion events.`,
      action: 'Verify Stripe and RevenueCat subscription_started or trial_converted events after checkout.',
    })
  }

  if (signups.length > 0 && retention.length === 0) {
    actions.push({
      priority: 'medium',
      lane: 'Retention',
      title: 'Signup is visible but return practice is not.',
      evidence: `${signups.length} signup events and 0 practice/return events.`,
      action: 'Check whether practice_session_started and returning_user_session events arrive after a new user signs back in.',
    })
  }

  const seoSignal = strongestSeoSignal(signals)
  if (seoSignal) {
    actions.push({
      priority: seoSignal.change_percent && seoSignal.change_percent < 0 ? 'high' : 'medium',
      lane: 'SEO',
      title: seoSignal.keyword ? `Improve the page targeting "${seoSignal.keyword}".` : 'Use the strongest SEO signal for today.',
      evidence: `${seoSignal.source}: ${seoSignal.metric_name || 'metric'} ${seoSignal.metric_value ?? 'logged'}${seoSignal.change_percent ? ` (${seoSignal.change_percent}% change)` : ''}.`,
      action: seoSignal.recommendation || 'Update the matching page headline, FAQ, internal link, or CTA based on this query/page movement.',
      href: seoSignal.url || undefined,
    })
  } else {
    actions.push({
      priority: 'medium',
      lane: 'SEO',
      title: "Import today's GSC or Ahrefs movement.",
      evidence: 'No structured SEO signal is available in the growth-signal table.',
      action: 'Add clicks, impressions, CTR, position, and keyword movement for the pages receiving or losing visibility.',
    })
  }

  const socialSignal = strongestSocialSignal(signals)
  if (socialSignal) {
    actions.push({
      priority: 'medium',
      lane: 'Social',
      title: socialSignal.topic ? `Turn "${socialSignal.topic}" into the next post.` : 'Use the strongest social feedback signal.',
      evidence: `${socialSignal.source}: ${socialSignal.metric_name || 'engagement'} ${socialSignal.metric_value ?? 'logged'}.`,
      action: socialSignal.recommendation || 'Create one post that answers the comment, objection, or topic that produced feedback.',
      href: socialSignal.url || undefined,
    })
  } else {
    actions.push({
      priority: 'medium',
      lane: 'Social',
      title: 'No structured social feedback has been logged.',
      evidence: 'The daily monitor cannot compare posts until feedback is imported.',
      action: "Log the post URL, channel, clicks, comments, saves, or replies from today's campaign.",
    })
  }

  const hasCustomerSignal = activities.some((entry) => isFilled(entry.customer_signal))
  const hasCompetitorSignal = activities.some((entry) => isFilled(entry.competitor_signal))
  if (!hasCustomerSignal || !hasCompetitorSignal) {
    actions.push({
      priority: 'medium',
      lane: 'Research',
      title: 'Close the research loop before editing more pages.',
      evidence: !hasCustomerSignal && !hasCompetitorSignal
        ? 'No customer or competitor signal is logged this week.'
        : !hasCustomerSignal
          ? 'No customer signal is logged this week.'
          : 'No competitor signal is logged this week.',
      action: 'Capture one candidate objection and one competitor/review claim, then make the next page edit from that evidence.',
    })
  }

  return actions.slice(0, 8)
}

export async function GET(request: NextRequest) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json({
      success: true,
      stored: false,
      generatedAt: new Date().toISOString(),
      warning: 'Supabase is not configured.',
      report: null,
    })
  }

  const { searchParams } = new URL(request.url)
  const persistSnapshot = searchParams.get('persist') === '1'
  const sinceIso = new Date(Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString()
  const sinceDate = sinceIso.slice(0, 10)

  const [eventResult, activityResult, signalResult] = await Promise.all([
    supabaseAdmin
      .from('behavior_study_tools_marketing_events')
      .select('event_name,page_path,visitor_id,session_id,location,intent,destination,source,received_at,payload')
      .gte('received_at', sinceIso)
      .order('received_at', { ascending: false })
      .limit(5000),
    supabaseAdmin
      .from('behavior_study_tools_marketing_activity')
      .select('activity_date,channel,primary_action,published_url,customer_signal,competitor_signal,seo_improvement,next_step,status,created_at')
      .gte('activity_date', sinceDate)
      .order('activity_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(100),
    supabaseAdmin
      .from('behavior_study_tools_growth_signals')
      .select('signal_date,source,signal_type,channel,url,keyword,topic,metric_name,metric_value,previous_value,change_value,change_percent,metadata,recommendation,status,created_at')
      .gte('signal_date', sinceDate)
      .order('signal_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(500),
  ])

  const warning = eventResult.error?.message || activityResult.error?.message || signalResult.error?.message || null
  const events = ((eventResult.data || []) as MarketingEventRow[])
  const activities = ((activityResult.data || []) as ActivityRow[])
  const signals = ((signalResult.data || []) as GrowthSignalRow[])

  const pageViews = events.filter((event) => event.event_name === 'page_view')
  const ctaClicks = events.filter((event) => event.event_name === 'cta_click')
  const appStarts = ctaClicks.filter((event) => event.destination?.includes('study.behaviorschool.com'))
  const signups = events.filter((event) => ['account_created', 'study_app_signup', 'signup_complete', 'free_trial_start'].includes(event.event_name || ''))
  const trials = events.filter((event) => ['free_trial_start', 'trial_start'].includes(event.event_name || ''))
  const paid = events.filter((event) => ['paid_conversion', 'subscription_started', 'trial_converted', 'purchase'].includes(event.event_name || ''))
  const retention = events.filter((event) => ['practice_session_started', 'quiz_completed', 'mock_completed', 'returning_user_session'].includes(event.event_name || ''))
  const paths = new Map<string, number>()
  const channels = new Map<string, number>()
  const studyPaths = new Map<string, number>()
  pageViews.forEach((event) => addCount(paths, event.page_path))
  activities.forEach((entry) => addCount(channels, entry.channel))
  ctaClicks.forEach((event) => addCount(studyPaths, getStudyPath(event)))

  const sourceStatus = [
    sourceFreshness(signals, 'google_search_console', ['google_search_console', 'gsc']),
    sourceFreshness(signals, 'ahrefs'),
    sourceFreshness(signals, 'seo_action_queue'),
    sourceFreshness(signals, 'seo_content_draft'),
    sourceFreshness(signals, 'social', ['social', 'linkedin', 'instagram', 'facebook', 'tiktok', 'youtube', 'email']),
    sourceFreshness(signals, 'trend_research'),
    sourceFreshness(signals, 'competitor_research'),
  ]

  const actions = buildDailyActions({ events, activities, signals })
  const report = {
    windowDays: WINDOW_DAYS,
    generatedAt: new Date().toISOString(),
    conversion: {
      pageViews: pageViews.length,
      ctaClicks: ctaClicks.length,
      appStarts: appStarts.length,
      signups: signups.length,
      freeTrialStarts: trials.length,
      paidConversions: paid.length,
      retentionEvents: retention.length,
      visitorToStartRate: rate(appStarts.length, pageViews.length),
      appStartToSignupRate: rate(signups.length, appStarts.length),
      trialToPaidRate: rate(paid.length, trials.length),
    },
    signalCoverage: {
      sourceStatus,
      growthSignals: signals.length,
      activityLogs: activities.length,
      structuredSeoSignals: signals.filter((signal) => ['google_search_console', 'gsc', 'ahrefs'].includes(signal.source || '')).length,
      structuredSocialSignals: signals.filter((signal) => ['linkedin', 'instagram', 'facebook', 'tiktok', 'youtube', 'email', 'social'].includes(signal.source || '') || signal.signal_type === 'social_feedback').length,
    },
    topPages: topItems(paths),
    topChannels: topItems(channels),
    pathSplit: topItems(studyPaths),
    actions,
  }

  if (persistSnapshot) {
    await supabaseAdmin
      .from('behavior_study_tools_growth_signals')
      .insert({
        signal_date: new Date().toISOString().slice(0, 10),
        source: 'daily_monitor',
        signal_type: 'daily_growth_report',
        topic: 'Behavior Study Tools daily self-improvement loop',
        metric_name: 'recommended_actions',
        metric_value: actions.length,
        metadata: report,
        recommendation: actions[0]?.action || 'Keep collecting traffic, SEO, social, and retention signals.',
        status: actions.some((action) => action.priority === 'high') ? 'needs_action' : 'monitoring',
      })
  }

  return NextResponse.json({
    success: true,
    stored: !warning,
    warning,
    report,
  })
}
