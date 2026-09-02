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

export type ObjectiveSchedule = "none" | "trimester" | "quarterly";

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
  /** @deprecated Prefer objectiveSchedule; kept for callers that still pass includeObjectives */
  includeObjectives?: boolean;
  objectiveSchedule: ObjectiveSchedule;
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

const COMMON_PHRASE_FIXES: Array<[RegExp, string]> = [
  [/\bothers\s+students\b/gi, "other students"],
  [/\bothers\s+peers\b/gi, "other peers"],
  [/\bothers\s+children\b/gi, "other children"],
];

/**
 * Normalize user-edited goal fragments before concatenating template stems.
 * Collapses adjacent duplicate words and applies light grammar fixes without
 * rewriting measurement criteria.
 */
export function normalizeGoalFragment(value: string): string {
  let text = clean(value).replace(/\s+/g, " ");
  if (!text) return "";

  // Collapse adjacent duplicate words (e.g. "in in", "When when")
  text = text.replace(/\b([\w'-]+)(?:\s+\1)+\b/gi, "$1");

  for (const [pattern, replacement] of COMMON_PHRASE_FIXES) {
    text = text.replace(pattern, (match) => {
      if (match[0] === match[0].toUpperCase() && match[0] !== match[0].toLowerCase()) {
        return replacement.charAt(0).toUpperCase() + replacement.slice(1);
      }
      if (match[0] === match[0].toLowerCase()) return replacement;
      return replacement.charAt(0).toUpperCase() + replacement.slice(1);
    });
  }

  return text.trim();
}

function stripLeadingStem(value: string, stems: string[]): string {
  let text = normalizeGoalFragment(value);
  if (!text) return "";
  const alternation = stems.map((stem) => stem.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const pattern = new RegExp(`^(?:(?:${alternation})\\s+)+`, "i");
  return text.replace(pattern, "").trim();
}

/** Strip redundant "when" stems users often include in the context field. */
export function normalizeContext(value: string): string {
  return stripLeadingStem(value, ["when"]);
}

/** Strip redundant "given" stems users often include in the supports field. */
export function normalizeSupports(value: string): string {
  return stripLeadingStem(value, ["given"]);
}

function conditionClause(data: GoalWriterData): string {
  const context = normalizeContext(data.context);
  const supports = normalizeSupports(data.supports);
  const parts: string[] = [];
  if (context) parts.push(`when ${context}`);
  if (supports) parts.push(`given ${supports}`);
  return parts.join(" and ");
}

/**
 * True when the measurement unit itself encodes a multi-day rate window
 * (e.g. "instances per 10 consecutive measured days"). In that case the unit
 * must be preserved as the rate — do not collapse it into "per day" plus a
 * separate "measured across N school days" sampling sentence.
 */
export function unitEncodesMeasurementWindow(unit: string): boolean {
  return /\bper\s+\d+\s+(?:consecutive\s+)?(?:measured\s+)?(?:school\s+)?days?\b/i.test(
    normalizeGoalFragment(unit)
  );
}

export function resolveObjectiveSchedule(data: GoalWriterData): ObjectiveSchedule {
  if (data.objectiveSchedule && data.objectiveSchedule !== "none") {
    return data.objectiveSchedule;
  }
  // Backward compatibility for older callers that only set includeObjectives
  if (data.includeObjectives && (!data.objectiveSchedule || data.objectiveSchedule === "none")) {
    return "quarterly";
  }
  return data.objectiveSchedule || "none";
}

export function objectivesCount(data: GoalWriterData): number {
  const schedule = resolveObjectiveSchedule(data);
  if (schedule === "trimester") return 3;
  if (schedule === "quarterly") return 4;
  return 0;
}

export function includesObjectives(data: GoalWriterData): boolean {
  return objectivesCount(data) > 0;
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

export function calculateObjectiveTargets(data: GoalWriterData, count = objectivesCount(data)): string[] {
  const endpoints = objectiveEndpoints(data);
  if (!endpoints || count < 1) return [];
  const { baseline, mastery } = endpoints;
  if (mastery === baseline) return [];

  return Array.from({ length: count }, (_, index) => {
    const proportion = (index + 1) / count;
    return formatTarget(baseline + (mastery - baseline) * proportion);
  });
}

export function validateObjectiveTargets(
  data: GoalWriterData,
  count = objectivesCount(data)
): string | null {
  if (!includesObjectives(data) || count < 1) return null;
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

function subject(data: GoalWriterData, capitalize = true): string {
  const name = normalizeGoalFragment(data.studentName);
  if (name) {
    if (!capitalize) return name;
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
  return capitalize ? "The student" : "the student";
}

export function measurementPhrase(data: GoalWriterData, value: string): string {
  const numericValue = clean(value);
  if (data.measurementType === "percentage-opportunities") {
    return `${numericValue}% of opportunities`;
  }
  if (data.measurementType === "percentage-intervals") {
    return `${numericValue}% of intervals`;
  }

  const unit = normalizeGoalFragment(data.measurementUnit);
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
  const settings = data.generalizationSettings.map(normalizeGoalFragment).filter(Boolean);
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
  const title = normalizeGoalFragment(data.behaviorTitle) || "the target behavior";
  const methods = normalizeGoalFragment(data.baselineMethods) || normalizeGoalFragment(data.dataMethod);
  const unit = normalizeGoalFragment(data.measurementUnit);
  const parts: string[] = [];

  const verb = data.direction === "decrease" ? "engages in" : "demonstrates";
  parts.push(
    `${student} currently ${verb} ${title} at ${measurementPhrase(data, data.baselineValue)}.`
  );

  // Preserve per-N-day rate units. Do not rewrite "per 10 consecutive measured days"
  // into "per day" + "measured across 10 school days".
  if (clean(data.baselineDays) && !unitEncodesMeasurementWindow(unit)) {
    parts.push(`This baseline was measured across ${clean(data.baselineDays)} school days.`);
  }

  if (methods) parts.push(`Baseline data were collected using ${methods}.`);
  return parts.join(" ");
}

export function buildAnnualGoal(data: GoalWriterData): string {
  const dueDate = formatUsDate(data.annualGoalDate);
  const student = subject(data, false);
  const studentStart = subject(data, true);
  const definition = normalizeGoalFragment(data.behaviorDefinition);
  const behavior = normalizeGoalFragment(data.behaviorTitle);
  const targetPhrase = measurementPhrase(data, data.masteryValue);
  const condition = conditionClause(data);
  const fluency = data.fluencyEnabled && clean(data.fluencySeconds)
    ? `, initiating within ${clean(data.fluencySeconds)} seconds`
    : "";
  const generalization = generalizationPhrase(data);
  const maintenance = clean(data.maintenanceWeeks)
    ? ` After mastery, ${studentStart} will maintain the criterion for ${clean(data.maintenanceWeeks)} weeks.`
    : "";
  const conditionPrefix = condition ? `${condition}, ` : "";

  return `By ${dueDate}, ${conditionPrefix}${student} will ${data.direction} ${behavior} (${definition}) to ${targetPhrase} ${normalizeGoalFragment(data.consistency)}${fluency}${generalization}, as measured by ${normalizeGoalFragment(data.dataMethod)}.${maintenance}`;
}

export function buildReplacementGoal(data: GoalWriterData): string {
  if (data.direction !== "decrease" || !normalizeGoalFragment(data.replacementBehavior)) return "";

  const dueDate = formatUsDate(data.annualGoalDate);
  const student = subject(data, false);
  const studentStart = subject(data, true);
  const condition = conditionClause(data);
  const fluency = data.fluencyEnabled && clean(data.fluencySeconds)
    ? `, initiating within ${clean(data.fluencySeconds)} seconds`
    : "";
  const generalization = generalizationPhrase(data);
  const maintenance = clean(data.maintenanceWeeks)
    ? ` After mastery, ${studentStart} will maintain the criterion for ${clean(data.maintenanceWeeks)} weeks.`
    : "";
  const conditionPrefix = condition ? `${condition}, ` : "";

  return `By ${dueDate}, ${conditionPrefix}${student} will ${normalizeGoalFragment(data.replacementBehavior)} in 90% of relevant opportunities for 3 consecutively measured school days${fluency}${generalization}, as measured by ${normalizeGoalFragment(data.dataMethod)}.${maintenance}`;
}

export function buildLiveDraft(data: GoalWriterData): string {
  const student = subject(data, false);
  const studentStart = subject(data, true);
  const sections: string[] = [];
  const hasBaseline = Boolean(clean(data.baselineValue));

  if (hasBaseline && normalizeGoalFragment(data.behaviorTitle)) {
    sections.push(`Baseline:\n${buildBaseline(data)}`);
  }

  if (!normalizeGoalFragment(data.behaviorTitle)) {
    return "Your draft will appear here as you enter the student-specific information.";
  }

  let goal = clean(data.annualGoalDate) ? `By ${formatUsDate(data.annualGoalDate)}, ` : "";
  const condition = conditionClause(data);
  if (condition) goal += `${condition}, `;
  // Capitalize subject when it starts the draft sentence (no date/condition yet)
  const goalSubject = goal ? student : studentStart;
  goal += `${goalSubject} will ${data.direction} ${normalizeGoalFragment(data.behaviorTitle)}`;
  if (normalizeGoalFragment(data.behaviorDefinition)) {
    goal += ` (${normalizeGoalFragment(data.behaviorDefinition)})`;
  }
  if (clean(data.masteryValue)) {
    goal += ` to ${measurementPhrase(data, data.masteryValue)}`;
    if (clean(data.consistency)) goal += ` ${normalizeGoalFragment(data.consistency)}`;
    if (data.fluencyEnabled && clean(data.fluencySeconds)) {
      goal += `, initiating within ${clean(data.fluencySeconds)} seconds`;
    }
    goal += generalizationPhrase(data);
    if (normalizeGoalFragment(data.dataMethod)) {
      goal += `, as measured by ${normalizeGoalFragment(data.dataMethod)}`;
    }
  }
  goal += ".";
  if (clean(data.masteryValue) && clean(data.maintenanceWeeks)) {
    goal += ` After mastery, ${studentStart} will maintain the criterion for ${clean(data.maintenanceWeeks)} weeks.`;
  }
  sections.push(`Annual Goal:\n${goal}`);

  if (data.direction === "decrease" && normalizeGoalFragment(data.replacementBehavior)) {
    let replacement = clean(data.annualGoalDate) ? `By ${formatUsDate(data.annualGoalDate)}, ` : "";
    if (condition) replacement += `${condition}, `;
    replacement += `${student} will ${normalizeGoalFragment(data.replacementBehavior)} in 90% of relevant opportunities for 3 consecutively measured school days`;
    if (normalizeGoalFragment(data.dataMethod)) {
      replacement += `, as measured by ${normalizeGoalFragment(data.dataMethod)}`;
    }
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

/** Months between objectives: quarterly ≈ 3, trimester ≈ 4. */
export function objectiveMonthStep(count: number): number {
  if (count === 3) return 4;
  if (count === 4) return 3;
  return Math.max(1, Math.floor(12 / Math.max(count, 1)));
}

function objectiveDates(data: GoalWriterData, count: number, from: Date): Date[] {
  const annualDate = localDateFromInput(data.annualGoalDate);
  const step = objectiveMonthStep(count);
  return Array.from({ length: count }, (_, index) => {
    const proposedDate = addMonths(from, (index + 1) * step);
    return annualDate && proposedDate > annualDate ? annualDate : proposedDate;
  });
}

export function buildObjectives(
  data: GoalWriterData,
  count = objectivesCount(data),
  from = new Date()
): string[] {
  if (count < 1) return [];

  const student = subject(data, false);
  const condition = conditionClause(data);
  const conditionPrefix = condition ? `${condition}, ` : "";
  const behavior = normalizeGoalFragment(data.behaviorTitle);
  const definition = normalizeGoalFragment(data.behaviorDefinition);
  const method = normalizeGoalFragment(data.dataMethod);
  const calculatedTargets = calculateObjectiveTargets(data, count);
  const targets = data.objectiveTargets.length === count
    ? data.objectiveTargets
    : calculatedTargets;
  const dueDates = objectiveDates(data, count, from);

  return Array.from({ length: count }, (_, index) => {
    const dueDate = formatUsDate(toDateInputValue(dueDates[index]));
    const target = targets[index] ?? "";
    const objectiveConsistency = index === count - 1
      ? normalizeGoalFragment(data.consistency)
      : "for 3 consecutively measured school days";

    return `Objective ${index + 1} (due ${dueDate}): By ${dueDate}, ${conditionPrefix}${student} will ${data.direction} ${behavior} (${definition}) to ${measurementPhrase(data, target)} ${objectiveConsistency}, as measured by ${method}.`;
  });
}

export function buildOutput(data: GoalWriterData, from = new Date()): string {
  const sections = [
    `Baseline:\n${buildBaseline(data)}`,
    `Annual Goal:\n${buildAnnualGoal(data)}`,
  ];

  const replacementGoal = buildReplacementGoal(data);
  if (replacementGoal) sections.push(`Replacement Behavior Goal:\n${replacementGoal}`);

  const count = objectivesCount(data);
  if (count > 0) {
    const schedule = resolveObjectiveSchedule(data);
    const heading = schedule === "trimester"
      ? "Short-Term Objectives (Trimester)"
      : schedule === "quarterly"
        ? "Short-Term Objectives (Quarterly)"
        : "Short-Term Objectives";
    sections.push(`${heading}:\n${buildObjectives(data, count, from).join("\n\n")}`);
  }

  return sections.join("\n\n");
}

function measurementMethodStatus(data: GoalWriterData): GoalQualityCheck {
  const method = normalizeGoalFragment(data.dataMethod).toLowerCase();
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
  const hasObservableBehavior = Boolean(
    normalizeGoalFragment(data.behaviorTitle) && normalizeGoalFragment(data.behaviorDefinition)
  );
  const percentages = data.measurementType.startsWith("percentage");
  const hasMatchingUnits = Boolean(
    clean(data.baselineValue) &&
    clean(data.masteryValue) &&
    (percentages || normalizeGoalFragment(data.measurementUnit))
  );
  const objectiveError = validateObjectiveTargets(data);
  const count = objectivesCount(data);
  const annualDate = localDateFromInput(data.annualGoalDate);
  const datesStayWithinAnnualReview = Boolean(
    count === 0 ||
    (annualDate && objectiveDates(data, count, from).every((date) => date <= annualDate))
  );
  const hasObjectives = includesObjectives(data);

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
        ? `Both criteria use ${percentages ? (data.measurementType === "percentage-opportunities" ? "percentage of opportunities" : "percentage of intervals") : normalizeGoalFragment(data.measurementUnit)}.`
        : "Enter baseline and mastery values with the same measurement unit.",
    },
    {
      id: "context",
      label: "Context is defined",
      status: normalizeContext(data.context) ? "ready" : "review",
      detail: normalizeContext(data.context) ? "The conditions for performance are stated." : "Add the conditions in which performance is expected.",
    },
    {
      id: "supports",
      label: "Supports are stated",
      status: normalizeSupports(data.supports) ? "ready" : "review",
      detail: normalizeSupports(data.supports) ? "The planned supports are stated." : "Add the supports available to the student.",
    },
    measurementMethodStatus(data),
    {
      id: "objective-progression",
      label: "Objectives progress toward the annual criterion",
      status: !hasObjectives ? "not-included" : objectiveError ? "review" : "ready",
      detail: !hasObjectives
        ? "No short-term objectives were selected."
        : objectiveError ?? "Each objective progresses from the baseline to the annual criterion.",
    },
    {
      id: "objective-dates",
      label: "Dates do not exceed the annual review date",
      status: !hasObjectives ? "not-included" : datesStayWithinAnnualReview ? "ready" : "review",
      detail: !hasObjectives
        ? "No short-term objective dates were generated."
        : datesStayWithinAnnualReview
          ? "Every objective due date falls on or before the annual review date."
          : "Review the annual date and objective schedule.",
    },
  ];
}
