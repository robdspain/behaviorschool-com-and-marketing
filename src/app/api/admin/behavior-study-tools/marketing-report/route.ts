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

type PagePerformance = {
  path: string
  pageViews: number
  ctaClicks: number
  clickRate: number
}

type MarketingActivityRow = {
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
  source: string | null
  signal_type: string | null
  metric_name: string | null
  metric_value: number | null
  created_at: string | null
}

type GrowthRecommendation = {
  priority: 'high' | 'medium' | 'low'
  area: 'CTA' | 'SEO' | 'Social' | 'Lifecycle' | 'Retention' | 'Research'
  title: string
  reason: string
  action: string
  href?: string
}

type DataHealthItem = {
  source: string
  status: 'connected' | 'partial' | 'missing'
  message: string
  nextStep: string
}

const SIGNUP_EVENTS = new Set([
  'account_created',
  'app_signup',
  'signup_complete',
  'free_trial_start',
  'trial_start',
  'study_app_signup',
])

const PAID_EVENTS = new Set([
  'checkout_completed',
  'paid_conversion',
  'purchase',
  'subscription_started',
  'trial_converted',
])

const RETENTION_EVENTS = new Set([
  'daily_practice_completed',
  'mock_completed',
  'practice_session_started',
  'question_answered',
  'quiz_completed',
  'returning_user_session',
  'session_start',
])

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

function rate(clicks: number, views: number) {
  return views ? Math.round((clicks / views) * 1000) / 10 : 0
}

function eventMatches(event: MarketingEventRow, names: Set<string>) {
  return names.has(event.event_name || '')
}

function isFilled(value: string | null | undefined) {
  return Boolean(value && value.trim())
}

function buildGrowthRecommendations({
  summary,
  pagePerformance,
  pagesNeedingCta,
  lifecycle,
  recentActivity,
}: {
  summary: {
    appStarts: number
    appStartRate: number
    bcbaStarts: number
    rbtStarts: number
    pageViews: number
    ctaClicks: number
  }
  pagePerformance: PagePerformance[]
  pagesNeedingCta: PagePerformance[]
  lifecycle: {
    signups: number
    freeTrialStarts: number
    paidConversions: number
    retentionEvents: number
  }
  recentActivity: MarketingActivityRow[]
}): GrowthRecommendation[] {
  const recommendations: GrowthRecommendation[] = []
  const highestViewedWeakPage = pagesNeedingCta[0]
  const lowestConvertingActivePage = pagePerformance
    .filter((page) => page.pageViews >= 3 && page.ctaClicks > 0)
    .sort((a, b) => a.clickRate - b.clickRate || b.pageViews - a.pageViews)[0]
  const hasRecentCustomerSignal = recentActivity.some((entry) => isFilled(entry.customer_signal))
  const hasRecentCompetitorSignal = recentActivity.some((entry) => isFilled(entry.competitor_signal))
  const hasRecentSeoImprovement = recentActivity.some((entry) => isFilled(entry.seo_improvement))
  const totalPathStarts = summary.bcbaStarts + summary.rbtStarts
  const rbtShare = totalPathStarts ? summary.rbtStarts / totalPathStarts : 0

  if (!summary.appStarts && summary.pageViews > 0) {
    recommendations.push({
      priority: 'high',
      area: 'CTA',
      title: 'The pages are getting visits but not app starts.',
      reason: `${summary.pageViews} tracked page views produced 0 app-start clicks.`,
      action: 'Make the first visible CTA say exactly what happens next: start free web practice, choose BCBA or RBT, then answer questions.',
      href: 'https://behaviorstudytools.com',
    })
  } else if (summary.appStartRate < 5 && summary.pageViews >= 10) {
    recommendations.push({
      priority: 'high',
      area: 'CTA',
      title: 'App-start rate is below the first target.',
      reason: `Current app-start rate is ${summary.appStartRate}%. A healthy first target is 5-8% while traffic is still small.`,
      action: 'Test one simpler hero headline and one direct CTA: “Start free BCBA practice” or “Start RBT practice.”',
      href: 'https://behaviorstudytools.com',
    })
  }

  if (highestViewedWeakPage) {
    recommendations.push({
      priority: 'high',
      area: 'SEO',
      title: `Fix ${highestViewedWeakPage.path} before adding more traffic.`,
      reason: `${highestViewedWeakPage.pageViews} views and 0 starts in this reporting window.`,
      action: 'Add a single above-the-fold CTA, one product screenshot, and copy that tells the candidate how this page helps them pass.',
      href: `https://behaviorstudytools.com${highestViewedWeakPage.path === '/' ? '' : highestViewedWeakPage.path}`,
    })
  } else if (lowestConvertingActivePage && lowestConvertingActivePage.clickRate < 5) {
    recommendations.push({
      priority: 'medium',
      area: 'SEO',
      title: `Improve the CTA clarity on ${lowestConvertingActivePage.path}.`,
      reason: `${lowestConvertingActivePage.pageViews} views with a ${lowestConvertingActivePage.clickRate}% start rate.`,
      action: 'Rewrite the page intro around the candidate pain point, then repeat the same CTA after the first proof section.',
      href: `https://behaviorstudytools.com${lowestConvertingActivePage.path === '/' ? '' : lowestConvertingActivePage.path}`,
    })
  }

  if (summary.rbtStarts === 0 && summary.ctaClicks > 0) {
    recommendations.push({
      priority: 'high',
      area: 'Social',
      title: 'RBT path is not getting tracked starts yet.',
      reason: 'There are CTA clicks, but no RBT-path starts in this window.',
      action: 'Publish one RBT-specific post and send it directly to the RBT web onboarding path.',
      href: 'https://study.behaviorschool.com/onboarding/rbt',
    })
  } else if (totalPathStarts >= 5 && rbtShare < 0.15) {
    recommendations.push({
      priority: 'medium',
      area: 'Social',
      title: 'RBT demand may be under-served.',
      reason: `RBT starts are ${Math.round(rbtShare * 100)}% of tracked path starts.`,
      action: 'Add RBT language to one homepage proof point and schedule one RBT-focused post this week.',
      href: 'https://behaviorstudytools.com',
    })
  }

  if (!lifecycle.signups && summary.appStarts > 0) {
    recommendations.push({
      priority: 'high',
      area: 'Lifecycle',
      title: 'App starts are not connected to signup events yet.',
      reason: `${summary.appStarts} app-start clicks are tracked, but signup/free-trial events are not showing in this report.`,
      action: 'Send account_created and free_trial_start events from study.behaviorschool.com into the marketing collector with the same visitor/session IDs when available.',
    })
  }

  if (lifecycle.freeTrialStarts > 0 && !lifecycle.paidConversions) {
    recommendations.push({
      priority: 'high',
      area: 'Lifecycle',
      title: 'Free trials are not proving paid conversion yet.',
      reason: `${lifecycle.freeTrialStarts} free-trial starts and 0 paid conversions are visible in this window.`,
      action: 'Send subscription_started or trial_converted events from Stripe/RevenueCat so trial-to-paid rate can drive daily decisions.',
    })
  }

  if (!lifecycle.retentionEvents && lifecycle.signups > 0) {
    recommendations.push({
      priority: 'medium',
      area: 'Retention',
      title: 'Signup is tracked, but retention is not.',
      reason: `${lifecycle.signups} signup events are visible with no practice-session or return-session events.`,
      action: 'Track practice_session_started, quiz_completed, and returning_user_session after signup to see whether candidates come back.',
    })
  }

  if (!hasRecentCustomerSignal || !hasRecentCompetitorSignal) {
    recommendations.push({
      priority: 'medium',
      area: 'Research',
      title: 'Today still needs a customer or competitor signal.',
      reason: !hasRecentCustomerSignal && !hasRecentCompetitorSignal
        ? 'No recent customer or competitor signal is logged.'
        : !hasRecentCustomerSignal
          ? 'No recent customer signal is logged.'
          : 'No recent competitor signal is logged.',
      action: 'Record one objection, comment, search query, review theme, or competitor claim before changing copy.',
    })
  }

  if (!hasRecentSeoImprovement) {
    recommendations.push({
      priority: 'low',
      area: 'SEO',
      title: 'Close the loop with one visible SEO improvement.',
      reason: 'No recent SEO improvement is logged in the operator.',
      action: 'Update one headline, FAQ answer, internal link, or CTA based on the strongest signal from today.',
    })
  }

  return recommendations.slice(0, 7)
}

function buildDataHealth({
  events,
  ctaClicks,
  lifecycle,
  recentActivity,
  growthSignals,
}: {
  events: MarketingEventRow[]
  ctaClicks: MarketingEventRow[]
  lifecycle: {
    signups: number
    freeTrialStarts: number
    paidConversions: number
    retentionEvents: number
  }
  recentActivity: MarketingActivityRow[]
  growthSignals: GrowthSignalRow[]
}): DataHealthItem[] {
  const hasCustomerSignals = recentActivity.some((entry) => isFilled(entry.customer_signal))
  const hasCompetitorSignals = recentActivity.some((entry) => isFilled(entry.competitor_signal))
  const hasSeoLogs = recentActivity.some((entry) => isFilled(entry.seo_improvement))
  const seoSignals = growthSignals.filter((signal) =>
    ['google_search_console', 'gsc', 'ahrefs'].includes(signal.source || '') ||
    signal.signal_type === 'seo_metric'
  )
  const attributedClicks = ctaClicks.filter((event) => isFilled(event.location) && isFilled(event.destination)).length

  return [
    {
      source: 'Website navigation',
      status: events.length ? 'connected' : 'missing',
      message: events.length ? `${events.length} BehaviorStudyTools.com events in the report window.` : 'No page or CTA events are visible yet.',
      nextStep: events.length ? 'Use page-level conversion to pick the next page edit.' : 'Confirm the public landing site is deployed and page_view events are reaching Supabase.',
    },
    {
      source: 'CTA attribution',
      status: attributedClicks ? 'connected' : ctaClicks.length ? 'partial' : 'missing',
      message: attributedClicks ? `${attributedClicks} CTA clicks include location and destination.` : ctaClicks.length ? 'CTA clicks exist, but attribution is incomplete.' : 'No CTA clicks are visible yet.',
      nextStep: attributedClicks ? 'Compare CTA locations weekly and keep the clearest winner.' : 'Route all app links through TrackedStartLink or tagged static URLs.',
    },
    {
      source: 'Trial and paid conversion',
      status: lifecycle.paidConversions ? 'connected' : lifecycle.freeTrialStarts || lifecycle.signups ? 'partial' : 'missing',
      message: lifecycle.paidConversions
        ? `${lifecycle.paidConversions} paid conversion events are visible.`
        : lifecycle.freeTrialStarts || lifecycle.signups
          ? 'Signup/trial events are visible, but paid conversion is not.'
          : 'No signup, free-trial, or paid conversion events are visible yet.',
      nextStep: 'Send account_created, free_trial_start, and subscription_started events from the app/payment system.',
    },
    {
      source: 'Retention after signup',
      status: lifecycle.retentionEvents ? 'connected' : lifecycle.signups ? 'partial' : 'missing',
      message: lifecycle.retentionEvents ? `${lifecycle.retentionEvents} retention events are visible.` : 'No practice-session, quiz-complete, or return-session events are visible yet.',
      nextStep: 'Track practice_session_started, quiz_completed, mock_completed, and returning_user_session.',
    },
    {
      source: 'Customer and competitor signals',
      status: hasCustomerSignals && hasCompetitorSignals ? 'connected' : hasCustomerSignals || hasCompetitorSignals ? 'partial' : 'missing',
      message: hasCustomerSignals && hasCompetitorSignals ? 'Recent customer and competitor signals are logged.' : 'The operator needs more qualitative feedback signals.',
      nextStep: 'Log one customer objection and one competitor/review trend each day.',
    },
    {
      source: 'SEO performance inputs',
      status: seoSignals.length ? 'connected' : hasSeoLogs ? 'partial' : 'missing',
      message: seoSignals.length
        ? `${seoSignals.length} Search Console/Ahrefs growth signals are available.`
        : hasSeoLogs
          ? 'SEO improvements are being logged manually.'
          : 'Search Console/Ahrefs metrics are not connected in this report yet.',
      nextStep: seoSignals.length
        ? 'Use the strongest SEO signal to update one page headline, FAQ, internal link, or CTA today.'
        : 'Connect daily GSC/Ahrefs collection or paste query/page exports for clicks, impressions, CTR, position, and keyword movement.',
    },
  ]
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

  const { data: activityData, error: activityError } = await supabaseAdmin
    .from('behavior_study_tools_marketing_activity')
    .select('activity_date,channel,primary_action,published_url,customer_signal,competitor_signal,seo_improvement,next_step,status,created_at')
    .gte('activity_date', since.slice(0, 10))
    .order('activity_date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(50)

  if (activityError) {
    console.warn('Behavior Study Tools activity report read failed:', activityError.message)
  }

  const { data: growthSignalData, error: growthSignalError } = await supabaseAdmin
    .from('behavior_study_tools_growth_signals')
    .select('source,signal_type,metric_name,metric_value,created_at')
    .gte('signal_date', since.slice(0, 10))
    .in('signal_type', ['seo_metric', 'daily_growth_report'])
    .order('created_at', { ascending: false })
    .limit(200)

  if (growthSignalError) {
    console.warn('Behavior Study Tools growth signal health read failed:', growthSignalError.message)
  }

  const events = (data || []) as MarketingEventRow[]
  const recentActivity = ((activityData || []) as MarketingActivityRow[])
  const growthSignals = ((growthSignalData || []) as GrowthSignalRow[])
  const pageViews = events.filter((event) => event.event_name === 'page_view')
  const ctaClicks = events.filter((event) => event.event_name === 'cta_click')
  const diagnosticSelections = events.filter((event) => event.event_name === 'diagnostic_option_select')
  const internalSeoClicks = events.filter((event) => event.event_name === 'internal_seo_link_click')
  const appStarts = ctaClicks.filter((event) => event.destination?.includes('study.behaviorschool.com'))
  const signupEvents = events.filter((event) => eventMatches(event, SIGNUP_EVENTS))
  const freeTrialEvents = events.filter((event) => event.event_name === 'free_trial_start' || event.event_name === 'trial_start')
  const paidConversionEvents = events.filter((event) => eventMatches(event, PAID_EVENTS))
  const retentionEvents = events.filter((event) => eventMatches(event, RETENTION_EVENTS))
  const visitors = new Set(events.map((event) => event.visitor_id).filter(Boolean))
  const sessions = new Set(events.map((event) => event.session_id).filter(Boolean))
  const signupVisitors = new Set(signupEvents.map((event) => event.visitor_id).filter(Boolean))
  const retainedVisitors = new Set(retentionEvents.map((event) => event.visitor_id).filter(Boolean))
  const pages = new Map<string, number>()
  const pageClicks = new Map<string, number>()
  const ctas = new Map<string, number>()
  const intents = new Map<string, number>()
  const sources = new Map<string, number>()
  const studyPaths = new Map<string, number>()
  const destinations = new Map<string, number>()

  pageViews.forEach((event) => addCount(pages, event.page_path))
  ctaClicks.forEach((event) => {
    addCount(pageClicks, event.page_path)
    addCount(ctas, event.location)
    addCount(intents, event.intent)
    addCount(studyPaths, getStudyPath(event))
    addCount(destinations, event.destination)
  })
  events.forEach((event) => addCount(sources, getAttributionSource(event)))

  const pagePerformance: PagePerformance[] = Array.from(
    new Set([...pages.keys(), ...pageClicks.keys()])
  )
    .map((path) => {
      const pageViewCount = pages.get(path) || 0
      const ctaClickCount = pageClicks.get(path) || 0
      return {
        path,
        pageViews: pageViewCount,
        ctaClicks: ctaClickCount,
        clickRate: rate(ctaClickCount, pageViewCount),
      }
    })
    .sort((a, b) => b.pageViews - a.pageViews || b.ctaClicks - a.ctaClicks)
    .slice(0, 12)

  const pagesNeedingCta = pagePerformance
    .filter((page) => page.pageViews >= 2 && page.ctaClicks === 0)
    .slice(0, 5)

  const bcbaStarts = ctaClicks.filter((event) => getStudyPath(event) === 'bcba').length
  const rbtStarts = ctaClicks.filter((event) => getStudyPath(event) === 'rbt').length
  const lifecycle = {
    signups: signupEvents.length,
    freeTrialStarts: freeTrialEvents.length,
    paidConversions: paidConversionEvents.length,
    retentionEvents: retentionEvents.length,
    retainedVisitors: retainedVisitors.size,
    signupVisitorCount: signupVisitors.size,
    appStartToSignupRate: rate(signupEvents.length, appStarts.length),
    trialToPaidRate: rate(paidConversionEvents.length, freeTrialEvents.length),
    signupRetentionRate: rate(retainedVisitors.size, signupVisitors.size),
  }
  const recommendationInputSummary = {
    pageViews: pageViews.length,
    ctaClicks: ctaClicks.length,
    appStarts: appStarts.length,
    appStartRate: rate(appStarts.length, pageViews.length),
    bcbaStarts,
    rbtStarts,
  }

  const summary = {
    totalEvents: events.length,
    pageViews: pageViews.length,
    ctaClicks: ctaClicks.length,
    appStarts: appStarts.length,
    diagnosticSelections: diagnosticSelections.length,
    internalSeoClicks: internalSeoClicks.length,
    bcbaStarts,
    rbtStarts,
    uniqueVisitors: visitors.size,
    sessions: sessions.size,
    clickRate: rate(ctaClicks.length, pageViews.length),
    appStartRate: rate(appStarts.length, pageViews.length),
    topPages: topItems(pages),
    topCtas: topItems(ctas),
    topIntents: topItems(intents),
    topSources: topItems(sources),
    topStudyPaths: topItems(studyPaths),
    topDestinations: topItems(destinations),
    pagePerformance,
    pagesNeedingCta,
    lifecycle,
    recommendations: buildGrowthRecommendations({
      summary: recommendationInputSummary,
      pagePerformance,
      pagesNeedingCta,
      lifecycle,
      recentActivity,
    }),
    dataHealth: buildDataHealth({
      events,
      ctaClicks,
      lifecycle,
      recentActivity,
      growthSignals,
    }),
    signalCounts: {
      activitiesLogged: recentActivity.length,
      publishedLinks: recentActivity.filter((entry) => isFilled(entry.published_url)).length,
      customerSignals: recentActivity.filter((entry) => isFilled(entry.customer_signal)).length,
      competitorSignals: recentActivity.filter((entry) => isFilled(entry.competitor_signal)).length,
      seoImprovements: recentActivity.filter((entry) => isFilled(entry.seo_improvement)).length,
      seoSignals: growthSignals.filter((signal) => ['google_search_console', 'gsc', 'ahrefs'].includes(signal.source || '') || signal.signal_type === 'seo_metric').length,
    },
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
