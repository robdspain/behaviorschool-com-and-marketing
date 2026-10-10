"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { m as motion, AnimatePresence, MotionConfig } from "framer-motion";
import { Dropdown } from "./Dropdown";
import { menuSections } from "./config";

type Props = {
  openKey: string | null;
  onOpen: (key: string | null) => void;
};

export function DesktopMenu({ openKey, onOpen }: Props) {
  return (
    <MotionConfig reducedMotion="user">
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
                className="inline-flex items-center gap-1 px-3 min-h-[44px] text-sm xl:text-base font-medium text-[#171f1d] hover:text-[#1f4d3f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4d3f] focus-visible:ring-offset-2 relative rounded-lg"
                aria-haspopup="menu"
                aria-expanded={openKey === key}
                whileHover={{ 
                  scale: 1.1,
                  backgroundColor: "transparent",
                  color: "#1f4d3f"
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
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1f4d3f]"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
              {/* Invisible bridge fills the gap between button and dropdown so mouseLeave doesn't fire */}
              <div className="absolute left-0 top-full w-full h-2" />
              <AnimatePresence>
                {openKey === key && section.children && (
                  <motion.div
                    className="absolute left-0 top-full pt-2 w-56"
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
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
              className="px-3 min-h-[44px] inline-flex items-center justify-center text-sm xl:text-base font-medium text-[#171f1d] hover:text-[#1f4d3f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4d3f] focus-visible:ring-offset-2 relative rounded-lg whitespace-nowrap"
              rel={section.href?.startsWith("http") ? "noreferrer noopener" : undefined}
            >
              <motion.div
                className="absolute inset-0 bg-[#f4efe5] rounded-lg"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10">{section.label}</span>
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1f4d3f] rounded-full"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </Link>
          </motion.div>
        );
      })}
    </div>
    </MotionConfig>
  );
}
