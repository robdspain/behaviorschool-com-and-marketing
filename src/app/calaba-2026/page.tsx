"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle, Users, Shield, Zap, Download, FileText, BookOpen, ArrowRight, ExternalLink, Brain, ClipboardList } from "lucide-react";
import { ShareBar } from "@/components/ui/ShareBar";

export default function CalABA2026Page() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(true);
  const [downloadSubmitted, setDownloadSubmitted] = useState(false);
  const [founderSubmitted, setFounderSubmitted] = useState(false);

  const handleDownloadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/calaba-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          subscribeNewsletter,
        }),
      });
    } catch (err) {
      console.error('CRM error:', err);
    }
    setDownloadSubmitted(true);
  };

  const handleFounderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          source: 'calaba-2026-founder-interest',
          role: 'BCBA',
        }),
      });
    } catch (err) {
      console.error('CRM error:', err);
    }
    setFounderSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-bs-background">

      {/* ============================================
          SECTION 1: HERO - Welcome / Thank You
          ============================================ */}
      <section className="relative overflow-hidden bg-[#f7f3ee]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#e4b63d22,transparent_55%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f4d3f12_1px,transparent_1px),linear-gradient(to_bottom,#1f4d3f12_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1f4d3f]/20 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#1f4d3f] mb-6">
            CalABA 2026 · Sacramento
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1f4d3f] leading-tight mb-4">
            You scanned the right QR code.
          </h1>
          <p className="text-xl sm:text-2xl text-[#e4b63d] font-semibold mb-4">
            Beyond Observable Behavior
          </p>
          <p className="text-lg text-slate-600 mb-6 max-w-2xl mx-auto">
            Measuring and Modifying the Function of Thought in School-Based Assessment
          </p>
          <p className="text-base text-slate-600 mb-8 max-w-2xl mx-auto">
            <strong className="text-[#1f4d3f]">Presenters:</strong> Rob Spain, BCBA · Cristal Lopez, BCaBA · Megan Caluza, BCBA
          </p>
          <p className="text-slate-500 text-base max-w-xl mx-auto mb-10">
            Here&apos;s everything from the presentation — slides, assessment templates, and the complete downloadable materials.
          </p>

          {/* Two CTAs only */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/calaba-2026/beyond-observable-behavior.xlsx" download className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-[#1f4d3f] hover:bg-emerald-50 transition-colors">
              <Download className="w-5 h-5" />
              Download Data File
            </a>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION 2: REFERENCES
          ============================================ */}
      {/* ============================================
          DRAFT ARTICLE SECTION
          ============================================ */}
      <div className="py-16 px-4 bg-[#f0f7f4] border-b border-slate-200">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#1E3A34" }}>
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Draft Manuscript</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Beyond Observable Behavior</h2>
              <p className="text-slate-600 text-sm">Measuring and Modifying the Function of Thought in School-Based Behavioral Assessment and Intervention</p>
            </div>
          </div>
          <div className="rounded-2xl border border-[#1E3A34]/15 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-600 mb-1">
              <span className="font-semibold text-slate-800">Rob Spain, BCBA, IBA</span> &amp; <span className="font-semibold text-slate-800">Cristal Lopez, BCaBA</span>
            </p>
            <p className="text-xs text-slate-400 mb-4 italic">With contributions from Megan Caluza, BCBA · Presented CalABA 2026 · Draft - not yet peer reviewed</p>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Quasi-experimental longitudinal case series (<em>N</em> = 4, grades 5–12). Participants demonstrated a <strong>58.3% mean increase in psychological flexibility</strong> and a <strong>75% mean reduction in targeted maladaptive behaviors</strong> over 8 months using the AIM ACT framework. RCI criteria met by 100% of participants at a median of 5 months.
            </p>

          </div>
        </div>
      </div>

      
      {/* ============================================
          SECTION 3: TRY THE TOOL - FEATURED CTA
          ============================================ */}
      <div id="try-the-tool" className="py-20 px-4 bg-gradient-to-br from-emerald-900 to-emerald-800 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-300 mb-3">Free Tool from the Presentation</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-5">
            Try the ACT-Informed FBA Tool
          </h2>
          <p className="text-emerald-100 text-lg mb-3 max-w-xl mx-auto">
            The tool from the presentation. Free. Takes 10 minutes. Generates a complete, printable BIP with ACT-informed strategies.
          </p>
          <p className="text-emerald-200 text-sm mb-10 max-w-xl mx-auto">
            Values assessment, psychological flexibility analysis, defusion techniques, acceptance strategies, and committed action goals - all matched to grade level.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/act-fba-bip"
              className="inline-flex items-center gap-2 bg-white text-emerald-900 font-bold px-8 py-4 rounded-xl hover:bg-emerald-50 transition-colors text-lg"
            >
              Start the Tool
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/act-fba-bip?demo=true"
              className="inline-flex items-center gap-2 text-emerald-200 hover:text-white font-medium px-6 py-4 transition-colors text-sm"
            >
              Or load a sample case and see the output in 30 seconds →
            </Link>
          </div>

          <div className="mt-10 grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { label: "100% Free", sub: "No account required" },
              { label: "10 Minutes", sub: "Full FBA + BIP output" },
              { label: "Printable", sub: "Copy-ready for IEP teams" },
            ].map((item) => (
              <div key={item.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <p className="font-bold text-white text-base">{item.label}</p>
                <p className="text-emerald-200 text-xs mt-1">{item.sub}</p>
              </div>
            ))}
          </div>

          {/* Share */}
          <div className="mt-8 max-w-2xl mx-auto">
            <ShareBar
              title="Free ACT-Informed FBA Tool - CalABA 2026"
              text="Attended Rob Spain's CalABA talk on ACT-Informed FBAs? The free tool and all presentation references are here:"
              url="https://behaviorschool.com/calaba-2026"
              hashtags={["CalABA", "BCBA", "SchoolBCBA"]}
            />
          </div>
        </div>
      </div>

      {/* ============================================
          SECTION 4: DOWNLOAD MATERIALS
          ============================================ */}
      <div id="download" className="py-16 px-4 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-sm font-semibold text-cyan-300 mb-3 uppercase tracking-widest">Symposium Materials</p>
          <h2 className="text-2xl font-bold mb-3">Download the Data File</h2>
          <p className="text-slate-300 text-sm mb-8">The data collection spreadsheet from the presentation.</p>

          <div className="bg-slate-800 border-2 border-cyan-500/40 rounded-2xl p-8 text-left shadow-2xl mb-8">
            {!downloadSubmitted ? (
              <form onSubmit={handleDownloadSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-500 bg-slate-900 text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-500 bg-slate-900 text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none"
                />
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={subscribeNewsletter}
                    onChange={(e) => setSubscribeNewsletter(e.target.checked)}
                    className="w-5 h-5 rounded border-cyan-400 bg-slate-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0"
                  />
                  <span className="text-sm text-slate-200 group-hover:text-white transition-colors">
                    Subscribe to the Behavior School newsletter for tips, tools, and updates
                  </span>
                </label>
                <button
                  type="submit"
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Get Free Materials
                </button>
              </form>
            ) : (
              <div className="text-center py-6">
                <CheckCircle className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
                <p className="text-lg font-bold text-white mb-2">Check your email!</p>
                <p className="text-slate-200 mb-4">Your download link is on its way.</p>
                <a href="/calaba-2026/beyond-observable-behavior.xlsx" download
                  className="inline-flex items-center gap-2 bg-cyan-500 text-slate-900 font-bold px-6 py-3 rounded-xl mt-2">
                  <Download className="w-4 h-4" /> Download Now
                </a>
              </div>
            )}
          </div>

          {/* Quick access links */}
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { icon: FileText, label: "64 Slides", href: "https://docs.google.com/presentation/d/1Je5rD1o5N6Tog3Kr646mm8hT3BERrb_0IXFIVoksnnk/edit" },
              { icon: Download, label: "ACT Assessment", href: "/calaba-2026/assessment-tools/fusion-fa" },
              { icon: Download, label: "Data File", href: "/calaba-2026/beyond-observable-behavior.xlsx", download: true },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="bg-slate-700/80 hover:bg-cyan-600/30 border border-slate-600 rounded-xl p-3 text-center transition-all hover:border-cyan-400 group"
              >
                <item.icon className="w-5 h-5 mx-auto mb-1.5 text-cyan-300 group-hover:text-cyan-200" />
                <span className="text-xs font-semibold text-white flex items-center justify-center gap-1">
                  {item.label}
                  {item.href.startsWith("http") && <ExternalLink className="w-3 h-3 opacity-70" />}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================
          SECTION 5: TRANSFORMATION PROGRAM CTA
          ============================================ */}
      <div className="py-20 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-4 py-2 rounded-full text-sm font-bold mb-6 border border-amber-500/30">
              CalABA 2026 Exclusive · Limited to First 100
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Become a <span className="text-amber-400">Founding Member</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Lock in 40% off forever. Be one of the first 100 school BCBAs to shape the future of these tools.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-12">
            {/* Annual Plan */}
            <div className="bg-white border-4 border-amber-400 rounded-2xl p-8 relative text-slate-900">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 text-sm font-bold px-4 py-1 rounded-full whitespace-nowrap">
                BEST VALUE
              </div>
              <div className="text-center mb-6 mt-2">
                <h3 className="text-xl font-bold mb-2">Annual Plan</h3>
                <div className="mb-1">
                  <span className="text-slate-400 line-through text-lg">$249/year</span>
                </div>
                <div className="text-4xl font-bold text-emerald-600 mb-1">$149</div>
                <div className="text-slate-500 text-sm">per year</div>
              </div>
              <div className="space-y-3 mb-6">
                {["40% off forever", "All tools included", "Priority feature requests", "Founding Member Discord"].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    {f}
                  </div>
                ))}
              </div>
              <Link
                href="https://plan.behaviorschool.com/signup?plan=founding-annual"
                className="block w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold py-4 rounded-xl text-center transition-colors"
              >
                Get Started - $149/year
              </Link>
            </div>

            {/* Monthly Plan */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 text-white">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">Monthly Plan</h3>
                <div className="mb-1">
                  <span className="text-slate-500 line-through text-lg">$25/month</span>
                </div>
                <div className="text-4xl font-bold text-white mb-1">$19</div>
                <div className="text-slate-400 text-sm">per month · cancel anytime</div>
              </div>
              <div className="space-y-3 mb-6">
                {["24% off forever", "All tools included", "Cancel anytime", "Rate locked forever"].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    {f}
                  </div>
                ))}
              </div>
              <Link
                href="https://plan.behaviorschool.com/signup?plan=founding-monthly"
                className="block w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 rounded-xl text-center transition-colors border border-slate-600"
              >
                Get Started - $19/month
              </Link>
            </div>
          </div>

          {/* Not Ready CTA */}
          <div className="text-center">
            <p className="text-slate-400 mb-4">Not ready to commit? Get notified when we launch new features:</p>
            {!founderSubmitted ? (
              <form onSubmit={handleFounderSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 px-4 py-3 rounded-lg text-slate-900"
                />
                <button
                  type="submit"
                  className="bg-slate-700 hover:bg-slate-600 text-white font-medium px-6 py-3 rounded-lg whitespace-nowrap"
                >
                  Keep Me Updated
                </button>
              </form>
            ) : (
              <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 max-w-md mx-auto">
                <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <p className="text-emerald-300">You&apos;re on the list!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================================
          TRANSFORMATION PROGRAM CTA
          ============================================ */}
      <div className="py-14 px-4 bg-[#1f4d3f] text-white text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-[#e4b63d] mb-3">6-Week Cohort · Starting March 26</p>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">The School BCBA Transformation Program</h2>
          <p className="text-emerald-100 text-base mb-8 max-w-xl mx-auto">
            Implement the AIM ACT framework systematically with your team. Six sessions, Thursday evenings, maximum 20 participants.
          </p>
          <Link
            href="/transformation-program"
            className="inline-flex items-center gap-2 bg-[#e4b63d] text-[#1f4d3f] font-bold px-8 py-4 rounded-xl hover:bg-amber-400 transition-colors text-base"
          >
            Learn More
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* ============================================
          SECTION 6: OTHER TOOLS
          ============================================ */}
      <div className="py-16 px-4 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-xl font-bold text-slate-700 mb-2">Other Free Tools</h2>
            <p className="text-slate-500 text-sm">More tools for school-based behavior teams</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                Icon: FileText,
                title: "FBA-to-BIP",
                description: "Standard FBA to behavior intervention plan generator",
                href: "/fba-to-bip",
              },
              {
                Icon: ClipboardList,
                title: "IEP Goal Writer",
                description: "Measurable, legally defensible IEP goals",
                href: "/iep-goal-writer",
              },
              {
                Icon: BookOpen,
                title: "IEP Goal Bank",
                description: "500+ evidence-based goals by domain and grade",
                href: "/iep-goals",
              },
              {
                Icon: Brain,
                title: "ACT-Informed FBA + BIP",
                description: "The tool from the presentation",
                href: "/act-fba-bip",
              },
            ].map((tool) => (
              <Link
                key={tool.title}
                href={tool.href}
                className="bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-xl p-5 text-center transition-all group"
              >
                <div className="flex justify-center mb-3">
                  <tool.Icon className="w-7 h-7 text-emerald-600 group-hover:text-emerald-700" />
                </div>
                <h4 className="font-bold text-slate-900 mb-1 text-sm group-hover:text-emerald-700">{tool.title}</h4>
                <p className="text-xs text-slate-500">{tool.description}</p>
              </Link>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <div className="flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium">
              <Shield className="w-4 h-4" />
              FERPA Compliant
            </div>
            <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              Built by School BCBAs
            </div>
            <div className="flex items-center gap-2 bg-green-100 text-[#123628] px-4 py-2 rounded-full text-sm font-medium">
              <Zap className="w-4 h-4" />
              Free Forever
            </div>
          </div>
        </div>
      </div>

      {/* ============================================
          ABOUT THE PRESENTERS
          ============================================ */}
      <div className="py-14 px-4 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-center mb-8 text-slate-900">About the Presenters</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                name: "Rob Spain, BCBA, IBA",
                role: "Kings Canyon USD · Behavior School",
                desc: "Behavior Team Lead, Fresno County BCBA Collaborative Coordinator",
              },
              {
                name: "Cristal Lopez, BCaBA",
                role: "Kings Canyon USD",
                desc: "Behavior Team Supervisor - Specialized and ACT Informed Interventions, PFA/SBT",
              },
              {
                name: "Megan Caluza, BCBA",
                role: "Berkeley USD",
                desc: "Implementation specialist and staff training coordinator",
              },
            ].map((person) => (
              <div key={person.name} className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-xl font-bold text-emerald-700">
                    {person.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{person.name}</h3>
                <p className="text-xs text-emerald-600 mb-1">{person.role}</p>
                <p className="text-xs text-slate-600">{person.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 py-8 px-4 text-center bg-white">
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} Behavior School · Questions? <a href="mailto:rob@behaviorschool.com" className="text-emerald-600 hover:underline">rob@behaviorschool.com</a>
        </p>
      </div>
    </div>
  );
}
