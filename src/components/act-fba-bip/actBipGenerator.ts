import {
  CAREGIVER_ITEMS,
  STUDENT_ITEMS,
  SUBSCALE_META,
  scoreFull,
  type PsychFlexSubscale,
} from "@/data/cpfq-items";
import { CATEGORY_META, VALUES } from "@/data/values";

export type GradeLevel = "1-3" | "4-5" | "6-8" | "9-12";

export interface StudentProfile {
  studentName: string;
  studentAge: string;
  studentGrade: string;
  gradeLevel: GradeLevel;
  school: string;
  assessmentDate: string;
  assessor: string;
  teamMembers: string;
}

export interface ACTMatrixQuadrants {
  innerAway: string[];
  innerToward: string[];
  outerAway: string[];
  outerToward: string[];
}

export interface ABCObservation {
  antecedent: string;
  precursor: string;
  behavior: string;
  consequence: string;
  latencySeconds: number;
}

export type RelationalCategory =
  | "self-deictic"
  | "temporal-causal"
  | "social-distinction"
  | "evaluative-coordination"
  | "conditional-rules";

export type StrategyCategory = "acceptance" | "defusion" | "values-action";

export interface StrategySelection {
  category: StrategyCategory;
  strategy: string;
  implementation: string;
}

export interface ACTFBAData {
  profile: StudentProfile;

  // 1. Open-Ended Interview & Values Identification
  interviewResponses: Record<string, string>;
  thoughtMediatedBehaviors: string;
  interviewValuesCandidates: string;
  initialMatrixDraft: ACTMatrixQuadrants;

  // 2. ACT Matrix
  actMatrix: ACTMatrixQuadrants;

  // 3. Values Assessment
  selectedValues: string[];
  valuesRationale: string;

  // 4. ABC Observation with Latency
  abcObservations: ABCObservation[];

  // 5. Latency-Based FA (Fusion Hierarchy)
  validatingLatencyAvg: string;
  challengingLatencyAvg: string;
  validatingConditionNotes: string;
  challengingConditionNotes: string;
  fusionHierarchy: string;

  // 6. CPFQ Administration
  studentCpfqResponses: Record<string, number>;
  caregiverCpfqResponses: Record<string, number>;

  // 7. Inflexible Verbal Relations
  verbalRelations: Array<{
    statement: string;
    category: RelationalCategory;
    impact: string;
    flexAlternative: string;
  }>;

  // 8. AIM Curriculum
  aimAcceptPlan: string;
  aimIdentifyPlan: string;
  aimMovePlan: string;

  // 9. ACT-Informed BIP Generation Inputs
  targetBehavior: string;
  operationalDefinition: string;
  hypothesizedFunction: string;
  privateEventFunction: string;
  replacementBehaviors: string;

  // 10. ACT Strategies
  selectedStrategies: StrategySelection[];

  // 11. Implementation Materials
  implementationMaterials: {
    bstChecklist: boolean;
    visualGuides: boolean;
    dataTemplates: boolean;
    caregiverHandout: boolean;
    implementationNotes: string;
  };

  // 12. Progress Monitoring
  decisionRules: string;
  progressMetrics: string;
  reviewCadence: string;
}

export interface GeneratedACTBIP {
  title: string;
  profileSummary: string;
  phases: Array<{ phase: string; title: string; content: string[] }>;
  bipSections: Array<{ title: string; items: string[] }>;
  cpfqSummary: {
    studentTotal: number;
    caregiverTotal: number;
    studentSubscales: Record<PsychFlexSubscale, number>;
    caregiverSubscales: Record<PsychFlexSubscale, number>;
  };
}

export const GRADE_LEVEL_OPTIONS: Array<{ value: GradeLevel; label: string }> = [
  { value: "1-3", label: "Grades 1-3" },
  { value: "4-5", label: "Grades 4-5" },
  { value: "6-8", label: "Grades 6-8" },
  { value: "9-12", label: "Grades 9-12" },
];

export const WIZARD_PHASES = [
  "Student Information",
  "Open-Ended Interview & Values Identification",
  "ACT Matrix",
  "Values Assessment",
  "ABC Observation with Latency",
  "Latency-Based FA (Fusion Hierarchy)",
  "CPFQ Administration",
  "Inflexible Verbal Relations",
  "AIM Curriculum",
  "ACT-Informed BIP Generation",
  "ACT Strategies",
  "Implementation Materials",
  "Progress Monitoring",
] as const;

export const RELATIONAL_CATEGORY_LABELS: Record<RelationalCategory, string> = {
  "self-deictic": "Self-Deictic",
  "temporal-causal": "Temporal/Causal",
  "social-distinction": "Social Distinction",
  "evaluative-coordination": "Evaluative Coordination",
  "conditional-rules": "Conditional Rules",
};

export const ACT_STRATEGY_BANK = {
  acceptance: ["Name It", "Make Room For", "Willingness Scale"],
  defusion: ["My Mind Says", "Thought Labeling", "Silly Voices", "Thoughts on Leaves"],
  "values-action": ["Choice Boards", "Valued Identity", "Small Steps", "Reflection Journal"],
} as const;

export const INITIAL_WIZARD_DATA: ACTFBAData = {
  profile: {
    studentName: "",
    studentAge: "",
    studentGrade: "",
    gradeLevel: "4-5",
    school: "",
    assessmentDate: "",
    assessor: "",
    teamMembers: "",
  },
  interviewResponses: {},
  thoughtMediatedBehaviors: "",
  interviewValuesCandidates: "",
  initialMatrixDraft: { innerAway: [], innerToward: [], outerAway: [], outerToward: [] },
  actMatrix: { innerAway: [], innerToward: [], outerAway: [], outerToward: [] },
  selectedValues: [],
  valuesRationale: "",
  abcObservations: [{ antecedent: "", precursor: "", behavior: "", consequence: "", latencySeconds: 0 }],
  validatingLatencyAvg: "",
  challengingLatencyAvg: "",
  validatingConditionNotes: "",
  challengingConditionNotes: "",
  fusionHierarchy: "",
  studentCpfqResponses: {},
  caregiverCpfqResponses: {},
  verbalRelations: [{ statement: "", category: "self-deictic", impact: "", flexAlternative: "" }],
  aimAcceptPlan: "",
  aimIdentifyPlan: "",
  aimMovePlan: "",
  targetBehavior: "",
  operationalDefinition: "",
  hypothesizedFunction: "",
  privateEventFunction: "",
  replacementBehaviors: "",
  selectedStrategies: [],
  implementationMaterials: {
    bstChecklist: true,
    visualGuides: true,
    dataTemplates: true,
    caregiverHandout: false,
    implementationNotes: "",
  },
  decisionRules: "",
  progressMetrics: "",
  reviewCadence: "",
};

export const INTERVIEW_QUESTION_IDS = [
  "values-1",
  "values-3",
  "obstacles-1",
  "obstacles-3",
  "school-1",
  "action-1",
];

export function parseList(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function gradeLanguage(grade: GradeLevel): { student: string; team: string; worksheet: string } {
  if (grade === "1-3") return { student: "student-friendly", team: "adult-supported", worksheet: "visual" };
  if (grade === "4-5") return { student: "concrete", team: "scaffolded", worksheet: "guided" };
  if (grade === "6-8") return { student: "collaborative", team: "coaching", worksheet: "self-monitoring" };
  return { student: "adolescent", team: "consultative", worksheet: "reflective" };
}

function topValues(ids: string[]): string[] {
  const byId = new Map(VALUES.map((v) => [v.id, v]));
  return ids.slice(0, 5).map((id) => {
    const value = byId.get(id);
    if (!value) return id;
    return `${value.name} (${CATEGORY_META[value.category].label})`;
  });
}

function latencyDifference(validating: string, challenging: string): string {
  const v = Number(validating);
  const c = Number(challenging);
  if (Number.isNaN(v) || Number.isNaN(c) || v <= 0 || c <= 0) return "Latency differential not yet quantified.";
  const ratio = (c / v).toFixed(2);
  if (c > v) return `Challenging condition latency is ${ratio}x validating latency, indicating fusion-sensitive responding.`;
  return `Latency did not increase under challenge (ratio ${ratio}x); review hierarchy definition and condition integrity.`;
}

function strategyItems(selected: StrategySelection[], category: StrategyCategory): string[] {
  return selected
    .filter((item) => item.category === category)
    .map((item) => `${item.strategy}: ${item.implementation || "Implementation details to be finalized."}`);
}

export function generateACTBIP(data: ACTFBAData): GeneratedACTBIP {
  const studentScore = scoreFull(STUDENT_ITEMS, data.studentCpfqResponses);
  const caregiverScore = scoreFull(CAREGIVER_ITEMS, data.caregiverCpfqResponses);
  const tone = gradeLanguage(data.profile.gradeLevel);

  const phases: GeneratedACTBIP["phases"] = [
    {
      phase: "1",
      title: "Open-Ended Interview & Values Identification",
      content: [
        `Thought-mediated behavior summary: ${data.thoughtMediatedBehaviors || "Not documented."}`,
        `Interview-derived values candidates: ${data.interviewValuesCandidates || "Not documented."}`,
        `Initial matrix draft captured with ${tone.worksheet} supports.`,
      ],
    },
    {
      phase: "2",
      title: "ACT Matrix",
      content: [
        `Inner + Away: ${data.actMatrix.innerAway.join("; ") || "None entered."}`,
        `Inner + Toward: ${data.actMatrix.innerToward.join("; ") || "None entered."}`,
        `Outer + Away: ${data.actMatrix.outerAway.join("; ") || "None entered."}`,
        `Outer + Toward: ${data.actMatrix.outerToward.join("; ") || "None entered."}`,
      ],
    },
    {
      phase: "3",
      title: "Values Assessment",
      content: [
        `Top values (3-5): ${topValues(data.selectedValues).join(", ") || "None selected."}`,
        `Values sort rationale: ${data.valuesRationale || "Not documented."}`,
      ],
    },
    {
      phase: "4",
      title: "ABC Observation with Latency",
      content: data.abcObservations.map((obs, index) =>
        `Obs ${index + 1}: A=${obs.antecedent || "-"}; precursor=${obs.precursor || "-"}; B=${obs.behavior || "-"}; C=${obs.consequence || "-"}; latency=${obs.latencySeconds || 0}s`
      ),
    },
    {
      phase: "5",
      title: "Latency-Based FA (Fusion Hierarchy)",
      content: [
        `Validating condition mean latency: ${data.validatingLatencyAvg || "Not entered"} sec`,
        `Challenging condition mean latency: ${data.challengingLatencyAvg || "Not entered"} sec`,
        latencyDifference(data.validatingLatencyAvg, data.challengingLatencyAvg),
        `Hierarchy notes: ${data.fusionHierarchy || "Not documented."}`,
      ],
    },
    {
      phase: "6",
      title: "CPFQ Administration",
      content: [
        `Student CPFQ total: ${studentScore.total.toFixed(2)} / 4.00 (completion ${(studentScore.completionRate * 100).toFixed(0)}%)`,
        `Caregiver CPFQ total: ${caregiverScore.total.toFixed(2)} / 4.00 (completion ${(caregiverScore.completionRate * 100).toFixed(0)}%)`,
        ...Object.entries(SUBSCALE_META).map(([subscale, meta]) =>
          `${meta.label}: student ${studentScore.subscales[subscale as PsychFlexSubscale].toFixed(2)} | caregiver ${caregiverScore.subscales[subscale as PsychFlexSubscale].toFixed(2)}`
        ),
      ],
    },
    {
      phase: "7",
      title: "Inflexible Verbal Relations",
      content: data.verbalRelations
        .filter((r) => r.statement.trim())
        .map(
          (r) =>
            `${RELATIONAL_CATEGORY_LABELS[r.category]}: "${r.statement}" -> impact: ${r.impact || "not entered"}; flexible alternative: ${r.flexAlternative || "not entered"}`
        ),
    },
    {
      phase: "8",
      title: "AIM Curriculum",
      content: [
        `Accept: ${data.aimAcceptPlan || "Not documented."}`,
        `Identify: ${data.aimIdentifyPlan || "Not documented."}`,
        `Move: ${data.aimMovePlan || "Not documented."}`,
      ],
    },
    {
      phase: "9",
      title: "ACT-Informed BIP Generation",
      content: [
        `Target behavior: ${data.targetBehavior || "Not documented."}`,
        `Operational definition: ${data.operationalDefinition || "Not documented."}`,
        `Hypothesized public function: ${data.hypothesizedFunction || "Not documented."}`,
        `Private event function: ${data.privateEventFunction || "Not documented."}`,
        `Replacement behaviors: ${data.replacementBehaviors || "Not documented."}`,
      ],
    },
    {
      phase: "10",
      title: "ACT Strategies",
      content: [
        ...strategyItems(data.selectedStrategies, "acceptance"),
        ...strategyItems(data.selectedStrategies, "defusion"),
        ...strategyItems(data.selectedStrategies, "values-action"),
      ],
    },
    {
      phase: "11",
      title: "Implementation Materials",
      content: [
        `BST checklist: ${data.implementationMaterials.bstChecklist ? "Included" : "Not included"}`,
        `Visual guides: ${data.implementationMaterials.visualGuides ? "Included" : "Not included"}`,
        `Data templates: ${data.implementationMaterials.dataTemplates ? "Included" : "Not included"}`,
        `Caregiver handout: ${data.implementationMaterials.caregiverHandout ? "Included" : "Not included"}`,
        `Notes: ${data.implementationMaterials.implementationNotes || "None entered."}`,
      ],
    },
    {
      phase: "12",
      title: "Progress Monitoring",
      content: [
        `CPFQ pre/post tracking enabled across all 6 subscales.`,
        `Decision rules: ${data.decisionRules || "Not documented."}`,
        `Metrics: ${data.progressMetrics || "Not documented."}`,
        `Review cadence: ${data.reviewCadence || "Not documented."}`,
      ],
    },
  ];

  const bipSections = [
    {
      title: "Behavior Intervention Plan Summary",
      items: [
        `Plan language adaptation: ${tone.student} phrasing with ${tone.team} team prompts.`,
        `Prevention: matrix-informed antecedent supports and validating-condition priming.`,
        `Teaching: AIM sequence (Accept -> Identify -> Move) integrated into instruction.`,
        `Reinforcement: prioritize outer+toward behaviors linked to selected values.`,
        `Response: neutral safety response plus immediate return to values-based behavior options.`,
      ],
    },
    {
      title: "Private Event Function Alignment",
      items: [
        `Primary private event hypothesis: ${data.privateEventFunction || "Pending."}`,
        `Fusion hierarchy targets: ${data.fusionHierarchy || "Pending."}`,
      ],
    },
  ];

  return {
    title: "ACT-Informed FBA/BIP Assessment & Intervention Wizard Report",
    profileSummary: `${data.profile.studentName || "Student"} | Grade ${data.profile.studentGrade || "N/A"} | ${data.profile.school || "School N/A"}`,
    phases,
    bipSections,
    cpfqSummary: {
      studentTotal: studentScore.total,
      caregiverTotal: caregiverScore.total,
      studentSubscales: studentScore.subscales,
      caregiverSubscales: caregiverScore.subscales,
    },
  };
}

export function actBipToText(report: GeneratedACTBIP): string {
  const lines: string[] = [];
  lines.push(report.title);
  lines.push(report.profileSummary);
  lines.push("");

  for (const phase of report.phases) {
    lines.push(`PHASE ${phase.phase}: ${phase.title}`);
    for (const item of phase.content) lines.push(`- ${item}`);
    lines.push("");
  }

  for (const section of report.bipSections) {
    lines.push(section.title.toUpperCase());
    for (const item of section.items) lines.push(`- ${item}`);
    lines.push("");
  }

  lines.push("CPFQ SNAPSHOT");
  lines.push(`- Student total: ${report.cpfqSummary.studentTotal.toFixed(2)} / 4.00`);
  lines.push(`- Caregiver total: ${report.cpfqSummary.caregiverTotal.toFixed(2)} / 4.00`);

  return lines.join("\n");
}
