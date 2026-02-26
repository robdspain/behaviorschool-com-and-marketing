"use client";

import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  Search,
  Copy,
  Check,
  Filter,
  ChevronDown,
  ChevronUp,
  X,
  Sparkles,
  BookOpen,
  Download,
  Loader2,
  AlertCircle,
  Plus,
  Trash2,
} from "lucide-react";
import { goals, categories, gradeLevels, IEPGoal } from "./goalData";

// ─── Types ───────────────────────────────────────────────────

type Tab = "browse" | "generate";

interface GeneratedGoal {
  condition: string;
  behavior: string;
  criteria: string;
  goal: string;
}

// ─── Goal Card (shared between browse + generate) ─────────────

function GoalCard({
  goal,
  onCopy,
  onAddToList,
  copiedId,
  inList,
  cardId,
}: {
  goal: { condition: string; behavior: string; criteria: string; goal: string };
  onCopy: (id: string, text: string) => void;
  onAddToList: (goal: { condition: string; behavior: string; criteria: string; goal: string }) => void;
  copiedId: string | null;
  inList: boolean;
  cardId: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="space-y-2 text-sm text-slate-700 leading-relaxed">
        <p>
          <span className="font-semibold text-bs-primary">Condition:</span> {goal.condition}
        </p>
        <p>
          <span className="font-semibold text-bs-primary">Behavior:</span> {goal.behavior}
        </p>
        <p>
          <span className="font-semibold text-bs-primary">Criteria:</span> {goal.criteria}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <button
          onClick={() => onCopy(cardId, goal.goal)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-slate-600"
        >
          {copiedId === cardId ? (
            <Check className="w-3.5 h-3.5 text-green-600" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
          {copiedId === cardId ? "Copied!" : "Copy Goal"}
        </button>
        <button
          onClick={() => onAddToList(goal)}
          disabled={inList}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            inList
              ? "bg-bs-primary/10 text-bs-primary cursor-default"
              : "bg-bs-primary text-white hover:bg-bs-primary/90"
          }`}
        >
          {inList ? (
            <Check className="w-3.5 h-3.5" />
          ) : (
            <Plus className="w-3.5 h-3.5" />
          )}
          {inList ? "Added" : "Add to My Goals"}
        </button>
      </div>
    </div>
  );
}

// ─── Browse Tab ──────────────────────────────────────────────

function BrowseTab({
  onCopy,
  onAddToList,
  copiedId,
  savedGoalIds,
}: {
  onCopy: (id: string, text: string) => void;
  onAddToList: (goal: IEPGoal) => void;
  copiedId: string | null;
  savedGoalIds: Set<number>;
}) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedGrade, setSelectedGrade] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);

  const filteredGoals = useMemo(() => {
    return goals.filter((g) => {
      if (selectedCategory !== "All" && g.category !== selectedCategory) return false;
      if (selectedGrade !== "All" && !g.gradeLevel.includes(selectedGrade as typeof gradeLevels[number])) return false;
      if (search) {
        const s = search.toLowerCase();
        return (
          g.goal.toLowerCase().includes(s) ||
          g.subcategory.toLowerCase().includes(s) ||
          g.category.toLowerCase().includes(s) ||
          g.behavior.toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [search, selectedCategory, selectedGrade]);

  return (
    <div>
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search goals (e.g., aggression, coping, on-task...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-10 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-bs-primary/30 outline-none text-sm shadow-sm"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filters */}
      <button
        className="sm:hidden flex items-center gap-2 mb-4 text-sm font-medium text-bs-primary"
        onClick={() => setShowFilters(!showFilters)}
      >
        <Filter className="w-4 h-4" />
        Filters
        {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      <div className={`${showFilters ? "flex" : "hidden"} sm:flex flex-wrap gap-3 mb-6`}>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:ring-2 focus:ring-bs-primary/30 outline-none"
        >
          <option value="All">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:ring-2 focus:ring-bs-primary/30 outline-none"
        >
          <option value="All">All Grade Levels</option>
          {gradeLevels.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <span className="flex items-center text-sm text-slate-500 ml-auto">
          {filteredGoals.length} goal{filteredGoals.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Goal list */}
      {filteredGoals.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-500">No goals match your search. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredGoals.map((goal) => (
            <div key={goal.id}>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-bs-primary/10 text-bs-primary">
                  {goal.category}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-bs-accent/20 text-bs-accent">
                  {goal.subcategory}
                </span>
                {goal.gradeLevel.map((gl) => (
                  <span
                    key={gl}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600"
                  >
                    {gl}
                  </span>
                ))}
              </div>
              <GoalCard
                goal={goal}
                onCopy={onCopy}
                onAddToList={() => onAddToList(goal)}
                copiedId={copiedId}
                inList={savedGoalIds.has(goal.id)}
                cardId={`bank-${goal.id}`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Generate Tab ─────────────────────────────────────────────

const behaviorAreaOptions = [
  "Behavior Reduction — Aggression",
  "Behavior Reduction — Elopement",
  "Behavior Reduction — Self-Injury",
  "Behavior Reduction — Task Refusal",
  "Behavior Reduction — Disruption",
  "Behavior Reduction — Property Destruction",
  "Behavior Reduction — Non-Compliance",
  "Behavior Reduction — Inappropriate Language",
  "Social Skills — Peer Interaction",
  "Social Skills — Conversation Skills",
  "Social Skills — Cooperation",
  "Social Skills — Personal Space / Boundaries",
  "Self-Regulation — Emotional Regulation",
  "Self-Regulation — Coping Strategies",
  "Self-Regulation — Anger Management",
  "Self-Regulation — Frustration Tolerance",
  "Self-Regulation — Self-Monitoring",
  "Communication — Requesting",
  "Communication — Protesting Appropriately",
  "Communication — Functional Communication",
  "Communication — Asking for Help",
  "Academic Engagement — On-Task Behavior",
  "Academic Engagement — Work Completion",
  "Academic Engagement — Following Directions",
  "Daily Living / Independence — Transitions",
  "Daily Living / Independence — Self-Care",
  "Daily Living / Independence — Organizational Skills",
];

function GenerateTab({
  onCopy,
  onAddToList,
  copiedId,
  savedGoalKeys,
}: {
  onCopy: (id: string, text: string) => void;
  onAddToList: (goal: GeneratedGoal) => void;
  copiedId: string | null;
  savedGoalKeys: Set<string>;
}) {
  const [behaviorArea, setBehaviorArea] = useState("");
  const [gradeLevel, setGradeLevel] = useState("Elementary");
  const [specificConcern, setSpecificConcern] = useState("");
  const [studentDescription, setStudentDescription] = useState("");
  const [generatedGoals, setGeneratedGoals] = useState<GeneratedGoal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!behaviorArea) {
      setError("Please select a behavior area.");
      return;
    }
    setError("");
    setLoading(true);
    setGeneratedGoals([]);

    try {
      const res = await fetch("/api/iep-goal-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          behaviorArea,
          gradeLevel,
          specificConcern,
          studentDescription,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Failed to generate goals. Please try again.");
        return;
      }

      setGeneratedGoals(data.goals);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900 mb-5">
          Describe what you need
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Behavior Area <span className="text-red-500">*</span>
            </label>
            <select
              value={behaviorArea}
              onChange={(e) => setBehaviorArea(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:ring-2 focus:ring-bs-primary/30 outline-none"
            >
              <option value="">Select a behavior area...</option>
              {behaviorAreaOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Grade Level
            </label>
            <select
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:ring-2 focus:ring-bs-primary/30 outline-none"
            >
              {gradeLevels.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Specific concern{" "}
              <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g., hits peers when told to stop preferred activity"
              value={specificConcern}
              onChange={(e) => setSpecificConcern(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:ring-2 focus:ring-bs-primary/30 outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Student context{" "}
              <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g., 2nd grade, autism diagnosis, general education classroom with pullout support"
              value={studentDescription}
              onChange={(e) => setStudentDescription(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:ring-2 focus:ring-bs-primary/30 outline-none"
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading || !behaviorArea}
          className="mt-5 inline-flex items-center gap-2 px-6 py-3 bg-bs-primary text-white font-semibold rounded-xl hover:bg-bs-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating goals...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate 3 IEP Goals
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {generatedGoals.length > 0 && (
        <div>
          <p className="text-sm text-slate-500 mb-4">
            {generatedGoals.length} goals generated — review, copy, or add to your goal list below.
          </p>
          <div className="grid gap-4">
            {generatedGoals.map((goal, i) => (
              <GoalCard
                key={i}
                goal={goal}
                onCopy={onCopy}
                onAddToList={() => onAddToList(goal)}
                copiedId={copiedId}
                inList={savedGoalKeys.has(goal.goal)}
                cardId={`gen-${i}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── My Goals Panel ───────────────────────────────────────────

interface SavedGoal {
  id: string;
  condition: string;
  behavior: string;
  criteria: string;
  goal: string;
}

function MyGoalsPanel({
  savedGoals,
  onRemove,
  onDownload,
  goalCount,
}: {
  savedGoals: SavedGoal[];
  onRemove: (id: string) => void;
  onDownload: () => void;
  goalCount: number;
}) {
  if (savedGoals.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
        <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-3" />
        <p className="text-sm font-medium text-slate-600 mb-1">No goals saved yet</p>
        <p className="text-xs text-slate-400">
          Browse or generate goals, then click "Add to My Goals"
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-800">
          My Goals ({savedGoals.length})
        </span>
        {goalCount >= 3 && (
          <button
            onClick={onDownload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-bs-accent text-bs-primary rounded-lg hover:bg-bs-accent/90 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </button>
        )}
      </div>
      <div className="divide-y divide-slate-100">
        {savedGoals.map((g) => (
          <div key={g.id} className="px-5 py-4 flex items-start gap-3">
            <p className="text-xs text-slate-600 leading-relaxed flex-1 line-clamp-3">
              {g.goal}
            </p>
            <button
              onClick={() => onRemove(g.id)}
              className="shrink-0 text-slate-300 hover:text-red-500 transition-colors mt-0.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
      {goalCount < 3 && savedGoals.length > 0 && (
        <div className="px-5 py-3 bg-slate-50 text-xs text-slate-500 border-t border-slate-100">
          Add {3 - goalCount} more goal{3 - goalCount !== 1 ? "s" : ""} to unlock PDF download
        </div>
      )}
    </div>
  );
}

// ─── Email Gate Modal ──────────────────────────────────────────

function EmailGateModal({
  onSubmit,
  onClose,
}: {
  onSubmit: (email: string) => void;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await fetch("/api/collect-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "iep-goal-writer" }),
      });
    } catch {
      // Non-blocking
    }
    setLoading(false);
    onSubmit(email);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-full bg-bs-primary/10 flex items-center justify-center mb-5">
          <Download className="w-6 h-6 text-bs-primary" />
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-2">
          Download your goals as PDF
        </h2>
        <p className="text-sm text-slate-600 mb-6">
          Enter your email to download your {3}+ saved goals as a formatted PDF — free, no credit card required.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="you@school.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-bs-primary/30 outline-none text-sm"
            autoFocus
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-bs-primary text-white font-semibold rounded-xl hover:bg-bs-primary/90 disabled:opacity-60 transition-colors"
          >
            {loading ? "Sending..." : "Download My Goals — Free"}
          </button>
          <p className="text-xs text-slate-400 text-center">
            We respect your privacy. Unsubscribe any time.
          </p>
        </form>
      </div>
    </div>
  );
}

// ─── PDF Generation ───────────────────────────────────────────

function generatePDFContent(goals: SavedGoal[]): string {
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const goalsText = goals
    .map(
      (g, i) =>
        `Goal ${i + 1}\n\nCondition: ${g.condition}\nBehavior: ${g.behavior}\nCriteria: ${g.criteria}\n\nFull Goal:\n${g.goal}`
    )
    .join("\n\n---\n\n");

  return `IEP Goal Summary\nGenerated by Behavior School\n${date}\n\n${"=".repeat(50)}\n\n${goalsText}`;
}

// ─── Main Component ────────────────────────────────────────────

export default function UnifiedGoalWriterClient() {
  const [activeTab, setActiveTab] = useState<Tab>("browse");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedGoals, setSavedGoals] = useState<SavedGoal[]>([]);
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const addCount = useRef(0);

  // Load state from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("iep-goal-writer-goals");
      if (stored) setSavedGoals(JSON.parse(stored));
      const submitted = localStorage.getItem("iep-goal-writer-email-submitted");
      if (submitted === "true") setEmailSubmitted(true);
    } catch {}
  }, []);

  // Persist saved goals
  useEffect(() => {
    try {
      localStorage.setItem("iep-goal-writer-goals", JSON.stringify(savedGoals));
    } catch {}
  }, [savedGoals]);

  const handleCopy = useCallback((id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const handleAddToList = useCallback(
    (goal: { condition: string; behavior: string; criteria: string; goal: string }) => {
      setSavedGoals((prev) => {
        if (prev.some((g) => g.goal === goal.goal)) return prev;
        const newGoal: SavedGoal = {
          id: `${Date.now()}-${Math.random()}`,
          ...goal,
        };
        const updated = [...prev, newGoal];
        addCount.current += 1;

        // Trigger email gate after 3 adds if not already submitted
        if (updated.length >= 3 && !emailSubmitted) {
          setTimeout(() => setShowEmailGate(true), 400);
        }

        return updated;
      });
    },
    [emailSubmitted]
  );

  const handleRemove = useCallback((id: string) => {
    setSavedGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const handleDownload = useCallback(() => {
    if (!emailSubmitted) {
      setShowEmailGate(true);
      return;
    }
    triggerDownload();
  }, [emailSubmitted, savedGoals]);

  const triggerDownload = useCallback(() => {
    const content = generatePDFContent(savedGoals);
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `IEP-Goals-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [savedGoals]);

  const handleEmailSubmit = useCallback(
    (email: string) => {
      setEmailSubmitted(true);
      localStorage.setItem("iep-goal-writer-email-submitted", "true");
      localStorage.setItem("iep-goal-writer-email", email);
      setShowEmailGate(false);
      setTimeout(triggerDownload, 300);
    },
    [triggerDownload]
  );

  const savedGoalIds = useMemo(
    () => new Set(savedGoals.filter((g) => g.id.startsWith("bank-")).map((g) => parseInt(g.id.replace("bank-", "")))),
    [savedGoals]
  );

  // For bank goals, track by original goal id
  const bankSavedIds = useMemo(() => {
    const ids = new Set<number>();
    savedGoals.forEach((g) => {
      // Match bank goals by goal text against the goals array
      const match = goals.find((bg) => bg.goal === g.goal);
      if (match) ids.add(match.id);
    });
    return ids;
  }, [savedGoals]);

  const generatedSavedKeys = useMemo(
    () => new Set(savedGoals.map((g) => g.goal)),
    [savedGoals]
  );

  return (
    <div className="min-h-screen bg-bs-background">
      {/* Hero */}
      <section className="bg-bs-primary text-white py-14 sm:py-18">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            IEP Goal Writer
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto">
            Browse 120+ pre-written goals or generate custom goals with AI — all in proper
            condition/behavior/criteria format. Free for educators and BCBAs.
          </p>
        </div>
      </section>

      {/* Tab Bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex">
            <button
              onClick={() => setActiveTab("browse")}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === "browse"
                  ? "border-bs-primary text-bs-primary"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Browse Goals
            </button>
            <button
              onClick={() => setActiveTab("generate")}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === "generate"
                  ? "border-bs-primary text-bs-primary"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Generate Goals
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
          {/* Main Panel */}
          <div>
            {activeTab === "browse" && (
              <BrowseTab
                onCopy={handleCopy}
                onAddToList={handleAddToList}
                copiedId={copiedId}
                savedGoalIds={bankSavedIds}
              />
            )}
            {activeTab === "generate" && (
              <GenerateTab
                onCopy={handleCopy}
                onAddToList={handleAddToList}
                copiedId={copiedId}
                savedGoalKeys={generatedSavedKeys}
              />
            )}
          </div>

          {/* Sidebar: My Goals */}
          <div className="lg:sticky lg:top-[57px]">
            <h2 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">
              My Goal List
            </h2>
            <MyGoalsPanel
              savedGoals={savedGoals}
              onRemove={handleRemove}
              onDownload={handleDownload}
              goalCount={savedGoals.length}
            />

            {savedGoals.length >= 3 && !emailSubmitted && (
              <button
                onClick={() => setShowEmailGate(true)}
                className="mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-bs-accent text-bs-primary font-semibold rounded-xl hover:bg-bs-accent/90 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Download as PDF
              </button>
            )}

            {savedGoals.length >= 3 && emailSubmitted && (
              <button
                onClick={triggerDownload}
                className="mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-bs-accent text-bs-primary font-semibold rounded-xl hover:bg-bs-accent/90 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Download as PDF
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Email Gate Modal */}
      {showEmailGate && (
        <EmailGateModal
          onSubmit={handleEmailSubmit}
          onClose={() => setShowEmailGate(false)}
        />
      )}
    </div>
  );
}
