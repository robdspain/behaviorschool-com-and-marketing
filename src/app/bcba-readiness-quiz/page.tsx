import type { Metadata } from "next";
import { BCBAReadinessQuiz } from "./BCBAReadinessQuiz";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Free BCBA Readiness Check + Quiz | Behavior School",
  description:
    "Take a free BCBA readiness check and 2-minute quiz. Find weak areas, get a personalized score, and choose your next study step.",
  keywords: [
    "free BCBA readiness check",
    "BCBA exam readiness",
    "BCBA exam prep quiz",
    "BCBA certification readiness",
    "am I ready for the BCBA exam",
    "BCBA study assessment",
    "BCBA exam weak areas",
    "BCBA practice exam readiness",
    "BCBA exam confidence",
    "behavior analyst exam prep",
  ],
  canonical: "https://behaviorschool.com/bcba-readiness-quiz",
});

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
                  text: "Take our free BCBA readiness quiz to assess your study habits, content knowledge confidence, weak areas, and preparation level. You'll receive a personalized readiness score from 0-100 with tailored study recommendations.",
                },
              },
              {
                "@type": "Question",
                name: "Is this a free BCBA readiness check?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. The quiz is a free self-assessment that helps candidates identify readiness signals and likely weak areas before choosing practice questions, mock exams, or a study schedule.",
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
