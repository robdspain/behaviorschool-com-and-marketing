"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const ROLE_OPTIONS = [
  { id: "rbt", label: "I am studying for the RBT exam" },
  { id: "bcba", label: "I am studying for the BCBA exam" },
  { id: "both", label: "I need both" },
];

const SOCIAL_STATS = [
  "3,200+ exam prep users",
  "87% report improved confidence",
  "BACB-aligned content",
];

const RBT_PLAN = [
  "Day 1: RBT Task List orientation + 20 practice Qs",
  "Day 2: Measurement & data collection deep-dive",
  "Day 3: Skill acquisition - DTT, NET, chaining",
  "Day 4: Behavior reduction - antecedents, consequences",
  "Day 5: Documentation & professional conduct",
  "Day 6: Full mock exam (75 questions)",
  "Day 7: Review weak areas + confidence assessment",
];

const BCBA_PLAN = [
  "Day 1: BACB exam structure + domain overview",
  "Day 2: Behavior assessment & measurement (30%)",
  "Day 3: Behavior change procedures (24%)",
  "Day 4: Selecting & implementing interventions (22%)",
  "Day 5: Ethics, supervision & professional practice",
  "Day 6: Systems support + generalization",
  "Day 7: Full timed mock exam + score analysis",
];

export default function FreeStudyPlanPage() {
  const [role, setRole] = useState("rbt");
  const [formState, setFormState] = useState({ name: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const studyLinks = useMemo(() => {
    if (role === "bcba") return [{ href: "https://study.behaviorschool.com", label: "Start studying now →" }];
    if (role === "rbt") return [{ href: "https://rbtstudy.behaviorschool.com", label: "Start studying now →" }];
    return [
      { href: "https://rbtstudy.behaviorschool.com", label: "Start RBT studying now →" },
      { href: "https://study.behaviorschool.com", label: "Start BCBA studying now →" },
    ];
  }, [role]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/.netlify/functions/capture-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formState.name.trim(),
          email: formState.email.trim(),
          role,
        }),
      });

      const data = await response.json();
      if (!response.ok || data?.error) {
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
      <section className="relative overflow-hidden bg-gradient-to-br from-[#123628] via-[#1f4d3f] to-[#2c6b57] text-white">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#e4b63d26,transparent_55%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff14_1px,transparent_1px),linear-gradient(to_bottom,#ffffff14_1px,transparent_1px)] bg-[size:32px_32px]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
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
              Get Your Free 7-Day Study Plan
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

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl border border-emerald-100/60 p-6 sm:p-10">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1f4d3f]">Choose your exam</h2>
              <p className="mt-2 text-slate-600">Pick the plan that matches your goal.</p>

              <div className="mt-6 grid gap-4">
                {ROLE_OPTIONS.map((option) => {
                  const isActive = role === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setRole(option.id)}
                      className={`flex items-center justify-between rounded-2xl border-2 p-5 text-left transition ${
                        isActive
                          ? "border-[#e4b63d] bg-[#fff7dd] shadow-sm"
                          : "border-slate-200 hover:border-[#e4b63d]/60 hover:bg-[#fffaf0]"
                      }`}
                    >
                      <span className="text-lg sm:text-xl font-semibold text-[#1f4d3f]">{option.label}</span>
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                          isActive ? "border-[#e4b63d] bg-[#e4b63d] text-[#1f4d3f]" : "border-slate-300 text-slate-300"
                        }`}
                      >
                        ✓
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#f8f3e6] rounded-2xl p-6 sm:p-8 border border-[#f0e2bf]">
              <h3 className="text-xl sm:text-2xl font-bold text-[#1f4d3f]">Send it to me</h3>
              <p className="mt-2 text-slate-600">We will email your personalized study plan instantly.</p>

              {!isSuccess ? (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700" htmlFor="first-name">
                      First Name
                    </label>
                    <input
                      id="first-name"
                      name="firstName"
                      type="text"
                      required
                      value={formState.name}
                      onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
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
                      value={formState.email}
                      onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
                      className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-[#1f4d3f] focus:outline-none focus:ring-2 focus:ring-[#1f4d3f]/20"
                      placeholder="you@email.com"
                    />
                  </div>

                  <input type="hidden" name="role" value={role} />

                  {error ? <p className="text-sm text-red-600">{error}</p> : null}

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
                <div className="mt-6 space-y-4">
                  <p className="text-lg font-semibold text-[#1f4d3f]">
                    🎉 Check your inbox! Your 7-day study plan is on its way.
                  </p>
                  <div className="space-y-3">
                    {studyLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="inline-flex items-center gap-2 text-[#1f4d3f] font-semibold hover:text-[#153528]"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="rounded-2xl bg-white border border-slate-200 px-6 py-4 flex flex-wrap items-center justify-center gap-4 text-sm font-semibold text-[#1f4d3f]">
          {SOCIAL_STATS.map((stat) => (
            <span key={stat} className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#e4b63d]" />
              {stat}
            </span>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1f4d3f]">What you get each day</h2>
          <p className="mt-3 text-lg text-slate-600">
            Focused, BACB-aligned structure so you always know what to study next.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-[#1f4d3f]">RBT 7-Day Plan</h3>
            <ul className="mt-6 space-y-3 text-slate-700">
              {RBT_PLAN.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#e4b63d]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-[#1f4d3f]">BCBA 7-Day Plan</h3>
            <ul className="mt-6 space-y-3 text-slate-700">
              {BCBA_PLAN.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#e4b63d]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
