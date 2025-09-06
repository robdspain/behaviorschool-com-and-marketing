import { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { AnimatedSections } from "./AnimatedSections";

export const metadata: Metadata = {
  title: "Values-Based IEP Goal Generator | Student-Centered SMART Goals | Behavior School",
  description: "Free values-based IEP goal generator. Students co-create SMART goals that reflect their values. Write behavior goals that stick.",
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
    "values-based iep goals",
    "student-centered iep goals",
    "iep goal generator",
    "free iep goal generator",
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
    "school district IEP tools",
    "values wizard iep",
    "student values iep goals",
    "autonomous motivation iep",
    "act therapy iep goals",
    "acceptance commitment training iep"
  ],
  openGraph: {
    title: "Values-Based IEP Goal Generator | Student-Centered SMART Goals | Behavior School",
    description: "Free values-based IEP goal generator. Students co-create goals that reflect their values (Brave, Kind, Focused). Write SMART IEP behavior goals that stick because they start with what students value most.",
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
    title: "Values-Based IEP Goal Generator | Student-Centered SMART Goals | Behavior School",
    description: "Free values-based IEP goal generator. Students co-create goals that reflect their values (Brave, Kind, Focused). Write SMART IEP behavior goals that stick because they start with what students value most.",
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
  "name": "Values-Based IEP Goal Generator",
  "description": "A free tool for creating student-centered, values-based IEP goals that drive autonomous motivation and lasting skill development",
  "url": "https://behaviorschool.com/iep-goals",
  "applicationCategory": "EducationalApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "availability": "InStock",
    "description": "Free access to the Values-Based IEP Goal Generator"
  },
  "audience": {
    "@type": "Audience",
    "audienceType": ["Special Education Teachers", "BCBAs", "School Districts", "Students"]
  },
  "provider": {
    "@type": "Organization",
    "name": "Behavior School",
    "url": "https://behaviorschool.com"
  },
  "about": [
    {
      "@type": "Thing",
      "name": "values-based IEP goals"
    },
    {
      "@type": "Thing", 
      "name": "student-centered IEP goals"
    },
    {
      "@type": "Thing",
      "name": "SMART IEP goals"
    },
    {
      "@type": "Thing",
      "name": "autonomous motivation"
    },
    {
      "@type": "Thing",
      "name": "ACT therapy IEP goals"
    }
  ]
};

// HowTo Schema for Values Wizard process
const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Create Values-Based IEP Goals Using the Values Wizard",
  "description": "Step-by-step process for creating student-centered, values-based IEP goals that drive autonomous motivation and lasting skill development",
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
      "name": "Values Wizard Tool"
    },
    {
      "@type": "HowToSupply", 
      "name": "Student Input"
    },
    {
      "@type": "HowToSupply",
      "name": "IEP Goal Template"
    }
  ],
  "tool": [
    {
      "@type": "HowToTool",
      "name": "Free IEP Goal Generator"
    }
  ],
  "step": [
    {
      "@type": "HowToStep",
      "name": "Student Values Selection",
      "text": "Students pick what matters most to them—like being Helpful, Brave, Focused, Kind, or Curious",
      "image": "https://behaviorschool.com/thumbnails/iep-goal-thumb.webp"
    },
    {
      "@type": "HowToStep", 
      "name": "Skill Suggestion",
      "text": "The Values Wizard suggests age-appropriate skills linked to the student's chosen values"
    },
    {
      "@type": "HowToStep",
      "name": "SMART Goal Generation",
      "text": "The system auto-generates Specific, Measurable, Achievable, Relevant, and Time-bound goals"
    },
    {
      "@type": "HowToStep",
      "name": "Generalization Planning",
      "text": "Built-in plans for multiple settings, people, and prompts to ensure skill transfer"
    },
    {
      "@type": "HowToStep",
      "name": "Customizable Maintenance",
      "text": "Customizable follow-up scheduling with your own benchmarks and intervals to ensure long-term skill retention"
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
      "name": "How do values-based goals improve student motivation?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "When students help choose goals that reflect their values (like being Brave, Kind, or Focused), they develop autonomous motivation. Research shows values-driven goals foster resilience and long-term follow-through, even when school gets hard."
      }
    },
    {
      "@type": "Question",
      "name": "What is the Values Wizard and how does it work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The Values Wizard is a simple tool where students pick what matters most to them—like being Helpful to peers, Curious in learning, or Brave when speaking up. The system then suggests age-appropriate skills linked to those values and generates SMART goals."
      }
    },
    {
      "@type": "Question",
      "name": "How do you ensure skills generalize across settings?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our tool builds generalization plans into every goal, including multiple settings, people, and prompts. Research shows generalization must be programmed on purpose, not left to chance. We include self-monitoring tools and variable reinforcement options."
      }
    },
    {
      "@type": "Question",
      "name": "What makes these goals different from compliance-based goals?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Instead of compliance-based goals that fade, values-based goals are anchored in meaning. Students don't just comply—they own their goals. Skills last longer when anchored to natural reinforcers like peer recognition or classroom roles."
      }
    },
    {
      "@type": "Question",
      "name": "How do you measure long-term skill maintenance?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our tool offers completely customizable objective benchmarks and maintenance intervals. You can set your own mastery criteria and schedule follow-up checks based on your specific needs. Research confirms skills persist longer when connected to student values and natural reinforcers rather than external rewards."
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
      
      <div className="min-h-screen bg-white">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumbs 
            items={[
              { label: "Products", href: "/products" },
              { label: "Values-Based IEP Goal Generator" }
            ]}
          />
        </nav>
        
        {/* Animated Content */}
        <AnimatedSections />
      </div>
    </>
  );
}