
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Check, Brain, Users, FileText, Target, BookOpen, ExternalLink, ChevronRight, GraduationCap, Shield, Star, Mail } from "lucide-react";
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

export function ProductsClient() {
  return (
    <div className="min-h-screen bg-bs-background">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
        <Breadcrumbs 
          items={[
            { label: "Products" }
          ]}
        />
      </div>
      
      {/* Products Section */}
      <section id="products" className="pt-10 md:pt-14 pb-16 lg:pb-20 bg-bs-section-even">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              FREE BCBA Tools & Training
            </h1>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Professional resources for BCBA certification, behavior analysis, and school-based support
            </p>
          </div>
          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <Link
              href="/free-bcba-mock-practice-test"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md hover:shadow-lg"
              aria-label="Start free BCBA mock exam"
            >
              Start Free Mock Exam
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <span className="text-sm text-slate-600">No signup required</span>
            <Link
              href="/iep-goals"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold shadow-md hover:shadow-lg"
              aria-label="Try the IEP Goal Writer"
            >
              Try IEP Goal Writer
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {/* Trust signals */}
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3 mb-12">
            <div className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-800 text-sm font-semibold">
              <Check className="h-4 w-4" /> Aligned with BACB 6th Edition
            </div>
            <Link href="/about" className="flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-blue-800 text-sm font-semibold hover:bg-blue-100">
              <Users className="h-4 w-4" /> Built by BCBA educators
            </Link>
            <Link href="/contact" className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 text-sm font-semibold hover:bg-slate-100">
              <FileText className="h-4 w-4" /> Questions? Contact us
            </Link>
          </div>
          <motion.div
            className="grid gap-16 lg:gap-20"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Behavior Study Tools */}
            <motion.div 
              className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
              variants={fadeInUp}
            >
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-400 rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Behavior Study Tools</h2>
                </div>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Master the BCBA exam with our AI-powered study platform. Get unlimited practice questions, comprehensive mock exams, and personalized study plans that adapt to your learning style.
                </p>
                <ul className="space-y-3">
                  {[
                    "AI-powered question generation with extensive practice questions",
                    "Full 185-question mock exams mirroring the real test",
                    "Advanced analytics and performance tracking",
                    "Personalized study schedules and pacing guides"
                  ].map((feature, index) => (
                    <motion.li 
                      key={index}
                      className="flex items-center gap-3 text-slate-700"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      {feature}
                    </motion.li>
                  ))}
                </ul>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href="/behavior-study-tools" 
                    className="inline-flex items-center px-8 py-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 text-base md:text-lg font-semibold shadow-lg hover:shadow-xl group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
                    aria-label="Learn more about Behavior Study Tools"
                  >
                    Learn more about Behavior Study Tools
                    <ArrowRight className="ml-2 h-4 w-4 text-slate-900 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>

                <div className="mt-2 space-y-2">
                  <Link
                    href="/free-bcba-mock-practice-test"
                    className="inline-flex items-center text-emerald-700 hover:text-emerald-800 font-semibold"
                  >
                    Free BCBA Mock Exam (185 Questions)
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <div>
                    <Link
                      href="/study"
                      className="inline-flex items-center text-emerald-700 hover:text-emerald-800 font-semibold"
                    >
                      AI-Powered Study Platform
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                  <div>
                    <Link
                      href="/bcba-exam-prep"
                      className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                    >
                      Complete BCBA Exam Prep Guide
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
                  <div>
                    <Link
                      href="/about"
                      className="inline-flex items-center text-slate-600 hover:text-slate-700 font-medium text-sm"
                    >
                      Meet Rob Spain, BCBA - Founder
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="relative z-10">
                  <Image
                    src="/Hero/Hero-group1.webp"
                    alt="Behavior Study Tools - AI-powered BCBA exam preparation"
                    width={600}
                    height={400}
                    className="w-full h-auto rounded-2xl shadow-2xl"
                    priority
                  />
                </div>
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-2xl bg-gradient-to-br from-yellow-200 to-yellow-100 opacity-80 animate-pulse" />
                <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-xl bg-gradient-to-br from-purple-200 to-purple-100 opacity-60" />
              </div>
            </motion.div>

            {/* Supervision Tools */}
            <motion.div 
              className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
              variants={fadeInUp}
            >
              <div className="relative">
                <div className="relative z-10">
                  <Image
                    src="/Supervision/Supervision1.webp"
                    alt="Supervision Tools Dashboard"
                    width={800}
                    height={533}
                    className="w-full h-auto rounded-2xl shadow-2xl"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Supervision Tools</h2>
                </div>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Streamline your supervision practice with comprehensive tools designed for BCBA supervisors. Track hours, manage documentation, and ensure compliance with ease.
                </p>
                <ul className="space-y-3">
                  {[
                    "Automated hour tracking and documentation",
                    "Real-time supervision dashboard and analytics",
                    "Compliance monitoring and reporting tools",
                    "Integrated communication and feedback systems"
                  ].map((feature, index) => (
                    <motion.li 
                      key={index}
                      className="flex items-center gap-3 text-slate-700"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      {feature}
                    </motion.li>
                  ))}
                </ul>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/supervisors"
                    className="inline-flex items-center px-8 py-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 text-base md:text-lg font-semibold shadow-lg hover:shadow-xl group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
                    aria-label="Learn more about Supervision Tools"
                  >
                    Learn more about Supervision Tools
                    <ArrowRight className="ml-2 h-4 w-4 text-slate-900 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
                <div className="mt-2">
                  <Link
                    href="/about"
                    className="inline-flex items-center text-slate-600 hover:text-slate-700 font-medium text-sm"
                  >
                    Developed by Rob Spain, BCBA with 20+ years experience
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* IEP Goal Writer */}
            <motion.div 
              className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
              variants={fadeInUp}
            >
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">IEP Goal Writer</h2>
                </div>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Stop writing vague, unmeasurable IEP goals. Our simple tool helps you write goals that are specific, trackable, and built to drive real student success.
                </p>
                <ul className="space-y-3">
                  {[
                    "Goals that are specific, measurable, and functional",
                    "Built-in baseline data and success criteria",
                    "Generalization across multiple settings",  
                    "Maintenance planning so skills stick"
                  ].map((feature, index) => (
                    <motion.li 
                      key={index}
                      className="flex items-center gap-3 text-slate-700"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Check className="w-5 h-5 text-purple-500 flex-shrink-0" />
                      {feature}
                    </motion.li>
                  ))}
                </ul>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href="/iep-goals" 
                    className="inline-flex items-center px-8 py-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 text-base md:text-lg font-semibold shadow-lg hover:shadow-xl group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
                    aria-label="Learn more about IEP Goal Writer"
                  >
                    Learn more about IEP Goal Writer
                    <ArrowRight className="ml-2 h-4 w-4 text-slate-900 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </div>
              <div className="relative">
                <div className="relative z-10">
                  <Image
                    src="/IEP-Goal/IEP-Goal-Writing.webp"
                    alt="IEP Goal Writing Tool - Professional goal setting interface"
                    width={600}
                    height={400}
                    className="w-full h-auto rounded-2xl shadow-2xl"
                    loading="lazy"
                  />
                </div>
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-200 to-purple-100 opacity-80 animate-pulse" />
                <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-xl bg-gradient-to-br from-pink-200 to-pink-100 opacity-60" />
              </div>
            </motion.div>

            {/* ACT Matrix Guide */}
            <motion.div 
              className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
              variants={fadeInUp}
            >
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">ACT Matrix Guide</h2>
                </div>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Master values-based interventions with our comprehensive ACT Matrix guide. Help students make choices based on their values, not just their feelings.
                </p>
                <ul className="space-y-3">
                  {[
                    "Complete ACT Matrix worksheets and templates",
                    "Step-by-step implementation guide for schools",
                    "Real examples from school-based practice",
                    "Values exploration activities and exercises"
                  ].map((feature, index) => (
                    <motion.li 
                      key={index}
                      className="flex items-center gap-3 text-slate-700"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Check className="w-5 h-5 text-teal-500 flex-shrink-0" />
                      {feature}
                    </motion.li>
                  ))}
                </ul>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href="/act-matrix" 
                    className="inline-flex items-center px-8 py-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 text-base md:text-lg font-semibold shadow-lg hover:shadow-xl group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
                    aria-label="Learn more about ACT Matrix Guide"
                  >
                    Learn more about ACT Matrix Guide
                    <ArrowRight className="ml-2 h-4 w-4 text-slate-900 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </div>
              <div className="relative">
                <div className="relative z-10">
                  <div className="bg-white border-2 border-slate-300 rounded-xl p-8 shadow-2xl">
                    <div className="grid grid-cols-2 gap-6 text-center text-sm relative">
                      {/* Horizontal line */}
                      <div className="absolute inset-x-0 top-1/2 border-t border-slate-300 z-10"></div>
                      
                      {/* Top Left - Away Moves */}
                      <div className="border-r border-slate-200 pb-4 pr-4">
                        <div className="text-red-500 font-semibold mb-2">Away Moves</div>
                        <div className="text-xs text-slate-600">
                          Avoiding challenges<br/>
                          Acting out<br/>
                          Giving up
                        </div>
                      </div>
                      
                      {/* Top Right - Toward Moves */}
                      <div className="pb-4 pl-4">
                        <div className="text-emerald-600 font-semibold mb-2">Toward Moves</div>
                        <div className="text-xs text-slate-600">
                          Asking for help<br/>
                          Trying new things<br/>
                          Being kind
                        </div>
                      </div>
                      
                      {/* Bottom Left - Unhelpful Internal */}
                      <div className="border-r border-slate-200 pt-4 pr-4">
                        <div className="text-red-500 font-semibold mb-2">Difficult Thoughts</div>
                        <div className="text-xs text-slate-600">
                          &quot;I&apos;m not smart&quot;<br/>
                          Feeling anxious<br/>
                          Fear of failure
                        </div>
                      </div>
                      
                      {/* Bottom Right - Helpful Internal */}
                      <div className="pt-4 pl-4">
                        <div className="text-emerald-600 font-semibold mb-2">Helpful Thoughts</div>
                        <div className="text-xs text-slate-600">
                          &quot;I can learn&quot;<br/>
                          Feeling confident<br/>
                          Curiosity
                        </div>
                      </div>
                    </div>
                    
                    {/* Center Values Circle */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-yellow-100 border-2 border-yellow-400 rounded-full w-16 h-16 flex items-center justify-center">
                        <div className="text-yellow-800 font-bold text-xs text-center">Values</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-2xl bg-gradient-to-br from-teal-200 to-teal-100 opacity-80 animate-pulse" />
                <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-xl bg-gradient-to-br from-cyan-200 to-cyan-100 opacity-60" />
              </div>
            </motion.div>

            {/* Behavior Plan Writer */}
            <motion.div 
              className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
              variants={fadeInUp}
            >
              <div className="relative">
                <div className="relative z-10">
                  <Image
                    src="/optimized/BIP-Writer/BIP-Writer-Team.webp"
                    alt="Behavior Plan Writer - Team collaboration on behavior intervention planning"
                    width={600}
                    height={400}
                    className="w-full h-auto rounded-2xl shadow-2xl"
                    loading="lazy"
                  />
                </div>
                <div className="absolute -top-6 -left-6 w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-200 to-orange-100 opacity-80 animate-pulse" />
                <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-xl bg-gradient-to-br from-red-200 to-red-100 opacity-60" />
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Behavior Plan Writer</h2>
                </div>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Develop comprehensive behavior intervention plans with our structured templates and AI assistance. Ensure all components are properly addressed and documented.
                </p>
                <ul className="space-y-3">
                  {[
                    "Structured templates for FBA and BIP development",
                    "Evidence-based intervention strategies library",
                    "Data collection plan integration",
                    "Progress monitoring and reporting tools"
                  ].map((feature, index) => (
                    <motion.li 
                      key={index}
                      className="flex items-center gap-3 text-slate-700"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Check className="w-5 h-5 text-orange-500 flex-shrink-0" />
                      {feature}
                    </motion.li>
                  ))}
                </ul>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href="/behavior-plans" 
                    className="inline-flex items-center px-8 py-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 text-base md:text-lg font-semibold shadow-lg hover:shadow-xl group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
                    aria-label="Learn more about Behavior Plan Writer"
                  >
                    Learn more about Behavior Plan Writer
                    <ArrowRight className="ml-2 h-4 w-4 text-slate-900 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* Testimonials */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">What educators and BCBAs say</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[ 
              { quote: 'The mock exams felt exactly like the real thing and the analytics showed me what to fix.', author: 'BCBA Candidate' },
              { quote: 'The IEP goal writer saved our team hours each week and improved goal quality.', author: 'Special Education Coordinator' },
              { quote: 'Clear, school-focused guidance that actually works in classrooms.', author: 'School-based BCBA' },
            ].map((t, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-slate-800">“{t.quote}”</p>
                <div className="mt-2 text-sm text-slate-600 font-semibold">— {t.author}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Structured Data: ItemList of products */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'BCBA Mock Exams', url: 'https://behaviorschool.com/bcba-practice-exam' },
              { '@type': 'ListItem', position: 2, name: 'Free Mock Practice Test', url: 'https://behaviorschool.com/free-bcba-mock-practice-test' },
              { '@type': 'ListItem', position: 3, name: 'IEP Goal Writer', url: 'https://behaviorschool.com/iep-goals' },
              { '@type': 'ListItem', position: 4, name: 'Behavior Plan Writer', url: 'https://behaviorschool.com/behavior-plans' },
              { '@type': 'ListItem', position: 5, name: 'Study Tools Platform', url: 'https://behaviorschool.com/behavior-study-tools' },
              { '@type': 'ListItem', position: 6, name: 'School-Based BCBA Hub', url: 'https://behaviorschool.com/school-bcba' },
            ],
          }),
        }}
      />
    </div>
  );
}
