import type { Metadata } from "next";
import UnifiedGoalWriterClient from "@/components/iep-goal-writer/UnifiedGoalWriterClient";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ShareButtons } from "@/components/ui/share-buttons";

const baseUrl = "https://behaviorschool.com";
const pageUrl = `${baseUrl}/iep-goal-writer`;

const faqItems = [
  {
    question: "What is the IEP Goal Writer?",
    answer:
      "The IEP Goal Writer is a free, all-in-one tool for special educators and BCBAs. You can browse over 120 pre-written, measurable behavior goals or use our AI-powered generator to create custom goals tailored to your student's needs. All goals follow the required Condition-Behavior-Criteria format.",
  },
  {
    question: "How do I write a measurable IEP behavior goal?",
    answer:
      "A measurable goal must be specific, observable, and quantifiable. It needs a clear 'Condition' (when/where the behavior occurs), 'Behavior' (what the student will do), and 'Criteria' (how well they must do it, for how long). Our tool ensures every goal meets these standards.",
  },
  {
    question: "Is the AI goal generator reliable?",
    answer:
      "Yes. Our AI generator is trained on thousands of high-quality, legally defensible IEP goals. It adheres strictly to the quality standards set by our extensive goal bank, ensuring every generated goal is measurable, specific, and appropriate for a school setting.",
  },
  {
    question: "Can I download the goals I create?",
    answer:
      "Absolutely. After you add 3 or more goals to your list (either from browsing or generating), you can download them as a formatted text file. Just enter your email to unlock the download.",
  },
  {
    question: "Who is the IEP Goal Writer for?",
    answer:
      "It's built for special education teachers, school-based BCBAs, school psychologists, and any professional involved in the IEP process. It's designed to save you time and help you write high-quality, effective behavior goals.",
  },
  {
    question: "Is this tool free to use?",
    answer:
      "Yes, the IEP Goal Writer is completely free. You can browse, generate, and save unlimited goals. The only requirement is providing an email to download your saved goal list as a PDF.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "IEP Goal Writer | Behavior School",
      description:
        "Free tool to browse over 120 pre-written IEP behavior goals or generate custom goals with AI. Create measurable, high-quality goals in the proper Condition-Behavior-Criteria format.",
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
  title: "Unified IEP Goal Writer | Browse & Generate Behavior Goals",
  description:
    "The ultimate free IEP Goal Writer. Browse 120+ pre-written goals or generate custom goals with our AI. Create measurable, effective behavior goals in minutes.",
  keywords: [
    "IEP goal writer",
    "IEP goal generator",
    "behavior IEP goals",
    "IEP goal bank",
    "SMART IEP goals",
    "measurable IEP goals",
    "special education",
    "BCBA tools",
    "AI IEP goals",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Unified IEP Goal Writer | Browse & Generate Behavior Goals",
    description:
      "The ultimate free tool for educators. Browse a huge goal bank or generate custom, AI-powered IEP behavior goals instantly.",
    url: pageUrl,
    images: [
      {
        url: `${baseUrl}/og-images/iep-goal-writer.webp`,
        width: 1200,
        height: 630,
        alt: "IEP Goal Writer by Behavior School",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Unified IEP Goal Writer | Browse & Generate Behavior Goals",
    description:
      "The ultimate free tool for educators. Browse a huge goal bank or generate custom, AI-powered IEP behavior goals instantly.",
    images: [`${baseUrl}/og-images/iep-goal-writer.webp`],
  },
};

export default function UnifiedIEPGoalWriterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <UnifiedGoalWriterClient />

      <article className="container mx-auto max-w-4xl px-6 py-16 sm:py-24 space-y-20">
        <section aria-labelledby="faq-title">
          <h2
            id="faq-title"
            className="text-center text-3xl font-bold text-slate-900 mb-10"
          >
            Frequently Asked Questions
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {faqItems.map((item) => (
              <div
                key={item.question}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="font-bold text-slate-900 mb-3">{item.question}</h3>
                <p className="text-slate-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          className="rounded-3xl bg-slate-900 px-8 py-12 text-center text-white"
          aria-labelledby="share-title"
        >
          <h2 id="share-title" className="text-2xl font-bold mb-4">
            Know an educator drowning in paperwork?
          </h2>
          <p className="text-slate-300 mb-8">
            Share this free tool and help them get their weekend back.
          </p>
          <div className="flex justify-center">
            <ShareButtons title="IEP Goal Writer" url={pageUrl} className="text-white" />
          </div>
        </section>
      </article>
    </>
  );
}
