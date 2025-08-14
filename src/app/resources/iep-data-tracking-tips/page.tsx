import type { Metadata } from "next"
import Link from "next/link"
import { FileDown } from "lucide-react"

export const metadata: Metadata = {
  title: "Top 10 IEP Data Tracking Tips (Printable Checklist)",
  description: "Download a printable checklist with practical tips for IEP data collection and progress monitoring.",
  alternates: { canonical: "/resources/iep-data-tracking-tips" },
  openGraph: {
    type: "article",
    title: "Top 10 IEP Data Tracking Tips (Printable Checklist)",
    description: "Practical, school‑ready ideas for better IEP data collection and reporting.",
    url: "/resources/iep-data-tracking-tips",
  },
}

export default function IepDataTrackingTips() {
  return (
    <div className="mx-auto max-w-3xl px-6 lg:px-8 py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Top 10 IEP Data Tracking Tips</h1>
      <p className="mt-3 text-slate-700">A printable checklist for special education teams to improve IEP data collection and progress monitoring.</p>

      <div className="mt-6 rounded-2xl bg-white/80 ring-1 ring-slate-200/70 p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-emerald-50 p-2 text-emerald-700"><FileDown className="h-6 w-6" /></div>
          <div>
            <p className="text-slate-700">Click below to download the PDF. Save and share with your team.</p>
            <div className="mt-3">
              <a href="/Top-10-IEP-Data-Tracking-Tips.pdf" className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white font-semibold hover:bg-emerald-700">
                <FileDown className="h-4 w-4" /> Download PDF
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 text-sm text-slate-600">
        <p>Looking for software to streamline IEP goals, data collection, and reporting?</p>
        <p className="mt-1">
          Check out <Link href="/products/classroom-pilot" className="text-emerald-700 underline">ClassroomPilot</Link>.
        </p>
      </div>
    </div>
  )
}