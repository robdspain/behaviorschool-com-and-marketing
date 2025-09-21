"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, Brain, Users, FileText, Target, BookOpen, PlayCircle, BarChart3, Clock, Star, ChevronRight, ExternalLink } from "lucide-react";
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
      features: ["4-hour simulation", "Instant feedback", "Performance analytics", "Free access"],
      link: "/bcba-mock-practice-test",
      external: false,
      icon: Target,
      color: "emerald"
    },
    {
      title: "Interactive Study Platform",
      description: "Full-featured study app with progress tracking and personalized recommendations",
      features: ["Domain mini-exams", "Study sessions", "Progress tracking", "Mobile app"],
      link: "https://study.behaviorschool.com",
      external: true,
      icon: Brain,
      color: "blue"
    },
    {
      title: "Domain-Specific Practice",
      description: "Targeted practice for each BCBA exam domain with focused question sets",
      features: ["Ethics practice", "Behavior assessment", "Intervention design", "Implementation"],
      link: "https://study.behaviorschool.com/domain-mini-exams",
      external: true,
      icon: BookOpen,
      color: "purple"
    },
    {
      title: "Performance Analytics",
      description: "Detailed analytics to identify strengths and areas for improvement",
      features: ["Score tracking", "Domain breakdown", "Study recommendations", "Progress reports"],
      link: "https://study.behaviorschool.com/dashboard",
      external: true,
      icon: BarChart3,
      color: "orange"
    }
  ];

  const freeResources = [
    {
      title: "IEP Goal Writer",
      description: "Create professional IEP behavior goals in minutes",
      link: "/iep-behavior-goals"
    },
    {
      title: "Behavior Planning Tools",
      description: "Templates and tools for intervention planning",
      link: "/behavior-plans"
    },
    {
      title: "Study Guides",
      description: "Comprehensive guides for BCBA exam preparation",
      link: "/bcba-exam-prep"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "BCBA Study Tools" }
          ]}
        />
      </div>

      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-emerald-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 text-sm font-semibold rounded-full">
                🎯 Complete BCBA Study Toolkit
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight"
            >
              BCBA Study Tools & <span className="text-emerald-600">Exam Prep</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl text-slate-600 mb-8 leading-relaxed"
            >
              Everything you need to pass your BCBA exam: practice tests, study guides, interactive tools, and performance analytics. Start with free resources or access our complete study platform.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="https://study.behaviorschool.com/free-practice"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors group"
              >
                Start Free Practice
                <ExternalLink className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/bcba-mock-practice-test"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold border-2 border-emerald-600 text-emerald-600 rounded-xl hover:bg-emerald-50 transition-colors"
              >
                Free Mock Exam
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
                emerald: "from-emerald-500 to-emerald-600",
                blue: "from-blue-500 to-blue-600",
                purple: "from-purple-500 to-purple-600",
                orange: "from-orange-500 to-orange-600"
              };

              return (
                <motion.div
                  key={tool.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden hover:shadow-2xl transition-shadow group"
                >
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${colorClasses[tool.color as keyof typeof colorClasses]} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      {tool.external && (
                        <ExternalLink className="w-5 h-5 text-slate-400" />
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      {tool.title}
                    </h3>

                    <p className="text-slate-600 mb-6">
                      {tool.description}
                    </p>

                    <ul className="space-y-2 mb-6">
                      {tool.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-sm text-slate-600">
                          <Check className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={tool.link}
                      className="inline-flex items-center text-emerald-600 font-semibold hover:text-emerald-700 group-hover:translate-x-1 transition-all"
                    >
                      {tool.external ? "Open Study Platform" : "Try Free"}
                      <ChevronRight className="ml-1 w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Free Resources Section */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Free BCBA Resources
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Start your BCBA journey with our free tools and resources.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {freeResources.map((resource, index) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow group"
              >
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {resource.title}
                </h3>
                <p className="text-slate-600 mb-4">
                  {resource.description}
                </p>
                <Link
                  href={resource.link}
                  className="inline-flex items-center text-emerald-600 font-semibold hover:text-emerald-700 group-hover:translate-x-1 transition-all"
                >
                  Access Free
                  <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
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
      <section className="py-16 lg:py-24 bg-slate-50">
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
            href="https://study.behaviorschool.com"
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