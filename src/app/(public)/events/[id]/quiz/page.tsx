'use client';

import { use, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { AceQuiz, AceQuizQuestion, QuizOption } from '@/lib/ace/types';

interface QuizResults {
  passed: boolean;
  score: number;
  totalQuestions: number;
  scorePercentage: number;
  passingScore: number;
  correctAnswers: Record<string, string[]>;
  explanations: Record<string, string>;
}

export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: eventId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const participantId = searchParams.get('participant_id');
  const confirmationCode = searchParams.get('code');

  const [quiz, setQuiz] = useState<AceQuiz | null>(null);
  const [questions, setQuestions] = useState<AceQuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<QuizResults | null>(null);

  useEffect(() => {
    fetchQuizData();
  }, [eventId]);

  const fetchQuizData = async () => {
    setLoading(true);
    try {
      // Fetch quiz for this event
      const quizRes = await fetch(`/api/ace/quizzes?event_id=${eventId}`);
      const quizData = await quizRes.json();

      if (!quizData.success || !quizData.data) {
        setError('Quiz not found for this event');
        return;
      }

      setQuiz(quizData.data);

      // Fetch questions (without correct answers for security)
      const questionsRes = await fetch(`/api/ace/quizzes/${quizData.data.id}/questions`);
      const questionsData = await questionsRes.json();

      if (questionsData.success) {
        // Shuffle questions if required
        let processedQuestions = questionsData.data;
        if (quizData.data.shuffle_questions) {
          processedQuestions = shuffleArray([...questionsData.data]);
        }
        setQuestions(processedQuestions);
      }
    } catch (err) {
      setError('Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleSelectAnswer = (questionId: string, optionId: string, questionType: string) => {
    if (questionType === 'multiple_select') {
      const current = answers[questionId] || [];
      if (current.includes(optionId)) {
        setAnswers({
          ...answers,
          [questionId]: current.filter(id => id !== optionId),
        });
      } else {
        setAnswers({
          ...answers,
          [questionId]: [...current, optionId],
        });
      }
    } else {
      setAnswers({
        ...answers,
        [questionId]: [optionId],
      });
    }
  };

  const handleSubmit = async () => {
    if (!quiz || !participantId) {
      setError('Missing quiz or participant information');
      return;
    }

    // Check if all questions are answered
    const unanswered = questions.filter(q => !answers[q.id] || answers[q.id].length === 0);
    if (unanswered.length > 0) {
      if (!confirm(`You have ${unanswered.length} unanswered question(s). Submit anyway?`)) {
        return;
      }
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/ace/quizzes/${quiz.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participant_id: participantId,
          answers,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setResults(data);
      } else {
        setError(data.error || 'Failed to submit quiz');
      }
    } catch (err) {
      setError('Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const getAnsweredCount = () => {
    return questions.filter(q => answers[q.id] && answers[q.id].length > 0).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Error</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <Link href={`/events/${eventId}`}>
            <Button variant="outline">Back to Event</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (!participantId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Access Required</h2>
          <p className="text-slate-600 mb-6">
            Please access this quiz from your event confirmation email or participant dashboard.
          </p>
          <Link href={`/events/${eventId}`}>
            <Button variant="outline">Back to Event</Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Results View
  if (results) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="p-8">
            <div className="text-center mb-8">
              {results.passed ? (
                <>
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h1 className="text-3xl font-bold text-green-700 mb-2">Congratulations!</h1>
                  <p className="text-lg text-slate-600">You passed the quiz!</p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle className="w-10 h-10 text-red-600" />
                  </div>
                  <h1 className="text-3xl font-bold text-red-700 mb-2">Not Quite</h1>
                  <p className="text-lg text-slate-600">You need to retake the quiz.</p>
                </>
              )}
            </div>

            <div className="bg-slate-100 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-slate-900">{results.score}</p>
                  <p className="text-sm text-slate-500">Correct</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900">{results.totalQuestions}</p>
                  <p className="text-sm text-slate-500">Total</p>
                </div>
                <div>
                  <p className={`text-3xl font-bold ${results.passed ? 'text-green-600' : 'text-red-600'}`}>
                    {results.scorePercentage}%
                  </p>
                  <p className="text-sm text-slate-500">Score (need {results.passingScore}%)</p>
                </div>
              </div>
            </div>

            {/* Show answers review */}
            {quiz?.show_correct_answers && (
              <div className="space-y-6 mb-8">
                <h2 className="text-xl font-semibold text-slate-900">Review Your Answers</h2>
                {questions.map((question, index) => {
                  const userAnswer = answers[question.id] || [];
                  const correctAnswer = results.correctAnswers[question.id] || [];
                  const isCorrect = 
                    userAnswer.length === correctAnswer.length &&
                    userAnswer.every(a => correctAnswer.includes(a));

                  return (
                    <div
                      key={question.id}
                      className={`p-4 rounded-lg border-2 ${
                        isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600 mt-1" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 mb-2">
                            {index + 1}. {question.question_text}
                          </p>
                          <div className="space-y-1 text-sm">
                            {question.options.map((option: QuizOption) => (
                              <div
                                key={option.id}
                                className={`px-3 py-1.5 rounded ${
                                  correctAnswer.includes(option.id)
                                    ? 'bg-green-100 text-green-800 font-medium'
                                    : userAnswer.includes(option.id) && !correctAnswer.includes(option.id)
                                    ? 'bg-red-100 text-red-800'
                                    : 'text-slate-600'
                                }`}
                              >
                                {option.text}
                                {correctAnswer.includes(option.id) && ' ✓'}
                              </div>
                            ))}
                          </div>
                          {results.explanations[question.id] && (
                            <p className="mt-2 text-sm text-slate-700 italic">
                              {results.explanations[question.id]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex gap-4">
              {results.passed ? (
                <Link href={`/events/${eventId}/certificate?participant_id=${participantId}`} className="flex-1">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    Get Your Certificate
                  </Button>
                </Link>
              ) : (
                <Button onClick={() => {
                  setResults(null);
                  setAnswers({});
                  setCurrentQuestion(0);
                }} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Retake Quiz
                </Button>
              )}
              <Link href={`/events/${eventId}`}>
                <Button variant="outline">Back to Event</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href={`/events/${eventId}`} className="text-slate-600 hover:text-slate-900">
            ← Back to Event
          </Link>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span>{getAnsweredCount()} of {questions.length} answered</span>
            {quiz?.time_limit_minutes && (
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {quiz.time_limit_minutes} min limit
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-slate-200 rounded-full mb-8">
          <div
            className="h-2 bg-emerald-600 rounded-full transition-all"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question Card */}
        {question && (
          <Card className="p-8 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-slate-100 rounded-full text-sm font-medium text-slate-700">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="px-3 py-1 bg-blue-100 rounded-full text-sm font-medium text-blue-700">
                {question.question_type.replace('_', ' ')}
              </span>
            </div>

            <h2 className="text-xl font-semibold text-slate-900 mb-6">
              {question.question_text}
            </h2>

            <div className="space-y-3">
              {question.options.map((option: QuizOption) => {
                const isSelected = (answers[question.id] || []).includes(option.id);
                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectAnswer(question.id, option.id, question.question_type)}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : 'border-slate-300 text-slate-500'
                      }`}>
                        {question.question_type === 'multiple_select' ? (
                          isSelected ? '✓' : ''
                        ) : (
                          option.id.toUpperCase()
                        )}
                      </span>
                      <span>{option.text}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {question.question_type === 'multiple_select' && (
              <p className="text-sm text-slate-500 mt-4">
                Select all that apply
              </p>
            )}
          </Card>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          {/* Question Dots */}
          <div className="flex gap-1">
            {questions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestion(i)}
                className={`w-3 h-3 rounded-full transition ${
                  i === currentQuestion
                    ? 'bg-emerald-600'
                    : answers[q.id]?.length > 0
                    ? 'bg-emerald-300'
                    : 'bg-slate-300'
                }`}
              />
            ))}
          </div>

          {currentQuestion === questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
