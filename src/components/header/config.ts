import type { MenuSection } from "./types";

export const menuSections: MenuSection[] = [
  {
    label: "Products",
    children: [
      { label: "All Products", href: "/products" },
      { label: "BehaviorPilot", href: "/products/behaviorpilot" },
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
  // External community entry for parity with live site
  { label: "Community", href: "https://community.behaviorschool.com" },
];


