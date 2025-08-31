import { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ClientCTA } from "./ClientCTA";
import { AnimatedSections } from "./AnimatedSections";

export const metadata: Metadata = {
  title: "Free IEP Goal Generator | Write SMART IEP Behavior Goals | Behavior School",
  description: "Free IEP goal generator tool. Create clear, measurable SMART IEP behavior goals in minutes. Helps teachers, BCBAs, and schools write effective behavior goal IEP that drive student success.",
  keywords: [
    "free iep goal generator",
    "iep goal generator",
    "smart iep goals",
    "behavior goal iep",
    "iep behavior goal", 
    "iep behavior",
    "behavior goals",
    "iep behavior goals",
    "behavior iep goals",
    "behavioral school",
    "behavior iep goal",
    "IEP goals",
    "IEP goal writing",
    "measurable IEP goals", 
    "IEP goal examples",
    "special education goals",
    "IEP goal bank",
    "writing IEP goals",
    "IEP goal templates",
    "special education teacher tools",
    "BCBA IEP goals",
    "school district IEP tools"
  ],
  openGraph: {
    title: "Free IEP Goal Generator | Write SMART IEP Behavior Goals | Behavior School",
    description: "Free IEP goal generator tool. Create clear, measurable SMART IEP behavior goals in minutes. Helps teachers, BCBAs, and schools write effective behavior goal IEP.",
    type: "website",
    url: "https://behaviorschool.com/iep-goals",
    images: [
      {
        url: "https://behaviorschool.com/thumbnails/iep-goal-thumb.webp",
        width: 1200,
        height: 630,
        alt: "Free IEP Goal Generator - Write SMART IEP Behavior Goals"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Free IEP Goal Generator | Write SMART IEP Behavior Goals | Behavior School",
    description: "Free IEP goal generator tool. Create clear, measurable SMART IEP behavior goals in minutes. Helps teachers, BCBAs, and schools write effective behavior goal IEP.",
    images: ["https://behaviorschool.com/thumbnails/iep-goal-thumb.webp"]
  },
  alternates: {
    canonical: "https://behaviorschool.com/iep-goals"
  }
};

// Structured data for rich snippets
const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Free IEP Goal Generator",
  "description": "A free tool for writing effective, measurable SMART IEP behavior goals that drive student success",
  "url": "https://behaviorschool.com/iep-goals",
  "applicationCategory": "EducationalApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "availability": "PreOrder",
    "description": "Join the waitlist for early access to the Free IEP Goal Generator"
  },
  "audience": {
    "@type": "Audience",
    "audienceType": ["Special Education Teachers", "BCBAs", "School Districts"]
  },
  "provider": {
    "@type": "Organization",
    "name": "Behavior School",
    "url": "https://behaviorschool.com"
  },
  "about": [
    {
      "@type": "Thing",
      "name": "IEP behavior goals"
    },
    {
      "@type": "Thing", 
      "name": "behavior goal IEP"
    },
    {
      "@type": "Thing",
      "name": "behavior goals"
    },
    {
      "@type": "Thing",
      "name": "SMART IEP goals"
    }
  ]
};

// FAQ Schema for rich snippets
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do you write a measurable behavioral IEP goal?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A behavioral goal should define the exact behavior, include baseline data, and set a clear success criterion (e.g., \"Student will request a break using a visual card in 80% of opportunities across 3 settings.\")."
      }
    },
    {
      "@type": "Question",
      "name": "What are examples of functional language skills IEP goals?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Functional language goals might include, \"Student will independently request help using a 3-word phrase in 80% of opportunities during classroom routines.\""
      }
    },
    {
      "@type": "Question",
      "name": "Is there a free IEP goal-writing tool for teachers and BCBAs?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes — our Free IEP Goal Generator helps you instantly create SMART, evidence-based goals you can use in IEPs."
      }
    },
    {
      "@type": "Question",
      "name": "What makes an IEP goal SMART?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "SMART goals are Specific, Measurable, Achievable, Relevant, and Time-bound — ensuring clarity and accountability."
      }
    }
  ]
};

export default function IEPGoalsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <div className="min-h-screen bg-white">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumbs 
            items={[
              { label: "Products", href: "/products" },
              { label: "Free IEP Goal Generator" }
            ]}
          />
        </nav>
        
        {/* Animated Content */}
        <AnimatedSections />
      </div>
    </>
  );
}