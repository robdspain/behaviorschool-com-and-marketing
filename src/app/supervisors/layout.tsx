import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BCBA Supervision Tools",
  description: "BCBA supervision tools for tracking fieldwork hours, competencies, and signatures. Free templates with audit-ready exports. Start organizing supervision now.",
  keywords: "aba supervision tools, bcba supervision tools, bcba supervision curriculum, bcba supervision curriculum free, fieldwork tracking, supervision documentation, BACB compliance, behavior analyst training",
  alternates: { canonical: "https://behaviorschool.com/supervisors" },
  openGraph: {
    type: "website",
    title: "BCBA Supervision Tools",
    description: "BCBA supervision tools: track fieldwork hours, competencies, signatures. Free templates. Start now.",
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
    title: "BCBA Supervision Tools",
    description: "BCBA supervision tools: track fieldwork, competencies, signatures. Free templates.",
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
