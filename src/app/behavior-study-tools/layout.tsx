import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Behavior Study Tools - Smarter Studying for Future BCBAs | Behavior School",
  description: "AI-powered BCBA exam preparation platform with unlimited practice questions, adaptive learning, and performance tracking designed for behavior analysts.",
  keywords: "BCBA exam prep, behavior analysis study tools, AI practice questions, adaptive learning, BACB exam preparation, behavior analyst certification",
  alternates: { canonical: "/behavior-study-tools" },
  openGraph: {
    type: "website",
    title: "Behavior Study Tools - Smarter Studying for Future BCBAs",
    description: "AI-powered BCBA exam preparation platform with unlimited practice questions, adaptive learning, and performance tracking designed for behavior analysts.",
    url: "/behavior-study-tools",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Behavior Study Tools - BCBA Exam Preparation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Behavior Study Tools - Smarter Studying for Future BCBAs",
    description: "AI-powered BCBA exam preparation platform with unlimited practice questions, adaptive learning, and performance tracking designed for behavior analysts.",
    images: ["/og-image.webp"],
  },
  robots: { index: true, follow: true },
};

export default function BehaviorStudyToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
