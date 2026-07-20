import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { ArrowRight, CalendarDays, CheckCircle2, ShieldCheck, UserRound } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export type SeoArticleSection = {
  heading: string;
  body: string;
  bullets?: string[];
};

export type SeoArticleFaq = {
  question: string;
  answer: string;
};

export type SeoArticleLink = {
  label: string;
  href: string;
};

type SeoArticlePageProps = {
  title: string;
  description: string;
  eyebrow: string;
  breadcrumbLabel: string;
  sections: SeoArticleSection[];
  faqs: SeoArticleFaq[];
  primaryCta: SeoArticleLink;
  secondaryLinks: SeoArticleLink[];
  canonical: string;
  heroVisual?: boolean;
  dateModified?: string;
  children?: ReactNode;
};

export function SeoArticlePage({
  title,
  description,
  eyebrow,
  breadcrumbLabel,
  sections,
  faqs,
  primaryCta,
  secondaryLinks,
  canonical,
  heroVisual = false,
  dateModified = "2026-06-29",
  children,
}: SeoArticlePageProps) {
  const breadcrumbItems = [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://behaviorschool.com" },
    { "@type": "ListItem", position: 2, name: breadcrumbLabel, item: canonical },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: title,
        description,
        url: canonical,
        dateModified,
        author: {
          "@type": "Person",
          name: "Rob Spain",
          jobTitle: "BCBA",
          url: "https://behaviorschool.com/about",
          affiliation: {
            "@type": "Organization",
            name: "Behavior School",
            url: "https://behaviorschool.com",
          },
        },
        reviewedBy: {
          "@type": "Person",
          name: "Rob Spain",
          jobTitle: "BCBA",
          url: "https://behaviorschool.com/about",
        },
        publisher: {
          "@type": "Organization",
          name: "Behavior School",
          url: "https://behaviorschool.com",
        },
        mainEntityOfPage: canonical,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbItems,
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section className="container mx-auto px-6 pt-20 pb-4">
        <Breadcrumbs items={[{ label: breadcrumbLabel }]} />
      </section>

      <section className="container mx-auto px-6 pb-14">
        <div className={heroVisual ? "grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_460px]" : "max-w-4xl"}>
          <div className="max-w-4xl">
            <div className="mb-5 inline-flex rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700">
              {eyebrow}
            </div>
            <h1 className="text-4xl font-bold leading-tight text-slate-950 md:text-6xl">
              {title}
            </h1>
            <p className="mt-6 max-w-3xl text-xl leading-relaxed text-slate-600">
              {description}
            </p>
            <div className="mt-6 grid gap-3 text-sm text-slate-700 sm:grid-cols-3">
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                <UserRound className="h-4 w-4 text-emerald-700" />
                <span>Reviewed by Rob Spain, BCBA</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                <CalendarDays className="h-4 w-4 text-emerald-700" />
                <span>Updated {dateModified}</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                <ShieldCheck className="h-4 w-4 text-emerald-700" />
                <span>Built for applied ABA decisions</span>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={primaryCta.href}
                className="inline-flex items-center rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white transition-colors hover:bg-emerald-800"
              >
                {primaryCta.label}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              {secondaryLinks.slice(0, 2).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 transition-colors hover:border-emerald-300 hover:text-emerald-800"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {heroVisual ? (
            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-emerald-200/35 blur-2xl" />
              <div
                className="relative overflow-hidden rounded-3xl border border-slate-200 bg-[#f8faf8] p-4 shadow-2xl"
                aria-label="Behavior Study Tools product preview showing readiness, weak areas, and practice rationales"
              >
                <div className="rounded-2xl border border-emerald-900/10 bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Image
                        src="/Logos/Logo.webp"
                        alt="Behavior School"
                        width={96}
                        height={96}
                        className="h-9 w-9 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-sm font-bold text-slate-950">Behavior Study Tools</p>
                        <p className="text-xs text-slate-500">by Behavior School</p>
                      </div>
                    </div>
                    <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                      6th Edition
                    </div>
                  </div>

                  <div className="grid gap-4 p-4 sm:grid-cols-[0.9fr_1.1fr]">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        Readiness score
                      </p>
                      <div className="mt-4 flex items-center gap-4">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full border-[10px] border-emerald-700 bg-white">
                          <div className="text-center">
                            <p className="text-3xl font-black text-emerald-900">78</p>
                            <p className="text-[10px] font-semibold text-slate-500">of 100</p>
                          </div>
                        </div>
                        <div>
                          <p className="font-bold text-slate-950">Near ready</p>
                          <p className="mt-1 text-sm leading-relaxed text-slate-600">
                            Keep building weak areas before the next full mock.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                          Domain review
                        </p>
                        <p className="text-xs font-bold text-emerald-800">Next study block</p>
                      </div>
                      <div className="mt-4 space-y-3">
                        {[
                          ["Measurement", "42%"],
                          ["Experimental Design", "48%"],
                          ["Behavior Assessment", "60%"],
                          ["Ethics", "74%"],
                        ].map(([label, value]) => (
                          <div key={label}>
                            <div className="flex justify-between text-xs font-semibold text-slate-700">
                              <span>{label}</span>
                              <span>{value}</span>
                            </div>
                            <div className="mt-1 h-2 rounded-full bg-slate-100">
                              <div
                                className="h-2 rounded-full bg-emerald-700"
                                style={{ width: value }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mx-4 mb-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 md:pr-40">
                    <p className="text-xs font-bold uppercase tracking-wide text-emerald-800">
                      Practice rationale
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-950">
                      Which next step best addresses the weak area?
                    </p>
                    <div className="mt-3 rounded-xl border border-emerald-200 bg-white p-3 text-sm text-slate-700">
                      Review the missed domain, answer new practice questions, then retest with a timed set.
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-5 right-5 hidden w-36 rounded-[1.6rem] border border-slate-200 bg-white p-2 shadow-2xl md:block">
                  <div className="rounded-[1.2rem] bg-slate-950 px-3 py-4 text-white">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-200">
                      Weak areas
                    </p>
                    <div className="mt-3 space-y-2">
                      {["Design", "Measurement", "Extinction"].map((label) => (
                        <div key={label} className="rounded-lg bg-white/10 p-2">
                          <p className="text-[11px] font-semibold">{label}</p>
                          <div className="mt-1 h-1.5 rounded-full bg-white/15">
                            <div className="h-1.5 w-1/2 rounded-full bg-[#f7c94f]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative mx-5 -mt-8 flex items-center gap-4 rounded-2xl border border-emerald-100 bg-white p-4 shadow-lg">
                <Image
                  src="/profile-Rob.webp"
                  alt="Rob Spain, BCBA and founder of BehaviorSchool"
                  width={96}
                  height={96}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-bold text-slate-950">Built by a practicing BCBA</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    Exam prep, rationales, and study paths designed for real behavior analysts.
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="container mx-auto grid max-w-7xl gap-8 px-6 pb-16 lg:grid-cols-[1fr_320px]">
        <article className="space-y-6">
          {sections.map((section) => (
            <section
              key={section.heading}
              className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-slate-950">{section.heading}</h2>
              <p className="mt-3 leading-relaxed text-slate-700">{section.body}</p>
              {section.bullets ? (
                <ul className="mt-5 space-y-3">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3 text-slate-700">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-emerald-600" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          {children}

          <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-7">
            <h2 className="text-2xl font-bold text-emerald-950">Frequently asked questions</h2>
            <div className="mt-5 space-y-5">
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <h3 className="font-semibold text-emerald-950">{faq.question}</h3>
                  <p className="mt-1 leading-relaxed text-emerald-900">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </article>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-emerald-900">Why this page exists</h2>
            <p className="mt-2 text-sm leading-relaxed text-emerald-950">
              This resource is written for behavior analysts who need a useful next action, not another
              generic definition page. The examples, rationales, and links point you toward practice,
              review, or documentation decisions.
            </p>
            <Link
              href="/about"
              className="mt-3 inline-flex text-sm font-semibold text-emerald-800 hover:text-emerald-950"
            >
              About the BCBA reviewer
            </Link>
          </div>

          <h2 className="text-lg font-bold text-slate-950">Related resources</h2>
          <div className="mt-4 space-y-3">
            {secondaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}
