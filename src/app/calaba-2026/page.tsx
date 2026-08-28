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
                    Subscribe to The Weekly Research Brief for open research, clear summaries, and practical next steps
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
          SECTION 5: BEHAVIORSCHOOL PRO (INVITE ONLY)
          ============================================ */}
      <div className="py-20 px-4 bg-gradient-to-br from-[#123628] via-[#1f4d3f] to-[#123628] text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#e4b63d]/20 text-[#e4b63d] px-4 py-2 rounded-full text-sm font-bold mb-6 border border-[#e4b63d]/30">
              CalABA 2026 · Invite only
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              BehaviorSchool Pro is <span className="text-[#e4b63d]">not open for public signup</span>
            </h2>
            <p className="text-xl text-white/75 max-w-2xl mx-auto">
              The commercial FBA/BIP workspace is in development. Public account creation is not available today.
              Request invite-only access or use the free school-practice tools that are live now.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-12">
            <div className="rounded-2xl border border-white/15 bg-white/5 p-8">
              <h3 className="text-xl font-bold mb-2">Invite-only workspace</h3>
              <p className="text-sm text-white/70 mb-6">
                Planned areas include FBA-to-BIP drafting, IEP goal generation, and student plan exports for school teams.
              </p>
              <Link
                href="/pro/waitlist"
                className="block w-full bg-[#e4b63d] hover:bg-[#d7aa32] text-[#123628] font-bold py-4 rounded-xl text-center transition-colors"
              >
                Request invite-only access
              </Link>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/5 p-8">
              <h3 className="text-xl font-bold mb-2">Free tools available now</h3>
              <p className="text-sm text-white/70 mb-6">
                Use the Goal Writing System, FBA helpers, and other school-practice tools without an invitation.
              </p>
              <Link
                href="/free-tools"
                className="block w-full border border-white/25 hover:bg-white/10 text-white font-bold py-4 rounded-xl text-center transition-colors"
              >
                Explore free tools
              </Link>
            </div>
          </div>

          {/* Not Ready CTA */}
          <div className="text-center">
            <p className="text-white/60 mb-4">Want a note when invite-only access expands?</p>
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
          © {new Date().getFullYear()} Behavior School · Questions? <a href="/contact" className="text-emerald-600 hover:underline">Contact Behavior School</a>
        </p>
      </div>
    </div>
  );
}
