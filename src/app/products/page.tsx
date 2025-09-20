import { Metadata } from "next";
import { ProductsClient } from "./ProductsClient";

export const metadata: Metadata = {
  title: "★ FREE BCBA Tools & Training | Mock Exams + IEP Writers + Behavior Plans",
  description: "Get FREE professional BCBA tools: mock exams, IEP goal writers, behavior planning templates, and certification prep. Trusted by 1000+ behavior analysts. Start free now!",
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
    "BCBA training products",
    "behavior analysis tools",
    "BCBA exam prep",
    "IEP goal writer",
    "behavior planning tools",
    "school behavior support",
    "BCBA certification resources",
    "behavior intervention tools",
    "special education tools",
    "applied behavior analysis resources"
  ],
  openGraph: {
    title: "BCBA Training Products & Tools | Behavior School Professional Resources",
    description: "Comprehensive BCBA certification prep, exam tools, IEP goal writers, behavior planning resources, and professional development programs for behavior analysts.",
    type: "website",
    url: "https://behaviorschool.com/products",
    images: [
      {
        url: "https://behaviorschool.com/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Behavior School Products"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "BCBA Training Products & Tools | Behavior School",
    description: "Professional resources for BCBA certification, behavior analysis, and school-based support tools.",
    images: ["https://behaviorschool.com/optimized/og-image.webp"]
  },
  alternates: {
    canonical: "https://behaviorschool.com/products"
  }
};

export default function ProductsPage() {
  return <ProductsClient />;
}
