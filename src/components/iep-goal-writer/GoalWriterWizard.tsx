"use client";

import { useState, useCallback } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Copy,
  Check,
  Download,
  RotateCcw,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { ProgressIndicator } from "./ProgressIndicator";

const steps = [
  "Behavior Area",
  "Grade Level",
  "Setting",
  "Specific Concern",
  "Baseline",
  "Review & Generate",
];

const behaviorAreas = [
  "Aggression — Physical",
  "Aggression — Verbal",
  "Elopement / Running",
  "Self-Injurious Behavior",
  "Task Refusal / Non-Compliance",
  "Disruption / Off-Task",
  "Emotional Dysregulation",
  "Peer Interaction / Social Skills",
  "Conversation / Communication",
  "Anger Management",
  "Frustration Tolerance",
  "On-Task / Work Completion",
  "Self-Monitoring",
  "Transitions",
  "Following Directions",
  "Requesting / Functional Communication",
];

const gradeLevels = ["PreK", "Elementary (K-5)", "Middle (6-8)", "High (9-12)"];

const settings = [
  "General Education Classroom",
  "Special Education Classroom",
  "Cafeteria / Lunch",
  "Recess / Unstructured Time",
  "Hallway / Transitions",
  "All School Settings",
  "Community / Vocational Setting",
];

interface WizardData {
  behaviorArea: string;
  gradeLevel: string;
  setting: string;
  specificConcern: string;
  baseline: string;
  studentContext: string;
}

interface GeneratedGoal {
  condition: string;
  behavior: string;
  criteria: string;
  goal: string;
}

const initialData: WizardData = {
  behaviorArea: "",
  gradeLevel: "Elementary (K-5)",
  setting: "General Education Classroom",
  specificConcern: "",
  baseline: "",
  studentContext: "",
};

function StepContent({
  step,
  data,
  onChange,
}: {
  step: number;
  data: WizardData;
  onChange: (updates: Partial<WizardData>) => void;
}) {
  if (step === 0) {
    return (
      <div>
        <p className="text-sm text-slate-600 mb-4">
          Select the primary behavior area this goal will address.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {behaviorAreas.map((area) => (
            <button
              key={area}
              onClick={() => onChange({ behaviorArea: area })}
              className={`text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                data.behaviorArea === area
                  ? "border-[#1f4d3f] bg-[#1f4d3f]/5 text-[#1f4d3f] font-medium"
                  : "border-slate-200 text-slate-700 hover:border-slate-300"
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div>
        <p className="text-sm text-slate-600 mb-4">
          Select the grade level. This affects language and expectations in the goal.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {gradeLevels.map((level) => (
            <button
              key={level}
              onClick={() => onChange({ gradeLevel: level })}
              className={`text-left px-4 py-4 rounded-lg border text-sm transition-colors ${
                data.gradeLevel === level
                  ? "border-[#1f4d3f] bg-[#1f4d3f]/5 text-[#1f4d3f] font-medium"
                  : "border-slate-200 text-slate-700 hover:border-slate-300"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div>
        <p className="text-sm text-slate-600 mb-4">
          Where does the target behavior most frequently occur?
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {settings.map((s) => (
            <button
              key={s}
              onClick={() => onChange({ setting: s })}
              className={`text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                data.setting === s
                  ? "border-[#1f4d3f] bg-[#1f4d3f]/5 text-[#1f4d3f] font-medium"
                  : "border-slate-200 text-slate-700 hover:border-slate-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Specific concern <span className="text-slate-400 font-normal">(optional but recommended)</span>
          </label>
          <textarea
            rows={3}
            placeholder="e.g., hits peers when denied access to preferred activity during morning work"
            value={data.specificConcern}
            onChange={(e) => onChange({ specificConcern: e.target.value })}
            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:ring-2 focus:ring-[#1f4d3f]/30 outline-none resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Student context <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g., autism diagnosis, verbal, 1:1 aide support"
            value={data.studentContext}
            onChange={(e) => onChange({ studentContext: e.target.value })}
            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:ring-2 focus:ring-[#1f4d3f]/30 outline-none"
          />
        </div>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div>
        <p className="text-sm text-slate-600 mb-4">
          Enter baseline data if available. This helps generate data-driven criteria.
        </p>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Baseline data <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <textarea
          rows={3}
          placeholder="e.g., currently engages in physical aggression an average of 4-5 times per day per behavior tracking log (10/1-10/14)"
          value={data.baseline}
          onChange={(e) => onChange({ baseline: e.target.value })}
          className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:ring-2 focus:ring-[#1f4d3f]/30 outline-none resize-none"
        />
        <p className="mt-2 text-xs text-slate-400">
          Tip: Include the data collection method (frequency count, duration, ABC) and date range.
        </p>
      </div>
    );
  }

  if (step === 5) {
    return (
      <div className="space-y-3 text-sm">
        <p className="text-slate-600">Review your inputs before generating the goal.</p>
        <div className="rounded-xl bg-slate-50 border border-slate-200 divide-y divide-slate-200">
          {([
            ["Behavior Area", data.behaviorArea],
            ["Grade Level", data.gradeLevel],
            ["Primary Setting", data.setting],
            data.specificConcern ? ["Specific Concern", data.specificConcern] : null,
            data.baseline ? ["Baseline Data", data.baseline] : null,
            data.studentContext ? ["Student Context", data.studentContext] : null,
          ] as ([string, string] | null)[])
            .filter((item): item is [string, string] => item !== null)
            .map(([label, value]) => (
              <div key={label} className="flex gap-3 px-4 py-3">
                <span className="font-medium text-slate-700 w-36 shrink-0">{label}</span>
                <span className="text-slate-600">{value}</span>
              </div>
            ))}
        </div>
      </div>
    );
  }

  return null;
}

export function GoalWriterWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<WizardData>(initialData);
  const [generatedGoals, setGeneratedGoals] = useState<GeneratedGoal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleChange = useCallback((updates: Partial<WizardData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const isStepValid = [
    !!data.behaviorArea,
    !!data.gradeLevel,
    !!data.setting,
    true,
    true,
    true,
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep((p) => p + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((p) => p - 1);
  };

  const handleGenerate = async () => {
    setError("");
    setLoading(true);
    setGeneratedGoals([]);
    try {
      const res = await fetch("/api/iep-goal-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          behaviorArea: data.behaviorArea,
          gradeLevel: data.gradeLevel,
          specificConcern: [
            data.setting !== "General Education Classroom" ? "Setting: " + data.setting : "",
            data.specificConcern,
            data.baseline ? "Baseline: " + data.baseline : "",
          ].filter(Boolean).join(". "),
          studentDescription: data.studentContext,
        }),
      });
      const json = await res.json();
      if (!res.ok || json.error) {
        setError(json.error || "Failed to generate goals. Please try again.");
        return;
      }
      setGeneratedGoals(json.goals || []);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = () => {
    const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const content = [
      "IEP Behavior Goals\nGenerated by Behavior School\n" + date + "\n",
      "Behavior Area: " + data.behaviorArea,
      "Grade Level: " + data.gradeLevel,
      "Setting: " + data.setting,
      "",
      "=".repeat(50),
      "",
      ...generatedGoals.map(
        (g, i) =>
          "Goal " + (i + 1) + "\n\nCondition: " + g.condition + "\nBehavior: " + g.behavior + "\nCriteria: " + g.criteria + "\n\nFull Goal:\n" + g.goal
      ),
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "IEP-Goals-" + new Date().toISOString().split("T")[0] + ".txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setData(initialData);
    setCurrentStep(0);
    setGeneratedGoals([]);
    setError("");
  };

  const showResults = generatedGoals.length > 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 pt-6 pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#1f4d3f]">
            Step {currentStep + 1} of {steps.length}
          </span>
          {showResults && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Start over
            </button>
          )}
        </div>
        <ProgressIndicator steps={steps} currentStep={currentStep} />
        <h2 className="mt-4 text-lg font-semibold text-slate-900">{steps[currentStep]}</h2>
      </div>

      <div className="px-6 py-6">
        {!showResults ? (
          <>
            <StepContent step={currentStep} data={data} onChange={handleChange} />

            {error && (
              <div className="mt-4 flex items-start gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>

              {currentStep < steps.length - 1 ? (
                <button
                  onClick={handleNext}
                  disabled={!isStepValid[currentStep]}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold bg-[#1f4d3f] text-white rounded-lg hover:bg-[#1f4d3f]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-[#1f4d3f] text-white rounded-lg hover:bg-[#1f4d3f]/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Goals"
                  )}
                </button>
              )}
            </div>
          </>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-600">
                {generatedGoals.length} goals generated
              </p>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#e4b63d] text-[#1f4d3f] rounded-lg hover:bg-[#e4b63d]/90 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download All
              </button>
            </div>

            <div className="grid gap-4">
              {generatedGoals.map((goal, i) => (
                <div
                  key={i}
                  className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-2 text-sm"
                >
                  <p>
                    <span className="font-semibold text-[#1f4d3f]">Condition:</span>{" "}
                    {goal.condition}
                  </p>
                  <p>
                    <span className="font-semibold text-[#1f4d3f]">Behavior:</span>{" "}
                    {goal.behavior}
                  </p>
                  <p>
                    <span className="font-semibold text-[#1f4d3f]">Criteria:</span>{" "}
                    {goal.criteria}
                  </p>
                  <div className="pt-2 border-t border-slate-200">
                    <p className="text-slate-700 leading-relaxed italic">{goal.goal}</p>
                  </div>
                  <button
                    onClick={() => handleCopy("gen-" + i, goal.goal)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 hover:bg-white transition-colors text-slate-600"
                  >
                    {copiedId === "gen-" + i ? (
                      <Check className="w-3.5 h-3.5 text-green-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    {copiedId === "gen-" + i ? "Copied!" : "Copy Goal"}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Generate New Goals
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
