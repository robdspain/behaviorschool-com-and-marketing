'use client';

import { cn } from '@/lib/utils';
import type { AceQuizQuestion } from '@/lib/ace/types';
import { CheckCircle2, XCircle } from 'lucide-react';

interface QuizQuestionProps {
  question: AceQuizQuestion;
  questionNumber: number;
  selectedAnswers: string[];
  onChange: (questionId: string, answers: string[]) => void;
  showResults?: boolean;
  correctAnswers?: string[];
  disabled?: boolean;
}

export function QuizQuestion({
  question,
  questionNumber,
  selectedAnswers,
  onChange,
  showResults = false,
  correctAnswers = [],
  disabled = false,
}: QuizQuestionProps) {
  const isCorrect =
    showResults &&
    selectedAnswers.length === correctAnswers.length &&
    selectedAnswers.every((a) => correctAnswers.includes(a));

  const handleSingleSelect = (optionId: string) => {
    if (disabled) return;
    onChange(question.id, [optionId]);
  };

  const handleMultiSelect = (optionId: string) => {
    if (disabled) return;
    const current = [...selectedAnswers];
    const index = current.indexOf(optionId);
    if (index === -1) {
      current.push(optionId);
    } else {
      current.splice(index, 1);
    }
    onChange(question.id, current);
  };

  const isSingleChoice =
    question.question_type === 'multiple_choice' ||
    question.question_type === 'true_false';

  const options =
    question.question_type === 'true_false'
      ? [
          { id: 'true', text: 'True' },
          { id: 'false', text: 'False' },
        ]
      : question.options;

  return (
    <div
      className={cn(
        'rounded-lg border p-6 transition-colors',
        showResults && isCorrect && 'border-emerald-300 bg-emerald-50/50',
        showResults && !isCorrect && 'border-red-300 bg-red-50/50',
        !showResults && 'border-gray-200 bg-white'
      )}
    >
      {/* Question Header */}
      <div className="mb-4 flex items-start gap-3">
        <span
          className={cn(
            'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
            showResults && isCorrect && 'bg-emerald-100 text-emerald-700',
            showResults && !isCorrect && 'bg-red-100 text-red-700',
            !showResults && 'bg-[#1F4D3F]/10 text-[#1F4D3F]'
          )}
        >
          {questionNumber}
        </span>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">
            {question.question_text}
          </p>
          {question.question_type === 'multiple_select' && !showResults && (
            <p className="mt-1 text-xs text-gray-500">
              Select all that apply
            </p>
          )}
          {question.points > 1 && (
            <p className="mt-1 text-xs text-gray-400">
              {question.points} points
            </p>
          )}
        </div>
        {showResults && (
          <div className="shrink-0">
            {isCorrect ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
          </div>
        )}
      </div>

      {/* Options */}
      <div className="ml-10 space-y-2">
        {options.map((option) => {
          const isSelected = selectedAnswers.includes(option.id);
          const isCorrectOption = correctAnswers.includes(option.id);

          return (
            <label
              key={option.id}
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-colors',
                disabled && 'cursor-default',
                // Default states
                !showResults && !isSelected && 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50',
                !showResults && isSelected && 'border-[#1F4D3F] bg-[#1F4D3F]/5',
                // Results states
                showResults && isSelected && isCorrectOption && 'border-emerald-400 bg-emerald-50',
                showResults && isSelected && !isCorrectOption && 'border-red-400 bg-red-50',
                showResults && !isSelected && isCorrectOption && 'border-emerald-300 bg-emerald-50/50',
                showResults && !isSelected && !isCorrectOption && 'border-gray-200 bg-white'
              )}
            >
              {/* Radio or Checkbox */}
              <div className="shrink-0">
                {isSingleChoice ? (
                  <div
                    className={cn(
                      'flex h-4 w-4 items-center justify-center rounded-full border-2',
                      !showResults && !isSelected && 'border-gray-300',
                      !showResults && isSelected && 'border-[#1F4D3F] bg-[#1F4D3F]',
                      showResults && isSelected && isCorrectOption && 'border-emerald-500 bg-emerald-500',
                      showResults && isSelected && !isCorrectOption && 'border-red-500 bg-red-500',
                      showResults && !isSelected && isCorrectOption && 'border-emerald-400',
                      showResults && !isSelected && !isCorrectOption && 'border-gray-300'
                    )}
                  >
                    {isSelected && (
                      <div className="h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </div>
                ) : (
                  <div
                    className={cn(
                      'flex h-4 w-4 items-center justify-center rounded border-2',
                      !showResults && !isSelected && 'border-gray-300',
                      !showResults && isSelected && 'border-[#1F4D3F] bg-[#1F4D3F]',
                      showResults && isSelected && isCorrectOption && 'border-emerald-500 bg-emerald-500',
                      showResults && isSelected && !isCorrectOption && 'border-red-500 bg-red-500',
                      showResults && !isSelected && isCorrectOption && 'border-emerald-400',
                      showResults && !isSelected && !isCorrectOption && 'border-gray-300'
                    )}
                  >
                    {isSelected && (
                      <svg
                        className="h-3 w-3 text-white"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M2 6l3 3 5-5" />
                      </svg>
                    )}
                  </div>
                )}
              </div>

              {/* Hidden native input for accessibility */}
              <input
                type={isSingleChoice ? 'radio' : 'checkbox'}
                name={`question-${question.id}`}
                value={option.id}
                checked={isSelected}
                onChange={() =>
                  isSingleChoice
                    ? handleSingleSelect(option.id)
                    : handleMultiSelect(option.id)
                }
                disabled={disabled}
                className="sr-only"
              />

              {/* Option text */}
              <span
                className={cn(
                  'flex-1',
                  showResults && isSelected && isCorrectOption && 'font-medium text-emerald-800',
                  showResults && isSelected && !isCorrectOption && 'font-medium text-red-800',
                  showResults && !isSelected && isCorrectOption && 'text-emerald-700',
                  !showResults && isSelected && 'font-medium text-[#1F4D3F]',
                  !showResults && !isSelected && 'text-gray-700'
                )}
              >
                {option.text}
              </span>

              {/* Result indicators */}
              {showResults && isSelected && isCorrectOption && (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              )}
              {showResults && isSelected && !isCorrectOption && (
                <XCircle className="h-4 w-4 shrink-0 text-red-600" />
              )}
              {showResults && !isSelected && isCorrectOption && (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              )}
            </label>
          );
        })}
      </div>

      {/* Explanation (shown in results mode) */}
      {showResults && question.explanation && (
        <div className="ml-10 mt-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
          <p className="text-xs font-medium text-blue-800">Explanation</p>
          <p className="mt-1 text-sm text-blue-700">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
