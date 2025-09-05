"use client";

import Link from "next/link";
import { TrendingUp, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function LandingNavBar() {
  return (
    <nav
      role="navigation"
      aria-label="Landing Page Navigation"
      className="fixed top-0 left-0 right-0 w-full z-[100] bg-[#1F4D3F]/95 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/" className="flex-shrink-0 flex items-center gap-3">
              <TrendingUp className="h-7 w-7 text-white" />
              <span className="text-white text-lg font-bold">Behavior School</span>
            </Link>
          </motion.div>

          {/* Minimal CTA Navigation */}
          <div className="hidden sm:flex items-center space-x-6">
            <Link 
              href="/community" 
              className="text-white/80 hover:text-white text-sm font-medium transition-colors duration-200"
            >
              Community
            </Link>
            <Link 
              href="/behavior-study-tools" 
              className="text-white/80 hover:text-white text-sm font-medium transition-colors duration-200"
            >
              Study Tools
            </Link>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/transformation-program"
                className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>
          </div>

          {/* Mobile CTA Only */}
          <div className="sm:hidden">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/transformation-program"
                className="inline-flex items-center px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
              >
                Start
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </nav>
  );
}
