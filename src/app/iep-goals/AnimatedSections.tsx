"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ClientCTA } from "./ClientCTA";

export function AnimatedSections() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do you write a measurable behavioral IEP goal?",
      answer: "A behavioral goal should define the exact behavior, include baseline data, and set a clear success criterion (e.g., \"Student will request a break using a visual card in 80% of opportunities across 3 settings.\")."
    },
    {
      question: "What are examples of functional language skills IEP goals?",
      answer: "Functional language goals might include, \"Student will independently request help using a 3-word phrase in 80% of opportunities during classroom routines.\""
    },
    {
      question: "Is there a free IEP goal-writing tool for teachers and BCBAs?",
      answer: "Yes — our Free IEP Goal Generator helps you instantly create SMART, evidence-based goals you can use in IEPs."
    },
    {
      question: "What makes an IEP goal SMART?",
      answer: "SMART goals are Specific, Measurable, Achievable, Relevant, and Time-bound — ensuring clarity and accountability."
    }
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 lg:pt-36 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50" />
        <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-gradient-to-br from-purple-100 to-transparent opacity-30 blur-3xl" />
        <div className="absolute -bottom-10 left-0 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-gradient-to-tr from-pink-100 to-transparent opacity-20 blur-2xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.05] text-slate-900">
                👉 Free IEP Goal Generator — Write Clear, Measurable Goals in Minutes, optimized for Behavior Change
              </h1>
              
              <p className="text-xl sm:text-2xl text-slate-600 leading-relaxed">
                Stop wasting time on vague, untrackable IEP goals. This free tool helps teachers, BCBAs, and schools instantly create SMART IEP goals — specific, measurable, and functional — so students succeed, parents see progress, and teams stay aligned.
              </p>

              {/* Enhanced Social Proof with Urgency */}
              <div className="space-y-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 shadow-lg">
                  <p className="text-lg text-slate-700 font-medium">
                    💬 &quot;Use the same system I have used with my team to create hundreds of IEP goals.&quot;
                  </p>
                </div>
                
                <div className="flex items-center justify-center space-x-6 text-center">
                  <div className="bg-orange-100 rounded-xl px-4 py-2">
                    <p className="text-orange-800 font-bold text-lg">500+ Educators</p>
                    <p className="text-orange-600 text-sm">Already Signed Up</p>
                  </div>
                  <div className="bg-red-100 rounded-xl px-4 py-2">
                    <p className="text-red-800 font-bold text-lg">Limited Spots</p>
                    <p className="text-red-600 text-sm">Only 140 Left</p>
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <ClientCTA />
              </motion.div>
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
                    <div className="ml-4 text-sm text-slate-600 font-medium">Free IEP Goal Generator</div>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="space-y-4 mb-6">
                    <label className="block text-sm font-medium text-slate-700">Describe the behavior goal:</label>
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <p className="text-slate-600 italic">Student blurts out answers in class...</p>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg">
                    ✨ Generate SMART Goal
                  </button>

                  <div className="mt-6 space-y-4">
                    <label className="block text-sm font-medium text-slate-700">Your SMART IEP Goal:</label>
                    <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-4">
                      <p className="text-emerald-800 font-medium">
                        ✅ Student will raise hand 90% of the time before speaking, across 3 settings, for 3 consecutive days.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      ✅ Specific
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      ✅ Measurable
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      ✅ Achievable
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      ✅ Relevant
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      ✅ Time-bound
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

      {/* Who Benefits Section */}
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
              👉 Who Should Use the Free IEP Goal Generator?
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Teachers */}
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full">
                    <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-3">Special Education Teachers</h3>
                <p className="text-slate-600 mb-6">Write goals that are easy to measure and track.</p>
                
                <div className="bg-white/70 rounded-xl p-4 border border-purple-200">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">S</span>
                    </div>
                    <div className="text-left">
                      <p className="text-slate-700 text-sm italic leading-relaxed">
                        &quot;This saved me hours writing goals. Now I can focus on what matters most - my students.&quot;
                      </p>
                      <p className="text-purple-600 text-xs font-medium mt-2">— Sarah M., Special Ed Teacher</p>
                    </div>
                  </div>
                </div>
              </motion.article>

              {/* BCBAs */}
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full">
                    <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-3">BCBAs & Behavior Analysts</h3>
                <p className="text-slate-600 mb-6">Ensure goals align with evidence-based ABA practices.</p>
                
                <div className="bg-white/70 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">D</span>
                    </div>
                    <div className="text-left">
                      <p className="text-slate-700 text-sm italic leading-relaxed">
                        &quot;Finally, goals that align with ABA best practice. The specificity is exactly what we need.&quot;
                      </p>
                      <p className="text-blue-600 text-xs font-medium mt-2">— Dr. Michael R., BCBA</p>
                    </div>
                  </div>
                </div>
              </motion.article>

              {/* Schools & Districts */}
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full">
                    <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-3">Schools & Districts</h3>
                <p className="text-slate-600 mb-6">Improve compliance, outcomes, and parent satisfaction.</p>
                
                <div className="bg-white/70 rounded-xl p-4 border border-emerald-200">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">L</span>
                    </div>
                    <div className="text-left">
                      <p className="text-slate-700 text-sm italic leading-relaxed">
                        &quot;We've improved compliance across the district. Our IEP goals are now consistently measurable.&quot;
                      </p>
                      <p className="text-emerald-600 text-xs font-medium mt-2">— Lisa T., Special Ed Director</p>
                    </div>
                  </div>
                </div>
              </motion.article>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-slate-50 rounded-2xl p-8 max-w-4xl mx-auto"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">Why Educators Trust Our Tool</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-slate-700 font-medium">Evidence-based methodology</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-slate-700 font-medium">Built by experienced BCBAs</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-slate-700 font-medium">Compliant with IDEA requirements</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-slate-700 font-medium">Saves hours of planning time</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-slate-700 font-medium">Improves student outcomes</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-slate-700 font-medium">Free for all educators</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Sign Up Section */}
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
              👉 Why Join the Waitlist?
            </h2>

            {/* Progress Bar */}
            <div className="bg-white rounded-2xl p-6 shadow-lg max-w-md mx-auto">
              <div className="text-center mb-4">
                <p className="text-lg font-bold text-orange-600">Waitlist 72% Full</p>
                <p className="text-sm text-slate-600">Reserve your spot today</p>
              </div>
              
              <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-1000 ease-out" style={{ width: '72%' }}></div>
              </div>
              
              <div className="flex justify-between text-xs text-slate-500">
                <span>0</span>
                <span>500 spots</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <ul className="space-y-6 text-left max-w-2xl mx-auto mb-8">
                <li className="text-xl font-medium text-slate-700">🚀 Be first to try the Free IEP Goal Generator.</li>
                <li className="text-xl font-medium text-slate-700">📊 Get bonus templates for behavioral goals and functional language skills.</li>
                <li className="text-xl font-medium text-slate-700">🎓 Built by BCBAs, trusted by schools.</li>
              </ul>

              {/* Secondary CTA Button */}
              <div className="text-center">
                <button className="inline-flex items-center px-8 py-4 text-lg font-bold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200">
                  Yes, I Want Better IEP Goals →
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
                  className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden"
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
          </motion.div>
        </div>
      </section>

      {/* Sticky CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-50 transform translate-y-full animate-slide-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📌</span>
              <span className="text-lg font-semibold text-slate-900">Join the Waitlist for the Free IEP Goal Generator</span>
            </div>
            <button className="inline-flex items-center px-6 py-3 text-base font-bold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
              Generate My First Goal Now →
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
