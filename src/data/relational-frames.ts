// Relational Frame Analysis data + helpers (template-based)

export type FrameType =
  | "coordination"
  | "opposition"
  | "comparison"
  | "hierarchy"
  | "temporal"
  | "causal"
  | "deictic";

export type AgeLevel = "elementary" | "secondary";

export interface FrameMeta {
  label: string;
  emoji: string;
  description: string;
  patterns: RegExp[];
}

export const FRAME_META: Record<FrameType, FrameMeta> = {
  coordination: {
    label: "Coordination (same as)",
    emoji: "=",
    description: "Equating self or experience with a label or attribute (fusion).",
    patterns: [
      /\b(i am|i'm|i am just|i'm just)\b/i,
      /\b(i am a|i'm a)\b/i,
      /\b(that means i am)\b/i,
    ],
  },
  opposition: {
    label: "Opposition (opposite of)",
    emoji: "↔️",
    description: "Rigid either/or rules, perfectionism, or all-or-nothing framing.",
    patterns: [
      /\b(if .* then .* worthless)\b/i,
      /\b(perfect|perfectly)\b/i,
      /\b(either|or)\b/i,
      /\b(all or nothing|nothing at all)\b/i,
    ],
  },
  comparison: {
    label: "Comparison (more/less than)",
    emoji: "⚖️",
    description: "Comparing self to others or ranking abilities.",
    patterns: [
      /\b(more than|less than)\b/i,
      /\b(better than|worse than)\b/i,
      /\b(smarter than|dumber than)\b/i,
      /\b(everyone is .* than me)\b/i,
    ],
  },
  hierarchy: {
    label: "Hierarchy (part of / category)",
    emoji: "🧩",
    description: "Placing self into a category or group identity label.",
    patterns: [
      /\b(one of the)\b/i,
      /\b(people like me)\b/i,
      /\b(bad kid|good kid|troublemaker)\b/i,
      /\b(i'm not the kind of person)\b/i,
    ],
  },
  temporal: {
    label: "Temporal (before/after)",
    emoji: "⏳",
    description: "Fixed future predictions or permanence of states.",
    patterns: [
      /\b(always|never)\b/i,
      /\b(i'll never|it will never)\b/i,
      /\b(it will always)\b/i,
      /\b(used to|before)\b/i,
    ],
  },
  causal: {
    label: "Causal (if-then / because)",
    emoji: "➡️",
    description: "Cause-effect rules that lock in meaning or outcomes.",
    patterns: [
      /\b(because)\b/i,
      /\b(if .* then)\b/i,
      /\b(so that means)\b/i,
      /\b(that's why)\b/i,
    ],
  },
  deictic: {
    label: "Deictic (perspective-taking)",
    emoji: "👁️",
    description: "I/you, here/there, now/then perspectives and social viewpoints.",
    patterns: [
      /\b(you don't understand|you wouldn't get it)\b/i,
      /\b(you're not me|i'm not you)\b/i,
      /\b(there vs here)\b/i,
      /\b(then vs now)\b/i,
    ],
  },
};

export interface FrameSuggestion {
  frame: FrameType;
  confidence: number; // 0-1
  matchedPattern?: string;
}

export function suggestFrames(statement: string): FrameSuggestion[] {
  const suggestions: FrameSuggestion[] = [];
  for (const [frame, meta] of Object.entries(FRAME_META) as [FrameType, FrameMeta][]) {
    for (const pattern of meta.patterns) {
      if (pattern.test(statement)) {
        suggestions.push({ frame, confidence: 0.75, matchedPattern: pattern.source });
        break;
      }
    }
  }
  if (suggestions.length === 0) {
    return [{ frame: "coordination", confidence: 0.35 }];
  }
  return suggestions;
}

export const AFFIRMING_TEMPLATES: Record<FrameType, Record<AgeLevel, string[]>> = {
  coordination: {
    elementary: [
      "It sounds like your brain is saying you're {label}. That can feel really heavy.",
      "A lot of kids have thoughts like that sometimes. You're not alone.",
    ],
    secondary: [
      "It sounds like you're having the thought that you are {label}. That thought can feel convincing.",
      "Thanks for sharing that — many students have thoughts like this, especially when school feels hard.",
    ],
  },
  opposition: {
    elementary: [
      "It feels like it has to be perfect or it feels like nothing — that's a tough feeling.",
      "That sounds really stressful to carry around.",
    ],
    secondary: [
      "It makes sense that all-or-nothing thoughts show up when you care about doing well.",
      "That's a hard rule to live with; it can create a lot of pressure.",
    ],
  },
  comparison: {
    elementary: [
      "It hurts when it feels like others are ahead of you.",
      "Comparing ourselves can make school feel even harder.",
    ],
    secondary: [
      "Comparisons can be really painful, especially when you're already feeling down.",
      "A lot of students feel this way — it's a common mind habit.",
    ],
  },
  hierarchy: {
    elementary: [
      "Being put in a " + "bad kid" + " box can feel really unfair.",
      "Labels can stick, even when they aren't the whole story.",
    ],
    secondary: [
      "Labels can feel like they define us, even though we're more complex than any label.",
      "It makes sense that being placed in a category would feel discouraging.",
    ],
  },
  temporal: {
    elementary: [
      "When things feel hard, it can seem like it will last forever.",
      "That sounds like a really stuck feeling.",
    ],
    secondary: [
      "When things are tough, our minds often predict they'll stay that way.",
      "That sounds exhausting to carry around.",
    ],
  },
  causal: {
    elementary: [
      "It makes sense that your brain connects those dots.",
      "That feels like a really strong rule in your mind.",
    ],
    secondary: [
      "I hear the rule your mind is making there — it's trying to explain what happened.",
      "That cause-and-effect story can feel very convincing.",
    ],
  },
  deictic: {
    elementary: [
      "It can feel really lonely when you think others don't get it.",
      "That sounds like a tough place to be.",
    ],
    secondary: [
      "It makes sense that you feel misunderstood — that can be isolating.",
      "Thanks for telling me; that sounds really hard.",
    ],
  },
};

export const CHALLENGE_TEMPLATES: Record<FrameType, Record<AgeLevel, string[]>> = {
  coordination: {
    elementary: [
      "What if " + "'I'm {label}'" + " is just a thought your brain says, not a fact about you?",
      "Can you think of one time when that thought wasn't true?",
    ],
    secondary: [
      "What if " + "'I'm {label}'" + " is a thought, not a fact?",
      "If a friend said this about themselves, would you agree 100%?",
    ],
  },
  opposition: {
    elementary: [
      "Is it possible to be " + "good enough" + " without being perfect?",
      "What would " + "almost perfect" + " look like?",
    ],
    secondary: [
      "Is there room between 'perfect' and 'worthless'?",
      "What does " + "progress" + " look like instead of perfection?",
    ],
  },
  comparison: {
    elementary: [
      "Is there something you're really good at that someone else isn't?",
      "What is one thing you know more about than someone in class?",
    ],
    secondary: [
      "Can you name one area where you are stronger than others?",
      "What happens if you compare yourself to where you were last month instead of others?",
    ],
  },
  hierarchy: {
    elementary: [
      "Are you always in the " + "bad kid" + " group, or are there times you do good things too?",
      "Can a person be in more than one group?",
    ],
    secondary: [
      "If labels are categories, are people always just one category?",
      "What evidence shows you're more than that label?",
    ],
  },
  temporal: {
    elementary: [
      "Has there ever been a time when something felt " + "never" + " but it changed?",
      "What is one small thing that could be different tomorrow?",
    ],
    secondary: [
      "Has there been a time you thought something would never change, but it did?",
      "What would " + "1% better" + " look like this week?",
    ],
  },
  causal: {
    elementary: [
      "Just because that happened, does it mean it will always happen?",
      "What other reasons could there be?",
    ],
    secondary: [
      "Is that the only explanation, or just one possible explanation?",
      "If this happened once, does it mean it's permanent?",
    ],
  },
  deictic: {
    elementary: [
      "If I could " + "step into your shoes" + ", what would I notice?",
      "How is your view different from someone else's?",
    ],
    secondary: [
      "If someone who cares about you heard this, what might they say?",
      "How might this look from a different point of view?",
    ],
  },
};

export const DEFUSION_MATCHES: Record<FrameType, string[]> = {
  coordination: ["Thank Your Mind", "Hands as Thoughts", "Name the Story"],
  opposition: ["The Choice Point", "Action Ladder", "Values Compass"],
  comparison: ["Values Compass", "Thank Your Mind", "Mind Radio"],
  hierarchy: ["Noticing Self", "Weather Inside", "Name the Story"],
  temporal: ["Leaves on a Stream", "Mind Radio", "Willingness Dial"],
  causal: ["Thank Your Mind", "Passengers on the Bus", "Quicksand"],
  deictic: ["Perspective-Taking Script", "Observer Self", "Passengers on the Bus"],
};

export const FRAME_TO_METAPHORS: Record<FrameType, string[]> = {
  coordination: ["Hands as Thoughts", "Mind Radio"],
  opposition: ["Choice Point", "Tug of War with a Monster"],
  comparison: ["Values Compass", "Superhero Values"],
  hierarchy: ["Passengers on the Bus", "Weather Report Inside"],
  temporal: ["Leaves on a Stream", "Quicksand"],
  causal: ["Quicksand", "Unwelcome Party Guest"],
  deictic: ["Observer Self", "Passengers on the Bus"],
};

export const COMMON_STATEMENTS: { statement: string; frame: FrameType; age: AgeLevel }[] = [
  { statement: "I'm stupid", frame: "coordination", age: "elementary" },
  { statement: "I can't do math", frame: "coordination", age: "elementary" },
  { statement: "Nobody likes me", frame: "comparison", age: "elementary" },
  { statement: "I'm one of the bad kids", frame: "hierarchy", age: "elementary" },
  { statement: "School is pointless", frame: "causal", age: "secondary" },
  { statement: "I'll never get better", frame: "temporal", age: "secondary" },
  { statement: "Everyone is smarter than me", frame: "comparison", age: "secondary" },
  { statement: "If I can't be perfect, I'm worthless", frame: "opposition", age: "secondary" },
  { statement: "You don't understand what it's like", frame: "deictic", age: "secondary" },
];

export function buildAffirming(frame: FrameType, age: AgeLevel, statement: string): string {
  const templates = AFFIRMING_TEMPLATES[frame][age];
  const label = extractLabel(statement);
  return templates[0].replace("{label}", label || "that");
}

export function buildChallenging(frame: FrameType, age: AgeLevel, statement: string): string {
  const templates = CHALLENGE_TEMPLATES[frame][age];
  const label = extractLabel(statement);
  return templates[0].replace("{label}", label || "that");
}

function extractLabel(statement: string): string | null {
  const match = statement.match(/\b(i am|i'm)\s+([\w\s]+)/i);
  if (match && match[2]) {
    return match[2].replace(/\.$/, "").trim();
  }
  return null;
}
