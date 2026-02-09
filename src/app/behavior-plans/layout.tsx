import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Behavior Intervention Plans (BIP Writer) | Coming Soon | Behavior School",
  description:
    "AI-powered Behavior Intervention Plan writer for school-based BCBAs. Generate function-based BIPs with evidence-based interventions, data collection plans, and progress monitoring. Coming soon.",
  keywords:
    "behavior intervention plan, BIP writer, FBA to BIP, behavior plan generator, school BCBA tools, behavior support plan, function-based intervention",
  alternates: { canonical: "https://behaviorschool.com/behavior-plans" },
  openGraph: {
    type: "website",
    title: "Behavior Intervention Plans (BIP Writer) | Behavior School",
    description:
      "AI-powered BIP writer for school-based BCBAs. Generate function-based behavior intervention plans with evidence-based strategies.",
    url: "https://behaviorschool.com/behavior-plans",
    images: [
      {
        url: "/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Behavior Intervention Plan Writer by Behavior School",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Behavior Intervention Plans (BIP Writer) | Behavior School",
    description:
      "AI-powered BIP writer for school-based BCBAs. Generate function-based behavior intervention plans.",
    images: ["/optimized/og-image.webp"],
  },
  robots: { index: true, follow: true },
};

export default function BehaviorPlansLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
