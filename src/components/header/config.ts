import type { MenuSection } from "./types";

export const menuSections: MenuSection[] = [
  {
    label: "Products",
    children: [
      { label: "All Products", href: "/products" },
      { label: "Behavior Study Tools", href: "/study" },
      { label: "Supervision Tools", href: "/supervisors" },
    ],
  },
  {
    label: "Resources",
    children: [
      { label: "All Resources", href: "/resources" },
    ],
  },
  { label: "Featured", href: "/featured" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  // External community entry for parity with live site
  { label: "Community", href: "https://community.behaviorschool.com" },
];


