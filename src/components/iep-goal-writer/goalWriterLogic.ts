export type BehaviorDirection = "increase" | "decrease";

export interface GoalWriterData {
  annualGoalDate: string;
  studentName: string;
  direction: BehaviorDirection;
  behaviorTitle: string;
  behaviorDefinition: string;
  replacementBehavior: string;
  baselineFrequency: string;
  baselineUnit: string;
  baselinePercent: string;
  baselineDays: string;
  baselineMethods: string;
  context: string;
  supports: string;
  dataMethod: string;
  accuracy: string;
  consistency: string;
  fluencyEnabled: boolean;
  fluencySeconds: string;
  generalizationSettings: string[];
  maintenanceWeeks: string;
  includeObjectives: boolean;
}

export function measurementDefaults(direction: BehaviorDirection) {
  if (direction === "decrease") {
    return {
      accuracy: "0 instances per day",
      consistency: "for 5 consecutively measured school days",
    };
  }

  return {
    accuracy: "in 90% of opportunities",
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

function subject(data: GoalWriterData): string {
  return clean(data.studentName) || "The student";
}

export function buildBaseline(data: GoalWriterData): string {
  const student = subject(data);
  const title = clean(data.behaviorTitle) || "the target behavior";
  const methods = clean(data.baselineMethods) || clean(data.dataMethod);
  const parts: string[] = [];

  if (data.direction === "decrease") {
    parts.push(
      `${student} currently engages in ${title} at an average of ${clean(data.baselineFrequency)} ${clean(data.baselineUnit)}.`
    );
  } else {
    parts.push(
      `${student} currently demonstrates ${title} in ${clean(data.baselinePercent)}% of opportunities.`
    );
    if (clean(data.baselineDays)) {
      parts.push(`This baseline was measured across ${clean(data.baselineDays)} school days.`);
    }
  }

  if (methods) parts.push(`Baseline data were collected using ${methods}.`);
  return parts.join(" ");
}

export function buildAnnualGoal(data: GoalWriterData): string {
  const dueDate = formatUsDate(data.annualGoalDate);
  const student = subject(data);
  const definition = clean(data.behaviorDefinition);
  const behavior = clean(data.behaviorTitle);
  const target = clean(data.accuracy);
  const targetPhrase = data.direction === "decrease" ? `to ${target}` : target;
  const fluency = data.fluencyEnabled && clean(data.fluencySeconds)
    ? `, initiating within ${clean(data.fluencySeconds)} seconds`
    : "";
  const settings = data.generalizationSettings.length
    ? ` across ${data.generalizationSettings.length} settings (${data.generalizationSettings.join(", ")})`
    : "";
  const maintenance = clean(data.maintenanceWeeks)
    ? ` After mastery, ${student} will maintain the criterion for ${clean(data.maintenanceWeeks)} weeks.`
    : "";

  return `By ${dueDate}, when ${clean(data.context)} and given ${clean(data.supports)}, ${student} will ${data.direction} ${behavior} (${definition}) ${targetPhrase}, ${clean(data.consistency)}${fluency}${settings}, as measured by ${clean(data.dataMethod)}.${maintenance}`;
}

export function buildReplacementGoal(data: GoalWriterData): string {
  if (data.direction !== "decrease" || !clean(data.replacementBehavior)) return "";

  const dueDate = formatUsDate(data.annualGoalDate);
  const student = subject(data);
  const fluency = data.fluencyEnabled && clean(data.fluencySeconds)
    ? `, initiating within ${clean(data.fluencySeconds)} seconds`
    : "";
  const settings = data.generalizationSettings.length
    ? ` across ${data.generalizationSettings.length} settings (${data.generalizationSettings.join(", ")})`
    : "";
  const maintenance = clean(data.maintenanceWeeks)
    ? ` After mastery, ${student} will maintain the criterion for ${clean(data.maintenanceWeeks)} weeks.`
    : "";

  return `By ${dueDate}, when ${clean(data.context)} and given ${clean(data.supports)}, ${student} will ${clean(data.replacementBehavior)} in 90% of relevant opportunities for 3 consecutively measured school days${fluency}${settings}, as measured by ${clean(data.dataMethod)}.${maintenance}`;
}

export function buildLiveDraft(data: GoalWriterData): string {
  const student = subject(data);
  const sections: string[] = [];
  const hasBaseline = data.direction === "decrease"
    ? Boolean(clean(data.baselineFrequency))
    : Boolean(clean(data.baselinePercent));

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
  if (clean(data.accuracy)) goal += data.direction === "decrease"
    ? ` to ${clean(data.accuracy)}`
    : ` ${clean(data.accuracy)}`;
  if (clean(data.consistency)) goal += `, ${clean(data.consistency)}`;
  if (data.fluencyEnabled && clean(data.fluencySeconds)) {
    goal += `, initiating within ${clean(data.fluencySeconds)} seconds`;
  }
  if (data.generalizationSettings.length) {
    goal += ` across ${data.generalizationSettings.length} settings (${data.generalizationSettings.join(", ")})`;
  }
  if (clean(data.dataMethod)) goal += `, as measured by ${clean(data.dataMethod)}`;
  goal += ".";
  if (clean(data.maintenanceWeeks)) {
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
  const increasingTargets = [60, 70, 80, 90];
  const decreasingTargets = [5, 3, 1, 0];
  const annualDate = localDateFromInput(data.annualGoalDate);

  return Array.from({ length: count }, (_, index) => {
    const proposedDate = addMonths(from, (index + 1) * 3);
    const objectiveDate = annualDate && proposedDate > annualDate ? annualDate : proposedDate;
    const dueDate = formatUsDate(toDateInputValue(objectiveDate));

    if (data.direction === "increase") {
      const target = increasingTargets[Math.min(index, increasingTargets.length - 1)];
      return `Objective ${index + 1} (due ${dueDate}): By ${dueDate}, when ${context} and given ${supports}, ${student} will increase ${behavior} (${definition}) in ${target}% of opportunities for 3 consecutively measured school days, as measured by ${method}.`;
    }

    const target = decreasingTargets[Math.min(index, decreasingTargets.length - 1)];
    const consistency = target === 0 ? 5 : 3;
    const noun = target === 1 ? "instance" : "instances";
    return `Objective ${index + 1} (due ${dueDate}): By ${dueDate}, when ${context} and given ${supports}, ${student} will decrease ${behavior} (${definition}) to ${target} ${noun} per day for ${consistency} consecutively measured school days, as measured by ${method}.`;
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
