import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BehaviorSchool Goal Writing System | IEP Behavior Goals",
  description:
    "Build an editable IEP behavior goal draft from student-specific baseline, context, supports, measurement, and mastery decisions.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  keywords: [
    "behavior goal iep",
    "iep behavior goal",
    "iep behavior",
    "iep behavior goals",
    "behavior iep goals",
    "free iep behavior goals",
    "behavior goals for iep",
    "iep behavior goal generator",
    "free behavior goal generator",
    "behavior goal writer",
    "iep goal generator free",
    "behavior goals iep examples",
    "measurable behavior goals iep"
  ],
  openGraph: {
    title: "BehaviorSchool Goal Writing System | IEP Behavior Goals",
    description:
      "Build an editable IEP behavior goal draft from student-specific information. No registration is required.",
    type: "website",
    url: "https://behaviorschool.com/iep-behavior-goals",
    images: [
      {
        url: "https://behaviorschool.com/thumbnails/iep-goal-thumb.webp",
        width: 1200,
        height: 630,
        alt: "BehaviorSchool Goal Writing System for IEP behavior goal drafts"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "BehaviorSchool Goal Writing System | IEP Behavior Goals",
    description:
      "Build an editable IEP behavior goal draft from student-specific information. No registration is required.",
    images: ["https://behaviorschool.com/thumbnails/iep-goal-thumb.webp"]
  },
  alternates: {
    canonical: "https://behaviorschool.com/iep-behavior-goals"
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
