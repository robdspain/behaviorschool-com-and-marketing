import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TierPath — The MTSS/PBIS Operating System",
  description:
    "From universal screening to Tier 3 fidelity — connect teams, track supports, and report outcomes.",
  alternates: { canonical: "/tierpath" },
  openGraph: {
    type: "website",
    title: "TierPath — The MTSS/PBIS Operating System",
    description:
      "From universal screening to Tier 3 fidelity — connect teams, track supports, and report outcomes.",
    url: "/tierpath",
  },
};

export default function TierPathPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TierPath",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    description:
      "From universal screening to Tier 3 fidelity — connect teams, track supports, and report outcomes.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  } as const;

  return (
    <div className="bg-[var(--bs-background,#FAF3E0)]">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24" aria-labelledby="hero-title">
        <div className="text-center">
          <h1 id="hero-title" className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
            TierPath — The MTSS/PBIS Operating System
          </h1>
          <p className="mt-4 text-lg text-slate-700 mx-auto max-w-3xl">
            From universal screening to Tier 3 fidelity — connect teams, track supports, and report outcomes.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {[
              "MTSS",
              "PBIS",
              "Tier 1–3",
              "CICO",
              "Progress Monitoring",
            ].map((label) => (
              <span
                key={label}
                className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200"
              >
                {label}
              </span>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-center gap-3">
            <a
              className="inline-flex items-center rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/60 focus-visible:ring-offset-2"
              href="#waitlist"
            >
              Join the waitlist
            </a>
            <a
              className="inline-flex items-center rounded-lg border border-emerald-600 bg-white px-5 py-3 text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/60 focus-visible:ring-offset-2"
              href="#features"
            >
              See features
            </a>
          </div>
        </div>
      </section>

      {/* Problems / How it helps */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Current problems</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
              <li>Screening, interventions, and data live in silos</li>
              <li>No single view of Tier 1–3 supports across schools</li>
              <li>Fidelity and outcomes are hard to prove</li>
            </ul>
          </div>
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">How this helps</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
              <li>Centralize Tier 1–3 interventions and student rosters</li>
              <li>Built-in CICO with status and trends</li>
              <li>Fidelity tracking with dashboards for leadership</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Key features</h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { t: "Screen", d: "Universal screening + risk flags." },
            { t: "Intervene", d: "Assign Tier 2/3 supports and track delivery." },
            { t: "CICO", d: "Daily points, trends, and alerts." },
            { t: "Monitor", d: "Progress views by student, school, and district." },
            { t: "Fidelity", d: "Implementation checks and coaching loops." },
            { t: "Report", d: "Board-ready summaries in minutes." },
          ].map(({ t, d }) => (
            <div key={t} className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">{t}</h3>
              <p className="mt-1 text-sm text-slate-700">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Audience */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Who it&apos;s for</h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { t: "District Leaders", d: "See supports and outcomes across campuses." },
            { t: "PBIS/MTSS Coaches", d: "Coordinate delivery and coach to fidelity." },
            { t: "Principals", d: "Know what&apos;s working and where to staff." },
          ].map(({ t, d }) => (
            <div key={t} className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">{t}</h3>
              <p className="mt-1 text-sm text-slate-700">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Join the waitlist</h2>
        <form
          name="waitlist"
          method="POST"
          data-netlify="true"
          netlify-honeypot="bot-field"
          className="mt-6 rounded-xl border bg-white p-6 shadow-sm"
        >
          <input type="hidden" name="form-name" value="waitlist" />
          <p hidden>
            <label>
              Don&apos;t fill this out: <input name="bot-field" />
            </label>
          </p>
          <div className="grid grid-cols-1 gap-4">
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 placeholder-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/60 focus-visible:ring-offset-2"
              type="email"
              name="email"
              placeholder="Work email"
              required
            />
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 placeholder-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/60 focus-visible:ring-offset-2"
              type="text"
              name="name"
              placeholder="Full name"
              required
            />
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 placeholder-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/60 focus-visible:ring-offset-2"
              type="text"
              name="district"
              placeholder="District / Organization"
            />
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 placeholder-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/60 focus-visible:ring-offset-2"
              type="text"
              name="role"
              placeholder="Role (Admin, Coach, Leader)"
            />
            <input type="hidden" name="product" value="tierpath" />
            <button
              className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/60 focus-visible:ring-offset-2"
              type="submit"
            >
              Request early access
            </button>
            <p className="text-xs text-slate-500">
              We&apos;ll only contact you about TierPath. Unsubscribe anytime.
            </p>
          </div>
        </form>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}