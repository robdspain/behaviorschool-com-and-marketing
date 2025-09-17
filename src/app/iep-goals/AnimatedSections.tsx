"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle, XCircle, BarChart3, Zap, Users, Award, Star, ArrowRight, BookOpen, Beaker, Building2 } from "lucide-react";
import { EmailSignupPopup } from "@/components/ui/email-signup-popup";
import { IEPGoalWriter } from "@/components/IEPGoalWriter";

export function AnimatedSections() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const faqs = [
    {
      question: "How does the free IEP behavior goal generator work?",
      answer: "Our free tool guides you through a 6-step wizard to create professional IEP behavior goals in under 5 minutes. Simply define the target behavior, set measurement criteria, add baseline data, and generate compliant goals. No registration required."
    },
    {
      question: "What types of behavior goals can I create?",
      answer: "The tool is specialized for both increasing positive behaviors (like social skills, communication, academic engagement) and decreasing problem behaviors (like disruption, aggression, non-compliance). It automatically detects goal direction and applies appropriate measurement standards."
    },
    {
      question: "Are the generated goals IEP compliant?",
      answer: "Yes, all goals include specific, measurable criteria that meet IEP compliance standards. The tool has built-in validation rules and a 5-level quality meter to ensure goals are legally compliant and educationally sound."
    },
    {
      question: "Do I need to create an account to use the generator?",
      answer: "No registration is required. The tool processes everything client-side in your browser, ensuring complete privacy. No data is transmitted or stored on our servers. You can start generating goals immediately."
    },
    {
      question: "How can I export or save the generated goals?",
      answer: "Goals can be copied to your clipboard with one click or downloaded as a text file. The output is formatted and ready to paste directly into IEP documents or data collection systems."
    }
  ];

  // Social proof based on actual waitlist data and research foundation

  return (
    <main>
      {/* Hero Section */}
      <section className="relative pt-16 pb-8 lg:pt-20 lg:pb-12 bg-white">
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
                              className="space-y-4"
            >
              <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight leading-[1.1] text-slate-900">
                Finally, IEP Behavior Goals That <span className="text-emerald-600">Actually Work</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-700 font-medium mb-4">
                Stop Struggling with Vague, Non-Compliant Goals
              </p>

              <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed">
                You know the pain: spending hours writing behavior goals that get rejected by administrators, questioned by parents, or simply don't lead to meaningful change. Our free tool eliminates the guesswork and creates research-backed goals that pass compliance reviews and actually help students succeed.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                                 <button
                   onClick={() => setIsSignupOpen(true)}
                   className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
                 >
                   <Zap className="mr-3 h-6 w-6" />
                   Start Creating Goals Free
                   <ArrowRight className="ml-3 h-6 w-6" />
                 </button>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-slate-600">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-semibold">No Registration Required</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-semibold">Under 5 Minutes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-semibold">IEP Compliant</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <IEPGoalWriter />

              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-400 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Value Summary Section - NEW */}
      <section className="py-12 lg:py-16 bg-gradient-to-r from-emerald-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-8"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
              What You Get with the Values Wizard
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-200"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mx-auto mb-4">
                  <Zap className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Level 5 SMART Goals</h3>
                <p className="text-slate-600 text-sm">Complete goals with baseline, fluency, generalization, and 4-week maintenance—all research-backed components included.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-blue-200"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Student-Driven Goals</h3>
                <p className="text-slate-600 text-sm">Values-based goals that students help create, leading to higher motivation and lasting behavior change beyond compliance.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-orange-200"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-2xl mx-auto mb-4">
                  <Award className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Instant Generation</h3>
                <p className="text-slate-600 text-sm">Save hours of writing time with auto-generated goals that include all ABA compliance requirements and measurement systems.</p>
              </motion.div>
            </div>

            <div className="text-center pt-4">
              <button 
                onClick={() => setIsSignupOpen(true)}
                className="inline-flex items-center px-10 py-5 text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
              >
                Get Early Access Now
                <ArrowRight className="ml-3 h-6 w-6" />
              </button>
              <p className="text-sm text-slate-500 mt-3">Join 2,847+ educators on the waitlist • 94% report needing this tool</p>
            </div>
          </motion.div>
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

      {/* Who Benefits Section - MOVED UP for better conversion flow */}
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

      {/* Social Proof & Trust Indicators Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
              Trusted by Special Education Professionals
            </h2>
            
            {/* Trust Indicators */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">2,847+</div>
                <p className="text-slate-600 font-medium">Educators on Waitlist</p>
                <p className="text-slate-500 text-sm mt-1">Growing weekly</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-600 mb-2">15+</div>
                <p className="text-slate-600 font-medium">Research Citations</p>
                <p className="text-slate-500 text-sm mt-1">Evidence-based approach</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">BCBA</div>
                <p className="text-slate-600 font-medium">Board Certified</p>
                <p className="text-slate-500 text-sm mt-1">Professional oversight</p>
              </div>
            </div>

            {/* Founder Story */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Meet the Creator</h3>
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Rob Spain, M.Ed., BCBA</span>
                  <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">Behavior School Founder</span>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">15+ Years Experience</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-8 border-l-4 border-emerald-500">
                <h4 className="text-lg font-semibold text-slate-900 mb-4">Why I Built This Tool</h4>
                <p className="text-slate-700 leading-relaxed mb-4">
                  After 15+ years as a practicing BCBA in schools, I grew frustrated seeing IEP goals that students didn&apos;t connect with. 
                  Traditional goals focused on compliance rather than what actually mattered to the students themselves.
                </p>
                <p className="text-slate-700 leading-relaxed mb-4">
                  I developed this values-based approach because I believe when we start with what matters to students — 
                  their own values like being brave, kind, or helpful — everything changes. The goals become meaningful, 
                  and students become invested in their own growth.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  This tool represents years of research, field testing, and refinement to create IEP goals that actually work 
                  in real classrooms with real students.
                </p>
                <div className="mt-6 pt-4 border-t border-slate-200">
                  <p className="text-slate-600 text-sm">
                    <strong>Rob Spain, M.Ed., BCBA</strong> • Behavior School Founder • Practicing School-Based BCBA
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button 
                onClick={() => setIsSignupOpen(true)}
                className="inline-flex items-center px-10 py-5 text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
              >
                Join 2,847+ Educators on the Waitlist
                <ArrowRight className="ml-3 h-6 w-6" />
              </button>
              <p className="text-sm text-slate-500 mt-3">Early access launching soon</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section - How the Values Wizard Works */}
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
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 sm:mb-2">Customizable Maintenance</h3>
                  <p className="text-slate-600 text-sm sm:text-base">Set your own benchmarks and follow-up intervals</p>
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

      {/* Research Foundation Section - MOVED DOWN */}
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
              {/* Applied Behavior Analysis Requirements */}
              <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200">
                <div className="flex items-start space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 sm:mb-2">Applied Behavior Analysis Standards<sup>1</sup></h3>
                    <p className="text-slate-600 text-xs sm:text-sm">Behavioral goal writing requirements</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-3">What Research Says:</h4>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li>• Write goals that anyone can see and measure</li>
                      <li>• Teach better behaviors instead of just stopping bad ones</li>
                      <li>• Use clear ways to track student progress</li>
                      <li>• Plan for skills to work in different places and last over time</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-3">How Our Tool Helps:</h4>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li>• Guides you through: Setting → Behavior → Goal → How to Measure</li>
                      <li>• Always asks &quot;what should they do instead?&quot; for problem behaviors</li>
                      <li>• Built-in options: count times, track minutes, measure speed</li>
                      <li>• Automatic planning for different settings and long-term success</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Generalization Technology */}
              <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200">
                <div className="flex items-start space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 sm:mb-2">Generalization Technology<sup>2</sup></h3>
                    <p className="text-slate-600 text-xs sm:text-sm">Programming for skill transfer</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-3">What Research Says:</h4>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li>• Don&apos;t hope skills transfer to new places—plan for it</li>
                      <li>• Practice the same skill in many different situations</li>
                      <li>• Give students tools to remind themselves what to do</li>
                      <li>• Make rewards unpredictable so skills stick better</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-3">How Our Tool Helps:</h4>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li>• Built-in planner asks: where else should this work?</li>
                      <li>• Requires at least 3 different places, people, or materials</li>
                      <li>• Creates reminder cards students can use themselves</li>
                      <li>• Suggests mixing up when students get praised or rewards</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Behavioral Fluency */}
              <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200">
                <div className="flex items-start space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 sm:mb-2">Behavioral Fluency Research<sup>3</sup></h3>
                    <p className="text-slate-600 text-xs sm:text-sm">Rate and accuracy for retention</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-3">What Research Says:</h4>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li>• Students need to be both correct AND fast for skills to last</li>
                      <li>• Skills should stick, work when tired, stay steady, and transfer</li>
                      <li>• Speed goals help create stronger, lasting skills</li>
                      <li>• Build small skills first, then combine into bigger ones</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-3">How Our Tool Helps:</h4>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li>• Option to add speed goals (like &quot;within 5 seconds&quot;)</li>
                      <li>• Tests if skills work even when students are distracted</li>
                      <li>• Helps break big skills into smaller, learnable steps</li>
                      <li>• Sets high standards (90-100% correct) for better results</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Mastery Criteria */}
              <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200">
                <div className="flex items-start space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 sm:mb-2">Mastery Criteria & Maintenance<sup>4</sup></h3>
                    <p className="text-slate-600 text-xs sm:text-sm">Optimal performance standards</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-3">What Research Says:</h4>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li>• Students must show they can do it multiple times, not just once</li>
                      <li>• Skills should work the same way every time and everywhere</li>
                      <li>• Higher standards help skills last longer than lower ones</li>
                      <li>• Aiming for 90-100% correct works better than 80%</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-3">How Our Tool Helps:</h4>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li>• Sets goals for 90% success over 3 different days</li>
                      <li>• Checks that skills work in multiple situations</li>
                      <li>• Warns you if goals are set too low to be effective</li>
                      <li>• Automatically includes 4-week follow-up checks</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Academic References - Footnotes */}
            <div className="mt-12 pt-8 border-t border-slate-200 text-left max-w-4xl mx-auto">
              <h4 className="text-sm font-semibold text-slate-900 mb-4">References</h4>
              <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
                <p><sup>1</sup> Cooper, J. O., Heron, T. E., & Heward, W. L. (2020). <em>Applied behavior analysis</em> (3rd ed.). Pearson.</p>
                <p><sup>2</sup> Stokes, T. F., & Baer, D. M. (1977). An implicit technology of generalization. <em>Journal of Applied Behavior Analysis, 10</em>(2), 349-367.</p>
                <p><sup>3</sup> Kubina Jr, R. M., & Wolfe, P. (2005). Potential applications of behavioral fluency for students with autism. <em>Exceptionality, 13</em>(1), 35-44.</p>
                <p><sup>4</sup> Pitts, L. (2021). The effect of mastery criteria on skill acquisition, generalization, and maintenance. <em>Journal of Applied Behavior Analysis, 54</em>(4), 1476-1490.</p>
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
