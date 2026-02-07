/**
 * Rules-based BIP generator — no AI API calls needed.
 * Structure and terminology aligned with KCUSD Behavior Team system.
 * Intervention types: antecedent, teaching (replacement), consequence.
 * Function framing: to get / to avoid / sensory regulation.
 */

export interface FBAData {
  // Student Info
  studentName: string;
  studentAge: string;
  studentGrade: string;
  school: string;
  dateOfFBA: string;
  teamMembers: string;

  // Target Behavior for Reduction
  targetBehavior: string; // bipProblemBehavior
  targetBehaviorDefinition: string; // Operational definition
  precursors: string; // Precursor behaviors
  triggers: string; // Immediate triggers/antecedents

  // Baseline for Problem Behavior
  problemBehaviorBaseline: string; // bipBaseline — how often/how long

  // Function
  primaryFunction: string; // "to get attention" / "to avoid tasks" / "sensory regulation" etc.
  secondaryFunction: string;

  // Setting Events & Antecedent Conditions
  settingEvents: string[]; // Previous events that influence behavior
  customSettingEvents: string;
  antecedents: string[]; // Events immediately before behavior
  customAntecedents: string;

  // Consequences (current — what happens after)
  currentConsequences: string[]; // Events immediately following behavior
  customConsequences: string;

  // Replacement Behavior
  replacementBehavior: string; // bipReplacementBehavior
  replacementBehaviorBaseline: string; // bipReplacementBaseline

  // Interventions — user selections + custom
  antecedentInterventions: string[];
  customAntecedentInterventions: string;
  reinforcementProcedures: string[];
  customReinforcementProcedures: string;
  consequenceInterventions: string[];
  customConsequenceInterventions: string;

  // Data Collection
  dataCollectionMethod: string;
  dataCollectionPerson: string;
  dataCollectionFrequency: string;

  // Additional Context
  studentStrengths: string;
  preferredItems: string; // Preference assessment results
  previousInterventions: string;
  safetyConcerrns: boolean;
  safetyConcernDetails: string;

  // Goals & Criteria
  successCriteria: string;
}

export interface DataCollectionRow {
  behaviorType: string;
  procedures: string;
  personResponsible: string;
  frequency: string;
}

export interface BIPGoal {
  goalType: "reduction" | "replacement" | "skill-building";
  goalText: string;
}

export interface GeneratedBIP {
  studentInfo: {
    name: string;
    grade: string;
    school: string;
    dateOfFBA: string;
    dateOfBIP: string;
    teamMembers: string;
  };
  targetBehaviorForReduction: {
    behavior: string;
    definition: string;
    precursors: string;
    triggers: string;
  };
  problemBehaviorBaseline: string;
  functionStatement: string;
  primaryFunction: string;
  secondaryFunction: string;
  replacementBehavior: string;
  replacementBehaviorBaseline: string;
  antecedentInterventions: string[];
  reinforcementProcedures: string[];
  consequenceInterventions: string[];
  dataCollectionMatrix: DataCollectionRow[];
  successCriteria: string;
  goals: BIPGoal[];
  crisisPlan: string[] | null;
  generalizationPlan: string[];
}

// ─── Function-matched intervention banks ───────────────────────────────

const ANTECEDENT_INTERVENTIONS_BY_FUNCTION: Record<string, string[]> = {
  "to get attention": [
    "Schedule regular positive check-ins (every 15-20 min) so the student receives non-contingent adult attention",
    "Assign classroom jobs that provide natural opportunities for positive attention from adults and peers",
    "Use nonverbal signals (thumbs up, proximity, eye contact) to acknowledge the student during group instruction",
    "Provide pre-corrective statements before transitions or activities where attention-seeking is most likely",
    "Seat the student near the teacher to increase opportunities for positive interaction",
    "Schedule brief 1:1 time with a preferred adult at predictable times throughout the day",
  ],
  "to get peer attention": [
    "Assign cooperative learning roles that give the student a leadership or helper role among peers",
    "Pre-teach appropriate ways to get peer attention (e.g., asking to play, sharing materials)",
    "Use structured peer activities with clear expectations for interaction",
    "Provide opportunities for the student to present or share with the class in appropriate ways",
  ],
  "to avoid tasks": [
    "Provide task choices when possible (e.g., choose between two assignments of equal difficulty)",
    "Break tasks into smaller, manageable steps with visual checklists",
    "Pre-teach or preview challenging material before independent work",
    "Offer a break card the student can use proactively before frustration builds",
    "Embed high-interest topics or preferred materials into non-preferred assignments",
    "Reduce task difficulty or length initially, then gradually increase demands (demand fading)",
    "Use first-then language paired with a visual board: 'First [work], then [preferred activity]'",
  ],
  "to avoid social situations": [
    "Pre-teach social expectations with visual cue cards before social activities",
    "Provide a quiet alternative space the student can request appropriately",
    "Assign a peer buddy during unstructured social times",
    "Gradually increase social demand using a systematic desensitization approach",
    "Use social narratives to prepare for upcoming social situations",
  ],
  "to get tangible": [
    "Provide a visual schedule showing when preferred items/activities are available",
    "Use a visual timer so the student can see when access to the preferred item is coming",
    "Offer choice of when to transition away from preferred items ('2 more minutes or 3?')",
    "Ensure access to preferred items is built into the reinforcement schedule at predictable intervals",
  ],
  "sensory regulation": [
    "Develop a sensory diet with OT input — scheduled sensory input throughout the day",
    "Provide noise-canceling headphones or a quiet workspace option",
    "Allow scheduled movement breaks at regular intervals (e.g., every 20-30 minutes)",
    "Offer sensory tools proactively (fidget, weighted lap pad, chewable) before the need arises",
    "Create a calm-down area the student can request using a signal card",
    "Adjust environmental stimuli (lighting, noise level, seating) based on sensory needs assessment",
  ],
};

const REINFORCEMENT_PROCEDURES_BY_FUNCTION: Record<string, string[]> = {
  "to get attention": [
    "Provide frequent behavior-specific praise contingent on replacement behavior — aim for a 5:1 positive-to-corrective ratio (e.g., 'I noticed you raised your hand and waited — that shows respect')",
    "Implement a check-in/check-out system where the student receives dedicated adult attention for meeting behavioral expectations",
    "Schedule 2-3 minutes of dedicated 1:1 time with a preferred adult contingent on meeting daily behavior goals",
    "Use a group contingency where the student earns points for the class, providing positive peer and adult attention",
    "Provide noncontingent attention at regular intervals to reduce the establishing operation for attention-seeking behavior",
  ],
  "to get peer attention": [
    "Provide peer-mediated reinforcement (e.g., the student earns group privileges for using appropriate social skills)",
    "Use cooperative activities where appropriate behavior naturally results in positive peer interaction",
    "Provide immediate social praise from peers and adults when the student uses appropriate attention-seeking strategies",
  ],
  "to avoid tasks": [
    "Allow earned breaks contingent on task completion or appropriate requesting (e.g., complete 5 problems, then a 3-minute break)",
    "Offer choice of task order or work format when the student uses the replacement behavior",
    "Reduce task demands as a reinforcer: shorten an assignment when the student works steadily for a set period",
    "Use a first-then board: complete the non-preferred task first, then access a preferred activity",
    "Provide immediate verbal praise when the student begins or sustains work effort, even briefly",
  ],
  "to avoid social situations": [
    "Reinforce approach behaviors — praise any voluntary social participation, however small",
    "Allow earned quiet time contingent on practicing social skills for a specified period",
    "Use a gradual exposure approach where the student earns reinforcement for incrementally increased social participation",
  ],
  "to get tangible": [
    "Implement a token economy where the student earns tokens for using replacement behaviors, exchangeable for preferred items or activities",
    "Provide immediate access to a preferred item/activity when the student requests appropriately",
    "Create a reinforcer menu updated weekly based on student preference assessments",
    "Use intermittent surprise rewards for sustained use of appropriate requesting",
  ],
  "sensory regulation": [
    "Provide scheduled sensory breaks (e.g., 5 min of movement every 30 min) independent of behavior to reduce the establishing operation",
    "Allow access to preferred sensory tools contingent on using replacement behaviors (e.g., asking for a squeeze ball instead of tapping the desk)",
    "Reinforce use of self-regulation strategies with additional preferred sensory input",
    "Build sensory activities into academic tasks (e.g., manipulatives, standing desks, textured writing tools)",
  ],
};

const CONSEQUENCE_INTERVENTIONS_BY_FUNCTION: Record<string, string[]> = {
  "to get attention": [
    "Use planned ignoring for minor attention-seeking behaviors — avoid eye contact, verbal responses, and physical proximity during the behavior",
    "Redirect to the replacement behavior with a brief, neutral prompt: 'Show me how you ask for help'",
    "Avoid lengthy discussions or reprimands, which inadvertently provide the attention that reinforces the behavior",
    "Provide attention immediately when the student self-corrects or uses the replacement behavior (differential reinforcement)",
    "If behavior escalates, calmly redirect once, then implement planned ignoring until the student uses the replacement behavior",
  ],
  "to get peer attention": [
    "Redirect peers to ignore the problem behavior and attend to students who are meeting expectations",
    "Use brief, neutral redirects that minimize peer attention to the problem behavior",
    "Provide immediate positive peer attention when the student uses appropriate social strategies",
  ],
  "to avoid tasks": [
    "Do not remove the task demand when problem behavior occurs — follow through with the expectation at a reduced level if needed",
    "Use a brief neutral redirect: 'I can see this is hard. Use your break card if you need a moment'",
    "After the behavior de-escalates, return to the task at the same or slightly reduced demand level",
    "Avoid power struggles — offer a choice within the demand rather than removing it entirely",
    "When the student uses the replacement behavior (e.g., requesting a break), honor the request immediately",
  ],
  "to avoid social situations": [
    "Do not allow complete avoidance — redirect to a reduced-demand social interaction",
    "Provide supportive prompts to re-engage at a lower social demand level",
    "Reinforce any re-engagement in social activities immediately",
  ],
  "to get tangible": [
    "Do not provide the preferred item/activity contingent on problem behavior — maintain the contingency",
    "Use a brief neutral redirect: 'I can't give you that right now. You can earn it by [replacement behavior]'",
    "Provide immediate access to the preferred item when the student uses the replacement behavior",
    "Use visual reminders of the earning system during moments of frustration",
  ],
  "sensory regulation": [
    "Redirect to an acceptable sensory alternative: 'Use your squeeze ball instead'",
    "For harmful sensory behaviors (e.g., head-banging, self-injury), implement response blocking with minimal attention",
    "Increase access to the sensory diet proactively to reduce the frequency of sensory-seeking behaviors",
    "Consult with OT if sensory-maintained behaviors persist despite intervention",
  ],
};

// ─── Antecedent trigger → strategy map ─────────────────────────────────

const TRIGGER_ANTECEDENT_MAP: Record<string, string[]> = {
  "Difficult or non-preferred tasks": [
    "Break tasks into smaller steps with visual checklists",
    "Provide task choices when possible",
    "Pre-teach or preview challenging material before independent work",
  ],
  "Transitions between activities": [
    "Provide 5-minute and 2-minute warnings before transitions",
    "Use a visual schedule or timer so transitions are predictable",
    "Assign a transition job or preferred transition activity",
  ],
  "Unstructured time (recess, lunch)": [
    "Provide structured activity choices during unstructured time",
    "Assign a peer buddy during lunch or recess",
    "Check in with student before and after unstructured periods",
  ],
  "Changes in routine": [
    "Preview schedule changes with a visual first-then board",
    "Provide advance notice of changes whenever possible",
    "Use a social narrative describing what will happen differently",
  ],
  "Large group instruction": [
    "Seat student near the teacher and away from distractions",
    "Use frequent engagement strategies (choral response, partner turn-and-talk)",
    "Chunk instruction with embedded response opportunities every 3-5 minutes",
  ],
  "Peer interactions / conflict": [
    "Pre-teach social skills during structured lessons",
    "Use role-play and video modeling for common conflict scenarios",
    "Provide a cool-down area the student can access independently",
  ],
  "When told 'no' or given a directive": [
    "Offer choices within directives ('Do you want to start with reading or math?')",
    "Use first-then language paired with a visual board",
    "Provide empathetic acknowledgment before restating the expectation",
  ],
  "When attention is directed elsewhere": [
    "Schedule regular positive check-ins throughout the day",
    "Use nonverbal signals to acknowledge the student during group instruction",
    "Assign classroom jobs that provide natural adult attention",
  ],
  "When preferred items/activities are removed": [
    "Provide advance warnings before transitions away from preferred items",
    "Use a visual timer so the student can see remaining time",
    "Offer a choice of when to transition",
  ],
  "Sensory-rich environments (noise, lights, crowds)": [
    "Provide noise-canceling headphones or a quiet workspace option",
    "Offer sensory breaks at regular intervals",
    "Create a sensory diet plan with OT consultation",
  ],
};

// ─── Generator ─────────────────────────────────────────────────────────

function normalizeFunctionKey(func: string): string {
  const lower = func.toLowerCase().trim();
  // Map common inputs to our keys
  if (lower.includes("attention") && lower.includes("peer")) return "to get peer attention";
  if (lower.includes("attention")) return "to get attention";
  if (lower.includes("escape") || lower.includes("avoid task") || lower.includes("avoid demand") || lower.includes("avoid work")) return "to avoid tasks";
  if (lower.includes("avoid social") || lower.includes("avoid peer")) return "to avoid social situations";
  if (lower.includes("tangible") || lower.includes("access") || lower.includes("to get")) return "to get tangible";
  if (lower.includes("sensory") || lower.includes("automatic") || lower.includes("regulation")) return "sensory regulation";
  if (lower.includes("avoid")) return "to avoid tasks";
  return lower;
}

function getStrategiesForFunction(
  bank: Record<string, string[]>,
  func: string,
  max: number = 4
): string[] {
  const key = normalizeFunctionKey(func);
  const strategies = bank[key] || [];
  return strategies.slice(0, max);
}

export function generateBIP(data: FBAData): GeneratedBIP {
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const studentName = data.studentName || "[Student Name]";

  // ── Function statement ──
  const primaryKey = normalizeFunctionKey(data.primaryFunction);
  const functionParts = [`${studentName} engages in ${data.targetBehavior || "the target behavior"} primarily ${data.primaryFunction || "for an identified function"}`];
  if (data.secondaryFunction.trim()) {
    functionParts.push(`A secondary function is hypothesized to be ${data.secondaryFunction}`);
  }
  const functionStatement = functionParts.join(". ") + ".";

  // ── Antecedent interventions ──
  const antecedentInterventions: string[] = [];
  // From selected trigger-based strategies
  for (const trigger of data.antecedents) {
    const strats = TRIGGER_ANTECEDENT_MAP[trigger];
    if (strats) antecedentInterventions.push(...strats.slice(0, 2));
  }
  // From function-matched bank
  antecedentInterventions.push(
    ...getStrategiesForFunction(ANTECEDENT_INTERVENTIONS_BY_FUNCTION, data.primaryFunction, 3)
  );
  if (data.secondaryFunction.trim()) {
    antecedentInterventions.push(
      ...getStrategiesForFunction(ANTECEDENT_INTERVENTIONS_BY_FUNCTION, data.secondaryFunction, 2)
    );
  }
  // User-selected
  antecedentInterventions.push(...data.antecedentInterventions);
  if (data.customAntecedentInterventions.trim()) {
    antecedentInterventions.push(data.customAntecedentInterventions.trim());
  }
  // Deduplicate
  const uniqueAntecedent = [...new Set(antecedentInterventions)];

  // ── Reinforcement procedures ──
  const reinforcementProcedures: string[] = [];
  reinforcementProcedures.push(
    ...getStrategiesForFunction(REINFORCEMENT_PROCEDURES_BY_FUNCTION, data.primaryFunction, 3)
  );
  if (data.secondaryFunction.trim()) {
    reinforcementProcedures.push(
      ...getStrategiesForFunction(REINFORCEMENT_PROCEDURES_BY_FUNCTION, data.secondaryFunction, 2)
    );
  }
  reinforcementProcedures.push(...data.reinforcementProcedures);
  if (data.customReinforcementProcedures.trim()) {
    reinforcementProcedures.push(data.customReinforcementProcedures.trim());
  }
  if (data.preferredItems.trim()) {
    reinforcementProcedures.push(
      `Use identified preferred items/activities (${data.preferredItems.trim()}) as reinforcers within the reinforcement system`
    );
  }
  const uniqueReinforcement = [...new Set(reinforcementProcedures)];

  // ── Consequence interventions ──
  const consequenceInterventions: string[] = [];
  consequenceInterventions.push(
    ...getStrategiesForFunction(CONSEQUENCE_INTERVENTIONS_BY_FUNCTION, data.primaryFunction, 3)
  );
  if (data.secondaryFunction.trim()) {
    consequenceInterventions.push(
      ...getStrategiesForFunction(CONSEQUENCE_INTERVENTIONS_BY_FUNCTION, data.secondaryFunction, 2)
    );
  }
  consequenceInterventions.push(...data.consequenceInterventions);
  if (data.customConsequenceInterventions.trim()) {
    consequenceInterventions.push(data.customConsequenceInterventions.trim());
  }
  const uniqueConsequence = [...new Set(consequenceInterventions)];

  // ── Data collection matrix ──
  const dataCollectionMatrix: DataCollectionRow[] = [
    {
      behaviorType: `Problem Behavior: ${data.targetBehavior || "Target behavior"}`,
      procedures: data.dataCollectionMethod || "Frequency count / ABC data collection",
      personResponsible: data.dataCollectionPerson || "Classroom teacher / instructional aide",
      frequency: data.dataCollectionFrequency || "Daily during identified target periods",
    },
    {
      behaviorType: `Replacement Behavior: ${data.replacementBehavior || "Replacement behavior"}`,
      procedures: "Frequency count — tally each independent use of the replacement behavior",
      personResponsible: data.dataCollectionPerson || "Classroom teacher / instructional aide",
      frequency: data.dataCollectionFrequency || "Daily during identified target periods",
    },
  ];

  // ── Success criteria ──
  const successCriteria = data.successCriteria.trim()
    || `${studentName} will demonstrate the replacement behavior (${data.replacementBehavior || "as defined"}) in 80% or more of observed opportunities for 4 consecutive weeks. At that point, the team will meet to discuss fading the plan by reducing reinforcement frequency and increasing independence. The plan will be considered successful when the replacement behavior is maintained at 80%+ for an additional 4 weeks with faded supports.`;

  // ── Goals ──
  const goals: BIPGoal[] = [
    {
      goalType: "reduction",
      goalText: `${studentName} will reduce ${data.targetBehavior || "the target behavior"} from the current baseline of ${data.problemBehaviorBaseline || "[baseline]"} to no more than 1 occurrence per day (or 80% reduction from baseline) within 12 weeks, as measured by daily frequency data.`,
    },
    {
      goalType: "replacement",
      goalText: `${studentName} will independently use the replacement behavior (${data.replacementBehavior || "[replacement behavior]"}) in 80% of opportunities within 12 weeks, increasing from the current baseline of ${data.replacementBehaviorBaseline || "[baseline]"}, as measured by daily data collection.`,
    },
  ];

  // ── Crisis plan ──
  let crisisPlan: string[] | null = null;
  if (data.safetyConcerrns) {
    crisisPlan = [
      `Safety concerns identified: ${data.safetyConcernDetails || "See FBA documentation"}`,
      "",
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

  // ── Generalization plan ──
  const generalizationPlan = [
    "Train all staff who interact with the student on BIP strategies — consistency across adults is critical",
    "Implement the plan across at least 3 settings (e.g., classroom, specials, cafeteria) from the start",
    "Use multiple exemplar training: practice replacement behaviors in varied contexts with different people",
    "Gradually fade prompts and supports as the student demonstrates independent use of replacement behaviors",
    "Schedule monthly team check-ins to ensure consistent implementation across settings and staff",
  ];

  return {
    studentInfo: {
      name: studentName,
      grade: data.studentGrade || "[Grade]",
      school: data.school || "[School]",
      dateOfFBA: data.dateOfFBA || "[FBA Date]",
      dateOfBIP: today,
      teamMembers: data.teamMembers || "[Team Members]",
    },
    targetBehaviorForReduction: {
      behavior: data.targetBehavior,
      definition: data.targetBehaviorDefinition,
      precursors: data.precursors,
      triggers: data.triggers,
    },
    problemBehaviorBaseline: data.problemBehaviorBaseline,
    functionStatement,
    primaryFunction: data.primaryFunction,
    secondaryFunction: data.secondaryFunction,
    replacementBehavior: data.replacementBehavior,
    replacementBehaviorBaseline: data.replacementBehaviorBaseline,
    antecedentInterventions: uniqueAntecedent,
    reinforcementProcedures: uniqueReinforcement,
    consequenceInterventions: uniqueConsequence,
    dataCollectionMatrix,
    successCriteria,
    goals,
    crisisPlan,
    generalizationPlan,
  };
}

export function bipToText(bip: GeneratedBIP): string {
  const lines: string[] = [];
  const hr = "─".repeat(60);

  lines.push("BEHAVIOR INTERVENTION PLAN (BIP)");
  lines.push(hr);
  lines.push("");
  lines.push(`Student: ${bip.studentInfo.name}`);
  lines.push(`Grade: ${bip.studentInfo.grade}  |  School: ${bip.studentInfo.school}`);
  lines.push(`Date of FBA: ${bip.studentInfo.dateOfFBA}  |  Date of BIP: ${bip.studentInfo.dateOfBIP}`);
  lines.push(`Team: ${bip.studentInfo.teamMembers}`);
  lines.push("");

  lines.push(hr);
  lines.push("TARGET BEHAVIOR FOR REDUCTION");
  lines.push(hr);
  lines.push(`Target Behavior: ${bip.targetBehaviorForReduction.behavior}`);
  lines.push(`Operational Definition: ${bip.targetBehaviorForReduction.definition}`);
  if (bip.targetBehaviorForReduction.precursors) lines.push(`Precursors: ${bip.targetBehaviorForReduction.precursors}`);
  if (bip.targetBehaviorForReduction.triggers) lines.push(`Triggers: ${bip.targetBehaviorForReduction.triggers}`);
  lines.push("");

  lines.push(hr);
  lines.push("BASELINE FOR PROBLEM BEHAVIOR");
  lines.push(hr);
  lines.push(bip.problemBehaviorBaseline || "See FBA data.");
  lines.push("");

  lines.push(hr);
  lines.push("FUNCTION OF BEHAVIOR");
  lines.push(hr);
  lines.push(bip.functionStatement);
  lines.push("");

  lines.push(hr);
  lines.push("REPLACEMENT BEHAVIOR");
  lines.push(hr);
  lines.push(`Replacement Behavior: ${bip.replacementBehavior}`);
  lines.push(`Baseline for Replacement Behavior: ${bip.replacementBehaviorBaseline || "Not yet observed / occurring at low rates"}`);
  lines.push("");

  lines.push(hr);
  lines.push("ANTECEDENT INTERVENTIONS");
  lines.push(hr);
  for (const s of bip.antecedentInterventions) lines.push(`• ${s}`);
  lines.push("");

  lines.push(hr);
  lines.push("REINFORCEMENT PROCEDURES");
  lines.push(hr);
  for (const s of bip.reinforcementProcedures) lines.push(`• ${s}`);
  lines.push("");

  lines.push(hr);
  lines.push("CONSEQUENCE INTERVENTIONS");
  lines.push(hr);
  for (const s of bip.consequenceInterventions) lines.push(`• ${s}`);
  lines.push("");

  lines.push(hr);
  lines.push("DATA COLLECTION");
  lines.push(hr);
  for (const row of bip.dataCollectionMatrix) {
    lines.push(`  ${row.behaviorType}`);
    lines.push(`    Procedures: ${row.procedures}`);
    lines.push(`    Person Responsible: ${row.personResponsible}`);
    lines.push(`    Frequency: ${row.frequency}`);
    lines.push("");
  }

  lines.push(hr);
  lines.push("CRITERIA FOR SUCCESS");
  lines.push(hr);
  lines.push(bip.successCriteria);
  lines.push("");

  lines.push(hr);
  lines.push("GOALS");
  lines.push(hr);
  for (const [i, goal] of bip.goals.entries()) {
    lines.push(`Goal #${i + 1} (${goal.goalType}): ${goal.goalText}`);
    lines.push("");
  }

  if (bip.crisisPlan) {
    lines.push(hr);
    lines.push("CRISIS / SAFETY PLAN");
    lines.push(hr);
    for (const s of bip.crisisPlan) {
      lines.push(s.match(/^\d+\./) ? `  ${s}` : s ? `• ${s}` : "");
    }
    lines.push("");
  }

  lines.push(hr);
  lines.push("GENERALIZATION PLAN");
  lines.push(hr);
  for (const s of bip.generalizationPlan) lines.push(`• ${s}`);
  lines.push("");

  lines.push(hr);
  lines.push("Generated by Behavior School — behaviorschool.com/fba-to-bip");
  lines.push("This BIP should be reviewed and customized by the student's behavior support team.");

  return lines.join("\n");
}
