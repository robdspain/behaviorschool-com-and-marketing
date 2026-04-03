"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, ClipboardList, Smartphone, MessageSquare } from "lucide-react";

export default function ObservationsProBetaPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/observations-beta-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError("Something went wrong. Try again or email rob@behaviorschool.com.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Something went wrong. Try again or email rob@behaviorschool.com.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f3ee]">
      {/* Nav spacer */}
      <div className="h-16" />

      {/* Hero */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 pt-12 pb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#1f4d3f] mb-4">
          Observations Pro · Beta
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-5">
          Direct observations, done in the field — not back at your desk.
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed mb-2">
          Observations Pro is a mobile app for school BCBAs. Run structured observations, collect data, and export clean reports — without typing everything up later.
        </p>
        <p className="text-base text-slate-500 leading-relaxed">
          It enters TestFlight in May 2026. If you want early access, put your name on the list.
        </p>
      </section>

      {/* Value props */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-10">
        <div className="grid gap-5">
          <div className="flex gap-4 items-start bg-white rounded-xl p-5 shadow-sm">
            <div className="mt-0.5 flex-shrink-0 w-10 h-10 rounded-lg bg-[#1f4d3f]/10 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-[#1f4d3f]" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 mb-1">Run observations on your phone</p>
              <p className="text-slate-600 text-sm leading-relaxed">
                Start a session, log behaviors with a tap, and stop the timer when you&apos;re done. No clipboard, no paper, no retyping.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start bg-white rounded-xl p-5 shadow-sm">
            <div className="mt-0.5 flex-shrink-0 w-10 h-10 rounded-lg bg-[#1f4d3f]/10 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-[#1f4d3f]" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 mb-1">Data you can actually use</p>
              <p className="text-slate-600 text-sm leading-relaxed">
                Frequency, duration, interval — whatever your protocol needs. Export a clean summary to drop straight into your FBA or BIP.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start bg-white rounded-xl p-5 shadow-sm">
            <div className="mt-0.5 flex-shrink-0 w-10 h-10 rounded-lg bg-[#1f4d3f]/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-[#1f4d3f]" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 mb-1">You shape what gets built</p>
              <p className="text-slate-600 text-sm leading-relaxed">
                Beta testers get direct access to Rob. If something doesn&apos;t match how you actually work, that feedback goes straight into the next build.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What beta testers get */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-10">
        <div className="bg-[#1f4d3f] rounded-2xl p-7 text-white">
          <h2 className="text-lg font-semibold mb-4">What beta testers get</h2>
          <ul className="space-y-3">
            {[
              "TestFlight access in May — before anyone else",
              "Influence on features, before they're locked in",
              "Direct line to Rob for feedback and questions",
              "Early adopter pricing when the app launches publicly",
            ].map((item) => (
              <li key={item} className="flex gap-3 items-start text-sm">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-300" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Email capture form */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-white rounded-2xl p-7 shadow-sm">
          {submitted ? (
            <div className="text-center py-4">
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
              <p className="font-semibold text-slate-900 text-lg mb-2">You&apos;re on the list.</p>
              <p className="text-slate-500 text-sm">
                Watch your inbox in May. In the meantime, feel free to{" "}
                <a href="mailto:rob@behaviorschool.com" className="text-[#1f4d3f] underline">
                  email Rob
                </a>{" "}
                if you want to share what your current observation workflow looks like.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-slate-900 mb-1">Join the beta waitlist</h2>
              <p className="text-sm text-slate-500 mb-5">
                TestFlight opens May 2026. No spam — just a heads-up when it&apos;s ready.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                    Your name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="First name is fine"
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1f4d3f]/30"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                    Email address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1f4d3f]/30"
                  />
                </div>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1f4d3f] hover:bg-[#17402f] text-white font-semibold rounded-lg px-6 py-3 text-sm transition-colors disabled:opacity-60"
                >
                  {loading ? "Joining..." : "Get early access"}
                </button>
                <p className="text-xs text-slate-400 text-center">
                  No spam.{" "}
                  <Link href="/email-preferences" className="underline">
                    Unsubscribe anytime.
                  </Link>
                </p>
              </form>
            </>
          )}
        </div>
      </section>

      {/* Footer note */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-16">
        <p className="text-xs text-slate-400 text-center leading-relaxed">
          Observations Pro is being built for school-based BCBAs. If you do ABA in a clinic setting, it may not be the right fit — but feel free to reach out.
          <br />
          <a href="https://behaviorschool.com" className="underline">
            behaviorschool.com
          </a>{" "}
          · Behavior School LLC · 8 The Green #20473 · Dover, DE 19901
        </p>
      </section>
    </div>
  );
}
