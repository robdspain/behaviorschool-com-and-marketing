import { Metadata } from "next";
import AboutContent from "./AboutContent";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export const metadata: Metadata = {
  title: "About Behavior School | BCBA-Led Training for School Behavior Analysts",
  description: "Meet Rob Spain, BCBA and founder of Behavior School. Helping 1000+ behavior analysts master school-based ABA, BCBA certification prep, and evidence-based practice.",
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
    "Rob Spain BCBA",
    "Behavior School founder",
    "school behavior analyst training",
    "BCBA certification",
    "applied behavior analysis",
    "school ABA specialist",
    "behavior intervention training",
    "IEP behavior goals expert",
    "special education consultant",
    "BCBA exam prep creator"
  ],
  openGraph: {
    title: "About Behavior School | BCBA-Led Training for School Behavior Analysts",
    description: "Meet Rob Spain, BCBA and founder of Behavior School. Helping 1000+ behavior analysts master school-based ABA and BCBA certification prep.",
    type: "website",
    url: "https://behaviorschool.com/about",
    images: [
      {
        url: "https://behaviorschool.com/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "About Behavior School"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "About Behavior School | BCBA-Led Training",
    description: "Meet Rob Spain, BCBA and founder helping 1000+ behavior analysts succeed in schools.",
    images: ["https://behaviorschool.com/optimized/og-image.webp"]
  },
  alternates: {
    canonical: "https://behaviorschool.com/about"
  }
};

export default function AboutPage() {
  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumbs 
          items={[
            { label: "About" }
          ]}
        />
      </div>
      <AboutContent />
    </div>
  );
}