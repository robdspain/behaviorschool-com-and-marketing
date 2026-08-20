import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { AnimatedSections } from "./AnimatedSections";

export const metadata: Metadata = {
  title: "BehaviorSchool Goal Writing System | Free IEP Behavior Goal Writer",
  description: "Use the free BehaviorSchool Goal Writing System to build an editable IEP behavior goal draft from student-specific information.",
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
    "free iep behavior goal generator",
    "behavior iep goals",
    "iep behavior goals free",
    "behavior goal generator",
    "free behavior goal generator",
    "iep goal generator behavior",
    "behavior goals iep",
    "positive behavior goals iep",
    "problem behavior goals iep",
    "measurable behavior goals",
    "compliant iep behavior goals",
    "behavior intervention goals",
    "special education behavior goals",
    "bcba behavior goals",
    "school behavior goals",
    "iep goal writer",
    "behavior goal writer",
    "iep goal generator free",
    "behavior specialist goals",
    "autism behavior goals",
    "adhd behavior goals",
    "classroom behavior goals",
    "social behavior goals",
    "replacement behavior goals",
    "functional behavior goals",
    "evidence based behavior goals",
    "data driven behavior goals",
    "baseline behavior goals",
    "progressive behavior goals"
  ],
  openGraph: {
    title: "BehaviorSchool Goal Writing System | Free IEP Behavior Goal Writer",
    description: "Use the free BehaviorSchool Goal Writing System to build an editable IEP behavior goal draft from student-specific information.",
    type: "website",
    url: "https://behaviorschool.com/iep-goals",
    images: [
      {
        url: "https://behaviorschool.com/thumbnails/iep-goal-thumb.webp",
        width: 1200,
        height: 630,
        alt: "BehaviorSchool Goal Writing System for student-specific IEP behavior goal drafts"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "BehaviorSchool Goal Writing System | Free IEP Behavior Goal Writer",
    description: "Use the free BehaviorSchool Goal Writing System to build an editable IEP behavior goal draft from student-specific information.",
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
  "name": "BehaviorSchool Goal Writing System",
  "description": "A free system for building editable IEP behavior goal drafts from student-specific baseline, context, supports, measurement, and mastery decisions.",
  "url": "https://behaviorschool.com/iep-goals",
  "applicationCategory": "EducationalApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "availability": "InStock",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Free access to the BehaviorSchool Goal Writing System. No registration is required."
  },
  "audience": {
    "@type": "Audience",
    "audienceType": ["Special Education Teachers", "BCBAs", "Behavior Specialists", "IEP Teams", "School Districts"]
  },
  "provider": {
    "@type": "Organization",
    "name": "Behavior School",
    "url": "https://behaviorschool.com"
  },
  "about": [
    {
      "@type": "Thing",
      "name": "behavior IEP goals"
    },
    {
      "@type": "Thing",
      "name": "positive behavior goals"
    },
    {
      "@type": "Thing",
      "name": "problem behavior reduction"
    },
    {
      "@type": "Thing",
      "name": "measurable behavior goals"
    },
    {
      "@type": "Thing",
      "name": "behavior intervention goals"
    },
    {
      "@type": "Thing",
      "name": "IEP compliance"
    },
    {
      "@type": "Thing",
      "name": "special education behavior support"
    }
  ]
};

// HowTo Schema for Behavior Goal Generation process
const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Build an IEP Behavior Goal Draft",
  "description": "A guided process for organizing student-specific information into an editable IEP behavior goal draft",
  "image": "https://behaviorschool.com/thumbnails/iep-goal-thumb.webp",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": "0"
  },
  "supply": [
    {
      "@type": "HowToSupply",
      "name": "BehaviorSchool Goal Writing System"
    },
    {
      "@type": "HowToSupply",
      "name": "Behavior Definition"
    },
    {
      "@type": "HowToSupply",
      "name": "Baseline Data"
    },
    {
      "@type": "HowToSupply",
      "name": "Measurement Criteria"
    }
  ],
  "tool": [
    {
      "@type": "HowToTool",
      "name": "BehaviorSchool Goal Writing System"
    }
  ],
  "step": [
    {
      "@type": "HowToStep",
      "name": "Define Target Behavior",
      "text": "Enter the specific behavior you want to increase or decrease with clear, observable descriptions",
      "image": "https://behaviorschool.com/thumbnails/iep-goal-thumb.webp"
    },
    {
      "@type": "HowToStep",
      "name": "Set Measurement Criteria",
      "text": "Select the measurement method and criterion that fit the student-specific behavior"
    },
    {
      "@type": "HowToStep",
      "name": "Add Baseline Data",
      "text": "Input current performance levels to establish starting point for progress monitoring"
    },
    {
      "@type": "HowToStep",
      "name": "Review the Goal Draft",
      "text": "Review the editable draft and the transparent checklist for missing or inconsistent components"
    },
    {
      "@type": "HowToStep",
      "name": "Export and Implement",
      "text": "Copy goal to clipboard or download as text file for immediate use in IEP documents"
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
      "name": "How does the free IEP behavior goal generator work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The BehaviorSchool Goal Writing System guides you through the target behavior, context, measurement, baseline, mastery, objectives, generalization, and optional maintenance. It then produces an editable draft for IEP team review."
      }
    },
    {
      "@type": "Question",
      "name": "What types of behavior goals can I create?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The tool is specialized for both increasing positive behaviors (like social skills, communication, academic engagement) and decreasing problem behaviors (like disruption, aggression, non-compliance). It automatically detects goal direction and applies appropriate measurement standards."
      }
    },
    {
      "@type": "Question",
      "name": "Are the generated goals IEP compliant?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The system organizes the information entered and flags missing or inconsistent components. The student’s IEP team remains responsible for determining whether the final goal is appropriate and meets applicable requirements."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need to create an account to use the generator?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No registration is required. The tool processes everything client-side in your browser, ensuring complete privacy. No data is transmitted or stored on our servers. You can start generating goals immediately."
      }
    },
    {
      "@type": "Question",
      "name": "How can I export or save the generated goals?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Goals can be copied to your clipboard with one click or downloaded as a text file. The output is formatted and ready to paste directly into IEP documents or data collection systems."
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <div className="min-h-screen bg-bs-background">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-2">
          <Breadcrumbs 
            items={[
              { label: "Products", href: "/products" },
              { label: "BehaviorSchool Goal Writing System" }
            ]}
          />
        </nav>
        
        {/* Animated Content */}
        <AnimatedSections />

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8" aria-labelledby="iep-goal-examples">
          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
            <h2 id="iep-goal-examples" className="text-2xl font-semibold text-slate-900">
              Need examples before using the goal writer?
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
              Review measurable IEP behavior goal examples by function, then use the writer to adapt the goal to the student&apos;s baseline, setting, and progress-monitoring plan.
            </p>
            <Link
              href="/iep-behavior-goal-examples"
              className="mt-5 inline-flex rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
            >
              View IEP behavior goal examples
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
