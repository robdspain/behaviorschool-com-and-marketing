"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, Brain, Users, FileText, Target, BookOpen } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";



export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-4">
        <Breadcrumbs 
          items={[
            { label: "Products" }
          ]}
        />
      </div>
      
      <section id="products" className="pt-20 pb-16 lg:pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            {/* Behavior Study Tools */}
            <div>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-400 rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Behavior Study Tools</h2>
                </div>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Master the BCBA exam with our AI-powered study platform. Get practice questions, mock exams, and personalized study plans.
                </p>
                <div>
                  <Link href="/behavior-study-tools" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-semibold group">
                    Learn more <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="relative">
                <Image src="/Hero/Hero-group1.webp" alt="Study Tools" width={600} height={400} className="w-full h-auto rounded-2xl shadow-2xl" />
              </div>
            </div>

            {/* Supervision Tools */}
            <div>
              <div className="relative">
                <Image src="/Supervision/Supervision1.webp" alt="Supervision" width={800} height={533} className="w-full h-auto rounded-2xl shadow-2xl" />
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Supervision Tools</h2>
                </div>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Streamline your supervision practice with tools designed for BCBA supervisors.
                </p>
                <Link href="/supervisors" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold">
                  Learn more <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* IEP Goal Writer */}
            <div>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">IEP Goal Writer</h2>
                </div>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Write measurable IEP goals that drive real student success.
                </p>
                <Link href="/iep-goals" className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold">
                  Learn more <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
              <div className="relative">
                <Image src="/IEP-Goal/IEP-Goal-Writing.webp" alt="IEP Goal Writing" width={600} height={400} className="w-full h-auto rounded-2xl shadow-2xl" />
              </div>
            </div>

            {/* ACT Matrix Guide - Centered Highlight */}
            <div>
              <div className="max-w-4xl mx-auto text-center space-y-8">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">ACT Matrix Guide</h2>
                </div>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                  Master values-based interventions with our comprehensive guide.
                </p>
                <div className="relative my-12 max-w-2xl mx-auto">
                  <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 shadow-xl">
                    <div className="grid grid-cols-2 gap-8 text-center text-sm relative aspect-video">
                      <div className="absolute inset-x-0 top-1/2 border-t-2 border-slate-100 z-10"></div>
                      <div className="absolute inset-y-0 left-1/2 border-l-2 border-slate-100 z-10"></div>
                      <div className="flex flex-col justify-end pb-4 pr-4"><span className="text-red-500 font-bold uppercase text-xs">Away Moves</span></div>
                      <div className="flex flex-col justify-end pb-4 pl-4"><span className="text-emerald-600 font-bold uppercase text-xs">Toward Moves</span></div>
                      <div className="flex flex-col justify-start pt-4 pr-4"><span className="text-red-500 font-bold uppercase text-xs">Internal Barriers</span></div>
                      <div className="flex flex-col justify-start pt-4 pl-4"><span className="text-emerald-600 font-bold uppercase text-xs">Values</span></div>
                    </div>
                  </div>
                </div>
                <Link href="/act-matrix" className="inline-flex items-center px-8 py-4 bg-teal-600 text-white rounded-xl font-bold">
                  Get the ACT Matrix Guide
                </Link>
              </div>
            </div>

            {/* Behavior Plan Writer */}
            <div>
              <div className="relative">
                <Image src="/optimized/BIP-Writer/BIP-Writer-Team.webp" alt="BIP Writer" width={600} height={400} className="w-full h-auto rounded-2xl shadow-2xl" />
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Behavior Plan Writer</h2>
                </div>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Develop comprehensive behavior intervention plans with AI assistance.
                </p>
                <Link href="/behavior-plans" className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold">
                  Learn more <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}