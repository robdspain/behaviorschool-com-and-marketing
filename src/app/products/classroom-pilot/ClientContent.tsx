"use client"

import { useState } from "react"
import { CheckCircle, ArrowRight, FileDown } from "lucide-react"
import Link from "next/link"

export default function ClientContent() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setIsSuccess(false)
    setError(null)
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, company: "" }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || "Subscription failed")
      }
      setIsSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 select-none">
        <div className="absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute -bottom-24 right-1/3 h-80 w-80 rounded-full bg-yellow-300/20 blur-3xl" />
      </div>

      <section className="mx-auto max-w-6xl px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-emerald-700 font-semibold">ClassroomPilot</p>
          <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
            IEP Goal Tracking & Progress Monitoring Software
          </h1>
          <p className="mt-4 text-lg text-slate-700">
            Special education teacher software for streamlined IEP data collection, progress monitoring, and reporting. Plan accommodations, integrate assistive technology, and stay audit‑ready for IDEA compliance.
          </p>
          <div className="mt-6 inline-flex items-center gap-3">
            <a href="#checklist" className="rounded-xl bg-emerald-600 px-5 py-3 text-white font-semibold inline-flex items-center">
              Get the Free Checklist
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            <Link href="/products" className="rounded-xl bg-white ring-1 ring-slate-200 px-5 py-3 text-slate-900 font-semibold">
              See all products
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 lg:px-8 pb-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[ 
            {
              title: "IEP goal tracking tool",
              desc: "Track objectives, baselines, and mastery criteria with defensible, audit‑ready logs.",
            },
            {
              title: "Progress monitoring app for special ed",
              desc: "Collect SPED data on the fly—frequency, duration, trials—and visualize growth.",
            },
            {
              title: "IEP progress report generator",
              desc: "Export clear reports and parent‑friendly summaries in clicks.",
            },
            {
              title: "Accommodations tracking tool",
              desc: "Plan and document accommodations and modifications across classes.",
            },
            {
              title: "Parent communication tools",
              desc: "Share updates securely with built‑in templates and translation support.",
            },
            {
              title: "Assistive technology integration",
              desc: "Embed AT use in goals and document usage for IDEA compliance.",
            },
          ].map((f) => (
            <div key={f.title} className="group relative rounded-2xl bg-white/80 ring-1 ring-slate-200/70 p-6 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.25)]">
              <h3 className="text-lg font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-1 text-slate-600">{f.desc}</p>
              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: "radial-gradient(120% 60% at 50% 0%, rgba(16,185,129,0.10) 0%, transparent 60%)" }} />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 text-center">How it works</h2>
          <p className="mt-3 text-slate-600 max-w-3xl mx-auto text-center">From IEP goals to lesson plans, daily data collection, and defensible reporting—all in one workflow.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {[ 
              { step: "IEP goals", text: "Define measurable objectives, baselines, criteria, and accommodations." },
              { step: "Lesson plans", text: "Map objectives to instructional plans and prompts across settings." },
              { step: "Progress tracking", text: "Run quick IEP data collection with trials, frequency, duration, and notes." },
              { step: "Reporting", text: "Generate progress reports with graphs, narratives, and IDEA‑aligned language." },
            ].map((s) => (
              <div key={s.step} className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70">
                <div className="inline-flex items-center gap-2 text-emerald-700 font-semibold">
                  <CheckCircle className="h-5 w-5" />
                  <span>{s.step}</span>
                </div>
                <p className="mt-2 text-slate-700">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="checklist" className="py-16">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="rounded-2xl bg-white/80 ring-1 ring-slate-200/70 p-6 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.25)]">
            <div className="flex items-start gap-4">
              <div className="mt-1 rounded-xl bg-emerald-50 p-3 text-emerald-700"><FileDown className="h-6 w-6" /></div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-slate-900">Free checklist: Top 10 IEP Data Tracking Tips</h3>
                <p className="mt-1 text-slate-600">Enter your email to get the checklist. We’ll send it to your inbox and unlock the instant download.</p>
                <form onSubmit={handleSubmit} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your name (optional)"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-label="Name"
                  />
                  <input
                    required
                    type="email"
                    name="email"
                    placeholder="you@school.edu"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-label="Email"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-2 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                  >
                    {isLoading ? "Sending…" : "Get the checklist"}
                  </button>
                </form>
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                {isSuccess && (
                  <div className="mt-3 rounded-lg bg-emerald-50 p-3 text-emerald-800">
                    <p className="text-sm font-medium">Check your inbox—plus you can download instantly below.</p>
                    <div className="mt-2">
                      <Link href="/resources/iep-data-tracking-tips" className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 ring-1 ring-emerald-200 text-emerald-800">
                        <FileDown className="h-4 w-4" /> Download now
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="rounded-2xl bg-slate-900 text-white p-8 md:p-10 flex items-center justify-between flex-col md:flex-row gap-4">
            <div>
              <h3 className="text-2xl font-semibold">Ready to simplify IEP progress monitoring?</h3>
              <p className="text-white/80 mt-1">Start with our free tips, then see how ClassroomPilot fits your team.</p>
            </div>
            <a href="#checklist" className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold inline-flex items-center">
              Get the checklist
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}