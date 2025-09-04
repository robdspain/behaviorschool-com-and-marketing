"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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
                  More than 20 years ago, I stood in front of a classroom of students with significant behavioral and learning needs.
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
                    <img
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

      {/* What We Offer Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">What We Offer</h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Comprehensive tools and resources designed specifically for school-based behavior professionals.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    icon: GraduationCap,
                    title: "Behavior Study Tools",
                    description:
                      "AI‑supported BCBA exam prep and precision practice with adaptive sets, mastery tracking, and rich rationales.",
                    link: "/behavior-study-tools",
                    color: "emerald",
                  },
                  {
                    icon: Users,
                    title: "Supervision Tools",
                    description: "Simple, scalable workflows to support meaningful, compassionate supervision.",
                    link: "/supervisors",
                    color: "blue",
                  },
                  {
                    icon: BookOpen,
                    title: "Resources & Community",
                    description:
                      "Practical guides, templates, and a network of practitioners who share what works in real schools.",
                    link: "/community",
                    color: "purple",
                  },
                ].map((tool, index) => (
                  <motion.div
                    key={index}
                    className="flex gap-4 p-6 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div
                      className={`w-12 h-12 bg-gradient-to-br from-${tool.color}-500 to-${tool.color}-400 rounded-xl flex items-center justify-center flex-shrink-0`}
                    >
                      <tool.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">{tool.title}</h3>
                      <p className="text-slate-600 mb-3">{tool.description}</p>
                      <div className="space-y-2">
                        <Link href={tool.link} className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium">
                          Learn more <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                        {tool.title === "Behavior Study Tools" && (
                          <div>
                            <a 
                              href="https://behaviorstudytools.com" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Visit BehaviorStudyTools.com <ArrowRight className="w-4 h-4 ml-1" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-8 border border-emerald-200">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">At a Glance</h3>
                <ul className="space-y-4 text-slate-700">
                  {[
                    "Built for school contexts—from FBAs to implementation fidelity",
                    "Evidence‑based and field‑tested in real classrooms",
                    "Time‑saving defaults and workflows that reduce busywork",
                    "Compassionate, team‑centered approach to behavior change",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 space-y-3">
                  <Link
                    href="/behavior-study-tools"
                    className="block w-full text-center bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                  >
                    Explore Study Tools
                  </Link>
                  <Link
                    href="/products"
                    className="block w-full text-center border border-slate-300 text-slate-900 px-6 py-3 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                  >
                    View All Tools
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Who We Serve Section */}
      <section className="py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">Who We Serve</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Supporting the entire ecosystem of professionals who make behavior change possible in schools.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                title: "BCBAs & Behavior Specialists",
                description: "Working in schools and educational settings",
                icon: Users,
                color: "emerald",
              },
              {
                title: "Teachers & Related Service Providers",
                description: "Implementing behavior support strategies",
                icon: GraduationCap,
                color: "blue",
              },
              {
                title: "Program Leaders & District Teams",
                description: "Building sustainable behavior support systems",
                icon: Shield,
                color: "purple",
              },
              {
                title: "Graduate Students",
                description: "Preparing for the BCBA exam and certification",
                icon: BookOpen,
                color: "orange",
              },
            ].map((audience, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                variants={fadeInUp}
                whileHover={{ y: -5 }}
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br from-${audience.color}-500 to-${audience.color}-400 rounded-xl flex items-center justify-center mb-6 mx-auto`}
                >
                  <audience.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{audience.title}</h3>
                <p className="text-slate-600 text-sm">{audience.description}</p>
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

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-emerald-600 to-emerald-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Join the Behavior School Community</h2>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              Get actionable resources, new tools, and community events—straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/subscribe"
                className="inline-flex items-center px-8 py-4 text-lg font-semibold bg-white text-emerald-600 hover:bg-slate-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Mail className="w-5 h-5 mr-2" />
                Subscribe for Updates
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center px-8 py-4 text-lg font-semibold border-2 border-white text-white hover:bg-white hover:text-emerald-600 rounded-xl transition-all duration-200"
              >
                Explore Tools
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}


