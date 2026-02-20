"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, ChevronLeft, Mail, Sparkles, Flame, HeartHandshake } from "lucide-react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Quiz Data                                                          */
/* ------------------------------------------------------------------ */

type QuestionType = "single";

interface QuizQuestion {
  id: string;
  question: string;
  subtitle?: string;
  type: QuestionType;
  icon: React.ReactNode;
  options: { label: string; value: string; points: number }[];
}

const scaleOptions = [
  { label: "Never", value: "never", points: 0 },
  { label: "Rarely", value: "rarely", points: 1 },
  { label: "Sometimes", value: "sometimes", points: 2 },
  { label: "Often", value: "often", points: 3 },
];

const questions: QuizQuestion[] = [
  {
    id: "q1",
    question: "I feel emotionally drained at the end of the workday.",
    type: "single",
    icon: <Flame className="w-6 h-6" />,
    options: scaleOptions,
  },
  {
    id: "q2",
    question: "I have trouble feeling energized before client sessions.",
    type: "single",
    icon: <Flame className="w-6 h-6" />,
    options: scaleOptions,
  },
  {
    id: "q3",
    question: "I feel detached or numb when challenging behaviors occur.",
    type: "single",
    icon: <Flame className="w-6 h-6" />,
    options: scaleOptions,
  },
  {
    id: "q4",
    question: "I find myself becoming impatient or irritable with students/clients.",
    type: "single",
    icon: <Flame className="w-6 h-6" />,
    options: scaleOptions,
  },
  {
    id: "q5",
    question: "Paperwork and documentation feel unmanageable.",
    type: "single",
    icon: <Flame className="w-6 h-6" />,
    options: scaleOptions,
  },
  {
    id: "q6",
    question: "I work late or on weekends to keep up.",
    type: "single",
    icon: <Flame className="w-6 h-6" />,
    options: scaleOptions,
  },
  {
    id: "q7",
    question: "I feel like I have little control over my workload or schedule.",
    type: "single",
    icon: <Flame className="w-6 h-6" />,
    options: scaleOptions,
  },
  {
    id: "q8",
    question: "I feel under-supported by my organization or supervisors.",
    type: "single",
    icon: <Flame className="w-6 h-6" />,
    options: scaleOptions,
  },
  {
    id: "q9",
    question: "I worry that I’m not making meaningful progress with clients.",
    type: "single",
    icon: <Flame className="w-6 h-6" />,
    options: scaleOptions,
  },
  {
    id: "q10",
    question: "I feel isolated from other BCBAs or professional peers.",
    type: "single",
    icon: <Flame className="w-6 h-6" />,
    options: scaleOptions,
  },
  {
    id: "q11",
    question: "I’m experiencing sleep problems related to work stress.",
    type: "single",
    icon: <Flame className="w-6 h-6" />,
    options: scaleOptions,
  },
  {
    id: "q12",
    question: "I’ve noticed physical symptoms (headaches, stomach issues, tension) related to work stress.",
    type: "single",
    icon: <Flame className="w-6 h-6" />,
    options: scaleOptions,
  },
];

/* ------------------------------------------------------------------ */
/*  Score calculation                                                   */
/* ------------------------------------------------------------------ */

function calculateScore(answers: Record<string, string>): number {
  return questions.reduce((sum, q) => {
    const ans = answers[q.id];
    const opt = q.options.find((o) => o.value === ans);
    return sum + (opt?.points ?? 0);
  }, 0);
}

function getRiskBand(score: number) {
  if (score <= 10) {
    return {
      title: "Low Burnout Risk",
      description: "You’re showing healthy resilience right now. Keep your protective habits strong.",
      color: "emerald",
    };
  }
  if (score <= 20) {
    return {
      title: "Moderate Burnout Risk",
      description: "You’re feeling some strain. Small changes can prevent escalation.",
      color: "amber",
    };
  }
  if (score <= 30) {
    return {
      title: "High Burnout Risk",
      description: "Burnout risk is elevated. You deserve better systems and support.",
      color: "orange",
    };
  }
  return {
    title: "Severe Burnout Risk",
    description: "Your stress load is very high. It’s time for a reset plan.",
    color: "red",
  };
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                      */
/* ------------------------------------------------------------------ */

type Phase = "intro" | "quiz" | "score" | "email" | "results";

export function BCBABurnoutQuiz() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState(0);

  const q = questions[currentQ];
  const progress = ((currentQ + 1) / questions.length) * 100;

  const canAdvance = useCallback(() => {
    const ans = answers[q?.id];
    if (!q) return false;
    return !!ans;
  }, [answers, q]);

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((p) => p + 1);
    } else {
      const s = calculateScore(answers);
      setScore(s);
      setPhase("score");
    }
  };

  const handleBack = () => {
    if (currentQ > 0) setCurrentQ((p) => p - 1);
  };

  const handleSingleSelect = (value: string) => {
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/quiz-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, score, answers, quiz: "bcba-burnout" }),
      });
    } catch {
      // best-effort
    }
    setSubmitting(false);
    setPhase("results");
  };

  const shareText = `I scored ${score}/36 on the BCBA Burnout Risk Quiz. How are you doing?`;
  const shareUrl = "https://behaviorschool.com/bcba-burnout-quiz";

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: "BCBA Burnout Risk Quiz", text: shareText, url: shareUrl });
    } else {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      alert("Link copied to clipboard!");
    }
  };

  /* ---------- INTRO ---------- */
  if (phase === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-bs-background to-white pt-28 pb-16 px-4">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" /> Free · 2 Minutes · No Signup Required
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-bs-text mb-4 leading-tight">
            BCBA Burnout <span className="text-emerald-600">Risk Quiz</span>
          </h1>
          <p className="text-lg text-bs-text-light mb-8 max-w-xl mx-auto">
            Answer 12 quick questions about your work experience. Get a simple burnout risk score and a few next-step options.
          </p>
          <motion.button
            onClick={() => setPhase("quiz")}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start the Quiz <ChevronRight className="w-5 h-5" />
          </motion.button>
          <p className="text-sm text-slate-400 mt-4">
            This is a self-assessment, not a diagnosis or clinical evaluation.
          </p>
        </motion.div>
      </div>
    );
  }

  /* ---------- QUIZ ---------- */
  if (phase === "quiz") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-bs-background to-white pt-28 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between text-sm text-slate-500 mb-2">
              <span>
                Question {currentQ + 1} of {questions.length}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={q.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 text-emerald-600 mb-2">
                {q.icon}
                <span className="text-sm font-medium uppercase tracking-wide">
                  Question {currentQ + 1}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-bs-text mb-6">
                {q.question}
              </h2>

              <div className="space-y-3">
                {q.options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSingleSelect(opt.value)}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all font-medium ${
                      answers[q.id] === opt.value
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 hover:border-emerald-300 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          answers[q.id] === opt.value
                            ? "border-emerald-500 bg-emerald-500"
                            : "border-slate-300"
                        }`}
                      >
                        {answers[q.id] === opt.value && (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        )}
                      </div>
                      {opt.label}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-6">
            <button
              onClick={handleBack}
              disabled={currentQ === 0}
              className="inline-flex items-center gap-1 px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <motion.button
              onClick={handleNext}
              disabled={!canAdvance()}
              className="inline-flex items-center gap-1 px-6 py-2.5 rounded-xl font-semibold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed shadow transition-all"
              whileHover={canAdvance() ? { scale: 1.05 } : {}}
              whileTap={canAdvance() ? { scale: 0.95 } : {}}
            >
              {currentQ === questions.length - 1 ? "See My Score" : "Next"}{" "}
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- SCORE (gated) ---------- */
  if (phase === "score") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-bs-background to-white pt-28 pb-16 px-4">
        <motion.div
          className="max-w-lg mx-auto text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-bs-text mb-2">
            Your Burnout Risk Score
          </h2>
          <p className="text-slate-500 mb-6">Score range is 0–36 (higher = more risk)</p>
          <div className="text-5xl font-bold text-emerald-600 mb-6">{score}/36</div>
          <p className="text-slate-500 mb-8">
            Enter your email to get your personalized results PDF and next-step options.
          </p>
          <motion.button
            onClick={() => setPhase("email")}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mail className="w-5 h-5" /> Get My Results PDF
          </motion.button>
        </motion.div>
      </div>
    );
  }

  /* ---------- EMAIL CAPTURE ---------- */
  if (phase === "email") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-bs-background to-white pt-28 pb-16 px-4">
        <motion.div
          className="max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-emerald-600">{score}/36</div>
              <h2 className="text-xl font-bold text-bs-text mt-4 mb-1">
                Unlock Your Results PDF
              </h2>
              <p className="text-slate-500 text-sm">
                We&apos;ll email your score summary and next-step recommendations.
              </p>
            </div>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Your first name"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-0 outline-none transition-colors text-slate-800"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-0 outline-none transition-colors text-slate-800"
                />
              </div>
              <motion.button
                type="submit"
                disabled={submitting || !email}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl shadow transition-all disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {submitting ? "Sending…" : "Show My Results →"}
              </motion.button>
              <p className="text-xs text-center text-slate-400">
                No spam. Unsubscribe anytime. We respect your privacy.
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ---------- RESULTS ---------- */
  const band = getRiskBand(score);
  const bandColor = {
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
    amber: "bg-amber-50 border-amber-200 text-amber-700",
    orange: "bg-orange-50 border-orange-200 text-orange-700",
    red: "bg-red-50 border-red-200 text-red-700",
  }[band.color];

  return (
    <div className="min-h-screen bg-gradient-to-b from-bs-background to-white pt-28 pb-16 px-4">
      <motion.div
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-bs-text mb-2">
            Your Burnout Risk Results
          </h2>
          <div className="text-4xl font-bold text-emerald-600">{score}/36</div>
        </div>

        <div className={`rounded-2xl border-2 p-6 sm:p-8 mb-6 ${bandColor}`}>
          <div className="text-3xl mb-3">🧠</div>
          <h3 className="text-xl sm:text-2xl font-bold text-bs-text mb-3">
            {band.title}
          </h3>
          <p className="text-slate-600 mb-6 leading-relaxed">{band.description}</p>
          <p className="text-sm text-slate-500">
            This quiz is a self-assessment and not a diagnosis. If you need clinical support, please reach out to a licensed professional.
          </p>
        </div>

        <div className="text-center my-8">
          <Link href="/bcba-burnout-quiz/playbook" className="inline-flex items-center gap-3 bg-emerald-600 text-white font-bold text-lg py-4 px-8 rounded-xl shadow-lg hover:bg-emerald-700 transition-colors">
            Download Your Free Self-Care Playbook
          </Link>
          <p className="text-sm text-slate-500 mt-3">A practical guide to preventing burnout and building a sustainable career.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 mb-6">
          <a
            href="https://study.behaviorschool.com"
            className="bg-white border-2 border-slate-200 rounded-2xl p-5 hover:border-emerald-300 transition-colors"
          >
            <div className="flex items-center gap-2 text-emerald-700 font-semibold mb-2">
              <Sparkles className="w-4 h-4" /> Exam Stress
            </div>
            <p className="text-sm text-slate-600 mb-3">
              Use Study Tools to reduce anxiety and build confidence.
            </p>
            <span className="text-emerald-700 font-semibold">View Study Tools →</span>
          </a>
          <a
            href="/transformation-program"
            className="bg-white border-2 border-slate-200 rounded-2xl p-5 hover:border-emerald-300 transition-colors"
          >
            <div className="flex items-center gap-2 text-emerald-700 font-semibold mb-2">
              <HeartHandshake className="w-4 h-4" /> Systems Issues
            </div>
            <p className="text-sm text-slate-600 mb-3">
              Fix the systems that keep you overloaded and stuck.
            </p>
            <span className="text-emerald-700 font-semibold">Transformation Program →</span>
          </a>
          <a
            href="https://community.behaviorschool.com"
            className="bg-white border-2 border-slate-200 rounded-2xl p-5 hover:border-emerald-300 transition-colors"
          >
            <div className="flex items-center gap-2 text-emerald-700 font-semibold mb-2">
              <Sparkles className="w-4 h-4" /> Isolation
            </div>
            <p className="text-sm text-slate-600 mb-3">
              Join a community of school-based BCBAs.
            </p>
            <span className="text-emerald-700 font-semibold">Join the Community →</span>
          </a>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <h4 className="font-bold text-bs-text mb-2">Share Your Result</h4>
          <p className="text-slate-500 text-sm mb-4">
            Help other BCBAs check in on their burnout risk.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <motion.button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-medium shadow hover:bg-emerald-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Share
            </motion.button>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 text-white font-medium shadow hover:bg-sky-700 transition-colors"
            >
              LinkedIn
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition-colors"
            >
              Facebook
            </a>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/"
            className="text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-4"
          >
            ← Back to Behavior School
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
