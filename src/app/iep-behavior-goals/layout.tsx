import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IEP Behavior Goal Generator — Free IEP Goal Writer Widget | Behavior School",
  description:
    "Generate compliant, measurable IEP behavior goals in minutes with our free, embeddable widget. Step-by-step flow, baseline data, and a built-in quality meter.",
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
    "IEP goal writer widget",
    "IEP behavior goal generator",
    "free IEP goal generator",
    "behavior IEP goals",
    "measurable behavior goals",
    "IEP goal tool",
    "embed IEP goal widget"
  ],
  openGraph: {
    title: "IEP Behavior Goal Generator — Free IEP Goal Writer Widget",
    description:
      "Create compliant, measurable IEP behavior goals in minutes. Free, embeddable widget with step-by-step flow and baseline data.",
    type: "website",
    url: "https://behaviorschool.com/iep-behavior-goals",
    images: [
      {
        url: "https://behaviorschool.com/thumbnails/iep-goal-thumb.webp",
        width: 1200,
        height: 630,
        alt: "IEP Goal Writer Widget — Behavior School"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "IEP Behavior Goal Generator — Free IEP Goal Writer Widget",
    description:
      "Generate compliant, measurable IEP behavior goals in minutes with our free, embeddable widget.",
    images: ["https://behaviorschool.com/thumbnails/iep-goal-thumb.webp"]
  },
  alternates: {
    canonical: "https://behaviorschool.com/iep-behavior-goals"
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
