import type { Metadata } from "next";
import ValuesCardSort from "@/components/act-tools/ValuesCardSort";
import { ShareButtons } from "@/components/ui/share-buttons";

const baseUrl = "https://behaviorschool.com";
const pageUrl = `${baseUrl}/act-tools/values-sort`;

const faqItems = [
  {
    question: "What is a values card sort?",
    answer:
      "A values card sort helps students identify the values that matter most to them by sorting cards into priority groups.",
  },
  {
    question: "Who can use this values sort tool?",
    answer:
      "It is designed for school-based BCBAs, counselors, and teachers supporting student goal setting and values exploration.",
  },
  {
    question: "Can I print or share the results?",
    answer:
      "Yes. The tool generates a summary you can copy, print, or save for meetings and goal-setting conversations.",
  },
  {
    question: "Is it free to use?",
    answer:
      "Yes. No registration is required.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "ACT Values Sort",
      description:
        "An interactive ACT values card sort that helps students identify top values and create a summary for goal setting.",
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      url: pageUrl,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      provider: {
        "@type": "Organization",
        name: "Behavior School",
        url: baseUrl,
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ],
};

export const metadata: Metadata = {
  title: "ACT Values Sort | Values Card Sort for Students",
  description:
    "Interactive ACT values card sort to help students identify top values, summarize results, and print or share outcomes.",
  keywords: [
    "values card sort",
    "ACT values",
    "values activity",
    "school counseling tools",
    "student goal setting",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "ACT Values Sort | Values Card Sort for Students",
    description:
      "Help students identify their top values with an interactive card sort and printable summary.",
    url: pageUrl,
    images: [
      {
        url: `${baseUrl}/og-image.webp`,
        width: 1200,
        height: 630,
        alt: "ACT Values Sort by Behavior School",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ACT Values Sort | Values Card Sort for Students",
    description:
      "Help students identify their top values with an interactive card sort and printable summary.",
    images: [`${baseUrl}/og-image.webp`],
  },
};

export default function ValuesSortPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <article className="container mx-auto px-6 pb-16 pt-20">
        <section className="grid gap-8 lg:grid-cols-[1.05fr_1.2fr] lg:items-start">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
              ACT Tool
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                Help students identify the values that guide their goals
              </h1>
              <p className="text-base text-slate-600">
                This interactive values card sort helps students choose what matters most, then creates a summary you can use for goal setting,
                counseling, or IEP planning.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Drag-and-drop values cards",
                "Clear summary of top values",
                "Print or copy results",
                "No sign-up required",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                  <span className="mt-0.5 text-emerald-600">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">How it works</p>
              <p>Sort each card into a pile, pick the top values, then save or print the summary for next steps.</p>
            </div>
          </div>

          <ValuesCardSort />
        </section>

        <section className="mt-14 grid gap-8 lg:grid-cols-[1.2fr_1fr]" aria-labelledby="values-sort-what">
          <div className="space-y-4">
            <h2 id="values-sort-what" className="text-2xl font-semibold text-slate-900">
              What is the ACT Values Sort?
            </h2>
            <p className="text-base text-slate-600">
              The ACT Values Sort is a free, interactive card sort that helps students clarify their top values. It guides them through sorting
              values into priority groups and produces a natural-language summary you can use in meetings, counseling sessions, or goal planning.
            </p>
            <p className="text-base text-slate-600">
              Use it to open a values conversation and connect behavior goals to what matters most to the student.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-6">
            <h3 className="text-lg font-semibold text-emerald-900">Best-fit use cases</h3>
            <ul className="mt-3 space-y-2 text-sm text-emerald-900/90">
              <li>Values exploration for IEP or counseling goals.</li>
              <li>Small-group SEL and advisory activities.</li>
              <li>Progress monitoring conversations about motivation.</li>
            </ul>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="values-sort-faq">
          <h2 id="values-sort-faq" className="text-2xl font-semibold text-slate-900">
            ACT Values Sort FAQ
          </h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {faqItems.map((item) => (
              <div key={item.question} className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="text-base font-semibold text-slate-900">{item.question}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12" aria-labelledby="values-sort-share">
          <h2 id="values-sort-share" className="text-2xl font-semibold text-slate-900">
            Share this tool
          </h2>
          <ShareButtons title="ACT Values Sort" url={pageUrl} className="mt-4" />
        </section>
      </article>
    </main>
  );
}
