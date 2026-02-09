"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  ArrowRight,
  Users,
  Target,
  Heart,
  Shield,
  BookOpen,
  GraduationCap,
  Mail,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function AboutContent() {
  const currentYear = new Date().getFullYear();
  const yearsSinceStart = currentYear - 2001;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 lg:pt-36 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-blue-50" />
        <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-gradient-to-br from-emerald-100 to-transparent opacity-30 blur-3xl" />
        <div className="absolute -bottom-10 left-0 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-gradient-to-tr from-blue-100 to-transparent opacity-20 blur-2xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.05] text-slate-900">
                About Behavior School
              </h1>
              <p className="text-xl sm:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
                Practical systems, tools, and training for behavior analysts working in schools. Built for real classrooms,
                grounded in the science of learning and behavior.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founder Story Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">Our Story</h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  {yearsSinceStart} years ago, I stood in front of a classroom of students with significant behavioral and learning needs.
                  One student in particular had completely given up on reading. He struggled so profoundly that even trying seemed impossible.
                </p>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Then a behavior analyst visited my classroom and modeled a different way forward—using behavioral principles
                  to teach in a structured, systematic way. Within a year, that student gained three grade levels in reading.
                  That moment changed the trajectory of my career.
                </p>
                <div className="bg-emerald-50 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">I realized two things:</h3>
                  <ol className="space-y-3 text-slate-700">
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">1</span>
                      <span>Behavior principles unlock potential when applied with skill and consistency.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">2</span>
                      <span>Systems matter. Without the right structures, even the best strategies fall apart.</span>
                    </li>
                  </ol>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-2xl">
                <div className="text-center space-y-6">
                  <div className="relative mx-auto w-32 h-32">
                    <Image
                      src="/optimized/profile-Rob.webp"
                      alt="Rob Spain, BCBA, IBA - Founder of Behavior School"
                      width={128}
                      height={128}
                      className="rounded-full object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Rob Spain, BCBA, IBA</h3>
                    <p className="text-slate-600 mb-4">Founder & Behavior Analyst</p>
                    <Link
                      href="https://robspain.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      robspain.com
                    </Link>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-slate-900">Connect with Rob</h4>
                    <div className="flex justify-center space-x-4">
                      <a
                        href="https://www.linkedin.com/in/robspain/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                      >
                        <Linkedin className="w-5 h-5 text-blue-700" />
                      </a>
                      <a
                        href="https://x.com/robspainBCBA"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="X (Twitter)"
                        className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                      >
                        <Twitter className="w-5 h-5 text-slate-700" />
                      </a>
                      <a
                        href="https://www.instagram.com/robdspain/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                      >
                        <Instagram className="w-5 h-5 text-pink-600" />
                      </a>
                      <a
                        href="https://www.facebook.com/profile.php?id=61572496964176"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                        className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                      >
                        <Facebook className="w-5 h-5 text-blue-600" />
                      </a>
                    </div>
                    <Link
                      href="https://www.linkedin.com/in/robspain/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      <Linkedin className="w-4 h-4 mr-2" /> Follow on LinkedIn
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">Our Mission</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We help school-based behavior professionals lead with clarity, reduce overwhelm, and build sustainable
              systems that improve student outcomes—without burning out the adults who make those systems run.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                icon: Target,
                title: "Evidence-Based",
                description:
                  "Built on proven behavioral science and field-tested in real classrooms across diverse school settings.",
                color: "emerald",
              },
              {
                icon: Heart,
                title: "Compassionate",
                description: "Human-centered approach that respects the dignity of students, staff, and families.",
                color: "red",
              },
              {
                icon: Shield,
                title: "Practical",
                description: "Tools and systems designed for the realities of busy school environments.",
                color: "blue",
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                variants={fadeInUp}
                whileHover={{ y: -5 }}
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br from-${value.color}-500 to-${value.color}-400 rounded-xl flex items-center justify-center mb-6`}
                >
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{value.title}</h3>
                <p className="text-slate-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why We Exist Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-8"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">Why We Exist</h2>
            <p className="text-xl text-slate-600">If you work in schools, you may recognize these challenges:</p>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                "High‑stakes problem behavior without a clear, shared plan",
                "Implementation barriers and inconsistent fidelity",
                "Exhaustion, competing priorities, and staff turnover",
              ].map((challenge, index) => (
                <motion.div
                  key={index}
                  className="bg-red-50 border border-red-200 rounded-xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <p className="text-red-800 font-medium">{challenge}</p>
                </motion.div>
              ))}
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8">
              <p className="text-lg text-emerald-800 font-medium">
                Most teams weren&apos;t given a predictable, school‑ready system for behavior change. We&apos;re changing that—one
                practical tool at a time.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bridge to Product Section */}
      <section className="py-20 bg-slate-900 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -ml-48 -mb-48" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">Ready to Start Your Transformation?</h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Whether you&apos;re preparing for the exam or leading a district, we have a clear path forward for you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Transformation Program */}
            <motion.div 
              className="bg-white rounded-2xl p-8 shadow-xl border-t-4 border-red-500"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
                Founder&apos;s Pick
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Transformation Program</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                The complete 6-week operating system for school BCBAs. Stop firefighting and start leading with systems that work.
              </p>
              <Link
                href="/transformation-program"
                className="inline-flex items-center justify-center w-full px-6 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
              >
                Learn About the Program
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>

            {/* Community */}
            <motion.div 
              className="bg-white rounded-2xl p-8 shadow-xl border-t-4 border-emerald-500"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
                Free Resource
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">School BCBA Community</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Join 500+ school-based behavior professionals sharing tools, strategies, and support in our private network.
              </p>
              <Link
                href="/community"
                className="inline-flex items-center justify-center w-full px-6 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
              >
                Join the Community
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-slate-500 mb-6">Want updates on new tools and resources?</p>
            <Link
              href="/subscribe"
              className="inline-flex items-center text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              <Mail className="w-5 h-5 mr-2" />
              Subscribe for Updates
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}