'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import {
  FileQuestion,
  ArrowLeft,
  AlertCircle,
  Plus,
  CheckCircle2,
} from 'lucide-react';

interface EventOption {
  _id: string;
  title: string;
  totalCeus: number;
  ceCategory: string;
  modality: string;
  status: string;
  startDate: number;
  hasQuiz?: boolean;
}

interface QuizFormData {
  title: string;
  description: string;
  passing_score_percentage: number;
  max_attempts: number | null;
  time_limit_minutes: number | null;
  shuffle_questions: boolean;
  show_correct_answers: boolean;
  is_required: boolean;
}

const DEFAULT_FORM: QuizFormData = {
  title: '',
  description: '',
  passing_score_percentage: 80,
  max_attempts: null,
  time_limit_minutes: null,
  shuffle_questions: true,
  show_correct_answers: true,
  is_required: true,
};

export default function CreateQuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedEventId = searchParams.get('event_id');

  // State
  const [events, setEvents] = useState<EventOption[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<string>(
    preselectedEventId || ''
  );
  const [form, setForm] = useState<QuizFormData>(DEFAULT_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch events without quizzes
  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoadingEvents(true);

        // Try fetching events that don't already have quizzes
        const res = await fetch('/api/ace/events?include_all=true');

        if (!res.ok) {
          // Fallback: try the public endpoint
          const publicRes = await fetch('/api/ace/quizzes?list_all=true');
          if (publicRes.ok) {
            const data = await publicRes.json();
            const eventsList = (data.events || data.data || []).filter(
              (e: any) => !e.quiz
            );
            setEvents(eventsList);
            return;
          }
          return;
        }

        const data = await res.json();
        const allEvents = data.events || data.data || [];

        // Check each event for existing quiz
        const eventsWithStatus: EventOption[] = await Promise.all(
          allEvents.map(async (event: any) => {
            try {
              const quizRes = await fetch(
                `/api/ace/quizzes?event_id=${event._id}`
              );
              const quizData = await quizRes.json();
              return {
                _id: event._id,
                title: event.title,
                totalCeus: event.totalCeus || event.total_ceus,
                ceCategory: event.ceCategory || event.ce_category,
                modality: event.modality,
                status: event.status,
                startDate: event.startDate || event.start_date,
                hasQuiz: !!quizData.data,
              };
            } catch {
              return {
                _id: event._id,
                title: event.title,
                totalCeus: event.totalCeus || event.total_ceus,
                ceCategory: event.ceCategory || event.ce_category,
                modality: event.modality,
                status: event.status,
                startDate: event.startDate || event.start_date,
                hasQuiz: false,
              };
            }
          })
        );

        setEvents(eventsWithStatus);
      } catch (err) {
        // Silently fail - events list will be empty
      } finally {
        setLoadingEvents(false);
      }
    }

    fetchEvents();
  }, []);

  // Auto-set quiz title based on selected event
  useEffect(() => {
    if (selectedEventId) {
      const event = events.find((e) => e._id === selectedEventId);
      if (event && !form.title) {
        setForm((prev) => ({
          ...prev,
          title: `${event.title} - Assessment`,
        }));
      }
    }
  }, [selectedEventId, events, form.title]);

  const handleSubmit = async () => {
    if (!selectedEventId) {
      setError('Please select an event.');
      return;
    }
    if (!form.title.trim()) {
      setError('Please enter a quiz title.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const res = await fetch('/api/ace/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: selectedEventId,
          title: form.title,
          description: form.description || undefined,
          passing_score_percentage: form.passing_score_percentage,
          max_attempts: form.max_attempts || undefined,
          time_limit_minutes: form.time_limit_minutes || undefined,
          randomize_questions: form.shuffle_questions,
          show_correct_answers_after_submission: form.show_correct_answers,
          is_required: form.is_required,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create quiz');
      }

      setSuccess(true);

      // Redirect to quiz detail page to add questions
      const quizId = data.data?.id || data.data?._id;
      if (quizId) {
        setTimeout(() => {
          router.push(`/ace/quizzes/${quizId}`);
        }, 1000);
      } else {
        setTimeout(() => {
          router.push('/ace/quizzes');
        }, 1000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const availableEvents = events.filter((e) => !e.hasQuiz);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1F4D3F] text-white">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 text-green-100 hover:text-white hover:bg-white/10"
            onClick={() => router.push('/ace/quizzes')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Quizzes
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Create Quiz</h1>
          <p className="mt-2 text-green-100">
            Set up a new quiz for a continuing education event
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Success State */}
        {success && (
          <Card className="mb-6 border-emerald-300 bg-emerald-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="font-medium text-emerald-800">
                    Quiz created successfully!
                  </p>
                  <p className="text-sm text-emerald-700">
                    Redirecting to quiz management to add questions...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Event Selector */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileQuestion className="h-5 w-5 text-[#1F4D3F]" />
              Select Event
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingEvents ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 rounded-lg" />
                ))}
              </div>
            ) : availableEvents.length === 0 ? (
              <div className="text-center py-8">
                <FileQuestion className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                <p className="font-medium text-gray-600">
                  No events available
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  All events already have quizzes, or no events exist yet.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {availableEvents.map((event) => (
                  <button
                    key={event._id}
                    onClick={() => setSelectedEventId(event._id)}
                    className={`w-full rounded-lg border p-4 text-left transition-colors ${
                      selectedEventId === event._id
                        ? 'border-[#1F4D3F] bg-[#1F4D3F]/5 ring-1 ring-[#1F4D3F]'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {event.title}
                        </p>
                        <p className="mt-0.5 text-sm text-gray-500">
                          {event.totalCeus} CEU{event.totalCeus !== 1 ? 's' : ''}{' '}
                          &middot; {event.ceCategory} &middot;{' '}
                          {event.modality?.replace('_', ' ')}
                        </p>
                      </div>
                      {selectedEventId === event._id && (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-[#1F4D3F]" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quiz Configuration */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Quiz Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="quiz-title">Title</Label>
              <Input
                id="quiz-title"
                placeholder="e.g., Ethics in ABA Practice - Assessment"
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="quiz-description">
                Description{' '}
                <span className="text-xs text-gray-400">(optional)</span>
              </Label>
              <textarea
                id="quiz-description"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Briefly describe what this quiz covers..."
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>

            {/* Passing Score */}
            <div className="space-y-2">
              <Label htmlFor="passing-score">
                Passing Score Percentage
              </Label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  id="passing-score"
                  min={50}
                  max={100}
                  step={5}
                  value={form.passing_score_percentage}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      passing_score_percentage: parseInt(e.target.value),
                    }))
                  }
                  className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200 accent-[#1F4D3F]"
                />
                <div className="flex w-16 items-center justify-center rounded-md border bg-white px-2 py-1 text-sm font-medium">
                  {form.passing_score_percentage}%
                </div>
              </div>
              <p className="text-xs text-gray-400">
                BACB recommends 80% for CE assessments
              </p>
            </div>

            {/* Max Attempts */}
            <div className="space-y-2">
              <Label htmlFor="max-attempts">
                Max Attempts{' '}
                <span className="text-xs text-gray-400">
                  (leave empty for unlimited)
                </span>
              </Label>
              <Input
                id="max-attempts"
                type="number"
                min={1}
                max={10}
                placeholder="Unlimited"
                value={form.max_attempts ?? ''}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    max_attempts: e.target.value
                      ? parseInt(e.target.value)
                      : null,
                  }))
                }
                className="w-32"
              />
            </div>

            {/* Time Limit */}
            <div className="space-y-2">
              <Label htmlFor="time-limit">
                Time Limit (minutes){' '}
                <span className="text-xs text-gray-400">
                  (leave empty for no limit)
                </span>
              </Label>
              <Input
                id="time-limit"
                type="number"
                min={5}
                max={180}
                placeholder="No limit"
                value={form.time_limit_minutes ?? ''}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    time_limit_minutes: e.target.value
                      ? parseInt(e.target.value)
                      : null,
                  }))
                }
                className="w-32"
              />
            </div>

            {/* Toggles */}
            <div className="space-y-4 rounded-lg border bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Shuffle Questions</Label>
                  <p className="text-xs text-gray-500">
                    Randomize question order for each attempt
                  </p>
                </div>
                <Switch
                  checked={form.shuffle_questions}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      shuffle_questions: checked,
                    }))
                  }
                />
              </div>
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Correct Answers After Submission</Label>
                    <p className="text-xs text-gray-500">
                      Display correct answers and explanations after completing
                    </p>
                  </div>
                  <Switch
                    checked={form.show_correct_answers}
                    onCheckedChange={(checked) =>
                      setForm((prev) => ({
                        ...prev,
                        show_correct_answers: checked,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Required for Certificate</Label>
                    <p className="text-xs text-gray-500">
                      Participants must pass this quiz to receive their CE
                      certificate
                    </p>
                  </div>
                  <Switch
                    checked={form.is_required}
                    onCheckedChange={(checked) =>
                      setForm((prev) => ({
                        ...prev,
                        is_required: checked,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => router.push('/ace/quizzes')}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || !selectedEventId || !form.title.trim()}
            className="bg-[#1F4D3F] text-white hover:bg-[#1F4D3F]/90"
          >
            {submitting ? (
              'Creating...'
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create Quiz
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
