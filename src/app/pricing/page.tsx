import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pricing | Behavior School',
  description: 'Simple pricing for Behavior School tools and programs.',
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[var(--bs-cream)] py-16 px-4">
      <div className="mx-auto max-w-5xl">
        <header className="text-center max-w-2xl mx-auto">
          <p className="bs-eyebrow">Pricing</p>
          <h1 className="mt-3 text-[var(--bs-ink)]xl sm:text-4xl font-bold text-[#123628]">Pick the path that fits your goals</h1>
          <p className="mt-4 text-[var(--bs-ink)] leading-relaxed">
            Start with exam prep, move into your daily tool stack, or join the full school BCBA training cohort.
          </p>
        </header>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <article className="rounded-xl border border-[var(--bs-hairline)] bg-[var(--bs-paper)] p-6">
            <h2 className="text-xl font-bold text-[#123628]">BCBA Exam Prep</h2>
            <p className="mt-1 text-[#365548] text-sm">Self-paced prep platform</p>
            <p className="mt-5 text-[var(--bs-ink)]xl font-bold text-[#123628]">$29.99<span className="text-base text-[#365548]">/month</span></p>
            <ul className="mt-5 space-y-2 text-sm text-[var(--bs-ink)]">
              <li>Mock exams and analytics</li>
              <li>Task-list aligned practice</li>
              <li>Study from any device</li>
            </ul>
            <Link
              href="https://study.behaviorschool.com/free-mock-exam/"
              className="bs-btn-primary w-full mt-6"
            >
              Start with the free mock exam
            </Link>
          </article>

          <article className="rounded-xl border-[2px] border-[var(--bs-forest)] bg-[var(--bs-paper)] p-6 relative">
            <span className="absolute -top-3 left-6 rounded-full bg-[#e4b63d] px-3 py-1 text-xs font-semibold text-[#123628]">Featured</span>
            <h2 className="text-xl font-bold text-[#123628]">Transformation Program</h2>
            <p className="mt-1 text-[#365548] text-sm">Six live sessions for school BCBAs</p>
            <p className="mt-5 text-[var(--bs-ink)]xl font-bold text-[#123628]">$1,997</p>
            <p className="mt-1 text-sm font-semibold text-[#365548]">Or 3 monthly payments of $665.67 ($1,997.01 total)</p>
            <ul className="mt-5 space-y-2 text-sm text-[var(--bs-ink)]">
              <li>Live weekly coaching</li>
              <li>Templates and implementation systems</li>
              <li>District-ready documentation support</li>
            </ul>
            <div className="mt-6 space-y-2">
              <Link
                href="/transformation-program"
                className="bs-btn-secondary w-full"
              >
                View program details
              </Link>
              <Link
                href="/contact"
                className="bs-link font-semibold w-full text-center inline-block mt-4"
              >
                Request private checkout
              </Link>
            </div>
          </article>

          <article className="rounded-xl border border-[var(--bs-hairline)] bg-[var(--bs-paper)] p-6">
            <p className="bs-eyebrow">Invite only</p>
            <h2 className="mt-2 text-xl font-bold text-[#123628]">BehaviorSchool Pro</h2>
            <p className="mt-1 text-[#365548] text-sm">Invite-only FBA/BIP workspace in development</p>
            <p className="mt-5 text-base font-semibold text-[#123628]">Not open for public accounts</p>
            <ul className="mt-5 space-y-2 text-sm text-[var(--bs-ink)]">
              <li>FBA and BIP workflow planning</li>
              <li>IEP goal workspace concepts</li>
              <li>Student plan organization</li>
            </ul>
            <Link
              href="/pro"
              className="bs-link font-semibold mt-6 inline-block"
            >
              View invite-only access
            </Link>
          </article>
        </section>

        <div className="mt-10 text-center">
          <Link href="/transformation-program" className="bs-link font-semibold">
            Need details before you decide? Read the full Transformation Program page.
          </Link>
        </div>
      </div>
    </main>
  );
}
