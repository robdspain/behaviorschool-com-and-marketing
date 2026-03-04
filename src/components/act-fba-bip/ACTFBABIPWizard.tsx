"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brain,
  CheckSquare,
  ClipboardList,
  Compass,
  Gauge,
  Heart,
  Layers,
  Milestone,
  MoveRight,
  ShieldCheck,
  Sparkles,
  Target,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProgressIndicator } from "@/components/iep-goal-writer/ProgressIndicator";
import { STUDENT_ITEMS, CAREGIVER_ITEMS, SUBSCALE_META } from "@/data/cpfq-items";
import { INTERVIEW_QUESTIONS } from "@/data/interview-questions";
import { VALUES, CATEGORY_META } from "@/data/values";
import { suggestFrames } from "@/data/relational-frames";
import {
  ACT_STRATEGY_BANK,
  GRADE_LEVEL_OPTIONS,
  INITIAL_WIZARD_DATA,
  INTERVIEW_QUESTION_IDS,
  RELATIONAL_CATEGORY_LABELS,
  WIZARD_PHASES,
  generateACTBIP,
  parseList,
  type ACTFBAData,
  type GradeLevel,
  type RelationalCategory,
  type StrategyCategory,
  type GeneratedACTBIP,
} from "./actBipGenerator";
import { ACTBIPOutput } from "./ACTBIPOutput";

const phaseIcons = [
  UserCheck,
  Compass,
  Heart,
  ClipboardList,
  Gauge,
  Brain,
  Layers,
  Milestone,
  BookOpen,
  Sparkles,
  CheckSquare,
  Target,
];

const gradeMap: Record<string, GradeLevel> = {
  "1st": "1-3",
  "2nd": "1-3",
  "3rd": "1-3",
  "4th": "4-5",
  "5th": "4-5",
  "6th": "6-8",
  "7th": "6-8",
  "8th": "6-8",
  "9th": "9-12",
  "10th": "9-12",
  "11th": "9-12",
  "12th": "9-12",
};

function responseLabel(value: number): string {
  if (value === 0) return "Never";
  if (value === 1) return "Rarely";
  if (value === 2) return "Sometimes";
  if (value === 3) return "Often";
  return "Always";
}

function MatrixEditor({
  title,
  subtitle,
  value,
  onChange,
}: {
  title: string;
  subtitle: string;
  value: string[];
  onChange: (items: string[]) => void;
}) {
  return (
    <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-3">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <p className="text-xs text-slate-500">{subtitle}</p>
      <textarea
        rows={4}
        value={value.join("\n")}
        onChange={(e) => onChange(parseList(e.target.value))}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#1E3A34] focus:outline-none focus:ring-1 focus:ring-[#1E3A34]"
        placeholder="One item per line"
      />
    </div>
  );
}

export function ACTFBABIPWizard() {
  const [phase, setPhase] = useState(0);
  const [data, setData] = useState<ACTFBAData>(INITIAL_WIZARD_DATA);
  const [valueSearch, setValueSearch] = useState("");
  const [report, setReport] = useState<GeneratedACTBIP | null>(null);
  const [emailGate, setEmailGate] = useState({ name: "", email: "", loading: false, submitted: false });

  const questions = useMemo(
    () => INTERVIEW_QUESTIONS.filter((q) => INTERVIEW_QUESTION_IDS.includes(q.id)),
    []
  );

  const filteredValues = useMemo(
    () => VALUES.filter((v) => v.name.toLowerCase().includes(valueSearch.toLowerCase())),
    [valueSearch]
  );

  const update = <K extends keyof ACTFBAData>(key: K, value: ACTFBAData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const updateProfile = <K extends keyof ACTFBAData["profile"]>(key: K, value: ACTFBAData["profile"][K]) => {
    setData((prev) => ({ ...prev, profile: { ...prev.profile, [key]: value } }));
  };

  const isPhaseValid = useMemo(() => {
    const checks = [
      data.profile.studentName.trim().length > 1,
      data.actMatrix.innerAway.length + data.actMatrix.innerToward.length + data.actMatrix.outerAway.length + data.actMatrix.outerToward.length > 0,
      data.selectedValues.length >= 3,
      data.abcObservations.some((o) => o.behavior.trim() && o.latencySeconds > 0),
      data.validatingLatencyAvg.trim().length > 0 && data.challengingLatencyAvg.trim().length > 0,
      Object.keys(data.studentCpfqResponses).length > 0 && Object.keys(data.caregiverCpfqResponses).length > 0,
      data.verbalRelations.some((v) => v.statement.trim().length > 0),
      data.aimAcceptPlan.trim().length > 0 && data.aimIdentifyPlan.trim().length > 0 && data.aimMovePlan.trim().length > 0,
      data.targetBehavior.trim().length > 0 && data.privateEventFunction.trim().length > 0,
      data.selectedStrategies.length >= 3,
      true,
      data.decisionRules.trim().length > 0,
    ];
    return checks;
  }, [data]);

  if (report) {
    return <ACTBIPOutput report={report} onReset={() => {
      setData(INITIAL_WIZARD_DATA);
      setPhase(0);
      setReport(null);
      setEmailGate({ name: "", email: "", loading: false, submitted: false });
    }} />;
  }

  const currentIcon = phaseIcons[phase];
  const Icon = currentIcon;

  return (
    <div className="rounded-3xl border border-[#1E3A34]/20 bg-white shadow-sm">
      <div className="rounded-t-3xl bg-[#1E3A34] px-6 py-5 text-white">
        <p className="text-xs uppercase tracking-[0.2em] text-white/70">CalABA 2026</p>
        <h2 className="text-2xl font-semibold">ACT-Informed FBA/BIP Wizard</h2>
        <p className="text-sm text-white/80">12-phase assessment, intervention, and implementation workflow</p>
      </div>

      <div className="space-y-5 p-6">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <ProgressIndicator
            steps={WIZARD_PHASES.map((title, index) => `P${index + 1}`)}
            currentStep={phase}
          />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-[#e4b63d]/50 bg-[#e4b63d]/10 px-4 py-3">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-slate-600">Phase {phase + 1} of 12</p>
            <h3 className="text-lg font-semibold text-slate-900">{WIZARD_PHASES[phase]}</h3>
          </div>
          <Icon className="h-5 w-5 text-[#1E3A34]" />
        </div>

        {phase === 0 && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Student Name *</Label>
                <Input value={data.profile.studentName} onChange={(e) => updateProfile("studentName", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Age</Label>
                <Input value={data.profile.studentAge} onChange={(e) => updateProfile("studentAge", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Grade</Label>
                <Input
                  value={data.profile.studentGrade}
                  onChange={(e) => {
                    const raw = e.target.value;
                    updateProfile("studentGrade", raw);
                    if (gradeMap[raw]) updateProfile("gradeLevel", gradeMap[raw]);
                  }}
                  placeholder="e.g., 6th"
                />
              </div>
              <div className="space-y-2">
                <Label>Grade Band</Label>
                <select
                  value={data.profile.gradeLevel}
                  onChange={(e) => updateProfile("gradeLevel", e.target.value as GradeLevel)}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                >
                  {GRADE_LEVEL_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>School</Label>
                <Input value={data.profile.school} onChange={(e) => updateProfile("school", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Assessment Date</Label>
                <Input type="date" value={data.profile.assessmentDate} onChange={(e) => updateProfile("assessmentDate", e.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Assessor and Team</Label>
                <Input value={data.profile.teamMembers} onChange={(e) => updateProfile("teamMembers", e.target.value)} placeholder="BCBA, teacher, caregiver" />
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              <p className="text-sm font-semibold text-slate-900">Open-Ended Interview</p>
              {questions.map((question) => (
                <div key={question.id} className="space-y-1">
                  <Label className="text-sm">{question.text}</Label>
                  {question.type === "choice" || question.type === "multi-choice" ? (
                    <select
                      value={data.interviewResponses[question.id] || ""}
                      onChange={(e) =>
                        update("interviewResponses", {
                          ...data.interviewResponses,
                          [question.id]: e.target.value,
                        })
                      }
                      className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                    >
                      <option value="">Select</option>
                      {question.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : question.type === "scale" ? (
                    <Input
                      value={data.interviewResponses[question.id] || ""}
                      onChange={(e) =>
                        update("interviewResponses", {
                          ...data.interviewResponses,
                          [question.id]: e.target.value,
                        })
                      }
                      placeholder="1-10"
                    />
                  ) : (
                    <textarea
                      rows={2}
                      value={data.interviewResponses[question.id] || ""}
                      onChange={(e) =>
                        update("interviewResponses", {
                          ...data.interviewResponses,
                          [question.id]: e.target.value,
                        })
                      }
                      className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                    />
                  )}
                </div>
              ))}
              <div className="space-y-2">
                <Label>Thought-Mediated Behaviors</Label>
                <textarea rows={3} value={data.thoughtMediatedBehaviors} onChange={(e) => update("thoughtMediatedBehaviors", e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
              </div>
              <div className="space-y-2">
                <Label>Candidate Values from Interview</Label>
                <textarea rows={3} value={data.interviewValuesCandidates} onChange={(e) => update("interviewValuesCandidates", e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
              </div>
            </div>
          </div>
        )}

        {phase === 1 && (
          <div className="grid gap-4 md:grid-cols-2">
            <MatrixEditor title="Inner + Away" subtitle="Thoughts and feelings struggled with" value={data.actMatrix.innerAway} onChange={(items) => update("actMatrix", { ...data.actMatrix, innerAway: items })} />
            <MatrixEditor title="Inner + Toward" subtitle="What matters internally" value={data.actMatrix.innerToward} onChange={(items) => update("actMatrix", { ...data.actMatrix, innerToward: items })} />
            <MatrixEditor title="Outer + Away" subtitle="Avoidance behaviors" value={data.actMatrix.outerAway} onChange={(items) => update("actMatrix", { ...data.actMatrix, outerAway: items })} />
            <MatrixEditor title="Outer + Toward" subtitle="Values-aligned actions" value={data.actMatrix.outerToward} onChange={(items) => update("actMatrix", { ...data.actMatrix, outerToward: items })} />
          </div>
        )}

        {phase === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Search Values</Label>
              <Input value={valueSearch} onChange={(e) => setValueSearch(e.target.value)} placeholder="Search 120+ values" />
            </div>
            <div className="max-h-[360px] overflow-y-auto rounded-xl border border-slate-200 p-3">
              <div className="grid gap-2 md:grid-cols-2">
                {filteredValues.map((value) => {
                  const selected = data.selectedValues.includes(value.id);
                  return (
                    <button
                      key={value.id}
                      type="button"
                      onClick={() =>
                        update(
                          "selectedValues",
                          selected ? data.selectedValues.filter((id) => id !== value.id) : [...data.selectedValues, value.id]
                        )
                      }
                      className={`rounded-lg border px-3 py-2 text-left text-sm ${selected ? "border-[#1E3A34] bg-[#1E3A34]/10" : "border-slate-200 bg-white"}`}
                    >
                      <p className="font-semibold text-slate-900">{value.name}</p>
                      <p className="text-xs text-slate-500">{CATEGORY_META[value.category].label}</p>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Values Sort Rationale (top 3-5)</Label>
              <textarea rows={3} value={data.valuesRationale} onChange={(e) => update("valuesRationale", e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
            </div>
          </div>
        )}

        {phase === 3 && (
          <div className="space-y-4">
            {data.abcObservations.map((obs, index) => (
              <div key={index} className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm font-semibold text-slate-900">Observation {index + 1}</p>
                <div className="grid gap-3 md:grid-cols-2">
                  <Input placeholder="Antecedent" value={obs.antecedent} onChange={(e) => update("abcObservations", data.abcObservations.map((item, i) => (i === index ? { ...item, antecedent: e.target.value } : item)))} />
                  <Input placeholder="Precursor" value={obs.precursor} onChange={(e) => update("abcObservations", data.abcObservations.map((item, i) => (i === index ? { ...item, precursor: e.target.value } : item)))} />
                  <Input placeholder="Behavior" value={obs.behavior} onChange={(e) => update("abcObservations", data.abcObservations.map((item, i) => (i === index ? { ...item, behavior: e.target.value } : item)))} />
                  <Input placeholder="Consequence" value={obs.consequence} onChange={(e) => update("abcObservations", data.abcObservations.map((item, i) => (i === index ? { ...item, consequence: e.target.value } : item)))} />
                  <Input type="number" min={0} placeholder="Latency seconds" value={obs.latencySeconds || ""} onChange={(e) => update("abcObservations", data.abcObservations.map((item, i) => (i === index ? { ...item, latencySeconds: Number(e.target.value) } : item)))} />
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={() => update("abcObservations", [...data.abcObservations, { antecedent: "", precursor: "", behavior: "", consequence: "", latencySeconds: 0 }])}>Add Observation</Button>
          </div>
        )}

        {phase === 4 && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Validating Condition Mean Latency (sec)</Label>
                <Input value={data.validatingLatencyAvg} onChange={(e) => update("validatingLatencyAvg", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Challenging Condition Mean Latency (sec)</Label>
                <Input value={data.challengingLatencyAvg} onChange={(e) => update("challengingLatencyAvg", e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Validating Condition Notes</Label>
              <textarea rows={3} value={data.validatingConditionNotes} onChange={(e) => update("validatingConditionNotes", e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
            </div>
            <div className="space-y-2">
              <Label>Challenging Condition Notes</Label>
              <textarea rows={3} value={data.challengingConditionNotes} onChange={(e) => update("challengingConditionNotes", e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
            </div>
            <div className="space-y-2">
              <Label>Fusion Hierarchy (lowest to highest trigger intensity)</Label>
              <textarea rows={4} value={data.fusionHierarchy} onChange={(e) => update("fusionHierarchy", e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
            </div>
          </div>
        )}

        {phase === 5 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">Complete both forms to populate all 6 CPFQ subscales (acceptance, defusion, present-moment, self-as-context, values, committed action).</p>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-3 rounded-xl border border-slate-200 p-3">
                <p className="text-sm font-semibold text-slate-900">Student Self-Report</p>
                <div className="max-h-[360px] space-y-3 overflow-y-auto pr-1">
                  {STUDENT_ITEMS.map((item) => (
                    <div key={item.id} className="rounded-lg border border-slate-200 p-2">
                      <p className="text-xs text-slate-700">{item.text}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {[0, 1, 2, 3, 4].map((val) => (
                          <button
                            type="button"
                            key={val}
                            onClick={() => update("studentCpfqResponses", { ...data.studentCpfqResponses, [item.id]: val })}
                            className={`rounded-md border px-2 py-1 text-xs ${data.studentCpfqResponses[item.id] === val ? "border-[#1E3A34] bg-[#1E3A34]/10" : "border-slate-200"}`}
                          >
                            {responseLabel(val)}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 rounded-xl border border-slate-200 p-3">
                <p className="text-sm font-semibold text-slate-900">Caregiver/Teacher Report</p>
                <div className="max-h-[360px] space-y-3 overflow-y-auto pr-1">
                  {CAREGIVER_ITEMS.map((item) => (
                    <div key={item.id} className="rounded-lg border border-slate-200 p-2">
                      <p className="text-xs text-slate-700">{item.text}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {[0, 1, 2, 3, 4].map((val) => (
                          <button
                            type="button"
                            key={val}
                            onClick={() => update("caregiverCpfqResponses", { ...data.caregiverCpfqResponses, [item.id]: val })}
                            className={`rounded-md border px-2 py-1 text-xs ${data.caregiverCpfqResponses[item.id] === val ? "border-[#1E3A34] bg-[#1E3A34]/10" : "border-slate-200"}`}
                          >
                            {responseLabel(val)}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid gap-2 rounded-xl border border-[#e4b63d]/60 bg-[#e4b63d]/10 p-3 md:grid-cols-2 lg:grid-cols-3">
              {Object.values(SUBSCALE_META).map((meta) => (
                <div key={meta.label} className="rounded border border-[#e4b63d]/50 bg-white px-2 py-1 text-xs text-slate-700">
                  {meta.label}
                </div>
              ))}
            </div>
          </div>
        )}

        {phase === 6 && (
          <div className="space-y-4">
            {data.verbalRelations.map((entry, index) => {
              const frameHints = entry.statement ? suggestFrames(entry.statement).map((x) => x.frame).join(", ") : "";
              return (
                <div key={index} className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                      <Label>Student Statement</Label>
                      <Input value={entry.statement} onChange={(e) => update("verbalRelations", data.verbalRelations.map((item, i) => (i === index ? { ...item, statement: e.target.value } : item)))} />
                      {frameHints && <p className="text-xs text-slate-500">Pattern hint from relational-frame parser: {frameHints}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <select
                        value={entry.category}
                        onChange={(e) =>
                          update(
                            "verbalRelations",
                            data.verbalRelations.map((item, i) =>
                              i === index ? { ...item, category: e.target.value as RelationalCategory } : item
                            )
                          )
                        }
                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                      >
                        {Object.entries(RELATIONAL_CATEGORY_LABELS).map(([key, label]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Impact on Behavior</Label>
                      <Input value={entry.impact} onChange={(e) => update("verbalRelations", data.verbalRelations.map((item, i) => (i === index ? { ...item, impact: e.target.value } : item)))} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Flexible Alternative Statement</Label>
                      <Input value={entry.flexAlternative} onChange={(e) => update("verbalRelations", data.verbalRelations.map((item, i) => (i === index ? { ...item, flexAlternative: e.target.value } : item)))} />
                    </div>
                  </div>
                </div>
              );
            })}
            <Button variant="outline" onClick={() => update("verbalRelations", [...data.verbalRelations, { statement: "", category: "self-deictic", impact: "", flexAlternative: "" }])}>Add Relation</Button>
          </div>
        )}

        {phase === 7 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Accept (willingness, grounding)</Label>
              <textarea rows={3} value={data.aimAcceptPlan} onChange={(e) => update("aimAcceptPlan", e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
            </div>
            <div className="space-y-2">
              <Label>Identify (defusion, values)</Label>
              <textarea rows={3} value={data.aimIdentifyPlan} onChange={(e) => update("aimIdentifyPlan", e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
            </div>
            <div className="space-y-2">
              <Label>Move (committed action)</Label>
              <textarea rows={3} value={data.aimMovePlan} onChange={(e) => update("aimMovePlan", e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
            </div>
          </div>
        )}

        {phase === 8 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Target Behavior</Label>
              <Input value={data.targetBehavior} onChange={(e) => update("targetBehavior", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Operational Definition</Label>
              <textarea rows={3} value={data.operationalDefinition} onChange={(e) => update("operationalDefinition", e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
            </div>
            <div className="space-y-2">
              <Label>Hypothesized Public Function</Label>
              <Input value={data.hypothesizedFunction} onChange={(e) => update("hypothesizedFunction", e.target.value)} placeholder="attention, escape, tangible, sensory, etc." />
            </div>
            <div className="space-y-2">
              <Label>Private Event Function (ACT lens)</Label>
              <textarea rows={3} value={data.privateEventFunction} onChange={(e) => update("privateEventFunction", e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
            </div>
            <div className="space-y-2">
              <Label>Replacement Behaviors</Label>
              <textarea rows={3} value={data.replacementBehaviors} onChange={(e) => update("replacementBehaviors", e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
            </div>
          </div>
        )}

        {phase === 9 && (
          <div className="space-y-4">
            {(Object.entries(ACT_STRATEGY_BANK) as [StrategyCategory, readonly string[]][]).map(([category, strategies]) => (
              <div key={category} className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm font-semibold text-slate-900 capitalize">{category.replace("-", " ")}</p>
                <div className="flex flex-wrap gap-2">
                  {strategies.map((strategy) => {
                    const exists = data.selectedStrategies.some((s) => s.category === category && s.strategy === strategy);
                    return (
                      <button
                        key={strategy}
                        type="button"
                        onClick={() => {
                          if (exists) {
                            update(
                              "selectedStrategies",
                              data.selectedStrategies.filter((s) => !(s.category === category && s.strategy === strategy))
                            );
                          } else {
                            update("selectedStrategies", [...data.selectedStrategies, { category, strategy, implementation: "" }]);
                          }
                        }}
                        className={`rounded-md border px-3 py-1 text-sm ${exists ? "border-[#1E3A34] bg-[#1E3A34]/10" : "border-slate-200 bg-white"}`}
                      >
                        {strategy}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {data.selectedStrategies.length > 0 && (
              <div className="space-y-3">
                {data.selectedStrategies.map((item, idx) => (
                  <div key={`${item.category}-${item.strategy}`} className="space-y-1 rounded-lg border border-slate-200 p-3">
                    <p className="text-sm font-semibold text-slate-900">
                      {item.strategy} ({item.category})
                    </p>
                    <textarea
                      rows={2}
                      value={item.implementation}
                      onChange={(e) =>
                        update(
                          "selectedStrategies",
                          data.selectedStrategies.map((s, i) => (i === idx ? { ...s, implementation: e.target.value } : s))
                        )
                      }
                      className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                      placeholder="Implementation plan"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {phase === 10 && (
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              {[
                ["bstChecklist", "BST Checklist"],
                ["visualGuides", "Visual Guides"],
                ["dataTemplates", "Data Collection Templates"],
                ["caregiverHandout", "Caregiver Handout"],
              ].map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
                  <input
                    type="checkbox"
                    checked={data.implementationMaterials[key as keyof ACTFBAData["implementationMaterials"]] as boolean}
                    onChange={(e) =>
                      update("implementationMaterials", {
                        ...data.implementationMaterials,
                        [key]: e.target.checked,
                      })
                    }
                  />
                  {label}
                </label>
              ))}
            </div>
            <div className="space-y-2">
              <Label>Implementation Notes</Label>
              <textarea rows={4} value={data.implementationMaterials.implementationNotes} onChange={(e) => update("implementationMaterials", { ...data.implementationMaterials, implementationNotes: e.target.value })} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
            </div>
          </div>
        )}

        {phase === 11 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Progress Metrics (include CPFQ pre/post and behavioral metrics)</Label>
              <textarea rows={3} value={data.progressMetrics} onChange={(e) => update("progressMetrics", e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
            </div>
            <div className="space-y-2">
              <Label>Decision Rules</Label>
              <textarea rows={3} value={data.decisionRules} onChange={(e) => update("decisionRules", e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
            </div>
            <div className="space-y-2">
              <Label>Review Cadence</Label>
              <Input value={data.reviewCadence} onChange={(e) => update("reviewCadence", e.target.value)} placeholder="e.g., Weekly for 6 weeks, then biweekly" />
            </div>

            {!emailGate.submitted && (
              <div className="rounded-xl border border-[#1E3A34]/30 bg-[#1E3A34]/5 p-4">
                <p className="text-sm font-semibold text-slate-900">Email Capture Before Final Output</p>
                <p className="text-xs text-slate-600">Enter an email to unlock the full generated report.</p>
                <div className="mt-3 space-y-2">
                  <Input placeholder="Name (optional)" value={emailGate.name} onChange={(e) => setEmailGate((prev) => ({ ...prev, name: e.target.value }))} />
                  <Input placeholder="Email *" type="email" value={emailGate.email} onChange={(e) => setEmailGate((prev) => ({ ...prev, email: e.target.value }))} />
                  <Button
                    disabled={!emailGate.email || emailGate.loading}
                    className="bg-[#1E3A34] hover:bg-[#173029]"
                    onClick={async () => {
                      setEmailGate((prev) => ({ ...prev, loading: true }));
                      try {
                        await fetch("/api/fba-tool-signup", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ name: emailGate.name, email: emailGate.email }),
                        });
                      } catch {
                        // continue even if signup endpoint fails
                      }
                      setEmailGate((prev) => ({ ...prev, loading: false, submitted: true }));
                      setReport(generateACTBIP(data));
                    }}
                  >
                    {emailGate.loading ? "Submitting" : "Generate Full Report"}
                    <MoveRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <Button variant="outline" disabled={phase === 0} onClick={() => setPhase((prev) => Math.max(0, prev - 1))}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {phase < WIZARD_PHASES.length - 1 && (
            <Button
              onClick={() => setPhase((prev) => Math.min(WIZARD_PHASES.length - 1, prev + 1))}
              disabled={!isPhaseValid[phase]}
              className="bg-[#1E3A34] hover:bg-[#173029]"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
