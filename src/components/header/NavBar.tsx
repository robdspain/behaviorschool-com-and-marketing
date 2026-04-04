"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DesktopMenu } from "./DesktopMenu";
import { MobileMenu } from "./MobileMenu";

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
            <Link href="/" className="flex items-center gap-3">
              <span className="relative h-9 w-9 rounded-full bg-[#1f4d3f]/10 flex items-center justify-center">
                <Image
                  src="/Logos/Logo.webp"
                  alt="BehaviorSchool logo"
                  width={24}
                  height={24}
                />
              </span>
              <span className="text-[#1f4d3f] text-lg font-bold tracking-tight">BehaviorSchool</span>
            </Link>
          </motion.div>

          <div className="hidden lg:flex items-center gap-6">
            <DesktopMenu openKey={openDesktopKey} onOpen={setOpenDesktopKey} />
            <div className="flex items-center gap-3">
              <Link
                href="https://plan.behaviorschool.com"
                className="inline-flex items-center justify-center rounded-full bg-[#1f4d3f] px-5 py-2 text-sm font-semibold text-white hover:bg-[#173a2f] transition"
              >
                Join Waitlist
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-[#1f4d3f]/30 px-4 py-2 text-sm font-semibold text-[#1f4d3f] hover:bg-[#1f4d3f]/10 transition"
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="lg:hidden flex items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="text-emerald-700 hover:text-emerald-800 p-2"
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
