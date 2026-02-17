import type { MenuSection } from "./types";

export const menuSections: MenuSection[] = [
  {
    label: "Exam",
    children: [
      { label: "Free Practice Exam", href: "/free-bcba-practice-exam" },
      { label: "BCBA Readiness Quiz", href: "/free-bcba-practice-test" },
      { label: "RBT Readiness Quiz", href: "/rbt-waitlist" },
      { label: "BCBA Study Platform", href: "https://study.behaviorschool.com/quiz", external: true },
      { label: "RBT Study Platform", href: "https://study.behaviorschool.com/quiz?track=rbt", external: true },
    ],
  },
  { label: "Community", href: "/community" },
  {
    label: "Free Tools",
    children: [
      { label: "IEP Behavior Goals", href: "/iep-behavior-goals" },
      { label: "IEP Goal Quality Checker", href: "/iep-goal-qualitychecker" },
      { label: "Behavior Plan Writer", href: "/behavior-plans" },
      { label: "ACT Matrix Guide", href: "/act-matrix" },
      { label: "Values Goal Assistant", href: "/values-goal-assistant-landing" },
      { label: "BCBA Study Tools", href: "/behavior-study-tools" },
      { label: "BCBA Supervision Tools", href: "/supervisors" },
      { label: "Templates", href: "/templates" },
    ],
  },
  { label: "Transformation", href: "/transformation-program" },
  { label: "About", href: "/about" },
];


