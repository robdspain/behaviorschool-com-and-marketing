import Link from 'next/link'
import { ArrowRight, PlayCircle, Shield, Target, TrendingUp } from 'lucide-react'

export const metadata = {
  title: 'BCBA Practice | Free Mini or Full Mock (Guest) | Results gated',
  description: 'Start a free guest BCBA practice test: one mini (10) or one full mock. Auth required to view results and analytics.',
  alternates: { canonical: 'https://behaviorschool.com/practice' },
}

export default function PracticePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="container mx-auto px-6 pt-24 pb-8 text-center">
        <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">BCBA Practice</div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">Free BCBA Practice Tests</h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
          Take one free guest test: mini (10 Q) or full mock (185 Q). Sign in to unlock results and analytics.
        </p>
      </section>

      <section className="container mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Mini Mock */}
          <Card
            badge="Quick Start"
            title="Mini Mock (10 questions)"
            desc="Fast diagnostic to sample difficulty and pacing."
            bullets={[
              'Instant scoring (guest)',
              'Mixed domains',
              'No signup to start',
            ]}
            href="/practice/launch?mode=mini"
            cta="Start Mini (10)"
          />

          {/* Full Mock */}
          <Card
            badge="Full Simulation"
            title="Full Mock (185 questions)"
            desc="Realistic timing and distribution for deep prep."
            bullets={[
              'Instant scoring (guest)',
              'All domains covered',
              'No signup to start',
            ]}
            href="/practice/launch?mode=full"
            cta="Start Full (185)"
            highlight
          />
        </div>

        <div className="max-w-5xl mx-auto mt-10 grid md:grid-cols-3 gap-6">
          <Value icon={<Target className="w-6 h-6" />} title="Realistic" text="Exam‑style timing and items" />
          <Value icon={<TrendingUp className="w-6 h-6" />} title="Insightful" text="Detailed domain analytics (with sign‑in)" />
          <Value icon={<Shield className="w-6 h-6" />} title="Secure" text="Results gated until you sign in" />
        </div>

        <div className="max-w-4xl mx-auto mt-12 bg-blue-50 border border-blue-200 rounded-2xl p-6 text-blue-900">
          <p className="text-sm">
            Note: Guest mode lets you complete one mini or one full mock for free. To view your results, explanations, and analytics, you&apos;ll be prompted to sign in. Returning users can resume where they left off.
          </p>
        </div>
      </section>
    </main>
  )
}

function Card({ badge, title, desc, bullets, href, cta, highlight = false }: {
  badge: string;
  title: string;
  desc: string;
  bullets: string[];
  href: string;
  cta: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-6 shadow-sm ${highlight ? 'bg-gradient-to-br from-blue-50 to-emerald-50 border-blue-200' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${highlight ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}>{badge}</span>
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-slate-600 mb-4">{desc}</p>
      <ul className="text-sm text-slate-700 space-y-2 mb-6">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1">•</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <Link href={href} className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold transition-colors ${highlight ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-900 hover:bg-black text-white'}`}>
        <PlayCircle className="w-4 h-4" /> {cta}
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )
}

function Value({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-800 mb-3">
        {icon}
      </div>
      <h4 className="font-bold text-slate-900">{title}</h4>
      <p className="text-slate-600 text-sm">{text}</p>
    </div>
  )
}

