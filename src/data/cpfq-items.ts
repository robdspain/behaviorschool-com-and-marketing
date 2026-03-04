// Original Psychological Flexibility Questionnaire items
// Based on the six psychological flexibility processes — NOT copied from published instruments

export interface CPFQItem {
  id: string;
  text: string;
  subscale: PsychFlexSubscale;
  reverse: boolean; // true = higher score means MORE inflexibility (reverse-scored)
}

export type PsychFlexSubscale =
  | "acceptance"
  | "defusion"
  | "present-moment"
  | "self-as-context"
  | "values"
  | "committed-action";

export const SUBSCALE_META: Record<PsychFlexSubscale, { label: string; emoji: string; color: string; description: string; lowDescription: string; highDescription: string }> = {
  acceptance: {
    label: "Acceptance & Willingness",
    emoji: "🤗",
    color: "#27ae60",
    description: "How willing the student is to experience difficult thoughts and feelings without trying to avoid or control them.",
    lowDescription: "May struggle with avoidance of difficult internal experiences. May use escape behaviors when uncomfortable feelings arise.",
    highDescription: "Demonstrates willingness to experience a range of emotions. Can tolerate discomfort while continuing to engage in activities.",
  },
  defusion: {
    label: "Cognitive Defusion",
    emoji: "🎈",
    color: "#3498db",
    description: "The student's ability to step back from thoughts and see them as mental events rather than literal truths.",
    lowDescription: "Tends to get caught up in thoughts and treat them as absolute truths. May struggle to separate self from thought content.",
    highDescription: "Can notice thoughts without being controlled by them. Recognizes that thoughts are not always accurate or helpful.",
  },
  "present-moment": {
    label: "Present-Moment Awareness",
    emoji: "🎯",
    color: "#e67e22",
    description: "The student's ability to pay attention to and engage with the present moment.",
    lowDescription: "May frequently be 'in their head' — caught up in worries about the future or rumination about the past.",
    highDescription: "Can focus attention on current experiences. Demonstrates awareness of their environment and present-moment feelings.",
  },
  "self-as-context": {
    label: "Self-as-Context",
    emoji: "🪞",
    color: "#9b59b6",
    description: "The student's ability to notice their experiences from an observer perspective rather than being defined by them.",
    lowDescription: "May strongly identify with labels, stories about themselves, or specific emotions ('I AM angry' vs 'I notice anger').",
    highDescription: "Can observe their own thoughts and feelings from a stable sense of self. Does not over-identify with transient experiences.",
  },
  values: {
    label: "Values Clarity",
    emoji: "⭐",
    color: "#f1c40f",
    description: "How clearly the student can identify and articulate what matters to them.",
    lowDescription: "May have difficulty identifying what is personally important. May act based on what others expect rather than personal values.",
    highDescription: "Can clearly articulate what matters to them. Demonstrates awareness of personal values across life domains.",
  },
  "committed-action": {
    label: "Committed Action",
    emoji: "🚀",
    color: "#e74c3c",
    description: "The student's pattern of taking effective action guided by their values, even in the presence of difficulty.",
    lowDescription: "May struggle to follow through on intentions. Difficult experiences may frequently derail goal-directed behavior.",
    highDescription: "Takes action consistent with stated values even when it is difficult. Follows through on commitments despite obstacles.",
  },
};

// ===== STUDENT SELF-REPORT (Ages 8-18) =====
export const STUDENT_ITEMS: CPFQItem[] = [
  // ACCEPTANCE (6 items)
  { id: "s-acc-1", text: "When I feel upset, I try to push the feeling away as fast as I can.", subscale: "acceptance", reverse: true },
  { id: "s-acc-2", text: "I can let myself feel sad or worried without needing to make it stop right away.", subscale: "acceptance", reverse: false },
  { id: "s-acc-3", text: "I get very upset when I have thoughts or feelings I don't like.", subscale: "acceptance", reverse: true },
  { id: "s-acc-4", text: "It's okay with me to have uncomfortable feelings sometimes.", subscale: "acceptance", reverse: false },
  { id: "s-acc-5", text: "I do things to avoid feeling bad, even if those things cause other problems.", subscale: "acceptance", reverse: true },
  { id: "s-acc-6", text: "I can have a difficult feeling and still do what I need to do.", subscale: "acceptance", reverse: false },

  // DEFUSION (6 items)
  { id: "s-def-1", text: "When my mind tells me something bad will happen, I believe it.", subscale: "defusion", reverse: true },
  { id: "s-def-2", text: "I know that just because I think something doesn't mean it's true.", subscale: "defusion", reverse: false },
  { id: "s-def-3", text: "My thoughts control what I do.", subscale: "defusion", reverse: true },
  { id: "s-def-4", text: "I can notice a thought without having to act on it.", subscale: "defusion", reverse: false },
  { id: "s-def-5", text: "When I think 'I can't do this,' I stop trying.", subscale: "defusion", reverse: true },
  { id: "s-def-6", text: "I can have a scary thought and still be okay.", subscale: "defusion", reverse: false },

  // PRESENT MOMENT (6 items)
  { id: "s-pm-1", text: "I spend a lot of time worrying about things that haven't happened yet.", subscale: "present-moment", reverse: true },
  { id: "s-pm-2", text: "I pay attention to what's happening around me right now.", subscale: "present-moment", reverse: false },
  { id: "s-pm-3", text: "My mind is often somewhere else when I'm supposed to be paying attention.", subscale: "present-moment", reverse: true },
  { id: "s-pm-4", text: "I notice things like sounds, smells, and how things feel when I touch them.", subscale: "present-moment", reverse: false },
  { id: "s-pm-5", text: "I do things without really paying attention to what I'm doing.", subscale: "present-moment", reverse: true },
  { id: "s-pm-6", text: "When I eat, I notice what my food tastes like.", subscale: "present-moment", reverse: false },

  // SELF-AS-CONTEXT (6 items)
  { id: "s-sac-1", text: "I think I am my feelings — like if I feel angry, I AM an angry person.", subscale: "self-as-context", reverse: true },
  { id: "s-sac-2", text: "Even when I feel really bad, I know the feeling will change.", subscale: "self-as-context", reverse: false },
  { id: "s-sac-3", text: "When something bad happens, I feel like that's just who I am now.", subscale: "self-as-context", reverse: true },
  { id: "s-sac-4", text: "I am more than my thoughts and feelings.", subscale: "self-as-context", reverse: false },
  { id: "s-sac-5", text: "If I fail at something, it means I'm a failure.", subscale: "self-as-context", reverse: true },
  { id: "s-sac-6", text: "I can notice my feelings without them taking over who I am.", subscale: "self-as-context", reverse: false },

  // VALUES (6 items)
  { id: "s-val-1", text: "I know what is important to me in life.", subscale: "values", reverse: false },
  { id: "s-val-2", text: "I don't really know what I care about.", subscale: "values", reverse: true },
  { id: "s-val-3", text: "I know what kind of person I want to be.", subscale: "values", reverse: false },
  { id: "s-val-4", text: "I mostly do things because other people want me to, not because I want to.", subscale: "values", reverse: true },
  { id: "s-val-5", text: "I can explain what matters most to me.", subscale: "values", reverse: false },
  { id: "s-val-6", text: "I feel confused about what I want out of life.", subscale: "values", reverse: true },

  // COMMITTED ACTION (6 items)
  { id: "s-ca-1", text: "When something important is hard, I keep going.", subscale: "committed-action", reverse: false },
  { id: "s-ca-2", text: "I give up easily when things don't go my way.", subscale: "committed-action", reverse: true },
  { id: "s-ca-3", text: "I take steps toward the things that matter to me, even when it's uncomfortable.", subscale: "committed-action", reverse: false },
  { id: "s-ca-4", text: "I stop working toward my goals when I feel bad.", subscale: "committed-action", reverse: true },
  { id: "s-ca-5", text: "I do things that match what I care about, even if they're not easy.", subscale: "committed-action", reverse: false },
  { id: "s-ca-6", text: "Difficult feelings keep me from doing the things I want to do.", subscale: "committed-action", reverse: true },
];

// ===== CAREGIVER/TEACHER REPORT =====
export const CAREGIVER_ITEMS: CPFQItem[] = [
  // ACCEPTANCE (5 items)
  { id: "c-acc-1", text: "This student tries hard to avoid situations that might cause uncomfortable feelings.", subscale: "acceptance", reverse: true },
  { id: "c-acc-2", text: "This student can tolerate discomfort without needing to escape the situation.", subscale: "acceptance", reverse: false },
  { id: "c-acc-3", text: "This student becomes very distressed when experiencing negative emotions.", subscale: "acceptance", reverse: true },
  { id: "c-acc-4", text: "This student can continue activities even when feeling upset or anxious.", subscale: "acceptance", reverse: false },
  { id: "c-acc-5", text: "This student uses avoidance strategies (leaving, shutting down, refusing) when difficult feelings arise.", subscale: "acceptance", reverse: true },

  // DEFUSION (5 items)
  { id: "c-def-1", text: "This student seems to take their negative thoughts very literally (e.g., 'I can't' means they truly believe they cannot).", subscale: "defusion", reverse: true },
  { id: "c-def-2", text: "This student can recognize when their thinking might not be accurate.", subscale: "defusion", reverse: false },
  { id: "c-def-3", text: "This student's behavior is strongly driven by their current thoughts (whatever they think, they act on).", subscale: "defusion", reverse: true },
  { id: "c-def-4", text: "This student can have a negative thought and still make good choices.", subscale: "defusion", reverse: false },
  { id: "c-def-5", text: "This student gets 'stuck' in repetitive thought patterns.", subscale: "defusion", reverse: true },

  // PRESENT MOMENT (5 items)
  { id: "c-pm-1", text: "This student is often 'in their head' rather than engaged with what's happening.", subscale: "present-moment", reverse: true },
  { id: "c-pm-2", text: "This student can focus on and engage with current activities.", subscale: "present-moment", reverse: false },
  { id: "c-pm-3", text: "This student worries excessively about future events.", subscale: "present-moment", reverse: true },
  { id: "c-pm-4", text: "This student notices and responds to what is happening in the moment.", subscale: "present-moment", reverse: false },
  { id: "c-pm-5", text: "This student dwells on past events or mistakes.", subscale: "present-moment", reverse: true },

  // SELF-AS-CONTEXT (5 items)
  { id: "c-sac-1", text: "This student defines themselves by their problems or difficulties (e.g., 'I'm the bad kid').", subscale: "self-as-context", reverse: true },
  { id: "c-sac-2", text: "This student understands that feelings change and are temporary.", subscale: "self-as-context", reverse: false },
  { id: "c-sac-3", text: "This student over-identifies with emotions (becomes the emotion rather than experiencing it).", subscale: "self-as-context", reverse: true },
  { id: "c-sac-4", text: "This student can talk about their experiences from a perspective of self-awareness.", subscale: "self-as-context", reverse: false },
  { id: "c-sac-5", text: "This student uses rigid self-labels (e.g., 'I'm stupid', 'I'm always angry').", subscale: "self-as-context", reverse: true },

  // VALUES (5 items)
  { id: "c-val-1", text: "This student can express what is important to them.", subscale: "values", reverse: false },
  { id: "c-val-2", text: "This student seems unclear about what they care about or want.", subscale: "values", reverse: true },
  { id: "c-val-3", text: "This student's actions seem connected to things that matter to them.", subscale: "values", reverse: false },
  { id: "c-val-4", text: "This student seems to act mainly based on what others expect rather than personal interest.", subscale: "values", reverse: true },
  { id: "c-val-5", text: "This student shows motivation connected to personal interests and values.", subscale: "values", reverse: false },

  // COMMITTED ACTION (5 items)
  { id: "c-ca-1", text: "This student persists with tasks even when they become difficult or frustrating.", subscale: "committed-action", reverse: false },
  { id: "c-ca-2", text: "This student gives up quickly when faced with obstacles.", subscale: "committed-action", reverse: true },
  { id: "c-ca-3", text: "This student takes action aligned with their stated goals and interests.", subscale: "committed-action", reverse: false },
  { id: "c-ca-4", text: "Emotional difficulties frequently prevent this student from completing tasks.", subscale: "committed-action", reverse: true },
  { id: "c-ca-5", text: "This student follows through on commitments even when it requires effort.", subscale: "committed-action", reverse: false },
];

export const LIKERT_OPTIONS = [
  { value: 0, label: "Never True", emoji: "❌" },
  { value: 1, label: "Rarely True", emoji: "🔵" },
  { value: 2, label: "Sometimes True", emoji: "🟡" },
  { value: 3, label: "Often True", emoji: "🟠" },
  { value: 4, label: "Always True", emoji: "🟢" },
];

// Scoring: For non-reverse items, score = response value (0-4)
// For reverse items, score = 4 - response value
// Subscale score = sum of items / number of items (yields 0-4 average)
// Total score = sum of all subscale averages / 6 (yields 0-4 average)

export function scoreItem(response: number, reverse: boolean): number {
  return reverse ? 4 - response : response;
}

export function scoreSubscale(items: CPFQItem[], responses: Record<string, number>): number {
  const scores = items.map((item) => {
    const response = responses[item.id];
    if (response === undefined) return null;
    return scoreItem(response, item.reverse);
  }).filter((s): s is number => s !== null);

  if (scores.length === 0) return 0;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

export function scoreFull(items: CPFQItem[], responses: Record<string, number>): {
  subscales: Record<PsychFlexSubscale, number>;
  total: number;
  completionRate: number;
} {
  const subscales: PsychFlexSubscale[] = ["acceptance", "defusion", "present-moment", "self-as-context", "values", "committed-action"];
  const result: Record<string, number> = {};

  let answeredCount = 0;
  for (const sub of subscales) {
    const subItems = items.filter((i) => i.subscale === sub);
    result[sub] = scoreSubscale(subItems, responses);
    answeredCount += subItems.filter((i) => responses[i.id] !== undefined).length;
  }

  const total = subscales.reduce((sum, sub) => sum + result[sub], 0) / subscales.length;
  const completionRate = answeredCount / items.length;

  return {
    subscales: result as Record<PsychFlexSubscale, number>,
    total,
    completionRate,
  };
}

export function generateNarrative(
  subscales: Record<PsychFlexSubscale, number>,
  total: number,
  version: "student" | "caregiver"
): string {
  const subject = version === "student" ? "The student" : "Based on caregiver/teacher observation, the student";
  const lines: string[] = [];

  lines.push(`Overall Psychological Flexibility Score: ${total.toFixed(1)}/4.0`);
  lines.push("");

  if (total >= 3.0) {
    lines.push(`${subject} demonstrates strong psychological flexibility overall. They show a well-developed ability to navigate difficult internal experiences while maintaining engagement with valued activities.`);
  } else if (total >= 2.0) {
    lines.push(`${subject} demonstrates moderate psychological flexibility. They show developing skills in some areas while other areas may benefit from targeted support.`);
  } else {
    lines.push(`${subject} demonstrates emerging psychological flexibility skills. Targeted ACT-based intervention across multiple processes is recommended.`);
  }

  lines.push("");
  lines.push("=== Subscale Analysis ===");
  lines.push("");

  for (const [sub, meta] of Object.entries(SUBSCALE_META)) {
    const score = subscales[sub as PsychFlexSubscale];
    const level = score >= 3.0 ? "strength" : score >= 2.0 ? "developing" : "area of need";
    const desc = score >= 2.5 ? meta.highDescription : meta.lowDescription;
    lines.push(`${meta.emoji} ${meta.label}: ${score.toFixed(1)}/4.0 (${level})`);
    lines.push(`   ${desc}`);
    lines.push("");
  }

  // Recommendations
  const needAreas = Object.entries(subscales)
    .filter(([, score]) => score < 2.0)
    .map(([sub]) => SUBSCALE_META[sub as PsychFlexSubscale].label);

  if (needAreas.length > 0) {
    lines.push("=== Recommended Focus Areas ===");
    lines.push("");
    lines.push(`Priority areas for ACT-based intervention: ${needAreas.join(", ")}`);
  }

  return lines.join("\n");
}
