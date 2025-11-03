"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Trophy, Zap, BarChart3, ArrowRight, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import confetti from "canvas-confetti";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

interface TestResults {
  score: number;
  total: number;
  percentage: number;
  time: number;
  completedAt: string;
}

export default function ResultsPage() {
  const [results, setResults] = useState<TestResults | null>(null);
  const [hasShownConfetti, setHasShownConfetti] = useState(false);

  useEffect(() => {
    // Load results from localStorage
    const savedResults = localStorage.getItem('bcba_practice_test_results');
    if (savedResults) {
      const parsedResults = JSON.parse(savedResults);
      setResults(parsedResults);

      // Show confetti for high scores
      if (parsedResults.percentage >= 80 && !hasShownConfetti) {
        triggerSuccessConfetti();
        setHasShownConfetti(true);
      }
    }
  }, [hasShownConfetti]);

  const triggerSuccessConfetti = () => {
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

  if (!results) {
    return (
      <div className="min-h-screen bg-bs-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-lg text-slate-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  const minutes = Math.floor(results.time / 60);
  const seconds = results.time % 60;
  const isPerfectScore = results.score === results.total;
  const isHighScore = results.percentage >= 80;

  return (
    <div className="min-h-screen bg-bs-background">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
        <Breadcrumbs items={[
          { label: "BCBA Exam Prep", href: "/bcba-exam-prep" },
          { label: "Free Practice Test", href: "/free-bcba-practice-test" },
          { label: "Results" }
        ]} />
      </div>

      {/* Results Hero */}
      <section className="pt-8 pb-12 sm:pb-16 lg:pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-white to-emerald-50 rounded-3xl border-2 border-emerald-200 p-8 sm:p-12 shadow-2xl">
            {/* Celebration Header */}
            <div className="text-center mb-12">
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${
                isPerfectScore
                  ? 'bg-gradient-to-br from-yellow-400 to-yellow-600'
                  : isHighScore
                  ? 'bg-gradient-to-br from-emerald-400 to-emerald-600'
                  : 'bg-gradient-to-br from-blue-400 to-blue-600'
              }`}>
                {isPerfectScore ? (
                  <Trophy className="w-14 h-14 text-white" />
                ) : isHighScore ? (
                  <Star className="w-14 h-14 text-white" />
                ) : (
                  <TrendingUp className="w-14 h-14 text-white" />
                )}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-4">
                {isPerfectScore
                  ? '🎉 Perfect Score!'
                  : isHighScore
                  ? '✨ Excellent Work!'
                  : '🎯 Test Complete!'}
              </h1>

              <p className="text-xl sm:text-2xl text-slate-600">
                {isPerfectScore
                  ? 'You aced every single question! Outstanding achievement!'
                  : isHighScore
                  ? `You scored ${results.percentage}% - that's fantastic preparation!`
                  : `You completed the test and scored ${results.percentage}%`}
              </p>
            </div>

            {/* Score Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
              <div className="text-center p-8 bg-white rounded-2xl border-2 border-slate-200 shadow-lg">
                <div className="text-5xl font-bold text-emerald-600 mb-3">
                  {results.score}/{results.total}
                </div>
                <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                  Questions Correct
                </div>
              </div>

              <div className="text-center p-8 bg-white rounded-2xl border-2 border-slate-200 shadow-lg">
                <div className="text-5xl font-bold text-emerald-600 mb-3">
                  {results.percentage}%
                </div>
                <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                  Final Score
                </div>
              </div>

              <div className="text-center p-8 bg-white rounded-2xl border-2 border-slate-200 shadow-lg">
                <div className="text-5xl font-bold text-emerald-600 mb-3">
                  {minutes}:{seconds.toString().padStart(2, '0')}
                </div>
                <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                  Completion Time
                </div>
              </div>
            </div>

            {/* Performance Insights */}
            <div className="bg-white rounded-2xl p-8 border-2 border-emerald-200 mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <BarChart3 className="w-7 h-7 text-emerald-600" />
                Your Performance
              </h2>

              <div className="space-y-4">
                {results.percentage >= 90 && (
                  <div className="flex items-start gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                    <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-bold text-emerald-900 mb-1">Outstanding Performance!</p>
                      <p className="text-sm text-emerald-800">You're demonstrating strong mastery of BCBA concepts. Keep practicing to maintain this level!</p>
                    </div>
                  </div>
                )}

                {results.percentage >= 70 && results.percentage < 90 && (
                  <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-bold text-blue-900 mb-1">Solid Foundation</p>
                      <p className="text-sm text-blue-800">You have a good grasp of the material. Focus on identifying and strengthening weak areas to reach exam readiness.</p>
                    </div>
                  </div>
                )}

                {results.percentage < 70 && (
                  <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <Star className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-bold text-amber-900 mb-1">Room for Growth</p>
                      <p className="text-sm text-amber-800">You're building your foundation. Focus on consistent daily practice and reviewing explanations to improve your understanding.</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <Zap className="w-6 h-6 text-slate-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-slate-900 mb-1">Average Time Per Question</p>
                    <p className="text-sm text-slate-700">You spent approximately {Math.round(results.time / results.total)} seconds per question. Aim for 78 seconds per question on the actual exam.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Practice Offer */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-emerald-600 to-emerald-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
              <Zap className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Your Account is Active! 🎉
            </h2>

            <p className="text-xl sm:text-2xl text-emerald-50 mb-8">
              You now have access to <strong>10 free practice questions with detailed explanations every single day</strong>
            </p>

            <div className="grid md:grid-cols-2 gap-6 text-left mb-10">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6" />
                  What You Get Daily
                </h3>
                <ul className="space-y-3 text-emerald-50">
                  <li className="flex items-start gap-2">
                    <span className="text-2xl">✓</span>
                    <span>10 fresh practice questions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-2xl">✓</span>
                    <span>Detailed explanations for each answer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-2xl">✓</span>
                    <span>Adaptive difficulty based on your performance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-2xl">✓</span>
                    <span>Progress tracking across all BACB domains</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Trophy className="w-6 h-6" />
                  Bonus Features
                </h3>
                <ul className="space-y-3 text-emerald-50">
                  <li className="flex items-start gap-2">
                    <span className="text-2xl">✓</span>
                    <span>Save your progress and scores</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-2xl">✓</span>
                    <span>Performance analytics dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-2xl">✓</span>
                    <span>Domain-specific practice modes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-2xl">✓</span>
                    <span>Spaced repetition learning algorithm</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://study.behaviorschool.com/quiz"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-white text-emerald-600 hover:bg-emerald-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Zap className="mr-2 h-5 w-5" />
                Start Daily Practice Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>

              <Link
                href="/behavior-study-tools"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold border-2 border-white text-white hover:bg-white/10 rounded-xl transition-all duration-200"
              >
                Explore All Study Tools
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>

            <p className="mt-6 text-emerald-100 text-sm">
              ⏰ Your daily questions reset at midnight EST
            </p>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8 text-center">
            Recommended Next Steps
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Link href="https://study.behaviorschool.com/quiz" className="group">
              <div className="bg-slate-50 hover:bg-emerald-50 rounded-2xl p-6 border-2 border-slate-200 hover:border-emerald-500 transition-all duration-200 h-full">
                <div className="w-12 h-12 bg-emerald-100 group-hover:bg-emerald-600 rounded-xl flex items-center justify-center mb-4 transition-colors">
                  <Zap className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Daily Practice</h3>
                <p className="text-slate-600">Start your 10 free questions today with adaptive difficulty</p>
              </div>
            </Link>

            <Link href="https://study.behaviorschool.com/quiz/guest?limit=185" className="group">
              <div className="bg-slate-50 hover:bg-blue-50 rounded-2xl p-6 border-2 border-slate-200 hover:border-blue-500 transition-all duration-200 h-full">
                <div className="w-12 h-12 bg-blue-100 group-hover:bg-blue-600 rounded-xl flex items-center justify-center mb-4 transition-colors">
                  <BarChart3 className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Full Mock Exam</h3>
                <p className="text-slate-600">Take the complete 185-question BCBA practice exam</p>
              </div>
            </Link>

            <Link href="/behavior-study-tools" className="group">
              <div className="bg-slate-50 hover:bg-purple-50 rounded-2xl p-6 border-2 border-slate-200 hover:border-purple-500 transition-all duration-200 h-full">
                <div className="w-12 h-12 bg-purple-100 group-hover:bg-purple-600 rounded-xl flex items-center justify-center mb-4 transition-colors">
                  <Star className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Study Resources</h3>
                <p className="text-slate-600">Explore comprehensive BCBA study tools and guides</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
