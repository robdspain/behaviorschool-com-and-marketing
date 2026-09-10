import type { Metadata } from "next";

// The page component is a client component, so metadata lives here.
export const metadata: Metadata = {
  title: "Free BCBA and RBT Study Plan | Behavior School",
  description:
    "Free RBT and BCBA study guide PDFs, free practice questions with no signup, and an optional 7-day study schedule sent by email.",
  alternates: { canonical: "https://behaviorschool.com/free-study-plan" },
  openGraph: {
    title: "Free BCBA and RBT Study Plan | Behavior School",
    description:
      "Download free RBT and BCBA study guide PDFs, try free practice questions, and get a 7-day study schedule by email.",
    url: "https://behaviorschool.com/free-study-plan",
    siteName: "Behavior School",
    type: "website",
    images: [{ url: "/optimized/og-image.webp", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free BCBA and RBT Study Guides and Practice Exams",
    description:
      "Free study guide PDFs, free practice questions, and a 7-day study schedule by email.",
  },
};

export default function FreeStudyPlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
