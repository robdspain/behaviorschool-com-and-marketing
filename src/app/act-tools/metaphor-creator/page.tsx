import type { Metadata } from "next";
import MetaphorCreator from "@/components/act-tools/MetaphorCreator";
import { ShareButtons } from "@/components/ui/share-buttons";

const baseUrl = "https://behaviorschool.com";
const pageUrl = `${baseUrl}/act-tools/metaphor-creator`;

const faqItems = [
  {
    question: "Who should use the ACT Metaphor Creator?",
    answer:
      "School-based BCBAs, counselors, and teachers who want quick, age-appropriate ACT metaphors for classroom or counseling sessions.",
  },
  {
    question: "Can I print or save the metaphors?",
    answer:
      "Yes. The tool includes print-ready prompts and reflection questions so you can save or share with students.",
  },
  {
    question: "Does it support different ACT processes?",
    answer:
      "Yes. You can choose defusion, acceptance, present moment, or values to match your lesson goal.",
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
      name: "ACT Metaphor Creator",
      description:
        "A classroom-friendly ACT metaphor creator with prompts, reflection questions, and adaptations by grade level and ACT process.",
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
  title: "ACT Metaphor Creator | Classroom-Friendly ACT Metaphors",
  description:
    "Create ACT metaphors for students by grade level, process, and interests. Printable prompts, reflection questions, and adaptations.",
  keywords: [
    "ACT metaphors",
    "metaphor creator",
    "defusion activities",
    "acceptance activities",
    "school counseling tools",
    "values lessons",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "ACT Metaphor Creator | Classroom-Friendly ACT Metaphors",
    description:
      "Generate ACT metaphors with student-friendly prompts, reflection questions, and adaptations by grade level.",
    url: pageUrl,
    images: [
      {
        url: `${baseUrl}/og-image.webp`,
        width: 1200,
        height: 630,
        alt: "ACT Metaphor Creator by Behavior School",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ACT Metaphor Creator | Classroom-Friendly ACT Metaphors",
    description:
      "Generate ACT metaphors with student-friendly prompts, reflection questions, and adaptations by grade level.",
    images: [`${baseUrl}/og-image.webp`],
  },
};

export default function MetaphorCreatorPage() {
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
                Build student-friendly ACT metaphors in minutes
              </h1>
              <p className="text-base text-slate-600">
                Create a metaphor, reflection prompts, and adaptations by grade level and ACT process so students can connect with defusion,
                acceptance, present-moment, or values lessons.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Grade-level adaptations",
                "Printable prompts and reflection",
                "Choose ACT process + interest",
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
              <p>Select a student profile, choose an ACT process, pick an interest theme, and customize the metaphor output.</p>
            </div>
          </div>

          <MetaphorCreator />
        </section>

        <section className="mt-14 grid gap-8 lg:grid-cols-[1.2fr_1fr]" aria-labelledby="metaphor-creator-what">
          <div className="space-y-4">
            <h2 id="metaphor-creator-what" className="text-2xl font-semibold text-slate-900">
              What is the ACT Metaphor Creator?
            </h2>
            <p className="text-base text-slate-600">
              The ACT Metaphor Creator is a free tool that helps educators translate Acceptance and Commitment Therapy concepts into
              easy-to-understand metaphors. It generates a student-friendly setup, step-by-step prompts, reflection questions, and age-appropriate
              adaptations you can use in lessons or counseling sessions.
            </p>
            <p className="text-base text-slate-600">
              Use it whenever you need a quick, natural-language explanation of an ACT process that feels relatable to students.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-6">
            <h3 className="text-lg font-semibold text-emerald-900">Best-fit use cases</h3>
            <ul className="mt-3 space-y-2 text-sm text-emerald-900/90">
              <li>Mini-lessons for defusion or acceptance.</li>
              <li>Tier 2 counseling groups or SEL blocks.</li>
              <li>Printable handouts for students or families.</li>
            </ul>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="metaphor-creator-faq">
          <h2 id="metaphor-creator-faq" className="text-2xl font-semibold text-slate-900">
            ACT Metaphor Creator FAQ
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

        <section className="mt-12" aria-labelledby="metaphor-creator-share">
          <h2 id="metaphor-creator-share" className="text-2xl font-semibold text-slate-900">
            Share this tool
          </h2>
          <ShareButtons title="ACT Metaphor Creator" url={pageUrl} className="mt-4" />
        </section>
      </article>
    </main>
  );
}
