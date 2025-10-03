import { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { AnimatedSections } from "./AnimatedSections";

export const metadata: Metadata = {
  title: "🆓 FREE IEP Behavior Goal Writer | Full Goal Writer Coming Soon | Behavior School",
  description: "🎯 Use our FREE IEP behavior goal writer now! Create compliant behavior goals in minutes. Full IEP goal writer with academic & social goals coming soon. No registration required.",
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
    title: "Free IEP Behavior Goal Generator | Create Compliant Goals in Minutes | Behavior School",
    description: "Generate professional IEP behavior goals for free in under 5 minutes. Specialized for increasing positive behaviors and decreasing problem behaviors. No registration required - start creating now.",
    type: "website",
    url: "https://behaviorschool.com/iep-goals",
    images: [
      {
        url: "https://behaviorschool.com/thumbnails/iep-goal-thumb.webp",
        width: 1200,
        height: 630,
        alt: "Values-Based IEP Goal Generator - Student-Centered SMART Goals"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Free IEP Behavior Goal Generator | Create Compliant Goals in Minutes | Behavior School",
    description: "Generate professional IEP behavior goals for free in under 5 minutes. Specialized for increasing positive behaviors and decreasing problem behaviors. No registration required - start creating now.",
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
  "name": "Free IEP Behavior Goal Generator",
  "description": "A free tool for creating professional, compliant IEP behavior goals in under 5 minutes. Specialized for increasing positive behaviors and decreasing problem behaviors.",
  "url": "https://behaviorschool.com/iep-goals",
  "applicationCategory": "EducationalApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "availability": "InStock",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Free access to the IEP Behavior Goal Generator - no registration required"
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
  "name": "How to Generate Professional IEP Behavior Goals in Minutes",
  "description": "Step-by-step process for creating compliant, measurable IEP behavior goals using our free behavior goal generator tool",
  "image": "https://behaviorschool.com/thumbnails/iep-goal-thumb.webp",
  "totalTime": "PT10M",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": "0"
  },
  "supply": [
    {
      "@type": "HowToSupply",
      "name": "IEP Behavior Goal Generator"
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
      "name": "Free IEP Behavior Goal Generator"
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
      "text": "The tool automatically generates appropriate measurement standards based on behavior type and direction"
    },
    {
      "@type": "HowToStep",
      "name": "Add Baseline Data",
      "text": "Input current performance levels to establish starting point for progress monitoring"
    },
    {
      "@type": "HowToStep",
      "name": "Generate Professional Goal",
      "text": "Tool creates compliant, measurable IEP goal with built-in quality assurance validation"
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
        "text": "Use a straightforward step-by-step flow to create professional IEP behavior goals in under 5 minutes. Define the target behavior, set measurement criteria, add baseline data, and generate compliant goals—no registration required."
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
        "text": "Yes, all goals include specific, measurable criteria that meet IEP compliance standards. The tool has built-in validation rules and a 5-level quality meter to ensure goals are legally compliant and educationally sound."
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
        <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumbs 
            items={[
              { label: "Products", href: "/products" },
              { label: "Free IEP Behavior Goal Generator" }
            ]}
          />
        </nav>
        
        {/* Animated Content */}
        <AnimatedSections />
      </div>
    </>
  );
}
