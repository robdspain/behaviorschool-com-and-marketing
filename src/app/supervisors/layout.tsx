import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FREE BCBA Supervision Curriculum & ABA Supervision Tools | Behavior School",
  description: "FREE BCBA supervision curriculum & ABA supervision tools for BCBAs: competency matrix, hours & signatures, templates, and audit‑ready exports. Download FREE supervision curriculum framework for mentoring.",
  keywords: "aba supervision tools, bcba supervision tools, bcba supervision curriculum, bcba supervision curriculum free, fieldwork tracking, supervision documentation, BACB compliance, behavior analyst training",
  alternates: { canonical: "https://behaviorschool.com/supervisors" },
  openGraph: {
    type: "website",
    title: "FREE BCBA Supervision Curriculum & ABA Supervision Tools",
    description: "FREE BCBA supervision curriculum & ABA supervision tools - download templates, automation tools, and free curriculum framework.",
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
    title: "FREE BCBA Supervision Curriculum & ABA Supervision Tools",
    description: "FREE BCBA supervision curriculum & compliant ABA supervision tools with templates, automation, and free curriculum framework.",
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
