'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  FileQuestion,
  Plus,
  Search,
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  Users,
  Filter,
} from 'lucide-react';

interface EventWithQuizStatus {
  _id: string;
  title: string;
  totalCeus: number;
  ceCategory: string;
  modality: string;
  status: string;
  startDate: number;
  minimumQuestionsRequired?: number;
  actualQuestionsCount?: number;
  quiz?: {
    _id: string;
    title: string;
    passingScorePercentage: number;
    isActive: boolean;
  } | null;
  submissionCount?: number;
}

type FilterMode = 'all' | 'with_quiz' | 'without_quiz';

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 border-b p-4 last:border-0">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-3 w-[180px]" />
          </div>
          <Skeleton className="h-6 w-[80px] rounded-full" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      ))}
    </div>
  );
}

export default function QuizManagementPage() {
  const router = useRouter();
  const [events, setEvents] = useState<EventWithQuizStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');

  useEffect(() => {
    async function fetchEventsWithQuizzes() {
      try {
        setLoading(true);
        // Fetch all events
        const eventsResponse = await fetch('/api/ace/quizzes?list_all=true');
        const eventsData = await eventsResponse.json();

        if (!eventsResponse.ok) {
          // Fallback: fetch events from the public endpoint and check quizzes
          const publicResponse = await fetch('/api/ace/events?include_all=true');
          if (publicResponse.ok) {
            const publicData = await publicResponse.json();
            const eventsList = publicData.events || publicData.data || [];

            // For each event, check if it has a quiz
            const eventsWithQuizStatus = await Promise.all(
              eventsList.map(async (event: any) => {
                try {
                  const quizRes = await fetch(`/api/ace/quizzes?event_id=${event._id}`);
                  const quizData = await quizRes.json();
                  return {
                    ...event,
                    quiz: quizData.data || null,
                  };
                } catch {
                  return { ...event, quiz: null };
                }
              })
            );

            setEvents(eventsWithQuizStatus);
            return;
          }
          throw new Error(eventsData.error || 'Failed to fetch events');
        }

        setEvents(eventsData.events || eventsData.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchEventsWithQuizzes();
  }, []);

  const filteredEvents = useMemo(() => {
    let result = events;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(query) ||
          e.ceCategory?.toLowerCase().includes(query) ||
          (e.quiz?.title && e.quiz.title.toLowerCase().includes(query))
      );
    }

    // Apply quiz filter
    if (filterMode === 'with_quiz') {
      result = result.filter((e) => e.quiz);
    } else if (filterMode === 'without_quiz') {
      result = result.filter((e) => !e.quiz);
    }

    return result;
  }, [events, searchQuery, filterMode]);

  const stats = useMemo(() => {
    const total = events.length;
    const withQuiz = events.filter((e) => e.quiz).length;
    const withoutQuiz = total - withQuiz;
    const belowMinimum = events.filter(
      (e) =>
        e.quiz &&
        e.minimumQuestionsRequired &&
        (e.actualQuestionsCount || 0) < e.minimumQuestionsRequired
    ).length;
    return { total, withQuiz, withoutQuiz, belowMinimum };
  }, [events]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1F4D3F] text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Quiz Management
              </h1>
              <p className="mt-2 text-green-100">
                Create and manage quizzes for ACE continuing education events
              </p>
            </div>
            <Button
              onClick={() => router.push('/ace/quizzes/create')}
              className="bg-[#D4AF37] text-[#1F4D3F] hover:bg-[#C4A030] font-semibold"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Quiz
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1F4D3F]/10">
                  <ClipboardList className="h-5 w-5 text-[#1F4D3F]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Events</p>
                  <p className="text-2xl font-bold text-[#1F4D3F]">
                    {loading ? '-' : stats.total}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                  <CheckCircle2 className="h-5 w-5 text-emerald-700" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">With Quiz</p>
                  <p className="text-2xl font-bold text-emerald-700">
                    {loading ? '-' : stats.withQuiz}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                  <FileQuestion className="h-5 w-5 text-amber-700" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Without Quiz</p>
                  <p className="text-2xl font-bold text-amber-700">
                    {loading ? '-' : stats.withoutQuiz}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                  <AlertCircle className="h-5 w-5 text-red-700" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Below Min. Questions</p>
                  <p className="text-2xl font-bold text-red-700">
                    {loading ? '-' : stats.belowMinimum}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search events by title or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <div className="flex rounded-lg border bg-white">
                  {(['all', 'with_quiz', 'without_quiz'] as FilterMode[]).map(
                    (mode) => (
                      <button
                        key={mode}
                        onClick={() => setFilterMode(mode)}
                        className={`px-3 py-1.5 text-sm font-medium transition-colors first:rounded-l-lg last:rounded-r-lg ${
                          filterMode === mode
                            ? 'bg-[#1F4D3F] text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {mode === 'all'
                          ? 'All'
                          : mode === 'with_quiz'
                            ? 'Has Quiz'
                            : 'No Quiz'}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Events Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Events & Quizzes</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <TableSkeleton />
            ) : filteredEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileQuestion className="mb-4 h-12 w-12 text-muted-foreground/50" />
                <h3 className="text-lg font-medium text-muted-foreground">
                  {searchQuery || filterMode !== 'all'
                    ? 'No events match your filters'
                    : 'No events yet'}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {searchQuery
                    ? 'Try adjusting your search terms or filters.'
                    : 'Events will appear here once created.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm font-medium text-muted-foreground">
                      <th className="pb-3 pr-4">Event</th>
                      <th className="pb-3 pr-4">Quiz Status</th>
                      <th className="pb-3 pr-4">Questions</th>
                      <th className="pb-3 pr-4">Passing Score</th>
                      <th className="pb-3 pr-4">Submissions</th>
                      <th className="pb-3 pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvents.map((event) => {
                      const hasQuiz = !!event.quiz;
                      const questionsCount = event.actualQuestionsCount || 0;
                      const minRequired = event.minimumQuestionsRequired || 0;
                      const belowMinimum = hasQuiz && minRequired > 0 && questionsCount < minRequired;

                      return (
                        <tr
                          key={event._id}
                          className="cursor-pointer border-b transition-colors hover:bg-muted/50 last:border-0"
                          onClick={() => {
                            if (hasQuiz && event.quiz) {
                              router.push(`/ace/quizzes/${event.quiz._id}`);
                            }
                          }}
                        >
                          <td className="py-4 pr-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1F4D3F]/10">
                                <FileQuestion className="h-4 w-4 text-[#1F4D3F]" />
                              </div>
                              <div>
                                <p className="font-medium text-foreground">
                                  {event.title}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {event.totalCeus} CEU{event.totalCeus !== 1 ? 's' : ''} &middot;{' '}
                                  {event.ceCategory} &middot;{' '}
                                  {event.modality?.replace('_', ' ')}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 pr-4">
                            {hasQuiz ? (
                              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                {event.quiz!.title}
                              </Badge>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-600 border-gray-200">
                                No Quiz
                              </Badge>
                            )}
                          </td>
                          <td className="py-4 pr-4">
                            {hasQuiz ? (
                              <div className="flex items-center gap-1">
                                <span
                                  className={`text-sm font-medium ${belowMinimum ? 'text-red-600' : 'text-gray-900'}`}
                                >
                                  {questionsCount}
                                </span>
                                {minRequired > 0 && (
                                  <span className="text-xs text-gray-500">
                                    / {minRequired} min
                                  </span>
                                )}
                                {belowMinimum && (
                                  <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                                )}
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">--</span>
                            )}
                          </td>
                          <td className="py-4 pr-4">
                            {hasQuiz ? (
                              <span className="text-sm font-medium">
                                {event.quiz!.passingScorePercentage}%
                              </span>
                            ) : (
                              <span className="text-sm text-muted-foreground">--</span>
                            )}
                          </td>
                          <td className="py-4 pr-4">
                            {hasQuiz ? (
                              <div className="flex items-center gap-1.5">
                                <Users className="h-3.5 w-3.5 text-gray-400" />
                                <span className="text-sm">
                                  {event.submissionCount || 0}
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">--</span>
                            )}
                          </td>
                          <td className="py-4 pr-4">
                            {hasQuiz ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/ace/quizzes/${event.quiz!._id}`);
                                }}
                              >
                                Manage
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                className="bg-[#D4AF37] text-[#1F4D3F] hover:bg-[#C4A030]"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/ace/quizzes/create?event_id=${event._id}`);
                                }}
                              >
                                <Plus className="mr-1 h-3.5 w-3.5" />
                                Create Quiz
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
