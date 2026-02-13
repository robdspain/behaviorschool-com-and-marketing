import type { MenuSection } from "./types";

export const menuSections: MenuSection[] = [
  { label: "BehaviorSchool Pro", href: "/pro" },
  { label: "CalABA 2026 🎓", href: "/calaba-2026" },
  { label: "Free Practice Exam", href: "/free-bcba-practice" },
  { label: "Community", href: "/community" },
  {
    label: "Free Tools",
    children: [
      { label: "All Tools", href: "/products" },
      { label: "BCBA Readiness Quiz", href: "/bcba-readiness-quiz" },
      { label: "FBA Decision Matrix", href: "/fba-decision-matrix" },
    ],
  },
  { label: "Transformation", href: "/transformation-program" },
  { label: "About", href: "/about" },
];


