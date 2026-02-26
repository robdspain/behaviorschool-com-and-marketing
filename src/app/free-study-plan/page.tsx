"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen, ClipboardList } from "lucide-react";

export default function FreeStudyPlanPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"bcba" | "rbt">("bcba");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/lead-magnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), role }),
      });

      const data = await res.json();
      if (!res.ok || data?.error) {
        throw new Error(data?.error || "Something went wrong. Please try again.");
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f2ea] text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#123628] via-[#1f4d3f] to-[#2c6b57] text-white">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#e4b63d26,transparent_55%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff14_1px,transparent_1px),linear-gradient(to_bottom,#ffffff14_1px,transparent_1px)] bg-[size:32px_32px]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 pt-28 sm:pt-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-[#e4b63d] bg-white/10 px-4 py-2 text-sm font-semibold text-[#e4b63d]"
          >
            <motion.span
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2.2, repeat: Infinity }}
              className="inline-flex h-2.5 w-2.5 rounded-full bg-[#e4b63d]"
            />
            Free · No signup required
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight"
          >
            Free Practice Exam
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-lg sm:text-xl text-emerald-50/90 max-w-xl mx-auto"
          >
            Choose your path below. No signup required.
          </motion.p>
        </div>
      </section>

      {/* Exam Cards */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid gap-5 sm:grid-cols-2">
          {/* RBT Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-3xl shadow-xl border border-emerald-100/60 p-8 flex flex-col"
          >
            <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-[#e4b63d]/15 mb-5">
              <ClipboardList className="h-7 w-7 text-[#b8861a]" />
            </div>
            <h2 className="text-2xl font-bold text-[#1f4d3f]">I&apos;m studying for the RBT exam</h2>
            <p className="mt-2 text-slate-600 flex-1">40 free practice questions, no account needed.</p>
            <Link
              href="https://schoolrbt.com"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#e4b63d] px-6 py-3.5 text-base font-bold text-[#1f4d3f] hover:bg-[#d4a82d] transition"
            >
              Take the RBT Practice Exam
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          {/* BCBA Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-3xl shadow-xl border border-emerald-100/60 p-8 flex flex-col"
          >
            <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-[#1f4d3f]/10 mb-5">
              <BookOpen className="h-7 w-7 text-[#1f4d3f]" />
            </div>
            <h2 className="text-2xl font-bold text-[#1f4d3f]">I&apos;m studying for the BCBA exam</h2>
            <p className="mt-2 text-slate-600 flex-1">40 free practice questions, no account needed.</p>
            <Link
              href="https://study.behaviorschool.com"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#1f4d3f] px-6 py-3.5 text-base font-bold text-white hover:bg-[#153528] transition"
            >
              Take the BCBA Practice Exam
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-10 flex items-center gap-4">
        <div className="flex-1 border-t border-slate-200" />
        <span className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Also available</span>
        <div className="flex-1 border-t border-slate-200" />
      </div>

      {/* Study Plan (secondary) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-10">
          <div className="max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1f4d3f]">Want a personalized study plan?</h2>
            <p className="mt-2 text-slate-600">
              Enter your info and we&apos;ll send a free 7-day BCBA or RBT study schedule straight to your inbox.
            </p>
          </div>

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="mt-8 max-w-md space-y-4">
              {/* Role toggle */}
              <div className="flex gap-3">
                {(["rbt", "bcba"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex-1 rounded-xl border-2 py-3 text-center font-semibold transition ${
                      role === r
                        ? "border-[#e4b63d] bg-[#fff7dd] text-[#1f4d3f]"
                        : "border-slate-200 text-slate-600 hover:border-[#e4b63d]/60"
                    }`}
                  >
                    {r.toUpperCase()}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700" htmlFor="name">
                  First Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-[#1f4d3f] focus:outline-none focus:ring-2 focus:ring-[#1f4d3f]/20"
                  placeholder="First name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-[#1f4d3f] focus:outline-none focus:ring-2 focus:ring-[#1f4d3f]/20"
                  placeholder="you@email.com"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-[#1f4d3f] px-5 py-3 text-base font-semibold text-white transition hover:bg-[#153528] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Sending..." : "Send My Free Study Plan"}
              </button>

              <p className="text-xs text-slate-500">No spam. Unsubscribe anytime.</p>
            </form>
          ) : (
            <div className="mt-6 space-y-4 max-w-md">
              <p className="text-lg font-semibold text-[#1f4d3f]">
                Your study plan is on the way — check your inbox.
              </p>
              <p className="text-sm text-slate-600">
                Ready to start now? Take a free practice exam above to find your weak spots first.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
