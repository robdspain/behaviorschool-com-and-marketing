import { Metadata } from "next";
import { BCBAStudyToolsClient } from "./BCBAStudyToolsClient";

export const metadata: Metadata = {
  title: "FREE BCBA Study Tools 2025 | AI Practice Tests + Adaptive Learning | Behavior School",
  description: "FREE AI-powered BCBA study tools. Unlimited practice questions, adaptive learning, performance analytics. Join BCBAs preparing for their exam. Start free today!",
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
    "BCBA study tools 2025",
    "free BCBA exam prep",
    "BCBA practice tests free",
    "best BCBA study materials",
    "BCBA exam pass rate 2025",
    "AI BCBA practice questions",
    "BCBA exam prep 6th edition",
    "adaptive BCBA study tools",
    "BCBA mock exam free",
    "Pass The Big ABA Exam alternative",
    "Study Notes ABA alternative",
    "BCBA exam questions free",
    "behavior analyst certification prep",
    "BCBA study schedule 2025",
    "first-time BCBA pass rate"
  ],
  openGraph: {
    title: "FREE BCBA Study Tools 2025 | AI Practice Tests + Adaptive Learning | Behavior School",
    description: "FREE AI-powered BCBA study tools. Unlimited practice questions, adaptive learning, performance analytics. Start free today!",
    type: "website",
    url: "https://behaviorschool.com/bcba-study-tools",
    images: [
      {
        url: "https://behaviorschool.com/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "BCBA Study Tools - Behavior School"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "FREE BCBA Study Tools 2025 | AI Practice Tests + Adaptive Learning",
    description: "FREE AI-powered BCBA study tools. Unlimited practice questions, adaptive learning. Start free today!",
    images: ["https://behaviorschool.com/optimized/og-image.webp"]
  },
  alternates: {
    canonical: "https://behaviorschool.com/bcba-study-tools"
  }
};

export default function BCBAStudyToolsPage() {
  return <BCBAStudyToolsClient />;
}