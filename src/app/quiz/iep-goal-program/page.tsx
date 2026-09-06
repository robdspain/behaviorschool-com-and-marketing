import type { Metadata } from "next";
import { IepGoalProgramQuiz } from "./IepGoalProgramQuiz";

const title = "Is your IEP goal a program yet? | School BCBA quiz";
const description =
  "A 2-minute check for school behavior teams. See whether a new person in the classroom could record data for your last BIP goal just by reading it.";
const canonical = "https://behaviorschool.com/quiz/iep-goal-program";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical,
  },
  // Keep out of hardcoded sitemap until indexing is approved in Admin.
  // Page remains publicly reachable for lead gen and can be toggled later.
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
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
        alt: "Behavior School",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/optimized/og-image.webp"],
  },
};

export default function IepGoalProgramQuizPage() {
  return <IepGoalProgramQuiz />;
}
