import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FbaStarterKitForm } from '@/components/events/FbaStarterKitForm';
import { FBA_KIT_GATED } from '@/lib/fba-starter-kit';

const title = 'FBA in a School Setting: Free CEU with Rob Spain, Oct 9';
const description = 'Free 1 BACB General CEU with Rob Spain on BehaviorLive, Friday Oct 9, 2026, 12 to 1 PM Pacific Time. FBA vs FA decision rules for school BCBAs.';
const canonical = 'https://behaviorschool.com/events/fba-in-a-school-setting';
const eventImage = 'https://behaviorschool.com/optimized/BIP-Writer/BIP-Writer-Team.webp';
const behaviorLiveUrl = 'https://behaviorlive.com/events/functional-behavior-assessment-in-a-school-setting';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical },
  openGraph: {
    title,
    description,
    url: canonical,
    siteName: 'Behavior School',
    type: 'website',
    images: [{ url: eventImage, width: 1536, height: 1024, alt: 'Behavior team reviewing a plan together' }],
  },
  twitter: { card: 'summary_large_image', title, description, images: [eventImage] },
};

const eventJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: 'Functional Behavior Assessment in a School Setting',
  description: 'Free 1 BACB General CEU for school BCBAs: FBA vs FA decision rules; brief, trial-based, latency, precursor, synthesized and analog functional analysis; linking findings to function-based BIP components.',
  startDate: '2026-10-09T12:00:00-07:00',
  endDate: '2026-10-09T13:00:00-07:00',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
  location: { '@type': 'VirtualLocation', url: behaviorLiveUrl },
  isAccessibleForFree: true,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock', url: behaviorLiveUrl },
  performer: { '@type': 'Person', name: 'Rob Spain', url: 'https://robspain.com/' },
  organizer: { '@type': 'Organization', name: 'California Association for Behavior Analysis (CalABA)', url: 'https://calaba.org' },
  image: [eventImage],
  url: canonical,
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Events', item: 'https://behaviorschool.com/events' },
    { '@type': 'ListItem', position: 2, name: 'Functional Behavior Assessment in a School Setting', item: canonical },
  ],
};

export default function FbaInSchoolSettingPage() {
  return (
    <main className="min-h-screen bg-[#fbfaf6] text-slate-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <section className="bg-emerald-900 px-4 py-16 text-white sm:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200">Free BACB General CEU</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">Functional Behavior Assessment in a School Setting</h1>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-emerald-100">Friday, October 9, 2026, 12 to 1 PM Pacific Time. Hosted by the CalABA BAE SIG on BehaviorLive.</p>
          <a href={behaviorLiveUrl} target="_blank" rel="noopener" className="mt-8 inline-flex rounded-lg bg-[#e4b63d] px-6 py-3 font-semibold text-slate-950 hover:bg-[#f0c95d]">Register free on BehaviorLive</a>
        </div>
      </section>

      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 lg:grid-cols-[1fr_0.8fr] lg:py-16">
        <article className="space-y-10">
          <section>
            <h2 className="text-2xl font-bold">What this CEU covers</h2>
            <p className="mt-4 leading-relaxed text-slate-700">This session covers FBA versus FA decision rules, plus brief, trial-based, latency, precursor, synthesized, and analog functional analysis. You will also connect findings to function-based BIP components.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold">Who it is for</h2>
            <p className="mt-4 leading-relaxed text-slate-700">School BCBAs who want practical decision rules for assessment and a clearer link from findings to function-based behavior intervention plans.</p>
            <p className="mt-4 leading-relaxed text-slate-700">The CEU is free and includes 1 BACB General CEU.</p>
          </section>
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold">Speaker</h2>
            <div className="mt-5 flex items-start gap-4">
              <Image src="/optimized/profile-Rob.webp" alt="Rob Spain, BCBA" width={80} height={80} className="rounded-full" />
              <p className="leading-relaxed text-slate-700"><Link href="https://robspain.com/" className="font-semibold text-emerald-800 underline">Rob Spain</Link> is a Board Certified Behavior Analyst with M.S., BCBA, and IBA credentials. He has 14+ years experience and serves as President, CalABA Education SIG.</p>
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-bold">Go deeper</h2>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-emerald-800 underline underline-offset-4">
              <Link href="/functional-behavior-assessment-guide">Functional Behavior Assessment Guide</Link>
              <Link href="/fba-decision-matrix">FBA Decision Matrix</Link>
              <Link href="/fba-to-bip">FBA to BIP</Link>
            </div>
          </section>
        </article>

        <aside className="space-y-8">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <Image src="/optimized/BIP-Writer/BIP-Writer-Team.webp" alt="Behavior team reviewing a plan together" width={1536} height={1024} className="h-56 w-full object-cover" priority />
            <div className="p-6">
              <p className="font-semibold text-emerald-800">School FA starter kit</p>
              <h2 className="mt-2 text-2xl font-bold">Take the next step after the CEU</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">Get the starter kit by email.</p>
              {FBA_KIT_GATED && <div className="mt-5"><FbaStarterKitForm /></div>}
            </div>
          </div>
          <div className="rounded-xl bg-emerald-900 p-6 text-white">
            <h2 className="text-2xl font-bold">Build the system</h2>
            <p className="mt-3 leading-relaxed text-emerald-100">FBA systems are session content in the Jan 14 cohort.</p>
            <Link href="/transformation-program" className="mt-5 inline-flex rounded-lg bg-[#e4b63d] px-5 py-3 font-semibold text-slate-950 hover:bg-[#f0c95d]">See the School BCBA Systems Transformation Program</Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
