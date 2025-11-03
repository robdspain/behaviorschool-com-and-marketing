export type TemplateItem = {
  name: string;
  url: string;
  description: string;
};

export const templates: TemplateItem[] = [
  {
    name: "Values Interview (≈5 minutes)",
    url: "/templates/values-interview.html",
    description: "Brief interview to anchor goals in what matters to the student",
  },
  {
    name: "ACT Matrix / Choice-Point (Student)",
    url: "/templates/act-matrix-choice-point.html",
    description: "Values-based framework to guide choice-making when difficult thoughts or feelings show up",
  },
  {
    name: "Goal Builder (Values-Aligned)",
    url: "/templates/goal-builder.html",
    description: "Template for writing behavior goals aligned to student values with measurement criteria",
  },
  {
    name: "Daily Check Card",
    url: "/templates/daily-check-card.html",
    description: "Quick daily tracking tool for toward moves and value-aligned behaviors",
  },
  {
    name: "Weekly Review",
    url: "/templates/weekly-review.html",
    description: "Reflection template to assess barriers, micro-routines, and plan next steps",
  },
  {
    name: "Staff Fidelity Quick-Check",
    url: "/templates/staff-fidelity-check.html",
    description: "Checklist to monitor intervention fidelity and data collection",
  },
];

