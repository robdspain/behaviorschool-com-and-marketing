'use client'

import { useEffect, useMemo, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  Clipboard,
  ExternalLink,
  Eye,
  Link2,
  ListChecks,
  Megaphone,
  MousePointerClick,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
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
