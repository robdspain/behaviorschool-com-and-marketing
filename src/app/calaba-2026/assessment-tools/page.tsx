"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  Brain, Heart, ClipboardList, Timer, ArrowRight, 
  CheckCircle, Calculator, Users, FileText, Sparkles 
} from "lucide-react";

export default function CalABAAssessmentToolsPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Link 
            href="/calaba-2026"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm mb-6"
          >
            ← Back to CalABA 2026 Symposium
          </Link>
          
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-cyan-300">
            ACT-Informed Assessment Tools
          </h1>
          <p className="text-lg text-slate-200 max-w-2xl mx-auto">
            The assessment battery used in the KCUSD latency-based FA → ACT-informed BIP model. 
            Try each tool to understand how psychological flexibility is measured.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid gap-6 md:grid-cols-2">
          
          {/* ACT Matrix */}
          <Link 
            href="/act-matrix"
            className="group bg-slate-800 border-2 border-slate-600 hover:border-cyan-500 rounded-2xl p-6 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Brain className="w-7 h-7 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 mb-2">
                  ACT Matrix Builder
                </h3>
                <p className="text-slate-300 text-sm mb-3">
                  Create a visual map of the student's inner experiences, values, and behavioral patterns. 
                  Identifies the relationship between private events and observable behavior.
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">Inner vs Outer</span>
                  <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">Toward vs Away</span>
                </div>
                <span className="text-cyan-400 text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Try the Matrix <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>

          {/* Fusion Hierarchy FA - NEW */}
          <Link 
            href="/calaba-2026/assessment-tools/fusion-fa"
            className="group bg-slate-800 border-2 border-cyan-500 hover:border-cyan-400 rounded-2xl p-6 transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-cyan-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-bl-lg">
              NEW
            </div>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-cyan-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Timer className="w-7 h-7 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 mb-2">
                  Fusion Hierarchy FA
                </h3>
                <p className="text-slate-300 text-sm mb-3">
                  Measure differential latency to precursors across validating vs. challenging conditions.
                  Creates a ranked hierarchy of cognitive fusion for targeted defusion interventions.
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded">Latency-Based</span>
                  <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded">Fusion Ranking</span>
                </div>
                <span className="text-cyan-400 text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Try the FA Tool <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>

          {/* Values Sort */}
          <Link 
            href="/act-tools/values-sort"
            className="group bg-slate-800 border-2 border-slate-600 hover:border-cyan-500 rounded-2xl p-6 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-rose-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Heart className="w-7 h-7 text-rose-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 mb-2">
                  Values Card Sort
                </h3>
                <p className="text-slate-300 text-sm mb-3">
                  Help students identify what matters most to them through an interactive sorting activity.
                  Values anchor intervention goals and increase engagement.
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs bg-rose-500/20 text-rose-300 px-2 py-1 rounded">Student-Centered</span>
                  <span className="text-xs bg-rose-500/20 text-rose-300 px-2 py-1 rounded">Values-Based Goals</span>
                </div>
                <span className="text-cyan-400 text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Start Values Sort <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>

          {/* CPFQ Calculator */}
          <div className="group bg-slate-800 border-2 border-slate-600 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Calculator className="w-7 h-7 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  CPFQ Calculator
                </h3>
                <p className="text-slate-300 text-sm mb-3">
                  Score and graph the Children's Psychological Flexibility Questionnaire. 
                  Measures acceptance, defusion, present moment, and committed action.
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">Pre/Post Comparison</span>
                  <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">Auto-Graphing</span>
                </div>
                <span className="text-amber-400 text-sm font-medium inline-flex items-center gap-1">
                  <Sparkles className="w-4 h-4" /> Coming Soon — Available in Google Sheets
                </span>
              </div>
            </div>
          </div>

          {/* Student Interview / ACT Matrix Questionnaire */}
          <Link 
            href="/calaba-2026/assessment-tools/act-matrix-questionnaire"
            className="group bg-slate-800 border-2 border-emerald-500 hover:border-emerald-400 rounded-2xl p-6 transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-emerald-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-bl-lg">
              NEW
            </div>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 mb-2">
                  ACT Matrix Questionnaire
                </h3>
                <p className="text-slate-300 text-sm mb-3">
                  Interview protocol with open-ended questions to explore the student's internal experiences. 
                  Watch the ACT Matrix populate in real-time as you conduct the interview.
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded">10+ Questions</span>
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded">Live Matrix</span>
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded">Context Capture</span>
                </div>
                <span className="text-cyan-400 text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Start Interview <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>

          {/* Latency-Based FA */}
          <div className="group bg-slate-800 border-2 border-slate-600 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Timer className="w-7 h-7 text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Latency-Based FA Observer
                </h3>
                <p className="text-slate-300 text-sm mb-3">
                  Record latency from antecedent to behavior onset. Extended latencies (&gt;30s) 
                  with observable precursors suggest internal mediation.
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded">Stopwatch Timer</span>
                  <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded">Precursor Recording</span>
                </div>
                <span className="text-amber-400 text-sm font-medium inline-flex items-center gap-1">
                  <Sparkles className="w-4 h-4" /> Coming Soon
                </span>
              </div>
            </div>
          </div>

          {/* Inflexible Verbal Relations */}
          <div className="group bg-slate-800 border-2 border-slate-600 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-7 h-7 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Inflexible Verbal Relations Classifier
                </h3>
                <p className="text-slate-300 text-sm mb-3">
                  Identify and categorize rigid verbal rules that control behavior: 
                  self-evaluation, prediction, social comparison, control rules.
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded">RFT-Based</span>
                  <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded">Pattern Recognition</span>
                </div>
                <span className="text-amber-400 text-sm font-medium inline-flex items-center gap-1">
                  <Sparkles className="w-4 h-4" /> Coming Soon
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Decision Framework */}
        <div className="mt-12 bg-slate-800 border-2 border-cyan-500/30 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Assessment Decision Framework</h2>
          <p className="text-slate-300 mb-6">
            The assessment protocol determines which pathway is appropriate:
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-700/50 rounded-xl p-5 border border-slate-600">
              <h3 className="font-bold text-cyan-300 mb-3">Pathway A: Traditional PFA/SBT</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  Short latency (&lt;5 seconds) from antecedent to behavior
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  No observable precursors during delay
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  Clear external contingency control
                </li>
              </ul>
              <p className="text-xs text-slate-400 mt-3">→ Standard function-based BIP appropriate</p>
            </div>

            <div className="bg-slate-700/50 rounded-xl p-5 border border-cyan-500/50">
              <h3 className="font-bold text-cyan-300 mb-3">Pathway B: ACT-Informed BIP</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  Extended latency (&gt;30 seconds) with precursors
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  Observable signs: tension, self-talk, hesitation
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  Student reports internal dialogue driving behavior
                </li>
              </ul>
              <p className="text-xs text-slate-400 mt-3">→ ACT-informed assessment battery indicated</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/calaba-2026"
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 px-6 rounded-xl transition-colors"
          >
            ← Back to Symposium Materials
          </Link>
        </div>
      </section>
    </div>
  );
}
