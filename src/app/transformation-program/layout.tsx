import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transform Your School Practice in 8 Weeks | BCBA Operating System | Behavior School",
  description: "Transform chaos into confidence as a school-based BCBA. Stop firefighting, build ethical systems, reduce burnout. 8-week cohort program with proven strategies for school behavior support.",
  keywords: "school BCBA training, behavior analyst burnout solution, special education leadership, school psychology systems, BCBA ethics training, crisis management schools, staff training protocols, behavior support systems, school transformation program, cohort-based BCBA course",
  alternates: { canonical: "https://behaviorschool.com/transformation-program" },
  openGraph: {
    type: "website",
    title: "Transform Your School Practice in 8 Weeks | BCBA Operating System",
    description: "Transform chaos into confidence as a school-based BCBA. Stop firefighting, build ethical systems, reduce burnout. Proven 8-week program with immediate results.",
    url: "/transformation-program",
    siteName: "Behavior School",
    locale: "en_US",
    images: [
      {
        url: "/hero-chaos-to-confidence.jpg",
        width: 1200,
        height: 630,
        alt: "School BCBA professionals working confidently with systematic approach - Behavior School transformation program",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Transform Your School Practice in 8 Weeks | BCBA Operating System",
    description: "Transform chaos into confidence as a school-based BCBA. Stop firefighting, build ethical systems, reduce burnout. Proven results.",
    images: ["/hero-chaos-to-confidence.jpg"],
    creator: "@BehaviorSchool",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  other: {
    "google-site-verification": process.env.GOOGLE_SITE_VERIFICATION || "",
  },
};

export default function TransformationProgramLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://behaviorschool.com";
  
  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "School BCBA Transformation Program",
    alternateName: "BCBA Operating System for Schools",
    description: "Intensive 8-week cohort-based training program designed to transform overwhelmed school-based BCBAs into ethical leaders who master crisis management, build teacher buy-in, and implement school-wide behavior support systems.",
    provider: {
      "@type": "EducationalOrganization",
      name: "Behavior School",
      url: SITE_URL,
      logo: `${SITE_URL}/optimized/Logos/logo-gold-transparent.webp`,
      sameAs: [
        "https://www.linkedin.com/company/behavior-school",
        "https://x.com/behaviorschool"
      ]
    },
    instructor: {
      "@type": "Person",
      name: "Rob Spain",
      jobTitle: "BCBA, IBA",
      url: "https://robspain.com",
      worksFor: {
        "@type": "Organization",
        name: "Behavior School"
      }
    },
    courseMode: "online",
    educationalLevel: "Graduate",
    teaches: [
      "Ethical leadership in school-based behavior analysis",
      "Crisis management strategies for schools",
      "Building teacher buy-in for behavior interventions", 
      "School-wide behavior support system implementation",
      "MTSS behavior support integration",
      "Professional burnout prevention for BCBAs"
    ],
    about: {
      "@type": "Thing",
      name: "School-Based Applied Behavior Analysis Leadership",
      description: "Advanced training in ethical leadership, crisis management, and systems implementation for behavior analysts working in educational settings"
    },
    timeRequired: "P8W",
    educationalCredentialAwarded: "Certificate of Completion",
    numberOfCredits: null,
    occupationalCredentialAwarded: null,
    coursePrerequisites: "BCBA certification or enrollment in BCBA-eligible graduate program",
    audience: {
      "@type": "EducationalAudience",
      audienceType: "Professional",
      educationalRole: "Board Certified Behavior Analyst"
    },
    isPartOf: {
      "@type": "Course",
      name: "Behavior School Professional Development Series"
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: "P8W",
      instructor: {
        "@type": "Person",
        name: "Rob Spain",
        jobTitle: "BCBA, IBA"
      }
    },
    educationalAlignment: [
      {
        "@type": "AlignmentObject",
        alignmentType: "teaches",
        educationalFramework: "BACB Professional and Ethical Compliance Code",
        targetName: "Ethical Behavior Analysis Practice"
      },
      {
        "@type": "AlignmentObject",
        alignmentType: "teaches", 
        educationalFramework: "IDEA Special Education Law",
        targetName: "School-Based Behavior Support Services"
      }
    ]
  } as const;

  const programJsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalProgram",
    name: "School BCBA Transformation Program",
    description: "Comprehensive 8-week training program transforming school-based behavior analysts from overwhelmed practitioners to confident ethical leaders with systematic approaches to crisis management and behavior support.",
    provider: {
      "@type": "EducationalOrganization", 
      name: "Behavior School"
    },
    programType: "Professional Development",
    educationalProgramMode: "online",
    timeToComplete: "P8W",
    programPrerequisites: [
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "Professional Certification",
        recognizedBy: {
          "@type": "Organization",
          name: "Behavior Analyst Certification Board (BACB)"
        }
      }
    ],
    occupationalCategory: {
      "@type": "CategoryCode",
      codeValue: "21-1094",
      codingSystem: "O*NET-SOC",
      name: "Community Health Workers"
    },
    offers: {
      "@type": "Offer",
      description: "8-week intensive cohort training for school-based BCBAs",
      category: "Professional Development Course"
    }
  } as const;

  return (
    <div>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(programJsonLd) }}
      />
    </div>
  );
}
