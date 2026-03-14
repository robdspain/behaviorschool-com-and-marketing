"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle, ClipboardList, Mail, Timer } from "lucide-react";
import { ShareBar } from "@/components/ui/ShareBar";

const masteryOptions = [
  { value: "early", label: "Early prep (need a full content review)", hours: 120 },
  { value: "mid", label: "Mid prep (some gaps, need targeted review)", hours: 80 },
  { value: "late", label: "Final stretch (mostly practice + weak areas)", hours: 40 },
] as const;

function weeksBetween(today: Date, future: Date) {
  const diff = future.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24 * 7)));
}

export function BCBAPacingPlanner() {
  const [examDate, setExamDate] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("6");
  const [mastery, setMastery] = useState<(typeof masteryOptions)[number]["value"]>("mid");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");

  const result = useMemo(() => {
    if (!examDate) return null;
    const target = masteryOptions.find((opt) => opt.value === mastery) ?? masteryOptions[1];
    const weeks = weeksBetween(new Date(), new Date(examDate));
    const hoursNeeded = target.hours;
    const weeklyNeeded = weeks > 0 ? Math.ceil(hoursNeeded / weeks) : hoursNeeded;
    const hoursPlanned = Math.max(1, parseFloat(hoursPerWeek) || 1);
    const questionTarget = Math.round(hoursPlanned * 12);
    const mockExamInterval = weeks >= 8 ? 4 : weeks >= 4 ? 2 : 1;
    const mockExams = Math.max(1, Math.floor(weeks / mockExamInterval));
    const pacingMinutesPerQuestion = (240 / 185).toFixed(2);

    return {
      weeks,
      hoursNeeded,
      weeklyNeeded,
      hoursPlanned,
      questionTarget,
      mockExams,
      mockExamInterval,
      pacingMinutesPerQuestion,
      shortfall: hoursPlanned < weeklyNeeded,
    };
  }, [examDate, hoursPerWeek, mastery]);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSending(true);
    setSendError("");
    try {
      const res = await fetch("/api/lead-magnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          role: "bcba",
          tags: ["lead-magnet", "pacing-planner"],
          source: "website",
        }),
      });
      const data = await res.json();
      if (!res.ok || data?.error) throw new Error(data?.error || "Failed");
      setSent(true);
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-sm">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-[0.2em]">Your Inputs</p>
          <h2 className="text-2xl font-bold text-slate-900 mt-2">BCBA Exam Pacing Planner</h2>
          <p className="text-slate-600 mt-2">Build a realistic weekly plan based on your exam date and prep stage.</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Exam date</label>
          <input
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1f4d3f]/20 focus:border-[#1f4d3f]"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Prep stage</label>
          <div className="grid gap-3 sm:grid-cols-3">
            {masteryOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setMastery(opt.value)}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold text-left transition ${
                  mastery === opt.value
                    ? "border-[#1f4d3f] bg-[#1f4d3f]/10 text-[#1f4d3f]"
                    : "border-slate-200 text-slate-600 hover:border-[#1f4d3f]/40"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Hours you can study per week</label>
          <input
            type="number"
            min="1"
            max="40"
            value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1f4d3f]/20 focus:border-[#1f4d3f]"
          />
        </div>
      </div>

      {result && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-[0.2em]">Your Plan</p>
            <h3 className="text-xl font-bold text-slate-900">Weekly pacing for the next {result.weeks} weeks</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-500">Recommended weekly study time</p>
              <p className="text-3xl font-extrabold text-[#1f4d3f]">{result.weeklyNeeded} hrs</p>
              <p className="text-sm text-slate-600">Based on a {result.hoursNeeded}-hour total plan.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-500">Your weekly study time</p>
              <p className="text-3xl font-extrabold text-slate-900">{result.hoursPlanned} hrs</p>
              <p className="text-sm text-slate-600">Adjust up or down based on your availability.</p>
            </div>
          </div>

          {result.shortfall ? (
            <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <AlertTriangle className="h-4 w-4 mt-0.5" />
              You may need to increase to about <strong>{result.weeklyNeeded} hrs/week</strong> to stay on pace.
            </div>
          ) : (
            <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              <CheckCircle className="h-4 w-4 mt-0.5" />
              You are on pace to hit your goal with {result.hoursPlanned} hrs/week.
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 text-slate-600 text-sm">
                <ClipboardList className="h-4 w-4" />
                Weekly question target
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">~{result.questionTarget} Qs</p>
              <p className="text-xs text-slate-500">Based on ~12 questions per study hour.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 text-slate-600 text-sm">
                <Timer className="h-4 w-4" />
                Exam pacing goal
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">{result.pacingMinutesPerQuestion} min/Q</p>
              <p className="text-xs text-slate-500">4 hours / 185 questions.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 text-slate-600 text-sm">
                <ClipboardList className="h-4 w-4" />
                Mock exams
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">{result.mockExams}</p>
              <p className="text-xs text-slate-500">One every {result.mockExamInterval} weeks.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5">
            <h4 className="text-lg font-bold text-slate-900">Your next 7 days</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 list-disc pl-4">
              <li>Complete {Math.round(result.hoursPlanned * 0.6)} hours of content review.</li>
              <li>Do {Math.round(result.questionTarget * 0.7)} mixed practice questions.</li>
              <li>Review your weakest domain for 1 focused session.</li>
              <li>Take a 60-question timed mini-mock to practice pacing.</li>
            </ul>
          </div>

          {!sent ? (
            <form onSubmit={handleEmail} className="rounded-2xl border border-slate-200 p-5 space-y-3">
              <div className="flex items-center gap-2 text-slate-700 text-sm font-semibold">
                <Mail className="h-4 w-4" />
                Email me the 7-day plan + study checklist
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="First name (optional)"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1f4d3f]/20 focus:border-[#1f4d3f]"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1f4d3f]/20 focus:border-[#1f4d3f]"
                />
              </div>
              {sendError && <p className="text-sm text-red-600">{sendError}</p>}
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center justify-center rounded-xl bg-[#1f4d3f] px-5 py-3 text-sm font-semibold text-white hover:bg-[#153528] transition disabled:opacity-70"
              >
                {sending ? "Sending..." : "Send My Free Plan"}
              </button>
              <p className="text-xs text-slate-500">No spam. Unsubscribe anytime.</p>
            </form>
          ) : (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
              <CheckCircle className="inline-block h-4 w-4 mr-2" />
              Sent! Check your inbox for your free plan.
            </div>
          )}
        </div>
      )}

      <ShareBar
        title="BCBA Exam Pacing Planner"
        text="Just used BehaviorSchool's free BCBA exam pacing planner. It builds a weekly schedule and pacing targets based on your exam date."
        url="https://behaviorschool.com/bcba-pacing-planner"
        hashtags={["BCBA", "ABA", "BehaviorSchool"]}
      />
    </div>
  );
}
