import { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { CheckCircle, Target, Users, BookOpen } from "lucide-react";
import Link from "next/link";
import SimpleDownloadButton from "@/components/SimpleDownloadButton";

export const metadata: Metadata = {
  title: "ACT Matrix for Schools | Free PDF Download & Examples | Behavior School",
  description: "Free ACT Matrix PDF download with examples explained step-by-step. Complete guide for school behavior analysts with ACT values examples.",
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
    "act matrix",
    "act matrix pdf", 
    "act matrix example",
    "act matrix explained",
    "the act matrix",
    "what is the act matrix",
    "act values examples",
    "matrice act",
    "act matrix examples",
    "act values examples students",
    "what is in the act",
    "acceptance commitment therapy matrix",
    "act matrix schools",
    "act matrix students",
    "act matrix behavior analysis",
    "acceptance commitment training",
    "school based act matrix",
    "student values matrix",
    "behavioral flexibility matrix"
  ],
  openGraph: {
    title: "ACT Matrix for Schools | Free PDF Download & Examples | Behavior School",
    description: "Complete ACT Matrix guide for school-based behavior analysts. Free PDF download with examples, explained step-by-step. Learn how the ACT Matrix improves student values-based interventions in schools.",
    type: "website", 
    url: "https://behaviorschool.com/act-matrix",
    images: [
      {
        url: "https://behaviorschool.com/thumbnails/act-matrix-thumb.webp",
        width: 1200,
        height: 630,
        alt: "ACT Matrix for Schools - Free PDF Download with Examples"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "ACT Matrix for Schools | Free PDF Download & Examples | Behavior School",
    description: "Complete ACT Matrix guide for school-based behavior analysts. Free PDF download with examples, explained step-by-step. Learn how the ACT Matrix improves student values-based interventions in schools.",
    images: ["https://behaviorschool.com/thumbnails/act-matrix-thumb.webp"]
  },
  alternates: {
    canonical: "https://behaviorschool.com/act-matrix"
  }
};

// Structured data for the ACT Matrix guide
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "ACT Matrix for Schools: Complete Guide with Free PDF Download",
  "description": "Comprehensive guide to using the ACT Matrix in school settings for behavior analysts, including examples, implementation strategies, and free downloadable resources.",
  "image": "https://behaviorschool.com/thumbnails/act-matrix-thumb.webp",
  "author": {
    "@type": "Organization",
    "name": "Behavior School",
    "url": "https://behaviorschool.com"
  },
  "publisher": {
    "@type": "Organization", 
    "name": "Behavior School",
    "logo": {
      "@type": "ImageObject",
      "url": "https://behaviorschool.com/Logos/logo-gold-transparent.webp"
    }
  },
  "datePublished": "2025-09-02",
  "dateModified": "2025-09-02",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://behaviorschool.com/act-matrix"
  },
  "about": [
    {
      "@type": "Thing",
      "name": "ACT Matrix"
    },
    {
      "@type": "Thing",
      "name": "Acceptance and Commitment Therapy"
    },
    {
      "@type": "Thing",
      "name": "School-based behavior analysis"
    }
  ]
};

// HowTo Schema for using ACT Matrix
const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Use the ACT Matrix in School Settings",
  "description": "Step-by-step guide for implementing the ACT Matrix with students to improve psychological flexibility and values-based behavior",
  "image": "https://behaviorschool.com/thumbnails/act-matrix-thumb.webp",
  "totalTime": "PT30M",
  "estimatedCost": {
    "@type": "MonetaryAmount", 
    "currency": "USD",
    "value": "0"
  },
  "supply": [
    {
      "@type": "HowToSupply",
      "name": "ACT Matrix worksheet"
    },
    {
      "@type": "HowToSupply",
      "name": "Student workbook"
    }
  ],
  "step": [
    {
      "@type": "HowToStep",
      "name": "Identify Student Values",
      "text": "Help the student identify what matters most to them in their relationships, learning, and personal growth",
      "image": "https://behaviorschool.com/thumbnails/act-matrix-thumb.webp"
    },
    {
      "@type": "HowToStep",
      "name": "Explore Toward Moves",
      "text": "Identify behaviors and actions that move the student toward their values, even when difficult"
    },
    {
      "@type": "HowToStep", 
      "name": "Recognize Away Moves",
      "text": "Help student identify behaviors that move them away from their values in the short and long term"
    },
    {
      "@type": "HowToStep",
      "name": "Map Internal Experiences",
      "text": "Explore thoughts, feelings, and sensations that show up when moving toward or away from values"
    },
    {
      "@type": "HowToStep",
      "name": "Practice Values-Based Choices",
      "text": "Use the matrix to guide daily decisions and build psychological flexibility over time"
    }
  ]
};

// FAQ Schema
const faqSchema = {
  "@context": "https://schema.org", 
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the ACT Matrix?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The ACT Matrix is a visual tool from Acceptance and Commitment Therapy (ACT) that helps students organize their experiences around values-based living. It has four quadrants: behaviors toward values, behaviors away from values, helpful internal experiences, and unhelpful internal experiences. The matrix helps students make choices based on their values rather than just avoiding difficult feelings."
      }
    },
    {
      "@type": "Question",
      "name": "How do you use the ACT Matrix with students?",
      "acceptedAnswer": {
        "@type": "Answer", 
        "text": "Start by helping the student identify their core values (what matters most to them). Then explore behaviors that move them toward these values (toward moves) and behaviors that move them away (away moves). Finally, map the internal experiences (thoughts, feelings, sensations) that show up in each quadrant. Use this visual guide to help students make values-based choices in challenging situations."
      }
    },
    {
      "@type": "Question",
      "name": "What are some ACT values examples for students?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Common student values include: Being helpful to classmates, learning and growing, being honest and authentic, showing courage when speaking up, being kind to others, working hard toward goals, building friendships, being responsible, showing creativity, and being fair. Values are personally chosen qualities of action that give life meaning and purpose."
      }
    },
    {
      "@type": "Question",
      "name": "How is the ACT Matrix different from traditional behavior interventions?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Traditional behavior interventions often focus on eliminating problem behaviors through external rewards or consequences. The ACT Matrix focuses on building psychological flexibility - helping students choose behaviors based on their values even when experiencing difficult thoughts or feelings. This approach builds intrinsic motivation and long-term resilience rather than just compliance."
      }
    }
  ]
};

export default function ACTMatrixPage() {
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
              { label: "Resources", href: "/resources" },
              { label: "ACT Matrix Guide" }
            ]}
          />
        </nav>
        
        {/* Hero Section - Mobile Optimized */}
        <section className="pt-6 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Column - Text Content */}
              <div className="text-center lg:text-left">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 mb-4 lg:mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-emerald-700 to-emerald-500 bg-clip-text text-transparent">
                    ACT Matrix for Schools
                  </span>
                </h1>
                
                <h2 className="text-lg sm:text-xl lg:text-2xl text-slate-700 mb-4 font-medium leading-relaxed">
                  Complete guide with free PDF download, examples, and step-by-step implementation for school-based behavior analysts
                </h2>
                
                <p className="text-base sm:text-lg lg:text-xl text-slate-600 mb-6 lg:mb-8 leading-relaxed">
                  The ACT Matrix is a powerful visual tool that helps students make values-based choices even when experiencing difficult thoughts and feelings. Learn how to use this evidence-based intervention in your school practice.
                </p>
                
                <SimpleDownloadButton 
                  resource="act-matrix"
                  fileName="ACT-Matrix-for-Schools-Guide.pdf"
                  title="ACT Matrix for Schools Guide"
                  buttonText="Download Free ACT Matrix PDF"
                  className="bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 h-12 text-base font-semibold w-full"
                />
              </div>
              
              {/* Right Column - Matrix Diagram - Mobile Optimized */}
              <div className="flex justify-center lg:justify-end mt-8 lg:mt-0">
                <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg">
                  {/* ACT Matrix Diagram */}
                  <div className="bg-white border-2 border-slate-300 rounded-xl p-4 sm:p-6 lg:p-8 shadow-2xl">
                    <div className="grid grid-cols-2 gap-4 sm:gap-6 text-center relative">
                      {/* Horizontal line */}
                      <div className="absolute inset-x-0 top-1/2 border-t-2 border-slate-400 z-10"></div>
                      {/* Vertical line */}
                      <div className="absolute inset-y-0 left-1/2 border-l-2 border-slate-400 z-10"></div>
                      
                      {/* Top Left - Away Moves */}
                      <div className="pb-4 sm:pb-6 pr-2 sm:pr-4">
                        <div className="text-red-600 font-bold mb-2 text-sm sm:text-base">Away Moves</div>
                        <div className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          Avoiding challenges<br/>
                          Acting out<br/>
                          Giving up easily
                        </div>
                      </div>
                      
                      {/* Top Right - Toward Moves */}
                      <div className="pb-4 sm:pb-6 pl-2 sm:pl-4">
                        <div className="text-emerald-600 font-bold mb-2 text-sm sm:text-base">Toward Moves</div>
                        <div className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          Asking for help<br/>
                          Trying new things<br/>
                          Being kind to others
                        </div>
                      </div>
                      
                      {/* Bottom Left - Unhelpful Internal */}
                      <div className="pt-4 sm:pt-6 pr-2 sm:pr-4">
                        <div className="text-red-600 font-bold mb-2 text-sm sm:text-base">Unhelpful Internal</div>
                        <div className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          &quot;I&apos;m not smart enough&quot;<br/>
                          Feeling anxious<br/>
                          Fear of failure
                        </div>
                      </div>
                      
                      {/* Bottom Right - Helpful Internal */}
                      <div className="pt-4 sm:pt-6 pl-2 sm:pl-4">
                        <div className="text-emerald-600 font-bold mb-2 text-sm sm:text-base">Helpful Internal</div>
                        <div className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          &quot;I can learn from mistakes&quot;<br/>
                          Feeling confident<br/>
                          Curiosity about learning
                        </div>
                      </div>
                    </div>
                    
                    {/* Center Values Circle - Mobile Optimized */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-yellow-100 border-2 border-yellow-500 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shadow-lg">
                        <div className="text-yellow-800 font-bold text-xs sm:text-sm text-center px-1">Student Values</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What is ACT Matrix Section - Mobile Optimized */}
        <section className="py-12 lg:py-16 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 lg:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 lg:mb-4 leading-tight">
                What is the ACT Matrix? (Matrice ACT)
              </h2>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
                A simple yet powerful tool from Acceptance and Commitment Training (ACT) for helping students navigate challenges while staying connected to their values
              </p>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-slate-700 leading-relaxed mb-6">
                The ACT Matrix is a visual framework from Acceptance and Commitment Therapy (ACT) that helps students organize their experiences around what matters most to them. Unlike traditional behavior interventions that focus primarily on reducing problem behaviors, the ACT Matrix builds psychological flexibility - the ability to stay present with difficult experiences while choosing actions based on personal values.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 mb-8">
                <h3 className="text-2xl font-semibold text-blue-900 mb-4">Acceptance and Commitment Training (ACT) in Schools</h3>
                <p className="text-blue-800 mb-4">
                  Acceptance and Commitment Training represents the educational application of ACT principles, specifically adapted for school settings and student populations.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-3">Core Components:</h4>
                    <ul className="space-y-2 text-blue-800">
                      <li>• <strong>Acceptance:</strong> Learning to experience difficult thoughts and feelings without fighting them</li>
                      <li>• <strong>Commitment:</strong> Taking action guided by personal values even when it&apos;s difficult</li>
                      <li>• <strong>Training:</strong> Building skills through practice and repetition</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-3">School Applications:</h4>
                    <ul className="space-y-2 text-blue-800">
                      <li>• Social-emotional learning curricula</li>
                      <li>• Individual behavior support plans</li>
                      <li>• Classroom management strategies</li>
                      <li>• Student resilience building programs</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 my-8 lg:my-12">
                <div className="bg-white p-5 lg:p-6 rounded-lg shadow-lg border border-slate-200">
                  <h3 className="text-lg lg:text-xl font-semibold text-emerald-600 mb-4">The Four Quadrants</h3>
                  <ul className="space-y-3 text-slate-700">
                    <li className="flex items-start">
                      <span className="text-emerald-500 mr-2">→</span>
                      <span><strong>Toward Moves:</strong> Behaviors that move students toward their values</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">←</span>
                      <span><strong>Away Moves:</strong> Behaviors that move students away from their values</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-emerald-500 mr-2">✓</span>
                      <span><strong>Helpful Internal:</strong> Thoughts, feelings that support values-based action</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">✗</span>
                      <span><strong>Unhelpful Internal:</strong> Difficult thoughts, feelings that pull away from values</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white p-5 lg:p-6 rounded-lg shadow-lg border border-slate-200">
                  <h3 className="text-lg lg:text-xl font-semibold text-emerald-600 mb-4">Key Principles</h3>
                  <ul className="space-y-3 text-slate-700">
                    <li className="flex items-start">
                      <span className="text-yellow-500 mr-2">★</span>
                      <span>Values are at the center of all decisions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">◯</span>
                      <span>All internal experiences are normal and acceptable</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2">◆</span>
                      <span>Behavior choices can be values-based regardless of feelings</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">↑</span>
                      <span>Psychological flexibility grows through practice</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How to Use Section - Mobile Optimized */}
        <section className="py-12 lg:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 lg:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 lg:mb-4 leading-tight">
                How to Use the ACT Matrix with Students
              </h2>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
                A step-by-step process for implementing the ACT Matrix in school settings
              </p>
            </div>
            
            <div className="space-y-6 lg:space-y-8">
              {[
                {
                  step: "1",
                  title: "Start with Values Exploration",
                  description: "Help students identify what truly matters to them. Common student values include being helpful, learning new things, being kind, showing courage, and building friendships. Values are chosen qualities of action that give life meaning.",
                  icon: Target
                },
                {
                  step: "2", 
                  title: "Identify Toward Moves",
                  description: "Explore behaviors that move students toward their values, even when it's challenging. For example, if a student values learning, toward moves might include asking questions, trying difficult problems, or seeking help when stuck.",
                  icon: CheckCircle
                },
                {
                  step: "3",
                  title: "Recognize Away Moves", 
                  description: "Help students identify behaviors that move them away from their values in both the short and long term. Away moves often provide temporary relief but don't align with what the student truly cares about.",
                  icon: Users
                },
                {
                  step: "4",
                  title: "Map Internal Experiences",
                  description: "Explore the thoughts, feelings, and physical sensations that show up when moving toward or away from values. All experiences are normal - the key is learning to choose behavior based on values rather than just feelings.",
                  icon: BookOpen
                },
                {
                  step: "5",
                  title: "Practice Daily Choices",
                  description: "Use the completed matrix as a guide for daily decisions. When students face challenges, they can ask: 'What choice moves me toward my values right now?' This builds psychological flexibility over time.",
                  icon: Target
                }
              ].map((item, index) => (
                <div key={index} className="flex gap-4 sm:gap-6 items-start p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-slate-100">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-emerald-600 font-bold text-base sm:text-lg">{item.step}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 flex-shrink-0" />
                      <h3 className="text-lg sm:text-xl font-semibold text-slate-900 leading-tight">{item.title}</h3>
                    </div>
                    <p className="text-slate-700 leading-relaxed text-sm sm:text-base">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Examples Section */}
        <section id="examples" className="py-16 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                ACT Matrix Examples for Common School Scenarios
              </h2>
              <p className="text-lg text-slate-600">
                Real-world applications showing how the ACT Matrix helps students navigate typical challenges
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Example 1 - Academic Challenges */}
              <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200">
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">Student Struggling with Math</h3>
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <div className="inline-block bg-yellow-100 border border-yellow-400 rounded-full px-4 py-2">
                      <span className="text-yellow-800 font-semibold">Values: Learning & Growing</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm relative">
                    {/* Horizontal line */}
                    <div className="absolute inset-x-0 top-1/2 border-t border-slate-200 z-10"></div>
                    
                    <div className="border-r border-slate-200 pr-4">
                      <div className="text-red-500 font-semibold mb-2">Away Moves</div>
                      <ul className="text-slate-600 space-y-1">
                        <li>• Skipping math class</li>
                        <li>• Not doing homework</li>
                        <li>• Distracting others</li>
                      </ul>
                    </div>
                    
                    <div className="pl-4">
                      <div className="text-emerald-600 font-semibold mb-2">Toward Moves</div>
                      <ul className="text-slate-600 space-y-1">
                        <li>• Asking teacher for help</li>
                        <li>• Practicing problems</li>
                        <li>• Working with study group</li>
                      </ul>
                    </div>
                    
                    <div className="border-r border-slate-200 pr-4 pt-4">
                      <div className="text-red-500 font-semibold mb-2">Unhelpful Internal</div>
                      <ul className="text-slate-600 space-y-1">
                        <li>• &quot;I&apos;m terrible at math&quot;</li>
                        <li>• Feeling frustrated</li>
                        <li>• Fear of looking stupid</li>
                      </ul>
                    </div>
                    
                    <div className="pl-4 pt-4">
                      <div className="text-emerald-600 font-semibold mb-2">Helpful Internal</div>
                      <ul className="text-slate-600 space-y-1">
                        <li>• &quot;Mistakes help me learn&quot;</li>
                        <li>• Feeling curious</li>
                        <li>• Sense of challenge</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Example 2 - Social Challenges */}
              <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200">
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">Student with Social Anxiety</h3>
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <div className="inline-block bg-yellow-100 border border-yellow-400 rounded-full px-4 py-2">
                      <span className="text-yellow-800 font-semibold">Values: Friendship & Kindness</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm relative">
                    {/* Horizontal line */}
                    <div className="absolute inset-x-0 top-1/2 border-t border-slate-200 z-10"></div>
                    
                    <div className="border-r border-slate-200 pr-4">
                      <div className="text-red-500 font-semibold mb-2">Away Moves</div>
                      <ul className="text-slate-600 space-y-1">
                        <li>• Eating lunch alone</li>
                        <li>• Avoiding group work</li>
                        <li>• Staying quiet in class</li>
                      </ul>
                    </div>
                    
                    <div className="pl-4">
                      <div className="text-emerald-600 font-semibold mb-2">Toward Moves</div>
                      <ul className="text-slate-600 space-y-1">
                        <li>• Sitting with classmates</li>
                        <li>• Joining group activities</li>
                        <li>• Offering to help others</li>
                      </ul>
                    </div>
                    
                    <div className="border-r border-slate-200 pr-4 pt-4">
                      <div className="text-red-500 font-semibold mb-2">Unhelpful Internal</div>
                      <ul className="text-slate-600 space-y-1">
                        <li>• &quot;They&apos;ll reject me&quot;</li>
                        <li>• Feeling anxious</li>
                        <li>• Racing heart</li>
                      </ul>
                    </div>
                    
                    <div className="pl-4 pt-4">
                      <div className="text-emerald-600 font-semibold mb-2">Helpful Internal</div>
                      <ul className="text-slate-600 space-y-1">
                        <li>• &quot;Others feel nervous too&quot;</li>
                        <li>• Feeling hopeful</li>
                        <li>• Wanting connection</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ACT Values Examples Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                ACT Values Examples for Students
              </h2>
              <p className="text-lg text-slate-600">
                Common values that guide student behavior and decision-making in school settings
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-slate-50 rounded-xl p-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Learning & Growth Values</h3>
                <ul className="space-y-2 text-slate-700">
                  <li>• Being curious about new ideas</li>
                  <li>• Learning from mistakes</li>
                  <li>• Asking questions when confused</li>
                  <li>• Trying challenging tasks</li>
                  <li>• Seeking feedback to improve</li>
                  <li>• Reading and exploring topics</li>
                </ul>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Relationship Values</h3>
                <ul className="space-y-2 text-slate-700">
                  <li>• Being kind to classmates</li>
                  <li>• Helping others when they struggle</li>
                  <li>• Including everyone in activities</li>
                  <li>• Listening when others speak</li>
                  <li>• Sharing and cooperating</li>
                  <li>• Building genuine friendships</li>
                </ul>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Character Values</h3>
                <ul className="space-y-2 text-slate-700">
                  <li>• Being honest and truthful</li>
                  <li>• Taking responsibility for actions</li>
                  <li>• Showing courage in difficult situations</li>
                  <li>• Being fair and just</li>
                  <li>• Demonstrating perseverance</li>
                  <li>• Acting with integrity</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8">
              <h3 className="text-2xl font-semibold text-emerald-800 mb-4">How to Use ACT Values Examples</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-emerald-800 mb-3">For Students:</h4>
                  <ul className="space-y-2 text-emerald-700">
                    <li>• Choose 3-5 values that feel most important to you</li>
                    <li>• Think about how these values guide your daily choices</li>
                    <li>• Use values to make decisions when facing challenges</li>
                    <li>• Remember values when experiencing difficult emotions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-emerald-800 mb-3">For Behavior Analysts:</h4>
                  <ul className="space-y-2 text-emerald-700">
                    <li>• Help students identify personally meaningful values</li>
                    <li>• Connect behavior goals to student values</li>
                    <li>• Use values language in intervention planning</li>
                    <li>• Encourage values-based choice making</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ACT Matrix Explained Section */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                ACT Matrix Explained: Step-by-Step Guide
              </h2>
              <p className="text-lg text-slate-600">
                Understanding each component of the ACT Matrix and how it works in practice
              </p>
            </div>
            
            <div className="space-y-12">
              <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200">
                <h3 className="text-2xl font-semibold text-slate-900 mb-6">The Four Quadrants Explained</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-red-600 mb-3">Away Moves (Top Left)</h4>
                      <p className="text-slate-600 mb-3">
                        Behaviors that move students away from their values, often providing short-term relief but long-term problems.
                      </p>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <p className="text-red-800 font-medium mb-2">Examples:</p>
                        <ul className="text-red-700 space-y-1">
                          <li>• Avoiding difficult assignments</li>
                          <li>• Acting out to escape demands</li>
                          <li>• Withdrawing from social situations</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-red-600 mb-3">Unhelpful Internal (Bottom Left)</h4>
                      <p className="text-slate-600 mb-3">
                        Difficult thoughts, feelings, and sensations that can trigger away moves but are normal human experiences.
                      </p>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <p className="text-red-800 font-medium mb-2">Examples:</p>
                        <ul className="text-red-700 space-y-1">
                          <li>• &quot;I&apos;m not smart enough&quot;</li>
                          <li>• Anxiety about failing</li>
                          <li>• Fear of being judged</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-emerald-600 mb-3">Toward Moves (Top Right)</h4>
                      <p className="text-slate-600 mb-3">
                        Behaviors that move students toward their values, even when it feels difficult or uncomfortable.
                      </p>
                      <div className="bg-emerald-50 p-4 rounded-lg">
                        <p className="text-emerald-800 font-medium mb-2">Examples:</p>
                        <ul className="text-emerald-700 space-y-1">
                          <li>• Asking for help when stuck</li>
                          <li>• Trying new challenges</li>
                          <li>• Being kind to others</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-emerald-600 mb-3">Helpful Internal (Bottom Right)</h4>
                      <p className="text-slate-600 mb-3">
                        Thoughts, feelings, and sensations that support values-based action and psychological flexibility.
                      </p>
                      <div className="bg-emerald-50 p-4 rounded-lg">
                        <p className="text-emerald-800 font-medium mb-2">Examples:</p>
                        <ul className="text-emerald-700 space-y-1">
                          <li>• &quot;I can learn from this&quot;</li>
                          <li>• Feeling curious</li>
                          <li>• Sense of purpose</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200">
                <h3 className="text-2xl font-semibold text-slate-900 mb-6">Key Principles of the ACT Matrix</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-3">1. Values Are Central</h4>
                    <p className="text-slate-600">
                      All decisions and behaviors are evaluated based on whether they move toward or away from what truly matters to the student.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-3">2. All Feelings Are Normal</h4>
                    <p className="text-slate-600">
                      Difficult thoughts and emotions are part of human experience. The goal isn&apos;t to eliminate them but to act on values despite them.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-3">3. Choice Is Always Available</h4>
                    <p className="text-slate-600">
                      Even in difficult moments, students can choose behaviors that align with their values rather than just react to emotions.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-3">4. Flexibility Over Control</h4>
                    <p className="text-slate-600">
                      Instead of trying to control internal experiences, focus on developing flexibility to act on values regardless of how you feel.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Why Use the ACT Matrix in Schools?
              </h2>
              <p className="text-lg text-slate-600">
                Evidence-based benefits for both students and school-based behavior analysts
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Builds Intrinsic Motivation</h3>
                <p className="text-slate-600">
                  Students learn to make choices based on personal values rather than external rewards, leading to more sustainable behavior change.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Improves Emotional Regulation</h3>
                <p className="text-slate-600">
                  Students develop psychological flexibility - the ability to experience difficult emotions while still choosing helpful behaviors.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Easy to Implement</h3>
                <p className="text-slate-600">
                  Simple visual format that students understand quickly. Can be used in individual sessions, group work, or classroom settings.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Download CTA Section */}
        <section id="download" className="py-16 bg-gradient-to-r from-emerald-700 to-emerald-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Download Your Free ACT Matrix Resource Pack
            </h2>
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
              Get instant access to printable ACT Matrix worksheets, implementation guide, and real school examples. Perfect for BCBAs, school psychologists, and counselors.
            </p>
            
            <div className="bg-white rounded-lg p-6 mb-8 text-left max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Your free download includes:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mr-3 flex-shrink-0" />
                  <span className="text-slate-700">Printable ACT Matrix worksheets</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mr-3 flex-shrink-0" />
                  <span className="text-slate-700">Step-by-step implementation guide</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mr-3 flex-shrink-0" />
                  <span className="text-slate-700">Real school-based examples</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mr-3 flex-shrink-0" />
                  <span className="text-slate-700">Values exploration activities</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mr-3 flex-shrink-0" />
                  <span className="text-slate-700">Student handouts and exercises</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mr-3 flex-shrink-0" />
                  <span className="text-slate-700">Progress tracking templates</span>
                </div>
              </div>
            </div>
            
            <SimpleDownloadButton 
              resource="act-matrix"
              fileName="ACT-Matrix-for-Schools-Guide.pdf"
              title="ACT Matrix for Schools Guide"
              buttonText="Download Free ACT Matrix PDF Pack"
              className="bg-yellow-500 text-slate-900 hover:bg-yellow-400 text-lg font-semibold px-8 py-4"
            />
            
            <div className="mt-4 text-emerald-100 text-sm">
              Instant download • No spam • Used by 1000+ school professionals
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Frequently Asked Questions About the ACT Matrix
              </h2>
              <p className="text-lg text-slate-600">
                Common questions from school-based behavior analysts and other professionals
              </p>
            </div>
            
            <div className="space-y-6">
              {[
                {
                  question: "What is the ACT Matrix?",
                  answer: "The ACT Matrix is a visual tool from Acceptance and Commitment Therapy (ACT) that helps students organize their experiences around values-based living. It has four quadrants: behaviors toward values, behaviors away from values, helpful internal experiences, and unhelpful internal experiences. The matrix helps students make choices based on their values rather than just avoiding difficult feelings."
                },
                {
                  question: "How do you use the ACT Matrix with students?",
                  answer: "Start by helping the student identify their core values (what matters most to them). Then explore behaviors that move them toward these values (toward moves) and behaviors that move them away (away moves). Finally, map the internal experiences (thoughts, feelings, sensations) that show up in each quadrant. Use this visual guide to help students make values-based choices in challenging situations."
                },
                {
                  question: "What are some ACT values examples for students?",
                  answer: "Common student values include: Being helpful to classmates, learning and growing, being honest and authentic, showing courage when speaking up, being kind to others, working hard toward goals, building friendships, being responsible, showing creativity, and being fair. Values are personally chosen qualities of action that give life meaning and purpose."
                },
                {
                  question: "How is the ACT Matrix different from traditional behavior interventions?",
                  answer: "Traditional behavior interventions often focus on eliminating problem behaviors through external rewards or consequences. The ACT Matrix focuses on building psychological flexibility - helping students choose behaviors based on their values even when experiencing difficult thoughts or feelings. This approach builds intrinsic motivation and long-term resilience rather than just compliance."
                },
                {
                  question: "Can the ACT Matrix be used with younger students?",
                  answer: "Yes! The ACT Matrix can be adapted for students as young as elementary age. Use simpler language, visual aids, and concrete examples. For younger students, focus on basic concepts like 'what matters to you' and 'choices that help or hurt.' The visual nature of the matrix makes it accessible across age groups."
                },
                {
                  question: "How long does it take to complete an ACT Matrix with a student?",
                  answer: "An initial ACT Matrix session typically takes 30-45 minutes, but this varies based on the student's age and complexity of their situation. The matrix is often revisited and refined over multiple sessions as students develop greater self-awareness and psychological flexibility."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg border border-slate-200 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Resources Section */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Related Resources for School-Based Practice
              </h2>
              <p className="text-lg text-slate-600">
                Additional tools and guides to complement your ACT Matrix implementation
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-6 text-center">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Values-Based IEP Goals</h3>
                <p className="text-slate-600 mb-4">
                  Learn how to write IEP goals that incorporate student values for better engagement and outcomes.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/iep-goals">
                    Learn More
                  </Link>
                </Button>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-6 text-center">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">School-Based Behavior Support</h3>
                <p className="text-slate-600 mb-4">
                  Comprehensive guide to implementing positive behavior supports in school settings.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/transformation-program">
                    Learn More
                  </Link>
                </Button>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-6 text-center">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">BCBA Exam Prep</h3>
                <p className="text-slate-600 mb-4">
                  Study materials and practice questions specifically designed for school-based behavior analysts.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/bcba-exam-prep">
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}