import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        {steps.map((_, index) => {
          const isActive = index === currentStep;
          const isComplete = index < currentStep;
          return (
            <div key={index} className="flex flex-1 items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold transition",
                  isActive && "border-emerald-600 bg-emerald-600 text-white",
                  isComplete && !isActive && "border-emerald-200 bg-emerald-100 text-emerald-700",
                  !isActive && !isComplete && "border-slate-200 bg-white text-slate-500"
                )}
              >
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-1 flex-1 rounded-full",
                    isComplete ? "bg-emerald-500" : "bg-slate-200"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-5 text-[11px] font-medium text-slate-500">
        {steps.map((label, index) => (
          <div
            key={label}
            className={cn(
              "text-center",
              index === currentStep && "text-emerald-700"
            )}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
