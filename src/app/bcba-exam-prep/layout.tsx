import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BCBA Exam Prep & Study Guide for School-Based BCBAs | Behavior School",
  description: "Complete BCBA exam preparation for school-based behavior analysts. Practice questions, study materials, and proven strategies to pass your BCBA certification exam on the first try.",
  keywords: "BCBA exam prep, BCBA practice test, BCBA study guide, behavior analyst certification, BCBA test prep, applied behavior analysis exam, school BCBA certification",
  alternates: { canonical: "https://behaviorschool.com/bcba-exam-prep" },
  openGraph: {
    title: "BCBA Exam Prep & Study Guide for School-Based BCBAs",
    description: "Complete BCBA exam preparation with practice questions, study materials, and proven strategies for school-based behavior analysts.",
    url: "/bcba-exam-prep",
    type: "website",
    siteName: "Behavior School",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "BCBA Exam Prep - Behavior School",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BCBA Exam Prep & Study Guide for School-Based BCBAs",
    description: "Complete BCBA exam preparation with practice questions and proven strategies for school-based behavior analysts.",
    images: ["/og-image.webp"],
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