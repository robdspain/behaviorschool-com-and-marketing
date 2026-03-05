"use client";

import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { ClipboardList, Layers, Sparkles, Target, Star } from "lucide-react";
import Link from "next/link";
import SimpleDownloadButton from "@/components/SimpleDownloadButton";
import ACTMatrixBuilder from "@/components/act-matrix-builder/ACTMatrixBuilder";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
};

export default function ACTMatrixPage() {
  return (
    <div id="act-matrix-page" className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-4">
        <Breadcrumbs 
          items={[
            { label: "Resources", href: "/resources" },
            { label: "ACT Matrix Guide" }
          ]}
        />
      </nav>

      {/* Compact Hero */}
      <section className="pb-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200">
                <Star className="w-3.5 h-3.5" />
                <span>Values-Based Framework</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
                ACT Matrix for Schools
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl">
                A practical, student-centered tool that helps teams map values, toward moves, and away moves—then turn them into action.
              </p>
              <div className="flex flex-wrap gap-3">
                <SimpleDownloadButton 
                  resource="act-matrix"
                  fileName="ACT-Matrix-for-Schools-Guide.pdf"
                  title="ACT Matrix for Schools Guide"
                  buttonText="Download Free Guide"
                  className="bg-emerald-600 hover:bg-emerald-700 h-12 text-base font-bold"
                />
                <Button variant="outline" asChild className="h-12 px-6 text-base font-bold border-2">
                  <Link href="#tool">Jump to Tool</Link>
                </Button>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                <span className="flex items-center gap-2"><Target className="w-4 h-4 text-emerald-600" /> Values clarity</span>
                <span className="flex items-center gap-2"><Layers className="w-4 h-4 text-emerald-600" /> Toward vs away</span>
                <span className="flex items-center gap-2"><ClipboardList className="w-4 h-4 text-emerald-600" /> Action-ready</span>
              </div>
            </div>

            <motion.div 
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-lg"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="rounded-xl border border-slate-100 p-4">
                  <div className="text-xs uppercase tracking-wide text-red-500 font-bold mb-2">Away Moves</div>
                  <div className="text-xs text-slate-500">Avoiding, acting out, shutting down</div>
                </div>
                <div className="rounded-xl border border-slate-100 p-4">
                  <div className="text-xs uppercase tracking-wide text-emerald-600 font-bold mb-2">Toward Moves</div>
                  <div className="text-xs text-slate-500">Asking for help, trying, repairing</div>
                </div>
                <div className="rounded-xl border border-slate-100 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-500 font-bold mb-2">Internal Barriers</div>
                  <div className="text-xs text-slate-500">Anxiety, fear, "I can’t" thoughts</div>
                </div>
                <div className="rounded-xl border border-slate-100 p-4">
                  <div className="text-xs uppercase tracking-wide text-emerald-600 font-bold mb-2">Values</div>
                  <div className="text-xs text-slate-500">Who matters? What kind of student?</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tool Section */}
      <section id="tool" className="py-10 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <h2 className="text-2xl font-bold text-slate-900">Interactive ACT Matrix Builder</h2>
          </div>
          <p className="text-slate-600 mb-6">Fill in each quadrant, then copy or print the completed matrix for a student or team meeting.</p>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <ACTMatrixBuilder />
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: "Identify Values", desc: "Start with what matters to the student. Anchor goals in their values." },
              { title: "Name Toward Moves", desc: "List behaviors that move them toward what matters—even when it’s hard." },
              { title: "Name Away Moves", desc: "Identify behaviors that provide short-term relief but move away from values." },
            ].map((step, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="text-xs uppercase tracking-wide text-emerald-600 font-bold mb-2">Step {i + 1}</div>
                <h3 className="font-semibold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Examples */}
      <section className="py-10 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Quick Examples</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2">Math Struggle</h3>
              <p className="text-sm text-slate-600 mb-3">Value: Learning & growth</p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-red-50 p-3 rounded-lg"><strong>Away:</strong> Skipping class, distracting peers.</div>
                <div className="bg-emerald-50 p-3 rounded-lg"><strong>Toward:</strong> Asking for help, practicing problems.</div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2">Social Anxiety</h3>
              <p className="text-sm text-slate-600 mb-3">Value: Friendship & connection</p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-red-50 p-3 rounded-lg"><strong>Away:</strong> Eating alone, staying quiet.</div>
                <div className="bg-emerald-50 p-3 rounded-lg"><strong>Toward:</strong> Joining a group, offering help.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compact CTA */}
      <section className="py-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Download the Resource Pack</h2>
          <p className="text-slate-600 mb-6">Printable worksheets, implementation tips, and ready-to-use examples.</p>
          <SimpleDownloadButton 
            resource="act-matrix"
            fileName="ACT-Matrix-for-Schools-Guide.pdf"
            title="ACT Matrix Resource Pack"
            buttonText="Download Free PDF"
            className="bg-emerald-600 text-white hover:bg-emerald-700 h-12 text-base font-bold rounded-xl px-8"
          />
          <p className="text-center text-xs text-slate-500 mt-4">
            Free tool from <a href="/" className="text-emerald-700 font-medium">BehaviorSchool</a> · No login required
          </p>
        </div>
      </section>
    </div>
  );
}
