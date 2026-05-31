import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pricing | Behavior School',
  description: 'Simple pricing for Behavior School tools and programs.',
};

const transformationCheckout = 'https://buy.stripe.com/14AaEWdmIekU2Mc1OK6Vq01';
const transformationInstallments = 'https://buy.stripe.com/00w5kCaawdgQ72sdxs6Vq02';

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#f9f7f2] py-16 px-4">
      <div className="mx-auto max-w-5xl">
        <header className="text-center max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-[#1f4d3f] font-semibold">Pricing</p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-[#123628]">Pick the path that fits your goals</h1>
          <p className="mt-4 text-slate-700 leading-relaxed">
            Start with exam prep, move into your daily tool stack, or join the full school BCBA training cohort.
          </p>
        </header>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-[#1f4d3f]/15 bg-white p-6">
            <h2 className="text-xl font-bold text-[#123628]">BCBA Exam Prep</h2>
            <p className="mt-1 text-slate-600 text-sm">Self-paced prep platform</p>
            <p className="mt-5 text-3xl font-bold text-[#123628]">$29.99<span className="text-base text-slate-500">/month</span></p>
            <ul className="mt-5 space-y-2 text-sm text-slate-700">
              <li>Mock exams and analytics</li>
              <li>Task-list aligned practice</li>
              <li>Study from any device</li>
            </ul>
            <a
              href="https://study.behaviorschool.com"
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#1f4d3f] px-4 py-3 text-sm font-semibold text-white hover:bg-[#123628]"
            >
              Start studying
            </a>
          </article>

          <article className="rounded-2xl border-2 border-[#e4b63d] bg-white p-6 relative">
            <span className="absolute -top-3 left-6 rounded-full bg-[#e4b63d] px-3 py-1 text-xs font-semibold text-[#123628]">Featured</span>
            <h2 className="text-xl font-bold text-[#123628]">Transformation Program</h2>
            <p className="mt-1 text-slate-600 text-sm">6-week live cohort for school BCBAs</p>
            <p className="mt-5 text-3xl font-bold text-[#123628]">$2,497</p>
            <ul className="mt-5 space-y-2 text-sm text-slate-700">
              <li>Live weekly coaching</li>
              <li>Templates and implementation systems</li>
              <li>District-ready documentation support</li>
            </ul>
            <div className="mt-6 space-y-2">
              <a
                href={transformationCheckout}
                className="inline-flex w-full items-center justify-center rounded-full bg-[#1f4d3f] px-4 py-3 text-sm font-semibold text-white hover:bg-[#123628]"
              >
                Enroll now
              </a>
              <a
                href={transformationInstallments}
                className="inline-flex w-full items-center justify-center rounded-full border border-[#1f4d3f]/30 px-4 py-3 text-sm font-semibold text-[#1f4d3f] hover:bg-[#1f4d3f]/5"
              >
                3 monthly payments
              </a>
            </div>
          </article>

          <article className="rounded-2xl border border-[#1f4d3f]/15 bg-white p-6">
            <h2 className="text-xl font-bold text-[#123628]">BehaviorSchool Pro</h2>
            <p className="mt-1 text-slate-600 text-sm">AI tools for school behavior teams</p>
            <p className="mt-5 text-3xl font-bold text-[#123628]">$29.99<span className="text-base text-slate-500">/month</span></p>
            <ul className="mt-5 space-y-2 text-sm text-slate-700">
              <li>FBA and BIP workflow tools</li>
              <li>Student management features</li>
              <li>Secure district-oriented setup</li>
            </ul>
            <a
              href="https://plan.behaviorschool.com"
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#1f4d3f] px-4 py-3 text-sm font-semibold text-white hover:bg-[#123628]"
            >
              View Pro platform
            </a>
          </article>
        </section>

        <div className="mt-10 text-center">
          <Link href="/transformation-program" className="text-sm font-semibold text-[#1f4d3f] underline underline-offset-4">
            Need details before you decide? Read the full Transformation Program page.
          </Link>
        </div>
      </div>
    </main>
  );
}
