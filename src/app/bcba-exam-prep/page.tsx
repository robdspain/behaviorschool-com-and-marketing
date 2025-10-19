"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { EmailSignupPopup } from "@/components/ui/email-signup-popup";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CheckCircle, BookOpen, Users, Target, ArrowRight, Info, ChevronDown, ChevronUp, BarChart3, Calendar, Brain, TrendingUp } from "lucide-react";

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



  const faqData = [
    {
      question: "What is the BCBA exam pass rate in 2024?",
      answer: "In 2024, the first-time BCBA pass rate was 54% and the retake pass rate was 25% (BACB Annual Data). First-time pass rates have trended from 66% (2020) → 60% (2021) → 55% (2022) → 56% (2023) → 54% (2024), which emphasizes the importance of thorough preparation for your first attempt."
    },
    {
      question: "How many hours should I study for the BCBA exam?",
      answer: "Most BCBA candidates study 300-500 hours over 3-6 months. Create a BCBA exam study schedule with 2-3 focused hours daily, then intensify in the final month. Adjust based on your baseline ABA knowledge and learning pace. Consistent daily practice with adaptive questions helps maximize retention more than marathon cramming sessions."
    },
    {
      question: "What is the best BCBA exam study schedule?",
      answer: "An effective BCBA study schedule breaks down 300-500 hours across 3-6 months: Month 1-2 (Foundation): Cover all 9 content domains with 2 hours/day. Month 3-4 (Depth): Focus on weak areas identified through practice tests, 2-3 hours/day. Month 5 (Integration): Full-length mock exams weekly. Final month: Daily practice with mixed questions and timed tests. Track your progress across domains to adjust your schedule and ensure comprehensive coverage."
    },
    {
      question: "What are the hardest sections of the BCBA exam?",
      answer: "The hardest BCBA exam sections are: 1) Experimental Design (7% of exam) - requires strong research methodology knowledge, 2) Measurement, Data Display, and Interpretation (12%) - technical statistical concepts, and 3) Ethical & Professional Issues (13%) and Behavior Assessment (13%) - complex scenario-based questions requiring nuanced understanding. These sections have the lowest average scores and require the most study time."
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
      answer: "School-based BCBAs should prioritize Experimental Design, Measurement & data interpretation, and procedures less common in schools (e.g., FCT, token economies, discrete-trial training). Study school-specific scenarios for ethics questions and practice translating clinical ABA terminology to educational settings. Our platform includes school-focused practice questions that bridge this gap."
    },
    {
      question: "Where can I find free BCBA practice exam questions?",
      answer: "Behavior School offers unlimited free BCBA practice questions with detailed explanations across all 9 content domains. Our AI-powered question bank adapts to your knowledge level and provides instant feedback. Start with our free 10-question diagnostic exam, then access the full adaptive practice platform at no cost."
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
    "description": "Leading provider of FREE AI-powered BCBA exam preparation, practice questions, and adaptive study tools for school-based behavior analysts.",
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
          "name": "BCBA Exam Prep Study Guide",
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
    ],
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "url": "https://behaviorschool.com/bcba-exam-prep"
    }
  };

  // Product schema for BCBA Study Package
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "BCBA Exam Study Package",
    "description": "Complete BCBA certification exam study package including practice test, study guides, and reference materials designed for school-based behavior analysts",
    "image": "https://behaviorschool.com/optimized/BehaviorStudyTools/bcbaq-first-time-falling.webp",
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
      "ratingValue": "4.7",
      "reviewCount": "89",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Jessica Martinez"
        },
        "datePublished": "2024-12-10",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "The free BCBA practice exam was exactly what I needed to identify my weak areas. The detailed explanations helped me understand concepts I had struggled with."
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "David Thompson"
        },
        "datePublished": "2024-11-22",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "As a school-based BCBA candidate, the school-focused study materials were invaluable. Passed my exam on the first try!"
      }
    ],
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
    <div className="min-h-screen bg-bs-background">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
        <Breadcrumbs 
          items={[
            { label: "BCBA Exam Prep" }
          ]}
        />
      </div>
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
                <strong>100% FREE</strong> unlimited BCBA practice questions with AI-adaptive difficulty, detailed analytics, and a proven study schedule.
              </h2>

              <p className="text-xl text-slate-600 mb-8">
                With only 54% passing in 2024, you need smarter prep. Get FREE AI-powered practice exams, customized study schedule (300-500 hours over 3-6 months), and school-specific scenarios designed for behavior analysts in education.
              </p>
              
              <div className="flex justify-center lg:justify-start">
                <Button 
                  size="lg" 
                  asChild
                  className="bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 
                             transform hover:scale-105 transition-all duration-300 ease-out
                             hover:shadow-xl shadow-lg
                             text-lg font-semibold px-8 py-4"
                >
                  <Link href="https://study.behaviorschool.com/auth?mode=signup&source=bcba-exam-prep-page" target="_blank" rel="noopener noreferrer">
                    <span className="hidden sm:inline text-lg">🎯 Start FREE Practice Questions – No Credit Card</span>
                    <span className="sm:hidden text-lg">Start FREE Now</span>
                    <ArrowRight className="ml-3 w-6 h-6 transition-transform hover:translate-x-1" />
                  </Link>
                </Button>
              </div>

              <div className="mt-4 flex justify-center lg:justify-start">
                <Link 
                  href="/free-bcba-practice-exam"
                  className="inline-flex items-center text-emerald-700 hover:text-emerald-800 font-semibold"
                >
                  Free BCBA Practice Exam (10 Questions)
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
            
            {/* Right Column - Image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <Image
                  src="/BehaviorStudyTools/before-after-behaviorstudytools.webp"
                  alt="Before and after using Behavior Study Tools - BCBA exam prep transformation showing improved pass rates and confidence"
                  className="w-full max-w-lg h-auto rounded-2xl shadow-2xl"
                  loading="eager"
                  width={1184}
                  height={864}
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
              Understanding BCBA exam pass rates 2024 is crucial for your study schedule planning. The first-time BCBA exam pass rate has declined to 54% (down from 66% in 2020), with only 25% of retakers passing. These hardest-ever BCBA exam statistics from official BACB data show why you need 300-500 focused study hours, adaptive practice questions across all 9 content domains, and a proven BCBA exam study schedule to pass on your first attempt.
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

          {/* Founder Message Section */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Why I Built These BCBA Study Tools</h2>
              <p className="text-lg text-slate-600 italic">&ldquo;After 20 years as a school-based BCBA, I saw too many talented candidates struggle with generic exam prep that didn&apos;t address our unique challenges.&rdquo;</p>
              <p className="text-sm text-slate-500 mt-2">— Rob Spain, BCBA, Founder of Behavior School</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-emerald-600 mb-2">Focused</div>
                <div className="text-slate-600">Know exactly where you stand on each topic and content domain to reduce wasted study time</div>
              </div>

              <div className="text-center p-4">
                <div className="text-3xl font-bold text-emerald-600 mb-2">Flexible</div>
                <div className="text-slate-600">Study 24/7 across all devices around your demanding school schedule</div>
              </div>

              <div className="text-center p-4">
                <div className="text-3xl font-bold text-emerald-600 mb-2">Results</div>
                <div className="text-slate-600">Track measurable improvement from day one with immediate feedback and comprehensive analytics</div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
                <p className="text-emerald-800 font-medium">✓ Created by a practicing school BCBA with 20+ years experience</p>
                <p className="text-emerald-700 text-sm">✓ Start completely free with unlimited practice questions</p>
              </div>

              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700
                           transform hover:scale-105 transition-all duration-300 ease-out
                           hover:shadow-xl shadow-lg text-lg font-semibold px-8 py-4"
              >
                <Link href="https://study.behaviorschool.com/auth?mode=signup&source=bcba-exam-prep-page" target="_blank" rel="noopener noreferrer">
                  Start Free BCBA Practice Questions Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
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
            Access unlimited practice questions, adaptive learning technology, and comprehensive analytics. Explore our complete toolkit of BCBA study resources.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              asChild
              className="bg-white text-emerald-700 hover:bg-emerald-50 px-8 py-4 text-lg font-semibold border-2 border-white shadow-lg"
            >
              <Link href="https://study.behaviorschool.com/product-tour/Welcome" target="_blank" rel="noopener noreferrer">
                Start Free Practice Questions
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              asChild
              className="bg-white text-emerald-700 hover:bg-emerald-50 px-8 py-4 text-lg font-semibold border-2 border-white"
            >
              <Link href="/bcba-study-tools">
                View All Study Tools
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
          <div className="mt-6 text-emerald-100 text-sm">
            Free access • Unlimited questions • Personalized study plans • Mobile optimized
          </div>
        </div>
      </section>

      {/* Practice Platform Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Free BCBA Exam Practice Questions
            </h2>
            <p className="text-lg text-slate-600 mb-4">
              Get unlimited free BCBA practice questions with adaptive difficulty and instant feedback
            </p>
            <p className="text-base text-slate-700 max-w-3xl mx-auto leading-relaxed">
              Start with our <Link href="/free-bcba-practice-exam" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">free 10-question practice exam</Link> or access unlimited AI-powered questions that adapt to your knowledge level across all 9 content domains.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-lg p-6 shadow-lg border border-slate-200 text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Unlimited Questions</h3>
              <p className="text-slate-600">Access thousands of BCBA practice questions across all content areas with detailed explanations.</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-lg border border-slate-200 text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Performance Analytics</h3>
              <p className="text-slate-600">Track your progress and identify weak areas with comprehensive performance data.</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-lg border border-slate-200 text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Adaptive Learning</h3>
              <p className="text-slate-600">Questions adapt to your knowledge level for optimal learning and exam preparation.</p>
            </div>
          </div>
          
          <div className="text-center">
            <Button 
              size="lg"
              asChild
              className="bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700"
            >
              <Link href="https://study.behaviorschool.com/auth?mode=signup&source=bcba-exam-prep-page" target="_blank" rel="noopener noreferrer">
                Start Practice Questions Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
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
              asChild
              className="bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700
                         transform hover:scale-105 transition-all duration-300 ease-out
                         hover:shadow-xl shadow-lg
                         text-lg font-semibold px-8 py-4"
            >
              <Link href="https://study.behaviorschool.com/auth?mode=signup&source=bcba-exam-prep-page" target="_blank" rel="noopener noreferrer">
                Start BCBA Practice Questions
                <ArrowRight className="ml-3 w-6 h-6 transition-transform hover:translate-x-1" />
              </Link>
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
            asChild
            className="bg-white text-emerald-700 hover:bg-emerald-50 shadow-xl font-semibold"
          >
            <Link href="https://study.behaviorschool.com/auth?mode=signup&source=bcba-exam-prep-page" target="_blank" rel="noopener noreferrer">
              Start Practice Questions →
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Newsletter Signup Popup */}
      <EmailSignupPopup
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        title="Get Your Free BCBA Study Resources"
        description="Get access to our comprehensive BCBA study resources, practice questions, exam strategies, and school-specific scenarios to help you pass on the first try."
        pageSource="/bcba-exam-prep"
        showNameField={true}
        buttonText="Get Study Resources"
        successMessage="Thanks for signing up! We'll send you valuable BCBA study resources soon."
      />
    </div>
  );
}
