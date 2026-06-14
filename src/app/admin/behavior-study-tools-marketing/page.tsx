'use client'

import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clipboard,
  ExternalLink,
  Eye,
  Megaphone,
  MousePointerClick,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react'
import { behaviorStudyToolsMarketing } from '@/data/behaviorStudyToolsMarketing'

const dayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function BehaviorStudyToolsMarketingPage() {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [copied, setCopied] = useState(false)
  const router = useRouter()

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

  const todayPlan = useMemo(() => {
    const today = dayOrder[new Date().getDay()]
    return (
      behaviorStudyToolsMarketing.postPlan.find((post) => post.day === today) ||
      behaviorStudyToolsMarketing.postPlan[0]
    )
  }, [])

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
