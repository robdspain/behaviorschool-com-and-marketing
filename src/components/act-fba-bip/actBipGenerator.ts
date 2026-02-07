/**
 * ACT-Informed FBA/BIP Generator — rules-based, no AI API calls.
 * Integrates Acceptance and Commitment Training concepts into
 * standard FBA/BIP structure for school-based behavior support.
 */

// ─── Types ─────────────────────────────────────────────────────────────

export type GradeLevel = "prek-k" | "1-3" | "4-5" | "6-8" | "9-12";

export type ACTProcess =
  | "experiential-avoidance"
  | "cognitive-fusion"
  | "lack-present-moment"
  | "self-as-content"
  | "unclear-values"
  | "inaction";

export type ValueDomain =
  | "relationships"
  | "learning"
  | "play"
  | "independence"
  | "kindness"
  | "creativity"
  | "health"
  | "family"
  | "honesty"
  | "bravery";

export type BehaviorFunction = "attention" | "escape" | "tangible" | "sensory";

export interface ACTFBAData {
  // Student Info
  studentName: string;
  studentAge: string;
  studentGrade: string;
  gradeLevel: GradeLevel;
  school: string;
  dateOfFBA: string;
  teamMembers: string;

  // Target Behavior (standard FBA)
  targetBehaviors: Array<{
    name: string;
    operationalDefinition: string;
    frequency: string;
    duration: string;
    intensity: "low" | "moderate" | "high";
  }>;

  // Standard FBA components
  antecedents: string[];
  customAntecedents: string;
  settingEvents: string[];
  customSettingEvents: string;
  consequences: string[];
  customConsequences: string;
  functions: BehaviorFunction[];
  functionNotes: string;

  // ACT-Specific FBA: Values Assessment
  studentValues: ValueDomain[];
  valuesNotes: string;

  // ACT-Specific FBA: Psychological Flexibility Assessment
  inflexibilityProcesses: ACTProcess[];
  inflexibilityNotes: string;

  // ACT-Specific FBA: ACT Setting Events
  actSettingEvents: string[];
  customACTSettingEvents: string;

  // ACT lens on function
  actFunctionalAnalysis: string; // How behavior relates to experiential avoidance / values-inconsistency

  // Replacement behaviors (values-aligned)
  replacementBehaviors: Array<{
    behavior: string;
    valueConnection: string; // Which value this connects to
  }>;

  // Context
  studentStrengths: string;
  preferredActivities: string;
  communicationLevel: string;
  previousInterventions: string;
  safetyConcerrns: boolean;
  safetyConcernDetails: string;
}

export interface ACTMetaphor {
  name: string;
  description: string;
  targetProcess: ACTProcess;
  gradeLevels: GradeLevel[];
}

export interface GeneratedACTBIP {
  studentInfo: {
    name: string;
    age: string;
    grade: string;
    school: string;
    dateOfFBA: string;
    dateOfBIP: string;
    teamMembers: string;
  };
  // Standard FBA sections
  behaviorDefinitions: Array<{
    name: string;
    definition: string;
    frequency: string;
    duration: string;
    intensity: string;
  }>;
  functionSummary: string;
  antecedentStrategies: string[];
  // ACT-specific FBA sections
  valuesAssessment: {
    identifiedValues: ValueDomain[];
    valuesDescriptions: string[];
    valuesActivities: string[];
  };
  psychFlexAssessment: {
    identifiedProcesses: ACTProcess[];
    processDescriptions: string[];
  };
  actFunctionalAnalysis: string;
  actSettingEventsSummary: string[];
  // ACT-informed BIP sections
  valuesAlignedReplacements: string[];
  acceptanceStrategies: string[];
  defusionTechniques: string[];
  valuesActivities: string[];
  committedActionGoals: string[];
  metaphorsAndExercises: ACTMetaphor[];
  // Standard BIP sections with ACT enhancement
  teachingStrategies: string[];
  reinforcementStrategies: string[];
  responseStrategies: string[];
  dataCollectionPlan: string[];
  valuesConsistentMonitoring: string[];
  crisisPlan: string[] | null;
  generalizationPlan: string[];
  maintenancePlan: string[];
}

// ─── ACT Process Labels ────────────────────────────────────────────────

export const ACT_PROCESS_LABELS: Record<ACTProcess, { label: string; description: string; emoji: string }> = {
  "experiential-avoidance": {
    label: "Experiential Avoidance",
    description: "Tries to avoid or escape difficult thoughts, feelings, or sensations",
    emoji: "🚫",
  },
  "cognitive-fusion": {
    label: "Cognitive Fusion",
    description: "Gets stuck on rigid thoughts, rules, or self-stories ('I can't do this,' 'I'm bad')",
    emoji: "🔗",
  },
  "lack-present-moment": {
    label: "Lack of Present-Moment Awareness",
    description: "Difficulty staying focused on the here and now; stuck in past or future",
    emoji: "⏳",
  },
  "self-as-content": {
    label: "Rigid Self-Concept",
    description: "Identifies rigidly with labels or stories about themselves ('I'm the bad kid')",
    emoji: "🪞",
  },
  "unclear-values": {
    label: "Unclear Values",
    description: "Doesn't know or can't articulate what matters to them",
    emoji: "🧭",
  },
  "inaction": {
    label: "Inaction / Impulsivity",
    description: "Acts impulsively or avoids committed action toward what matters",
    emoji: "⚡",
  },
};

export const VALUE_LABELS: Record<ValueDomain, { label: string; emoji: string; description: string }> = {
  relationships: { label: "Relationships / Friendship", emoji: "🤝", description: "Having friends, being a good friend, connecting with others" },
  learning: { label: "Learning / Curiosity", emoji: "📚", description: "Discovering new things, getting better at skills, being curious" },
  play: { label: "Play / Fun", emoji: "🎮", description: "Having fun, enjoying activities, being playful" },
  independence: { label: "Independence / Freedom", emoji: "🦅", description: "Doing things on their own, making choices, being responsible" },
  kindness: { label: "Kindness / Helping", emoji: "💛", description: "Being kind to others, helping out, caring for people" },
  creativity: { label: "Creativity / Expression", emoji: "🎨", description: "Making things, expressing ideas, being creative" },
  health: { label: "Health / Wellness", emoji: "💪", description: "Taking care of their body, feeling strong, being active" },
  family: { label: "Family", emoji: "🏠", description: "Being close to family, making family proud, spending time together" },
  honesty: { label: "Honesty / Fairness", emoji: "⚖️", description: "Telling the truth, playing fair, standing up for what's right" },
  bravery: { label: "Bravery / Courage", emoji: "🦁", description: "Trying new things even when scared, facing challenges" },
};

// ─── ACT Setting Events ────────────────────────────────────────────────

export const ACT_SETTING_EVENT_OPTIONS = [
  "Rigid rule-following ('I HAVE to do it this way')",
  "Fusion with self-stories ('I'm stupid,' 'Nobody likes me')",
  "Unclear or conflicting values",
  "History of punishment for emotional expression",
  "Experiential avoidance pattern (tries to control all discomfort)",
  "Limited psychological flexibility vocabulary",
  "Fusion with past failures or negative experiences",
  "Overly compliant then explosive pattern",
];

// ─── Standard FBA Options ──────────────────────────────────────────────

export const ANTECEDENT_OPTIONS = [
  "Difficult or non-preferred tasks",
  "Transitions between activities",
  "Unstructured time (recess, lunch)",
  "Changes in routine",
  "Large group instruction",
  "Peer interactions / conflict",
  "When told 'no' or given a directive",
  "When attention is directed elsewhere",
  "When preferred items/activities are removed",
  "Sensory-rich environments (noise, lights, crowds)",
];

export const SETTING_EVENT_OPTIONS = [
  "Poor sleep the night before",
  "Missed medication",
  "Conflict at home before school",
  "Hunger / missed meals",
  "Illness or physical discomfort",
  "Change in caregiver or home situation",
  "Previous behavioral incident earlier in the day",
  "Substitute teacher or unfamiliar staff",
];

export const CONSEQUENCE_OPTIONS = [
  "Peer attention (laughter, reactions)",
  "Adult attention (reprimands, discussions)",
  "Removal from the task or activity",
  "Sent to the office / removed from class",
  "Loss of privileges",
  "Access to preferred item/activity",
  "Peer withdrawal / isolation",
  "Physical restraint or escort",
];

// ─── Metaphors & Exercises Catalog ─────────────────────────────────────

const METAPHORS_CATALOG: ACTMetaphor[] = [
  {
    name: "Passengers on the Bus",
    description: "You are the bus driver. Scary thoughts and feelings are passengers — they can yell from the back, but YOU decide where the bus goes. You can keep driving toward what matters even when the passengers are loud.",
    targetProcess: "experiential-avoidance",
    gradeLevels: ["4-5", "6-8", "9-12"],
  },
  {
    name: "Tug of War with the Monster",
    description: "Imagine you're in a tug of war with a big feelings monster over a pit. The harder you pull, the harder the monster pulls. What if you just dropped the rope? The monster is still there, but now you can walk away and do something you care about.",
    targetProcess: "experiential-avoidance",
    gradeLevels: ["1-3", "4-5", "6-8"],
  },
  {
    name: "Hands as Thoughts",
    description: "Put your hands over your eyes — that's what it's like when we get stuck in our thoughts. We can't see anything else. Now slowly lower your hands. The thoughts are still there (your hands), but now you can see the world AND your thoughts.",
    targetProcess: "cognitive-fusion",
    gradeLevels: ["1-3", "4-5", "6-8", "9-12"],
  },
  {
    name: "Thought Train",
    description: "Imagine you're at a train station. Thoughts are trains that come and go. You can watch them arrive and leave without getting on every one. Some trains are helpful — hop on! Others, just wave as they pass.",
    targetProcess: "cognitive-fusion",
    gradeLevels: ["4-5", "6-8", "9-12"],
  },
  {
    name: "Silly Voice Defusion",
    description: "Take a sticky thought (like 'I can't do this') and say it in a silly cartoon voice. Say it super slow. Say it super fast. Say it like a robot. Notice how the words start to feel different — they're just sounds, not commands.",
    targetProcess: "cognitive-fusion",
    gradeLevels: ["prek-k", "1-3", "4-5"],
  },
  {
    name: "Weather Report",
    description: "Your feelings are like weather — sometimes sunny, sometimes stormy. You are the SKY, not the weather. The sky is always there, big enough to hold any weather. What's your weather report today?",
    targetProcess: "self-as-content",
    gradeLevels: ["1-3", "4-5", "6-8"],
  },
  {
    name: "The Stage Show",
    description: "Imagine a stage where your thoughts and feelings perform. You're in the audience watching. Sometimes the show is exciting, sometimes scary — but you are the audience, not the actors. You get to watch without jumping on stage.",
    targetProcess: "self-as-content",
    gradeLevels: ["4-5", "6-8", "9-12"],
  },
  {
    name: "Noticing Game / Five Senses Check-In",
    description: "Pause and notice: 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, 1 thing you can taste. This brings you right back to NOW.",
    targetProcess: "lack-present-moment",
    gradeLevels: ["prek-k", "1-3", "4-5", "6-8", "9-12"],
  },
  {
    name: "Balloon Breathing",
    description: "Imagine your belly is a balloon. Breathe in slowly and fill the balloon up big. Breathe out slowly and let the balloon get small. Do this 3 times and notice how your body feels right now.",
    targetProcess: "lack-present-moment",
    gradeLevels: ["prek-k", "1-3", "4-5"],
  },
  {
    name: "The Values Compass",
    description: "A compass always points north — it helps you know which direction to go even when you're lost. Your values are your compass. When things get hard, ask: 'What direction does my compass point?' Then take one step that way.",
    targetProcess: "unclear-values",
    gradeLevels: ["4-5", "6-8", "9-12"],
  },
  {
    name: "Superhero Values",
    description: "If you were a superhero, what would your superpower be? Helping people? Being brave? Being creative? That superpower is a value — something that matters to you. Every day you can USE your superpower, even without a cape.",
    targetProcess: "unclear-values",
    gradeLevels: ["prek-k", "1-3", "4-5"],
  },
  {
    name: "The Tiny Step",
    description: "You don't have to climb the whole mountain today. Just one tiny step toward what matters. What's the smallest thing you could do right now that your future self would high-five you for?",
    targetProcess: "inaction",
    gradeLevels: ["4-5", "6-8", "9-12"],
  },
  {
    name: "Willingness Dial",
    description: "Imagine a dial that goes from 0 (not willing at all) to 10 (totally willing). Right now, how willing are you to feel uncomfortable AND still do what matters? You don't need to be at 10. Even a 3 is enough to take a step.",
    targetProcess: "experiential-avoidance",
    gradeLevels: ["6-8", "9-12"],
  },
  {
    name: "The Worry Wall",
    description: "Imagine building a wall out of all your worries. You stack them up to keep the scary stuff out. But the wall also keeps the GOOD stuff out — friends, fun, learning. What if you made a door in the wall instead?",
    targetProcess: "experiential-avoidance",
    gradeLevels: ["1-3", "4-5"],
  },
  {
    name: "The ACT Matrix (Point of View)",
    description: "Draw a cross on paper. Bottom: what shows up inside (thoughts/feelings). Top: what you do on the outside. Left: moving AWAY from hard stuff. Right: moving TOWARD what matters. Where is the behavior on the matrix?",
    targetProcess: "experiential-avoidance",
    gradeLevels: ["6-8", "9-12"],
  },
];

// ─── Strategy Banks ────────────────────────────────────────────────────

const ACCEPTANCE_STRATEGIES_BY_PROCESS: Record<ACTProcess, Record<GradeLevel, string[]>> = {
  "experiential-avoidance": {
    "prek-k": [
      "Use feeling faces cards — 'This is what mad looks like. It's okay to feel mad. Mad goes away.'",
      "Read books about feelings being temporary (e.g., 'The Color Monster,' 'In My Heart')",
      "Practice 'Make room for the feeling' — place hand on heart, take a breath, say 'I can feel this AND play'",
    ],
    "1-3": [
      "Teach the Tug of War metaphor — 'What if we dropped the rope with the worry monster?'",
      "Practice the Worry Wall exercise — 'Let's make a door in the wall so good things can come in too'",
      "Use a 'Feelings Welcome' mat visual — all feelings are allowed to visit",
      "Read and discuss 'I'm Not Scary' or similar ACT-aligned children's books",
    ],
    "4-5": [
      "Teach the Passengers on the Bus metaphor — noisy passengers don't drive the bus",
      "Use a willingness scale (1-10) — 'How willing are you to feel this AND still try?'",
      "Practice 'Make room' exercises — name the feeling, notice where it is in the body, breathe into it",
      "Create a personal 'Passengers' list — name the difficult thoughts/feelings that show up",
    ],
    "6-8": [
      "Introduce the Willingness Dial — adjust willingness to sit with discomfort while acting on values",
      "Teach the ACT Matrix — map away moves vs. toward moves",
      "Practice expansion/acceptance body scans — notice and make space for difficult sensations",
      "Journal: 'What am I trying to avoid? What does avoiding cost me?'",
    ],
    "9-12": [
      "Explore the ACT Matrix in depth — track away vs. toward patterns across the week",
      "Discuss creative hopelessness — 'Has controlling/avoiding your feelings actually worked long-term?'",
      "Practice mindful acceptance meditation (5-10 min) focused on allowing difficult emotions",
      "Analyze the workability of avoidance — 'What has avoidance cost you in terms of your values?'",
    ],
  },
  "cognitive-fusion": {
    "prek-k": [
      "Use 'Silly Voice' technique — say the scary thought in a funny voice",
      "Play 'The thought says...' game — externalize thoughts as something the brain says",
      "Use puppet play to show that thoughts are just words, not rules",
    ],
    "1-3": [
      "Teach the Hands as Thoughts exercise — hands over eyes = fused, hands down = defused",
      "Practice 'I'm having the thought that...' language",
      "Create 'Thought Bubbles' — draw thoughts in bubbles that float away",
      "Use the 'Thank your mind' technique — 'Thanks, brain, for trying to help!'",
    ],
    "4-5": [
      "Teach the Thought Train metaphor — watch thoughts arrive and leave without boarding every one",
      "Practice 'I notice I'm having the thought that...' defusion",
      "Create a 'Mind's Greatest Hits' — the thoughts that play on repeat (with humor)",
      "Practice saying sticky thoughts in silly voices, slowly, and quickly",
    ],
    "6-8": [
      "Explore cognitive fusion using the 'milk, milk, milk' exercise — repeat a word until it loses meaning",
      "Teach 'Thanking your mind' as a daily practice",
      "Identify common fusion traps: 'I can't,' 'I have to,' 'I should,' 'They always'",
      "Practice labeling thoughts: 'There goes my mind doing the [worry/comparison/judgment] thing again'",
    ],
    "9-12": [
      "Deep dive into defusion — explore how language creates suffering vs. reality of experience",
      "Practice writing thoughts on cards and holding them at different distances",
      "Identify and name recurring thought patterns ('The Not Good Enough Story')",
      "Explore the difference between having a thought and buying a thought",
    ],
  },
  "lack-present-moment": {
    "prek-k": [
      "Practice the Five Senses Check-In (simplified: 3 things I see, 2 I hear, 1 I touch)",
      "Use Balloon Breathing — slow, belly breaths with visual imagery",
      "Play 'Mindful Listening' — ring a bell, listen until the sound is completely gone",
    ],
    "1-3": [
      "Teach the full Five Senses Check-In (5-4-3-2-1)",
      "Practice Balloon Breathing with a stuffed animal on the belly",
      "Play 'Notice 3 New Things' — find 3 things you've never noticed in the room",
      "Do brief body scans: 'Wiggle your toes, feel your feet on the floor, notice your hands'",
    ],
    "4-5": [
      "Teach a 2-minute mindful breathing practice as a daily routine",
      "Practice 'dropping anchor' — feet on floor, stretch, notice surroundings",
      "Use mindful eating exercises (raisin exercise or similar) to build awareness",
      "Create a 'Present Moment Check-In' card for the desk",
    ],
    "6-8": [
      "Introduce brief mindfulness meditation (3-5 min) — focus on breath, return when wandering",
      "Teach 'dropping anchor' as a grounding technique for overwhelm",
      "Practice mindful walking or mindful listening exercises",
      "Journal: 'Where was my mind? Where am I now?'",
    ],
    "9-12": [
      "Build a daily 5-10 minute mindfulness practice",
      "Practice formal and informal mindfulness throughout the day",
      "Use 'dropping anchor' in real-time during stressful moments",
      "Explore the difference between being IN an experience vs. observing it",
    ],
  },
  "self-as-content": {
    "prek-k": [
      "Use the Weather Report — 'You are the big sky, feelings are the weather. Weather changes, the sky stays.'",
      "Read stories about characters who are more than one thing",
      "Use 'I can be scared AND brave at the same time' language",
    ],
    "1-3": [
      "Teach the Weather Report metaphor with drawing activities",
      "Practice 'I'm a person who sometimes feels ___, AND I'm also ___'",
      "Create a 'Me Map' — show all the different parts of who they are",
      "Use perspective-taking games: 'What would you tell a friend who said that about themselves?'",
    ],
    "4-5": [
      "Teach the Stage Show metaphor — you're the audience, not the actors",
      "Create a 'Self-Story' awareness exercise — 'What story does your mind tell about you?'",
      "Practice 'I notice my mind saying I'm ___' vs. 'I AM ___'",
      "Explore multiple roles and identities: student, friend, sibling, creator, etc.",
    ],
    "6-8": [
      "Explore self-as-context: 'You are the space where all experiences happen'",
      "Journal: 'The story my mind tells about me is... The facts are...'",
      "Practice the Observer Self exercise — notice the constant 'you' behind all changing experiences",
      "Challenge rigid self-labels with evidence of flexibility and change",
    ],
    "9-12": [
      "Deep exploration of self-as-context vs. self-as-content",
      "Practice the Chessboard metaphor — you're the board, not the pieces",
      "Explore how identity labels limit possibility and action",
      "Develop a flexible self-narrative that holds multiple truths",
    ],
  },
  "unclear-values": {
    "prek-k": [
      "Use the Superhero Values exercise — 'What superpower would you want?'",
      "Explore values through play: 'What's your favorite thing to do with friends? That shows you care about friendship!'",
      "Create a simple 'Things That Matter to Me' picture collage",
    ],
    "1-3": [
      "Do a picture-based values sort — pick images that show what matters most",
      "Teach the Values Compass — 'Your compass always points to what matters'",
      "Create a 'My Values Shield' — draw/write values on a shield shape",
      "Play 'Values Detective' — spot values in stories and movies",
    ],
    "4-5": [
      "Complete a structured values card sort activity",
      "Teach the Values Compass metaphor with a real or drawn compass",
      "Create a personal 'Values Map' or 'Values Bull's-Eye'",
      "Discuss: 'When you're being the person you WANT to be, what does that look like?'",
    ],
    "6-8": [
      "Complete a detailed values clarification questionnaire",
      "Create a Values Bull's-Eye — how close are current actions to valued directions?",
      "Explore the difference between values and goals — values are directions, not destinations",
      "Discuss how values differ from rules ('I should' vs. 'I care about')",
    ],
    "9-12": [
      "Complete a comprehensive values inventory and prioritization",
      "Write a personal values statement",
      "Create a Values Bull's-Eye and action plan for closing the gap",
      "Explore the relationship between social pressure, values, and authentic action",
    ],
  },
  "inaction": {
    "prek-k": [
      "Use 'Brave Steps' — earn a sticker for each tiny brave action toward what matters",
      "Practice with simple committed actions: 'One thing you can do today to be a good friend'",
      "Use visual first-then boards connecting actions to values",
    ],
    "1-3": [
      "Teach the Tiny Step metaphor — 'You don't have to climb the mountain, just take one step'",
      "Create a 'Brave Steps' chart — track values-consistent actions daily",
      "Break committed actions into micro-steps with visual support",
      "Celebrate effort toward values, not just outcomes",
    ],
    "4-5": [
      "Set weekly committed action goals tied to identified values",
      "Create a 'Values in Action' tracker",
      "Practice SMART committed actions — small, specific, values-connected",
      "Use 'willingness + action' pairing: 'I'm willing to feel nervous AND raise my hand'",
    ],
    "6-8": [
      "Set daily committed action goals linked to the Values Bull's-Eye",
      "Track committed actions vs. avoidance patterns over the week",
      "Practice willingness + committed action in increasingly challenging situations",
      "Create accountability partnerships for values-based goals",
    ],
    "9-12": [
      "Develop a comprehensive committed action plan across life domains",
      "Track values-consistent vs. values-inconsistent behavior patterns",
      "Build habits through small committed actions with progressive challenge",
      "Explore barriers to committed action (fusion, avoidance) and apply ACT skills",
    ],
  },
};

// ─── Function-Matched Strategies (from standard BIP, enhanced with ACT) ──

const ANTECEDENT_STRATEGIES_BY_FUNCTION: Record<BehaviorFunction, string[]> = {
  attention: [
    "Schedule regular non-contingent positive check-ins (every 15-20 min)",
    "Assign classroom jobs that provide natural positive attention",
    "Use nonverbal signals (thumbs up, proximity) to acknowledge the student during instruction",
    "Provide pre-corrective statements before attention-seeking is most likely",
    "Seat the student near the teacher for increased positive interaction opportunities",
  ],
  escape: [
    "Provide task choices when possible (choose between two equal-difficulty assignments)",
    "Break tasks into smaller steps with visual checklists",
    "Pre-teach or preview challenging material before independent work",
    "Offer a break card the student can use proactively before frustration builds",
    "Use first-then language paired with a visual board",
    "Embed high-interest topics into non-preferred assignments",
  ],
  tangible: [
    "Provide a visual schedule showing when preferred items/activities are available",
    "Use a visual timer so the student can see when access is coming",
    "Offer transition choices ('2 more minutes or 3?')",
    "Ensure preferred access is built into the schedule at predictable intervals",
  ],
  sensory: [
    "Develop a sensory diet with OT input — scheduled sensory input throughout the day",
    "Provide noise-canceling headphones or quiet workspace option",
    "Allow scheduled movement breaks every 20-30 minutes",
    "Offer sensory tools proactively (fidget, weighted lap pad, chewable)",
    "Create a calm-down area the student can request with a signal card",
  ],
};

const REINFORCEMENT_STRATEGIES_BY_FUNCTION: Record<BehaviorFunction, string[]> = {
  attention: [
    "Provide frequent behavior-specific praise for replacement behavior (5:1 positive-to-corrective ratio)",
    "Implement check-in/check-out for dedicated adult attention tied to behavioral expectations",
    "Use group contingency where student earns points for the class",
    "Provide noncontingent attention at regular intervals",
  ],
  escape: [
    "Allow earned breaks contingent on task completion or appropriate requesting",
    "Offer choice of task order when student uses replacement behavior",
    "Use first-then board: non-preferred task then preferred activity",
    "Provide immediate praise when student begins or sustains work effort",
  ],
  tangible: [
    "Implement token economy exchangeable for preferred items/activities",
    "Provide immediate access to preferred items when student requests appropriately",
    "Create a reinforcer menu updated weekly based on preference assessments",
  ],
  sensory: [
    "Provide scheduled sensory breaks independent of behavior",
    "Allow access to preferred sensory tools contingent on replacement behavior use",
    "Build sensory activities into academic tasks",
  ],
};

const RESPONSE_STRATEGIES_BY_FUNCTION: Record<BehaviorFunction, string[]> = {
  attention: [
    "Use planned ignoring for minor attention-seeking behaviors",
    "Redirect to replacement behavior with brief, neutral prompt",
    "Avoid lengthy discussions that inadvertently provide attention",
    "Provide attention immediately when student self-corrects",
  ],
  escape: [
    "Do not remove task demand when problem behavior occurs",
    "Use brief neutral redirect: 'Use your break card if you need a moment'",
    "After de-escalation, return to the task at same or slightly reduced demand",
    "Honor the request immediately when student uses replacement behavior",
  ],
  tangible: [
    "Do not provide preferred item contingent on problem behavior",
    "Use brief redirect: 'You can earn it by [replacement behavior]'",
    "Provide immediate access when student uses replacement behavior",
  ],
  sensory: [
    "Redirect to acceptable sensory alternative",
    "For harmful behaviors, implement response blocking with minimal attention",
    "Increase proactive sensory diet access",
  ],
};

// ─── Age-Appropriate ACT Language ──────────────────────────────────────

function getACTLanguage(gradeLevel: GradeLevel) {
  switch (gradeLevel) {
    case "prek-k":
      return {
        values: "things that matter to you",
        willingness: "being brave with big feelings",
        defusion: "noticing what your brain says",
        presentMoment: "paying attention to right now",
        acceptance: "letting feelings visit",
        committedAction: "doing brave things",
      };
    case "1-3":
      return {
        values: "what's important to you",
        willingness: "making room for hard feelings AND doing what matters",
        defusion: "watching your thoughts like clouds",
        presentMoment: "being here right now",
        acceptance: "making space for all feelings",
        committedAction: "taking brave steps toward what matters",
      };
    case "4-5":
      return {
        values: "your values — what matters most to you",
        willingness: "being willing to feel uncomfortable AND act on your values",
        defusion: "unhooking from sticky thoughts",
        presentMoment: "dropping anchor in the present moment",
        acceptance: "opening up to difficult feelings instead of fighting them",
        committedAction: "committed actions — steps toward your values",
      };
    case "6-8":
      return {
        values: "personal values — the directions you want your life to go",
        willingness: "psychological willingness — making room for discomfort in service of values",
        defusion: "cognitive defusion — creating distance from unhelpful thoughts",
        presentMoment: "present-moment awareness — grounding in the here and now",
        acceptance: "acceptance — allowing difficult internal experiences without struggling with them",
        committedAction: "committed action — specific, values-aligned behavior patterns",
      };
    case "9-12":
      return {
        values: "core values — freely chosen life directions that guide meaningful action",
        willingness: "experiential willingness — openness to the full range of human experience in service of valued living",
        defusion: "cognitive defusion — recognizing thoughts as mental events rather than literal truths",
        presentMoment: "present-moment awareness — flexible attention to the here and now",
        acceptance: "acceptance — active, non-judgmental embrace of internal experiences",
        committedAction: "committed action — ongoing patterns of values-consistent behavior",
      };
  }
}

// ─── Values Descriptions by Grade ──────────────────────────────────────

function getValueDescription(value: ValueDomain, grade: GradeLevel): string {
  const descriptions: Record<ValueDomain, Record<GradeLevel, string>> = {
    relationships: {
      "prek-k": `being a good friend — sharing, taking turns, and playing nicely with others`,
      "1-3": `friendship — being someone others can count on, including friends in activities, and solving problems together`,
      "4-5": `building and maintaining friendships — being trustworthy, standing up for friends, and working through disagreements`,
      "6-8": `meaningful connections with peers — building trust, communicating openly, and showing loyalty`,
      "9-12": `authentic relationships — investing in connections that matter, being vulnerable, and supporting others`,
    },
    learning: {
      "prek-k": `being curious and trying new things at school`,
      "1-3": `discovering new things and getting better at skills, even when it's hard`,
      "4-5": `growing as a learner — tackling challenges, asking questions, and not giving up`,
      "6-8": `academic growth and intellectual curiosity — pushing past comfort zones to learn new things`,
      "9-12": `lifelong learning — pursuing knowledge and skills that matter for their future`,
    },
    play: {
      "prek-k": `having fun — laughing, playing games, and enjoying activities`,
      "1-3": `enjoying activities, being creative during play, and having fun with friends`,
      "4-5": `having fun and being playful — balancing enjoyment with responsibilities`,
      "6-8": `recreation and enjoyment — finding joy and balance in daily life`,
      "9-12": `leisure and enjoyment — maintaining balance, joy, and recreation alongside responsibilities`,
    },
    independence: {
      "prek-k": `doing things by themselves — like getting dressed, cleaning up, or making choices`,
      "1-3": `being independent — doing schoolwork on their own, making good choices, and being responsible`,
      "4-5": `growing independence — taking responsibility, making decisions, and managing their own behavior`,
      "6-8": `autonomy and self-direction — making responsible choices and taking ownership of their actions`,
      "9-12": `personal autonomy — self-governance, making informed decisions, and accepting responsibility`,
    },
    kindness: {
      "prek-k": `being kind — helping friends, sharing, and caring about others' feelings`,
      "1-3": `kindness and helping — being nice to others, helping when someone needs it, and caring`,
      "4-5": `compassion — going out of their way to help others and being considerate of feelings`,
      "6-8": `compassion and service — actively helping others and contributing to the community`,
      "9-12": `altruism and social responsibility — making a positive impact on others and the community`,
    },
    creativity: {
      "prek-k": `making things — drawing, building, pretending, and using their imagination`,
      "1-3": `creating — drawing, writing stories, building things, and expressing ideas`,
      "4-5": `creative expression — making art, writing, inventing, and expressing unique ideas`,
      "6-8": `creative expression and innovation — finding unique ways to solve problems and express themselves`,
      "9-12": `creativity and self-expression — developing a unique voice and contributing original ideas`,
    },
    health: {
      "prek-k": `taking care of their body — eating good food, playing outside, and getting rest`,
      "1-3": `being healthy — eating well, staying active, and taking care of their body`,
      "4-5": `health and wellness — making choices that keep their body and mind strong`,
      "6-8": `physical and mental wellness — developing healthy habits for body and mind`,
      "9-12": `holistic wellness — integrating physical health, mental health, and self-care practices`,
    },
    family: {
      "prek-k": `being close to family — spending time together, helping at home, and making family happy`,
      "1-3": `family connection — being a good family member, helping at home, and making family proud`,
      "4-5": `family relationships — contributing at home, communicating with family, and honoring family connections`,
      "6-8": `family bonds — maintaining closeness, contributing to the household, and navigating family relationships`,
      "9-12": `family connection — investing in family relationships while developing personal identity`,
    },
    honesty: {
      "prek-k": `telling the truth and playing fair`,
      "1-3": `being honest — telling the truth even when it's hard, and playing fair`,
      "4-5": `integrity — being honest, keeping promises, and standing up for fairness`,
      "6-8": `honesty and integrity — being truthful, fair, and consistent in words and actions`,
      "9-12": `personal integrity — aligning actions with principles, honesty, and moral courage`,
    },
    bravery: {
      "prek-k": `being brave — trying new things even when feeling scared`,
      "1-3": `courage — facing challenges, trying hard things, and not giving up when scared`,
      "4-5": `bravery — pushing through fear to do what matters, standing up for others`,
      "6-8": `courage — taking risks in service of values, facing fears, and being authentic`,
      "9-12": `courage and authenticity — living according to values even when it's difficult or unpopular`,
    },
  };
  return descriptions[value][grade];
}

// ─── Values Activities by Grade ────────────────────────────────────────

function getValuesActivities(values: ValueDomain[], grade: GradeLevel): string[] {
  const activities: string[] = [];
  const lang = getACTLanguage(grade);

  for (const value of values) {
    switch (grade) {
      case "prek-k":
        activities.push(`Values picture card: Create a simple picture showing ${VALUE_LABELS[value].label.toLowerCase()} — 'This is what ${VALUE_LABELS[value].label.toLowerCase()} looks like for me'`);
        break;
      case "1-3":
        activities.push(`Values Shield activity: Draw or write about ${VALUE_LABELS[value].label.toLowerCase()} on a personal values shield`);
        activities.push(`Values Detective: Identify characters in stories who show ${VALUE_LABELS[value].label.toLowerCase()}`);
        break;
      case "4-5":
        activities.push(`Values Card Sort: Rank ${VALUE_LABELS[value].label.toLowerCase()} among other values and discuss why it matters`);
        activities.push(`Values in Action journal: Daily entry on one thing done for ${VALUE_LABELS[value].label.toLowerCase()}`);
        break;
      case "6-8":
        activities.push(`Values Bull's-Eye: Rate current actions related to ${VALUE_LABELS[value].label.toLowerCase()} and set specific committed actions`);
        activities.push(`Weekly values reflection: 'This week I moved toward ${VALUE_LABELS[value].label.toLowerCase()} by...'`);
        break;
      case "9-12":
        activities.push(`Comprehensive values assessment: Write about the role of ${VALUE_LABELS[value].label.toLowerCase()} in your life and set long-term committed actions`);
        activities.push(`Values-action gap analysis: Where are you regarding ${VALUE_LABELS[value].label.toLowerCase()} and where do you want to be?`);
        break;
    }
  }

  // Add general values activities
  switch (grade) {
    case "prek-k":
      activities.push("Daily 'Values Check-In' using picture cards: 'Today I was a good friend / brave / kind'");
      break;
    case "1-3":
      activities.push("Weekly Values Celebration: Share one thing from the week that matched a value");
      break;
    case "4-5":
      activities.push("Create a Values Compass poster to display at the student's desk");
      break;
    case "6-8":
      activities.push("Monthly Values Bull's-Eye review with mentor or counselor");
      break;
    case "9-12":
      activities.push("Bi-weekly values journal review and committed action planning");
      break;
  }

  return activities;
}

// ─── Generator ─────────────────────────────────────────────────────────

export function generateACTBIP(data: ACTFBAData): GeneratedACTBIP {
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const name = data.studentName || "[Student Name]";
  const grade = data.gradeLevel;
  const lang = getACTLanguage(grade);

  // ── Behavior Definitions ──
  const behaviorDefinitions = data.targetBehaviors.map((b) => ({
    name: b.name,
    definition: b.operationalDefinition,
    frequency: b.frequency,
    duration: b.duration,
    intensity: b.intensity,
  }));

  // ── Function Summary (standard + ACT lens) ──
  const funcLabels = data.functions.map((f) => {
    const map: Record<BehaviorFunction, string> = { attention: "attention", escape: "escape/avoidance", tangible: "access to tangible items/activities", sensory: "sensory regulation" };
    return map[f];
  });
  let functionSummary = `Based on the FBA, ${name}'s behavior primarily functions to obtain ${funcLabels.join(" and ")}.`;
  if (data.functionNotes) functionSummary += ` ${data.functionNotes}`;

  // ACT lens on function
  const actProcessLabels = data.inflexibilityProcesses.map((p) => ACT_PROCESS_LABELS[p].label.toLowerCase());
  functionSummary += `\n\nACT-Informed Functional Analysis: Through an ACT lens, ${name}'s behavior can be understood as ${data.actFunctionalAnalysis || `a form of experiential avoidance, where the behavior serves to escape or control difficult internal experiences (thoughts, feelings, sensations). Key areas of psychological inflexibility include: ${actProcessLabels.join(", ")}.`}`;
  functionSummary += ` When ${name} is disconnected from ${lang.values}, the behavior moves them AWAY from what matters, even though it provides short-term relief.`;

  // ── Values Assessment ──
  const valuesDescriptions = data.studentValues.map((v) => {
    const desc = getValueDescription(v, grade);
    return `${VALUE_LABELS[v].emoji} **${VALUE_LABELS[v].label}**: ${name} values ${desc}.`;
  });
  const valuesActivitiesList = getValuesActivities(data.studentValues, grade);

  // ── Psych Flex Assessment ──
  const processDescriptions = data.inflexibilityProcesses.map((p) => {
    const info = ACT_PROCESS_LABELS[p];
    return `${info.emoji} **${info.label}**: ${name} ${info.description.charAt(0).toLowerCase()}${info.description.slice(1)}.`;
  });

  // ── ACT Setting Events Summary ──
  const actSettingEventsSummary = [
    ...data.actSettingEvents,
    ...(data.customACTSettingEvents ? [data.customACTSettingEvents] : []),
  ];

  // ── Antecedent Strategies (standard) ──
  const antecedentStrategies: string[] = [];
  for (const func of data.functions) {
    antecedentStrategies.push(...(ANTECEDENT_STRATEGIES_BY_FUNCTION[func] || []).slice(0, 3));
  }

  // ── Values-Aligned Replacement Behaviors ──
  const valuesAlignedReplacements = data.replacementBehaviors.map((rb) => {
    return `**${rb.behavior}** — This replacement behavior connects to ${name}'s value of ${rb.valueConnection || "what matters to them"}. Instead of moving AWAY from discomfort, this behavior moves ${name} TOWARD ${lang.values}.`;
  });

  // ── Acceptance Strategies ──
  const acceptanceStrategies: string[] = [];
  for (const process of data.inflexibilityProcesses) {
    const strats = ACCEPTANCE_STRATEGIES_BY_PROCESS[process]?.[grade];
    if (strats) acceptanceStrategies.push(...strats.slice(0, 2));
  }

  // ── Defusion Techniques ──
  const defusionTechniques: string[] = [];
  const fusionStrats = ACCEPTANCE_STRATEGIES_BY_PROCESS["cognitive-fusion"]?.[grade] || [];
  defusionTechniques.push(...fusionStrats.slice(0, 3));
  if (data.inflexibilityProcesses.includes("self-as-content")) {
    const selfStrats = ACCEPTANCE_STRATEGIES_BY_PROCESS["self-as-content"]?.[grade] || [];
    defusionTechniques.push(...selfStrats.slice(0, 2));
  }

  // ── Metaphors & Exercises ──
  const metaphorsAndExercises = METAPHORS_CATALOG.filter(
    (m) => m.gradeLevels.includes(grade) && data.inflexibilityProcesses.includes(m.targetProcess)
  );
  // Also add values and general metaphors
  const valuesMetaphors = METAPHORS_CATALOG.filter(
    (m) => m.gradeLevels.includes(grade) && (m.targetProcess === "unclear-values" || m.targetProcess === "lack-present-moment")
  );
  const allMetaphors = [...new Map([...metaphorsAndExercises, ...valuesMetaphors].map((m) => [m.name, m])).values()];

  // ── Committed Action Goals ──
  const committedActionGoals: string[] = [];
  for (const value of data.studentValues.slice(0, 3)) {
    const valueLabel = VALUE_LABELS[value].label;
    switch (grade) {
      case "prek-k":
        committedActionGoals.push(`${name} will take one brave step toward ${valueLabel.toLowerCase()} each day (e.g., sharing a toy, trying a hard task) with adult prompting, as tracked on a visual chart.`);
        break;
      case "1-3":
        committedActionGoals.push(`${name} will identify and complete one committed action related to ${valueLabel.toLowerCase()} per day, moving from adult-prompted to self-initiated within 8 weeks.`);
        break;
      case "4-5":
        committedActionGoals.push(`${name} will set weekly committed action goals tied to ${valueLabel.toLowerCase()} and complete 3 of 5 daily, as tracked on a Values in Action log.`);
        break;
      case "6-8":
        committedActionGoals.push(`${name} will independently set and track committed actions related to ${valueLabel.toLowerCase()}, completing 80% of weekly goals within 12 weeks.`);
        break;
      case "9-12":
        committedActionGoals.push(`${name} will develop and implement a personal committed action plan for ${valueLabel.toLowerCase()}, self-monitoring weekly and achieving 80% values-consistency within 12 weeks.`);
        break;
    }
  }

  // ── Teaching Strategies (ACT-enhanced) ──
  const teachingStrategies: string[] = [
    `Teach ${name} to recognize 'away moves' vs. 'toward moves' using age-appropriate language (${lang.defusion})`,
    `Explicitly teach the replacement behavior(s) using modeling, role-play, and practice in natural settings`,
    ...data.replacementBehaviors.map((rb) =>
      `Practice ${rb.behavior} during structured teaching sessions, connecting it to ${name}'s value of ${rb.valueConnection || "what matters"}`
    ),
    `Use ${lang.willingness} exercises before situations where the problem behavior is most likely`,
    `Teach ${lang.presentMoment} skills as a daily routine (e.g., brief check-in at the start of each class)`,
  ];
  if (data.inflexibilityProcesses.includes("cognitive-fusion")) {
    teachingStrategies.push(`Teach ${lang.defusion} techniques — help ${name} recognize that thoughts are thoughts, not facts or commands`);
  }

  // ── Reinforcement Strategies (ACT-enhanced) ──
  const reinforcementStrategies: string[] = [];
  for (const func of data.functions) {
    reinforcementStrategies.push(...(REINFORCEMENT_STRATEGIES_BY_FUNCTION[func] || []).slice(0, 2));
  }
  reinforcementStrategies.push(
    `Celebrate values-consistent behavior with specific feedback: 'You chose to [action] even when it was hard — that shows you really care about [value]'`,
    `Use a Values in Action tracker where ${name} earns recognition for moving TOWARD values, not just reducing problem behavior`,
  );

  // ── Response Strategies ──
  const responseStrategies: string[] = [];
  for (const func of data.functions) {
    responseStrategies.push(...(RESPONSE_STRATEGIES_BY_FUNCTION[func] || []).slice(0, 2));
  }
  responseStrategies.push(
    `After de-escalation, briefly reconnect to values: 'I know [value] matters to you. What's one small step you can take right now?'`,
    `Avoid shame-based responses — frame behavior as an 'away move' rather than 'bad behavior'`,
  );

  // ── Data Collection (ACT-enhanced) ──
  const dataCollectionPlan = [
    `Frequency data on target problem behavior(s): ${behaviorDefinitions.map((b) => b.name).join(", ")} — daily during identified target periods`,
    `Frequency data on replacement behavior use — daily tally of independent use of values-aligned replacement behaviors`,
    `Values-consistent behavior rating: Daily 1-5 rating of overall values-consistency (staff-completed)`,
    `Psychological flexibility check-in: Weekly student self-report on ${lang.willingness} (adapted for age)`,
    `Committed action completion: Weekly percentage of committed action goals completed`,
  ];

  // ── Values-Consistent Monitoring ──
  const valuesConsistentMonitoring = [
    `Track 'toward moves' vs. 'away moves' across the week using the ACT Matrix visual`,
    `Monthly Values Bull's-Eye review — is ${name} getting closer to living out identified values?`,
    `Review committed action goal completion rate monthly — target 80% within 12 weeks`,
    `Re-administer psychological flexibility assessment (e.g., simplified CPFQ) quarterly to track growth`,
    `Monitor not just behavior REDUCTION but behavior QUALITY — is the student engaging in values-aligned actions?`,
  ];

  // ── Crisis Plan ──
  let crisisPlan: string[] | null = null;
  if (data.safetyConcerrns) {
    crisisPlan = [
      `Safety concerns identified: ${data.safetyConcernDetails || "See FBA documentation"}`,
      "",
      "If the student engages in behavior posing risk of harm:",
      "1. Ensure safety of all students — clear the area if necessary",
      "2. Remain calm, use low steady voice — avoid physical intervention unless trained/authorized",
      "3. Remove potential hazards from the area",
      "4. Contact designated crisis team member or administrator immediately",
      "5. Use approved crisis intervention procedures per district policy",
      "6. Document the incident within 24 hours",
      "7. Conduct team debrief within 48 hours",
      "8. Contact family same day per district protocol",
      "9. Review and update BIP within one week following crisis",
      "",
      "ACT-Informed Crisis Recovery:",
      "• After safety is established, use grounding/present-moment technique",
      "• Reconnect to values without judgment: 'I know this isn't how you want things to go'",
      "• Avoid shame — frame as 'a hard moment' not a definition of who they are",
      "• Plan one small committed action for re-engagement",
    ];
  }

  // ── Generalization ──
  const generalizationPlan = [
    "Train all staff on ACT-informed BIP strategies — consistency across adults is critical",
    "Implement across at least 3 settings from the start (classroom, specials, cafeteria/recess)",
    `Use the same values language across settings — all staff reference ${name}'s identified values`,
    "Practice ACT skills (defusion, willingness, present-moment) in varied contexts with different people",
    "Gradually fade prompts as student demonstrates independent use of ACT skills and replacement behaviors",
    "Schedule monthly team check-ins to ensure consistent implementation",
  ];

  // ── Maintenance ──
  const maintenancePlan = [
    `Fade external reinforcement as ${name} increasingly self-monitors values-consistent behavior`,
    "Transition from staff-led ACT exercises to student-initiated use of skills",
    `Review and update values assessment quarterly — values may shift as ${name} grows`,
    "Build ACT skills into the daily routine (brief mindfulness, values check-in) for long-term maintenance",
    "Plan for booster sessions during transitions (new school year, class change, life stressors)",
    "Celebrate growth in psychological flexibility, not just behavior numbers",
  ];

  return {
    studentInfo: {
      name,
      age: data.studentAge || "[Age]",
      grade: data.studentGrade || "[Grade]",
      school: data.school || "[School]",
      dateOfFBA: data.dateOfFBA || "[FBA Date]",
      dateOfBIP: today,
      teamMembers: data.teamMembers || "[Team Members]",
    },
    behaviorDefinitions,
    functionSummary,
    antecedentStrategies: [...new Set(antecedentStrategies)],
    valuesAssessment: {
      identifiedValues: data.studentValues,
      valuesDescriptions,
      valuesActivities: valuesActivitiesList,
    },
    psychFlexAssessment: {
      identifiedProcesses: data.inflexibilityProcesses,
      processDescriptions,
    },
    actFunctionalAnalysis: functionSummary,
    actSettingEventsSummary,
    valuesAlignedReplacements,
    acceptanceStrategies: [...new Set(acceptanceStrategies)],
    defusionTechniques: [...new Set(defusionTechniques)],
    valuesActivities: valuesActivitiesList,
    committedActionGoals,
    metaphorsAndExercises: allMetaphors,
    teachingStrategies,
    reinforcementStrategies: [...new Set(reinforcementStrategies)],
    responseStrategies: [...new Set(responseStrategies)],
    dataCollectionPlan,
    valuesConsistentMonitoring,
    crisisPlan,
    generalizationPlan,
    maintenancePlan,
  };
}

// ─── Text Export ────────────────────────────────────────────────────────

export function actBipToText(bip: GeneratedACTBIP): string {
  const lines: string[] = [];
  const hr = "─".repeat(60);

  lines.push("ACT-INFORMED FUNCTIONAL BEHAVIOR ASSESSMENT & BEHAVIOR INTERVENTION PLAN");
  lines.push(hr);
  lines.push("");
  lines.push(`Student: ${bip.studentInfo.name}`);
  lines.push(`Age: ${bip.studentInfo.age}  |  Grade: ${bip.studentInfo.grade}  |  School: ${bip.studentInfo.school}`);
  lines.push(`Date of FBA: ${bip.studentInfo.dateOfFBA}  |  Date of BIP: ${bip.studentInfo.dateOfBIP}`);
  lines.push(`Team: ${bip.studentInfo.teamMembers}`);
  lines.push("");

  lines.push(hr);
  lines.push("PART 1: ACT-INFORMED FUNCTIONAL BEHAVIOR ASSESSMENT");
  lines.push(hr);
  lines.push("");

  lines.push("TARGET BEHAVIOR DEFINITIONS");
  lines.push(hr);
  for (const b of bip.behaviorDefinitions) {
    lines.push(`• ${b.name}: ${b.definition}`);
    lines.push(`  Frequency: ${b.frequency || "—"} | Duration: ${b.duration || "—"} | Intensity: ${b.intensity}`);
  }
  lines.push("");

  lines.push("VALUES ASSESSMENT");
  lines.push(hr);
  for (const d of bip.valuesAssessment.valuesDescriptions) lines.push(`• ${d.replace(/\*\*/g, "")}`);
  lines.push("");

  lines.push("PSYCHOLOGICAL FLEXIBILITY ASSESSMENT");
  lines.push(hr);
  for (const d of bip.psychFlexAssessment.processDescriptions) lines.push(`• ${d.replace(/\*\*/g, "")}`);
  lines.push("");

  lines.push("FUNCTIONAL ANALYSIS (STANDARD + ACT LENS)");
  lines.push(hr);
  lines.push(bip.functionSummary.replace(/\*\*/g, ""));
  lines.push("");

  if (bip.actSettingEventsSummary.length > 0) {
    lines.push("ACT-SPECIFIC SETTING EVENTS");
    lines.push(hr);
    for (const s of bip.actSettingEventsSummary) lines.push(`• ${s}`);
    lines.push("");
  }

  lines.push(hr);
  lines.push("PART 2: ACT-INFORMED BEHAVIOR INTERVENTION PLAN");
  lines.push(hr);
  lines.push("");

  lines.push("VALUES-ALIGNED REPLACEMENT BEHAVIORS");
  lines.push(hr);
  for (const r of bip.valuesAlignedReplacements) lines.push(`• ${r.replace(/\*\*/g, "")}`);
  lines.push("");

  lines.push("ANTECEDENT / PREVENTION STRATEGIES");
  lines.push(hr);
  for (const s of bip.antecedentStrategies) lines.push(`• ${s}`);
  lines.push("");

  lines.push("ACCEPTANCE-BASED STRATEGIES");
  lines.push(hr);
  for (const s of bip.acceptanceStrategies) lines.push(`• ${s}`);
  lines.push("");

  lines.push("DEFUSION TECHNIQUES");
  lines.push(hr);
  for (const s of bip.defusionTechniques) lines.push(`• ${s}`);
  lines.push("");

  lines.push("VALUES CLARIFICATION ACTIVITIES");
  lines.push(hr);
  for (const s of bip.valuesActivities) lines.push(`• ${s}`);
  lines.push("");

  lines.push("COMMITTED ACTION GOALS");
  lines.push(hr);
  for (const [i, g] of bip.committedActionGoals.entries()) lines.push(`${i + 1}. ${g}`);
  lines.push("");

  lines.push("METAPHORS & EXERCISES");
  lines.push(hr);
  for (const m of bip.metaphorsAndExercises) {
    lines.push(`• ${m.name}: ${m.description}`);
  }
  lines.push("");

  lines.push("TEACHING STRATEGIES");
  lines.push(hr);
  for (const s of bip.teachingStrategies) lines.push(`• ${s}`);
  lines.push("");

  lines.push("REINFORCEMENT STRATEGIES");
  lines.push(hr);
  for (const s of bip.reinforcementStrategies) lines.push(`• ${s}`);
  lines.push("");

  lines.push("RESPONSE TO PROBLEM BEHAVIOR");
  lines.push(hr);
  for (const s of bip.responseStrategies) lines.push(`• ${s}`);
  lines.push("");

  lines.push("DATA COLLECTION PLAN");
  lines.push(hr);
  for (const s of bip.dataCollectionPlan) lines.push(`• ${s}`);
  lines.push("");

  lines.push("VALUES-CONSISTENT PROGRESS MONITORING");
  lines.push(hr);
  for (const s of bip.valuesConsistentMonitoring) lines.push(`• ${s}`);
  lines.push("");

  if (bip.crisisPlan) {
    lines.push("CRISIS / SAFETY PLAN");
    lines.push(hr);
    for (const s of bip.crisisPlan) lines.push(s.match(/^\d+\./) ? `  ${s}` : s ? `• ${s}` : "");
    lines.push("");
  }

  lines.push("GENERALIZATION PLAN");
  lines.push(hr);
  for (const s of bip.generalizationPlan) lines.push(`• ${s}`);
  lines.push("");

  lines.push("MAINTENANCE PLAN");
  lines.push(hr);
  for (const s of bip.maintenancePlan) lines.push(`• ${s}`);
  lines.push("");

  lines.push(hr);
  lines.push("Generated by Behavior School — behaviorschool.com/act-fba-bip");
  lines.push("This ACT-informed FBA/BIP should be reviewed and customized by the student's behavior support team.");

  return lines.join("\n");
}
