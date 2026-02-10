import { Metadata } from "next";
import { ContactClient } from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Behavior School | BCBA Training & Support",
  description: "Get expert help with BCBA certification prep, school behavior analysis, IEP goals, and intervention planning. Contact our team for personalized support today.",
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
    "contact Behavior School",
    "BCBA training support",
    "behavior analysis consultation",
    "school behavior support",
    "BCBA certification help",
    "IEP goals assistance",
    "behavior intervention planning",
    "special education consulting",
    "applied behavior analysis help",
    "school BCBA support"
  ],
  openGraph: {
    title: "Contact Behavior School | BCBA Training & Support",
    description: "Get expert help with BCBA certification prep, school behavior analysis, IEP goals, and intervention planning. Contact our team for personalized support today.",
    type: "website",
    url: "https://behaviorschool.com/contact",
    images: [
      {
        url: "https://behaviorschool.com/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Contact Behavior School"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Behavior School | BCBA Training & Support",
    description: "Get expert help with BCBA certification prep, school behavior analysis, IEP goals, and intervention planning. Contact our team for personalized support today.",
    images: ["https://behaviorschool.com/optimized/og-image.webp"]
  },
  alternates: {
    canonical: "https://behaviorschool.com/contact"
  }
};

export default function ContactPage() {
  return <ContactClient />;
}