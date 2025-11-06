import { Metadata } from "next";
import { ProductsClient } from "./ProductsClient";

export const metadata: Metadata = {
  title: "FREE BCBA Tools & Training | Mock Exams + IEP Writers + Behavior Plans",
  description: "FREE professional BCBA tools: mock exams, IEP goal writers, behavior planning templates & certification prep resources for behavior analysts. Start free now!",
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
  return (
    <>
      {/* FAQ Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Are your BCBA tools free to use?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. We offer free BCBA mock exams, goal-writing tools, and printable templates. Premium options are available for expanded features, but core practice resources are free with no credit card required."
                }
              },
              {
                "@type": "Question",
                "name": "What products are best for exam prep?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Start with our Free BCBA Mock Practice Test for quick diagnostics, then use the full BCBA Practice Exam for unlimited, non-repetitive questions and detailed analytics. Add the study fluency system for structured progression."
                }
              },
              {
                "@type": "Question",
                "name": "Do you have tools for IEP goal writing and behavior plans?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Our IEP Goal Writer and Behavior Plans resources help generate measurable goals and intervention plans with templates, examples, and progress-monitoring tools."
                }
              },
              {
                "@type": "Question",
                "name": "Can schools or districts use these tools?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Absolutely. Our resources are designed for school-based practice. We offer campus-ready templates, downloadable guides, and options for branding and team rollout."
                }
              }
            ]
          })
        }}
      />

      <ProductsClient />
    </>
  );
}
