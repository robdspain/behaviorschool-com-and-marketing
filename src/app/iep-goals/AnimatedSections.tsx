"use client";

import { motion } from "framer-motion";
import { ClientCTA } from "./ClientCTA";

export function AnimatedSections() {
  return (
    <main>
      {/* Hero Section (Above the Fold) */}
      <section className="relative pt-32 pb-16 lg:pt-36 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50" />
        <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-gradient-to-br from-purple-100 to-transparent opacity-30 blur-3xl" />
        <div className="absolute -bottom-10 left-0 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-gradient-to-tr from-pink-100 to-transparent opacity-20 blur-2xl" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.05] text-slate-900">
              The Simple Tool for Writing Effective IEP Behavior Goals
            </h1>
            
            <p className="text-xl sm:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              No more vague, unmeasurable behavior goals. Our tool makes writing clear, trackable IEP behavior goals simple — so students succeed, teachers know, and parents see progress.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <ClientCTA />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* The Problem (Pain Section) */}
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
              Most IEP behavior goals fail before they even leave the meeting room.
            </h2>

            <p className="text-xl text-slate-600">
              Why? Because behavior goal IEP are written like this:
            </p>

            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
              <p className="text-2xl font-bold text-red-700">
                ❌ &quot;Student will reduce blurting in class.&quot;
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">The problem with behavior goals:</h3>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div className="space-y-3">
                  <p className="text-lg text-red-600 font-medium">❌ Vague and unmeasurable</p>
                  <p className="text-lg text-red-600 font-medium">❌ No baseline data</p>
                  <p className="text-lg text-red-600 font-medium">❌ No clear success criteria</p>
                </div>
                <div className="space-y-3">
                  <p className="text-lg text-red-600 font-medium">❌ Teachers left guessing</p>
                  <p className="text-lg text-red-600 font-medium">❌ Parents left in the dark</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Promise (Solution Section) */}
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
              Our tool makes writing effective IEP behavior goals easy.
            </h2>

            <div className="bg-emerald-50 rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-slate-900 mb-8">Every behavior goal IEP is:</h3>
              <div className="space-y-4 text-left max-w-3xl mx-auto">
                <p className="text-lg font-medium text-emerald-700">✅ <strong>Specific</strong> — exact behaviors defined</p>
                <p className="text-lg font-medium text-emerald-700">✅ <strong>Measurable</strong> — baseline, percentages, and criteria included</p>
                <p className="text-lg font-medium text-emerald-700">✅ <strong>Functional</strong> — always paired with a positive replacement behavior</p>
                <p className="text-lg font-medium text-emerald-700">✅ <strong>Generalized</strong> — applies across settings, not just one classroom</p>
                <p className="text-lg font-medium text-emerald-700">✅ <strong>Sustainable</strong> — built-in maintenance so skills stick</p>
              </div>
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
              >
                <ClientCTA />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Before & After Example (Proof Section) */}
      <section className="py-16 lg:py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 text-center">
              Before &amp; After: IEP Behavior Goals Example
            </h2>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Old Goal */}
              <article className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-red-800 mb-6">❌ Old Behavior Goal IEP:</h3>
                <blockquote className="text-lg text-slate-700 italic mb-6">
                  &quot;Student will reduce blurting in class.&quot;
                </blockquote>
                <div className="space-y-2">
                  <h4 className="font-semibold text-red-700 mb-3">Behavior Goal Characteristics:</h4>
                  <ul className="space-y-1">
                    <li className="text-sm text-red-600">❌ Vague behavior definition</li>
                    <li className="text-sm text-red-600">❌ No baseline or target data</li>
                    <li className="text-sm text-red-600">❌ No timeline specified</li>
                    <li className="text-sm text-red-600">❌ Single setting only</li>
                    <li className="text-sm text-red-600">❌ No measurement method</li>
                    <li className="text-sm text-red-600">❌ No replacement behavior</li>
                  </ul>
                </div>
              </article>

              {/* Our Goal */}
              <article className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-emerald-800 mb-6">✅ Our IEP Behavior Goal:</h3>
                <blockquote className="text-lg text-slate-700 mb-6">
                  &quot;Student will raise hand 90% of the time before speaking, across 3 settings, for 3 consecutive days.&quot;
                </blockquote>
                <div className="space-y-2">
                  <h4 className="font-semibold text-emerald-700 mb-3">Behavior Goal Characteristics:</h4>
                  <ul className="space-y-1">
                    <li className="text-sm text-emerald-600">✅ Specific behavior (raise hand)</li>
                    <li className="text-sm text-emerald-600">✅ Clear target (90% accuracy)</li>
                    <li className="text-sm text-emerald-600">✅ Defined timeline (3 consecutive days)</li>
                    <li className="text-sm text-emerald-600">✅ Multiple settings (3 different ones)</li>
                    <li className="text-sm text-emerald-600">✅ Measurable criteria (percentage)</li>
                    <li className="text-sm text-emerald-600">✅ Positive replacement behavior</li>
                  </ul>
                </div>
              </article>
            </div>

            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">
                Clear. Trackable. Real change in behavior goals.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Who Benefits (Audience Section) */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
              Who Benefits from Better IEP Behavior Goals
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <article className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4" aria-hidden="true">👩‍🏫</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Special Education Teachers</h3>
                <p className="text-slate-600">Write behavior goals that are practical and simple to measure in your classroom.</p>
              </article>

              <article className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4" aria-hidden="true">🧑‍⚕️</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">BCBAs & Behavior Analysts</h3>
                <p className="text-slate-600">Ensure IEP behavior goals align with evidence-based practices and measurable outcomes.</p>
              </article>

              <article className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4" aria-hidden="true">🏫</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Schools & Districts</h3>
                <p className="text-slate-600">Improve compliance, outcomes, and parent confidence across your district with better behavior goals.</p>
              </article>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Sign Up (Future-Oriented Proof Section) */}
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
              Why Sign Up for Better IEP Behavior Goals
            </h2>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <ul className="space-y-6 text-left max-w-2xl mx-auto">
                <li className="text-xl font-medium text-slate-700">• Built with educators, for educators writing behavior goals</li>
                <li className="text-xl font-medium text-slate-700">• Based on proven, evidence-based frameworks for IEP behavior goals</li>
                <li className="text-xl font-medium text-slate-700">• Join thousands of educators already on the waitlist for better behavior goal IEP</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
