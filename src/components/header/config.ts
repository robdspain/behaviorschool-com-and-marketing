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
      { label: "All Tools", href: "/products" },
      { label: "BCBA Readiness Quiz", href: "/free-bcba-practice-test" },
      { label: "FBA Decision Matrix", href: "/fba-decision-matrix" },
    ],
  },
  { label: "Transformation", href: "/transformation-program" },
  { label: "About", href: "/about" },
];


