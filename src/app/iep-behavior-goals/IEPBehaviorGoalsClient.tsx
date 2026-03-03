"use client";

import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type BehaviorFlowData = {
  studentName: string;
  direction: "increase" | "decrease";
  behaviorTitle: string;
  behaviorDefinition: string;
  baselineRate: string;
  baselineWindow: string;
  settingContext: string;
  supports: string;
  dataMethod: string;
  successCriteria: string;
  dueDate: string;
};

type KcusdData = {
  targetBehavior: string;
  baselineStatement: string;
  latencyTarget: string;
  fluencyTarget: string;
  generalizationPlan: string;
  maintenancePlan: string;
  dueDate: string;
};

const behaviorSteps = [
  "Student + Behavior",
  "Baseline",
  "Context + Supports",
  "Measurement",
  "Review + Output",
];

const kcUsdSteps = [
  "Baseline",
  "Latency + Fluency",
  "Generalization",
  "Maintenance",
  "Review + Output",
];

const behaviorInitial: BehaviorFlowData = {
  studentName: "",
  direction: "decrease",
  behaviorTitle: "",
  behaviorDefinition: "",
  baselineRate: "",
  baselineWindow: "",
  settingContext: "",
  supports: "",
  dataMethod: "",
  successCriteria: "",
  dueDate: "",
};

const kcInitial: KcusdData = {
  targetBehavior: "",
  baselineStatement: "",
  latencyTarget: "",
  fluencyTarget: "",
  generalizationPlan: "",
  maintenancePlan: "",
  dueDate: "",
};

function outputDate(dueDate: string) {
  if (dueDate.trim()) return dueDate.trim();
  return "the next annual IEP review date";
}

export function IEPBehaviorGoalsClient() {
  const [tab, setTab] = useState("behavior-goals");

  return (
    <main className="min-h-screen bg-bs-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <Breadcrumbs
          items={[
            { label: "Products", href: "/products" },
            { label: "IEP Behavior Goals" },
          ]}
        />

        <header className="mt-6 rounded-2xl border border-bs-primary/15 bg-white p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-bs-primary">BehaviorSchool Tool</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-bs-primary">IEP Behavior Goals + IEP Goal Writer</h1>
          <p className="mt-3 max-w-3xl text-slate-700">
            Use a guided 5-step flow to build measurable behavior goals quickly. Choose the tab that matches your use case.
          </p>
        </header>

        <Tabs value={tab} onValueChange={setTab} className="mt-8">
          <TabsList className="h-auto w-full grid grid-cols-1 sm:grid-cols-2 rounded-xl border border-bs-primary/20 bg-white p-1">
            <TabsTrigger
              value="behavior-goals"
              className="h-auto px-4 py-3 data-[state=active]:bg-bs-primary data-[state=active]:text-white"
            >
              Behavior Goals
            </TabsTrigger>
            <TabsTrigger
              value="goal-writer"
              className="h-auto px-4 py-3 data-[state=active]:bg-bs-primary data-[state=active]:text-white"
            >
              IEP Goal Writer (Goalbook-beating)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="behavior-goals" className="mt-4">
            <BehaviorGoalsTab />
          </TabsContent>

          <TabsContent value="goal-writer" className="mt-4">
            <GoalWriterTab />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

function BehaviorGoalsTab() {
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [data, setData] = useState<BehaviorFlowData>(behaviorInitial);

  const canAdvance = useMemo(() => {
    if (step === 0) return !!data.behaviorTitle.trim() && !!data.behaviorDefinition.trim();
    if (step === 1) return !!data.baselineRate.trim();
    if (step === 2) return !!data.settingContext.trim();
    if (step === 3) return !!data.dataMethod.trim() && !!data.successCriteria.trim();
    return true;
  }, [data, step]);

  const finalGoal = useMemo(() => {
    const student = data.studentName.trim() || "The student";
    const date = outputDate(data.dueDate);
    const baseline = data.baselineRate.trim() || "current baseline levels";
    const baselineWindow = data.baselineWindow.trim() ? ` (${data.baselineWindow.trim()})` : "";
    const setting = data.settingContext.trim() || "in identified school settings";
    const supports = data.supports.trim() || "planned instructional and behavioral supports";

    return `${student} will ${data.direction} ${data.behaviorTitle.trim() || "the target behavior"} (${data.behaviorDefinition.trim() || "operationally defined behavior"}) from ${baseline}${baselineWindow} in ${setting}, given ${supports}, to ${data.successCriteria.trim() || "the defined criterion"} by ${date}, as measured by ${data.dataMethod.trim() || "team-selected data collection"}.`;
  }, [data]);

  const copyGoal = async () => {
    await navigator.clipboard.writeText(finalGoal);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="rounded-2xl border border-bs-primary/15 bg-white p-6 sm:p-8">
      <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-slate-800">
        This tab is for <span className="font-semibold">behavior goals only</span>. Use it for observable behavior targets, baseline data, and measurable behavior criteria.
      </div>

      <StepHeader steps={behaviorSteps} currentStep={step} />

      <div className="mt-6">
        {step === 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Student name (optional)">
              <input className="field" value={data.studentName} onChange={(e) => setData({ ...data, studentName: e.target.value })} />
            </Field>
            <Field label="Direction">
              <select className="field" value={data.direction} onChange={(e) => setData({ ...data, direction: e.target.value as "increase" | "decrease" })}>
                <option value="decrease">Decrease behavior</option>
                <option value="increase">Increase behavior</option>
              </select>
            </Field>
            <Field label="Behavior title">
              <input className="field" value={data.behaviorTitle} onChange={(e) => setData({ ...data, behaviorTitle: e.target.value })} />
            </Field>
            <Field label="Operational definition">
              <input className="field" value={data.behaviorDefinition} onChange={(e) => setData({ ...data, behaviorDefinition: e.target.value })} />
            </Field>
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Baseline rate">
              <input className="field" placeholder="e.g., 5 incidents per day" value={data.baselineRate} onChange={(e) => setData({ ...data, baselineRate: e.target.value })} />
            </Field>
            <Field label="Baseline window or source">
              <input className="field" placeholder="e.g., 3-week direct observation" value={data.baselineWindow} onChange={(e) => setData({ ...data, baselineWindow: e.target.value })} />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Primary context / setting">
              <input className="field" value={data.settingContext} onChange={(e) => setData({ ...data, settingContext: e.target.value })} />
            </Field>
            <Field label="Supports / prompts provided">
              <input className="field" value={data.supports} onChange={(e) => setData({ ...data, supports: e.target.value })} />
            </Field>
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Data collection method">
              <input className="field" value={data.dataMethod} onChange={(e) => setData({ ...data, dataMethod: e.target.value })} />
            </Field>
            <Field label="Success criterion">
              <input className="field" placeholder="e.g., 80% of opportunities for 4 weeks" value={data.successCriteria} onChange={(e) => setData({ ...data, successCriteria: e.target.value })} />
            </Field>
            <Field label="Goal due date (optional)">
              <input className="field" placeholder="mm/dd/yyyy" value={data.dueDate} onChange={(e) => setData({ ...data, dueDate: e.target.value })} />
            </Field>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">Behavior Goal Output</p>
            <div className="rounded-xl border border-bs-primary/20 bg-bs-primary/5 p-4 text-sm leading-7 text-slate-800" aria-live="polite">
              {finalGoal}
            </div>
            <button onClick={copyGoal} className="inline-flex items-center gap-2 rounded-lg bg-bs-primary px-4 py-2 text-sm font-semibold text-white hover:bg-bs-primary/90">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy behavior goal"}
            </button>
          </div>
        )}
      </div>

      <StepControls
        step={step}
        total={behaviorSteps.length}
        canAdvance={canAdvance}
        onBack={() => setStep((s) => Math.max(0, s - 1))}
        onNext={() => setStep((s) => Math.min(behaviorSteps.length - 1, s + 1))}
      />
    </section>
  );
}

function GoalWriterTab() {
  const [step, setStep] = useState(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [data, setData] = useState<KcusdData>(kcInitial);

  const templates = useMemo(() => {
    const target = data.targetBehavior.trim() || "the target behavior";
    const date = outputDate(data.dueDate);

    return {
      baseline: `Baseline: ${data.baselineStatement.trim() || "Student currently demonstrates the target behavior at documented baseline levels."}`,
      latencyFluency: `Latency/Fluency: When presented with the opportunity, the student will initiate ${target} within ${data.latencyTarget.trim() || "the defined latency target"} and perform at ${data.fluencyTarget.trim() || "the defined fluency level"}.`,
      generalization: `Generalization: The student will demonstrate ${target} across ${data.generalizationPlan.trim() || "multiple settings, people, and materials identified by the team"}.`,
      maintenance: `Maintenance: After mastery, the student will maintain ${target} using ${data.maintenancePlan.trim() || "ongoing probe checks across planned intervals"} through ${date}.`,
      annual: `By ${date}, given instructional and behavioral supports, the student will demonstrate ${target} with baseline-informed growth, meeting latency/fluency criteria, generalizing across planned settings, and maintaining performance over time as measured by team data systems.`,
    };
  }, [data]);

  const canAdvance = useMemo(() => {
    if (step === 0) return !!data.targetBehavior.trim() && !!data.baselineStatement.trim();
    if (step === 1) return !!data.latencyTarget.trim() && !!data.fluencyTarget.trim();
    if (step === 2) return !!data.generalizationPlan.trim();
    if (step === 3) return !!data.maintenancePlan.trim();
    return true;
  }, [data, step]);

  const copyTemplate = async (key: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  return (
    <section className="rounded-2xl border border-bs-primary/15 bg-white p-6 sm:p-8">
      <p className="rounded-xl border border-bs-primary/15 bg-slate-50 p-4 text-sm text-slate-700">
        Goalbook-beating workflow using the 5-step hierarchy: <span className="font-semibold">Baseline → Latency/Fluency → Generalization → Maintenance</span>.
      </p>

      <StepHeader steps={kcUsdSteps} currentStep={step} />

      <div className="mt-6">
        {step === 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Target behavior">
              <input className="field" value={data.targetBehavior} onChange={(e) => setData({ ...data, targetBehavior: e.target.value })} />
            </Field>
            <Field label="Baseline statement">
              <input className="field" value={data.baselineStatement} onChange={(e) => setData({ ...data, baselineStatement: e.target.value })} />
            </Field>
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Latency target">
              <input className="field" placeholder="e.g., initiate within 10 seconds" value={data.latencyTarget} onChange={(e) => setData({ ...data, latencyTarget: e.target.value })} />
            </Field>
            <Field label="Fluency target">
              <input className="field" placeholder="e.g., 90% accuracy for 4 probes" value={data.fluencyTarget} onChange={(e) => setData({ ...data, fluencyTarget: e.target.value })} />
            </Field>
          </div>
        )}

        {step === 2 && (
          <Field label="Generalization plan">
            <textarea className="field min-h-28" placeholder="e.g., 3 settings, 2 staff, 2 activity formats" value={data.generalizationPlan} onChange={(e) => setData({ ...data, generalizationPlan: e.target.value })} />
          </Field>
        )}

        {step === 3 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Maintenance plan">
              <textarea className="field min-h-28" placeholder="e.g., maintain across 8 weeks with weekly probes" value={data.maintenancePlan} onChange={(e) => setData({ ...data, maintenancePlan: e.target.value })} />
            </Field>
            <Field label="Goal due date (optional)">
              <input className="field" placeholder="mm/dd/yyyy" value={data.dueDate} onChange={(e) => setData({ ...data, dueDate: e.target.value })} />
            </Field>
          </div>
        )}

        {step === 4 && (
          <div className="grid gap-3">
            <TemplateCard title="Baseline Template" value={templates.baseline} copied={copiedKey === "baseline"} onCopy={() => copyTemplate("baseline", templates.baseline)} />
            <TemplateCard title="Latency/Fluency Template" value={templates.latencyFluency} copied={copiedKey === "latency"} onCopy={() => copyTemplate("latency", templates.latencyFluency)} />
            <TemplateCard title="Generalization Template" value={templates.generalization} copied={copiedKey === "generalization"} onCopy={() => copyTemplate("generalization", templates.generalization)} />
            <TemplateCard title="Maintenance Template" value={templates.maintenance} copied={copiedKey === "maintenance"} onCopy={() => copyTemplate("maintenance", templates.maintenance)} />
            <TemplateCard title="Integrated Annual Goal Template" value={templates.annual} copied={copiedKey === "annual"} onCopy={() => copyTemplate("annual", templates.annual)} />
          </div>
        )}
      </div>

      <StepControls
        step={step}
        total={kcUsdSteps.length}
        canAdvance={canAdvance}
        onBack={() => setStep((s) => Math.max(0, s - 1))}
        onNext={() => setStep((s) => Math.min(kcUsdSteps.length - 1, s + 1))}
      />
    </section>
  );
}

function StepHeader({ steps, currentStep }: { steps: string[]; currentStep: number }) {
  return (
    <div className="mt-6">
      <p className="text-sm font-medium text-bs-primary">Step {currentStep + 1} of {steps.length}</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-5">
        {steps.map((s, i) => (
          <div
            key={s}
            className={`rounded-lg border px-3 py-2 text-xs sm:text-sm ${
              i === currentStep
                ? "border-bs-primary bg-bs-primary text-white"
                : i < currentStep
                  ? "border-bs-primary/30 bg-bs-primary/10 text-bs-primary"
                  : "border-slate-200 bg-white text-slate-600"
            }`}
          >
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

function StepControls({
  step,
  total,
  canAdvance,
  onBack,
  onNext,
}: {
  step: number;
  total: number;
  canAdvance: boolean;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="mt-8 flex items-center justify-between">
      <button
        onClick={onBack}
        disabled={step === 0}
        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Back
      </button>
      <button
        onClick={onNext}
        disabled={step === total - 1 || !canAdvance}
        className="rounded-lg bg-bs-accent px-4 py-2 text-sm font-semibold text-bs-primary disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm text-slate-700">
      <span className="font-medium">{label}</span>
      {children}
    </label>
  );
}

function TemplateCard({
  title,
  value,
  copied,
  onCopy,
}: {
  title: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="text-sm font-semibold text-bs-primary">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-slate-700">{value}</p>
      <button
        onClick={onCopy}
        className="mt-3 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Copied" : "Copy template"}
      </button>
    </article>
  );
}

