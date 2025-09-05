import { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, BookOpen, Award, Users, Building2, GraduationCap, TrendingUp, Star, ArrowRight, Clock, Target, Shield, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "How to Become a School-Based BCBA: A Complete Guide",
  description: "Learn how to become a school-based BCBA with our complete guide. Find out about the responsibilities, requirements, salary, and career outlook for school-based behavior analysts.",
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
    "how to become a school bcba",
    "school based bcba",
    "bcba in schools",
    "behavior analyst education",
    "school behavior support",
    "bcba training",
    "educational behavior analysis",
    "school bcba salary",
    "school bcba job description"
  ],
  openGraph: {
    title: "How to Become a School-Based BCBA: A Complete Guide",
    description: "Learn how to become a school-based BCBA with our complete guide. Find out about the responsibilities, requirements, salary, and career outlook for school-based behavior analysts.",
    url: "https://behaviorschool.com/school-based-bcba",
    siteName: "Behavior School",
    images: [
      {
        url: "/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "How to Become a School-Based BCBA",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Become a School-Based BCBA: A Complete Guide",
    description: "Learn how to become a school-based BCBA with our complete guide. Find out about the responsibilities, requirements, salary, and career outlook for school-based behavior analysts.",
    images: ["/optimized/og-image.webp"],
  },
};

export default function SchoolBasedBCBAPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "BCBA Resources", href: "/bcba-exam-prep" },
    { label: "School-Based BCBA Guide", href: "/school-based-bcba" },
  ];

  const pathwaySteps = [
    {
      step: "01",
      title: "Complete Your Bachelor&apos;s Degree",
      description: "Earn a bachelor&apos;s degree in psychology, education, or related field with coursework in behavioral science.",
      duration: "4 years",
      icon: GraduationCap
    },
    {
      step: "02", 
      title: "Complete ABA Coursework",
      description: "Complete BACB-approved coursework sequence covering behavior analysis principles and applications.",
      duration: "1-2 years",
      icon: BookOpen
    },
    {
      step: "03",
      title: "Gain Supervised Experience",
      description: "Complete 2,000+ hours of supervised fieldwork experience in applied behavior analysis settings.",
      duration: "1-2 years", 
      icon: Users
    },
    {
      step: "04",
      title: "Pass the BCBA Exam",
      description: "Successfully pass the Board Certified Behavior Analyst examination administered by the BACB.",
      duration: "3-6 months prep",
      icon: Award
    },
    {
      step: "05",
      title: "Apply for School Positions",
      description: "Seek employment in school districts as a behavior analyst or BCBA supporting students with behavioral needs.",
      duration: "Ongoing",
      icon: Building2
    }
  ];

  const responsibilities = [
    {
      category: "Assessment & Planning",
      items: [
        "Conduct functional behavior assessments (FBAs)",
        "Develop comprehensive behavior intervention plans (BIPs)",
        "Design data collection systems for behavior tracking",
        "Collaborate with IEP teams on behavioral goals"
      ],
      icon: Target
    },
    {
      category: "Implementation & Training",
      items: [
        "Train teachers and staff on behavior interventions",
        "Provide direct consultation on classroom management",
        "Support implementation of school-wide PBIS programs",
        "Deliver professional development on ABA principles"
      ],
      icon: Users
    },
    {
      category: "Monitoring & Evaluation",
      items: [
        "Analyze behavioral data and adjust interventions",
        "Monitor progress toward IEP behavioral goals",
        "Evaluate effectiveness of behavior support plans",
        "Provide ongoing consultation and troubleshooting"
      ],
      icon: TrendingUp
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
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-slate-50 rounded-3xl" />
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-emerald-100 to-transparent opacity-30 blur-3xl" />
          <div className="absolute -bottom-10 left-0 w-80 h-80 rounded-full bg-gradient-to-tr from-slate-100 to-transparent opacity-20 blur-2xl" />
          
          <div className="relative grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                <Building2 className="mr-2 h-4 w-4" />
                Complete Career Guide
              </div>
              
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 leading-tight">
                  Become a 
                  <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent"> School-Based BCBA</span>
                </h1>
                
                <p className="text-xl text-slate-600 leading-relaxed">
                  Transform student outcomes and build a rewarding career in educational behavior analysis. Our comprehensive guide covers everything from education requirements to career advancement strategies.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
                >
                  <Link href="/bcba-exam-prep">
                    <Zap className="mr-2 h-5 w-5" />
                    Start BCBA Exam Prep
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 px-8 py-4 rounded-2xl"
                >
                  <Link href="/community">
                    <Users className="mr-2 h-5 w-5" />
                    Join BCBA Community
                  </Link>
                </Button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-slate-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span>Complete pathway guide</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-emerald-600" />
                  <span>Expert insights</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-emerald-600" />
                  <span>BACB-aligned</span>
                </div>
              </div>
            </div>

            {/* Visual Element */}
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-4">
                      <Award className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">BCBA Certification Path</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {pathwaySteps.slice(0, 3).map((step, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-slate-50 rounded-xl">
                        <div className="flex items-center justify-center w-8 h-8 bg-emerald-100 rounded-full text-emerald-700 font-bold text-sm">
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-slate-900 text-sm">{step.title}</div>
                          <div className="text-xs text-slate-600">{step.duration}</div>
                        </div>
                      </div>
                    ))}
                    <div className="text-center py-2">
                      <div className="inline-flex items-center text-emerald-600 font-medium text-sm">
                        <ArrowRight className="mr-1 h-4 w-4" />
                        Complete pathway below
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5-Step Pathway */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              Your 5-Step Path to Becoming a School-Based BCBA
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Follow this proven pathway to launch your career as a behavior analyst in educational settings
            </p>
          </div>

          <div className="space-y-8">
            {pathwaySteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col lg:flex-row items-center gap-8 p-8 bg-white rounded-3xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl">
                    <step.icon className="h-10 w-10 text-emerald-600" />
                  </div>
                  
                  <div className="flex-1 text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                      <span className="inline-flex items-center justify-center w-12 h-12 bg-emerald-600 text-white rounded-full font-bold text-lg">
                        {step.step}
                      </span>
                      <h3 className="text-2xl font-bold text-slate-900">{step.title}</h3>
                    </div>
                    <p className="text-lg text-slate-600 mb-4">{step.description}</p>
                    <div className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                      <Clock className="mr-2 h-4 w-4" />
                      {step.duration}
                    </div>
                  </div>
                </div>
                
                {index < pathwaySteps.length - 1 && (
                  <div className="flex justify-center mt-6">
                    <div className="w-1 h-8 bg-gradient-to-b from-emerald-300 to-emerald-400 rounded-full"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Key Responsibilities */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              What School-Based BCBAs Do
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              School-based BCBAs play a crucial role in supporting students with behavioral needs across educational settings
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {responsibilities.map((category, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-4">
                    <category.icon className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{category.category}</h3>
                </div>
                
                <div className="space-y-4">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Career Outlook & Salary */}
        <section className="py-20">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-3xl p-12 text-white">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                  Excellent Career Outlook
                </h2>
                <p className="text-xl text-emerald-100 mb-8">
                  The demand for school-based BCBAs continues to grow as schools recognize the value of evidence-based behavior support.
                </p>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">22%</div>
                    <div className="text-emerald-100">Job Growth Rate</div>
                    <div className="text-sm text-emerald-200">Much faster than average</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">$75K+</div>
                    <div className="text-emerald-100">Average Salary</div>
                    <div className="text-sm text-emerald-200">Varies by location</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white mb-6">Why Choose School-Based ABA?</h3>
                <div className="space-y-4">
                  {[
                    "Make a lasting impact on student success",
                    "Work in collaborative educational teams",
                    "Enjoy stable employment with benefits",
                    "Follow traditional school calendar schedules",
                    "Grow expertise in educational behavior support"
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-emerald-300" />
                      <span className="text-emerald-100">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="text-center bg-white rounded-3xl shadow-lg border border-slate-200 p-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              Ready to Start Your BCBA Journey?
            </h2>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Join thousands of behavior analysts who have successfully transitioned into school-based roles with our comprehensive training and support.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                size="lg" 
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
              >
                <Link href="/bcba-exam-prep">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Explore BCBA Exam Prep
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 px-8 py-4 rounded-2xl"
              >
                <Link href="/transformation-program">
                  <Star className="mr-2 h-5 w-5" />
                  School BCBA Program
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Related BCBA Resources Navigation */}
        <section className="py-12">
          <div className="bg-slate-100 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">Related BCBA Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link 
                href="/bcba-study-fluency" 
                className="flex items-center justify-center px-6 py-4 bg-white rounded-xl hover:bg-emerald-50 transition-colors duration-200 text-center"
              >
                <div>
                  <Zap className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                  <div className="font-medium text-slate-900">BCBA Study Fluency</div>
                  <div className="text-sm text-slate-600">Fluency-based learning</div>
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
      </div>
    </div>
  );
}