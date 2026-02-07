"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { ProgressIndicator } from "./ProgressIndicator";
import { TemplateSelector } from "./TemplateSelector";
import { ValueCard } from "./ValueCard";
import type { GoalTemplate } from "./goalTemplates";

const valueOptions = [
  { emoji: "💛", label: "Kind", description: "Caring about others" },
  { emoji: "🦁", label: "Brave", description: "Trying new things despite fear" },
  { emoji: "🎯", label: "Focused", description: "Paying attention to what matters" },
  { emoji: "🤗", label: "Helpful", description: "Supporting others" },
  { emoji: "🤝", label: "Honest", description: "Telling the truth" },
  { emoji: "🙏", label: "Respectful", description: "Treating others well" },
  { emoji: "🌟", label: "Creative", description: "Thinking in new ways" },
  { emoji: "✅", label: "Responsible", description: "Following through on commitments" },
  { emoji: "✏️", label: "Custom Value", description: "Use your own value" },
];

const measurementOptions = [
  "Teacher observation",
  "Frequency count",
  "Duration recording",
  "Interval recording",
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
  const [showTemplates, setShowTemplates] = useState(true);
  const [activeTemplate, setActiveTemplate] = useState<GoalTemplate | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedValue, setSelectedValue] = useState(valueOptions[0]);
  const [customValue, setCustomValue] = useState("");
  const [behaviorType, setBehaviorType] = useState<BehaviorType>("increase");
  const [behavior, setBehavior] = useState("");
  const [replacementBehavior, setReplacementBehavior] = useState("");
  const [baseline, setBaseline] = useState(40);
  const [target, setTarget] = useState(90);
  const [measurementMethod, setMeasurementMethod] = useState(measurementOptions[0]);
  const [fluencyEnabled, setFluencyEnabled] = useState(true);
  const [fluencySeconds, setFluencySeconds] = useState(5);
  const [generalization, setGeneralization] = useState<string[]>(defaultSettings);
  const [maintenanceWeeks, setMaintenanceWeeks] = useState(4);
  const [generatedGoal, setGeneratedGoal] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const valueLabel = useMemo(() => {
    if (selectedValue.label === "Custom Value") {
      return customValue.trim() || "custom value";
    }
    return selectedValue.label;
  }, [customValue, selectedValue.label]);

  const isStepValid = useMemo(() => {
    const baselineOk = Number.isFinite(baseline) && baseline >= 0 && baseline <= 100;
    const targetOk = Number.isFinite(target) && target >= 0 && target <= 100;
    const behaviorOk = behavior.trim().length > 4;
    const replacementOk = behaviorType === "increase" || replacementBehavior.trim().length > 4;
    const generalizationOk = generalization.length > 0;
    const valueOk = selectedValue.label === "Custom Value"
      ? customValue.trim().length > 1
      : Boolean(selectedValue);

    return [
      valueOk,
      behaviorOk && replacementOk,
      baselineOk && targetOk,
      generalizationOk,
      maintenanceWeeks >= 2,
    ];
  }, [baseline, target, behavior, replacementBehavior, behaviorType, generalization, maintenanceWeeks, selectedValue, customValue]);

  const onNext = () => {
    if (currentStep < steps.length - 1 && isStepValid[currentStep]) {
      console.log("iep_goal_writer_step_next", { step: currentStep + 1 });
      setCurrentStep((prev) => prev + 1);
      setCopied(false);
    }
  };

  const onBack = () => {
    if (currentStep > 0) {
      console.log("iep_goal_writer_step_back", { step: currentStep + 1 });
      setCurrentStep((prev) => prev - 1);
      setCopied(false);
    }
  };

  const updateGeneralization = (setting: string) => {
    console.log("iep_goal_writer_generalization_toggle", { setting });
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
      ? `increase ${behavior || "the target behavior"}`
      : `decrease ${behavior || "the target behavior"} by using ${replacementBehavior || "a replacement behavior"}`;
    const fluencyPhrase = fluencyEnabled
      ? ` with a response latency of ${fluencySeconds} seconds or less`
      : "";
    const generalizationPhrase = generalization.length >= 2
      ? ` across ${generalization.length} settings`
      : "";

    const conditionLine = `Condition: By ${date}, when in ${settingsText}`;
    const behaviorLine = `Behavior: ${student} will ${behaviorPhrase} to demonstrate ${valueLabel}`;
    const criteriaLine = `Criteria: ${target}% of opportunities for 3 consecutive school days${fluencyPhrase}${generalizationPhrase}, as measured by ${measurementMethod.toLowerCase()}.`;
    const maintenanceLine = `Maintenance: ${student} will maintain the skill for ${maintenanceWeeks} weeks following mastery.`;

    const baselineLine = `${student} currently ${behaviorType === "increase" ? "demonstrates" : "engages in"} ${behavior || "the target behavior"} in ${baseline}% of observed opportunities.`;

    return `${conditionLine}\n${behaviorLine}\n${criteriaLine}\n${maintenanceLine}\n\nBaseline: ${baselineLine}`;
  };

  const handleGenerate = () => {
    const goal = buildGoal();
    console.log("iep_goal_writer_generate", {
      value: valueLabel,
      behaviorType,
      measurementMethod,
    });
    setGeneratedGoal(goal);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!generatedGoal) return;
    try {
      await navigator.clipboard.writeText(generatedGoal);
      console.log("iep_goal_writer_copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const handlePrint = () => {
    if (!generatedGoal) return;
    console.log("iep_goal_writer_print");
    window.print();
  };

  const handleReset = () => {
    console.log("iep_goal_writer_reset");
    setSelectedValue(valueOptions[0]);
    setCustomValue("");
    setBehaviorType("increase");
    setBehavior("");
    setReplacementBehavior("");
    setBaseline(40);
    setTarget(90);
    setMeasurementMethod(measurementOptions[0]);
    setFluencyEnabled(true);
    setFluencySeconds(5);
    setGeneralization(defaultSettings);
    setMaintenanceWeeks(4);
    setGeneratedGoal(null);
    setCopied(false);
    setCurrentStep(0);
    setShowTemplates(true);
    setActiveTemplate(null);
  };

  const applyTemplate = (template: GoalTemplate) => {
    console.log("iep_goal_writer_template_select", { template: template.id });
    setActiveTemplate(template);
    setSelectedValue(valueOptions[template.valueIndex]);
    if (template.customValue) setCustomValue(template.customValue);
    setBehaviorType(template.behaviorType);
    setBehavior(template.behavior);
    setReplacementBehavior(template.replacementBehavior);
    setBaseline(template.baseline);
    setTarget(template.target);
    setMeasurementMethod(template.measurementMethod);
    setFluencyEnabled(template.fluencyEnabled);
    setFluencySeconds(template.fluencySeconds);
    setGeneralization(template.generalization);
    setMaintenanceWeeks(template.maintenanceWeeks);
    setShowTemplates(false);
    setCurrentStep(0);
  };

  const previewGoal = useMemo(() => buildGoal(), [
    baseline,
    behavior,
    behaviorType,
    fluencyEnabled,
    fluencySeconds,
    generalization,
    maintenanceWeeks,
    measurementMethod,
    replacementBehavior,
    target,
    valueLabel,
  ]);

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
        {showTemplates ? (
          <div className="space-y-6">
            <TemplateSelector
              onSelect={applyTemplate}
              onSkip={() => setShowTemplates(false)}
            />
          </div>
        ) : (
        <>
        {activeTemplate && (
          <div className="mb-4 flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">{activeTemplate.emoji}</span>
              <span className="text-sm font-semibold text-emerald-800">Template: {activeTemplate.title}</span>
            </div>
            <button
              type="button"
              onClick={() => { setShowTemplates(true); setActiveTemplate(null); }}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900"
            >
              Change
            </button>
          </div>
        )}
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
                      onClick={() => {
                        console.log("iep_goal_writer_value_select", { value: value.label });
                        setSelectedValue(value);
                      }}
                    />
                  ))}
                </div>
                {selectedValue.label === "Custom Value" && (
                  <div className="space-y-2">
                    <Label htmlFor="custom-value" className="text-sm font-semibold">Custom Value</Label>
                    <Input
                      id="custom-value"
                      value={customValue}
                      onChange={(event) => {
                        setCustomValue(event.target.value);
                      }}
                      placeholder="Perseverance, self-advocacy, teamwork..."
                    />
                  </div>
                )}
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-800">
                  Selected: <span className="font-semibold">{selectedValue.emoji} {valueLabel}</span>
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
                      onClick={() => {
                        console.log("iep_goal_writer_behavior_type", { type });
                        setBehaviorType(type as BehaviorType);
                      }}
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

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Measurement Method</p>
                    <p className="text-xs text-slate-500">How will progress be tracked?</p>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {measurementOptions.map((option) => (
                      <label
                        key={option}
                        className={cn(
                          "flex items-center gap-3 rounded-xl border px-3 py-2 text-sm transition",
                          measurementMethod === option
                            ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                            : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200"
                        )}
                      >
                        <input
                          type="radio"
                          name="measurement-method"
                          checked={measurementMethod === option}
                          onChange={() => {
                            console.log("iep_goal_writer_measurement_select", { method: option });
                            setMeasurementMethod(option);
                          }}
                          className="h-4 w-4 border-slate-300 text-emerald-600"
                        />
                        {option}
                      </label>
                    ))}
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
                      <Button variant="outline" onClick={handlePrint}>Print/PDF</Button>
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

        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Live Goal Preview</p>
              <p className="text-xs text-slate-500">Updates automatically as you complete each step.</p>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500">Draft</span>
          </div>
          <pre className="mt-3 whitespace-pre-wrap rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            {previewGoal}
          </pre>
        </div>

        {activeTemplate && (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/40 px-4 py-4">
            <p className="text-sm font-semibold text-emerald-900">💡 Suggested Intervention Strategies</p>
            <p className="mb-3 text-xs text-emerald-700">Evidence-informed strategies for {activeTemplate.title.toLowerCase()}. Customize to fit the student.</p>
            <ul className="space-y-2">
              {activeTemplate.interventionStrategies.map((strategy, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-emerald-900/90">
                  <span className="mt-0.5 text-emerald-600">•</span>
                  <span>{strategy}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        </>
        )}
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
