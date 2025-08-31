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
      question: "Why do 90-100% accuracy goals work better than 80%?",
      answer: "Research by Pitts (2021) found that skills taught with 100% accuracy were maintained at higher levels compared to 80% or 90%. Our tool targets 90-100% accuracy for better long-term retention and skill stability."
    },
    {
      question: "How does the tool ensure generalization doesn't happen by chance?",
      answer: "Based on Stokes & Baer (1977), our tool requires explicit generalization planning with multiple exemplars, mediators, and indiscriminable contingencies. We don't hope for generalization—we program it systematically."
    },
    {
      question: "What's the difference between fluency and accuracy in goals?",
      answer: "Kubina & Wolfe (2005) showed that fluency (accuracy + rate) leads to better retention, endurance, stability, and application. Our tool offers optional Fluency Mode with rate criteria for more robust skill development."
    },
    {
      question: "How does the tool address maintenance and long-term retention?",
      answer: "Following Carr & LeBlanc (2003), our tool includes maintenance probe scheduling, natural reinforcement planning, and implementation support fields. We ensure skills don't just meet criteria but maintain over time."
    },
    {
      question: "What makes an IEP goal research-based vs. basic?",
      answer: "Research-based goals include all components from Cooper et al. (2020): clear behavior definitions, function-based replacement behaviors, specific measurement systems, and explicit generalization/maintenance planning."
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
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.05] text-slate-900">
                Research-Based IEP Goal Generator — 5-Level Hierarchy for Maximum Effectiveness
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed">
                Create comprehensive IEP goals with baseline data, fluency building, 90-100% accuracy targets, generalization, and maintenance — backed by behavior analysis research.
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
                
                <div className="p-6">
                  <div className="space-y-3 mb-4">
                    <label className="block text-sm font-medium text-slate-700">Student Name:</label>
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <p className="text-slate-600">[Student]</p>
                    </div>
                    
                    <label className="block text-sm font-medium text-slate-700">Target Behavior:</label>
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <p className="text-slate-600">On-task behavior (remaining seated and completing assignments)</p>
                    </div>
                    
                    <label className="block text-sm font-medium text-slate-700">Current Performance:</label>
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <p className="text-slate-600">40% of observed intervals, 25 seconds to begin tasks</p>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg">
                    <Zap className="inline h-5 w-5 mr-2" />
                    Generate Level 5 Goal
                  </button>

                  <div className="mt-4 space-y-3">
                    <label className="block text-sm font-medium text-slate-700">Generated IEP Goal:</label>
                    <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-4">
                      <p className="text-emerald-800 text-sm leading-relaxed">
                        <CheckCircle className="inline h-4 w-4 mr-2" />
                        By 03/10/26, when in a structured classroom, small group instruction, and independent work time, and given verbal prompts, [Student] will increase on-task behavior (remaining seated and completing assignments) in 90% of opportunities for 3 consecutively measured school days, initiating the task within 10 seconds of instruction, across 3 different school settings, as measured by teacher observation. Additionally, [Student] will maintain on-task behavior for 4 weeks following mastery to ensure long-term retention.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Baseline Data
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Latency & Fluency
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      90% Accuracy
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Generalization
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
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
              Why 80% of IEP Goals Fail (Research Shows the Solution)
            </h2>

            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 max-w-2xl mx-auto">
              <div className="bg-white rounded-lg p-6 border border-red-300">
                <p className="text-lg font-medium text-red-800">
                  &ldquo;[Student] will reduce blurting in class.&rdquo;
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-4xl mx-auto">
              <div className="flex items-center space-x-3">
                <XCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
                <span className="text-slate-700">Vague / Unmeasurable</span>
              </div>
              <div className="flex items-center space-x-3">
                <XCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
                <span className="text-slate-700">No baseline data</span>
              </div>
              <div className="flex items-center space-x-3">
                <XCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
                <span className="text-slate-700">No success criteria</span>
              </div>
              <div className="flex items-center space-x-3">
                <XCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
                <span className="text-slate-700">Teachers guessing</span>
              </div>
              <div className="flex items-center space-x-3">
                <XCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
                <span className="text-slate-700">Parents in dark</span>
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
            
            <div className="grid gap-8 max-w-5xl mx-auto">
              {/* Cooper, Heron, & Heward */}
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Cooper, Heron, & Heward (2020)</h3>
                    <p className="text-slate-600 text-sm">Applied Behavior Analysis, 3rd Edition</p>
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
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Stokes & Baer (1977)</h3>
                    <p className="text-slate-600 text-sm">&ldquo;Implicit Technology of Generalization&rdquo;</p>
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
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Kubina & Wolfe (2005)</h3>
                    <p className="text-slate-600 text-sm">Behavioral Fluency Research</p>
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
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Pitts (2021)</h3>
                    <p className="text-slate-600 text-sm">Mastery Criteria & Maintenance</p>
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
            
            <div className="grid gap-6 max-w-4xl mx-auto">
              {/* Level 1 */}
              <div className="bg-white rounded-xl p-6 border-l-4 border-red-400 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900">Level 1: Basic Goal</h3>
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">Low Effectiveness</span>
                </div>
                <p className="text-slate-600 mb-3">Includes: Date, context, behavior, measurement criteria</p>
                <p className="text-slate-600">Missing: Baseline data, latency, fluency, generalization, maintenance</p>
              </div>

              {/* Level 2 */}
              <div className="bg-white rounded-xl p-6 border-l-4 border-yellow-400 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900">Level 2: + Baseline Data</h3>
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">Moderate</span>
                </div>
                <p className="text-slate-600 mb-3">Adds: Current performance levels for comparison</p>
                <p className="text-slate-600">Missing: Latency, fluency, generalization, maintenance</p>
              </div>

              {/* Level 3 */}
              <div className="bg-white rounded-xl p-6 border-l-4 border-orange-400 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900">Level 3: + Latency & Fluency</h3>
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">Improving</span>
                </div>
                <p className="text-slate-600 mb-3">Adds: Response time and accuracy for skill stability</p>
                <p className="text-slate-600">Missing: Generalization, maintenance</p>
              </div>

              {/* Level 4 */}
              <div className="bg-white rounded-xl p-6 border-l-4 border-blue-400 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900">Level 4: + Generalization</h3>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Strong</span>
                </div>
                <p className="text-slate-600 mb-3">Adds: Multiple settings for real-world application</p>
                <p className="text-slate-600">Missing: Maintenance</p>
              </div>

              {/* Level 5 */}
              <div className="bg-white rounded-xl p-6 border-l-4 border-emerald-400 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900">Level 5: + Maintenance</h3>
                  <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">Most Effective</span>
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
              Research-Based Components for Maximum Effectiveness
            </h2>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="flex items-start space-x-4 text-left">
                <CheckCircle className="h-8 w-8 text-emerald-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Baseline Data</h3>
                  <p className="text-slate-600">Current performance levels for accurate measurement</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 text-left">
                <CheckCircle className="h-8 w-8 text-emerald-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Latency & Fluency</h3>
                  <p className="text-slate-600">Response time + accuracy for skill stability</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 text-left">
                <CheckCircle className="h-8 w-8 text-emerald-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">90-100% Accuracy</h3>
                  <p className="text-slate-600">Research shows higher retention than 80%</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 text-left">
                <CheckCircle className="h-8 w-8 text-emerald-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Generalization</h3>
                  <p className="text-slate-600">Multiple settings for real-world application</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 text-left">
                <CheckCircle className="h-8 w-8 text-emerald-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Maintenance</h3>
                  <p className="text-slate-600">4+ weeks retention for lasting change</p>
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
              Why Join the Waitlist?
            </h2>

            <div className="bg-slate-50 rounded-2xl p-8">
              <ul className="space-y-6 text-left max-w-2xl mx-auto mb-8">
                <li className="flex items-center space-x-4 text-xl font-medium text-slate-700">
                  <Zap className="h-6 w-6 text-orange-500 flex-shrink-0" />
                  <span>First to try free tool</span>
                </li>
                <li className="flex items-center space-x-4 text-xl font-medium text-slate-700">
                  <BarChart3 className="h-6 w-6 text-blue-500 flex-shrink-0" />
                  <span>Bonus templates</span>
                </li>
                <li className="flex items-center space-x-4 text-xl font-medium text-slate-700">
                  <Award className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                  <span>Built by BCBAs</span>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Star className="h-6 w-6 text-orange-500" />
              <span className="text-lg font-semibold text-slate-900">Join the Waitlist for the Free IEP Goal Generator</span>
            </div>
            <button 
              onClick={() => setIsSignupOpen(true)}
              className="inline-flex items-center px-6 py-3 text-base font-bold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Generate My First Goal Now
              <ArrowRight className="ml-2 h-5 w-5" />
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
