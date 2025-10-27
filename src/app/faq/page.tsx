import { Metadata } from "next";
import { FAQClient } from "./FAQClient";

export const metadata: Metadata = {
  title: "FAQ | Frequently Asked Questions | Behavior School",
  description: "Get answers to common questions about BCBA certification, exam prep, school-based behavior analysis training, and Behavior School's resources and programs.",
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
    "BCBA certification FAQ",
    "behavior analysis questions",
    "BCBA exam prep help",
    "school BCBA training",
    "behavior school FAQ",
    "BCBA practice test",
    "IEP goals help",
    "behavior intervention questions",
    "applied behavior analysis FAQ",
    "school-based BCBA"
  ],
  openGraph: {
    title: "FAQ | Frequently Asked Questions | Behavior School",
    description: "Get answers to common questions about BCBA certification, exam prep, and school-based behavior analysis training.",
    type: "website",
    url: "https://behaviorschool.com/faq",
    images: [
      {
        url: "https://behaviorschool.com/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Behavior School FAQ"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ | Frequently Asked Questions | Behavior School",
    description: "Get answers to common questions about BCBA certification, exam prep, and school-based behavior analysis training.",
    images: ["https://behaviorschool.com/optimized/og-image.webp"]
  },
  alternates: {
    canonical: "https://behaviorschool.com/faq"
  }
};

export default function FAQPage() {
  return <FAQClient />;
}
