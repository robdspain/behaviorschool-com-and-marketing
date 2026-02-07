"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BookOpen,
  Clock,
  GraduationCap,
  CheckCircle2,
  Star,
  Users,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const courses = [
  {
    title: "Free BCBA Masterclass",
    description:
      "A comprehensive, free 1-CEU course covering essential strategies for school-based behavior analysts. Includes video lessons, assessments, and a downloadable certificate upon completion.",
    href: "/masterclass",
    ceus: "1 Free CEU",
    price: "Free",
    status: "live" as const,
    features: [
      "BACB-approved continuing education",
      "Video-based lessons",
      "Knowledge assessment",
      "Downloadable certificate",
      "Self-paced learning",
    ],
    highlight: true,
  },
  {
    title: "Transformation Program",
    description:
      "An intensive 6-week cohort-based training program for school BCBAs who want to build systematic behavior support programs. Covers FBA systems, IEP goal frameworks, staff training, and data-driven decision making.",
    href: "/transformation-program",
    ceus: "CEUs Included",
    price: "$2,997",
    status: "live" as const,
    features: [
      "6-week live cohort format",
      "Weekly group coaching calls",
      "Complete systems & templates",
      "Community access",
      "CEUs upon completion",
    ],
    highlight: false,
  },
];

const upcomingTopics = [
  "Advanced FBA & Function-Based Interventions",
  "Ethics for School-Based Practice",
  "Supervision Best Practices",
  "Data-Driven Decision Making in Schools",
  "Staff Training & RBT Supervision",
  "ACT for Behavior Analysts",
];

export default function CEUsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumbs items={[{ label: "CEUs & Professional Development" }]} />
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeInUp}>
            <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              BACB ACE Provider
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              CEUs &amp; Professional Development{" "}
              <span className="text-blue-600">for BCBAs</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Earn continuing education credits with courses designed
              specifically for school-based behavior analysts. From free
              masterclasses to intensive training programs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/masterclass"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
              >
                Start Free Masterclass (1 CEU)
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/bacb-ace-provider"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-700 rounded-xl text-lg font-semibold border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                About Our ACE Provider Status
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="py-8 bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap justify-center gap-8 text-center">
          <div className="flex items-center gap-2 text-gray-600">
            <Award className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium">BACB ACE Provider</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <GraduationCap className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium">
              School-Focused Content
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium">Self-Paced Learning</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium">
              Built by a School BCBA
            </span>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Available Courses &amp; Programs
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Earn your CEUs while learning practical strategies you can
              implement in your school Monday morning.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {courses.map((course) => (
              <motion.div key={course.title} variants={fadeInUp}>
                <Link href={course.href} className="block group h-full">
                  <div
                    className={`bg-white border rounded-2xl p-8 h-full hover:shadow-lg transition-all duration-300 ${
                      course.highlight
                        ? "border-blue-300 ring-2 ring-blue-100"
                        : "border-gray-200 hover:border-blue-200"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          course.price === "Free"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {course.ceus}
                      </span>
                      <span className="text-2xl font-bold text-gray-900">
                        {course.price}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {course.description}
                    </p>
                    <ul className="space-y-3 mb-6">
                      {course.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center text-sm text-gray-600"
                        >
                          <CheckCircle2 className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="pt-4 border-t border-gray-100">
                      <span className="text-blue-600 font-semibold inline-flex items-center group-hover:translate-x-1 transition-transform">
                        {course.price === "Free"
                          ? "Enroll Free"
                          : "Learn More"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Topics */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="h-10 w-10 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Coming Soon: More CEU Courses
          </h2>
          <p className="text-lg text-gray-600 mb-10">
            We&apos;re developing additional BACB-approved CEU courses on these
            high-demand topics. Sign up to get notified when they launch.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto mb-10">
            {upcomingTopics.map((topic) => (
              <div
                key={topic}
                className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-200"
              >
                <Star className="h-5 w-5 text-amber-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium text-sm">
                  {topic}
                </span>
              </div>
            ))}
          </div>
          <Link
            href="/subscribe"
            className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            Get Notified About New Courses
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Start Earning CEUs Today
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Begin with our free 1-CEU Masterclass — no credit card required. Learn practical strategies for school-based behavior support.
          </p>
          <Link
            href="/masterclass/enroll"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-700 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
          >
            Enroll in Free Masterclass
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
