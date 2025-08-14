import type { MenuSection } from "./types";

export const menuSections: MenuSection[] = [
  {
    label: "ClassroomPilot",
    href: "/classroom-pilot",
  },
  {
    label: "Products",
    href: "/products",
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


