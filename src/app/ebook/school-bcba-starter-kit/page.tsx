"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Download, Mail, ArrowRight, BookOpen, FileText, Users, BarChart, ClipboardList, Brain, Calendar, Shield } from "lucide-react";

export default function SchoolBCBAStarterKitPage() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/crm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          firstName,
          role: "School BCBA",
          source: "ebook-school-bcba-starter-kit",
          segment: "tools",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to subscribe");
      }

      setIsSuccess(true);
      
      // Trigger download after short delay
      setTimeout(() => {
        window.open("/ebooks/school-bcba-starter-kit.pdf", "_blank");
      }, 500);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const kitContents = [
    {
      icon: ClipboardList,
      title: "FBA Checklist",
      description: "Step-by-step functional behavior assessment template",
    },
    {
      icon: FileText,
      title: "BIP Template",
      description: "Complete behavior intervention plan with all required sections",
    },
    {
      icon: BarChart,
      title: "ABC Data Sheet",
      description: "Ready-to-print antecedent-behavior-consequence tracking form",
    },
    {
      icon: Users,
      title: "Teacher Consultation Guide",
      description: "How to run effective 15-minute staff consultations",
    },
    {
      icon: Calendar,
      title: "First 30 Days Roadmap",
      description: "Week-by-week plan for new school BCBA positions",
    },
    {
      icon: Shield,
      title: "Ethics Quick Reference",
      description: "Common school-based ethical dilemmas and solutions",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Book Mockup */}
          <div className="flex justify-center lg:justify-end order-2 lg:order-1">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative bg-white/10 backdrop-blur rounded-3xl p-8 border border-white/20">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                  <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl p-6 text-white text-center">
                    <BookOpen className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">School BCBA</h3>
                    <p className="text-emerald-100">Starter Kit</p>
                  </div>
                  <div className="mt-6 space-y-3">
                    {["FBA Checklist", "BIP Template", "ABC Data Sheet", "30-Day Roadmap"].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                        <Check className="w-4 h-4 text-emerald-500" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="text-center lg:text-left order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-2 mb-6">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300 text-sm font-medium">Free Download</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              The School BCBA
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Starter Kit</span>
            </h1>

            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              Everything you need for your first 30 days: FBA checklist, BIP template, 
              data sheets, consultation guides, and a week-by-week roadmap.
            </p>

            {isSuccess ? (
              <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Your download is ready!</h3>
                <p className="text-emerald-200 mb-4">
                  Check your inbox for additional resources.
                </p>
                <a
                  href="/ebooks/school-bcba-starter-kit.pdf"
                  className="inline-flex items-center gap-2 bg-white text-emerald-700 px-6 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Download Again
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="flex-1 px-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 px-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Get Free Starter Kit
                    </>
                  )}
                </button>

                {error && (
                  <p className="text-red-400 text-sm text-center">{error}</p>
                )}

                <p className="text-sm text-slate-400 text-center">
                  Free forever. No spam. Unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* What's Inside */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              What's Inside the Kit
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Six essential resources every school BCBA needs, created by a 25-year veteran.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {kitContents.map((item, index) => (
              <div
                key={index}
                className="bg-slate-50 rounded-2xl p-8 border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all duration-200"
              >
                <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                  <item.icon className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Want the Complete System?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            The Transformation Program gives you everything in this kit, plus live coaching, 
            a full playbook, and a community of school BCBAs.
          </p>
          <Link
            href="/transformation-program"
            className="inline-flex items-center gap-2 bg-white text-emerald-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-50 transition-colors"
          >
            Learn About the Program
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
