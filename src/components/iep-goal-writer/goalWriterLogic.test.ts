import assert from "node:assert/strict";
import test from "node:test";
import {
  buildAnnualGoal,
  buildBaseline,
  buildGoalQualityChecks,
  buildLiveDraft,
  buildObjectives,
  buildOutput,
  calculateObjectiveTargets,
  defaultAnnualGoalDate,
  formatUsDate,
  measurementDefaults,
  measurementPhrase,
  normalizeContext,
  normalizeGoalFragment,
  normalizeSupports,
  objectivesCount,
  unitEncodesMeasurementWindow,
  validateGeneralization,
  validateObjectiveTargets,
} from "./goalWriterLogic";
import type { GoalWriterData } from "./goalWriterLogic";

const baseData: GoalWriterData = {
  annualGoalDate: "2027-08-19",
  studentName: "the student",
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
  dataMethod: "direct observation using trial recording",
  masteryValue: "90",
  consistency: "for 3 consecutively measured school days",
  fluencyEnabled: true,
  fluencySeconds: "10",
  generalizationMode: "aggregate-selected-settings",
  generalizationSettings: ["classroom", "small group"],
  generalizationCount: "2",
  maintenanceWeeks: "4",
  objectiveSchedule: "quarterly",
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
  assert.match(buildAnnualGoal(baseData), /mastery calculated across the selected settings as an aggregate \(classroom, small group\)/);
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
    objectiveSchedule: "quarterly" as const,
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

test("builds trimester objectives with three targets and four-month spacing", () => {
  const trimester = {
    ...baseData,
    direction: "decrease" as const,
    measurementType: "frequency" as const,
    baselineValue: "6",
    measurementUnit: "instances per day",
    masteryValue: "0",
    consistency: "for 5 consecutively measured school days",
    objectiveSchedule: "trimester" as const,
    objectiveTargets: ["4", "2", "0"],
  };

  assert.equal(objectivesCount(trimester), 3);
  assert.equal(validateObjectiveTargets(trimester), null);
  assert.deepEqual(calculateObjectiveTargets(trimester), ["4", "2", "0"]);

  const objectives = buildObjectives(trimester, undefined, new Date(2026, 7, 20));
  assert.equal(objectives.length, 3);
  assert.match(objectives[0], /due 12\/20\/2026/);
  assert.match(objectives[1], /due 04\/20\/2027/);
  assert.match(objectives[2], /due 08\/19\/2027/);

  const output = buildOutput(trimester, new Date(2026, 7, 20));
  assert.match(output, /Short-Term Objectives \(Trimester\)/);
  assert.match(output, /Objective 1/);
  assert.match(output, /Objective 3/);
  assert.doesNotMatch(output, /Objective 4/);
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
    objectiveSchedule: "none" as const,
    objectiveTargets: [],
  };

  const output = buildOutput(decreasing, new Date(2026, 7, 20));
  assert.match(output, /Annual Goal:\n/);
  assert.match(output, /Replacement Behavior Goal:\n/);
  assert.match(output, /the student will request a break using a break card/);
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
  assert.match(draft, /the student will increase on-task behavior/i);
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

test("retains a selected non-default unit throughout a decreasing goal", () => {
  const decreasing = {
    ...baseData,
    direction: "decrease" as const,
    measurementType: "frequency" as const,
    baselineValue: "8",
    measurementUnit: "instances per class period",
    masteryValue: "1",
    consistency: "for 4 consecutively measured class periods",
    objectiveTargets: ["6", "4", "2", "1"],
  };

  const output = buildOutput(decreasing, new Date(2026, 7, 20));
  assert.match(output, /at 8 instances per class period/);
  assert.match(output, /to 1 instance per class period/);
  assert.match(output, /to 6 instances per class period/);
  assert.match(output, /for 4 consecutively measured class periods/);
  assert.doesNotMatch(output, /instances? per day/);
});

test("normalizes duplicated condition stems and broken user edits", () => {
  assert.equal(normalizeContext("When in in the classroom"), "in the classroom");
  assert.equal(normalizeSupports("given given space"), "space");
  assert.equal(normalizeGoalFragment("hitting or kicking others students"), "hitting or kicking other students");

  const messy = {
    ...baseData,
    direction: "decrease" as const,
    measurementType: "frequency" as const,
    baselineValue: "2",
    measurementUnit: "instances per day",
    masteryValue: "0",
    context: "When in in the classroom",
    supports: "given given space",
    behaviorDefinition: "hitting or kicking others students",
    objectiveSchedule: "none" as const,
    objectiveTargets: [],
  };

  const annual = buildAnnualGoal(messy);
  assert.match(annual, /when in the classroom and given space/);
  assert.doesNotMatch(annual, /when When|given given|in in|others students/);
  assert.match(annual, /other students/);
});

test("preserves per-N-day measurement units instead of collapsing to per day", () => {
  assert.equal(unitEncodesMeasurementWindow("instances per 10 consecutive measured days"), true);
  assert.equal(unitEncodesMeasurementWindow("instances per day"), false);

  const preserved = {
    ...baseData,
    direction: "decrease" as const,
    measurementType: "frequency" as const,
    baselineValue: "2",
    measurementUnit: "instances per 10 consecutive measured days",
    baselineDays: "10",
    masteryValue: "0",
    objectiveSchedule: "none" as const,
    objectiveTargets: [],
  };

  const baseline = buildBaseline(preserved);
  assert.match(baseline, /2 instances per 10 consecutive measured days/);
  assert.doesNotMatch(baseline, /instances per day/);
  assert.doesNotMatch(baseline, /measured across 10 school days/);

  const annual = buildAnnualGoal(preserved);
  assert.match(annual, /to 0 instances per 10 consecutive measured days/);
  assert.doesNotMatch(annual, /0 instances per day/);
});

test("states each selected generalization requirement explicitly", () => {
  assert.match(
    buildAnnualGoal({ ...baseData, generalizationMode: "every-selected-setting" }),
    /mastery demonstrated in every selected setting \(classroom, small group\)/
  );
  assert.match(
    buildAnnualGoal({ ...baseData, generalizationMode: "aggregate-selected-settings" }),
    /mastery calculated across the selected settings as an aggregate/
  );
  assert.match(
    buildAnnualGoal({
      ...baseData,
      generalizationMode: "different-adults",
      generalizationSettings: [],
      generalizationCount: "3",
    }),
    /mastery demonstrated with at least 3 different adults/
  );
  assert.match(
    buildAnnualGoal({
      ...baseData,
      generalizationMode: "different-materials-tasks",
      generalizationSettings: [],
      generalizationCount: "4",
    }),
    /mastery demonstrated with at least 4 different materials or tasks/
  );
});

test("requires the details for a selected generalization criterion", () => {
  assert.match(
    validateGeneralization({ ...baseData, generalizationSettings: [] }) ?? "",
    /Select at least one setting/
  );
  assert.match(
    validateGeneralization({
      ...baseData,
      generalizationMode: "different-adults",
      generalizationSettings: [],
      generalizationCount: "1",
    }) ?? "",
    /Enter at least 2/
  );
  assert.equal(validateGeneralization({ ...baseData, generalizationMode: "" }), null);
});

test("adds maintenance only when the user selects it", () => {
  const withoutMaintenance = buildAnnualGoal({ ...baseData, maintenanceWeeks: "" });
  assert.doesNotMatch(withoutMaintenance, /After mastery|maintain the criterion/);
  assert.match(buildAnnualGoal(baseData), /maintain the criterion for 4 weeks/);
});

test("reviews goal components without assigning a score", () => {
  const checks = buildGoalQualityChecks(baseData, new Date(2026, 7, 20));
  assert.equal(checks.length, 7);
  assert.ok(checks.every((check) => check.status === "ready"));
  assert.deepEqual(
    checks.map((check) => check.label),
    [
      "Observable behavior",
      "Baseline and mastery use matching units",
      "Context is defined",
      "Supports are stated",
      "Measurement method matches the behavior",
      "Objectives progress toward the annual criterion",
      "Dates do not exceed the annual review date",
    ]
  );

  const noObjectives = buildGoalQualityChecks({
    ...baseData,
    objectiveSchedule: "none",
    objectiveTargets: [],
  });
  assert.equal(noObjectives.find((check) => check.id === "objective-progression")?.status, "not-included");
  assert.equal(noObjectives.find((check) => check.id === "objective-dates")?.status, "not-included");

  const mismatchedMethod = buildGoalQualityChecks({
    ...baseData,
    measurementType: "duration",
    measurementUnit: "minutes",
    dataMethod: "event recording",
  });
  assert.equal(mismatchedMethod.find((check) => check.id === "measurement-method")?.status, "review");
});
