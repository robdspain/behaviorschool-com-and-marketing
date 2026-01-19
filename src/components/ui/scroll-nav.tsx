"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, useScroll, useSpring } from "framer-motion";

interface ScrollNavItem {
  id: string;
  label: string;
}

interface ScrollNavProps {
  items: ScrollNavItem[];
  className?: string;
}

export function ScrollNav({ items, className }: ScrollNavProps) {
  const [activeSection, setActiveSection] = React.useState<string>("");
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -50% 0px", // Trigger when section is near top
      }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Offset for fixed header/nav
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setActiveSection(id);
    }
  };

  return (
    <div className={cn("sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300", className)}>
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 origin-left"
        style={{ scaleX }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <nav className="flex items-center justify-between h-14 overflow-x-auto no-scrollbar mask-gradient-right" aria-label="Page navigation">
            <ul className="flex items-center space-x-1 sm:space-x-4 min-w-full sm:min-w-0 pr-4 sm:pr-0">
              {items.map((item) => (
                <li key={item.id} className="flex-shrink-0">
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => scrollToSection(e, item.id)}
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 block whitespace-nowrap",
                      activeSection === item.id
                        ? "text-emerald-700 bg-emerald-50"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="hidden sm:block ml-4 flex-shrink-0">
               <a 
                 href="#enroll" 
                 onClick={(e) => scrollToSection(e, 'enroll')}
                 className="text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full transition-colors whitespace-nowrap"
               >
                 Save $500 Today
               </a>
            </div>
          </nav>
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none sm:hidden" />
        </div>
      </div>
    </div>
  );
}
