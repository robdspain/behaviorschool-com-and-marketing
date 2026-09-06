/**
 * Server-side IEP goal program quiz scoring — keep in sync with src/lib/iep-goal-program-quiz.ts
 */

export type TriStateAnswer = "yes" | "sometimes" | "no";
export type GenMaintAnswer = "yes" | "not_needed" | "not_yet";
export type ResultBand = "can_travel" | "needs_you" | "not_a_program";

export const ALLOWED_ROLES = new Set([
  "school_bcba",
  "behavior_specialist",
  "school_psychologist",
  "other",
]);

export const ALLOWED_SETTINGS = new Set([
  "preschool_early_childhood",
  "elementary",
  "middle",
  "high_school",
  "mixed_multiple",
  "other",
]);

export const ALLOWED_TRI_STATE = new Set(["yes", "sometimes", "no"]);
export const ALLOWED_GEN_MAINT = new Set(["yes", "not_needed", "not_yet"]);

export const RUNNABLE_SCORES: Record<string, number> = {
  yes: 2,
  sometimes: 1,
  no: 0,
};

export const RESULT_BANDS: Record<string, ResultBand> = {
  yes: "can_travel",
  sometimes: "needs_you",
  no: "not_a_program",
};

export interface QuizAnswerInput {
  quizRole: string;
  quizSetting: string;
  quizObservable: string;
  quizContext: string;
  quizMeasurementMethod: string;
  quizMatchingUnits: string;
  quizSupports: string;
  quizRunnable: string;
  quizGeneralizationMaintenance: string;
}

export function deriveQualityScore(input: QuizAnswerInput): number {
  const triFields = [
    input.quizObservable,
    input.quizContext,
    input.quizMeasurementMethod,
    input.quizMatchingUnits,
    input.quizSupports,
    input.quizRunnable,
  ];
  const triScores = triFields.map((value) => RUNNABLE_SCORES[value] ?? 0);
  const gen =
    input.quizGeneralizationMaintenance === "yes"
      ? 2
      : input.quizGeneralizationMaintenance === "not_yet"
        ? 0
        : null;
  const all = gen === null ? triScores : [...triScores, gen];
  return all.reduce((sum, n) => sum + n, 0);
}

export function buildQuizAnswerTags(input: QuizAnswerInput) {
  return [
    `quiz_role:${input.quizRole}`,
    `quiz_setting:${input.quizSetting}`,
    `quiz_observable:${input.quizObservable}`,
    `quiz_context:${input.quizContext}`,
    `quiz_measurement_method:${input.quizMeasurementMethod}`,
    `quiz_matching_units:${input.quizMatchingUnits}`,
    `quiz_supports:${input.quizSupports}`,
    `quiz_runnable:${input.quizRunnable}`,
    `quiz_generalization_maintenance:${input.quizGeneralizationMaintenance}`,
  ];
}
