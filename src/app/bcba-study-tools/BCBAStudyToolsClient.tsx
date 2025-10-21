"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, Brain, Users, Target, BookOpen, BarChart3, Star, ChevronRight, ExternalLink, GraduationCap, Shield } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

export function BCBAStudyToolsClient() {
  const studyTools = [
    {
      title: "Free BCBA Practice Tests",
      description: "185-question practice exams with instant scoring and detailed explanations",
      features: ["4-hour simulation", "Instant feedback", "Performance analytics", "100% FREE"],
      link: "https://study.behaviorschool.com?source=behaviorschool&page=bcba-study-tools&cta=practice-tests",
      external: true,
      icon: Target,
      color: "emerald",
      badge: "FREE"
    },
    {
      title: "Interactive Study Platform",
      description: "Full-featured study app with progress tracking and personalized recommendations",
      features: ["Domain mini-exams", "Study sessions", "Progress tracking", "Mobile optimized"],
      link: "https://study.behaviorschool.com/auth?mode=signup&source=bcba-study-tools-page",
      external: true,
      icon: Brain,
      color: "blue",
      badge: "FREE"
    },
    {
      title: "Domain-Specific Practice",
      description: "Targeted practice for each BCBA exam domain with focused question sets",
      features: ["Ethics practice", "Behavior assessment", "Intervention design", "Implementation"],
      link: "https://study.behaviorschool.com/auth?mode=signup&source=bcba-study-tools-page",
      external: true,
      icon: BookOpen,
      color: "purple",
      badge: "FREE"
    },
    {
      title: "Performance Analytics",
      description: "Detailed analytics to identify strengths and areas for improvement",
      features: ["Score tracking", "Domain breakdown", "Study recommendations", "Progress reports"],
      link: "https://study.behaviorschool.com/auth?mode=signup&source=bcba-study-tools-page",
      external: true,
      icon: BarChart3,
      color: "orange",
      badge: "FREE"
    }
  ];

  const freeResources = [
    {
      title: "IEP Behavior Goals",
      description: "Create professional IEP behavior goals in minutes",
      link: "/iep-behavior-goals"
    },
    {
      title: "Behavior Planning Tools",
      description: "Templates and tools for intervention planning",
      link: "/behavior-plans"
    },
    {
      title: "BCBA Exam Prep Free",
      description: "Comprehensive guides for BCBA exam preparation",
      link: "/bcba-exam-prep"
    }
  ];

  return (
    <div className="min-h-screen bg-bs-background">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "BCBA Study Tools" }
          ]}
        />
      </div>

      {/* Gateway Banner - High Visibility CTA */}
      <section className="bg-gradient-to-r from-emerald-600 to-emerald-500 border-b-4 border-emerald-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                <ExternalLink className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Ready to Start Practicing?</h2>
                <p className="text-emerald-50 text-sm">All study tools are available at study.behaviorschool.com</p>
              </div>
            </div>
            <Link
              href="https://study.behaviorschool.com?source=behaviorschool&page=bcba-study-tools&cta=gateway-banner"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-white text-emerald-600 font-bold rounded-xl hover:bg-emerald-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 whitespace-nowrap"
            >
              Launch Study Platform
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        {/* Premium Background with Depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-blue-50"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-100/60 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 left-0 w-80 h-80 bg-gradient-to-tr from-blue-100/40 to-transparent rounded-full blur-2xl"></div>

        {/* Floating Elements for Premium Feel */}
        <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-emerald-400 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-3/4 left-1/4 w-3 h-3 bg-blue-400 rounded-full opacity-40 animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-emerald-500 rounded-full opacity-50 animate-ping" style={{ animationDelay: '2s' }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {/* Premium Badge with Glow Effect */}
            <motion.div variants={fadeInUp} className="mb-8">
              <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold rounded-full shadow-lg">
                <Target className="w-4 h-4 mr-2" />
                Complete BCBA Study Ecosystem
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full blur opacity-50 -z-10"></div>
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight"
            >
              BCBA Study Tools & <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">Exam Mastery</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl text-slate-600 mb-8 leading-relaxed max-w-3xl mx-auto"
            >
              Professional-grade study ecosystem designed by practicing BCBAs. Comprehensive practice tests, adaptive learning technology, and performance analytics to maximize your exam success.
            </motion.p>

            {/* Stats Bar for Credibility */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap justify-center gap-8 mb-10 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">185+</div>
                <div className="text-sm text-slate-600">Practice Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">4-Hour</div>
                <div className="text-sm text-slate-600">Exam Simulation</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">Real-Time</div>
                <div className="text-sm text-slate-600">Analytics</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">100%</div>
                <div className="text-sm text-slate-600">Free Access</div>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex justify-center"
            >
              <Link
                href="/bcba-mock-practice-test"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Start Free Mock Exam
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Study Tools Grid */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Complete Study Toolkit
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              From basic practice to advanced analytics, we have everything you need to succeed on your BCBA exam.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {studyTools.map((tool, index) => {
              const Icon = tool.icon;
              const colorClasses = {
                emerald: {
                  gradient: "from-emerald-500 to-emerald-600",
                  hover: "group-hover:from-emerald-600 group-hover:to-emerald-700",
                  glow: "group-hover:shadow-emerald-500/25",
                  border: "group-hover:border-emerald-200"
                },
                blue: {
                  gradient: "from-blue-500 to-blue-600",
                  hover: "group-hover:from-blue-600 group-hover:to-blue-700",
                  glow: "group-hover:shadow-blue-500/25",
                  border: "group-hover:border-blue-200"
                },
                purple: {
                  gradient: "from-purple-500 to-purple-600",
                  hover: "group-hover:from-purple-600 group-hover:to-purple-700",
                  glow: "group-hover:shadow-purple-500/25",
                  border: "group-hover:border-purple-200"
                },
                orange: {
                  gradient: "from-orange-500 to-orange-600",
                  hover: "group-hover:from-orange-600 group-hover:to-orange-700",
                  glow: "group-hover:shadow-orange-500/25",
                  border: "group-hover:border-orange-200"
                }
              };

              const colors = colorClasses[tool.color as keyof typeof colorClasses];

              return (
                <motion.div
                  key={tool.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1 ${colors.glow} ${colors.border}`}
                >
                  {/* Premium Background Pattern */}
                  <div className="absolute top-0 right-0 w-24 h-24 opacity-5">
                    <Icon className="w-full h-full text-slate-900" />
                  </div>

                  {/* Gradient Accent Line */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.gradient} ${colors.hover} transition-all duration-300`}></div>

                  <div className="relative p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-r ${colors.gradient} ${colors.hover} flex items-center justify-center shadow-lg transition-all duration-300`}>
                        <Icon className="w-7 h-7 text-white" />
                        {/* Icon glow effect */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${colors.gradient} rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity -z-10`}></div>
                      </div>
                      <div className="flex items-center gap-2">
                        {tool.external && (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-emerald-700 bg-emerald-100 rounded-full">
                            Platform
                          </span>
                        )}
                        {tool.external && (
                          <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                        )}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-slate-800 transition-colors">
                      {tool.title}
                    </h3>

                    <p className="text-slate-600 mb-6 leading-relaxed">
                      {tool.description}
                    </p>

                    <div className="space-y-3 mb-8">
                      {tool.features.map((feature, i) => (
                        <div key={i} className="flex items-center text-sm text-slate-600">
                          <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center mr-3 flex-shrink-0">
                            <Check className="w-3 h-3 text-emerald-600" />
                          </div>
                          <span className="group-hover:text-slate-700 transition-colors">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Link
                      href={tool.link}
                      className={`inline-flex items-center px-4 py-2 text-sm font-semibold bg-gradient-to-r ${colors.gradient} text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 group-hover:shadow-xl`}
                    >
                      {tool.external ? "Open Platform" : "Try Free"}
                      <ChevronRight className="ml-1 w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Professional Credibility Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Designed by <span className="text-emerald-400">Practicing BCBAs</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Created by behavior analysts who understand the real challenges of BCBA certification and school-based practice.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Evidence-Based</h3>
              <p className="text-slate-300 text-sm">
                Built on established behavioral science principles and current BCBA exam standards
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Field-Tested</h3>
              <p className="text-slate-300 text-sm">
                Developed and refined through real-world use by behavior analysts in schools
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Ethical Practice</h3>
              <p className="text-slate-300 text-sm">
                Committed to professional standards and ethical behavior analysis practice
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-slate-300 italic">
              &ldquo;Resources created by Rob Spain, BCBA, IBA &mdash; combining 20+ years of educational experience with board certification expertise&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Enhanced Free Resources Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 text-sm font-semibold rounded-full mb-4">
              <Star className="w-4 h-4 mr-2" />
              100% Free Access
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Professional <span className="text-emerald-600">BCBA Resources</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Start your BCBA journey with our professionally-developed tools and resources.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {freeResources.map((resource, index) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-emerald-200 hover:-translate-y-1"
              >
                {/* Gradient accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-t-xl"></div>

                <div className="relative">
                  <h3 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    {resource.description}
                  </p>
                  <Link
                    href={resource.link}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Access Free
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-slate-600">
              Get answers to common questions about our BCBA study tools and exam preparation resources
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                What BCBA study tools are included in the complete toolkit?
              </h3>
              <p className="text-slate-600 mb-4">
                Our comprehensive BCBA study toolkit includes unlimited practice questions, domain mini-exams, full-length mock tests, performance analytics, study guides, and interactive learning tools. All resources are designed specifically for the BCBA exam format and content areas.
              </p>
              <p className="text-slate-600">
                You can start with our <Link href="/bcba-mock-practice-test" className="text-emerald-600 hover:text-emerald-700 underline font-medium">free BCBA mock practice test</Link> to experience the quality of our resources.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                How do I access the interactive study platform?
              </h3>
              <p className="text-slate-600 mb-4">
                The interactive study platform is available at study.behaviorschool.com with both free and premium access options. You can start immediately with free practice questions and upgrade for unlimited access to all study tools and analytics.
              </p>
              <p className="text-slate-600">
                The platform includes domain-specific practice, progress tracking, and personalized study recommendations based on your performance.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                Are these study tools suitable for school-based BCBAs?
              </h3>
              <p className="text-slate-600 mb-4">
                Yes! Our study tools are designed by practicing school-based BCBAs and include specific content relevant to educational settings. The practice questions cover scenarios commonly encountered in schools.
              </p>
              <p className="text-slate-600">
                For additional school-specific resources, explore our <Link href="/iep-behavior-goals" className="text-emerald-600 hover:text-emerald-700 underline font-medium">IEP behavior goals generator</Link> and <Link href="/behavior-plans" className="text-emerald-600 hover:text-emerald-700 underline font-medium">behavior intervention planning tools</Link>.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                What makes these study tools different from other BCBA prep resources?
              </h3>
              <p className="text-slate-600 mb-4">
                Our tools combine evidence-based learning methods with AI-powered question generation, ensuring you never see repeated content. The platform provides detailed analytics to identify knowledge gaps and personalized study recommendations.
              </p>
              <p className="text-slate-600">
                All content is created by practicing BCBAs and regularly updated to reflect current exam standards and best practices in behavior analysis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Resources Section */}
      <section className="py-16 lg:py-24 bg-bs-section-odd">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Complete BCBA Resource Library
            </h2>
            <p className="text-xl text-slate-600">
              Explore our full range of professional development tools for behavior analysts
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Link
              href="/bcba-exam-prep"
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-slate-200 group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                BCBA Exam Prep Guide
              </h3>
              <p className="text-slate-600 text-sm">
                Comprehensive exam preparation guide with study strategies, tips, and detailed content review
              </p>
            </Link>

            <Link
              href="/bcba-practice-exam"
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-slate-200 group"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">
                Practice Exam Platform
              </h3>
              <p className="text-slate-600 text-sm">
                Unlimited adaptive practice questions with detailed explanations and performance analytics
              </p>
            </Link>

            <Link
              href="/school-based-bcba"
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-slate-200 group"
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                School-Based BCBA Guide
              </h3>
              <p className="text-slate-600 text-sm">
                Career guidance and professional development resources for behavior analysts in schools
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-emerald-600 to-emerald-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Pass Your BCBA Exam?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Join thousands of behavior analysts who have used our study tools to achieve BCBA certification success.
          </p>
          <Link
            href="https://study.behaviorschool.com/auth?mode=signup&source=bcba-study-tools-page"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-white text-emerald-600 rounded-xl hover:bg-slate-50 transition-colors group"
          >
            Access Full Study Platform
            <ExternalLink className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
