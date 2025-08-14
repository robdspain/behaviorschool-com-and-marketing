import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TierPath — MTSS & PBIS Software for Schools",
  description:
    "Track MTSS tiers, PBIS interventions, and progress monitoring in one dashboard. From screening to Tier 3 fidelity tracking.",
  keywords: [
    "MTSS software",
    "PBIS management system",
    "tiered intervention tracking",
    "multi-tiered system of supports tool",
    "CICO tracking software",
    "progress monitoring for MTSS",
    "schoolwide PBIS software",
    "tier 1 tier 2 tier 3 supports",
    "universal screening",
    "fidelity checks",
  ],
  openGraph: {
    title: "TierPath — MTSS & PBIS Software for Schools",
    description:
      "Track MTSS tiers, PBIS interventions, and progress monitoring in one dashboard. From screening to Tier 3 fidelity tracking.",
    url: "/products/tierpath",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TierPath — MTSS & PBIS Software for Schools",
    description:
      "Track MTSS tiers, PBIS interventions, and progress monitoring in one dashboard. From screening to Tier 3 fidelity tracking.",
  },
  alternates: { canonical: "/products/tierpath" },
};

export default function TierPathPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the best MTSS software?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "The best MTSS software makes data easy to collect, visualize, and act on. TierPath unifies universal screening, tiered intervention tracking, progress monitoring, and fidelity checks in one MTSS data system.",
        },
      },
      {
        "@type": "Question",
        name: "How do schools track PBIS fidelity?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Schools track PBIS fidelity with routine checklists and implementation rubrics tied to Tier 1–3 practices. TierPath streamlines PBIS tracking with scheduled fidelity checks, role-based workflows, and district rollups.",
        },
      },
    ],
  } as const;

  return (
    <div className="relative">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 lg:px-8 pt-12 pb-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
            TierPath — MTSS & PBIS Software for Schools
          </h1>
          <p className="mt-5 text-lg text-slate-700">
            TierPath is an MTSS data system for schoolwide PBIS tracking. Unify universal screening,
            tiered intervention tracking, CICO tracking software, and progress monitoring for MTSS
            in one place—built for Tier 1, Tier 2, and Tier 3 supports.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="/contact" className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 transition-colors">Request a demo</a>
            <a href="#features" className="inline-flex items-center rounded-lg ring-1 ring-slate-300 px-4 py-2 text-slate-800 hover:bg-slate-50 transition-colors">See features</a>
          </div>
        </div>
      </section>

      {/* MTSS Triangle Visual */}
      <section className="mx-auto max-w-6xl px-6 lg:px-8 pb-14">
        <div className="grid md:grid-cols-2 gap-8 items-center rounded-2xl bg-white/80 ring-1 ring-slate-200/70 p-6 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.25)]">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Visualize Tier 1–3 supports</h2>
            <p className="mt-3 text-slate-700">
              Grounded in MTSS and PBIS best practice, TierPath helps teams align Tier 1 prevention,
              Tier 2 targeted supports, and Tier 3 intensive interventions. Capture universal screening,
              assign interventions, and run fidelity checks with confidence.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <svg viewBox="0 0 300 240" className="w-full max-w-md">
              <defs>
                <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#34D399" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="g2" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#FBBF24" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="g3" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#F87171" stopOpacity="0.9" />
                </linearGradient>
              </defs>
              {/* Tier 1 */}
              <polygon points="150,20 280,220 20,220" fill="url(#g1)" opacity="0.18" />
              {/* Tier 2 */}
              <polygon points="150,50 250,210 50,210" fill="url(#g2)" opacity="0.32" />
              {/* Tier 3 */}
              <polygon points="150,85 220,200 80,200" fill="url(#g3)" opacity="0.55" />
              <text x="150" y="108" textAnchor="middle" fontSize="14" fill="#991B1B">Tier 3</text>
              <text x="150" y="70" textAnchor="middle" fontSize="14" fill="#92400E">Tier 2</text>
              <text x="150" y="38" textAnchor="middle" fontSize="14" fill="#065F46">Tier 1</text>
            </svg>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 lg:px-8 pb-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Tiered intervention tracking",
              desc:
                "Assign, schedule, and monitor interventions across Tier 1–3. Capture dosage, implementers, and outcomes for defensible data.",
            },
            {
              title: "CICO tracking software",
              desc:
                "Streamline CICO with daily point sheets, automatic graphs, and alerts when students meet criteria for fading or intensification.",
            },
            {
              title: "Progress monitoring for MTSS",
              desc:
                "Graph goals and decision rules that prompt teams to act. See growth and risk at a glance for individual students and groups.",
            },
            {
              title: "Schoolwide PBIS software",
              desc:
                "Centralize expectations, acknowledgments, and office discipline referrals with district-ready PBIS tracking and reporting.",
            },
            {
              title: "Universal screening",
              desc:
                "Run screeners and risk flags on a schedule. Automatically route students to Tier 2 supports with clear next steps.",
            },
            {
              title: "Fidelity checks",
              desc:
                "Schedule and complete fidelity checks tied to each intervention. Summarize implementation quality for teams and leadership.",
            },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl bg-white/80 ring-1 ring-slate-200/70 p-6 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.25)]">
              <h3 className="text-lg font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-slate-700">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* For District Leaders */}
      <section className="mx-auto max-w-6xl px-6 lg:px-8 pb-20">
        <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-white ring-1 ring-slate-200 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-slate-900">For District Leaders</h2>
          <p className="mt-3 text-slate-700">
            Roll up building-level data for district dashboards and board reports. TierPath is an MTSS data system
            designed for operational clarity—staff permissions, templates, and alignment with your district’s
            PBIS tracking and MTSS frameworks.
          </p>
          <ul className="mt-5 space-y-2 text-slate-700 list-disc list-inside">
            <li>Districtwide oversight of Tier 1–3 supports with clear ownership</li>
            <li>Automated reports, exports, and compliance-ready documentation</li>
            <li>Implementation dashboards for fidelity checks and coaching</li>
            <li>Bulk setup and rostering to launch quickly across schools</li>
          </ul>
          <div className="mt-6">
            <a href="/contact" className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 transition-colors">Talk to our team</a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-6xl px-6 lg:px-8 pb-24">
        <h2 className="text-2xl font-semibold text-slate-900">Frequently asked questions</h2>
        <div className="mt-6 space-y-6">
          <details className="rounded-xl ring-1 ring-slate-200 p-4 bg-white/70">
            <summary className="cursor-pointer font-medium text-slate-900">What is the best MTSS software?</summary>
            <p className="mt-2 text-slate-700">
              The best MTSS software brings together universal screening, tiered intervention tracking, progress monitoring,
              and fidelity checks in an easy-to-use platform. TierPath is an MTSS data system that helps teams act on data quickly.
            </p>
          </details>
          <details className="rounded-xl ring-1 ring-slate-200 p-4 bg-white/70">
            <summary className="cursor-pointer font-medium text-slate-900">How do schools track PBIS fidelity?</summary>
            <p className="mt-2 text-slate-700">
              Schools track PBIS fidelity with routine checklists and rubrics tied to Tier 1–3 practices. TierPath simplifies
              PBIS tracking by scheduling fidelity checks, surfacing implementation trends, and aligning with coaching cycles.
            </p>
          </details>
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 lg:px-8 pb-24">
        <div className="rounded-2xl bg-emerald-600 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-semibold">See TierPath in action</h3>
            <p className="mt-2 text-emerald-50">Get a walkthrough tailored to your MTSS and PBIS goals.</p>
          </div>
          <a href="/contact" className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-emerald-700 hover:bg-emerald-50 transition-colors">Request a demo</a>
        </div>
      </section>
    </div>
  );
}