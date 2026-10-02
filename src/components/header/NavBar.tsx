"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
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
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/behavior-school-wordmark-gold.png"
                alt="Behavior School home"
                width={152}
                height={57}
                priority
                className="h-11 w-auto"
              />
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <DesktopMenu openKey={openDesktopKey} onOpen={setOpenDesktopKey} />
            <div className="flex items-center gap-6">
              <Link
                href="/transformation-program"
                className="bs-btn-nav"
              >
                Transformation Program
              </Link>
            </div>
          </div>

          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="text-[#171f1d] hover:text-[#1f4d3f] p-2.5 min-h-[44px] min-w-[44px]"
              aria-label="Toggle menu"
              aria-expanded={isMobileOpen}
            >
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
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
