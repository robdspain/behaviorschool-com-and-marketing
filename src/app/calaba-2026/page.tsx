"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { CheckCircle, Clock, Users, Shield, Zap, Star, Download, FileText, BookOpen, ArrowRight, ExternalLink } from "lucide-react";

export default function CalABA2026Page() {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(true);
  const [downloadSubmitted, setDownloadSubmitted] = useState(false);
  const [founderSubmitted, setFounderSubmitted] = useState(false);

  useEffect(() => {
    const targetDate = new Date("2026-03-07T23:59:59-08:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setTimeRemaining({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
          SECTION 1: DOWNLOAD SYMPOSIUM MATERIALS
          Styled to match slide deck: dark slate/blue theme
          ============================================ */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-bold mb-6 border border-blue-500/30">
            📍 CalABA 2026 · Sacramento
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight text-blue-400">
            Beyond Observable Behavior
          </h1>
          <h2 className="text-xl sm:text-2xl text-slate-300 mb-6">
            Measuring and Modifying the Function of Thought in School-Based Assessment
          </h2>

          <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
            <strong className="text-slate-200">Presenters:</strong> Rob Spain, BCBA · Cristal Lopez, BCaBA · Megan Caluza, BCBA
          </p>

          {/* Download Materials Box */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-xl mx-auto text-left shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Download className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Download Symposium Materials</h3>
                <p className="text-sm text-slate-400">Slides, handouts, templates, and references</p>
              </div>
            </div>

            {!downloadSubmitted ? (
              <form onSubmit={handleDownloadSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                />
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={subscribeNewsletter}
                    onChange={(e) => setSubscribeNewsletter(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-500 bg-slate-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                  />
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                    Subscribe to the Behavior School newsletter for tips, tools, and updates
                  </span>
                </label>
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Get Free Materials
                </button>
              </form>
            ) : (
              <div className="text-center py-6">
                <CheckCircle className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                <p className="text-lg font-bold text-white mb-2">Check your email!</p>
                <p className="text-slate-400 mb-4">Your download link is on its way.</p>
                <div className="space-y-2 text-sm text-slate-400">
                  <p>📋 Presentation slides (PDF)</p>
                  <p>📄 Assessment templates (CPFQ, ACT Matrix, Values Sort)</p>
                  <p>📚 APA References list</p>
                  <p>🔧 KCUSD data collection templates</p>
                </div>
              </div>
            )}
          </div>

          {/* What's Included - Clickable Links */}
          <div className="mt-12 grid sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { icon: FileText, label: "64 Slides", href: "https://docs.google.com/presentation/d/1Je5rD1o5N6Tog3Kr646mm8hT3BERrb_0IXFIVoksnnk/edit" },
              { icon: BookOpen, label: "20+ References", href: "/calaba-2026/references.pdf" },
              { icon: Download, label: "Assessment Tools", href: "#assessment-tools" },
              { icon: Users, label: "Data Templates", href: "#data-templates" },
            ].map((item) => (
              <a 
                key={item.label} 
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="bg-slate-700/50 hover:bg-slate-700 border border-slate-600 backdrop-blur-sm rounded-xl p-4 text-center transition-all hover:scale-105 hover:border-blue-500/50 group cursor-pointer"
              >
                <item.icon className="w-6 h-6 mx-auto mb-2 text-blue-400 group-hover:text-blue-300" />
                <span className="text-sm font-medium flex items-center justify-center gap-1">
                  {item.label}
                  {item.href.startsWith("http") && <ExternalLink className="w-3 h-3 opacity-50" />}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================
          SECTION 2: WHAT IS BEHAVIORSCHOOL PRO?
          ============================================ */}
      <div className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              What is BehaviorSchool Pro?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              AI-powered tools built specifically for school-based BCBAs, school psychologists, and behavior teams. 
              Save hours on documentation while producing better outcomes.
            </p>
          </div>

          {/* The Problem / Solution */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h3 className="font-bold text-red-800 mb-4 text-lg">😫 The Problem</h3>
              <ul className="space-y-3 text-red-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">✕</span>
                  FBAs take 8+ hours to write
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">✕</span>
                  IEP goals are vague and unmeasurable
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">✕</span>
                  BIPs don't connect to assessment data
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">✕</span>
                  Drowning in paperwork, not helping students
                </li>
              </ul>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
              <h3 className="font-bold text-emerald-800 mb-4 text-lg">✅ The Solution</h3>
              <ul className="space-y-3 text-emerald-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  Generate FBAs from observation data in minutes
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  AI writes measurable, SMART IEP goals
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  BIPs auto-link to your FBA findings
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  FERPA compliant — student data never stored
                </li>
              </ul>
            </div>
          </div>

          {/* Core Tools */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "📋",
                title: "FBA-to-BIP",
                description: "Upload observation data → get comprehensive assessment and intervention plan",
              },
              {
                icon: "🎯",
                title: "IEP Goal Writer",
                description: "Describe the student → get measurable, legally defensible goals",
              },
              {
                icon: "📚",
                title: "Goal Bank",
                description: "500+ evidence-based goals searchable by domain and grade",
              },
              {
                icon: "🧠",
                title: "ACT Module",
                description: "ACT Matrix, values assessment, and psychological flexibility tools",
              },
            ].map((tool) => (
              <div key={tool.title} className="bg-slate-50 rounded-xl p-5 text-center">
                <div className="text-3xl mb-3">{tool.icon}</div>
                <h4 className="font-bold text-slate-900 mb-2">{tool.title}</h4>
                <p className="text-sm text-slate-600">{tool.description}</p>
              </div>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-4">
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
              AI-Powered
            </div>
          </div>
        </div>
      </div>

      {/* ============================================
          SECTION 3: FOUNDING MEMBER OFFER
          ============================================ */}
      <div className="py-20 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-4 py-2 rounded-full text-sm font-bold mb-6 border border-amber-500/30">
              🎓 CalABA 2026 Exclusive · Limited to First 100
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Become a <span className="text-amber-400">Founding Member</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Lock in 40% off forever. Be one of the first 100 school BCBAs to shape the future of these tools.
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-10 max-w-2xl mx-auto">
            <p className="text-sm text-slate-400 mb-4 text-center font-medium">Founding Member Rate Ends:</p>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Days", value: timeRemaining.days },
                { label: "Hours", value: timeRemaining.hours },
                { label: "Minutes", value: timeRemaining.minutes },
                { label: "Seconds", value: timeRemaining.seconds },
              ].map((unit) => (
                <div key={unit.label} className="bg-slate-800 rounded-lg p-4 text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-amber-400 mb-1">
                    {String(unit.value).padStart(2, "0")}
                  </div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide">
                    {unit.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-12">
            {/* Annual Plan */}
            <div className="bg-white border-4 border-amber-400 rounded-2xl p-8 relative text-slate-900">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 text-sm font-bold px-4 py-1 rounded-full whitespace-nowrap">
                ⭐ BEST VALUE
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
                <p className="text-emerald-300">You're on the list!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================================
          SECTION 4: ABOUT THE PRESENTERS
          ============================================ */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8 text-slate-900">About the Presenters</h2>
          
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
                desc: "Behavior Case Manager specializing in ACT-informed interventions",
              },
              {
                name: "Megan Caluza, BCBA",
                role: "Berkeley USD",
                desc: "Implementation specialist and staff training coordinator",
              },
            ].map((person) => (
              <div key={person.name} className="text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-emerald-700">
                    {person.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900">{person.name}</h3>
                <p className="text-sm text-emerald-600 mb-2">{person.role}</p>
                <p className="text-sm text-slate-600">{person.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 py-8 px-4 text-center bg-slate-50">
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} Behavior School · Questions? <a href="mailto:rob@behaviorschool.com" className="text-emerald-600 hover:underline">rob@behaviorschool.com</a>
        </p>
      </div>
    </div>
  );
}
