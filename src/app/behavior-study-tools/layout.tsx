import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BCBA Practice Exams, Mock Tests & Free Practice Questions | Behavior Study Tools",
  description: "BCBA practice exams and full-length mock tests with clear rationales. Try free BCBA practice questions, adaptive drills, and progress tracking designed for future BCBAs.",
  keywords: "free bcba practice exam, bcba practice exam, bcba mock exam, bcba exam practice tests, practice bcba exam questions, bcba exam questions free, behavior analysis study tools, adaptive learning, BACB exam preparation",
  alternates: { canonical: "/behavior-study-tools" },
  openGraph: {
    type: "website",
    title: "BCBA Practice Exams, Mock Tests & Free Questions",
    description: "Full-length BCBA mock tests and free practice questions with adaptive learning and progress tracking.",
    url: "/behavior-study-tools",
    images: [
      {
        url: "/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Behavior Study Tools - BCBA Practice Exams and Mock Tests",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BCBA Practice Exams, Mock Tests & Free Questions",
    description: "Full-length BCBA mock tests plus free practice questions with adaptive learning.",
    images: ["/optimized/og-image.webp"],
  },
  robots: { index: true, follow: true },
};

export default function BehaviorStudyToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://behaviorschool.com";
  
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Behavior Study Tools - BCBA Exam Prep",
    alternateName: "BCBA Exam Preparation Platform",
    description: "AI-powered BCBA exam preparation platform with unlimited practice questions, adaptive learning, and performance tracking designed specifically for behavior analysts preparing for BACB certification.",
    provider: {
      "@type": "EducationalOrganization",
      name: "Behavior School",
      url: SITE_URL,
      logo: `${SITE_URL}/optimized/Logos/logo-gold-transparent.webp`
    },
    serviceType: "Educational Technology",
    category: "BCBA Exam Preparation",
    areaServed: "Worldwide",
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${SITE_URL}/behavior-study-tools`,
      availableLanguage: "English"
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "BCBA Study Tools Features",
      itemListElement: [
        {
          "@type": "Offer",
          name: "AI-Powered Practice Questions",
          description: "Unlimited BCBA practice questions with adaptive difficulty based on performance",
          category: "Study Materials"
        },
        {
          "@type": "Offer", 
          name: "Performance Analytics",
          description: "Detailed analytics and progress tracking for BCBA exam preparation",
          category: "Learning Analytics"
        },
        {
          "@type": "Offer",
          name: "BACB Task List Coverage",
          description: "Complete coverage of all BACB task list items for comprehensive exam preparation",
          category: "Curriculum"
        }
      ]
    },
    audience: {
      "@type": "Audience",
      audienceType: "Graduate Students",
      geographicArea: {
        "@type": "Place",
        name: "Worldwide"
      }
    },
    educationalAlignment: {
      "@type": "AlignmentObject",
      alignmentType: "teaches",
      educationalFramework: "BACB Task List",
      targetName: "Board Certified Behavior Analyst Certification"
    }
  } as const;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Behavior Study Tools",
    description: "Comprehensive BCBA exam preparation platform featuring AI-powered practice questions, adaptive learning algorithms, and detailed performance analytics for behavior analyst certification success.",
    brand: {
      "@type": "Brand",
      name: "Behavior School"
    },
    manufacturer: {
      "@type": "Organization", 
      name: "Behavior School"
    },
    category: "Educational Software",
    audience: {
      "@type": "PeopleAudience",
      suggestedMinAge: 22,
      requiredGender: null,
      suggestedGender: null
    },
    isRelatedTo: {
      "@type": "Course",
      name: "Applied Behavior Analysis Graduate Programs",
      description: "Graduate-level education in applied behavior analysis leading to BCBA eligibility"
    }
  } as const;

  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
    </>
  );
}
