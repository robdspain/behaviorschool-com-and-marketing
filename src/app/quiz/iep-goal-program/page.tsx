import type { Metadata } from "next";
import { IepGoalProgramQuiz } from "./IepGoalProgramQuiz";
import { FAQAccordion } from "@/components/ui/faq-accordion";

const title = "Is your goal ready to become a plan? | School BCBA quiz";
const description =
  "Free 3-minute IEP goal quality check for school behavior teams. Score observable behavior, measurement, supports, and classroom runnability — then get a personalized ready/review checklist.";
const canonical = "https://behaviorschool.com/quiz/iep-goal-program";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title,
    description,
    url: canonical,
    siteName: "Behavior School",
    type: "website",
    images: [
      {
        url: "/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Behavior School IEP goal readiness quiz",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/optimized/og-image.webp"],
  },
  keywords: [
    "IEP goal quality check",
    "school BCBA goal writing",
    "IEP behavior goal checklist",
    "measurable IEP goals",
    "IEP goal program",
    "behavior goal writer",
    "school behavior team",
  ],
};

const faqItems = [
  {
    question: "What does this quiz check?",
    answer:
      "Nine quick questions mapped to the same goal-quality checks in our free Behavior Goal Writer: observable behavior, context, measurement method, matching baseline/mastery units, supports, classroom runnability, and optional generalization or maintenance.",
  },
  {
    question: "Do I need to enter my email to see results?",
    answer:
      "No. You see your personalized ready/review checklist and a practical tip immediately after the last question. Email is optional if you want the checklist sent to your inbox with a link to the free Goal Writer at /iep-goals.",
  },
  {
    question: "What is Priority Access?",
    answer:
      "An optional checkbox to get first notice when the next School BCBA Transformation Program cohort opens. It is unchecked by default. Newsletter enrollment only happens if you opt in.",
  },
  {
    question: "Who is this for?",
    answer:
      "School BCBAs, behavior specialists, and school psychologists who write or review IEP behavior goals and want to know whether a goal is ready to become a classroom program.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function IepGoalProgramQuizPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <IepGoalProgramQuiz />
      <section className="border-t border-[#e6e0d4] bg-white px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-[#123628] sm:text-3xl">
            About this goal readiness check
          </h2>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-[#3d4a46]">
            <p>
              A strong IEP behavior goal names what to measure, where performance
              happens, and what supports are available — before you add BIP pages
              or coach staff. This quiz mirrors the quality checks in the{" "}
              <a
                href="/iep-goals"
                className="font-medium text-[#1F4D3F] underline-offset-2 hover:underline"
              >
                free Behavior Goal Writer
              </a>
              , so you can spot gaps in a goal you already wrote.
            </p>
            <p>
              The final runnability question asks whether a new person in the
              classroom could record data just by reading the goal. That is the
              difference between a goal on paper and a program your team can run
              without you in the room.
            </p>
          </div>
          <div className="mt-12">
            <h2 className="text-xl font-bold text-[#123628]">FAQ</h2>
            <div className="mt-4">
              <FAQAccordion items={faqItems} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
