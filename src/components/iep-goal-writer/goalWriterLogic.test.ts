import assert from "node:assert/strict";
import test from "node:test";
import {
  buildAnnualGoal,
  buildBaseline,
  buildLiveDraft,
  buildObjectives,
  buildOutput,
  calculateObjectiveTargets,
  defaultAnnualGoalDate,
  formatUsDate,
  measurementDefaults,
  measurementPhrase,
  validateObjectiveTargets,
} from "./goalWriterLogic";
import type { GoalWriterData } from "./goalWriterLogic";

const baseData: GoalWriterData = {
  annualGoalDate: "2027-08-19",
  studentName: "Alex",
  direction: "increase",
  behaviorTitle: "on-task behavior",
  behaviorDefinition: "remaining in the assigned area and working on the assigned task",
  replacementBehavior: "request a break using a break card",
  measurementType: "percentage-opportunities",
  baselineValue: "40",
  measurementUnit: "",
  baselineDays: "3",
  baselineMethods: "direct observation with interval recording",
  context: "during independent classroom work",
  supports: "a visual checklist and one verbal prompt",
  dataMethod: "direct observation with interval recording",
  masteryValue: "90",
  consistency: "for 3 consecutively measured school days",
  fluencyEnabled: true,
  fluencySeconds: "10",
  generalizationSettings: ["classroom", "small group"],
  maintenanceWeeks: "4",
  includeObjectives: true,
  objectiveTargets: ["52.5", "65", "77.5", "90"],
};

test("formats annual dates with the year last", () => {
  assert.equal(formatUsDate("2027-08-19"), "08/19/2027");
  assert.equal(defaultAnnualGoalDate(new Date(2026, 7, 20)), "2027-08-19");
});

test("uses direction-specific measurement defaults", () => {
  assert.deepEqual(measurementDefaults("increase"), {
    consistency: "for 3 consecutively measured school days",
  });
  assert.deepEqual(measurementDefaults("decrease"), {
    consistency: "for 5 consecutively measured school days",
  });
});

test("builds an objective baseline and annual goal", () => {
  assert.match(buildBaseline(baseData), /40% of opportunities/);
  assert.match(buildBaseline(baseData), /3 school days/);
  assert.match(buildAnnualGoal(baseData), /^By 08\/19\/2027/);
  assert.match(buildAnnualGoal(baseData), /to 90% of opportunities/);
  assert.match(buildAnnualGoal(baseData), /across 2 settings/);
  assert.match(buildAnnualGoal(baseData), /maintain the criterion for 4 weeks/);
});

test("builds decreasing criteria and quarterly objectives", () => {
  const decreasing = {
    ...baseData,
    direction: "decrease" as const,
    measurementType: "frequency" as const,
    baselineValue: "6",
    measurementUnit: "instances per day",
    masteryValue: "0",
    consistency: "for 5 consecutively measured school days",
    objectiveTargets: ["4.5", "3", "1.5", "0"],
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
    measurementType: "frequency" as const,
    baselineValue: "6",
    measurementUnit: "instances per day",
    masteryValue: "0",
    consistency: "for 5 consecutively measured school days",
    includeObjectives: false,
    objectiveTargets: [],
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
    baselineValue: "",
    context: "",
    supports: "",
    dataMethod: "",
  };

  const draft = buildLiveDraft(partial);
  assert.match(draft, /The student will increase on-task behavior/);
  assert.doesNotMatch(draft, /Baseline:/);
  assert.doesNotMatch(draft, /\[Student Name\]|teacher observation|classroom settings/);
});

test("calculates editable objectives from the entered baseline and mastery", () => {
  assert.deepEqual(calculateObjectiveTargets(baseData), ["52.5", "65", "77.5", "90"]);

  const decreasing = {
    ...baseData,
    direction: "decrease" as const,
    measurementType: "duration" as const,
    baselineValue: "12",
    measurementUnit: "minutes",
    masteryValue: "4",
    objectiveTargets: ["10", "8", "6", "4"],
  };
  assert.deepEqual(calculateObjectiveTargets(decreasing), ["10", "8", "6", "4"]);
  assert.equal(validateObjectiveTargets(decreasing), null);

  const edited = { ...decreasing, objectiveTargets: ["11", "9", "7", "4"] };
  assert.match(buildObjectives(edited, 4, new Date(2026, 7, 20))[0], /to 11 minutes/);
});

test("keeps measurement selection independent from behavior direction", () => {
  const latencyGoal = {
    ...baseData,
    direction: "increase" as const,
    measurementType: "latency" as const,
    baselineValue: "30",
    measurementUnit: "seconds",
    masteryValue: "5",
    objectiveTargets: ["23.75", "17.5", "11.25", "5"],
  };

  assert.equal(measurementPhrase(latencyGoal, "5"), "5 seconds");
  assert.deepEqual(calculateObjectiveTargets(latencyGoal), ["23.75", "17.5", "11.25", "5"]);
  assert.equal(validateObjectiveTargets(latencyGoal), null);
  assert.match(buildAnnualGoal(latencyGoal), /increase on-task behavior.*to 5 seconds/);
});
