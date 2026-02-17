"use client";

import React from "react";
import { Check } from "lucide-react";

export interface WizardStep {
  id: string;
  label: string;
  completed?: boolean;
}

interface WizardLayoutProps {
  steps: WizardStep[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  children: React.ReactNode;
}

export function WizardLayout({ steps, currentStep, onStepClick, children }: WizardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onStepClick?.(index)}
                    disabled={!onStepClick}
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-semibold
                      transition-all duration-200
                      ${
                        index < currentStep
                          ? "bg-emerald-500 text-white"
                          : index === currentStep
                          ? "bg-emerald-600 text-white ring-4 ring-emerald-100"
                          : "bg-slate-200 text-slate-500"
                      }
                      ${onStepClick && index < currentStep ? "hover:bg-emerald-600 cursor-pointer" : ""}
                      ${!onStepClick ? "cursor-default" : ""}
                    `}
                  >
                    {index < currentStep ? <Check className="w-5 h-5" /> : <span>{index + 1}</span>}
                  </button>
                  <div className="hidden sm:block">
                    <div
                      className={`text-sm font-medium ${
                        index === currentStep ? "text-emerald-700" : "text-slate-600"
                      }`}
                    >
                      {step.label}
                    </div>
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-slate-200 mx-2 sm:mx-4">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{ width: index < currentStep ? "100%" : "0%" }}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="sm:hidden mt-3 text-center">
            <div className="text-sm font-medium text-emerald-700">
              {steps[currentStep]?.label}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
    </div>
  );
}

interface WizardStepContainerProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function WizardStepContainer({ title, description, children }: WizardStepContainerProps) {
  return (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{title}</h2>
        {description && <p className="text-slate-600">{description}</p>}
      </div>
      {children}
    </div>
  );
}

interface WizardNavigationProps {
  onBack?: () => void;
  onNext?: () => void;
  onSaveDraft?: () => void;
  nextLabel?: string;
  backLabel?: string;
  showBack?: boolean;
  showNext?: boolean;
  nextDisabled?: boolean;
}

export function WizardNavigation({
  onBack,
  onNext,
  onSaveDraft,
  nextLabel = "Next Step",
  backLabel = "Back",
  showBack = true,
  showNext = true,
  nextDisabled = false,
}: WizardNavigationProps) {
  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
      <div>
        {showBack && onBack && (
          <button
            onClick={onBack}
            className="px-5 py-2.5 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors font-medium"
          >
            {backLabel}
          </button>
        )}
      </div>

      <div className="flex gap-3">
        {onSaveDraft && (
          <button
            onClick={onSaveDraft}
            className="px-5 py-2.5 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium"
          >
            Save Draft
          </button>
        )}
        {showNext && onNext && (
          <button
            onClick={onNext}
            disabled={nextDisabled}
            className={`
              px-5 py-2.5 rounded-lg font-medium transition-colors
              ${
                nextDisabled
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              }
            `}
          >
            {nextLabel}
          </button>
        )}
      </div>
    </div>
  );
}
