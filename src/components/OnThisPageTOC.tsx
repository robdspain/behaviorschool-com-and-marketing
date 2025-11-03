"use client";

import { useEffect, useMemo, useState } from "react";

type TocItem = { id: string; label: string };

export function OnThisPageTOC({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const ids = useMemo(() => items.map((i) => i.id), [items]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (sections.length === 0) return;

    // Initialize from hash if present
    const fromHash = window.location.hash?.replace(/^#/, "");
    if (fromHash && ids.includes(fromHash)) {
      setActiveId(fromHash);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top that's intersecting
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          const topMost = visible[0];
          const id = topMost.target.getAttribute("id");
          if (id && id !== activeId) setActiveId(id);
          return;
        }

        // Fallback: find the last section above the top threshold
        const viewportTop = 0;
        const tops = sections.map((s) => ({ id: s.id, top: s.getBoundingClientRect().top }));
        const above = tops
          .filter((t) => t.top <= viewportTop + 120) // header offset tolerance
          .sort((a, b) => b.top - a.top);
        if (above.length > 0 && above[0].id !== activeId) setActiveId(above[0].id);
      },
      {
        // Trigger when section top nears the top; bias toward highlighting current section
        root: null,
        rootMargin: "-20% 0px -70% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach((sec) => observer.observe(sec));

    const onHashChange = () => {
      const h = window.location.hash?.replace(/^#/, "");
      if (h && ids.includes(h)) setActiveId(h);
    };
    window.addEventListener("hashchange", onHashChange);

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [ids, activeId]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
      <h3 className="font-bold text-lg text-slate-900 mb-4">On this page</h3>
      <ul className="space-y-2 text-slate-700">
        {items.map(({ id, label }) => {
          const isActive = activeId === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={isActive ? "location" : undefined}
                className={[
                  "relative block pl-4 py-1 transition-colors duration-200",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 rounded-md",
                  isActive
                    ? "text-emerald-700 font-semibold"
                    : "hover:text-emerald-700",
                ].join(" ")}
              >
                <span
                  aria-hidden
                  className={[
                    "absolute left-0 top-1 bottom-1 w-1 rounded bg-emerald-600",
                    "transition-transform duration-300 origin-top",
                    isActive ? "scale-y-100 opacity-100" : "scale-y-0 opacity-40",
                  ].join(" ")}
                />
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
