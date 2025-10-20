import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free BCBA Supervision Resources 2025 | School-Based Tools",
  description: "Free BCBA supervision resources for school-based behavior analysts. Documentation guides, supervision strategies, and BACB compliance templates.",
  keywords: "aba supervision tools, bcba supervision tools, bcba supervision curriculum, bcba supervision curriculum free, fieldwork tracking, supervision documentation, BACB compliance, behavior analyst training",
  alternates: { canonical: "https://behaviorschool.com/supervisors" },
  openGraph: {
    type: "website",
    title: "Free BCBA Supervision Resources 2025 | School-Based Tools",
    description: "Free BCBA supervision resources for school-based behavior analysts. Documentation guides, supervision strategies, and BACB compliance templates.",
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
    title: "Free BCBA Supervision Resources 2025 | School-Based Tools",
    description: "Free BCBA supervision resources for school-based behavior analysts. Documentation guides, supervision strategies, and BACB compliance templates.",
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
