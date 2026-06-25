import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
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
  children,
}: SeoArticlePageProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: title,
        description,
        url: canonical,
        author: {
          "@type": "Organization",
          name: "Behavior School",
          url: "https://behaviorschool.com",
        },
        publisher: {
          "@type": "Organization",
          name: "Behavior School",
          url: "https://behaviorschool.com",
        },
        mainEntityOfPage: canonical,
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
