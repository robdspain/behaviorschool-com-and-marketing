import Link from 'next/link'
import { ArrowRight, PlayCircle, Shield, Target, TrendingUp } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata = buildPageMetadata({
  title: 'Free BCBA Practice | Quick Check or Full 185 Mock | Behavior Study Tools',
  description: 'Try a free 9-question BCBA Quick domain check with no account, or take the full 185-question mock in Behavior Study Tools. The full mock requires a free account before you start.',
  canonical: 'https://behaviorschool.com/practice',
})

export default function PracticePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="container mx-auto px-6 pt-24 pb-8 text-center">
        <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">BCBA Practice</div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">Free BCBA Practice Tests</h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
          Try a free 9-question Quick domain check with no account, or take the full 185-question mock in Behavior Study Tools with a free account.
        </p>
      </section>

      <section className="container mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Mini Mock */}
          <Card
            badge="Quick Start"
            title="Quick domain check (9 questions)"
            desc="Fast diagnostic to sample difficulty and pacing."
            bullets={[
              'Instant score and domain breakdown',
              'Mixed domains',
              'No account needed',
            ]}
            href="/practice/launch?mode=mini"
            cta="Start Quick domain check"
          />

          {/* Full Mock */}
          <Card
            badge="Full Simulation"
            title="Full Mock (185 questions)"
            desc="Realistic timing and distribution for deep prep."
            bullets={[
              'Score and domain breakdown right after you finish',
              'All domains covered',
              'Free account required before you start',
            ]}
            href="https://study.behaviorschool.com/free-mock-exam/"
            cta="Start Full (185)"
            highlight
          />
        </div>

        <div className="max-w-5xl mx-auto mt-10 grid md:grid-cols-3 gap-6">
          <Value icon={<Target className="w-6 h-6" />} title="Realistic" text="Exam‑style timing and items" />
          <Value icon={<TrendingUp className="w-6 h-6" />} title="Insightful" text="Domain-level score breakdown after every mock" />
          <Value icon={<Shield className="w-6 h-6" />} title="Free to start" text="Free account, no credit card" />
        </div>

        <div className="max-w-4xl mx-auto mt-12 bg-blue-50 border border-blue-200 rounded-2xl p-6 text-blue-900">
          <p className="text-sm">
            Note: The 9-question Quick domain check needs no account. The full 185-question mock requires a free account before you start. After the mock, your score and domain breakdown appear right away, and you get a taste of the explanations plus a 7-day Pro trial to review the rest.
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
