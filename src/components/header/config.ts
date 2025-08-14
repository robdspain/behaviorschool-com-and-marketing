import type { MenuSection } from "./types";

export const menuSections: MenuSection[] = [
  {
    label: "Products",
    children: [
      { label: "All Products", href: "/products" },
      { label: "BehaviorPilot", href: "/behaviorpilot" },
      { label: "ClassroomPilot", href: "/classroompilot" },
      { label: "TierPath", href: "/tierpath" },
    ],
  },
  {
    label: "Resources",
    children: [
      { label: "All Resources", href: "/resources" },
    ],
  },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Community", href: "/community" },
];


