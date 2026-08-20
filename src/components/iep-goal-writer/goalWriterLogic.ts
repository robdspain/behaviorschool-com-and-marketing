export type BehaviorDirection = "increase" | "decrease";
export type MeasurementType =
  | "frequency"
  | "rate"
  | "duration"
  | "latency"
  | "percentage-opportunities"
  | "percentage-intervals"
  | "other";

export type GeneralizationMode =
  | "every-selected-setting"
  | "aggregate-selected-settings"
  | "different-adults"
  | "different-materials-tasks";

export type GoalQualityStatus = "ready" | "review" | "not-included";

export interface GoalQualityCheck {
  id: string;
  label: string;
  status: GoalQualityStatus;
  detail: string;
}

export interface GoalWriterData {
  annualGoalDate: string;
  studentName: string;
  direction: BehaviorDirection;
  behaviorTitle: string;
  behaviorDefinition: string;
  replacementBehavior: string;
  measurementType: MeasurementType;
  baselineValue: string;
  measurementUnit: string;
  baselineDays: string;
  baselineMethods: string;
  context: string;
  supports: string;
  dataMethod: string;
  masteryValue: string;
  consistency: string;
  fluencyEnabled: boolean;
  fluencySeconds: string;
  generalizationMode: GeneralizationMode | "";
  generalizationSettings: string[];
  generalizationCount: string;
  maintenanceWeeks: string;
  includeObjectives: boolean;
  objectiveTargets: string[];
}

export function measurementDefaults(direction: BehaviorDirection) {
  if (direction === "decrease") {
    return {
      consistency: "for 5 consecutively measured school days",
    };
  }

  return {
    consistency: "for 3 consecutively measured school days",
  };
}

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

export function toDateInputValue(date: Date): string {
  return [date.getFullYear(), pad2(date.getMonth() + 1), pad2(date.getDate())].join("-");
}

export function oneYearMinusOneDay(from = new Date()): Date {
  const result = new Date(from.getFullYear() + 1, from.getMonth(), from.getDate());
  result.setDate(result.getDate() - 1);
  return result;
}

export function defaultAnnualGoalDate(from = new Date()): string {
  return toDateInputValue(oneYearMinusOneDay(from));
}

export function formatUsDate(dateValue: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateValue);
  if (!match) return dateValue;
  return [match[2], match[3], match[1]].join("/");
}

function clean(value: string): string {
  return value.trim();
}

function firstNumber(value: string): number | null {
  const match = /-?\d+(?:\.\d+)?/.exec(value);
  if (!match) return null;
  const parsed = Number(match[0]);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatTarget(value: number): string {
  return String(Number(value.toFixed(2)));
}

function objectiveEndpoints(data: GoalWriterData): { baseline: number; mastery: number } | null {
  const baseline = firstNumber(data.baselineValue);
  const mastery = firstNumber(data.masteryValue);
  if (baseline === null || mastery === null) return null;
  return { baseline, mastery };
}

export function calculateObjectiveTargets(data: GoalWriterData, count = 4): string[] {
  const endpoints = objectiveEndpoints(data);
  if (!endpoints || count < 1) return [];
  const { baseline, mastery } = endpoints;
  if (mastery === baseline) return [];

  return Array.from({ length: count }, (_, index) => {
    const proportion = (index + 1) / count;
    return formatTarget(baseline + (mastery - baseline) * proportion);
  });
}

export function validateObjectiveTargets(data: GoalWriterData, count = 4): string | null {
  if (!data.includeObjectives) return null;
  const endpoints = objectiveEndpoints(data);
  if (!endpoints) return "Enter numeric baseline and mastery criteria before adding objectives.";
  const { baseline, mastery } = endpoints;

  if (mastery === baseline) return "The annual mastery criterion must differ from the baseline.";
  if (data.objectiveTargets.length !== count) {
    return `Enter all ${count} objective targets.`;
  }

  const targets = data.objectiveTargets.map(firstNumber);
  if (targets.some((target) => target === null)) return "Every objective target must be numeric.";
  const numericTargets = targets as number[];
  if (
    (data.measurementType === "percentage-opportunities" || data.measurementType === "percentage-intervals") &&
    numericTargets.some((target) => target < 0 || target > 100)
  ) {
    return "Percentage objective targets must be between 0 and 100.";
  }

  const progressesUp = mastery > baseline;
  let previous = baseline;
  for (const target of numericTargets) {
    if (progressesUp && (target <= previous || target > mastery)) {
      return "Each objective target must increase from the baseline toward the annual criterion.";
    }
    if (!progressesUp && (target >= previous || target < mastery)) {
      return "Each objective target must decrease from the baseline toward the annual criterion.";
    }
    previous = target;
  }

  if (numericTargets[numericTargets.length - 1] !== mastery) {
    return "The final objective target must match the annual mastery criterion.";
  }
  return null;
}

function subject(data: GoalWriterData): string {
  return clean(data.studentName) || "The student";
}

export function measurementPhrase(data: GoalWriterData, value: string): string {
  const numericValue = clean(value);
  if (data.measurementType === "percentage-opportunities") {
    return `${numericValue}% of opportunities`;
  }
  if (data.measurementType === "percentage-intervals") {
    return `${numericValue}% of intervals`;
  }

  const unit = clean(data.measurementUnit);
  if (!unit) return numericValue;
  const singularUnit = firstNumber(numericValue) === 1
    ? unit
      .replace(/\binstances\b/i, "instance")
      .replace(/\btimes\b/i, "time")
      .replace(/\bminutes\b/i, "minute")
      .replace(/\bseconds\b/i, "second")
      .replace(/\bhours\b/i, "hour")
    : unit;
  return `${numericValue} ${singularUnit}`;
}

export function generalizationPhrase(data: GoalWriterData): string {
  const settings = data.generalizationSettings.map(clean).filter(Boolean);
  const count = clean(data.generalizationCount);

  if (data.generalizationMode === "every-selected-setting" && settings.length) {
    return `, with mastery demonstrated in every selected setting (${settings.join(", ")})`;
  }
  if (data.generalizationMode === "aggregate-selected-settings" && settings.length) {
    return `, with mastery calculated across the selected settings as an aggregate (${settings.join(", ")})`;
  }
  if (data.generalizationMode === "different-adults" && count) {
    return `, with mastery demonstrated with at least ${count} different adults`;
  }
  if (data.generalizationMode === "different-materials-tasks" && count) {
    return `, with mastery demonstrated with at least ${count} different materials or tasks`;
  }
  return "";
}

export function validateGeneralization(data: GoalWriterData): string | null {
  if (!data.generalizationMode) return null;

  if (
    data.generalizationMode === "every-selected-setting" ||
    data.generalizationMode === "aggregate-selected-settings"
  ) {
    return data.generalizationSettings.length
      ? null
      : "Select at least one setting for the generalization criterion.";
  }

  const count = firstNumber(data.generalizationCount);
  return count !== null && Number.isInteger(count) && count >= 2
    ? null
    : "Enter at least 2 adults, materials, or tasks for the generalization criterion.";
}

export function buildBaseline(data: GoalWriterData): string {
  const student = subject(data);
  const title = clean(data.behaviorTitle) || "the target behavior";
  const methods = clean(data.baselineMethods) || clean(data.dataMethod);
  const parts: string[] = [];

  const verb = data.direction === "decrease" ? "engages in" : "demonstrates";
  parts.push(
    `${student} currently ${verb} ${title} at ${measurementPhrase(data, data.baselineValue)}.`
  );
  if (clean(data.baselineDays)) {
    parts.push(`This baseline was measured across ${clean(data.baselineDays)} school days.`);
  }

  if (methods) parts.push(`Baseline data were collected using ${methods}.`);
  return parts.join(" ");
}

export function buildAnnualGoal(data: GoalWriterData): string {
  const dueDate = formatUsDate(data.annualGoalDate);
  const student = subject(data);
  const definition = clean(data.behaviorDefinition);
  const behavior = clean(data.behaviorTitle);
  const targetPhrase = measurementPhrase(data, data.masteryValue);
  const fluency = data.fluencyEnabled && clean(data.fluencySeconds)
    ? `, initiating within ${clean(data.fluencySeconds)} seconds`
    : "";
  const generalization = generalizationPhrase(data);
  const maintenance = clean(data.maintenanceWeeks)
    ? ` After mastery, ${student} will maintain the criterion for ${clean(data.maintenanceWeeks)} weeks.`
    : "";

  return `By ${dueDate}, when ${clean(data.context)} and given ${clean(data.supports)}, ${student} will ${data.direction} ${behavior} (${definition}) to ${targetPhrase} ${clean(data.consistency)}${fluency}${generalization}, as measured by ${clean(data.dataMethod)}.${maintenance}`;
}

export function buildReplacementGoal(data: GoalWriterData): string {
  if (data.direction !== "decrease" || !clean(data.replacementBehavior)) return "";

  const dueDate = formatUsDate(data.annualGoalDate);
  const student = subject(data);
  const fluency = data.fluencyEnabled && clean(data.fluencySeconds)
    ? `, initiating within ${clean(data.fluencySeconds)} seconds`
    : "";
  const generalization = generalizationPhrase(data);
  const maintenance = clean(data.maintenanceWeeks)
    ? ` After mastery, ${student} will maintain the criterion for ${clean(data.maintenanceWeeks)} weeks.`
    : "";

  return `By ${dueDate}, when ${clean(data.context)} and given ${clean(data.supports)}, ${student} will ${clean(data.replacementBehavior)} in 90% of relevant opportunities for 3 consecutively measured school days${fluency}${generalization}, as measured by ${clean(data.dataMethod)}.${maintenance}`;
}

export function buildLiveDraft(data: GoalWriterData): string {
  const student = subject(data);
  const sections: string[] = [];
  const hasBaseline = Boolean(clean(data.baselineValue));

  if (hasBaseline && clean(data.behaviorTitle)) {
    sections.push(`Baseline:\n${buildBaseline(data)}`);
  }

  if (!clean(data.behaviorTitle)) {
    return "Your draft will appear here as you enter the student-specific information.";
  }

  let goal = clean(data.annualGoalDate) ? `By ${formatUsDate(data.annualGoalDate)}, ` : "";
  if (clean(data.context)) goal += `when ${clean(data.context)}`;
  if (clean(data.supports)) goal += `${clean(data.context) ? " and " : ""}given ${clean(data.supports)}`;
  if (clean(data.context) || clean(data.supports)) goal += ", ";
  goal += `${student} will ${data.direction} ${clean(data.behaviorTitle)}`;
  if (clean(data.behaviorDefinition)) goal += ` (${clean(data.behaviorDefinition)})`;
  if (clean(data.masteryValue)) {
    goal += ` to ${measurementPhrase(data, data.masteryValue)}`;
    if (clean(data.consistency)) goal += ` ${clean(data.consistency)}`;
    if (data.fluencyEnabled && clean(data.fluencySeconds)) {
      goal += `, initiating within ${clean(data.fluencySeconds)} seconds`;
    }
    goal += generalizationPhrase(data);
    if (clean(data.dataMethod)) goal += `, as measured by ${clean(data.dataMethod)}`;
  }
  goal += ".";
  if (clean(data.masteryValue) && clean(data.maintenanceWeeks)) {
    goal += ` After mastery, ${student} will maintain the criterion for ${clean(data.maintenanceWeeks)} weeks.`;
  }
  sections.push(`Annual Goal:\n${goal}`);

  if (data.direction === "decrease" && clean(data.replacementBehavior)) {
    let replacement = clean(data.annualGoalDate) ? `By ${formatUsDate(data.annualGoalDate)}, ` : "";
    if (clean(data.context)) replacement += `when ${clean(data.context)}`;
    if (clean(data.supports)) replacement += `${clean(data.context) ? " and " : ""}given ${clean(data.supports)}`;
    if (clean(data.context) || clean(data.supports)) replacement += ", ";
    replacement += `${student} will ${clean(data.replacementBehavior)} in 90% of relevant opportunities for 3 consecutively measured school days`;
    if (clean(data.dataMethod)) replacement += `, as measured by ${clean(data.dataMethod)}`;
    replacement += ".";
    sections.push(`Replacement Behavior Goal:\n${replacement}`);
  }

  return sections.join("\n\n");
}

function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, date.getDate());
}

function localDateFromInput(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

function objectiveDates(data: GoalWriterData, count: number, from: Date): Date[] {
  const annualDate = localDateFromInput(data.annualGoalDate);
  return Array.from({ length: count }, (_, index) => {
    const proposedDate = addMonths(from, (index + 1) * 3);
    return annualDate && proposedDate > annualDate ? annualDate : proposedDate;
  });
}

export function buildObjectives(
  data: GoalWriterData,
  count = 4,
  from = new Date()
): string[] {
  const student = subject(data);
  const context = clean(data.context);
  const supports = clean(data.supports);
  const behavior = clean(data.behaviorTitle);
  const definition = clean(data.behaviorDefinition);
  const method = clean(data.dataMethod);
  const calculatedTargets = calculateObjectiveTargets(data, count);
  const targets = data.objectiveTargets.length === count
    ? data.objectiveTargets
    : calculatedTargets;
  const dueDates = objectiveDates(data, count, from);

  return Array.from({ length: count }, (_, index) => {
    const dueDate = formatUsDate(toDateInputValue(dueDates[index]));
    const target = targets[index] ?? "";
    const objectiveConsistency = index === count - 1
      ? clean(data.consistency)
      : "for 3 consecutively measured school days";

    return `Objective ${index + 1} (due ${dueDate}): By ${dueDate}, when ${context} and given ${supports}, ${student} will ${data.direction} ${behavior} (${definition}) to ${measurementPhrase(data, target)} ${objectiveConsistency}, as measured by ${method}.`;
  });
}

export function buildOutput(data: GoalWriterData, from = new Date()): string {
  const sections = [
    `Baseline:\n${buildBaseline(data)}`,
    `Annual Goal:\n${buildAnnualGoal(data)}`,
  ];

  const replacementGoal = buildReplacementGoal(data);
  if (replacementGoal) sections.push(`Replacement Behavior Goal:\n${replacementGoal}`);

  if (data.includeObjectives) {
    sections.push(`Short-Term Objectives:\n${buildObjectives(data, 4, from).join("\n\n")}`);
  }

  return sections.join("\n\n");
}

function measurementMethodStatus(data: GoalWriterData): GoalQualityCheck {
  const method = clean(data.dataMethod).toLowerCase();
  const patterns: Partial<Record<MeasurementType, RegExp>> = {
    frequency: /event|frequency|count/,
    rate: /rate|event|frequency|count/,
    duration: /duration/,
    latency: /latency/,
    "percentage-opportunities": /opportunit|trial/,
    "percentage-intervals": /interval/,
  };
  const expectedPattern = patterns[data.measurementType];

  if (!method) {
    return {
      id: "measurement-method",
      label: "Measurement method matches the behavior",
      status: "review",
      detail: "Add the data-collection method and confirm that it measures the target behavior.",
    };
  }
  if (!expectedPattern) {
    return {
      id: "measurement-method",
      label: "Measurement method matches the behavior",
      status: "review",
      detail: "A custom measurement method is entered. Confirm that it directly measures the target behavior.",
    };
  }
  return expectedPattern.test(method)
    ? {
        id: "measurement-method",
        label: "Measurement method matches the behavior",
        status: "ready",
        detail: "The entered method is consistent with the selected measurement type.",
      }
    : {
        id: "measurement-method",
        label: "Measurement method matches the behavior",
        status: "review",
        detail: "The entered method may not match the selected measurement type. Confirm or revise it.",
      };
}

export function buildGoalQualityChecks(
  data: GoalWriterData,
  from = new Date()
): GoalQualityCheck[] {
  const hasObservableBehavior = Boolean(clean(data.behaviorTitle) && clean(data.behaviorDefinition));
  const percentages = data.measurementType.startsWith("percentage");
  const hasMatchingUnits = Boolean(
    clean(data.baselineValue) &&
    clean(data.masteryValue) &&
    (percentages || clean(data.measurementUnit))
  );
  const objectiveError = validateObjectiveTargets(data);
  const annualDate = localDateFromInput(data.annualGoalDate);
  const datesStayWithinAnnualReview = Boolean(
    annualDate && objectiveDates(data, 4, from).every((date) => date <= annualDate)
  );

  return [
    {
      id: "observable-behavior",
      label: "Observable behavior",
      status: hasObservableBehavior ? "ready" : "review",
      detail: hasObservableBehavior
        ? "A target behavior and operational definition are present. Confirm that another observer could identify it."
        : "Add both the target behavior and an observable, measurable definition.",
    },
    {
      id: "matching-units",
      label: "Baseline and mastery use matching units",
      status: hasMatchingUnits ? "ready" : "review",
      detail: hasMatchingUnits
        ? `Both criteria use ${percentages ? (data.measurementType === "percentage-opportunities" ? "percentage of opportunities" : "percentage of intervals") : clean(data.measurementUnit)}.`
        : "Enter baseline and mastery values with the same measurement unit.",
    },
    {
      id: "context",
      label: "Context is defined",
      status: clean(data.context) ? "ready" : "review",
      detail: clean(data.context) ? "The conditions for performance are stated." : "Add the conditions in which performance is expected.",
    },
    {
      id: "supports",
      label: "Supports are stated",
      status: clean(data.supports) ? "ready" : "review",
      detail: clean(data.supports) ? "The planned supports are stated." : "Add the supports available to the student.",
    },
    measurementMethodStatus(data),
    {
      id: "objective-progression",
      label: "Objectives progress toward the annual criterion",
      status: !data.includeObjectives ? "not-included" : objectiveError ? "review" : "ready",
      detail: !data.includeObjectives
        ? "No short-term objectives were selected."
        : objectiveError ?? "Each objective progresses from the baseline to the annual criterion.",
    },
    {
      id: "objective-dates",
      label: "Dates do not exceed the annual review date",
      status: !data.includeObjectives ? "not-included" : datesStayWithinAnnualReview ? "ready" : "review",
      detail: !data.includeObjectives
        ? "No short-term objective dates were generated."
        : datesStayWithinAnnualReview
          ? "Every objective due date falls on or before the annual review date."
          : "Review the annual date and objective schedule.",
    },
  ];
}
