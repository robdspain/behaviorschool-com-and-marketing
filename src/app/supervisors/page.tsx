"use client";

import { useState, useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { EmailSignupPopup } from "@/components/ui/email-signup-popup";
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
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-emerald-300/5 to-blue-400/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
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

      {/* Hero Section - Premium Design */}
      <section ref={heroRef} className="relative overflow-hidden">
        {/* Premium Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-700 to-blue-800" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/30 via-transparent to-blue-900/30" />

        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(34,197,94,0.3) 0%, transparent 50%)`
            }}
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
          />
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-40 h-40 bg-emerald-400/20 rounded-full blur-2xl"
          animate={{
            y: [0, 30, 0],
            x: [0, -15, 0],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

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
            Streamline BCBA supervision with digital competency tracking, automated workflows, and BACB-compliant documentation. Start with progress monitoring today.
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
              Start Progress Monitoring
              <ExternalLink className="w-6 h-6 ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
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

          <motion.div
            initial={{ opacity: 0 }}
            animate={isHeroInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex items-center justify-center space-x-8 text-emerald-100/80 text-lg"
          >
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-6 w-6 text-emerald-300" />
              <span>Available Now</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-6 w-6 text-emerald-300" />
              <span>Quick Setup</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-emerald-300" />
              <span>BACB Compliant</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Current Platform Integration - Enhanced Design */}
      <section className="py-32 bg-gradient-to-br from-white via-slate-50/50 to-emerald-50/30 relative">
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
              Supervisee Progress
              <span className="block bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Monitoring Platform
              </span>
            </h2>
            <p className="text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Monitor your supervisees&#39; BCBA exam preparation and competency development with real-time analytics and progress tracking.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-12 md:p-16 shadow-2xl border border-emerald-100/50 backdrop-blur-sm overflow-hidden relative"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-50 to-transparent rounded-full -translate-y-48 translate-x-48" />

            <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
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

                <p className="text-xl text-slate-600 leading-relaxed">
                  Your supervisees can share their study progress, practice exam scores, and competency development directly through our study platform. Perfect for tracking BCBA exam preparation and professional development milestones.
                </p>

                <div className="grid gap-4">
                  {[
                    "View detailed study analytics and progress trends",
                    "Monitor BCBA exam preparation milestones",
                    "Track competency development across Task List domains",
                    "Generate professional development reports"
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-emerald-50/50 border border-emerald-100"
                    >
                      <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-slate-700 font-medium">{item}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="pt-4">
                  <Link
                    href="https://study.behaviorschool.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold bg-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:bg-emerald-700 transform hover:-translate-y-1 transition-all duration-300"
                  >
                    Access Platform
                    <ExternalLink className="w-5 h-5 ml-2" />
                  </Link>
                </div>
              </div>

              <div className="relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
                >
                  {/* Dashboard mockup */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xl font-bold">Supervisee Dashboard</h4>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">Live</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <motion.div
                        className="flex justify-between items-center p-4 bg-white/15 rounded-xl backdrop-blur-sm"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="text-emerald-100 font-medium">Study Streak</span>
                        <span className="font-bold text-xl">21 days</span>
                      </motion.div>

                      <motion.div
                        className="flex justify-between items-center p-4 bg-white/15 rounded-xl backdrop-blur-sm"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="text-emerald-100 font-medium">Practice Accuracy</span>
                        <span className="font-bold text-xl">87%</span>
                      </motion.div>

                      <motion.div
                        className="flex justify-between items-center p-4 bg-white/15 rounded-xl backdrop-blur-sm"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="text-emerald-100 font-medium">Hours This Week</span>
                        <span className="font-bold text-xl">15.5h</span>
                      </motion.div>

                      <div className="grid grid-cols-2 gap-3 mt-6">
                        <div className="text-center p-3 bg-white/10 rounded-lg">
                          <div className="font-bold text-lg">Domain A</div>
                          <div className="text-emerald-200 text-sm">92% Ready</div>
                        </div>
                        <div className="text-center p-3 bg-white/10 rounded-lg">
                          <div className="font-bold text-lg">Domain G</div>
                          <div className="text-emerald-200 text-sm">85% Ready</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating decoration */}
                  <motion.div
                    className="absolute -top-4 -right-4 w-20 h-20 bg-emerald-200/20 rounded-full blur-xl"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>

                {/* Additional floating elements */}
                <motion.div
                  className="absolute -bottom-6 -left-6 w-24 h-24 bg-blue-200/20 rounded-full blur-2xl"
                  animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Premium Features Coming Soon - Enhanced */}
      <section className="py-32 bg-slate-900 relative overflow-hidden">
        {/* Premium Background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, rgba(34, 197, 94, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)`
            }}
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
          />
        </div>

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
              Complete Supervision
              <span className="block bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Management System
              </span>
            </h2>

            <p className="text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
              Advanced supervision tools with digital documentation, automated workflows, and comprehensive compliance tracking.
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
                desc: 'Interactive competency tracking with evidence attachment, progress visualization, and automated verification workflows for streamlined oversight.',
                color: 'emerald',
                highlight: true,
                gradient: 'from-emerald-500 to-emerald-400'
              },
              {
                icon: CheckCircle,
                title: 'Smart Hours Tracking',
                desc: 'Automated time logging with restricted/unrestricted classification, digital signatures, and BACB-compliant export formats.',
                color: 'blue',
                gradient: 'from-blue-500 to-blue-400'
              },
              {
                icon: Users,
                title: 'Session Management',
                desc: 'Customizable supervision templates, goal setting frameworks, and structured feedback systems for consistent quality supervision.',
                color: 'purple',
                gradient: 'from-purple-500 to-purple-400'
              },
              {
                icon: BarChart3,
                title: 'Analytics Dashboard',
                desc: 'Comprehensive insights into supervision effectiveness, competency progression, and compliance risk indicators with predictive analytics.',
                color: 'orange',
                gradient: 'from-orange-500 to-orange-400'
              },
              {
                icon: Settings,
                title: 'Workflow Automation',
                desc: 'Intelligent reminders, document generation, and task management to eliminate administrative overhead and ensure compliance.',
                color: 'cyan',
                gradient: 'from-cyan-500 to-cyan-400'
              },
              {
                icon: GraduationCap,
                title: 'Professional Development',
                desc: 'Integrated career planning, continuing education tracking, and specialization pathway guidance for comprehensive growth.',
                color: 'pink',
                highlight: true,
                gradient: 'from-pink-500 to-pink-400'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className={`group relative ${feature.highlight ? 'lg:col-span-1' : ''}`}
                variants={itemVariants}
                whileHover={{
                  y: -12,
                  transition: {
                    duration: 0.3,
                    type: "spring",
                    stiffness: 300
                  }
                }}
              >
                <div className={`h-full relative overflow-hidden ${
                  feature.highlight
                    ? 'bg-gradient-to-br from-white to-emerald-50 border-2 border-emerald-200'
                    : 'bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600'
                } rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500`}>

                  {/* Background decoration */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${feature.gradient} opacity-10 rounded-full -translate-y-16 translate-x-16`} />

                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className={`text-2xl font-bold mb-4 ${feature.highlight ? 'text-slate-900' : 'text-white'}`}>
                    {feature.title}
                  </h3>

                  <p className={`leading-relaxed text-lg ${feature.highlight ? 'text-slate-600' : 'text-slate-300'}`}>
                    {feature.desc}
                  </p>

                  {feature.highlight && (
                    <div className="absolute -top-3 -right-3">
                      <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                        Premium
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Premium CTA Section - Enhanced */}
      <section className="py-32 bg-gradient-to-br from-emerald-600 via-emerald-700 to-blue-800 relative overflow-hidden">
        {/* Advanced Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-400/20 rounded-full blur-2xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <h2 className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight">
              Ready to Revolutionize
              <span className="block bg-gradient-to-r from-emerald-200 via-white to-blue-200 bg-clip-text text-transparent">
                Your Supervision Practice?
              </span>
            </h2>

            <p className="text-2xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
              Start with supervisee progress monitoring today, then join our exclusive waitlist for the complete supervision management platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Link
                href="https://study.behaviorschool.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center px-10 py-5 text-xl font-bold bg-white text-emerald-700 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300"
              >
                <PlayCircle className="w-6 h-6 mr-3" />
                Start Progress Monitoring
                <ExternalLink className="w-6 h-6 ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>

              <Button
                size="lg"
                variant="outline"
                className="bg-white/20 text-white border-white/50 backdrop-blur-md hover:bg-white/30 px-10 py-5 text-xl font-bold rounded-2xl"
                onClick={() => setShowPopup(true)}
              >
                <Star className="w-5 h-5 mr-2" />
                Join Premium Waitlist
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-16 pt-12 border-t border-white/20">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl font-black text-white mb-2">Available Now</div>
                <div className="text-emerald-200 text-lg">Progress Monitoring</div>
              </motion.div>

              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl font-black text-white mb-2">Early 2025</div>
                <div className="text-emerald-200 text-lg">Enhanced Tools Beta</div>
              </motion.div>

              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl font-black text-white mb-2">BACB Compliant</div>
                <div className="text-emerald-200 text-lg">Full Documentation</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ - Enhanced */}
      <section className="py-32 bg-gradient-to-br from-white to-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Everything you need to know about our supervision tools and platform integration.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="w-full space-y-6">
              {[
                {
                  q: "When will enhanced supervision tools be available?",
                  a: "We are opening early access in waves starting early 2025. Current study platform users get priority access. Join the waitlist to secure your spot for premium supervision features."
                },
                {
                  q: "What supervision features are available right now?",
                  a: "Currently, you can monitor supervisee progress through our study platform, including study analytics, practice exam scores, and competency development tracking. This provides real-time insights into BCBA exam preparation and professional development."
                },
                {
                  q: "Can I import existing hours or competency records?",
                  a: "Yes. The enhanced platform will support CSV import and bulk evidence uploads for fast migration of existing supervision records. This ensures seamless transition from your current documentation system."
                },
                {
                  q: "Are the exported supervision records BACB audit-ready?",
                  a: "Yes. All supervision documentation will include detailed timestamps, digital signatures, role attestations, and compliance documentation specifically designed for BACB audits. Our export formats meet professional standards and regulatory requirements."
                },
                {
                  q: "Does the platform support both RBT and BCaBA supervision?",
                  a: "Yes. Our supervision platform is designed for all levels of behavior analyst supervision, including RBT supervision by BCBAs, BCaBA supervision, and BCBA-to-BCBA mentoring relationships with appropriate competency frameworks for each level."
                }
              ].map((item, index) => (
                <AccordionItem key={index} value={`q${index + 1}`} className="bg-white rounded-2xl border-0 px-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <AccordionTrigger className="text-left hover:no-underline py-8 text-lg">
                    <span className="font-bold text-slate-900">{item.q}</span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-8 text-slate-600 text-lg leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Email Signup Popup */}
      <EmailSignupPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        title="Join the Premium Supervision Tools Waitlist"
        description="Be the first to access our comprehensive BCBA supervision platform. Get early access, priority onboarding, and exclusive launch pricing."
        pageSource="supervisors"
      />
    </div>
  );
}
