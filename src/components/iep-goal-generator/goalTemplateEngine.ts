// ============================================================
// IEP Goal Generator — Template Engine (NO AI API calls)
// Aligned with KCUSD Behavior Team standards:
//   - Function-based goal writing (escape, attention, tangible, automatic)
//   - Antecedent / Teaching / Consequence intervention framework
//   - Observable & measurable behavior definitions
//   - Condition → Behavior → Criteria format
// ============================================================

export type GoalMode = "reduction" | "skill";

export type BehaviorFunction = "escape" | "attention" | "tangible" | "automatic" | "unknown";

export interface GoalInputs {
  mode: GoalMode;
  // Student info
  gradeLevel: string;
  ageRange: string;
  // Behavior
  currentBehavior: string;
  behaviorCategory: string;
  // Function (critical for KCUSD-aligned goals)
  behaviorFunction: BehaviorFunction;
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
  // KCUSD-aligned additions
  suggestedInterventions: {
    antecedent: string[];
    teaching: string[];
    consequence: string[];
  };
  functionStatement: string;
}

// ---------- Data ----------

export const behaviorFunctions: { value: BehaviorFunction; label: string; emoji: string; description: string }[] = [
  { value: "escape", label: "Escape / Avoidance", emoji: "🏃", description: "Behavior occurs to get away from or avoid a task, person, or situation" },
  { value: "attention", label: "Attention", emoji: "👀", description: "Behavior occurs to gain attention from adults or peers" },
  { value: "tangible", label: "Tangible / Access", emoji: "🎁", description: "Behavior occurs to gain access to a preferred item or activity" },
  { value: "automatic", label: "Automatic / Sensory", emoji: "🔄", description: "Behavior occurs because it feels good or provides sensory input" },
  { value: "unknown", label: "Not Yet Determined", emoji: "❓", description: "Function has not been formally assessed" },
];

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
  { value: "frequency", label: "Frequency Count", description: "Number of times behavior occurs per observation period" },
  { value: "duration", label: "Duration Recording", description: "Total time the behavior lasts per episode or session" },
  { value: "latency", label: "Latency Recording", description: "Time from instruction/cue to behavior onset" },
  { value: "interval-partial", label: "Partial Interval Recording", description: "Was behavior observed at any point during interval?" },
  { value: "interval-whole", label: "Whole Interval Recording", description: "Was behavior sustained throughout the entire interval?" },
  { value: "momentary-time", label: "Momentary Time Sampling", description: "Is behavior occurring at the exact moment of observation?" },
  { value: "permanent-product", label: "Permanent Product", description: "Work samples, task completion records, or tangible artifacts" },
  { value: "trial-based", label: "Trial-Based Data", description: "Correct (+) or incorrect (−) per structured opportunity" },
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

// ---------- Function-based condition templates ----------
// Per KCUSD BIP format: condition references the antecedent context tied to function

const functionConditions: Record<BehaviorFunction, string> = {
  escape: "when presented with non-preferred tasks, demands, or activities the student finds aversive",
  attention: "during periods of low adult attention, when peers/adults are engaged with others, or when seeking social interaction",
  tangible: "when denied access to preferred items or activities, or when a preferred item/activity is removed",
  automatic: "during periods of low stimulation, unstructured time, or independently of social contingencies",
  unknown: "in the identified antecedent conditions (function to be determined through formal FBA)",
};

const conditionTemplates: Record<string, string> = {
  aggression: "when presented with non-preferred tasks, denied access to preferred items, or during unstructured social interactions",
  "verbal-aggression": "when experiencing frustration, conflict with peers, or denial of requests",
  elopement: "when given a directive, during transitions, or when experiencing emotional distress",
  "self-injury": "when presented with demands, during periods of low stimulation, or when experiencing emotional distress",
  "task-refusal": "when presented with academic tasks, non-preferred activities, or multi-step directions",
  disruption: "during whole-group instruction, independent work time, or transitions",
  "property-destruction": "when denied access to preferred items, during transitions, or when frustrated",
  tantrum: "when denied access to preferred items/activities, given a non-preferred directive, or during changes in routine",
  stereotypy: "during independent work, transitions, or unstructured time",
  "other-reduction": "in the identified antecedent conditions",
  "social-skills": "during structured and unstructured social activities with peers",
  "self-regulation": "when faced with frustrating tasks, unexpected changes, or emotionally activating situations",
  communication: "when needing to express wants, needs, or ideas across daily activities",
  "daily-living": "during daily routines and self-care activities",
  "academic-engagement": "during teacher-directed instruction and independent work periods",
  compliance: "when given adult-delivered instructions across settings",
  "coping-strategies": "when experiencing stress, frustration, anxiety, or sensory overload",
  "transition-skills": "when moving between activities, settings, or schedule changes",
  "play-skills": "during structured and free-play activities with peers",
  "other-skill": "in the identified target conditions",
};

// ---------- Function-based replacement behaviors ----------
// Per KCUSD: replacement behavior must serve the SAME function as the problem behavior

const functionReplacements: Record<BehaviorFunction, string[]> = {
  escape: [
    "request a break using a break card or verbal request",
    "ask for help when a task is too difficult",
    "request task modification (e.g., fewer problems, extended time)",
    "use a 'first-then' self-management strategy",
  ],
  attention: [
    "raise hand and wait to be called on",
    "use an appropriate verbal bid for attention (e.g., 'Excuse me')",
    "initiate peer interaction using taught social scripts",
    "request adult check-in at designated times",
  ],
  tangible: [
    "request the item/activity using appropriate communication",
    "accept 'no' or 'wait' and engage in an alternative activity",
    "use a visual timer to wait for the preferred item",
    "negotiate access using taught negotiation scripts",
  ],
  automatic: [
    "engage in a functionally equivalent alternative sensory activity",
    "request access to a sensory tool or break area",
    "use a self-monitoring checklist to redirect to task",
    "engage in scheduled sensory breaks throughout the day",
  ],
  unknown: [
    "use a functionally equivalent replacement behavior (to be identified through FBA)",
    "request a break or assistance using appropriate communication",
  ],
};

// ---------- Function-based intervention bank ----------
// Per KCUSD: interventions organized as Antecedent / Teaching / Consequence

const interventionBank: Record<BehaviorFunction, { antecedent: string[]; teaching: string[]; consequence: string[] }> = {
  escape: {
    antecedent: [
      "Adjust demand difficulty — provide easier work or scaffold tasks",
      "Decrease amount of work or break into smaller chunks",
      "Offer choice of task, sequence, materials, location, or partner",
      "Incorporate student interests/hobbies into activities",
      "Provide frequent breaks (e.g., after every 5-10 minutes of work)",
      "Use behavioral momentum — present easy requests before harder ones",
      "Increase predictability with visual schedules and transition cues",
      "Modify instructional delivery — use pleasant tone, clear directions",
      "Provide advance notice of upcoming demands or transitions",
      "Ensure tasks have clear, valued outcomes for the student",
    ],
    teaching: [
      "Teach the student to request a break (verbal, card, or device)",
      "Teach the student to ask for help when work is difficult",
      "Teach self-management / self-monitoring strategies",
      "Use Behavior Skills Training (BST): Instruction → Model → Rehearse → Feedback",
      "Teach task-initiation and task-completion routines",
      "Provide visual supports for multi-step tasks",
    ],
    consequence: [
      "Provide immediate reinforcement for task engagement and completion",
      "Honor break requests to reinforce appropriate communication",
      "Use escape extinction — gently guide student back to task after problem behavior",
      "Provide specific praise for using replacement behavior",
      "Deliver reinforcement on a schedule that is denser than the current rate of problem behavior",
    ],
  },
  attention: {
    antecedent: [
      "Provide frequent, scheduled adult attention (non-contingent reinforcement)",
      "Give attention for appropriate behavior before problem behavior occurs",
      "Assign the student a classroom role or job that provides positive attention",
      "Seat the student near the teacher or a prosocial peer",
      "Provide opportunities for positive peer interaction",
      "Use proximity and nonverbal acknowledgment throughout the day",
    ],
    teaching: [
      "Teach appropriate attention-seeking behaviors (raise hand, say 'Excuse me')",
      "Teach the student to wait for attention using a visual cue",
      "Practice social skills for initiating interactions with peers",
      "Use BST: Instruction → Model → Rehearse → Feedback",
      "Teach self-monitoring of attention-seeking behavior",
    ],
    consequence: [
      "Reinforce appropriate bids for attention immediately",
      "Minimize attention following problem behavior (planned ignoring when safe)",
      "Redirect to appropriate behavior with minimal verbal engagement",
      "Provide descriptive praise when the student uses taught replacement behavior",
      "Use a token economy to reinforce appropriate attention-seeking across the day",
    ],
  },
  tangible: {
    antecedent: [
      "Provide scheduled access to preferred items/activities",
      "Use a visual schedule showing when preferred items are available",
      "Offer choices among available items/activities",
      "Use a visual timer to show wait time",
      "Provide non-contingent access to preferred items at regular intervals",
      "Establish clear expectations for earning preferred items/activities",
    ],
    teaching: [
      "Teach the student to request items appropriately (verbal, PECS, device)",
      "Teach the student to accept 'no' or 'wait' (tolerance training)",
      "Teach delay of gratification with visual supports",
      "Practice negotiation and compromise skills",
      "Use BST: Instruction → Model → Rehearse → Feedback",
    ],
    consequence: [
      "Reinforce appropriate requesting immediately with access",
      "Do not provide the item/activity following problem behavior",
      "Provide descriptive praise for waiting appropriately",
      "Deliver access to preferred items on a dense reinforcement schedule for replacement behavior",
    ],
  },
  automatic: {
    antecedent: [
      "Provide scheduled sensory breaks throughout the day",
      "Offer access to sensory tools (fidgets, weighted items, noise-canceling headphones)",
      "Modify the environment to reduce or provide appropriate sensory input",
      "Enrich the environment to reduce periods of low stimulation",
      "Provide a designated calm-down or sensory area",
      "Schedule physical activity or movement breaks",
    ],
    teaching: [
      "Teach the student to request sensory breaks or tools",
      "Teach the student to self-monitor and identify when they need sensory input",
      "Provide replacement sensory activities that are socially appropriate",
      "Use BST: Instruction → Model → Rehearse → Feedback",
      "Teach discrimination between appropriate and inappropriate times/places for the behavior",
    ],
    consequence: [
      "Reinforce engagement in alternative sensory activities",
      "Gently redirect to replacement activity without excessive attention",
      "Use response blocking only when behavior poses safety risk (consult with team)",
      "Provide descriptive praise when the student uses appropriate sensory strategies",
    ],
  },
  unknown: {
    antecedent: [
      "Conduct a formal Functional Behavior Assessment (FBA) to identify function",
      "Increase environmental predictability with visual schedules",
      "Provide positive adult attention and check-ins throughout the day",
      "Offer choices when possible",
    ],
    teaching: [
      "Teach general replacement behaviors (requesting break, help, or preferred items)",
      "Teach self-regulation strategies",
      "Complete FBA to identify function-specific teaching strategies",
    ],
    consequence: [
      "Reinforce all instances of appropriate behavior",
      "Minimize reinforcement of problem behavior",
      "Collect ABC data to inform functional hypothesis",
    ],
  },
};

// ---------- Behavior templates ----------

const behaviorTemplatesReduction: Record<string, { target: string; replacement: string }> = {
  aggression: {
    target: "will refrain from physical aggression (operationally defined as hitting, kicking, pushing, biting, scratching, or throwing objects at others)",
    replacement: "and will instead use a functionally equivalent replacement behavior",
  },
  "verbal-aggression": {
    target: "will refrain from verbal aggression (operationally defined as yelling, name-calling, threatening, or using profanity directed at others)",
    replacement: "and will instead use appropriate verbal expression to communicate needs",
  },
  elopement: {
    target: "will remain in the designated area without leaving or attempting to leave without adult permission (operationally defined as passing the classroom threshold or designated boundary without authorization)",
    replacement: "and will instead use an appropriate signal to request a break or change of location",
  },
  "self-injury": {
    target: "will refrain from self-injurious behavior (as operationally defined in the Behavior Intervention Plan)",
    replacement: "and will instead engage in a functionally equivalent replacement behavior as identified by the IEP team",
  },
  "task-refusal": {
    target: "will initiate assigned tasks within 2 minutes of the directive without refusal behaviors (operationally defined as verbal refusal, putting head down, pushing materials away, or turning body away from task)",
    replacement: "and will instead use appropriate strategies to request help, a break, or task modification",
  },
  disruption: {
    target: "will refrain from disruptive behavior (operationally defined as calling out without raising hand, leaving seat without permission, making loud non-contextual noises, or physically interfering with peers' materials)",
    replacement: "and will instead follow classroom expectations for participation and attention",
  },
  "property-destruction": {
    target: "will refrain from property destruction (operationally defined as breaking, throwing, tearing, ripping, or intentionally damaging materials, furniture, or personal belongings)",
    replacement: "and will instead use appropriate coping strategies when frustrated or upset",
  },
  tantrum: {
    target: "will refrain from tantrum behavior (operationally defined as screaming, sustained crying exceeding 2 minutes, falling to the floor, or sustained refusal to engage lasting longer than 5 minutes)",
    replacement: "and will instead use self-regulation strategies (e.g., deep breathing, requesting a break, using a calm-down sequence)",
  },
  stereotypy: {
    target: "will reduce engagement in stereotypic behavior (as operationally defined in the BIP) during instructional time",
    replacement: "and will instead redirect to task-related behavior independently or with one prompt",
  },
  "other-reduction": {
    target: "will reduce the identified problem behavior (as operationally defined in the BIP)",
    replacement: "and will instead engage in the identified replacement behavior",
  },
};

const behaviorTemplatesSkill: Record<string, string> = {
  "social-skills": "will independently demonstrate age-appropriate social skills (e.g., initiating interactions, taking turns, sharing, responding to peers' bids for attention, maintaining topic in conversation)",
  "self-regulation": "will independently use self-regulation strategies (e.g., identifying emotions on a feelings scale, deep breathing, requesting a break, using a calm-down area) to return to a calm state and re-engage in the current activity",
  communication: "will functionally communicate wants, needs, and ideas using age-appropriate communication modalities (verbal, AAC device, picture exchange, sign language)",
  "daily-living": "will independently complete daily living tasks (e.g., hygiene routines, organizing materials, following a visual schedule, managing personal belongings)",
  "academic-engagement": "will demonstrate academic engagement (operationally defined as eyes on task/speaker, materials ready, participating in instruction when called upon, and completing assigned work) throughout instructional periods",
  compliance: "will follow adult-delivered instructions within 10 seconds of the initial directive, without the need for repeated prompts or physical guidance",
  "coping-strategies": "will independently identify and use at least 2 coping strategies from a personalized coping menu when experiencing elevated emotional states (as identified by self-report, staff observation, or physiological cues)",
  "transition-skills": "will transition between activities/settings within 2 minutes with no more than 1 verbal prompt and without displaying challenging behavior (as operationally defined)",
  "play-skills": "will engage in cooperative and/or parallel play with peers for age-appropriate durations, demonstrating sharing, turn-taking, and following game rules",
  "other-skill": "will demonstrate the identified target skill at criterion level as defined by the IEP team",
};

// ---------- Helpers ----------

function getMeasurementLabel(method: string): string {
  return measurementMethods.find(m => m.value === method)?.label || method;
}

function getCriteriaLabel(criteria: string): string {
  return masteryCriteriaOptions.find(c => c.value === criteria)?.label || criteria;
}

function getConsecutiveLabel(consecutive: string): string {
  return consecutiveOptions.find(c => c.value === consecutive)?.label || consecutive;
}

function getFunctionLabel(fn: BehaviorFunction): string {
  return behaviorFunctions.find(f => f.value === fn)?.label || fn;
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

// ---------- Short-term objectives ----------

function generateShortTermObjectives(inputs: GoalInputs): string[] {
  const { mode, masteryCriteria, timelineWeeks, behaviorFunction } = inputs;
  const interval = Math.max(4, Math.floor(timelineWeeks / 4));
  const functionContext = behaviorFunction !== "unknown"
    ? ` (function: ${getFunctionLabel(behaviorFunction).toLowerCase()})`
    : "";

  if (mode === "reduction") {
    const isCountBased = masteryCriteria.includes("fewer") || masteryCriteria === "0";
    if (isCountBased) {
      return [
        `By week ${interval}, given antecedent interventions${functionContext}, [Student] will reduce ${inputs.currentBehavior || "the target behavior"} to no more than 75% of baseline levels, as measured by ${getMeasurementLabel(inputs.measurementMethod).toLowerCase()}.`,
        `By week ${interval * 2}, [Student] will reduce ${inputs.currentBehavior || "the target behavior"} to no more than 50% of baseline levels, and will independently use the replacement behavior (${inputs.replacementBehavior || "as identified"}) in at least 50% of opportunities.`,
        `By week ${interval * 3}, [Student] will reduce ${inputs.currentBehavior || "the target behavior"} to no more than 25% of baseline levels, and will independently use the replacement behavior in at least 75% of opportunities across ${inputs.settings.length >= 2 ? inputs.settings.length + " settings" : "the designated setting"}.`,
      ];
    }
    return [
      `By week ${interval}, given direct teaching and prompting${functionContext}, [Student] will demonstrate the replacement behavior (${inputs.replacementBehavior || "as identified"}) in at least 40% of identified opportunities, with no more than 2 verbal prompts.`,
      `By week ${interval * 2}, [Student] will demonstrate the replacement behavior in at least 60% of identified opportunities, with no more than 1 verbal prompt, and problem behavior will decrease to 50% of baseline.`,
      `By week ${interval * 3}, [Student] will independently demonstrate the replacement behavior in at least 80% of identified opportunities, and problem behavior will decrease to 25% of baseline or below.`,
    ];
  }

  // Skill increase
  const skillLabel = inputs.targetBehavior || "the target skill";
  return [
    `By week ${interval}, given verbal and/or visual prompts, [Student] will demonstrate ${skillLabel} in at least 40% of opportunities across 2 consecutive data collection periods.`,
    `By week ${interval * 2}, given a gestural prompt only, [Student] will demonstrate ${skillLabel} in at least 60% of opportunities across 3 consecutive data collection periods.`,
    `By week ${interval * 3}, [Student] will independently demonstrate ${skillLabel} in at least 80% of opportunities across 3 consecutive data collection periods, in at least ${Math.min(inputs.settings.length, 2)} settings.`,
  ];
}

// ---------- Data collection methods ----------

function getDataCollectionMethods(inputs: GoalInputs): string[] {
  const methods: string[] = [];
  const method = inputs.measurementMethod;

  methods.push(`Primary data: ${getMeasurementLabel(method)} — collected daily during target settings.`);

  if (method === "frequency") {
    methods.push("Use a tally counter or frequency data sheet to record each instance of the behavior.");
    methods.push("Record the total count per observation period and calculate rate (count ÷ time observed).");
  } else if (method === "duration") {
    methods.push("Use a stopwatch or timer to record the total duration of each episode.");
    methods.push("Calculate average duration per episode and total duration per observation period.");
  } else if (method === "latency") {
    methods.push("Start timing from the delivery of the instruction/cue to the onset of the target response.");
    methods.push("Record latency in seconds for each trial/opportunity.");
  } else if (method.includes("interval")) {
    methods.push("Divide observation into equal intervals (e.g., 10-second or 30-second intervals).");
    methods.push("Score each interval as + (behavior occurred) or − (behavior did not occur).");
    methods.push("Calculate percentage of intervals with behavior occurrence.");
  } else if (method === "momentary-time") {
    methods.push("At the end of each predetermined interval, observe and record whether the behavior is occurring at that exact moment.");
    methods.push("Calculate percentage of intervals scored as occurring.");
  } else if (method === "permanent-product") {
    methods.push("Collect work samples, task completion records, or other tangible evidence of behavior.");
    methods.push("Score using a rubric or accuracy percentage.");
  } else if (method === "trial-based") {
    methods.push("Present structured opportunities (trials) and record correct (+) or incorrect (−) responses.");
    methods.push("Calculate percentage correct per session.");
  }

  methods.push("Secondary data: ABC (Antecedent-Behavior-Consequence) anecdotal notes to monitor function and inform intervention adjustments.");
  methods.push("Graph data weekly to visualize trends and support data-based decision making.");

  if (inputs.mode === "reduction") {
    methods.push("Track both problem behavior AND replacement behavior to monitor the balance between reduction and skill acquisition.");
  }

  return methods;
}

// ---------- Progress monitoring ----------

function getProgressMonitoringSchedule(inputs: GoalInputs): string {
  const lines: string[] = [];
  lines.push(`• Data collection: Daily during identified settings (${listToSentence(inputs.settings)})`);
  lines.push("• Data review: Weekly by the case manager / special education teacher");
  lines.push("• Team data review: Bi-weekly or monthly during team meetings");
  lines.push("• Progress reports: Quarterly, aligned with the IEP reporting schedule");
  lines.push("• Decision rules: If less than expected progress after 4–6 data points, reconvene team to review function, adjust antecedent interventions, modify teaching strategies, or revise consequence procedures");
  lines.push(`• Mastery criterion: ${getCriteriaLabel(inputs.masteryCriteria)} for ${getConsecutiveLabel(inputs.masteryConsecutive)}`);
  if (inputs.mode === "reduction") {
    lines.push("• Fading plan: Once mastery is met, fade reinforcement schedule and antecedent supports systematically while monitoring for regression");
  }
  return lines.join("\n");
}

// ---------- Suggested interventions based on function ----------

function getSuggestedInterventions(inputs: GoalInputs): { antecedent: string[]; teaching: string[]; consequence: string[] } {
  const fn = inputs.behaviorFunction;
  const bank = interventionBank[fn] || interventionBank.unknown;

  // Return top 4–5 from each category
  return {
    antecedent: bank.antecedent.slice(0, 5),
    teaching: bank.teaching.slice(0, 4),
    consequence: bank.consequence.slice(0, 4),
  };
}

// ---------- Main generator ----------

export function generateGoal(inputs: GoalInputs): GeneratedGoal {
  const { mode, behaviorCategory, behaviorFunction, settings, timelineWeeks, masteryCriteria, masteryConsecutive, measurementMethod } = inputs;
  const endDate = formatDate(timelineWeeks);
  const settingsText = listToSentence(settings);
  const criteriaText = getCriteriaLabel(masteryCriteria);
  const consecutiveText = getConsecutiveLabel(masteryConsecutive);
  const measureText = getMeasurementLabel(measurementMethod).toLowerCase();

  // Function statement (KCUSD standard)
  const functionStatement = behaviorFunction !== "unknown"
    ? `Hypothesized function: The behavior is maintained by ${getFunctionLabel(behaviorFunction).toLowerCase()}. Interventions and replacement behaviors are designed to address this function.`
    : "Hypothesized function: Not yet determined. A formal Functional Behavior Assessment (FBA) is recommended to identify the maintaining function.";

  // Condition — prefer function-based condition, fall back to category
  const conditionBase = behaviorFunction !== "unknown"
    ? functionConditions[behaviorFunction]
    : (conditionTemplates[behaviorCategory] || conditionTemplates[mode === "reduction" ? "other-reduction" : "other-skill"]);

  const condition = inputs.additionalContext
    ? `${conditionBase}, in ${settingsText} (${inputs.additionalContext})`
    : `${conditionBase}, in ${settingsText}`;
  const conditionStatement = `By ${endDate}, ${condition}`;

  // Behavior statement
  let behaviorStatement: string;
  if (mode === "reduction") {
    const templates = behaviorTemplatesReduction[behaviorCategory] || behaviorTemplatesReduction["other-reduction"];
    const customTarget = inputs.currentBehavior
      ? `will reduce ${inputs.currentBehavior} (as operationally defined)`
      : templates.target;
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

  // Baseline (KCUSD format: separate problem behavior baseline and replacement behavior baseline)
  const baselineParts: string[] = [];
  if (inputs.baselineFrequency) baselineParts.push(`frequency: ${inputs.baselineFrequency}`);
  if (inputs.baselineDuration) baselineParts.push(`duration: ${inputs.baselineDuration}`);
  if (inputs.baselineIntensity) baselineParts.push(`intensity: ${inputs.baselineIntensity}`);
  const baselineData = baselineParts.length > 0 ? baselineParts.join("; ") : "to be determined from initial data collection";

  let baselineStatement: string;
  if (mode === "reduction") {
    baselineStatement = `Baseline for Problem Behavior: [Student] currently engages in ${inputs.currentBehavior || "the target behavior"} at the following levels — ${baselineData}.\n\nBaseline for Replacement Behavior: [Student] currently ${inputs.replacementBehavior ? `demonstrates the replacement behavior (${inputs.replacementBehavior})` : "demonstrates the replacement behavior"} at a rate to be determined from initial data collection.`;
  } else {
    baselineStatement = `Current baseline: [Student] currently demonstrates ${inputs.currentBehavior || "the target skill"} at the following levels — ${baselineData}.`;
  }

  // Full annual goal
  const functionLine = behaviorFunction !== "unknown" ? `\n\n${functionStatement}` : "";
  const annualGoal = `${conditionStatement},\n${behaviorStatement},\n${criteriaStatement}.${functionLine}\n\n${baselineStatement}`;

  return {
    annualGoal,
    shortTermObjectives: generateShortTermObjectives(inputs),
    dataCollectionMethods: getDataCollectionMethods(inputs),
    progressMonitoringSchedule: getProgressMonitoringSchedule(inputs),
    baselineStatement,
    conditionStatement,
    behaviorStatement,
    criteriaStatement,
    suggestedInterventions: getSuggestedInterventions(inputs),
    functionStatement,
  };
}
