import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ABA Supervision Tools & Free BCBA Supervision Curriculum | Behavior School",
  description: "ABA supervision tools for BCBAs: competency matrix, hours & signatures, templates, and audit‑ready exports. Includes guidance and a free supervision curriculum framework for mentoring.",
  keywords: "aba supervision tools, bcba supervision tools, bcba supervision curriculum, bcba supervision curriculum free, fieldwork tracking, supervision documentation, BACB compliance, behavior analyst training",
  alternates: { canonical: "https://behaviorschool.com/supervisors" },
  openGraph: {
    type: "website",
    title: "ABA Supervision Tools & BCBA Supervision Curriculum",
    description: "Deliver compliant ABA supervision with tools, templates, and a free supervision curriculum framework.",
    url: "/supervisors",
    siteName: "Behavior School",
    images: [
      {
        url: "/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "ABA Supervision Tools and BCBA Supervision Curriculum - Behavior School",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ABA Supervision Tools & BCBA Supervision Curriculum",
    description: "Compliant ABA supervision tools with templates, automations, and a free curriculum framework.",
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
