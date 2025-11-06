import type { Metadata } from "next";

const baseUrl = "https://behaviorschool.com";

export const metadata: Metadata = {
  title: "IEP Goal Quality Checker | Measurable Behavior Goals (Free Tool)",
  description:
    "Check IEP behavior goals for condition, behavior, measurement, criteria (90–100%), timeframe, baseline. Free copy & PDF export.",
  keywords: [
    "IEP goals",
    "behavior goal",
    "measurable IEP goals",
    "IEP goal checker",
    "IEP goal criteria",
    "ABA",
    "BCBA",
    "special education",
    "progress monitoring",
  ],
  alternates: { canonical: `${baseUrl}/iep-goal-qualitychecker` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${baseUrl}/iep-goal-qualitychecker`,
    title: "IEP Goal Quality Checker | Measurable Behavior Goals (Free Tool)",
    description:
      "Instant IEP behavior goal checks: condition, behavior, measurement, criteria (90–100%), timeframe, baseline. Free copy & PDF export.",
    siteName: "Behavior School",
    locale: "en_US",
    images: [
      {
        url: "/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Behavior School",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "IEP Goal Quality Checker | Measurable Behavior Goals (Free Tool)",
    description:
      "Instant IEP behavior goal checks: condition, behavior, measurement, criteria (90–100%), timeframe, baseline.",
    images: ["/optimized/og-image.webp"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
