"use client";

import { useState, useCallback } from "react";
import { Check, ChevronLeft, ChevronRight, Copy, Download, RotateCcw, Sparkles, Heart, Shield, Target, HandHelping, Scale, Users, Lightbulb, CheckCircle, TrendingUp, TrendingDown } from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

type StudentValue = "kind" | "brave" | "focused" | "helpful" | "honest" | "respectful" | "creative" | "responsible";
type BehaviorDirection = "increase" | "decrease";
type MeasurementType = "percentage" | "frequency" | "duration" | "latency";

interface WizardState {
  // Step 1
  selectedValue: StudentValue | null;
  // Step 2
  behaviorDirection: BehaviorDirection;
  targetBehavior: string;
  replacementBehavior: string; // for decrease
  // Step 3
  baseline: string;
  targetPercentage: number;
  measurementType: MeasurementType;
  // Step 4
  fluencyEnabled: boolean;
  fluencySeconds: number;
  generalizationSettings: string[];
  // Step 5
  maintenanceWeeks: number;
  // Meta
  studentName: string;
  targetDate: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const VALUES: { id: StudentValue; label: string; icon: React.ComponentType<{ className?: string }>; description: string }[] = [
  { id: "kind", label: "Kind", icon: Heart, description: "Caring about others" },
  { id: "brave", label: "Brave", icon: Shield, description: "Trying new things despite fear" },
  { id: "focused", label: "Focused", icon: Target, description: "Paying attention to what matters" },
  { id: "helpful", label: "Helpful", icon: HandHelping, description: "Supporting others" },
  { id: "honest", label: "Honest", icon: Scale, description: "Telling the truth" },
  { id: "respectful", label: "Respectful", icon: Users, description: "Treating others well" },
  { id: "creative", label: "Creative", icon: Lightbulb, description: "Thinking in new ways" },
  { id: "responsible", label: "Responsible", icon: CheckCircle, description: "Following through on commitments" },
];

const BEHAVIOR_EXAMPLES: Record<StudentValue, string[]> = {
  kind: ["Using kind words with peers", "Helping classmates with tasks", "Sharing materials", "Offering comfort when someone is sad"],
  brave: ["Asking questions in class", "Trying difficult tasks", "Speaking up in groups", "Attempting new activities"],
  focused: ["Staying on task during work time", "Following multi-step directions", "Completing assignments", "Listening during instruction"],
  helpful: ["Assisting classmates", "Volunteering for tasks", "Cleaning up without prompts", "Supporting peers in group work"],
  honest: ["Admitting mistakes", "Telling the truth when asked", "Taking responsibility for actions", "Being truthful about work completion"],
  respectful: ["Following adult directions", "Waiting turn to speak", "Using appropriate tone", "Respecting personal space"],
  creative: ["Generating new ideas", "Problem-solving independently", "Thinking of alternatives", "Expressing ideas uniquely"],
  responsible: ["Turning in work on time", "Bringing materials to class", "Following through on commitments", "Managing time effectively"],
};

const GENERALIZATION_SETTINGS = [
  "Structured classroom",
  "Small group instruction",
  "Independent work time",
  "Lunch/recess",
  "Transitions",
  "Specials (PE, art, music)",
  "With different adults",
  "Hallways",
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateGoalText(state: WizardState): string {
  const value = VALUES.find(v => v.id === state.selectedValue);
  const valueName = value?.label.toLowerCase() || "target";
  
  const settingsText = state.generalizationSettings.length > 0 
    ? state.generalizationSettings.slice(0, -1).join(", ").toLowerCase() + 
      (state.generalizationSettings.length > 1 ? ", and " : "") + 
      state.generalizationSettings[state.generalizationSettings.length - 1]?.toLowerCase()
    : "classroom settings";

  const fluencyText = state.fluencyEnabled 
    ? `, initiating the behavior within ${state.fluencySeconds} seconds of the relevant antecedent,` 
    : "";

  const measurementText: Record<MeasurementType, string> = {
    percentage: `in ${state.targetPercentage}% of opportunities`,
    frequency: `with a frequency of ${state.targetPercentage}% reduction from baseline`,
    duration: `for ${state.targetPercentage}% of the expected duration`,
    latency: `within ${state.targetPercentage}% of the expected latency`,
  };

  const behaviorText = state.behaviorDirection === "increase" 
    ? state.targetBehavior 
    : state.replacementBehavior;

  const studentRef = state.studentName || "[Student Name]";
  const dateRef = state.targetDate || "[Target Date]";

  return `By ${dateRef}, when in ${settingsText}, and given verbal or visual prompts as needed, ${studentRef} will ${state.behaviorDirection === "increase" ? "increase" : "demonstrate"} ${behaviorText} ${measurementText[state.measurementType]} for 3 consecutively measured school days${fluencyText} across ${state.generalizationSettings.length || 3} different school settings, as measured by teacher observation. Additionally, ${studentRef} will maintain the behavior for ${state.maintenanceWeeks} weeks following mastery to ensure long-term retention.`;
}

function generateBaselineText(state: WizardState): string {
  const studentRef = state.studentName || "[Student Name]";
  const value = VALUES.find(v => v.id === state.selectedValue);
  
  return `${studentRef} currently demonstrates ${state.targetBehavior || "the target behavior"} at ${state.baseline || "[baseline level]"}. This ${value?.label.toLowerCase() || "value"}-aligned behavior is inconsistent across different settings and staff members.`;
}

// ============================================================================
// STEP COMPONENTS
// ============================================================================

function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  const steps = ["Values", "Behavior", "Baseline", "Fluency", "Maintain"];
  
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((label, idx) => (
        <div key={label} className="flex items-center">
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors
            ${idx + 1 < currentStep ? "bg-emerald-600 text-white" : ""}
            ${idx + 1 === currentStep ? "bg-emerald-700 text-white ring-2 ring-emerald-300 ring-offset-2" : ""}
            ${idx + 1 > currentStep ? "bg-slate-200 text-slate-500" : ""}
          `}>
            {idx + 1 < currentStep ? <Check className="w-4 h-4" /> : idx + 1}
          </div>
          {idx < steps.length - 1 && (
            <div className={`w-8 h-0.5 mx-1 ${idx + 1 < currentStep ? "bg-emerald-600" : "bg-slate-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function Step1Values({ state, setState }: { state: WizardState; setState: (s: WizardState) => void }) {
  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Step 1: What Matters Most?</h2>
        <p className="text-slate-600">Pick the value this student wants to grow in (ask them if possible!)</p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {VALUES.map((value) => {
          const IconComponent = value.icon;
          return (
            <button
              key={value.id}
              type="button"
              onClick={() => setState({ ...state, selectedValue: value.id })}
              className={`
                p-4 rounded-xl border-2 text-center transition-all hover:shadow-md
                ${state.selectedValue === value.id 
                  ? "border-emerald-600 bg-emerald-50 shadow-md" 
                  : "border-slate-200 bg-white hover:border-emerald-300"}
              `}
            >
              <div className="flex justify-center mb-2">
                <IconComponent className={`w-8 h-8 ${state.selectedValue === value.id ? "text-emerald-600" : "text-slate-600"}`} />
              </div>
              <span className="font-semibold text-slate-900 block">{value.label}</span>
              <span className="text-xs text-slate-500">{value.description}</span>
            </button>
          );
        })}
      </div>
      
      {state.selectedValue && (() => {
        const selectedVal = VALUES.find(v => v.id === state.selectedValue);
        const SelectedIcon = selectedVal?.icon;
        return (
          <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <p className="text-sm text-emerald-800 flex items-center gap-2">
              <strong>Selected:</strong>
              {SelectedIcon && <SelectedIcon className="w-4 h-4 text-emerald-600" />}
              {selectedVal?.label}
            </p>
          </div>
        );
      })()}
    </div>
  );
}

function Step2Behavior({ state, setState }: { state: WizardState; setState: (s: WizardState) => void }) {
  const value = VALUES.find(v => v.id === state.selectedValue);
  const examples = state.selectedValue ? BEHAVIOR_EXAMPLES[state.selectedValue] : [];
  
  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Step 2: What Behavior?</h2>
        <p className="text-slate-600">
          Value: {value?.emoji} {value?.label}
        </p>
      </div>
      
      <div className="flex gap-3 mb-6">
        <button
          type="button"
          onClick={() => setState({ ...state, behaviorDirection: "increase" })}
          className={`flex-1 p-4 rounded-lg border-2 transition-all ${
            state.behaviorDirection === "increase" 
              ? "border-emerald-600 bg-emerald-50" 
              : "border-slate-200 hover:border-emerald-300"
          }`}
        >
          <div className="flex justify-center mb-1">
            <TrendingUp className={`w-6 h-6 ${state.behaviorDirection === "increase" ? "text-emerald-600" : "text-slate-500"}`} />
          </div>
          <span className="font-semibold">Increase</span>
          <span className="text-sm text-slate-500 block">Build a positive skill</span>
        </button>
        <button
          type="button"
          onClick={() => setState({ ...state, behaviorDirection: "decrease" })}
          className={`flex-1 p-4 rounded-lg border-2 transition-all ${
            state.behaviorDirection === "decrease" 
              ? "border-amber-600 bg-amber-50" 
              : "border-slate-200 hover:border-amber-300"
          }`}
        >
          <div className="flex justify-center mb-1">
            <TrendingDown className={`w-6 h-6 ${state.behaviorDirection === "decrease" ? "text-amber-600" : "text-slate-500"}`} />
          </div>
          <span className="font-semibold">Decrease</span>
          <span className="text-sm text-slate-500 block">Reduce problem behavior</span>
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            {state.behaviorDirection === "increase" 
              ? `What ${value?.label.toUpperCase()} behavior do you want to see MORE of?`
              : "What problem behavior needs to stop?"}
          </label>
          <input
            type="text"
            value={state.targetBehavior}
            onChange={(e) => setState({ ...state, targetBehavior: e.target.value })}
            placeholder={state.behaviorDirection === "increase" ? examples[0] : "e.g., Yelling at peers"}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
          {state.behaviorDirection === "increase" && examples.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-slate-500 mb-1">Examples:</p>
              <div className="flex flex-wrap gap-1">
                {examples.map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => setState({ ...state, targetBehavior: ex })}
                    className="text-xs px-2 py-1 bg-slate-100 rounded-full hover:bg-emerald-100 transition-colors"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {state.behaviorDirection === "decrease" && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              ⚠️ What should they do INSTEAD? (Replacement behavior)
            </label>
            <input
              type="text"
              value={state.replacementBehavior}
              onChange={(e) => setState({ ...state, replacementBehavior: e.target.value })}
              placeholder="e.g., Using calm voice to express frustration"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <p className="text-xs text-amber-700 mt-1">
              ABA Principle: Always teach a replacement behavior, not just reduce the problem.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Step3Baseline({ state, setState }: { state: WizardState; setState: (s: WizardState) => void }) {
  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Step 3: Baseline & Target</h2>
        <p className="text-slate-600">Where are they now? Where do we want them to be?</p>
      </div>
      
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Current Performance (Baseline)
          </label>
          <input
            type="text"
            value={state.baseline}
            onChange={(e) => setState({ ...state, baseline: e.target.value })}
            placeholder="e.g., 40% of opportunities, 2 times per day"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Target Performance: {state.targetPercentage}%
          </label>
          <input
            type="range"
            min="70"
            max="100"
            value={state.targetPercentage}
            onChange={(e) => setState({ ...state, targetPercentage: parseInt(e.target.value) })}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>70%</span>
            <span>85%</span>
            <span>100%</span>
          </div>
          {state.targetPercentage >= 90 && (
            <p className="text-xs text-emerald-700 mt-2 flex items-center gap-1">
              <Check className="w-3 h-3" /> Research shows 90-100% accuracy leads to better retention!
            </p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            How will you measure it?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "percentage" as const, label: "% of opportunities" },
              { id: "frequency" as const, label: "Frequency (times/day)" },
              { id: "duration" as const, label: "Duration (minutes)" },
              { id: "latency" as const, label: "Latency (seconds)" },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setState({ ...state, measurementType: opt.id })}
                className={`p-3 text-sm rounded-lg border-2 transition-all ${
                  state.measurementType === opt.id 
                    ? "border-emerald-600 bg-emerald-50 font-semibold" 
                    : "border-slate-200 hover:border-emerald-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Step4Fluency({ state, setState }: { state: WizardState; setState: (s: WizardState) => void }) {
  const toggleSetting = (setting: string) => {
    const current = state.generalizationSettings;
    if (current.includes(setting)) {
      setState({ ...state, generalizationSettings: current.filter(s => s !== setting) });
    } else {
      setState({ ...state, generalizationSettings: [...current, setting] });
    }
  };
  
  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Step 4: Fluency & Generalization</h2>
        <p className="text-slate-600">How fast? Where else should it work?</p>
      </div>
      
      <div className="space-y-6">
        <div className="p-4 bg-slate-50 rounded-lg">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={state.fluencyEnabled}
              onChange={(e) => setState({ ...state, fluencyEnabled: e.target.checked })}
              className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <div>
              <span className="font-semibold text-slate-900">Add fluency requirement</span>
              <p className="text-sm text-slate-500">Should the student respond quickly?</p>
            </div>
          </label>
          
          {state.fluencyEnabled && (
            <div className="mt-4 ml-8">
              <label className="text-sm text-slate-700">
                Within <input
                  type="number"
                  value={state.fluencySeconds}
                  onChange={(e) => setState({ ...state, fluencySeconds: parseInt(e.target.value) || 5 })}
                  className="w-16 px-2 py-1 mx-1 border border-slate-300 rounded text-center"
                  min="1"
                  max="60"
                /> seconds
              </label>
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Generalization Settings
            <span className="font-normal text-slate-500 ml-1">(pick at least 3 for best results)</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {GENERALIZATION_SETTINGS.map((setting) => (
              <button
                key={setting}
                type="button"
                onClick={() => toggleSetting(setting)}
                className={`p-3 text-sm text-left rounded-lg border-2 transition-all flex items-center gap-2 ${
                  state.generalizationSettings.includes(setting)
                    ? "border-emerald-600 bg-emerald-50"
                    : "border-slate-200 hover:border-emerald-300"
                }`}
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                  state.generalizationSettings.includes(setting)
                    ? "bg-emerald-600 border-emerald-600"
                    : "border-slate-300"
                }`}>
                  {state.generalizationSettings.includes(setting) && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
                {setting}
              </button>
            ))}
          </div>
          {state.generalizationSettings.length >= 3 && (
            <p className="text-xs text-emerald-700 mt-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Great! More settings = better skill transfer!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Step5Maintenance({ state, setState }: { state: WizardState; setState: (s: WizardState) => void }) {
  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Step 5: Maintenance</h2>
        <p className="text-slate-600">How long should the skill last?</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Maintenance Period: {state.maintenanceWeeks} weeks
          </label>
          <input
            type="range"
            min="2"
            max="8"
            value={state.maintenanceWeeks}
            onChange={(e) => setState({ ...state, maintenanceWeeks: parseInt(e.target.value) })}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>2 weeks</span>
            <span>4 weeks</span>
            <span>6 weeks</span>
            <span>8 weeks</span>
          </div>
          {state.maintenanceWeeks >= 4 && (
            <p className="text-xs text-emerald-700 mt-2 flex items-center gap-1">
              <Check className="w-3 h-3" /> Research recommends 4+ weeks for lasting behavior change!
            </p>
          )}
        </div>
        
        <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <p className="text-sm text-emerald-800">
            <strong>Maintenance Check:</strong> &ldquo;{state.studentName || "[Student]"} will maintain the behavior for {state.maintenanceWeeks} weeks following mastery to ensure long-term retention.&rdquo;
          </p>
        </div>
        
        <div className="pt-4 border-t border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Optional: Student Details</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Student Name (for goal text)</label>
              <input
                type="text"
                value={state.studentName}
                onChange={(e) => setState({ ...state, studentName: e.target.value })}
                placeholder="e.g., Alex"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Target Date</label>
              <input
                type="date"
                value={state.targetDate}
                onChange={(e) => setState({ ...state, targetDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoalOutput({ state, onReset }: { state: WizardState; onReset: () => void }) {
  const [copied, setCopied] = useState(false);
  const goalText = generateGoalText(state);
  const baselineText = generateBaselineText(state);
  const value = VALUES.find(v => v.id === state.selectedValue);
  const ValueIcon = value?.icon;
  
  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(`${goalText}\n\nBaseline:\n${baselineText}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [goalText, baselineText]);
  
  const levelChecks = [
    { label: "Baseline data", met: !!state.baseline },
    { label: `Fluency (${state.fluencySeconds} seconds)`, met: state.fluencyEnabled },
    { label: `High accuracy (${state.targetPercentage}%)`, met: state.targetPercentage >= 80 },
    { label: `Generalization (${state.generalizationSettings.length} settings)`, met: state.generalizationSettings.length >= 3 },
    { label: `Maintenance (${state.maintenanceWeeks} weeks)`, met: state.maintenanceWeeks >= 4 },
  ];
  
  const level = levelChecks.filter(c => c.met).length;
  
  return (
    <div>
      <div className="text-center mb-6">
        <div className="flex justify-center mb-2">
          <Sparkles className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Your IEP Behavior Goal</h2>
        <p className="text-sm text-slate-500 mt-1 flex items-center justify-center gap-1">
          {ValueIcon && <ValueIcon className="w-4 h-4 text-emerald-600" />}
          {value?.label} · {state.behaviorDirection === "increase" ? "Skill Building" : "Replacement Behavior"}
        </p>
      </div>
      
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
        <p className="text-slate-800 leading-relaxed mb-4">{goalText}</p>
        <div className="pt-4 border-t border-slate-200">
          <p className="text-sm font-semibold text-slate-700 mb-1">Baseline:</p>
          <p className="text-sm text-slate-600">{baselineText}</p>
        </div>
      </div>
      
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-emerald-900">Goal Level: {"⭐".repeat(level)}</span>
          <span className="text-sm text-emerald-700">Level {level}</span>
        </div>
        <div className="space-y-1">
          {levelChecks.map((check) => (
            <div key={check.label} className="flex items-center gap-2 text-sm">
              {check.met ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-300" />
              )}
              <span className={check.met ? "text-emerald-800" : "text-slate-500"}>{check.label}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied!" : "Copy Goal"}
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 border-2 border-emerald-700 text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Print / PDF
        </button>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Start Over
        </button>
      </div>
      
      {/* CTA */}
      <div className="bg-slate-900 text-white rounded-xl p-6 text-center">
        <h3 className="font-bold text-lg mb-2">
          Want to build behavior-based IEP goals systematically?
        </h3>
        <p className="text-slate-400 text-sm mb-4">
          The School BCBA Transformation Program cohort starts March 26. Early bird through March 21.
        </p>
        <a
          href="/transformation-program"
          className="inline-block bg-amber-500 text-slate-900 font-bold px-6 py-3 rounded-lg hover:bg-amber-400 transition-colors"
        >
          Learn More →
        </a>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ValuesWizard() {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<WizardState>({
    selectedValue: null,
    behaviorDirection: "increase",
    targetBehavior: "",
    replacementBehavior: "",
    baseline: "",
    targetPercentage: 90,
    measurementType: "percentage",
    fluencyEnabled: true,
    fluencySeconds: 5,
    generalizationSettings: ["Structured classroom", "Small group instruction", "Independent work time"],
    maintenanceWeeks: 4,
    studentName: "",
    targetDate: "",
  });
  const [showOutput, setShowOutput] = useState(false);
  
  const canProceed = () => {
    switch (step) {
      case 1: return !!state.selectedValue;
      case 2: return !!state.targetBehavior && (state.behaviorDirection === "increase" || !!state.replacementBehavior);
      case 3: return !!state.baseline;
      case 4: return state.generalizationSettings.length >= 1;
      case 5: return true;
      default: return false;
    }
  };
  
  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      setShowOutput(true);
    }
  };
  
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };
  
  const handleReset = () => {
    setStep(1);
    setShowOutput(false);
    setState({
      selectedValue: null,
      behaviorDirection: "increase",
      targetBehavior: "",
      replacementBehavior: "",
      baseline: "",
      targetPercentage: 90,
      measurementType: "percentage",
      fluencyEnabled: true,
      fluencySeconds: 5,
      generalizationSettings: ["Structured classroom", "Small group instruction", "Independent work time"],
      maintenanceWeeks: 4,
      studentName: "",
      targetDate: "",
    });
  };
  
  if (showOutput) {
    return <GoalOutput state={state} onReset={handleReset} />;
  }
  
  return (
    <div>
      <StepIndicator currentStep={step} totalSteps={5} />
      
      <div className="min-h-[400px]">
        {step === 1 && <Step1Values state={state} setState={setState} />}
        {step === 2 && <Step2Behavior state={state} setState={setState} />}
        {step === 3 && <Step3Baseline state={state} setState={setState} />}
        {step === 4 && <Step4Fluency state={state} setState={setState} />}
        {step === 5 && <Step5Maintenance state={state} setState={setState} />}
      </div>
      
      <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
        <button
          type="button"
          onClick={handleBack}
          disabled={step === 1}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            step === 1 
              ? "text-slate-300 cursor-not-allowed" 
              : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        
        <button
          type="button"
          onClick={handleNext}
          disabled={!canProceed()}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-colors ${
            canProceed()
              ? "bg-emerald-700 text-white hover:bg-emerald-800"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          {step === 5 ? "Generate Goal!" : "Next"}
          {step < 5 && <ChevronRight className="w-4 h-4" />}
          {step === 5 && <Sparkles className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
