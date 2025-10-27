"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Check, Brain, Target, TrendingUp, BookOpen, Users, ChevronUp, ChevronDown, BarChart3, Calendar, Info } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

export default function BCBAExamPrepPage() {
  const [activeStatPopup, setActiveStatPopup] = useState<number | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const realStats = [
    {
      value: "54%",
      label: "National First-Time Pass Rate",
      description: "2024 BCBA exam first-time pass rate",
      source: "BACB (Behavior Analyst Certification Board) 2024 annual data report. In 2024, among 9,911 first-time test-takers, only 54% passed, resulting in 8,164 newly certified BCBAs. This represents a significant decline from 65% in 2020 and 60% in 2021.",
      year: "2024",
    },
    {
      value: "25%",
      label: "Retake Pass Rate",
      description: "Success rate for second-attempt candidates",
      source: "BACB 2024 annual data report shows retake pass rates remain significantly lower at around 25%, highlighting the uphill battle for second-attempt test-takers. This emphasizes the critical importance of passing on the first try.",
      year: "2024",
    },
    {
      value: "64%",
      label: "Historical Average",
      description: "Average pass rate from 2017-2020",
      source: "Research published in the journal Behavior Analysis in Practice (2021) found historical BCBA exam pass rates averaged 64% from 2017–2020. This peer-reviewed study by Dubuque & Kazemi investigated BCBA exam pass rates as a quality indicator of ABA training programs, showing a declining trend in recent years.",
      year: "2017-2020",
    },
  ];

  const faqData = [
    {
      question: "What is the BCBA exam pass rate in 2024?",
      answer: "In 2024, the first-time BCBA pass rate was 54% and the retake pass rate was 25% (BACB Annual Data). First-time pass rates have trended from 66% (2020) → 60% (2021) → 55% (2022) → 56% (2023) → 54% (2024), which emphasizes the importance of thorough preparation for your first attempt."
    },
    {
      question: "How many hours should I study for the BCBA exam?",
      answer: "Most BCBA candidates study 300-500 hours over 3-6 months. Create a BCBA exam study schedule with 2-3 focused hours daily, then intensify in the final month. Adjust based on your baseline ABA knowledge and learning pace. Consistent daily practice with adaptive questions helps maximize retention more than marathon cramming sessions."
    },
    {
      question: "What is the best BCBA exam study schedule?",
      answer: "An effective BCBA study schedule breaks down 300-500 hours across 3-6 months: Month 1-2 (Foundation): Cover all 9 content domains with 2 hours/day. Month 3-4 (Depth): Focus on weak areas identified through practice tests, 2-3 hours/day. Month 5 (Integration): Full-length mock exams weekly. Final month: Daily practice with mixed questions and timed tests. Track your progress across domains to adjust your schedule and ensure comprehensive coverage."
    },
    {
      question: "What are the hardest sections of the BCBA exam?",
      answer: "The hardest BCBA exam sections are: 1) Experimental Design (7% of exam) - requires strong research methodology knowledge, 2) Measurement, Data Display, and Interpretation (12%) - technical statistical concepts, and 3) Ethical & Professional Issues (13%) and Behavior Assessment (13%) - complex scenario-based questions requiring nuanced understanding. These sections have the lowest average scores and require the most study time."
    },
    {
      question: "How long is the BCBA certification exam?",
      answer: "The BCBA exam has 185 questions (175 scored + 10 unscored) and a 4-hour time limit. Largest sections: Behavior-Change Procedures (14%) and Concepts & Principles (14%); also Ethics (13%), Behavior Assessment (13%), Measurement (12%), Experimental Design (7%), plus three additional domains."
    },
    {
      question: "What happens if I fail the BCBA exam?",
      answer: "If you don't pass, you can retake after 30 days; up to 8 attempts within your 2-year authorization. The retake pass rate is only 25% according to 2024 BACB data, which emphasizes why comprehensive preparation for your first attempt is crucial."
    },
    {
      question: "How can school-based BCBAs prepare differently?",
      answer: "School-based BCBAs should prioritize Experimental Design, Measurement & data interpretation, and procedures less common in schools (e.g., FCT, token economies, discrete-trial training). Study school-specific scenarios for ethics questions and practice translating clinical ABA terminology to educational settings. Our platform includes school-focused practice questions that bridge this gap."
    },
    {
      question: "Where can I find free BCBA practice exam questions?",
      answer: "Behavior School offers unlimited free BCBA practice questions with detailed explanations across all 9 content domains. Our AI-powered question bank adapts to your knowledge level and provides instant feedback. Start with our free 10-question diagnostic exam, then access the full adaptive practice platform at no cost."
    }
  ];

  return (
    <div className="min-h-screen bg-bs-background">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
        <Breadcrumbs
          items={[
            { label: "BCBA Exam Prep" }
          ]}
        />
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-blue-50" />
        <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-gradient-to-br from-emerald-100 to-transparent opacity-30 blur-3xl" />
        <div className="absolute -bottom-10 left-0 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-gradient-to-tr from-blue-100 to-transparent opacity-20 blur-2xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] text-slate-900">
                    BCBA Exam Prep for School-Based Behavior Analysts
                  </h1>
                </motion.div>
                <motion.h2
                  className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-emerald-600"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  100% FREE Unlimited BCBA Practice Questions
                </motion.h2>
                <motion.p
                  className="text-lg sm:text-xl leading-relaxed text-slate-600"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  With only 54% passing in 2024, you need smarter prep. Get FREE AI-powered practice exams, customized study schedule (300-500 hours over 3-6 months), and school-specific scenarios designed for behavior analysts in education.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/free-bcba-mock-practice-test"
                    className="inline-flex items-center px-8 py-4 text-lg font-semibold bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Take Free 185-Question Mock Exam
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    href="/study"
                    className="inline-flex items-center px-8 py-4 text-lg font-semibold bg-white hover:bg-slate-50 text-emerald-700 border-2 border-emerald-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Try AI Study Platform
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
                <p className="mt-3 text-sm text-slate-600 flex items-center">
                  <Check className="w-4 h-4 text-emerald-500 mr-2" />
                  No Credit Card Required • Unlimited Questions • AI-Adaptive Difficulty
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative z-10">
                <Image
                  src="/BehaviorStudyTools/before-after-behaviorstudytools.webp"
                  alt="Before and after using Behavior Study Tools - BCBA exam prep transformation"
                  width={1184}
                  height={864}
                  className="w-full h-auto rounded-2xl shadow-2xl"
                  priority
                />
              </div>
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-2xl bg-gradient-to-br from-yellow-200 to-yellow-100 opacity-80 animate-pulse" />
              <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-xl bg-gradient-to-br from-purple-200 to-purple-100 opacity-60" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              BCBA Exam Pass Rate Reality Check
            </h2>
            <p className="text-lg text-slate-600 mb-4">
              Official BACB statistics reveal the true challenge
            </p>
            <p className="text-base text-slate-700 max-w-4xl mx-auto leading-relaxed">
              Understanding BCBA exam pass rates 2024 is crucial for your study schedule planning. The first-time BCBA exam pass rate has declined to 54% (down from 66% in 2020), with only 25% of retakers passing.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {realStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 text-center border-2 border-slate-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300">
                  <div className="relative mb-4">
                    <button
                      onClick={() => setActiveStatPopup(activeStatPopup === index ? null : index)}
                      className="absolute top-0 right-0 text-slate-400 hover:text-emerald-600 transition-colors"
                      aria-label="Show source information"
                    >
                      <Info className="w-5 h-5" />
                    </button>
                    <div className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                  </div>
                  <div className="text-slate-700 text-base font-semibold mb-1">{stat.label}</div>
                  <div className="text-xs text-slate-500">({stat.year})</div>
                </div>

                {activeStatPopup === index && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border-2 border-emerald-200 p-6 z-10">
                    <div className="relative">
                      <button
                        onClick={() => setActiveStatPopup(null)}
                        className="absolute top-0 right-0 text-slate-400 hover:text-slate-600 text-2xl leading-none font-bold"
                        aria-label="Close popup"
                      >
                        ×
                      </button>
                      <h4 className="font-semibold text-slate-900 mb-3 pr-6 text-lg">{stat.description}</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">{stat.source}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {activeStatPopup !== null && (
          <div
            className="fixed inset-0 z-5"
            onClick={() => setActiveStatPopup(null)}
          />
        )}
      </section>

      {/* Platform Benefits */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              BCBA Exam Prep Tools Built on Behavioral Science
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Evidence-based learning technology designed specifically for BCBA candidates
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Smart Practice */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-emerald-100"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Smart Practice</h3>

              <div className="space-y-4">
                <div className="flex items-start">
                  <Check className="w-6 h-6 text-emerald-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Unlimited AI-Generated Questions</h4>
                    <p className="text-sm text-slate-600">Never run out of practice material with unique questions across all 9 content domains</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <TrendingUp className="w-6 h-6 text-emerald-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Adaptive Difficulty Technology</h4>
                    <p className="text-sm text-slate-600">Questions automatically adjust to your knowledge level for optimal learning</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Data-Driven Prep */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-blue-100"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Data-Driven Prep</h3>

              <div className="space-y-4">
                <div className="flex items-start">
                  <BarChart3 className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Performance Analytics</h4>
                    <p className="text-sm text-slate-600">Track progress across all content areas and identify weak spots instantly</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Calendar className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Personalized Study Plans</h4>
                    <p className="text-sm text-slate-600">Custom pacing guides tailored to your exam date and current knowledge</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Evidence-Based Learning */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-purple-100"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Evidence-Based Learning</h3>

              <div className="space-y-4">
                <div className="flex items-start">
                  <Brain className="w-6 h-6 text-purple-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Spaced Repetition & Active Recall</h4>
                    <p className="text-sm text-slate-600">Built on proven learning techniques to maximize retention</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Users className="w-6 h-6 text-purple-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Supervisor Progress Reports</h4>
                    <p className="text-sm text-slate-600">Share detailed analytics with supervisors to demonstrate commitment</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link
              href="https://study.behaviorschool.com/auth?mode=signup&source=bcba-exam-prep-page"
              className="inline-flex items-center px-10 py-5 text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Start Free BCBA Practice Questions Now
              <ArrowRight className="ml-3 w-6 h-6" />
            </Link>
            <p className="mt-4 text-slate-600">
              Join thousands of successful BCBAs who started with our free study tools
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-slate-600">
              Everything you need to know about BCBA exam preparation
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 hover:border-emerald-300 transition-colors overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-slate-50 transition-colors"
                  aria-expanded={activeFaq === index}
                >
                  <h3 className="text-lg font-bold text-slate-900 pr-4">
                    {faq.question}
                  </h3>
                  {activeFaq === index ? (
                    <ChevronUp className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-slate-400 flex-shrink-0" />
                  )}
                </button>

                {activeFaq === index && (
                  <div className="px-8 pb-6">
                    <div className="border-t-2 border-slate-100 pt-4">
                      <p className="text-slate-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-emerald-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Beat the 54% Pass Rate?
            </h2>
            <p className="text-xl text-emerald-50 mb-8 max-w-2xl mx-auto">
              Join thousands of successful school-based BCBAs who started their journey with our comprehensive exam prep program.
            </p>
            <Link
              href="https://study.behaviorschool.com/auth?mode=signup&source=bcba-exam-prep-page"
              className="inline-flex items-center px-10 py-5 text-xl font-bold bg-white text-emerald-600 hover:bg-emerald-50 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
            >
              Start Practice Questions Now
              <ArrowRight className="ml-3 w-6 h-6" />
            </Link>
            <p className="mt-6 text-emerald-100">
              Free access • Unlimited questions • Personalized study plans • Mobile optimized
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
