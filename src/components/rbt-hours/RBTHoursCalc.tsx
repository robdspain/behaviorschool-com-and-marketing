"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle, ArrowRight, Send } from "lucide-react";

interface CalcResult {
  hoursCompleted: number;
  hoursRequired: number;
  hoursRemaining: number;
  progressPct: number;
  completionDate: Date | null;
  weeksRemaining: number | null;
  hoursPerMonth: number;
  minSupervisionHours: number;
  supervisionPctEntered: number;
  supervisionHoursEntered: number;
  belowMinimum: boolean;
  pathway: string;
}

export function RBTHoursCalc() {
  const [pathway, setPathway] = useState<"rbt" | "bcaba">("rbt");
  const [hoursLogged, setHoursLogged] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("20");
  const [supervisionPct, setSupervisionPct] = useState(10);
  const [startDate, setStartDate] = useState("");

  const [result, setResult] = useState<CalcResult | null>(null);
  const [email, setEmail] = useState("");
  const [submitterName, setSubmitterName] = useState("");
  const [supervisorEmail, setSupervisorEmail] = useState("");
  const [includeSupervisor, setIncludeSupervisor] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");

  const hoursRequired = pathway === "rbt" ? 1500 : 1000;

  function calculate() {
    const logged = parseFloat(hoursLogged) || 0;
    const hpw = parseFloat(hoursPerWeek) || 20;
    const remaining = Math.max(0, hoursRequired - logged);
    const progressPct = Math.min(100, Math.round((logged / hoursRequired) * 100));

    // Weeks to completion
    let completionDate: Date | null = null;
    let weeksRemaining: number | null = null;
    if (remaining > 0 && hpw > 0) {
      weeksRemaining = Math.ceil(remaining / hpw);
      completionDate = new Date();
      completionDate.setDate(completionDate.getDate() + weeksRemaining * 7);
    }

    const hoursPerMonth = hpw * 4.33;
    const minSupervisionHours = Math.max(1, Math.ceil(hoursPerMonth * 0.05));
    const supervisionHoursEntered = Math.round(hoursPerMonth * (supervisionPct / 100));
    const belowMinimum = supervisionPct < 5;

    setResult({
      hoursCompleted: logged,
      hoursRequired,
      hoursRemaining: remaining,
      progressPct,
      completionDate,
      weeksRemaining,
      hoursPerMonth: Math.round(hoursPerMonth),
      minSupervisionHours,
      supervisionPctEntered: supervisionPct,
      supervisionHoursEntered,
      belowMinimum,
      pathway: pathway === "rbt" ? "RBT (1,500 hours)" : "BCaBA/other (1,000 hours)",
    });
    setSent(false);
  }

  async function handleSendEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !result) return;
    setSending(true);
    setSendError("");
    try {
      const res = await fetch("/api/rbt-hours-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: submitterName,
          supervisorEmail: includeSupervisor ? supervisorEmail : null,
          result,
          hoursPerWeek: parseFloat(hoursPerWeek),
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setSent(true);
    } catch {
      setSendError("Something went wrong. Please try again.");
    }
    setSending(false);
  }

  return (
    <div className="space-y-6">
      {/* Input Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-gray-900">Your Information</h2>

        {/* Pathway */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Certification Pathway</label>
          <div className="flex flex-col sm:flex-row gap-3">
            {[
              { value: "rbt", label: "RBT — 1,500 hours required" },
              { value: "bcaba", label: "BCaBA or other — 1,000 hours" },
            ].map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center gap-2 cursor-pointer border rounded-lg px-4 py-3 text-sm transition-colors ${
                  pathway === opt.value
                    ? "border-[#1a4731] bg-[#1a4731]/5 text-[#1a4731] font-medium"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="pathway"
                  value={opt.value}
                  checked={pathway === opt.value}
                  onChange={() => setPathway(opt.value as "rbt" | "bcaba")}
                  className="accent-[#1a4731]"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        {/* Hours logged */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hours logged so far
          </label>
          <input
            type="number"
            min="0"
            max={hoursRequired}
            value={hoursLogged}
            onChange={(e) => setHoursLogged(e.target.value)}
            placeholder="e.g. 750"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4731]"
          />
        </div>

        {/* Hours per week + Start date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Average hours worked per week
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4731]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start date of counting hours <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4731]"
            />
          </div>
        </div>

        {/* Supervision % */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Average supervision received per month:{" "}
            <span className="text-[#1a4731] font-semibold">{supervisionPct}%</span>
          </label>
          <input
            type="range"
            min="1"
            max="30"
            step="1"
            value={supervisionPct}
            onChange={(e) => setSupervisionPct(parseInt(e.target.value))}
            className="w-full accent-[#1a4731]"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1%</span>
            <span>5% (BACB min)</span>
            <span>30%</span>
          </div>
        </div>

        <button
          onClick={calculate}
          className="w-full bg-[#1a4731] text-white py-3 px-6 rounded-xl font-semibold text-base hover:bg-[#2d6b4f] transition-colors"
        >
          Calculate My Hours
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          {/* Progress */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Your RBT Hour Progress</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Hours completed</span>
                <span className="font-bold text-gray-900">{result.hoursCompleted.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Hours required</span>
                <span className="font-bold text-gray-900">{result.hoursRequired.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Hours remaining</span>
                <span className="font-bold text-gray-900">{result.hoursRemaining.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Progress</span>
                <span className="font-bold text-[#1a4731]">{result.progressPct}%</span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-3 h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1a4731] rounded-full transition-all duration-700"
                style={{ width: `${result.progressPct}%` }}
              />
            </div>
            {result.progressPct >= 100 && (
              <div className="flex items-center gap-2 text-[#1a4731] text-sm mt-3 font-medium">
                <CheckCircle size={16} />
                You have reached your required hours!
              </div>
            )}
          </div>

          <div className="border-t border-gray-100" />

          {/* Projected completion */}
          {result.completionDate && result.weeksRemaining !== null && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Projected Completion</p>
              <p className="text-sm text-gray-600">
                At {parseFloat(hoursPerWeek)} hrs/week, you will reach {result.hoursRequired.toLocaleString()} hours on approximately:
              </p>
              <p className="text-2xl font-black text-[#1a4731] my-1">
                {result.completionDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </p>
              <p className="text-sm text-gray-500">That is {result.weeksRemaining} weeks from today.</p>
            </div>
          )}

          <div className="border-t border-gray-100" />

          {/* Supervision check */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Monthly Supervision Check</p>
            <div className="text-sm text-gray-600 space-y-1">
              <p>You are working {parseFloat(hoursPerWeek)} hrs/week = ~{result.hoursPerMonth} hrs/month</p>
              <p>BACB requires 5% of hours be supervised (min 1 hr/month)</p>
              <p>
                At your rate:{" "}
                <strong className="text-gray-900">
                  You need at least {result.minSupervisionHours} supervised hours/month
                </strong>
              </p>
              {!result.belowMinimum && (
                <p className="text-[#1a4731] font-medium">
                  At {result.supervisionPctEntered}%, you are receiving ~{result.supervisionHoursEntered} supervised hrs/month
                </p>
              )}
            </div>

            {result.belowMinimum && (
              <div className="flex items-start gap-2 mt-3 text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
                <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                <span>
                  Your supervision rate is below the BACB minimum of 5%. Talk to your supervisor about increasing your supervised hours.
                </span>
              </div>
            )}
          </div>

          <div className="border-t border-gray-100" />

          {/* Email capture */}
          {!sent ? (
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">
                Want a copy of this sent to you — or to your supervisor?
              </p>
              <form onSubmit={handleSendEmail} className="space-y-3 mt-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Your Name <span className="text-gray-400">(optional)</span></label>
                  <input
                    type="text"
                    value={submitterName}
                    onChange={(e) => setSubmitterName(e.target.value)}
                    placeholder="Your name"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4731]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Your Email <span className="text-red-400">*</span></label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@school.org"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4731]"
                  />
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSupervisor}
                    onChange={(e) => setIncludeSupervisor(e.target.checked)}
                    className="accent-[#1a4731]"
                  />
                  Also send to my supervisor
                </label>
                {includeSupervisor && (
                  <input
                    type="email"
                    value={supervisorEmail}
                    onChange={(e) => setSupervisorEmail(e.target.value)}
                    placeholder="supervisor@school.org"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4731]"
                  />
                )}
                {sendError && (
                  <div className="flex items-center gap-2 text-red-600 text-xs">
                    <AlertTriangle size={12} /> {sendError}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={sending}
                  className="flex items-center gap-2 bg-[#1a4731] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#2d6b4f] transition-colors disabled:opacity-60"
                >
                  <Send size={14} />
                  {sending ? "Sending..." : "Send My Summary"}
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[#1a4731] text-sm font-medium">
              <CheckCircle size={16} />
              Sent! Check your inbox (and junk folder just in case).
            </div>
          )}
        </div>
      )}

      {/* Bottom CTA */}
      <div className="bg-[#1a4731] text-white rounded-xl p-6">
        <p className="text-sm font-medium mb-1 text-green-200">SchoolRBT.com</p>
        <p className="text-base font-bold mb-1">Preparing for your RBT exam?</p>
        <p className="text-sm text-green-100 mb-4">
          500+ practice questions built specifically for school settings.
        </p>
        <a
          href="https://rbtstudy.behaviorschool.com"
          className="inline-flex items-center gap-2 bg-white text-[#1a4731] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-50 transition-colors"
        >
          Try SchoolRBT Free
          <ArrowRight size={14} />
        </a>
      </div>
    </div>
  );
}
