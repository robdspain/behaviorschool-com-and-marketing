'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import {
  FileQuestion,
  Plus,
  Trash2,
  Edit3,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Target,
  Shuffle,
  Eye,
  Users,
  ArrowLeft,
  Settings,
  ClipboardList,
  Award,
  Copy,
  ExternalLink,
} from 'lucide-react';
import type { AceQuiz, AceQuizQuestion, QuizOption } from '@/lib/ace/types';

// ============================================================================
// Types
// ============================================================================

interface QuizWithDetails extends AceQuiz {
  event_title?: string;
  event_ceus?: number;
  minimum_questions_required?: number;
}

interface QuizSubmission {
  _id: string;
  participantId: string;
  participantName?: string;
  participantEmail?: string;
  attemptNumber: number;
  score: number;
  totalQuestions: number;
  scorePercentage: number;
  passed: boolean;
  submittedAt: number;
}

type QuestionType = 'multiple_choice' | 'true_false' | 'multiple_select';

interface QuestionFormData {
  question_text: string;
  question_type: QuestionType;
  options: QuizOption[];
  correct_answers: string[];
  explanation: string;
  points: number;
}

// ============================================================================
// Helper Components
// ============================================================================

function PageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-[300px]" />
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-[400px] rounded-lg" />
    </div>
  );
}

function generateId(): string {
  return `opt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

const DEFAULT_QUESTION_FORM: QuestionFormData = {
  question_text: '',
  question_type: 'multiple_choice',
  options: [
    { id: generateId(), text: '' },
    { id: generateId(), text: '' },
    { id: generateId(), text: '' },
    { id: generateId(), text: '' },
  ],
  correct_answers: [],
  explanation: '',
  points: 1,
};

// ============================================================================
// Main Component
// ============================================================================

export default function QuizDetailPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;

  // State
  const [quiz, setQuiz] = useState<QuizWithDetails | null>(null);
  const [questions, setQuestions] = useState<AceQuizQuestion[]>([]);
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('questions');

  // Question form state
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<AceQuizQuestion | null>(null);
  const [questionForm, setQuestionForm] = useState<QuestionFormData>(DEFAULT_QUESTION_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ============================================================================
  // Data Fetching
  // ============================================================================

  const fetchQuizData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch quiz details
      const quizRes = await fetch(`/api/ace/quizzes/${quizId || ''}?get_details=true`);
      if (quizRes.ok) {
        const quizData = await quizRes.json();
        if (quizData.data) {
          setQuiz(quizData.data);
        }
      }

      // Fetch questions
      const questionsRes = await fetch(`/api/ace/quizzes/${quizId}/questions`);
      if (questionsRes.ok) {
        const questionsData = await questionsRes.json();
        const sorted = (questionsData.data || []).sort(
          (a: AceQuizQuestion, b: AceQuizQuestion) =>
            (a.order_index || 0) - (b.order_index || 0)
        );
        setQuestions(sorted);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quiz');
    } finally {
      setLoading(false);
    }
  }, [quizId]);

  useEffect(() => {
    if (quizId) {
      fetchQuizData();
    }
  }, [quizId, fetchQuizData]);

  // ============================================================================
  // Question Form Handlers
  // ============================================================================

  const resetQuestionForm = () => {
    setQuestionForm({
      ...DEFAULT_QUESTION_FORM,
      options: [
        { id: generateId(), text: '' },
        { id: generateId(), text: '' },
        { id: generateId(), text: '' },
        { id: generateId(), text: '' },
      ],
    });
    setEditingQuestion(null);
    setShowQuestionForm(false);
  };

  const openAddQuestion = () => {
    resetQuestionForm();
    setShowQuestionForm(true);
  };

  const openEditQuestion = (question: AceQuizQuestion) => {
    setEditingQuestion(question);
    setQuestionForm({
      question_text: question.question_text,
      question_type: question.question_type,
      options: question.options.length > 0 ? question.options : DEFAULT_QUESTION_FORM.options,
      correct_answers: [...question.correct_answers],
      explanation: question.explanation || '',
      points: question.points,
    });
    setShowQuestionForm(true);
  };

  const handleTypeChange = (newType: QuestionType) => {
    if (newType === 'true_false') {
      setQuestionForm((prev) => ({
        ...prev,
        question_type: newType,
        options: [
          { id: 'true', text: 'True' },
          { id: 'false', text: 'False' },
        ],
        correct_answers: [],
      }));
    } else {
      setQuestionForm((prev) => ({
        ...prev,
        question_type: newType,
        options:
          prev.question_type === 'true_false'
            ? [
                { id: generateId(), text: '' },
                { id: generateId(), text: '' },
                { id: generateId(), text: '' },
                { id: generateId(), text: '' },
              ]
            : prev.options,
        correct_answers:
          newType === 'multiple_choice' && prev.correct_answers.length > 1
            ? [prev.correct_answers[0]]
            : prev.correct_answers,
      }));
    }
  };

  const addOption = () => {
    setQuestionForm((prev) => ({
      ...prev,
      options: [...prev.options, { id: generateId(), text: '' }],
    }));
  };

  const removeOption = (optionId: string) => {
    setQuestionForm((prev) => ({
      ...prev,
      options: prev.options.filter((o) => o.id !== optionId),
      correct_answers: prev.correct_answers.filter((a) => a !== optionId),
    }));
  };

  const updateOptionText = (optionId: string, text: string) => {
    setQuestionForm((prev) => ({
      ...prev,
      options: prev.options.map((o) => (o.id === optionId ? { ...o, text } : o)),
    }));
  };

  const toggleCorrectAnswer = (optionId: string) => {
    setQuestionForm((prev) => {
      if (prev.question_type === 'multiple_select') {
        // Toggle for multi-select
        const current = [...prev.correct_answers];
        const idx = current.indexOf(optionId);
        if (idx === -1) {
          current.push(optionId);
        } else {
          current.splice(idx, 1);
        }
        return { ...prev, correct_answers: current };
      } else {
        // Single select
        return { ...prev, correct_answers: [optionId] };
      }
    });
  };

  const handleSaveQuestion = async () => {
    // Validate
    if (!questionForm.question_text.trim()) {
      alert('Please enter a question text.');
      return;
    }
    if (questionForm.question_type !== 'true_false') {
      const filledOptions = questionForm.options.filter((o) => o.text.trim());
      if (filledOptions.length < 2) {
        alert('Please provide at least 2 options.');
        return;
      }
    }
    if (questionForm.correct_answers.length === 0) {
      alert('Please select at least one correct answer.');
      return;
    }

    try {
      setSubmitting(true);

      // Filter out empty options for non-true/false questions
      const cleanOptions =
        questionForm.question_type === 'true_false'
          ? questionForm.options
          : questionForm.options.filter((o) => o.text.trim());

      if (editingQuestion) {
        // For editing: delete old and add new (since there's no update endpoint)
        await fetch(
          `/api/ace/quizzes/${quizId}/questions?question_id=${editingQuestion.id}`,
          { method: 'DELETE' }
        );
      }

      const response = await fetch(`/api/ace/quizzes/${quizId}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_text: questionForm.question_text,
          question_type: questionForm.question_type,
          options: cleanOptions,
          correct_answers: questionForm.correct_answers,
          explanation: questionForm.explanation || undefined,
          points: questionForm.points,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save question');
      }

      resetQuestionForm();
      await fetchQuizData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save question');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      setDeleting(true);
      const response = await fetch(
        `/api/ace/quizzes/${quizId}/questions?question_id=${questionId}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        throw new Error('Failed to delete question');
      }

      setDeleteConfirmId(null);
      await fetchQuizData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete question');
    } finally {
      setDeleting(false);
    }
  };

  // ============================================================================
  // Render
  // ============================================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-[#1F4D3F] text-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Skeleton className="h-8 w-[300px] bg-white/20" />
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <PageSkeleton />
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-[#1F4D3F] text-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold">Quiz Not Found</h1>
          </div>
        </div>
        <div className="mx-auto max-w-5xl px-4 py-8">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
                <div>
                  <p className="font-medium text-red-800">
                    {error || 'Quiz not found'}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => router.push('/ace/quizzes')}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Quizzes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const minRequired = quiz.minimum_questions_required || 0;
  const belowMinimum = minRequired > 0 && questions.length < minRequired;
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1F4D3F] text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 text-green-100 hover:text-white hover:bg-white/10"
            onClick={() => router.push('/ace/quizzes')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Quizzes
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{quiz.title}</h1>
              {quiz.event_title && (
                <p className="mt-1 text-green-100">
                  Event: {quiz.event_title}
                  {quiz.event_ceus ? ` (${quiz.event_ceus} CEUs)` : ''}
                </p>
              )}
              {quiz.description && (
                <p className="mt-2 text-sm text-green-200">{quiz.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-white/30 text-white hover:bg-white/10"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/ace/quizzes/${quizId}/take`
                  );
                }}
              >
                <Copy className="mr-2 h-3.5 w-3.5" />
                Copy Take Link
              </Button>
              <Button
                size="sm"
                className="bg-[#D4AF37] text-[#1F4D3F] hover:bg-[#C4A030]"
                onClick={() =>
                  window.open(`/ace/quizzes/${quizId}/take`, '_blank')
                }
              >
                <ExternalLink className="mr-2 h-3.5 w-3.5" />
                Preview Quiz
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Quiz Settings Cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="mx-auto mb-2 h-5 w-5 text-[#1F4D3F]" />
              <p className="text-xs text-gray-500">Passing Score</p>
              <p className="text-lg font-bold text-[#1F4D3F]">
                {quiz.passing_score_percentage}%
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <FileQuestion className="mx-auto mb-2 h-5 w-5 text-[#1F4D3F]" />
              <p className="text-xs text-gray-500">Questions</p>
              <p className={`text-lg font-bold ${belowMinimum ? 'text-red-600' : 'text-[#1F4D3F]'}`}>
                {questions.length}
                {minRequired > 0 && (
                  <span className="text-xs font-normal text-gray-400">
                    /{minRequired}
                  </span>
                )}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Award className="mx-auto mb-2 h-5 w-5 text-[#1F4D3F]" />
              <p className="text-xs text-gray-500">Total Points</p>
              <p className="text-lg font-bold text-[#1F4D3F]">{totalPoints}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="mx-auto mb-2 h-5 w-5 text-[#1F4D3F]" />
              <p className="text-xs text-gray-500">Time Limit</p>
              <p className="text-lg font-bold text-[#1F4D3F]">
                {quiz.time_limit_minutes ? `${quiz.time_limit_minutes}m` : 'None'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Shuffle className="mx-auto mb-2 h-5 w-5 text-[#1F4D3F]" />
              <p className="text-xs text-gray-500">Shuffle</p>
              <p className="text-lg font-bold text-[#1F4D3F]">
                {quiz.shuffle_questions ? 'Yes' : 'No'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Eye className="mx-auto mb-2 h-5 w-5 text-[#1F4D3F]" />
              <p className="text-xs text-gray-500">Max Attempts</p>
              <p className="text-lg font-bold text-[#1F4D3F]">
                {quiz.max_attempts || 'Unlimited'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Warning if below minimum questions */}
        {belowMinimum && (
          <Card className="mb-6 border-amber-300 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
                <div>
                  <p className="font-medium text-amber-800">
                    Below Minimum Question Requirement
                  </p>
                  <p className="text-sm text-amber-700">
                    This quiz has {questions.length} question{questions.length !== 1 ? 's' : ''} but
                    requires at least {minRequired} (3 per CEU). Add{' '}
                    {minRequired - questions.length} more question
                    {minRequired - questions.length !== 1 ? 's' : ''}.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="questions">
              <ClipboardList className="mr-1.5 h-4 w-4" />
              Questions ({questions.length})
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="mr-1.5 h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="submissions">
              <Users className="mr-1.5 h-4 w-4" />
              Submissions
            </TabsTrigger>
          </TabsList>

          {/* Questions Tab */}
          <TabsContent value="questions" className="mt-6">
            <div className="space-y-4">
              {/* Add Question Button */}
              <div className="flex justify-end">
                <Button
                  onClick={openAddQuestion}
                  className="bg-[#1F4D3F] text-white hover:bg-[#1F4D3F]/90"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Question
                </Button>
              </div>

              {/* Questions List */}
              {questions.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <FileQuestion className="mb-4 h-12 w-12 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-600">No questions yet</h3>
                    <p className="mt-1 text-sm text-gray-400">
                      Add questions to this quiz for participants to answer.
                    </p>
                    <Button
                      onClick={openAddQuestion}
                      className="mt-4 bg-[#1F4D3F] text-white hover:bg-[#1F4D3F]/90"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Question
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                questions.map((question, index) => (
                  <Card key={question.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex items-start gap-4 p-4">
                        {/* Question Number */}
                        <div className="flex shrink-0 flex-col items-center gap-1">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1F4D3F]/10 text-sm font-bold text-[#1F4D3F]">
                            {index + 1}
                          </span>
                          <div className="flex flex-col gap-0.5">
                            <button
                              className="rounded p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30"
                              disabled={index === 0}
                              title="Move up"
                            >
                              <ChevronUp className="h-3.5 w-3.5" />
                            </button>
                            <button
                              className="rounded p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30"
                              disabled={index === questions.length - 1}
                              title="Move down"
                            >
                              <ChevronDown className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Question Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2">
                            <p className="flex-1 font-medium text-gray-900">
                              {question.question_text}
                            </p>
                            <div className="flex shrink-0 items-center gap-1">
                              <Badge variant="outline" className="text-xs">
                                {question.question_type === 'multiple_choice'
                                  ? 'Multiple Choice'
                                  : question.question_type === 'true_false'
                                    ? 'True/False'
                                    : 'Multi-Select'}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {question.points} pt{question.points !== 1 ? 's' : ''}
                              </Badge>
                            </div>
                          </div>

                          {/* Options */}
                          <div className="mt-3 space-y-1.5">
                            {(question.question_type === 'true_false'
                              ? [
                                  { id: 'true', text: 'True' },
                                  { id: 'false', text: 'False' },
                                ]
                              : question.options
                            ).map((option) => {
                              const isCorrect = question.correct_answers.includes(option.id);
                              return (
                                <div
                                  key={option.id}
                                  className={`flex items-center gap-2 rounded px-2.5 py-1.5 text-sm ${
                                    isCorrect
                                      ? 'bg-emerald-50 text-emerald-800'
                                      : 'bg-gray-50 text-gray-600'
                                  }`}
                                >
                                  {isCorrect ? (
                                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                                  ) : (
                                    <XCircle className="h-3.5 w-3.5 shrink-0 text-gray-300" />
                                  )}
                                  <span>{option.text}</span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Explanation */}
                          {question.explanation && (
                            <div className="mt-2 rounded border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-700">
                              <span className="font-medium">Explanation:</span>{' '}
                              {question.explanation}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex shrink-0 flex-col gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-gray-400 hover:text-[#1F4D3F]"
                            onClick={() => openEditQuestion(question)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
                            onClick={() => setDeleteConfirmId(question.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Quiz Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <Label className="text-sm text-gray-500">Title</Label>
                    <p className="mt-1 font-medium">{quiz.title}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Description</Label>
                    <p className="mt-1 font-medium">{quiz.description || 'No description'}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Passing Score</Label>
                    <p className="mt-1 font-medium">{quiz.passing_score_percentage}%</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Max Attempts</Label>
                    <p className="mt-1 font-medium">{quiz.max_attempts || 'Unlimited'}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Time Limit</Label>
                    <p className="mt-1 font-medium">
                      {quiz.time_limit_minutes
                        ? `${quiz.time_limit_minutes} minutes`
                        : 'No time limit'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Shuffle Questions</Label>
                    <p className="mt-1 font-medium">
                      {quiz.shuffle_questions ? 'Yes' : 'No'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Show Correct Answers</Label>
                    <p className="mt-1 font-medium">
                      {quiz.show_correct_answers ? 'Yes' : 'No'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Required for Certificate</Label>
                    <p className="mt-1 font-medium">
                      {quiz.is_required ? 'Yes' : 'No'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Status</Label>
                    <div className="mt-1">
                      <Badge
                        className={
                          quiz.is_active
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : 'bg-gray-100 text-gray-600 border-gray-200'
                        }
                      >
                        {quiz.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Submissions Tab */}
          <TabsContent value="submissions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Quiz Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                {submissions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Users className="mb-4 h-12 w-12 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-600">
                      No submissions yet
                    </h3>
                    <p className="mt-1 text-sm text-gray-400">
                      Submissions will appear here once participants take the quiz.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b text-left text-sm font-medium text-gray-500">
                          <th className="pb-3 pr-4">Participant</th>
                          <th className="pb-3 pr-4">Attempt</th>
                          <th className="pb-3 pr-4">Score</th>
                          <th className="pb-3 pr-4">Percentage</th>
                          <th className="pb-3 pr-4">Result</th>
                          <th className="pb-3 pr-4">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {submissions.map((sub) => (
                          <tr
                            key={sub._id}
                            className="border-b last:border-0"
                          >
                            <td className="py-3 pr-4">
                              <p className="text-sm font-medium">
                                {sub.participantName || 'Unknown'}
                              </p>
                              {sub.participantEmail && (
                                <p className="text-xs text-gray-500">
                                  {sub.participantEmail}
                                </p>
                              )}
                            </td>
                            <td className="py-3 pr-4 text-sm">
                              #{sub.attemptNumber}
                            </td>
                            <td className="py-3 pr-4 text-sm font-medium">
                              {sub.score}/{sub.totalQuestions}
                            </td>
                            <td className="py-3 pr-4 text-sm">
                              {sub.scorePercentage}%
                            </td>
                            <td className="py-3 pr-4">
                              <Badge
                                className={
                                  sub.passed
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                    : 'bg-red-100 text-red-800 border-red-200'
                                }
                              >
                                {sub.passed ? 'Passed' : 'Failed'}
                              </Badge>
                            </td>
                            <td className="py-3 pr-4 text-sm text-gray-500">
                              {new Date(sub.submittedAt).toLocaleDateString(
                                'en-US',
                                {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                  hour: 'numeric',
                                  minute: '2-digit',
                                }
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add/Edit Question Dialog */}
      <Dialog open={showQuestionForm} onOpenChange={(open) => !open && resetQuestionForm()}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingQuestion ? 'Edit Question' : 'Add Question'}
            </DialogTitle>
            <DialogDescription>
              {editingQuestion
                ? 'Update the question details below.'
                : 'Fill in the question details below.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Question Type */}
            <div className="space-y-2">
              <Label>Question Type</Label>
              <div className="flex gap-2">
                {(
                  [
                    { value: 'multiple_choice', label: 'Multiple Choice' },
                    { value: 'true_false', label: 'True / False' },
                    { value: 'multiple_select', label: 'Multi-Select' },
                  ] as const
                ).map((type) => (
                  <button
                    key={type.value}
                    onClick={() => handleTypeChange(type.value)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      questionForm.question_type === type.value
                        ? 'border-[#1F4D3F] bg-[#1F4D3F]/5 text-[#1F4D3F]'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-2">
              <Label htmlFor="question-text">Question Text</Label>
              <textarea
                id="question-text"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Enter your question here..."
                value={questionForm.question_text}
                onChange={(e) =>
                  setQuestionForm((prev) => ({
                    ...prev,
                    question_text: e.target.value,
                  }))
                }
              />
            </div>

            {/* Options */}
            <div className="space-y-2">
              <Label>
                Options{' '}
                <span className="text-xs text-gray-400">
                  ({questionForm.question_type === 'multiple_select'
                    ? 'check all correct answers'
                    : 'select the correct answer'})
                </span>
              </Label>
              <div className="space-y-2">
                {questionForm.options.map((option, idx) => {
                  const isCorrect = questionForm.correct_answers.includes(option.id);
                  const isTrueFalse = questionForm.question_type === 'true_false';
                  return (
                    <div key={option.id} className="flex items-center gap-2">
                      {/* Correct answer toggle */}
                      <button
                        type="button"
                        onClick={() => toggleCorrectAnswer(option.id)}
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                          isCorrect
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : 'border-gray-300 text-gray-300 hover:border-gray-400'
                        }`}
                        title={isCorrect ? 'Correct answer' : 'Mark as correct'}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </button>

                      {/* Option text */}
                      {isTrueFalse ? (
                        <div className="flex-1 rounded-md border bg-gray-50 px-3 py-2 text-sm">
                          {option.text}
                        </div>
                      ) : (
                        <Input
                          placeholder={`Option ${idx + 1}`}
                          value={option.text}
                          onChange={(e) =>
                            updateOptionText(option.id, e.target.value)
                          }
                          className="flex-1"
                        />
                      )}

                      {/* Remove option */}
                      {!isTrueFalse && questionForm.options.length > 2 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 shrink-0 p-0 text-gray-400 hover:text-red-600"
                          onClick={() => removeOption(option.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Add option */}
              {questionForm.question_type !== 'true_false' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                  className="mt-2"
                >
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  Add Option
                </Button>
              )}
            </div>

            {/* Explanation */}
            <div className="space-y-2">
              <Label htmlFor="explanation">
                Explanation{' '}
                <span className="text-xs text-gray-400">(optional)</span>
              </Label>
              <textarea
                id="explanation"
                className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Explain why the correct answer is correct..."
                value={questionForm.explanation}
                onChange={(e) =>
                  setQuestionForm((prev) => ({
                    ...prev,
                    explanation: e.target.value,
                  }))
                }
              />
            </div>

            {/* Points */}
            <div className="space-y-2">
              <Label htmlFor="points">Points</Label>
              <Input
                id="points"
                type="number"
                min={1}
                max={100}
                value={questionForm.points}
                onChange={(e) =>
                  setQuestionForm((prev) => ({
                    ...prev,
                    points: parseInt(e.target.value) || 1,
                  }))
                }
                className="w-24"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={resetQuestionForm}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveQuestion}
              disabled={submitting}
              className="bg-[#1F4D3F] text-white hover:bg-[#1F4D3F]/90"
            >
              {submitting
                ? 'Saving...'
                : editingQuestion
                  ? 'Update Question'
                  : 'Add Question'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteConfirmId}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Question</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this question? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmId && handleDeleteQuestion(deleteConfirmId)}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
