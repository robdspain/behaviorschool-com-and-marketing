'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { QuizQuestion } from '@/components/ace/QuizQuestion';
import type { AceQuizQuestion } from '@/lib/ace/types';
import {
  Trophy,
  XCircle,
  RotateCcw,
  ArrowRight,
  CheckCircle2,
  Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizAnswer {
  questionId: string;
  selectedAnswers: string[];
}

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  scorePercentage: number;
  passingScore: number;
  passed: boolean;
  questions: AceQuizQuestion[];
  answers: QuizAnswer[];
  correctAnswers: Record<string, string[]>;
  explanations: Record<string, string>;
  showCorrectAnswers: boolean;
  onRetry?: () => void;
  onContinue?: () => void;
  canRetry?: boolean;
  attemptsRemaining?: number | null;
}

export function QuizResults({
  score,
  totalQuestions,
  scorePercentage,
  passingScore,
  passed,
  questions,
  answers,
  correctAnswers,
  showCorrectAnswers,
  onRetry,
  onContinue,
  canRetry = false,
  attemptsRemaining,
}: QuizResultsProps) {
  const getSelectedAnswers = (questionId: string): string[] => {
    const answer = answers.find((a) => a.questionId === questionId);
    return answer?.selectedAnswers || [];
  };

  return (
    <div className="space-y-6">
      {/* Score Summary Card */}
      <Card
        className={cn(
          'overflow-hidden border-2',
          passed ? 'border-emerald-300' : 'border-red-300'
        )}
      >
        {/* Pass/Fail Banner */}
        <div
          className={cn(
            'px-6 py-4',
            passed ? 'bg-emerald-600' : 'bg-red-600'
          )}
        >
          <div className="flex items-center justify-center gap-3">
            {passed ? (
              <Trophy className="h-6 w-6 text-white" />
            ) : (
              <XCircle className="h-6 w-6 text-white" />
            )}
            <h2 className="text-xl font-bold text-white">
              {passed ? 'Congratulations! You Passed!' : 'Quiz Not Passed'}
            </h2>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {/* Score */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <Target className="h-5 w-5 text-gray-400" />
                <p className="text-sm font-medium text-gray-500">Your Score</p>
              </div>
              <p className="mt-1 text-3xl font-bold text-gray-900">
                {score}/{totalQuestions}
              </p>
              <p className="text-sm text-gray-500">questions correct</p>
            </div>

            {/* Percentage */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-gray-400" />
                <p className="text-sm font-medium text-gray-500">Percentage</p>
              </div>
              <p
                className={cn(
                  'mt-1 text-3xl font-bold',
                  passed ? 'text-emerald-600' : 'text-red-600'
                )}
              >
                {scorePercentage}%
              </p>
              <p className="text-sm text-gray-500">
                passing: {passingScore}%
              </p>
            </div>

            {/* Progress Bar Visual */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative h-20 w-20">
                <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={passed ? '#059669' : '#dc2626'}
                    strokeWidth="3"
                    strokeDasharray={`${scorePercentage}, 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className={cn(
                      'text-lg font-bold',
                      passed ? 'text-emerald-600' : 'text-red-600'
                    )}
                  >
                    {scorePercentage}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {passed && onContinue && (
              <Button
                onClick={onContinue}
                className="bg-[#1F4D3F] text-white hover:bg-[#1F4D3F]/90"
              >
                Continue to Feedback
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
            {!passed && canRetry && onRetry && (
              <Button
                onClick={onRetry}
                className="bg-[#D4AF37] text-[#1F4D3F] hover:bg-[#C4A030]"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Retake Quiz
              </Button>
            )}
            {!passed && !canRetry && (
              <p className="text-sm text-red-600">
                No attempts remaining. Please contact your event coordinator.
              </p>
            )}
            {!passed && canRetry && attemptsRemaining !== null && attemptsRemaining !== undefined && (
              <p className="text-sm text-gray-500">
                {attemptsRemaining} attempt{attemptsRemaining !== 1 ? 's' : ''} remaining
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Question-by-Question Breakdown */}
      {showCorrectAnswers && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Question Review
          </h3>
          {questions.map((question, index) => (
            <QuizQuestion
              key={question.id}
              question={question}
              questionNumber={index + 1}
              selectedAnswers={getSelectedAnswers(question.id)}
              onChange={() => {}}
              showResults={true}
              correctAnswers={correctAnswers[question.id] || []}
              disabled={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
