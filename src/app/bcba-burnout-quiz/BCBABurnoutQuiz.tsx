"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronLeft, ChevronRight, HeartHandshake, Mail, Sparkles } from "lucide-react";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { SoftProgramCta, withUtm } from "@/components/content/ProgramCta";
import { getRiskBand, questions } from "./quiz-data";

const CAMPAIGN = "bcba-burnout-quiz";

type Phase = "intro" | "quiz" | "score" | "email" | "results";

const forestButton =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] bg-[#1f4d3f] px-6 text-base font-semibold text-[#fbfaf6] hover:bg-[#123628] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#171f1d] disabled:cursor-not-allowed disabled:opacity-40";

const lightButton =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] border border-[#d9cdb8] bg-[#fbfaf6] px-5 text-base font-semibold text-[#171f1d] hover:bg-[#f4efe5] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3f] disabled:cursor-not-allowed disabled:opacity-40";

const fieldClass =
  "w-full min-h-11 rounded-[8px] border border-[#d9cdb8] bg-[#ffffff] px-4 text-base text-[#171f1d] placeholder:text-[#365548] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3f]";

function bandSurface(title: string) {
  if (title === "Low Burnout Risk") {
    return {
      box: "border-2 border-[#1f4d3f] bg-[#fbfaf6]",
      title: "text-[#171f1d]",
      body: "text-[#365548]",
    };
  }
  if (title === "Moderate Burnout Risk") {
    return {
      box: "border-2 border-[#d9cdb8] bg-[#e4b63d]",
      title: "text-[#171f1d]",
      body: "text-[#171f1d]",
    };
  }
  if (title === "High Burnout Risk") {
    return {
      box: "border-4 border-[#1f4d3f] bg-[#f4efe5]",
      title: "text-[#171f1d]",
      body: "text-[#365548]",
    };
  }
  return {
    box: "border-2 border-[#123628] bg-[#1f4d3f]",
    title: "text-[#fbfaf6]",
    body: "text-[#fbfaf6]",
  };
}

function calculateScore(answers: Record<string, string>): number {
  return questions.reduce((sum, question) => {
    const answer = answers[question.id];
    const option = question.options.find((item) => item.value === answer);
    return sum + (option?.points ?? 0);
  }, 0);
}

export function BCBABurnoutQuiz({ lead, note }: { lead: ReactNode; note: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const question = questions[currentQ];
  const progress = ((currentQ + 1) / questions.length) * 100;

  const canAdvance = useCallback(() => {
    if (!question) return false;
    return Boolean(answers[question.id]);
  }, [answers, question]);

  useEffect(() => {
    if (phase === "intro") return;
    headingRef.current?.focus();
  }, [phase, currentQ]);

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((previous) => previous + 1);
      return;
    }
    setScore(calculateScore(answers));
    setPhase("score");
  };

  const handleBack = () => {
    if (currentQ > 0) setCurrentQ((previous) => previous - 1);
  };

  const handleSingleSelect = (value: string) => {
    if (!question) return;
    setAnswers((previous) => ({ ...previous, [question.id]: value }));
  };

  const handleEmailSubmit = async (event: FormEvent) => {
    event.preventDefault();
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

  if (phase === "intro") {
    return (
      <div className="pb-4">
        {lead}
        <button type="button" onClick={() => setPhase("quiz")} className={`mt-6 ${forestButton}`}>
          Start the Quiz
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
        <div className="mt-4 space-y-4 text-base leading-7 text-[#365548]">{note}</div>
      </div>
    );
  }

  if (phase === "quiz" && question) {
    return (
      <div className="pb-8">
        <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-bold leading-tight text-[#171f1d] outline-none">
          BCBA Burnout Risk Quiz for School BCBAs
        </h1>
        <div className="mt-6" aria-live="polite">
          <div className="mb-2 flex justify-between text-base text-[#365548]">
            <span>
              Question {currentQ + 1} of {questions.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div
            className="h-2 overflow-hidden rounded-[8px] bg-[#f4efe5]"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Quiz progress"
          >
            <div className="h-full rounded-[8px] bg-[#1f4d3f]" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="mt-6 rounded-[12px] border border-[#d9cdb8] bg-[#ffffff] p-5 sm:p-8">
          <p className="text-base font-semibold text-[#1f4d3f]">Question {currentQ + 1}</p>
          <h2 className="mt-2 text-xl font-bold leading-snug text-[#171f1d] sm:text-2xl">{question.question}</h2>
          <div className="mt-6 space-y-3" role="group" aria-label={`Answers for question ${currentQ + 1}`}>
            {question.options.map((option) => {
              const selected = answers[question.id] === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSingleSelect(option.value)}
                  aria-pressed={selected}
                  className={`flex min-h-11 w-full items-center gap-3 rounded-[8px] border-2 px-4 py-3 text-left text-base font-medium text-[#171f1d] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3f] ${
                    selected ? "border-[#1f4d3f] bg-[#f4efe5]" : "border-[#d9cdb8] bg-[#ffffff] hover:border-[#1f4d3f]"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                      selected ? "border-[#1f4d3f] bg-[#1f4d3f] text-[#fbfaf6]" : "border-[#365548]"
                    }`}
                    aria-hidden="true"
                  >
                    {selected ? <CheckCircle2 className="h-4 w-4" /> : null}
                  </span>
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-between gap-3">
          <button type="button" onClick={handleBack} disabled={currentQ === 0} className={lightButton}>
            <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Back
          </button>
          <button type="button" onClick={handleNext} disabled={!canAdvance()} className={forestButton}>
            {currentQ === questions.length - 1 ? "See My Score" : "Next"}
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  }

  if (phase === "score") {
    return (
      <div className="pb-8">
        <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-bold leading-tight text-[#171f1d] outline-none">
          BCBA Burnout Risk Quiz for School BCBAs
        </h1>
        <h2 className="mt-6 text-2xl font-bold text-[#171f1d] sm:text-3xl">Your Burnout Risk Score</h2>
        <p className="mt-2 text-base text-[#365548]">Score range is 0 to 36 (higher = more risk)</p>
        <p className="mt-6 text-5xl font-bold text-[#1f4d3f]">
          {score}/36
        </p>
        <p className="mt-6 max-w-xl text-base leading-7 text-[#365548]">
          Enter your email to see your risk band and next steps on screen.
        </p>
        <button type="button" onClick={() => setPhase("email")} className={`mt-6 ${forestButton}`}>
          <Mail className="h-5 w-5" aria-hidden="true" /> Get My Results
        </button>
      </div>
    );
  }

  if (phase === "email") {
    return (
      <div className="pb-8">
        <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-bold leading-tight text-[#171f1d] outline-none">
          BCBA Burnout Risk Quiz for School BCBAs
        </h1>
        <div className="mt-6 max-w-md rounded-[12px] border border-[#d9cdb8] bg-[#ffffff] p-5 sm:p-8">
          <p className="text-4xl font-bold text-[#1f4d3f]">{score}/36</p>
          <h2 className="mt-4 text-xl font-bold text-[#171f1d]">Get Your Results</h2>
          <p className="mt-2 text-base leading-7 text-[#365548]">
            Enter your email to see your risk band and next steps on screen.
          </p>
          <form onSubmit={handleEmailSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="firstName" className="mb-1 block text-base font-medium text-[#171f1d]">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                autoComplete="given-name"
                placeholder="Your first name"
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-base font-medium text-[#171f1d]">
                Email Address (required)
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                placeholder="you@example.com"
                className={fieldClass}
              />
            </div>
            <button type="submit" disabled={submitting || !email} className={`w-full ${forestButton}`}>
              {submitting ? "Sending..." : "Show My Results"}
            </button>
            <p className="text-base leading-7 text-[#365548]">
              If you enter your email to see your results, Behavior School saves your email, first name, score and answers.
            </p>
          </form>
        </div>
      </div>
    );
  }

  const band = getRiskBand(score);
  const surface = bandSurface(band.title);

  return (
    <div className="pb-8">
      <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-bold leading-tight text-[#171f1d] outline-none">
        BCBA Burnout Risk Quiz for School BCBAs
      </h1>
      <div className="mt-6 text-left">
        <h2 className="text-2xl font-bold text-[#171f1d] sm:text-3xl">Your Burnout Risk Results</h2>
        <p className="mt-2 text-4xl font-bold text-[#1f4d3f]">{score}/36</p>
      </div>

      <div className={`mt-6 rounded-[12px] p-5 sm:p-8 ${surface.box}`}>
        <h3 className={`text-xl font-bold sm:text-2xl ${surface.title}`}>{band.title}</h3>
        <p className={`mt-3 text-base leading-7 ${surface.body}`}>{band.description}</p>
        <p className={`mt-4 text-base leading-7 ${surface.body}`}>
          This quiz is a self-assessment and not a diagnosis. If you need clinical support, please reach out to a licensed professional.
        </p>
      </div>

      <div className="my-8">
        <Link href="/bcba-burnout-quiz/playbook" className={forestButton}>
          Download Your Free Self-Care Playbook
        </Link>
        <p className="mt-3 text-base leading-7 text-[#365548]">
          A practical guide to preventing burnout and building a sustainable career.
        </p>
      </div>

      {band.title === "Low Burnout Risk" ? (
        <div className="my-8">
          <p className="text-base leading-7 text-[#365548]">
            Keep what is working. The Weekly Research Brief sends one practical idea each week.
          </p>
          <NewsletterSignup />
        </div>
      ) : (
        <div className="my-8">
          <h3 className="text-xl font-semibold text-[#171f1d]">Your score points to the workload</h3>
          <SoftProgramCta campaign={CAMPAIGN} linkLabel="See the Transformation Program">
            Strain from plans nobody runs and requests that never stop can ease when the system changes. The Transformation Program builds that system with you.
          </SoftProgramCta>
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <a
          href="https://study.behaviorschool.com/free-practice/"
          className="block min-h-11 rounded-[12px] border border-[#d9cdb8] bg-[#ffffff] p-5 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3f]"
        >
          <div className="mb-2 flex items-center gap-2 font-semibold text-[#1f4d3f]">
            <Sparkles className="h-4 w-4" aria-hidden="true" /> Exam Stress
          </div>
          <p className="mb-3 text-base leading-7 text-[#365548]">Use Study Tools to reduce anxiety and build confidence.</p>
          <span className="font-semibold text-[#1f4d3f] underline underline-offset-4">View Study Tools</span>
        </a>
        <a
          href={withUtm("/transformation-program", CAMPAIGN)}
          data-cta="program-soft"
          data-cta-page={CAMPAIGN}
          className="block min-h-11 rounded-[12px] border border-[#d9cdb8] bg-[#ffffff] p-5 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3f]"
        >
          <div className="mb-2 flex items-center gap-2 font-semibold text-[#1f4d3f]">
            <HeartHandshake className="h-4 w-4" aria-hidden="true" /> Systems Issues
          </div>
          <p className="mb-3 text-base leading-7 text-[#365548]">Fix the systems that keep you overloaded and stuck.</p>
          <span className="font-semibold text-[#1f4d3f] underline underline-offset-4">School BCBA Systems Transformation Program</span>
        </a>
        <a
          href="https://community.behaviorschool.com"
          className="block min-h-11 rounded-[12px] border border-[#d9cdb8] bg-[#ffffff] p-5 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3f]"
        >
          <div className="mb-2 flex items-center gap-2 font-semibold text-[#1f4d3f]">
            <Sparkles className="h-4 w-4" aria-hidden="true" /> Isolation
          </div>
          <p className="mb-3 text-base leading-7 text-[#365548]">Join a community of school BCBAs.</p>
          <span className="font-semibold text-[#1f4d3f] underline underline-offset-4">Join the Community</span>
        </a>
      </div>

      <div className="rounded-[12px] border border-[#d9cdb8] bg-[#ffffff] p-6 text-left">
        <h3 className="font-bold text-[#171f1d]">Share Your Result</h3>
        <p className="mt-2 text-base leading-7 text-[#365548]">Help other BCBAs check in on their burnout risk.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={handleShare} className={forestButton}>
            Share
          </button>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={lightButton}
          >
            LinkedIn
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={lightButton}
          >
            Facebook
          </a>
        </div>
      </div>

      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center font-semibold text-[#1f4d3f] underline underline-offset-4 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3f]"
        >
          Back to Behavior School
        </Link>
      </div>
    </div>
  );
}
