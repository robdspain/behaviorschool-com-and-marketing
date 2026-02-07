"use client";

import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  type GoalMode,
  type GoalInputs,
  type GeneratedGoal,
  behaviorCategories,
  gradeLevels,
  measurementMethods,
  masteryCriteriaOptions,
  consecutiveOptions,
  settingOptions,
  generateGoal,
} from "./goalTemplateEngine";

// ─── Steps ───────────────────────────────────────────────────
const steps = [
  { key: "mode", label: "Goal Type" },
  { key: "student", label: "Student Info" },
  { key: "behavior", label: "Behavior" },
  { key: "baseline", label: "Baseline" },
  { key: "target", label: "Target" },
  { key: "measurement", label: "Measurement" },
  { key: "mastery", label: "Mastery" },
  { key: "email", label: "Get Results" },
];

const defaultInputs: GoalInputs = {
  mode: "reduction",
  gradeLevel: "",
  ageRange: "",
  currentBehavior: "",
  behaviorCategory: "",
  baselineFrequency: "",
  baselineDuration: "",
  baselineIntensity: "",
  targetBehavior: "",
  replacementBehavior: "",
  measurementMethod: "frequency",
  masteryCriteria: "80",
  masteryConsecutive: "3-days",
  timelineWeeks: 36,
  settings: ["General education classroom"],
  additionalContext: "",
};

export function GoalGeneratorWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [inputs, setInputs] = useState<GoalInputs>(defaultInputs);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [generatedGoal, setGeneratedGoal] = useState<GeneratedGoal | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [emailError, setEmailError] = useState("");

  const update = useCallback(<K extends keyof GoalInputs>(key: K, value: GoalInputs[K]) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleSetting = useCallback((setting: string) => {
    setInputs(prev => ({
      ...prev,
      settings: prev.settings.includes(setting)
        ? prev.settings.filter(s => s !== setting)
        : [...prev.settings, setting],
    }));
  }, []);

  const isStepValid = useMemo(() => {
    const v: boolean[] = [];
    // 0: mode — always valid once mode is set
    v.push(!!inputs.mode);
    // 1: student info
    v.push(!!inputs.gradeLevel);
    // 2: behavior
    v.push(!!inputs.behaviorCategory && inputs.currentBehavior.trim().length > 3);
    // 3: baseline
    v.push(!!(inputs.baselineFrequency || inputs.baselineDuration || inputs.baselineIntensity));
    // 4: target
    v.push(
      inputs.mode === "reduction"
        ? inputs.replacementBehavior.trim().length > 3
        : inputs.targetBehavior.trim().length > 3
    );
    // 5: measurement
    v.push(!!inputs.measurementMethod);
    // 6: mastery
    v.push(!!inputs.masteryCriteria && !!inputs.masteryConsecutive && inputs.settings.length > 0);
    // 7: email
    v.push(true); // always allow proceeding
    return v;
  }, [inputs]);

  const handleNext = () => {
    if (currentStep < steps.length - 1 && isStepValid[currentStep]) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const handleEmailSubmit = () => {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    // Fire and forget — store in localStorage for now, can hook to API later
    try {
      const stored = JSON.parse(localStorage.getItem("bs_iep_emails") || "[]");
      stored.push({ email, timestamp: Date.now(), mode: inputs.mode });
      localStorage.setItem("bs_iep_emails", JSON.stringify(stored));
    } catch { /* ignore */ }
    setEmailSubmitted(true);
    const goal = generateGoal(inputs);
    setGeneratedGoal(goal);
  };

  const handleSkipEmail = () => {
    // Show partial results only
    setEmailSubmitted(true);
    const goal = generateGoal(inputs);
    setGeneratedGoal(goal);
  };

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch { /* ignore */ }
  };

  const handleReset = () => {
    setInputs(defaultInputs);
    setCurrentStep(0);
    setEmail("");
    setEmailSubmitted(false);
    setGeneratedGoal(null);
    setCopied(null);
  };

  const categories = behaviorCategories[inputs.mode];

  // ─── Render helpers ─────────────────────────────────────────

  const renderModeStep = () => (
    <div className="space-y-5">
      <p className="text-sm text-slate-600">What type of IEP goal do you need?</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {([
          { mode: "reduction" as GoalMode, title: "Problem Behavior Reduction", desc: "Goals for decreasing challenging behaviors", emoji: "📉", color: "rose" },
          { mode: "skill" as GoalMode, title: "Behavior Skill Increase", desc: "Goals for building new skills", emoji: "📈", color: "emerald" },
        ]).map(opt => (
          <button
            key={opt.mode}
            type="button"
            onClick={() => {
              update("mode", opt.mode);
              update("behaviorCategory", "");
            }}
            className={cn(
              "flex flex-col items-start gap-2 rounded-2xl border-2 p-5 text-left transition-all",
              inputs.mode === opt.mode
                ? "border-emerald-600 bg-emerald-50 shadow-md"
                : "border-slate-200 bg-white hover:border-emerald-300"
            )}
          >
            <span className="text-3xl">{opt.emoji}</span>
            <span className="text-base font-semibold text-slate-900">{opt.title}</span>
            <span className="text-sm text-slate-500">{opt.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStudentStep = () => (
    <div className="space-y-5">
      <p className="text-sm text-slate-600">Select the student&apos;s grade level.</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {gradeLevels.map(gl => (
          <button
            key={gl.value}
            type="button"
            onClick={() => update("gradeLevel", gl.value)}
            className={cn(
              "rounded-xl border px-4 py-3 text-sm font-medium transition",
              inputs.gradeLevel === gl.value
                ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300"
            )}
          >
            {gl.label}
          </button>
        ))}
      </div>
    </div>
  );

  const renderBehaviorStep = () => (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold text-slate-900">
          {inputs.mode === "reduction" ? "Select the problem behavior category" : "Select the skill area"}
        </p>
        <p className="text-xs text-slate-500">Choose the category that best fits, then describe the specific behavior below.</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {categories.map(cat => (
          <button
            key={cat.value}
            type="button"
            onClick={() => update("behaviorCategory", cat.value)}
            className={cn(
              "flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition",
              inputs.behaviorCategory === cat.value
                ? "border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold"
                : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300"
            )}
          >
            <span className="text-lg">{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>
      <div className="space-y-2">
        <Label htmlFor="current-behavior" className="text-sm font-semibold">
          Describe the specific behavior
        </Label>
        <textarea
          id="current-behavior"
          value={inputs.currentBehavior}
          onChange={e => update("currentBehavior", e.target.value)}
          placeholder={inputs.mode === "reduction"
            ? "e.g., Student hits peers with open hand when asked to share materials"
            : "e.g., Student currently does not initiate greetings with peers"
          }
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          rows={3}
        />
      </div>
    </div>
  );

  const renderBaselineStep = () => (
    <div className="space-y-5">
      <p className="text-sm text-slate-600">
        Enter current baseline data. Fill in at least one field.
      </p>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="baseline-freq" className="text-sm font-semibold">Frequency</Label>
          <Input
            id="baseline-freq"
            value={inputs.baselineFrequency}
            onChange={e => update("baselineFrequency", e.target.value)}
            placeholder="e.g., 8-10 times per day, 3x per class period"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="baseline-dur" className="text-sm font-semibold">Duration</Label>
          <Input
            id="baseline-dur"
            value={inputs.baselineDuration}
            onChange={e => update("baselineDuration", e.target.value)}
            placeholder="e.g., episodes last 5-15 minutes"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="baseline-int" className="text-sm font-semibold">Intensity</Label>
          <Input
            id="baseline-int"
            value={inputs.baselineIntensity}
            onChange={e => update("baselineIntensity", e.target.value)}
            placeholder="e.g., moderate — requires verbal redirection from staff"
          />
        </div>
      </div>
    </div>
  );

  const renderTargetStep = () => (
    <div className="space-y-5">
      {inputs.mode === "reduction" ? (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            What replacement behavior should the student use instead?
          </p>
          <div className="space-y-2">
            <Label htmlFor="replacement" className="text-sm font-semibold">Replacement Behavior</Label>
            <textarea
              id="replacement"
              value={inputs.replacementBehavior}
              onChange={e => update("replacementBehavior", e.target.value)}
              placeholder="e.g., request a break using a break card, use deep breathing, ask for help verbally"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              rows={3}
            />
            <p className="text-xs text-emerald-700">💡 ABA best practice: Always pair behavior reduction with a functionally equivalent replacement behavior.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Describe the target skill/behavior you want to increase.
          </p>
          <div className="space-y-2">
            <Label htmlFor="target-behavior" className="text-sm font-semibold">Target Behavior / Skill</Label>
            <textarea
              id="target-behavior"
              value={inputs.targetBehavior}
              onChange={e => update("targetBehavior", e.target.value)}
              placeholder="e.g., initiate a greeting with peers by saying 'hi' and the peer's name"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              rows={3}
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="timeline" className="text-sm font-semibold">Timeline (weeks)</Label>
        <div className="flex items-center gap-3">
          <input
            id="timeline"
            type="range"
            min={12}
            max={52}
            step={4}
            value={inputs.timelineWeeks}
            onChange={e => update("timelineWeeks", Number(e.target.value))}
            className="w-full accent-emerald-600"
          />
          <span className="min-w-[64px] rounded-full bg-emerald-100 px-3 py-1 text-center text-sm font-semibold text-emerald-700">
            {inputs.timelineWeeks} wks
          </span>
        </div>
        <p className="text-xs text-slate-500">Standard IEP annual goals are typically 36 weeks (one school year).</p>
      </div>
    </div>
  );

  const renderMeasurementStep = () => (
    <div className="space-y-5">
      <p className="text-sm text-slate-600">How will progress be measured?</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {measurementMethods.map(m => (
          <button
            key={m.value}
            type="button"
            onClick={() => update("measurementMethod", m.value)}
            className={cn(
              "flex flex-col items-start gap-1 rounded-xl border px-4 py-3 text-left transition",
              inputs.measurementMethod === m.value
                ? "border-emerald-600 bg-emerald-50"
                : "border-slate-200 bg-white hover:border-emerald-300"
            )}
          >
            <span className={cn("text-sm font-semibold", inputs.measurementMethod === m.value ? "text-emerald-800" : "text-slate-900")}>
              {m.label}
            </span>
            <span className="text-xs text-slate-500">{m.description}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderMasteryStep = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm font-semibold text-slate-900">Mastery Criteria</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {masteryCriteriaOptions.filter(o => o.value !== "custom").map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => update("masteryCriteria", opt.value)}
              className={cn(
                "rounded-xl border px-4 py-2 text-sm transition",
                inputs.masteryCriteria === opt.value
                  ? "border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold"
                  : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-slate-900">Consecutive Performance Required</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {consecutiveOptions.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => update("masteryConsecutive", opt.value)}
              className={cn(
                "rounded-xl border px-4 py-2 text-sm transition",
                inputs.masteryConsecutive === opt.value
                  ? "border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold"
                  : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-slate-900">Settings / Context</p>
        <p className="text-xs text-slate-500">Select where the goal will be measured. Choose all that apply.</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {settingOptions.map(setting => (
            <label
              key={setting}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-3 py-2 text-sm transition cursor-pointer",
                inputs.settings.includes(setting)
                  ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                  : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200"
              )}
            >
              <input
                type="checkbox"
                checked={inputs.settings.includes(setting)}
                onChange={() => toggleSetting(setting)}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600"
              />
              {setting}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="context" className="text-sm font-semibold">Additional Context (optional)</Label>
        <Input
          id="context"
          value={inputs.additionalContext}
          onChange={e => update("additionalContext", e.target.value)}
          placeholder="e.g., 1:1 aide present, sensory breaks available"
        />
      </div>
    </div>
  );

  const renderEmailStep = () => {
    if (emailSubmitted && generatedGoal) {
      return renderResults(generatedGoal);
    }

    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 text-center">
          <span className="text-4xl">🎯</span>
          <h3 className="mt-3 text-xl font-semibold text-slate-900">Your IEP Goal is Ready!</h3>
          <p className="mt-2 text-sm text-slate-600">
            Enter your email to get the complete goal with short-term objectives, data collection methods, and progress monitoring schedule.
          </p>
        </div>

        <div className="space-y-3">
          <Label htmlFor="email-input" className="text-sm font-semibold">Email Address</Label>
          <Input
            id="email-input"
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setEmailError(""); }}
            placeholder="you@school.edu"
            className={emailError ? "border-red-400" : ""}
          />
          {emailError && <p className="text-xs text-red-600">{emailError}</p>}
          <Button onClick={handleEmailSubmit} className="w-full bg-emerald-600 hover:bg-emerald-700">
            Generate My IEP Goal
          </Button>
          <button
            type="button"
            onClick={handleSkipEmail}
            className="w-full text-center text-xs text-slate-400 hover:text-slate-600 transition"
          >
            Skip — show preview only
          </button>
          <p className="text-xs text-slate-400 text-center">We respect your privacy. Unsubscribe anytime.</p>
        </div>
      </div>
    );
  };

  const renderResults = (goal: GeneratedGoal) => {
    const showFull = !!email; // full results only if email provided

    return (
      <div className="space-y-6">
        {/* Annual Goal */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-emerald-900">📋 Annual IEP Goal</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(goal.annualGoal, "goal")}
              className="text-xs"
            >
              {copied === "goal" ? "Copied!" : "Copy"}
            </Button>
          </div>
          <pre className="mt-3 whitespace-pre-wrap rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-800 leading-relaxed">
            {goal.annualGoal}
          </pre>
        </div>

        {/* Short-term Objectives */}
        <div className={cn("rounded-2xl border p-5", showFull ? "border-slate-200 bg-white" : "border-slate-200 bg-slate-50/50")}>
          <h3 className="text-base font-semibold text-slate-900">📊 Short-Term Objectives / Benchmarks</h3>
          {showFull ? (
            <ol className="mt-3 space-y-3">
              {goal.shortTermObjectives.map((obj, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-700">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                    {i + 1}
                  </span>
                  <span>{obj}</span>
                </li>
              ))}
            </ol>
          ) : (
            <div className="mt-3 rounded-xl bg-slate-100 px-4 py-6 text-center text-sm text-slate-500">
              🔒 Enter your email above to unlock short-term objectives, data collection methods, and progress monitoring schedule.
            </div>
          )}
        </div>

        {/* Data Collection */}
        {showFull && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">📝 Data Collection Methods</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(goal.dataCollectionMethods.join("\n"), "data")}
                className="text-xs"
              >
                {copied === "data" ? "Copied!" : "Copy"}
              </Button>
            </div>
            <ul className="mt-3 space-y-2">
              {goal.dataCollectionMethods.map((method, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="mt-0.5 text-emerald-600">•</span>
                  <span>{method}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Progress Monitoring */}
        {showFull && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">📅 Progress Monitoring Schedule</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(goal.progressMonitoringSchedule, "progress")}
                className="text-xs"
              >
                {copied === "progress" ? "Copied!" : "Copy"}
              </Button>
            </div>
            <pre className="mt-3 whitespace-pre-wrap text-sm text-slate-700 leading-relaxed">
              {goal.progressMonitoringSchedule}
            </pre>
          </div>
        )}

        {/* Copy All + Reset */}
        <div className="flex flex-wrap gap-3">
          {showFull && (
            <Button
              onClick={() => handleCopy(
                `ANNUAL GOAL:\n${goal.annualGoal}\n\nSHORT-TERM OBJECTIVES:\n${goal.shortTermObjectives.map((o, i) => `${i + 1}. ${o}`).join("\n")}\n\nDATA COLLECTION:\n${goal.dataCollectionMethods.join("\n")}\n\nPROGRESS MONITORING:\n${goal.progressMonitoringSchedule}`,
                "all"
              )}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {copied === "all" ? "Copied Everything!" : "Copy Complete Goal Package"}
            </Button>
          )}
          <Button variant="outline" onClick={() => window.print()}>Print / PDF</Button>
          <Button variant="outline" onClick={handleReset}>Generate Another Goal</Button>
        </div>

        {!showFull && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center">
            <p className="text-sm text-amber-800 font-medium">
              Want the complete package? Enter your email above to unlock all sections.
            </p>
            <Button
              onClick={() => { setEmailSubmitted(false); }}
              className="mt-3 bg-emerald-600 hover:bg-emerald-700"
              size="sm"
            >
              Unlock Full Results
            </Button>
          </div>
        )}
      </div>
    );
  };

  // ─── Main render ────────────────────────────────────────────

  const stepRenderers = [
    renderModeStep,
    renderStudentStep,
    renderBehaviorStep,
    renderBaselineStep,
    renderTargetStep,
    renderMeasurementStep,
    renderMasteryStep,
    renderEmailStep,
  ];

  return (
    <div className="rounded-3xl border border-emerald-200/80 bg-white shadow-[0_25px_60px_-45px_rgba(15,23,42,0.6)]">
      {/* Header */}
      <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-600 px-6 py-6 text-white rounded-t-3xl">
        <span className="text-xs uppercase tracking-[0.3em] text-emerald-100">Comprehensive Tool</span>
        <h2 className="text-2xl font-semibold sm:text-3xl">IEP Goal Generator</h2>
        <p className="text-sm text-emerald-50/90">
          Generate complete, measurable, legally defensible IEP goals with objectives and data collection plans.
        </p>
      </div>

      <div className="px-6 py-6">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-emerald-700">
              Step {currentStep + 1} of {steps.length}: {steps[currentStep].label}
            </span>
            <span className="text-xs text-slate-400">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <div className="mt-2 hidden sm:flex justify-between">
            {steps.map((step, i) => (
              <button
                key={step.key}
                type="button"
                onClick={() => { if (i <= currentStep) setCurrentStep(i); }}
                className={cn(
                  "text-[10px] font-medium transition",
                  i <= currentStep ? "text-emerald-700 cursor-pointer" : "text-slate-300 cursor-default"
                )}
              >
                {step.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-5 sm:px-6 min-h-[300px]">
          {stepRenderers[currentStep]()}
        </div>

        {/* Navigation */}
        {!(currentStep === steps.length - 1 && emailSubmitted) && (
          <div className="mt-6 flex items-center justify-between">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}>
              Back
            </Button>
            {currentStep < steps.length - 1 && (
              <Button onClick={handleNext} disabled={!isStepValid[currentStep]}>
                Next
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
