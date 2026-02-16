// src/lib/iep-generator.ts
// Ported from behavior-goal-writer repo

export interface GoalData {
  studentName?: string;
  behaviorTitle: string;
  behaviorDefinition: string;
  direction: "increase" | "decrease";
  baselineAvg: string;
  baselineMaxConsec?: string;
  baselineLatency?: string;
  baselineGeneralization?: string;
  baselineMethods?: string;
  context: string;
  supports: string;
  dataMethod: string;
  goalLevel?: string;
  latencySeconds?: string;
  fluencyNotes?: string;
  settingsCount?: string;
  maintenance?: string;
}

export function pad2(n: number) { return n.toString().padStart(2, "0"); }

export function formatDateMMDDYY(date: Date) {
  const mm = pad2(date.getMonth() + 1);
  const dd = pad2(date.getDate());
  const yy = date.getFullYear().toString().slice(-2);
  return `${mm}/${dd}/${yy}`;
}

export function oneYearMinusOneDay(from = new Date()) {
  const d = new Date(from.getTime());
  d.setFullYear(d.getFullYear() + 1);
  d.setDate(d.getDate() - 1);
  return d;
}

export function clean(text?: string | number) {
  return (text || "").toString().trim();
}

export function measurementDefaults(direction: string) {
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

export function buildBaseline(d: GoalData) {
  const avg = clean(d.baselineAvg);
  const maxConsec = clean(d.baselineMaxConsec);
  const lat = clean(d.baselineLatency);
  const gen = clean(d.baselineGeneralization);
  const methods = clean(d.baselineMethods || d.dataMethod);
  const title = clean(d.behaviorTitle);
  const name = clean(d.studentName);
  const subjStart = name || "The student";
  const subj = name || "the student";

  const parts = [];
  if (avg) parts.push(`${subjStart} currently engages in ${title} an average of ${avg}.`);
  if (maxConsec) parts.push(`${subjStart} has demonstrated up to ${maxConsec} consecutive school days with zero instances related to the target behavior within recent weeks.`);
  if (lat) parts.push(`In structured settings, ${subj} initiates the replacement/desired behavior within ${lat} seconds following adult prompting.`);
  if (gen) parts.push(`Generalization is ${gen} and will continue to be monitored.`);
  if (methods) parts.push(`Baseline data measured via ${methods}.`);

  return parts.join(" ");
}

export function buildAnnualGoal(d: GoalData, opts: { accuracy?: string, consistency?: string } = {}) {
  const dueDate = formatDateMMDDYY(oneYearMinusOneDay(new Date()));
  const name = clean(d.studentName);
  const subj = name || "the student";
  const context = clean(d.context);
  const supports = clean(d.supports);
  const direction = clean(d.direction);
  const title = clean(d.behaviorTitle);
  const definition = clean(d.behaviorDefinition);
  const { accuracy, consistency } = opts.accuracy && opts.consistency
    ? opts
    : measurementDefaults(direction);
  const dataMethod = clean(d.dataMethod);
  const level = parseInt(d.goalLevel || "5", 10);

  const pieces = [];
  pieces.push(`By ${dueDate}, when ${context} and given ${supports}, ${subj} will ${direction} ${title} (${definition})`);
  if (d.baselineAvg) pieces.push(`from a baseline of ${clean(d.baselineAvg)}`);

  if (level >= 3) {
    const lat = clean(d.latencySeconds);
    const fluency = clean(d.fluencyNotes);
    if (lat) pieces.push(`initiating the behavior within ${lat} seconds of instruction`);
    if (fluency) pieces.push(fluency);
  }
  if (level >= 4) {
    const n = clean(d.settingsCount);
    if (n) pieces.push(`across ${n} different school settings`);
  }

  pieces.push(`${accuracy}, ${consistency}, as measured by ${dataMethod}.`);

  if (level >= 5) {
    const maint = clean(d.maintenance);
    if (maint) pieces.push(maint.endsWith(".") ? maint : maint + ".");
  }

  return pieces.join(", ");
}

export function evenSpacedDates(n: number) {
  const today = new Date();
  const end = oneYearMinusOneDay(today);
  const totalMs = end.getTime() - today.getTime();
  const dates = [];
  for (let i = 1; i <= n; i++) {
    const t = today.getTime() + Math.round((i * totalMs) / (n + 1));
    dates.push(formatDateMMDDYY(new Date(t)));
  }
  return dates;
}

export function buildObjectives(d: GoalData, count: number) {
  const direction = d.direction;
  const name = clean(d.studentName);
  const subj = name || "the student";
  const context = clean(d.context);
  const supports = clean(d.supports);
  const title = clean(d.behaviorTitle);
  const definition = clean(d.behaviorDefinition);
  const dataMethod = clean(d.dataMethod);
  const baseline = clean(d.baselineAvg);
  const lat = clean(d.latencySeconds);
  const fluency = clean(d.fluencyNotes);
  const settings = clean(d.settingsCount);
  const maintenance = clean(d.maintenance || "then maintain for 2 weeks in 2 settings");

  const dueDates = evenSpacedDates(count);
  const objs: string[] = [];

  if (direction === "increase") {
    const targets = ["60% of opportunities", "75% of opportunities", "85% of opportunities", "90% of opportunities"];
    const steps = targets.slice(0, count);
    steps.forEach((t, idx) => {
      const due = dueDates[idx];
      const criteria = `${t} for 3 consecutively measured school days`;
      const parts = [];
      parts.push(`Objective ${idx + 1} – due ${due}: By ${due}, when ${context} and given ${supports}, ${subj} will increase ${title} (${definition}) from a baseline of ${baseline}`);
      if (lat) parts.push(`initiating within ${lat} seconds`);
      if (fluency) parts.push(fluency);
      if (settings) parts.push(`across ${settings} settings`);
      parts.push(`${criteria}, as measured by ${dataMethod}, ${maintenance}.`);
      objs.push(parts.join(", "));
    });
  } else {
    const stepsPool = [
      "≤3 instances per day for 3 consecutively measured school days",
      "≤1 instance per day for 3 consecutively measured school days",
      "0 instances per day for 5 consecutively measured school days",
    ];
    const steps = stepsPool.slice(0, count);
    steps.forEach((criteria, idx) => {
      const due = dueDates[idx];
      const parts = [];
      parts.push(`Objective ${idx + 1} – due ${due}: By ${due}, when ${context} and given ${supports}, ${subj} will decrease ${title} (${definition}) from a baseline of ${baseline}`);
      parts.push(`initiating a replacement behavior within ${lat || "10"} seconds`);
      if (settings) parts.push(`across ${settings} settings`);
      parts.push(`${criteria}, as measured by ${dataMethod}, ${maintenance}.`);
      objs.push(parts.join(", "));
    });
  }

  return objs;
}
