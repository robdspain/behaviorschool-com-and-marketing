import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free BCBA Practice Exam Questions | BehaviorSchool",
  description:
    "20 free BCBA practice exam questions covering all 6th edition task list domains. Take our free BCBA mock exam with instant scoring, detailed explanations, and expert-written content. No signup required to start.",
  keywords: [
    "BCBA practice exam free",
    "BCBA mock exam",
    "BCBA test questions",
    "free BCBA practice questions",
    "BCBA exam prep free",
    "BCBA practice exam 2026",
    "BCBA 6th edition practice test",
    "BCBA exam questions and answers",
    "BCBA study questions free",
    "behavior analyst exam practice",
  ],
  alternates: { canonical: "https://behaviorschool.com/free-bcba-practice" },
  openGraph: {
    type: "article",
    title: "Free BCBA Practice Exam Questions | BehaviorSchool",
    description:
      "20 free BCBA practice questions with detailed explanations. Covers ethics, measurement, behavior change, experimental design & more.",
    url: "/free-bcba-practice",
    images: [
      {
        url: "/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Free BCBA Practice Exam Questions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free BCBA Practice Exam Questions | BehaviorSchool",
    description:
      "20 free BCBA practice questions covering all task list domains. Instant feedback & detailed explanations.",
    images: ["/optimized/og-image.webp"],
  },
  robots: { index: true, follow: true },
};

export default function FreeBCBAPracticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
