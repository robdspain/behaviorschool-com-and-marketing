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
  ExternalLink,
  Briefcase,
  Award,
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
    <div className="min-h-screen bg-bs-background font-sans">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 lg:pt-32 lg:pb-40 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-emerald-400 opacity-20 blur-[100px]"></div>
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Behavior Analysis <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                Built for Schools
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
              We translate clinical ABA principles into practical, sustainable systems for real-world classrooms. No fluff, just tools that work.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Founder Profile */}
      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
            <div className="grid md:grid-cols-12 gap-0">
              {/* Image Side */}
              <div className="md:col-span-5 relative min-h-[400px] md:min-h-full">
                <Image
                  src="/optimized/profile-Rob.webp"
                  alt="Rob Spain, BCBA"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden"></div>
                <div className="absolute bottom-6 left-6 text-white md:hidden">
                  <h2 className="text-2xl font-bold">Rob Spain, BCBA</h2>
                  <p className="text-emerald-200 font-medium">Founder & Principal</p>
                </div>
              </div>

              {/* Content Side */}
              <div className="md:col-span-7 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                <div className="hidden md:block mb-6">
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Rob Spain, M.S., BCBA, IBA</h2>
                  <p className="text-emerald-600 font-medium text-lg">Founder & Principal Behavior Analyst</p>
                </div>

                <div className="prose prose-lg text-slate-600 mb-8">
                  <p>
                    I founded Behavior School to solve a specific problem: <strong>The gap between clinical ABA training and the messy reality of school-based practice.</strong>
                  </p>
                  <p>
                    With over 20 years in education and 14+ years as a Board Certified Behavior Analyst, I've seen too many BCBAs burn out trying to apply clinic-based models in classrooms.
                  </p>
                  <p>
                    Today, I serve as President of the <strong>CalABA Behavior Analysts in Education (BAE) SIG</strong> and teach graduate ABA courses, but my heart is in the work—building systems that support students without breaking staff.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 mb-8">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-2 text-slate-900 font-semibold">
                      <Award className="w-5 h-5 text-emerald-500" /> Credentials
                    </div>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>BCBA #1-11-9398</li>
                      <li>IBA #103385847</li>
                      <li>M.S. Special Education</li>
                    </ul>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-2 text-slate-900 font-semibold">
                      <Briefcase className="w-5 h-5 text-blue-500" /> Roles
                    </div>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>President, CalABA BAE SIG</li>
                      <li>Adjunct Faculty, FPU</li>
                      <li>District Behavior Specialist</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4">
                  <a 
                    href="https://www.linkedin.com/in/robspain/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a 
                    href="https://x.com/robspainBCBA" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a 
                    href="https://robspain.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-colors text-sm font-medium"
                  >
                    Visit Portfolio <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
          <p className="text-2xl text-slate-600 font-light leading-relaxed">
            &quot;To equip school-based behavior professionals with the <span className="font-semibold text-emerald-600">clarity</span>, <span className="font-semibold text-emerald-600">tools</span>, and <span className="font-semibold text-emerald-600">community</span> they need to change lives—without sacrificing their own.&quot;
          </p>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Evidence-Based",
                desc: "We don't guess. We use proven behavioral science adapted for educational settings.",
                color: "emerald"
              },
              {
                icon: Heart,
                title: "Compassionate",
                desc: "Behavior change should respect the dignity of students, staff, and families.",
                color: "rose"
              },
              {
                icon: Shield,
                title: "Practical",
                desc: "If it doesn't work in a busy classroom with 30 kids, we don't teach it.",
                color: "blue"
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-xl bg-${item.color}-100 flex items-center justify-center mb-6`}>
                  <item.icon className={`w-6 h-6 text-${item.color}-600`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your practice?</h2>
          <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
            Join thousands of school-based professionals using our tools to make a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg transition-all"
            >
              Explore Free Tools
            </Link>
            <Link
              href="/subscribe"
              className="inline-flex items-center px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-lg backdrop-blur-sm transition-all"
            >
              Join Community
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
