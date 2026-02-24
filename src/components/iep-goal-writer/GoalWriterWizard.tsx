"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { ProgressIndicator } from "./ProgressIndicator";
import { TemplateSelector } from "./TemplateSelector";
import { ValueCard } from "./ValueCard";
import { QualityMeter } from "./QualityMeter";
import type { GoalTemplate } from "./goalTemplates";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Copy, Printer, RotateCcw, Check, Sparkles, ArrowRight, ArrowLeft, Download, FileText } from "lucide-react";
import { generateGoalPdf } from "@/lib/generateGoalPdf";

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

const steps = ["Behavior", "Baseline", "Fluency", "Maintenance"];

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  // Scroll to top when step changes
  useEffect(() => {
    const wizardTop = document.getElementById("wizard-top");
    if (wizardTop && !showTemplates) {
      wizardTop.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentStep, showTemplates]);

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
    const behaviorLine = `Behavior: ${student} will ${behaviorPhrase}`;
    const criteriaLine = `Criteria: ${target}% of opportunities for 3 consecutive school days${fluencyPhrase}${generalizationPhrase}, as measured by ${measurementMethod.toLowerCase()}.`;
    const maintenanceLine = `Maintenance: ${student} will maintain the skill for ${maintenanceWeeks} weeks following mastery.`;

    const baselineLine = `${student} currently ${behaviorType === "increase" ? "demonstrates" : "engages in"} ${behavior || "the target behavior"} in ${baseline}% of observed opportunities.`;

    return `${conditionLine}\n${behaviorLine}\n${criteriaLine}\n${maintenanceLine}\n\nBaseline: ${baselineLine}`;
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate thinking/generating time for effect
    setTimeout(() => {
      const goal = buildGoal();
      console.log("iep_goal_writer_generate", {
        value: valueLabel,
        behaviorType,
        measurementMethod,
      });
      setGeneratedGoal(goal);
      setCopied(false);
      setIsGenerating(false);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 600);
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

  const handleDownloadPdf = useCallback(async () => {
    if (!generatedGoal) return;
    setIsDownloadingPdf(true);
    try {
      console.log("iep_goal_writer_download_pdf");
      const pdfBlob = await generateGoalPdf({
        goal: generatedGoal,
        value: valueLabel,
        behaviorType,
        behavior,
        baseline,
        target,
        measurementMethod,
        fluencyEnabled,
        fluencySeconds,
        generalization,
        maintenanceWeeks,
        qualityLevel,
      });
      
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `iep-goal-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF generation error:', error);
    } finally {
      setIsDownloadingPdf(false);
    }
  }, [generatedGoal, valueLabel, behaviorType, behavior, baseline, target, measurementMethod, fluencyEnabled, fluencySeconds, generalization, maintenanceWeeks]);

  // Calculate quality level (1-5) based on goal components
  const qualityLevel = useMemo(() => {
    let level = 0;
    // Level 1: Basic goal with behavior and measurement
    if (behavior.trim().length > 4) level = 1;
    // Level 2: + Baseline data
    if (level === 1 && Number.isFinite(baseline) && baseline >= 0) level = 2;
    // Level 3: + Fluency
    if (level === 2 && fluencyEnabled && fluencySeconds > 0) level = 3;
    // Level 4: + Generalization
    if (level >= 2 && generalization.length >= 2) level = Math.max(level, 4);
    // Level 5: + Maintenance
    if (level >= 4 && maintenanceWeeks >= 4) level = 5;
    return level;
  }, [behavior, baseline, fluencyEnabled, fluencySeconds, generalization, maintenanceWeeks]);

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

  if (showTemplates) {
    return (
      <div id="wizard-top" className="rounded-3xl border border-emerald-200/80 bg-white shadow-[0_25px_60px_-45px_rgba(15,23,42,0.6)]">
        <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-600 px-6 py-8 text-white">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-100">IEP Goal Writer</span>
            <h2 className="text-3xl font-bold sm:text-4xl">IEP Goal Writer</h2>
            <p className="text-base text-emerald-50/90 sm:text-lg">
              Build a Level 5 SMART behavior goal in five focused steps.
            </p>
          </div>
        </div>
        <div className="px-6 py-8">
          <TemplateSelector
            onSelect={applyTemplate}
            onSkip={() => setShowTemplates(false)}
          />
        </div>
      </div>
    );
  }

  if (generatedGoal) {
    return (
      <div id="wizard-top" className="mx-auto max-w-4xl animate-in fade-in zoom-in-95 duration-500">
        <div className="overflow-hidden rounded-3xl border border-emerald-200 bg-white shadow-2xl shadow-emerald-900/10">
          <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
                  <Sparkles className="h-6 w-6 text-emerald-200" />
                  Goal Generated Successfully!
                </h2>
                <p className="mt-1 text-emerald-100">Your research-backed, values-aligned IEP behavior goal is ready.</p>
              </div>
              <span className={cn(
                "hidden rounded-full px-4 py-1.5 text-sm font-bold sm:inline-block",
                qualityLevel >= 5 ? "bg-emerald-100 text-emerald-800" :
                qualityLevel >= 4 ? "bg-blue-100 text-blue-800" :
                qualityLevel >= 3 ? "bg-yellow-100 text-yellow-800" :
                "bg-orange-100 text-orange-800"
              )}>
                Level {qualityLevel} SMART Goal
              </span>
            </div>
          </div>
          
          <div className="px-8 py-8 space-y-8">
            {/* Quality Meter */}
            <QualityMeter level={qualityLevel} />
            
            {/* Goal Preview */}
            <div className="relative rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <div className="absolute -top-3 left-4 bg-slate-50 px-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <FileText className="w-3 h-3 inline mr-1" />
                IEP Goal Document
              </div>
              <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed text-slate-800">{generatedGoal}</pre>
            </div>

            {/* Action Buttons */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Button onClick={handleCopy} className="h-12 gap-2 bg-emerald-600 text-base font-semibold hover:bg-emerald-700 shadow-lg shadow-emerald-900/20">
                {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                {copied ? "Copied!" : "Copy Goal"}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleDownloadPdf} 
                disabled={isDownloadingPdf}
                className="h-12 gap-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              >
                <Download className="h-5 w-5" />
                {isDownloadingPdf ? "Generating..." : "Download PDF"}
              </Button>
              <Button variant="outline" onClick={handlePrint} className="h-12 gap-2 border-slate-300 text-slate-700 hover:bg-slate-50">
                <Printer className="h-5 w-5" /> Print
              </Button>
              <Button variant="ghost" onClick={handleReset} className="h-12 gap-2 text-slate-500 hover:text-slate-900">
                <RotateCcw className="h-5 w-5" /> Start Over
              </Button>
            </div>
            
            {/* Goal Components Checklist */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-3">Goal Components Included:</h4>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { label: "Student Value", included: true, detail: valueLabel },
                  { label: "Baseline Data", included: true, detail: `${baseline}%` },
                  { label: "Target Criteria", included: true, detail: `${target}%` },
                  { label: "Measurement Method", included: true, detail: measurementMethod },
                  { label: "Fluency", included: fluencyEnabled, detail: fluencyEnabled ? `${fluencySeconds}s` : "Not set" },
                  { label: "Generalization", included: generalization.length >= 2, detail: `${generalization.length} settings` },
                  { label: "Maintenance", included: maintenanceWeeks >= 4, detail: `${maintenanceWeeks} weeks` },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-sm">
                    <span className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center text-xs",
                      item.included ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-400"
                    )}>
                      {item.included ? "✓" : "○"}
                    </span>
                    <span className={item.included ? "text-slate-700" : "text-slate-400"}>
                      {item.label}: <span className="font-medium">{item.detail}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="wizard-top" className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
      {/* Left Column: Wizard Inputs */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
        
        {/* Header */}
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Step {currentStep + 1} of 4</p>
              <h3 className="text-xl font-bold text-slate-900">{steps[currentStep]}</h3>
            </div>
            {activeTemplate && (
              <div className="hidden items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 sm:flex">
                <span>{activeTemplate.emoji}</span>
                <span>Template Active</span>
              </div>
            )}
          </div>
          <div className="mt-4">
            <ProgressIndicator steps={steps} currentStep={currentStep} />
          </div>
        </div>

        {/* Input Area */}
        <div className="px-6 py-6 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >


              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="flex gap-3">
                    {(["increase", "decrease"] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setBehaviorType(type)}
                        className={cn(
                          "flex-1 rounded-xl border p-4 text-left transition-all",
                          behaviorType === type
                            ? "border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600"
                            : "border-slate-200 hover:border-emerald-300"
                        )}
                      >
                        <div className="font-semibold text-slate-900">
                          {type === "increase" ? "Increase Behavior" : "Decrease Behavior"}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {type === "increase" ? "Build a positive skill" : "Reduce a problem behavior"}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="behavior-input">Target Behavior</Label>
                    <Input
                      id="behavior-input"
                      value={behavior}
                      onChange={(e) => setBehavior(e.target.value)}
                      placeholder={behaviorType === "increase" ? "Raising hand, asking for help..." : "Yelling, hitting, eloping..."}
                      className="h-11"
                      autoFocus
                    />
                  </div>

                  {behaviorType === "decrease" && (
                    <div className="space-y-2 rounded-xl bg-emerald-50/50 p-4 border border-emerald-100">
                      <Label htmlFor="replacement-input" className="text-emerald-900">Replacement Behavior (FERPA Best Practice)</Label>
                      <Input
                        id="replacement-input"
                        value={replacementBehavior}
                        onChange={(e) => setReplacementBehavior(e.target.value)}
                        placeholder="Using a break card, deep breathing..."
                        className="h-11 bg-white"
                      />
                      <p className="text-xs text-emerald-700 pt-1">Always teach what to do *instead*.</p>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="baseline">Baseline (Current Level)</Label>
                      <div className="relative">
                        <Input
                          id="baseline"
                          type="number"
                          min={0}
                          max={100}
                          value={baseline}
                          onChange={(e) => setBaseline(Number(e.target.value))}
                          className="h-11 pr-8"
                        />
                        <span className="absolute right-3 top-3 text-slate-400">%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="target">Target Goal</Label>
                      <div className="relative">
                        <Input
                          id="target"
                          type="number"
                          min={0}
                          max={100}
                          value={target}
                          onChange={(e) => setTarget(Number(e.target.value))}
                          className="h-11 pr-8"
                        />
                        <span className="absolute right-3 top-3 text-slate-400">%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Measurement Method</Label>
                    <div className="grid gap-2">
                      {measurementOptions.map((option) => (
                        <label
                          key={option}
                          className={cn(
                            "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
                            measurementMethod === option
                              ? "border-emerald-500 bg-emerald-50/50"
                              : "border-slate-200 hover:bg-slate-50"
                          )}
                        >
                          <input
                            type="radio"
                            name="measurement"
                            checked={measurementMethod === option}
                            onChange={() => setMeasurementMethod(option)}
                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="text-sm font-medium text-slate-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
                    <div>
                      <p className="font-semibold text-slate-900">Fluency Requirement</p>
                      <p className="text-sm text-slate-500">Require quick response time?</p>
                    </div>
                    <Switch checked={fluencyEnabled} onCheckedChange={setFluencyEnabled} />
                  </div>

                  <AnimatePresence>
                    {fluencyEnabled && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-2 pb-2">
                          <Label htmlFor="fluency">Response Latency (seconds)</Label>
                          <Input
                            id="fluency"
                            type="number"
                            min={1}
                            max={60}
                            value={fluencySeconds}
                            onChange={(e) => setFluencySeconds(Number(e.target.value))}
                            className="h-11"
                          />
                          <p className="text-xs text-slate-500">Student must respond within this time.</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-3">
                    <Label>Generalization Settings (Select multiple)</Label>
                    <div className="grid gap-2 max-h-[240px] overflow-y-auto pr-2">
                      {generalizationOptions.map((setting) => (
                        <label
                          key={setting}
                          className={cn(
                            "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
                            generalization.includes(setting)
                              ? "border-emerald-500 bg-emerald-50/50"
                              : "border-slate-200 hover:bg-slate-50"
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={generalization.includes(setting)}
                            onChange={() => updateGeneralization(setting)}
                            className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="text-sm font-medium text-slate-700">{setting}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-8">
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-5">
                    <h4 className="font-semibold text-emerald-900">Final Polish</h4>
                    <p className="text-sm text-emerald-700 mt-1">
                      Maintenance ensures the skill sticks. Research suggests 4+ weeks.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label htmlFor="maintenance">Maintenance Period</Label>
                      <span className="font-bold text-emerald-700">{maintenanceWeeks} Weeks</span>
                    </div>
                    <input
                      id="maintenance"
                      type="range"
                      min={2}
                      max={8}
                      step={1}
                      value={maintenanceWeeks}
                      onChange={(e) => setMaintenanceWeeks(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>2 Weeks</span>
                      <span>8 Weeks</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-4 rounded-b-3xl">
          <Button variant="ghost" onClick={onBack} disabled={currentStep === 0} className="gap-2 pl-0 hover:pl-2 transition-all">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          
          {currentStep < steps.length - 1 ? (
            <Button onClick={onNext} disabled={!isStepValid[currentStep]} className="gap-2 bg-slate-900 hover:bg-slate-800">
              Next Step <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleGenerate} 
              disabled={!isStepValid[currentStep] || isGenerating}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20"
            >
              {isGenerating ? (
                <>Building Goal...</>
              ) : (
                <>Generate Goal <Sparkles className="h-4 w-4" /></>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Right Column: Sticky Preview */}
      <div className="space-y-6 lg:sticky lg:top-24">
        {/* Live Document Preview */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-amber-400" />
              <div className="h-3 w-3 rounded-full bg-emerald-400" />
              <span className="ml-2 text-xs font-semibold uppercase text-slate-400">Live Draft</span>
            </div>
          </div>
          <div className="p-6">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h4 className="font-serif text-lg font-bold text-slate-900">IEP Goal Draft</h4>
                <p className="text-xs text-slate-500">Confidential • {new Date().toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-slate-900">Student: [Name]</p>
                <p className="text-xs text-slate-500">Grade: [Grade]</p>
              </div>
            </div>
            
            <div className="space-y-4 font-serif text-sm leading-relaxed text-slate-800">
              <div className="rounded bg-slate-50 p-3 text-xs text-slate-500 italic">
                Preview updates automatically as you type...
              </div>
              <pre className="whitespace-pre-wrap font-serif text-sm">{previewGoal}</pre>
            </div>
          </div>
        </div>

        {/* Dynamic Help Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-white p-2 shadow-sm">
                <span className="text-lg">💡</span>
              </div>
              <div>
                <h4 className="font-semibold text-emerald-900">Pro Tip</h4>
                <p className="mt-1 text-sm text-emerald-800/80">
                  
                  {currentStep === 0 && "Always define the replacement behavior. We can't just stop a behavior; we must replace it with a skill."}
                  {currentStep === 1 && "If the gap between baseline and target is too wide, consider a benchmark objective first."}
                  {currentStep === 2 && "Fluency builds automaticity. If they have to think about it too long, they won't use it in stress situations."}
                  {currentStep === 3 && "Maintenance failures are the #1 reason for behavior regression. Lock it in with a 4-week window."}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
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
