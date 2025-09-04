"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, TrendingUp } from "lucide-react";
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
      className="fixed top-0 left-0 right-0 w-full z-[100] bg-[#1F4D3F]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/" className="flex-shrink-0 flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-white" />
              <span className="text-white text-xl font-bold">Behavior School</span>
            </Link>
          </motion.div>

          <DesktopMenu openKey={openDesktopKey} onOpen={setOpenDesktopKey} />

          <div className="md:hidden flex items-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="text-white hover:text-white/90 p-2"
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


