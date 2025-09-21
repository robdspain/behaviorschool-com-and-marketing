"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { EmailSignupPopup } from "@/components/ui/email-signup-popup";
import {
  ClipboardDocumentListIcon,
  ChartBarIcon,
  CogIcon,
  UsersIcon,
  AcademicCapIcon,
  CheckBadgeIcon,
  ArrowUpRightIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";

export default function SupervisorsPage() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Breadcrumbs */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumbs
          items={[
            { label: "Tools", href: "/products" },
            { label: "BCBA Supervision" }
          ]}
        />
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/50 to-transparent" />

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-40 h-40 bg-emerald-400/20 rounded-full blur-2xl"
          animate={{
            y: [0, 20, 0],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-4 py-2">
              <SparklesIcon className="w-4 h-4 mr-2" />
              Premium Supervision Platform
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-white mb-6"
          >
            Professional BCBA
            <span className="block bg-gradient-to-r from-emerald-200 to-emerald-100 bg-clip-text text-transparent">
              Supervision Tools
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-emerald-100 max-w-3xl mx-auto mb-8 leading-relaxed"
          >
            Streamline your supervision process with our integrated platform. Track competencies, manage hours, and monitor supervisee progress all in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="https://study.behaviorschool.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-white text-emerald-700 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 group"
            >
              Access Study Platform
              <ArrowUpRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 text-white border-white/30 backdrop-blur-sm hover:bg-white/20 px-8 py-4 text-lg"
              onClick={() => setShowPopup(true)}
            >
              Join Premium Waitlist
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-emerald-100/80 text-sm mt-6"
          >
            Currently available on our study platform • Enhanced supervision tools coming soon
          </motion.p>
        </div>
      </section>

      {/* Current Platform Integration */}
      <section className="py-20 bg-gradient-to-br from-white to-emerald-50/30 relative">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Available Now on Study Platform
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Start tracking supervisee progress today with our integrated study platform. Monitor competency development and engagement metrics in real-time.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-emerald-100/50 backdrop-blur-sm"
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <ChartBarIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">Progress Monitoring</h3>
                    <p className="text-emerald-600 font-medium">Real-time supervisee tracking</p>
                  </div>
                </div>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Your supervisees can share their study progress, practice exam scores, and competency development directly through the study platform. Perfect for tracking BCBA exam preparation and professional development.
                </p>
                <div className="space-y-3">
                  {[
                    "View supervisee study analytics and progress trends",
                    "Monitor BCBA exam preparation milestones",
                    "Track competency development across Task List domains",
                    "Generate professional development reports"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckBadgeIcon className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <span className="text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-8 text-white shadow-xl">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold">Supervisee Dashboard</h4>
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                        <span className="text-emerald-100">Study Streak</span>
                        <span className="font-bold">14 days</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                        <span className="text-emerald-100">Practice Accuracy</span>
                        <span className="font-bold">82%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                        <span className="text-emerald-100">Hours This Week</span>
                        <span className="font-bold">12.5h</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-16 h-16 bg-emerald-200/30 rounded-full blur-xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Premium Features Coming Soon */}
      <section className="py-20 bg-slate-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #10b981 0%, transparent 50%), radial-gradient(circle at 75% 75%, #3b82f6 0%, transparent 50%)`
          }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Enhanced Supervision Tools
              <span className="block text-emerald-400">Coming Soon</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Complete supervision management system with digital documentation, automated workflows, and compliance tracking.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={{
              animate: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: ClipboardDocumentListIcon,
                title: 'Digital Competency Matrix',
                desc: 'Interactive competency tracking with evidence attachment, progress visualization, and automated verification workflows.',
                color: 'emerald',
                highlight: true
              },
              {
                icon: CheckBadgeIcon,
                title: 'Smart Hours Tracking',
                desc: 'Automated time logging with restricted/unrestricted classification, digital signatures, and BACB-compliant export formats.',
                color: 'blue'
              },
              {
                icon: UsersIcon,
                title: 'Session Management',
                desc: 'Customizable supervision templates, goal setting frameworks, and structured feedback systems for consistent quality.',
                color: 'purple'
              },
              {
                icon: ChartBarIcon,
                title: 'Analytics Dashboard',
                desc: 'Comprehensive insights into supervision effectiveness, competency progression, and compliance risk indicators.',
                color: 'orange'
              },
              {
                icon: CogIcon,
                title: 'Workflow Automation',
                desc: 'Intelligent reminders, document generation, and task management to eliminate administrative overhead.',
                color: 'cyan'
              },
              {
                icon: AcademicCapIcon,
                title: 'Professional Development',
                desc: 'Integrated career planning, continuing education tracking, and specialization pathway guidance.',
                color: 'pink',
                highlight: true
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className={`group relative ${feature.highlight ? 'md:col-span-1 lg:col-span-1' : ''}`}
                variants={{
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <div className={`h-full bg-gradient-to-br ${feature.highlight
                  ? 'from-white to-emerald-50 border-2 border-emerald-200'
                  : 'from-slate-800 to-slate-700 border border-slate-600'
                } rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300`}>

                  <div className={`w-14 h-14 bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className={`text-xl font-bold mb-4 ${feature.highlight ? 'text-slate-900' : 'text-white'}`}>
                    {feature.title}
                  </h3>

                  <p className={`leading-relaxed ${feature.highlight ? 'text-slate-600' : 'text-slate-300'}`}>
                    {feature.desc}
                  </p>

                  {feature.highlight && (
                    <div className="absolute -top-2 -right-2">
                      <div className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
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

      {/* Premium CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-400/20 rounded-full blur-2xl"
            animate={{
              scale: [1.1, 1, 1.1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your
              <span className="block bg-gradient-to-r from-emerald-200 to-white bg-clip-text text-transparent">
                Supervision Practice?
              </span>
            </h2>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto leading-relaxed">
              Start with our study platform today for supervisee progress tracking, then join the waitlist for our complete supervision management system.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Link
                href="https://study.behaviorschool.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-white text-emerald-700 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Access Study Platform Now
                <ArrowUpRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 text-white border-white/30 backdrop-blur-sm hover:bg-white/20 px-8 py-4 text-lg font-semibold"
                onClick={() => setShowPopup(true)}
              >
                Join Premium Waitlist
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">Available Now</div>
                <div className="text-emerald-200">Progress Monitoring</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">Early 2025</div>
                <div className="text-emerald-200">Enhanced Tools Beta</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">BACB Compliant</div>
                <div className="text-emerald-200">Full Documentation</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need to know about our supervision tools and platform integration.
            </p>
          </motion.div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="q1" className="bg-slate-50 rounded-lg border-0 px-6">
              <AccordionTrigger className="text-left hover:no-underline py-6">
                <span className="font-semibold text-slate-900">When will enhanced supervision tools be available?</span>
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-slate-600">
                We are opening early access in waves starting early 2025. Current study platform users get priority access. Join the waitlist to secure your spot for premium supervision features.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q2" className="bg-slate-50 rounded-lg border-0 px-6">
              <AccordionTrigger className="text-left hover:no-underline py-6">
                <span className="font-semibold text-slate-900">What supervision features are available right now?</span>
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-slate-600">
                Currently, you can monitor supervisee progress through our study platform, including study analytics, practice exam scores, and competency development tracking. This provides real-time insights into BCBA exam preparation and professional development.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q3" className="bg-slate-50 rounded-lg border-0 px-6">
              <AccordionTrigger className="text-left hover:no-underline py-6">
                <span className="font-semibold text-slate-900">Can I import existing hours or competency records?</span>
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-slate-600">
                Yes. The enhanced platform will support CSV import and bulk evidence uploads for fast migration of existing supervision records. This ensures seamless transition from your current documentation system.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q4" className="bg-slate-50 rounded-lg border-0 px-6">
              <AccordionTrigger className="text-left hover:no-underline py-6">
                <span className="font-semibold text-slate-900">Are the exported supervision records BACB audit-ready?</span>
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-slate-600">
                Yes. All supervision documentation will include detailed timestamps, digital signatures, role attestations, and compliance documentation specifically designed for BACB audits. Our export formats meet professional standards and regulatory requirements.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q5" className="bg-slate-50 rounded-lg border-0 px-6">
              <AccordionTrigger className="text-left hover:no-underline py-6">
                <span className="font-semibold text-slate-900">Does the platform support both RBT and BCaBA supervision?</span>
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-slate-600">
                Yes. Our supervision platform is designed for all levels of behavior analyst supervision, including RBT supervision by BCBAs, BCaBA supervision, and BCBA-to-BCBA mentoring relationships with appropriate competency frameworks for each level.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q6" className="bg-slate-50 rounded-lg border-0 px-6">
              <AccordionTrigger className="text-left hover:no-underline py-6">
                <span className="font-semibold text-slate-900">How does the digital signature feature work for supervision documentation?</span>
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-slate-600">
                Our digital signature system uses secure, legally-binding electronic signatures that meet industry standards. Both supervisors and supervisees can sign documents remotely, with automatic timestamp and identity verification for complete audit trails.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q7" className="bg-slate-50 rounded-lg border-0 px-6">
              <AccordionTrigger className="text-left hover:no-underline py-6">
                <span className="font-semibold text-slate-900">How does supervisee progress monitoring work with the study platform?</span>
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-slate-600">
                Supervisees can grant access to their study dashboard, allowing you to view real-time analytics including study streaks, practice accuracy, domain mastery, and time invested. This creates transparency and accountability in the supervision relationship.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q8" className="bg-slate-50 rounded-lg border-0 px-6">
              <AccordionTrigger className="text-left hover:no-underline py-6">
                <span className="font-semibold text-slate-900">Will there be automated reminders and workflow management?</span>
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-slate-600">
                Yes. The enhanced platform will include intelligent automation for supervision scheduling, document requests, competency deadlines, and progress check-ins. This reduces administrative overhead while ensuring compliance requirements are met.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Email Signup Popup */}
      <EmailSignupPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        title="Join the Supervision Tools Waitlist"
        description="Be the first to know when our comprehensive BCBA supervision platform launches. Get early access and priority onboarding."
        pageSource="supervisors"
      />
    </div>
  );
}


