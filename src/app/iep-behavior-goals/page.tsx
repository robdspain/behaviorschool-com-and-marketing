import { Metadata } from "next";
import { IEPBehaviorGoalsClient } from "./IEPBehaviorGoalsClient";

export const metadata: Metadata = {
  title: "🎯 FREE IEP Behavior Goals Writer | Create Professional Goals in 5 Minutes!",
  description: "Generate compliant IEP behavior goals instantly! FREE tool creates measurable, legal goals in 5 minutes. Professional resource for teachers and BCBAs. No signup - start now!",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  keywords: [
    "iep behavior goals",
    "behavior goals iep",
    "iep behavior goal",
    "behavior iep goals",
    "free iep behavior goals generator",
    "behavior goal generator",
    "iep behavior goals free",
    "behavioral goals iep",
    "behavior goal iep",
    "measurable behavior goals",
    "compliant iep behavior goals",
    "special education behavior goals",
    "bcba behavior goals",
    "school behavior goals",
    "iep goal writer behavior",
    "behavior intervention goals",
    "positive behavior goals iep",
    "problem behavior goals iep",
    "autism behavior goals",
    "adhd behavior goals",
    "classroom behavior goals",
    "social behavior goals",
    "replacement behavior goals",
    "functional behavior goals",
    "evidence based behavior goals",
    "data driven behavior goals",
    "baseline behavior goals",
    "progressive behavior goals"
  ],
  openGraph: {
    title: "Free IEP Behavior Goals Generator | Create Measurable Behavior Goals in Minutes | Behavior School",
    description: "Generate professional IEP behavior goals for free in under 5 minutes. Specialized tool for creating measurable, compliant behavior goals. No registration required - start creating now.",
    type: "website",
    url: "https://behaviorschool.com/iep-behavior-goals",
    images: [
      {
        url: "https://behaviorschool.com/thumbnails/iep-behavior-goal-thumb.webp",
        width: 1200,
        height: 630,
        alt: "Free IEP Behavior Goals Generator - Create Compliant Goals Fast"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Free IEP Behavior Goals Generator | Create Measurable Behavior Goals in Minutes | Behavior School",
    description: "Generate professional IEP behavior goals for free in under 5 minutes. Specialized tool for creating measurable, compliant behavior goals. No registration required - start creating now.",
    images: ["https://behaviorschool.com/thumbnails/iep-behavior-goal-thumb.webp"]
  },
  alternates: {
    canonical: "https://behaviorschool.com/iep-behavior-goals"
  }
};

export default function IEPBehaviorGoalsPage() {
  return <IEPBehaviorGoalsClient />;
}