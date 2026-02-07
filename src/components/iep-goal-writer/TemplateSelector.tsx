"use client";

import { cn } from "@/lib/utils";
import { goalTemplates, type GoalTemplate } from "./goalTemplates";

const colorMap: Record<string, { border: string; bg: string; text: string; badge: string }> = {
  red: { border: "border-red-200", bg: "bg-red-50/70", text: "text-red-800", badge: "bg-red-100 text-red-700" },
  orange: { border: "border-orange-200", bg: "bg-orange-50/70", text: "text-orange-800", badge: "bg-orange-100 text-orange-700" },
  purple: { border: "border-purple-200", bg: "bg-purple-50/70", text: "text-purple-800", badge: "bg-purple-100 text-purple-700" },
  amber: { border: "border-amber-200", bg: "bg-amber-50/70", text: "text-amber-800", badge: "bg-amber-100 text-amber-700" },
  blue: { border: "border-blue-200", bg: "bg-blue-50/70", text: "text-blue-800", badge: "bg-blue-100 text-blue-700" },
};

interface TemplateSelectorProps {
  onSelect: (template: GoalTemplate) => void;
  onSkip: () => void;
}

export function TemplateSelector({ onSelect, onSkip }: TemplateSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-slate-900">Start from a template</p>
        <p className="text-xs text-slate-500">
          Pick a common behavior area to pre-fill the wizard with expert-level defaults, or start blank.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {goalTemplates.map((template) => {
          const colors = colorMap[template.color] ?? colorMap.blue;
          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelect(template)}
              className={cn(
                "group flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition hover:shadow-md",
                colors.border,
                colors.bg,
              )}
            >
              <div className="flex w-full items-center justify-between">
                <span className="text-2xl">{template.emoji}</span>
                <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", colors.badge)}>
                  Template
                </span>
              </div>
              <p className={cn("text-sm font-semibold", colors.text)}>{template.title}</p>
              <p className="text-xs text-slate-600 line-clamp-2">{template.description}</p>
            </button>
          );
        })}

        <button
          type="button"
          onClick={onSkip}
          className="flex flex-col items-start gap-2 rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-left transition hover:border-emerald-400 hover:shadow-md"
        >
          <span className="text-2xl">✏️</span>
          <p className="text-sm font-semibold text-slate-700">Start Blank</p>
          <p className="text-xs text-slate-500">Build your goal from scratch using the wizard.</p>
        </button>
      </div>
    </div>
  );
}
