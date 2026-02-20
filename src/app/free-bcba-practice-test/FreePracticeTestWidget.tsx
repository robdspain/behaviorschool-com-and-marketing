"use client";

import { useState } from "react";
import { CheckCircle, XCircle, ArrowRight, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
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

const PRACTICE_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    tag: "B-3: Define and provide examples of stimulus and stimulus class",
    stem: "During a small-group lesson, a teacher presents the word dog orally, shows a picture of a dog, and writes the word 'dog' on the board. A child responds correctly to all forms by pointing to a dog in an array. Which best describes this relation?",
    choices: [
      "Stimulus generalization within a response class",
      "Response generalization across stimulus classes",
      "Stimulus equivalence within a stimulus class",
      "Functional stimulus class across topographies",
    ],
    answer: "Stimulus equivalence within a stimulus class",
    letter: "C",
    explanation: "The learner demonstrates equivalence between different representations of 'dog' (spoken, written, pictorial), indicating derived relations among stimuli in a class. Distractors confuse response generalization (changes in behavior), functional classes (stimuli producing the same function), and topographical differences.",
  },
  {
    id: "q2",
    tag: "C-8: Identify and define motivating operations",
    stem: "A client usually refuses to participate in group games. On days when the client has skipped lunch, he engages quickly and enthusiastically in games that involve snack rewards. Which best explains this shift?",
    choices: [
      "Reinforcer establishing operation increasing the value of snacks",
      "Conditioned reinforcement decreasing competing reinforcers",
      "Stimulus control from the presence of peers",
      "Abolishing operation reducing escape-maintained behavior",
    ],
    answer: "Reinforcer establishing operation increasing the value of snacks",
    letter: "A",
    explanation: "Skipping lunch increases the effectiveness of snacks as reinforcers, an EO effect. The distractors confuse this with conditioned reinforcement (not the issue here), stimulus control (peers aren't the discriminative stimulus), and abolishing operations (would decrease snack value, not increase).",
  },
  {
    id: "q3",
    tag: "D-2: Use appropriate experimental designs",
    stem: "A BCBA alternates two interventions for reducing off-task behavior during math: differential reinforcement of alternative behavior (DRA) and noncontingent reinforcement (NCR). Each is implemented for 15-minute sessions across 5 days, with conditions rapidly alternated. Which design is being used?",
    choices: ["Reversal design", "Multiple baseline design", "Alternating treatments design", "Changing criterion design"],
    answer: "Alternating treatments design",
    letter: "C",
    explanation: "Rapid alternation of conditions across sessions without return to baseline indicates an alternating treatments design. Reversal involves sequential conditions with return to baseline, multiple baseline staggers interventions across settings/behaviors, and changing criterion involves stepwise adjustments in performance requirements.",
  },
  {
    id: "q4",
    tag: "H-4: Use functional communication training",
    stem: "Data show that tantrums occur in 80% of transitions to non-preferred activities. A BCBA teaches the client to request '2 more minutes' before transitioning. After training, tantrums drop to 20%. Which mechanism best explains this outcome?",
    choices: [
      "Extinction of tantrums via nonreinforcement",
      "Response generalization from prior mands",
      "Differential reinforcement of an alternative mand",
      "Stimulus fading with gradual transitions",
    ],
    answer: "Differential reinforcement of an alternative mand",
    letter: "C",
    explanation: "The appropriate mand replaces tantrums, which no longer produce the reinforcer. Extinction alone does not explain the reinforcement of the mand, response generalization is too broad, and stimulus fading was not described.",
  },
  {
    id: "q5",
    tag: "I-4: Evaluate intervention effectiveness",
    stem: "A graph shows a student's self-injurious behavior decreasing from 12 to 4 per day after introduction of a token economy. Over the next 3 weeks, the rate fluctuates between 3–6 per day, but no consistent downward trend emerges. What should the BCBA conclude?",
    choices: [
      "The intervention is highly effective and should be maintained as is",
      "The intervention shows initial effect but lacks maintenance or consistency",
      "The intervention is ineffective and should be discontinued immediately",
      "The intervention is effective, but variability reflects natural fluctuation",
    ],
    answer: "The intervention shows initial effect but lacks maintenance or consistency",
    letter: "B",
    explanation: "The immediate reduction indicates functional control, but the lack of consistent downward trend suggests issues with implementation fidelity, reinforcer potency, or generalization. Option A overstates effectiveness, C is premature, and D underestimates the need for further analysis.",
  },
  {
    id: "q6",
    tag: "E-2: Use extinction procedures",
    stem: "A parent ignores a child's whining for candy at the store. The child's whining escalates to crying and screaming before gradually decreasing over several trips. Which best explains the escalation phase?",
    choices: ["Spontaneous recovery", "Extinction burst", "Resurgence", "Avoidance behavior"],
    answer: "Extinction burst",
    letter: "B",
    explanation: "The temporary increase in intensity and frequency before decline is the classic extinction burst. Spontaneous recovery occurs after the behavior has ceased, resurgence refers to return of previously reinforced behavior, and avoidance is unrelated.",
  },
  {
    id: "q7",
    tag: "F-7: Implement token economies",
    stem: "In a classroom token system, students earn stars for appropriate behaviors but exchange opportunities are delayed until the end of the day. Over time, students begin to show less interest in earning stars. What is the most likely issue?",
    choices: [
      "Backup reinforcers are not conditioned",
      "Response cost procedures are punishing responding",
      "Delay between tokens and exchange weakens conditioned reinforcement",
      "Tokens have become generalized conditioned reinforcers",
    ],
    answer: "Delay between tokens and exchange weakens conditioned reinforcement",
    letter: "C",
    explanation: "Tokens function as conditioned reinforcers, but long delays to backup reinforcers reduce their reinforcing value. Distractors confuse backup reinforcement issues, punishment procedures, and the opposite condition (generalized reinforcement would increase value).",
  },
  {
    id: "q8",
    tag: "G-5: Interpret graphed data",
    stem: "A BCBA evaluates aggression using an ABAB design. Aggression drops from 10 to 2 in B1, returns to 9 in A2, and decreases again to 1 in B2. Which is the strongest conclusion?",
    choices: [
      "The intervention is effective, demonstrating experimental control",
      "The behavior decreased due to maturation",
      "The reduction reflects natural variability in behavior",
      "The design lacks internal validity and is inconclusive",
    ],
    answer: "The intervention is effective, demonstrating experimental control",
    letter: "A",
    explanation: "Repeated introduction and withdrawal of the intervention produced consistent changes in aggression, demonstrating functional control. Maturation and variability are ruled out by reversal effects, and the design clearly shows internal validity.",
  },
  {
    id: "q9",
    tag: "J-2: Identify and address ethical dilemmas",
    stem: "A teacher asks a BCBA to implement a behavior reduction plan for a student who 'talks too much' in class. The BCBA observes that the behavior involves asking questions relevant to instruction. What is the most ethical course of action?",
    choices: [
      "Implement the plan as requested, since the teacher is the client",
      "Decline to implement, as targeting appropriate behavior violates client rights",
      "Modify the goal to reduce frequency but maintain some engagement",
      "Collect baseline data before deciding whether the plan is necessary",
    ],
    answer: "Decline to implement, as targeting appropriate behavior violates client rights",
    letter: "B",
    explanation: "Asking relevant questions is socially significant and should not be reduced. Ethical guidelines prohibit targeting behavior that is not harmful or maladaptive. Options C and D suggest compromise but ignore the ethical violation, and A is clearly incorrect.",
  },
  {
    id: "q10",
    tag: "K-5: Supervise the implementation of behavior-change procedures",
    stem: "A BCBA trains staff to use DRA for attention-maintained aggression. During observations, some staff reinforce alternative behaviors inconsistently. What is the most appropriate supervisory action?",
    choices: [
      "Collect more baseline data before intervening",
      "Provide immediate performance feedback and model correct implementation",
      "Replace DRA with a simpler intervention",
      "Wait to see if staff improve with more practice",
    ],
    answer: "Provide immediate performance feedback and model correct implementation",
    letter: "B",
    explanation: "Effective supervision requires prompt, specific feedback and modeling to improve treatment fidelity. Collecting more baseline data or waiting delays correction, and replacing DRA ignores the problem of staff performance rather than intervention design.",
  },
];

export default function FreePracticeTestWidget() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [startTime] = useState<number>(Date.now());
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = PRACTICE_QUESTIONS[currentQuestionIndex];
  const progress = (answeredQuestions.size / PRACTICE_QUESTIONS.length) * 100;

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
    if (currentQuestionIndex < PRACTICE_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Complete the test
      const finalCorrectAnswers = correctAnswers + (selectedAnswer === currentQuestion.answer ? 1 : 0);
      const totalTime = Math.floor((Date.now() - startTime) / 1000);
      const percentage = Math.round((finalCorrectAnswers / PRACTICE_QUESTIONS.length) * 100);

      // Save results to localStorage
      localStorage.setItem('bcba_practice_test_results', JSON.stringify({
        score: finalCorrectAnswers,
        total: PRACTICE_QUESTIONS.length,
        percentage,
        time: totalTime,
        completedAt: new Date().toISOString()
      }));

      // Trigger confetti if perfect score
      if (finalCorrectAnswers === PRACTICE_QUESTIONS.length) {
        triggerPerfectScoreConfetti();
      }

      setIsComplete(true);
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

  const handleSaveResults = () => {
    // Redirect to auth page with context
    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    const finalCorrectAnswers = correctAnswers;
    const authUrl = `https://study.behaviorschool.com/auth?source=free-practice-test&score=${finalCorrectAnswers}&total=${PRACTICE_QUESTIONS.length}&time=${totalTime}&action=signup&redirect=${encodeURIComponent('https://behaviorschool.com/free-bcba-practice-test/results')}`;

    window.location.href = authUrl;
  };

  const getLetterFromIndex = (index: number): string => {
    return String.fromCharCode(65 + index); // A, B, C, D
  };

  if (isComplete) {
    const percentage = Math.round((correctAnswers / PRACTICE_QUESTIONS.length) * 100);
    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    const isPerfectScore = correctAnswers === PRACTICE_QUESTIONS.length;

    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 lg:p-10 shadow-xl">
          <div className="text-center mb-10">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
              isPerfectScore ? 'bg-bs-accent' : 'bg-emerald-100'
            }`}>
              {isPerfectScore ? (
                <span className="text-5xl">🏆</span>
              ) : (
                <CheckCircle className="w-12 h-12 text-emerald-600" />
              )}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
              {isPerfectScore ? '🎉 Perfect Score!' : 'Test Complete!'}
            </h2>
            <p className="text-lg sm:text-xl text-slate-600">
              {isPerfectScore
                ? 'Outstanding! You aced all questions!'
                : 'Great job completing the practice test'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10">
            <div className="text-center p-6 bg-slate-50 rounded-xl border-2 border-slate-200">
              <div className="text-4xl font-bold text-emerald-600 mb-2">
                {correctAnswers}/{PRACTICE_QUESTIONS.length}
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

          {/* Call to Action for Account Creation */}
          <div className="mb-8 p-6 bg-gradient-to-br from-emerald-50 to-blue-50 border-2 border-emerald-300 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <span className="text-4xl">✨</span>
              </div>
              <div className="flex-1">
                <p className="text-lg font-bold text-slate-900 mb-3">
                  Save Your Results & Unlock Daily Practice!
                </p>
                <p className="text-sm text-slate-700 mb-3">
                  Create a <strong>free account</strong> to:
                </p>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Save your test results and track progress over time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Get 10 free quiz questions with detailed explanations every day</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Access personalized performance analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Track your progress across all BACB task list domains</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleSaveResults}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-lg sm:text-xl py-6 sm:py-7 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Save className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
              Create Free Account & See Full Results
              <div className="ml-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold">
                Free Forever
              </div>
            </Button>
            <p className="text-center text-sm text-slate-600 pt-2">
              No credit card required • Takes 30 seconds • 10 free questions daily
            </p>
          </div>

          {/* Free Ebook Download Banner */}
          <div className="mt-8 p-6 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-cyan-500/10 border-2 border-cyan-500/30 rounded-xl">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <img 
                  src="/ebooks/bcba-guide-mockup.png" 
                  alt="BCBA Exam Survival Guide" 
                  className="w-32 h-auto drop-shadow-lg"
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  📚 Free Download: The 2026 BCBA Exam Survival Guide
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Get your complete study roadmap with task list breakdown, 12-week schedule, and test-taking strategies.
                </p>
                <a
                  href="/ebook/bcba-exam-guide"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-lg transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Get Your Free Guide
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-xl">
        {/* Progress Bar */}
        <div className="bg-slate-50 px-4 sm:px-6 py-4 sm:py-5 border-b-2 border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm sm:text-base font-semibold text-slate-900">
              Question {currentQuestionIndex + 1} of {PRACTICE_QUESTIONS.length}
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
                {currentQuestionIndex < PRACTICE_QUESTIONS.length - 1 ? (
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
