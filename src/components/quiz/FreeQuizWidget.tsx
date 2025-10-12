"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, ArrowRight, RefreshCw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import confetti from "canvas-confetti";

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
    const checkDailyLimit = () => {
      const today = new Date().toDateString();
      const storedData = localStorage.getItem('quiz_attempts');
      
      if (storedData) {
        const { date, attempts } = JSON.parse(storedData);
        
        if (date === today) {
          setAttemptsToday(attempts);
          if (attempts >= 3) {
            setDailyLimitReached(true);
          }
        } else {
          // New day, reset
          localStorage.setItem('quiz_attempts', JSON.stringify({ date: today, attempts: 0 }));
          setAttemptsToday(0);
          setDailyLimitReached(false);
        }
      } else {
        // First time
        localStorage.setItem('quiz_attempts', JSON.stringify({ date: today, attempts: 0 }));
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

  const handleRestart = () => {
    // Check and increment daily attempts
    const today = new Date().toDateString();
    const storedData = localStorage.getItem('quiz_attempts');
    
    if (storedData) {
      const { date, attempts } = JSON.parse(storedData);
      
      if (date === today) {
        const newAttempts = attempts + 1;
        localStorage.setItem('quiz_attempts', JSON.stringify({ date: today, attempts: newAttempts }));
        setAttemptsToday(newAttempts);
        
        if (newAttempts >= 3) {
          setDailyLimitReached(true);
          return; // Don't restart if limit reached
        }
      } else {
        // New day
        localStorage.setItem('quiz_attempts', JSON.stringify({ date: today, attempts: 1 }));
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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
              isPerfectScore
                ? 'bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900 dark:to-amber-900'
                : 'bg-emerald-100 dark:bg-emerald-900'
            }`}>
              {isPerfectScore ? (
                <span className="text-4xl">🏆</span>
              ) : (
                <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
              )}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {isPerfectScore ? '🎉 Perfect Score!' : 'Quiz Complete!'}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {isPerfectScore
                ? 'Outstanding! You aced all 10 questions!'
                : 'Great job completing the practice quiz'}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {correctAnswers}/{questions.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Correct Answers
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {percentage}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Score
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {minutes}:{seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Time
              </div>
            </div>
          </div>

          {/* Daily Limit Warning */}
          {dailyLimitReached && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <span className="text-2xl">🔒</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-red-900 dark:text-red-100 mb-1">
                    Daily Practice Limit Reached
                  </p>
                  <p className="text-xs text-red-800 dark:text-red-200 mb-2">
                    You&apos;ve completed 3 free quizzes today. Reset in {timeUntilReset}
                  </p>
                  <p className="text-xs font-semibold text-red-900 dark:text-red-100">
                    Create a free account for unlimited practice questions!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Progress Warning */}
          {!isPerfectScore && !dailyLimitReached && (
            <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-1">
                    Your progress isn&apos;t saved
                  </p>
                  <p className="text-xs text-amber-800 dark:text-amber-200">
                    Create a free account to save your score and track improvement over time
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Attempts Counter */}
          {!dailyLimitReached && attemptsToday > 0 && (
            <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
              <p className="text-xs text-center text-blue-800 dark:text-blue-200">
                📊 Quiz attempts today: {attemptsToday}/3 free attempts · <span className="font-semibold">Create account for unlimited</span>
              </p>
            </div>
          )}

          {isPerfectScore && (
            <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <span className="text-3xl">🎯</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-yellow-900 dark:text-yellow-100 mb-1">
                    Perfect Score Achievement Unlocked! 🏆
                  </p>
                  <p className="text-xs text-yellow-800 dark:text-yellow-200">
                    You&apos;re in the top 5% of quiz takers! Save your perfect score and unlock more achievements.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <Link href={studyAuthUrl} className="block">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-lg py-6 shadow-lg hover:shadow-xl transition-all">
                <Save className="mr-2 h-5 w-5" />
                Save My Progress & Continue
                <div className="ml-2 px-2 py-0.5 bg-white/20 rounded text-xs font-semibold">
                  Free Forever
                </div>
              </Button>
            </Link>
            <Button
              onClick={handleRestart}
              variant="outline"
              className="w-full text-lg py-6"
              disabled={dailyLimitReached}
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              {dailyLimitReached ? `Reset in ${timeUntilReset}` : 'Try Again as Guest'}
            </Button>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Already have an account? <Link href={`${ctaUrl}/auth?action=login`} className="text-emerald-600 hover:text-emerald-700 font-medium">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Progress Bar */}
        <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {answeredQuestions.size} answered
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-emerald-600 dark:bg-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Content */}
        <div className="p-6 sm:p-8">
          {/* Task Tag */}
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-sm font-medium rounded-full">
              {currentQuestion.tag}
            </span>
          </div>

          {/* Question Text */}
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6 leading-relaxed">
            {currentQuestion.stem}
          </h3>

          {/* Answer Choices */}
          <div className="space-y-3 mb-6">
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
                    w-full p-4 sm:p-5 text-left border-2 rounded-lg transition-all duration-200 text-base sm:text-lg
                    ${showExplanation
                      ? isCorrect
                        ? 'border-green-600 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-100 font-semibold shadow-lg'
                        : isIncorrect
                          ? 'border-red-600 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100 font-semibold shadow-lg'
                          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400'
                      : isSelected
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-100 font-semibold shadow-md'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 cursor-pointer'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    <span className={`
                      flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                      ${showExplanation
                        ? isCorrect
                          ? 'bg-green-600 text-white'
                          : isIncorrect
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        : isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                      }
                    `}>
                      {letter}
                    </span>
                    <span className="flex-1 pt-1">
                      {choice}
                    </span>
                    {showExplanation && isCorrect && (
                      <CheckCircle className="flex-shrink-0 w-6 h-6 text-green-600" />
                    )}
                    {showExplanation && isIncorrect && (
                      <XCircle className="flex-shrink-0 w-6 h-6 text-red-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className="mb-6 p-6 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-emerald-900 dark:text-emerald-100 text-lg mb-1">
                    Correct Answer: {currentQuestion.letter}
                  </p>
                  <p className="text-emerald-800 dark:text-emerald-200 leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {!showExplanation ? (
              <Button
                onClick={handleSubmit}
                disabled={!selectedAnswer}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white text-lg py-6"
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-lg py-6"
              >
                {currentQuestionIndex < questions.length - 1 ? (
                  <>
                    Next Question
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                ) : (
                  <>
                    View Results
                    <ArrowRight className="ml-2 h-5 w-5" />
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
