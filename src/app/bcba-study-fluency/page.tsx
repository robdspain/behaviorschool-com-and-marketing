import { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Zap, Target, TrendingUp, Clock, BarChart3, Brain, Lightbulb, ArrowRight, Star, Award, Users, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "BCBA Study Fluency: The Secret to Passing the BCBA Exam",
  description: "Discover how fluency-based learning can help you pass the BCBA exam. Learn about the benefits of fluency, how to use it in your studies, and how our tools can help you succeed.",
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
    "bcba study fluency practice test",
    "bcba fluency practice",
    "bcba exam prep",
    "behavior analyst study",
    "bcba practice questions",
    "fluency based learning",
    "precision teaching",
    "safmeds"
  ],
  openGraph: {
    title: "BCBA Study Fluency: The Secret to Passing the BCBA Exam",
    description: "Discover how fluency-based learning can help you pass the BCBA exam. Learn about the benefits of fluency, how to use it in your studies, and how our tools can help you succeed.",
    url: "https://behaviorschool.com/bcba-study-fluency",
    siteName: "Behavior School",
    images: [
      {
        url: "/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "BCBA Study Fluency",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BCBA Study Fluency: The Secret to Passing the BCBA Exam",
    description: "Discover how fluency-based learning can help you pass the BCBA exam. Learn about the benefits of fluency, how to use it in your studies, and how our tools can help you succeed.",
    images: ["/optimized/og-image.webp"],
  },
};

export default function BCBAStudyFluencyPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "BCBA Resources", href: "/bcba-exam-prep" },
    { label: "Study Fluency", href: "/bcba-study-fluency" },
  ];

  const fluencyPrinciples = [
    {
      title: "Speed + Accuracy",
      description: "True fluency combines both speed and accuracy - you can answer quickly AND correctly.",
      icon: Zap,
      benefit: "Reduces test anxiety and cognitive load"
    },
    {
      title: "Automatic Recall",
      description: "Information becomes automatic, freeing up mental resources for complex problem-solving.",
      icon: Brain,
      benefit: "Improves performance on application questions"
    },
    {
      title: "Retention & Transfer",
      description: "Fluent skills are maintained longer and transfer better to new situations.",
      icon: Target,
      benefit: "Knowledge sticks beyond the exam"
    },
    {
      title: "Endurance Building",
      description: "Fluency training builds the stamina needed for long exam sessions.",
      icon: TrendingUp,
      benefit: "Maintain performance throughout 4-hour exam"
    }
  ];

  const studyStrategies = [
    {
      phase: "Foundation",
      title: "Build Accurate Knowledge",
      description: "Master the basic concepts and terminology with 100% accuracy before focusing on speed.",
      timeframe: "Weeks 1-4",
      activities: [
        "Study core ABA principles thoroughly",
        "Create comprehensive flashcards",
        "Practice until you achieve 100% accuracy",
        "Focus on understanding, not speed"
      ],
      color: "from-blue-500 to-blue-600"
    },
    {
      phase: "Fluency",
      title: "Develop Speed + Accuracy",
      description: "Build fluency through timed practice sessions that combine speed with maintained accuracy.",
      timeframe: "Weeks 5-8",
      activities: [
        "Time yourself on practice questions",
        "Aim for quick, confident responses",
        "Track both speed and accuracy metrics",
        "Identify and drill weak areas"
      ],
      color: "from-emerald-500 to-emerald-600"
    },
    {
      phase: "Application",
      title: "Transfer to Complex Problems",
      description: "Apply fluent knowledge to complex, multi-step problems similar to those on the BCBA exam.",
      timeframe: "Weeks 9-12",
      activities: [
        "Practice scenario-based questions",
        "Work through case studies",
        "Take full-length practice exams",
        "Simulate actual exam conditions"
      ],
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="pt-8 pb-4">
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
              Fluency-Based Learning
            </div>
            
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              The Fluency Factor: The Missing Piece in Your 
              <span className="bg-gradient-to-r from-purple-600 to-emerald-600 bg-clip-text text-transparent"> BCBA Exam Prep</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              The BCBA exam is tough, and many students struggle despite knowing the material. Fluency is the key to not just knowing the material, but mastering it. It&apos;s the difference between hesitation and confidence, between passing and excelling.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                asChild 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
              >
                <a href="https://study.behaviorschool.com/free-practice" target="_blank" rel="noopener noreferrer">
                  <Target className="mr-2 h-5 w-5" />
                  Try Free Fluency Practice
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="border-2 border-purple-200 text-purple-700 hover:bg-purple-50 px-8 py-4 rounded-2xl"
              >
                <Link href="/bcba-exam-prep">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Full Exam Prep Course
                </Link>
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

        {/* What is Fluency-Based Learning? */}
        <section className="py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                What is Fluency-Based Learning?
              </h2>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Fluency goes beyond just knowing the right answer. It&apos;s about knowing it quickly, confidently, and automatically. When you&apos;re fluent, you don&apos;t have to think hard about basic concepts—they become second nature.
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

        {/* The 4 Principles of Fluency */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              The 4 Principles of BCBA Study Fluency
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Understanding these core principles will transform how you approach BCBA exam preparation
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {fluencyPrinciples.map((principle, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-start space-x-6">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-emerald-100 rounded-2xl flex-shrink-0">
                    <principle.icon className="h-8 w-8 text-purple-600" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{principle.title}</h3>
                    <p className="text-slate-600 mb-4">{principle.description}</p>
                    <div className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      {principle.benefit}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3-Phase Study Strategy */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              3-Phase Fluency Building Strategy
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Follow this proven progression to build true fluency in ABA concepts and principles
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

        {/* Fluency vs Traditional Comparison */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              Fluency vs. Traditional Study Methods
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              See how fluency-based approaches compare to conventional study techniques
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="p-8 bg-red-50">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-4">
                    <BookOpen className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-red-800">Traditional Methods</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-red-700">Focus on accuracy alone without speed consideration</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-red-700">Passive reading and highlighting of materials</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-red-700">Infrequent practice with long study sessions</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-red-700">Limited measurement of progress</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-red-700">Skills fade quickly without continued practice</p>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-emerald-50">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-4">
                    <Zap className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-emerald-800">Fluency-Based Methods</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <p className="text-emerald-700">Combines speed and accuracy for true mastery</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <p className="text-emerald-700">Active recall and frequent self-testing</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <p className="text-emerald-700">Short, frequent practice sessions with timing</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <p className="text-emerald-700">Precise tracking of rate and accuracy data</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <p className="text-emerald-700">Durable skills that maintain over time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Success Implementation Guide */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              Implementing Fluency Training Successfully
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Practical strategies for integrating fluency-based methods into your BCBA exam preparation
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                title: "Start with Accuracy First",
                description: "Build a solid foundation before focusing on speed",
                steps: [
                  "Master basic concepts with 100% accuracy",
                  "Use flashcards and self-testing for foundational knowledge",
                  "Don&apos;t time yourself until accuracy is consistent",
                  "Focus on understanding before memorization"
                ],
                icon: Target,
                color: "blue"
              },
              {
                title: "Add Timing Gradually",
                description: "Introduce speed requirements systematically",
                steps: [
                  "Begin with generous time limits",
                  "Gradually reduce time as accuracy maintains",
                  "Track both speed and accuracy metrics",
                  "Celebrate improvements in both dimensions"
                ],
                icon: Clock,
                color: "emerald"
              },
              {
                title: "Practice Daily & Track Progress",
                description: "Consistent practice with data-driven adjustments",
                steps: [
                  "Schedule 15-20 minute daily practice sessions",
                  "Use charts to visualize your progress over time",
                  "Adjust difficulty based on performance data",
                  "Review and analyze trends weekly"
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

        {/* CTA Section */}
        <section className="py-20">
          <div className="bg-gradient-to-r from-purple-600 to-emerald-600 rounded-3xl p-12 text-white">
            <div className="text-center">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Ready to Build Your BCBA Study Fluency?
              </h2>
              <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                Start with our free fluency practice tools and experience the difference that speed + accuracy makes in your exam preparation.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-white text-purple-700 hover:bg-gray-100 px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
                >
                  <a href="https://study.behaviorschool.com/free-practice" target="_blank" rel="noopener noreferrer">
                    <Zap className="mr-2 h-5 w-5" />
                    Start Free Practice Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
                
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-2xl"
                >
                  <Link href="/behavior-study-tools">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Explore All Study Tools
                  </Link>
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
            </div>
          </div>
        </section>

        {/* Research References */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-8">Research References</h3>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
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