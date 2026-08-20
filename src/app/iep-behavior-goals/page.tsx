import { Metadata } from "next";
import { IEPBehaviorGoalsClient } from "./IEPBehaviorGoalsClient";

export const metadata: Metadata = {
  title: "BehaviorSchool Goal Writing System | IEP Behavior Goals",
  description: "Build an editable IEP behavior goal draft from student-specific baseline, context, supports, measurement, and mastery decisions.",
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
    title: "BehaviorSchool Goal Writing System | IEP Behavior Goals",
    description: "Build an editable IEP behavior goal draft from student-specific information. No registration is required.",
    type: "website",
    url: "https://behaviorschool.com/iep-behavior-goals",
    images: [
      {
        url: "https://behaviorschool.com/thumbnails/iep-behavior-goal-thumb.webp",
        width: 1200,
        height: 630,
        alt: "BehaviorSchool Goal Writing System for IEP behavior goal drafts"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "BehaviorSchool Goal Writing System | IEP Behavior Goals",
    description: "Build an editable IEP behavior goal draft from student-specific information. No registration is required.",
    images: ["https://behaviorschool.com/thumbnails/iep-behavior-goal-thumb.webp"]
  },
  alternates: {
    canonical: "https://behaviorschool.com/iep-behavior-goals"
  }
};

export default function IEPBehaviorGoalsPage() {
  return <IEPBehaviorGoalsClient />;
}
