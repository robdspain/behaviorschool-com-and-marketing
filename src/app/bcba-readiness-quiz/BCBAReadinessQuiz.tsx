"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Share2,
  Mail,
  Sparkles,
  BookOpen,
  Target,
  Clock,
  Brain,
  Rocket,
} from "lucide-react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Quiz Data                                                          */
/* ------------------------------------------------------------------ */

type QuestionType = "single" | "multi" | "slider";

interface QuizQuestion {
  id: string;
  question: string;
  subtitle?: string;
  type: QuestionType;
  icon: React.ReactNode;
  options?: { label: string; value: string; points: number }[];
  sliderMin?: number;
  sliderMax?: number;
  sliderStep?: number;
  sliderLabels?: string[];
  sliderPointsFn?: (v: number) => number;
}

const questions: QuizQuestion[] = [
  {
    id: "study_hours",
    question: "How many hours per week do you currently study for the BCBA exam?",
    subtitle: "Be honest — there's no wrong answer!",
    type: "single",
    icon: <Clock className="w-6 h-6" />,
    options: [
      { label: "Less than 5 hours", value: "lt5", points: 2 },
      { label: "5–10 hours", value: "5to10", points: 5 },
      { label: "10–15 hours", value: "10to15", points: 8 },
      { label: "15–20 hours", value: "15to20", points: 9 },
      { label: "20+ hours", value: "20plus", points: 10 },
    ],
  },
  {
    id: "study_methods",
    question: "How do you currently study? (Select all that apply)",
    subtitle: "The more varied your methods, the better!",
    type: "multi",
    icon: <BookOpen className="w-6 h-6" />,
    options: [
      { label: "Textbooks / Cooper", value: "textbooks", points: 2 },
      { label: "Flashcards", value: "flashcards", points: 2 },
      { label: "Study apps", value: "apps", points: 3 },
      { label: "Study groups", value: "groups", points: 2 },
      { label: "Practice exams", value: "practice", points: 3 },
      { label: "Video lectures", value: "videos", points: 2 },
      { label: "I haven't started yet", value: "none", points: 0 },
    ],
  },
  {
    id: "practice_exams",
    question: "Have you taken any full-length practice exams?",
    type: "single",
    icon: <Target className="w-6 h-6" />,
    options: [
      { label: "Not yet", value: "none", points: 0 },
      { label: "1–2 practice exams", value: "1to2", points: 4 },
      { label: "3–5 practice exams", value: "3to5", points: 7 },
      { label: "6+ practice exams", value: "6plus", points: 10 },
    ],
  },
  {
    id: "exam_date",
    question: "When are you planning to take the BCBA exam?",
    type: "single",
    icon: <Clock className="w-6 h-6" />,
    options: [
      { label: "Within the next month", value: "1month", points: 10 },
      { label: "In 1–3 months", value: "1to3", points: 8 },
      { label: "In 3–6 months", value: "3to6", points: 5 },
      { label: "6+ months away", value: "6plus", points: 3 },
      { label: "Not sure yet", value: "unsure", points: 1 },
    ],
  },
  {
    id: "ethics",
    question: "How confident are you in Ethics (Section 1 of the Task List)?",
    subtitle: "Professional & ethical compliance, supervision, etc.",
    type: "slider",
    icon: <Brain className="w-6 h-6" />,
    sliderMin: 1,
    sliderMax: 10,
    sliderStep: 1,
    sliderLabels: ["Not confident", "Very confident"],
    sliderPointsFn: (v: number) => v,
  },
  {
    id: "measurement",
    question: "How confident are you in Concepts & Principles (measurement, design)?",
    subtitle: "Data collection, experimental design, graphing, etc.",
    type: "slider",
    icon: <Brain className="w-6 h-6" />,
    sliderMin: 1,
    sliderMax: 10,
    sliderStep: 1,
    sliderLabels: ["Not confident", "Very confident"],
    sliderPointsFn: (v: number) => v,
  },
  {
    id: "behavior_change",
    question: "How confident are you in Behavior-Change Procedures?",
    subtitle: "Reinforcement, punishment, extinction, stimulus control, etc.",
    type: "slider",
    icon: <Brain className="w-6 h-6" />,
    sliderMin: 1,
    sliderMax: 10,
    sliderStep: 1,
    sliderLabels: ["Not confident", "Very confident"],
    sliderPointsFn: (v: number) => v,
  },
  {
    id: "weakest_area",
    question: "Which task list areas feel the most challenging?",
    subtitle: "Select all areas where you'd like more practice.",
    type: "multi",
    icon: <Target className="w-6 h-6" />,
    options: [
      { label: "Ethics & professional conduct", value: "ethics", points: 0 },
      { label: "Measurement & data display", value: "measurement", points: 0 },
      { label: "Experimental design", value: "design", points: 0 },
      { label: "Fundamental elements of behavior change", value: "fundamentals", points: 0 },
      { label: "Specific behavior-change procedures", value: "procedures", points: 0 },
      { label: "Behavior assessment", value: "assessment", points: 0 },
      { label: "Intervention & change considerations", value: "intervention", points: 0 },
      { label: "Personnel supervision", value: "supervision", points: 0 },
    ],
  },
  {
    id: "study_plan",
    question: "Do you follow a structured study plan or schedule?",
    type: "single",
    icon: <BookOpen className="w-6 h-6" />,
    options: [
      { label: "Yes — I have a detailed plan I follow", value: "detailed", points: 10 },
      { label: "Sort of — I have a rough schedule", value: "rough", points: 6 },
      { label: "Not really — I study when I feel like it", value: "random", points: 3 },
      { label: "No — I'm not sure where to start", value: "none", points: 0 },
    ],
  },
  {
    id: "overall_confidence",
    question: "Overall, how ready do you feel to pass the BCBA exam today?",
    subtitle: "Trust your gut!",
    type: "slider",
    icon: <Sparkles className="w-6 h-6" />,
    sliderMin: 1,
    sliderMax: 10,
    sliderStep: 1,
    sliderLabels: ["Not ready at all", "Totally ready!"],
    sliderPointsFn: (v: number) => v,
  },
];

/* ------------------------------------------------------------------ */
/*  Score calculation                                                   */
/* ------------------------------------------------------------------ */

function calculateScore(answers: Record<string, string | string[] | number>): number {
  let total = 0;
  let maxPossible = 0;

  for (const q of questions) {
    const ans = answers[q.id];
    if (q.type === "single") {
      const opt = q.options?.find((o) => o.value === ans);
      total += opt?.points ?? 0;
      maxPossible += Math.max(...(q.options?.map((o) => o.points) ?? [0]));
    } else if (q.type === "multi") {
      const selected = (ans as string[]) ?? [];
      // For weakest_area: fewer weak areas = higher score
      if (q.id === "weakest_area") {
        const max = q.options?.length ?? 1;
        const score = Math.round(((max - selected.length) / max) * 10);
        total += score;
        maxPossible += 10;
      } else {
        const pts = selected.reduce((sum, v) => {
          const opt = q.options?.find((o) => o.value === v);
          return sum + (opt?.points ?? 0);
        }, 0);
        total += Math.min(pts, 10);
        maxPossible += 10;
      }
    } else if (q.type === "slider") {
      const val = typeof ans === "number" ? ans : 5;
      total += q.sliderPointsFn?.(val) ?? val;
      maxPossible += q.sliderPointsFn?.(q.sliderMax ?? 10) ?? 10;
    }
  }

  return Math.round((total / maxPossible) * 100);
}

/* ------------------------------------------------------------------ */
/*  Confetti (lightweight canvas)                                       */
/* ------------------------------------------------------------------ */

function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#E3B23C", "#10b981", "#6366f1", "#f43f5e", "#f97316", "#8b5cf6"];
    const pieces: { x: number; y: number; w: number; h: number; color: string; vx: number; vy: number; rot: number; vr: number }[] = [];

    for (let i = 0; i < 150; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        w: Math.random() * 10 + 5,
        h: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.2,
      });
    }

    let frame: number;
    let alpha = 1;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = alpha;
      for (const p of pieces) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.vy += 0.05;
      }
      alpha -= 0.003;
      if (alpha > 0) {
        frame = requestAnimationFrame(animate);
      }
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[200]"
      aria-hidden="true"
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Score Display                                                       */
/* ------------------------------------------------------------------ */

function ScoreRing({ score }: { score: number }) {
  const color = score <= 40 ? "#ef4444" : score <= 70 ? "#f59e0b" : "#10b981";
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" strokeWidth="8" />
        <motion.circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-4xl font-bold"
          style={{ color }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {score}
        </motion.span>
        <span className="text-sm text-slate-500 font-medium">out of 100</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                      */
/* ------------------------------------------------------------------ */

type Phase = "intro" | "quiz" | "score" | "email" | "results";

export function BCBAReadinessQuiz() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[] | number>>({});
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const q = questions[currentQ];
  const progress = ((currentQ + 1) / questions.length) * 100;

  const canAdvance = useCallback(() => {
    const ans = answers[q?.id];
    if (!q) return false;
    if (q.type === "single") return !!ans;
    if (q.type === "multi") return true; // optional for multi
    if (q.type === "slider") return ans !== undefined;
    return false;
  }, [answers, q]);

  const setSliderDefault = useCallback(() => {
    if (q?.type === "slider" && answers[q.id] === undefined) {
      setAnswers((prev) => ({ ...prev, [q.id]: 5 }));
    }
  }, [q, answers]);

  useEffect(() => {
    setSliderDefault();
  }, [setSliderDefault]);

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((p) => p + 1);
    } else {
      const s = calculateScore(answers);
      setScore(s);
      setShowConfetti(true);
      setPhase("score");
      setTimeout(() => setShowConfetti(false), 4000);
    }
  };

  const handleBack = () => {
    if (currentQ > 0) setCurrentQ((p) => p - 1);
  };

  const handleSingleSelect = (value: string) => {
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
  };

  const handleMultiToggle = (value: string) => {
    const current = (answers[q.id] as string[]) ?? [];
    if (value === "none") {
      setAnswers((prev) => ({ ...prev, [q.id]: ["none"] }));
      return;
    }
    const filtered = current.filter((v) => v !== "none");
    const next = filtered.includes(value)
      ? filtered.filter((v) => v !== value)
      : [...filtered, value];
    setAnswers((prev) => ({ ...prev, [q.id]: next }));
  };

  const handleSlider = (value: number) => {
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/quiz-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, score, answers }),
      });
    } catch {
      // Silently continue — email capture is best-effort
    }
    setSubmitting(false);
    setPhase("results");
  };

  const shareText = `I scored ${score}/100 on the BCBA Exam Readiness Quiz! How ready are you?`;
  const shareUrl = "https://behaviorschool.com/bcba-readiness-quiz";

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: "BCBA Exam Readiness Quiz", text: shareText, url: shareUrl });
    } else {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      alert("Link copied to clipboard!");
    }
  };

  const getRecommendation = () => {
    if (score <= 40) {
      return {
        emoji: "book",
        title: "You Need Structured Practice",
        description:
          "You're in the early stages of exam prep. The good news? With the right tools and a solid study plan, you can build your knowledge quickly. Our AI-powered study app adapts to your weak areas and builds a personalized study schedule.",
        cta: "Start Your Study Plan — $29.99/mo",
        ctaUrl: "https://study.behaviorschool.com?plan=monthly",
        badge: "Most Popular for New Studiers",
        color: "red" as const,
      };
    }
    if (score <= 70) {
      return {
        emoji: "target",
        title: "You're On Track but Have Gaps",
        description:
          "You have a solid foundation, but there are specific content areas that need attention. Our study app identifies exactly where your gaps are and focuses your study time where it matters most.",
        cta: "Close Your Gaps — $89.99/quarter",
        ctaUrl: "https://study.behaviorschool.com?plan=quarterly",
        badge: "Best Value",
        color: "yellow" as const,
      };
    }
    return {
      emoji: "rocket",
      title: "Almost There — Fine-Tune with AI",
      description:
        "You're in great shape! At this stage, it's all about sharpening your weakest areas and building exam-day confidence. Our AI adapts to challenge you where it counts and simulates real exam conditions.",
      cta: "Lock In Your Pass — $288/year",
      ctaUrl: "https://study.behaviorschool.com?plan=annual",
      badge: "Best for Exam-Ready Students",
      color: "green" as const,
    };
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
            BCBA Exam <span className="text-emerald-600">Readiness Quiz</span>
          </h1>
          <p className="text-lg text-bs-text-light mb-8 max-w-xl mx-auto">
            Answer 10 quick questions about your study habits and confidence
            levels. Get a personalized readiness score with tailored
            recommendations to help you pass.
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
            This is a self-assessment, not a practice exam. No BCBA exam
            questions are included.
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
          {/* Progress bar */}
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
              <h2 className="text-xl sm:text-2xl font-bold text-bs-text mb-1">
                {q.question}
              </h2>
              {q.subtitle && (
                <p className="text-slate-500 text-sm mb-6">{q.subtitle}</p>
              )}
              {!q.subtitle && <div className="mb-6" />}

              {/* Single select */}
              {q.type === "single" && (
                <div className="space-y-3">
                  {q.options?.map((opt) => (
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
              )}

              {/* Multi select */}
              {q.type === "multi" && (
                <div className="space-y-3">
                  {q.options?.map((opt) => {
                    const selected = ((answers[q.id] as string[]) ?? []).includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleMultiToggle(opt.value)}
                        className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all font-medium ${
                          selected
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 hover:border-emerald-300 text-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${
                              selected
                                ? "border-emerald-500 bg-emerald-500"
                                : "border-slate-300"
                            }`}
                          >
                            {selected && <CheckCircle2 className="w-4 h-4 text-white" />}
                          </div>
                          {opt.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Slider */}
              {q.type === "slider" && (
                <div className="px-2">
                  <div className="flex justify-between text-xs text-slate-400 mb-2">
                    <span>{q.sliderLabels?.[0]}</span>
                    <span>{q.sliderLabels?.[1]}</span>
                  </div>
                  <input
                    type="range"
                    min={q.sliderMin}
                    max={q.sliderMax}
                    step={q.sliderStep}
                    value={(answers[q.id] as number) ?? 5}
                    onChange={(e) => handleSlider(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-emerald-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  <div className="text-center mt-3">
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 text-xl font-bold">
                      {(answers[q.id] as number) ?? 5}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
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
        {showConfetti && <Confetti />}
        <motion.div
          className="max-w-lg mx-auto text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-bs-text mb-2">
            Your Readiness Score
          </h2>
          <p className="text-slate-500 mb-8">
            Here&apos;s how prepared you are for the BCBA exam
          </p>
          <ScoreRing score={score} />
          <p className="text-slate-500 mt-6 mb-8">
            Enter your email to unlock your{" "}
            <span className="font-semibold text-bs-text">
              personalized study recommendations
            </span>{" "}
            and action plan.
          </p>
          <motion.button
            onClick={() => setPhase("email")}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mail className="w-5 h-5" /> Get My Recommendations
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
              <ScoreRing score={score} />
              <h2 className="text-xl font-bold text-bs-text mt-4 mb-1">
                Unlock Your Personalized Plan
              </h2>
              <p className="text-slate-500 text-sm">
                We&apos;ll send your detailed results and a custom study roadmap.
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
  const rec = getRecommendation();
  const colorMap = {
    red: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", btn: "bg-red-600 hover:bg-red-700" },
    yellow: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", btn: "bg-amber-600 hover:bg-amber-700" },
    green: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", btn: "bg-emerald-600 hover:bg-emerald-700" },
  };
  const colors = colorMap[rec.color];

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
            Your Personalized Results
          </h2>
          <ScoreRing score={score} />
        </div>

        <div className={`rounded-2xl border-2 ${colors.border} ${colors.bg} p-6 sm:p-8 mb-6`}>
          <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center mb-3">
            {rec.emoji === "book" && <BookOpen className="w-6 h-6" />}
            {rec.emoji === "target" && <Target className="w-6 h-6" />}
            {rec.emoji === "rocket" && <Rocket className="w-6 h-6" />}
          </div>
          <div className={`inline-block text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full ${colors.text} bg-white/60 mb-3`}>
            {rec.badge}
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-bs-text mb-3">
            {rec.title}
          </h3>
          <p className="text-slate-600 mb-6 leading-relaxed">{rec.description}</p>
          <motion.a
            href={rec.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 ${colors.btn} text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition-all text-lg`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {rec.cta} <ChevronRight className="w-5 h-5" />
          </motion.a>
        </div>

        {/* Weak areas */}
        {(answers.weakest_area as string[])?.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h4 className="font-bold text-bs-text mb-3">Your Focus Areas</h4>
            <div className="flex flex-wrap gap-2">
              {(answers.weakest_area as string[]).map((area) => {
                const opt = questions
                  .find((q) => q.id === "weakest_area")
                  ?.options?.find((o) => o.value === area);
                return (
                  <span
                    key={area}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium"
                  >
                    {opt?.label ?? area}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Share */}
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <h4 className="font-bold text-bs-text mb-2">
            Share Your Readiness Score!
          </h4>
          <p className="text-slate-500 text-sm mb-4">
            Challenge your study group to take the quiz too.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <motion.button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-medium shadow hover:bg-emerald-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 className="w-4 h-4" /> Share
            </motion.button>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 text-white font-medium shadow hover:bg-sky-600 transition-colors"
            >
              𝕏 Tweet
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

        {/* Back to home */}
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
