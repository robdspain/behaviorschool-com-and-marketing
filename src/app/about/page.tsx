import type { Metadata } from "next";
import Link from "next/link";
import { AboutUsOne } from "@/components/blocks/about-us-1";

export const metadata: Metadata = {
  title: "About | Behavior School",
  description:
    "Behavior School helps school-based BCBAs and behavior teams lead with confidence, reduce overwhelm, and create lasting change—without burnout.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-3">About Behavior School</h1>
        <p className="text-lg text-slate-700 max-w-3xl mx-auto">
          Practical systems, tools, and training for behavior analysts working in schools. Built for real classrooms,
          grounded in the science of learning and behavior.
        </p>
      </header>

      <section className="grid gap-8 md:grid-cols-2 items-start">
        <div className="prose prose-slate max-w-none">
          <h2>Mission</h2>
          <p>
            We help school-based behavior professionals lead with clarity, reduce overwhelm, and build sustainable
            systems that improve student outcomes—without burning out the adults who make those systems run.
          </p>
          <h3>What we offer</h3>
          <ul>
            <li>
              <strong>Behavior Study Tools</strong>: AI‑supported BCBA exam prep and precision practice with adaptive
              sets, mastery tracking, and rich rationales.
            </li>
            <li>
              <strong>Supervision tools</strong>: Simple, scalable workflows to support meaningful, compassionate
              supervision.
            </li>
            <li>
              <strong>Resources & community</strong>: Practical guides, templates, and a network of practitioners who
              share what works in real schools.
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">At a glance</h3>
          <ul className="mt-4 space-y-3 text-slate-700">
            <li>• Built for school contexts—from FBAs to implementation fidelity</li>
            <li>• Evidence‑based and field‑tested in real classrooms</li>
            <li>• Time‑saving defaults and workflows that reduce busywork</li>
            <li>• Compassionate, team‑centered approach to behavior change</li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/study" className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">
              Explore Study Tools
            </Link>
            <Link href="/supervisors" className="inline-flex items-center rounded-md border border-slate-300 px-4 py-2 text-slate-900 hover:bg-slate-50">
              Supervision
            </Link>
            <Link href="/products" className="inline-flex items-center rounded-md border border-slate-300 px-4 py-2 text-slate-900 hover:bg-slate-50">
              All Products
            </Link>
          </div>
        </div>
      </section>

      <div className="mt-12">
        <AboutUsOne />
      </div>

      <section className="mt-12 prose prose-slate max-w-none">
        <h2>Our story</h2>
        <p>
          More than 20 years ago, I was a special education teacher in a non‑public school serving students with
          significant behavioral and learning needs. One student—who once wanted to stab me with a pencil—struggled so
          profoundly with reading that he had given up completely.
        </p>
        <p>
          A behavior analyst visited my classroom and showed me how to teach him using behavioral principles. I watched
          him gain three grade levels in reading in a single year. That experience changed the trajectory of my career
          and revealed the power of a systems‑first, skills‑focused approach.
        </p>
        <p>
          Since then, I’ve worked across roles—from teacher to behavior analyst to team lead—building structures that
          help students learn and help adults succeed. Behavior School is the toolkit I wish I had: practical, reliable,
          and designed for the realities of schools.
        </p>
      </section>

      <section className="mt-12 grid gap-8 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Who we serve</h3>
          <ul className="mt-3 list-disc pl-5 text-slate-700 space-y-1">
            <li>BCBAs and behavior specialists working in schools</li>
            <li>Teachers and related service providers</li>
            <li>Program leaders and district teams</li>
            <li>Graduate students preparing for the BCBA exam</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">How we work</h3>
          <ul className="mt-3 list-disc pl-5 text-slate-700 space-y-1">
            <li>Evidence‑based, humane, and context‑sensitive</li>
            <li>Systems‑first: assessment → planning → fluency → generalization</li>
            <li>Data you can actually use during the school day</li>
            <li>Implementation support that fits busy teams</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Get involved</h3>
          <p className="mt-2 text-slate-700">
            Join the community, try the study tools, and get updates with practical, field‑tested resources.
          </p>
          <div className="mt-4 flex flex-col gap-3">
            <Link href="https://community.behaviorschool.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">
              Join the Community
            </Link>
            <Link href="/subscribe" className="inline-flex items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-slate-900 hover:bg-slate-50">
              Subscribe for updates
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-12 prose prose-slate max-w-none">
        <h2>Why we exist</h2>
        <p>If you work in schools, you may recognize these challenges:</p>
        <ul>
          <li>High‑stakes problem behavior without a clear, shared plan</li>
          <li>Implementation barriers and inconsistent fidelity</li>
          <li>Exhaustion, competing priorities, and staff turnover</li>
        </ul>
        <p>
          Most teams weren’t given a predictable, school‑ready system for behavior change. We’re changing that—one
          practical tool at a time.
        </p>
      </section>

      <section className="mt-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm text-center">
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Stay in the loop</h3>
          <p className="text-slate-700 mb-4">Actionable resources, new tools, and community events—straight to your inbox.</p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/subscribe"
              className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-5 py-2.5 text-white hover:bg-emerald-700"
            >
              Subscribe
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-md border border-slate-300 px-5 py-2.5 text-slate-900 hover:bg-slate-50"
            >
              Explore Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


