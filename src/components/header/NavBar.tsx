"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DesktopMenu } from "./DesktopMenu";
import { MobileMenu } from "./MobileMenu";
import { TRANSFORMATION_PROGRAM } from "@/lib/transformation-program";

export function NavBar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openDesktopKey, setOpenDesktopKey] = useState<string | null>(null);
  const [openMobileKey, setOpenMobileKey] = useState<string | null>(null);

  return (
    <nav
      role="navigation"
      aria-label="Primary"
      className="w-full bg-white/95 backdrop-blur border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 py-4">
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/" className="flex items-center">
              <Image
                src="/behavior-school-wordmark-gold.png"
                alt="Behavior School"
                width={152}
                height={57}
                priority
                className="h-11 w-auto"
              />
            </Link>
          </motion.div>

          <div className="hidden lg:flex items-center gap-6">
            <DesktopMenu openKey={openDesktopKey} onOpen={setOpenDesktopKey} />
            <div className="flex items-center gap-3">
              <Link
                href="/transformation-program"
                className="bs-control bs-focus inline-flex items-center justify-center bg-bs-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-bs-primary-dark"
              >
                {TRANSFORMATION_PROGRAM.cohort.label} Open
              </Link>
              <Link
                href="https://study.behaviorschool.com/free-practice/"
                className="bs-control bs-focus inline-flex items-center justify-center border border-[#1f4d3f]/30 px-4 py-2 text-sm font-semibold text-bs-primary transition hover:bg-[#f2eee6]"
              >
                Free BCBA Exam
              </Link>
            </div>
          </div>

          <div className="lg:hidden flex items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="bs-control bs-focus inline-flex items-center justify-center text-emerald-700 hover:text-emerald-800 p-2"
              aria-label="Toggle menu"
              aria-expanded={isMobileOpen}
            >
              <AnimatePresence mode="wait">
                {isMobileOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      <MobileMenu
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        openKey={openMobileKey}
        onToggleKey={(key) => setOpenMobileKey((prev) => (prev === key ? null : key))}
      />
    </nav>
  );
}
