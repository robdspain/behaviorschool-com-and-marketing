import assert from "node:assert/strict";
import test from "node:test";
import {
  buildAnnualGoal,
  buildBaseline,
  buildLiveDraft,
  buildObjectives,
  buildOutput,
  defaultAnnualGoalDate,
  formatUsDate,
  measurementDefaults,
} from "./goalWriterLogic";
import type { GoalWriterData } from "./goalWriterLogic";

const baseData: GoalWriterData = {
  annualGoalDate: "2027-08-19",
  studentName: "Alex",
  direction: "increase",
  behaviorTitle: "on-task behavior",
  behaviorDefinition: "remaining in the assigned area and working on the assigned task",
  replacementBehavior: "request a break using a break card",
  baselineFrequency: "",
  baselineUnit: "times per day",
  baselinePercent: "40",
  baselineDays: "3",
  baselineMethods: "direct observation with interval recording",
  context: "during independent classroom work",
  supports: "a visual checklist and one verbal prompt",
  dataMethod: "direct observation with interval recording",
  accuracy: "in 90% of opportunities",
  consistency: "for 3 consecutively measured school days",
  fluencyEnabled: true,
  fluencySeconds: "10",
  generalizationSettings: ["classroom", "small group"],
  maintenanceWeeks: "4",
  includeObjectives: true,
};

test("formats annual dates with the year last", () => {
  assert.equal(formatUsDate("2027-08-19"), "08/19/2027");
  assert.equal(defaultAnnualGoalDate(new Date(2026, 7, 20)), "2027-08-19");
});

test("uses direction-specific measurement defaults", () => {
  assert.deepEqual(measurementDefaults("increase"), {
    accuracy: "in 90% of opportunities",
    consistency: "for 3 consecutively measured school days",
  });
  assert.deepEqual(measurementDefaults("decrease"), {
    accuracy: "0 instances per day",
    consistency: "for 5 consecutively measured school days",
  });
});

test("builds an objective baseline and annual goal", () => {
  assert.match(buildBaseline(baseData), /40% of opportunities/);
  assert.match(buildBaseline(baseData), /3 school days/);
  assert.match(buildAnnualGoal(baseData), /^By 08\/19\/2027/);
  assert.match(buildAnnualGoal(baseData), /in 90% of opportunities/);
  assert.match(buildAnnualGoal(baseData), /across 2 settings/);
  assert.match(buildAnnualGoal(baseData), /maintain the criterion for 4 weeks/);
});

test("builds decreasing criteria and quarterly objectives", () => {
  const decreasing = {
    ...baseData,
    direction: "decrease" as const,
    baselineFrequency: "6",
    baselineUnit: "instances per day",
    baselinePercent: "",
    accuracy: "0 instances per day",
    consistency: "for 5 consecutively measured school days",
  };

  assert.match(buildAnnualGoal(decreasing), /to 0 instances per day/);
  assert.match(buildBaseline(decreasing), /6 instances per day/);

  const objectives = buildObjectives(decreasing, 4, new Date(2026, 7, 20));
  assert.equal(objectives.length, 4);
  assert.match(objectives[0], /due 11\/20\/2026/);
  assert.match(objectives[3], /due 08\/19\/2027/);
  assert.match(objectives[3], /0 instances per day for 5 consecutively/);
});

test("keeps the reduction goal and replacement-skill goal separate", () => {
  const decreasing = {
    ...baseData,
    direction: "decrease" as const,
    baselineFrequency: "6",
    baselineUnit: "instances per day",
    baselinePercent: "",
    accuracy: "0 instances per day",
    consistency: "for 5 consecutively measured school days",
    includeObjectives: false,
  };

  const output = buildOutput(decreasing, new Date(2026, 7, 20));
  assert.match(output, /Annual Goal:\n/);
  assert.match(output, /Replacement Behavior Goal:\n/);
  assert.match(output, /Alex will request a break using a break card/);
  assert.doesNotMatch(output, /Short-Term Objectives/);
});

test("updates a progressive draft without inserting fake student data", () => {
  const partial = {
    ...baseData,
    studentName: "",
    baselinePercent: "",
    context: "",
    supports: "",
    dataMethod: "",
  };

  const draft = buildLiveDraft(partial);
  assert.match(draft, /The student will increase on-task behavior/);
  assert.doesNotMatch(draft, /Baseline:/);
  assert.doesNotMatch(draft, /\[Student Name\]|teacher observation|classroom settings/);
});
