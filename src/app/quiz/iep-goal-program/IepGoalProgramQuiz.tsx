"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  Loader2,
  Mail,
  Minus,
} from "lucide-react";
import {
  IEP_GOAL_PROGRAM_QUESTIONS,
  EMPTY_IEP_GOAL_PROGRAM_ANSWERS,
  buildQuizChecklist,
  countChecklistStatuses,
  deriveResultBand,
  RESULT_BAND_COPY,
  type IepGoalProgramAnswers,
  type QuizChecklistItem,
} from "@/lib/iep-goal-program-quiz";

type Phase = "landing" | "quiz" | "preview" | "sent";

function ChecklistIcon({ status }: { status: QuizChecklistItem["status"] }) {
  if (status === "ready") {
    return <CheckCircle2 className="h-5 w-5 shrink-0 text-[#1F4D3F]" aria-hidden />;
  }
  if (status === "not-included") {
    return <Minus className="h-5 w-5 shrink-0 text-[#7a8681]" aria-hidden />;
  }
  return <CircleAlert className="h-5 w-5 shrink-0 text-[#b45309]" aria-hidden />;
}

export function IepGoalProgramQuiz() {
  const [phase, setPhase] = useState<Phase>("landing");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<IepGoalProgramAnswers>(
    EMPTY_IEP_GOAL_PROGRAM_ANSWERS
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [priorityAccess, setPriorityAccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [savedPriorityAccess, setSavedPriorityAccess] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const questions = IEP_GOAL_PROGRAM_QUESTIONS;
  const question = questions[currentQ];
  const progress = ((currentQ + 1) / questions.length) * 100;
  const selected = question ? answers[question.id] : "";

  const checklist = useMemo(() => buildQuizChecklist(answers), [answers]);
  const { readyCount, reviewCount, scoredCount } = useMemo(
    () => countChecklistStatuses(checklist),
    [checklist]
  );
  const resultBand = deriveResultBand(answers);
  const result = RESULT_BAND_COPY[resultBand];

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
    setPhase("preview");
  };

  const handleBack = () => {
    if (phase === "preview") {
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

  const submitEmail = async (event: FormEvent, forcePriorityAccess?: boolean) => {
    event.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Email is required to send your checklist.");
      return;
    }

    const pa = forcePriorityAccess === true ? true : priorityAccess;
    setSubmitting(true);
    try {
      const response = await fetch("/api/quiz/iep-goal-program", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...answers,
          name: name.trim() || undefined,
          email: email.trim(),
          priorityAccess: pa,
          page: "/quiz/iep-goal-program",
        }),
      });

      const data = (await response.json()) as { error?: string; priorityAccess?: boolean };
      if (!response.ok) {
        throw new Error(data.error || "Unable to save your response.");
      }

      setSavedPriorityAccess(Boolean(data.priorityAccess));
      setEmailSent(true);
      setPhase("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const upgradePriorityAccess = async () => {
    if (!email.trim()) {
      setError("Enter your email above first, then opt in to Priority Access.");
      return;
    }
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
      const data = (await response.json()) as { error?: string; priorityAccess?: boolean };
      if (!response.ok) {
        throw new Error(data.error || "Unable to save Priority Access.");
      }
      setSavedPriorityAccess(Boolean(data.priorityAccess));
      setPriorityAccess(true);
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
                Is your goal ready to become a plan?
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-[#3d4a46]">
                A 3-minute check for school behavior teams. Score your last IEP
                goal against the same quality checks in our free Behavior Goal
                Writer — then see whether a new classroom adult could run it.
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
              <p className="mt-4 text-sm text-[#7a8681]">
                See your checklist instantly — email is optional.
              </p>
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
              {question.helper && (
                <p className="mt-2 text-sm text-[#7a8681]">{question.helper}</p>
              )}

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
                  {currentQ === questions.length - 1 ? "See my checklist" : "Next"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.section>
          )}

          {(phase === "preview" || phase === "sent") && (
            <motion.section
              key="preview"
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
                {result.summary}
              </p>

              <p className="mt-4 text-sm font-medium text-[#5b6a65]">
                {readyCount} of {scoredCount} checks ready
                {reviewCount > 0 ? ` · ${reviewCount} to review` : ""}
              </p>

              <ul className="mt-6 space-y-4 rounded-2xl border border-[#ddd5c6] bg-white/80 p-5 sm:p-6">
                {checklist.map((item) => (
                  <li key={item.id} className="flex gap-3">
                    <ChecklistIcon status={item.status} />
                    <div>
                      <p className="font-semibold text-[#123628]">{item.label}</p>
                      <p className="mt-1 text-sm leading-relaxed text-[#3d4a46]">
                        {item.detail}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-wide text-[#7a8681]">
                        {item.status === "ready"
                          ? "Ready"
                          : item.status === "not-included"
                            ? "Not included"
                            : "Review"}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <p className="mt-6 border-l-4 border-[#E4B63D] pl-4 text-base leading-relaxed text-[#3d4a46]">
                <span className="font-semibold text-[#123628]">Tip: </span>
                {result.tip}
              </p>

              <div className="mt-8 rounded-2xl border border-[#ddd5c6] bg-white/90 p-6">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#1F4D3F]" />
                  <div className="flex-1">
                    {emailSent ? (
                      <>
                        <h3 className="text-lg font-bold text-[#123628]">
                          Checklist sent
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[#3d4a46]">
                          We emailed your checklist and a link to the free{" "}
                          <Link
                            href="/iep-goals"
                            className="font-medium text-[#1F4D3F] underline-offset-2 hover:underline"
                          >
                            Behavior Goal Writer
                          </Link>
                          .
                        </p>
                      </>
                    ) : (
                      <>
                        <h3 className="text-lg font-bold text-[#123628]">
                          Email me my checklist + free Behavior Goal Writer link
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[#3d4a46]">
                          Get this checklist in your inbox with a direct link to{" "}
                          <Link
                            href="/iep-goals"
                            className="font-medium text-[#1F4D3F] underline-offset-2 hover:underline"
                          >
                            /iep-goals
                          </Link>
                          .
                        </p>
                        <form
                          onSubmit={(event) => submitEmail(event)}
                          className="mt-4 space-y-3"
                        >
                          <input
                            id="quiz-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="name"
                            className="w-full rounded-xl border border-[#ddd5c6] bg-white px-4 py-3 text-[#171F1D] outline-none ring-[#1F4D3F] focus:ring-2"
                            placeholder="Name (optional)"
                          />
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
                          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#e6e0d4] bg-[#FBFAF6] px-4 py-3">
                            <input
                              type="checkbox"
                              checked={priorityAccess}
                              onChange={(e) => setPriorityAccess(e.target.checked)}
                              className="mt-1 h-4 w-4 rounded border-[#b7b0a2] text-[#1F4D3F] focus:ring-[#1F4D3F]"
                            />
                            <span className="text-sm leading-relaxed text-[#2a3531]">
                              <span className="font-medium text-[#123628]">
                                Priority Access (optional)
                              </span>
                              — first notice when the next School BCBA
                              Transformation Program cohort opens. Includes
                              occasional program updates; unsubscribe anytime.
                            </span>
                          </label>
                          {error && (
                            <p className="text-sm text-red-700" role="alert">
                              {error}
                            </p>
                          )}
                          <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1F4D3F] px-6 py-3 font-semibold text-white transition hover:bg-[#123628] disabled:opacity-60 sm:w-auto"
                          >
                            {submitting ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Sending
                              </>
                            ) : (
                              <>
                                Email my checklist
                                <ArrowRight className="h-4 w-4" />
                              </>
                            )}
                          </button>
                        </form>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {!savedPriorityAccess && emailSent && (
                <div className="mt-6 rounded-2xl bg-[#1F4D3F] px-6 py-6 text-white">
                  <h3 className="text-lg font-bold leading-snug">
                    Want Priority Access to the Transformation Program?
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#d7e4df]">
                    Optional — get first notice when the next live School BCBA
                    cohort opens. No payment required to join the list.
                  </p>
                  <button
                    type="button"
                    onClick={upgradePriorityAccess}
                    disabled={submitting}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#E4B63D] px-5 py-3 font-semibold text-[#123628] transition hover:bg-[#f0c75a] disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving
                      </>
                    ) : (
                      <>
                        Add Priority Access
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                  {error && (
                    <p className="mt-3 text-sm text-[#ffd4d4]" role="alert">
                      {error}
                    </p>
                  )}
                </div>
              )}

              {savedPriorityAccess && (
                <p className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1F4D3F]/10 px-4 py-3 text-sm font-medium text-[#123628]">
                  <CheckCircle2 className="h-4 w-4 text-[#1F4D3F]" />
                  You are on the Transformation Program Priority Access list.
                </p>
              )}

              <div className="mt-8 text-center">
                <Link
                  href="/iep-goals"
                  className="inline-flex items-center gap-2 font-semibold text-[#1F4D3F] underline-offset-2 hover:underline"
                >
                  Open the free Behavior Goal Writer
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
