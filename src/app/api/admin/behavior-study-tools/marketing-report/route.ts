import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { isValidAdminSessionToken } from '@/lib/adminSession'
import { api, getConvexClient } from '@/lib/convex'

export const dynamic = 'force-dynamic'

const COOKIE_NAME = 'bs_admin_auth'
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

type JourneySummary = {
  sessions: number
  bouncedSessions: number
  ctaSessions: number
  appStartSessions: number
  signupSessions: number
  paidSessions: number
  bounceRate: number
  ctaSessionRate: number
  appStartSessionRate: number
  signupSessionRate: number
  paidSessionRate: number
  topLandingPages: Array<{ label: string; count: number }>
  dropOffs: Array<{
    page: string
    sessions: number
    reason: string
    nextStep: string
  }>
}

type CtaAuditSummary = {
  totalClicks: number
  attributedClicks: number
  attributionRate: number
  webAppClicks: number
  missingLocation: number
  missingDestination: number
  unknownStudyPath: number
  nonWebAppDestinations: number
  bcbaClicks: number
  rbtClicks: number
  topUnattributedPages: Array<{ label: string; count: number }>
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low'
    title: string
    detail: string
  }>
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


async function isAdminAuthenticated() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  return isValidAdminSessionToken(token)
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

function eventTime(event: MarketingEventRow) {
  const parsed = event.received_at ? new Date(event.received_at).getTime() : 0
  return Number.isFinite(parsed) ? parsed : 0
}

function isFilled(value: string | null | undefined) {
  return Boolean(value && value.trim())
}

function buildJourneySummary(events: MarketingEventRow[]): JourneySummary {
  const sessions = new Map<string, MarketingEventRow[]>()
  events.forEach((event) => {
    const key = event.session_id || event.visitor_id || `unknown:${event.received_at || Math.random()}`
    const rows = sessions.get(key) || []
    rows.push(event)
    sessions.set(key, rows)
  })

  const landingPages = new Map<string, number>()
  const dropOffPages = new Map<string, number>()
  let bouncedSessions = 0
  let ctaSessions = 0
  let appStartSessions = 0
  let signupSessions = 0
  let paidSessions = 0

  sessions.forEach((rows) => {
    const sorted = rows.sort((a, b) => eventTime(a) - eventTime(b))
    const pageViews = sorted.filter((event) => event.event_name === 'page_view')
    const ctaClicks = sorted.filter((event) => event.event_name === 'cta_click')
    const appStarts = ctaClicks.filter((event) => event.destination?.includes('study.behaviorschool.com'))
    const signups = sorted.filter((event) => eventMatches(event, SIGNUP_EVENTS))
    const paid = sorted.filter((event) => eventMatches(event, PAID_EVENTS))
    const landing = pageViews[0]?.page_path || sorted[0]?.page_path || 'Unknown'
    const lastPage = [...pageViews].pop()?.page_path || landing

    addCount(landingPages, landing)
    if (ctaClicks.length) ctaSessions += 1
    if (appStarts.length) appStartSessions += 1
    if (signups.length) signupSessions += 1
    if (paid.length) paidSessions += 1

    if (!ctaClicks.length) {
      bouncedSessions += 1
      addCount(dropOffPages, lastPage)
    }
  })

  const sessionCount = sessions.size
  return {
    sessions: sessionCount,
    bouncedSessions,
    ctaSessions,
    appStartSessions,
    signupSessions,
    paidSessions,
    bounceRate: rate(bouncedSessions, sessionCount),
    ctaSessionRate: rate(ctaSessions, sessionCount),
    appStartSessionRate: rate(appStartSessions, sessionCount),
    signupSessionRate: rate(signupSessions, appStartSessions),
    paidSessionRate: rate(paidSessions, signupSessions),
    topLandingPages: topItems(landingPages, 5),
    dropOffs: topItems(dropOffPages, 5).map((item) => ({
      page: item.label,
      sessions: item.count,
      reason: 'Session ended before a tracked CTA click.',
      nextStep: 'Make the first CTA visible, specific to BCBA/RBT intent, and repeated after the first proof section.',
    })),
  }
}

function buildCtaAudit(ctaClicks: MarketingEventRow[]): CtaAuditSummary {
  const topUnattributedPages = new Map<string, number>()
  let attributedClicks = 0
  let webAppClicks = 0
  let missingLocation = 0
  let missingDestination = 0
  let unknownStudyPath = 0
  let nonWebAppDestinations = 0
  let bcbaClicks = 0
  let rbtClicks = 0

  ctaClicks.forEach((event) => {
    const hasLocation = isFilled(event.location)
    const hasDestination = isFilled(event.destination)
    const destination = event.destination || ''
    const studyPath = getStudyPath(event)
    const isWebApp = destination.includes('study.behaviorschool.com')

    if (hasLocation && hasDestination) attributedClicks += 1
    if (isWebApp) webAppClicks += 1
    if (!hasLocation) missingLocation += 1
    if (!hasDestination) missingDestination += 1
    if (studyPath === 'unknown') unknownStudyPath += 1
    if (hasDestination && !isWebApp) nonWebAppDestinations += 1
    if (studyPath === 'bcba') bcbaClicks += 1
    if (studyPath === 'rbt') rbtClicks += 1

    if (!hasLocation || !hasDestination || studyPath === 'unknown') {
      addCount(topUnattributedPages, event.page_path)
    }
  })

  const recommendations: CtaAuditSummary['recommendations'] = []
  if (missingDestination || missingLocation) {
    recommendations.push({
      priority: 'high',
      title: 'Fix CTA attribution before judging page performance.',
      detail: `${missingLocation} clicks are missing location and ${missingDestination} clicks are missing destination.`,
    })
  }
  if (unknownStudyPath) {
    recommendations.push({
      priority: 'high',
      title: 'Add BCBA/RBT path labels to remaining app CTAs.',
      detail: `${unknownStudyPath} CTA clicks do not identify whether the candidate chose BCBA or RBT.`,
    })
  }
  if (ctaClicks.length && !rbtClicks) {
    recommendations.push({
      priority: 'medium',
      title: 'RBT path is still invisible in click behavior.',
      detail: 'Add one above-the-fold RBT path CTA or one RBT-specific proof card on the main landing page.',
    })
  }
  if (nonWebAppDestinations) {
    recommendations.push({
      priority: 'medium',
      title: 'Some tracked CTAs leave the web-app funnel.',
      detail: `${nonWebAppDestinations} CTA clicks went somewhere other than study.behaviorschool.com.`,
    })
  }
  if (!recommendations.length) {
    recommendations.push({
      priority: 'low',
      title: 'CTA tracking is decision-ready.',
      detail: 'Use the weakest page and lowest-converting CTA location to choose the next copy test.',
    })
  }

  return {
    totalClicks: ctaClicks.length,
    attributedClicks,
    attributionRate: rate(attributedClicks, ctaClicks.length),
    webAppClicks,
    missingLocation,
    missingDestination,
    unknownStudyPath,
    nonWebAppDestinations,
    bcbaClicks,
    rbtClicks,
    topUnattributedPages: topItems(topUnattributedPages, 5),
    recommendations,
  }
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

  const since = new Date(Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString()
  const eventData = await getConvexClient()
    .query(api.bstMarketing.listMarketingEvents, {
      sinceIso: since,
      limit: 5000,
    })
    .catch((error) => {
      console.warn('Behavior Study Tools marketing report read failed:', error instanceof Error ? error.message : error)
      return []
    })

  const activityData = await getConvexClient()
    .query(api.bstMarketing.listMarketingActivity, {
      sinceDate: since.slice(0, 10),
      limit: 50,
    })
    .catch((error) => {
      console.warn('Behavior Study Tools activity report read failed:', error instanceof Error ? error.message : error)
      return []
    })

  const growthSignalData = await getConvexClient()
    .query(api.bstMarketing.listGrowthSignals, {
      sinceDate: since.slice(0, 10),
      signalTypes: ['seo_metric', 'daily_growth_report'],
      limit: 200,
    })
    .catch((error) => {
      console.warn('Behavior Study Tools growth signal health read failed:', error instanceof Error ? error.message : error)
      return []
    })

  const events = (eventData || []) as MarketingEventRow[]
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
  const journey = buildJourneySummary(events)
  const ctaAudit = buildCtaAudit(ctaClicks)
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
    journey,
    ctaAudit,
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
