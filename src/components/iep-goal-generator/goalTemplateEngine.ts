// ============================================================
// IEP Goal Generator — Template Engine (NO AI API calls)
// ============================================================

export type GoalMode = "reduction" | "skill";

export interface GoalInputs {
  mode: GoalMode;
  // Student info
  gradeLevel: string;
  ageRange: string;
  // Behavior
  currentBehavior: string;
  behaviorCategory: string;
  // Baseline
  baselineFrequency: string;
  baselineDuration: string;
  baselineIntensity: string;
  // Target
  targetBehavior: string;
  replacementBehavior: string;
  // Measurement
  measurementMethod: string;
  // Mastery
  masteryCriteria: string;
  masteryConsecutive: string;
  // Timeline
  timelineWeeks: number;
  // Setting
  settings: string[];
  additionalContext: string;
}

export interface GeneratedGoal {
  annualGoal: string;
  shortTermObjectives: string[];
  dataCollectionMethods: string[];
  progressMonitoringSchedule: string;
  baselineStatement: string;
  conditionStatement: string;
  behaviorStatement: string;
  criteriaStatement: string;
}

// ---------- Data ----------

export const behaviorCategories: Record<GoalMode, { value: string; label: string; emoji: string }[]> = {
  reduction: [
    { value: "aggression", label: "Physical Aggression", emoji: "⚠️" },
    { value: "verbal-aggression", label: "Verbal Aggression", emoji: "🗣️" },
    { value: "elopement", label: "Elopement / Running Away", emoji: "🏃" },
    { value: "self-injury", label: "Self-Injurious Behavior", emoji: "🩹" },
    { value: "task-refusal", label: "Task Refusal / Non-Compliance", emoji: "🚫" },
    { value: "disruption", label: "Classroom Disruption", emoji: "📢" },
    { value: "property-destruction", label: "Property Destruction", emoji: "💥" },
    { value: "tantrum", label: "Tantrums / Emotional Outbursts", emoji: "😤" },
    { value: "stereotypy", label: "Stereotypic Behavior", emoji: "🔄" },
    { value: "other-reduction", label: "Other Problem Behavior", emoji: "📋" },
  ],
  skill: [
    { value: "social-skills", label: "Social Skills", emoji: "🤝" },
    { value: "self-regulation", label: "Self-Regulation / Emotional Control", emoji: "🧘" },
    { value: "communication", label: "Communication Skills", emoji: "💬" },
    { value: "daily-living", label: "Daily Living / Adaptive Skills", emoji: "🏠" },
    { value: "academic-engagement", label: "Academic Engagement", emoji: "📚" },
    { value: "compliance", label: "Following Directions / Compliance", emoji: "✅" },
    { value: "coping-strategies", label: "Coping Strategies", emoji: "🌈" },
    { value: "transition-skills", label: "Transition Skills", emoji: "🔄" },
    { value: "play-skills", label: "Play / Leisure Skills", emoji: "🎮" },
    { value: "other-skill", label: "Other Skill Area", emoji: "📋" },
  ],
};

export const gradeLevels = [
  { value: "prek", label: "Pre-K (Ages 3-5)" },
  { value: "k-2", label: "K-2nd Grade (Ages 5-8)" },
  { value: "3-5", label: "3rd-5th Grade (Ages 8-11)" },
  { value: "6-8", label: "6th-8th Grade (Ages 11-14)" },
  { value: "9-12", label: "9th-12th Grade (Ages 14-18)" },
  { value: "18-22", label: "Transition (Ages 18-22)" },
];

export const measurementMethods = [
  { value: "frequency", label: "Frequency Count", description: "Number of times behavior occurs" },
  { value: "duration", label: "Duration Recording", description: "How long the behavior lasts" },
  { value: "latency", label: "Latency Recording", description: "Time from cue to behavior onset" },
  { value: "interval-partial", label: "Partial Interval Recording", description: "Did behavior occur during interval?" },
  { value: "interval-whole", label: "Whole Interval Recording", description: "Did behavior occur throughout interval?" },
  { value: "momentary-time", label: "Momentary Time Sampling", description: "Is behavior occurring at the moment?" },
  { value: "permanent-product", label: "Permanent Product", description: "Work samples and artifacts" },
  { value: "trial-based", label: "Trial-Based Data", description: "Correct/incorrect per opportunity" },
];

export const masteryCriteriaOptions = [
  { value: "80", label: "80% of opportunities" },
  { value: "85", label: "85% of opportunities" },
  { value: "90", label: "90% of opportunities" },
  { value: "95", label: "95% of opportunities" },
  { value: "3-or-fewer", label: "3 or fewer instances per day" },
  { value: "2-or-fewer", label: "2 or fewer instances per day" },
  { value: "1-or-fewer", label: "1 or fewer instances per day" },
  { value: "0", label: "0 instances per day" },
  { value: "custom", label: "Custom criteria" },
];

export const consecutiveOptions = [
  { value: "3-days", label: "3 consecutive school days" },
  { value: "5-days", label: "5 consecutive school days" },
  { value: "3-weeks", label: "3 consecutive weeks" },
  { value: "4-weeks", label: "4 consecutive weeks" },
  { value: "3-of-4", label: "3 out of 4 data collection periods" },
  { value: "4-of-5", label: "4 out of 5 data collection periods" },
];

export const settingOptions = [
  "General education classroom",
  "Special education classroom",
  "Small group instruction",
  "One-on-one instruction",
  "Lunch / cafeteria",
  "Recess / playground",
  "Transitions between activities",
  "Specials (PE, art, music)",
  "Community settings",
  "Independent work time",
  "Hallways",
  "Arrival / dismissal",
];

// ---------- Template fragments ----------

const conditionTemplates: Record<string, string> = {
  aggression: "When presented with non-preferred tasks, denied access to preferred items, or during unstructured social interactions",
  "verbal-aggression": "When experiencing frustration, conflict with peers, or denial of requests",
  elopement: "When given a directive, during transitions, or when experiencing emotional distress",
  "self-injury": "When presented with demands, during periods of low stimulation, or when experiencing emotional distress",
  "task-refusal": "When presented with academic tasks, non-preferred activities, or multi-step directions",
  disruption: "During whole-group instruction, independent work time, or transitions",
  "property-destruction": "When denied access to preferred items, during transitions, or when frustrated",
  tantrum: "When denied access to preferred items/activities, given a non-preferred directive, or during changes in routine",
  stereotypy: "During independent work, transitions, or unstructured time",
  "other-reduction": "In the identified antecedent conditions",
  "social-skills": "During structured and unstructured social activities with peers",
  "self-regulation": "When faced with frustrating tasks, unexpected changes, or emotionally activating situations",
  communication: "When needing to express wants, needs, or ideas across daily activities",
  "daily-living": "During daily routines and self-care activities",
  "academic-engagement": "During teacher-directed instruction and independent work periods",
  compliance: "When given adult-delivered instructions across settings",
  "coping-strategies": "When experiencing stress, frustration, anxiety, or sensory overload",
  "transition-skills": "When moving between activities, settings, or schedule changes",
  "play-skills": "During structured and free-play activities with peers",
  "other-skill": "In the identified target conditions",
};

const behaviorTemplatesReduction: Record<string, { target: string; replacement: string }> = {
  aggression: {
    target: "will refrain from physical aggression (defined as hitting, kicking, pushing, biting, or throwing objects at others)",
    replacement: "and will instead use a replacement behavior (e.g., requesting a break, using a calm-down strategy, or verbally expressing frustration)",
  },
  "verbal-aggression": {
    target: "will refrain from verbal aggression (defined as yelling, name-calling, threatening, or using profanity directed at others)",
    replacement: "and will instead use appropriate verbal expression (e.g., using 'I feel' statements, requesting help, or asking for space)",
  },
  elopement: {
    target: "will remain in the designated area without leaving or attempting to leave without permission",
    replacement: "and will instead use an appropriate signal to request a break or change of location",
  },
  "self-injury": {
    target: "will refrain from self-injurious behavior (as operationally defined in the BIP)",
    replacement: "and will instead engage in a functionally equivalent replacement behavior as identified by the team",
  },
  "task-refusal": {
    target: "will initiate assigned tasks within 2 minutes of the directive without refusal behaviors (defined as verbal refusal, putting head down, or pushing materials away)",
    replacement: "and will instead use appropriate strategies to request help, a break, or task modification",
  },
  disruption: {
    target: "will refrain from disruptive behavior (defined as calling out without raising hand, leaving seat without permission, making loud noises, or interfering with peers' learning)",
    replacement: "and will instead follow classroom expectations for participation and attention",
  },
  "property-destruction": {
    target: "will refrain from property destruction (defined as breaking, throwing, tearing, or damaging materials, furniture, or belongings)",
    replacement: "and will instead use appropriate coping strategies when frustrated or upset",
  },
  tantrum: {
    target: "will refrain from tantrum behavior (defined as screaming, crying for more than 2 minutes, falling to the floor, or sustained refusal to engage)",
    replacement: "and will instead use learned self-regulation strategies (e.g., deep breathing, requesting a break, using a visual calm-down sequence)",
  },
  stereotypy: {
    target: "will reduce engagement in stereotypic behavior (as operationally defined) during instructional time",
    replacement: "and will instead redirect to task-related behavior when prompted",
  },
  "other-reduction": {
    target: "will reduce the identified problem behavior (as operationally defined in the BIP)",
    replacement: "and will instead engage in the identified replacement behavior",
  },
};

const behaviorTemplatesSkill: Record<string, string> = {
  "social-skills": "will independently demonstrate age-appropriate social skills (e.g., initiating interactions, taking turns, sharing, responding to peers' bids for attention)",
  "self-regulation": "will independently use self-regulation strategies (e.g., deep breathing, identifying emotions on a feelings scale, requesting a break, using a calm-down area) to manage emotional responses",
  communication: "will functionally communicate wants, needs, and ideas using age-appropriate communication modalities",
  "daily-living": "will independently complete daily living tasks (e.g., hygiene routines, organizing materials, following a visual schedule)",
  "academic-engagement": "will demonstrate academic engagement (defined as eyes on task, materials ready, participating in instruction, completing assigned work) throughout instructional periods",
  compliance: "will follow adult-delivered instructions within 10 seconds of the initial directive, without the need for repeated prompts",
  "coping-strategies": "will independently identify and use at least 2 coping strategies from a personalized menu when experiencing elevated emotional states",
  "transition-skills": "will transition between activities/settings within 2 minutes, with no more than 1 verbal prompt, without displaying challenging behavior",
  "play-skills": "will engage in cooperative and/or parallel play with peers for age-appropriate durations, demonstrating sharing, turn-taking, and following game rules",
  "other-skill": "will demonstrate the identified target skill at criterion level",
};

// ---------- Generator ----------

function getMeasurementLabel(method: string): string {
  return measurementMethods.find(m => m.value === method)?.label || method;
}

function getCriteriaLabel(criteria: string): string {
  return masteryCriteriaOptions.find(c => c.value === criteria)?.label || criteria;
}

function getConsecutiveLabel(consecutive: string): string {
  return consecutiveOptions.find(c => c.value === consecutive)?.label || consecutive;
}

function formatDate(weeks: number): string {
  const d = new Date();
  d.setDate(d.getDate() + weeks * 7);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function listToSentence(items: string[]): string {
  if (items.length === 0) return "the designated setting";
  if (items.length === 1) return items[0].toLowerCase();
  if (items.length === 2) return `${items[0].toLowerCase()} and ${items[1].toLowerCase()}`;
  return `${items.slice(0, -1).map(i => i.toLowerCase()).join(", ")}, and ${items[items.length - 1].toLowerCase()}`;
}

function generateShortTermObjectives(inputs: GoalInputs): string[] {
  const { mode, masteryCriteria, behaviorCategory, timelineWeeks } = inputs;
  const totalWeeks = timelineWeeks;
  const interval = Math.floor(totalWeeks / 4);

  if (mode === "reduction") {
    const isCountBased = masteryCriteria.includes("fewer") || masteryCriteria === "0";
    if (isCountBased) {
      return [
        `By week ${interval}, [Student] will reduce ${inputs.currentBehavior || "the target behavior"} to no more than 75% of baseline levels, as measured by ${getMeasurementLabel(inputs.measurementMethod).toLowerCase()}.`,
        `By week ${interval * 2}, [Student] will reduce ${inputs.currentBehavior || "the target behavior"} to no more than 50% of baseline levels, with use of replacement behavior in at least 50% of opportunities.`,
        `By week ${interval * 3}, [Student] will reduce ${inputs.currentBehavior || "the target behavior"} to no more than 25% of baseline levels, with independent use of replacement behavior in at least 75% of opportunities.`,
      ];
    }
    return [
      `By week ${interval}, [Student] will demonstrate the replacement behavior in at least 40% of identified opportunities, with no more than 2 verbal prompts.`,
      `By week ${interval * 2}, [Student] will demonstrate the replacement behavior in at least 60% of identified opportunities, with no more than 1 verbal prompt.`,
      `By week ${interval * 3}, [Student] will demonstrate the replacement behavior in at least 80% of identified opportunities independently.`,
    ];
  }

  // Skill increase
  const skillLabel = inputs.targetBehavior || "the target skill";
  return [
    `By week ${interval}, given a verbal or visual prompt, [Student] will demonstrate ${skillLabel} in at least 40% of opportunities across 2 consecutive data collection periods.`,
    `By week ${interval * 2}, given a gestural prompt only, [Student] will demonstrate ${skillLabel} in at least 60% of opportunities across 3 consecutive data collection periods.`,
    `By week ${interval * 3}, [Student] will independently demonstrate ${skillLabel} in at least 80% of opportunities across 3 consecutive data collection periods.`,
  ];
}

function getDataCollectionMethods(inputs: GoalInputs): string[] {
  const methods: string[] = [];
  const method = inputs.measurementMethod;

  methods.push(`Primary: ${getMeasurementLabel(method)} — collected daily during target settings.`);

  if (method === "frequency") {
    methods.push("Use a tally counter or frequency data sheet to record each instance of the behavior.");
    methods.push("Record the total count per observation period and calculate rate (count ÷ time).");
  } else if (method === "duration") {
    methods.push("Use a stopwatch or timer to record the total duration of each episode.");
    methods.push("Calculate average duration per episode and total duration per observation period.");
  } else if (method === "latency") {
    methods.push("Start timing from the delivery of the instruction/cue to the onset of the target response.");
    methods.push("Record latency in seconds for each trial/opportunity.");
  } else if (method.includes("interval")) {
    methods.push("Divide observation into equal intervals (e.g., 10-second or 30-second intervals).");
    methods.push("Score each interval as + (behavior occurred) or - (behavior did not occur).");
    methods.push("Calculate percentage of intervals with behavior occurrence.");
  } else if (method === "momentary-time") {
    methods.push("At the end of each predetermined interval, observe and record whether the behavior is occurring at that exact moment.");
    methods.push("Calculate percentage of intervals scored as occurring.");
  } else if (method === "permanent-product") {
    methods.push("Collect work samples, task completion records, or other tangible evidence.");
    methods.push("Score using a rubric or accuracy percentage.");
  } else if (method === "trial-based") {
    methods.push("Present structured opportunities (trials) and record correct (+) or incorrect (-) responses.");
    methods.push("Calculate percentage correct per session.");
  }

  methods.push("Secondary: Anecdotal notes on antecedents and consequences to inform instruction.");
  methods.push("Graph data weekly to visualize trends and make data-based decisions.");

  return methods;
}

function getProgressMonitoringSchedule(inputs: GoalInputs): string {
  const lines: string[] = [];
  lines.push(`• Data collection: Daily during identified settings (${listToSentence(inputs.settings)})`);
  lines.push("• Data review: Weekly by the case manager / special education teacher");
  lines.push("• Team data review: Bi-weekly or monthly during team meetings");
  lines.push("• Progress reports: Quarterly, aligned with the IEP reporting schedule");
  lines.push("• Decision rules: If less than expected progress after 4-6 data points, reconvene team to adjust intervention");
  lines.push(`• Mastery criterion: ${getCriteriaLabel(inputs.masteryCriteria)} for ${getConsecutiveLabel(inputs.masteryConsecutive)}`);
  return lines.join("\n");
}

export function generateGoal(inputs: GoalInputs): GeneratedGoal {
  const { mode, behaviorCategory, settings, timelineWeeks, masteryCriteria, masteryConsecutive, measurementMethod } = inputs;
  const endDate = formatDate(timelineWeeks);
  const settingsText = listToSentence(settings);
  const criteriaText = getCriteriaLabel(masteryCriteria);
  const consecutiveText = getConsecutiveLabel(masteryConsecutive);
  const measureText = getMeasurementLabel(measurementMethod).toLowerCase();

  // Condition
  const conditionBase = conditionTemplates[behaviorCategory] || conditionTemplates[mode === "reduction" ? "other-reduction" : "other-skill"];
  const condition = inputs.additionalContext
    ? `${conditionBase}, in ${settingsText} (${inputs.additionalContext})`
    : `${conditionBase}, in ${settingsText}`;
  const conditionStatement = `By ${endDate}, ${condition}`;

  // Behavior
  let behaviorStatement: string;
  if (mode === "reduction") {
    const templates = behaviorTemplatesReduction[behaviorCategory] || behaviorTemplatesReduction["other-reduction"];
    const customTarget = inputs.currentBehavior ? `will reduce ${inputs.currentBehavior}` : templates.target;
    const customReplacement = inputs.replacementBehavior
      ? `and will instead ${inputs.replacementBehavior}`
      : templates.replacement;
    behaviorStatement = `[Student] ${inputs.currentBehavior ? customTarget : templates.target}, ${inputs.replacementBehavior ? customReplacement : templates.replacement}`;
  } else {
    const template = behaviorTemplatesSkill[behaviorCategory] || behaviorTemplatesSkill["other-skill"];
    behaviorStatement = inputs.targetBehavior
      ? `[Student] will ${inputs.targetBehavior}`
      : `[Student] ${template}`;
  }

  // Criteria
  const criteriaStatement = `achieving ${criteriaText} for ${consecutiveText}, as measured by ${measureText}`;

  // Baseline
  const baselineParts: string[] = [];
  if (inputs.baselineFrequency) baselineParts.push(`frequency: ${inputs.baselineFrequency}`);
  if (inputs.baselineDuration) baselineParts.push(`duration: ${inputs.baselineDuration}`);
  if (inputs.baselineIntensity) baselineParts.push(`intensity: ${inputs.baselineIntensity}`);
  const baselineData = baselineParts.length > 0 ? baselineParts.join("; ") : "to be determined from initial data collection";
  const baselineStatement = `Current baseline: [Student] ${mode === "reduction" ? "engages in" : "demonstrates"} ${inputs.currentBehavior || "the target behavior"} at the following levels — ${baselineData}.`;

  // Full annual goal
  const annualGoal = `${conditionStatement},\n${behaviorStatement},\n${criteriaStatement}.\n\n${baselineStatement}`;

  return {
    annualGoal,
    shortTermObjectives: generateShortTermObjectives(inputs),
    dataCollectionMethods: getDataCollectionMethods(inputs),
    progressMonitoringSchedule: getProgressMonitoringSchedule(inputs),
    baselineStatement,
    conditionStatement,
    behaviorStatement,
    criteriaStatement,
  };
}
