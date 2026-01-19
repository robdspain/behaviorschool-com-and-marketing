"use client";

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function CurriculumProgress() {
  const [activeWeek, setActiveWeek] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const week = parseInt(entry.target.getAttribute('data-week') || '0');
            setActiveWeek(week);
          }
        });
      },
      { rootMargin: '-20% 0px -50% 0px' }
    );

    document.querySelectorAll('[data-week]').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="hidden lg:block absolute left-0 top-32 bottom-0 w-12 z-10 pointer-events-none">
      <div className="sticky top-32 flex flex-col gap-2 items-center">
        {Array.from({ length: 8 }).map((_, i) => {
          const weekNum = i + 1;
          const isActive = weekNum === activeWeek;
          const isPast = weekNum < activeWeek;

          return (
            <div key={i} className="flex items-center gap-2">
              <div 
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  isActive ? "bg-emerald-600 scale-150" : isPast ? "bg-emerald-300" : "bg-slate-200"
                )}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
