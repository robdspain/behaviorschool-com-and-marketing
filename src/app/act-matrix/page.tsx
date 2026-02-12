"use client";

import { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { CheckCircle, Target, Users, BookOpen, ArrowRight, Download, Star } from "lucide-react";
import Link from "next/link";
import SimpleDownloadButton from "@/components/SimpleDownloadButton";
import { ScrollNav } from "@/components/ui/scroll-nav";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

export default function ACTMatrixPage() {
  return (
    <div id="act-matrix-page" className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
        <Breadcrumbs 
          items={[
            { label: "Resources", href: "/resources" },
            { label: "ACT Matrix Guide" }
          ]}
        />
      </nav>

      <ScrollNav 
        items={[
          { id: "what-is-it", label: "What is it?" },
          { id: "how-to-use", label: "How to Use" },
          { id: "examples", label: "Examples" },
          { id: "download", label: "Download PDF" },
        ]}
      />
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-bold border border-emerald-200">
                <Star className="w-4 h-4 fill-emerald-600" />
                <span>Values-Based Framework</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">
                ACT Matrix <br />
                <span className="text-emerald-600">for Schools</span>
              </h1>
              
              <p className="text-xl text-slate-600 max-w-2xl leading-relaxed">
                The complete guide with free PDF download, examples, and step-by-step implementation for school-based behavior analysts.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <SimpleDownloadButton 
                  resource="act-matrix"
                  fileName="ACT-Matrix-for-Schools-Guide.pdf"
                  title="ACT Matrix for Schools Guide"
                  buttonText="Download Free Guide"
                  className="bg-emerald-600 hover:bg-emerald-700 h-14 text-lg font-bold w-full sm:w-auto"
                />
                <Button variant="outline" asChild className="h-14 px-8 text-lg font-bold border-2">
                  <Link href="#examples">See Examples</Link>
                </Button>
              </div>
            </div>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-2xl relative z-10 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full -mr-16 -mt-16" />
                <div className="grid grid-cols-2 gap-8 text-center relative aspect-square">
                  <div className="absolute inset-x-0 top-1/2 border-t-2 border-slate-100 z-10"></div>
                  <div className="absolute inset-y-0 left-1/2 border-l-2 border-slate-100 z-10"></div>
                  
                  <div className="flex flex-col justify-end pb-4 pr-4">
                    <div className="text-red-500 font-bold uppercase tracking-wider text-[10px] mb-2">Away Moves</div>
                    <div className="text-slate-400 text-xs italic">Avoiding • Acting Out</div>
                  </div>
                  
                  <div className="flex flex-col justify-end pb-4 pl-4">
                    <div className="text-emerald-600 font-bold uppercase tracking-wider text-[10px] mb-2">Toward Moves</div>
                    <div className="text-slate-400 text-xs italic">Asking for help • Trying</div>
                  </div>
                  
                  <div className="flex flex-col justify-start pt-4 pr-4">
                    <div className="text-slate-400 text-xs italic">"I can't" • Anxiety</div>
                    <div className="text-red-500 font-bold uppercase tracking-wider text-[10px] mt-2">Internal Barriers</div>
                  </div>
                  
                  <div className="flex flex-col justify-start pt-4 pl-4">
                    <div className="text-slate-400 text-xs italic">Who matters? • Goals</div>
                    <div className="text-emerald-600 font-bold uppercase tracking-wider text-[10px] mt-2">Values</div>
                  </div>
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                  <div className="bg-yellow-50 border-4 border-yellow-400 rounded-full w-20 h-20 flex items-center justify-center shadow-lg">
                    <span className="text-yellow-800 font-black text-[10px] uppercase tracking-tighter">Student<br/>Values</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What is it section */}
      <section id="what-is-it" className="py-24 scroll-mt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">What is the ACT Matrix?</h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              A simple visual framework from Acceptance and Commitment Training (ACT) that helps students organize their experiences around what matters most.
            </p>
          </motion.div>
          
          <div className="prose prose-lg max-w-none text-slate-700">
            <p>
              Unlike traditional behavior interventions that focus primarily on reducing problem behaviors, the ACT Matrix builds **psychological flexibility**—the ability to stay present with difficult experiences while choosing actions based on personal values.
            </p>
            <div className="grid md:grid-cols-2 gap-8 my-12">
              <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100">
                <h3 className="text-emerald-900 font-bold mt-0">Why it works</h3>
                <ul className="text-emerald-800 text-sm">
                  <li>Builds intrinsic motivation</li>
                  <li>Increases student agency</li>
                  <li>Improves emotional regulation</li>
                  <li>Practical for all grade levels</li>
                </ul>
              </div>
              <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
                <h3 className="text-blue-900 font-bold mt-0">School Usage</h3>
                <ul className="text-blue-800 text-sm">
                  <li>Individual behavior plans</li>
                  <li>Small group SEL</li>
                  <li>Crisis de-escalation</li>
                  <li>Teacher consultation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to use */}
      <section id="how-to-use" className="py-24 bg-slate-50 scroll-mt-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">How to Use the Matrix</h2>
            <p className="text-lg text-slate-600">A step-by-step process for school implementation</p>
          </div>
          
          <div className="grid gap-6">
            {[
              { title: "Values Exploration", desc: "Help students identify what truly matters to them (e.g., being helpful, learning)." },
              { title: "Identify Toward Moves", desc: "Explore actions that move students toward their values, even when challenging." },
              { title: "Recognize Away Moves", desc: "Identify behaviors that provide short-term relief but don't align with values." },
              { title: "Map Internal Experiences", desc: "Explore the thoughts and feelings that show up when moving toward or away." },
              { title: "Practice Daily Choices", desc: "Use the matrix as a guide for daily decisions in difficult moments." }
            ].map((step, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 flex gap-6 items-center shadow-sm border border-slate-100">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl flex-shrink-0">{i+1}</div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                  <p className="text-slate-600">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Examples */}
      <section id="examples" className="py-24 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Real School Examples</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
              <h3 className="text-2xl font-bold mb-4">The "Math Struggle"</h3>
              <p className="text-slate-600 mb-6 font-medium">Value: Learning & Growing</p>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-red-50 p-4 rounded-xl"><strong>Away:</strong> Skipping class, distracting others.</div>
                <div className="bg-emerald-50 p-4 rounded-xl"><strong>Toward:</strong> Asking for help, practicing problems.</div>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
              <h3 className="text-2xl font-bold mb-4">Social Anxiety</h3>
              <p className="text-slate-600 mb-6 font-medium">Value: Friendship & Connection</p>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-red-50 p-4 rounded-xl"><strong>Away:</strong> Eating lunch alone, staying quiet.</div>
                <div className="bg-emerald-50 p-4 rounded-xl"><strong>Toward:</strong> Joining a group, offering help.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-slate-600">Common questions about using the ACT Matrix in schools</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-3">What is the ACT Matrix?</h3>
              <p className="text-slate-600">
                The ACT Matrix is a visual framework from Acceptance and Commitment Therapy that helps students identify their values and distinguish between values-aligned actions and avoidance behaviors.
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-3">Who can use this tool?</h3>
              <p className="text-slate-600">
                School counselors, BCBAs, special educators, social workers, and school psychologists working with students on goal setting, behavior change, and values exploration.
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-3">How do I introduce the Matrix to students?</h3>
              <p className="text-slate-600">
                Start with identifying a value that matters to them, then help them notice when their actions move toward or away from that value. Use simple examples from their daily life at school.
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-3">Is the download free?</h3>
              <p className="text-slate-600">
                Yes. The ACT Matrix guide, worksheets, and implementation materials are completely free for educators. No registration required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="download" className="py-24 bg-slate-900 text-white scroll-mt-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">Download the Resource Pack</h2>
          <p className="text-xl text-slate-300 mb-12 leading-relaxed">
            Get instant access to printable worksheets, implementation guides, and real school examples.
          </p>
          <SimpleDownloadButton 
            resource="act-matrix"
            fileName="ACT-Matrix-for-Schools-Guide.pdf"
            title="ACT Matrix Resource Pack"
            buttonText="Download Free PDF"
            className="bg-emerald-600 text-white hover:bg-emerald-700 h-16 text-xl font-bold rounded-2xl px-10 shadow-2xl w-full max-w-md mx-auto"
          />
        </div>
      </section>
    </div>
  );
}