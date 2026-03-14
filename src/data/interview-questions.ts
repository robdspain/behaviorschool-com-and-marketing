// ACT Student Interview — branching question system

export type AgeVersion = "older" | "younger";

export interface InterviewQuestion {
  id: string;
  text: string;
  youngText?: string; // simplified version for elementary
  type: "open" | "scale" | "choice" | "multi-choice";
  category: "values" | "obstacles" | "feelings" | "school" | "committed-action" | "relationships" | "identity";
  options?: string[];
  youngOptions?: string[];
  followUp?: { condition: string; questionId: string }[]; // branching
  emoji?: string;
}

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  // === OPENING / RAPPORT ===
  {
    id: "opening-1",
    text: "If you could do anything after school today with no rules, what would you do?",
    youngText: "If you could do ANYTHING fun right now, what would you do?",
    type: "open",
    category: "values",
    emoji: "🌟",
  },
  {
    id: "opening-2",
    text: "Tell me about something you're really good at or proud of.",
    youngText: "What are you really good at?",
    type: "open",
    category: "identity",
    emoji: "🏆",
  },

  // === VALUES EXPLORATION ===
  {
    id: "values-1",
    text: "What matters most to you in life? (Think about people, activities, goals, beliefs...)",
    youngText: "What makes you the MOST happy?",
    type: "open",
    category: "values",
    emoji: "❤️",
  },
  {
    id: "values-2",
    text: "Who are the most important people in your life? What makes those relationships matter?",
    youngText: "Who do you love the most? Why?",
    type: "open",
    category: "relationships",
    emoji: "👨‍👩‍👧‍👦",
  },
  {
    id: "values-3",
    text: "What kind of friend do you want to be? What kind of student?",
    youngText: "What does being a good friend look like?",
    type: "open",
    category: "values",
    emoji: "🤝",
  },
  {
    id: "values-4",
    text: "If you could be known for one thing, what would it be?",
    youngText: "If your teacher told your parents ONE great thing about you, what would you want it to be?",
    type: "open",
    category: "identity",
    emoji: "⭐",
  },
  {
    id: "values-5",
    text: "What do you want your life to look like in 5 years? 10 years?",
    youngText: "What do you want to be when you grow up? Why?",
    type: "open",
    category: "values",
    emoji: "🔮",
  },

  // === OBSTACLES & INNER EXPERIENCE ===
  {
    id: "obstacles-1",
    text: "What gets in the way of you doing the things that matter to you?",
    youngText: "What makes it hard to do the things you like?",
    type: "open",
    category: "obstacles",
    emoji: "🧱",
  },
  {
    id: "obstacles-2",
    text: "When you're having a tough time, what do you usually feel in your body?",
    youngText: "When you feel bad, where do you feel it? (Tummy? Head? Chest?)",
    type: "multi-choice",
    category: "feelings",
    options: ["Tight chest", "Stomach ache", "Headache", "Muscle tension", "Racing heart", "Shaking", "Feeling hot", "Numbness", "Other"],
    youngOptions: ["Tummy hurts 🤢", "Head hurts 🤕", "Chest feels tight 😰", "Body feels shaky 🥶", "Face feels hot 🔥", "Something else"],
    emoji: "🫀",
  },
  {
    id: "obstacles-3",
    text: "What thoughts show up most often when things get difficult? (What does your mind tell you?)",
    youngText: "When something hard happens, what does your brain say to you?",
    type: "open",
    category: "obstacles",
    emoji: "💭",
  },
  {
    id: "obstacles-4",
    text: "On a scale of 1-10, how much do difficult thoughts and feelings control what you do?",
    youngText: "Do your big feelings boss you around? (A little, sometimes, or a lot?)",
    type: "scale",
    category: "feelings",
    emoji: "🎛️",
  },
  {
    id: "obstacles-5",
    text: "What do you usually do when you feel overwhelmed or upset?",
    youngText: "What do you do when you feel really mad or really sad?",
    type: "multi-choice",
    category: "obstacles",
    options: ["Leave/walk away", "Shut down/go quiet", "Get angry/yell", "Cry", "Use phone/games", "Talk to someone", "Nothing — just sit with it", "Hurt myself", "Other"],
    youngOptions: ["Walk away 🚶", "Get really quiet 🤐", "Get mad 😠", "Cry 😢", "Play games 🎮", "Tell someone 💬", "Something else"],
    emoji: "🔄",
  },

  // === SCHOOL ===
  {
    id: "school-1",
    text: "What's the hardest part of school for you right now?",
    youngText: "What's the hardest thing about school?",
    type: "open",
    category: "school",
    emoji: "🏫",
  },
  {
    id: "school-2",
    text: "Is there anything about school that matters to you? That you'd miss if you couldn't go?",
    youngText: "What's the BEST thing about school?",
    type: "open",
    category: "school",
    emoji: "📚",
  },
  {
    id: "school-3",
    text: "When things go wrong at school, what does your mind tell you about yourself?",
    youngText: "When you get in trouble at school, how does it make you feel?",
    type: "open",
    category: "school",
    emoji: "🤔",
  },

  // === PSYCHOLOGICAL FLEXIBILITY ===
  {
    id: "flex-1",
    text: "Do you think you can feel anxious AND still do something brave? Has that ever happened?",
    youngText: "Can you feel scared AND brave at the same time?",
    type: "choice",
    category: "feelings",
    options: ["Definitely yes", "Maybe", "No — if I'm anxious, I can't do it", "I'm not sure"],
    youngOptions: ["Yes! 💪", "Maybe 🤔", "No way 😰", "I don't know 🤷"],
    emoji: "🦁",
  },
  {
    id: "flex-2",
    text: "Have you noticed that trying really hard not to think about something sometimes makes you think about it more?",
    youngText: "If I say 'DON'T think about a pink elephant,' what happens?",
    type: "open",
    category: "obstacles",
    emoji: "🐘",
  },
  {
    id: "flex-3",
    text: "What would you be doing differently if difficult thoughts and feelings didn't hold you back?",
    youngText: "If nothing could scare you or make you sad, what would you do?",
    type: "open",
    category: "committed-action",
    emoji: "🚀",
  },

  // === COMMITTED ACTION ===
  {
    id: "action-1",
    text: "What's one small thing you could do this week that lines up with what matters to you?",
    youngText: "What's one good thing you could try to do this week?",
    type: "open",
    category: "committed-action",
    emoji: "👣",
  },
  {
    id: "action-2",
    text: "What might get in the way? Are you willing to try even if that happens?",
    youngText: "What might make it hard? Would you still try?",
    type: "open",
    category: "committed-action",
    emoji: "🪜",
  },
  {
    id: "action-3",
    text: "Who could help support you in taking that step?",
    youngText: "Who could help you?",
    type: "open",
    category: "committed-action",
    emoji: "🤗",
  },
];

export function generateInterviewSummary(
  responses: Record<string, string>,
  version: AgeVersion
): string {
  const lines: string[] = [];
  lines.push("=== ACT Student Interview Summary ===");
  lines.push(`Version: ${version === "older" ? "Secondary" : "Elementary (AIM Explorers)"}`);
  lines.push(`Date: ${new Date().toLocaleDateString()}`);
  lines.push("");

  // Values identified
  const valuesResponses = INTERVIEW_QUESTIONS
    .filter((q) => q.category === "values" && responses[q.id])
    .map((q) => ({ question: version === "younger" && q.youngText ? q.youngText : q.text, response: responses[q.id] }));

  if (valuesResponses.length > 0) {
    lines.push("--- VALUES IDENTIFIED ---");
    for (const v of valuesResponses) {
      lines.push(`Q: ${v.question}`);
      lines.push(`A: ${v.response}`);
      lines.push("");
    }
  }

  // Obstacles
  const obstacleResponses = INTERVIEW_QUESTIONS
    .filter((q) => (q.category === "obstacles" || q.category === "feelings") && responses[q.id])
    .map((q) => ({ question: version === "younger" && q.youngText ? q.youngText : q.text, response: responses[q.id] }));

  if (obstacleResponses.length > 0) {
    lines.push("--- INNER OBSTACLES & PATTERNS ---");
    for (const o of obstacleResponses) {
      lines.push(`Q: ${o.question}`);
      lines.push(`A: ${o.response}`);
      lines.push("");
    }
  }

  // Committed actions
  const actionResponses = INTERVIEW_QUESTIONS
    .filter((q) => q.category === "committed-action" && responses[q.id])
    .map((q) => ({ question: version === "younger" && q.youngText ? q.youngText : q.text, response: responses[q.id] }));

  if (actionResponses.length > 0) {
    lines.push("--- COMMITTED ACTION ---");
    for (const a of actionResponses) {
      lines.push(`Q: ${a.question}`);
      lines.push(`A: ${a.response}`);
      lines.push("");
    }
  }

  // ACT Conceptualization
  lines.push("--- ACT CONCEPTUALIZATION ---");
  lines.push("");
  lines.push("Values: [Extract from responses above]");
  lines.push("Away Moves: [Avoidance behaviors identified in interview]");
  lines.push("Inner Obstacles: [Thoughts, feelings, sensations identified]");
  lines.push("Toward Moves: [Committed actions the student identified]");
  lines.push("Psychological Flexibility Observations: [Note any indicators of fusion, avoidance, values clarity, etc.]");

  return lines.join("\n");
}
