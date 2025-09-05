import { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Target, TrendingUp, Zap, BarChart3, Brain, Shield, ArrowRight, Star, Award, Users, BookOpen, Timer, PlayCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Free BCBA Mock Practice Test: The Ultimate Tool for Exam Success",
  description: "Boost your confidence and pass the BCBA exam with our free mock practice tests. Simulate the real exam, identify your weaknesses, and get detailed feedback to focus your studies.",
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
    "bcba mock practice test free",
    "free bcba practice test",
    "bcba exam simulation",
    "bcba mock exam",
    "bcba practice questions free",
    "bcba test prep",
    "bcba exam prep"
  ],
  openGraph: {
    title: "Free BCBA Mock Practice Test: The Ultimate Tool for Exam Success",
    description: "Boost your confidence and pass the BCBA exam with our free mock practice tests. Simulate the real exam, identify your weaknesses, and get detailed feedback to focus your studies.",
    url: "https://behaviorschool.com/bcba-mock-practice-test",
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
    title: "Free BCBA Mock Practice Test: The Ultimate Tool for Exam Success",
    description: "Boost your confidence and pass the BCBA exam with our free mock practice tests. Simulate the real exam, identify your weaknesses, and get detailed feedback to focus your studies.",
    images: ["/optimized/og-image.webp"],
  },
};

export default function BCBAMockPracticeTestPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "BCBA Resources", href: "/bcba-exam-prep" },
    { label: "Mock Practice Test", href: "/bcba-mock-practice-test" },
  ];

  const mockTestFeatures = [
    {
      title: "Real Exam Simulation",
      description: "Experience the exact format, timing, and question types you&apos;ll encounter on the actual BCBA exam.",
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
      title: "Quick Mini Mock",
      description: "25 questions in 30 minutes - perfect for focused practice sessions",
      duration: "30 minutes",
      questions: "25 questions",
      ideal: "Daily practice",
      ctaText: "Start Mini Mock",
      ctaUrl: "https://study.behaviorschool.com/free-practice",
      popular: false
    },
    {
      title: "Full Practice Exam",
      description: "Complete 185-question simulation matching the real BCBA exam format",
      duration: "4 hours",
      questions: "185 questions",
      ideal: "Comprehensive assessment",
      ctaText: "Take Full Mock Exam",
      ctaUrl: "https://study.behaviorschool.com/free-practice",
      popular: true
    },
    {
      title: "Targeted Practice",
      description: "Focus on specific content areas where you need the most improvement",
      duration: "Flexible",
      questions: "Customizable",
      ideal: "Skill building",
      ctaText: "Practice by Topic",
      ctaUrl: "https://study.behaviorschool.com/free-practice",
      popular: false
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
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-emerald-50 rounded-3xl" />
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-blue-100 to-transparent opacity-30 blur-3xl" />
          <div className="absolute -bottom-10 left-0 w-80 h-80 rounded-full bg-gradient-to-tr from-emerald-100 to-transparent opacity-20 blur-2xl" />
          
          <div className="relative text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-8">
              <PlayCircle className="mr-2 h-4 w-4" />
              Free Mock Practice Tests
            </div>
            
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Master the BCBA Exam with 
              <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent"> Realistic Mock Tests</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Build confidence, identify weak areas, and perfect your test-taking strategy with our comprehensive BCBA mock practice tests. Experience the real exam before exam day.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                asChild 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
              >
                <a href="https://study.behaviorschool.com/free-practice" target="_blank" rel="noopener noreferrer">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Start Free Mock Test
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="border-2 border-blue-200 text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-2xl"
              >
                <Link href="/behavior-study-tools">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Explore Study Tools
                </Link>
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-8 text-sm text-slate-600">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>Quick signup</span>
              </div>
              <div className="flex items-center space-x-2">
                <Timer className="h-4 w-4 text-emerald-600" />
                <span>Realistic timing</span>
              </div>
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-emerald-600" />
                <span>Detailed analytics</span>
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
                  
                  <div className="space-y-3">
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

        {/* Success Statistics */}
        <section className="py-20">
          <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-3xl p-12 text-white">
            <div className="text-center">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Proven Results from Practice Testing
              </h2>
              <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
                Students who take multiple mock exams show significantly higher pass rates and confidence levels
              </p>
              
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">85%</div>
                  <div className="text-blue-100">Higher confidence</div>
                  <div className="text-sm text-blue-200">After 3+ mock exams</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">3x</div>
                  <div className="text-blue-100">Better retention</div>
                  <div className="text-sm text-blue-200">vs. passive study methods</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">92%</div>
                  <div className="text-blue-100">Recommend to peers</div>
                  <div className="text-sm text-blue-200">Student satisfaction rate</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-white text-blue-700 hover:bg-gray-100 px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
                >
                  <a href="https://study.behaviorschool.com/free-practice" target="_blank" rel="noopener noreferrer">
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Take Your First Mock Test
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
                
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-2xl"
                >
                  <Link href="/bcba-exam-prep">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Full Exam Prep Course
                  </Link>
                </Button>
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
              
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="border-2 border-blue-200 text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-2xl"
              >
                <Link href="/community">
                  <Users className="mr-2 h-5 w-5" />
                  Join Study Community
                </Link>
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
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}