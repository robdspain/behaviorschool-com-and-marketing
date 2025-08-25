"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmailSignupPopup } from "@/components/ui/email-signup-popup";
import { CheckCircle, BookOpen, Users, Target, Download, Clock, Star, ArrowRight, Info, TrendingUp, ChevronDown, ChevronUp } from "lucide-react";

export default function BCBAExamPrepPage() {
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [activeStatPopup, setActiveStatPopup] = useState<number | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const realStats = [
    {
      value: "54%",
      label: "National First-Time Pass Rate",
      description: "2024 BCBA exam first-time pass rate",
      source: "BACB (Behavior Analyst Certification Board) 2024 annual report. In 2024, among 9,911 first-time test-takers, only 54% passed, resulting in 8,164 newly certified BCBAs. This represents a significant decline from 65% in 2020 and 60% in 2021.",
      year: "2024",
      sourceLink: "https://www.bacb.com/about/annual-reports/"
    },
    {
      value: "25%",
      label: "Retake Pass Rate", 
      description: "Success rate for second-attempt candidates",
      source: "BACB 2024 data shows retake pass rates remain significantly lower at around 25%, highlighting the uphill battle for second-attempt test-takers. This emphasizes the critical importance of passing on the first try.",
      year: "2024",
      sourceLink: "https://www.bacb.com/about/annual-reports/"
    },
    {
      value: "63%",
      label: "Historical Average",
      description: "Average pass rate from 2017-2020",
      source: "Historical BACB trends from 2017–2020 placed the average first-time pass rate around 63%. This shows a declining trend in recent years, with 2022 at 55%, 2021 at 60%, and 2024 dropping to 54%.",
      year: "2017-2020",
      sourceLink: "https://www.bacb.com/about/annual-reports/"
    },
  ];

  const examTopics = [
    {
      category: "Behaviorism and Philosophical Foundations",
      percentage: "5%",
      questions: "9 questions",
      timeAllotment: "12 minutes",
      topics: ["Service goals identification", "Assessment procedures", "Behavioral assessment data analysis"],
      icon: BookOpen,
      description: "Focuses on identifying service goals, conducting appropriate assessment procedures, and analyzing behavioral assessment data."
    },
    {
      category: "Concepts and Principles",
      percentage: "14%",
      questions: "25 questions", 
      timeAllotment: "34 minutes",
      topics: ["Define behavior and environment", "Behavior-environment relations", "Data-based decisions"],
      icon: Target,
      description: "Examines how to define behavior and environment in observable terms, explain behavior-environment relations, and analyze factors influencing behavior."
    },
    {
      category: "Measurement, Data Display, and Interpretation",
      percentage: "12%",
      questions: "22 questions",
      timeAllotment: "29 minutes",
      topics: ["Behavior change programs", "Function-based interventions", "Progress monitoring"],
      icon: Target,
      description: "Covers establishing behavior change programs, implementing function-based interventions, and monitoring client progress and treatment integrity."
    },
    {
      category: "Experimental Design",
      percentage: "7%",
      questions: "14 questions",
      timeAllotment: "17 minutes",
      topics: ["Documentation requirements", "Professional ethical standards", "Confidentiality"],
      icon: Users,
      description: "Addresses applying behavior-analytic documentation requirements and professional ethical standards."
    },
    {
      category: "Ethical and Professional Issues",
      percentage: "13%",
      questions: "23 questions",
      timeAllotment: "31 minutes",
      topics: ["Collaboration with others", "Barrier identification", "Stakeholder engagement"],
      icon: CheckCircle,
      description: "Focuses on collaborating with others and identifying and addressing barriers to behavior change."
    },
    {
      category: "Behavior Assessment",
      percentage: "13%",
      questions: "24 questions",
      timeAllotment: "31 minutes",
      topics: ["Single-case experimental designs", "Intervention evaluation", "Treatment effectiveness"],
      icon: Target,
      description: "Examines using single-case experimental designs, evaluating interventions, and arranging conditions for behavior change."
    },
    {
      category: "Behavior-Change Procedures",
      percentage: "14%",
      questions: "26 questions",
      timeAllotment: "34 minutes",
      topics: ["Fundamental principles application", "Assessment implementation", "Training others"],
      icon: BookOpen,
      description: "Covers applying fundamental principles in applied settings, selecting and implementing assessment and behavior change procedures."
    },
    {
      category: "Selecting and Implementing Interventions",
      percentage: "11%",
      questions: "21 questions",
      timeAllotment: "26 minutes",
      topics: ["Treatment plan design", "Plan monitoring and modification", "Reinforcer assessments"],
      icon: Target,
      description: "Addresses designing and implementing comprehensive treatment plans, monitoring and modifying plans, and conducting preference assessments."
    },
    {
      category: "Personnel Supervision and Management", 
      percentage: "11%",
      questions: "21 questions",
      timeAllotment: "26 minutes",
      topics: ["Training program design", "Supervision provision", "Quality service delivery"],
      icon: Users,
      description: "Focuses on designing and implementing training programs and providing supervision to ensure quality service delivery."
    }
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
      answer: "According to the BACB's 2024 annual report, the first-time BCBA exam pass rate is 54%. This represents a significant decline from previous years - it was 65% in 2020, 60% in 2021, and 55% in 2022. Retake candidates have an even lower success rate at approximately 25%, which emphasizes the importance of thorough preparation for your first attempt."
    },
    {
      question: "How many hours should I study for the BCBA exam?",
      answer: "Most successful candidates study between 200-400 hours over 3-6 months. School-based BCBAs should focus extra time on areas outside their daily experience, such as research methodology and experimental design. We recommend 2-3 hours of focused study per day, with more intensive preparation in the final 4 weeks before your exam date."
    },
    {
      question: "What are the hardest sections of the BCBA exam?",
      answer: "Based on candidate feedback and pass rate data, the most challenging sections are typically: 1) Experimental Design (7% of exam) - requires strong research methodology knowledge, 2) Measurement, Data Display, and Interpretation (12% of exam) - technical statistical concepts, and 3) Ethics and Professional Issues (13% of exam) - complex scenario-based questions requiring nuanced understanding of the BACB ethics code."
    },
    {
      question: "How can school-based BCBAs prepare differently?",
      answer: "School-based BCBAs should focus on areas less common in educational settings: clinical interventions, experimental research designs, and private practice ethics scenarios. Strengthen knowledge in functional communication training, token economies, and discrete trial training. Many school BCBAs need extra preparation in single-case research design and data analysis techniques not typically used in schools."
    },
    {
      question: "How long is the BCBA certification exam?",
      answer: "The BCBA exam consists of 185 multiple-choice questions and you have 4 hours to complete it. The questions are distributed across 9 content areas, with the largest sections being Behavior-Change Procedures (14%), Concepts and Principles (14%), and three sections each at 13%: Ethical and Professional Issues, Behavior Assessment, and Measurement, Data Display, and Interpretation."
    },
    {
      question: "What happens if I fail the BCBA exam?",
      answer: "If you don't pass on your first attempt, you can retake the exam, but the pass rate for retakes is only 25% according to 2024 BACB data. You must wait at least 30 days before retaking, and there are limits on how many times you can attempt the exam. This is why comprehensive preparation for your first attempt is crucial - the statistics show it's much harder to pass on subsequent tries."
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
      {/* Hero Section */}
      <section className="pt-20 md:pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
                <span className="bg-gradient-to-r from-emerald-700 to-emerald-500 bg-clip-text text-transparent">
                  BCBA Exam Prep
                </span>
                <br />
                for School-Based BCBAs
              </h1>
              
              <p className="text-2xl text-slate-700 mb-4 font-medium">
                The profession is growing rapidly—but passing the exam is the biggest hurdle.
              </p>
              
              <p className="text-xl text-slate-600 mb-8">
                Pass your BCBA certification exam with our comprehensive study materials, practice tests, and proven strategies designed specifically for school-based behavior analysts.
              </p>
              
              <div className="flex justify-center lg:justify-start">
                <Button 
                  size="lg" 
                  onClick={() => setIsSignupOpen(true)}
                  className="bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700"
                >
                  <span className="hidden sm:inline">Download Free Study Guide – Pass the BCBA Exam Faster</span>
                  <span className="sm:hidden">Get Free Study Guide</span>
                  <Download className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
            
            {/* Right Column - Image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <img
                  src="/BehaviorStudyTools/bcbaq-first-time-falling.webp"
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
            <p className="text-lg text-slate-600">
              Official BACB statistics reveal the true challenge
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
                      <p className="text-sm text-slate-600 leading-relaxed mb-3">{stat.source}</p>
                      <div className="flex items-center justify-between">
                        <a 
                          href={stat.sourceLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-emerald-600 hover:text-emerald-700 underline font-medium"
                        >
                          View BACB Official Reports →
                        </a>
                      </div>
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

      {/* Exam Breakdown Section */}
      <section id="exam-breakdown" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              BCBA Exam Breakdown
            </h2>
            <p className="text-lg text-slate-600">
              Complete breakdown of all 9 content areas with exact question counts and time allocations
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {examTopics.map((topic, index) => {
              const Icon = topic.icon;
              return (
                <div key={index} className="bg-white rounded-lg p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-600">{topic.percentage}</div>
                      <div className="text-xs text-slate-500">of exam</div>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-slate-900 mb-2 text-sm leading-tight">{topic.category}</h3>
                  
                  <div className="flex justify-between text-sm text-slate-600 mb-3">
                    <span>{topic.questions}</span>
                    <span>{topic.timeAllotment}</span>
                  </div>
                  
                  <p className="text-xs text-slate-600 mb-4 leading-relaxed">{topic.description}</p>
                  
                  <div className="space-y-2">
                    {topic.topics.map((item, i) => (
                      <div key={i} className="flex items-start">
                        <CheckCircle className="w-3 h-3 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-600 leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-8 text-center">
            <div className="bg-white border border-slate-200 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="font-semibold text-slate-900 mb-2">Total Exam Overview</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-emerald-600">185</div>
                  <div className="text-sm text-slate-600">Total Questions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-600">4</div>
                  <div className="text-sm text-slate-600">Hours</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-600">9</div>
                  <div className="text-sm text-slate-600">Content Areas</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mock Exam CTA Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-700 to-emerald-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Test Your Knowledge?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Practice with real BCBA exam questions covering all 9 content areas. Start with a free mini mock or take the full 185-question practice exam.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              asChild
              className="bg-white text-emerald-700 hover:bg-emerald-50"
            >
              <Link href="https://study.behaviorschool.com" target="_blank" rel="noopener noreferrer">
                Take a Free Mock Exam
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button 
              size="lg"
              variant="outline"
              asChild
              className="border-white text-white hover:bg-white hover:text-emerald-700"
            >
              <Link href="https://study.behaviorschool.com" target="_blank" rel="noopener noreferrer">
                Free Mini Mock
                <Clock className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
          <div className="mt-6 text-emerald-100 text-sm">
            Instant results • Detailed explanations • Track your progress
          </div>
        </div>
      </section>

      {/* Study Resources Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Complete Study Package
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
              Why School-Based BCBAs Choose Us
            </h2>
            <p className="text-lg text-slate-600">
              Specialized preparation that understands the unique challenges of school settings
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">School-Focused Content</h3>
              <p className="text-slate-600">
                Every question and scenario reflects real school-based situations you&apos;ll encounter as a BCBA in educational settings.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Proven Results</h3>
              <p className="text-slate-600">
                95% of our students pass on their first attempt, well above the national average of 68%.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Expert Support</h3>
              <p className="text-slate-600">
                Created by experienced school-based BCBAs who understand both the exam and the job requirements.
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
            <p className="text-lg text-slate-600">
              Everything you need to know about the BCBA exam and preparation
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
              className="bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700"
            >
              Download Free Study Guide – Pass Faster
              <Download className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-700 to-emerald-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Pass Your BCBA Exam?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of successful school-based BCBAs who started their journey with our comprehensive exam prep program.
          </p>
          <Button 
            size="lg"
            onClick={() => setIsSignupOpen(true)}
            className="bg-white text-emerald-700 hover:bg-emerald-50"
          >
            Get Started Today - It&apos;s Free
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