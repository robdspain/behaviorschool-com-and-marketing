"use client";

import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  ArrowRight,
  RefreshCw,
  Mail,
  Lock,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

interface PracticeQuizProps {
  questions: QuizQuestion[];
}

export function PracticeQuiz({ questions }: PracticeQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answered, setAnswered] = useState<Set<number>>(new Set());
  const [correct, setCorrect] = useState(0);
  const [startTime] = useState(Date.now());
  const [isComplete, setIsComplete] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const q = questions[currentIndex];
  const progress = (answered.size / questions.length) * 100;

  const letter = (i: number) => String.fromCharCode(65 + i);

  const handleSelect = (answer: string) => {
    if (showExplanation) return;
    setSelected(answer);
  };

  const handleSubmit = () => {
    if (!selected) return;
    if (selected === q.answer) setCorrect((c) => c + 1);
    setAnswered((prev) => new Set([...prev, currentIndex]));
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setShowExplanation(false);
    } else {
      setIsComplete(true);
      const finalCorrect =
        correct + (selected === q.answer ? 1 : 0);
      if (finalCorrect === questions.length) {
        triggerConfetti();
      }
    }
  };

  const triggerConfetti = () => {
    const end = Date.now() + 3000;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 9999,
    };
    const interval = window.setInterval(() => {
      if (Date.now() > end) return clearInterval(interval);
      const count = 50 * ((end - Date.now()) / 3000);
      confetti({
        ...defaults,
        particleCount: count,
        origin: { x: Math.random() * 0.4 + 0.1, y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount: count,
        origin: { x: Math.random() * 0.4 + 0.5, y: Math.random() - 0.2 },
      });
    }, 250);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelected(null);
    setShowExplanation(false);
    setAnswered(new Set());
    setCorrect(0);
    setIsComplete(false);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailLoading(true);
    setEmailError("");

    try {
      // POST to a Netlify function or API route
      const res = await fetch("/api/collect-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "free-bcba-practice",
          score: correct,
          total: questions.length,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setEmailSubmitted(true);
    } catch {
      // Fallback: store locally and show success anyway (don't block the user)
      try {
        const existing = JSON.parse(
          localStorage.getItem("collected_emails") || "[]"
        );
        existing.push({
          email,
          source: "free-bcba-practice",
          score: correct,
          total: questions.length,
          ts: Date.now(),
        });
        localStorage.setItem("collected_emails", JSON.stringify(existing));
      } catch {
        // ignore
      }
      setEmailSubmitted(true);
    } finally {
      setEmailLoading(false);
    }
  };

  // ─── Results Screen ───
  if (isComplete) {
    const pct = Math.round((correct / questions.length) * 100);
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    const perfect = correct === questions.length;

    return (
      <div className="w-full max-w-4xl mx-auto space-y-8">
        {/* Score Card */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 lg:p-10">
          <div className="text-center mb-10">
            <div
              className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
                perfect ? "bg-bs-accent" : "bg-emerald-100"
              }`}
            >
              {perfect ? (
                <span className="text-5xl">🏆</span>
              ) : (
                <Trophy className="w-12 h-12 text-emerald-600" />
              )}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
              {perfect ? "🎉 Perfect Score!" : "Quiz Complete!"}
            </h2>
            <p className="text-lg text-slate-600">
              You answered {correct} out of {questions.length} questions
              correctly
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10">
            <div className="text-center p-6 bg-slate-50 rounded-xl border-2 border-slate-200">
              <div className="text-4xl font-bold text-emerald-600 mb-2">
                {correct}/{questions.length}
              </div>
              <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                Correct
              </div>
            </div>
            <div className="text-center p-6 bg-slate-50 rounded-xl border-2 border-slate-200">
              <div className="text-4xl font-bold text-emerald-600 mb-2">
                {pct}%
              </div>
              <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                Score
              </div>
            </div>
            <div className="text-center p-6 bg-slate-50 rounded-xl border-2 border-slate-200">
              <div className="text-4xl font-bold text-emerald-600 mb-2">
                {mins}:{secs.toString().padStart(2, "0")}
              </div>
              <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                Time
              </div>
            </div>
          </div>

          {/* Restart */}
          <Button
            onClick={handleRestart}
            variant="outline"
            className="w-full text-lg py-6 rounded-xl border-2 border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            Try Again
          </Button>
        </div>

        {/* Email Gate */}
        {!emailSubmitted ? (
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-8 sm:p-10 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-emerald-200" />
              <h3 className="text-2xl sm:text-3xl font-bold">
                Get 100+ More Free Practice Questions
              </h3>
            </div>
            <p className="text-emerald-100 text-lg mb-8 leading-relaxed">
              You just completed 20 questions — nice work! Enter your email to
              unlock our extended question bank with 100+ additional BCBA
              practice questions, organized by domain, with full explanations.
            </p>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-300" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border-2 border-white/20 text-white placeholder-emerald-200 focus:outline-none focus:border-white/50 focus:bg-white/15 text-lg"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={emailLoading}
                  className="px-8 py-4 bg-white text-emerald-700 hover:bg-emerald-50 font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all whitespace-nowrap"
                >
                  {emailLoading ? "Sending..." : "Unlock Questions"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              {emailError && (
                <p className="text-red-200 text-sm">{emailError}</p>
              )}
              <p className="text-emerald-200 text-sm">
                No spam, ever. Unsubscribe anytime. We'll send your questions
                immediately.
              </p>
            </form>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl border-2 border-emerald-200 p-8 sm:p-10 text-center">
            <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              Check Your Inbox! 📬
            </h3>
            <p className="text-slate-600 text-lg">
              We're sending 100+ additional practice questions to{" "}
              <strong>{email}</strong>. In the meantime, try our{" "}
              <a
                href="https://study.behaviorschool.com/free-mock-exam/full"
                className="text-emerald-600 hover:text-emerald-700 font-semibold underline"
              >
                full 185-question mock exam
              </a>
              .
            </p>
          </div>
        )}
      </div>
    );
  }

  // ─── Quiz Screen ───
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
        {/* Progress Bar */}
        <div className="bg-slate-50 px-4 sm:px-6 py-4 sm:py-5 border-b-2 border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm sm:text-base font-semibold text-slate-900">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="text-sm sm:text-base font-semibold text-slate-600">
              {answered.size} answered
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div
              className="bg-emerald-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="p-6 sm:p-8 lg:p-10">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-800 text-sm font-semibold rounded-full">
              {q.tag}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-8 leading-relaxed">
            {q.stem}
          </h3>

          {/* Choices */}
          <div className="space-y-4 mb-8">
            {q.choices.map((choice, i) => {
              const l = letter(i);
              const isSel = selected === choice;
              const isCorr = showExplanation && choice === q.answer;
              const isWrong =
                showExplanation && isSel && choice !== q.answer;

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(choice)}
                  disabled={showExplanation}
                  className={`
                    w-full p-5 sm:p-6 text-left border-2 rounded-xl transition-all duration-200 text-base sm:text-lg
                    ${
                      showExplanation
                        ? isCorr
                          ? "border-green-600 bg-green-50 text-green-900 font-semibold shadow-lg"
                          : isWrong
                          ? "border-red-600 bg-red-50 text-red-900 font-semibold shadow-lg"
                          : "border-slate-200 bg-slate-50 text-slate-600"
                        : isSel
                        ? "border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold shadow-md"
                        : "border-slate-200 bg-white text-slate-900 hover:border-emerald-500 hover:bg-emerald-50 cursor-pointer hover:shadow-sm"
                    }
                  `}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={`
                      flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-base font-bold
                      ${
                        showExplanation
                          ? isCorr
                            ? "bg-green-600 text-white"
                            : isWrong
                            ? "bg-red-600 text-white"
                            : "bg-slate-300 text-slate-600"
                          : isSel
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-200 text-slate-700"
                      }
                    `}
                    >
                      {l}
                    </span>
                    <span className="flex-1 pt-1.5">{choice}</span>
                    {showExplanation && isCorr && (
                      <CheckCircle className="flex-shrink-0 w-7 h-7 text-green-600" />
                    )}
                    {showExplanation && isWrong && (
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
                    Correct Answer: {q.letter}
                  </p>
                  <p className="text-slate-700 leading-relaxed text-base sm:text-lg">
                    {q.explanation}
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
                disabled={!selected}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-lg sm:text-xl py-6 sm:py-7 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-lg sm:text-xl py-6 sm:py-7 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                {currentIndex < questions.length - 1 ? (
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
