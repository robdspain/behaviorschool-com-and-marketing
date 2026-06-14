'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  Clipboard,
  ExternalLink,
  Eye,
  GraduationCap,
  Link2,
  ListChecks,
  Megaphone,
  MousePointerClick,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react'
import { behaviorStudyToolsMarketing } from '@/data/behaviorStudyToolsMarketing'

const dayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const activityStorageKey = 'bst_marketing_activity_log'

type MarketingActivityEntry = {
  id: string
  activityDate: string
  channel: string
  primaryAction: string
  publishedUrl: string
  customerSignal: string
  competitorSignal: string
  seoImprovement: string
  nextStep: string
  status: string
  stored?: boolean
  createdAt: string
}

type MarketingActivityForm = Omit<MarketingActivityEntry, 'id' | 'stored' | 'createdAt'>
type RemoteMarketingActivityEntry = {
  id?: string
  activity_date?: string
  channel?: string
  primary_action?: string
  published_url?: string
  customer_signal?: string
  competitor_signal?: string
  seo_improvement?: string
  next_step?: string
  status?: string
  created_at?: string
}

type MarketingReportItem = {
  label: string
  count: number
}

type MarketingReportSummary = {
  totalEvents: number
  pageViews: number
  ctaClicks: number
  appStarts: number
  diagnosticSelections: number
  internalSeoClicks: number
  bcbaStarts: number
  rbtStarts: number
  uniqueVisitors: number
  sessions: number
  clickRate: number
  appStartRate: number
  topPages: MarketingReportItem[]
  topCtas: MarketingReportItem[]
  topIntents: MarketingReportItem[]
  topSources: MarketingReportItem[]
  topStudyPaths: MarketingReportItem[]
  topDestinations: MarketingReportItem[]
  pagePerformance: PagePerformanceItem[]
  pagesNeedingCta: PagePerformanceItem[]
  lifecycle?: LifecycleSummary
  recommendations?: GrowthRecommendationItem[]
  dataHealth?: DataHealthItem[]
  signalCounts?: SignalCounts
}

type PagePerformanceItem = {
  path: string
  pageViews: number
  ctaClicks: number
  clickRate: number
}

type LifecycleSummary = {
  signups: number
  freeTrialStarts: number
  paidConversions: number
  retentionEvents: number
  retainedVisitors: number
  signupVisitorCount: number
  appStartToSignupRate: number
  trialToPaidRate: number
  signupRetentionRate: number
}

type GrowthRecommendationItem = {
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

type SignalCounts = {
  activitiesLogged: number
  publishedLinks: number
  customerSignals: number
  competitorSignals: number
  seoImprovements: number
}

type DailyGrowthAction = {
  priority: 'high' | 'medium' | 'low'
  lane: 'Conversion' | 'SEO' | 'Social' | 'Retention' | 'Research' | 'Data'
  title: string
  evidence: string
  action: string
  href?: string
}

type DailyGrowthSourceStatus = {
  source: string
  status: 'fresh' | 'stale' | 'missing'
  latest: string | null
  ageDays: number | null
}

type DailyGrowthReport = {
  windowDays: number
  generatedAt: string
  conversion: {
    pageViews: number
    ctaClicks: number
    appStarts: number
    signups: number
    freeTrialStarts: number
    paidConversions: number
    retentionEvents: number
    visitorToStartRate: number
    appStartToSignupRate: number
    trialToPaidRate: number
  }
  signalCoverage: {
    sourceStatus: DailyGrowthSourceStatus[]
    growthSignals: number
    activityLogs: number
    structuredSeoSignals: number
    structuredSocialSignals: number
  }
  topPages: MarketingReportItem[]
  topChannels: MarketingReportItem[]
  pathSplit: MarketingReportItem[]
  actions: DailyGrowthAction[]
}

type DailyGrowthReportResponse = {
  success?: boolean
  stored?: boolean
  warning?: string | null
  report?: DailyGrowthReport | null
}

type MarketingReportEvent = {
  event_name?: string | null
  page_path?: string | null
  location?: string | null
  intent?: string | null
  source?: string | null
  destination?: string | null
  received_at?: string | null
}

type MarketingReportResponse = {
  success?: boolean
  stored?: boolean
  windowDays?: number
  generatedAt?: string
  summary?: MarketingReportSummary | null
  events?: MarketingReportEvent[]
  warning?: string
}

function todayDate() {
  return new Date().toISOString().slice(0, 10)
}

export default function BehaviorStudyToolsMarketingPage() {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activityEntries, setActivityEntries] = useState<MarketingActivityEntry[]>([])
  const [activitySaved, setActivitySaved] = useState(false)
  const [activitySaving, setActivitySaving] = useState(false)
  const [marketingReport, setMarketingReport] = useState<MarketingReportResponse | null>(null)
  const [reportLoading, setReportLoading] = useState(false)
  const [dailyGrowthReport, setDailyGrowthReport] = useState<DailyGrowthReportResponse | null>(null)
  const [dailyGrowthLoading, setDailyGrowthLoading] = useState(false)
  const router = useRouter()
  const todayPlan = useMemo(() => {
    const today = dayOrder[new Date().getDay()]
    return (
      behaviorStudyToolsMarketing.postPlan.find((post) => post.day === today) ||
      behaviorStudyToolsMarketing.postPlan[0]
    )
  }, [])
  const [activityForm, setActivityForm] = useState<MarketingActivityForm>({
    activityDate: todayDate(),
    channel: '',
    primaryAction: '',
    publishedUrl: '',
    customerSignal: '',
    competitorSignal: '',
    seoImprovement: '',
    nextStep: '',
    status: 'logged',
  })

  useEffect(() => {
    document.title = 'Behavior Study Tools Marketing | Behavior School Admin'

    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/auth')
        const data = await res.json()
        if (!data.authenticated) {
          router.push('/admin/login')
          return
        }
        setIsAuthenticated(true)
      } catch {
        router.push('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  useEffect(() => {
    if (!todayPlan) return
    setActivityForm((current) => ({
      ...current,
      channel: current.channel || todayPlan.platform,
      primaryAction: current.primaryAction || todayPlan.hook,
      nextStep: current.nextStep || `Improve or share ${todayPlan.ctaLabel.toLowerCase()}.`,
    }))
  }, [todayPlan])

  useEffect(() => {
    if (!isAuthenticated) return

    const loadActivity = async () => {
      const localEntries = (() => {
        try {
          return JSON.parse(window.localStorage.getItem(activityStorageKey) || '[]') as MarketingActivityEntry[]
        } catch {
          return []
        }
      })()
      setActivityEntries(localEntries)

      try {
        const response = await fetch('/api/admin/behavior-study-tools/marketing-activity')
        const data = await response.json()
        if (data.success && Array.isArray(data.entries) && data.entries.length) {
          const remoteEntries = (data.entries as RemoteMarketingActivityEntry[]).map((entry) => ({
            id: String(entry.id || `${entry.activity_date}-${entry.created_at}`),
            activityDate: entry.activity_date || '',
            channel: entry.channel || '',
            primaryAction: entry.primary_action || '',
            publishedUrl: entry.published_url || '',
            customerSignal: entry.customer_signal || '',
            competitorSignal: entry.competitor_signal || '',
            seoImprovement: entry.seo_improvement || '',
            nextStep: entry.next_step || '',
            status: entry.status || 'logged',
            stored: true,
            createdAt: entry.created_at || '',
          }))
          setActivityEntries(remoteEntries)
        }
      } catch {
        // Local entries are enough for the operator when server persistence is unavailable.
      }
    }

    loadActivity()
  }, [isAuthenticated])

  const loadMarketingReport = useCallback(async () => {
    setReportLoading(true)
    try {
      const response = await fetch('/api/admin/behavior-study-tools/marketing-report')
      const data = await response.json()
      setMarketingReport(data)
    } catch {
      setMarketingReport({
        success: false,
        stored: false,
        summary: null,
        events: [],
        warning: 'Marketing report could not be loaded.',
      })
    } finally {
      setReportLoading(false)
    }
  }, [])

  const loadDailyGrowthReport = useCallback(async () => {
    setDailyGrowthLoading(true)
    try {
      const response = await fetch('/api/admin/behavior-study-tools/daily-growth-report')
      const data = await response.json()
      setDailyGrowthReport(data)
    } catch {
      setDailyGrowthReport({
        success: false,
        stored: false,
        report: null,
        warning: 'Daily growth report could not be loaded.',
      })
    } finally {
      setDailyGrowthLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return
    loadMarketingReport()
    loadDailyGrowthReport()
  }, [isAuthenticated, loadMarketingReport, loadDailyGrowthReport])

  const copyBlock = `${todayPlan.hook}

${todayPlan.post}

CTA: ${todayPlan.ctaLabel}
${todayPlan.ctaHref}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyBlock)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  const handleActivityChange = (field: keyof MarketingActivityForm, value: string) => {
    setActivitySaved(false)
    setActivityForm((current) => ({ ...current, [field]: value }))
  }

  const handleActivitySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!activityForm.channel.trim() || !activityForm.primaryAction.trim()) return

    setActivitySaving(true)
    const optimisticEntry: MarketingActivityEntry = {
      ...activityForm,
      id: `${Date.now()}`,
      createdAt: new Date().toISOString(),
      stored: false,
    }

    try {
      const response = await fetch('/api/admin/behavior-study-tools/marketing-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activityForm),
      })
      const data = await response.json().catch(() => ({}))
      optimisticEntry.stored = Boolean(data.stored)
    } catch {
      optimisticEntry.stored = false
    }

    const nextEntries = [optimisticEntry, ...activityEntries].slice(0, 20)
    setActivityEntries(nextEntries)
    window.localStorage.setItem(activityStorageKey, JSON.stringify(nextEntries))
    setActivitySaved(true)
    setActivitySaving(false)
    setActivityForm((current) => ({
      ...current,
      publishedUrl: '',
      customerSignal: '',
      competitorSignal: '',
      seoImprovement: '',
      nextStep: '',
      status: 'logged',
    }))
  }

  const reportSummary = marketingReport?.summary || null
  const recentEvents = marketingReport?.events || []

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-200">Loading marketing operator...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-[#f6f1e4]">
      <header className="border-b border-emerald-950/10 bg-[#123f31] text-white">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-white/10 px-3 py-1 text-sm font-semibold text-amber-100">
              <Megaphone className="w-4 h-4" />
              Daily marketing operator
            </div>
            <div className="mt-5 grid gap-6 xl:grid-cols-[1.35fr_0.65fr] xl:items-end">
              <div>
                <h1 className="text-4xl font-black tracking-tight">
                  Get more candidates into Behavior Study Tools.
                </h1>
                <p className="mt-4 max-w-3xl text-lg text-emerald-50">
                  {behaviorStudyToolsMarketing.audiencePain} {behaviorStudyToolsMarketing.solution}
                </p>
              </div>
              <div className="rounded-xl border border-white/15 bg-white/10 p-5">
                <p className="text-sm font-semibold uppercase tracking-wide text-amber-100">Operating rule</p>
                <p className="mt-2 text-base text-white">{behaviorStudyToolsMarketing.weeklyOperatingRule}</p>
                <a
                  href={behaviorStudyToolsMarketing.primaryCta.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-amber-300 px-4 py-3 font-bold text-emerald-950 hover:bg-amber-200"
                >
                  {behaviorStudyToolsMarketing.primaryCta.label}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl space-y-8">
          <section className="rounded-xl border-2 border-emerald-950/10 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">Conversion report</p>
                <h2 className="mt-2 text-3xl font-black text-slate-950">See what is getting candidates into the app.</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                  Last {marketingReport?.windowDays || 30} days from BehaviorStudyTools.com tracking. Use this before changing a headline, CTA, or campaign post.
                </p>
              </div>
              <button
                type="button"
                onClick={loadMarketingReport}
                disabled={reportLoading}
                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-emerald-900/20 bg-white px-4 py-3 font-bold text-emerald-950 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw className={`w-4 h-4 ${reportLoading ? 'animate-spin' : ''}`} />
                {reportLoading ? 'Refreshing' : 'Refresh report'}
              </button>
            </div>

            {reportSummary ? (
              <>
                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
                  <ReportMetric label="Page views" value={`${reportSummary.pageViews}`} icon={<Eye className="w-5 h-5" />} />
                  <ReportMetric label="CTA clicks" value={`${reportSummary.ctaClicks}`} icon={<MousePointerClick className="w-5 h-5" />} />
                  <ReportMetric label="Click rate" value={`${reportSummary.clickRate}%`} icon={<Activity className="w-5 h-5" />} />
                  <ReportMetric label="App starts" value={`${reportSummary.appStarts || 0}`} icon={<ArrowRight className="w-5 h-5" />} />
                  <ReportMetric label="BCBA starts" value={`${reportSummary.bcbaStarts || 0}`} icon={<GraduationCap className="w-5 h-5" />} />
                  <ReportMetric label="RBT starts" value={`${reportSummary.rbtStarts || 0}`} icon={<Users className="w-5 h-5" />} />
                </div>

                <ConversionSnapshotPanel summary={reportSummary} />

                <DailyGrowthBriefPanel
                  response={dailyGrowthReport}
                  loading={dailyGrowthLoading}
                  onRefresh={loadDailyGrowthReport}
                />

                <GrowthSignalImportPanel onImported={loadDailyGrowthReport} />

                <GrowthLoopPanel summary={reportSummary} />

                <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-lg border border-emerald-900/15 bg-emerald-50 p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <p className="text-sm font-black uppercase tracking-wide text-emerald-800">Conversion loop health</p>
                        <h3 className="mt-2 text-2xl font-black text-slate-950">
                          {reportSummary.appStarts
                            ? `${reportSummary.appStarts} app-start clicks from tracked pages.`
                            : 'No tracked app-start clicks yet.'}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          App-start rate is {reportSummary.appStartRate || 0}%. Diagnostic selections: {reportSummary.diagnosticSelections || 0}. Internal SEO clicks: {reportSummary.internalSeoClicks || 0}.
                        </p>
                      </div>
                      <a
                        href="https://behaviorstudytools.com"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#123f31] px-4 py-3 font-bold text-white hover:bg-[#0d3025]"
                      >
                        Test homepage CTA
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    {reportSummary.pagesNeedingCta?.length ? (
                      <div className="mt-5 rounded-lg border border-amber-300 bg-white p-4">
                        <p className="font-black text-slate-950">Fix these viewed pages first</p>
                        <div className="mt-3 space-y-2">
                          {reportSummary.pagesNeedingCta.map((page) => (
                            <div key={page.path} className="flex items-center justify-between gap-3 text-sm">
                              <span className="truncate font-bold text-slate-800">{page.path}</span>
                              <span className="shrink-0 rounded-full bg-amber-100 px-2 py-1 text-xs font-black text-amber-900">{page.pageViews} views, 0 starts</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="mt-5 rounded-lg border border-emerald-200 bg-white p-4 text-sm font-bold text-emerald-900">
                        No high-view pages without starts in this window.
                      </p>
                    )}
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                    <RankedList title="Study path split" items={reportSummary.topStudyPaths || []} emptyText="No BCBA/RBT path clicks yet." />
                    <RankedList title="Top sources" items={reportSummary.topSources} emptyText="No source data yet." />
                  </div>
                </div>

                <div className="mt-6 grid gap-5 lg:grid-cols-4">
                  <RankedList title="Top pages" items={reportSummary.topPages} emptyText="No page views yet." />
                  <RankedList title="Top CTAs" items={reportSummary.topCtas} emptyText="No CTA clicks yet." />
                  <RankedList title="Top intents" items={reportSummary.topIntents} emptyText="No onboarding intent yet." />
                  <RankedList title="Top destinations" items={reportSummary.topDestinations || []} emptyText="No destination data yet." />
                </div>

                <PagePerformanceTable items={reportSummary.pagePerformance || []} />

                <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-black text-slate-950">Recent tracking events</h3>
                    <span className={`rounded-full px-2 py-1 text-xs font-bold ${marketingReport?.stored ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}`}>
                      {marketingReport?.stored ? 'Server data' : 'Waiting for database'}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-2">
                    {recentEvents.length ? (
                      recentEvents.slice(0, 8).map((event, index) => (
                        <div key={`${event.received_at}-${index}`} className="flex flex-col gap-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm md:flex-row md:items-center md:justify-between">
                          <div className="font-bold text-slate-900">
                            {event.event_name || 'event'} <span className="font-medium text-slate-500">· {event.page_path || event.location || 'Unknown page'}</span>
                          </div>
                          <div className="text-xs font-semibold text-slate-500">
                            {event.intent || event.location || event.source || 'No intent'}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm font-semibold text-slate-600">No events recorded yet. Apply the migration, deploy both sites, then click through a live CTA to confirm tracking.</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="mt-6 rounded-lg border border-dashed border-amber-300 bg-amber-50 p-5">
                <p className="font-black text-slate-950">Tracking is wired. Database storage is the remaining production step.</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Apply the new Supabase migration, then this report will show page views, CTA clicks, top SEO pages, source data, and recent events.
                  {marketingReport?.warning ? ` Current status: ${marketingReport.warning}` : ''}
                </p>
              </div>
            )}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
            <div className="rounded-xl border-2 border-emerald-950/10 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">Today&apos;s primary post</p>
                  <h2 className="mt-2 text-3xl font-black text-slate-950">{todayPlan.hook}</h2>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-800">
                  <Target className="w-4 h-4" />
                  {todayPlan.platform}
                </span>
              </div>

              <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-5">
                <p className="text-base leading-7 text-slate-800">{todayPlan.post}</p>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <Metric label="CTA" value={todayPlan.ctaLabel} icon={<MousePointerClick className="w-5 h-5" />} />
                <Metric label="Asset" value={todayPlan.asset} icon={<Eye className="w-5 h-5" />} />
                <Metric label="Signal to log" value="One search or customer comment" icon={<BarChart3 className="w-5 h-5" />} />
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#123f31] px-4 py-3 font-bold text-white hover:bg-[#0d3025]"
                >
                  {copied ? <CheckCircle2 className="w-5 h-5" /> : <Clipboard className="w-5 h-5" />}
                  {copied ? 'Copied' : 'Copy post block'}
                </button>
                <a
                  href={todayPlan.ctaHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-emerald-900/20 bg-white px-4 py-3 font-bold text-emerald-950 hover:bg-emerald-50"
                >
                  Open CTA
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="rounded-xl border-2 border-amber-300/70 bg-[#fff8df] p-6 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-wide text-amber-800">Message guardrail</p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">Every post should promise a clearer next study step.</h2>
              <div className="mt-5 space-y-4">
                <Guideline icon={<ShieldCheck className="w-5 h-5" />} title="Pain point" text={behaviorStudyToolsMarketing.audiencePain} />
                <Guideline icon={<Sparkles className="w-5 h-5" />} title="Solution" text={behaviorStudyToolsMarketing.solution} />
                <Guideline icon={<ArrowRight className="w-5 h-5" />} title="Primary CTA" text="Until the iOS app is approved, send candidates to the web app." />
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <a
                  href={behaviorStudyToolsMarketing.primaryCta.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#123f31] px-4 py-3 font-bold text-white hover:bg-[#0d3025]"
                >
                  BCBA web app
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href={behaviorStudyToolsMarketing.rbtCta.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-emerald-900/20 bg-white px-4 py-3 font-bold text-emerald-950 hover:bg-emerald-50"
                >
                  RBT path
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <form onSubmit={handleActivitySubmit} className="rounded-xl border-2 border-emerald-950/10 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <ListChecks className="w-6 h-6 text-emerald-700" />
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">Today&apos;s growth log</p>
                  <h2 className="text-2xl font-black text-slate-950">Record what moved the campaign forward.</h2>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold text-slate-700">
                  Date
                  <input
                    type="date"
                    value={activityForm.activityDate}
                    onChange={(event) => handleActivityChange('activityDate', event.target.value)}
                    className="rounded-lg border border-slate-300 px-3 py-2 font-medium text-slate-950 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                  />
                </label>
                <label className="grid gap-2 text-sm font-bold text-slate-700">
                  Channel
                  <input
                    type="text"
                    value={activityForm.channel}
                    onChange={(event) => handleActivityChange('channel', event.target.value)}
                    placeholder="LinkedIn, Instagram, Email..."
                    className="rounded-lg border border-slate-300 px-3 py-2 font-medium text-slate-950 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                  />
                </label>
              </div>

              <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">
                Primary action
                <input
                  type="text"
                  value={activityForm.primaryAction}
                  onChange={(event) => handleActivityChange('primaryAction', event.target.value)}
                  placeholder="Published weak-domain post"
                  className="rounded-lg border border-slate-300 px-3 py-2 font-medium text-slate-950 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">
                Published link
                <input
                  type="url"
                  value={activityForm.publishedUrl}
                  onChange={(event) => handleActivityChange('publishedUrl', event.target.value)}
                  placeholder="https://..."
                  className="rounded-lg border border-slate-300 px-3 py-2 font-medium text-slate-950 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <TextAreaField
                  label="Customer signal"
                  value={activityForm.customerSignal}
                  placeholder="Question, objection, comment, signup feedback..."
                  onChange={(value) => handleActivityChange('customerSignal', value)}
                />
                <TextAreaField
                  label="Competitor signal"
                  value={activityForm.competitorSignal}
                  placeholder="Review theme, competitor page change, ad angle..."
                  onChange={(value) => handleActivityChange('competitorSignal', value)}
                />
              </div>

              <TextAreaField
                label="SEO improvement made"
                value={activityForm.seoImprovement}
                placeholder="Headline changed, CTA clarified, FAQ added, internal link fixed..."
                onChange={(value) => handleActivityChange('seoImprovement', value)}
              />

              <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">
                Next step
                <input
                  type="text"
                  value={activityForm.nextStep}
                  onChange={(event) => handleActivityChange('nextStep', event.target.value)}
                  placeholder="Tomorrow, improve the mock exam page CTA"
                  className="rounded-lg border border-slate-300 px-3 py-2 font-medium text-slate-950 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              <button
                type="submit"
                disabled={activitySaving || !activityForm.channel.trim() || !activityForm.primaryAction.trim()}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#123f31] px-4 py-3 font-bold text-white hover:bg-[#0d3025] disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {activitySaved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                {activitySaving ? 'Saving...' : activitySaved ? 'Logged' : "Log today's action"}
              </button>
              <p className="mt-3 text-xs font-semibold text-slate-500">
                Saved locally now. If the Supabase activity table exists, it also stores server-side.
              </p>
            </form>

            <div className="rounded-xl border-2 border-emerald-950/10 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <CalendarCheck className="w-6 h-6 text-emerald-700" />
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">Recent campaign actions</p>
                  <h2 className="text-2xl font-black text-slate-950">Use yesterday&apos;s signals to improve today&apos;s page.</h2>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {activityEntries.length ? (
                  activityEntries.slice(0, 6).map((entry) => (
                    <article key={entry.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-xs font-black uppercase tracking-wide text-slate-500">{entry.activityDate} · {entry.channel}</p>
                          <h3 className="mt-1 font-black text-slate-950">{entry.primaryAction}</h3>
                        </div>
                        <span className={`inline-flex w-fit items-center rounded-full px-2 py-1 text-xs font-bold ${entry.stored ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}`}>
                          {entry.stored ? 'Server saved' : 'Local saved'}
                        </span>
                      </div>
                      {entry.publishedUrl && (
                        <a href={entry.publishedUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:text-emerald-950">
                          <Link2 className="w-4 h-4" />
                          Open published link
                        </a>
                      )}
                      <div className="mt-3 grid gap-3 text-sm text-slate-700 md:grid-cols-2">
                        {entry.customerSignal && <p><strong>Customer:</strong> {entry.customerSignal}</p>}
                        {entry.competitorSignal && <p><strong>Competitor:</strong> {entry.competitorSignal}</p>}
                        {entry.seoImprovement && <p><strong>SEO:</strong> {entry.seoImprovement}</p>}
                        {entry.nextStep && <p><strong>Next:</strong> {entry.nextStep}</p>}
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                    <p className="font-bold text-slate-900">No campaign actions logged yet.</p>
                    <p className="mt-2 text-sm text-slate-600">Post once, record the signal, and make tomorrow&apos;s page improvement obvious.</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-xl border-2 border-emerald-950/10 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">Seven-day publishing loop</p>
                <h2 className="text-2xl font-black text-slate-950">One clear post per day</h2>
              </div>
              <a href="/admin/content-calendar" className="inline-flex items-center gap-2 font-bold text-emerald-800 hover:text-emerald-950">
                Open content calendar
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-7">
              {behaviorStudyToolsMarketing.postPlan.map((post) => (
                <div
                  key={`${post.day}-${post.platform}`}
                  className={`rounded-lg border p-4 ${
                    post.day === todayPlan.day
                      ? 'border-amber-300 bg-amber-50'
                      : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <p className="text-xs font-black uppercase tracking-wide text-slate-500">{post.day}</p>
                  <p className="mt-2 text-sm font-bold text-emerald-800">{post.platform}</p>
                  <p className="mt-3 text-sm font-semibold leading-5 text-slate-900">{post.hook}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-xl border-2 border-emerald-950/10 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Search className="w-6 h-6 text-emerald-700" />
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">SEO pages to push</p>
                  <h2 className="text-2xl font-black text-slate-950">Route each post to the page that matches intent.</h2>
                </div>
              </div>
              <div className="mt-6 divide-y divide-slate-200 rounded-lg border border-slate-200">
                {behaviorStudyToolsMarketing.seoPages.map((page) => (
                  <div key={page.href} className="p-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <h3 className="font-black text-slate-950">{page.title}</h3>
                        <p className="mt-1 text-sm text-slate-600">{page.intent}</p>
                        <p className="mt-2 text-sm font-semibold text-emerald-800">{page.message}</p>
                      </div>
                      <a
                        href={page.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-800 hover:bg-slate-50"
                      >
                        Open
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    <p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-500">Keyword: {page.keyword}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border-2 border-emerald-950/10 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-emerald-700" />
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">Competitor watchlist</p>
                  <h2 className="text-2xl font-black text-slate-950">Turn competitor gaps into stronger copy.</h2>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {behaviorStudyToolsMarketing.competitorSignals.map((signal) => (
                  <div key={signal.competitor} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <h3 className="font-black text-slate-950">{signal.competitor}</h3>
                    <p className="mt-2 text-sm text-slate-600">{signal.watchFor}</p>
                    <p className="mt-2 text-sm font-semibold text-emerald-800">{signal.opportunity}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-xl border-2 border-emerald-950/10 bg-[#123f31] p-6 text-white shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wide text-amber-100">Daily closeout</p>
            <h2 className="mt-2 text-2xl font-black">Before the day ends, make one improvement.</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-4">
              {[
                'Log Search Console query movement.',
                'Save one customer pain point or objection.',
                'Check one competitor page or review theme.',
                'Improve one headline, CTA, FAQ, or internal link.',
              ].map((item) => (
                <div key={item} className="rounded-lg border border-white/15 bg-white/10 p-4">
                  <CheckCircle2 className="w-5 h-5 text-amber-200" />
                  <p className="mt-3 text-sm font-semibold text-emerald-50">{item}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

function Metric({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 text-emerald-700">{icon}<span className="text-xs font-black uppercase tracking-wide">{label}</span></div>
      <p className="mt-2 text-sm font-bold leading-5 text-slate-900">{value}</p>
    </div>
  )
}

function ConversionSnapshotPanel({ summary }: { summary: MarketingReportSummary }) {
  const lifecycle = summary.lifecycle
  const recommendations = summary.recommendations || []
  const primaryRecommendation = recommendations[0]
  const dataHealth = summary.dataHealth || []
  const healthySources = dataHealth.filter((item) => item.status === 'connected').length
  const coverageLabel = dataHealth.length ? `${healthySources}/${dataHealth.length} sources connected` : 'No health checks yet'
  const stages = [
    {
      label: 'Visits',
      value: summary.pageViews,
      detail: `${summary.uniqueVisitors} visitors`,
    },
    {
      label: 'App starts',
      value: summary.appStarts,
      detail: `${summary.appStartRate}% of visits`,
    },
    {
      label: 'Signups',
      value: lifecycle?.signups ?? 0,
      detail: `${lifecycle?.appStartToSignupRate ?? 0}% of starts`,
    },
    {
      label: 'Paid',
      value: lifecycle?.paidConversions ?? 0,
      detail: `${lifecycle?.trialToPaidRate ?? 0}% of trials`,
    },
  ]
  const bottleneck = (() => {
    if (summary.pageViews > 0 && !summary.appStarts) {
      return {
        label: 'Marketing CTA',
        detail: 'People are landing on pages, but not starting the app.',
      }
    }
    if (summary.appStarts > 0 && !(lifecycle?.signups ?? 0)) {
      return {
        label: 'Onboarding',
        detail: 'App starts are visible, but signup events are not converting or not tracked yet.',
      }
    }
    if ((lifecycle?.freeTrialStarts ?? 0) > 0 && !(lifecycle?.paidConversions ?? 0)) {
      return {
        label: 'Trial to paid',
        detail: 'Trials are visible, but paid conversion is not proven yet.',
      }
    }
    if ((lifecycle?.signups ?? 0) > 0 && !(lifecycle?.retentionEvents ?? 0)) {
      return {
        label: 'Retention',
        detail: 'Signup is visible, but practice or return events are not yet visible.',
      }
    }
    return {
      label: 'Traffic quality',
      detail: 'The loop is connected enough to focus on stronger traffic and clearer page intent.',
    }
  })()
  const pathBalance = summary.rbtStarts
    ? `${summary.bcbaStarts} BCBA / ${summary.rbtStarts} RBT starts`
    : summary.bcbaStarts
      ? `${summary.bcbaStarts} BCBA starts, no RBT starts yet`
      : 'No BCBA/RBT split yet'

  return (
    <section className="mt-6 rounded-xl border border-emerald-950/10 bg-[#fbfaf5] p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-emerald-700">Conversation loop audit</p>
          <h3 className="mt-2 text-2xl font-black text-slate-950">Make the next action obvious.</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Follow the candidate from page visit to app start, signup, paid conversion, and return practice. The weakest step gets the next edit.
          </p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-xs font-black uppercase tracking-wide text-amber-900">Current bottleneck</p>
          <p className="mt-1 text-lg font-black text-slate-950">{bottleneck.label}</p>
          <p className="mt-1 max-w-md text-sm font-semibold leading-5 text-slate-700">{bottleneck.detail}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        {stages.map((stage, index) => (
          <div key={stage.label} className="relative rounded-lg border border-slate-200 bg-white p-4">
            {index < stages.length - 1 && (
              <div className="absolute right-[-18px] top-1/2 hidden h-px w-8 bg-slate-300 md:block" />
            )}
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">{stage.label}</p>
            <p className="mt-2 text-3xl font-black text-slate-950">{stage.value}</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">{stage.detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr_1.15fr]">
        <AuditCard
          icon={<Target className="h-5 w-5" />}
          label="CTA clarity"
          title={summary.appStarts ? 'Web app starts are tracked.' : 'No app starts yet.'}
          detail={summary.appStarts ? `${summary.appStarts} tracked app starts. Keep CTAs direct and web-first until iOS approval.` : 'Use one primary CTA per page: start free BCBA practice or start RBT practice.'}
          status={summary.appStarts ? 'connected' : 'missing'}
        />
        <AuditCard
          icon={<Users className="h-5 w-5" />}
          label="Path clarity"
          title={pathBalance}
          detail="BCBA and RBT paths should both be visible in marketing copy, with CTAs that send candidates to the matching app flow."
          status={summary.rbtStarts ? 'connected' : summary.ctaClicks ? 'partial' : 'missing'}
        />
        <div className="rounded-lg border border-emerald-900/15 bg-[#123f31] p-4 text-white">
          <div className="flex items-center gap-2 text-amber-100">
            <ListChecks className="h-5 w-5" />
            <p className="text-xs font-black uppercase tracking-wide">Do next</p>
          </div>
          <h4 className="mt-3 text-lg font-black">
            {primaryRecommendation?.title || 'Publish, click through, and log one signal.'}
          </h4>
          <p className="mt-2 text-sm font-semibold leading-6 text-emerald-50">
            {primaryRecommendation?.action || "Use the daily post, test the CTA, then record the customer or competitor signal that should drive tomorrow's page edit."}
          </p>
          <p className="mt-3 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs font-black uppercase tracking-wide text-amber-100">
            {coverageLabel}
          </p>
        </div>
      </div>
    </section>
  )
}

function DailyGrowthBriefPanel({
  response,
  loading,
  onRefresh,
}: {
  response: DailyGrowthReportResponse | null
  loading: boolean
  onRefresh: () => void
}) {
  const report = response?.report || null
  const primaryAction = report?.actions?.[0]
  const sourceStatus = report?.signalCoverage.sourceStatus || []

  return (
    <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-emerald-700">Daily self-improvement brief</p>
          <h3 className="mt-2 text-2xl font-black text-slate-950">
            {primaryAction?.title || "Collect today's signals, then improve one page."}
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            This combines conversion behavior, retention events, Search Console/Ahrefs imports, social feedback, customer notes, and competitor signals into one daily action list.
          </p>
          {response?.warning && (
            <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-bold text-amber-950">
              {response.warning}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border-2 border-emerald-900/20 bg-white px-4 py-3 font-bold text-emerald-950 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Refreshing' : 'Refresh brief'}
        </button>
      </div>

      {report ? (
        <>
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            <MiniMetric label="Start rate" value={`${report.conversion.visitorToStartRate}%`} detail={`${report.conversion.appStarts} starts from ${report.conversion.pageViews} visits`} />
            <MiniMetric label="Signup rate" value={`${report.conversion.appStartToSignupRate}%`} detail={`${report.conversion.signups} signups from app starts`} />
            <MiniMetric label="Paid rate" value={`${report.conversion.trialToPaidRate}%`} detail={`${report.conversion.paidConversions} paid from ${report.conversion.freeTrialStarts} trials`} />
            <MiniMetric label="Retention" value={`${report.conversion.retentionEvents}`} detail="practice, quiz, mock, or return events" />
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_0.8fr]">
            <div className="space-y-3">
              {report.actions.length ? (
                report.actions.slice(0, 4).map((action) => (
                  <article key={`${action.lane}-${action.title}`} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <PriorityBadge priority={action.priority} />
                          <span className="rounded-full bg-white px-2 py-1 text-xs font-black uppercase tracking-wide text-emerald-800">{action.lane}</span>
                        </div>
                        <h4 className="mt-3 font-black text-slate-950">{action.title}</h4>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{action.evidence}</p>
                        <p className="mt-2 text-sm font-bold leading-6 text-emerald-900">{action.action}</p>
                      </div>
                      {action.href && (
                        <a
                          href={action.href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-800 hover:bg-slate-50"
                        >
                          Open
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5">
                  <p className="font-bold text-slate-900">No action list yet.</p>
                  <p className="mt-2 text-sm text-slate-600">Import SEO/social signals or wait for traffic events to build a stronger daily recommendation.</p>
                </div>
              )}
            </div>

            <div className="rounded-lg border border-slate-200 bg-[#fbfaf5] p-4">
              <p className="text-sm font-black uppercase tracking-wide text-slate-500">Signal freshness</p>
              <div className="mt-4 space-y-3">
                {sourceStatus.length ? (
                  sourceStatus.map((source) => <SourceFreshnessRow key={source.source} source={source} />)
                ) : (
                  <p className="text-sm font-semibold text-slate-600">No source freshness checks yet.</p>
                )}
              </div>
              <div className="mt-4 rounded-lg border border-white bg-white p-3">
                <p className="text-xs font-black uppercase tracking-wide text-slate-500">Structured inputs</p>
                <p className="mt-2 text-sm font-semibold text-slate-700">
                  {report.signalCoverage.structuredSeoSignals} SEO signals, {report.signalCoverage.structuredSocialSignals} social signals, {report.signalCoverage.activityLogs} activity logs.
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed border-amber-300 bg-amber-50 p-5">
          <p className="font-black text-slate-950">Daily report is waiting for backend data.</p>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Apply the growth-signal migration, deploy the API, and configure the daily monitor secret to generate daily snapshots.
          </p>
        </div>
      )}
    </section>
  )
}

function SourceFreshnessRow({ source }: { source: DailyGrowthSourceStatus }) {
  const styles = {
    fresh: 'bg-emerald-100 text-emerald-800',
    stale: 'bg-amber-100 text-amber-900',
    missing: 'bg-red-100 text-red-800',
  }
  const label = source.source
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2">
      <div>
        <p className="text-sm font-black text-slate-950">{label}</p>
        <p className="text-xs font-semibold text-slate-500">
          {source.latest ? `Latest ${source.latest}${source.ageDays !== null ? ` (${source.ageDays}d)` : ''}` : 'No signal imported'}
        </p>
      </div>
      <span className={`rounded-full px-2 py-1 text-xs font-black uppercase tracking-wide ${styles[source.status]}`}>
        {source.status}
      </span>
    </div>
  )
}

function GrowthSignalImportPanel({ onImported }: { onImported: () => void }) {
  const [provider, setProvider] = useState('gsc')
  const [signalDate, setSignalDate] = useState(todayDate())
  const [csv, setCsv] = useState('')
  const [status, setStatus] = useState<{ type: 'idle' | 'saving' | 'saved' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  })
  const templates: Record<string, string> = {
    gsc: 'query,page,clicks,impressions,ctr,position\nbcba practice exam,https://behaviorstudytools.com/free-bcba-practice-exam,12,740,1.6%,9.4',
    ahrefs: 'keyword,url,position,previous position,volume,traffic\nbcba mock exam 6th edition,https://behaviorstudytools.com/bcba-mock-exam-6th-edition,11,14,350,18',
    social: 'channel,post url,topic,clicks,comments,saves,replies\nLinkedIn,https://linkedin.com/posts/example,BCBA exam anxiety,24,6,8,3',
    competitor: 'competitor,url,topic,metric value,recommendation\nABA Wizard,https://example.com,Mobile practice flow,1,Clarify that Behavior Study Tools supports BCBA and RBT web practice.',
    trend: 'topic,url,metric value,recommendation\nRBT exam prep school setting,https://news.example.com,1,Create a short post connecting school-based scenarios to RBT practice.',
  }
  const providerLabels: Record<string, string> = {
    gsc: 'Google Search Console',
    ahrefs: 'Ahrefs',
    social: 'Social feedback',
    competitor: 'Competitor signal',
    trend: 'Trend research',
  }

  const handleTemplate = () => {
    setCsv(templates[provider])
    setStatus({ type: 'idle', message: '' })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!csv.trim()) {
      setStatus({ type: 'error', message: 'Paste CSV rows before importing.' })
      return
    }

    setStatus({ type: 'saving', message: 'Importing signals...' })
    try {
      const response = await fetch('/api/admin/behavior-study-tools/growth-signals/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, signalDate, csv }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(data.error || 'Import failed')
      }
      setStatus({
        type: 'saved',
        message: `Imported ${data.imported || 0} ${providerLabels[provider].toLowerCase()} signals.`,
      })
      setCsv('')
      onImported()
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Import failed',
      })
    }
  }

  return (
    <section className="mt-6 rounded-xl border border-slate-200 bg-[#fbfaf5] p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-emerald-700">Signal importer</p>
          <h3 className="mt-2 text-2xl font-black text-slate-950">Paste the numbers that should drive tomorrow&apos;s changes.</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Import GSC query/page movement, Ahrefs keyword movement, social feedback, competitor signals, or trend research. The daily brief will convert these rows into page edits and post ideas.
          </p>
        </div>
        <button
          type="button"
          onClick={handleTemplate}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border-2 border-emerald-900/20 bg-white px-4 py-3 font-bold text-emerald-950 hover:bg-emerald-50"
        >
          <Clipboard className="h-4 w-4" />
          Use sample CSV
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
        <div className="grid gap-4 md:grid-cols-[1fr_220px]">
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Source
            <select
              value={provider}
              onChange={(event) => {
                setProvider(event.target.value)
                setStatus({ type: 'idle', message: '' })
              }}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-medium text-slate-950 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
            >
              {Object.entries(providerLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Signal date
            <input
              type="date"
              value={signalDate}
              onChange={(event) => setSignalDate(event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 font-medium text-slate-950 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
            />
          </label>
        </div>

        <label className="grid gap-2 text-sm font-bold text-slate-700">
          CSV export
          <textarea
            value={csv}
            onChange={(event) => {
              setCsv(event.target.value)
              setStatus({ type: 'idle', message: '' })
            }}
            placeholder={templates[provider]}
            rows={6}
            className="resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-950 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
          />
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-semibold leading-5 text-slate-500">
            Common columns are mapped automatically: query, page, clicks, impressions, CTR, position, keyword, URL, platform, comments, saves, replies, topic, and recommendation.
          </p>
          <button
            type="submit"
            disabled={status.type === 'saving'}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#123f31] px-4 py-3 font-bold text-white hover:bg-[#0d3025] disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {status.type === 'saving' ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {status.type === 'saving' ? 'Importing' : 'Import signals'}
          </button>
        </div>

        {status.message && (
          <p className={`rounded-lg px-3 py-2 text-sm font-bold ${
            status.type === 'error'
              ? 'bg-red-50 text-red-800'
              : status.type === 'saved'
                ? 'bg-emerald-50 text-emerald-800'
                : 'bg-slate-100 text-slate-700'
          }`}>
            {status.message}
          </p>
        )}
      </form>
    </section>
  )
}

function AuditCard({
  icon,
  label,
  title,
  detail,
  status,
}: {
  icon: ReactNode
  label: string
  title: string
  detail: string
  status: DataHealthItem['status']
}) {
  const styles = {
    connected: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    partial: 'border-amber-200 bg-amber-50 text-amber-900',
    missing: 'border-red-200 bg-red-50 text-red-800',
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-emerald-700">
          {icon}
          <p className="text-xs font-black uppercase tracking-wide">{label}</p>
        </div>
        <span className={`rounded-full border px-2 py-1 text-xs font-black uppercase tracking-wide ${styles[status]}`}>
          {status}
        </span>
      </div>
      <h4 className="mt-3 font-black text-slate-950">{title}</h4>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{detail}</p>
    </div>
  )
}

function GrowthLoopPanel({ summary }: { summary: MarketingReportSummary }) {
  const lifecycle = summary.lifecycle
  const recommendations = summary.recommendations || []
  const dataHealth = summary.dataHealth || []
  const signalCounts = summary.signalCounts

  return (
    <div className="mt-6 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="rounded-xl border border-emerald-900/15 bg-[#102f27] p-5 text-white">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-amber-200">Daily improvement queue</p>
            <h3 className="mt-2 text-2xl font-black">Fix the clearest conversion leak first.</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-50">
              This queue combines page navigation, CTA starts, lifecycle events, and the signals logged by the marketing operator.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-amber-100">
            <TrendingUp className="h-4 w-4" />
            Self-improvement loop
          </span>
        </div>

        <div className="mt-5 space-y-3">
          {recommendations.length ? (
            recommendations.map((item) => (
              <article key={`${item.area}-${item.title}`} className="rounded-lg border border-white/15 bg-white p-4 text-slate-950">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <PriorityBadge priority={item.priority} />
                      <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-black uppercase tracking-wide text-emerald-800">{item.area}</span>
                    </div>
                    <h4 className="mt-3 font-black text-slate-950">{item.title}</h4>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{item.reason}</p>
                    <p className="mt-2 text-sm font-bold leading-6 text-emerald-900">{item.action}</p>
                  </div>
                  {item.href && (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-800 hover:bg-slate-50"
                    >
                      Open
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-lg border border-white/15 bg-white/10 p-5">
              <p className="font-bold text-white">No obvious leak yet. Keep publishing and logging signals.</p>
              <p className="mt-2 text-sm leading-6 text-emerald-50">The queue becomes more useful as traffic, app starts, and lifecycle events accumulate.</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-5">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-black uppercase tracking-wide text-emerald-700">Lifecycle funnel</p>
          <h3 className="mt-2 text-xl font-black text-slate-950">Track after the app start.</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <MiniMetric label="Signups" value={`${lifecycle?.signups ?? 0}`} detail={`${lifecycle?.appStartToSignupRate ?? 0}% of app starts`} />
            <MiniMetric label="Free trials" value={`${lifecycle?.freeTrialStarts ?? 0}`} detail="Needs app/payment events" />
            <MiniMetric label="Paid" value={`${lifecycle?.paidConversions ?? 0}`} detail={`${lifecycle?.trialToPaidRate ?? 0}% trial to paid`} />
            <MiniMetric label="Retention" value={`${lifecycle?.retainedVisitors ?? 0}`} detail={`${lifecycle?.signupRetentionRate ?? 0}% signup retention`} />
          </div>
          <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-semibold leading-6 text-amber-950">
            After the app deploy finishes, verify these events are flowing: <span className="font-black">account_created</span>, <span className="font-black">free_trial_start</span>, <span className="font-black">subscription_started</span>, <span className="font-black">practice_session_started</span>.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-black uppercase tracking-wide text-emerald-700">Data health</p>
          <h3 className="mt-2 text-xl font-black text-slate-950">Know what is proved and what is missing.</h3>
          <div className="mt-4 space-y-3">
            {dataHealth.length ? (
              dataHealth.map((item) => <DataHealthRow key={item.source} item={item} />)
            ) : (
              <p className="text-sm font-semibold text-slate-600">No data health checks yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-black uppercase tracking-wide text-slate-500">Signal loop</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <MiniMetric label="Actions" value={`${signalCounts?.activitiesLogged ?? 0}`} detail="logged in window" />
            <MiniMetric label="Published" value={`${signalCounts?.publishedLinks ?? 0}`} detail="links saved" />
            <MiniMetric label="Customer" value={`${signalCounts?.customerSignals ?? 0}`} detail="pain points" />
            <MiniMetric label="Competitor" value={`${signalCounts?.competitorSignals ?? 0}`} detail="signals found" />
          </div>
        </div>
      </div>
    </div>
  )
}

function PriorityBadge({ priority }: { priority: GrowthRecommendationItem['priority'] }) {
  const styles = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-amber-100 text-amber-900',
    low: 'bg-slate-100 text-slate-700',
  }

  return (
    <span className={`rounded-full px-2 py-1 text-xs font-black uppercase tracking-wide ${styles[priority]}`}>
      {priority}
    </span>
  )
}

function DataHealthRow({ item }: { item: DataHealthItem }) {
  const statusStyles = {
    connected: 'bg-emerald-100 text-emerald-800',
    partial: 'bg-amber-100 text-amber-900',
    missing: 'bg-red-100 text-red-800',
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-black text-slate-950">{item.source}</p>
        <span className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-1 text-xs font-black uppercase tracking-wide ${statusStyles[item.status]}`}>
          {item.status === 'connected' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
          {item.status}
        </span>
      </div>
      <p className="mt-2 text-sm leading-5 text-slate-600">{item.message}</p>
      <p className="mt-1 text-sm font-bold leading-5 text-emerald-800">{item.nextStep}</p>
    </div>
  )
}

function MiniMetric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-black text-slate-950">{value}</p>
      <p className="mt-1 text-xs font-semibold text-slate-500">{detail}</p>
    </div>
  )
}

function ReportMetric({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</span>
        <span className="text-emerald-700">{icon}</span>
      </div>
      <p className="mt-3 text-3xl font-black text-slate-950">{value}</p>
    </div>
  )
}

function RankedList({ title, items, emptyText }: { title: string; items: MarketingReportItem[]; emptyText: string }) {
  const maxCount = Math.max(...items.map((item) => item.count), 1)

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <h3 className="font-black text-slate-950">{title}</h3>
      <div className="mt-4 space-y-3">
        {items.length ? (
          items.map((item) => (
            <div key={`${title}-${item.label}`}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate font-bold text-slate-800">{item.label}</span>
                <span className="font-black text-emerald-800">{item.count}</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-white">
                <div
                  className="h-full rounded-full bg-amber-400"
                  style={{ width: `${Math.max(8, Math.round((item.count / maxCount) * 100))}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm font-semibold text-slate-600">{emptyText}</p>
        )}
      </div>
    </div>
  )
}

function PagePerformanceTable({ items }: { items: PagePerformanceItem[] }) {
  return (
    <div className="mt-6 rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-3">
        <h3 className="font-black text-slate-950">Page-level conversion</h3>
        <p className="mt-1 text-sm text-slate-600">Use this to decide which headline, CTA, or proof section to improve next.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-black uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Page</th>
              <th className="px-4 py-3 text-right">Views</th>
              <th className="px-4 py-3 text-right">Starts</th>
              <th className="px-4 py-3 text-right">Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.length ? (
              items.map((item) => (
                <tr key={item.path} className="hover:bg-slate-50">
                  <td className="max-w-[360px] truncate px-4 py-3 font-bold text-slate-900">{item.path}</td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-700">{item.pageViews}</td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-700">{item.ctaClicks}</td>
                  <td className="px-4 py-3 text-right font-black text-emerald-800">{item.clickRate}%</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center font-semibold text-slate-600">
                  No page-level events yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Guideline({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="flex gap-3">
      <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-200 text-emerald-950">
        {icon}
      </div>
      <div>
        <h3 className="font-black text-slate-950">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-700">{text}</p>
      </div>
    </div>
  )
}

function TextAreaField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string
  value: string
  placeholder: string
  onChange: (value: string) => void
}) {
  return (
    <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">
      {label}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={3}
        className="resize-y rounded-lg border border-slate-300 px-3 py-2 font-medium text-slate-950 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
      />
    </label>
  )
}
