"use client";

import { useState, useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { EmailSignupPopup } from "@/components/ui/email-signup-popup";
import { ScrollNav } from "@/components/ui/scroll-nav";
import { ExitIntentModal } from "@/components/ui/exit-intent-modal";
import {
  ClipboardList,
  BarChart3,
  Settings,
  Users,
  GraduationCap,
  CheckCircle,
  ExternalLink,
  Sparkles,
  Clock,
  FileCheck,
  Shield,
  Star,
  PlayCircle,
  ArrowRight
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.2, 0.65, 0.3, 0.9] }
  }
};

export default function SupervisorsPage() {
  const [showPopup, setShowPopup] = useState(false);
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });

  return (
    <div className="min-h-screen bg-bs-background">
      {/* Sophisticated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-emerald-400/10 to-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-emerald-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [0, -180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Breadcrumbs */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
        <Breadcrumbs
          items={[
            { label: "Tools", href: "/products" },
            { label: "BCBA Supervision" }
          ]}
        />
      </div>

      <ScrollNav 
        items={[
          { id: "platform", label: "Progress Monitoring" },
          { id: "features", label: "Premium Features" },
          { id: "faq", label: "FAQ" }
        ]}
      />

      {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-700 to-blue-800" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/30 via-transparent to-blue-900/30" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-6 py-3 text-lg font-medium">
              <Sparkles className="w-5 h-5 mr-2" />
              Premium BCBA Supervision Platform
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-none"
          >
            Transform Your
            <span className="block bg-gradient-to-r from-emerald-200 via-white to-emerald-100 bg-clip-text text-transparent">
              Supervision Practice
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-2xl text-emerald-50 max-w-4xl mx-auto mb-12 leading-relaxed font-medium"
          >
            Streamline BCBA supervision with digital competency tracking, automated workflows, and BACB-compliant documentation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12"
          >
            <Link
              href="https://study.behaviorschool.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center px-10 py-5 text-xl font-bold bg-white text-emerald-700 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300"
            >
              <PlayCircle className="w-6 h-6 mr-3" />
              Track Supervisee Progress Now
              <ExternalLink className="w-6 h-6 ml-3" />
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/20 text-white border-white/50 backdrop-blur-md hover:bg-white/30 px-10 py-5 text-xl font-bold rounded-2xl"
              onClick={() => setShowPopup(true)}
            >
              Join Premium Waitlist
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Platform Section */}
      <section id="platform" className="py-32 bg-gradient-to-br from-white via-slate-50/50 to-emerald-50/30 relative scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-lg font-medium mb-8">
              <FileCheck className="w-5 h-5 mr-2" />
              Available Now
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-8 leading-tight">
              Supervisee Progress Monitoring Platform
            </h2>
            <p className="text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Monitor your supervisees&#39; BCBA exam preparation and competency development with real-time analytics.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-12 md:p-16 shadow-2xl border border-emerald-100/50 backdrop-blur-sm relative"
          >
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-slate-900">Real-Time Analytics</h3>
                    <p className="text-emerald-600 font-semibold text-lg">Comprehensive supervisee insights</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  {[
                    "View detailed study analytics and progress trends",
                    "Monitor BCBA exam preparation milestones",
                    "Track competency development across Task List domains",
                    "Generate professional development reports"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                      <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                      <span className="text-slate-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Link
                    href="https://study.behaviorschool.com"
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold bg-emerald-600 text-white rounded-xl shadow-lg hover:bg-emerald-700 transition-all duration-300"
                  >
                    Try Progress Monitoring Free
                    <ExternalLink className="w-5 h-5 ml-2" />
                  </Link>
                </div>
              </div>

              <div className="relative">
                <motion.div
                  className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                >
                  <h4 className="text-xl font-bold mb-6">Supervisee Dashboard</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-white/15 rounded-xl backdrop-blur-sm">
                      <span className="text-emerald-100 font-medium">Study Streak</span>
                      <span className="font-bold text-xl">21 days</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white/15 rounded-xl backdrop-blur-sm">
                      <span className="text-emerald-100 font-medium">Practice Accuracy</span>
                      <span className="font-bold text-xl">87%</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white/15 rounded-xl backdrop-blur-sm">
                      <span className="text-emerald-100 font-medium">Hours This Week</span>
                      <span className="font-bold text-xl">15.5h</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Premium Features */}
      <section id="features" className="py-32 bg-slate-900 relative overflow-hidden scroll-mt-24">
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-emerald-300 rounded-full text-lg font-medium mb-8 backdrop-blur-sm border border-emerald-500/30">
              <Star className="w-5 h-5 mr-2" />
              Premium Features
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight">
              Complete Supervision Management System
            </h2>
            <p className="text-2xl text-slate-300 max-w-4xl mx-auto">
              Advanced tools with digital documentation, automated workflows, and comprehensive compliance tracking.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                icon: ClipboardList,
                title: 'Digital Competency Matrix',
                desc: 'Interactive competency tracking with evidence attachment, progress visualization, and automated verification workflows.',
                gradient: 'from-emerald-500 to-emerald-400'
              },
              {
                icon: CheckCircle,
                title: 'Smart Hours Tracking',
                desc: 'Automated time logging with restricted/unrestricted classification, digital signatures, and BACB-compliant export formats.',
                gradient: 'from-blue-500 to-blue-400'
              },
              {
                icon: Users,
                title: 'Session Management',
                desc: 'Customizable supervision templates, goal setting frameworks, and structured feedback systems for consistent quality.',
                gradient: 'from-purple-500 to-purple-400'
              },
              {
                icon: BarChart3,
                title: 'Analytics Dashboard',
                desc: 'Comprehensive insights into supervision effectiveness, competency progression, and compliance risk indicators.',
                gradient: 'from-orange-500 to-orange-400'
              },
              {
                icon: Settings,
                title: 'Workflow Automation',
                desc: 'Intelligent reminders, document generation, and task management to eliminate administrative overhead.',
                gradient: 'from-cyan-500 to-cyan-400'
              },
              {
                icon: GraduationCap,
                title: 'Professional Development',
                desc: 'Integrated career planning, continuing education tracking, and specialization pathway guidance.',
                gradient: 'from-pink-500 to-pink-400'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600 rounded-3xl p-8 shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 group"
                variants={itemVariants}
                whileHover={{ y: -10 }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                <p className="leading-relaxed text-lg text-slate-300">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-32 bg-gradient-to-br from-white to-slate-50 scroll-mt-24">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 text-center mb-16">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full space-y-6">
            {[
              {
                q: "When will enhanced supervision tools be available?",
                a: "We are opening early access in waves starting early 2026. Current study platform users get priority access. Join the waitlist to secure your spot."
              },
              {
                q: "What supervision features are available right now?",
                a: "Currently, you can monitor supervisee progress through our study platform, including study analytics, practice exam scores, and competency development tracking."
              },
              {
                q: "Can I import existing hours or competency records?",
                a: "Yes. The enhanced platform will support CSV import and bulk evidence uploads for fast migration of existing supervision records."
              },
              {
                q: "Are the exported supervision records BACB audit-ready?",
                a: "Yes. All supervision documentation will include detailed timestamps, digital signatures, and compliance documentation specifically designed for BACB audits."
              }
            ].map((item, index) => (
              <AccordionItem key={index} value={`q${index + 1}`} className="bg-white rounded-2xl border-0 px-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <AccordionTrigger className="text-left hover:no-underline py-8 text-lg font-bold text-slate-900">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="pb-8 text-slate-600 text-lg leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <div className="h-20 md:hidden"></div>
      <ExitIntentModal pageSource="supervisors" />
      <EmailSignupPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        title="Join the Premium Supervision Waitlist"
        description="Be the first to access our comprehensive BCBA supervision platform. Get early access and exclusive launch pricing."
        pageSource="supervisors"
      />
    </div>
  );
}
