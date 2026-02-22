'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { QuizQuestion } from '@/components/ace/QuizQuestion';
import { QuizResults } from '@/components/ace/QuizResults';
import {
  FileQuestion,
  Clock,
  Target,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Send,
  Search,
  LogIn,
  RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AceQuiz, AceQuizQuestion } from '@/lib/ace/types';

// ============================================================================
// Types
// ============================================================================

type QuizPhase = 'lookup' | 'ready' | 'taking' | 'submitting' | 'results';

interface ParticipantInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface SubmissionResult {
  passed: boolean;
  score: number;
  totalQuestions: number;
  scorePercentage: number;
  passingScore: number;
  correctAnswers: Record<string, string[]>;
  explanations: Record<string, string>;
}

// ============================================================================
// Timer Component
// ============================================================================

function TimerDisplay({
  timeRemainingSeconds,
}: {
  timeRemainingSeconds: number;
}) {
  const minutes = Math.floor(timeRemainingSeconds / 60);
  const seconds = timeRemainingSeconds % 60;
  const isLow = timeRemainingSeconds <= 300; // 5 minutes warning
  const isCritical = timeRemainingSeconds <= 60;

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-sm font-bold',
        isCritical
          ? 'border-red-300 bg-red-50 text-red-700 animate-pulse'
          : isLow
            ? 'border-amber-300 bg-amber-50 text-amber-700'
            : 'border-gray-200 bg-white text-gray-700'
      )}
    >
      <Clock className="h-4 w-4" />
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}

// ============================================================================
// Progress Bar
// ============================================================================

function ProgressBar({
  answered,
  total,
}: {
  answered: number;
  total: number;
}) {
  const percentage = total > 0 ? Math.round((answered / total) * 100) : 0;

  return (
    <div className="w-full">
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-gray-500">
          {answered} of {total} answered
        </span>
        <span className="font-medium text-[#1F4D3F]">{percentage}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-[#1F4D3F] transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function QuizTakePage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;

  // Quiz data
  const [quiz, setQuiz] = useState<AceQuiz | null>(null);
  const [questions, setQuestions] = useState<AceQuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Participant lookup
  const [lookupEmail, setLookupEmail] = useState('');
  const [lookupCode, setLookupCode] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [participant, setParticipant] = useState<ParticipantInfo | null>(null);

  // Quiz taking state
  const [phase, setPhase] = useState<QuizPhase>('lookup');
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // Timer
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Results
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [attemptNumber, setAttemptNumber] = useState(1);

  // ============================================================================
  // Data Fetching
  // ============================================================================

  useEffect(() => {
    async function fetchQuiz() {
      try {
        setLoading(true);

        // Fetch quiz details via the questions endpoint (quiz data included)
        const questionsRes = await fetch(`/api/ace/quizzes/${quizId}/questions`);
        if (!questionsRes.ok) throw new Error('Failed to load quiz');

        const questionsData = await questionsRes.json();
        setQuestions(
          (questionsData.data || []).sort(
            (a: AceQuizQuestion, b: AceQuizQuestion) =>
              (a.order_index || 0) - (b.order_index || 0)
          )
        );

        // Fetch quiz info
        const quizRes = await fetch(`/api/ace/quizzes?event_id=_byquiz_${quizId}`);
        // If the above doesn't work, try direct approach
        if (quizRes.ok) {
          const quizData = await quizRes.json();
          if (quizData.data) {
            setQuiz(quizData.data);
          }
        }

        // If we didn't get quiz data, construct minimal quiz info from questions
        // We still need the quiz settings for the taking experience
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    }

    if (quizId) fetchQuiz();
  }, [quizId]);

  // ============================================================================
  // Timer Logic
  // ============================================================================

  const startTimer = useCallback(() => {
    if (!quiz?.time_limit_minutes) return;

    setTimeRemainingSeconds(quiz.time_limit_minutes * 60);

    timerRef.current = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev === null || prev <= 1) {
          // Time's up - auto-submit
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [quiz?.time_limit_minutes]);

  // Auto-submit when timer reaches 0
  useEffect(() => {
    if (timeRemainingSeconds === 0 && phase === 'taking') {
      handleSubmitQuiz();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemainingSeconds, phase]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ============================================================================
  // Participant Lookup
  // ============================================================================

  const handleLookup = async () => {
    if (!lookupEmail.trim() && !lookupCode.trim()) {
      setLookupError('Please enter your email address or confirmation code.');
      return;
    }

    try {
      setLookupLoading(true);
      setLookupError(null);

      const searchParam = lookupCode.trim()
        ? `code=${encodeURIComponent(lookupCode.trim())}`
        : `email=${encodeURIComponent(lookupEmail.trim().toLowerCase())}`;

      const res = await fetch(`/api/ace/registrations?${searchParam}`);
      const data = await res.json();

      if (!res.ok || !data.registrations || data.registrations.length === 0) {
        setLookupError(
          'No registration found. Please check your email or confirmation code.'
        );
        return;
      }

      const registration = data.registrations[0];

      // Build participant info from registration
      setParticipant({
        id: registration.participantId,
        firstName: registration.participantFirstName || '',
        lastName: registration.participantLastName || '',
        email: lookupEmail.trim().toLowerCase() || registration.participantEmail || '',
      });

      setPhase('ready');
    } catch (err) {
      setLookupError('An error occurred. Please try again.');
    } finally {
      setLookupLoading(false);
    }
  };

  // ============================================================================
  // Quiz Taking
  // ============================================================================

  const startQuiz = () => {
    // Shuffle questions if setting is enabled
    if (quiz?.shuffle_questions) {
      const shuffled = [...questions].sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
    }

    setPhase('taking');
    setAnswers({});
    setCurrentQuestionIndex(0);
    startTimer();
  };

  const handleAnswerChange = (questionId: string, selectedAnswers: string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedAnswers,
    }));
  };

  const answeredCount = Object.keys(answers).filter(
    (key) => answers[key] && answers[key].length > 0
  ).length;

  const handleSubmitQuiz = async () => {
    if (!participant) return;

    try {
      setPhase('submitting');
      setShowSubmitConfirm(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      const res = await fetch(`/api/ace/quizzes/${quizId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participant_id: participant.id,
          answers,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit quiz');
      }

      setResult({
        passed: data.passed,
        score: data.score,
        totalQuestions: data.totalQuestions,
        scorePercentage: data.scorePercentage,
        passingScore: data.passingScore,
        correctAnswers: data.correctAnswers || {},
        explanations: data.explanations || {},
      });

      setAttemptNumber((prev) => prev + 1);
      setPhase('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
      setPhase('taking');
    }
  };

  const handleRetry = () => {
    setResult(null);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setTimeRemainingSeconds(null);
    setPhase('ready');
  };

  const handleContinueToFeedback = () => {
    if (quiz?.event_id) {
      router.push(`/ace/events/${quiz.event_id}/feedback`);
    } else {
      router.push('/ace/quizzes');
    }
  };

  // ============================================================================
  // Render - Loading
  // ============================================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-[#1F4D3F] text-white">
          <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
            <Skeleton className="h-8 w-[250px] bg-white/20" />
            <Skeleton className="mt-2 h-4 w-[180px] bg-white/10" />
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-4 py-8">
          <Skeleton className="h-[400px] rounded-lg" />
        </div>
      </div>
    );
  }

  // ============================================================================
  // Render - Error
  // ============================================================================

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-[#1F4D3F] text-white">
          <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold">Quiz</h1>
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-4 py-8">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
                <div>
                  <p className="font-medium text-red-800">{error}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => window.location.reload()}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ============================================================================
  // Render - Participant Lookup Phase
  // ============================================================================

  if (phase === 'lookup') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-[#1F4D3F] text-white">
          <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold">
              {quiz?.title || 'Event Quiz'}
            </h1>
            <p className="mt-1 text-green-100">
              Enter your details to begin
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-lg px-4 py-12">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#1F4D3F]/10">
                <LogIn className="h-8 w-8 text-[#1F4D3F]" />
              </div>
              <CardTitle>Verify Your Registration</CardTitle>
              <p className="text-sm text-muted-foreground">
                Enter your email address or confirmation code to access the quiz.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="lookup-email">Email Address</Label>
                <Input
                  id="lookup-email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={lookupEmail}
                  onChange={(e) => {
                    setLookupEmail(e.target.value);
                    setLookupError(null);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">or</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lookup-code">Confirmation Code</Label>
                <Input
                  id="lookup-code"
                  type="text"
                  placeholder="e.g., ACE-XXXX-XXXX"
                  value={lookupCode}
                  onChange={(e) => {
                    setLookupCode(e.target.value);
                    setLookupError(null);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                />
              </div>

              {lookupError && (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {lookupError}
                </div>
              )}

              <Button
                onClick={handleLookup}
                disabled={lookupLoading}
                className="w-full bg-[#1F4D3F] text-white hover:bg-[#1F4D3F]/90"
              >
                {lookupLoading ? (
                  'Verifying...'
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Find My Registration
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ============================================================================
  // Render - Ready Phase (Pre-quiz)
  // ============================================================================

  if (phase === 'ready') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-[#1F4D3F] text-white">
          <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold">
              {quiz?.title || 'Event Quiz'}
            </h1>
          </div>
        </div>
        <div className="mx-auto max-w-lg px-4 py-12">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#1F4D3F]/10">
                <FileQuestion className="h-8 w-8 text-[#1F4D3F]" />
              </div>
              <CardTitle>Ready to Start</CardTitle>
              {participant && (
                <p className="text-sm text-muted-foreground">
                  Welcome, {participant.firstName} {participant.lastName}
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quiz Info */}
              <div className="space-y-3 rounded-lg border bg-gray-50 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Questions</span>
                  <span className="font-medium">{questions.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Passing Score</span>
                  <span className="font-medium">
                    {quiz?.passing_score_percentage || 80}%
                  </span>
                </div>
                {quiz?.time_limit_minutes && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Time Limit</span>
                    <span className="font-medium">
                      {quiz.time_limit_minutes} minutes
                    </span>
                  </div>
                )}
                {quiz?.max_attempts && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Attempts Allowed</span>
                    <span className="font-medium">{quiz.max_attempts}</span>
                  </div>
                )}
                {quiz?.shuffle_questions && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Question Order</span>
                    <span className="font-medium">Randomized</span>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
                <p className="font-medium">Instructions:</p>
                <ul className="mt-2 list-inside list-disc space-y-1 text-blue-700">
                  <li>Read each question carefully before answering.</li>
                  <li>You can navigate between questions using Previous/Next buttons.</li>
                  {quiz?.time_limit_minutes && (
                    <li>
                      You have {quiz.time_limit_minutes} minutes. The quiz will
                      auto-submit when time expires.
                    </li>
                  )}
                  <li>
                    You must score at least {quiz?.passing_score_percentage || 80}%
                    to pass.
                  </li>
                </ul>
              </div>

              <Button
                onClick={startQuiz}
                className="w-full bg-[#1F4D3F] text-white hover:bg-[#1F4D3F]/90"
                size="lg"
              >
                Start Quiz
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ============================================================================
  // Render - Submitting Phase
  // ============================================================================

  if (phase === 'submitting') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-[#1F4D3F] text-white">
          <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold">{quiz?.title || 'Quiz'}</h1>
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-4 py-12">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#1F4D3F]/20 border-t-[#1F4D3F]" />
              <p className="text-lg font-medium text-gray-900">
                Submitting your answers...
              </p>
              <p className="mt-1 text-sm text-gray-500">Please wait.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ============================================================================
  // Render - Results Phase
  // ============================================================================

  if (phase === 'results' && result) {
    const canRetry =
      quiz?.max_attempts ? attemptNumber <= quiz.max_attempts : true;
    const attemptsRemaining = quiz?.max_attempts
      ? quiz.max_attempts - attemptNumber + 1
      : null;

    return (
      <div className="min-h-screen bg-gray-50">
        <div
          className={cn(
            'text-white',
            result.passed ? 'bg-emerald-700' : 'bg-red-700'
          )}
        >
          <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold">{quiz?.title || 'Quiz Results'}</h1>
            <p className="mt-1 text-white/80">
              Attempt #{attemptNumber - 1}
              {participant && ` - ${participant.firstName} ${participant.lastName}`}
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-4 py-8">
          <QuizResults
            score={result.score}
            totalQuestions={result.totalQuestions}
            scorePercentage={result.scorePercentage}
            passingScore={result.passingScore}
            passed={result.passed}
            questions={questions}
            answers={Object.entries(answers).map(([questionId, selectedAnswers]) => ({
              questionId,
              selectedAnswers,
            }))}
            correctAnswers={result.correctAnswers}
            explanations={result.explanations}
            showCorrectAnswers={quiz?.show_correct_answers ?? true}
            onRetry={!result.passed && canRetry ? handleRetry : undefined}
            onContinue={result.passed ? handleContinueToFeedback : undefined}
            canRetry={!result.passed && canRetry}
            attemptsRemaining={attemptsRemaining}
          />
        </div>
      </div>
    );
  }

  // ============================================================================
  // Render - Taking Phase
  // ============================================================================

  const currentQuestion = questions[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const unansweredCount = questions.length - answeredCount;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Quiz Header */}
      <div className="sticky top-0 z-10 border-b bg-white shadow-sm">
        <div className="mx-auto max-w-3xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-bold text-gray-900">
                {quiz?.title || 'Quiz'}
              </h1>
              <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  Pass: {quiz?.passing_score_percentage || 80}%
                </span>
                <span>
                  Q{currentQuestionIndex + 1} of {questions.length}
                </span>
              </div>
            </div>
            {timeRemainingSeconds !== null && (
              <TimerDisplay timeRemainingSeconds={timeRemainingSeconds} />
            )}
          </div>
          <div className="mt-3">
            <ProgressBar answered={answeredCount} total={questions.length} />
          </div>
        </div>
      </div>

      {/* Question Area */}
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {currentQuestion && (
          <QuizQuestion
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            selectedAnswers={answers[currentQuestion.id] || []}
            onChange={handleAnswerChange}
          />
        )}

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() =>
              setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
            }
            disabled={isFirstQuestion}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {/* Question dots/indicators */}
            <div className="hidden items-center gap-1 sm:flex">
              {questions.map((q, idx) => {
                const isAnswered =
                  answers[q.id] && answers[q.id].length > 0;
                const isCurrent = idx === currentQuestionIndex;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={cn(
                      'h-2.5 w-2.5 rounded-full transition-all',
                      isCurrent
                        ? 'h-3 w-3 bg-[#1F4D3F]'
                        : isAnswered
                          ? 'bg-[#D4AF37]'
                          : 'bg-gray-300'
                    )}
                    title={`Question ${idx + 1}${isAnswered ? ' (answered)' : ''}`}
                  />
                );
              })}
            </div>
          </div>

          {isLastQuestion ? (
            <Button
              onClick={() => setShowSubmitConfirm(true)}
              className="bg-[#D4AF37] text-[#1F4D3F] hover:bg-[#C4A030] font-semibold"
            >
              <Send className="mr-1 h-4 w-4" />
              Submit Quiz
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() =>
                setCurrentQuestionIndex((prev) =>
                  Math.min(questions.length - 1, prev + 1)
                )
              }
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Submit from any question */}
        {!isLastQuestion && answeredCount === questions.length && (
          <div className="mt-4 text-center">
            <Button
              onClick={() => setShowSubmitConfirm(true)}
              className="bg-[#D4AF37] text-[#1F4D3F] hover:bg-[#C4A030] font-semibold"
            >
              <Send className="mr-1 h-4 w-4" />
              Submit Quiz ({answeredCount}/{questions.length} answered)
            </Button>
          </div>
        )}
      </div>

      {/* Submit Confirmation Dialog */}
      <Dialog
        open={showSubmitConfirm}
        onOpenChange={setShowSubmitConfirm}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Submit Quiz?</DialogTitle>
            <DialogDescription>
              {unansweredCount > 0 ? (
                <span className="text-amber-600">
                  You have {unansweredCount} unanswered question
                  {unansweredCount !== 1 ? 's' : ''}. Are you sure you want to
                  submit?
                </span>
              ) : (
                'You have answered all questions. Ready to submit?'
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border bg-gray-50 p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Answered</span>
              <span className="font-medium">
                {answeredCount}/{questions.length}
              </span>
            </div>
            <div className="mt-1 flex justify-between">
              <span className="text-gray-500">Passing Score</span>
              <span className="font-medium">
                {quiz?.passing_score_percentage || 80}%
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSubmitConfirm(false)}
            >
              Keep Working
            </Button>
            <Button
              onClick={handleSubmitQuiz}
              className="bg-[#1F4D3F] text-white hover:bg-[#1F4D3F]/90"
            >
              Submit Quiz
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
