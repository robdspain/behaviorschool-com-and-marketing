"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export const metadata = {
  title: "IEP Goals Writing Tool | Simple & Effective Goal Creation",
  description: "Discover our simple tool for writing clear, trackable, and effective IEP goals. Join the waitlist for a solution that helps students succeed.",
};

export default function IEPGoalsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumbs 
          items={[
            { label: "Products", href: "/products" },
            { label: "IEP Goals" }
          ]}
        />
      </div>
      
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
              The Simple Tool for Writing Effective IEP Goals
            </h1>
            
            <p className="text-xl sm:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              No more vague, unmeasurable goals. Our tool makes writing clear, trackable IEP goals simple — so students succeed, teachers know, and parents see progress.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link 
                href="/subscribe" 
                className="inline-flex items-center px-12 py-5 text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200"
              >
                🔵 Join the Waitlist — Be the First to Know When We Launch
                <ArrowRight className="ml-3 h-6 w-6" />
              </Link>
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
              Most IEP goals fail before they even leave the meeting room.
            </h2>

            <p className="text-xl text-slate-600">
              Why? Because they&apos;re written like this:
            </p>

            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
              <p className="text-2xl font-bold text-red-700">
                ❌ &quot;Student will reduce blurting in class.&quot;
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">The problem:</h3>
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
              Our tool makes writing effective IEP goals easy.
            </h2>

            <div className="bg-emerald-50 rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-slate-900 mb-8">Every goal is:</h3>
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
                <Link 
                  href="/subscribe" 
                  className="inline-flex items-center px-10 py-4 text-lg font-bold bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  👉 Start Writing Better Goals — Join the Waitlist
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
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
              Before &amp; After Example
            </h2>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Old Goal */}
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-red-800 mb-6">❌ Old Goal:</h3>
                <p className="text-lg text-slate-700 italic mb-6">
                  &quot;Student will reduce blurting in class.&quot;
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-red-700 mb-3">Goal Characteristics:</h4>
                  <p className="text-sm text-red-600">❌ Vague behavior definition</p>
                  <p className="text-sm text-red-600">❌ No baseline or target data</p>
                  <p className="text-sm text-red-600">❌ No timeline specified</p>
                  <p className="text-sm text-red-600">❌ Single setting only</p>
                  <p className="text-sm text-red-600">❌ No measurement method</p>
                  <p className="text-sm text-red-600">❌ No replacement behavior</p>
                </div>
              </div>

              {/* Our Goal */}
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-emerald-800 mb-6">✅ Our Goal:</h3>
                <p className="text-lg text-slate-700 mb-6">
                  &quot;Student will raise hand 90% of the time before speaking, across 3 settings, for 3 consecutive days.&quot;
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-emerald-700 mb-3">Goal Characteristics:</h4>
                  <p className="text-sm text-emerald-600">✅ Specific behavior (raise hand)</p>
                  <p className="text-sm text-emerald-600">✅ Clear target (90% accuracy)</p>
                  <p className="text-sm text-emerald-600">✅ Defined timeline (3 consecutive days)</p>
                  <p className="text-sm text-emerald-600">✅ Multiple settings (3 different ones)</p>
                  <p className="text-sm text-emerald-600">✅ Measurable criteria (percentage)</p>
                  <p className="text-sm text-emerald-600">✅ Positive replacement behavior</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">
                Clear. Trackable. Real change.
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
              Who Benefits
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">👩‍🏫</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Teachers</h3>
                <p className="text-slate-600">Write goals that are practical and simple to measure.</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">🧑‍⚕️</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">BCBAs</h3>
                <p className="text-slate-600">Ensure goals align with evidence-based practices.</p>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">🏫</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Schools &amp; Districts</h3>
                <p className="text-slate-600">Improve compliance, outcomes, and parent confidence.</p>
              </div>
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
              Why Sign Up
            </h2>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="space-y-6 text-left max-w-2xl mx-auto">
                <p className="text-xl font-medium text-slate-700">• Built with educators, for educators</p>
                <p className="text-xl font-medium text-slate-700">• Based on proven, evidence-based frameworks</p>
                <p className="text-xl font-medium text-slate-700">• Join educators already on the waitlist</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      
    </div>
  );
}