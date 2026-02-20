export interface GoalTemplate {
  id: string;
  emoji: string;
  title: string;
  description: string;
  color: string;
  // Pre-fill values
  valueIndex: number; // index into valueOptions
  customValue?: string;
  behaviorType: "increase" | "decrease";
  behavior: string;
  replacementBehavior: string;
  baseline: number;
  target: number;
  measurementMethod: string;
  fluencyEnabled: boolean;
  fluencySeconds: number;
  generalization: string[];
  maintenanceWeeks: number;
  // Extra context
  interventionStrategies: string[];
}

export const goalTemplates: GoalTemplate[] = [
  {
    id: "elopement",
    emoji: "🚪",
    title: "Elopement / Running",
    description:
      "Student leaves the designated area (classroom, group, campus) without adult permission.",
    color: "red",
    valueIndex: 7, // Responsible
    behaviorType: "decrease",
    behavior: "leaving the designated area without adult permission",
    replacementBehavior:
      "requesting a break using a break card or verbal request and waiting for adult approval before leaving the area",
    baseline: 65,
    target: 90,
    measurementMethod: "Frequency count",
    fluencyEnabled: true,
    fluencySeconds: 10,
    generalization: [
      "Structured classroom",
      "Transitions",
      "Lunch/recess",
      "Specials (PE, art, music)",
    ],
    maintenanceWeeks: 6,
    interventionStrategies: [
      "Teach a functionally equivalent break request (break card, verbal script, or device-based request)",
      "Conduct a preference assessment to stock the break area with reinforcing items",
      "Use precorrection before high-risk transitions: 'Remember, if you need space, show me your break card'",
      "Implement a first–then visual schedule linking non-preferred tasks to preferred activities",
      "Position staff near exits during transitions; use proximity rather than physical blocking",
      "Reinforce staying in the area on a fixed-interval schedule, gradually thinning the schedule as skill builds",
      "Debrief after elopement incidents using a structured re-entry protocol (no lecturing; reteach the replacement)",
    ],
  },
  {
    id: "physical-aggression",
    emoji: "🛡️",
    title: "Physical Aggression",
    description:
      "Hitting, kicking, pushing, scratching, or throwing objects at peers or staff.",
    color: "orange",
    valueIndex: 0, // Kind
    behaviorType: "decrease",
    behavior:
      "physical aggression (hitting, kicking, pushing, or throwing objects at others)",
    replacementBehavior:
      "using a calm-down strategy (deep breaths, hands to self, or walking to a designated cool-down area) and communicating the need verbally or with a visual support",
    baseline: 70,
    target: 90,
    measurementMethod: "Frequency count",
    fluencyEnabled: true,
    fluencySeconds: 5,
    generalization: [
      "Structured classroom",
      "Small group instruction",
      "Lunch/recess",
      "Transitions",
    ],
    maintenanceWeeks: 6,
    interventionStrategies: [
      "Teach and practice at least three calm-down strategies during non-crisis times (role-play, video modeling)",
      "Create a personal 'calm plan' card the student carries or keeps on the desk",
      "Use social narratives (social stories) that describe expected vs. unexpected behavior in conflict situations",
      "Implement differential reinforcement of alternative behavior (DRA): immediately reinforce safe communication",
      "Establish a non-contingent reinforcement schedule for attention if the function is attention-maintained",
      "Precorrect before high-risk activities: 'We're going to recess. Remember: hands to yourself, use your words'",
      "Train all adults in the environment to respond consistently: redirect, prompt the replacement, avoid power struggles",
      "Collect ABC data for two weeks to confirm function before adjusting the intervention",
    ],
  },
  {
    id: "self-regulation",
    emoji: "🧘",
    title: "Self-Regulation",
    description:
      "Difficulty managing emotions — frequent meltdowns, escalation, or shutting down when frustrated or overwhelmed.",
    color: "purple",
    valueIndex: 1, // Brave
    behaviorType: "increase",
    behavior:
      "independently using a self-regulation strategy (identifying the emotion, selecting a coping tool, and returning to the task) when frustrated or overwhelmed",
    replacementBehavior: "",
    baseline: 25,
    target: 80,
    measurementMethod: "Interval recording",
    fluencyEnabled: true,
    fluencySeconds: 15,
    generalization: [
      "Structured classroom",
      "Small group instruction",
      "Independent work time",
      "Transitions",
      "Specials (PE, art, music)",
    ],
    maintenanceWeeks: 6,
    interventionStrategies: [
      "Teach the Zones of Regulation framework: help the student identify their current zone and match a strategy",
      "Create a personal regulation toolkit (sensory items, breathing cards, movement breaks) accessible at the desk",
      "Use an emotion thermometer or 5-point scale to build interoception and self-monitoring skills",
      "Practice regulation strategies during calm moments so they're fluent before the student needs them",
      "Implement scheduled movement breaks (every 20–30 minutes) to prevent escalation before it starts",
      "Use co-regulation: sit near the student, model slow breathing, use a calm/flat voice during early escalation",
      "Reinforce any attempt to use a strategy, even if imperfect — shape toward independence over time",
      "Debrief after dysregulation using a structured reflection sheet (what happened, what I tried, what I'd do next time)",
    ],
  },
  {
    id: "task-refusal",
    emoji: "📋",
    title: "Task Refusal / Non-Compliance",
    description:
      "Refusing to follow adult directions, begin assigned work, or complete tasks within expected time frames.",
    color: "amber",
    valueIndex: 7, // Responsible
    behaviorType: "decrease",
    behavior:
      "task refusal (refusing to begin or complete assigned academic or non-academic tasks within 2 minutes of the direction)",
    replacementBehavior:
      "beginning the task within 2 minutes of the direction or appropriately requesting help, a modified task, or a brief delay using a verbal or visual script",
    baseline: 55,
    target: 85,
    measurementMethod: "Interval recording",
    fluencyEnabled: true,
    fluencySeconds: 10,
    generalization: [
      "Structured classroom",
      "Small group instruction",
      "Independent work time",
      "With different adults",
    ],
    maintenanceWeeks: 5,
    interventionStrategies: [
      "Offer choice within the task (which problems, what order, pen or pencil) to increase perceived autonomy",
      "Use high-probability request sequences (3 easy requests → 1 harder request) to build behavioral momentum",
      "Break tasks into smaller, visually clear chunks with check-off boxes — reduce perceived response effort",
      "Teach and reinforce an 'I need help' or 'Can I have more time?' script so refusal isn't the only escape route",
      "Implement a first–then board: pair the non-preferred task with an immediate preferred activity",
      "Provide specific, immediate praise for task initiation: 'You got started right away — that's responsible'",
      "Use precision requests: give the direction once clearly, wait 5–10 seconds, then restate once with the consequence framed positively",
      "Analyze whether the work is at the correct instructional level — refusal often signals a skill deficit, not defiance",
    ],
  },
  {
    id: "social-skills",
    emoji: "🤝",
    title: "Social Skills",
    description:
      "Difficulty with peer interactions — turn-taking, initiating conversation, reading social cues, or maintaining friendships.",
    color: "blue",
    valueIndex: 0, // Kind
    behaviorType: "increase",
    behavior:
      "engaging in prosocial interactions with peers (initiating conversation, taking turns, responding to social bids, and using appropriate volume and body language)",
    replacementBehavior: "",
    baseline: 30,
    target: 80,
    measurementMethod: "Interval recording",
    fluencyEnabled: false,
    fluencySeconds: 5,
    generalization: [
      "Small group instruction",
      "Lunch/recess",
      "Specials (PE, art, music)",
      "Structured classroom",
    ],
    maintenanceWeeks: 6,
    interventionStrategies: [
      "Run structured social skills groups (2–3x/week) using evidence-based curricula (e.g., Social Thinking, Skillstreaming)",
      "Use video modeling to demonstrate target social behaviors — pause and discuss what the person did and why it worked",
      "Set up peer-mediated interventions: train 2–3 peers to initiate, include, and reinforce the target student",
      "Create structured cooperative activities in class (partner reading, shared projects) with clear social roles",
      "Use social narratives before unstructured times: 'At recess, you can say \"Can I play?\" or stand near the group and smile'",
      "Reinforce specific social behaviors immediately: 'You asked Jordan a question and waited for the answer — great conversation!'",
      "Practice conversation scripts (greeting → question → listen → respond → exit) and role-play until fluent",
      "Monitor with a social interaction data sheet during recess/lunch to track initiations, responses, and duration of interactions",
    ],
  },
  {
    id: "following-directions",
    emoji: "👂",
    title: "Following Directions",
    description:
      "Student struggles to follow teacher directions within expected time frames, needing multiple prompts.",
    color: "teal",
    valueIndex: 7, // Responsible
    behaviorType: "increase",
    behavior:
      "following adult directions within 10 seconds of the first prompt without additional prompting",
    replacementBehavior: "",
    baseline: 35,
    target: 85,
    measurementMethod: "Teacher observation",
    fluencyEnabled: true,
    fluencySeconds: 10,
    generalization: [
      "Structured classroom",
      "Small group instruction",
      "Independent work time",
      "With different adults",
    ],
    maintenanceWeeks: 4,
    interventionStrategies: [
      "Use precision requests: clear, specific direction → 5-10 second wait time → restate once if needed",
      "Implement a 'first direction' reinforcement system: immediate praise for compliance on first prompt",
      "Pre-teach expected behaviors before transitions: 'In 2 minutes we will...'",
      "Use visual supports (first-then boards, checklists) to make directions concrete",
      "Provide choices within compliance: 'Would you like to start with math or reading?'",
      "Practice following directions during calm times with high-probability sequences",
      "Reduce competing reinforcers during instruction time",
    ],
  },
  {
    id: "attention-on-task",
    emoji: "🎯",
    title: "Attention / On-Task Behavior",
    description:
      "Student has difficulty staying focused, frequently off-task, or looking away from instruction.",
    color: "indigo",
    valueIndex: 2, // Focused
    behaviorType: "increase",
    behavior:
      "remaining on-task (eyes on work, hands on materials, responding to prompts) during instructional activities",
    replacementBehavior: "",
    baseline: 30,
    target: 80,
    measurementMethod: "Interval recording",
    fluencyEnabled: false,
    fluencySeconds: 5,
    generalization: [
      "Structured classroom",
      "Small group instruction",
      "Independent work time",
    ],
    maintenanceWeeks: 5,
    interventionStrategies: [
      "Use momentary time sampling to track on-task behavior every 3-5 minutes",
      "Implement scheduled movement breaks every 15-20 minutes",
      "Provide a visual timer so student can see remaining work time",
      "Use proximity and non-verbal cues (tap on desk, point to work) before verbal redirection",
      "Teach self-monitoring: student tracks own on-task behavior with simple checklist",
      "Break tasks into smaller chunks with mini-celebrations at completion",
      "Consider environmental modifications: seating near teacher, reduced visual distractions",
      "Use high-interest materials when possible to increase engagement",
    ],
  },
  {
    id: "verbal-outbursts",
    emoji: "🗣️",
    title: "Verbal Outbursts / Calling Out",
    description:
      "Student calls out, interrupts, or makes verbal outbursts during instruction without permission.",
    color: "pink",
    valueIndex: 5, // Respectful
    behaviorType: "decrease",
    behavior:
      "verbal outbursts (calling out answers, making loud noises, or interrupting without raising hand)",
    replacementBehavior:
      "raising hand and waiting to be called on before speaking, or using a quiet signal card to indicate need to speak",
    baseline: 60,
    target: 90,
    measurementMethod: "Frequency count",
    fluencyEnabled: true,
    fluencySeconds: 5,
    generalization: [
      "Structured classroom",
      "Small group instruction",
      "Specials (PE, art, music)",
      "With different adults",
    ],
    maintenanceWeeks: 4,
    interventionStrategies: [
      "Teach and practice hand-raising routine during non-instructional times",
      "Provide a 'talk ticket' system: student earns tickets for raising hand, loses for calling out",
      "Create opportunities for the student to respond frequently (response cards, turn-and-talk)",
      "Use positive reinforcement for quiet waiting: 'I love how you raised your hand and waited'",
      "Implement DRL (differential reinforcement of low rates): reinforce when outbursts decrease",
      "Consider a visual cue on desk reminding student to raise hand",
      "Privately discuss the replacement behavior before high-risk activities",
    ],
  },
  {
    id: "asking-for-help",
    emoji: "🆘",
    title: "Asking for Help",
    description:
      "Student struggles independently rather than asking for help, leading to frustration or incomplete work.",
    color: "cyan",
    valueIndex: 1, // Brave
    behaviorType: "increase",
    behavior:
      "appropriately requesting help from an adult or peer (raising hand, using help card, or verbal request) when encountering difficulty",
    replacementBehavior: "",
    baseline: 15,
    target: 80,
    measurementMethod: "Frequency count",
    fluencyEnabled: true,
    fluencySeconds: 30,
    generalization: [
      "Structured classroom",
      "Small group instruction",
      "Independent work time",
      "Specials (PE, art, music)",
    ],
    maintenanceWeeks: 4,
    interventionStrategies: [
      "Teach specific help-seeking scripts: 'Can you help me with...' or 'I don't understand...'",
      "Provide a visual 'help card' student can place on desk instead of raising hand",
      "Practice asking for help during easy tasks to build fluency before harder ones",
      "Reinforce any attempt to ask for help, even if phrasing isn't perfect",
      "Create a peer buddy system where asking a classmate is the first step",
      "Use social stories about how asking for help is brave, not weak",
      "Monitor for frustration signs and prompt before escalation",
    ],
  },
];
