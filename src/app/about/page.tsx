import { Metadata } from "next";
import AboutContent from "./AboutContent";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

// Person structured data for Rob Spain
const robSpainPersonSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Rob Spain",
  "givenName": "Rob",
  "familyName": "Spain",
  "honorificSuffix": ["M.S.", "BCBA", "IBA"],
  "jobTitle": "Board Certified Behavior Analyst",
  "description": "Rob Spain, M.S., BCBA, IBA, is a school-based behavior analyst and founder of Behavior School with 14+ years of experience. He serves as President of CalABA's Behavior Analysts in Education SIG and as a Behavior Intervention Specialist in a California school district while teaching graduate ABA courses at Fresno Pacific University.",
  "image": "https://behaviorschool.com/optimized/profile-Rob.webp",
  "url": "https://robspain.com",
  "sameAs": [
    "https://www.linkedin.com/in/robspain/",
    "https://x.com/robspainBCBA",
    "https://www.instagram.com/robdspain/",
    "https://www.facebook.com/profile.php?id=61572496964176",
    "https://behaviorschool.com/about",
    "https://behaviorschool.com/about/rob-spain"
  ],
  "alumniOf": [
    {
      "@type": "CollegeOrUniversity",
      "name": "National University"
    },
    {
      "@type": "CollegeOrUniversity",
      "name": "Florida Institute of Technology"
    }
  ],
  "hasCredential": [
    {
      "@type": "EducationalOccupationalCredential",
      "name": "Board Certified Behavior Analyst (BCBA)",
      "credentialCategory": "Professional Certification",
      "recognizedBy": {
        "@type": "Organization",
        "name": "Behavior Analyst Certification Board (BACB)"
      },
      "identifier": "1-11-9398"
    },
    {
      "@type": "EducationalOccupationalCredential",
      "name": "International Behavior Analyst (IBA)",
      "credentialCategory": "Professional Certification",
      "recognizedBy": {
        "@type": "Organization",
        "name": "International Behavior Analysis Organization (IBAO)"
      },
      "identifier": "103385847"
    },
    {
      "@type": "EducationalOccupationalCredential",
      "name": "Master of Science in Special Education",
      "credentialCategory": "Degree",
      "educationalLevel": "Graduate"
    }
  ],
  "affiliation": [
    {
      "@type": "Organization",
      "name": "Behavior School LLC"
    },
    {
      "@type": "EducationalOrganization",
      "name": "California School District"
    },
    {
      "@type": "CollegeOrUniversity",
      "name": "Fresno Pacific University"
    }
  ],
  "knowsAbout": [
    "Applied Behavior Analysis",
    "BCBA Certification",
    "School-Based Behavior Support",
    "Functional Behavior Assessment",
    "Behavior Intervention Planning",
    "IEP Development",
    "BCBA Exam Preparation",
    "Acceptance and Commitment Therapy",
    "PBIS Implementation",
    "Multi-Tiered System of Supports"
  ]
};

export const metadata: Metadata = {
  title: "About Behavior School | BCBA-Led Training for School Behavior Analysts",
  description: "Meet Rob Spain, BCBA and founder of Behavior School. Professional training for school-based ABA, BCBA certification prep, and evidence-based practice.",
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
    description: "Meet Rob Spain, BCBA and founder of Behavior School. Professional training for school-based ABA and BCBA certification prep.",
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
    description: "Meet Rob Spain, BCBA and founder providing professional training for school behavior analysts.",
    images: ["https://behaviorschool.com/optimized/og-image.webp"]
  },
  alternates: {
    canonical: "https://behaviorschool.com/about"
  }
};

export default function AboutPage() {
  return (
    <div>
      {/* Person Schema for Rob Spain */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(robSpainPersonSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
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