"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  FileText,
  Target,
  Brain,
  ClipboardCheck,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const tools = [
  {
    title: "IEP Goal Writer",
    description:
      "Generate values-aligned, measurable IEP behavior goals in seconds. Our AI-powered wizard creates copy-ready goals based on student needs, function of behavior, and educational context.",
    href: "/iep-goal-writer",
    icon: FileText,
    status: "live" as const,
    features: [
      "Values-based goal alignment",
      "SMART goal formatting",
      "Copy-ready output",
      "Multiple behavior domains",
    ],
  },
  {
    title: "IEP Goal Resources",
    description:
      "Explore our library of pre-written IEP behavior goals, templates, and best practices for school-based behavior analysts and special education teams.",
    href: "/iep-goals",
    icon: ClipboardCheck,
    status: "live" as const,
    features: [
      "Pre-written goal examples",
      "Domain-specific templates",
      "Best practice guides",
      "Progress monitoring tips",
    ],
  },
  {
    title: "IEP Goal Quality Checker",
    description:
      "Evaluate your existing IEP goals against SMART criteria and best practices. Get instant feedback on measurability, specificity, and alignment.",
    href: "/iep-goal-qualitychecker",
    icon: CheckCircle2,
    status: "live" as const,
    features: [
      "SMART criteria scoring",
      "Measurability analysis",
      "Improvement suggestions",
      "Best practice alignment",
    ],
  },
  {
    title: "FBA-to-BIP Generator",
    description:
      "Transform your Functional Behavior Assessment data into a comprehensive Behavior Intervention Plan. AI-powered, function-based recommendations with evidence-based strategies.",
    href: "/fba-to-bip",
    icon: Target,
    status: "live" as const,
    features: [
      "Function-based interventions",
      "Data collection plans",
      "Progress monitoring tools",
      "PDF export",
    ],
  },
  {
    title: "Behavior Plan Writer",
    description:
      "Create comprehensive behavior intervention plans with evidence-based strategies, data collection systems, and staff training materials.",
    href: "/behavior-plans",
    icon: Sparkles,
    status: "live" as const,
    features: [
      "Step-by-step wizard",
      "Function-based interventions",
      "Data collection systems",
      "Print-ready output",
    ],
  },
  {
    title: "ACT Matrix",
    description:
      "Interactive Acceptance and Commitment Therapy Matrix tool designed for school-based behavior analysts. Help students and staff identify values and committed actions.",
    href: "/act-matrix",
    icon: Brain,
    status: "live" as const,
    features: [
      "Interactive matrix tool",
      "Values identification",
      "Committed action planning",
      "School-focused framework",
    ],
  },
  {
    title: "ACT Metaphor Creator",
    description:
      "Generate age-appropriate ACT metaphors for use with students. Customize by age, context, and therapeutic goal.",
    href: "/act-tools/metaphor-creator",
    icon: Brain,
    status: "live" as const,
    features: [
      "Age-appropriate metaphors",
      "Context customization",
      "Therapeutic goal alignment",
      "Ready-to-use scripts",
    ],
  },
  {
    title: "ACT Values Sort",
    description:
      "Digital values card sort activity for students and staff. Identify core values to guide behavior support and goal setting.",
    href: "/act-tools/values-sort",
    icon: Brain,
    status: "live" as const,
    features: [
      "Digital card sort",
      "Values ranking",
      "Goal alignment",
      "Printable results",
    ],
  },
  {
    title: "IEP Goal Generator",
    description:
      "AI-powered tool that writes behavior-focused IEP goals in seconds. Input the student's needs and get IDEA-aligned, measurable goals ready to drop into any IEP.",
    href: "/iep-goal-writer",
    icon: ClipboardCheck,
    status: "live" as const,
    features: [
      "AI-generated goals",
      "IDEA-aligned",
      "Measurable criteria",
      "Copy-ready format",
    ],
  },
  {
    title: "Free BCBA Practice Exam",
    description:
      "Test your BCBA exam knowledge with free practice questions covering ethics, measurement, assessment, intervention, and more.",
    href: "/free-bcba-practice",
    icon: ClipboardCheck,
    status: "live" as const,
    features: [
      "Free practice questions",
      "Detailed explanations",
      "Multiple content areas",
      "Self-assessment tool",
    ],
  },
];

export default function BehaviorToolsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumbs
          items={[{ label: "Behavior Tools" }]}
        />
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeInUp}>
            <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-6">
              IEP &amp; Behavior Tools
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              AI-Powered Tools for{" "}
              <span className="text-emerald-600">School-Based BCBAs</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Write better IEP goals, build function-based behavior plans, and
              use ACT-based tools — all designed specifically for behavior
              analysts working in schools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/iep-goal-writer"
                className="inline-flex items-center justify-center px-8 py-4 bg-emerald-600 text-white rounded-xl text-lg font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
              >
                Try IEP Goal Writer
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/fba-to-bip"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-700 rounded-xl text-lg font-semibold border-2 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
              >
                FBA-to-BIP Generator
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Behavior Support
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From IEP goal writing to behavior intervention plans and ACT-based
              clinical tools — all in one place.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {tools.map((tool) => (
              <motion.div key={tool.title} variants={fadeInUp}>
                <Link href={tool.href} className="block group">
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 h-full hover:shadow-lg hover:border-emerald-200 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors">
                        <tool.icon className="h-6 w-6 text-emerald-600" />
                      </div>
                      {tool.status === "coming-soon" && (
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {tool.description}
                    </p>
                    <ul className="space-y-2">
                      {tool.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center text-sm text-gray-500"
                        >
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <span className="text-emerald-600 font-medium text-sm inline-flex items-center group-hover:translate-x-1 transition-transform">
                        {tool.status === "coming-soon"
                          ? "Get Notified"
                          : "Try It Free"}
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Save Hours Every Week?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Join thousands of school-based BCBAs using Behavior School tools to
            write better goals, build stronger plans, and support more students.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-700 rounded-xl text-lg font-semibold hover:bg-emerald-50 transition-colors shadow-lg"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
