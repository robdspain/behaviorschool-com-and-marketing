"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, ArrowRight, RefreshCw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import confetti from "canvas-confetti";
import { getEncryptedLocal, setEncryptedLocal } from "@/lib/ferpa-client-crypto";

interface QuizQuestion {
  id: string;
  tag: string;
  stem: string;
  choices: string[];
  answer: string;
  letter: string;
  explanation: string;
}

interface FreeQuizWidgetProps {
  questions: QuizQuestion[];
  title?: string;
  ctaUrl?: string;
  ctaText?: string;
}

export function FreeQuizWidget({
  questions,
  ctaUrl = "https://study.behaviorschool.com",
}: FreeQuizWidgetProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [isComplete, setIsComplete] = useState(false);
  const [attemptsToday, setAttemptsToday] = useState(0);
  const [dailyLimitReached, setDailyLimitReached] = useState(false);
  const [timeUntilReset, setTimeUntilReset] = useState("");

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((answeredQuestions.size) / questions.length) * 100;

  // Daily limit tracking
  useEffect(() => {
    const checkDailyLimit = async () => {
      const today = new Date().toDateString();
      const storedData = await getEncryptedLocal<{ date: string; attempts: number }>('quiz_attempts');
      
      if (storedData) {
        const { date, attempts } = storedData;
        
        if (date === today) {
          setAttemptsToday(attempts);
          if (attempts >= 3) {
            setDailyLimitReached(true);
          }
        } else {
          // New day, reset
          await setEncryptedLocal('quiz_attempts', { date: today, attempts: 0 });
          setAttemptsToday(0);
          setDailyLimitReached(false);
        }
      } else {
        // First time
        await setEncryptedLocal('quiz_attempts', { date: today, attempts: 0 });
        setAttemptsToday(0);
      }
    };

    checkDailyLimit();
  }, []);

  // Calculate time until reset
  useEffect(() => {
    if (!dailyLimitReached) return;

    const updateTimeUntilReset = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeUntilReset(`${hours}h ${minutes}m`);
    };

    updateTimeUntilReset();
    const interval = setInterval(updateTimeUntilReset, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [dailyLimitReached]);

  const handleAnswerSelect = (answer: string) => {
    if (showExplanation) return;
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer === currentQuestion.answer;

    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }

    setAnsweredQuestions(prev => new Set([...prev, currentQuestionIndex]));
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setIsComplete(true);
      // Trigger confetti if perfect score
      if (correctAnswers + (selectedAnswer === currentQuestion.answer ? 1 : 0) === questions.length) {
        triggerPerfectScoreConfetti();
      }
    }
  };

  const triggerPerfectScoreConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const handleRestart = async () => {
    // Check and increment daily attempts
    const today = new Date().toDateString();
    const storedData = await getEncryptedLocal<{ date: string; attempts: number }>('quiz_attempts');
    
    if (storedData) {
      const { date, attempts } = storedData;
      
      if (date === today) {
        const newAttempts = attempts + 1;
        await setEncryptedLocal('quiz_attempts', { date: today, attempts: newAttempts });
        setAttemptsToday(newAttempts);
        
        if (newAttempts >= 3) {
          setDailyLimitReached(true);
          return; // Don't restart if limit reached
        }
      } else {
        // New day
        await setEncryptedLocal('quiz_attempts', { date: today, attempts: 1 });
        setAttemptsToday(1);
      }
    }

    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setAnsweredQuestions(new Set());
    setCorrectAnswers(0);
    setStartTime(Date.now());
    setIsComplete(false);
  };

  const getLetterFromIndex = (index: number): string => {
    return String.fromCharCode(65 + index); // A, B, C, D
  };

  if (isComplete) {
    const percentage = Math.round((correctAnswers / questions.length) * 100);
    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    const isPerfectScore = correctAnswers === questions.length;

    // Build context URL for study app
    const studyAuthUrl = `${ctaUrl}/auth?source=free-quiz&score=${correctAnswers}&total=${questions.length}&time=${totalTime}&action=signup`;

    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 lg:p-10">
          <div className="text-center mb-10">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
              isPerfectScore
                ? 'bg-bs-accent'
                : 'bg-emerald-100'
            }`}>
              {isPerfectScore ? (
                <span className="text-5xl">🏆</span>
              ) : (
                <CheckCircle className="w-12 h-12 text-emerald-600" />
              )}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
              {isPerfectScore ? '🎉 Perfect Score!' : 'Quiz Complete!'}
            </h2>
            <p className="text-lg sm:text-xl text-slate-600">
              {isPerfectScore
                ? 'Outstanding! You aced all 10 questions!'
                : 'Great job completing the practice quiz'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10">
            <div className="text-center p-6 bg-slate-50 rounded-xl border-2 border-slate-200">
              <div className="text-4xl font-bold text-emerald-600 mb-2">
                {correctAnswers}/{questions.length}
              </div>
              <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                Correct Answers
              </div>
            </div>
            <div className="text-center p-6 bg-slate-50 rounded-xl border-2 border-slate-200">
              <div className="text-4xl font-bold text-emerald-600 mb-2">
                {percentage}%
              </div>
              <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                Score
              </div>
            </div>
            <div className="text-center p-6 bg-slate-50 rounded-xl border-2 border-slate-200">
              <div className="text-4xl font-bold text-emerald-600 mb-2">
                {minutes}:{seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                Time
              </div>
            </div>
          </div>

          {/* Daily Limit Warning */}
          {dailyLimitReached && (
            <div className="mb-8 p-5 bg-red-50 border-2 border-red-300 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <span className="text-3xl">🔒</span>
                </div>
                <div className="flex-1">
                  <p className="text-base font-bold text-red-900 mb-2">
                    Daily Practice Limit Reached
                  </p>
                  <p className="text-sm text-red-800 mb-3">
                    You&apos;ve completed 3 free quizzes today. Reset in {timeUntilReset}
                  </p>
                  <p className="text-sm font-semibold text-red-900">
                    Create a free account for unlimited practice questions!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Progress Warning */}
          {!isPerfectScore && !dailyLimitReached && (
            <div className="mb-8 p-5 bg-amber-50 border-2 border-amber-300 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <span className="text-3xl">⚠️</span>
                </div>
                <div className="flex-1">
                  <p className="text-base font-bold text-amber-900 mb-2">
                    Your progress isn&apos;t saved
                  </p>
                  <p className="text-sm text-amber-800">
                    Create a free account to save your score and track improvement over time
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Attempts Counter */}
          {!dailyLimitReached && attemptsToday > 0 && (
            <div className="mb-8 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
              <p className="text-sm text-center text-blue-900">
                📊 Quiz attempts today: <span className="font-bold">{attemptsToday}/3</span> free attempts · <span className="font-semibold">Create account for unlimited</span>
              </p>
            </div>
          )}

          {isPerfectScore && (
            <div className="mb-8 p-5 bg-bs-accent border-2 border-amber-400 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <span className="text-3xl">🎯</span>
                </div>
                <div className="flex-1">
                  <p className="text-base font-bold text-amber-900 mb-2">
                    Perfect Score Achievement Unlocked! 🏆
                  </p>
                  <p className="text-sm text-amber-900">
                    You&apos;re in the top 5% of quiz takers! Save your perfect score and unlock more achievements.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <Link href={studyAuthUrl} className="block">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-lg sm:text-xl py-6 sm:py-7 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
                <Save className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                Save My Progress & Continue
                <div className="ml-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold">
                  Free Forever
                </div>
              </Button>
            </Link>
            <Button
              onClick={handleRestart}
              variant="outline"
              className="w-full text-lg sm:text-xl py-6 sm:py-7 rounded-xl border-2 border-slate-300 text-slate-700 hover:bg-slate-50 transition-all"
              disabled={dailyLimitReached}
            >
              <RefreshCw className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
              {dailyLimitReached ? `Reset in ${timeUntilReset}` : 'Try Again as Guest'}
            </Button>
            <p className="text-center text-sm text-slate-600 pt-2">
              Already have an account? <Link href={`${ctaUrl}/auth?action=login`} className="text-emerald-700 hover:text-emerald-800 font-semibold">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
        {/* Progress Bar */}
        <div className="bg-slate-50 px-4 sm:px-6 py-4 sm:py-5 border-b-2 border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm sm:text-base font-semibold text-slate-900">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-sm sm:text-base font-semibold text-slate-600">
              {answeredQuestions.size} answered
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div
              className="bg-emerald-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Content */}
        <div className="p-6 sm:p-8 lg:p-10">
          {/* Task Tag */}
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-800 text-sm font-semibold rounded-full">
              {currentQuestion.tag}
            </span>
          </div>

          {/* Question Text */}
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-8 leading-relaxed">
            {currentQuestion.stem}
          </h3>

          {/* Answer Choices */}
          <div className="space-y-4 mb-8">
            {currentQuestion.choices.map((choice, index) => {
              const letter = getLetterFromIndex(index);
              const isSelected = selectedAnswer === choice;
              const isCorrect = showExplanation && choice === currentQuestion.answer;
              const isIncorrect = showExplanation && isSelected && choice !== currentQuestion.answer;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(choice)}
                  disabled={showExplanation}
                  className={`
                    w-full p-5 sm:p-6 text-left border-2 rounded-xl transition-all duration-200 text-base sm:text-lg
                    ${showExplanation
                      ? isCorrect
                        ? 'border-green-600 bg-green-50 text-green-900 font-semibold shadow-lg'
                        : isIncorrect
                          ? 'border-red-600 bg-red-50 text-red-900 font-semibold shadow-lg'
                          : 'border-slate-200 bg-slate-50 text-slate-600'
                      : isSelected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold shadow-md'
                        : 'border-slate-200 bg-white text-slate-900 hover:border-emerald-500 hover:bg-emerald-50 cursor-pointer hover:shadow-sm'
                    }
                  `}
                >
                  <div className="flex items-start gap-4">
                    <span className={`
                      flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-base font-bold
                      ${showExplanation
                        ? isCorrect
                          ? 'bg-green-600 text-white'
                          : isIncorrect
                            ? 'bg-red-600 text-white'
                            : 'bg-slate-300 text-slate-600'
                        : isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }
                    `}>
                      {letter}
                    </span>
                    <span className="flex-1 pt-1.5">
                      {choice}
                    </span>
                    {showExplanation && isCorrect && (
                      <CheckCircle className="flex-shrink-0 w-7 h-7 text-green-600" />
                    )}
                    {showExplanation && isIncorrect && (
                      <XCircle className="flex-shrink-0 w-7 h-7 text-red-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className="mb-8 p-6 sm:p-7 rounded-xl bg-emerald-50 border-2 border-emerald-300">
              <div className="flex items-start gap-4 mb-4">
                <CheckCircle className="w-7 h-7 text-emerald-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-emerald-900 text-lg sm:text-xl mb-2">
                    Correct Answer: {currentQuestion.letter}
                  </p>
                  <p className="text-slate-700 leading-relaxed text-base sm:text-lg">
                    {currentQuestion.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            {!showExplanation ? (
              <Button
                onClick={handleSubmit}
                disabled={!selectedAnswer}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-lg sm:text-xl py-6 sm:py-7 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-lg sm:text-xl py-6 sm:py-7 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                {currentQuestionIndex < questions.length - 1 ? (
                  <>
                    Next Question
                    <ArrowRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6" />
                  </>
                ) : (
                  <>
                    View Results
                    <ArrowRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
