// src/app/iep-behavior-goals/widget/page.tsx
import { Metadata } from "next";
import WidgetContent from "./WidgetContent";

export const metadata: Metadata = {
  title: "Free IEP Behavior Goals Generator | Behavior School",
  description: "Generate evidence-based IEP behavior goals instantly. Free tool for special education teachers and behavior analysts. Create measurable, standards-aligned goals in seconds.",
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
    "behavior goals generator",
    "free iep goals",
    "special education goals",
    "behavior intervention goals",
    "iep goal writer",
    "measurable behavior goals",
    "autism behavior goals",
    "adhd behavior goals",
    "social emotional learning goals",
    "classroom behavior goals",
    "student behavior goals"
  ],
  openGraph: {
    title: "Free IEP Behavior Goals Generator | Behavior School",
    description: "Generate evidence-based IEP behavior goals instantly. Free tool for special education teachers and behavior analysts. Create measurable, standards-aligned goals in seconds.",
    type: "website",
    url: "https://behaviorschool.com/iep-goals",
    images: [
      {
        url: "https://behaviorschool.com/thumbnails/iep-goal-thumb.webp",
        width: 1200,
        height: 630,
        alt: "IEP Behavior Goals Generator - Free Tool for Special Education"
      }
    ],
    siteName: "Behavior School"
  },
  twitter: {
    card: "summary_large_image",
    title: "Free IEP Behavior Goals Generator | Behavior School",
    description: "Generate evidence-based IEP behavior goals instantly. Free tool for special education teachers and behavior analysts. Create measurable, standards-aligned goals in seconds.",
    images: ["https://behaviorschool.com/thumbnails/iep-goal-thumb.webp"],
    creator: "@BehaviorSchool",
    site: "@BehaviorSchool"
  },
  alternates: {
    canonical: "https://behaviorschool.com/iep-goals"
  }
};

// Structured data for better SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "IEP Behavior Goals Generator",
  "description": "Free tool to generate evidence-based IEP behavior goals for special education students",
  "url": "https://behaviorschool.com/iep-goals",
  "applicationCategory": "EducationalApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "provider": {
    "@type": "Organization",
    "name": "Behavior School",
    "url": "https://behaviorschool.com"
  }
};

export default function IEPBehaviorGoalsWidgetPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <WidgetContent />
    </>
  );
}