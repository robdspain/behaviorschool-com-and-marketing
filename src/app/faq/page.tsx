import { Metadata } from "next";
import { FAQClient } from "./FAQClient";
import { getFaqSchemaItems } from "./faq-data";

export const metadata: Metadata = {
  title: "FAQ: Program, CEUs, and Free Tools | Behavior School",
  description: "Answers about the School BCBA Transformation Program (dates, cost, CEUs, district pay), Behavior School's free IEP and BIP tools, and BCBA exam prep.",
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
    title: "FAQ: Program, CEUs, and Free Tools | Behavior School",
    description: "Answers about the School BCBA Transformation Program, free IEP and BIP tools, CEUs, and BCBA exam prep.",
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
    title: "FAQ: Program, CEUs, and Free Tools | Behavior School",
    description: "Answers about the School BCBA Transformation Program, free IEP and BIP tools, CEUs, and BCBA exam prep.",
    images: ["https://behaviorschool.com/optimized/og-image.webp"]
  },
  alternates: {
    canonical: "https://behaviorschool.com/faq"
  }
};

export default function FAQPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: getFaqSchemaItems().map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FAQClient />
    </>
  );
}
