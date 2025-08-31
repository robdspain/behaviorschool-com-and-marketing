"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle, XCircle, BarChart3, Zap, Users, Award, Star, ArrowRight, BookOpen, Beaker, Building2 } from "lucide-react";
import { ClientCTA } from "./ClientCTA";
import { EmailSignupPopup } from "@/components/ui/email-signup-popup";

export function AnimatedSections() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const faqs = [
    {
      question: "How do values-based goals improve student motivation?",
      answer: "When students help choose goals that reflect their values (like being Brave, Kind, or Focused), they develop autonomous motivation. Research shows values-driven goals foster resilience and long-term follow-through, even when school gets hard."
    },
    {
      question: "What is the Values Wizard and how does it work?",
      answer: "The Values Wizard is a simple tool where students pick what matters most to them—like being Helpful to peers, Curious in learning, or Brave when speaking up. The system then suggests age-appropriate skills linked to those values and generates SMART goals."
    },
    {
      question: "How do you ensure skills generalize across settings?",
      answer: "Our tool builds generalization plans into every goal, including multiple settings, people, and prompts. Research shows generalization must be programmed on purpose, not left to chance. We include self-monitoring tools and variable reinforcement options."
    },
    {
      question: "What makes these goals different from compliance-based goals?",
      answer: "Instead of compliance-based goals that fade, values-based goals are anchored in meaning. Students don't just comply—they own their goals. Skills last longer when anchored to natural reinforcers like peer recognition or classroom roles."
    },
    {
      question: "How do you measure long-term skill maintenance?",
      answer: "Our tool includes maintenance checks at 2 and 4 weeks following mastery to ensure skills last. Research confirms skills persist longer when connected to student values and natural reinforcers rather than external rewards."
    }
  ];

  // Note: No testimonials yet as the tool is still in development
  // These will be added when we have real user feedback

  return (
    <main>
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 lg:pt-28 lg:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50" />
        <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-gradient-to-br from-purple-100 to-transparent opacity-30 blur-3xl" />
        <div className="absolute -bottom-10 left-0 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-gradient-to-tr from-pink-100 to-transparent opacity-20 blur-2xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight leading-[1.1] text-slate-900">
                Write IEP Goals That Actually Stick—Because They Start With What Students Value Most
              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed">
                Students co-create goals that reflect who they want to be. Our Values Wizard helps students identify what matters most—like being Helpful, Brave, or Focused—then generates SMART goals that drive committed action and lasting change.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <ClientCTA />
              </motion.div>

              <div className="flex items-center space-x-2 text-slate-600">
                <Users className="h-4 w-4" />
                <span className="text-base font-medium">Join educators on the waitlist for early access.</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-100 px-6 py-4 border-b border-slate-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="ml-4 text-sm text-slate-600 font-medium">IEP Goal Generator - Level 5</div>
                  </div>
                </div>
                
                <div className="p-4 sm:p-6">
                  <div className="space-y-3 mb-4">
                    <label className="block text-sm font-medium text-slate-700">Student Values:</label>
                    <div className="bg-slate-50 rounded-lg p-2 sm:p-3 border border-slate-200">
                      <p className="text-slate-600 text-sm sm:text-base">Being Helpful, Brave, and Focused</p>
                    </div>
                    
                    <label className="block text-sm font-medium text-slate-700">Target Skill:</label>
                    <div className="bg-slate-50 rounded-lg p-2 sm:p-3 border border-slate-200">
                      <p className="text-slate-600 text-sm sm:text-base">Speaking up in class (Brave value)</p>
                    </div>
                    
                    <label className="block text-sm font-medium text-slate-700">Current Performance:</label>
                    <div className="bg-slate-50 rounded-lg p-2 sm:p-3 border border-slate-200">
                      <p className="text-slate-600 text-sm sm:text-base">Raises hand 20% of opportunities, waits 30+ seconds</p>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-4 sm:px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg text-sm sm:text-base">
                    <Zap className="inline h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Generate Values-Based Goal
                  </button>

                  <div className="mt-4 space-y-3">
                    <label className="block text-sm font-medium text-slate-700">Generated IEP Goal:</label>
                    <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-3 sm:p-4">
                      <p className="text-emerald-800 text-xs sm:text-sm leading-relaxed">
                        <CheckCircle className="inline h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        By 03/10/26, when in classroom discussions and given opportunities to share ideas, [Student] will demonstrate bravery by raising hand and speaking up in 90% of opportunities for 3 consecutive days, responding within 5 seconds of being called on, across classroom, small group, and whole-class settings, as measured by teacher observation. Additionally, [Student] will maintain this brave communication for 4 weeks following mastery, connecting to their value of being Brave.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1 sm:gap-2">
                    <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                      Values-Based
                    </span>
                    <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                      Student-Driven
                    </span>
                    <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                      SMART Goals
                    </span>
                    <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                      Generalization
                    </span>
                    <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                      Maintenance
                    </span>
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
              Why Values Come First in Effective IEP Goals
            </h2>

            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto">
              <div className="bg-white rounded-lg p-4 sm:p-6 border border-red-300">
                <p className="text-base sm:text-lg font-medium text-red-800">
                  &ldquo;[Student] will reduce blurting in class.&rdquo;
                </p>
                <p className="text-sm text-red-600 mt-2">Compliance-based goal that fades when motivation drops</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6 max-w-4xl mx-auto">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <XCircle className="h-4 w-4 sm:h-6 sm:w-6 text-red-500 flex-shrink-0" />
                <span className="text-slate-700 text-xs sm:text-sm">No student values</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <XCircle className="h-4 w-4 sm:h-6 sm:w-6 text-red-500 flex-shrink-0" />
                <span className="text-slate-700 text-xs sm:text-sm">Compliance-focused</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <XCircle className="h-4 w-4 sm:h-6 sm:w-6 text-red-500 flex-shrink-0" />
                <span className="text-slate-700 text-xs sm:text-sm">No ownership</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <XCircle className="h-4 w-4 sm:h-6 sm:w-6 text-red-500 flex-shrink-0" />
                <span className="text-slate-700 text-xs sm:text-sm">Skills fade</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <XCircle className="h-4 w-4 sm:h-6 sm:w-6 text-red-500 flex-shrink-0" />
                <span className="text-slate-700 text-xs sm:text-sm">No meaning</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Research Foundation Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
              Research-Based Goal Requirements & How Our Tool Delivers
            </h2>
            
            <div className="grid gap-6 sm:gap-8 max-w-5xl mx-auto">
              {/* Cooper, Heron, & Heward */}
              <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200">
                <div className="flex items-start space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 sm:mb-2">Cooper, Heron, & Heward (2020)</h3>
                    <p className="text-slate-600 text-xs sm:text-sm">Applied Behavior Analysis, 3rd Edition</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-3">Research Requirements:</h4>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li>• Clear, observable, measurable behavior definitions</li>
                      <li>• Function-based replacement behaviors</li>
                      <li>• Specific measurement systems (frequency, duration, latency)</li>
                      <li>• Explicit generalization and maintenance planning</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-3">How Our Tool Delivers:</h4>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li>• Required fields: Condition → Behavior → Criterion → Measurement</li>
                      <li>• Mandatory replacement behavior when reduction target selected</li>
                      <li>• Measurement presets: % opportunities, responses/min, latency</li>
                      <li>• Built-in generalization and maintenance planners</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Stokes & Baer */}
              <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200">
                <div className="flex items-start space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 sm:mb-2">Stokes & Baer (1977)</h3>
                    <p className="text-slate-600 text-xs sm:text-sm">&ldquo;Implicit Technology of Generalization&rdquo;</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-3">Research Requirements:</h4>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li>• Don&apos;t hope for generalization—program it</li>
                      <li>• Train multiple exemplars</li>
                      <li>• Use mediators (self-management cues)</li>
                      <li>• Indiscriminable contingencies</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-3">How Our Tool Delivers:</h4>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li>• Generalization Planner with common stimuli checklist</li>
                      <li>• Multiple exemplars input (≥3 settings/people/materials)</li>
                      <li>• Self-monitoring card templates and mediators</li>
                      <li>• Variable-interval reinforcement options</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Kubina & Wolfe */}
              <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200">
                <div className="flex items-start space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 sm:mb-2">Kubina & Wolfe (2005)</h3>
                    <p className="text-slate-600 text-xs sm:text-sm">Behavioral Fluency Research</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-3">Research Requirements:</h4>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li>• Fluency = accuracy + rate for retention</li>
                      <li>• RESA: Retention, Endurance, Stability, Application</li>
                      <li>• Frequency-based aims support robust performance</li>
                      <li>• Component → Composite skill building</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-3">How Our Tool Delivers:</h4>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li>• Optional Fluency Mode with rate criteria</li>
                      <li>• Endurance testing under distraction</li>
                      <li>• Component → Composite assistant</li>
                      <li>• 90-100% accuracy targets for better retention</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Pitts */}
              <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200">
                <div className="flex items-start space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 sm:mb-2">Pitts (2021)</h3>
                    <p className="text-slate-600 text-xs sm:text-sm">Mastery Criteria & Maintenance</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-3">Research Requirements:</h4>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li>• Multi-session mastery criteria</li>
                      <li>• Consistency across sessions/contexts</li>
                      <li>• Stricter criteria maintain better over time</li>
                      <li>• 90-100% accuracy vs 80% for retention</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-3">How Our Tool Delivers:</h4>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li>• Default mastery presets: ≥90% across 3 sessions</li>
                      <li>• Multi-context consistency requirements</li>
                      <li>• Guardrails for too-lenient criteria</li>
                      <li>• 4-week maintenance probes built-in</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5-Level Progression Section */}
      <section className="py-16 lg:py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
              The 5-Level Goal Writing Progression
            </h2>
            
            <div className="grid gap-4 sm:gap-6 max-w-4xl mx-auto">
              {/* Level 1 */}
                              <div className="bg-white rounded-xl p-4 sm:p-6 border-l-4 border-red-400 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">Level 1: Basic Goal</h3>
                    <span className="bg-red-100 text-red-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium self-start sm:self-auto">Low Effectiveness</span>
                  </div>
                <p className="text-slate-600 mb-3">Includes: Date, context, behavior, measurement criteria</p>
                <p className="text-slate-600">Missing: Baseline data, latency, fluency, generalization, maintenance</p>
              </div>

              {/* Level 2 */}
                              <div className="bg-white rounded-xl p-4 sm:p-6 border-l-4 border-yellow-400 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">Level 2: + Baseline Data</h3>
                    <span className="bg-yellow-100 text-yellow-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium self-start sm:self-auto">Moderate</span>
                  </div>
                <p className="text-slate-600 mb-3">Adds: Current performance levels for comparison</p>
                <p className="text-slate-600">Missing: Latency, fluency, generalization, maintenance</p>
              </div>

              {/* Level 3 */}
                              <div className="bg-white rounded-xl p-4 sm:p-6 border-l-4 border-orange-400 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">Level 3: + Latency & Fluency</h3>
                    <span className="bg-orange-100 text-orange-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium self-start sm:self-auto">Improving</span>
                  </div>
                <p className="text-slate-600 mb-3">Adds: Response time and accuracy for skill stability</p>
                <p className="text-slate-600">Missing: Generalization, maintenance</p>
              </div>

              {/* Level 4 */}
                              <div className="bg-white rounded-xl p-4 sm:p-6 border-l-4 border-blue-400 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">Level 4: + Generalization</h3>
                    <span className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium self-start sm:self-auto">Strong</span>
                  </div>
                <p className="text-slate-600 mb-3">Adds: Multiple settings for real-world application</p>
                <p className="text-slate-600">Missing: Maintenance</p>
              </div>

              {/* Level 5 */}
                              <div className="bg-white rounded-xl p-4 sm:p-6 border-l-4 border-emerald-400 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">Level 5: + Maintenance</h3>
                    <span className="bg-emerald-100 text-emerald-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium self-start sm:self-auto">Most Effective</span>
                  </div>
                <p className="text-slate-600 mb-3">Adds: 4+ weeks retention for lasting change</p>
                <p className="text-slate-600 font-medium">Complete: All research-based components included</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
              How the Values Wizard Works
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
              <div className="flex items-start space-x-3 sm:space-x-4 text-left">
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 sm:mb-2">Values Wizard</h3>
                  <p className="text-slate-600 text-sm sm:text-base">Students pick what matters most—Kind, Brave, Focused, etc.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 sm:space-x-4 text-left">
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 sm:mb-2">Age-Appropriate Skills</h3>
                  <p className="text-slate-600 text-sm sm:text-base">Suggests skills linked to student&apos;s chosen values</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 sm:space-x-4 text-left">
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 sm:mb-2">SMART Goals</h3>
                  <p className="text-slate-600 text-sm sm:text-base">Auto-generates Specific, Measurable, Achievable goals</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 sm:space-x-4 text-left">
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 sm:mb-2">Generalization Plans</h3>
                  <p className="text-slate-600 text-sm sm:text-base">Different settings, people, and prompts built-in</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 sm:space-x-4 text-left">
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 sm:mb-2">Maintenance Checks</h3>
                  <p className="text-slate-600 text-sm sm:text-base">Follow-ups at 2 and 4 weeks to ensure skills last</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button 
                onClick={() => setIsSignupOpen(true)}
                className="inline-flex items-center px-8 py-4 text-lg font-bold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200"
              >
                Start Writing Goals
                <ArrowRight className="ml-3 h-6 w-6" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Before & After Example */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 text-center">
              The 5-Level IEP Goal Hierarchy: From Basic to Research-Based
            </h2>

            <div className="space-y-8">
              {/* Level 1: Basic Goal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 relative"
              >
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  Level 1
                </div>
                <h3 className="text-2xl font-bold text-red-800 mb-6">Basic Goal (Low Effectiveness 🔴)</h3>
                <div className="bg-white rounded-lg p-6 border border-red-300 mb-6">
                  <p className="text-lg font-medium text-red-800">
                    &ldquo;By 03/10/26, when in a structured classroom setting and given verbal prompts, [Student] will increase on-task behavior (remaining seated and completing assignments) in 80% of opportunities for 3 consecutively measured school days as measured by teacher observation.&rdquo;
                  </p>
                  <div className="mt-4 p-3 bg-red-50 rounded border border-red-200">
                    <p className="text-sm text-red-700 font-medium">Baseline:</p>
                    <p className="text-sm text-red-600">Narrative or not connected to the goal measurement.</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-red-800 mb-2">✅ Includes:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Date and context</li>
                      <li>• Specific behavior</li>
                      <li>• Measurement criteria</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-red-800 mb-2">❌ Missing:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Baseline data</li>
                      <li>• Latency & fluency</li>
                      <li>• Generalization</li>
                      <li>• Maintenance</li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Level 5: Comprehensive Goal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-8 relative"
              >
                <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  Level 5
                </div>
                <h3 className="text-2xl font-bold text-emerald-800 mb-6">Research-Based Goal (Most Effective ✅)</h3>
                <div className="bg-white rounded-lg p-6 border border-emerald-300 mb-6">
                  <p className="text-lg font-medium text-emerald-800">
                    &ldquo;By 03/10/26, when in a structured classroom, small group instruction, and independent work time, and given verbal prompts, [Student] will increase on-task behavior (remaining seated and completing assignments) in 90% of opportunities for 3 consecutively measured school days, initiating the task within 10 seconds of instruction, across 3 different school settings, as measured by teacher observation. Additionally, [Student] will maintain on-task behavior for 4 weeks following mastery to ensure long-term retention.&rdquo;
                  </p>
                  <div className="mt-4 p-3 bg-emerald-50 rounded border border-emerald-200">
                    <p className="text-sm text-emerald-700 font-medium">Baseline:</p>
                    <p className="text-sm text-emerald-600">[Student] currently remains on-task in 40% of observed intervals, takes an average of 25 seconds to begin a task after instruction, and is inconsistent across different settings.</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-emerald-800 mb-2">✅ Includes All Components:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Baseline data (current performance)</li>
                      <li>• Latency (10 seconds)</li>
                      <li>• Fluency (90% accuracy)</li>
                      <li>• Generalization (3 settings)</li>
                      <li>• Maintenance (4 weeks)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-800 mb-2">🎯 Research Benefits:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• 90-100% accuracy for better retention</li>
                      <li>• Fluency building for skill stability</li>
                      <li>• Cross-setting generalization</li>
                      <li>• Long-term maintenance</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Who Benefits Section */}
      <section className="py-16 lg:py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
              Who Should Use the Free Goal Generator?
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Teachers */}
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full">
                    <BookOpen className="w-10 h-10 text-purple-600" />
                  </div>
                </div>
                
                                <h3 className="text-xl font-bold text-slate-900 mb-3">Teachers</h3>
                <p className="text-slate-600 mb-6">Save time</p>
                
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-slate-700 text-sm leading-relaxed">
                    Write clear, measurable goals that are easy to track and implement in the classroom.
                  </p>
                </div>
              </motion.article>

              {/* BCBAs */}
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full">
                    <Beaker className="w-10 h-10 text-blue-600" />
                  </div>
                </div>
                
                                <h3 className="text-xl font-bold text-slate-900 mb-3">BCBAs</h3>
                <p className="text-slate-600 mb-6">Align with ABA</p>
                
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-slate-700 text-sm leading-relaxed">
                    Ensure goals align with evidence-based ABA practices and compliance requirements.
                  </p>
                </div>
              </motion.article>

              {/* Schools */}
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full">
                    <Building2 className="w-10 h-10 text-emerald-600" />
                  </div>
                </div>
                
                                <h3 className="text-xl font-bold text-slate-900 mb-3">Schools</h3>
                <p className="text-slate-600 mb-6">Compliance</p>
                
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-slate-700 text-sm leading-relaxed">
                    Improve compliance and outcomes with consistently measurable IEP goals across your district.
                  </p>
                </div>
              </motion.article>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Sign Up Section */}
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
              Why This Matters (Evidence)
            </h2>

            <div className="bg-slate-50 rounded-2xl p-8">
              <ul className="space-y-6 text-left max-w-2xl mx-auto mb-8">
                <li className="flex items-center space-x-4 text-xl font-medium text-slate-700">
                  <Zap className="h-6 w-6 text-orange-500 flex-shrink-0" />
                  <span>Values create autonomous motivation</span>
                </li>
                <li className="flex items-center space-x-4 text-xl font-medium text-slate-700">
                  <BarChart3 className="h-6 w-6 text-blue-500 flex-shrink-0" />
                  <span>ACT research shows resilience</span>
                </li>
                <li className="flex items-center space-x-4 text-xl font-medium text-slate-700">
                  <Award className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                  <span>Skills last longer with meaning</span>
                </li>
              </ul>

              <div className="text-center">
                <button 
                  onClick={() => setIsSignupOpen(true)}
                  className="inline-flex items-center px-8 py-4 text-lg font-bold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200"
                >
                  Join Waitlist Now
                  <ArrowRight className="ml-3 h-6 w-6" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>



      {/* FAQ Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 text-center">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="flex justify-between items-center w-full p-6 text-left hover:bg-slate-100 transition-colors duration-200"
                  >
                    <span className="text-lg font-semibold text-slate-900 pr-4">{faq.question}</span>
                    {openFaq === index ? (
                      <ChevronUp className="h-6 w-6 text-slate-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-6 w-6 text-slate-500 flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6"
                    >
                      <p className="text-slate-700 leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="text-center pt-8">
              <button 
                onClick={() => setIsSignupOpen(true)}
                className="inline-flex items-center px-8 py-4 text-lg font-bold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200"
              >
                Yes, I Want Better Goals
                <ArrowRight className="ml-3 h-6 w-6" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sticky CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-50 transform translate-y-full animate-slide-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Star className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500" />
              <span className="text-sm sm:text-lg font-semibold text-slate-900">Join the Waitlist for the Free IEP Goal Generator</span>
            </div>
            <button 
              onClick={() => setIsSignupOpen(true)}
              className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-bold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Generate My First Goal Now
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      </div>
      
      <EmailSignupPopup
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        title="Join the Waitlist"
        description="Be the first to know when the IEP Goal Writer launches."
        pageSource="/iep-goals"
      />
    </main>
  );
}
