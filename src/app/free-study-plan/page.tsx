"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type Role = "bcba" | "rbt" | "both";

const ROLE_OPTIONS: { id: Role; label: string }[] = [
  { id: "bcba", label: "BCBA" },
  { id: "rbt", label: "RBT" },
  { id: "both", label: "Both" },
];

const BCBA_PLAN = [
  { day: 1, topic: "Measurement", hours: 4 },
  { day: 2, topic: "Experimental Design", hours: 3 },
  { day: 3, topic: "Behavior Assessment", hours: 4 },
  { day: 4, topic: "Behavior Change Procedures", hours: 5 },
  { day: 5, topic: "Personnel Supervision", hours: 3 },
  { day: 6, topic: "Ethics", hours: 4 },
  { day: 7, topic: "Full Mock Exam", hours: 6 },
];


export default function FreeStudyPlanPage() {
  const [role, setRole] = useState<Role>("bcba");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 pt-28 sm:pt-32">
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
            Free · No credit card
          </motion.div>

          <div className="mt-6 max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight"
            >
              Get Your Free 7-Day BCBA Study Plan
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 text-lg sm:text-xl text-emerald-50/90"
            >
              Personalized for RBTs and BCBAs. Delivered to your inbox instantly.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Form Card */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl border border-emerald-100/60 p-6 sm:p-10">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Role toggle */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1f4d3f]">Choose your exam</h2>
              <p className="mt-2 text-slate-600">Pick the plan that matches your goal.</p>

              <div className="mt-6 flex gap-3">
                {ROLE_OPTIONS.map((option) => {
                  const isActive = role === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setRole(option.id)}
                      className={`flex-1 rounded-2xl border-2 py-4 text-center font-semibold text-lg transition ${
                        isActive
                          ? "border-[#e4b63d] bg-[#fff7dd] text-[#1f4d3f] shadow-sm"
                          : "border-slate-200 text-slate-600 hover:border-[#e4b63d]/60 hover:bg-[#fffaf0]"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Email form */}
            <div className="bg-[#f8f3e6] rounded-2xl p-6 sm:p-8 border border-[#f0e2bf]">
              <h3 className="text-xl sm:text-2xl font-bold text-[#1f4d3f]">Send it to me</h3>
              <p className="mt-2 text-slate-600">We will email your personalized study plan instantly.</p>

              {!isSuccess ? (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
                      placeholder="Jamie"
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
                    {isSubmitting ? "Sending..." : "Send My Free Study Plan →"}
                  </button>

                  <p className="text-xs text-slate-500">No spam. Unsubscribe anytime.</p>
                </form>
              ) : (
                <div className="mt-6 space-y-6">
                  <p className="text-lg font-semibold text-[#1f4d3f]">
                    🎉 Check your inbox — your 7-day plan is on the way!
                  </p>
                  <p className="text-sm text-slate-600">
                    Here&apos;s a preview of what you&apos;ll find inside:
                  </p>

                  {/* Inline 7-day plan */}
                  <ol className="space-y-3">
                    {BCBA_PLAN.map(({ day, topic, hours }) => (
                      <li
                        key={day}
                        className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1f4d3f] text-xs font-bold text-white">
                          {day}
                        </span>
                        <span className="flex-1 font-medium text-slate-800">
                          Day {day}: {topic}
                        </span>
                        <span className="shrink-0 rounded-full bg-[#e4b63d]/20 px-2 py-0.5 text-xs font-semibold text-[#7a5812]">
                          {hours} hrs
                        </span>
                      </li>
                    ))}
                  </ol>

                  <Link
                    href="https://study.behaviorschool.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#1f4d3f] px-5 py-3 text-sm font-semibold text-white hover:bg-[#153528] transition"
                  >
                    Start studying now →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="rounded-2xl bg-white border border-slate-200 px-6 py-4 flex flex-wrap items-center justify-center gap-4 text-sm font-semibold text-[#1f4d3f]">
      {/* Full 7-day plan preview */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1f4d3f]">Your 7-day BCBA study schedule</h2>
          <p className="mt-3 text-lg text-slate-600">
            Focused, BACB-aligned structure so you always know what to study next.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {BCBA_PLAN.map(({ day, topic, hours }) => (
            <div
              key={day}
              className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1f4d3f] text-sm font-bold text-white">
                  {day}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Day {day}</span>
              </div>
              <p className="font-bold text-[#1f4d3f] text-lg leading-tight">{topic}</p>
              <p className="mt-2 text-sm text-slate-500">{hours} hours of focused study</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
