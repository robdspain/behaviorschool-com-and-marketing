/**
 * IEP Goal Program Quiz — shared question definitions and checklist scoring.
 * Mirrors convex/lib/iepGoalProgramQuizLogic.ts for server-side validation.
 */

export type TriStateAnswer = "yes" | "sometimes" | "no";
export type GenMaintAnswer = "yes" | "not_needed" | "not_yet";

export type GoalQualityCheckId =
  | "observable-behavior"
  | "context"
  | "measurement-method"
  | "matching-units"
  | "supports"
  | "program-runnable"
  | "generalization-maintenance";

export type QuizRole =
  | "school_bcba"
  | "behavior_specialist"
  | "school_psychologist"
  | "other";

export type QuizSetting =
  | "preschool_early_childhood"
  | "elementary"
  | "middle"
  | "high_school"
  | "mixed_multiple"
  | "other";

export type ResultBand = "can_travel" | "needs_you" | "not_a_program";

export interface IepGoalProgramAnswers {
  quizRole: QuizRole | "";
  quizSetting: QuizSetting | "";
  quizObservable: TriStateAnswer | "";
  quizContext: TriStateAnswer | "";
  quizMeasurementMethod: TriStateAnswer | "";
  quizMatchingUnits: TriStateAnswer | "";
  quizSupports: TriStateAnswer | "";
  quizRunnable: TriStateAnswer | "";
  quizGeneralizationMaintenance: GenMaintAnswer | "";
}

export interface QuizChecklistItem {
  id: GoalQualityCheckId;
  label: string;
  status: "ready" | "review" | "not-included";
  detail: string;
}

export interface QuizQuestionDef {
  id: keyof IepGoalProgramAnswers;
  prompt: string;
  helper?: string;
  options: { label: string; value: string }[];
}

const triStateOptions = [
  { label: "Yes", value: "yes" },
  { label: "Sometimes / partly", value: "sometimes" },
  { label: "No / not yet", value: "no" },
] as const;

export const IEP_GOAL_PROGRAM_QUESTIONS: QuizQuestionDef[] = [
  {
    id: "quizRole",
    prompt: "What is your role?",
    options: [
      { label: "School BCBA", value: "school_bcba" },
      { label: "Behavior specialist", value: "behavior_specialist" },
      { label: "School psychologist", value: "school_psychologist" },
      { label: "Other", value: "other" },
    ],
  },
  {
    id: "quizSetting",
    prompt: "What setting do you primarily serve?",
    options: [
      { label: "Preschool / early childhood", value: "preschool_early_childhood" },
      { label: "Elementary", value: "elementary" },
      { label: "Middle", value: "middle" },
      { label: "High school", value: "high_school" },
      { label: "Mixed / multiple grade bands", value: "mixed_multiple" },
      { label: "Other", value: "other" },
    ],
  },
  {
    id: "quizObservable",
    prompt:
      "Could another observer identify the target behavior from your goal without asking you clarifying questions?",
    helper: "Maps to: observable behavior and operational definition.",
    options: [...triStateOptions],
  },
  {
    id: "quizContext",
    prompt:
      "Does your goal state the conditions where performance is expected (setting, activity, or routine)?",
    helper: "Maps to: context / condition.",
    options: [...triStateOptions],
  },
  {
    id: "quizMeasurementMethod",
    prompt:
      "Does your data-collection method directly measure the target behavior you wrote?",
    helper: "Maps to: measurement method matches the behavior.",
    options: [...triStateOptions],
  },
  {
    id: "quizMatchingUnits",
    prompt: "Do baseline and mastery criteria use the same measurement unit?",
    helper: "Maps to: baseline and mastery use matching units.",
    options: [...triStateOptions],
  },
  {
    id: "quizSupports",
    prompt:
      "Does your goal name supports or a replacement behavior the student should use?",
    helper: "Maps to: supports are stated.",
    options: [...triStateOptions],
  },
  {
    id: "quizRunnable",
    prompt:
      "Can a new person in the classroom record data for the goal just by reading it?",
    helper: "A goal that can travel is closer to becoming a classroom program.",
    options: [...triStateOptions],
  },
  {
    id: "quizGeneralizationMaintenance",
    prompt:
      "If generalization or maintenance matters for this goal, is it written explicitly?",
    helper: "Optional quality check — skip worry if it does not apply.",
    options: [
      { label: "Yes, it is written", value: "yes" },
      { label: "Not needed for this goal", value: "not_needed" },
      { label: "Not yet / still vague", value: "not_yet" },
    ],
  },
];

const CHECK_DETAILS: Record<
  GoalQualityCheckId,
  { label: string; ready: string; review: string; notIncluded: string }
> = {
  "observable-behavior": {
    label: "Observable behavior",
    ready:
      "Another observer could identify the target behavior from what you wrote.",
    review:
      "Add an observable target behavior and definition another adult could use without asking you.",
    notIncluded: "",
  },
  context: {
    label: "Context is defined",
    ready: "The conditions for performance are stated.",
    review: "Add where and when the behavior is expected before you coach to it.",
    notIncluded: "",
  },
  "measurement-method": {
    label: "Measurement method matches the behavior",
    ready: "Your data method measures the behavior you named.",
    review:
      "Confirm the sheet or method directly tracks the target behavior, not a proxy.",
    notIncluded: "",
  },
  "matching-units": {
    label: "Baseline and mastery use matching units",
    ready: "Baseline and mastery use the same unit of measure.",
    review:
      "Rewrite baseline and mastery so they use the same unit (percent, frequency, duration, etc.).",
    notIncluded: "",
  },
  supports: {
    label: "Supports are stated",
    ready: "Supports or a replacement behavior are named in the goal.",
    review:
      "Name the prompts, visuals, adult help, or replacement behavior available to the student.",
    notIncluded: "",
  },
  "program-runnable": {
    label: "Goal is runnable as a classroom program",
    ready:
      "A new classroom adult can take data from the goal alone. Protect that clarity.",
    review:
      "If staff ask clarifying questions, the measure is not done. Tighten wording before coaching.",
    notIncluded: "",
  },
  "generalization-maintenance": {
    label: "Generalization or maintenance (when needed)",
    ready: "Generalization or maintenance is written where it matters.",
    review:
      "If mastery must hold across settings or over time, state that criterion explicitly.",
    notIncluded: "No generalization or maintenance criterion needed for this goal.",
  },
};

function triStateStatus(value: TriStateAnswer | ""): "ready" | "review" {
  return value === "yes" ? "ready" : "review";
}

function genMaintStatus(
  value: GenMaintAnswer | ""
): "ready" | "review" | "not-included" {
  if (value === "yes") return "ready";
  if (value === "not_needed") return "not-included";
  return "review";
}

export function buildQuizChecklist(
  answers: IepGoalProgramAnswers
): QuizChecklistItem[] {
  const items: QuizChecklistItem[] = [
    {
      id: "observable-behavior",
      label: CHECK_DETAILS["observable-behavior"].label,
      status: triStateStatus(answers.quizObservable),
      detail:
        answers.quizObservable === "yes"
          ? CHECK_DETAILS["observable-behavior"].ready
          : CHECK_DETAILS["observable-behavior"].review,
    },
    {
      id: "context",
      label: CHECK_DETAILS.context.label,
      status: triStateStatus(answers.quizContext),
      detail:
        answers.quizContext === "yes"
          ? CHECK_DETAILS.context.ready
          : CHECK_DETAILS.context.review,
    },
    {
      id: "measurement-method",
      label: CHECK_DETAILS["measurement-method"].label,
      status: triStateStatus(answers.quizMeasurementMethod),
      detail:
        answers.quizMeasurementMethod === "yes"
          ? CHECK_DETAILS["measurement-method"].ready
          : CHECK_DETAILS["measurement-method"].review,
    },
    {
      id: "matching-units",
      label: CHECK_DETAILS["matching-units"].label,
      status: triStateStatus(answers.quizMatchingUnits),
      detail:
        answers.quizMatchingUnits === "yes"
          ? CHECK_DETAILS["matching-units"].ready
          : CHECK_DETAILS["matching-units"].review,
    },
    {
      id: "supports",
      label: CHECK_DETAILS.supports.label,
      status: triStateStatus(answers.quizSupports),
      detail:
        answers.quizSupports === "yes"
          ? CHECK_DETAILS.supports.ready
          : CHECK_DETAILS.supports.review,
    },
    {
      id: "program-runnable",
      label: CHECK_DETAILS["program-runnable"].label,
      status: triStateStatus(answers.quizRunnable),
      detail:
        answers.quizRunnable === "yes"
          ? CHECK_DETAILS["program-runnable"].ready
          : CHECK_DETAILS["program-runnable"].review,
    },
    {
      id: "generalization-maintenance",
      label: CHECK_DETAILS["generalization-maintenance"].label,
      status: genMaintStatus(answers.quizGeneralizationMaintenance),
      detail:
        answers.quizGeneralizationMaintenance === "yes"
          ? CHECK_DETAILS["generalization-maintenance"].ready
          : answers.quizGeneralizationMaintenance === "not_needed"
            ? CHECK_DETAILS["generalization-maintenance"].notIncluded
            : CHECK_DETAILS["generalization-maintenance"].review,
    },
  ];

  return items;
}

export function countChecklistStatuses(checklist: QuizChecklistItem[]) {
  const scored = checklist.filter((item) => item.status !== "not-included");
  const readyCount = scored.filter((item) => item.status === "ready").length;
  const reviewCount = scored.filter((item) => item.status === "review").length;
  return { readyCount, reviewCount, scoredCount: scored.length };
}

/** Server-aligned quality score: yes=2, sometimes=1, no=0; gen/maint yes=2, not_yet=0, not_needed excluded */
export function deriveQualityScore(answers: IepGoalProgramAnswers): number {
  const triFields: (TriStateAnswer | "")[] = [
    answers.quizObservable,
    answers.quizContext,
    answers.quizMeasurementMethod,
    answers.quizMatchingUnits,
    answers.quizSupports,
    answers.quizRunnable,
  ];
  const triScores = triFields.map((value) => {
    if (value === "yes") return 2;
    if (value === "sometimes") return 1;
    return 0;
  });
  const gen =
    answers.quizGeneralizationMaintenance === "yes"
      ? 2
      : answers.quizGeneralizationMaintenance === "not_yet"
        ? 0
        : null;
  const all = gen === null ? triScores : [...triScores, gen];
  return all.reduce((sum, n) => sum + n, 0);
}

export function deriveResultBand(answers: IepGoalProgramAnswers): ResultBand {
  if (answers.quizRunnable === "yes") return "can_travel";
  if (answers.quizRunnable === "sometimes") return "needs_you";
  return "not_a_program";
}

export function deriveRunnableScore(quizRunnable: TriStateAnswer | ""): number {
  if (quizRunnable === "yes") return 2;
  if (quizRunnable === "sometimes") return 1;
  return 0;
}

export const RESULT_BAND_COPY: Record<
  ResultBand,
  { title: string; summary: string; tip: string }
> = {
  can_travel: {
    title: "Your goal can travel.",
    summary:
      "A new adult can take data from what you wrote. Use the checklist below to tighten any remaining gaps before you coach staff.",
    tip:
      "Put one fidelity line in the plan: who takes data, when, and on what sheet, so the classroom does not depend on you being there.",
  },
  needs_you: {
    title: "It works when you are around.",
    summary:
      "The goal still needs you to interpret it. Focus on the review items below before adding more BIP pages.",
    tip:
      "Rewrite until a new person in the classroom can record data just by reading it. If they ask clarifying questions, the measure is not done.",
  },
  not_a_program: {
    title: "Not a program yet.",
    summary:
      "Build the datasheet first (what to look for, how often, what to mark). Fix the review items below before you coach.",
    tip:
      "If a new classroom adult cannot take data from that page alone, fix the goal before you coach.",
  },
};

export const EMPTY_IEP_GOAL_PROGRAM_ANSWERS: IepGoalProgramAnswers = {
  quizRole: "",
  quizSetting: "",
  quizObservable: "",
  quizContext: "",
  quizMeasurementMethod: "",
  quizMatchingUnits: "",
  quizSupports: "",
  quizRunnable: "",
  quizGeneralizationMaintenance: "",
};
