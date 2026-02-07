// Rules-based BIP generator — no AI API calls needed

export interface FBAData {
  // Step 1: Student Info
  studentName: string;
  studentAge: string;
  studentGrade: string;
  school: string;
  dateOfFBA: string;
  teamMembers: string;

  // Step 2: Target Behaviors
  targetBehaviors: Array<{
    name: string;
    operationalDefinition: string;
    frequency: string;
    duration: string;
    intensity: "low" | "moderate" | "high";
  }>;

  // Step 3: Antecedents & Setting Events
  antecedents: string[];
  customAntecedents: string;
  settingEvents: string[];
  customSettingEvents: string;

  // Step 4: Consequences
  consequences: string[];
  customConsequences: string;

  // Step 5: Function of Behavior
  functions: Array<"attention" | "escape" | "tangible" | "sensory">;
  functionNotes: string;

  // Step 6: Replacement Behaviors
  replacementBehaviors: Array<{
    behavior: string;
    rationale: string;
  }>;

  // Step 7: Additional Context
  studentStrengths: string;
  preferredActivities: string;
  communicationLevel: string;
  previousInterventions: string;
  safetyConcerrns: boolean;
  safetyConcernDetails: string;
}

export interface GeneratedBIP {
  studentInfo: {
    name: string;
    age: string;
    grade: string;
    school: string;
    dateOfFBA: string;
    dateOfBIP: string;
    teamMembers: string;
  };
  behaviorDefinitions: Array<{
    name: string;
    definition: string;
    frequency: string;
    duration: string;
    intensity: string;
  }>;
  functionSummary: string;
  antecedentStrategies: string[];
  teachingStrategies: string[];
  reinforcementStrategies: string[];
  responseStrategies: string[];
  dataCollectionPlan: string[];
  crisisPlan: string[] | null;
  generalizationPlan: string[];
  maintenancePlan: string[];
}

const ANTECEDENT_STRATEGY_MAP: Record<string, string[]> = {
  "Difficult or non-preferred tasks": [
    "Provide task choices when possible (e.g., choose between two assignments)",
    "Break tasks into smaller, manageable steps with visual checklists",
    "Pre-teach or preview challenging material before independent work",
    "Offer a brief break card before presenting demanding tasks",
    "Embed high-interest topics into non-preferred assignments",
  ],
  "Transitions between activities": [
    "Provide 5-minute and 2-minute warnings before transitions",
    "Use a visual schedule or timer so transitions are predictable",
    "Teach and rehearse transition routines during calm periods",
    "Assign a transition buddy or peer model",
    "Provide a preferred transition activity (e.g., carrying materials, leading the line)",
  ],
  "Unstructured time (recess, lunch)": [
    "Provide structured activity choices during unstructured time",
    "Pre-teach social expectations with visual cue cards",
    "Assign a peer buddy during lunch or recess",
    "Offer a quiet alternative space if sensory needs are high",
    "Check in with student before and after unstructured periods",
  ],
  "Changes in routine": [
    "Preview schedule changes with a visual first-then board",
    "Provide advance notice of changes whenever possible",
    "Use a social narrative describing what will happen differently",
    "Offer a comfort item or calming strategy during unexpected changes",
  ],
  "Large group instruction": [
    "Seat student near the teacher and away from distractions",
    "Use frequent engagement strategies (e.g., choral response, partner turn-and-talk)",
    "Provide a fidget tool or movement break during long instruction",
    "Chunk instruction with embedded response opportunities every 3-5 minutes",
  ],
  "Peer interactions / conflict": [
    "Pre-teach social skills during structured lessons",
    "Use role-play and video modeling for common conflict scenarios",
    "Provide a cool-down area the student can access independently",
    "Assign cooperative learning roles with clear expectations",
  ],
  "When told 'no' or given a directive": [
    "Offer choices within directives (e.g., 'Do you want to start with reading or math?')",
    "Use first-then language paired with a visual board",
    "Provide empathetic acknowledgement before restating the expectation",
    "Pre-teach expected responses to being told 'no' using social narratives",
  ],
  "When attention is directed elsewhere": [
    "Schedule regular positive check-ins throughout the day (every 15-20 min)",
    "Use nonverbal signals to acknowledge the student during group instruction",
    "Assign classroom jobs that provide natural opportunities for adult attention",
    "Teach the student appropriate attention-seeking strategies (e.g., raising hand, using a signal card)",
  ],
  "When preferred items/activities are removed": [
    "Provide advance warnings before transitions away from preferred items",
    "Use a visual timer so the student can see remaining time",
    "Offer a choice of when to transition (e.g., 'Do you want 2 more minutes or 3?')",
    "Ensure access to preferred items is built into the reinforcement schedule",
  ],
  "Sensory-rich environments (noise, lights, crowds)": [
    "Provide noise-canceling headphones or a quiet workspace option",
    "Offer sensory breaks at regular intervals throughout the day",
    "Create a sensory diet plan with OT consultation",
    "Allow the student to self-advocate for a break using a signal card",
  ],
};

const FUNCTION_TEACHING_STRATEGIES: Record<string, string[]> = {
  attention: [
    "Teach the student to raise a hand or use a signal card to request adult attention",
    "Practice appropriate ways to join peer conversations (e.g., 'Can I play too?')",
    "Use Social Thinking® curriculum to teach perspective-taking and expected behaviors",
    "Role-play scenarios where the student practices waiting for attention appropriately",
    "Teach self-monitoring: student tracks own use of appropriate attention-seeking",
  ],
  escape: [
    "Teach the student to request a break using a break card or verbal request",
    "Build tolerance gradually — start with shorter work periods and increase systematically",
    "Teach self-regulation strategies (deep breathing, counting to 10, progressive muscle relaxation)",
    "Use the Premack Principle: complete a brief non-preferred task, then access a preferred activity",
    "Teach the student to ask for help instead of avoiding tasks ('I need help with this part')",
  ],
  tangible: [
    "Teach the student to request preferred items/activities appropriately ('Can I have a turn?')",
    "Use a visual token economy: earn tokens toward preferred items through appropriate behavior",
    "Teach delayed gratification using a visual wait board or timer",
    "Practice turn-taking and sharing through structured games and activities",
    "Teach the student to accept 'no' or 'later' with a replacement phrase ('Okay, maybe later')",
  ],
  sensory: [
    "Develop a sensory diet with OT input — scheduled sensory input throughout the day",
    "Teach the student to identify sensory needs and request sensory tools (e.g., 'I need my squeeze ball')",
    "Provide acceptable sensory alternatives (e.g., chewable jewelry instead of chewing shirts)",
    "Teach self-regulation strategies for sensory overload (e.g., deep pressure, headphones)",
    "Use a feelings thermometer or zones of regulation to build interoception awareness",
  ],
};

const FUNCTION_REINFORCEMENT_STRATEGIES: Record<string, string[]> = {
  attention: [
    "Provide frequent positive attention (verbal praise, proximity, eye contact) contingent on appropriate behavior — aim for a 5:1 positive-to-corrective ratio",
    "Use behavior-specific praise: name exactly what the student did well (e.g., 'I noticed you raised your hand and waited — that shows respect')",
    "Implement a check-in/check-out system where the student receives adult attention for meeting behavioral expectations",
    "Schedule 2-3 minutes of dedicated 1:1 time with a preferred adult contingent on meeting daily behavior goals",
    "Use a group contingency where the student earns points for the class, providing peer attention for positive behavior",
  ],
  escape: [
    "Allow earned breaks contingent on task completion or appropriate requesting (e.g., complete 5 problems, then a 3-minute break)",
    "Offer choice of task order or work format when the student uses replacement behavior",
    "Reduce task demands as a reinforcer: shorten an assignment when the student works steadily for a set period",
    "Provide preferred seating or workspace when the student meets work expectations",
    "Use a first-then board: complete the non-preferred task first, then access a preferred activity",
  ],
  tangible: [
    "Implement a token economy where the student earns tokens for using replacement behaviors, exchangeable for preferred items or activities",
    "Provide immediate access to a preferred item/activity when the student requests appropriately",
    "Use a choice board: student selects from pre-approved reinforcers after meeting behavioral criteria",
    "Create a reinforcer menu updated weekly based on student preference assessments",
    "Use intermittent surprise rewards for sustained use of appropriate requesting",
  ],
  sensory: [
    "Provide scheduled sensory breaks (e.g., 5 minutes of movement every 30 minutes) independent of behavior to reduce need for sensory-maintained behavior",
    "Allow access to sensory tools contingent on using replacement behaviors (e.g., asking for a squeeze ball instead of tapping the desk)",
    "Reinforce use of self-regulation strategies with additional preferred sensory input",
    "Build sensory activities into academic tasks (e.g., manipulatives, standing desks, textured writing tools)",
    "Use a sensory check-in system where the student self-assesses and accesses the appropriate sensory tool",
  ],
};

const FUNCTION_RESPONSE_STRATEGIES: Record<string, string[]> = {
  attention: [
    "Use planned ignoring for minor attention-seeking behaviors — avoid eye contact, verbal responses, and physical proximity during the behavior",
    "Redirect to the replacement behavior with a brief, neutral prompt: 'Show me how you ask for help'",
    "Avoid lengthy discussions or reprimands, which inadvertently provide attention",
    "If behavior escalates, calmly redirect once, then implement planned ignoring",
    "Provide attention immediately when the student self-corrects or uses the replacement behavior",
  ],
  escape: [
    "Do not remove the task demand when problem behavior occurs — follow through with the expectation at a reduced level if needed",
    "Use a brief neutral redirect: 'I can see this is hard. Use your break card if you need a moment'",
    "After the behavior de-escalates, return to the task at the same or slightly reduced demand level",
    "Avoid power struggles — offer a choice within the demand rather than removing it",
    "Document the specific demand or context that triggered escape behavior for ongoing analysis",
  ],
  tangible: [
    "Do not provide the preferred item/activity contingent on problem behavior",
    "Use a brief neutral redirect: 'I can't give you that right now. You can earn it by [replacement behavior]'",
    "If the student escalates, remain calm and avoid negotiating — restate the contingency once",
    "Provide immediate access to the preferred item when the student uses the replacement behavior",
    "Use visual reminders of the token economy or earning system during moments of frustration",
  ],
  sensory: [
    "Redirect to an acceptable sensory alternative: 'Use your squeeze ball instead'",
    "If behavior is not harmful, briefly allow it and redirect to the replacement during a natural pause",
    "For harmful sensory behaviors (e.g., head-banging), implement response blocking with minimal attention",
    "Increase access to the sensory diet proactively to reduce the frequency of sensory-seeking behaviors",
    "Consult with OT if sensory-maintained behaviors persist despite intervention",
  ],
};

const DATA_COLLECTION_TEMPLATES: Record<string, string[]> = {
  "Frequency count": [
    "Use a frequency data sheet to tally each occurrence of the target behavior during specified observation periods",
    "Record the total count per observation period (e.g., per class period, per hour)",
    "Calculate rate (occurrences per minute/hour) for comparison across unequal observation periods",
  ],
  "Duration recording": [
    "Use a stopwatch or timer to record the total duration of each behavior episode",
    "Record start and stop times for each episode on the data collection form",
    "Calculate average duration per episode and total duration per observation period",
  ],
  "Interval recording": [
    "Divide the observation period into equal intervals (e.g., 10-second or 1-minute intervals)",
    "Use partial interval recording: mark the interval if the behavior occurred at any point during the interval",
    "Calculate the percentage of intervals with behavior occurrence for graphing and analysis",
  ],
  "ABC data collection": [
    "Record the Antecedent (what happened before), Behavior (what the student did), and Consequence (what happened after) for each occurrence",
    "Use a structured ABC data sheet with columns for time, setting, antecedent, behavior, and consequence",
    "Review ABC data weekly to identify patterns and adjust intervention strategies accordingly",
  ],
  "Latency recording": [
    "Record the time between the instruction/prompt and the onset of the target behavior",
    "Use a stopwatch to measure latency for each trial or opportunity",
    "Calculate average latency across opportunities to track improvement",
  ],
};

export function generateBIP(data: FBAData): GeneratedBIP {
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Build function summary
  const functionLabels: Record<string, string> = {
    attention: "social attention (positive or negative attention from adults or peers)",
    escape: "escape/avoidance (removal of non-preferred tasks, demands, or situations)",
    tangible: "access to tangible items or preferred activities",
    sensory: "automatic/sensory reinforcement (internal sensory stimulation)",
  };

  const functionDescriptions = data.functions.map((f) => functionLabels[f]);
  const functionSummaryText =
    data.functions.length === 1
      ? `Based on the FBA data, the primary function of ${data.targetBehaviors[0]?.name || "the target behavior"} is ${functionDescriptions[0]}. ${data.functionNotes ? `Additional observations: ${data.functionNotes}` : ""}`
      : `Based on the FBA data, ${data.targetBehaviors[0]?.name || "the target behavior"} appears to serve multiple functions: ${functionDescriptions.join(" and ")}. The team should prioritize interventions addressing the primary function while monitoring for shifts in function over time. ${data.functionNotes ? `Additional observations: ${data.functionNotes}` : ""}`;

  // Build antecedent strategies
  const antecedentStrategies: string[] = [];
  for (const antecedent of data.antecedents) {
    const strategies = ANTECEDENT_STRATEGY_MAP[antecedent];
    if (strategies) {
      antecedentStrategies.push(...strategies.slice(0, 3));
    }
  }
  if (data.customAntecedents.trim()) {
    antecedentStrategies.push(
      `Address identified antecedent (${data.customAntecedents.trim()}): modify the environment or routine to reduce exposure to this trigger`
    );
  }
  if (antecedentStrategies.length === 0) {
    antecedentStrategies.push(
      "Establish predictable routines with visual supports",
      "Provide advance notice of upcoming changes or demands",
      "Ensure the student's basic needs are met (sleep, hunger, emotional state) at the start of each day"
    );
  }

  // Build teaching strategies
  const teachingStrategies: string[] = [];
  for (const func of data.functions) {
    const strategies = FUNCTION_TEACHING_STRATEGIES[func];
    if (strategies) {
      teachingStrategies.push(...strategies.slice(0, 3));
    }
  }
  for (const rb of data.replacementBehaviors) {
    teachingStrategies.push(
      `Directly teach and model the replacement behavior: "${rb.behavior}" — ${rb.rationale}`
    );
  }

  // Build reinforcement strategies
  const reinforcementStrategies: string[] = [];
  for (const func of data.functions) {
    const strategies = FUNCTION_REINFORCEMENT_STRATEGIES[func];
    if (strategies) {
      reinforcementStrategies.push(...strategies.slice(0, 3));
    }
  }
  if (data.studentStrengths.trim()) {
    reinforcementStrategies.push(
      `Leverage student strengths (${data.studentStrengths.trim()}) as natural reinforcement opportunities`
    );
  }
  if (data.preferredActivities.trim()) {
    reinforcementStrategies.push(
      `Use preferred activities (${data.preferredActivities.trim()}) as earned reinforcers within the token/contingency system`
    );
  }

  // Build response strategies
  const responseStrategies: string[] = [];
  for (const func of data.functions) {
    const strategies = FUNCTION_RESPONSE_STRATEGIES[func];
    if (strategies) {
      responseStrategies.push(...strategies.slice(0, 3));
    }
  }

  // Data collection plan
  const hasHighIntensity = data.targetBehaviors.some((b) => b.intensity === "high");
  const dataCollectionPlan = [
    ...DATA_COLLECTION_TEMPLATES["ABC data collection"]!.slice(0, 2),
    "Graph data weekly to monitor trends and make data-based decisions",
    "Conduct team review of data every 2-4 weeks to evaluate progress and adjust strategies",
    "Track replacement behavior use alongside target behavior to measure skill acquisition",
  ];
  if (hasHighIntensity) {
    dataCollectionPlan.push(
      "For high-intensity behaviors, collect data on every occurrence including duration, intensity rating, and de-escalation time"
    );
  }

  // Crisis plan
  let crisisPlan: string[] | null = null;
  if (data.safetyConcerrns) {
    crisisPlan = [
      `Safety concerns identified: ${data.safetyConcernDetails || "See FBA documentation for details"}`,
      "If the student engages in behavior that poses a risk of harm to self or others:",
      "1. Ensure the safety of all students — clear the area if necessary",
      "2. Remain calm and use a low, steady voice — avoid physical intervention unless trained and authorized",
      "3. Remove objects that could be used to cause harm",
      "4. Contact the designated crisis team member or administrator immediately",
      "5. Use approved crisis intervention procedures per district policy",
      "6. Document the incident using the district's incident report form within 24 hours",
      "7. Conduct a debrief with the team within 48 hours to review what occurred and adjust the plan",
      "8. Contact the family on the same day as the incident per district communication protocol",
      "9. Review and update the BIP within one week following a crisis event",
    ];
  }

  // Generalization plan
  const generalizationPlan = [
    "Train all staff who interact with the student on BIP strategies — consistency across adults is critical",
    "Implement the plan across at least 3 settings (e.g., classroom, specials, cafeteria) from the start",
    "Use multiple exemplar training: practice replacement behaviors in varied contexts with different people",
    "Gradually fade prompts and supports as the student demonstrates independent use of replacement behaviors",
    "Schedule monthly team check-ins to ensure consistent implementation across settings and staff",
    data.communicationLevel.trim()
      ? `Adjust communication supports based on the student's level: ${data.communicationLevel.trim()}`
      : "Ensure communication supports match the student's expressive and receptive language levels",
  ];

  // Maintenance plan
  const maintenancePlan = [
    "After the student meets criteria for 4 consecutive weeks, begin thinning the reinforcement schedule (e.g., move from continuous to variable ratio)",
    "Conduct booster sessions monthly for the first 3 months after mastery to reinforce replacement behaviors",
    "Continue monitoring data at reduced frequency (weekly → biweekly → monthly) after mastery criteria are met",
    "Schedule a formal BIP review at 30, 60, and 90 days post-mastery",
    "If behavior returns to baseline levels, reconvene the team and re-intensify supports within 5 school days",
    "Plan for natural contingencies: identify naturally occurring reinforcers that will maintain the behavior long-term",
  ];

  return {
    studentInfo: {
      name: data.studentName || "[Student Name]",
      age: data.studentAge || "[Age]",
      grade: data.studentGrade || "[Grade]",
      school: data.school || "[School]",
      dateOfFBA: data.dateOfFBA || "[FBA Date]",
      dateOfBIP: today,
      teamMembers: data.teamMembers || "[Team Members]",
    },
    behaviorDefinitions: data.targetBehaviors.map((b) => ({
      name: b.name,
      definition: b.operationalDefinition,
      frequency: b.frequency,
      duration: b.duration,
      intensity: b.intensity,
    })),
    functionSummary: functionSummaryText,
    antecedentStrategies,
    teachingStrategies,
    reinforcementStrategies,
    responseStrategies,
    dataCollectionPlan,
    crisisPlan,
    generalizationPlan,
    maintenancePlan,
  };
}

export function bipToText(bip: GeneratedBIP): string {
  const lines: string[] = [];
  const hr = "─".repeat(60);

  lines.push("BEHAVIOR INTERVENTION PLAN (BIP)");
  lines.push(hr);
  lines.push("");
  lines.push(`Student: ${bip.studentInfo.name}`);
  lines.push(`Age: ${bip.studentInfo.age}  |  Grade: ${bip.studentInfo.grade}`);
  lines.push(`School: ${bip.studentInfo.school}`);
  lines.push(`Date of FBA: ${bip.studentInfo.dateOfFBA}`);
  lines.push(`Date of BIP: ${bip.studentInfo.dateOfBIP}`);
  lines.push(`Team Members: ${bip.studentInfo.teamMembers}`);
  lines.push("");

  lines.push(hr);
  lines.push("1. TARGET BEHAVIOR DEFINITIONS");
  lines.push(hr);
  for (const b of bip.behaviorDefinitions) {
    lines.push("");
    lines.push(`Behavior: ${b.name}`);
    lines.push(`Operational Definition: ${b.definition}`);
    lines.push(`Current Frequency: ${b.frequency}`);
    lines.push(`Typical Duration: ${b.duration}`);
    lines.push(`Intensity: ${b.intensity}`);
  }
  lines.push("");

  lines.push(hr);
  lines.push("2. FUNCTION OF BEHAVIOR");
  lines.push(hr);
  lines.push("");
  lines.push(bip.functionSummary);
  lines.push("");

  lines.push(hr);
  lines.push("3. ANTECEDENT / PREVENTION STRATEGIES");
  lines.push(hr);
  lines.push("");
  for (const s of bip.antecedentStrategies) {
    lines.push(`• ${s}`);
  }
  lines.push("");

  lines.push(hr);
  lines.push("4. TEACHING STRATEGIES (Replacement Behaviors)");
  lines.push(hr);
  lines.push("");
  for (const s of bip.teachingStrategies) {
    lines.push(`• ${s}`);
  }
  lines.push("");

  lines.push(hr);
  lines.push("5. REINFORCEMENT STRATEGIES");
  lines.push(hr);
  lines.push("");
  for (const s of bip.reinforcementStrategies) {
    lines.push(`• ${s}`);
  }
  lines.push("");

  lines.push(hr);
  lines.push("6. RESPONSE TO PROBLEM BEHAVIOR");
  lines.push(hr);
  lines.push("");
  for (const s of bip.responseStrategies) {
    lines.push(`• ${s}`);
  }
  lines.push("");

  lines.push(hr);
  lines.push("7. DATA COLLECTION PLAN");
  lines.push(hr);
  lines.push("");
  for (const s of bip.dataCollectionPlan) {
    lines.push(`• ${s}`);
  }
  lines.push("");

  if (bip.crisisPlan) {
    lines.push(hr);
    lines.push("8. CRISIS / SAFETY PLAN");
    lines.push(hr);
    lines.push("");
    for (const s of bip.crisisPlan) {
      lines.push(s.startsWith("1.") || s.startsWith("2.") || s.startsWith("3.") || s.startsWith("4.") || s.startsWith("5.") || s.startsWith("6.") || s.startsWith("7.") || s.startsWith("8.") || s.startsWith("9.") ? `  ${s}` : `• ${s}`);
    }
    lines.push("");
  }

  const nextSection = bip.crisisPlan ? 9 : 8;
  lines.push(hr);
  lines.push(`${nextSection}. GENERALIZATION PLAN`);
  lines.push(hr);
  lines.push("");
  for (const s of bip.generalizationPlan) {
    lines.push(`• ${s}`);
  }
  lines.push("");

  lines.push(hr);
  lines.push(`${nextSection + 1}. MAINTENANCE PLAN`);
  lines.push(hr);
  lines.push("");
  for (const s of bip.maintenancePlan) {
    lines.push(`• ${s}`);
  }
  lines.push("");

  lines.push(hr);
  lines.push("Generated by Behavior School — behaviorschool.com/fba-to-bip");
  lines.push("This BIP should be reviewed and customized by the student's behavior support team.");

  return lines.join("\n");
}
