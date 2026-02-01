import { cn } from "@/lib/utils";

interface ValueCardProps {
  emoji: string;
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

export function ValueCard({ emoji, label, description, selected, onClick }: ValueCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "group flex h-full flex-col gap-3 rounded-2xl border px-4 py-4 text-left transition",
        selected
          ? "border-emerald-600 bg-emerald-50 shadow-[0_10px_30px_-20px_rgba(4,120,87,0.6)]"
          : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/40"
      )}
    >
      <div className="text-2xl">{emoji}</div>
      <div className="space-y-1">
        <div className="text-base font-semibold text-slate-900">{label}</div>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
    </button>
  );
}
