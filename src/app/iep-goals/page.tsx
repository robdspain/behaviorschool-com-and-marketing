import { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ClientCTA } from "./ClientCTA";
import { AnimatedSections } from "./AnimatedSections";

export const metadata: Metadata = {
  title: "IEP Behavior Goals | Write Effective Behavior Goal IEP | Behavior School",
  description: "Transform vague IEP behavior goals into clear, measurable objectives. Our tool helps teachers and BCBAs write effective behavior goal IEP that drive student success. Join the waitlist.",
  keywords: [
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
    title: "IEP Behavior Goals | Write Effective Behavior Goal IEP | Behavior School",
    description: "Transform vague IEP behavior goals into clear, measurable objectives. Join thousands of educators writing better behavior goal IEP.",
    type: "website",
    url: "https://behaviorschool.com/iep-goals",
    images: [
      {
        url: "https://behaviorschool.com/thumbnails/iep-goal-thumb.webp",
        width: 1200,
        height: 630,
        alt: "IEP Behavior Goals - Write Effective Behavior Goal IEP"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "IEP Behavior Goals | Write Effective Behavior Goal IEP | Behavior School",
    description: "Transform vague IEP behavior goals into clear, measurable objectives. Join thousands of educators writing better behavior goal IEP.",
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
  "name": "IEP Behavior Goals Writer Tool",
  "description": "A tool for writing effective, measurable IEP behavior goals that drive student success",
  "url": "https://behaviorschool.com/iep-goals",
  "applicationCategory": "EducationalApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "availability": "PreOrder",
    "description": "Join the waitlist for early access to the IEP Behavior Goals Writer Tool"
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
      
      <div className="min-h-screen bg-white">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumbs 
            items={[
              { label: "Products", href: "/products" },
              { label: "IEP Behavior Goals" }
            ]}
          />
        </nav>
        
        {/* Animated Content */}
        <AnimatedSections />
      </div>
    </>
  );
}