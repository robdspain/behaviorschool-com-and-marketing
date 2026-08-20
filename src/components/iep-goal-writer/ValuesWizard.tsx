"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ClipboardCheck,
  Copy,
  Download,
  RotateCcw,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  buildOutput,
  buildLiveDraft,
  defaultAnnualGoalDate,
  measurementDefaults,
} from "./goalWriterLogic";
import type { BehaviorDirection, GoalWriterData } from "./goalWriterLogic";

const STEPS = [
  "Student and behavior",
  "Baseline",
  "Context and supports",
  "Goal and measurement",
  "Review",
];

const INCREASE_EXAMPLES = [
  "on-task behavior",
  "following directions",
  "functional communication",
  "work completion",
];

const DECREASE_EXAMPLES = [
  "leaving the assigned area",
  "physical aggression",
  "verbal disruption",
  "task refusal",
];

const GENERALIZATION_SETTINGS = [
  "General education classroom",
  "Small group instruction",
  "Independent work",
  "Lunch and recess",
  "Transitions",
  "PE, art, or music",
  "Different adults",
  "Hallways",
];

function initialData(): GoalWriterData {
  return {
    annualGoalDate: defaultAnnualGoalDate(),
    studentName: "",
    direction: "decrease",
    behaviorTitle: "",
    behaviorDefinition: "",
    replacementBehavior: "",
    baselineFrequency: "",
    baselineUnit: "instances per day",
    baselinePercent: "",
    baselineDays: "3",
    baselineMethods: "",
    context: "",
    supports: "",
    dataMethod: "",
    ...measurementDefaults("decrease"),
    fluencyEnabled: false,
    fluencySeconds: "10",
    generalizationSettings: [],
    maintenanceWeeks: "4",
    includeObjectives: false,
  };
}

function FieldLabel({ children, optional = false }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <label className="mb-1.5 block text-sm font-semibold text-slate-800">
      {children}
      {optional && <span className="ml-1 font-normal text-slate-500">(optional)</span>}
    </label>
  );
}

function ExampleButtons({ examples, onSelect }: { examples: string[]; onSelect: (value: string) => void }) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {examples.map((example) => (
        <button
          key={example}
          type="button"
          onClick={() => onSelect(example)}
          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-emerald-500 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
        >
          {example}
        </button>
      ))}
    </div>
  );
}

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-8" aria-label={`Step ${currentStep} of ${STEPS.length}: ${STEPS[currentStep - 1]}`}>
      <p className="mb-3 text-center text-sm font-semibold text-emerald-800 sm:hidden">
        Step {currentStep}: {STEPS[currentStep - 1]}
      </p>
      <ol className="grid grid-cols-5 gap-1 sm:gap-3">
        {STEPS.map((label, index) => {
          const stepNumber = index + 1;
          const isComplete = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          return (
            <li key={label} className="min-w-0 text-center">
              <div className="flex items-center">
                <span className={`h-0.5 flex-1 ${index === 0 ? "bg-transparent" : isComplete || isCurrent ? "bg-emerald-600" : "bg-slate-200"}`} />
                <span
                  aria-current={isCurrent ? "step" : undefined}
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    isComplete || isCurrent
                      ? "bg-emerald-700 text-white"
                      : "bg-slate-100 text-slate-500"
                  } ${isCurrent ? "ring-2 ring-emerald-200 ring-offset-2" : ""}`}
                >
                  {isComplete ? <Check className="h-4 w-4" aria-hidden="true" /> : stepNumber}
                </span>
                <span className={`h-0.5 flex-1 ${index === STEPS.length - 1 ? "bg-transparent" : isComplete ? "bg-emerald-600" : "bg-slate-200"}`} />
              </div>
              <span className={`mt-2 hidden text-xs leading-4 sm:block ${isCurrent ? "font-semibold text-emerald-800" : "text-slate-500"}`}>
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-7">
      <h2 className="text-2xl font-bold text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

export default function BehaviorGoalWriter() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<GoalWriterData>(initialData);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => buildOutput(data), [data]);
  const liveDraft = useMemo(() => buildLiveDraft(data), [data]);

  function update<K extends keyof GoalWriterData>(key: K, value: GoalWriterData[K]) {
    setData((current) => ({ ...current, [key]: value }));
    setError("");
  }

  function changeDirection(direction: BehaviorDirection) {
    setData((current) => ({
      ...current,
      direction,
      ...measurementDefaults(direction),
    }));
    setError("");
  }

  function validateCurrentStep(): string {
    if (step === 1) {
      if (!data.annualGoalDate) return "Enter the annual goal date.";
      if (!data.behaviorTitle.trim()) return "Name the observable behavior or skill.";
      if (!data.behaviorDefinition.trim()) return "Write a measurable, observable definition.";
      if (data.direction === "decrease" && !data.replacementBehavior.trim()) {
        return "Describe the replacement behavior or skill to teach.";
      }
    }
    if (step === 2) {
      if (data.direction === "decrease" && !data.baselineFrequency.trim()) {
        return "Enter the baseline frequency or rate.";
      }
      if (data.direction === "increase" && !data.baselinePercent.trim()) {
        return "Enter the baseline percentage.";
      }
      if (!data.baselineMethods.trim()) return "Describe how the baseline was measured.";
    }
    if (step === 3) {
      if (!data.context.trim()) return "Describe the conditions in which the behavior should occur.";
      if (!data.supports.trim()) return "Describe the supports that will be available.";
    }
    if (step === 4) {
      if (!data.dataMethod.trim()) return "Enter the data-collection method.";
      if (!data.accuracy.trim()) return "Enter the mastery criterion.";
      if (!data.consistency.trim()) return "Enter the consistency criterion.";
      if (data.fluencyEnabled && !data.fluencySeconds.trim()) return "Enter the fluency criterion in seconds.";
    }
    return "";
  }

  function nextStep() {
    const validationError = validateCurrentStep();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setStep((current) => Math.min(STEPS.length, current + 1));
  }

  function previousStep() {
    setError("");
    setStep((current) => Math.max(1, current - 1));
  }

  function toggleSetting(setting: string) {
    update(
      "generalizationSettings",
      data.generalizationSettings.includes(setting)
        ? data.generalizationSettings.filter((item) => item !== setting)
        : [...data.generalizationSettings, setting]
    );
  }

  async function copyOutput() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function downloadOutput() {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${data.behaviorTitle.trim().replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "iep-behavior-goal"}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function reset() {
    setData(initialData());
    setStep(1);
    setError("");
    setCopied(false);
  }

  return (
    <div>
      <StepIndicator currentStep={step} />

      {step === 1 && (
        <section>
          <SectionHeading
            title="Student and behavior"
            description="Start with an observable behavior. If the goal reduces a behavior, identify the skill the student should use instead."
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <FieldLabel>Annual goal date</FieldLabel>
              <input
                type="date"
                value={data.annualGoalDate}
                onChange={(event) => update("annualGoalDate", event.target.value)}
                className="h-12 w-full rounded-lg border border-slate-300 px-3 text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
              <p className="mt-1.5 text-xs text-slate-500">The generated goal uses MM/DD/YYYY.</p>
            </div>
            <div>
              <FieldLabel optional>Student name</FieldLabel>
              <input
                type="text"
                value={data.studentName}
                onChange={(event) => update("studentName", event.target.value)}
                placeholder="Student name"
                className="h-12 w-full rounded-lg border border-slate-300 px-3 text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>
          </div>

          <fieldset className="mt-6">
            <legend className="mb-2 text-sm font-semibold text-slate-800">Goal direction</legend>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                aria-pressed={data.direction === "increase"}
                onClick={() => changeDirection("increase")}
                className={`flex min-h-16 items-center justify-center gap-3 rounded-lg border px-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${data.direction === "increase" ? "border-emerald-700 bg-emerald-50 text-emerald-950" : "border-slate-300 text-slate-700 hover:border-emerald-500"}`}
              >
                <TrendingUp className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span><span className="block font-semibold">Increase</span><span className="block text-xs">Build a skill</span></span>
              </button>
              <button
                type="button"
                aria-pressed={data.direction === "decrease"}
                onClick={() => changeDirection("decrease")}
                className={`flex min-h-16 items-center justify-center gap-3 rounded-lg border px-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${data.direction === "decrease" ? "border-emerald-700 bg-emerald-50 text-emerald-950" : "border-slate-300 text-slate-700 hover:border-emerald-500"}`}
              >
                <TrendingDown className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span><span className="block font-semibold">Decrease</span><span className="block text-xs">Reduce a behavior</span></span>
              </button>
            </div>
          </fieldset>

          <div className="mt-6">
            <FieldLabel>Behavior or skill</FieldLabel>
            <input
              type="text"
              value={data.behaviorTitle}
              onChange={(event) => update("behaviorTitle", event.target.value)}
              placeholder={data.direction === "increase" ? "on-task behavior" : "leaving the assigned area"}
              className="h-12 w-full rounded-lg border border-slate-300 px-3 text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
            <ExampleButtons
              examples={data.direction === "increase" ? INCREASE_EXAMPLES : DECREASE_EXAMPLES}
              onSelect={(value) => update("behaviorTitle", value)}
            />
          </div>

          <div className="mt-6">
            <FieldLabel>Measurable and observable definition</FieldLabel>
            <textarea
              value={data.behaviorDefinition}
              onChange={(event) => update("behaviorDefinition", event.target.value)}
              rows={4}
              placeholder="Describe exactly what an observer would see or hear, including when the behavior begins and ends when relevant."
              className="w-full resize-y rounded-lg border border-slate-300 px-3 py-3 text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          {data.direction === "decrease" && (
            <div className="mt-6">
              <FieldLabel>Replacement behavior or skill</FieldLabel>
              <textarea
                value={data.replacementBehavior}
                onChange={(event) => update("replacementBehavior", event.target.value)}
                rows={3}
                placeholder="request a break using a break card"
                className="w-full resize-y rounded-lg border border-slate-300 px-3 py-3 text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
              <p className="mt-1.5 text-xs text-slate-500">Use a verb phrase that can follow the student&apos;s name in the generated goal.</p>
            </div>
          )}
        </section>
      )}

      {step === 2 && (
        <section>
          <SectionHeading
            title="Baseline"
            description="Enter the current level of performance and how it was measured. The baseline will appear separately from the annual goal."
          />
          {data.direction === "decrease" ? (
            <div className="grid gap-5 sm:grid-cols-[1fr_1.4fr]">
              <div>
                <FieldLabel>Current average</FieldLabel>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  inputMode="decimal"
                  value={data.baselineFrequency}
                  onChange={(event) => update("baselineFrequency", event.target.value)}
                  placeholder="6"
                  className="h-12 w-full rounded-lg border border-slate-300 px-3 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>
              <div>
                <FieldLabel>Frequency or rate unit</FieldLabel>
                <select
                  value={data.baselineUnit}
                  onChange={(event) => update("baselineUnit", event.target.value)}
                  className="h-12 w-full rounded-lg border border-slate-300 bg-white px-3 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                >
                  <option>instances per day</option>
                  <option>instances per class period</option>
                  <option>instances per hour</option>
                  <option>minutes per day</option>
                  <option>minutes per class period</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <FieldLabel>Current percentage of opportunities</FieldLabel>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    inputMode="numeric"
                    value={data.baselinePercent}
                    onChange={(event) => update("baselinePercent", event.target.value)}
                    placeholder="40"
                    className="h-12 w-full rounded-lg border border-slate-300 px-3 pr-10 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                  <span className="pointer-events-none absolute right-3 top-3 text-slate-500">%</span>
                </div>
              </div>
              <div>
                <FieldLabel>School days measured</FieldLabel>
                <input
                  type="number"
                  min="1"
                  inputMode="numeric"
                  value={data.baselineDays}
                  onChange={(event) => update("baselineDays", event.target.value)}
                  className="h-12 w-full rounded-lg border border-slate-300 px-3 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>
            </div>
          )}

          <div className="mt-6">
            <FieldLabel>How the baseline was measured</FieldLabel>
            <textarea
              value={data.baselineMethods}
              onChange={(event) => update("baselineMethods", event.target.value)}
              rows={3}
              placeholder="direct observation using event recording across three class periods"
              className="w-full resize-y rounded-lg border border-slate-300 px-3 py-3 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>
        </section>
      )}

      {step === 3 && (
        <section>
          <SectionHeading
            title="Context and supports"
            description="Define the conditions in which performance is expected and the supports the team plans to provide."
          />
          <div>
            <FieldLabel>Context or condition</FieldLabel>
            <textarea
              value={data.context}
              onChange={(event) => update("context", event.target.value)}
              rows={3}
              placeholder="a difficult independent task is presented"
              className="w-full resize-y rounded-lg border border-slate-300 px-3 py-3 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>
          <div className="mt-6">
            <FieldLabel>Supports provided</FieldLabel>
            <textarea
              value={data.supports}
              onChange={(event) => update("supports", event.target.value)}
              rows={3}
              placeholder="a visual checklist and one verbal prompt"
              className="w-full resize-y rounded-lg border border-slate-300 px-3 py-3 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>
        </section>
      )}

      {step === 4 && (
        <section>
          <SectionHeading
            title="Goal and measurement"
            description="Confirm the mastery and consistency criteria, then add only the components that are relevant to this student and goal."
          />
          <div>
            <FieldLabel>Data-collection method</FieldLabel>
            <input
              type="text"
              value={data.dataMethod}
              onChange={(event) => update("dataMethod", event.target.value)}
              placeholder="direct observation using event recording"
              className="h-12 w-full rounded-lg border border-slate-300 px-3 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <FieldLabel>Mastery criterion</FieldLabel>
              <input
                type="text"
                value={data.accuracy}
                onChange={(event) => update("accuracy", event.target.value)}
                className="h-12 w-full rounded-lg border border-slate-300 px-3 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>
            <div>
              <FieldLabel>Consistency criterion</FieldLabel>
              <input
                type="text"
                value={data.consistency}
                onChange={(event) => update("consistency", event.target.value)}
                className="h-12 w-full rounded-lg border border-slate-300 px-3 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>
          </div>

          <div className="mt-7 border-t border-slate-200 pt-6">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={data.fluencyEnabled}
                onChange={(event) => update("fluencyEnabled", event.target.checked)}
                className="mt-0.5 h-5 w-5 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
              />
              <span><span className="block text-sm font-semibold text-slate-800">Add a fluency criterion</span><span className="block text-xs leading-5 text-slate-500">Use this only when response latency is important to the goal.</span></span>
            </label>
            {data.fluencyEnabled && (
              <div className="mt-4 max-w-xs">
                <FieldLabel>Initiates within how many seconds?</FieldLabel>
                <input
                  type="number"
                  min="1"
                  inputMode="numeric"
                  value={data.fluencySeconds}
                  onChange={(event) => update("fluencySeconds", event.target.value)}
                  className="h-12 w-full rounded-lg border border-slate-300 px-3 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>
            )}
          </div>

          <fieldset className="mt-7 border-t border-slate-200 pt-6">
            <legend className="text-sm font-semibold text-slate-800">Generalization settings <span className="font-normal text-slate-500">(optional)</span></legend>
            <p className="mt-1 text-xs leading-5 text-slate-500">Select only settings in which the team plans to measure the criterion.</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {GENERALIZATION_SETTINGS.map((setting) => {
                const selected = data.generalizationSettings.includes(setting);
                return (
                  <button
                    key={setting}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleSetting(setting)}
                    className={`flex min-h-11 items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${selected ? "border-emerald-700 bg-emerald-50 font-medium text-emerald-950" : "border-slate-300 text-slate-700 hover:border-emerald-500"}`}
                  >
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${selected ? "border-emerald-700 bg-emerald-700 text-white" : "border-slate-300 bg-white"}`}>
                      {selected && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                    </span>
                    {setting}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-7 grid gap-5 border-t border-slate-200 pt-6 sm:grid-cols-2">
            <div>
              <FieldLabel optional>Maintenance period</FieldLabel>
              <select
                value={data.maintenanceWeeks}
                onChange={(event) => update("maintenanceWeeks", event.target.value)}
                className="h-12 w-full rounded-lg border border-slate-300 bg-white px-3 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              >
                <option value="">No maintenance criterion</option>
                <option value="2">2 weeks</option>
                <option value="4">4 weeks</option>
                <option value="6">6 weeks</option>
                <option value="8">8 weeks</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex min-h-12 w-full cursor-pointer items-center gap-3 rounded-lg border border-slate-300 px-3">
                <input
                  type="checkbox"
                  checked={data.includeObjectives}
                  onChange={(event) => update("includeObjectives", event.target.checked)}
                  className="h-5 w-5 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                />
                <span className="text-sm font-semibold text-slate-800">Include four quarterly objectives</span>
              </label>
            </div>
          </div>
        </section>
      )}

      {step === 5 && (
        <section>
          <SectionHeading
            title="Review the generated goal"
            description="Review the wording and criteria with the student’s IEP team. Copy or download the text, then edit it in the student’s plan as needed."
          />

          <dl className="mb-6 grid gap-x-6 gap-y-4 border-y border-slate-200 py-5 sm:grid-cols-2">
            <div><dt className="text-xs font-semibold uppercase text-slate-500">Direction</dt><dd className="mt-1 text-sm text-slate-900">{data.direction === "increase" ? "Increase a skill" : "Decrease a behavior and teach a replacement"}</dd></div>
            <div><dt className="text-xs font-semibold uppercase text-slate-500">Target</dt><dd className="mt-1 text-sm text-slate-900">{data.behaviorTitle}</dd></div>
            <div><dt className="text-xs font-semibold uppercase text-slate-500">Mastery</dt><dd className="mt-1 text-sm text-slate-900">{data.accuracy}</dd></div>
            <div><dt className="text-xs font-semibold uppercase text-slate-500">Measurement</dt><dd className="mt-1 text-sm text-slate-900">{data.dataMethod}</dd></div>
          </dl>

          <div className="rounded-lg border border-emerald-200 bg-emerald-50/50">
            <div className="flex items-center justify-between gap-3 border-b border-emerald-200 px-4 py-3">
              <div className="flex items-center gap-2 font-semibold text-emerald-950">
                <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
                Generated text
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={copyOutput}
                  title="Copy generated text"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-300 bg-white text-emerald-800 hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                >
                  {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                  <span className="sr-only">{copied ? "Copied" : "Copy generated text"}</span>
                </button>
                <button
                  type="button"
                  onClick={downloadOutput}
                  title="Download generated text"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-300 bg-white text-emerald-800 hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Download generated text</span>
                </button>
              </div>
            </div>
            <pre className="whitespace-pre-wrap break-words px-4 py-5 font-sans text-sm leading-7 text-slate-800">{output}</pre>
          </div>

          <p className="mt-4 text-xs leading-5 text-slate-500">
            This tool organizes the information you enter. The IEP team remains responsible for reviewing student-specific appropriateness, measurement, and implementation.
          </p>

          <button
            type="button"
            onClick={reset}
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Start a new goal
          </button>
        </section>
      )}

      {step < 5 && (
        <section className="mt-8 rounded-lg border border-slate-200 bg-slate-50" aria-live="polite">
          <div className="border-b border-slate-200 px-4 py-3">
            <h3 className="text-sm font-semibold text-slate-900">Live draft</h3>
            <p className="mt-0.5 text-xs text-slate-500">This wording updates as you type.</p>
          </div>
          <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words px-4 py-4 font-sans text-sm leading-6 text-slate-700">{liveDraft}</pre>
        </section>
      )}

      <div className="mt-8" aria-live="polite">
        {error && (
          <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
            {error}
          </p>
        )}
        {copied && <p className="sr-only">Generated text copied.</p>}
        <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-6">
          <button
            type="button"
            onClick={previousStep}
            disabled={step === 1}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </button>
          {step < STEPS.length && (
            <button
              type="button"
              onClick={nextStep}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-emerald-700 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              {step === STEPS.length - 1 ? "Generate goal" : "Continue"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
