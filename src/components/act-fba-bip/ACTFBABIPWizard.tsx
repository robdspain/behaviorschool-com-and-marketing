"use client";

import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ProgressIndicator } from "@/components/iep-goal-writer/ProgressIndicator";
import type { ACTFBAData, GradeLevel, BehaviorFunction, ACTProcess, ValueDomain } from "./actBipGenerator";
import {
  generateACTBIP,
  ACT_PROCESS_LABELS,
  VALUE_LABELS,
  ACT_SETTING_EVENT_OPTIONS,
  ANTECEDENT_OPTIONS,
  SETTING_EVENT_OPTIONS,
  CONSEQUENCE_OPTIONS,
} from "./actBipGenerator";
import type { GeneratedACTBIP } from "./actBipGenerator";
import { ACTBIPOutput } from "./ACTBIPOutput";

const FUNCTION_OPTIONS: Array<{ value: BehaviorFunction; label: string; emoji: string; description: string }> = [
  { value: "attention", label: "Attention", emoji: "👋", description: "Behavior gets a reaction from adults or peers" },
  { value: "escape", label: "Escape / Avoidance", emoji: "🚪", description: "Behavior removes a demand, task, or situation" },
  { value: "tangible", label: "Tangible / Access", emoji: "🎯", description: "Behavior results in getting a preferred item or activity" },
  { value: "sensory", label: "Sensory / Automatic", emoji: "✨", description: "Behavior produces internal sensory stimulation" },
];

const GRADE_LEVEL_OPTIONS: Array<{ value: GradeLevel; label: string }> = [
  { value: "prek-k", label: "Pre-K – Kindergarten" },
  { value: "1-3", label: "Grades 1–3" },
  { value: "4-5", label: "Grades 4–5" },
  { value: "6-8", label: "Grades 6–8" },
  { value: "9-12", label: "Grades 9–12" },
];

const steps = [
  "Student Info",
  "Behaviors",
  "Antecedents",
  "Consequences",
  "Function",
  "Values",
  "Psych Flex",
  "ACT Analysis",
  "Replacement",
  "Context",
  "Review",
];

const emptyBehavior = { name: "", operationalDefinition: "", frequency: "", duration: "", intensity: "moderate" as const };
const emptyReplacement = { behavior: "", valueConnection: "" };

const SAMPLE_STUDENT: ACTFBAData = {
  studentName: "Marcus T.",
  studentAge: "13",
  studentGrade: "7",
  gradeLevel: "6-8",
  school: "Sample Middle School",
  dateOfFBA: new Date().toISOString().split("T")[0],
  teamMembers: "BCBA, Special Ed Teacher, School Psychologist",
  targetBehaviors: [
    {
      name: "Task Refusal",
      operationalDefinition: "Marcus pushes materials away, puts his head down, or says 'I'm not doing this' within 2 minutes of an independent work task being presented. Occurs 4–6 times per day.",
      frequency: "4-6x daily",
      duration: "5–20 minutes per episode",
      intensity: "moderate"
    }
  ],
  antecedents: [
    "Independent academic task presented",
    "Transition between activities",
    "Request to complete written work"
  ],
  customAntecedents: "",
  settingEvents: [
    "Prior peer conflict earlier in the day",
    "Unstructured/less predictable schedule"
  ],
  customSettingEvents: "",
  consequences: [
    "Task removed or modified",
    "Adult attention and prompting",
    "Sent to alternative setting (office, hallway)"
  ],
  customConsequences: "",
  functions: ["escape"],
  functionNotes: "Behavior consistently results in removal from academic demands. Hypothesized primary function: escape from tasks perceived as difficult or potentially embarrassing.",
  studentValues: ["competence", "belonging", "growth"],
  valuesNotes: "Marcus reports wanting to 'be good at things' and to 'have friends who respect him.' He shows interest in sports and gaming. Avoids situations where he might appear incompetent in front of peers.",
  inflexibilityProcesses: ["cognitive_fusion", "experiential_avoidance", "self_as_content"],
  inflexibilityNotes: "Marcus frequently says 'I'm stupid' and 'I can't do this' — fused with a self-story of academic incompetence. Behavior appears to function as escape from the internal experience of inadequacy.",
  actSettingEvents: [
    "Increased cognitive fusion with academic self-stories",
    "Low psychological flexibility in response to academic frustration"
  ],
  customACTSettingEvents: "",
  actFunctionalAnalysis: "Marcus's task refusal functions as experiential avoidance — specifically escaping the internal experience of feeling incompetent or embarrassed. He is fused with the thought 'I can't do this/I'm stupid,' and task refusal provides short-term relief from that internal discomfort. The behavior moves him AWAY from his values of competence and belonging, creating a paradox: the very behavior meant to protect him from feeling incompetent reinforces his sense that he cannot handle academic challenges.",
  replacementBehaviors: [
    {
      behavior: "Request help using a 'help card' — place card on desk to signal need without calling attention",
      valueConnection: "Competence"
    },
    {
      behavior: "Use the 'pause and breathe' script: 'I need a minute' — then return to task within 2 minutes",
      valueConnection: "Growth"
    }
  ],
  studentStrengths: "Creative problem-solver, strong verbal skills, loyal to friends, shows leadership in unstructured settings, responds well to humor",
  preferredActivities: "Gaming, sports discussions, drawing, technology, peer-preferred tasks",
  communicationLevel: "Fully verbal; communicates with full sentences; sarcasm and humor are common",
  previousInterventions: "Token economy (inconsistent implementation), social stories (not generalized), CICO (some success with preferred adults, discontinued due to staffing)",
  safetyConcerrns: false,
  safetyConcernDetails: ""
};

const initialData: ACTFBAData = {
  studentName: "",
  studentAge: "",
  studentGrade: "",
  gradeLevel: "4-5",
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
  studentValues: [],
  valuesNotes: "",
  inflexibilityProcesses: [],
  inflexibilityNotes: "",
  actSettingEvents: [],
  customACTSettingEvents: "",
  actFunctionalAnalysis: "",
  replacementBehaviors: [{ ...emptyReplacement }],
  studentStrengths: "",
  preferredActivities: "",
  communicationLevel: "",
  previousInterventions: "",
  safetyConcerrns: false,
  safetyConcernDetails: "",
};

export function ACTFBABIPWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<ACTFBAData>(initialData);
  const [generatedBIP, setGeneratedBIP] = useState<GeneratedACTBIP | null>(null);
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");

  const update = useCallback(<K extends keyof ACTFBAData>(key: K, value: ACTFBAData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleArrayItem = useCallback((key: "antecedents" | "settingEvents" | "consequences" | "actSettingEvents", item: string) => {
    setData((prev) => ({
      ...prev,
      [key]: (prev[key] as string[]).includes(item)
        ? (prev[key] as string[]).filter((i) => i !== item)
        : [...(prev[key] as string[]), item],
    }));
  }, []);

  const toggleFunction = useCallback((func: BehaviorFunction) => {
    setData((prev) => ({
      ...prev,
      functions: prev.functions.includes(func) ? prev.functions.filter((f) => f !== func) : [...prev.functions, func],
    }));
  }, []);

  const toggleValue = useCallback((value: ValueDomain) => {
    setData((prev) => ({
      ...prev,
      studentValues: prev.studentValues.includes(value) ? prev.studentValues.filter((v) => v !== value) : [...prev.studentValues, value],
    }));
  }, []);

  const toggleProcess = useCallback((process: ACTProcess) => {
    setData((prev) => ({
      ...prev,
      inflexibilityProcesses: prev.inflexibilityProcesses.includes(process) ? prev.inflexibilityProcesses.filter((p) => p !== process) : [...prev.inflexibilityProcesses, process],
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
      // 5: Values
      data.studentValues.length > 0,
      // 6: Psych Flex
      data.inflexibilityProcesses.length > 0,
      // 7: ACT Analysis
      true, // optional text
      // 8: Replacement
      !!(data.replacementBehaviors[0] && data.replacementBehaviors[0].behavior.trim().length > 3),
      // 9: Context
      true,
      // 10: Review
      true,
    ];
  }, [data]);

  const handleGenerate = () => {
    const bip = generateACTBIP(data);
    setGeneratedBIP(bip);
    setShowEmailGate(true);
  };

  const handleEmailSubmit = async () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    try {
      await fetch("/api/collect-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, timestamp: new Date().toISOString(), source: "act-fba-bip" }),
      });
    } catch { /* silently continue */ }
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
    if (currentStep < steps.length - 1 && isStepValid[currentStep]) setCurrentStep((p) => p + 1);
  };
  const onBack = () => {
    if (currentStep > 0) setCurrentStep((p) => p - 1);
  };

  // Show full output after email
  if (generatedBIP && emailSubmitted) {
    return <ACTBIPOutput bip={generatedBIP} onReset={handleReset} />;
  }

  // Email gate
  if (showEmailGate && generatedBIP) {
    return (
      <div className="rounded-3xl border border-purple-200/80 bg-white shadow-[0_25px_60px_-45px_rgba(15,23,42,0.6)]">
        <div className="border-b border-purple-100 bg-gradient-to-r from-purple-800 via-purple-700 to-emerald-700 px-6 py-6 text-white">
          <span className="text-xs uppercase tracking-[0.3em] text-purple-100">Almost There</span>
          <h2 className="mt-1 text-2xl font-semibold">Your ACT-Informed FBA/BIP is Ready!</h2>
          <p className="mt-1 text-sm text-purple-50/90">Enter your email to view and download your complete report.</p>
        </div>
        <div className="px-6 py-8">
          <div className="mb-6 rounded-2xl border border-purple-100 bg-purple-50/50 p-5">
            <p className="text-sm font-semibold text-purple-900">Report Preview</p>
            <div className="mt-3 space-y-2 text-sm text-purple-800">
              <p><span className="font-semibold">Student:</span> {generatedBIP.studentInfo.name}</p>
              <p><span className="font-semibold">Target Behavior:</span> {generatedBIP.behaviorDefinitions[0]?.name}</p>
              <p><span className="font-semibold">Values Identified:</span> {data.studentValues.map((v) => VALUE_LABELS[v].label).join(", ")}</p>
              <p><span className="font-semibold">ACT Processes:</span> {data.inflexibilityProcesses.map((p) => ACT_PROCESS_LABELS[p].label).join(", ")}</p>
              <p><span className="font-semibold">Sections:</span> Values Assessment, Psych Flex Assessment, ACT Functional Analysis, Values-Aligned Replacements, Acceptance Strategies, Defusion Techniques, Committed Action Goals, Metaphors & Exercises, + all standard BIP sections</p>
            </div>
            <div className="mt-3 h-20 rounded-xl bg-gradient-to-b from-transparent to-white" />
          </div>
          <div className="space-y-3">
            <Label htmlFor="email-gate" className="text-sm font-semibold">Email Address</Label>
            <Input id="email-gate" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@school.edu" onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()} />
            {emailError && <p className="text-xs text-red-600">{emailError}</p>}
            <Button onClick={handleEmailSubmit} className="w-full bg-purple-600 hover:bg-purple-700">View My Complete ACT FBA/BIP</Button>
            <p className="text-center text-xs text-slate-500">We&apos;ll send you a copy and occasional behavior support tips. Unsubscribe anytime.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-purple-200/80 bg-white shadow-[0_25px_60px_-45px_rgba(15,23,42,0.6)]">
      <div className="border-b border-purple-100 bg-gradient-to-r from-purple-800 via-purple-700 to-emerald-700 px-6 py-6 text-white">
        <div className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-[0.3em] text-purple-100">ACT-Informed</span>
          <h2 className="text-2xl font-semibold sm:text-3xl">FBA & Behavior Intervention Plan</h2>
          <p className="text-sm text-purple-50/90">Acceptance and Commitment Training–informed assessment and intervention planning.</p>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4">
          <ProgressIndicator steps={steps} currentStep={currentStep} />
        </div>

        {/* Load Sample Case Banner */}
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-start gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-emerald-900">Try with a real case from the presentation</p>
            <p className="text-xs text-emerald-700 mt-1">Pre-fills a 7th-grade escape-motivated student with ACT analysis — jump straight to the output.</p>
          </div>
          <button
            type="button"
            onClick={() => { setData(SAMPLE_STUDENT); setCurrentStep(10); }}
            className="shrink-0 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition"
          >
            Load Sample Case →
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-700">Step {currentStep + 1} of {steps.length}</p>
              <h3 className="text-lg font-semibold text-slate-900 sm:text-xl">{steps[currentStep]}</h3>
            </div>
            <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">{steps[currentStep]}</span>
          </div>

          <div className="mt-5 space-y-5">
            {/* Step 0: Student Info */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <p className="text-sm text-slate-600">Basic information about the student and assessment context.</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Student Name *</Label>
                    <Input value={data.studentName} onChange={(e) => update("studentName", e.target.value)} placeholder="First name or initials" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Age</Label>
                    <Input value={data.studentAge} onChange={(e) => update("studentAge", e.target.value)} placeholder="e.g., 10" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Grade</Label>
                    <Input value={data.studentGrade} onChange={(e) => update("studentGrade", e.target.value)} placeholder="e.g., 4th" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Grade Level Band *</Label>
                    <div className="grid gap-2">
                      {GRADE_LEVEL_OPTIONS.map((gl) => (
                        <button key={gl.value} type="button" onClick={() => update("gradeLevel", gl.value)} className={cn("rounded-lg border px-3 py-2 text-sm text-left transition", data.gradeLevel === gl.value ? "border-purple-500 bg-purple-50 text-purple-800 ring-1 ring-purple-500" : "border-slate-200 bg-white text-slate-600 hover:border-purple-200")}>
                          {gl.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">School</Label>
                    <Input value={data.school} onChange={(e) => update("school", e.target.value)} placeholder="School name" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Date of FBA</Label>
                    <Input type="date" value={data.dateOfFBA} onChange={(e) => update("dateOfFBA", e.target.value)} />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label className="text-sm font-semibold">Team Members</Label>
                    <Input value={data.teamMembers} onChange={(e) => update("teamMembers", e.target.value)} placeholder="e.g., BCBA, teacher, parent, school psychologist" />
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
                      <Input value={b.name} onChange={(e) => updateBehavior(i, "name", e.target.value)} placeholder="e.g., Task refusal" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Operational Definition *</Label>
                      <textarea value={b.operationalDefinition} onChange={(e) => updateBehavior(i, "operationalDefinition", e.target.value)} placeholder="Observable, measurable definition..." className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500" rows={3} />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">Frequency</Label>
                        <Input value={b.frequency} onChange={(e) => updateBehavior(i, "frequency", e.target.value)} placeholder="e.g., 3-5x/day" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">Duration</Label>
                        <Input value={b.duration} onChange={(e) => updateBehavior(i, "duration", e.target.value)} placeholder="e.g., 5-15 min" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">Intensity</Label>
                        <div className="flex gap-2">
                          {(["low", "moderate", "high"] as const).map((level) => (
                            <button key={level} type="button" onClick={() => updateBehavior(i, "intensity", level)} className={cn("flex-1 rounded-lg border px-2 py-2 text-xs font-semibold capitalize transition", b.intensity === level ? level === "high" ? "border-red-400 bg-red-50 text-red-700" : level === "moderate" ? "border-amber-400 bg-amber-50 text-amber-700" : "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300")}>
                              {level}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {data.targetBehaviors.length < 3 && (
                  <button type="button" onClick={() => update("targetBehaviors", [...data.targetBehaviors, { ...emptyBehavior }])} className="w-full rounded-xl border border-dashed border-purple-300 bg-purple-50/50 px-4 py-3 text-sm font-semibold text-purple-700 hover:bg-purple-50">+ Add Another Behavior</button>
                )}
              </div>
            )}

            {/* Step 2: Antecedents & Setting Events */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <p className="text-sm text-slate-600">What happens before the behavior? Select all that apply.</p>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-900">Antecedents (Triggers)</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {ANTECEDENT_OPTIONS.map((option) => (
                      <label key={option} className={cn("flex items-center gap-3 rounded-xl border px-3 py-2 text-sm transition cursor-pointer", data.antecedents.includes(option) ? "border-purple-500 bg-purple-50 text-purple-800" : "border-slate-200 bg-white text-slate-600 hover:border-purple-200")}>
                        <input type="checkbox" checked={data.antecedents.includes(option)} onChange={() => toggleArrayItem("antecedents", option)} className="h-4 w-4 rounded border-slate-300 text-purple-600" />
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
                <p className="text-sm text-slate-600">What typically happens right after the behavior?</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {CONSEQUENCE_OPTIONS.map((option) => (
                    <label key={option} className={cn("flex items-center gap-3 rounded-xl border px-3 py-2 text-sm transition cursor-pointer", data.consequences.includes(option) ? "border-purple-500 bg-purple-50 text-purple-800" : "border-slate-200 bg-white text-slate-600 hover:border-purple-200")}>
                      <input type="checkbox" checked={data.consequences.includes(option)} onChange={() => toggleArrayItem("consequences", option)} className="h-4 w-4 rounded border-slate-300 text-purple-600" />
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
                <p className="text-sm text-slate-600">Based on the FBA, what function(s) does the behavior serve?</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {FUNCTION_OPTIONS.map((func) => (
                    <button key={func.value} type="button" onClick={() => toggleFunction(func.value)} className={cn("flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition", data.functions.includes(func.value) ? "border-purple-500 bg-purple-50 ring-1 ring-purple-500" : "border-slate-200 bg-white hover:border-purple-200")}>
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
                  <textarea value={data.functionNotes} onChange={(e) => update("functionNotes", e.target.value)} placeholder="Additional notes about the hypothesized function..." className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500" rows={3} />
                </div>
              </div>
            )}

            {/* Step 5: Values Assessment (ACT) */}
            {currentStep === 5 && (
              <div className="space-y-5">
                <div className="rounded-xl border border-purple-200 bg-purple-50/70 p-4">
                  <p className="text-sm font-semibold text-purple-900">🧭 ACT Values Assessment</p>
                  <p className="mt-1 text-xs text-purple-700">What matters to this student? Values are directions, not destinations. Select all that apply — you&apos;ll connect replacement behaviors to these values later.</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(Object.entries(VALUE_LABELS) as [ValueDomain, typeof VALUE_LABELS[ValueDomain]][]).map(([key, val]) => (
                    <button key={key} type="button" onClick={() => toggleValue(key)} className={cn("flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition", data.studentValues.includes(key) ? "border-purple-500 bg-purple-50 ring-1 ring-purple-500" : "border-slate-200 bg-white hover:border-purple-200")}>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{val.emoji}</span>
                        <span className="text-sm font-semibold text-slate-900">{val.label}</span>
                      </div>
                      <span className="text-xs text-slate-500">{val.description}</span>
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Values Notes</Label>
                  <textarea value={data.valuesNotes} onChange={(e) => update("valuesNotes", e.target.value)} placeholder="Additional observations about the student's values (from interview, observation, preference assessment)..." className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500" rows={3} />
                </div>
                {data.studentValues.length > 0 && (
                  <div className="rounded-xl border border-purple-100 bg-purple-50/70 px-4 py-3 text-sm text-purple-800">
                    <span className="font-semibold">Selected values:</span>{" "}
                    {data.studentValues.map((v) => `${VALUE_LABELS[v].emoji} ${VALUE_LABELS[v].label}`).join(", ")}
                  </div>
                )}
              </div>
            )}

            {/* Step 6: Psychological Flexibility Assessment (ACT) */}
            {currentStep === 6 && (
              <div className="space-y-5">
                <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
                  <p className="text-sm font-semibold text-amber-900">🔍 Psychological Flexibility Assessment</p>
                  <p className="mt-1 text-xs text-amber-700">Which ACT processes of inflexibility are contributing to the behavior? These represent the &quot;stuck points&quot; that the intervention will target.</p>
                </div>
                <div className="space-y-3">
                  {(Object.entries(ACT_PROCESS_LABELS) as [ACTProcess, typeof ACT_PROCESS_LABELS[ACTProcess]][]).map(([key, val]) => (
                    <button key={key} type="button" onClick={() => toggleProcess(key)} className={cn("flex w-full flex-col items-start gap-1 rounded-xl border p-4 text-left transition", data.inflexibilityProcesses.includes(key) ? "border-amber-500 bg-amber-50 ring-1 ring-amber-500" : "border-slate-200 bg-white hover:border-amber-200")}>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{val.emoji}</span>
                        <span className="text-sm font-semibold text-slate-900">{val.label}</span>
                      </div>
                      <span className="text-xs text-slate-500">{val.description}</span>
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Inflexibility Notes</Label>
                  <textarea value={data.inflexibilityNotes} onChange={(e) => update("inflexibilityNotes", e.target.value)} placeholder="Additional observations about psychological inflexibility patterns..." className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500" rows={3} />
                </div>
              </div>
            )}

            {/* Step 7: ACT Functional Analysis + ACT Setting Events */}
            {currentStep === 7 && (
              <div className="space-y-5">
                <div className="rounded-xl border border-purple-200 bg-purple-50/70 p-4">
                  <p className="text-sm font-semibold text-purple-900">🔬 ACT Lens: Functional Analysis</p>
                  <p className="mt-1 text-xs text-purple-700">How does the behavior relate to experiential avoidance or values-inconsistent action? This adds the ACT perspective to the standard functional analysis.</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">ACT Functional Analysis</Label>
                  <textarea value={data.actFunctionalAnalysis} onChange={(e) => update("actFunctionalAnalysis", e.target.value)} placeholder={`e.g., "${data.studentName || "The student"}'s behavior appears to function as experiential avoidance — escaping difficult internal experiences (anxiety, self-doubt) rather than sitting with discomfort and acting on values. The behavior moves them AWAY from what they care about (${data.studentValues.map((v) => VALUE_LABELS[v].label.toLowerCase()).join(", ") || "identified values"})."`} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500" rows={5} />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-900">ACT-Specific Setting Events</p>
                  <p className="text-xs text-slate-500">Psychological inflexibility patterns that set the stage for behavior.</p>
                  <div className="grid gap-2">
                    {ACT_SETTING_EVENT_OPTIONS.map((option) => (
                      <label key={option} className={cn("flex items-center gap-3 rounded-xl border px-3 py-2 text-sm transition cursor-pointer", data.actSettingEvents.includes(option) ? "border-purple-500 bg-purple-50 text-purple-800" : "border-slate-200 bg-white text-slate-600 hover:border-purple-200")}>
                        <input type="checkbox" checked={data.actSettingEvents.includes(option)} onChange={() => toggleArrayItem("actSettingEvents", option)} className="h-4 w-4 rounded border-slate-300 text-purple-600" />
                        {option}
                      </label>
                    ))}
                  </div>
                  <div className="space-y-2 pt-2">
                    <Label className="text-sm font-semibold">Other ACT Setting Events</Label>
                    <Input value={data.customACTSettingEvents} onChange={(e) => update("customACTSettingEvents", e.target.value)} placeholder="Other inflexibility-related setting events..." />
                  </div>
                </div>
              </div>
            )}

            {/* Step 8: Values-Aligned Replacement Behaviors */}
            {currentStep === 8 && (
              <div className="space-y-5">
                <div className="rounded-xl border border-purple-200 bg-purple-50/70 p-4">
                  <p className="text-sm font-semibold text-purple-900">🎯 Values-Aligned Replacement Behaviors</p>
                  <p className="mt-1 text-xs text-purple-700">Instead of just functional equivalents, define replacement behaviors that move the student TOWARD their values.</p>
                </div>
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
                      <Input value={rb.behavior} onChange={(e) => updateReplacement(i, "behavior", e.target.value)} placeholder="e.g., Request a break and then return to the task" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Connected Value</Label>
                      {data.studentValues.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {data.studentValues.map((v) => (
                            <button key={v} type="button" onClick={() => updateReplacement(i, "valueConnection", VALUE_LABELS[v].label)} className={cn("rounded-lg border px-3 py-1.5 text-xs font-semibold transition", rb.valueConnection === VALUE_LABELS[v].label ? "border-purple-500 bg-purple-50 text-purple-800" : "border-slate-200 bg-white text-slate-500 hover:border-purple-200")}>
                              {VALUE_LABELS[v].emoji} {VALUE_LABELS[v].label}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <Input value={rb.valueConnection} onChange={(e) => updateReplacement(i, "valueConnection", e.target.value)} placeholder="Which value does this connect to?" />
                      )}
                    </div>
                  </div>
                ))}
                {data.replacementBehaviors.length < 3 && (
                  <button type="button" onClick={() => update("replacementBehaviors", [...data.replacementBehaviors, { ...emptyReplacement }])} className="w-full rounded-xl border border-dashed border-purple-300 bg-purple-50/50 px-4 py-3 text-sm font-semibold text-purple-700 hover:bg-purple-50">+ Add Another Replacement Behavior</button>
                )}
                <div className="rounded-xl border border-purple-100 bg-purple-50/70 px-4 py-3 text-sm text-purple-800">
                  <p className="font-semibold">💡 ACT Tip</p>
                  <p>In ACT, replacement behaviors aren&apos;t just functional equivalents — they&apos;re &quot;toward moves&quot; that bring the student closer to what they value. Connect each replacement to a specific value.</p>
                </div>
              </div>
            )}

            {/* Step 9: Additional Context */}
            {currentStep === 9 && (
              <div className="space-y-5">
                <p className="text-sm text-slate-600">This helps personalize the BIP strategies.</p>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Student Strengths</Label>
                  <textarea value={data.studentStrengths} onChange={(e) => update("studentStrengths", e.target.value)} placeholder="e.g., Creative, loves to draw, kind to younger students" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500" rows={2} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Preferred Activities / Reinforcers</Label>
                  <textarea value={data.preferredActivities} onChange={(e) => update("preferredActivities", e.target.value)} placeholder="e.g., iPad, drawing, extra recess" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500" rows={2} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Communication Level</Label>
                  <Input value={data.communicationLevel} onChange={(e) => update("communicationLevel", e.target.value)} placeholder="e.g., Verbal, uses full sentences" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Previous Interventions Tried</Label>
                  <textarea value={data.previousInterventions} onChange={(e) => update("previousInterventions", e.target.value)} placeholder="e.g., Token economy, social stories, CICO" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500" rows={2} />
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="safety-act" checked={data.safetyConcerrns} onChange={(e) => update("safetyConcerrns", e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-red-600" />
                    <Label htmlFor="safety-act" className="text-sm font-semibold text-red-700">Safety Concerns Present</Label>
                  </div>
                  {data.safetyConcerrns && (
                    <textarea value={data.safetyConcernDetails} onChange={(e) => update("safetyConcernDetails", e.target.value)} placeholder="Describe safety concerns..." className="w-full rounded-xl border border-red-200 bg-white px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" rows={3} />
                  )}
                </div>
              </div>
            )}

            {/* Step 10: Review */}
            {currentStep === 10 && (
              <div className="space-y-5">
                <p className="text-sm text-slate-600">Review your ACT-informed FBA data before generating.</p>
                <div className="space-y-3">
                  {[
                    { label: "Student", value: `${data.studentName}${data.studentGrade ? `, Grade ${data.studentGrade}` : ""} (${GRADE_LEVEL_OPTIONS.find((g) => g.value === data.gradeLevel)?.label})` },
                    { label: "Target Behavior", value: data.targetBehaviors.map((b) => b.name).filter(Boolean).join("; ") || "—" },
                    { label: "Function(s)", value: data.functions.map((f) => f.charAt(0).toUpperCase() + f.slice(1)).join(", ") || "—" },
                    { label: "Student Values", value: data.studentValues.map((v) => `${VALUE_LABELS[v].emoji} ${VALUE_LABELS[v].label}`).join(", ") || "—" },
                    { label: "Inflexibility Processes", value: data.inflexibilityProcesses.map((p) => ACT_PROCESS_LABELS[p].label).join(", ") || "—" },
                    { label: "Replacement Behavior(s)", value: data.replacementBehaviors.map((r) => `${r.behavior}${r.valueConnection ? ` → ${r.valueConnection}` : ""}`).filter(Boolean).join("; ") || "—" },
                    { label: "Safety Concerns", value: data.safetyConcerrns ? "Yes" : "No" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                      <span className="min-w-[160px] text-sm font-semibold text-slate-700">{item.label}</span>
                      <span className="text-sm text-slate-600">{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-purple-100 bg-purple-50/70 px-4 py-3 text-sm text-purple-800">
                  <p className="font-semibold">Ready to generate!</p>
                  <p>Your ACT-informed FBA/BIP will include: values assessment, psychological flexibility assessment, ACT functional analysis, values-aligned replacement behaviors, acceptance strategies, defusion techniques, committed action goals, metaphors & exercises catalog, + all standard BIP sections.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="outline" onClick={onBack} disabled={currentStep === 0}>Back</Button>
          <div className="flex flex-1 items-center justify-end gap-3">
            {currentStep < steps.length - 1 && (
              <Button onClick={onNext} disabled={!isStepValid[currentStep]} className="bg-purple-600 hover:bg-purple-700">Next</Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button onClick={handleGenerate} className="bg-purple-600 hover:bg-purple-700">Generate ACT FBA/BIP</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
