import type { MenuSection } from "./types";

export const menuSections: MenuSection[] = [
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
  { label: "Community", href: "/community" },
];


