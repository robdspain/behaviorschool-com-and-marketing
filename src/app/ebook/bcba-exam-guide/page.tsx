"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Download, ArrowRight, BookOpen, Target, Clock, Award } from "lucide-react";
import { behaviorStudyToolsAppHref } from "@/lib/behavior-study-tools/links";

const guidePdfPath = "/ebooks/bcba-exam-guide-2026.pdf";
const freePracticeHref = behaviorStudyToolsAppHref("/free-practice/", {
  intent: "bcba_exam_guide_ebook",
  utm_content: "ebook_bcba_exam_guide_page",
});

export default function BCBAExamGuidePage() {
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
      // /api/crm requires `name`; sending only `firstName` returns 400 and the download never unlocks.
      const response = await fetch("/api/crm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: firstName.trim(),
          email: email.trim(),
          role: "BCBA Candidate",
          source: "ebook-bcba-exam-guide",
          tags: ["ebook-bcba-exam-guide"],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to subscribe");
      }

      setIsSuccess(true);

      setTimeout(() => {
        window.open(guidePdfPath, "_blank");
      }, 500);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Book Mockup */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl blur-2xl opacity-20"></div>
              <Image
                src="/ebooks/bcba-guide-mockup.png"
                alt="The 2026 BCBA Exam Survival Guide"
                width={500}
                height={375}
                className="relative z-10 drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          {/* Right: Form */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-2 mb-6">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-300 text-sm font-medium">Free Download</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              The 2026 BCBA Exam
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Survival Guide
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-4">
              A free, structured plan for the BCBA exam: what to study, in what order,
              and how to check your readiness before test day.
            </p>
            <p className="text-sm text-slate-400 mb-8">
              Written to the BACB&apos;s 6th Edition Test Content Outline, the outline in effect for
              every BCBA exam since January 2025: all nine domains with task counts, question counts,
              and exam weights, plus a 12-week schedule that assigns each domain to a week.
            </p>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: Target, text: "6th Edition Domain Weights" },
                { icon: Clock, text: "12-Week Study Schedule" },
                { icon: BookOpen, text: "Test-Taking Strategies" },
                { icon: Award, text: "30-Day Action Plan" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-300">
                  <item.icon className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                  <span className="text-sm">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Form or Success State */}
            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    autoComplete="given-name"
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Get Your Free Guide
                    </>
                  )}
                </button>

                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}
                
                <p className="text-xs text-slate-400">
                  We respect your privacy. Unsubscribe anytime.
                </p>
              </form>
            ) : (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">You&apos;re all set!</h3>
                <p className="text-slate-300 mb-4">
                  Your download should start automatically. If not, click below.
                </p>
                <a
                  href={guidePdfPath}
                  download
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-lg transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Download Now
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* What's Inside Section */}
      <div className="bg-slate-900/50 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            What&apos;s Inside the Guide
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                chapter: "Chapter 1",
                title: "The 6th Edition Test Content Outline",
                description: "All nine domains with the BACB's task counts, question counts, and exam weights, which domains pay back fastest per task, and what changed from the 5th Edition."
              },
              {
                chapter: "Chapter 2",
                title: "A 12-Week Schedule by Domain",
                description: "Each domain assigned to a week, two full-length timed mocks, a daily structure, and the four readiness signals to track."
              },
              {
                chapter: "Chapter 3",
                title: "Concepts the Exam Keeps Coming Back To",
                description: "Reinforcement and punishment, functions of behavior and assessment methods, an ethics decision sequence, measurement, and supervision."
              },
              {
                chapter: "Chapter 4",
                title: "Test-Taking Strategy",
                description: "Pacing 185 questions in four hours, question analysis, qualifier words, and managing anxiety in the room."
              },
              {
                chapter: "Chapter 5",
                title: "Mistakes to Avoid",
                description: "Study mistakes and exam-day mistakes, each paired with what to do instead."
              },
              {
                chapter: "Chapter 6",
                title: "Resources and a 30-Day Action Plan",
                description: "Official BACB documents, two textbooks, and a checklist for your first 30 days."
              },
            ].map((chapter, i) => (
              <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-colors">
                <span className="text-cyan-400 text-sm font-medium">{chapter.chapter}</span>
                <h3 className="text-xl font-semibold text-white mt-1 mb-2">{chapter.title}</h3>
                <p className="text-slate-400">{chapter.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            The guide tells you what to study. Practice tells you where you stand.
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Behavior Study Tools has free 6th Edition-aligned practice questions with domain-level results
            and rationales, so the first step of the 30-day plan can happen today.
          </p>
          <Link
            href={freePracticeHref}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
          >
            Start free BCBA practice
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Behavior School. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
