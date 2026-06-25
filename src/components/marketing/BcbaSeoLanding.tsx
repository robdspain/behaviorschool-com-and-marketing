import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookOpenCheck,
  ClipboardCheck,
  Clock,
  FileText,
  ShieldCheck,
  Users,
} from "lucide-react";
import { behaviorStudyToolsAppHref } from "@/lib/behavior-study-tools/links";
import { BstMarketingTracker } from "@/components/marketing/BstMarketingTracker";

type Feature = {
  title: string;
  body: string;
};

type RelatedLink = {
  title: string;
  body: string;
  href: string;
};

type BcbaSeoLandingProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: string;
  primaryHref?: string;
  imageAlt: string;
  features: Feature[];
  sections: Feature[];
  faqs: Feature[];
  relatedLinks?: RelatedLink[];
};

const DEFAULT_APP_HREF = behaviorStudyToolsAppHref("/onboarding/bcba", {
  intent: "seo_page_start",
  utm_content: "seo_landing_primary_cta",
});

const trustSignals = [
  { icon: BadgeCheck, label: "6th Edition aligned" },
  { icon: ShieldCheck, label: "Review labels on questions" },
  { icon: BarChart3, label: "Readiness score" },
  { icon: Users, label: "Supervisor report export" },
];

export function BcbaSeoLanding({
  eyebrow,
  title,
  description,
  primaryCta,
  primaryHref = DEFAULT_APP_HREF,
  imageAlt,
  features,
  sections,
  faqs,
  relatedLinks = [],
}: BcbaSeoLandingProps) {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <BstMarketingTracker />
      <section className="relative overflow-hidden bg-[#f7f3ee]">
        <div className="absolute inset-x-0 top-0 h-2 bg-[#1f4d3f]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-32">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#1f4d3f]">
              {eyebrow}
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              {description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={primaryHref}
                data-bst-cta="true"
                data-bst-location="seo_hero_primary"
                data-bst-intent="start_practice"
                data-bst-study-path="bcba"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1f4d3f] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#173a2f]"
              >
                {primaryCta}
                <ArrowRight size={18} />
              </Link>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {trustSignals.map((signal) => {
                const Icon = signal.icon;
                return (
                  <div key={signal.label} className="flex items-center gap-3 rounded-md border border-[#1f4d3f]/15 bg-white/80 px-4 py-3 text-sm font-bold text-[#1f4d3f]">
                    <Icon size={18} />
                    {signal.label}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-5 rounded-2xl bg-[#1f4d3f]/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-xl border border-[#1f4d3f]/15 bg-white shadow-2xl">
              <Image
                src="/BehaviorStudyTools/Hero-BST-Home.webp"
                alt={imageAlt}
                width={1200}
                height={840}
                className="h-auto w-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <BookOpenCheck className="mb-4 text-[#1f4d3f]" size={28} />
              <h2 className="text-xl font-bold text-slate-950">{feature.title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{feature.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#f9f7f2] py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#1f4d3f]">Why it matters</p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Better prep is a workflow, not a pile of questions.
            </h2>
            <p className="mt-5 leading-8 text-slate-600">
              BehaviorSchool connects practice, review, readiness, timing, and reporting so candidates can make better study decisions after every session.
            </p>
          </div>
          <div className="grid gap-4">
            {sections.map((section, index) => {
              const icons = [ClipboardCheck, Clock, BarChart3, FileText];
              const Icon = icons[index % icons.length];
              return (
                <article key={section.title} className="rounded-lg border border-slate-200 bg-white p-6">
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#eef6f1] text-[#1f4d3f]">
                      <Icon size={22} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-950">{section.title}</h3>
                      <p className="mt-2 leading-7 text-slate-600">{section.body}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {relatedLinks.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#1f4d3f]">Related BCBA exam resources</p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Practice questions, mock exams, and sample BCBA exam questions
            </h2>
            <p className="mt-5 leading-8 text-slate-600">
              Use these public resources when you need a faster path from a search result to the right BCBA exam practice format.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {relatedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:border-[#1f4d3f]/35 hover:shadow-md"
              >
                <h3 className="text-lg font-bold text-slate-950">{link.title}</h3>
                <p className="mt-2 leading-7 text-slate-600">{link.body}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#1f4d3f]">
                  Open resource
                  <ArrowRight size={16} />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
          Common questions
        </h2>
        <div className="mt-8 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
          {faqs.map((faq) => (
            <div key={faq.title} className="p-6">
              <h3 className="font-bold text-slate-950">{faq.title}</h3>
              <p className="mt-2 leading-7 text-slate-600">{faq.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 rounded-lg bg-[#1f4d3f] p-8 text-white">
          <h2 className="text-2xl font-extrabold">Ready to see where you stand?</h2>
          <p className="mt-3 max-w-2xl text-emerald-50">
            Start in the app, answer a focused set of questions, and use the results to decide your next study block.
          </p>
          <Link
            href={primaryHref}
            data-bst-cta="true"
            data-bst-location="seo_final_cta"
            data-bst-intent="start_practice"
            data-bst-study-path="bcba"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-[#e4b63d] px-6 py-3 text-sm font-bold text-[#143d32] transition hover:bg-[#d8aa30]"
          >
            {primaryCta}
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
