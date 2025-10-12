import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free BCBA Practice Exam → Interactive 10-Question Quiz",
  description: "Free BCBA practice exam: interactive 10-question quiz with instant feedback and detailed explanations. No signup required. Start practicing now.",
  keywords: [
    "free bcba practice exam",
    "bcba mock exam",
    "bcba exam practice tests",
    "practice bcba exam questions",
    "bcba exam questions free",
    "BACB task list",
  ],
  alternates: { canonical: "https://behaviorschool.com/bcba-exam-prep" },
  openGraph: {
    type: "article",
    title: "Free BCBA Practice Exam → Interactive Quiz",
    description: "Interactive 10-question BCBA practice quiz with instant feedback. No signup required.",
    url: "/free-bcba-practice-exam",
    images: [
      {
        url: "/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Free BCBA Practice Exam",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free BCBA Practice Exam → Interactive Quiz",
    description: "Interactive BCBA practice quiz: 10 questions, instant feedback, detailed explanations.",
    images: ["/optimized/og-image.webp"],
  },
  robots: { index: true, follow: true },
};

export default function FreeBCBAPracticeExamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

