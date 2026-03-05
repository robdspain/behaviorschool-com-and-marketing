"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";

export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/email-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "homepage-playbook" }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 text-[#1f4d3f]">
        <CheckCircle size={20} />
        <span className="font-semibold">You&apos;re in! Check your inbox.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
      <input
        type="email"
        placeholder="you@school.edu"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="flex-1 px-4 py-3 rounded-full border border-[#1f4d3f]/20 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1f4d3f]/30"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#1f4d3f] text-white font-semibold hover:bg-[#173a2f] transition-colors disabled:opacity-60"
      >
        {status === "loading" ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <>
            Subscribe <ArrowRight size={16} />
          </>
        )}
      </button>
      {status === "error" && (
        <p className="text-red-600 text-sm mt-2">Something went wrong. Try again.</p>
      )}
    </form>
  );
}
