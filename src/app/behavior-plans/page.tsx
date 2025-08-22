"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check, FileText, Target, TrendingUp, Users, Shield, Mail, Bell } from "lucide-react";
import { EmailSignupPopup } from "@/components/ui/email-signup-popup";

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

export default function BehaviorPlansPage() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 lg:pt-36 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-red-50" />
        <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-gradient-to-br from-orange-100 to-transparent opacity-30 blur-3xl" />
        <div className="absolute -bottom-10 left-0 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-gradient-to-tr from-red-100 to-transparent opacity-20 blur-2xl" />
        
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
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.05] text-slate-900">
                    BIP Writer
                  </h1>
                </motion.div>
                <motion.h2
                  className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-orange-600"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Coming Soon: Write Effective BIPs in Minutes
                </motion.h2>
                <motion.p
                  className="text-lg sm:text-xl leading-relaxed text-slate-600"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  We&apos;re building an AI-powered tool that transforms challenging behaviors into actionable intervention plans. Get notified when BIP Writer launches.
                </motion.p>
                
                <motion.div
                  className="bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl p-6 border border-orange-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Bell className="w-5 h-5 text-orange-600" />
                    <h3 className="font-semibold text-orange-900">Early Access Preview</h3>
                  </div>
                  <p className="text-orange-800 text-sm">
                    Be the first to know when BIP Writer launches. Early subscribers get exclusive access to beta features and special pricing.
                  </p>
                </motion.div>
              </div>

                             {/* Email Signup Form */}
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.8 }}
                 className="space-y-4"
               >
                 <form 
                   onSubmit={(e) => {
                     e.preventDefault();
                     setShowPopup(true);
                   }} 
                   className="flex flex-col sm:flex-row gap-4 max-w-md"
                   data-netlify="true" 
                   name="bip-writer-signup"
                 >
                   <input type="hidden" name="form-name" value="bip-writer-signup" />
                   <input type="hidden" name="page-source" value="behavior-plans" />
                   
                   <div className="flex-1">
                     <input
                       type="email"
                       name="email"
                       placeholder="Enter your email"
                       required
                       className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                     />
                   </div>
                   <button
                     type="submit"
                     className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                   >
                     <Mail className="w-4 h-4 mr-2" />
                     Notify Me
                   </button>
                 </form>
                 <p className="text-sm text-slate-500">
                   No spam, unsubscribe anytime. Join 500+ educators waiting for launch.
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
                  src="/BIP-Writer/BIP-Writer-Team.webp"
                  alt="BIP Writer - AI-powered behavior intervention plan creation"
                  width={600}
                  height={400}
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
              </div>
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-200 to-orange-100 opacity-80 animate-pulse" />
              <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-xl bg-gradient-to-br from-red-200 to-red-100 opacity-60" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* What We're Building Section */}
      <section className="py-16 lg:py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-8"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
              What We&apos;re Building
            </h2>

            <p className="text-xl text-slate-600">
              BIP Writer will solve the biggest challenges with behavior intervention plans:
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-red-700 mb-4">❌ Current Problem</h3>
                <ul className="space-y-3 text-left">
                  <li className="text-red-600">• Vague, generic strategies</li>
                  <li className="text-red-600">• No specific implementation steps</li>
                  <li className="text-red-600">• Missing data collection plans</li>
                  <li className="text-red-600">• Staff left guessing how to help</li>
                </ul>
              </div>
              
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-emerald-700 mb-4">✅ Our Solution</h3>
                <ul className="space-y-3 text-left">
                  <li className="text-emerald-600">• Evidence-based intervention library</li>
                  <li className="text-emerald-600">• Step-by-step implementation guides</li>
                  <li className="text-emerald-600">• Built-in progress monitoring</li>
                  <li className="text-emerald-600">• Clear staff training materials</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Preview Features Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-8"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
              What&apos;s Coming in BIP Writer
            </h2>

            <div className="bg-emerald-50 rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-slate-900 mb-8">Every BIP will include:</h3>
              <div className="grid md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto">
                <div className="space-y-4">
                  <p className="text-lg font-medium text-emerald-700">✅ <strong>Specific Interventions</strong><br/><span className="text-sm text-emerald-600">Step-by-step procedures</span></p>
                  <p className="text-lg font-medium text-emerald-700">✅ <strong>Data Collection Methods</strong><br/><span className="text-sm text-emerald-600">Clear measurement systems</span></p>
                  <p className="text-lg font-medium text-emerald-700">✅ <strong>Progress Monitoring</strong><br/><span className="text-sm text-emerald-600">Regular review schedules</span></p>
                </div>
                <div className="space-y-4">
                  <p className="text-lg font-medium text-emerald-700">✅ <strong>Staff Training</strong><br/><span className="text-sm text-emerald-600">Implementation guidelines</span></p>
                  <p className="text-lg font-medium text-emerald-700">✅ <strong>Crisis Procedures</strong><br/><span className="text-sm text-emerald-600">Safety protocols when needed</span></p>
                  <p className="text-lg font-medium text-emerald-700">✅ <strong>Team Collaboration</strong><br/><span className="text-sm text-emerald-600">Share with all stakeholders</span></p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-slate-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Why BIP Writer Works
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our platform combines behavioral science with practical implementation to create BIPs that actually work in real educational settings.
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
                icon: FileText,
                title: "Evidence-Based Templates",
                description: "Built on proven behavioral interventions that work across different age groups and settings.",
                color: "orange"
              },
              {
                icon: Target,
                title: "Customizable Strategies",
                description: "Adapt interventions to fit your specific student, classroom, and school environment.",
                color: "red"
              },
              {
                icon: TrendingUp,
                title: "Progress Tracking",
                description: "Built-in data collection tools and progress monitoring to measure intervention effectiveness.",
                color: "emerald"
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description: "Share plans with teachers, paraprofessionals, and parents for consistent implementation.",
                color: "blue"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                variants={fadeInUp}
                whileHover={{ y: -5 }}
              >
                <div className={`w-12 h-12 bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-400 rounded-xl flex items-center justify-center mb-6`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Before & After Example */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 text-center">
              Before &amp; After Example
            </h2>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Old BIP */}
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-red-800 mb-6">❌ Traditional BIP:</h3>
                <p className="text-lg text-slate-700 italic mb-6">
                  &quot;Use positive reinforcement and redirect when needed.&quot;
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-red-700 mb-3">Issues:</h4>
                  <p className="text-sm text-red-600">❌ No specific procedures</p>
                  <p className="text-sm text-red-600">❌ Vague reinforcement schedule</p>
                  <p className="text-sm text-red-600">❌ No data collection plan</p>
                  <p className="text-sm text-red-600">❌ Missing staff training</p>
                  <p className="text-sm text-red-600">❌ No progress monitoring</p>
                </div>
              </div>

              {/* Our BIP */}
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-emerald-800 mb-6">✅ BIP Writer Plan:</h3>
                <p className="text-lg text-slate-700 mb-6">
                  &quot;Implement token economy with 5-minute intervals, collect frequency data, review weekly.&quot;
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-emerald-700 mb-3">Features:</h4>
                  <p className="text-sm text-emerald-600">✅ Specific intervention (token economy)</p>
                  <p className="text-sm text-emerald-600">✅ Clear schedule (5-minute intervals)</p>
                  <p className="text-sm text-emerald-600">✅ Data collection method (frequency)</p>
                  <p className="text-sm text-emerald-600">✅ Progress review (weekly)</p>
                  <p className="text-sm text-emerald-600">✅ Staff training included</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">
                Specific. Measurable. Effective.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Who Benefits Section */}
      <section className="py-16 lg:py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
              Who Benefits
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">🧑‍⚕️</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">BCBAs</h3>
                <p className="text-slate-600">Create comprehensive, evidence-based intervention plans quickly.</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">👩‍🏫</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Teachers</h3>
                <p className="text-slate-600">Implement clear, actionable strategies that work in real classrooms.</p>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">🏫</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Schools</h3>
                <p className="text-slate-600">Improve student outcomes and reduce behavioral incidents.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Benefits Section */}
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
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
                  Built for Real Classrooms
                </h2>
                <p className="text-xl text-slate-600 leading-relaxed">
                  BIP Writer was created by school-based BCBAs who understand the challenges of implementing behavior plans in busy educational environments.
                </p>
                <ul className="space-y-4">
                  {[
                    "Time-saving templates and workflows",
                    "Evidence-based intervention strategies", 
                    "Clear implementation guidelines",
                    "Progress monitoring tools"
                  ].map((item, index) => (
                    <motion.li 
                      key={index}
                      className="flex items-center gap-4 text-lg text-slate-700"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      {item}
                    </motion.li>
                  ))}
                </ul>
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
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-400 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">BIP Dashboard</h3>
                    <p className="text-slate-600">Track implementation and progress</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "Active BIPs", value: "12", color: "orange" },
                    { label: "Success Rate", value: "89%", color: "emerald" },
                    { label: "Avg. Implementation", value: "2.3 weeks", color: "blue" },
                    { label: "Staff Training", value: "100%", color: "purple" }
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
                      <span className="font-medium text-slate-900">{item.label}</span>
                      <span className={`font-semibold text-${item.color}-600`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-orange-600 to-orange-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Be the First to Know When BIP Writer Launches
            </h2>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              Join 500+ BCBAs and educators who want to transform how they create behavior intervention plans.
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button 
                onClick={() => setShowPopup(true)}
                className="inline-flex items-center px-8 py-4 text-lg font-semibold bg-white text-orange-600 hover:bg-slate-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Bell className="w-5 h-5 mr-2" />
                Join the Waitlist
              </button>
            </motion.div>
            
            <div className="space-y-2">
              <p className="text-orange-200 text-sm">
                Get early access • Beta pricing • No spam, unsubscribe anytime
              </p>
              <div className="flex items-center justify-center gap-6 text-orange-200 text-sm">
                <span>✓ Early access to beta</span>
                <span>✓ Special launch pricing</span>
                <span>✓ Priority support</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Email Signup Popup */}
      <EmailSignupPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        title="Join the BIP Writer Waitlist"
        description="Be the first to know when our AI-powered behavior intervention plan tool launches. Get early access and special pricing."
        pageSource="behavior-plans"
        buttonText="Join Waitlist"
        successMessage="Thanks! We'll notify you when BIP Writer launches."
      />

      {/* Structured Data */}
      {(() => {
        const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://behaviorschool.com";
        const webPageJsonLd = {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "BIP Writer - Coming Soon | Behavior School",
          url: `${SITE_URL}/behavior-plans`,
          description: "Coming Soon: AI-powered BIP Writer tool for creating effective behavior intervention plans. Join the waitlist for early access and special launch pricing.",
          isPartOf: { "@type": "WebSite", url: SITE_URL, name: "Behavior School" },
        } as const;
        const breadcrumbJsonLd = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: SITE_URL,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Products",
              item: `${SITE_URL}/products`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: "BIP Writer",
              item: `${SITE_URL}/behavior-plans`,
            },
          ],
        } as const;
        return (
          <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
          </>
        );
      })()}
    </div>
  );
}
