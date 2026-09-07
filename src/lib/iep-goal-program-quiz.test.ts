import assert from "node:assert/strict";
import test from "node:test";
import {
  buildQuizChecklist,
  countChecklistStatuses,
  deriveQualityScore,
  deriveResultBand,
  EMPTY_IEP_GOAL_PROGRAM_ANSWERS,
  type IepGoalProgramAnswers,
} from "./iep-goal-program-quiz";

const strongAnswers: IepGoalProgramAnswers = {
  ...EMPTY_IEP_GOAL_PROGRAM_ANSWERS,
  quizRole: "school_bcba",
  quizSetting: "elementary",
  quizObservable: "yes",
  quizContext: "yes",
  quizMeasurementMethod: "yes",
  quizMatchingUnits: "yes",
  quizSupports: "yes",
  quizRunnable: "yes",
  quizGeneralizationMaintenance: "not_needed",
};

test("buildQuizChecklist marks strong answers ready", () => {
  const checklist = buildQuizChecklist(strongAnswers);
  const scored = checklist.filter((item) => item.status !== "not-included");
  assert.equal(scored.every((item) => item.status === "ready"), true);
  assert.equal(deriveResultBand(strongAnswers), "can_travel");
});

test("buildQuizChecklist flags review items", () => {
  const weak: IepGoalProgramAnswers = {
    ...strongAnswers,
    quizContext: "no",
    quizRunnable: "sometimes",
  };
  const checklist = buildQuizChecklist(weak);
  const context = checklist.find((item) => item.id === "context");
  assert.equal(context?.status, "review");
  assert.equal(deriveResultBand(weak), "needs_you");
});

test("countChecklistStatuses excludes not-included generalization", () => {
  const checklist = buildQuizChecklist(strongAnswers);
  const counts = countChecklistStatuses(checklist);
  assert.equal(counts.scoredCount, 6);
  assert.equal(counts.readyCount, 6);
});

test("deriveQualityScore ignores not_needed generalization", () => {
  assert.equal(deriveQualityScore(strongAnswers), 12);
  const withGen: IepGoalProgramAnswers = {
    ...strongAnswers,
    quizGeneralizationMaintenance: "yes",
  };
  assert.equal(deriveQualityScore(withGen), 14);
});
