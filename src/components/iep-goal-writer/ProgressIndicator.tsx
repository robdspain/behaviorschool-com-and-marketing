import { Check } from "lucide-react";

interface ProgressIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <div key={index} className="flex items-center gap-1 shrink-0">
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold transition-colors ${
                isCompleted
                  ? "bg-bs-primary text-white"
                  : isCurrent
                  ? "bg-bs-accent text-bs-primary border-2 border-bs-primary"
                  : "bg-slate-100 text-slate-400"
              }`}
              title={step}
            >
              {isCompleted ? <Check className="w-3.5 h-3.5" /> : index + 1}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 w-6 rounded transition-colors ${
                  index < currentStep ? "bg-bs-primary" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
