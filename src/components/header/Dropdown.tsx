"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { MenuLink } from "./types";

type DropdownProps = {
  links: MenuLink[];
  className?: string;
};

export function Dropdown({ links, className }: DropdownProps) {
  return (
    <motion.div
      role="menu"
      className={
        "absolute left-0 mt-2 w-56 rounded-md border border-white/10 bg-white/95 backdrop-blur shadow-lg z-20 " +
        (className ?? "")
      }
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {links.map((link, index) => (
        <motion.div
          key={link.href + link.label}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ 
            duration: 0.2, 
            delay: index * 0.05,
            ease: "easeOut" 
          }}
        >
          <Link
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noreferrer noopener" : undefined}
            className="block px-4 py-2 text-sm text-slate-800 hover:bg-slate-100 transition-colors duration-200"
          >
            {link.label}
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}


