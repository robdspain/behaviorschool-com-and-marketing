"use client";

import * as React from "react";

type Item = {
  label: string;
  min: number; // in thousands, e.g., 65 for $65k
  max: number; // in thousands
};

export function RangeBarChart({
  items,
  title = "Salary Range Chart",
  note,
}: {
  items: Item[];
  title?: string;
  note?: string;
}) {
  const overallMax = React.useMemo(() => Math.max(...items.map((d) => d.max)), [items]);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <span className="text-xs text-slate-500">USD thousands</span>
      </div>
      <div className="space-y-3">
        {items.map((d) => {
          const left = (d.min / overallMax) * 100;
          const width = ((d.max - d.min) / overallMax) * 100;
          return (
            <div key={d.label} className="">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-slate-800">{d.label}</span>
                <span className="text-xs text-slate-600 tabular-nums">
                  ${d.min}k–${d.max}k
                </span>
              </div>
              <div className="relative h-3 bg-slate-100 rounded">
                <div
                  className="absolute top-0 h-3 bg-emerald-500 rounded"
                  style={{ left: `${left}%`, width: `${width}%` }}
                  aria-label={`${d.label} salary range`}
                  role="img"
                />
              </div>
            </div>
          );
        })}
      </div>
      {note ? (
        <p className="mt-3 text-xs text-slate-500">
          {note}
        </p>
      ) : null}
    </div>
  );
}

