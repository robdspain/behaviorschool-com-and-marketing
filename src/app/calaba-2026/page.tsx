"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle, Users, Shield, Zap, Download, FileText, BookOpen, ArrowRight, ExternalLink, Brain, ClipboardList } from "lucide-react";

export default function CalABA2026Page() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(true);
  const [downloadSubmitted, setDownloadSubmitted] = useState(false);
  const [founderSubmitted, setFounderSubmitted] = useState(false);

  const handleDownloadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          source: 'calaba-2026-download',
          role: 'BCBA',
          newsletter: subscribeNewsletter,
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
          SECTION 1: HERO — Welcome / Thank You
          ============================================ */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-cyan-500/30 text-cyan-200 px-4 py-2 rounded-full text-sm font-bold mb-6 border border-cyan-400/50">
            CalABA 2026 · Sacramento
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight text-cyan-300">
            You scanned the right QR code.
          </h1>
          <p className="text-xl sm:text-2xl text-white mb-4">
            Beyond Observable Behavior
          </p>
          <p className="text-lg text-slate-300 mb-6 max-w-2xl mx-auto">
            Measuring and Modifying the Function of Thought in School-Based Assessment
          </p>
          <p className="text-base text-slate-200 mb-8 max-w-2xl mx-auto">
            <strong className="text-white">Presenters:</strong> Rob Spain, BCBA · Cristal Lopez, BCaBA · Megan Caluza, BCBA
          </p>
          <p className="text-slate-300 text-base max-w-xl mx-auto">
            Here&apos;s everything from the presentation — references, the free tool to try right now, and the complete downloadable materials.
          </p>

          {/* Quick nav links */}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a href="#try-the-tool" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl transition-colors flex items-center gap-2">
              Try the ACT-FBA Tool
              <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#references" className="bg-slate-700 hover:bg-slate-600 text-white font-medium px-6 py-3 rounded-xl transition-colors">
              View References
            </a>
            <a href="#download" className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium px-6 py-3 rounded-xl transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download Materials
            </a>
          </div>
        </div>
      </div>

      {/* ============================================
          SECTION 2: REFERENCES
          ============================================ */}
      <div id="references" className="py-16 px-4 bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">From the Symposium</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Presentation References</h2>
            <p className="text-slate-500 text-sm">Full citation list from the CalABA 2026 symposium.</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 divide-y divide-slate-200 overflow-hidden">
            {[
              "Hayes, S. C., Strosahl, K. D., & Wilson, K. G. (2012). Acceptance and Commitment Therapy: The Process and Practice of Mindful Change (2nd ed.). Guilford Press.",
              "Brock, M. E., & Carter, E. W. (2015). Effectiveness of teachers as peer support facilitators for students with disabilities. Exceptional Children, 82(2), 143–159.",
              "Kearney, C. A. (2016). Managing School Absenteeism at Multiple Tiers. Oxford University Press.",
              "Luoma, J. B., Hayes, S. C., & Walser, R. D. (2017). Learning ACT: An Acceptance and Commitment Therapy Skills-Training Manual for Therapists (2nd ed.). New Harbinger Publications.",
              "Tarbox, J., Dixon, D. R., Sturmey, P., & Matson, J. L. (Eds.). (2014). Handbook of Early Intensive Behavioral Intervention in Autism. Springer.",
              "Dixon, M. R., Paliliunas, D., Belisle, J., Speelman, R. C., Gunnarsson, K. F., & Shaffer, J. L. (2019). The effect of brief mindfulness training on momentary impulsivity. Journal of Contextual Behavioral Science, 11, 15–20.",
              "Belisle, J., Dixon, M. R., Stanley, C. R., Munoz, B., & Daar, J. H. (2016). Teaching foundational perspective-taking skills to children with autism using the PEAK-T curriculum. Journal of Applied Behavior Analysis, 49(3), 681–686.",
              "Greco, L. A., & Hayes, S. C. (Eds.). (2008). Acceptance and Mindfulness Treatments for Children and Adolescents. New Harbinger Publications.",
              "BACB (2022). Ethics Code for Behavior Analysts. Behavior Analyst Certification Board.",
            ].map((citation, i) => (
              <div key={i} className="px-5 py-4 flex gap-4 items-start hover:bg-white transition-colors">
                <span className="text-xs font-bold text-slate-400 mt-0.5 w-5 shrink-0 text-right">{i + 1}</span>
                <p className="text-sm text-slate-700 leading-relaxed">{citation}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-3">
            <a
              href="/calaba-2026/references.pdf"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Download as PDF
            </a>
          </div>
        </div>
      </div>

      {/* ============================================
          SECTION 3: TRY THE TOOL — FEATURED CTA
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
            Values assessment, psychological flexibility analysis, defusion techniques, acceptance strategies, and committed action goals — all matched to grade level.
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
        </div>
      </div>

      {/* ============================================
          SECTION 4: DOWNLOAD MATERIALS
          ============================================ */}
      <div id="download" className="py-16 px-4 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-sm font-semibold text-cyan-300 mb-3 uppercase tracking-widest">Symposium Materials</p>
          <h2 className="text-2xl font-bold mb-3">Download the Full Slide Deck + Handouts</h2>
          <p className="text-slate-300 text-sm mb-8">Slides, assessment templates, references, and KCUSD data collection tools.</p>

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
                <div className="space-y-2 text-sm text-slate-300">
                  <p>Presentation slides (PDF)</p>
                  <p>Assessment templates (CPFQ, ACT Matrix, Values Sort)</p>
                  <p>APA References list</p>
                  <p>KCUSD data collection templates</p>
                </div>
              </div>
            )}
          </div>

          {/* Quick access links */}
          <div className="grid sm:grid-cols-4 gap-3">
            {[
              { icon: FileText, label: "64 Slides", href: "https://docs.google.com/presentation/d/1Je5rD1o5N6Tog3Kr646mm8hT3BERrb_0IXFIVoksnnk/edit" },
              { icon: BookOpen, label: "References PDF", href: "/calaba-2026/references.pdf" },
              { icon: Download, label: "ACT Assessment", href: "/calaba-2026/assessment-tools/fusion-fa" },
              { icon: Users, label: "Data Templates", href: "#download" },
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
                Get Started — $149/year
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
                Get Started — $19/month
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
                href: "/iep-goal-bank",
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
            <div className="flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
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
