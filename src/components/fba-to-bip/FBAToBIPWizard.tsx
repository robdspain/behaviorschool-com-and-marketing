"use client";

import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ProgressIndicator } from "@/components/iep-goal-writer/ProgressIndicator";
import type { FBAData, GeneratedBIP } from "./bipGenerator";
import { generateBIP, bipToText } from "./bipGenerator";
import { BIPOutput } from "./BIPOutput";

const ANTECEDENT_OPTIONS = [
  "Difficult or non-preferred tasks",
  "Transitions between activities",
  "Unstructured time (recess, lunch)",
  "Changes in routine",
  "Large group instruction",
  "Peer interactions / conflict",
  "When told 'no' or given a directive",
  "When attention is directed elsewhere",
  "When preferred items/activities are removed",
  "Sensory-rich environments (noise, lights, crowds)",
];

const SETTING_EVENT_OPTIONS = [
  "Poor sleep the night before",
  "Missed medication",
  "Conflict at home before school",
  "Hunger / missed meals",
  "Illness or physical discomfort",
  "Change in caregiver or home situation",
  "Previous behavioral incident earlier in the day",
  "Substitute teacher or unfamiliar staff",
];

const CONSEQUENCE_OPTIONS = [
  "Peer attention (laughter, reactions)",
  "Adult attention (reprimands, discussions)",
  "Removal from the task or activity",
  "Sent to the office / removed from class",
  "Loss of privileges",
  "Access to preferred item/activity",
  "Peer withdrawal / isolation",
  "Physical restraint or escort",
];

const FUNCTION_OPTIONS: Array<{ value: "attention" | "escape" | "tangible" | "sensory"; label: string; emoji: string; description: string }> = [
  { value: "attention", label: "Attention", emoji: "👋", description: "Behavior gets a reaction from adults or peers" },
  { value: "escape", label: "Escape / Avoidance", emoji: "🚪", description: "Behavior removes a demand, task, or situation" },
  { value: "tangible", label: "Tangible / Access", emoji: "🎯", description: "Behavior results in getting a preferred item or activity" },
  { value: "sensory", label: "Sensory / Automatic", emoji: "✨", description: "Behavior produces internal sensory stimulation" },
];

const steps = ["Student Info", "Behaviors", "Antecedents", "Consequences", "Function", "Replacement", "Context", "Review"];

const emptyBehavior = { name: "", operationalDefinition: "", frequency: "", duration: "", intensity: "moderate" as const };
const emptyReplacement = { behavior: "", rationale: "" };

const initialData: FBAData = {
  studentName: "",
  studentAge: "",
  studentGrade: "",
  school: "",
  dateOfFBA: "",
  teamMembers: "",
  targetBehaviors: [{ ...emptyBehavior }],
  antecedents: [],
  customAntecedents: "",
  settingEvents: [],
  customSettingEvents: "",
  consequences: [],
  customConsequences: "",
  functions: [],
  functionNotes: "",
  replacementBehaviors: [{ ...emptyReplacement }],
  studentStrengths: "",
  preferredActivities: "",
  communicationLevel: "",
  previousInterventions: "",
  safetyConcerrns: false,
  safetyConcernDetails: "",
};

export function FBAToBIPWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<FBAData>(initialData);
  const [generatedBIP, setGeneratedBIP] = useState<GeneratedBIP | null>(null);
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");

  const update = useCallback(<K extends keyof FBAData>(key: K, value: FBAData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleArrayItem = useCallback((key: "antecedents" | "settingEvents" | "consequences", item: string) => {
    setData((prev) => ({
      ...prev,
      [key]: prev[key].includes(item) ? prev[key].filter((i) => i !== item) : [...prev[key], item],
    }));
  }, []);

  const toggleFunction = useCallback((func: "attention" | "escape" | "tangible" | "sensory") => {
    setData((prev) => ({
      ...prev,
      functions: prev.functions.includes(func) ? prev.functions.filter((f) => f !== func) : [...prev.functions, func],
    }));
  }, []);

  const updateBehavior = useCallback((index: number, field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      targetBehaviors: prev.targetBehaviors.map((b, i) => i === index ? { ...b, [field]: value } : b),
    }));
  }, []);

  const updateReplacement = useCallback((index: number, field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      replacementBehaviors: prev.replacementBehaviors.map((r, i) => i === index ? { ...r, [field]: value } : r),
    }));
  }, []);

  const isStepValid = useMemo(() => {
    const b = data.targetBehaviors[0];
    return [
      // 0: Student Info
      data.studentName.trim().length > 1,
      // 1: Behaviors
      !!(b && b.name.trim().length > 2 && b.operationalDefinition.trim().length > 5),
      // 2: Antecedents
      data.antecedents.length > 0 || data.customAntecedents.trim().length > 3,
      // 3: Consequences
      data.consequences.length > 0 || data.customConsequences.trim().length > 3,
      // 4: Function
      data.functions.length > 0,
      // 5: Replacement
      !!(data.replacementBehaviors[0] && data.replacementBehaviors[0].behavior.trim().length > 3),
      // 6: Context
      true, // optional
      // 7: Review
      true,
    ];
  }, [data]);

  const handleGenerate = () => {
    const bip = generateBIP(data);
    setGeneratedBIP(bip);
    setShowEmailGate(true);
  };

  const handleEmailSubmit = async () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    // Fire and forget — store email (could be an API route later)
    try {
      await fetch("/api/fba-to-bip-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, timestamp: new Date().toISOString() }),
      });
    } catch {
      // Silently continue — don't block the user
    }
    setEmailSubmitted(true);
    setShowEmailGate(false);
  };

  const handleReset = () => {
    setData(initialData);
    setCurrentStep(0);
    setGeneratedBIP(null);
    setShowEmailGate(false);
    setEmailSubmitted(false);
    setEmail("");
  };

  const onNext = () => {
    if (currentStep < steps.length - 1 && isStepValid[currentStep]) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const onBack = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  // After email gate, show full output
  if (generatedBIP && emailSubmitted) {
    return <BIPOutput bip={generatedBIP} onReset={handleReset} />;
  }

  // Email gate
  if (showEmailGate && generatedBIP) {
    return (
      <div className="rounded-3xl border border-emerald-200/80 bg-white shadow-[0_25px_60px_-45px_rgba(15,23,42,0.6)]">
        <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-600 px-6 py-6 text-white">
          <span className="text-xs uppercase tracking-[0.3em] text-emerald-100">Almost There</span>
          <h2 className="mt-1 text-2xl font-semibold">Your BIP is Ready!</h2>
          <p className="mt-1 text-sm text-emerald-50/90">Enter your email to view and download your complete Behavior Intervention Plan.</p>
        </div>
        <div className="px-6 py-8">
          {/* Preview snippet */}
          <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5">
            <p className="text-sm font-semibold text-emerald-900">BIP Preview</p>
            <div className="mt-3 space-y-2 text-sm text-emerald-800">
              <p><span className="font-semibold">Student:</span> {generatedBIP.studentInfo.name}</p>
              <p><span className="font-semibold">Target Behavior:</span> {generatedBIP.behaviorDefinitions[0]?.name}</p>
              <p><span className="font-semibold">Function:</span> {data.functions.map((f) => f.charAt(0).toUpperCase() + f.slice(1)).join(", ")}</p>
              <p><span className="font-semibold">Sections included:</span> Behavior Definitions, Function Summary, Antecedent Strategies, Teaching Strategies, Reinforcement, Response Strategies, Data Collection, {generatedBIP.crisisPlan ? "Crisis Plan, " : ""}Generalization, Maintenance</p>
            </div>
            <div className="mt-3 h-20 rounded-xl bg-gradient-to-b from-transparent to-white" />
          </div>

          <div className="space-y-3">
            <Label htmlFor="email-gate" className="text-sm font-semibold">Email Address</Label>
            <Input
              id="email-gate"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@school.edu"
              onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
            />
            {emailError && <p className="text-xs text-red-600">{emailError}</p>}
            <Button onClick={handleEmailSubmit} className="w-full bg-emerald-600 hover:bg-emerald-700">
              View My Complete BIP
            </Button>
            <p className="text-center text-xs text-slate-500">
              We&apos;ll send you a copy and occasional behavior support tips. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-emerald-200/80 bg-white shadow-[0_25px_60px_-45px_rgba(15,23,42,0.6)]">
      <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-600 px-6 py-6 text-white">
        <div className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-[0.3em] text-emerald-100">FBA → BIP Generator</span>
          <h2 className="text-2xl font-semibold sm:text-3xl">Behavior Intervention Plan</h2>
          <p className="text-sm text-emerald-50/90">
            Enter your FBA data and generate a complete, professional BIP in minutes.
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
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Step {currentStep + 1} of {steps.length}</p>
              <h3 className="text-lg font-semibold text-slate-900 sm:text-xl">{steps[currentStep]}</h3>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {steps[currentStep]}
            </span>
          </div>

          <div className="mt-5 space-y-5">
            {/* Step 0: Student Info */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <p className="text-sm text-slate-600">Basic information about the student and assessment context.</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="student-name" className="text-sm font-semibold">Student Name *</Label>
                    <Input id="student-name" value={data.studentName} onChange={(e) => update("studentName", e.target.value)} placeholder="First name or initials" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="student-age" className="text-sm font-semibold">Age</Label>
                    <Input id="student-age" value={data.studentAge} onChange={(e) => update("studentAge", e.target.value)} placeholder="e.g., 8" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="student-grade" className="text-sm font-semibold">Grade</Label>
                    <Input id="student-grade" value={data.studentGrade} onChange={(e) => update("studentGrade", e.target.value)} placeholder="e.g., 3rd" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="school" className="text-sm font-semibold">School</Label>
                    <Input id="school" value={data.school} onChange={(e) => update("school", e.target.value)} placeholder="School name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date-fba" className="text-sm font-semibold">Date of FBA</Label>
                    <Input id="date-fba" type="date" value={data.dateOfFBA} onChange={(e) => update("dateOfFBA", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="team" className="text-sm font-semibold">Team Members</Label>
                    <Input id="team" value={data.teamMembers} onChange={(e) => update("teamMembers", e.target.value)} placeholder="e.g., BCBA, teacher, parent" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Target Behaviors */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <p className="text-sm text-slate-600">Define the target behavior(s) identified in the FBA. Be specific and observable.</p>
                {data.targetBehaviors.map((b, i) => (
                  <div key={i} className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900">Behavior {i + 1}</span>
                      {data.targetBehaviors.length > 1 && (
                        <button type="button" onClick={() => update("targetBehaviors", data.targetBehaviors.filter((_, idx) => idx !== i))} className="text-xs text-red-600 hover:text-red-800">Remove</button>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Behavior Name *</Label>
                      <Input value={b.name} onChange={(e) => updateBehavior(i, "name", e.target.value)} placeholder="e.g., Physical aggression toward peers" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Operational Definition *</Label>
                      <textarea
                        value={b.operationalDefinition}
                        onChange={(e) => updateBehavior(i, "operationalDefinition", e.target.value)}
                        placeholder="e.g., Any instance of hitting, kicking, pushing, or throwing objects at peers with force sufficient to cause pain or injury"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        rows={3}
                      />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">Frequency</Label>
                        <Input value={b.frequency} onChange={(e) => updateBehavior(i, "frequency", e.target.value)} placeholder="e.g., 3-5x per day" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">Duration</Label>
                        <Input value={b.duration} onChange={(e) => updateBehavior(i, "duration", e.target.value)} placeholder="e.g., 2-10 minutes" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">Intensity</Label>
                        <div className="flex gap-2">
                          {(["low", "moderate", "high"] as const).map((level) => (
                            <button
                              key={level}
                              type="button"
                              onClick={() => updateBehavior(i, "intensity", level)}
                              className={cn(
                                "flex-1 rounded-lg border px-2 py-2 text-xs font-semibold capitalize transition",
                                b.intensity === level
                                  ? level === "high" ? "border-red-400 bg-red-50 text-red-700" : level === "moderate" ? "border-amber-400 bg-amber-50 text-amber-700" : "border-emerald-400 bg-emerald-50 text-emerald-700"
                                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                              )}
                            >
                              {level}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {data.targetBehaviors.length < 3 && (
                  <button
                    type="button"
                    onClick={() => update("targetBehaviors", [...data.targetBehaviors, { ...emptyBehavior }])}
                    className="w-full rounded-xl border border-dashed border-emerald-300 bg-emerald-50/50 px-4 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
                  >
                    + Add Another Behavior
                  </button>
                )}
              </div>
            )}

            {/* Step 2: Antecedents & Setting Events */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div>
                  <p className="text-sm text-slate-600">What typically happens right before the behavior? Select all that apply.</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-900">Antecedents (Triggers)</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {ANTECEDENT_OPTIONS.map((option) => (
                      <label key={option} className={cn("flex items-center gap-3 rounded-xl border px-3 py-2 text-sm transition cursor-pointer", data.antecedents.includes(option) ? "border-emerald-500 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200")}>
                        <input type="checkbox" checked={data.antecedents.includes(option)} onChange={() => toggleArrayItem("antecedents", option)} className="h-4 w-4 rounded border-slate-300 text-emerald-600" />
                        {option}
                      </label>
                    ))}
                  </div>
                  <div className="space-y-2 pt-2">
                    <Label className="text-sm font-semibold">Other Antecedents</Label>
                    <Input value={data.customAntecedents} onChange={(e) => update("customAntecedents", e.target.value)} placeholder="Describe other triggers..." />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-900">Setting Events</p>
                  <p className="text-xs text-slate-500">Background conditions that make the behavior more likely.</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {SETTING_EVENT_OPTIONS.map((option) => (
                      <label key={option} className={cn("flex items-center gap-3 rounded-xl border px-3 py-2 text-sm transition cursor-pointer", data.settingEvents.includes(option) ? "border-amber-500 bg-amber-50 text-amber-800" : "border-slate-200 bg-white text-slate-600 hover:border-amber-200")}>
                        <input type="checkbox" checked={data.settingEvents.includes(option)} onChange={() => toggleArrayItem("settingEvents", option)} className="h-4 w-4 rounded border-slate-300 text-amber-600" />
                        {option}
                      </label>
                    ))}
                  </div>
                  <div className="space-y-2 pt-2">
                    <Label className="text-sm font-semibold">Other Setting Events</Label>
                    <Input value={data.customSettingEvents} onChange={(e) => update("customSettingEvents", e.target.value)} placeholder="Describe other setting events..." />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Consequences */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <p className="text-sm text-slate-600">What typically happens right after the behavior? These help identify the function.</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {CONSEQUENCE_OPTIONS.map((option) => (
                    <label key={option} className={cn("flex items-center gap-3 rounded-xl border px-3 py-2 text-sm transition cursor-pointer", data.consequences.includes(option) ? "border-emerald-500 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200")}>
                      <input type="checkbox" checked={data.consequences.includes(option)} onChange={() => toggleArrayItem("consequences", option)} className="h-4 w-4 rounded border-slate-300 text-emerald-600" />
                      {option}
                    </label>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Other Consequences</Label>
                  <Input value={data.customConsequences} onChange={(e) => update("customConsequences", e.target.value)} placeholder="Describe other consequences..." />
                </div>
              </div>
            )}

            {/* Step 4: Function */}
            {currentStep === 4 && (
              <div className="space-y-5">
                <p className="text-sm text-slate-600">Based on the FBA, what function(s) does the behavior serve? Select all that apply.</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {FUNCTION_OPTIONS.map((func) => (
                    <button
                      key={func.value}
                      type="button"
                      onClick={() => toggleFunction(func.value)}
                      className={cn(
                        "flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition",
                        data.functions.includes(func.value)
                          ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500"
                          : "border-slate-200 bg-white hover:border-emerald-200"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{func.emoji}</span>
                        <span className="text-sm font-semibold text-slate-900">{func.label}</span>
                      </div>
                      <span className="text-xs text-slate-500">{func.description}</span>
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Function Notes</Label>
                  <textarea
                    value={data.functionNotes}
                    onChange={(e) => update("functionNotes", e.target.value)}
                    placeholder="Any additional notes about the hypothesized function (e.g., 'Primarily escape during math, attention during unstructured time')"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    rows={3}
                  />
                </div>
                {data.functions.length > 0 && (
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-800">
                    <span className="font-semibold">Selected function(s):</span>{" "}
                    {data.functions.map((f) => f.charAt(0).toUpperCase() + f.slice(1)).join(", ")}
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Replacement Behaviors */}
            {currentStep === 5 && (
              <div className="space-y-5">
                <p className="text-sm text-slate-600">What appropriate behavior(s) should the student use instead? These should serve the same function.</p>
                {data.replacementBehaviors.map((rb, i) => (
                  <div key={i} className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900">Replacement Behavior {i + 1}</span>
                      {data.replacementBehaviors.length > 1 && (
                        <button type="button" onClick={() => update("replacementBehaviors", data.replacementBehaviors.filter((_, idx) => idx !== i))} className="text-xs text-red-600 hover:text-red-800">Remove</button>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Replacement Behavior *</Label>
                      <Input value={rb.behavior} onChange={(e) => updateReplacement(i, "behavior", e.target.value)} placeholder="e.g., Request a break using a break card" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Rationale</Label>
                      <Input value={rb.rationale} onChange={(e) => updateReplacement(i, "rationale", e.target.value)} placeholder="e.g., Serves the same escape function with less effort" />
                    </div>
                  </div>
                ))}
                {data.replacementBehaviors.length < 3 && (
                  <button
                    type="button"
                    onClick={() => update("replacementBehaviors", [...data.replacementBehaviors, { ...emptyReplacement }])}
                    className="w-full rounded-xl border border-dashed border-emerald-300 bg-emerald-50/50 px-4 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
                  >
                    + Add Another Replacement Behavior
                  </button>
                )}
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-800">
                  <p className="font-semibold">💡 Tip</p>
                  <p>The replacement behavior should be easier to do than the problem behavior and serve the same function. If the behavior is escape-maintained, teach the student to request a break.</p>
                </div>
              </div>
            )}

            {/* Step 6: Additional Context */}
            {currentStep === 6 && (
              <div className="space-y-5">
                <p className="text-sm text-slate-600">This information helps personalize the BIP strategies.</p>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Student Strengths</Label>
                  <textarea value={data.studentStrengths} onChange={(e) => update("studentStrengths", e.target.value)} placeholder="e.g., Strong reader, kind to younger students, loves animals, great at building with LEGOs" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" rows={2} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Preferred Activities / Reinforcers</Label>
                  <textarea value={data.preferredActivities} onChange={(e) => update("preferredActivities", e.target.value)} placeholder="e.g., iPad time, drawing, helping in the office, extra recess" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" rows={2} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Communication Level</Label>
                  <Input value={data.communicationLevel} onChange={(e) => update("communicationLevel", e.target.value)} placeholder="e.g., Verbal, uses full sentences; or Uses AAC device with 50+ icons" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Previous Interventions Tried</Label>
                  <textarea value={data.previousInterventions} onChange={(e) => update("previousInterventions", e.target.value)} placeholder="e.g., Token economy (partially effective), social stories (no change), check-in/check-out (helpful when consistent)" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" rows={2} />
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="safety-concerns"
                      checked={data.safetyConcerrns}
                      onChange={(e) => update("safetyConcerrns", e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-red-600"
                    />
                    <Label htmlFor="safety-concerns" className="text-sm font-semibold text-red-700">Safety Concerns Present</Label>
                  </div>
                  {data.safetyConcerrns && (
                    <textarea value={data.safetyConcernDetails} onChange={(e) => update("safetyConcernDetails", e.target.value)} placeholder="Describe the safety concerns (e.g., self-injurious behavior, elopement, aggression causing injury)" className="w-full rounded-xl border border-red-200 bg-white px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" rows={3} />
                  )}
                </div>
              </div>
            )}

            {/* Step 7: Review */}
            {currentStep === 7 && (
              <div className="space-y-5">
                <p className="text-sm text-slate-600">Review your FBA data before generating the BIP.</p>
                <div className="space-y-3">
                  {[
                    { label: "Student", value: `${data.studentName}${data.studentGrade ? `, Grade ${data.studentGrade}` : ""}` },
                    { label: "Target Behavior", value: data.targetBehaviors.map((b) => b.name).filter(Boolean).join("; ") || "—" },
                    { label: "Antecedents", value: [...data.antecedents, data.customAntecedents].filter(Boolean).join("; ") || "—" },
                    { label: "Consequences", value: [...data.consequences, data.customConsequences].filter(Boolean).join("; ") || "—" },
                    { label: "Function(s)", value: data.functions.map((f) => f.charAt(0).toUpperCase() + f.slice(1)).join(", ") || "—" },
                    { label: "Replacement Behavior(s)", value: data.replacementBehaviors.map((r) => r.behavior).filter(Boolean).join("; ") || "—" },
                    { label: "Safety Concerns", value: data.safetyConcerrns ? "Yes" : "No" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                      <span className="min-w-[140px] text-sm font-semibold text-slate-700">{item.label}</span>
                      <span className="text-sm text-slate-600">{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-800">
                  <p className="font-semibold">Ready to generate!</p>
                  <p>Your BIP will include: behavior definitions, function summary, antecedent strategies, teaching strategies, reinforcement & response strategies, data collection plan, {data.safetyConcerrns ? "crisis/safety plan, " : ""}generalization plan, and maintenance plan.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
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
              <Button onClick={handleGenerate} className="bg-emerald-600 hover:bg-emerald-700">
                Generate BIP
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
