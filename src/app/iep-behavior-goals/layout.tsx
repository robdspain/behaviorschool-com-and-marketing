import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IEP Behavior Goals & Writing Guide for School BCBAs | Behavior School",
  description: "Complete guide to writing measurable IEP behavior goals for students with disabilities. Templates, examples, and strategies for school-based BCBAs and special education teams.",
  keywords: "IEP behavior goals, behavior goals for IEP, measurable behavior goals, IEP goal writing, special education behavior goals, school BCBA IEP goals, behavior intervention IEP, autism behavior goals",
  alternates: { canonical: "https://behaviorschool.com/iep-behavior-goals" },
  openGraph: {
    title: "IEP Behavior Goals & Writing Guide for School BCBAs",
    description: "Complete guide to writing measurable IEP behavior goals with templates and examples for school-based BCBAs.",
    url: "/iep-behavior-goals",
    type: "website",
    siteName: "Behavior School",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "IEP Behavior Goals - Behavior School",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IEP Behavior Goals & Writing Guide for School BCBAs",
    description: "Complete guide to writing measurable IEP behavior goals with templates and examples for school-based BCBAs.",
    images: ["/og-image.webp"],
  },
  robots: { index: true, follow: true },
};

export default function IEPBehaviorGoalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}