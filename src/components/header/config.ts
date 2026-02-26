import type { MenuSection } from "./types";

export const menuSections: MenuSection[] = [
  {
    label: "Tools",
    children: [
      { label: "All Tools", href: "/products" },
      { label: "BehaviorSchool Pro", href: "/pro" },
      { label: "FBA-to-BIP Generator", href: "/fba-to-bip" },
      { label: "IEP Goal Generator", href: "/iep-goal-generator" },
      { label: "IEP Goal Bank", href: "/iep-goal-bank" },
    ],
  },
  {
    label: "Study",
    children: [
      { label: "BCBA Exam Prep", href: "/study" },
      { label: "Free Practice Exam", href: "/free-bcba-practice" },
      { label: "Free Study Plan", href: "/free-study-plan" },
      { label: "BCBA Study Tools", href: "/bcba-study-tools" },
    ],
  },
  { label: "Supervise", href: "/supervisors" },
  { label: "Transformation", href: "/transformation-program" },
  { label: "Community", href: "/community" },
  { label: "About", href: "/about" },
];
