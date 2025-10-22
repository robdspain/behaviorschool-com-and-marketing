'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertCircle, Loader2, ArrowRight, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { QuizQuestion, QuizResult } from '@/lib/masterclass/types';

interface QuizSectionProps {
  sectionNumber: number;
  questions: QuizQuestion[];
  isLocked: boolean; // Locked until video is complete
  isPassed: boolean; // Has user passed this quiz already?
  attemptNumber: number;
  onSubmit: (answers: number[]) => Promise<QuizResult>;
  onNextSection?: () => void;
}

export function QuizSection({
  sectionNumber,
  questions,
  isLocked,
  isPassed,
  attemptNumber,
  onSubmit,
  onNextSection,
}: QuizSectionProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    // Validate all questions answered
    if (selectedAnswers.some(a => a === null)) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await onSubmit(selectedAnswers as number[]);
      setResult(result);
      setShowResults(true);
    } catch (error) {
      console.error('Quiz submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers(Array(questions.length).fill(null));
    setResult(null);
    setShowResults(false);
  };

  const allAnswered = selectedAnswers.every(a => a !== null);

  if (isLocked) {
    return (
      <div className="bg-slate-100 border-2 border-slate-200 rounded-2xl p-8 text-center">
        <div className="max-w-md mx-auto">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">Quiz Locked</h3>
          <p className="text-slate-600">
            Complete the video above to unlock the quiz for this section.
          </p>
        </div>
      </div>
    );
  }

  if (isPassed && !showResults) {
    return (
      <div className="bg-emerald-100 border-2 border-emerald-300 rounded-2xl p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-start gap-4">
            <CheckCircle className="w-8 h-8 text-emerald-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-emerald-900 mb-2">
                Quiz Passed!
              </h3>
              <p className="text-emerald-700 mb-4">
                You&apos;ve successfully completed this section. Great work!
              </p>
              {onNextSection && (
                <Button
                  onClick={onNextSection}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Continue to Next Section
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quiz Header */}
      <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Section {sectionNumber} Quiz
            </h3>
            <p className="text-slate-600">
              Answer all questions correctly to pass this section. You can retake the quiz as many times as needed.
            </p>
          </div>
          {attemptNumber > 1 && (
            <div className="px-3 py-1 bg-blue-100 border border-blue-300 rounded-full">
              <span className="text-sm font-semibold text-blue-700">
                Attempt #{attemptNumber}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {questions.map((question, qIndex) => {
          const userAnswer = selectedAnswers[qIndex];
          const resultForQuestion = result?.results.find(r => r.questionNumber === qIndex + 1);
          const showFeedback = showResults && resultForQuestion;

          return (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: qIndex * 0.1 }}
              className={`
                bg-white border-2 rounded-xl p-6
                ${showFeedback
                  ? resultForQuestion.isCorrect
                    ? 'border-emerald-300 bg-emerald-50'
                    : 'border-red-300 bg-red-50'
                  : 'border-slate-200'
                }
              `}
            >
              {/* Question */}
              <div className="flex items-start gap-3 mb-4">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0
                  ${showFeedback
                    ? resultForQuestion.isCorrect
                      ? 'bg-emerald-500 text-white'
                      : 'bg-red-500 text-white'
                    : 'bg-slate-200 text-slate-700'
                  }
                `}>
                  {showFeedback ? (
                    resultForQuestion.isCorrect ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )
                  ) : (
                    qIndex + 1
                  )}
                </div>
                <p className="text-lg font-semibold text-slate-900 leading-relaxed">
                  {question.question}
                </p>
              </div>

              {/* Answer Options */}
              <div className="space-y-3 ml-11">
                {question.options.map((option, optIndex) => {
                  const isSelected = userAnswer === optIndex;
                  const isCorrect = optIndex === question.correctAnswer;
                  const showCorrect = showResults && isCorrect;
                  const showIncorrect = showResults && isSelected && !isCorrect;

                  return (
                    <button
                      key={optIndex}
                      onClick={() => !showResults && handleAnswerSelect(qIndex, optIndex)}
                      disabled={showResults}
                      className={`
                        w-full text-left p-4 rounded-lg border-2 transition-all duration-200
                        ${showCorrect
                          ? 'border-emerald-500 bg-emerald-100'
                          : showIncorrect
                          ? 'border-red-500 bg-red-100'
                          : isSelected
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50'
                        }
                        ${showResults ? 'cursor-default' : 'cursor-pointer'}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`
                          w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                          ${showCorrect
                            ? 'border-emerald-500 bg-emerald-500'
                            : showIncorrect
                            ? 'border-red-500 bg-red-500'
                            : isSelected
                            ? 'border-emerald-500 bg-emerald-500'
                            : 'border-slate-300'
                          }
                        `}>
                          {(isSelected || showCorrect) && (
                            <div className="w-3 h-3 rounded-full bg-white" />
                          )}
                        </div>
                        <span className={`
                          flex-1 font-medium
                          ${showCorrect || showIncorrect
                            ? 'text-slate-900'
                            : isSelected
                            ? 'text-emerald-900'
                            : 'text-slate-700'
                          }
                        `}>
                          {option}
                        </span>
                        {showCorrect && (
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                        )}
                        {showIncorrect && (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {showFeedback && question.explanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 ml-11"
                  >
                    <div className={`
                      p-4 rounded-lg border
                      ${resultForQuestion.isCorrect
                        ? 'bg-emerald-100 border-emerald-300'
                        : 'bg-blue-100 border-blue-300'
                      }
                    `}>
                      <p className={`text-sm ${resultForQuestion.isCorrect ? 'text-emerald-900' : 'text-blue-900'}`}>
                        <strong>Explanation:</strong> {question.explanation}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Quiz Results */}
      {showResults && result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`
            border-2 rounded-xl p-8
            ${result.passed
              ? 'bg-emerald-100 border-emerald-300'
              : 'bg-red-100 border-red-300'
            }
          `}
        >
          <div className="text-center max-w-2xl mx-auto">
            {result.passed ? (
              <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
            ) : (
              <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            )}

            <h3 className={`text-2xl font-bold mb-2 ${result.passed ? 'text-emerald-900' : 'text-red-900'}`}>
              {result.passed ? 'Congratulations! 🎉' : 'Not Quite There'}
            </h3>

            <p className={`text-lg mb-4 ${result.passed ? 'text-emerald-700' : 'text-red-700'}`}>
              You scored {result.score} out of {result.total}
            </p>

            {result.passed ? (
              <>
                <p className="text-emerald-800 mb-6">
                  Great work! You&apos;ve successfully completed this section.
                </p>
                {onNextSection && (
                  <Button
                    onClick={onNextSection}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    size="lg"
                  >
                    Continue to Next Section
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                )}
              </>
            ) : (
              <>
                <p className="text-red-800 mb-6">
                  You need to get all questions correct to pass. Review the explanations above and try again!
                </p>
                <Button
                  onClick={handleRetry}
                  variant="outline"
                  className="border-2 border-red-500 text-red-700 hover:bg-red-50"
                  size="lg"
                >
                  <RotateCcw className="mr-2 w-5 h-5" />
                  Try Again
                </Button>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* Submit Button */}
      {!showResults && (
        <div className="flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={!allAnswered || isSubmitting}
            size="lg"
            className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white px-8"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit Quiz
                <ArrowRight className="ml-2 w-5 h-5" />
              </>
            )}
          </Button>
        </div>
      )}

      {/* Helper text */}
      {!showResults && !allAnswered && (
        <p className="text-center text-sm text-slate-500">
          Answer all {questions.length} questions to submit the quiz
        </p>
      )}
    </div>
  );
}
