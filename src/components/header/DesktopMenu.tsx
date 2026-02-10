"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dropdown } from "./Dropdown";
import { menuSections } from "./config";

type Props = {
  openKey: string | null;
  onOpen: (key: string | null) => void;
};

export function DesktopMenu({ openKey, onOpen }: Props) {
  return (
    <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
      {menuSections.map((section) => {
        const hasChildren = !!section.children?.length;
        const key = section.label.toLowerCase();
        if (hasChildren) {
          return (
            <motion.div
              key={key}
              className="relative"
              onMouseEnter={() => onOpen(key)}
              onMouseLeave={() => onOpen(null)}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <motion.button
                className="inline-flex items-center gap-1 px-3 py-2 text-sm xl:text-base font-medium text-emerald-700 focus:outline-none relative rounded-lg"
                aria-haspopup="menu"
                aria-expanded={openKey === key}
                whileHover={{ 
                  scale: 1.1,
                  backgroundColor: "rgba(16, 185, 129, 0.08)",
                  color: "#065f46"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                {section.label}
                <motion.div
                  animate={{ rotate: openKey === key ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="size-4" />
                </motion.div>
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
              <AnimatePresence>
                {openKey === key && section.children && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <Dropdown links={section.children} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        }
        return (
          <motion.div
            key={key}
            className="relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              href={section.href ?? "#"}
              className="px-3 py-2 text-sm xl:text-base font-medium text-emerald-700 relative block rounded-lg whitespace-nowrap"
              target={section.href?.startsWith("http") ? "_blank" : undefined}
              rel={section.href?.startsWith("http") ? "noreferrer noopener" : undefined}
            >
              <motion.div
                className="absolute inset-0 bg-emerald-100/50 rounded-lg"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10">{section.label}</span>
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}

