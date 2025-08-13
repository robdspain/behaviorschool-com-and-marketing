"use client";

import Link from "next/link";
import type { MenuLink } from "./types";

type DropdownProps = {
  links: MenuLink[];
  className?: string;
};

export function Dropdown({ links, className }: DropdownProps) {
  return (
    <div
      role="menu"
      className={
        "absolute left-0 mt-2 w-56 rounded-md border border-white/10 bg-white/95 backdrop-blur shadow-lg z-20 " +
        (className ?? "")
      }
    >
      {links.map((link) => (
        <Link
          key={link.href + link.label}
          href={link.href}
          target={link.external ? "_blank" : undefined}
          rel={link.external ? "noreferrer noopener" : undefined}
          className="block px-4 py-2 text-sm text-slate-800 hover:bg-slate-100"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}


