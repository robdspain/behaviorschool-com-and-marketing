import { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Zap, Target, TrendingUp, BarChart3, Brain, ArrowRight, Star, Award, Users, Timer } from "lucide-react";

export const metadata: Metadata = {
  title: "BCBA Study Fluency Tracking - Precision Response Time Analytics",
  description: "Track your BCBA exam fluency with millisecond precision. Our app measures response times, thinking patterns, and builds behavioral fluency through RESA-based progression (Retention, Endurance, Stability, Application).",
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
    "bcba study fluency",
    "response time tracking",
    "behavioral fluency",
    "precision teaching",
    "RESA fluency",
    "bcba exam speed",
    "millisecond timing",
    "fluency analytics"
  ],
  alternates: {
    canonical: "https://behaviorschool.com/bcba-study-fluency"
  },
  openGraph: {
    title: "BCBA Study Fluency Tracking - Precision Response Time Analytics",
    description: "Track your BCBA exam fluency with millisecond precision. Measure response times, thinking patterns, and build behavioral fluency through evidence-based progression.",
    url: "https://behaviorschool.com/bcba-study-fluency",
    siteName: "Behavior School",
    images: [
      {
        url: "/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "BCBA Study Fluency Tracking",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BCBA Study Fluency Tracking - Precision Response Time Analytics",
    description: "Track your BCBA exam fluency with millisecond precision. Measure response times, thinking patterns, and build behavioral fluency through evidence-based progression.",
    images: ["/optimized/og-image.webp"],
  },
};

export default function BCBAStudyFluencyPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "BCBA Resources", href: "/bcba-exam-prep" },
    { label: "Study Fluency", href: "/bcba-study-fluency" },
  ];

  const fluencyFeatures = [
    {
      title: "Millisecond Response Tracking",
      description: "Our system captures your response time to the millisecond, measuring both latency (thinking time) and total response duration for precise fluency analysis.",
      icon: Timer,
      benefit: "Identifies hesitation patterns and builds confidence"
    },
    {
      title: "First-Interaction Delay Analysis",
      description: "Track how long it takes you to start engaging with each question, revealing cognitive processing patterns and uncertainty indicators.",
      icon: Brain,
      benefit: "Pinpoints areas where conceptual clarity is needed"
    },
    {
      title: "Answer Change Frequency Monitoring",
      description: "Monitor how often you change answers, providing insights into confidence levels and knowledge stability across domains.",
      icon: Target,
      benefit: "Measures confidence and knowledge stability"
    },
    {
      title: "RESA-Based Progression Tracking",
      description: "Build true behavioral fluency through Retention, Endurance, Stability, and Application metrics that go beyond simple speed.",
      icon: TrendingUp,
      benefit: "Develops durable, transferable skills"
    }
  ];

  const fluencyStages = [
    {
      stage: "Retention",
      title: "70% Accuracy + Memory Consolidation",
      description: "Questions revisited in new contexts days later to ensure knowledge retention and prevent forgetting curves.",
      timeframe: "Ongoing",
      metrics: [
        "Long-term retention rates",
        "Spaced repetition effectiveness", 
        "Knowledge decay prevention",
        "Cross-session consistency"
      ],
      color: "from-blue-500 to-blue-600"
    },
    {
      stage: "Endurance", 
      title: "80% Accuracy + Extended Performance",
      description: "Sustained performance during extended practice sessions (50+ questions) without accuracy degradation.",
      timeframe: "Progressive",
      metrics: [
        "Session length tolerance",
        "Accuracy maintenance over time",
        "Fatigue resistance",
        "Concentration stability"
      ],
      color: "from-emerald-500 to-emerald-600"
    },
    {
      stage: "Stability",
      title: "90% Accuracy + Pressure Performance", 
      description: "Consistent performance under time pressure, distractions, and exam-like stress conditions.",
      timeframe: "Advanced",
      metrics: [
        "Performance under pressure",
        "Distraction resistance",
        "Timed condition accuracy",
        "Stress response patterns"
      ],
      color: "from-purple-500 to-purple-600"
    },
    {
      stage: "Application",
      title: "Generalization + Transfer",
      description: "Apply knowledge to novel scenarios and complex, multi-step problems similar to real clinical situations.",
      timeframe: "Mastery",
      metrics: [
        "Novel situation performance",
        "Principle generalization",
        "Complex problem solving", 
        "Clinical scenario accuracy"
      ],
      color: "from-orange-500 to-orange-600"
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
            "headline": "BCBA Study Fluency Tracking - Precision Response Time Analytics",
            "description": "Track your BCBA exam fluency with millisecond precision. Our app measures response times, thinking patterns, and builds behavioral fluency through RESA-based progression.",
            "url": "https://behaviorschool.com/bcba-study-fluency",
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
            "dateModified": "2025-01-15",
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://behaviorschool.com/bcba-study-fluency"
            },
            "about": [
              {
                "@type": "Thing",
                "name": "Behavioral Fluency"
              },
              {
                "@type": "Thing", 
                "name": "Response Time Analysis"
              },
              {
                "@type": "Thing",
                "name": "Precision Teaching"
              }
            ],
            "educationalLevel": "Professional",
            "teaches": [
              "Behavioral fluency measurement",
              "Response time analysis techniques", 
              "RESA-based progression tracking",
              "Precision teaching applications"
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
                "name": "What exactly is behavioral fluency in BCBA preparation?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Behavioral fluency combines accuracy, speed, retention, endurance, stability, and application (RESA). Our app tracks your response time to the millisecond, measuring thinking patterns and building automatic responding that transfers to novel clinical situations."
                }
              },
              {
                "@type": "Question", 
                "name": "How does millisecond response tracking work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our system captures multiple data points: total response time from question display to submission, first-interaction delay showing thinking time, answer change frequency indicating uncertainty, and session-by-session improvement trends."
                }
              },
              {
                "@type": "Question",
                "name": "What is RESA-based fluency progression?",
                "acceptedAnswer": {
                  "@type": "Answer", 
                  "text": "RESA stands for Retention (knowledge maintained over time), Endurance (performance during extended sessions), Stability (consistency under pressure), and Application (transfer to novel situations). This builds true behavioral competence beyond simple speed."
                }
              },
              {
                "@type": "Question",
                "name": "How is this different from regular practice questions?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Regular practice focuses only on getting correct answers. Our fluency system measures HOW you think through problems - response patterns, hesitation points, confidence levels, and cognitive processing speed that predicts real exam performance."
                }
              }
            ]
          })
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="pt-8 pb-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Hero Section */}
        <section className="relative py-16 lg:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-slate-50 rounded-3xl" />
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-blue-100 to-transparent opacity-30 blur-3xl" />
          <div className="absolute -bottom-10 left-0 w-80 h-80 rounded-full bg-gradient-to-tr from-slate-100 to-transparent opacity-20 blur-2xl" />
          
          <div className="relative text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-8">
              <Timer className="mr-2 h-4 w-4" />
              Precision Fluency Analytics
            </div>
            
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Master BCBA Exam
              <span className="bg-gradient-to-r from-blue-600 to-slate-600 bg-clip-text text-transparent"> Fluency</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Track your response time to the millisecond. Build behavioral fluency through RESA-based progression. Develop the automatic responding and clinical thinking skills that predict exam success.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                asChild 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
              >
                <a href="https://study.behaviorschool.com/free-practice" target="_blank" rel="noopener noreferrer">
                  <Timer className="mr-2 h-5 w-5" />
                  Start Fluency Tracking
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-8 text-sm text-slate-600">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <span>Millisecond precision</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-blue-600" />
                <span>RESA-based progression</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-blue-600" />
                <span>Behavioral fluency focus</span>
              </div>
            </div>
          </div>
        </section>

        {/* Fluency Tracking Features */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-slate-50">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              Precision Fluency Tracking Features
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our app measures the behavioral components of fluency that predict real exam performance and clinical competence
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {fluencyFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-start space-x-6">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-slate-100 rounded-2xl flex-shrink-0">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                    <p className="text-slate-600 mb-4">{feature.description}</p>
                    <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      {feature.benefit}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What is Behavioral Fluency? */}
        <section className="py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                What is Behavioral Fluency?
              </h2>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Behavioral fluency goes beyond simple accuracy. It combines speed, precision, retention, endurance, stability, and application to create automatic responding that transfers to real clinical situations.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-xl">
                    <Timer className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Precision Measurement</h3>
                    <p className="text-slate-600">Track response times, hesitation patterns, and confidence indicators with millisecond precision to identify specific fluency gaps.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-slate-100 rounded-xl">
                    <Brain className="h-6 w-6 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Automatic Responding</h3>
                    <p className="text-slate-600">Build effortless recall that frees up cognitive resources for complex problem-solving and clinical reasoning during exams.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-xl">
                    <BarChart3 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Transfer & Generalization</h3>
                    <p className="text-slate-600">Fluent skills naturally transfer to novel clinical scenarios, building the flexible thinking essential for effective practice.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-slate-100 rounded-2xl mb-4">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Fluency vs. Accuracy</h3>
              </div>
              
              <div className="space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                  <div className="font-medium text-red-800 mb-2">❌ Accuracy Only</div>
                  <div className="text-sm text-red-700">Knows the answer but takes too long, causing test anxiety and consuming mental resources</div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                  <div className="font-medium text-blue-800 mb-2">✅ Behavioral Fluency</div>
                  <div className="text-sm text-blue-700">Fast, confident, automatic responses that maintain under pressure and transfer to novel situations</div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-slate-50 border border-blue-200 rounded-2xl p-4">
                  <div className="font-medium text-blue-800 mb-2">🎯 RESA Components</div>
                  <div className="text-sm text-blue-700">Retention + Endurance + Stability + Application = True clinical competence</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RESA-Based Progression */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              RESA-Based Fluency Progression
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Build true behavioral fluency through evidence-based progression across four critical components
            </p>
          </div>

          <div className="space-y-8">
            {fluencyStages.map((stage, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
                  <div className={`bg-gradient-to-r ${stage.color} p-6`}>
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center space-x-4">
                        <div className="bg-white/20 rounded-full px-4 py-2 font-bold">
                          {stage.stage}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">{stage.title}</h3>
                          <p className="text-white/90">{stage.timeframe}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <p className="text-lg text-slate-600 mb-6">{stage.description}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      {stage.metrics.map((metric, metricIndex) => (
                        <div key={metricIndex} className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-700">{metric}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {index < fluencyStages.length - 1 && (
                  <div className="flex justify-center mt-6">
                    <div className="w-1 h-8 bg-gradient-to-b from-blue-300 to-slate-400 rounded-full"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Research Evidence */}
        <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              The Science Behind Behavioral Fluency
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Decades of behavior analytic research support fluency-based training for building durable, transferable skills
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
                    <p className="text-slate-600">Fluent learners maintain skills significantly longer than those achieving accuracy alone (Binder, 1996). RESA components create durable learning.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-xl flex-shrink-0">
                    <Zap className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Transfer Benefits</h4>
                    <p className="text-slate-600">Fluent skills transfer more readily to novel clinical situations, enabling superior performance on application-based exam questions.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-xl flex-shrink-0">
                    <Brain className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Cognitive Load Reduction</h4>
                    <p className="text-slate-600">Automatic responding frees working memory for higher-order clinical reasoning and complex problem-solving during exams.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Precision Teaching Applications</h3>
              <div className="space-y-4">
                <div className="bg-white/80 rounded-2xl p-4">
                  <h4 className="font-bold text-slate-900 mb-2">Rate-Based Measurement</h4>
                  <p className="text-slate-600 text-sm">Track correct and error responses per minute to identify fluency building patterns and intervention needs.</p>
                </div>
                
                <div className="bg-white/80 rounded-2xl p-4">
                  <h4 className="font-bold text-slate-900 mb-2">Celeration Tracking</h4>
                  <p className="text-slate-600 text-sm">Monitor learning acceleration over time to optimize study strategies and predict exam readiness.</p>
                </div>
                
                <div className="bg-white/80 rounded-2xl p-4">
                  <h4 className="font-bold text-slate-900 mb-2">Fluency Aims</h4>
                  <p className="text-slate-600 text-sm">Evidence-based speed targets ensure responses are fast enough to maintain under exam pressure.</p>
                </div>

                <div className="bg-white/80 rounded-2xl p-4">
                  <h4 className="font-bold text-slate-900 mb-2">Behavioral Objectives</h4>
                  <p className="text-slate-600 text-sm">RESA-based goals create measurable, clinically relevant competency standards.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="bg-gradient-to-r from-blue-600 to-slate-600 rounded-3xl p-12 text-white">
            <div className="text-center">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Ready to Build True BCBA Fluency?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Start tracking your response patterns with millisecond precision. Experience RESA-based progression that builds automatic responding and clinical competence.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-white text-blue-700 hover:bg-gray-100 px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
                >
                  <a href="https://study.behaviorschool.com/free-practice" target="_blank" rel="noopener noreferrer">
                    <Timer className="mr-2 h-5 w-5" />
                    Start Fluency Tracking
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg" 
                  className="border-white text-white hover:bg-white/10 px-8 py-4 rounded-2xl"
                >
                  <Link href="/bcba-practice-exam">
                    Try Practice Exam
                  </Link>
                </Button>
              </div>

              <div className="flex items-center justify-center space-x-8 text-sm text-blue-100 mt-8">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Precision analytics</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Evidence-based progression</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4" />
                  <span>RESA fluency focus</span>
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
                href="/bcba-practice-exam" 
                className="flex items-center justify-center px-6 py-4 bg-white rounded-xl hover:bg-blue-50 transition-colors duration-200 text-center"
              >
                <div>
                  <Target className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="font-medium text-slate-900">Practice Exams</div>
                  <div className="text-sm text-slate-600">Unlimited questions</div>
                </div>
              </Link>
              
              <Link 
                href="/bcba-mock-practice-test" 
                className="flex items-center justify-center px-6 py-4 bg-white rounded-xl hover:bg-blue-50 transition-colors duration-200 text-center"
              >
                <div>
                  <BarChart3 className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="font-medium text-slate-900">Mock Tests</div>
                  <div className="text-sm text-slate-600">Full exam simulation</div>
                </div>
              </Link>
              
              <Link 
                href="/school-based-bcba" 
                className="flex items-center justify-center px-6 py-4 bg-white rounded-xl hover:bg-blue-50 transition-colors duration-200 text-center"
              >
                <div>
                  <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="font-medium text-slate-900">School-Based BCBA</div>
                  <div className="text-sm text-slate-600">Career guidance</div>
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
                Behavioral Fluency FAQ
              </h2>
              <p className="text-xl text-slate-600">
                Common questions about fluency tracking and RESA-based progression
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4">What exactly is behavioral fluency in BCBA preparation?</h3>
                <p className="text-slate-600 mb-4">
                  Behavioral fluency combines accuracy, speed, retention, endurance, stability, and application (RESA). Our app tracks your response time to the millisecond, measuring thinking patterns and building automatic responding that transfers to novel clinical situations.
                </p>
                <p className="text-slate-600">
                  Unlike simple speed drills, we measure HOW you process information - hesitation patterns, confidence indicators, and cognitive processing that predicts real exam performance.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4">How does millisecond response tracking work?</h3>
                <p className="text-slate-600 mb-4">
                  Our system captures multiple data points for each question:
                </p>
                <ul className="list-disc pl-6 text-slate-600 space-y-2">
                  <li><strong>Total response time:</strong> From question display to answer submission</li>
                  <li><strong>First-interaction delay:</strong> How long before you start engaging</li>
                  <li><strong>Answer changes:</strong> Frequency of answer modifications (uncertainty indicator)</li>
                  <li><strong>Session patterns:</strong> Performance trends across extended practice</li>
                  <li><strong>Domain analysis:</strong> Fluency variations across BCBA content areas</li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4">What is RESA-based fluency progression?</h3>
                <p className="text-slate-600 mb-4">
                  RESA represents the four components of true behavioral fluency:
                </p>
                <ul className="list-disc pl-6 text-slate-600 space-y-2">
                  <li><strong>Retention:</strong> Knowledge maintained over time without practice</li>
                  <li><strong>Endurance:</strong> Sustained performance during extended sessions</li>
                  <li><strong>Stability:</strong> Consistent accuracy under pressure and distractions</li>
                  <li><strong>Application:</strong> Transfer to novel clinical scenarios and complex problems</li>
                </ul>
                <p className="text-slate-600 mt-4">
                  This builds authentic clinical competence that goes far beyond simple test-taking speed.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4">How is this different from regular practice questions?</h3>
                <p className="text-slate-600">
                  Regular practice focuses only on getting correct answers. Our fluency system measures HOW you think through problems - response patterns, hesitation points, confidence levels, and cognitive processing speed that predicts real exam performance. We build automatic responding that maintains under pressure, rather than just accuracy that breaks down under stress.
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
                  Johnson, K. R., & Street, E. M. (2013). From speed to fluency: An examination of the role of fluency in curriculum design and teaching. <em>The Behavior Analyst Today</em>, <em>14</em>(2), 22-34.
                </p>
                <p>
                  Kubina Jr, R. M., & Yurich, K. K. (2012). The precision teaching book. Greatness Achieved Publishing Company.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}