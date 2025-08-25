import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BCBA Supervision Tools & Training Platform | Behavior School",
  description: "Plan, deliver, and document high‑quality BCBA supervision with automation and defensible records. Track competencies, hours, and compliance for BACB audit-ready documentation.",
  keywords: "BCBA supervision tools, behavior analyst supervision, RBT supervision, BCBA fieldwork tracking, supervision documentation, BACB compliance, behavior analyst training",
  alternates: { canonical: "https://behaviorschool.com/supervisors" },
  openGraph: {
    type: "website",
    title: "BCBA Supervision Tools & Training Platform",
    description: "Plan, deliver, and document high‑quality BCBA supervision with automation and defensible records.",
    url: "/supervisors",
    siteName: "Behavior School",
    images: [
      {
        url: "/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "BCBA Supervision Tools - Behavior School",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BCBA Supervision Tools & Training Platform",
    description: "Plan, deliver, and document high‑quality BCBA supervision with automation and defensible records.",
    images: ["/optimized/og-image.webp"],
  },
  robots: { index: true, follow: true },
};

export default function SupervisorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}