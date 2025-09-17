import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free IEP Behavior Goals Generator — Create Behavior Goals for IEP | Behavior School",
  description:
    "Generate free IEP behavior goals in under 5 minutes. Create compliant, measurable behavior goals for IEPs with our specialized behavior goal generator. No registration required.",
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
    title: "Free IEP Behavior Goals Generator — Create Behavior Goals for IEP",
    description:
      "Generate free IEP behavior goals in under 5 minutes. Create compliant, measurable behavior goals for IEPs with our specialized generator. No registration required.",
    type: "website",
    url: "https://behaviorschool.com/iep-behavior-goals",
    images: [
      {
        url: "https://behaviorschool.com/thumbnails/iep-goal-thumb.webp",
        width: 1200,
        height: 630,
        alt: "Free IEP Behavior Goals Generator — Behavior School"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Free IEP Behavior Goals Generator — Create Behavior Goals for IEP",
    description:
      "Generate free IEP behavior goals in under 5 minutes. No registration required. Specialized for behavior goals.",
    images: ["https://behaviorschool.com/thumbnails/iep-goal-thumb.webp"]
  },
  alternates: {
    canonical: "https://behaviorschool.com/iep-behavior-goals"
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
