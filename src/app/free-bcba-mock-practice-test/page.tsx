import { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import Link from "next/link";
import TrackedOutboundLink from "@/components/TrackedOutboundLink";
import ClientFreeMockInjections from "@/components/ClientFreeMockInjections";
import TopQuizBanner from "@/components/TopQuizBanner";
import MiniMockSelector from "@/components/MiniMockSelector";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Target, TrendingUp, Zap, BarChart3, Brain, Shield, ArrowRight, Star, Award, Users, BookOpen, Timer, PlayCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Free BCBA Practice Exam: 10 Questions, No Signup | 6th Edition",
  description: "Free BCBA practice exam with 10 realistic questions aligned with 6th edition. Best BCBA mock exams with instant scoring, detailed explanations. No signup or credit card required. BCBA exam practice tests with performance analytics.",
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
    "free bcba mock test",
    "bcba practice exam free",
    "bcba 6th edition mock exam free",
    "best bcba mock exams",
    "bcba practice test",
    "bcba practice exam",
    "bcba exam practice tests",
    "bcba exam practice questions",
    "bcba mock exam",
    "free bcba practice exam",
    "bcba practice questions"
  ],
  alternates: {
    canonical: "https://behaviorschool.com/free-bcba-mock-practice-test"
  },
  openGraph: {
    title: "Free BCBA Practice Exam: 10 Questions | 6th Edition",
    description: "Free BCBA practice exam with 10 realistic questions aligned with 6th edition. Best BCBA mock exams with instant scoring and detailed explanations. No signup required.",
    url: "https://behaviorschool.com/free-bcba-mock-practice-test",
    siteName: "Behavior School",
    images: [
      {
        url: "/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Free BCBA Mock Practice Test",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free BCBA Practice Exam: 10 Questions | 6th Edition",
    description: "Free BCBA practice exam with 10 realistic 6th edition questions. Best BCBA mock exams with instant scoring and detailed explanations. No signup or credit card required.",
    images: ["/optimized/og-image.webp"],
  },
};

export default function BCBAMockPracticeTestPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "BCBA Resources", href: "/bcba-exam-prep" },
    { label: "Free Mock Practice Test", href: "/free-bcba-mock-practice-test" },
  ];

  const mockTestFeatures = [
    {
      title: "Realistic Exam Practice",
      description: "Practice with exam-style questions and timing based on the official BCBA exam structure outlined in the BCBA Handbook.",
      icon: Target,
      highlight: "4-hour timed sessions"
    },
    {
      title: "Instant Detailed Feedback",
      description: "Get immediate explanations for every question, including why answers are correct or incorrect.",
      icon: Brain,
      highlight: "Learn from every question"
    },
    {
      title: "Comprehensive Analytics",
      description: "Track your performance across all content areas and identify exactly where to focus your studies.",
      icon: BarChart3,
      highlight: "Data-driven insights"
    },
    {
      title: "Adaptive Difficulty",
      description: "Questions adjust to your skill level, ensuring you&apos;re always challenged at the right level.",
      icon: TrendingUp,
      highlight: "Personalized experience"
    }
  ];

  const testBenefits = [
    {
      category: "Confidence Building",
      benefits: [
        "Reduce test anxiety through familiarity",
        "Practice time management strategies",
        "Build stamina for 4-hour exam sessions",
        "Experience realistic testing conditions"
      ],
      icon: Shield,
      color: "from-blue-500 to-blue-600"
    },
    {
      category: "Knowledge Assessment",
      benefits: [
        "Identify knowledge gaps early",
        "Focus study time on weak areas",
        "Track improvement over time",
        "Validate your readiness level"
      ],
      icon: Brain,
      color: "from-emerald-500 to-emerald-600"
    },
    {
      category: "Strategic Preparation",
      benefits: [
        "Learn question patterns and formats",
        "Practice elimination techniques",
        "Develop test-taking strategies",
        "Master time allocation skills"
      ],
      icon: Target,
      color: "from-purple-500 to-purple-600"
    }
  ];

  const practiceOptions = [
    {
      title: "Domain Mini-Exams",
      description: "Target specific BCBA domains with focused practice sessions. Each domain contains the exact number of questions as the real exam.",
      duration: "15-45 minutes",
      questions: "8-35 questions",
      ideal: "Focused practice",
      ctaText: "Start 10‑Question Guest Quiz",
      ctaUrl: "https://study.behaviorschool.com/quiz/guest?limit=10",
      popular: false,
      features: ["Domain A: 8 questions", "Domain G: 35 questions", "All 9 domains available", "Free with detailed analytics"]
    },
    {
      title: "Full Mock Exam",
      description: "Complete 185-question simulation with exact timing and question distribution matching the real BCBA exam.",
      duration: "4 hours",
      questions: "185 questions",
      ideal: "Complete assessment",
      ctaText: "Start Full 185‑Question Guest Quiz",
      ctaUrl: "https://study.behaviorschool.com/quiz/guest?limit=185",
      popular: true,
      features: ["One free complete exam", "Exact BACB question distribution", "Comprehensive performance analytics", "Detailed explanations included"]
    },
    {
      title: "Daily Practice Questions",
      description: "Build consistent study habits with daily question practice. Choose your domains and track your progress over time.",
      duration: "Flexible",
      questions: "10 questions daily (free)",
      ideal: "Daily habit building",
      ctaText: "Start 10‑Question Guest Quiz",
      ctaUrl: "https://study.behaviorschool.com/quiz/guest?limit=10",
      popular: false,
      features: ["10 free questions per day", "Choose specific domains", "Adaptive difficulty", "Progress tracking included"]
    }
  ];

  return (
    <div className="min-h-screen bg-bs-background">
      <Suspense fallback={null}>
        <ClientFreeMockInjections />
      </Suspense>
      {/* Sticky CTA */}
      <div className="fixed bottom-4 inset-x-0 z-40 flex justify-center px-4">
        <div className="max-w-3xl w-full bg-white/95 backdrop-blur rounded-2xl shadow-2xl border-2 border-emerald-200 p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-semibold">
              <CheckCircle className="h-3 w-3" />
              No signup
            </div>
            <div className="text-sm font-medium text-slate-900">
              Start your free 10-question BCBA practice test now
            </div>
          </div>
          <Button asChild size="sm" className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white rounded-xl font-semibold whitespace-nowrap">
            <TrackedOutboundLink href="https://study.behaviorschool.com/quiz/guest?limit=10" location="free-mock-sticky" variant="10">
              Start Quiz <ArrowRight className="ml-1 h-4 w-4" />
            </TrackedOutboundLink>
          </Button>
        </div>
      </div>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            "name": "Free BCBA Mock Practice Test",
            "description": "Boost your confidence and pass the BCBA exam with our free mock practice tests. Simulate the real exam, identify your weaknesses, and get detailed feedback to focus your studies.",
            "url": "https://behaviorschool.com/bcba-mock-practice-test",
            "provider": {
              "@type": "Organization",
              "name": "Behavior School",
              "url": "https://behaviorschool.com"
            },
            "educationalLevel": "Professional",
            "courseMode": "Online",
            "hasCourseInstance": [
              {
                "@type": "CourseInstance",
                "courseMode": "Online",
                "name": "Domain Mini-Exams",
                "description": "Target specific BCBA domains with focused practice sessions",
                "duration": "PT30M"
              },
              {
                "@type": "CourseInstance",
                "courseMode": "Online", 
                "name": "Full Mock Exam",
                "description": "Complete 185-question simulation with exact timing",
                "duration": "PT4H"
              },
              {
                "@type": "CourseInstance",
                "courseMode": "Online",
                "name": "Daily Practice Questions", 
                "description": "Build consistent study habits with daily question practice",
                "duration": "PT15M"
              }
            ],
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock",
              "name": "Free BCBA Mock Practice Tests"
            },
            "about": [
              {
                "@type": "Thing",
                "name": "BCBA Certification"
              },
              {
                "@type": "Thing", 
                "name": "Behavior Analysis"
              },
              {
                "@type": "Thing",
                "name": "Mock Exams"
              }
            ]
          })
        }}
      />
      
      {/* FAQ Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How realistic are your mock exams compared to the actual BCBA exam?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our mock exams match the real BCBA exam with exact question distribution (Domain A: 8 questions, Domain G: 35 questions, etc.), 4-hour time limit, multiple choice format with detailed scenarios, computer-based interface simulation, and difficulty calibrated to BCBA exam complexity."
                }
              },
              {
                "@type": "Question",
                "name": "What analytics do I get after completing a mock exam?",
                "acceptedAnswer": {
                  "@type": "Answer", 
                  "text": "Our comprehensive analytics include millisecond-precision response time analysis, domain-specific performance breakdown across all 9 BCBA domains, answer pattern tracking showing uncertainty, time management insights with pacing recommendations, weak area identification, and trend analysis showing improvement over multiple sessions."
                }
              },
              {
                "@type": "Question",
                "name": "What's included in the free version?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Free access includes one complete 185-question mock exam with 4-hour timing, domain mini-exams for all domains, 10 daily practice questions with adaptive difficulty, complete analytics with all performance metrics, and detailed explanations for every question. No credit card required."
                }
              },
              {
                "@type": "Question",
                "name": "Will I see the same questions if I retake the mock exam?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No, our smart question management system includes question exposure tracking so our AI remembers every question you've seen, adaptive selection choosing new questions based on your performance, a large question bank with thousands of unique questions, and difficulty matching calibrated to your skill level."
                }
              }
            ]
          })
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="pt-32 pb-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Selected Quiz Banner (shows after returning from quiz) */}
        <Suspense fallback={null}>
          <TopQuizBanner />
        </Suspense>

        {/* Hero Section */}
        <section className="relative py-16 lg:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-emerald-50 rounded-3xl" />
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-blue-100 to-transparent opacity-30 blur-3xl" />
          <div className="absolute -bottom-10 left-0 w-80 h-80 rounded-full bg-gradient-to-tr from-emerald-100 to-transparent opacity-20 blur-2xl" />
          
          <div className="relative text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-8">
              <PlayCircle className="mr-2 h-4 w-4" />
              Free BCBA Mock Test
            </div>

            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Free 10-Question BCBA Practice Test
              <span className="block bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">Start in 2 Minutes — No Signup</span>
            </h1>

            <p className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Our free BCBA practice exam features realistic questions aligned with the 6th edition test content outline. Get instant scoring, detailed explanations, and performance analytics. Perfect for testing your readiness or starting your study journey.
            </p>

            {/* PRIMARY CTA - Hero Button */}
            <div className="mb-6">
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-12 py-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-200 transform hover:scale-105 text-xl font-bold">
                <TrackedOutboundLink href={"https://study.behaviorschool.com/quiz/guest?limit=10&return=" + encodeURIComponent('https://behaviorschool.com/free-bcba-mock-practice-test?results=locked&quiz=' + encodeURIComponent('Mini-Mock Exam (10 Questions)'))} location="free-mock-hero" variant="10">
                  <PlayCircle className="mr-3 h-6 w-6" /> Start Free 10-Question Quiz <ArrowRight className="ml-3 h-6 w-6" />
                </TrackedOutboundLink>
              </Button>
              <p className="mt-3 text-sm text-slate-600">Takes 2-3 minutes • Instant results</p>
            </div>

            {/* TRUST BAR - Hyper-visible */}
            <div className="inline-flex items-center justify-center gap-6 px-8 py-4 bg-emerald-50 border-2 border-emerald-200 rounded-2xl mb-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <span className="font-semibold text-slate-900">No signup</span>
              </div>
              <div className="h-6 w-px bg-emerald-300" />
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <span className="font-semibold text-slate-900">No credit card</span>
              </div>
              <div className="h-6 w-px bg-emerald-300" />
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <span className="font-semibold text-slate-900">Results in minutes</span>
              </div>
            </div>

            {/* SECONDARY OPTIONS - Tucked below */}
            <div className="max-w-2xl mx-auto">
              <p className="text-sm text-slate-600 mb-4">Or choose a different practice format:</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-4">
                <Button asChild size="sm" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-3 rounded-xl">
                  <TrackedOutboundLink href="https://study.behaviorschool.com/free-mock-exam/full" location="free-mock-hero-secondary" variant="185">
                    Full 185-Question Mock Exam (4 hours)
                  </TrackedOutboundLink>
                </Button>
              </div>
              <div className="max-w-xl mx-auto">
                <MiniMockSelector location="free-mock-hero-secondary" />
              </div>
            </div>
          </div>
        </section>

        {/* Our Advanced Mock Test Platform */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-emerald-50">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              Best BCBA Mock Exams with Real-Time Analytics
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our free BCBA exam practice tests feature 6th edition-aligned questions with precision tracking and detailed performance insights. Access unlimited BCBA practice questions with adaptive difficulty and comprehensive explanations.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Precise Performance Tracking</h3>
              <div className="space-y-4">
                {/* Removed Response Time Analysis item per accuracy concerns */}

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Domain-Specific Performance</h4>
                    <p className="text-slate-600 text-sm">Get detailed breakdowns for all 9 BCBA domains (A-I) with accuracy percentages and time management insights.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Brain className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Answer Pattern Analysis</h4>
                    <p className="text-slate-600 text-sm">Monitor answer changes, confidence levels, and decision-making patterns to identify test-taking weaknesses.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-100 to-emerald-100 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Smart Question Management</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Target className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Adaptive Question Selection</h4>
                    <p className="text-slate-600 text-sm">Our AI ensures you never see the same question twice and adjusts difficulty based on your performance level.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Realistic Exam Simulation</h4>
                    <p className="text-slate-600 text-sm">Exact timing, question distribution, and interface matching the real BCBA computer-based test environment.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Award className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Detailed Explanations</h4>
                    <p className="text-slate-600 text-sm">Every question includes comprehensive explanations with references to help you understand concepts thoroughly.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Practice Test Options */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              Choose Your Practice Format
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Whether you have 30 minutes or 4 hours, we have the perfect practice option for your schedule
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {practiceOptions.map((option, index) => (
              <div key={index} className={`relative bg-white rounded-3xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition-all duration-300 ${option.popular ? 'ring-2 ring-blue-500 transform scale-105' : ''}`}>
                {option.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-sm font-bold">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{option.title}</h3>
                  <p className="text-slate-600 mb-6">{option.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-center space-x-2 text-sm text-slate-600">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span>{option.duration}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-sm text-slate-600">
                      <Target className="h-4 w-4 text-blue-600" />
                      <span>{option.questions}</span>
                    </div>
                    <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {option.ideal}
                    </div>
                  </div>
                  
                  {option.features && (
                    <div className="text-left space-y-2 mb-6">
                      {option.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-3">
                          <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                          <span className="text-sm text-slate-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button 
                  asChild 
                  size="lg" 
                  className={`w-full rounded-2xl ${option.popular ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'}`}
                >
                  <a href={option.ctaUrl} target="_blank" rel="noopener noreferrer">
                    <PlayCircle className="mr-2 h-5 w-5" />
                    {option.ctaText}
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Why Mock Tests Work */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              Why Mock Tests Are Essential for BCBA Success
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Research shows that practice testing is one of the most effective study strategies for long-term retention and exam performance
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {mockTestFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-start space-x-6">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-2xl flex-shrink-0">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                    <p className="text-slate-600 mb-4">{feature.description}</p>
                    <div className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                      <Star className="mr-2 h-4 w-4" />
                      {feature.highlight}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits by Category */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              How Mock Tests Transform Your Exam Preparation
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our comprehensive mock tests provide benefits across three critical areas of exam success
            </p>
          </div>

          <div className="space-y-8">
            {testBenefits.map((category, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
                <div className={`bg-gradient-to-r ${category.color} p-6`}>
                  <div className="flex items-center text-white">
                    <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-2xl mr-4">
                      <category.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold">{category.category}</h3>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="grid md:grid-cols-2 gap-4">
                    {category.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Practice Benefits */}
        <section className="py-20">
          <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-3xl p-12 text-white">
            <div className="text-center">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Benefits of Regular Practice Testing
              </h2>
              <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
                Research shows that practice testing improves retention, builds confidence, and helps identify knowledge gaps
              </p>
              
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Improved Retention</h3>
                  <p className="text-blue-100 text-sm">Practice testing enhances long-term memory consolidation</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Better Pacing</h3>
                  <p className="text-blue-100 text-sm">Learn to manage time effectively during exams</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Focused Study</h3>
                  <p className="text-blue-100 text-sm">Identify specific areas that need more attention</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-gray-100 px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
                  <TrackedOutboundLink href={"https://study.behaviorschool.com/quiz/guest?limit=10&return=" + encodeURIComponent('https://behaviorschool.com/free-bcba-mock-practice-test?results=locked&quiz=' + encodeURIComponent('Mini-Mock Exam (10 Questions)'))} location="free-mock-mid" variant="10">
                    <PlayCircle className="mr-2 h-5 w-5" /> Start 10‑Q Guest Quiz <ArrowRight className="ml-2 h-5 w-5" />
                  </TrackedOutboundLink>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Test-Taking Strategies */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              Proven Test-Taking Strategies for BCBA Success
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Master these evidence-based strategies to maximize your performance on exam day
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Before You Start</h3>
                <div className="space-y-4">
                  {[
                    {
                      strategy: "Read Instructions Carefully",
                      description: "Take 2-3 minutes to understand the format and requirements completely"
                    },
                    {
                      strategy: "Plan Your Time",
                      description: "Allocate roughly 1.3 minutes per question, leaving 15 minutes for review"
                    },
                    {
                      strategy: "Start with Easy Questions",
                      description: "Build confidence and momentum by tackling straightforward questions first"
                    },
                    {
                      strategy: "Mark Difficult Questions",
                      description: "Flag challenging items to return to later rather than getting stuck"
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full text-blue-700 font-bold text-sm flex-shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">{item.strategy}</h4>
                        <p className="text-slate-600 text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-3xl p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">During the Exam</h3>
                <div className="space-y-4">
                  {[
                    {
                      strategy: "Use Process of Elimination",
                      description: "Eliminate obviously wrong answers first to improve your odds"
                    },
                    {
                      strategy: "Look for Key Words",
                      description: "Watch for terms like &apos;always,&apos; &apos;never,&apos; &apos;most likely,&apos; and &apos;best&apos;"
                    },
                    {
                      strategy: "Apply the Pareto Principle",
                      description: "Focus 80% of your effort on the 20% of questions you&apos;re most confident about"
                    },
                    {
                      strategy: "Trust Your First Instinct",
                      description: "Change answers only when you&apos;re certain you made an error"
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-emerald-100 rounded-full text-emerald-700 font-bold text-sm flex-shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">{item.strategy}</h4>
                        <p className="text-slate-600 text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Common Exam Pitfalls */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              Avoid These Common BCBA Exam Pitfalls
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Learn from the mistakes of others to maximize your chances of success
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                pitfall: "Overthinking Simple Questions",
                description: "Many test-takers complicate straightforward questions by reading too much into them.",
                solution: "If your first instinct seems obvious, it&apos;s probably correct. Trust your knowledge.",
                icon: Brain
              },
              {
                pitfall: "Running Out of Time",
                description: "Spending too long on difficult questions leaves insufficient time for easier ones.",
                solution: "Set time limits per question and stick to them. Mark and return to challenging items.",
                icon: Clock
              },
              {
                pitfall: "Misreading Question Stems",
                description: "Rushing through questions leads to misunderstanding what&apos;s actually being asked.",
                solution: "Read each question twice. Identify key terms and what type of response is required.",
                icon: Target
              },
              {
                pitfall: "Second-Guessing Yourself",
                description: "Changing correct answers due to test anxiety or overthinking reduces scores.",
                solution: "Only change answers when you identify a clear error in your reasoning.",
                icon: Shield
              }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8">
                <div className="grid lg:grid-cols-4 gap-8 items-start">
                  <div className="lg:col-span-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-2xl">
                        <item.icon className="h-6 w-6 text-red-600" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{item.pitfall}</h3>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-2">
                    <p className="text-slate-600 mb-4">{item.description}</p>
                  </div>
                  
                  <div className="lg:col-span-1">
                    <div className="bg-emerald-50 rounded-2xl p-4">
                      <h4 className="font-bold text-emerald-800 mb-2">Solution:</h4>
                      <p className="text-emerald-700 text-sm">{item.solution}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Study Schedule Integration */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              Integrating Mock Tests into Your Study Schedule
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Strategic timing and frequency of practice tests for optimal preparation
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8 lg:p-12">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-6">
                  <BookOpen className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Early Preparation (3-6 months out)</h3>
                <div className="text-left space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Take baseline diagnostic test</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Identify major knowledge gaps</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Focus on content review first</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Take mini-mocks weekly</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Active Preparation (1-3 months out)</h3>
                <div className="text-left space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Take full-length mocks bi-weekly</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Analyze performance patterns</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Adjust study plan based on results</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Practice time management</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-6">
                  <Zap className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Final Preparation (2-4 weeks out)</h3>
                <div className="text-left space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Take 2-3 final full-length tests</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Simulate exact exam conditions</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Focus on weak areas only</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Build confidence and reduce anxiety</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-blue-50 rounded-2xl">
              <h4 className="text-lg font-bold text-slate-900 mb-4 text-center">Optimal Testing Schedule</h4>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="bg-white rounded-xl p-4">
                  <div className="text-2xl font-bold text-blue-600 mb-2">8-12</div>
                  <div className="text-sm text-slate-600">Total practice tests over 3-6 months</div>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <div className="text-2xl font-bold text-emerald-600 mb-2">3-4</div>
                  <div className="text-sm text-slate-600">Full-length tests in final month</div>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <div className="text-2xl font-bold text-purple-600 mb-2">24-48hr</div>
                  <div className="text-sm text-slate-600">Review time after each test</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Getting Started */}
        <section className="py-20">
          <div className="text-center bg-white rounded-3xl shadow-lg border border-slate-200 p-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              Start Your Mock Test Journey Today
            </h2>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Join behavior analysts worldwide who trust our platform for comprehensive BCBA exam preparation
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                asChild 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
              >
                <a href="https://study.behaviorschool.com/free-practice" target="_blank" rel="noopener noreferrer">
                  <Zap className="mr-2 h-5 w-5" />
                  Start Free Practice
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-8 text-sm text-slate-600">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-emerald-600" />
                <span>Secure platform</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-emerald-600" />
                <span>Evidence-based</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-slate-600">
                Common questions about BCBA mock practice tests and exam preparation
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4">How realistic are your mock exams compared to the actual BCBA exam?</h3>
                <p className="text-slate-600 mb-4">
                  Our mock exams are designed to match the real BCBA exam as closely as possible:
                </p>
                <ul className="list-disc pl-6 text-slate-600 space-y-2">
                  <li><strong>Exact question distribution:</strong> Domain A: 8 questions, Domain B: 25 questions, Domain G: 35 questions, etc.</li>
                  <li><strong>4-hour time limit:</strong> Same as the actual computer-based test</li>
                  <li><strong>Question format:</strong> Multiple choice with detailed scenarios matching real exam style</li>
                  <li><strong>Interface simulation:</strong> Experience the computer-based testing environment</li>
                  <li><strong>Difficulty calibration:</strong> Questions aligned with BCBA exam complexity</li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4">What analytics do I get after completing a mock exam?</h3>
                <p className="text-slate-600 mb-4">
                  Our advanced analytics provide comprehensive performance insights:
                </p>
                <ul className="list-disc pl-6 text-slate-600 space-y-2">
                  <li><strong>Response time analysis:</strong> Millisecond-precision timing for every question</li>
                  <li><strong>Domain-specific breakdown:</strong> Performance across all 9 BCBA domains (A-I)</li>
                  <li><strong>Answer pattern tracking:</strong> How many times you changed answers (indicates uncertainty)</li>
                  <li><strong>Time management insights:</strong> Which domains took longest, pacing recommendations</li>
                  <li><strong>Weak area identification:</strong> Specific topics requiring additional study</li>
                  <li><strong>Trend analysis:</strong> Improvement over multiple practice sessions</li>
                </ul>
                <p className="text-slate-600 mt-4">
                  This detailed analytics approach is based on <Link href="/bcba-study-fluency" className="text-blue-600 hover:text-blue-700 underline font-medium">fluency-based learning principles</Link> that prioritize both speed and accuracy in BCBA exam preparation.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4">What&apos;s included in the free version?</h3>
                <p className="text-slate-600 mb-4">
                  We provide substantial free access to help you succeed:
                </p>
                <ul className="list-disc pl-6 text-slate-600 space-y-2">
                  <li><strong>One complete full-length mock exam:</strong> All 185 questions with 4-hour timing</li>
                  <li><strong>Domain mini-exams:</strong> Practice specific domains (A: 8 questions, B: 25, C: 20, etc.)</li>
                  <li><strong>10 daily practice questions:</strong> Choose any domain, <Link href="/bcba-study-fluency" className="text-blue-600 hover:text-blue-700 underline font-medium">adaptive difficulty</Link> based on fluency principles</li>
                  <li><strong>Complete analytics:</strong> All performance metrics and insights</li>
                  <li><strong>Detailed explanations:</strong> Learn from every question with comprehensive feedback</li>
                </ul>
                <p className="text-slate-600 mt-4">
                  No credit card required - start practicing immediately.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4">How often should I take mock exams?</h3>
                <p className="text-slate-600 mb-4">
                  The optimal testing schedule depends on your preparation timeline:
                </p>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <h4 className="font-bold text-purple-800 mb-2">Early Prep (3-6 months out)</h4>
                    <ul className="list-disc list-inside text-left text-sm text-purple-700 space-y-1">
                      <li>One diagnostic test initially</li>
                      <li>Focus on content review</li>
                      <li>Weekly mini-domain exams</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h4 className="font-bold text-blue-800 mb-2">Active Prep (1-3 months out)</h4>
                    <ul className="list-disc list-inside text-left text-sm text-blue-700 space-y-1">
                      <li>Full mock exam every 2 weeks</li>
                      <li>Analyze performance patterns</li>
                      <li>Focus on weak domains</li>
                    </ul>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <h4 className="font-bold text-emerald-800 mb-2">Final Prep (2-4 weeks out)</h4>
                    <ul className="list-disc list-inside text-left text-sm text-emerald-700 space-y-1">
                      <li>2-3 final practice exams</li>
                      <li>Simulate exact conditions</li>
                      <li>Build confidence</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Will I see the same questions if I retake the mock exam?</h3>
                <p className="text-slate-600 mb-4">
                  No, our smart question management system ensures fresh content:
                </p>
                <ul className="list-disc pl-6 text-slate-600 space-y-2">
                  <li><strong>Question exposure tracking:</strong> Our AI remembers every question you&apos;ve seen</li>
                  <li><strong>Adaptive selection:</strong> New questions chosen based on your performance level</li>
                  <li><strong>Large question bank:</strong> Thousands of unique questions across all domains</li>
                  <li><strong>Difficulty matching:</strong> Questions calibrated to your current skill level</li>
                </ul>
                <p className="text-slate-600 mt-4">
                  This ensures every practice session provides new learning opportunities while maintaining appropriate challenge levels.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4">What should I do if I&apos;m not scoring well on mock exams?</h3>
                <p className="text-slate-600 mb-4">
                  Low mock exam scores provide valuable diagnostic information:
                </p>
                <ul className="list-disc pl-6 text-slate-600 space-y-2">
                  <li><strong>Identify weak domains:</strong> Use our analytics to see which areas need focus</li>
                  <li><strong>Review question explanations:</strong> Understand why answers are correct/incorrect</li>
                  <li><strong>Practice domain mini-exams:</strong> Target specific weak areas with focused practice</li>
                  <li><strong>Check timing issues:</strong> Determine if accuracy or speed is the primary concern</li>
                  <li><strong>Adjust study plan:</strong> Allocate more time to problematic domains</li>
                </ul>
                <p className="text-slate-600 mt-4">
                  Remember: Mock exams are diagnostic tools. Low initial scores are normal and expected - they guide your preparation, not predict failure. For specialized career paths, consider reading our <Link href="/school-based-bcba" className="text-blue-600 hover:text-blue-700 underline font-medium">school-based BCBA guide</Link> for additional preparation insights.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Related BCBA Resources Navigation */}
        <section className="py-12">
          <div className="bg-slate-100 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">Related BCBA Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link 
                href="/school-based-bcba" 
                className="flex items-center justify-center px-6 py-4 bg-white rounded-xl hover:bg-emerald-50 transition-colors duration-200 text-center"
              >
                <div>
                  <Users className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                  <div className="font-medium text-slate-900">School-Based BCBA</div>
                  <div className="text-sm text-slate-600">Career pathway guide</div>
                </div>
              </Link>
              
              <Link 
                href="/bcba-study-fluency" 
                className="flex items-center justify-center px-6 py-4 bg-white rounded-xl hover:bg-emerald-50 transition-colors duration-200 text-center"
              >
                <div>
                  <Zap className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                  <div className="font-medium text-slate-900">Study Fluency</div>
                  <div className="text-sm text-slate-600">Fluency-based learning</div>
                </div>
              </Link>
              
              <Link 
                href="/behavior-study-tools" 
                className="flex items-center justify-center px-6 py-4 bg-white rounded-xl hover:bg-emerald-50 transition-colors duration-200 text-center"
              >
                <div>
                  <BookOpen className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                  <div className="font-medium text-slate-900">Study Tools</div>
                  <div className="text-sm text-slate-600">Comprehensive prep</div>
                </div>
              </Link>
              <Link 
                href="/bcba-mock-exam-guide" 
                className="flex items-center justify-center px-6 py-4 bg-white rounded-xl hover:bg-emerald-50 transition-colors duration-200 text-center"
              >
                <div>
                  <BookOpen className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                  <div className="font-medium text-slate-900">Mock Exam Guide</div>
                  <div className="text-sm text-slate-600">How to use practice tests</div>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
