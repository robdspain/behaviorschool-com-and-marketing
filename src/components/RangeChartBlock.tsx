"use client";

import { useEffect, useState } from "react";
import { RangeBarChart } from "@/components/RangeBarChart";

export function RangeChartBlock() {
  const fallback = [
    { label: "California", min: 90, max: 125 },
    { label: "Texas", min: 70, max: 95 },
    { label: "Florida", min: 65, max: 90 },
    { label: "New York", min: 80, max: 115 },
    { label: "Illinois", min: 72, max: 100 },
    { label: "Arizona", min: 65, max: 90 },
    { label: "Pennsylvania", min: 70, max: 95 },
    { label: "Ohio", min: 68, max: 92 },
    { label: "Washington", min: 85, max: 115 },
    { label: "Massachusetts", min: 85, max: 120 },
  ];

  const [mode, setMode] = useState<"selected" | "sorted">("selected");
  const [items, setItems] = useState(fallback);
  const [noteYear, setNoteYear] = useState<number | null>(null);
  const [fetchFailed, setFetchFailed] = useState(false);

  // Try to fetch published data if available
  useEffect(() => {
    let active = true;
    fetch("/data/salary-benchmarks.json", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!active || !json) return;
        if (Array.isArray(json.items)) {
          const parsed = json.items
            .filter((d: any) => d && d.label && typeof d.min === "number" && typeof d.max === "number")
            .map((d: any) => ({ label: String(d.label), min: d.min, max: d.max }));
          if (parsed.length > 0) setItems(parsed);
        }
        if (typeof json.year === "number") setNoteYear(json.year);
      })
      .catch(() => {
        // Use fallback and display message
        setFetchFailed(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const sorted = [...items].sort((a, b) => b.max - a.max);
  const view = mode === "selected" ? items : sorted;

  return (
    <div className="mt-8">
      {/* Toggle */}
      <div className="inline-flex rounded-lg border border-slate-200 bg-white overflow-hidden">
        <button
          type="button"
          onClick={() => setMode("selected")}
          className={[
            "px-3 py-1.5 text-sm font-medium transition-colors",
            mode === "selected" ? "bg-emerald-600 text-white" : "text-slate-700 hover:bg-slate-50",
          ].join(" ")}
          aria-pressed={mode === "selected"}
        >
          Selected States
        </button>
        <button
          type="button"
          onClick={() => setMode("sorted")}
          className={[
            "px-3 py-1.5 text-sm font-medium transition-colors border-l border-slate-200",
            mode === "sorted" ? "bg-emerald-600 text-white" : "text-slate-700 hover:bg-slate-50",
          ].join(" ")}
          aria-pressed={mode === "sorted"}
        >
          Top by Max
        </button>
      </div>

      {fetchFailed && (
        <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-sm">
          Could not load the latest salary benchmarks right now. Showing a fallback snapshot. Please check back later.
        </div>
      )}

      <RangeBarChart
        items={view}
        title={mode === "selected" ? "Benchmark Salary Ranges (selected states)" : "Top States by Upper Range (sorted by max)"}
        note={
          mode === "selected"
            ? `Plus (+) signs in some ranges indicate postings above the plotted max; chart uses a conservative cap for visualization.${noteYear ? ` Data reflects ~${noteYear}.` : ""}`
            : "Sorted descending by max $k bound across selected states."
        }
      />
    </div>
  );
}
