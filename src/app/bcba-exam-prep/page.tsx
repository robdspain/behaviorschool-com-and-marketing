"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmailSignupPopup } from "@/components/ui/email-signup-popup";
import { CheckCircle, BookOpen, Users, Target, Download, Clock, ArrowRight, Info, ChevronDown, ChevronUp, BarChart3, Calendar, Brain, TrendingUp } from "lucide-react";

export default function BCBAExamPrepPage() {
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [activeStatPopup, setActiveStatPopup] = useState<number | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const realStats = [
    {
      value: "54%",
      label: "National First-Time Pass Rate",
      description: "2024 BCBA exam first-time pass rate",
      source: "BACB (Behavior Analyst Certification Board) 2024 annual data report. In 2024, among 9,911 first-time test-takers, only 54% passed, resulting in 8,164 newly certified BCBAs. This represents a significant decline from 65% in 2020 and 60% in 2021.",
      year: "2024",
      sourceLink: "https://www.bacb.com/about/bacb-certificant-annual-report-data/"
    },
    {
      value: "25%",
      label: "Retake Pass Rate", 
      description: "Success rate for second-attempt candidates",
      source: "BACB 2024 annual data report shows retake pass rates remain significantly lower at around 25%, highlighting the uphill battle for second-attempt test-takers. This emphasizes the critical importance of passing on the first try.",
      year: "2024",
      sourceLink: "https://www.bacb.com/about/bacb-certificant-annual-report-data/"
    },
    {
      value: "64%",
      label: "Historical Average",
      description: "Average pass rate from 2017-2020",
      source: "Research published in the journal Behavior Analysis in Practice (2021) found historical BCBA exam pass rates averaged 64% from 2017–2020. This peer-reviewed study by Dubuque & Kazemi investigated BCBA exam pass rates as a quality indicator of ABA training programs, showing a declining trend in recent years.",
      year: "2017-2020",
      sourceLink: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9582067/"
    },
  ];


  const studyResources = [
    {
      title: "BCBA Practice Exam (160 Questions)",
      description: "Full-length practice test with detailed explanations",
      type: "Practice Test",
      duration: "4 hours"
    },
    {
      title: "School-Based BCBA Study Guide", 
      description: "Comprehensive guide focused on education settings",
      type: "Study Guide",
      duration: "200+ pages"
    },
    {
      title: "Ethics in Schools Quick Reference",
      description: "Essential ethics scenarios for school-based BCBAs", 
      type: "Reference Guide",
      duration: "50 pages"
    }
  ];

  const faqData = [
    {
      question: "What is the BCBA exam pass rate in 2024?",
      answer: "In 2024, the first-time BCBA pass rate was 54% and the retake pass rate was 25% (BACB Annual Data). First-time pass rates have trended from 66% (2020) → 60% (2021) → 55% (2022) → 56% (2023) → 54% (2024), which emphasizes the importance of thorough preparation for your first attempt."
    },
    {
      question: "How many hours should I study for the BCBA exam?",
      answer: "Many candidates plan ~200–500 hours over 3–6 months; adjust based on baseline skills. Consider 2–3 focused hours/day, with an intensified final month. (This is guidance from exam prep providers and candidate experience, not an official BACB recommendation.)"
    },
    {
      question: "What are the hardest sections of the BCBA exam?",
      answer: "The most heavily weighted and conceptually demanding sections are typically: 1) Experimental Design (7% of exam) - requires strong research methodology knowledge, 2) Measurement, Data Display, and Interpretation (12% of exam) - technical statistical concepts, and 3) Ethical & Professional Issues (13%), Behavior Assessment (13%) - complex scenario-based questions requiring nuanced understanding of the BACB ethics code and assessment procedures."
    },
    {
      question: "How long is the BCBA certification exam?",
      answer: "The BCBA exam has 185 questions (175 scored + 10 unscored) and a 4-hour time limit. Largest sections: Behavior-Change Procedures (14%) and Concepts & Principles (14%); also Ethics (13%), Behavior Assessment (13%), Measurement (12%), Experimental Design (7%), plus three additional domains."
    },
    {
      question: "What happens if I fail the BCBA exam?",
      answer: "If you don't pass, you can retake after 30 days; up to 8 attempts within your 2-year authorization. The retake pass rate is only 25% according to 2024 BACB data, which emphasizes why comprehensive preparation for your first attempt is crucial."
    },
    {
      question: "How can school-based BCBAs prepare differently?",
      answer: "Prioritize Experimental Design, Measurement & data interpretation, and high-impact procedures (e.g., FCT, token economies, discrete-trial/other trial-based procedures)—all emphasized in the TCO. These areas may receive less emphasis in typical school-based practice but are explicitly represented in the Task Content Outline."
    }
  ];

  // Structured data for FAQ
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  // Organization schema for Behavior School LLC
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Behavior School LLC",
    "alternateName": "Behavior School",
    "url": "https://behaviorschool.com",
    "logo": "https://behaviorschool.com/Logos/logo-gold-transparent.webp",
    "description": "Leading provider of behavior analysis training and BCBA exam preparation for school-based professionals",
    "foundingDate": "2020",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "url": "https://behaviorschool.com/contact"
    },
    "sameAs": [
      "https://behaviorschool.com"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "BCBA Training Programs",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Course",
            "name": "BCBA Exam Prep Study Guide",
            "description": "Free comprehensive BCBA exam study guide for school-based behavior analysts",
            "provider": {
              "@type": "Organization",
              "name": "Behavior School LLC"
            }
          },
          "price": "0",
          "priceCurrency": "USD"
        }
      ]
    },
    "specialty": [
      "Behavior Analysis",
      "BCBA Certification",
      "School-Based Behavior Support",
      "Applied Behavior Analysis Training"
    ]
  };

  // Course schema for BCBA Exam Prep
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "BCBA Exam Prep for School-Based BCBAs",
    "description": "Comprehensive BCBA certification exam preparation specifically designed for school-based behavior analysts. Includes study materials, practice tests, and proven strategies.",
    "provider": {
      "@type": "Organization",
      "name": "Behavior School LLC",
      "url": "https://behaviorschool.com"
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "instructor": {
        "@type": "Organization",
        "name": "Behavior School LLC"
      }
    },
    "educationalCredentialAwarded": "BCBA Exam Preparation Certificate",
    "audience": {
      "@type": "EducationalAudience",
      "educationalRole": "student",
      "audienceType": "Behavior Analysts, School Psychologists, Special Education Professionals"
    },
    "learningResourceType": "Study Guide",
    "inLanguage": "en-US",
    "isAccessibleForFree": true,
    "keywords": [
      "BCBA exam prep",
      "behavior analyst certification",
      "school-based BCBA",
      "applied behavior analysis",
      "BACB certification"
    ],
    "teaches": [
      "BCBA exam content areas",
      "Behavior assessment techniques", 
      "Intervention planning",
      "Ethics in behavior analysis",
      "Research methodology",
      "Data analysis and interpretation"
    ]
  };

  // Product schema for BCBA Study Package
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "BCBA Exam Study Package",
    "description": "Complete BCBA certification exam study package including practice test, study guides, and reference materials designed for school-based behavior analysts",
    "brand": {
      "@type": "Brand",
      "name": "Behavior School"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "url": "https://behaviorschool.com/bcba-exam-prep"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    },
    "category": "Educational Material",
    "audience": {
      "@type": "EducationalAudience",
      "educationalRole": "BCBA Candidate"
    },
    "hasPart": [
      {
        "@type": "CreativeWork",
        "name": "BCBA Practice Exam (160 Questions)",
        "description": "Full-length practice test with detailed explanations",
        "learningResourceType": "Practice Test"
      },
      {
        "@type": "CreativeWork", 
        "name": "School-Based BCBA Study Guide",
        "description": "Comprehensive guide focused on education settings",
        "learningResourceType": "Study Guide"
      },
      {
        "@type": "CreativeWork",
        "name": "Ethics in Schools Quick Reference", 
        "description": "Essential ethics scenarios for school-based BCBAs",
        "learningResourceType": "Reference Guide"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50">
      {/* FAQ Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      
      {/* Organization Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      
      {/* Course Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      
      {/* Product Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {/* Hero Section */}
      <section className="pt-20 md:pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
                <span className="bg-gradient-to-r from-emerald-700 to-emerald-500 bg-clip-text text-transparent">
                  BCBA Exam Prep for School-Based Behavior Analysts
                </span>
              </h1>
              
              <h2 className="text-2xl text-slate-700 mb-4 font-medium">
                Free study guide, adaptive practice questions, and analytics designed to help school-based BCBAs pass the exam on the first attempt.
              </h2>
              
              <p className="text-xl text-slate-600 mb-8">
                The profession is growing rapidly—but passing the exam is the biggest hurdle. Get comprehensive study materials, practice tests, and proven strategies designed specifically for school-based behavior analysts.
              </p>
              
              <div className="flex justify-center lg:justify-start">
                <Button 
                  size="lg" 
                  onClick={() => setIsSignupOpen(true)}
                  className="bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 
                             transform hover:scale-105 transition-all duration-300 ease-out
                             hover:shadow-xl shadow-lg
                             text-lg font-semibold px-8 py-4"
                >
                  <span className="hidden sm:inline text-lg">Download Free Study Guide – Pass the BCBA Exam Faster</span>
                  <span className="sm:hidden text-lg">Get Free Study Guide</span>
                  <Download className="ml-3 w-6 h-6 transition-transform hover:translate-x-1" />
                </Button>
              </div>
            </div>
            
            {/* Right Column - Image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <img
                  src="/optimized/BehaviorStudyTools/bcbaq-first-time-falling.webp"
                  alt="BCBA exam statistics showing declining pass rates - first-time candidates struggling with certification requirements"
                  className="w-full max-w-lg h-auto rounded-2xl shadow-2xl"
                  loading="eager"
                  width={1536}
                  height={1024}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Stats Section */}
      <section className="py-16 bg-white relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
              BCBA Exam Pass Rate Reality Check
            </h2>
            <p className="text-lg text-slate-600 mb-4">
              Official BACB statistics reveal the true challenge
            </p>
            <p className="text-base text-slate-700 max-w-4xl mx-auto leading-relaxed">
              Understanding BCBA exam pass rates 2024 is crucial for your preparation strategy. The first-time BCBA exam pass rate has declined significantly, with only 54% of candidates passing on their initial attempt. The retake pass rate remains even lower at just 25%, making thorough preparation for your first attempt essential. These official BACB statistics highlight why strategic study planning and comprehensive practice are critical for BCBA certification success.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {realStats.map((stat, index) => (
              <div key={index} className="relative">
                <div className="bg-slate-50 rounded-lg p-6 text-center border-2 border-transparent hover:border-emerald-200 transition-colors">
                  <div className="relative mb-4">
                    <button
                      onClick={() => setActiveStatPopup(activeStatPopup === index ? null : index)}
                      className="absolute top-0 right-0 text-slate-400 hover:text-emerald-600 transition-colors"
                      aria-label="Show source information"
                    >
                      <Info className="w-5 h-5" />
                    </button>
                    <div className="text-4xl font-bold text-slate-800 mb-2">{stat.value}</div>
                  </div>
                  <div className="text-slate-600 text-sm font-medium mb-1">{stat.label}</div>
                  <div className="text-xs text-slate-500">({stat.year})</div>
                </div>
                
                {/* Popup */}
                {activeStatPopup === index && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-200 p-4 z-10">
                    <div className="relative">
                      <button
                        onClick={() => setActiveStatPopup(null)}
                        className="absolute top-0 right-0 text-slate-400 hover:text-slate-600 text-lg leading-none"
                        aria-label="Close popup"
                      >
                        ×
                      </button>
                      <h4 className="font-semibold text-slate-900 mb-2 pr-6">{stat.description}</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">{stat.source}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
        </div>
        
        {/* Overlay to close popups */}
        {activeStatPopup !== null && (
          <div
            className="fixed inset-0 z-5"
            onClick={() => setActiveStatPopup(null)}
          />
        )}
      </section>

      {/* Platform Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              BCBA Exam Prep Tools Built on Behavioral Science
            </h2>
            <p className="text-lg text-slate-600">
              Evidence-based learning technology designed specifically for BCBA candidates
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Smart Practice Block */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <Brain className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-4 text-center">Smart Practice</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Unlimited AI-Generated Questions</h4>
                    <p className="text-sm text-slate-600">Never run out of practice material with unique questions across all 9 content domains</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <TrendingUp className="w-5 h-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Adaptive Difficulty Technology</h4>
                    <p className="text-sm text-slate-600">Questions automatically adjust to your knowledge level for optimal learning</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Data-Driven Prep Block */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <BarChart3 className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-4 text-center">Data-Driven Prep</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <BarChart3 className="w-5 h-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Performance Analytics</h4>
                    <p className="text-sm text-slate-600">Track progress across all content areas and identify weak spots instantly</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Personalized Study Plans</h4>
                    <p className="text-sm text-slate-600">Custom pacing guides tailored to your exam date and current knowledge</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Evidence-Based Learning Block */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <BookOpen className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-4 text-center">Evidence-Based Learning</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Brain className="w-5 h-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Spaced Repetition & Active Recall</h4>
                    <p className="text-sm text-slate-600">Built on proven learning techniques to maximize retention</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Users className="w-5 h-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Supervisor Progress Reports</h4>
                    <p className="text-sm text-slate-600">Share detailed analytics with supervisors to demonstrate commitment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof Section */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Why School-Based BCBAs Choose Behavior Study Tools</h2>
              <p className="text-lg text-slate-600">Study smarter with data-driven insights and personalized learning designed for BCBA exam success</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-emerald-600 mb-2">Focused</div>
                <div className="text-slate-600">Candidates reduce study time by knowing exactly where they stand on each topic and content domain</div>
              </div>
              
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-emerald-600 mb-2">Flexible</div>
                <div className="text-slate-600">School-based BCBAs appreciate 24/7 access across all devices to study around their demanding schedules</div>
              </div>
              
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-emerald-600 mb-2">Results</div>
                <div className="text-slate-600">Users see measurable improvement in their first week with immediate feedback and comprehensive progress tracking</div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
                <p className="text-emerald-800 font-medium">✓ Designed by practicing BCBAs who understand the exam demands</p>
                <p className="text-emerald-700 text-sm">✓ Risk-free start with comprehensive free access before upgrading</p>
              </div>
              
              <Button 
                size="lg"
                onClick={() => setIsSignupOpen(true)}
                className="bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 
                           transform hover:scale-105 transition-all duration-300 ease-out
                           hover:shadow-xl shadow-lg text-lg font-semibold px-8 py-4"
              >
                Start Free BCBA Practice Questions Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Behavior Study Tools CTA Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-700 to-emerald-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Get Started with Behavior Study Tools
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Access unlimited practice questions, adaptive learning technology, and comprehensive analytics. Start your journey to BCBA certification success today with our evidence-based study platform.
          </p>
          <div className="flex justify-center">
            <Button 
              size="lg"
              asChild
              className="bg-yellow-500 text-slate-900 hover:bg-yellow-400 px-8 py-4 text-lg font-semibold"
            >
              <Link href="https://study.behaviorschool.com/product-tour/Welcome" target="_blank" rel="noopener noreferrer">
                Start Free Practice Questions
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
          <div className="mt-6 text-emerald-100 text-sm">
            Free access • Unlimited questions • Personalized study plans • Mobile optimized
          </div>
        </div>
      </section>

      {/* Study Resources Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              BCBA Exam Study Package (Practice Test + Study Guides)
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need to pass your BCBA exam with confidence
            </p>
          </div>
          
          <div className="space-y-6">
            {studyResources.map((resource, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-lg border border-slate-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-medium rounded-full mr-3">
                        {resource.type}
                      </span>
                      <div className="flex items-center text-slate-500">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="text-sm">{resource.duration}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      {resource.title}
                    </h3>
                    <p className="text-slate-600">
                      {resource.description}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="ml-4">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button 
              size="lg"
              onClick={() => setIsSignupOpen(true)} 
              className="bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700"
            >
              Download Free Study Package
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why BCBA Candidates Choose Our Platform
            </h2>
            <p className="text-lg text-slate-600">
              Comprehensive preparation designed to help you succeed on the BCBA exam
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Comprehensive Content</h3>
              <p className="text-slate-600">
                Questions and scenarios covering all 9 content domains of the BCBA Task Content Outline with detailed explanations.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Data-Driven Approach</h3>
              <p className="text-slate-600">
                Track your performance across content areas with detailed analytics to focus your study time where it matters most.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Expert Design</h3>
              <p className="text-slate-600">
                Created by practicing BCBAs with deep understanding of the certification exam and behavioral science principles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-600 mb-4">
              Here are the most common questions about the BCBA exam and how to prepare effectively.
            </p>
          </div>
          
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg border border-slate-200">
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-slate-50 transition-colors"
                  aria-expanded={activeFaq === index}
                >
                  <h3 className="text-lg font-semibold text-slate-900 pr-4">
                    {faq.question}
                  </h3>
                  {activeFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                
                {activeFaq === index && (
                  <div className="px-6 pb-4">
                    <div className="border-t border-slate-100 pt-4">
                      <p className="text-slate-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button 
              size="lg"
              onClick={() => setIsSignupOpen(true)}
              className="bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700
                         transform hover:scale-105 transition-all duration-300 ease-out
                         hover:shadow-xl shadow-lg
                         text-lg font-semibold px-8 py-4"
            >
              Download Free Study Guide – Pass Faster
              <Download className="ml-3 w-6 h-6 transition-transform hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-700 to-emerald-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Beat the 54% Pass Rate?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of successful school-based BCBAs who started their journey with our comprehensive exam prep program.
          </p>
          <Button 
            size="lg"
            onClick={() => setIsSignupOpen(true)}
            className="bg-yellow-500 text-slate-900 hover:bg-yellow-400"
          >
            Get Free Study Guide →
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Newsletter Signup Popup */}
      <EmailSignupPopup
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        title="Download Your Free BCBA Study Guide"
        description="Get our comprehensive study guide with practice questions, exam strategies, and school-specific scenarios to help you pass on the first try."
        pageSource="/bcba-exam-prep"
        showNameField={true}
        buttonText="Download Study Guide"
        successMessage="Check your email! Your BCBA study guide is on its way."
      />
    </div>
  );
}