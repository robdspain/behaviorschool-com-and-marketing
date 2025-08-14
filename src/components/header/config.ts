import type { MenuSection } from "./types";

export const menuSections: MenuSection[] = [
  {
    label: "Features",
    href: "/products",
  },
  {
    label: "Resources",
    children: [
      { label: "All Resources", href: "/resources" },
      { label: "IEP Data Tracking Checklist", href: "/resources/iep-checklist" },
    ],
  },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
];


