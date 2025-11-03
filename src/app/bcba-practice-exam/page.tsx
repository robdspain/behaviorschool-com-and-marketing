import { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Zap, Target, TrendingUp, Clock, BarChart3, Brain, Lightbulb, ArrowRight, Star, Award, Users, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "BCBA Practice Exam Free 2025 | Unlimited Questions + Scoring",
  description: "Free unlimited BCBA practice exams with instant scoring. Adaptive difficulty, detailed explanations, and performance tracking. Start practicing today.",
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
    "bcba practice exam",
    "bcba practice test",
    "free bcba practice exam",
    "bcba practice questions",
    "bcba practice exam questions",
    "free bcba practice questions",
    "bcba practice quiz",
    "bcba practice questions quizlet",
    "bcba practice exam pdf"
  ],
  alternates: {
    canonical: "https://behaviorschool.com/bcba-exam-prep"
  },
  openGraph: {
    title: "Revolutionary Non-Repetitive BCBA Study Fluency System",
    description: "Never see the same question twice! Our revolutionary app builds BCBA exam fluency through unlimited AI-generated questions, RESA-based progression, and intelligent content generation.",
    url: "https://behaviorschool.com/bcba-practice-exam",
    siteName: "Behavior School",
    images: [
      {
        url: "/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "BCBA Practice Exam",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Revolutionary Non-Repetitive BCBA Study Fluency System",
    description: "Never see the same question twice! Our revolutionary app builds BCBA exam fluency through unlimited AI-generated questions, RESA-based progression, and intelligent content generation.",
    images: ["/optimized/og-image.webp"],
  },
};

export default function BCBAPracticeExamPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "BCBA Resources", href: "/bcba-exam-prep" },
    { label: "Practice Exam", href: "/bcba-practice-exam" },
  ];

  const practiceExamBenefits = [
    {
      title: "Unlimited Questions",
      description: "Access unlimited AI-generated BCBA practice questions that never repeat, ensuring fresh challenges every time.",
      icon: Zap,
      benefit: "Never run out of practice material"
    },
    {
      title: "Detailed Explanations",
      description: "Every question includes comprehensive explanations with references to help you understand the concepts.",
      icon: Brain,
      benefit: "Learn from every question you attempt"
    },
    {
      title: "Domain Coverage",
      description: "Practice questions cover all 9 BCBA domains with appropriate weighting for the real exam.",
      icon: Target,
      benefit: "Complete preparation across all areas"
    },
    {
      title: "Performance Analytics",
      description: "Track your progress with detailed analytics and identify areas that need more focus.",
      icon: TrendingUp,
      benefit: "Data-driven study approach"
    }
  ];

  const studyStrategies = [
    {
      phase: "Conceptual",
      title: "70% Accuracy Threshold",
      description: "Build foundational understanding through varied question contexts. No question repetition—each concept explored through multiple scenarios.",
      timeframe: "Weeks 1-4",
      activities: [
        "Explore concepts through diverse question contexts",
        "Experience varied applications of same principles",
        "Achieve 70% accuracy across different scenarios",
        "Build conceptual flexibility, not memorization"
      ],
      color: "from-blue-500 to-blue-600"
    },
    {
      phase: "Applied",
      title: "80% Fluency Threshold",
      description: "Develop application skills through contextual variation and progressive speed targets (90s→75s→60s).",
      timeframe: "Weeks 5-8",
      activities: [
        "Practice principles in realistic scenarios",
        "Experience unlimited AI-generated question variations",
        "Meet progressive speed benchmarks",
        "Build endurance through extended sessions"
      ],
      color: "from-emerald-500 to-emerald-600"
    },
    {
      phase: "Analysis",
      title: "90% Mastery + Generalization",
      description: "Achieve behavioral fluency through complex problem-solving with 45-second response targets.",
      timeframe: "Weeks 9-12",
      activities: [
        "Master complex multi-step analysis questions",
        "Demonstrate stability under time pressure",
        "Transfer knowledge to novel clinical situations",
        "Maintain performance across all BCBA domains"
      ],
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-bs-background">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Free BCBA Practice Exam & Questions - Unlimited Adaptive Tests",
            "description": "Take unlimited BCBA practice exams with AI-generated questions. Never see the same question twice! Free practice tests, domain quizzes, and detailed explanations. Better than Quizlet.",
            "url": "https://behaviorschool.com/bcba-practice-exam",
            "author": {
              "@type": "Organization",
              "name": "Behavior School",
              "url": "https://behaviorschool.com"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Behavior School",
              "url": "https://behaviorschool.com"
            },
            "datePublished": "2024-01-01",
            "dateModified": "2024-12-01",
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://behaviorschool.com/bcba-study-fluency"
            },
            "about": [
              {
                "@type": "Thing",
                "name": "BCBA Exam Preparation"
              },
              {
                "@type": "Thing",
                "name": "Fluency-Based Learning"
              },
              {
                "@type": "Thing",
                "name": "Precision Teaching"
              }
            ],
            "educationalLevel": "Professional",
            "teaches": [
              "BCBA practice exam strategies",
              "Adaptive practice question techniques",
              "Domain-specific BCBA preparation",
              "Unlimited practice exam access"
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
                "name": "How many free BCBA practice questions can I access?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "You get substantial free access: 10 practice questions daily from any BCBA domain, one complete 185-question mock exam, and domain-specific practice quizzes for focused study. Our unique system ensures you never see the same question twice with unlimited AI-generated content."
                }
              },
              {
                "@type": "Question", 
                "name": "How does your BCBA practice exam compare to other study tools?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Unlike static flashcards or limited question banks, our practice exams offer unlimited variety and intelligent adaptation. We provide unlimited AI-generated questions that never repeat, adaptive difficulty that adjusts to your performance, detailed explanations with references, and real exam simulation with 185-question format and proper domain weighting."
                }
              },
              {
                "@type": "Question",
                "name": "Can I get a BCBA practice exam PDF download?", 
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "While we don't offer static PDFs (which become outdated quickly), our online practice exams provide much more value than any downloadable file. You get unlimited questions that never repeat, instant detailed explanations, adaptive difficulty adjustment, and comprehensive analytics to track your progress."
                }
              },
              {
                "@type": "Question",
                "name": "How long should I spend on BCBA practice exams?",
                "acceptedAnswer": {
                  "@type": "Answer", 
                  "text": "We recommend a systematic approach: 10-15 minutes daily with our free questions for consistency, domain-specific practice quizzes to target weak areas, weekly full-length 185-question practice exams to build endurance, and regular review of detailed analytics to identify improvement areas. Our adaptive system tracks progress and suggests optimal practice schedules."
                }
              }
            ]
          })
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="pt-24 pb-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Hero Section */}
        <section className="relative py-16 lg:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-emerald-50 rounded-3xl" />
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-purple-100 to-transparent opacity-30 blur-3xl" />
          <div className="absolute -bottom-10 left-0 w-80 h-80 rounded-full bg-gradient-to-tr from-emerald-100 to-transparent opacity-20 blur-2xl" />
          
          <div className="relative text-center">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-8">
              <Zap className="mr-2 h-4 w-4" />
              Free Practice Exam Available
            </div>
            
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Unlimited BCBA Practice Exams &
              <span className="bg-gradient-to-r from-purple-600 to-emerald-600 bg-clip-text text-transparent"> Questions</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Master every domain with adaptive practice exams, unlimited questions, and detailed explanations. Never see the same question twice with our AI-powered intelligent generation system.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                asChild 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
              >
                <a href="https://study.behaviorschool.com/free-practice" target="_blank" rel="noopener noreferrer">
                  <Target className="mr-2 h-5 w-5" />
                  Start Free Practice Exam
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-8 text-sm text-slate-600">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>Evidence-based approach</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-emerald-600" />
                <span>Precision teaching methods</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-emerald-600" />
                <span>Proven results</span>
              </div>
            </div>
          </div>
        </section>

        {/* BCBA Practice Exam Features */}
        <section className="py-20 bg-gradient-to-br from-purple-50 to-emerald-50">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              The Most Advanced BCBA Practice Exam Platform
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Take unlimited practice exams with AI-generated questions across all 9 BCBA domains. Our adaptive system ensures you never see the same question twice, building true mastery through intelligent variation.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Unlimited BCBA Practice Questions</h3>
              <p className="text-slate-600 mb-4">
                Access unlimited AI-generated practice questions that never repeat. Our intelligent system tracks every question you&rsquo;ve seen and generates new content automatically, ensuring unlimited practice variety.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span>Unlimited AI-generated questions across all 9 BCBA domains</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span>Never see the same question twice</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span>AI generates new questions automatically</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Detailed Practice Exam Analytics</h3>
              <p className="text-slate-600 mb-4">
                Get comprehensive performance analytics for every practice exam. Track your progress across all 9 BCBA domains with detailed reports and improvement recommendations. Try our <Link href="/bcba-mock-practice-test" className="text-blue-600 hover:text-blue-700 underline font-medium">free full-length mock exam</Link>.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span>Domain-by-domain performance tracking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span>Response time and accuracy metrics</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span>Progress trends over time</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <Brain className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Adaptive Practice Exam Difficulty</h3>
              <p className="text-slate-600 mb-4">
                Our smart system adapts to your performance level, providing practice questions that challenge you at the right difficulty. Progress through mastery stages with evidence-based thresholds and personalized pacing.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span>Personalized difficulty adjustment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span>Evidence-based mastery progression</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span>Optimal challenge level maintenance</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BCBA Practice Exam Benefits */}
        <section className="py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                Why Choose Our BCBA Practice Exams?
              </h2>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Get the most comprehensive BCBA exam preparation with unlimited practice tests, adaptive questions, and detailed explanations. Our unique system ensures you&rsquo;re always challenged with fresh content.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-xl">
                    <Brain className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Cognitive Load Theory</h3>
                    <p className="text-slate-600">When basic knowledge is automatic, your brain has more capacity for complex problem-solving and application questions.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-xl">
                    <Lightbulb className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Precision Teaching</h3>
                    <p className="text-slate-600">Research demonstrates that behavioral fluency training enhances learning outcomes by combining accuracy and speed (Binder, 1996). Studies show fluency-based instruction leads to improved retention, endurance, and skill application across educational settings (Weiss et al., 2010).</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-xl">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Measurable Progress</h3>
                    <p className="text-slate-600">Track your improvement with precise metrics that show both speed and accuracy gains over time.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-emerald-100 rounded-2xl mb-4">
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Fluency vs. Accuracy</h3>
              </div>
              
              <div className="space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                  <div className="font-medium text-red-800 mb-2">❌ Accuracy Only</div>
                  <div className="text-sm text-red-700">Gets the right answer but takes too long, causing test anxiety and time pressure</div>
                </div>
                
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                  <div className="font-medium text-emerald-800 mb-2">✅ Fluency (Speed + Accuracy)</div>
                  <div className="text-sm text-emerald-700">Quick, confident responses that free up mental resources for complex questions</div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-emerald-50 border border-purple-200 rounded-2xl p-4">
                  <div className="font-medium text-purple-800 mb-2">🎯 The Goal</div>
                  <div className="text-sm text-purple-700">Automatic recall that enables higher-level thinking and problem-solving</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Free BCBA Practice Test */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              Start with Our Free BCBA Practice Test
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Try our free practice exam sample to experience the difference. Get detailed explanations, domain-specific feedback, and performance analytics.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {practiceExamBenefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-start space-x-6">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-emerald-100 rounded-2xl flex-shrink-0">
                    <benefit.icon className="h-8 w-8 text-purple-600" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                    <p className="text-slate-600 mb-4">{benefit.description}</p>
                    <div className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      {benefit.benefit}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Multi-Stage Mastery Progression */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              Multi-Stage Mastery Progression System
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our app uses evidence-based behavioral thresholds to systematically build fluency without repetition
            </p>
          </div>

          <div className="space-y-8">
            {studyStrategies.map((phase, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
                  <div className={`bg-gradient-to-r ${phase.color} p-6`}>
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center space-x-4">
                        <div className="bg-white/20 rounded-full px-4 py-2 font-bold">
                          Phase {index + 1}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">{phase.title}</h3>
                          <p className="text-white/90">{phase.timeframe}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-medium">{phase.phase}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <p className="text-lg text-slate-600 mb-6">{phase.description}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      {phase.activities.map((activity, activityIndex) => (
                        <div key={activityIndex} className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-700">{activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {index < studyStrategies.length - 1 && (
                  <div className="flex justify-center mt-6">
                    <div className="w-1 h-8 bg-gradient-to-b from-purple-300 to-emerald-400 rounded-full"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Research Evidence */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              The Science Behind Fluency-Based Learning
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Decades of research support fluency training as a superior method for skill acquisition and retention
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Research Findings</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-xl flex-shrink-0">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Retention Advantage</h4>
                    <p className="text-slate-600">Research demonstrates that fluent learners show superior retention compared to those achieving accuracy alone, with skills maintained even after extended breaks from practice (Binder, 1996).</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-xl flex-shrink-0">
                    <Zap className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Transfer Benefits</h4>
                    <p className="text-slate-600">Fluent skills transfer more readily to novel situations and complex problems, enabling better performance on application-based questions (Yaber-Oltra, 1993).</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-xl flex-shrink-0">
                    <Brain className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Cognitive Load Reduction</h4>
                    <p className="text-slate-600">Automatic recall frees up working memory for higher-order thinking, improving performance on complex, multi-step problems common in BCBA exams.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-emerald-50 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Precision Teaching Principles</h3>
              <div className="space-y-4">
                <div className="bg-white/80 rounded-2xl p-4">
                  <h4 className="font-bold text-slate-900 mb-2">Measurement Focus</h4>
                  <p className="text-slate-600 text-sm">Precise measurement of both rate and accuracy provides clear feedback on learning progress and skill development.</p>
                </div>
                
                <div className="bg-white/80 rounded-2xl p-4">
                  <h4 className="font-bold text-slate-900 mb-2">Individualized Pacing</h4>
                  <p className="text-slate-600 text-sm">Each learner progresses at their own rate, ensuring mastery before moving to more complex material.</p>
                </div>
                
                <div className="bg-white/80 rounded-2xl p-4">
                  <h4 className="font-bold text-slate-900 mb-2">Data-Driven Decisions</h4>
                  <p className="text-slate-600 text-sm">Regular assessment data guides instructional changes, optimizing learning efficiency and outcomes.</p>
                </div>

                <div className="bg-white/80 rounded-2xl p-4">
                  <h4 className="font-bold text-slate-900 mb-2">Fluency Building</h4>
                  <p className="text-slate-600 text-sm">Systematic practice builds automatic responding, creating durable skills that maintain over time.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Revolutionary vs Traditional Approaches */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              Revolutionary Non-Repetitive vs. Traditional &ldquo;Drill-and-Kill&rdquo;
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Why varied contextual practice builds superior fluency compared to mechanical repetition
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="p-8 bg-red-50">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-4">
                    <BookOpen className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-red-800">Traditional &ldquo;Drill &amp; Kill&rdquo; Methods</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-red-700">Repeat identical questions until fast responses develop</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-red-700">Create mechanical responding and memorization patterns</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-red-700">Lead to plateau effect and performance stagnation</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-red-700">Cause boredom, burnout, and stimulus over-selectivity</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-red-700">Fail to build true clinical reasoning abilities</p>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-emerald-50">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-4">
                    <Zap className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-emerald-800">Revolutionary Non-Repetitive Method</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <p className="text-emerald-700">Never shows the same question twice to prevent mechanical responding</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <p className="text-emerald-700">Unlimited AI-generated questions build conceptual flexibility</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <p className="text-emerald-700">AI-powered content generation maintains engagement</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <p className="text-emerald-700">RESA-based progression (Retention, Endurance, Stability, Application)</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <p className="text-emerald-700">Builds authentic clinical competence and flexible thinking</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Revolutionary Implementation Guide */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              How Our Revolutionary System Works
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Experience the behavioral science behind our never-repeat question technology and RESA-based progression
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                title: "Never-Repeat Question Technology",
                description: "Experience unlimited AI-generated questions across all BCBA domains",
                steps: [
                  "Every question exposure is tracked and recorded",
                  "Smart algorithms prevent showing duplicates",
                  "AI generates unlimited new questions automatically",
                  "Forces conceptual understanding over memorization"
                ],
                icon: Target,
                color: "blue"
              },
              {
                title: "RESA-Based Multi-Stage Progression",
                description: "Evidence-based thresholds build true behavioral fluency",
                steps: [
                  "Conceptual Stage: 70% accuracy through varied contexts",
                  "Applied Stage: 80% accuracy with progressive speed (90s→45s)",
                  "Analysis Stage: 90% mastery with generalization",
                  "Retention, Endurance, Stability, Application focus"
                ],
                icon: Clock,
                color: "emerald"
              },
              {
                title: "Intelligent Contextual Variation",
                description: "Build clinical competence through diverse question scenarios",
                steps: [
                  "Same principles explored in multiple contexts",
                  "Real-world clinical scenarios and case studies",
                  "Domain-specific practice across all 9 BCBA areas",
                  "Adaptive difficulty based on performance patterns"
                ],
                icon: TrendingUp,
                color: "purple"
              }
            ].map((guide, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8">
                <div className="grid lg:grid-cols-4 gap-8 items-start">
                  <div className="lg:col-span-1">
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-${guide.color}-100 rounded-2xl mb-4`}>
                      <guide.icon className={`h-8 w-8 text-${guide.color}-600`} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{guide.title}</h3>
                    <p className="text-slate-600">{guide.description}</p>
                  </div>
                  
                  <div className="lg:col-span-3">
                    <div className="grid md:grid-cols-2 gap-4">
                      {guide.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-start space-x-3 p-4 bg-slate-50 rounded-xl">
                          <div className="flex items-center justify-center w-6 h-6 bg-emerald-100 rounded-full text-emerald-700 font-bold text-sm flex-shrink-0 mt-0.5">
                            {stepIndex + 1}
                          </div>
                          <span className="text-slate-700 text-sm">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Free BCBA Practice Options */}
        <section className="py-20 bg-white">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              Free BCBA Practice Exam & Questions Available Now
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Choose from multiple practice formats: daily questions, domain quizzes, or full-length mock exams - all completely free
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl shadow-lg border border-purple-200 p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Free BCBA Practice Questions</h3>
                <div className="text-emerald-600 font-bold text-lg">10 Free Questions Daily</div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                  <span className="text-slate-700">Choose from all 9 BCBA domains</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                  <span className="text-slate-700">Never see the same question twice</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                  <span className="text-slate-700">Detailed explanations included</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                  <span className="text-slate-700">Better than Quizlet flashcards</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl shadow-lg border border-emerald-200 p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">BCBA Practice Quiz by Domain</h3>
                <div className="text-emerald-600 font-bold text-lg">Free Domain-Specific Practice Tests</div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span className="text-slate-700">Focus on specific weak areas</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span className="text-slate-700">Domain A: 8 questions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span className="text-slate-700">Domain G: 35 questions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span className="text-slate-700">All domains available</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl shadow-lg border border-blue-200 p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Free BCBA Practice Exam</h3>
                <div className="text-emerald-600 font-bold text-lg">Complete 185-Question Mock Exam</div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span className="text-slate-700">185 questions like real exam</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span className="text-slate-700">4-hour time limit simulation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span className="text-slate-700">Comprehensive analytics</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span className="text-slate-700">Fluency performance breakdown</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl p-6 mb-8">
              <h3 className="text-lg font-bold text-slate-900 mb-2">No Credit Card Required</h3>
              <p className="text-slate-600">All free practice options are available immediately without signup. Create a free account to save your progress and access detailed analytics.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="bg-gradient-to-r from-purple-600 to-emerald-600 rounded-3xl p-12 text-white">
            <div className="text-center">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Ready to Ace Your BCBA Exam?
              </h2>
              <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                Start with our free practice exam and experience unlimited questions, detailed explanations, and adaptive difficulty that adjusts to your level.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-white text-purple-700 hover:bg-gray-100 px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
                >
                  <a href="https://study.behaviorschool.com/free-practice" target="_blank" rel="noopener noreferrer">
                    <Zap className="mr-2 h-5 w-5" />
                    Take Free Practice Exam
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
              </div>

              <div className="flex items-center justify-center space-x-8 text-sm text-purple-100 mt-8">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>100% Free to start</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Join thousands of students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4" />
                  <span>Evidence-based methods</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related BCBA Resources Navigation */}
        <section className="py-12">
          <div className="bg-slate-100 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">Related BCBA Resources</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                href="/bcba-study-tools"
                className="flex items-center justify-center px-6 py-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl hover:bg-emerald-100 transition-colors duration-200 text-center"
              >
                <div>
                  <Brain className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                  <div className="font-medium text-slate-900">BCBA Study Tools</div>
                  <div className="text-sm text-slate-600">Complete toolkit</div>
                </div>
              </Link>

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
                href="/bcba-mock-practice-test"
                className="flex items-center justify-center px-6 py-4 bg-white rounded-xl hover:bg-emerald-50 transition-colors duration-200 text-center"
              >
                <div>
                  <Target className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                  <div className="font-medium text-slate-900">Mock Practice Tests</div>
                  <div className="text-sm text-slate-600">Free BCBA practice</div>
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

        {/* FAQ Section */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                BCBA Practice Exam FAQ
              </h2>
              <p className="text-xl text-slate-600">
                Common questions about our free BCBA practice exams and question bank
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4">How many free BCBA practice questions can I access?</h3>
                <p className="text-slate-600 mb-4">
                  You get substantial free access: <strong>10 practice questions daily</strong> from any BCBA domain, <strong>one complete 185-question mock exam</strong>, and <strong>domain-specific practice quizzes</strong> for focused study. No credit card required to start.
                </p>
                <p className="text-slate-600 mb-4">
                  Our unique system ensures you never see the same question twice with unlimited AI generation. Our system automatically creates new, unique content to keep challenging you with fresh questions every time.
                </p>
                <p className="text-slate-600">
                  Try our <Link href="/bcba-mock-practice-test" className="text-purple-600 hover:text-purple-700 underline font-medium">free full-length practice exam</Link> to experience the difference!
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4">How does your BCBA practice exam compare to other study tools?</h3>
                <p className="text-slate-600 mb-4">
                  Unlike static flashcards or limited question banks, our practice exams offer unlimited variety and intelligent adaptation:
                </p>
                <ul className="list-disc pl-6 text-slate-600 space-y-2">
                  <li><strong>Unlimited questions:</strong> AI-generated content that never repeats, vs limited static sets</li>
                  <li><strong>Adaptive difficulty:</strong> Questions adjust to your performance level for optimal challenge</li>
                  <li><strong>Detailed explanations:</strong> Every question includes comprehensive explanations with references</li>
                  <li><strong>Real exam simulation:</strong> 185-question format with proper domain weighting and 4-hour timing</li>
                  <li><strong>Better than Quizlet:</strong> Intelligent, adaptive practice vs basic flashcard repetition</li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4">What can I access for free?</h3>
                <p className="text-slate-600 mb-4">
                  We offer substantial free access to help you get started:
                </p>
                <ul className="list-disc pl-6 text-slate-600 space-y-2">
                  <li><strong>10 practice questions daily:</strong> Choose from any of the 9 BCBA domains</li>
                  <li><strong>Domain mini-exams:</strong> Take focused tests for each domain (Domain A: 8 questions, Domain G: 35 questions, etc.)</li>
                  <li><strong>One complete mock exam:</strong> Full 185-question simulation with 4-hour timing</li>
                  <li><strong>Real-time analytics:</strong> See your fluency metrics and performance trends</li>
                  <li><strong>Detailed explanations:</strong> Learn from every question with comprehensive feedback</li>
                </ul>
                <p className="text-slate-600 mt-4">
                  No credit card required - you can start practicing immediately.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Can I get a BCBA practice exam PDF download?</h3>
                <p className="text-slate-600 mb-4">
                  While we don&rsquo;t offer static PDFs (which become outdated quickly), our online practice exams provide much more value than any downloadable file:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <h4 className="font-bold text-red-800 mb-2">Repetitive &ldquo;Drill &amp; Kill&rdquo;</h4>
                    <ul className="list-disc list-inside text-left text-sm text-red-700 space-y-1">
                      <li>Creates mechanical responding patterns</li>
                      <li>Builds memorization, not understanding</li>
                      <li>Leads to plateau effect and boredom</li>
                      <li>Fails in novel clinical situations</li>
                    </ul>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <h4 className="font-bold text-emerald-800 mb-2">Non-Repetitive Variation</h4>
                    <ul className="list-disc list-inside text-left text-sm text-emerald-700 space-y-1">
                      <li>Forces conceptual understanding</li>
                      <li>Builds generalization and transfer</li>
                      <li>Maintains engagement through novelty</li>
                      <li>Develops authentic clinical thinking</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4">What does the research say about fluency training?</h3>
                <p className="text-slate-600 mb-4">
                  Decades of behavioral research support fluency training as superior to accuracy-only methods:
                </p>
                <ul className="list-disc pl-6 text-slate-600 space-y-2">
                  <li><strong>Better retention:</strong> Fluent skills maintain over time, even with extended breaks from practice</li>
                  <li><strong>Transfer to novel situations:</strong> Fluent knowledge applies better to new, complex problems</li>
                  <li><strong>Reduced cognitive load:</strong> Automatic recall frees up working memory for higher-order thinking</li>
                  <li><strong>Improved endurance:</strong> Fluency training builds stamina for long exam sessions</li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4">How long should I spend on BCBA practice exams?</h3>
                <p className="text-slate-600 mb-4">
                  We recommend a systematic approach to practice exam preparation:
                </p>
                <ul className="list-disc pl-6 text-slate-600 space-y-2">
                  <li><strong>Daily practice:</strong> 10-15 minutes with our free daily questions to build consistency</li>
                  <li><strong>Domain focus:</strong> Take domain-specific practice quizzes to target weak areas</li>
                  <li><strong>Full-length exams:</strong> Complete 185-question practice exams weekly to build endurance</li>
                  <li><strong>Review and analyze:</strong> Use our detailed analytics to identify improvement areas</li>
                </ul>
                <p className="text-slate-600 mt-4">
                  Our adaptive system tracks your progress and suggests optimal practice schedules. Planning to work in schools? Check our <Link href="/school-based-bcba" className="text-purple-600 hover:text-purple-700 underline font-medium">school-based BCBA guide</Link> for specialized preparation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Research References */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-8">Research References</h3>
            <div className="bg-slate-50 rounded-2xl p-8 shadow-lg border border-slate-200">
              <div className="space-y-4 text-sm text-slate-700">
                <p>
                  Binder, C. (1996). Behavioral fluency: Evolution of a new paradigm. <em>The Behavior Analyst</em>, <em>19</em>(2), 163–197. https://doi.org/10.1007/BF03393163
                </p>
                <p>
                  Weiss, M. J., Pearson, N., Foley, K., & Pahl, S. (2010). The importance of fluency outcomes in learners with autism. <em>The Behavior Analyst Today</em>, <em>11</em>(4), 245–252.
                </p>
                <p>
                  Yaber-Oltra, G. E. (1993). <em>Computer-based fluency training with the terminology of behavior analysis</em> [Doctoral dissertation, Western Michigan University]. ScholarWorks at WMU. https://scholarworks.wmich.edu/dissertations/1887/
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
