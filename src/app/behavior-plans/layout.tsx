import type { Metadata } from "next";

// Page-level metadata in ./page.tsx takes precedence; these values are the
// fallback and must describe the live tool, not a pre-launch state.
export const metadata: Metadata = {
  title: "Behavior Plan Writer - Free BIP Generator | Behavior School",
  description:
    "Free behavior intervention plan writer for school-based BCBAs. Build function-based BIPs with prevention, teaching, reinforcement, and data collection steps.",
  keywords:
    "behavior intervention plan, BIP writer, FBA to BIP, behavior plan generator, school BCBA tools, behavior support plan, function-based intervention",
  alternates: { canonical: "https://behaviorschool.com/behavior-plans" },
  openGraph: {
    type: "website",
    title: "Behavior Plan Writer | Free BIP Generator for School Teams",
    description:
      "Free behavior intervention plan writer for school-based BCBAs. Build function-based BIPs with evidence-based strategies and data collection plans.",
    url: "https://behaviorschool.com/behavior-plans",
    images: [
      {
        url: "/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Behavior Plan Writer by Behavior School",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Behavior Plan Writer | Free BIP Generator for School Teams",
    description:
      "Free behavior intervention plan writer for school-based BCBAs. Build function-based BIPs in minutes.",
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
