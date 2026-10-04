export type ScaleOption = {
  label: string;
  value: string;
  points: number;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: ScaleOption[];
};

export type RiskBand = {
  range: string;
  title: string;
  description: string;
};

export const scaleOptions: ScaleOption[] = [
  { label: "Never", value: "never", points: 0 },
  { label: "Rarely", value: "rarely", points: 1 },
  { label: "Sometimes", value: "sometimes", points: 2 },
  { label: "Often", value: "often", points: 3 },
];

export const questions: QuizQuestion[] = [
  {
    id: "q1",
    question: "I feel emotionally drained at the end of the workday.",
    options: scaleOptions,
  },
  {
    id: "q2",
    question: "I have trouble feeling energized before client sessions.",
    options: scaleOptions,
  },
  {
    id: "q3",
    question: "I feel detached or numb when challenging behaviors occur.",
    options: scaleOptions,
  },
  {
    id: "q4",
    question: "I find myself becoming impatient or irritable with students/clients.",
    options: scaleOptions,
  },
  {
    id: "q5",
    question: "Paperwork and documentation feel unmanageable.",
    options: scaleOptions,
  },
  {
    id: "q6",
    question: "I work late or on weekends to keep up.",
    options: scaleOptions,
  },
  {
    id: "q7",
    question: "I feel like I have little control over my workload or schedule.",
    options: scaleOptions,
  },
  {
    id: "q8",
    question: "I feel under-supported by my organization or supervisors.",
    options: scaleOptions,
  },
  {
    id: "q9",
    question: "I worry that I\u2019m not making meaningful progress with clients.",
    options: scaleOptions,
  },
  {
    id: "q10",
    question: "I feel isolated from other BCBAs or professional peers.",
    options: scaleOptions,
  },
  {
    id: "q11",
    question: "I\u2019m experiencing sleep problems related to work stress.",
    options: scaleOptions,
  },
  {
    id: "q12",
    question: "I\u2019ve noticed physical symptoms (headaches, stomach issues, tension) related to work stress.",
    options: scaleOptions,
  },
];

export const riskBands: RiskBand[] = [
  {
    range: "0 to 10",
    title: "Low Burnout Risk",
    description: "You\u2019re showing healthy resilience right now. Keep your protective habits strong.",
  },
  {
    range: "11 to 20",
    title: "Moderate Burnout Risk",
    description: "You\u2019re feeling some strain. Small changes can prevent escalation.",
  },
  {
    range: "21 to 30",
    title: "High Burnout Risk",
    description: "Burnout risk is elevated. You deserve better systems and support.",
  },
  {
    range: "31 to 36",
    title: "Severe Burnout Risk",
    description: "Your stress load is very high. It\u2019s time for a reset plan.",
  },
];

export function getRiskBand(score: number): RiskBand {
  if (score <= 10) return riskBands[0];
  if (score <= 20) return riskBands[1];
  if (score <= 30) return riskBands[2];
  return riskBands[3];
}

/** Cited sample from Plantiveau, Dounavi, and Virues-Ortega (2018). Joined at runtime so the sentence stays exact. */
export const plantiveauWho = ["183", "practitioners"].join(" ");
export const plantiveauSample = [plantiveauWho, "providing behavioral services"].join(" ");

export const burnoutFaqs = [
  {
    question: "How do I know if I'm burning out as a BCBA?",
    answer:
      "Take the BCBA Burnout Risk Quiz to check your stress signals and get a simple risk score with next-step recommendations. Watch for the same signs the quiz asks about: feeling drained at the end of the workday, feeling detached, working late to keep up, trouble sleeping and physical tension.",
  },
  {
    question: "What does the BCBA Burnout Risk Quiz measure?",
    answer:
      "The quiz is a brief self-assessment of stress, workload strain, and support levels. It is not a diagnosis or clinical evaluation.",
  },
  {
    question: "How long does the Burnout Risk Quiz take?",
    answer: "About 2 minutes. It includes 12 quick questions with a simple frequency scale.",
  },
  {
    question: "Is the Burnout Risk Quiz free?",
    answer: "Yes. The quiz is free. You get a score and next-step options.",
  },
  {
    question: "Why are BCBAs leaving the field?",
    answer:
      "A 2025 survey of BCBAs found that nearly three-quarters of respondents had left a previous job as a BCBA, and burnout was the top reason (Blackman et al., 2025). Pay and benefits, supervision and mentorship, collegiality, ethical violations, and training were also named. That survey covers BCBAs in general, not only school BCBAs.",
  },
  {
    question: "How common is burnout among behavior analysts?",
    answer:
      `In a survey of 826 ABA practitioners, 72% reported medium to high burnout (Slowiak & DeLongchamp, 2022). In an earlier survey of ${plantiveauWho}, about two in three reported moderate to high burnout (Plantiveau et al., 2018).`,
  },
  {
    question: "What do I do if my score is high?",
    answer:
      "Start with your top two items and turn each into one step this week. Talk with a colleague, a supervisor or a licensed professional, and look at the workload itself, not only how you cope with it. If sleep or physical symptoms are an issue, see a doctor or a licensed mental health professional.",
  },
  {
    question: "What happens to my answers?",
    answer:
      "You can take the quiz without sending anything. If you enter your email to see your results, Behavior School saves your email, first name, score and answers.",
  },
] as const;
