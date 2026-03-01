"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle, Printer, ArrowRight, Plus, Trash2 } from "lucide-react";
import { ShareBar } from "@/components/ui/ShareBar";

type Observation = { a: string; b: string; c: string };

type FunctionType = "escape" | "attention" | "tangible" | "sensory";

interface AnalysisResult {
  function: FunctionType;
  confidence: number;
  topAntecedent: string;
  topConsequence: string;
  summary: string;
  recommendations: string[];
  lowConfidence: boolean;
}

const GRADE_OPTIONS = [
  "Pre-K",
  "Kindergarten",
  "1st Grade",
  "2nd Grade",
  "3rd Grade",
  "4th Grade",
  "5th Grade",
  "6th Grade",
  "7th Grade",
  "8th Grade",
  "9th Grade",
  "10th Grade",
  "11th Grade",
  "12th Grade",
  "Post-Secondary",
];

const escapeKeywords = {
  antecedents: ["work", "task", "demand", "request", "assignment", "test", "transition", "difficult", "independent"],
  consequences: ["removed", "sent", "left", "avoided", "stopped", "escaped", "walked", "office", "hallway", "break", "sat quietly", "moved on"],
};
const attentionKeywords = {
  antecedents: ["alone", "ignored", "busy", "talking to", "other student", "peer", "independent"],
  consequences: ["attention", "redirect", "reprimand", "looked", "responded", "engaged", "talked", "came over", "moved closer"],
};
const tangibleKeywords = {
  antecedents: ["taken away", "preferred", "denied", "no", "finished", "put away", "ipad", "toy", "food", "activity ended"],
  consequences: ["got", "received", "given", "returned", "earned", "obtained", "item", "activity"],
};
const sensoryKeywords = {
  antecedents: ["loud", "quiet", "lights", "sensory", "unstructured", "no trigger", "unprompted", "random"],
  consequences: ["self-stimulatory", "rocking", "humming", "flapping", "no social", "alone", "continued regardless"],
};

const recommendations: Record<FunctionType, string[]> = {
  escape: [
    'Modify tasks: Offer choice within the assignment (e.g., "Do problems 1–5 or 6–10 first?")',
    'Teach a functional replacement: Provide a "help card" or "break request" card the student can use appropriately',
    "Adjust consequence: Ensure escape is not the result of the behavior — provide a structured break contingent on task initiation, not refusal",
  ],
  attention: [
    "Schedule predictable attention: Check in proactively before behavior occurs (e.g., every 5–10 min during independent work)",
    'Teach a replacement: "Raise your hand" or use a signal card to request adult interaction appropriately',
    "Withhold unintentional reinforcement: Ensure peer/adult attention does not follow the target behavior",
  ],
  tangible: [
    'Use a first-then schedule: "First [task], then [preferred item/activity]" to increase predictability',
    'Teach a replacement: "I want ___" request using words, PECS, or AAC',
    "Adjust transitions: Give advance warning before preferred activities end (e.g., \"2 more minutes, then we switch\")",
  ],
  sensory: [
    "Conduct a sensory assessment: Identify what sensory input the behavior may be providing (proprioceptive, vestibular, auditory, etc.)",
    "Provide a sensory diet: Schedule appropriate sensory input throughout the day (e.g., movement breaks, fidget tools)",
    "Teach a compatible replacement: Offer an appropriate behavior that provides similar sensory input",
  ],
};

function scoreKeywords(text: string, keywords: string[]): number {
  const lower = text.toLowerCase();
  return keywords.filter((kw) => lower.includes(kw)).length;
}

function analyzeFunction(observations: Observation[]): AnalysisResult {
  const scores: Record<FunctionType, number> = { escape: 0, attention: 0, tangible: 0, sensory: 0 };

  for (const obs of observations) {
    scores.escape +=
      scoreKeywords(obs.a, escapeKeywords.antecedents) * 2 +
      scoreKeywords(obs.c, escapeKeywords.consequences) * 2;
    scores.attention +=
      scoreKeywords(obs.a, attentionKeywords.antecedents) * 2 +
      scoreKeywords(obs.c, attentionKeywords.consequences) * 2;
    scores.tangible +=
      scoreKeywords(obs.a, tangibleKeywords.antecedents) * 2 +
      scoreKeywords(obs.c, tangibleKeywords.consequences) * 2;
    scores.sensory +=
      scoreKeywords(obs.a, sensoryKeywords.antecedents) * 2 +
      scoreKeywords(obs.c, sensoryKeywords.consequences) * 2;
  }

  const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  const normalized: Record<FunctionType, number> = {
    escape: Math.round((scores.escape / total) * 100),
    attention: Math.round((scores.attention / total) * 100),
    tangible: Math.round((scores.tangible / total) * 100),
    sensory: Math.round((scores.sensory / total) * 100),
  };

  const topFunction = (Object.entries(normalized) as [FunctionType, number][]).sort((a, b) => b[1] - a[1])[0][0];
  const confidence = normalized[topFunction];

  // Find most common antecedent and consequence (by word frequency)
  const allA = observations.map((o) => o.a).join(" ").toLowerCase();
  const allC = observations.map((o) => o.c).join(" ").toLowerCase();

  // Find the top matching antecedent keyword
  const allAntecedentKws = [
    ...escapeKeywords.antecedents,
    ...attentionKeywords.antecedents,
    ...tangibleKeywords.antecedents,
    ...sensoryKeywords.antecedents,
  ];
  const allConsequenceKws = [
    ...escapeKeywords.consequences,
    ...attentionKeywords.consequences,
    ...tangibleKeywords.consequences,
    ...sensoryKeywords.consequences,
  ];

  const topAKw = allAntecedentKws
    .map((kw) => ({ kw, count: (allA.match(new RegExp(kw, "g")) || []).length }))
    .sort((a, b) => b.count - a.count)[0];
  const topCKw = allConsequenceKws
    .map((kw) => ({ kw, count: (allC.match(new RegExp(kw, "g")) || []).length }))
    .sort((a, b) => b.count - a.count)[0];

  // Count how many observations contain topKw
  const topACount = observations.filter((o) => o.a.toLowerCase().includes(topAKw?.kw || "")).length;
  const topCCount = observations.filter((o) => o.c.toLowerCase().includes(topCKw?.kw || "")).length;

  const topAntecedent = topAKw && topACount > 0 ? `"${topAKw.kw}" (appeared in ${topACount}/${observations.length} observations)` : "varied across observations";
  const topConsequence = topCKw && topCCount > 0 ? `"${topCKw.kw}" (appeared in ${topCCount}/${observations.length} observations)` : "varied across observations";

  const summaries: Record<FunctionType, string> = {
    escape: `The antecedent-consequence pattern suggests the student's behavior is maintained by removal from or avoidance of aversive tasks or situations. The behavior is most likely to occur when demands are presented and results in reduced task engagement.`,
    attention: `The pattern suggests the student's behavior is maintained by access to social attention from adults or peers. The behavior is most likely to occur when attention is unavailable and results in increased interaction.`,
    tangible: `The pattern suggests the student's behavior is maintained by access to preferred items, activities, or sensory experiences. The behavior is most likely to occur when access is denied or terminated.`,
    sensory: `The pattern suggests the student's behavior is maintained by automatic reinforcement — the behavior itself provides sensory input. The behavior often occurs independently of social consequences.`,
  };

  return {
    function: topFunction,
    confidence,
    topAntecedent,
    topConsequence,
    summary: summaries[topFunction],
    recommendations: recommendations[topFunction],
    lowConfidence: confidence < 30,
  };
}

const emptyRow = (): Observation => ({ a: "", b: "", c: "" });

export function ABCWizard() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [studentName, setStudentName] = useState("");
  const [grade, setGrade] = useState("");
  const [observations, setObservations] = useState<Observation[]>([emptyRow(), emptyRow(), emptyRow()]);
  const [email, setEmail] = useState("");
  const [submitterName, setSubmitterName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const filledRows = observations.filter((o) => o.a.trim() || o.b.trim() || o.c.trim());

  function updateRow(i: number, field: keyof Observation, val: string) {
    setObservations((prev) => prev.map((row, idx) => (idx === i ? { ...row, [field]: val } : row)));
  }

  function addRow() {
    if (observations.length < 10) setObservations((prev) => [...prev, emptyRow()]);
  }

  function removeRow(i: number) {
    if (observations.length > 3) setObservations((prev) => prev.filter((_, idx) => idx !== i));
  }

  function handleAnalyze() {
    if (filledRows.length < 3) {
      setError("Please fill in at least 3 observations.");
      return;
    }
    setError("");
    const analysis = analyzeFunction(filledRows);
    setResult(analysis);
    setStep(2);
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setError("");
    try {
      await fetch("/api/abc-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: submitterName,
          studentName,
          grade,
          result,
          observationCount: filledRows.length,
        }),
      });
    } catch {
      // non-blocking
    }
    setSubmitting(false);
    setStep(3);
  }

  if (step === 1) {
    return (
      <div className="space-y-6">
        {/* Student info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Student Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student First Name <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g., Jordan"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4731]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4731]"
              >
                <option value="">Select grade</option>
                {GRADE_OPTIONS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ABC Table */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">ABC Observations</h2>
          <p className="text-sm text-gray-500 mb-4">Enter at least 3 observations. Add up to 10.</p>

          <div className="space-y-3">
            {/* Header */}
            <div className="grid grid-cols-[1fr_1fr_1fr_32px] gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide px-1">
              <span>Antecedent</span>
              <span>Behavior</span>
              <span>Consequence</span>
              <span></span>
            </div>
            {observations.map((row, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_1fr_32px] gap-2 items-start">
                <input
                  type="text"
                  value={row.a}
                  onChange={(e) => updateRow(i, "a", e.target.value)}
                  placeholder={i === 0 ? "Teacher gave independent work assignment" : "What happened before"}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4731] placeholder:text-gray-300"
                />
                <input
                  type="text"
                  value={row.b}
                  onChange={(e) => updateRow(i, "b", e.target.value)}
                  placeholder={i === 0 ? "Student put head down, refused to start" : "What the student did"}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4731] placeholder:text-gray-300"
                />
                <input
                  type="text"
                  value={row.c}
                  onChange={(e) => updateRow(i, "c", e.target.value)}
                  placeholder={i === 0 ? "Teacher moved on, student sat quietly" : "What happened after"}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4731] placeholder:text-gray-300"
                />
                <button
                  onClick={() => removeRow(i)}
                  disabled={observations.length <= 3}
                  className="mt-2 text-gray-300 hover:text-red-400 disabled:opacity-0 disabled:pointer-events-none transition-colors"
                  aria-label="Remove row"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {observations.length < 10 && (
            <button
              onClick={addRow}
              className="mt-4 flex items-center gap-1.5 text-sm text-[#1a4731] hover:text-[#2d6b4f] font-medium transition-colors"
            >
              <Plus size={16} />
              Add Another Observation
            </button>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <AlertTriangle size={16} />
            {error}
          </div>
        )}

        <button
          onClick={handleAnalyze}
          className="w-full bg-[#1a4731] text-white py-3 px-6 rounded-xl font-semibold text-base hover:bg-[#2d6b4f] transition-colors flex items-center justify-center gap-2"
        >
          Analyze Function
          <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-lg mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle size={22} className="text-[#1a4731]" />
          <h2 className="text-xl font-bold text-gray-900">Your function analysis is ready.</h2>
        </div>
        <p className="text-gray-600 mb-6">
          Enter your email to view the full report and get a copy sent to you.
        </p>
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@school.org"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4731]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              value={submitterName}
              onChange={(e) => setSubmitterName(e.target.value)}
              placeholder="Your name"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4731]"
            />
          </div>
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertTriangle size={14} /> {error}
            </div>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#1a4731] text-white py-3 px-6 rounded-xl font-semibold hover:bg-[#2d6b4f] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {submitting ? "Sending..." : "View My Results"}
            {!submitting && <ArrowRight size={18} />}
          </button>
          <p className="text-xs text-center text-gray-400">Free forever. Unsubscribe anytime.</p>
        </form>
      </div>
    );
  }

  // Step 3: Results
  if (!result) return null;
  const functionLabel = result.function.toUpperCase();
  const studentLabel = studentName || "Your Student";

  return (
    <div className="space-y-6 print:space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 p-6 print:border-none">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4 mb-6 print:pb-2 print:mb-4">
          <h2 className="text-xl font-bold text-gray-900 tracking-wide uppercase text-sm mb-1">
            Function Hypothesis Report
          </h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
            <span>Student: <strong className="text-gray-700">{studentLabel}</strong></span>
            {grade && <span>Grade: <strong className="text-gray-700">{grade}</strong></span>}
            <span>Generated: <strong className="text-gray-700">{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</strong></span>
          </div>
        </div>

        {/* Function */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Hypothesized Function</p>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl font-black text-[#1a4731]">{functionLabel}</span>
            <span className="bg-[#1a4731]/10 text-[#1a4731] text-sm font-semibold px-3 py-1 rounded-full">
              {result.confidence}% confidence
            </span>
          </div>
          {result.lowConfidence && (
            <div className="flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-sm mb-3">
              <AlertTriangle size={14} />
              Low confidence — consider adding more observations or reviewing for consistency.
            </div>
          )}
          <p className="text-sm text-gray-600">Based on your {filledRows.length} observations:</p>
          <ul className="mt-2 space-y-1 text-sm text-gray-700">
            <li>Most common antecedent: {result.topAntecedent}</li>
            <li>Most common consequence: {result.topConsequence}</li>
          </ul>
          <p className="mt-3 text-sm text-gray-600 leading-relaxed">{result.summary}</p>
        </div>

        <div className="border-t border-gray-100 my-4" />

        {/* Recommendations */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Recommended Starting Points</p>
          <ol className="space-y-3">
            {result.recommendations.map((rec, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-700">
                <span className="flex-shrink-0 w-6 h-6 bg-[#1a4731] text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
                {rec}
              </li>
            ))}
          </ol>
        </div>

        <div className="border-t border-gray-100 my-4" />

        {/* Next step */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Next Step: ACT-Informed FBA</p>
          <p className="text-sm text-gray-600 mb-3">
            This analysis identifies the function. To build a complete, values-aligned BIP, use the ACT-Informed FBA Generator.
          </p>
          <a
            href="/act-fba-bip"
            className="inline-flex items-center gap-2 bg-[#1a4731] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#2d6b4f] transition-colors"
          >
            Try ACT-FBA Tool
            <ArrowRight size={14} />
          </a>
        </div>
      </div>

      {/* Share */}
      <div className="print:hidden">
        <ShareBar
          title="My ABC Function Analysis"
          text={`I just analyzed ${result.function || 'behavior'}-motivated behavior using BehaviorSchool's free ABC Function Finder. Great tool for school BCBAs.`}
          url="https://behaviorschool.com/abc-function-finder"
          hashtags={["BCBA", "SchoolBCBA", "BehaviorAnalysis"]}
        />
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 print:hidden">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <Printer size={16} />
          Print Report
        </button>
        <button
          onClick={() => { setStep(1); setResult(null); }}
          className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Start New Analysis
        </button>
      </div>

      {/* CTA */}
      <div className="bg-[#1a4731] text-white rounded-xl p-6 print:hidden">
        <p className="text-sm font-medium mb-1 text-green-200">School BCBA Transformation Program</p>
        <p className="text-base font-bold mb-1">
          Want to implement this with your whole team?
        </p>
        <p className="text-sm text-green-100 mb-4">
          6 weeks starting March 26. Early bird $2,499 through March 21.
        </p>
        <a
          href="/transformation-program"
          className="inline-flex items-center gap-2 bg-white text-[#1a4731] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-50 transition-colors"
        >
          Learn More
          <ArrowRight size={14} />
        </a>
      </div>
    </div>
  );
}
