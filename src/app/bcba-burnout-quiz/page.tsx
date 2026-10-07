import type { Metadata } from "next";
import Link from "next/link";
import { CtaClickTracker } from "@/components/content/ProgramCta";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { BCBABurnoutQuiz } from "./BCBABurnoutQuiz";
import { BurnoutGuide } from "./guide";
import { burnoutFaqs } from "./quiz-data";

const CANONICAL = "https://behaviorschool.com/bcba-burnout-quiz";
const TITLE = "BCBA Burnout Quiz for School BCBAs | Behavior School";
const DESCRIPTION =
  "Free 12-question burnout quiz for school BCBAs. Check caseload, support and stress signals, see your score band, and get clear next steps.";

const linkClass =
  "inline-flex min-h-11 items-center font-semibold text-[#1f4d3f] underline underline-offset-4 hover:text-[#123628] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3f]";

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "bcba burnout quiz",
    "school BCBA burnout",
    "bcba burnout",
    "behavior analyst burnout",
    "bcba stress assessment",
    "burnout risk quiz",
    "why are bcbas leaving the field",
    "bcba work life balance",
  ],
  canonical: CANONICAL,
});

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": CANONICAL,
      url: CANONICAL,
      name: "BCBA Burnout Risk Quiz for School BCBAs",
      description: DESCRIPTION,
      inLanguage: "en-US",
      isPartOf: {
        "@type": "WebSite",
        name: "Behavior School",
        url: "https://behaviorschool.com",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://behaviorschool.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "BCBA Burnout Quiz",
          item: CANONICAL,
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: burnoutFaqs.map((faq) => ({
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

export default function BCBABurnoutQuizPage() {
  return (
    <div className="bg-[#fbfaf6] text-[#171f1d]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <CtaClickTracker />
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-8 sm:px-6">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-base">
            <li>
              <Link href="/" className={linkClass}>
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-[#365548]">
              /
            </li>
            <li>
              <span className="inline-flex min-h-11 items-center font-semibold text-[#171f1d]" aria-current="page">
                BCBA Burnout Quiz
              </span>
            </li>
          </ol>
        </nav>

        <BCBABurnoutQuiz
          lead={
            <>
              <p className="inline-flex min-h-11 items-center rounded-[8px] border border-[#d9cdb8] bg-[#f4efe5] px-4 text-base font-semibold text-[#171f1d]">
                Free, 2 minutes, 12 questions
              </p>
              <h1 className="mt-6 text-4xl font-bold leading-tight text-[#171f1d] sm:text-5xl">
                BCBA Burnout Risk Quiz for School BCBAs
              </h1>
              <p className="mt-4 text-lg leading-8 text-[#365548]">
                You may cover several buildings. You may be the only BCBA anyone in the district can call. Some nights you finish the work at the kitchen table. This quiz helps you see how much of that strain is showing up in your energy, your week and your body.
              </p>
              <p className="mt-4 text-lg leading-8 text-[#365548]">
                Answer 12 quick questions about your work experience. Get a simple burnout risk score and a few next-step options.
              </p>
            </>
          }
          note={
            <>
              <p>This is a self-assessment, not a diagnosis or clinical evaluation.</p>
              <p>
                When you finish, you see your score. To see your risk band and next steps on screen, you enter your email. If you would rather not, add up your points yourself with the{" "}
                <a href="#how-the-score-works" className={linkClass}>
                  scoring table below
                </a>
                .
              </p>
              <p>
                This quiz is part of our guide to{" "}
                <Link href="/school-bcba" className={linkClass}>
                  BCBA in schools
                </Link>
                , written for behavior analysts who work in public schools.
              </p>
            </>
          }
        />
        <BurnoutGuide />
      </div>
    </div>
  );
}
