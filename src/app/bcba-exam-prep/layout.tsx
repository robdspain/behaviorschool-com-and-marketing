import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BCBA Exam Prep: Free Practice Questions, Mock Tests, and Study Guide",
  description: "Download a free BCBA exam study guide and try practice questions. Get updated pass rate stats and mock test strategies for school-based BCBAs.",
  keywords: "BCBA exam study guide free download, BCBA exam pass rates 2024, how to pass the BCBA exam, BCBA exam prep, BCBA practice test, BCBA study guide, behavior analyst certification, BCBA test prep, applied behavior analysis exam, school BCBA certification, free BCBA study materials, BCBA certification exam preparation",
  alternates: { canonical: "https://behaviorschool.com/bcba-exam-prep" },
  openGraph: {
    title: "BCBA Exam Prep: Free Practice Questions, Mock Tests, and Study Guide",
    description: "Free BCBA practice questions, mock test tips, and a downloadable study guide for school-based BCBAs.",
    url: "/bcba-exam-prep",
    type: "website",
    siteName: "Behavior School",
    images: [
      {
        url: "/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "BCBA Exam Prep - Behavior School",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BCBA Exam Prep: Free Practice Questions, Mock Tests, and Study Guide",
    description: "Try free BCBA practice questions and get a downloadable study guide plus mock test strategies.",
    images: ["/optimized/og-image.webp"],
  },
  robots: { index: true, follow: true },
};

export default function BCBAExamPrepLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
