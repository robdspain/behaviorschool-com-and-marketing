import type { Metadata } from "next";
import { BCBABurnoutQuiz } from "./BCBABurnoutQuiz";

export const metadata: Metadata = {
  title: "BCBA Burnout Risk Quiz | Behavior School",
  description:
    "Take our free 2-minute BCBA Burnout Risk Quiz. Check your stress level, get your burnout score, and receive personalized recommendations. Start the quiz now!",
  keywords: [
    "BCBA burnout quiz",
    "BCBA stress assessment",
    "school-based BCBA burnout",
    "burnout risk quiz",
    "behavior analyst burnout",
    "BCBA wellness",
  ],
  openGraph: {
    title: "BCBA Burnout Risk Quiz — Check Your Stress Level",
    description:
      "Free 2-minute self-assessment. Get a simple burnout risk score and next-step options.",
    type: "website",
    url: "https://behaviorschool.com/bcba-burnout-quiz",
  },
  twitter: {
    card: "summary_large_image",
    title: "BCBA Burnout Risk Quiz — Check Your Stress Level",
    description:
      "Free 2-minute self-assessment. Get a simple burnout risk score and next-step options.",
  },
};

export default function BCBABurnoutQuizPage() {
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
                name: "How do I know if I'm burning out as a BCBA?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Take the BCBA Burnout Risk Quiz to check your stress signals and get a simple risk score with next-step recommendations.",
                },
              },
              {
                "@type": "Question",
                name: "What does the BCBA Burnout Risk Quiz measure?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "The quiz is a brief self-assessment of stress, workload strain, and support levels. It is not a diagnosis or clinical evaluation.",
                },
              },
              {
                "@type": "Question",
                name: "How long does the Burnout Risk Quiz take?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "About 2 minutes. It includes 12 quick questions with a simple frequency scale.",
                },
              },
              {
                "@type": "Question",
                name: "Is the Burnout Risk Quiz free?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. The quiz is completely free and provides a score and next-step options.",
                },
              },
            ],
          }),
        }}
      />
      <BCBABurnoutQuiz />
    </>
  );
}
