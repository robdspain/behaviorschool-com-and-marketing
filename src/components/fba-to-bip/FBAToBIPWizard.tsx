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
import { Loader2, Wand2 } from 'lucide-react';

// ... (Options and initialData constants remain the same) ...

export function FBAToBIPWizard() {
  const [mode, setMode] = useState<'form' | 'paste'>('form');
  const [fbaText, setFbaText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState('');

  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<FBAData>(initialData);
  const [generatedBIP, setGeneratedBIP] = useState<GeneratedBIP | null>(null);
  // ... (email gate state remains the same) ...

  const hydrateData = (parsedData: Partial<FBAData>) => {
    const functionMap = {
      attention: "to get attention from adults",
      escape: "to avoid tasks or demands",
      tangible: "to get tangible items or activities",
      sensory: "sensory regulation"
    };
    const primaryFunc = functionMap[parsedData.functionOfBehavior?.toLowerCase() || ''] || '';

    setData(prev => ({
      ...prev,
      studentName: parsedData.studentName || prev.studentName,
      targetBehavior: parsedData.targetBehavior || prev.targetBehavior,
      targetBehaviorDefinition: parsedData.targetBehaviorDefinition || prev.targetBehaviorDefinition,
      problemBehaviorBaseline: parsedData.baselineData || prev.problemBehaviorBaseline,
      primaryFunction: primaryFunc,
      antecedents: parsedData.antecedents ? [parsedData.antecedents] : prev.antecedents,
      currentConsequences: parsedData.consequences ? [parsedData.consequences] : prev.currentConsequences,
      replacementBehavior: parsedData.replacementBehavior || prev.replacementBehavior,
    }));
  };

  const handleAnalyze = async () => {
    if (!fbaText.trim()) return;
    setIsAnalyzing(true);
    setAnalyzeError('');
    try {
      const res = await fetch("/netlify/functions/parse-fba", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fbaText }),
      });
      if (!res.ok) {
        throw new Error("The AI parser failed to analyze the document.");
      }
      const parsedData = await res.json();
      hydrateData(parsedData);
      setMode('form'); // Switch back to form view
      setCurrentStep(0); // Start review from step 1
    } catch (e) {
      setAnalyzeError(e instanceof Error ? e.message : "An unknown error occurred.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ... (update, toggleArrayItem, isStepValid, handleGenerate, etc. remain the same) ...

  // ... (Post-generation and email gate views remain the same) ...

  // ── Wizard ──

  return (
    <div className="rounded-3xl border border-emerald-200/80 bg-white shadow-[0_25px_60px_-45px_rgba(15,23,42,0.6)]">
      {/* Header */}
      <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-600 px-6 py-6 text-white">
        {/* ... header content ... */}
      </div>

      <div className="px-6 py-6">
        {/* Mode Toggle */}
        <div className="mb-4 flex justify-center rounded-lg bg-slate-100 p-1">
          <button onClick={() => setMode('form')} className={cn("w-full rounded-md py-2 text-sm font-semibold", mode === 'form' ? 'bg-white text-emerald-700 shadow' : 'text-slate-600')}>Fill Form Manually</button>
          <button onClick={() => setMode('paste')} className={cn("w-full rounded-md py-2 text-sm font-semibold", mode === 'paste' ? 'bg-white text-emerald-700 shadow' : 'text-slate-600')}>Paste Existing FBA</button>
        </div>

        {mode === 'paste' ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-5 sm:px-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Paste your FBA</h3>
            <p className="text-sm text-slate-600 mb-4">Paste the full text from your existing FBA document. The AI will analyze it and pre-fill the form for you.</p>
            <textarea
              value={fbaText}
              onChange={(e) => setFbaText(e.target.value)}
              placeholder="Paste your entire FBA document here..."
              className="w-full h-64 rounded-xl border border-slate-200 bg-white p-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <Button onClick={handleAnalyze} disabled={isAnalyzing || !fbaText.trim()} className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700">
              {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              Analyze & Pre-fill Form
            </Button>
            {analyzeError && <p className="mt-2 text-xs text-red-600">{analyzeError}</p>}
          </div>
        ) : (
          <>
            {/* Progress Indicator */}
            <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4">
              <ProgressIndicator steps={steps} currentStep={currentStep} />
            </div>

            {/* Form Steps */}
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-5 sm:px-6">
              {/* ... existing step-by-step form content ... */}
            </div>

            {/* Navigation */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* ... existing navigation buttons ... */}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ... (Field and CheckboxGrid components remain the same) ...


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
