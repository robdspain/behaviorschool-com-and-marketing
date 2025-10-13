import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quick BCBA Practice Test → Free 10-Question Exam | Behavior School",
  description: "Take a quick BCBA practice test free: 10 challenging questions with instant feedback. Our BCBA practice test includes detailed explanations aligned to the BACB task list. Start now.",
  keywords: [
    "bcba practice test",
    "quick bcba practice test",
    "free bcba practice test",
    "bcba practice exam",
    "bcba mock exam",
    "bcba exam practice tests",
    "practice bcba exam questions",
    "bcba exam questions free",
    "BACB task list",
  ],
  alternates: { canonical: "https://behaviorschool.com/bcba-exam-prep" },
  openGraph: {
    type: "article",
    title: "Quick BCBA Practice Test → Free 10-Question Exam",
    description: "Take a quick BCBA practice test with 10 challenging questions and instant feedback. No signup required.",
    url: "/free-bcba-practice-exam",
    images: [
      {
        url: "/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Quick BCBA Practice Test",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quick BCBA Practice Test → Free 10-Question Exam",
    description: "Take a quick BCBA practice test: 10 questions, instant feedback, detailed explanations.",
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

