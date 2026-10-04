"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { LazyMotion } from "framer-motion";
import { DesktopMenu } from "./DesktopMenu";
import { MobileMenu } from "./MobileMenu";

const loadMotionFeatures = () => import("./motion-features").then((mod) => mod.default);

export function NavBar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openDesktopKey, setOpenDesktopKey] = useState<string | null>(null);
  const [openMobileKey, setOpenMobileKey] = useState<string | null>(null);
  const [menuTop, setMenuTop] = useState(64);
  const barRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);
  const pathname = usePathname();

  const measureMenuTop = () => {
    const bottom = barRef.current?.getBoundingClientRect().bottom ?? 64;
    setMenuTop(bottom);
  };

  useEffect(() => {
    setIsMobileOpen(false);
    setOpenMobileKey(null);
    setOpenDesktopKey(null);
  }, [pathname]);

  useEffect(() => {
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const header = barRef.current?.closest("header");
      if (!header || header.contains(target)) return;
      if (target.closest("a[href='#main-content']")) return;
      if (window.getComputedStyle(target).position === "fixed") return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const behavior: ScrollBehavior = reducedMotion ? "auto" : "instant";

      const headerBottom = () => header.getBoundingClientRect().bottom;
      const rect = target.getBoundingClientRect();
      const bottom = headerBottom();

      if (rect.top < bottom + 8 && rect.bottom > 0) {
        window.scrollBy({ top: rect.top - bottom - 16, behavior });
        return;
      }

      if (rect.bottom > window.innerHeight) {
        const startY = window.scrollY;
        requestAnimationFrame(() => {
          if (window.scrollY !== startY) return;
          const next = target.getBoundingClientRect();
          const nextHeaderBottom = headerBottom();
          if (next.bottom > window.innerHeight && next.top >= nextHeaderBottom + 8) {
            window.scrollBy({ top: next.bottom - window.innerHeight + 16, behavior });
          }
        });
      }
    };

    document.addEventListener("focusin", onFocusIn);
    return () => document.removeEventListener("focusin", onFocusIn);
  }, []);

  useEffect(() => {
    if (wasOpenRef.current && !isMobileOpen) {
      toggleRef.current?.focus();
    }
    wasOpenRef.current = isMobileOpen;
  }, [isMobileOpen]);

  useLayoutEffect(() => {
    if (!isMobileOpen) return;
    measureMenuTop();
  }, [isMobileOpen]);

  useEffect(() => {
    if (!isMobileOpen) return;

    const scrollY = window.scrollY;
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const covered = Array.from(document.querySelectorAll("main, footer"));
    covered.forEach((node) => node.setAttribute("inert", ""));

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileOpen(false);
    };
    const onResize = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        setIsMobileOpen(false);
        return;
      }
      measureMenuTop();
    };
    const preventBackgroundScroll = (event: Event) => {
      const menu = document.getElementById("primary-mobile-menu");
      if (menu && event.target instanceof Node && menu.contains(event.target)) return;
      event.preventDefault();
    };

    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    document.addEventListener("wheel", preventBackgroundScroll, { passive: false });
    document.addEventListener("touchmove", preventBackgroundScroll, { passive: false });

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      covered.forEach((node) => node.removeAttribute("inert"));
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("wheel", preventBackgroundScroll);
      document.removeEventListener("touchmove", preventBackgroundScroll);
      window.scrollTo(0, scrollY);
    };
  }, [isMobileOpen]);

  return (
    <LazyMotion features={loadMotionFeatures}>
    <header className={isMobileOpen ? "fixed inset-x-0 top-0 z-50" : "sticky top-0 z-50"}>
    <nav aria-label="Primary" className="w-full">
      <div ref={barRef} className="w-full bg-white/95 backdrop-blur border-b border-[#d9cdb8]">
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
                fetchPriority="high"
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
              ref={toggleRef}
              onClick={() => {
                if (!isMobileOpen) measureMenuTop();
                setIsMobileOpen(!isMobileOpen);
              }}
              className="text-[#171f1d] hover:text-[#1f4d3f] p-2.5 min-h-[44px] min-w-[44px]"
              aria-label="Toggle menu"
              aria-expanded={isMobileOpen}
              aria-controls="primary-mobile-menu"
            >
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      </div>

      <MobileMenu
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        openKey={openMobileKey}
        onToggleKey={(key) => setOpenMobileKey((prev) => (prev === key ? null : key))}
        menuTop={menuTop}
      />
    </nav>
    </header>
    </LazyMotion>
  );
}
