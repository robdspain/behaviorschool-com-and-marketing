"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  ArrowLeft, ArrowRight, Play, Pause, RotateCcw, Plus, Trash2, 
  BarChart3, Target, Clock, AlertTriangle, CheckCircle, User,
  Brain, Heart, Zap, Shield
} from "lucide-react";

// Types
interface QuestionnaireAnswers {
  studentName: string;
  grade: string;
  // Inner + Away (difficult thoughts/feelings)
  difficultThoughts: string[];
  difficultFeelings: string[];
  // Inner + Toward (values, what matters)
  values: string[];
  whatMatters: string;
  // Outer + Away (avoidance behaviors)
  avoidanceBehaviors: string[];
  // Outer + Toward (values-consistent actions)
  towardBehaviors: string[];
  // Direct verbal statements
  selfStatements: string[];
}

interface Statement {
  id: string;
  text: string;
  context: string;
  source: "questionnaire" | "manual";
  validatingLatency: number | null;
  challengingLatency: number | null;
}

type Step = "questionnaire" | "matrix" | "context" | "statements" | "fusion-fa" | "results";

const CONTEXT_OPTIONS = [
  "During math class",
  "During reading/writing",
  "When given a new assignment",
  "When asked to work with others",
  "During transitions",
  "At recess/lunch",
  "When corrected by teacher",
  "When struggling with work",
  "When called on in class",
  "When peers are watching",
  "In the morning",
  "After lunch",
  "During tests",
];

// Examples shown as hints (not clickable options)
const DIFFICULT_THOUGHTS_EXAMPLES = [
  "I'm going to fail",
  "Nobody likes me",
  "I can't do anything right",
];

const DIFFICULT_FEELINGS_EXAMPLES = [
  "Worried/Anxious",
  "Angry/Frustrated",
  "Overwhelmed",
];

const VALUES_EXAMPLES = [
  "Family",
  "Learning new things",
  "Being helpful",
];

const AVOIDANCE_EXAMPLES = [
  "Leave the classroom",
  "Shut down/go quiet",
  "Refuse to work",
];

export default function FusionFAWorkflow() {
  const [step, setStep] = useState<Step>("questionnaire");
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({
    studentName: "",
    grade: "",
    difficultThoughts: [],
    difficultFeelings: [],
    values: [],
    whatMatters: "",
    avoidanceBehaviors: [],
    towardBehaviors: [],
    selfStatements: [],
  });
  const [customThought, setCustomThought] = useState("");
  const [customFeeling, setCustomFeeling] = useState("");
  const [customValue, setCustomValue] = useState("");
  const [customAvoidance, setCustomAvoidance] = useState("");
  const [customStatement, setCustomStatement] = useState("");
  const [statements, setStatements] = useState<Statement[]>([]);
  const [activeTimer, setActiveTimer] = useState<{ statementId: string; condition: "validating" | "challenging" } | null>(null);
  const [timerValue, setTimerValue] = useState(0);
  const [timerInterval, setTimerIntervalState] = useState<NodeJS.Timeout | null>(null);

  // Toggle selection helpers
  const toggleSelection = (field: keyof QuestionnaireAnswers, value: string) => {
    const current = answers[field] as string[];
    if (current.includes(value)) {
      setAnswers({ ...answers, [field]: current.filter(v => v !== value) });
    } else {
      setAnswers({ ...answers, [field]: [...current, value] });
    }
  };

  const addCustomThought = () => {
    if (customThought.trim() && !answers.difficultThoughts.includes(customThought.trim())) {
      setAnswers({ 
        ...answers, 
        difficultThoughts: [...answers.difficultThoughts, customThought.trim()] 
      });
      setCustomThought("");
    }
  };

  // Move to context step - extract statements from questionnaire
  const extractStatements = () => {
    const extracted: Statement[] = answers.difficultThoughts.map((thought, idx) => ({
      id: `q-${idx}`,
      text: thought,
      context: "",
      source: "questionnaire" as const,
      validatingLatency: null,
      challengingLatency: null,
    }));
    // Add any direct self-statements
    answers.selfStatements.forEach((stmt, idx) => {
      extracted.push({
        id: `s-${idx}`,
        text: stmt,
        context: "",
        source: "questionnaire" as const,
        validatingLatency: null,
        challengingLatency: null,
      });
    });
    setStatements(extracted);
    setStep("context");
  };

  // Update context for a statement
  const updateStatementContext = (id: string, context: string) => {
    setStatements(statements.map(s => s.id === id ? { ...s, context } : s));
  };

  // Timer functions
  const startTimer = (statementId: string, condition: "validating" | "challenging") => {
    if (timerInterval) clearInterval(timerInterval);
    setActiveTimer({ statementId, condition });
    setTimerValue(0);
    const interval = setInterval(() => {
      setTimerValue(v => v + 0.1);
    }, 100);
    setTimerIntervalState(interval);
  };

  const stopTimer = () => {
    if (timerInterval) clearInterval(timerInterval);
    if (activeTimer) {
      setStatements(statements.map(s => {
        if (s.id === activeTimer.statementId) {
          return {
            ...s,
            [activeTimer.condition === "validating" ? "validatingLatency" : "challengingLatency"]: Math.round(timerValue * 10) / 10
          };
        }
        return s;
      }));
    }
    setActiveTimer(null);
    setTimerIntervalState(null);
  };

  const addManualStatement = () => {
    if (customStatement.trim()) {
      setStatements([...statements, {
        id: `m-${Date.now()}`,
        text: customStatement.trim(),
        context: "",
        source: "manual",
        validatingLatency: null,
        challengingLatency: null,
      }]);
      setCustomStatement("");
    }
  };

  const removeStatement = (id: string) => {
    setStatements(statements.filter(s => s.id !== id));
  };

  const getResults = () => {
    return statements
      .filter(s => s.validatingLatency !== null && s.challengingLatency !== null)
      .map(s => ({
        ...s,
        delta: (s.validatingLatency || 0) - (s.challengingLatency || 0),
      }))
      .sort((a, b) => b.delta - a.delta);
  };

  const getFusionLevel = (delta: number) => {
    if (delta >= 30) return { level: "High", color: "text-red-400", bg: "bg-red-500/20", priority: true };
    if (delta >= 15) return { level: "Moderate", color: "text-yellow-400", bg: "bg-yellow-500/20", priority: false };
    return { level: "Low", color: "text-green-400", bg: "bg-green-500/20", priority: false };
  };

  const allComplete = statements.length > 0 && statements.every(s => s.validatingLatency !== null && s.challengingLatency !== null);

  // Step indicator
  const steps = [
    { id: "questionnaire", label: "Questionnaire", icon: User },
    { id: "matrix", label: "ACT Matrix", icon: Brain },
    { id: "context", label: "Context", icon: Target },
    { id: "statements", label: "Review", icon: CheckCircle },
    { id: "fusion-fa", label: "Fusion FA", icon: Clock },
    { id: "results", label: "Results", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pt-20 pb-6 px-4">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/calaba-2026/assessment-tools"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Assessment Tools
          </Link>
          
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-cyan-300">
            Fusion Hierarchy Assessment Workflow
          </h1>
          <p className="text-slate-300 text-sm">
            Complete student questionnaire → ACT Matrix → Latency-based functional analysis
          </p>
        </div>
      </section>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between bg-slate-800/50 rounded-xl p-3">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isActive = s.id === step;
            const isPast = steps.findIndex(x => x.id === step) > idx;
            return (
              <div key={s.id} className="flex items-center">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  isActive ? "bg-cyan-500/20 text-cyan-300" : 
                  isPast ? "text-emerald-400" : "text-slate-500"
                }`}>
                  {isPast ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  <span className="text-xs font-medium hidden sm:inline">{s.label}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-1 ${isPast ? "bg-emerald-500" : "bg-slate-700"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        
        {/* STEP 1: Questionnaire */}
        {step === "questionnaire" && (
          <div className="space-y-6">
            {/* Student Info */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-cyan-400" /> Student Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Student Name/ID</label>
                  <input
                    type="text"
                    value={answers.studentName}
                    onChange={(e) => setAnswers({ ...answers, studentName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white"
                    placeholder="Enter name or ID"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Grade</label>
                  <select
                    value={answers.grade}
                    onChange={(e) => setAnswers({ ...answers, grade: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="">Select grade</option>
                    {["K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].map(g => (
                      <option key={g} value={g}>{g === "K" ? "Kindergarten" : `Grade ${g}`}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Difficult Thoughts (Inner + Away) */}
            <div className="bg-slate-800 border border-red-500/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" /> Difficult Thoughts
              </h3>
              <p className="text-slate-400 text-sm mb-2">
                "What thoughts show up that make things hard for you at school?"
              </p>
              <p className="text-slate-500 text-xs mb-4 italic">
                Examples: "{DIFFICULT_THOUGHTS_EXAMPLES.join('", "')}"
              </p>
              
              {/* Recorded thoughts */}
              {answers.difficultThoughts.length > 0 && (
                <div className="mb-4 space-y-2">
                  {answers.difficultThoughts.map((thought, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-red-500/20 border border-red-500/30 rounded-lg px-4 py-2">
                      <span className="text-red-200">"{thought}"</span>
                      <button
                        onClick={() => setAnswers({ ...answers, difficultThoughts: answers.difficultThoughts.filter((_, i) => i !== idx) })}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customThought}
                  onChange={(e) => setCustomThought(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCustomThought()}
                  placeholder="Type a thought the student shared..."
                  className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white text-sm"
                />
                <button
                  onClick={addCustomThought}
                  className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Difficult Feelings */}
            <div className="bg-slate-800 border border-orange-500/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <Heart className="w-5 h-5 text-orange-400" /> Difficult Feelings
              </h3>
              <p className="text-slate-400 text-sm mb-2">
                "What feelings show up that are hard to deal with?"
              </p>
              <p className="text-slate-500 text-xs mb-4 italic">
                Examples: {DIFFICULT_FEELINGS_EXAMPLES.join(", ")}
              </p>
              
              {/* Recorded feelings */}
              {answers.difficultFeelings.length > 0 && (
                <div className="mb-4 space-y-2">
                  {answers.difficultFeelings.map((feeling, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-orange-500/20 border border-orange-500/30 rounded-lg px-4 py-2">
                      <span className="text-orange-200">{feeling}</span>
                      <button
                        onClick={() => setAnswers({ ...answers, difficultFeelings: answers.difficultFeelings.filter((_, i) => i !== idx) })}
                        className="text-orange-400 hover:text-orange-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customFeeling}
                  onChange={(e) => setCustomFeeling(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && customFeeling.trim()) {
                      setAnswers({ ...answers, difficultFeelings: [...answers.difficultFeelings, customFeeling.trim()] });
                      setCustomFeeling("");
                    }
                  }}
                  placeholder="Type a feeling the student described..."
                  className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white text-sm"
                />
                <button
                  onClick={() => {
                    if (customFeeling.trim()) {
                      setAnswers({ ...answers, difficultFeelings: [...answers.difficultFeelings, customFeeling.trim()] });
                      setCustomFeeling("");
                    }
                  }}
                  className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg text-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Values (Inner + Toward) */}
            <div className="bg-slate-800 border border-emerald-500/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-400" /> What Matters to You
              </h3>
              <p className="text-slate-400 text-sm mb-2">
                "What's important to you? What do you care about?"
              </p>
              <p className="text-slate-500 text-xs mb-4 italic">
                Examples: {VALUES_EXAMPLES.join(", ")}
              </p>
              
              {/* Recorded values */}
              {answers.values.length > 0 && (
                <div className="mb-4 space-y-2">
                  {answers.values.map((value, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-emerald-500/20 border border-emerald-500/30 rounded-lg px-4 py-2">
                      <span className="text-emerald-200">{value}</span>
                      <button
                        onClick={() => setAnswers({ ...answers, values: answers.values.filter((_, i) => i !== idx) })}
                        className="text-emerald-400 hover:text-emerald-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && customValue.trim()) {
                      setAnswers({ ...answers, values: [...answers.values, customValue.trim()] });
                      setCustomValue("");
                    }
                  }}
                  placeholder="Type what the student said matters to them..."
                  className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white text-sm"
                />
                <button
                  onClick={() => {
                    if (customValue.trim()) {
                      setAnswers({ ...answers, values: [...answers.values, customValue.trim()] });
                      setCustomValue("");
                    }
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Avoidance Behaviors (Outer + Away) */}
            <div className="bg-slate-800 border border-purple-500/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" /> What You Do When It Gets Hard
              </h3>
              <p className="text-slate-400 text-sm mb-2">
                "When those difficult thoughts and feelings show up, what do you usually do?"
              </p>
              <p className="text-slate-500 text-xs mb-4 italic">
                Examples: {AVOIDANCE_EXAMPLES.join(", ")}
              </p>
              
              {/* Recorded behaviors */}
              {answers.avoidanceBehaviors.length > 0 && (
                <div className="mb-4 space-y-2">
                  {answers.avoidanceBehaviors.map((behavior, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-purple-500/20 border border-purple-500/30 rounded-lg px-4 py-2">
                      <span className="text-purple-200">{behavior}</span>
                      <button
                        onClick={() => setAnswers({ ...answers, avoidanceBehaviors: answers.avoidanceBehaviors.filter((_, i) => i !== idx) })}
                        className="text-purple-400 hover:text-purple-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customAvoidance}
                  onChange={(e) => setCustomAvoidance(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && customAvoidance.trim()) {
                      setAnswers({ ...answers, avoidanceBehaviors: [...answers.avoidanceBehaviors, customAvoidance.trim()] });
                      setCustomAvoidance("");
                    }
                  }}
                  placeholder="Type what the student does when it gets hard..."
                  className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white text-sm"
                />
                <button
                  onClick={() => {
                    if (customAvoidance.trim()) {
                      setAnswers({ ...answers, avoidanceBehaviors: [...answers.avoidanceBehaviors, customAvoidance.trim()] });
                      setCustomAvoidance("");
                    }
                  }}
                  className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Next Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setStep("matrix")}
                disabled={answers.difficultThoughts.length === 0}
                className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2"
              >
                View ACT Matrix <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: ACT Matrix */}
        {step === "matrix" && (
          <div className="space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-cyan-400" /> {answers.studentName || "Student"}'s ACT Matrix
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Inner + Away */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <h4 className="text-red-400 font-bold text-sm uppercase tracking-wide mb-1">Inner + Away</h4>
                  <p className="text-slate-400 text-xs mb-3">Difficult thoughts & feelings</p>
                  <div className="space-y-1">
                    {answers.difficultThoughts.map(t => (
                      <div key={t} className="text-red-200 text-sm">• "{t}"</div>
                    ))}
                    {answers.difficultFeelings.map(f => (
                      <div key={f} className="text-red-200 text-sm">• {f}</div>
                    ))}
                    {answers.difficultThoughts.length === 0 && answers.difficultFeelings.length === 0 && (
                      <p className="text-slate-500 text-sm italic">No thoughts recorded</p>
                    )}
                  </div>
                </div>

                {/* Inner + Toward */}
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                  <h4 className="text-cyan-400 font-bold text-sm uppercase tracking-wide mb-1">Inner + Toward</h4>
                  <p className="text-slate-400 text-xs mb-3">Values & what matters</p>
                  <div className="space-y-1">
                    {answers.values.map(v => (
                      <div key={v} className="text-cyan-200 text-sm">• {v}</div>
                    ))}
                    {answers.values.length === 0 && (
                      <p className="text-slate-500 text-sm italic">No values recorded</p>
                    )}
                  </div>
                </div>

                {/* Outer + Away */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                  <h4 className="text-purple-400 font-bold text-sm uppercase tracking-wide mb-1">Outer + Away</h4>
                  <p className="text-slate-400 text-xs mb-3">Avoidance behaviors</p>
                  <div className="space-y-1">
                    {answers.avoidanceBehaviors.map(b => (
                      <div key={b} className="text-purple-200 text-sm">• {b}</div>
                    ))}
                    {answers.avoidanceBehaviors.length === 0 && (
                      <p className="text-slate-500 text-sm italic">No behaviors recorded</p>
                    )}
                  </div>
                </div>

                {/* Outer + Toward */}
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                  <h4 className="text-cyan-400 font-bold text-sm uppercase tracking-wide mb-1">Outer + Toward</h4>
                  <p className="text-slate-400 text-xs mb-3">Values-consistent actions</p>
                  <div className="text-slate-500 text-sm italic">
                    (Intervention targets — what we want to increase)
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={() => setStep("questionnaire")}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={extractStatements}
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2"
              >
                Extract Statements for FA <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Context Capture */}
        {step === "context" && (
          <div className="space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-400" /> Statement Context
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                For each statement, identify when/where the student typically makes this statement or when this thought occurs.
              </p>
              
              {/* Statement + Context Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-600">
                      <th className="text-left py-3 text-slate-400 text-sm font-medium w-1/2">Statement</th>
                      <th className="text-left py-3 text-slate-400 text-sm font-medium w-1/2">Context (When does this happen?)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statements.map(s => (
                      <tr key={s.id} className="border-b border-slate-700">
                        <td className="py-4 pr-4">
                          <span className="text-white">"{s.text}"</span>
                        </td>
                        <td className="py-4">
                          <div className="space-y-2">
                            <select
                              value={s.context}
                              onChange={(e) => updateStatementContext(s.id, e.target.value)}
                              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                            >
                              <option value="">Select context...</option>
                              {CONTEXT_OPTIONS.map(ctx => (
                                <option key={ctx} value={ctx}>{ctx}</option>
                              ))}
                              <option value="custom">Other (type below)</option>
                            </select>
                            {s.context === "custom" && (
                              <input
                                type="text"
                                placeholder="Describe the context..."
                                onChange={(e) => updateStatementContext(s.id, e.target.value)}
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Statement + Context Summary */}
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6">
              <h4 className="text-cyan-400 font-semibold mb-3">Statement-Context Summary</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-cyan-500/30">
                      <th className="text-left py-2 text-cyan-300">#</th>
                      <th className="text-left py-2 text-cyan-300">Verbal Statement</th>
                      <th className="text-left py-2 text-cyan-300">Context</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statements.map((s, idx) => (
                      <tr key={s.id} className="border-b border-slate-700">
                        <td className="py-2 text-white">{idx + 1}</td>
                        <td className="py-2 text-white">"{s.text}"</td>
                        <td className="py-2 text-slate-300">{s.context || <span className="text-slate-500 italic">Not specified</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={() => setStep("matrix")}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => setStep("statements")}
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2"
              >
                Review Statements <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Statement Review */}
        {step === "statements" && (
          <div className="space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-cyan-400" /> Review Statements
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                These verbal statements will be tested in validating vs. challenging conditions. 
                Remove any that don't apply or add more.
              </p>
              
              <div className="space-y-2 mb-4">
                {statements.map(s => (
                  <div key={s.id} className="flex items-center justify-between bg-slate-900 rounded-lg px-4 py-3">
                    <div>
                      <span className="text-white">"{s.text}"</span>
                      {s.context && <span className="text-slate-500 text-sm ml-2">— {s.context}</span>}
                    </div>
                    <button
                      onClick={() => removeStatement(s.id)}
                      className="text-slate-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={customStatement}
                  onChange={(e) => setCustomStatement(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addManualStatement()}
                  placeholder="Add another statement to test..."
                  className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white"
                />
                <button
                  onClick={addManualStatement}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={() => setStep("context")}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => setStep("fusion-fa")}
                disabled={statements.length === 0}
                className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2"
              >
                Start Fusion FA <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Fusion FA */}
        {step === "fusion-fa" && (
          <div className="space-y-6">
            {/* Protocol Info */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
              <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" /> Protocol
              </h3>
              <div className="text-sm text-slate-300 space-y-1">
                <p><strong className="text-green-400">Validating:</strong> "I hear you saying [statement]. That makes sense."</p>
                <p><strong className="text-red-400">Challenging:</strong> "I'm not sure that's true. What if [statement] isn't accurate?"</p>
                <p><strong className="text-cyan-400">Measure:</strong> Time to first precursor (posture shift, facial tension, self-talk)</p>
              </div>
            </div>

            {/* Statements with timers */}
            <div className="space-y-4">
              {statements.map((statement, idx) => (
                <div key={statement.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <span className="text-xs text-slate-500 mb-1 block">Statement {idx + 1}</span>
                      <p className="text-white font-medium">"{statement.text}"</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Validating */}
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                      <div className="text-xs text-green-400 font-medium mb-2">VALIDATING</div>
                      {statement.validatingLatency !== null ? (
                        <div className="text-2xl font-bold text-green-300">{statement.validatingLatency}s</div>
                      ) : activeTimer?.statementId === statement.id && activeTimer.condition === "validating" ? (
                        <div className="flex items-center gap-2">
                          <div className="text-2xl font-bold text-green-300">{timerValue.toFixed(1)}s</div>
                          <button
                            onClick={stopTimer}
                            className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                          >
                            <Pause className="w-3 h-3" /> Stop
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startTimer(statement.id, "validating")}
                          disabled={activeTimer !== null}
                          className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white px-3 py-2 rounded text-sm flex items-center gap-1"
                        >
                          <Play className="w-3 h-3" /> Start
                        </button>
                      )}
                    </div>

                    {/* Challenging */}
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                      <div className="text-xs text-red-400 font-medium mb-2">CHALLENGING</div>
                      {statement.challengingLatency !== null ? (
                        <div className="text-2xl font-bold text-red-300">{statement.challengingLatency}s</div>
                      ) : activeTimer?.statementId === statement.id && activeTimer.condition === "challenging" ? (
                        <div className="flex items-center gap-2">
                          <div className="text-2xl font-bold text-red-300">{timerValue.toFixed(1)}s</div>
                          <button
                            onClick={stopTimer}
                            className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                          >
                            <Pause className="w-3 h-3" /> Stop
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startTimer(statement.id, "challenging")}
                          disabled={activeTimer !== null}
                          className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white px-3 py-2 rounded text-sm flex items-center gap-1"
                        >
                          <Play className="w-3 h-3" /> Start
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={() => setStep("statements")}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              {allComplete && (
                <button
                  onClick={() => setStep("results")}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2"
                >
                  View Results <BarChart3 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 5: Results */}
        {step === "results" && (
          <div className="space-y-6">
            <div className="bg-slate-800 border-2 border-cyan-500 rounded-xl p-6">
              <h3 className="text-xl font-bold text-cyan-300 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" /> Fusion Hierarchy Results — {answers.studentName || "Student"}
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-600">
                      <th className="pb-3 text-slate-400 text-sm font-medium">Rank</th>
                      <th className="pb-3 text-slate-400 text-sm font-medium">Statement</th>
                      <th className="pb-3 text-slate-400 text-sm font-medium">Context</th>
                      <th className="pb-3 text-slate-400 text-sm font-medium text-center">Valid.</th>
                      <th className="pb-3 text-slate-400 text-sm font-medium text-center">Chall.</th>
                      <th className="pb-3 text-slate-400 text-sm font-medium text-center">Δ</th>
                      <th className="pb-3 text-slate-400 text-sm font-medium text-center">Fusion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getResults().map((result, idx) => {
                      const fusion = getFusionLevel(result.delta);
                      return (
                        <tr key={result.id} className="border-b border-slate-700">
                          <td className="py-3 text-white font-bold">{idx + 1}</td>
                          <td className="py-3 text-white">"{result.text}"</td>
                          <td className="py-3 text-slate-400 text-sm">{result.context || "—"}</td>
                          <td className="py-3 text-green-300 text-center">{result.validatingLatency}s</td>
                          <td className="py-3 text-red-300 text-center">{result.challengingLatency}s</td>
                          <td className="py-3 text-cyan-300 text-center font-bold">{result.delta.toFixed(1)}s</td>
                          <td className="py-3 text-center">
                            <span className={`${fusion.bg} ${fusion.color} px-2 py-1 rounded text-xs font-medium`}>
                              {fusion.level}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Intervention Targets */}
              <div className="mt-6 p-4 bg-slate-900/50 rounded-lg">
                <h4 className="font-semibold text-white mb-3">🎯 Priority Defusion Targets</h4>
                <div className="space-y-3">
                  {getResults().filter(r => getFusionLevel(r.delta).priority).map((r, idx) => (
                    <div key={r.id} className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                      <div className="flex items-center gap-3 text-red-300 font-medium">
                        <span className="font-bold">{idx + 1}.</span>
                        <span>"{r.text}"</span>
                        <span className="text-slate-500 text-sm">(Δ {r.delta.toFixed(1)}s)</span>
                      </div>
                      {r.context && (
                        <div className="text-slate-400 text-sm mt-1 ml-6">
                          Context: {r.context}
                        </div>
                      )}
                    </div>
                  ))}
                  {getResults().filter(r => getFusionLevel(r.delta).priority).length === 0 && (
                    <p className="text-slate-400 text-sm">No high-fusion statements identified. Consider retesting or adding more statements.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between">
              <button
                onClick={() => setStep("fusion-fa")}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => window.print()}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-medium"
              >
                Print Report
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-slate-500 text-sm">
        <p>CalABA 2026 Symposium — Fusion Hierarchy Assessment Demo</p>
        <p className="mt-1">Based on KCUSD Latency-Based FA Methodology</p>
      </footer>
    </div>
  );
}
