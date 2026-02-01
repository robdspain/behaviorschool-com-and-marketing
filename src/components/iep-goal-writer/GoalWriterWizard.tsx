"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { ProgressIndicator } from "./ProgressIndicator";
import { ValueCard } from "./ValueCard";

const valueOptions = [
  { emoji: "💛", label: "Kind", description: "Caring about others" },
  { emoji: "🦁", label: "Brave", description: "Trying new things despite fear" },
  { emoji: "🎯", label: "Focused", description: "Paying attention to what matters" },
  { emoji: "🤗", label: "Helpful", description: "Supporting others" },
  { emoji: "🤝", label: "Honest", description: "Telling the truth" },
  { emoji: "🙏", label: "Respectful", description: "Treating others well" },
  { emoji: "🌟", label: "Creative", description: "Thinking in new ways" },
  { emoji: "✅", label: "Responsible", description: "Following through on commitments" },
];

const generalizationOptions = [
  "Structured classroom",
  "Small group instruction",
  "Independent work time",
  "Lunch/recess",
  "Transitions",
  "Specials (PE, art, music)",
  "With different adults",
];

const steps = ["Values", "Behavior", "Baseline", "Fluency", "Maintenance"];

const defaultSettings = [
  "Structured classroom",
  "Small group instruction",
  "Independent work time",
];

type BehaviorType = "increase" | "decrease";

export function GoalWriterWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedValue, setSelectedValue] = useState(valueOptions[0]);
  const [behaviorType, setBehaviorType] = useState<BehaviorType>("increase");
  const [behavior, setBehavior] = useState("");
  const [replacementBehavior, setReplacementBehavior] = useState("");
  const [baseline, setBaseline] = useState(40);
  const [target, setTarget] = useState(90);
  const [fluencyEnabled, setFluencyEnabled] = useState(true);
  const [fluencySeconds, setFluencySeconds] = useState(5);
  const [generalization, setGeneralization] = useState<string[]>(defaultSettings);
  const [maintenanceWeeks, setMaintenanceWeeks] = useState(4);
  const [generatedGoal, setGeneratedGoal] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const isStepValid = useMemo(() => {
    const baselineOk = Number.isFinite(baseline) && baseline >= 0 && baseline <= 100;
    const targetOk = Number.isFinite(target) && target >= 0 && target <= 100;
    const behaviorOk = behavior.trim().length > 4;
    const replacementOk = behaviorType === "increase" || replacementBehavior.trim().length > 4;
    const generalizationOk = generalization.length > 0;

    return [
      Boolean(selectedValue),
      behaviorOk && replacementOk,
      baselineOk && targetOk,
      generalizationOk,
      maintenanceWeeks >= 2,
    ];
  }, [baseline, target, behavior, replacementBehavior, behaviorType, generalization, maintenanceWeeks, selectedValue]);

  const onNext = () => {
    if (currentStep < steps.length - 1 && isStepValid[currentStep]) {
      setCurrentStep((prev) => prev + 1);
      setCopied(false);
    }
  };

  const onBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setCopied(false);
    }
  };

  const updateGeneralization = (setting: string) => {
    setGeneralization((prev) =>
      prev.includes(setting)
        ? prev.filter((item) => item !== setting)
        : [...prev, setting]
    );
  };

  const buildGoal = () => {
    const student = "[Student]";
    const date = formatFutureDate(12);
    const settingsText = generalization.length > 0 ? listToSentence(generalization) : "structured classroom settings";
    const behaviorPhrase = behaviorType === "increase"
      ? `increase ${behavior}`
      : `decrease ${behavior} by using ${replacementBehavior || "a replacement behavior"}`;
    const fluencyPhrase = fluencyEnabled
      ? `, initiating within ${fluencySeconds} seconds of the opportunity`
      : "";
    const generalizationPhrase = generalization.length >= 2
      ? ` across ${generalization.length} settings`
      : "";

    const goal = `By ${date}, when in ${settingsText}, ${student} will ${behaviorPhrase} in ${target}% of opportunities for 3 consecutive school days${fluencyPhrase}${generalizationPhrase}, as measured by teacher observation. Additionally, ${student} will maintain the behavior for ${maintenanceWeeks} weeks following mastery to ensure long-term retention.`;

    const baselineLine = `${student} currently ${behaviorType === "increase" ? "demonstrates" : "engages in"} ${behavior || "the target behavior"} in ${baseline}% of observed opportunities.`;

    return `${goal}\n\nBaseline: ${baselineLine}`;
  };

  const handleGenerate = () => {
    const goal = buildGoal();
    setGeneratedGoal(goal);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!generatedGoal) return;
    try {
      await navigator.clipboard.writeText(generatedGoal);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const handleReset = () => {
    setSelectedValue(valueOptions[0]);
    setBehaviorType("increase");
    setBehavior("");
    setReplacementBehavior("");
    setBaseline(40);
    setTarget(90);
    setFluencyEnabled(true);
    setFluencySeconds(5);
    setGeneralization(defaultSettings);
    setMaintenanceWeeks(4);
    setGeneratedGoal(null);
    setCopied(false);
    setCurrentStep(0);
  };

  return (
    <div className="rounded-3xl border border-emerald-200/80 bg-white shadow-[0_25px_60px_-45px_rgba(15,23,42,0.6)]">
      <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-600 px-6 py-6 text-white">
        <div className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-[0.3em] text-emerald-100">Values Wizard</span>
          <h2 className="text-2xl font-semibold sm:text-3xl">IEP Goal Writer</h2>
          <p className="text-sm text-emerald-50/90">
            Build a Level 5 SMART behavior goal in five focused steps.
          </p>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4">
          <ProgressIndicator steps={steps} currentStep={currentStep} />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Step {currentStep + 1} of 5</p>
              <h3 className="text-lg font-semibold text-slate-900 sm:text-xl">{steps[currentStep]}</h3>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {steps[currentStep]} Focus
            </span>
          </div>

          <div className="mt-5 space-y-6">
            {currentStep === 0 && (
              <div className="space-y-5">
                <div>
                  <p className="text-sm text-slate-600">What matters most to this student?</p>
                  <p className="text-xs text-slate-500">Choose a value the student wants to grow in.</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {valueOptions.map((value) => (
                    <ValueCard
                      key={value.label}
                      emoji={value.emoji}
                      label={value.label}
                      description={value.description}
                      selected={selectedValue.label === value.label}
                      onClick={() => setSelectedValue(value)}
                    />
                  ))}
                </div>
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-800">
                  Selected: <span className="font-semibold">{selectedValue.emoji} {selectedValue.label}</span>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-5">
                <div className="flex flex-wrap gap-3">
                  {["increase", "decrease"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setBehaviorType(type as BehaviorType)}
                      className={cn(
                        "flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition",
                        behaviorType === type
                          ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300"
                      )}
                    >
                      {type === "increase" ? "Increase a Positive Behavior" : "Decrease a Problem Behavior"}
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="behavior-input" className="text-sm font-semibold">Target Behavior</Label>
                  <Input
                    id="behavior-input"
                    value={behavior}
                    onChange={(event) => setBehavior(event.target.value)}
                    placeholder={behaviorType === "increase"
                      ? "Using kind words with peers when upset"
                      : "Yelling at peers"
                    }
                  />
                </div>

                {behaviorType === "decrease" && (
                  <div className="space-y-2">
                    <Label htmlFor="replacement-input" className="text-sm font-semibold">Replacement Behavior</Label>
                    <Input
                      id="replacement-input"
                      value={replacementBehavior}
                      onChange={(event) => setReplacementBehavior(event.target.value)}
                      placeholder="Using a calm voice to express frustration"
                    />
                    <p className="text-xs text-emerald-700">ABA tip: teach a replacement behavior, not just reduction.</p>
                  </div>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="baseline" className="text-sm font-semibold">Baseline (Current)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="baseline"
                        type="number"
                        min={0}
                        max={100}
                        value={baseline}
                        onChange={(event) => setBaseline(Number(event.target.value))}
                      />
                      <span className="text-sm font-semibold text-slate-600">%</span>
                    </div>
                    <p className="text-xs text-slate-500">Current performance level.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="target" className="text-sm font-semibold">Target (Goal)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="target"
                        type="number"
                        min={0}
                        max={100}
                        value={target}
                        onChange={(event) => setTarget(Number(event.target.value))}
                      />
                      <span className="text-sm font-semibold text-slate-600">%</span>
                    </div>
                    <p className={cn("text-xs", target < 80 ? "text-amber-600" : "text-slate-500")}>
                      {target < 80 ? "Consider 80%+ for lasting change." : "90%+ recommended for retention."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Fluency Requirement</p>
                    <p className="text-xs text-slate-500">Should the student respond quickly?</p>
                  </div>
                  <Switch checked={fluencyEnabled} onCheckedChange={setFluencyEnabled} />
                </div>

                {fluencyEnabled && (
                  <div className="space-y-2">
                    <Label htmlFor="fluency" className="text-sm font-semibold">Response Time (seconds)</Label>
                    <Input
                      id="fluency"
                      type="number"
                      min={1}
                      max={60}
                      value={fluencySeconds}
                      onChange={(event) => setFluencySeconds(Number(event.target.value))}
                    />
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Generalization Settings</p>
                    <p className="text-xs text-slate-500">Pick at least 3 settings for best results.</p>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {generalizationOptions.map((setting) => (
                      <label
                        key={setting}
                        className={cn(
                          "flex items-center gap-3 rounded-xl border px-3 py-2 text-sm transition",
                          generalization.includes(setting)
                            ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                            : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200"
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={generalization.includes(setting)}
                          onChange={() => updateGeneralization(setting)}
                          className="h-4 w-4 rounded border-slate-300 text-emerald-600"
                        />
                        {setting}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-4">
                  <p className="text-sm font-semibold text-emerald-800">Maintenance Period</p>
                  <p className="text-xs text-emerald-700">How long should the skill last after mastery?</p>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="maintenance" className="text-sm font-semibold">Weeks of Maintenance</Label>
                  <div className="flex items-center gap-3">
                    <input
                      id="maintenance"
                      type="range"
                      min={2}
                      max={8}
                      value={maintenanceWeeks}
                      onChange={(event) => setMaintenanceWeeks(Number(event.target.value))}
                      className="w-full accent-emerald-600"
                    />
                    <span className="min-w-[52px] rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                      {maintenanceWeeks} wks
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Research recommends 4+ weeks for lasting behavior change.</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  Goal will include baseline, fluency, generalization, and maintenance for a Level 5 SMART goal.
                </div>

                {generatedGoal && (
                  <div className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 px-4 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-emerald-900">Your Level 5 SMART Goal</p>
                        <p className="text-xs text-emerald-700">Ready to copy into your IEP software.</p>
                      </div>
                      <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">Level 5</span>
                    </div>
                    <pre className="whitespace-pre-wrap rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-emerald-900">{generatedGoal}</pre>
                    <div className="flex flex-wrap gap-3">
                      <Button onClick={handleCopy} className="bg-emerald-600 hover:bg-emerald-700">
                        {copied ? "Copied!" : "Copy Goal"}
                      </Button>
                      <Button variant="outline" onClick={handleReset}>Start Over</Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="outline" onClick={onBack} disabled={currentStep === 0}>
            Back
          </Button>
          <div className="flex flex-1 items-center justify-end gap-3">
            {currentStep < steps.length - 1 && (
              <Button onClick={onNext} disabled={!isStepValid[currentStep]}>
                Next
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button
                onClick={handleGenerate}
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={!isStepValid[currentStep]}
              >
                Generate Goal
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function listToSentence(items: string[]) {
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function formatFutureDate(weeks: number) {
  const date = new Date();
  date.setDate(date.getDate() + weeks * 7);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
