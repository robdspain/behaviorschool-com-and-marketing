import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free BCBA Exam Questions | 10 Practice Questions with Detailed Answers",
  description: "Free BCBA exam questions with detailed explanations. Practice 10 challenging questions aligned to the BACB Task List with answer rationales. Perfect for BCBA exam prep.",
  keywords: [
    "free bcba practice exam",
    "bcba mock exam",
    "bcba exam practice tests",
    "practice bcba exam questions",
    "bcba exam questions free",
    "BACB task list",
  ],
  alternates: { canonical: "/free-bcba-practice-exam" },
  openGraph: {
    type: "article",
    title: "Free BCBA Practice Exam (10 Hard Questions)",
    description: "10 challenging BCBA practice questions with answers and explanations.",
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
    title: "Free BCBA Practice Exam (10 Hard Questions)",
    description: "Practice 10 challenging BCBA questions with detailed explanations.",
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

