import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IEP Behavior Goals Examples & Templates | Measurable Behavioral Goals | Behavior School",
  description: "Free IEP behavior goal templates with measurable behavioral goals examples. Complete guide for writing behavior goals IEP, behavior iep goals, and behavioral goals for school teams.",
  keywords: "behavior goal iep, iep behavior goal, iep behavior, behavior goals, iep behavior goals, behavior iep goals, behavior iep goal, behavioral goals, measurable behavioral goals examples, examples of behavioral goals, IEP goal writing, special education behavior goals, school BCBA IEP goals",
  alternates: { canonical: "https://behaviorschool.com/iep-behavior-goals" },
  openGraph: {
    title: "IEP Behavior Goals Examples & Templates | Measurable Behavioral Goals",
    description: "Free IEP behavior goal templates with measurable behavioral goals examples. Complete guide for behavior goals IEP and behavior iep goals for school teams.",
    url: "/iep-behavior-goals",
    type: "website",
    siteName: "Behavior School",
    images: [
      {
        url: "/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "IEP Behavior Goals - Behavior School",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IEP Behavior Goals Examples & Templates | Measurable Behavioral Goals",
    description: "Free IEP behavior goal templates with measurable behavioral goals examples. Complete guide for behavior goals IEP and behavior iep goals.",
    images: ["/optimized/og-image.webp"],
  },
  robots: { index: true, follow: true },
};

export default function IEPBehaviorGoalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}