import type { Metadata } from "next";
import { BCBAReadinessQuiz } from "./BCBAReadinessQuiz";

export const metadata: Metadata = {
  title: "BCBA Exam Readiness Quiz | Behavior School",
  description:
    "Take our free 2-minute BCBA Exam Readiness Quiz. Find out if you're ready for the certification exam with a personalized score and study recommendations!",
  keywords: [
    "BCBA exam readiness",
    "BCBA exam prep quiz",
    "BCBA certification readiness",
    "am I ready for the BCBA exam",
    "BCBA study assessment",
    "BCBA practice exam readiness",
    "BCBA exam confidence",
    "behavior analyst exam prep",
  ],
  openGraph: {
    title: "BCBA Exam Readiness Quiz — How Prepared Are You?",
    description:
      "Free 2-minute self-assessment. Find out your BCBA exam readiness score and get personalized study recommendations.",
    type: "website",
    url: "https://behaviorschool.com/bcba-readiness-quiz",
  },
  twitter: {
    card: "summary_large_image",
    title: "BCBA Exam Readiness Quiz — How Prepared Are You?",
    description:
      "Free 2-minute self-assessment. Find out your BCBA exam readiness score and get personalized study recommendations.",
  },
};

export default function BCBAReadinessQuizPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "How do I know if I'm ready for the BCBA exam?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Take our free BCBA Exam Readiness Quiz to assess your study habits, content knowledge confidence, and preparation level. You'll receive a personalized readiness score from 0-100 with tailored study recommendations.",
                },
              },
              {
                "@type": "Question",
                name: "What does the BCBA Readiness Quiz measure?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "The quiz assesses your study habits, time investment, familiarity with BCBA task list areas (ethics, measurement, behavior change, etc.), practice exam experience, and overall confidence level. It's a self-assessment, not a practice exam.",
                },
              },
              {
                "@type": "Question",
                name: "How long does the BCBA Readiness Quiz take?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "The quiz takes approximately 2 minutes to complete. It consists of 10 quick questions about your study habits and confidence levels.",
                },
              },
              {
                "@type": "Question",
                name: "Is the BCBA Readiness Quiz free?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes! The quiz is completely free. After completing it, you'll receive your readiness score and personalized study recommendations at no cost.",
                },
              },
            ],
          }),
        }}
      />
      <BCBAReadinessQuiz />
    </>
  );
}
