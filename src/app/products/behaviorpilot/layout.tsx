import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BehaviorPilot — BCBA Software for FBAs, BIPs & Data Collection",
  description: "AI-powered BCBA platform for FBAs, BIPs, and school-based data tracking. Create, collect, and report with speed and fidelity.",
  keywords: [
    "behavior analyst software",
    "BCBA data collection tool", 
    "FBA and BIP templates",
    "school-based behavior analysis software",
    "behavior intervention plan tool",
    "functional behavior assessment app",
    "special education data tracking",
    "behavior plan generator",
    "fidelity monitoring"
  ],
  openGraph: {
    title: "BehaviorPilot — BCBA Software for FBAs, BIPs & Data Collection",
    description: "AI-powered BCBA platform for FBAs, BIPs, and school-based data tracking. Create, collect, and report with speed and fidelity.",
    url: "https://behaviorschool.com/products/behaviorpilot",
    siteName: "Behavior School",
    images: [
      {
        url: "/og-behaviorpilot.png",
        width: 1200,
        height: 630,
        alt: "BehaviorPilot - BCBA Software for FBAs, BIPs & Data Collection",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BehaviorPilot — BCBA Software for FBAs, BIPs & Data Collection",
    description: "AI-powered BCBA platform for FBAs, BIPs, and school-based data tracking. Create, collect, and report with speed and fidelity.",
    images: ["/og-behaviorpilot.png"],
  },
};

export default function BehaviorPilotLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}