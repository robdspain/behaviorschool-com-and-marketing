"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

type Phase = "landing" | "quiz" | "email" | "results";

type Answers = {
  quizRole: string;
  quizSetting: string;
  quizRunnable: string;
  quizChallenge: string;
};

type Question = {
  id: keyof Answers;
  prompt: string;
  options: { label: string; value: string }[];
};

const questions: Question[] = [
  {
    id: "quizRole",
    prompt: "What is your role?",
    options: [
      { label: "School BCBA", value: "school_bcba" },
      { label: "Behavior specialist", value: "behavior_specialist" },
      { label: "School psychologist", value: "school_psychologist" },
      { label: "Other", value: "other" },
    ],
  },
  {
    id: "quizSetting",
    prompt: "What setting do you primarily serve?",
    options: [
      { label: "Preschool / early childhood", value: "preschool_early_childhood" },
      { label: "Elementary", value: "elementary" },
      { label: "Middle", value: "middle" },
      { label: "High school", value: "high_school" },
      { label: "Mixed / multiple grade bands", value: "mixed_multiple" },
      { label: "Other", value: "other" },
    ],
  },
  {
    id: "quizRunnable",
    prompt:
      "Can a new person in the classroom record data for the goal just by reading it?",
    options: [
      { label: "Yes", value: "yes" },
      { label: "Sometimes", value: "sometimes" },
      { label: "No", value: "no" },
    ],
  },
  {
    id: "quizChallenge",
    prompt: "Where does your work get stuck most often?",
    options: [
      { label: "Goal writing", value: "goal_writing" },
      { label: "Making datasheets", value: "making_datasheets" },
      { label: "Staff coaching", value: "staff_coaching" },
      { label: "Fielding and sorting referrals", value: "fielding_referrals" },
    ],
  },
];

const resultCopy: Record<
  string,
  { title: string; body: string }
> = {
  yes: {
    title: "Your goal can travel.",
    body:
      "A new adult can take data from what you wrote. Protect that. Put one fidelity line in the plan: who takes data, when, and on what sheet, so the classroom does not depend on you being there.",
  },
  sometimes: {
    title: "It works when you are around.",
    body:
      "The goal still needs you to interpret it. Rewrite until a new person in the classroom can record data just by reading it. If they ask clarifying questions, the measure is not done.",
  },
  no: {
    title: "Not a program yet.",
    body:
      "Stop adding BIP pages. Build the datasheet first (what to look for, how often, what to mark). If a new classroom adult cannot take data from that page alone, fix the goal before you coach.",
  },
};

const challengeTips: Record<string, string> = {
  goal_writing: "Start with a measure staff can mark. Not more goal language.",
  making_datasheets: "One page. Columns. Codes. When. Put it where staff stand.",
  staff_coaching: "Coach from the sheet, not from the BIP narrative.",
  fielding_referrals:
    "Triage with the same filter. If nobody can take data from the goal as written, it is not ready for a full plan.",
};

const emptyAnswers: Answers = {
  quizRole: "",
  quizSetting: "",
  quizRunnable: "",
  quizChallenge: "",
};

export function IepGoalProgramQuiz() {
  const [phase, setPhase] = useState<Phase>("landing");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Answers>(emptyAnswers);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [priorityAccess, setPriorityAccess] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [savedPriorityAccess, setSavedPriorityAccess] = useState(false);

  const question = questions[currentQ];
  const progress = ((currentQ + 1) / questions.length) * 100;
  const selected = question ? answers[question.id] : "";
  const result = resultCopy[answers.quizRunnable] ?? resultCopy.no;
  const tip = challengeTips[answers.quizChallenge] ?? "";

  const selectOption = (value: string) => {
    if (!question) return;
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  };

  const handleNext = () => {
    if (!selected) return;
    if (currentQ < questions.length - 1) {
      setCurrentQ((n) => n + 1);
      return;
    }
    setPhase("email");
  };

  const handleBack = () => {
    if (phase === "email") {
      setPhase("quiz");
      setCurrentQ(questions.length - 1);
      return;
    }
    if (currentQ > 0) {
      setCurrentQ((n) => n - 1);
      return;
    }
    setPhase("landing");
  };

  const handleEmailSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Email is required to see your result.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/quiz/iep-goal-program", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...answers,
          name: name.trim() || undefined,
          email: email.trim(),
          priorityAccess,
          page: "/quiz/iep-goal-program",
        }),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Unable to save your response.");
      }

      setSavedPriorityAccess(priorityAccess);
      setPhase("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FBFAF6] via-[#F8F4E9] to-white text-[#171F1D]">
      <div className="mx-auto max-w-2xl px-4 pb-20 pt-28 sm:px-6">
        <AnimatePresence mode="wait">
          {phase === "landing" && (
            <motion.section
              key="landing"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="text-center"
            >
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-[#1F4D3F]">
                Behavior School
              </p>
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-[#123628] sm:text-5xl">
                Is your IEP goal a program yet?
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-[#3d4a46]">
                A 2-minute check for school behavior teams. See whether a new
                person in the classroom could record data for your last BIP goal
                just by reading it.
              </p>
              <motion.button
                type="button"
                onClick={() => {
                  setPhase("quiz");
                  setCurrentQ(0);
                }}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#1F4D3F] px-8 py-4 text-lg font-semibold text-white shadow-md transition hover:bg-[#123628]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start the check
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            </motion.section>
          )}

          {phase === "quiz" && question && (
            <motion.section
              key={`quiz-${question.id}`}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.28 }}
            >
              <div className="mb-6">
                <div className="mb-2 flex items-center justify-between text-sm text-[#5b6a65]">
                  <span>
                    Question {currentQ + 1} of {questions.length}
                  </span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#e6e0d4]">
                  <motion.div
                    className="h-full rounded-full bg-[#1F4D3F]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              <h2 className="text-2xl font-bold leading-snug text-[#123628] sm:text-3xl">
                {question.prompt}
              </h2>

              <div className="mt-6 space-y-3">
                {question.options.map((option) => {
                  const isSelected = selected === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => selectOption(option.value)}
                      className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left font-medium transition ${
                        isSelected
                          ? "border-[#1F4D3F] bg-[#1F4D3F]/10 text-[#123628]"
                          : "border-[#ddd5c6] bg-white/80 text-[#2a3531] hover:border-[#1F4D3F]/50"
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                          isSelected
                            ? "border-[#1F4D3F] bg-[#1F4D3F]"
                            : "border-[#b7b0a2]"
                        }`}
                      >
                        {isSelected && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                        )}
                      </span>
                      {option.label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-1 rounded-xl px-4 py-2.5 font-medium text-[#5b6a65] transition hover:bg-[#1F4D3F]/5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!selected}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#1F4D3F] px-6 py-2.5 font-semibold text-white transition hover:bg-[#123628] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {currentQ === questions.length - 1 ? "Continue" : "Next"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.section>
          )}

          {phase === "email" && (
            <motion.section
              key="email"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="mx-auto max-w-md"
            >
              <h2 className="text-2xl font-bold text-[#123628] sm:text-3xl">
                See your result
              </h2>
              <p className="mt-3 text-[#3d4a46]">
                Enter your email to unlock your result band and a practical tip
                for your next goal.
              </p>

              <form onSubmit={handleEmailSubmit} className="mt-6 space-y-4">
                <div>
                  <label
                    htmlFor="quiz-name"
                    className="mb-1.5 block text-sm font-medium text-[#3d4a46]"
                  >
                    Name <span className="font-normal text-[#7a8681]">(optional)</span>
                  </label>
                  <input
                    id="quiz-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    className="w-full rounded-xl border border-[#ddd5c6] bg-white px-4 py-3 text-[#171F1D] outline-none ring-[#1F4D3F] focus:ring-2"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="quiz-email"
                    className="mb-1.5 block text-sm font-medium text-[#3d4a46]"
                  >
                    Email
                  </label>
                  <input
                    id="quiz-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className="w-full rounded-xl border border-[#ddd5c6] bg-white px-4 py-3 text-[#171F1D] outline-none ring-[#1F4D3F] focus:ring-2"
                    placeholder="you@school.org"
                  />
                </div>

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#ddd5c6] bg-white/70 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={priorityAccess}
                    onChange={(e) => setPriorityAccess(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-[#b7b0a2] text-[#1F4D3F] focus:ring-[#1F4D3F]"
                  />
                  <span className="text-sm leading-relaxed text-[#2a3531]">
                    Get early access. First notice when the next live school BCBA
                    cohort opens.
                  </span>
                </label>

                {error && (
                  <p className="text-sm text-red-700" role="alert">
                    {error}
                  </p>
                )}

                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-1 rounded-xl px-4 py-2.5 font-medium text-[#5b6a65] transition hover:bg-[#1F4D3F]/5"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#1F4D3F] px-6 py-3 font-semibold text-white transition hover:bg-[#123628] disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving
                      </>
                    ) : (
                      <>
                        Show my result
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.section>
          )}

          {phase === "results" && (
            <motion.section
              key="results"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#1F4D3F]">
                Your result
              </p>
              <h2 className="mt-2 text-3xl font-bold leading-tight text-[#123628] sm:text-4xl">
                {result.title}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-[#2a3531]">
                {result.body}
              </p>

              {tip && (
                <p className="mt-6 border-l-4 border-[#E4B63D] pl-4 text-base leading-relaxed text-[#3d4a46]">
                  <span className="font-semibold text-[#123628]">P.S. </span>
                  {tip}
                </p>
              )}

              <div className="mt-10 rounded-2xl bg-[#1F4D3F] px-6 py-7 text-white">
                <h3 className="text-xl font-bold leading-snug">
                  Want more of these + first notice when seats open?
                </h3>
                <p className="mt-2 text-[#d7e4df]">Get early access.</p>
                {savedPriorityAccess ? (
                  <p className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-3 text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4 text-[#E4B63D]" />
                    You are on the early access list.
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={async () => {
                      setSubmitting(true);
                      setError("");
                      try {
                        const response = await fetch("/api/quiz/iep-goal-program", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            ...answers,
                            name: name.trim() || undefined,
                            email: email.trim(),
                            priorityAccess: true,
                            page: "/quiz/iep-goal-program",
                          }),
                        });
                        if (!response.ok) {
                          const data = (await response.json()) as { error?: string };
                          throw new Error(data.error || "Unable to save early access.");
                        }
                        setSavedPriorityAccess(true);
                      } catch (err) {
                        setError(
                          err instanceof Error
                            ? err.message
                            : "Something went wrong. Please try again."
                        );
                      } finally {
                        setSubmitting(false);
                      }
                    }}
                    disabled={submitting}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#E4B63D] px-5 py-3 font-semibold text-[#123628] transition hover:bg-[#f0c75a] disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving
                      </>
                    ) : (
                      <>
                        Get early access
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                )}
                {error && phase === "results" && (
                  <p className="mt-3 text-sm text-[#ffd4d4]" role="alert">
                    {error}
                  </p>
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
