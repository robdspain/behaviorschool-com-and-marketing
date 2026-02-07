"use client";

import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ProgressIndicator } from "@/components/iep-goal-writer/ProgressIndicator";
import type { FBAData, GeneratedBIP } from "./bipGenerator";
import { generateBIP } from "./bipGenerator";
import { BIPOutput } from "./BIPOutput";

// ─── Options ────────────────────────────────────────────────────────────

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

const FUNCTION_OPTIONS = [
  { value: "to get attention from adults", label: "To Get Adult Attention", emoji: "👋", description: "Behavior results in attention from teachers or staff" },
  { value: "to get attention from peers", label: "To Get Peer Attention", emoji: "👥", description: "Behavior results in reactions or attention from peers" },
  { value: "to avoid tasks or demands", label: "To Avoid Tasks / Demands", emoji: "🚪", description: "Behavior results in removal or delay of a task" },
  { value: "to avoid social situations", label: "To Avoid Social Situations", emoji: "🙈", description: "Behavior results in escape from social interaction" },
  { value: "to get tangible items or activities", label: "To Get Tangible / Access", emoji: "🎯", description: "Behavior results in getting a preferred item or activity" },
  { value: "sensory regulation", label: "Sensory Regulation", emoji: "✨", description: "Behavior produces internal sensory stimulation or relief" },
];

const ANTECEDENT_INTERVENTION_OPTIONS = [
  "Provide visual schedule for daily routine",
  "Use pre-corrective statements before transitions",
  "Offer task choices when possible",
  "Provide advance warnings (5 min, 2 min) before changes",
  "Use first-then board for non-preferred tasks",
  "Assign classroom jobs with built-in adult attention",
  "Provide sensory tools proactively",
  "Seat near teacher / away from distractions",
  "Pre-teach expectations before challenging activities",
  "Use environmental modifications (lighting, noise, seating)",
];

const REINFORCEMENT_OPTIONS = [
  "Behavior-specific praise (5:1 positive-to-corrective ratio)",
  "Token economy with preferred backup reinforcers",
  "Check-in / check-out system with adult feedback",
  "Earned breaks contingent on task completion",
  "Access to preferred activities contingent on replacement behavior",
  "Noncontingent reinforcement at scheduled intervals",
  "Group contingency (student earns for the class)",
  "Social praise from peers and adults",
];

const CONSEQUENCE_INTERVENTION_OPTIONS = [
  "Planned ignoring for minor attention-seeking behaviors",
  "Brief neutral redirect to replacement behavior",
  "Do not remove task demand contingent on problem behavior",
  "Differential reinforcement of replacement behavior (DRA)",
  "Response cost (loss of earned tokens/privileges)",
  "Time-out from reinforcement (if appropriate and function-matched)",
  "Natural consequences when safe and appropriate",
  "Redirect to cool-down area with re-entry plan",
];

const steps = [
  "Student Info",
  "Target Behavior",
  "Antecedents",
  "Consequences",
  "Function",
  "Replacement",
  "Interventions",
  "Data & Goals",
  "Review",
];

const initialData: FBAData = {
  studentName: "",
  studentAge: "",
  studentGrade: "",
  school: "",
  dateOfFBA: "",
  teamMembers: "",
  targetBehavior: "",
  targetBehaviorDefinition: "",
  precursors: "",
  triggers: "",
  problemBehaviorBaseline: "",
  primaryFunction: "",
  secondaryFunction: "",
  settingEvents: [],
  customSettingEvents: "",
  antecedents: [],
  customAntecedents: "",
  currentConsequences: [],
  customConsequences: "",
  replacementBehavior: "",
  replacementBehaviorBaseline: "",
  antecedentInterventions: [],
  customAntecedentInterventions: "",
  reinforcementProcedures: [],
  customReinforcementProcedures: "",
  consequenceInterventions: [],
  customConsequenceInterventions: "",
  dataCollectionMethod: "",
  dataCollectionPerson: "",
  dataCollectionFrequency: "",
  studentStrengths: "",
  preferredItems: "",
  previousInterventions: "",
  safetyConcerrns: false,
  safetyConcernDetails: "",
  successCriteria: "",
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

  const toggleArrayItem = useCallback(
    (key: "antecedents" | "settingEvents" | "currentConsequences" | "antecedentInterventions" | "reinforcementProcedures" | "consequenceInterventions", item: string) => {
      setData((prev) => ({
        ...prev,
        [key]: (prev[key] as string[]).includes(item)
          ? (prev[key] as string[]).filter((i) => i !== item)
          : [...(prev[key] as string[]), item],
      }));
    },
    []
  );

  const isStepValid = useMemo(() => [
    data.studentName.trim().length > 1, // 0: Student Info
    data.targetBehavior.trim().length > 2 && data.targetBehaviorDefinition.trim().length > 5, // 1: Target Behavior
    data.antecedents.length > 0 || data.customAntecedents.trim().length > 3, // 2: Antecedents
    data.currentConsequences.length > 0 || data.customConsequences.trim().length > 3, // 3: Consequences
    data.primaryFunction.length > 0, // 4: Function
    data.replacementBehavior.trim().length > 3, // 5: Replacement
    true, // 6: Interventions (optional — auto-generated from function)
    true, // 7: Data & Goals (optional)
    true, // 8: Review
  ], [data]);

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
    try {
      await fetch("/api/fba-to-bip-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, timestamp: new Date().toISOString() }),
      });
    } catch { /* continue */ }
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

  // ── Post-generation states ──

  if (generatedBIP && emailSubmitted) {
    return <BIPOutput bip={generatedBIP} onReset={handleReset} />;
  }

  if (showEmailGate && generatedBIP) {
    return (
      <div className="rounded-3xl border border-emerald-200/80 bg-white shadow-[0_25px_60px_-45px_rgba(15,23,42,0.6)]">
        <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-600 px-6 py-6 text-white">
          <span className="text-xs uppercase tracking-[0.3em] text-emerald-100">Almost There</span>
          <h2 className="mt-1 text-2xl font-semibold">Your BIP is Ready!</h2>
          <p className="mt-1 text-sm text-emerald-50/90">Enter your email to view and download your complete Behavior Intervention Plan.</p>
        </div>
        <div className="px-6 py-8">
          <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5">
            <p className="text-sm font-semibold text-emerald-900">BIP Preview</p>
            <div className="mt-3 space-y-2 text-sm text-emerald-800">
              <p><span className="font-semibold">Student:</span> {generatedBIP.studentInfo.name}</p>
              <p><span className="font-semibold">Target Behavior:</span> {generatedBIP.targetBehaviorForReduction.behavior}</p>
              <p><span className="font-semibold">Function:</span> {generatedBIP.primaryFunction}{generatedBIP.secondaryFunction ? ` / ${generatedBIP.secondaryFunction}` : ""}</p>
              <p><span className="font-semibold">Sections:</span> Target Behavior, Baseline, Function, Replacement Behavior, Antecedent Interventions, Reinforcement Procedures, Consequence Interventions, Data Collection, Criteria for Success, Goals{generatedBIP.crisisPlan ? ", Crisis Plan" : ""}</p>
            </div>
            <div className="mt-3 h-20 rounded-xl bg-gradient-to-b from-transparent to-white" />
          </div>
          <div className="space-y-3">
            <Label htmlFor="email-gate" className="text-sm font-semibold">Email Address</Label>
            <Input id="email-gate" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@school.edu" onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()} />
            {emailError && <p className="text-xs text-red-600">{emailError}</p>}
            <Button onClick={handleEmailSubmit} className="w-full bg-emerald-600 hover:bg-emerald-700">View My Complete BIP</Button>
            <p className="text-center text-xs text-slate-500">We&apos;ll send you a copy and occasional behavior support tips. Unsubscribe anytime.</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Wizard ──

  return (
    <div className="rounded-3xl border border-emerald-200/80 bg-white shadow-[0_25px_60px_-45px_rgba(15,23,42,0.6)]">
      <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-600 px-6 py-6 text-white">
        <div className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-[0.3em] text-emerald-100">FBA → BIP Generator</span>
          <h2 className="text-2xl font-semibold sm:text-3xl">Behavior Intervention Plan</h2>
          <p className="text-sm text-emerald-50/90">Enter your FBA data and generate a complete, professional BIP in minutes.</p>
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
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{steps[currentStep]}</span>
          </div>

          <div className="mt-5 space-y-5">
            {/* ── Step 0: Student Info ── */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <p className="text-sm text-slate-600">Basic information about the student and assessment context.</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Student Name *" value={data.studentName} onChange={(v) => update("studentName", v)} placeholder="First name or initials" />
                  <Field label="Grade" value={data.studentGrade} onChange={(v) => update("studentGrade", v)} placeholder="e.g., 3rd" />
                  <Field label="School" value={data.school} onChange={(v) => update("school", v)} placeholder="School name" />
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Date of FBA</Label>
                    <Input type="date" value={data.dateOfFBA} onChange={(e) => update("dateOfFBA", e.target.value)} />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label className="text-sm font-semibold">Team Members / Examiner(s)</Label>
                    <Input value={data.teamMembers} onChange={(e) => update("teamMembers", e.target.value)} placeholder="e.g., BCBA, teacher, parent, school psychologist" />
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 1: Target Behavior for Reduction ── */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <p className="text-sm text-slate-600">Define the observable and measurable target behavior for reduction, as identified in the FBA.</p>
                <Field label="Target Behavior *" value={data.targetBehavior} onChange={(v) => update("targetBehavior", v)} placeholder="e.g., Physical aggression toward peers" />
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Operational Definition *</Label>
                  <textarea value={data.targetBehaviorDefinition} onChange={(e) => update("targetBehaviorDefinition", e.target.value)} placeholder="e.g., Any instance of hitting, kicking, pushing, or throwing objects at peers with force sufficient to cause pain or injury" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" rows={3} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Precursors</Label>
                  <textarea value={data.precursors} onChange={(e) => update("precursors", e.target.value)} placeholder="e.g., Clenching fists, verbal threats, leaving seat, increased volume" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" rows={2} />
                  <p className="text-xs text-slate-500">Observable behaviors that typically occur before the target behavior.</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Triggers</Label>
                  <textarea value={data.triggers} onChange={(e) => update("triggers", e.target.value)} placeholder="e.g., Being told to stop a preferred activity, peer teasing, difficult academic tasks" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" rows={2} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Baseline for Problem Behavior</Label>
                  <Input value={data.problemBehaviorBaseline} onChange={(e) => update("problemBehaviorBaseline", e.target.value)} placeholder="e.g., 3-5 times per day, 2-10 minutes per episode" />
                  <p className="text-xs text-slate-500">How often or how long is the problem behavior currently occurring?</p>
                </div>
              </div>
            )}

            {/* ── Step 2: Antecedents & Setting Events ── */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <p className="text-sm text-slate-600">Events immediately before the behavior and background conditions that make it more likely.</p>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-900">Antecedent Conditions</p>
                  <CheckboxGrid options={ANTECEDENT_OPTIONS} selected={data.antecedents} onToggle={(item) => toggleArrayItem("antecedents", item)} />
                  <div className="pt-2 space-y-2">
                    <Label className="text-sm font-semibold">Other Antecedents</Label>
                    <Input value={data.customAntecedents} onChange={(e) => update("customAntecedents", e.target.value)} placeholder="Describe other triggers..." />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-900">Setting Events</p>
                  <p className="text-xs text-slate-500">Previous events that influence the likelihood of problem behavior.</p>
                  <CheckboxGrid options={SETTING_EVENT_OPTIONS} selected={data.settingEvents} onToggle={(item) => toggleArrayItem("settingEvents", item)} color="amber" />
                  <div className="pt-2 space-y-2">
                    <Label className="text-sm font-semibold">Other Setting Events</Label>
                    <Input value={data.customSettingEvents} onChange={(e) => update("customSettingEvents", e.target.value)} placeholder="Describe other setting events..." />
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 3: Current Consequences ── */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <p className="text-sm text-slate-600">What currently happens immediately following the behavior? This helps confirm the function.</p>
                <CheckboxGrid options={CONSEQUENCE_OPTIONS} selected={data.currentConsequences} onToggle={(item) => toggleArrayItem("currentConsequences", item)} />
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Other Consequences</Label>
                  <Input value={data.customConsequences} onChange={(e) => update("customConsequences", e.target.value)} placeholder="Describe other consequences..." />
                </div>
              </div>
            )}

            {/* ── Step 4: Function of Behavior ── */}
            {currentStep === 4 && (
              <div className="space-y-5">
                <p className="text-sm text-slate-600">What is the hypothesized reason why the behavior occurs? (to get / to avoid / sensory regulation)</p>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-900">Primary Function *</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {FUNCTION_OPTIONS.map((func) => (
                      <button
                        key={func.value}
                        type="button"
                        onClick={() => update("primaryFunction", func.value)}
                        className={cn(
                          "flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition",
                          data.primaryFunction === func.value
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
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-900">Secondary Function (optional)</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {FUNCTION_OPTIONS.filter((f) => f.value !== data.primaryFunction).map((func) => (
                      <button
                        key={func.value}
                        type="button"
                        onClick={() => update("secondaryFunction", data.secondaryFunction === func.value ? "" : func.value)}
                        className={cn(
                          "flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition",
                          data.secondaryFunction === func.value
                            ? "border-amber-500 bg-amber-50 ring-1 ring-amber-500"
                            : "border-slate-200 bg-white hover:border-amber-200"
                        )}
                      >
                        <span>{func.emoji}</span>
                        <span className="font-medium text-slate-700">{func.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                {data.primaryFunction && (
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-800">
                    <span className="font-semibold">Hypothesized function:</span>{" "}
                    {data.primaryFunction}{data.secondaryFunction ? ` / ${data.secondaryFunction}` : ""}
                  </div>
                )}
              </div>
            )}

            {/* ── Step 5: Replacement Behavior ── */}
            {currentStep === 5 && (
              <div className="space-y-5">
                <p className="text-sm text-slate-600">What should the student do instead of the problem behavior? The replacement should serve the same function.</p>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Replacement Behavior *</Label>
                  <textarea value={data.replacementBehavior} onChange={(e) => update("replacementBehavior", e.target.value)} placeholder="e.g., Request a break using a break card or verbal request ('I need a minute')" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" rows={3} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Baseline for Replacement Behavior</Label>
                  <Input value={data.replacementBehaviorBaseline} onChange={(e) => update("replacementBehaviorBaseline", e.target.value)} placeholder="e.g., 0-1 times per day, only with direct prompting" />
                  <p className="text-xs text-slate-500">How often is the student currently using the replacement behavior?</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Student Strengths</Label>
                  <textarea value={data.studentStrengths} onChange={(e) => update("studentStrengths", e.target.value)} placeholder="e.g., Strong reader, kind to younger students, loves animals, great at building with LEGOs" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" rows={2} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Preferred Items / Activities</Label>
                  <Input value={data.preferredItems} onChange={(e) => update("preferredItems", e.target.value)} placeholder="e.g., iPad time, drawing, helping in the office, extra recess" />
                </div>
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-800">
                  <p className="font-semibold">💡 Tip</p>
                  <p>The replacement behavior must serve the same function as the problem behavior and be easier for the student to perform. If the behavior is {data.primaryFunction || "escape-maintained"}, teach a functionally equivalent alternative.</p>
                </div>
              </div>
            )}

            {/* ── Step 6: Interventions ── */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <p className="text-sm text-slate-600">Select interventions or add your own. Function-matched strategies will be added automatically.</p>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-900">Antecedent Interventions</p>
                  <p className="text-xs text-slate-500">What interventions will reduce the likelihood of the problem behavior before it occurs?</p>
                  <CheckboxGrid options={ANTECEDENT_INTERVENTION_OPTIONS} selected={data.antecedentInterventions} onToggle={(item) => toggleArrayItem("antecedentInterventions", item)} />
                  <div className="space-y-2 pt-1">
                    <Label className="text-sm font-semibold">Additional Antecedent Interventions</Label>
                    <Input value={data.customAntecedentInterventions} onChange={(e) => update("customAntecedentInterventions", e.target.value)} placeholder="Describe additional prevention strategies..." />
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-900">Reinforcement Procedures</p>
                  <p className="text-xs text-slate-500">How will the replacement behavior and other positive behaviors be reinforced?</p>
                  <CheckboxGrid options={REINFORCEMENT_OPTIONS} selected={data.reinforcementProcedures} onToggle={(item) => toggleArrayItem("reinforcementProcedures", item)} />
                  <div className="space-y-2 pt-1">
                    <Label className="text-sm font-semibold">Additional Reinforcement Procedures</Label>
                    <Input value={data.customReinforcementProcedures} onChange={(e) => update("customReinforcementProcedures", e.target.value)} placeholder="Describe additional reinforcement..." />
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-900">Consequence Interventions</p>
                  <p className="text-xs text-slate-500">What will others do when the problem behavior occurs to decrease its future likelihood?</p>
                  <CheckboxGrid options={CONSEQUENCE_INTERVENTION_OPTIONS} selected={data.consequenceInterventions} onToggle={(item) => toggleArrayItem("consequenceInterventions", item)} />
                  <div className="space-y-2 pt-1">
                    <Label className="text-sm font-semibold">Additional Consequence Interventions</Label>
                    <Input value={data.customConsequenceInterventions} onChange={(e) => update("customConsequenceInterventions", e.target.value)} placeholder="Describe additional consequence strategies..." />
                  </div>
                </div>

                <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-800">
                  <p className="font-semibold">ℹ️ Auto-generated strategies</p>
                  <p>Additional function-matched strategies based on &quot;{data.primaryFunction || "the selected function"}&quot; will be included automatically in the final BIP.</p>
                </div>
              </div>
            )}

            {/* ── Step 7: Data Collection & Goals ── */}
            {currentStep === 7 && (
              <div className="space-y-5">
                <p className="text-sm text-slate-600">How will data be collected? What does success look like?</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Data Collection Method</Label>
                    <Input value={data.dataCollectionMethod} onChange={(e) => update("dataCollectionMethod", e.target.value)} placeholder="e.g., Frequency count, ABC data, interval recording" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Person Responsible</Label>
                    <Input value={data.dataCollectionPerson} onChange={(e) => update("dataCollectionPerson", e.target.value)} placeholder="e.g., Classroom teacher, instructional aide" />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label className="text-sm font-semibold">How Often</Label>
                    <Input value={data.dataCollectionFrequency} onChange={(e) => update("dataCollectionFrequency", e.target.value)} placeholder="e.g., Daily during identified target periods" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Criteria for Success</Label>
                  <textarea value={data.successCriteria} onChange={(e) => update("successCriteria", e.target.value)} placeholder="How will you know the plan is successful? How will it be faded? (Leave blank for auto-generated criteria)" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" rows={3} />
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="safety-concerns" checked={data.safetyConcerrns} onChange={(e) => update("safetyConcerrns", e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-red-600" />
                    <Label htmlFor="safety-concerns" className="text-sm font-semibold text-red-700">Safety Concerns Present</Label>
                  </div>
                  {data.safetyConcerrns && (
                    <textarea value={data.safetyConcernDetails} onChange={(e) => update("safetyConcernDetails", e.target.value)} placeholder="Describe the safety concerns (e.g., self-injurious behavior, elopement, aggression causing injury)" className="w-full rounded-xl border border-red-200 bg-white px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" rows={3} />
                  )}
                </div>
              </div>
            )}

            {/* ── Step 8: Review ── */}
            {currentStep === 8 && (
              <div className="space-y-5">
                <p className="text-sm text-slate-600">Review your FBA data before generating the BIP.</p>
                <div className="space-y-3">
                  {[
                    { label: "Student", value: `${data.studentName}${data.studentGrade ? `, Grade ${data.studentGrade}` : ""}` },
                    { label: "Target Behavior", value: data.targetBehavior || "—" },
                    { label: "Baseline", value: data.problemBehaviorBaseline || "—" },
                    { label: "Primary Function", value: data.primaryFunction || "—" },
                    { label: "Secondary Function", value: data.secondaryFunction || "None" },
                    { label: "Replacement Behavior", value: data.replacementBehavior || "—" },
                    { label: "Antecedent Interventions", value: `${data.antecedentInterventions.length} selected + auto-generated` },
                    { label: "Reinforcement Procedures", value: `${data.reinforcementProcedures.length} selected + auto-generated` },
                    { label: "Consequence Interventions", value: `${data.consequenceInterventions.length} selected + auto-generated` },
                    { label: "Safety Concerns", value: data.safetyConcerrns ? "Yes — crisis plan will be included" : "No" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                      <span className="min-w-[160px] text-sm font-semibold text-slate-700">{item.label}</span>
                      <span className="text-sm text-slate-600">{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-800">
                  <p className="font-semibold">Ready to generate!</p>
                  <p>Your BIP will include: Target Behavior for Reduction, Baseline, Function, Replacement Behavior, Antecedent Interventions, Reinforcement Procedures, Consequence Interventions, Data Collection, Criteria for Success, and Goals.</p>
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
              <Button onClick={onNext} disabled={!isStepValid[currentStep]}>Next</Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button onClick={handleGenerate} className="bg-emerald-600 hover:bg-emerald-700">Generate BIP</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Shared components ──────────────────────────────────────────────────

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold">{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

function CheckboxGrid({ options, selected, onToggle, color = "emerald" }: { options: string[]; selected: string[]; onToggle: (item: string) => void; color?: "emerald" | "amber" }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((option) => (
        <label
          key={option}
          className={cn(
            "flex items-center gap-3 rounded-xl border px-3 py-2 text-sm transition cursor-pointer",
            selected.includes(option)
              ? color === "amber"
                ? "border-amber-500 bg-amber-50 text-amber-800"
                : "border-emerald-500 bg-emerald-50 text-emerald-800"
              : `border-slate-200 bg-white text-slate-600 hover:border-${color}-200`
          )}
        >
          <input
            type="checkbox"
            checked={selected.includes(option)}
            onChange={() => onToggle(option)}
            className={`h-4 w-4 rounded border-slate-300 text-${color}-600`}
          />
          {option}
        </label>
      ))}
    </div>
  );
}
