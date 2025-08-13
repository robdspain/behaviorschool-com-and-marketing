"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Dropdown } from "./Dropdown";
import { menuSections } from "./config";

type Props = {
  openKey: string | null;
  onOpen: (key: string | null) => void;
};

export function DesktopMenu({ openKey, onOpen }: Props) {
  return (
    <div className="hidden md:flex items-center space-x-1">
      {menuSections.map((section) => {
        const hasChildren = !!section.children?.length;
        const key = section.label.toLowerCase();
        if (hasChildren) {
          return (
            <div
              key={key}
              className="relative"
              onMouseEnter={() => onOpen(key)}
              onMouseLeave={() => onOpen(null)}
            >
              <button
                className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-white hover:text-white/90 focus:outline-none"
                aria-haspopup="menu"
                aria-expanded={openKey === key}
              >
                {section.label}
                <ChevronDown className="size-4" />
              </button>
              {openKey === key && section.children && (
                <Dropdown links={section.children} />
              )}
            </div>
          );
        }
        return (
          <Link
            key={key}
            href={section.href ?? "#"}
            className="px-3 py-2 text-sm font-medium text-white hover:text-white/90"
            target={section.href?.startsWith("http") ? "_blank" : undefined}
            rel={section.href?.startsWith("http") ? "noreferrer noopener" : undefined}
          >
            {section.label}
          </Link>
        );
      })}
    </div>
  );
}


