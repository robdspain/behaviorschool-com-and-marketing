'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Award,
  Calendar,
  Clock,
  Users,
  MapPin,
  Monitor,
  BookOpen,
  Shield,
  ClipboardCheck,
  UserCheck,
  Edit,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Circle,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  FileText,
  BarChart3,
  Info,
  Plus,
  Download,
  Star,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { formatCredits } from '@/lib/ace/ceu-calculator';
import type { AceEventStatus } from '@/lib/ace/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Registration {
  _id: string;
  eventId: string;
  participantId: string;
  confirmationCode: string;
  status: string;
  feeAmount: number;
  feePaid: boolean;
  credentialType?: string;
  attendanceVerified: boolean;
  quizCompleted: boolean;
  feedbackCompleted: boolean;
  certificateIssued: boolean;
  createdAt: number;
  participant?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    bacbId?: string;
  } | null;
}

interface AttendanceRecord {
  _id: string;
  eventId: string;
  participantId: string;
  signInTimestamp?: number;
  signOutTimestamp?: number;
  verified: boolean;
  verifiedAt?: number;
  verificationMethod?: string;
  participant?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

interface FeedbackResponse {
  _id: string;
  eventId: string;
  participantId: string;
  rating?: number;
  instructorRating?: number;
  contentRating?: number;
  relevanceRating?: number;
  comments?: string;
  suggestions?: string;
  wouldRecommend?: boolean;
  submittedAt: number;
  participant?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

interface Certificate {
  _id: string;
  eventId: string;
  participantId: string;
  certificateNumber: string;
  participantName: string;
  participantEmail: string;
  eventTitle: string;
  eventDate: string;
  totalCeus: number;
  ceCategory: string;
  providerName: string;
  status: string;
  issuedAt?: number;
  revokedAt?: number;
  participant?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

interface EventDetails {
  _id: string;
  title: string;
  description?: string;
  totalCeus: number;
  ceCategory: string;
  modality: string;
  eventType?: string;
  eventSubtype?: string;
  startDate: number;
  endDate?: number;
  registrationDeadline?: number;
  maxParticipants?: number;
  currentParticipants?: number;
  location?: string;
  onlineMeetingUrl?: string;
  fee?: number;
  verificationMethod?: string;
  passingScorePercentage?: number;
  status: AceEventStatus;
  minimumQuestionsRequired?: number;
  actualQuestionsCount?: number;
  learningObjectives?: string[];
  instructorQualificationsSummary?: string;
  instructorAffiliations?: string;
  conflictsOfInterest?: string;
  createdAt: number;
  updatedAt: number;
  provider?: {
    _id: string;
    providerName: string;
    bacbProviderNumber?: string;
  } | null;
  quiz?: {
    _id: string;
    title: string;
    passingScorePercentage: number;
  } | null;
  instructors?: Array<{
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  }>;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STATUS_WORKFLOW: AceEventStatus[] = [
  'draft',
  'pending_approval',
  'approved',
  'in_progress',
  'completed',
  'archived',
];

const STATUS_LABELS: Record<AceEventStatus, string> = {
  draft: 'Draft',
  pending_approval: 'Pending Approval',
  approved: 'Approved',
  in_progress: 'In Progress',
  completed: 'Completed',
  archived: 'Archived',
};

const STATUS_COLORS: Record<AceEventStatus, string> = {
  draft: 'bg-gray-100 text-gray-700 border-gray-300',
  pending_approval: 'bg-yellow-50 text-yellow-700 border-yellow-300',
  approved: 'bg-blue-50 text-blue-700 border-blue-300',
  in_progress: 'bg-green-50 text-green-700 border-green-300',
  completed: 'bg-purple-50 text-purple-700 border-purple-300',
  archived: 'bg-red-50 text-red-700 border-red-300',
};

const VALID_TRANSITIONS: Record<AceEventStatus, AceEventStatus[]> = {
  draft: ['pending_approval', 'archived'],
  pending_approval: ['approved', 'draft', 'archived'],
  approved: ['in_progress', 'archived'],
  in_progress: ['completed', 'archived'],
  completed: ['archived'],
  archived: [],
};

const TRANSITION_BUTTON_LABELS: Record<AceEventStatus, string> = {
  draft: 'Return to Draft',
  pending_approval: 'Submit for Approval',
  approved: 'Approve',
  in_progress: 'Start Event',
  completed: 'Mark Complete',
  archived: 'Archive',
};

const CATEGORY_LABELS: Record<string, string> = {
  learning: 'Learning',
  ethics: 'Ethics',
  supervision: 'Supervision',
  teaching: 'Teaching',
};

const MODALITY_LABELS: Record<string, string> = {
  in_person: 'In-Person',
  synchronous: 'Live Online',
  asynchronous: 'On-Demand',
};

const MODALITY_ICONS: Record<string, React.ReactNode> = {
  in_person: <MapPin className="size-4" />,
  synchronous: <Monitor className="size-4" />,
  asynchronous: <BookOpen className="size-4" />,
};

const VERIFICATION_LABELS: Record<string, string> = {
  attendance_log: 'Attendance Log',
  quiz_completion: 'Quiz Completion',
  verification_code: 'Verification Code',
  time_on_task: 'Time on Task',
  check_in_prompts: 'Check-in Prompts',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusChanging, setStatusChanging] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Tab data
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [registrationsLoading, setRegistrationsLoading] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [feedbackResponses, setFeedbackResponses] = useState<FeedbackResponse[]>([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [certificatesLoading, setCertificatesLoading] = useState(false);
  const [issuingCertificate, setIssuingCertificate] = useState<string | null>(null);

  const fetchEvent = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/ace/events/${eventId}`);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to fetch event');
      }

      setEvent(json.data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    if (eventId) fetchEvent();
  }, [eventId, fetchEvent]);

  // Fetch tab data when tab changes
  const fetchRegistrations = useCallback(async () => {
    if (!eventId) return;
    setRegistrationsLoading(true);
    try {
      const res = await fetch(`/api/ace/registrations?event_id=${eventId}`);
      const json = await res.json();
      if (json.success) setRegistrations(json.registrations || []);
    } catch (err) {
      console.error('Failed to fetch registrations:', err);
    } finally {
      setRegistrationsLoading(false);
    }
  }, [eventId]);

  const fetchAttendance = useCallback(async () => {
    if (!eventId) return;
    setAttendanceLoading(true);
    try {
      const res = await fetch(`/api/ace/attendance?event_id=${eventId}`);
      const json = await res.json();
      if (json.success) setAttendanceRecords(json.data || []);
    } catch (err) {
      console.error('Failed to fetch attendance:', err);
    } finally {
      setAttendanceLoading(false);
    }
  }, [eventId]);

  const fetchFeedback = useCallback(async () => {
    if (!eventId) return;
    setFeedbackLoading(true);
    try {
      const res = await fetch(`/api/ace/feedback?event_id=${eventId}`);
      const json = await res.json();
      if (json.success) setFeedbackResponses(json.data || []);
    } catch (err) {
      console.error('Failed to fetch feedback:', err);
    } finally {
      setFeedbackLoading(false);
    }
  }, [eventId]);

  const fetchCertificates = useCallback(async () => {
    if (!eventId) return;
    setCertificatesLoading(true);
    try {
      const res = await fetch(`/api/ace/certificates?event_id=${eventId}`);
      const json = await res.json();
      if (json.success) setCertificates(json.data || []);
    } catch (err) {
      console.error('Failed to fetch certificates:', err);
    } finally {
      setCertificatesLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    if (activeTab === 'registrations') fetchRegistrations();
    else if (activeTab === 'attendance') fetchAttendance();
    else if (activeTab === 'feedback') fetchFeedback();
    else if (activeTab === 'certificates') fetchCertificates();
  }, [activeTab, fetchRegistrations, fetchAttendance, fetchFeedback, fetchCertificates]);

  async function handleIssueCertificate(participantId: string) {
    if (!eventId) return;
    setIssuingCertificate(participantId);
    try {
      const res = await fetch('/api/ace/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: eventId, participant_id: participantId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to issue certificate');
      await fetchCertificates();
      await fetchRegistrations();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIssuingCertificate(null);
    }
  }

  async function changeStatus(newStatus: AceEventStatus) {
    if (!event) return;

    setStatusChanging(true);
    try {
      const res = await fetch(`/api/ace/events/${eventId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(
          json.error ||
            json.validation_errors?.join(', ') ||
            'Failed to change status'
        );
      }

      // Refresh event data
      await fetchEvent();
    } catch (err: any) {
      setError(err.message || 'Failed to change status');
    } finally {
      setStatusChanging(false);
    }
  }

  function formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }

  function formatDateTime(timestamp: number): string {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="size-6 animate-spin text-[#1F4D3F]" />
          <span className="text-gray-500">Loading event details...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertCircle className="size-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Error Loading Event
            </h2>
            <p className="text-sm text-gray-500 mb-6">{error}</p>
            <div className="flex items-center justify-center gap-3">
              <Button variant="outline" onClick={() => router.push('/ace/events')}>
                Back to Events
              </Button>
              <Button
                onClick={fetchEvent}
                className="bg-[#1F4D3F] hover:bg-[#1F4D3F]/90 text-white"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!event) return null;

  const availableTransitions = VALID_TRANSITIONS[event.status] || [];
  const isDraft = event.status === 'draft';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/ace/events')}
                className="mt-0.5"
              >
                <ArrowLeft className="size-5" />
              </Button>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-[#1F4D3F]">
                    {event.title}
                  </h1>
                  <Badge
                    className={
                      event.eventType === 'pd'
                        ? 'bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-100'
                        : 'bg-[#1F4D3F]/10 text-[#1F4D3F] border-[#1F4D3F]/20 hover:bg-[#1F4D3F]/10'
                    }
                  >
                    {event.eventType === 'pd' ? 'PD' : 'CE'}
                  </Badge>
                  <Badge
                    className={`${STATUS_COLORS[event.status]} hover:${STATUS_COLORS[event.status]}`}
                  >
                    {STATUS_LABELS[event.status]}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {event.provider?.providerName && (
                    <span>{event.provider.providerName}</span>
                  )}
                  <span className="flex items-center gap-1">
                    {MODALITY_ICONS[event.modality]}
                    {MODALITY_LABELS[event.modality] || event.modality}
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="size-3.5 text-[#D4AF37]" />
                    {formatCredits(
                      event.totalCeus,
                      (event.eventType as 'ce' | 'pd') || 'ce'
                    )}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3.5" />
                    {formatDate(event.startDate)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isDraft && (
                <Button
                  variant="outline"
                  onClick={() => router.push(`/ace/events/${eventId}/edit`)}
                >
                  <Edit className="size-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Status Workflow Visualization */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500">
              Event Status Workflow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              {STATUS_WORKFLOW.map((status, index) => {
                const currentIndex = STATUS_WORKFLOW.indexOf(event.status);
                const isCompleted = index < currentIndex;
                const isCurrent = status === event.status;
                const isFuture = index > currentIndex;

                return (
                  <div key={status} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div
                        className={`size-8 rounded-full flex items-center justify-center ${
                          isCompleted
                            ? 'bg-[#1F4D3F] text-white'
                            : isCurrent
                              ? 'bg-[#D4AF37] text-white ring-4 ring-[#D4AF37]/20'
                              : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="size-4" />
                        ) : isCurrent ? (
                          <Circle className="size-4 fill-current" />
                        ) : (
                          <Circle className="size-4" />
                        )}
                      </div>
                      <span
                        className={`text-xs mt-1.5 whitespace-nowrap ${
                          isCurrent
                            ? 'font-semibold text-[#1F4D3F]'
                            : isCompleted
                              ? 'text-[#1F4D3F]'
                              : 'text-gray-400'
                        }`}
                      >
                        {STATUS_LABELS[status]}
                      </span>
                    </div>

                    {index < STATUS_WORKFLOW.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-2 mt-[-20px] ${
                          index < currentIndex
                            ? 'bg-[#1F4D3F]'
                            : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Status action buttons */}
            {availableTransitions.length > 0 && (
              <div className="flex items-center gap-2 mt-6 pt-4 border-t">
                <span className="text-sm text-gray-500 mr-2">Actions:</span>
                {availableTransitions.map((targetStatus) => (
                  <Button
                    key={targetStatus}
                    size="sm"
                    variant={
                      targetStatus === 'archived' ? 'outline' : 'default'
                    }
                    onClick={() => changeStatus(targetStatus)}
                    disabled={statusChanging}
                    className={
                      targetStatus === 'archived'
                        ? 'text-red-600 border-red-200 hover:bg-red-50'
                        : 'bg-[#1F4D3F] hover:bg-[#1F4D3F]/90 text-white'
                    }
                  >
                    {statusChanging ? (
                      <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                    ) : (
                      <ArrowRight className="size-3.5 mr-1.5" />
                    )}
                    {TRANSITION_BUTTON_LABELS[targetStatus] || targetStatus}
                  </Button>
                ))}
              </div>
            )}

            {/* Error message */}
            {error && (
              <Alert className="mt-4 border-red-200 bg-red-50">
                <AlertCircle className="size-4 text-red-600" />
                <AlertTitle className="text-red-800">Error</AlertTitle>
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Tab Sections */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start">
            <TabsTrigger value="overview">
              <Info className="size-3.5 mr-1.5" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="registrations">
              <Users className="size-3.5 mr-1.5" />
              Registrations
            </TabsTrigger>
            <TabsTrigger value="attendance">
              <ClipboardCheck className="size-3.5 mr-1.5" />
              Attendance
            </TabsTrigger>
            <TabsTrigger value="quiz">
              <ClipboardCheck className="size-3.5 mr-1.5" />
              Quiz
            </TabsTrigger>
            <TabsTrigger value="feedback">
              <MessageSquare className="size-3.5 mr-1.5" />
              Feedback
            </TabsTrigger>
            <TabsTrigger value="certificates">
              <FileText className="size-3.5 mr-1.5" />
              Certificates
            </TabsTrigger>
          </TabsList>

          {/* ---- Overview Tab ---- */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
              {/* Main content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Event Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {event.description && (
                      <div>
                        <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                          Description
                        </h4>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {event.description}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                          Category
                        </h4>
                        <p className="text-sm font-medium">
                          {CATEGORY_LABELS[event.ceCategory] ||
                            event.ceCategory}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                          Modality
                        </h4>
                        <div className="flex items-center gap-1.5 text-sm font-medium">
                          {MODALITY_ICONS[event.modality]}
                          {MODALITY_LABELS[event.modality] || event.modality}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                          Event Type
                        </h4>
                        <Badge
                          className={
                            event.eventType === 'pd'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-[#1F4D3F]/10 text-[#1F4D3F]'
                          }
                        >
                          {event.eventType === 'pd' ? 'Professional Development' : 'Continuing Education'}
                        </Badge>
                      </div>
                      {event.eventSubtype && event.eventSubtype !== 'standard' && (
                        <div>
                          <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                            Subtype
                          </h4>
                          <p className="text-sm font-medium capitalize">
                            {event.eventSubtype.replace('_', ' ')}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Schedule */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="size-5 text-[#1F4D3F]" />
                      Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                          Start
                        </h4>
                        <p className="text-sm font-medium">
                          {formatDateTime(event.startDate)}
                        </p>
                      </div>
                      {event.endDate && (
                        <div>
                          <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                            End
                          </h4>
                          <p className="text-sm font-medium">
                            {formatDateTime(event.endDate)}
                          </p>
                        </div>
                      )}
                      {event.registrationDeadline && (
                        <div>
                          <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                            Registration Deadline
                          </h4>
                          <p className="text-sm font-medium">
                            {formatDateTime(event.registrationDeadline)}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Learning Objectives */}
                {event.learningObjectives &&
                  event.learningObjectives.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <ClipboardCheck className="size-5 text-[#1F4D3F]" />
                          Learning Objectives
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ol className="space-y-3">
                          {event.learningObjectives.map((obj, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-3 text-sm text-gray-700"
                            >
                              <span className="flex items-center justify-center size-6 rounded-full bg-[#1F4D3F]/10 text-[#1F4D3F] text-xs font-bold shrink-0 mt-0.5">
                                {i + 1}
                              </span>
                              {obj}
                            </li>
                          ))}
                        </ol>
                      </CardContent>
                    </Card>
                  )}

                {/* Disclosures */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="size-5 text-[#1F4D3F]" />
                      Disclosures & Transparency
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {event.instructorAffiliations && (
                      <div>
                        <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                          Instructor Affiliations
                        </h4>
                        <p className="text-sm text-gray-700">
                          {event.instructorAffiliations}
                        </p>
                      </div>
                    )}
                    <div>
                      <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                        Conflicts of Interest
                      </h4>
                      <p className="text-sm text-gray-700">
                        {event.conflictsOfInterest || 'None disclosed'}
                      </p>
                    </div>
                    {event.instructorQualificationsSummary && (
                      <div>
                        <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                          Instructor Qualifications
                        </h4>
                        <p className="text-sm text-gray-700">
                          {event.instructorQualificationsSummary}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Logistics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="size-5 text-[#1F4D3F]" />
                      Logistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {event.location && (
                        <div>
                          <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                            Location
                          </h4>
                          <p className="text-sm text-gray-700">
                            {event.location}
                          </p>
                        </div>
                      )}
                      {event.onlineMeetingUrl && (
                        <div>
                          <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                            Meeting Link
                          </h4>
                          <a
                            href={event.onlineMeetingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                          >
                            Open Meeting
                            <ExternalLink className="size-3" />
                          </a>
                        </div>
                      )}
                      <div>
                        <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                          Fee
                        </h4>
                        <p className="text-sm font-medium">
                          {event.fee && event.fee > 0
                            ? `$${event.fee.toFixed(2)}`
                            : 'Free'}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                          Capacity
                        </h4>
                        <p className="text-sm font-medium">
                          {event.currentParticipants || 0}
                          {event.maxParticipants
                            ? ` / ${event.maxParticipants}`
                            : ''}{' '}
                          registered
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Assessment */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ClipboardCheck className="size-5 text-[#1F4D3F]" />
                      Assessment & Verification
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                          Verification Method
                        </h4>
                        <p className="text-sm font-medium">
                          {event.verificationMethod
                            ? VERIFICATION_LABELS[event.verificationMethod] ||
                              event.verificationMethod
                            : 'Not set'}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                          Passing Score
                        </h4>
                        <p className="text-sm font-medium">
                          {event.passingScorePercentage || 80}%
                        </p>
                      </div>
                      {event.minimumQuestionsRequired != null &&
                        event.minimumQuestionsRequired > 0 && (
                          <div>
                            <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                              Questions Required
                            </h4>
                            <p className="text-sm font-medium">
                              {event.actualQuestionsCount || 0} /{' '}
                              {event.minimumQuestionsRequired}
                              {(event.actualQuestionsCount || 0) <
                                event.minimumQuestionsRequired && (
                                <span className="text-red-500 ml-1">
                                  (needs more)
                                </span>
                              )}
                            </p>
                          </div>
                        )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Credits Card */}
                <Card className="border-[#D4AF37]/30 bg-[#D4AF37]/5">
                  <CardContent className="p-6 text-center">
                    <Award className="size-10 text-[#D4AF37] mx-auto mb-3" />
                    <div className="text-3xl font-bold text-[#1F4D3F]">
                      {formatCredits(
                        event.totalCeus,
                        (event.eventType as 'ce' | 'pd') || 'ce'
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {CATEGORY_LABELS[event.ceCategory] || event.ceCategory}
                    </p>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Quick Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 flex items-center gap-1.5">
                        <Users className="size-3.5" />
                        Registrations
                      </span>
                      <span className="text-sm font-semibold">
                        {event.currentParticipants || 0}
                        {event.maxParticipants
                          ? ` / ${event.maxParticipants}`
                          : ''}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 flex items-center gap-1.5">
                        <ClipboardCheck className="size-3.5" />
                        Quiz
                      </span>
                      <span className="text-sm font-semibold">
                        {event.quiz ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            Configured
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-500 hover:bg-gray-100">
                            Not Set
                          </Badge>
                        )}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 flex items-center gap-1.5">
                        <Clock className="size-3.5" />
                        Created
                      </span>
                      <span className="text-xs text-gray-600">
                        {new Date(event.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 flex items-center gap-1.5">
                        <Clock className="size-3.5" />
                        Updated
                      </span>
                      <span className="text-xs text-gray-600">
                        {new Date(event.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Instructors */}
                {event.instructors && event.instructors.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                        <UserCheck className="size-4" />
                        Instructors
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {event.instructors.map((instructor) => (
                        <div
                          key={instructor._id}
                          className="flex items-center gap-3"
                        >
                          <div className="size-8 rounded-full bg-[#1F4D3F]/10 flex items-center justify-center text-[#1F4D3F] text-xs font-bold">
                            {instructor.firstName?.[0]}
                            {instructor.lastName?.[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {instructor.firstName} {instructor.lastName}
                            </p>
                            <p className="text-xs text-gray-500 capitalize">
                              {instructor.role}
                            </p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Provider Info */}
                {event.provider && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-500">
                        Provider
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm font-medium">
                        {event.provider.providerName}
                      </p>
                      {event.provider.bacbProviderNumber && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          BACB #{event.provider.bacbProviderNumber}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* ---- Registrations Tab ---- */}
          <TabsContent value="registrations">
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Registrations ({registrations.length})
                  </h3>
                  <p className="text-sm text-gray-500">
                    {event.maxParticipants
                      ? `${registrations.length} of ${event.maxParticipants} capacity`
                      : `${registrations.length} registered`}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchRegistrations}
                  disabled={registrationsLoading}
                >
                  {registrationsLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    'Refresh'
                  )}
                </Button>
              </div>

              {registrationsLoading && registrations.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Loader2 className="size-8 animate-spin text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Loading registrations...</p>
                  </CardContent>
                </Card>
              ) : registrations.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Users className="size-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-1">
                      No Registrations Yet
                    </h3>
                    <p className="text-sm text-gray-500">
                      Registrations will appear here once participants sign up.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-gray-50">
                            <th className="text-left p-3 font-medium text-gray-600">Participant</th>
                            <th className="text-left p-3 font-medium text-gray-600">Email</th>
                            <th className="text-left p-3 font-medium text-gray-600">Code</th>
                            <th className="text-left p-3 font-medium text-gray-600">Status</th>
                            <th className="text-left p-3 font-medium text-gray-600">Payment</th>
                            <th className="text-center p-3 font-medium text-gray-600">Progress</th>
                            <th className="text-left p-3 font-medium text-gray-600">Registered</th>
                          </tr>
                        </thead>
                        <tbody>
                          {registrations.map((reg) => (
                            <tr key={reg._id} className="border-b last:border-b-0 hover:bg-gray-50">
                              <td className="p-3 font-medium">
                                {reg.participant
                                  ? `${reg.participant.firstName} ${reg.participant.lastName}`
                                  : 'Unknown'}
                              </td>
                              <td className="p-3 text-gray-500">
                                {reg.participant?.email || '-'}
                              </td>
                              <td className="p-3">
                                <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                                  {reg.confirmationCode}
                                </code>
                              </td>
                              <td className="p-3">
                                <Badge
                                  className={
                                    reg.status === 'confirmed'
                                      ? 'bg-green-100 text-green-700 hover:bg-green-100'
                                      : reg.status === 'cancelled'
                                        ? 'bg-red-100 text-red-700 hover:bg-red-100'
                                        : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                                  }
                                >
                                  {reg.status}
                                </Badge>
                              </td>
                              <td className="p-3">
                                {reg.feeAmount > 0 ? (
                                  <span className={reg.feePaid ? 'text-green-600' : 'text-red-500'}>
                                    ${reg.feeAmount.toFixed(2)} {reg.feePaid ? '(paid)' : '(unpaid)'}
                                  </span>
                                ) : (
                                  <span className="text-gray-400">Free</span>
                                )}
                              </td>
                              <td className="p-3">
                                <div className="flex items-center justify-center gap-1.5">
                                  <span title="Attendance" className={reg.attendanceVerified ? 'text-green-500' : 'text-gray-300'}>
                                    {reg.attendanceVerified ? <CheckCircle className="size-4" /> : <Circle className="size-4" />}
                                  </span>
                                  <span title="Quiz" className={reg.quizCompleted ? 'text-green-500' : 'text-gray-300'}>
                                    {reg.quizCompleted ? <CheckCircle className="size-4" /> : <Circle className="size-4" />}
                                  </span>
                                  <span title="Feedback" className={reg.feedbackCompleted ? 'text-green-500' : 'text-gray-300'}>
                                    {reg.feedbackCompleted ? <CheckCircle className="size-4" /> : <Circle className="size-4" />}
                                  </span>
                                  <span title="Certificate" className={reg.certificateIssued ? 'text-green-500' : 'text-gray-300'}>
                                    {reg.certificateIssued ? <CheckCircle className="size-4" /> : <Circle className="size-4" />}
                                  </span>
                                </div>
                              </td>
                              <td className="p-3 text-gray-500 text-xs">
                                {new Date(reg.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* ---- Attendance Tab ---- */}
          <TabsContent value="attendance">
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Attendance ({attendanceRecords.length})
                  </h3>
                  <p className="text-sm text-gray-500">
                    Verification method:{' '}
                    {event.verificationMethod
                      ? VERIFICATION_LABELS[event.verificationMethod]
                      : 'Not configured'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/ace/attendance')}
                  >
                    <ClipboardCheck className="size-4 mr-1" />
                    Full Roster
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchAttendance}
                    disabled={attendanceLoading}
                  >
                    {attendanceLoading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      'Refresh'
                    )}
                  </Button>
                </div>
              </div>

              {attendanceLoading && attendanceRecords.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Loader2 className="size-8 animate-spin text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Loading attendance records...</p>
                  </CardContent>
                </Card>
              ) : attendanceRecords.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <ClipboardCheck className="size-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-1">
                      No Attendance Records
                    </h3>
                    <p className="text-sm text-gray-500">
                      Attendance records will appear here once participants check in.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-gray-50">
                            <th className="text-left p-3 font-medium text-gray-600">Participant</th>
                            <th className="text-left p-3 font-medium text-gray-600">Check-In</th>
                            <th className="text-left p-3 font-medium text-gray-600">Check-Out</th>
                            <th className="text-left p-3 font-medium text-gray-600">Duration</th>
                            <th className="text-left p-3 font-medium text-gray-600">Verified</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attendanceRecords.map((rec) => {
                            const duration =
                              rec.signInTimestamp && rec.signOutTimestamp
                                ? Math.round((rec.signOutTimestamp - rec.signInTimestamp) / 60000)
                                : null;
                            return (
                              <tr key={rec._id} className="border-b last:border-b-0 hover:bg-gray-50">
                                <td className="p-3 font-medium">
                                  {rec.participant
                                    ? `${rec.participant.firstName} ${rec.participant.lastName}`
                                    : 'Unknown'}
                                </td>
                                <td className="p-3 text-gray-500">
                                  {rec.signInTimestamp
                                    ? new Date(rec.signInTimestamp).toLocaleTimeString()
                                    : '-'}
                                </td>
                                <td className="p-3 text-gray-500">
                                  {rec.signOutTimestamp
                                    ? new Date(rec.signOutTimestamp).toLocaleTimeString()
                                    : '-'}
                                </td>
                                <td className="p-3">
                                  {duration !== null ? (
                                    <span className="text-gray-700">{duration} min</span>
                                  ) : (
                                    <span className="text-gray-400">-</span>
                                  )}
                                </td>
                                <td className="p-3">
                                  {rec.verified ? (
                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                      Verified
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-gray-100 text-gray-500 hover:bg-gray-100">
                                      Pending
                                    </Badge>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* ---- Quiz Tab ---- */}
          <TabsContent value="quiz">
            <Card className="mt-4">
              <CardContent className="p-8">
                {event.quiz ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {event.quiz.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Passing score: {event.quiz.passingScorePercentage}%
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/ace/quizzes/${event!.quiz!._id}`)}
                      >
                        Manage Quiz
                        <ChevronRight className="size-4 ml-1" />
                      </Button>
                    </div>
                    {event.minimumQuestionsRequired != null &&
                      event.minimumQuestionsRequired > 0 && (
                        <div className="rounded-lg border p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <BarChart3 className="size-4 text-[#1F4D3F]" />
                            <span className="text-sm font-medium">Question Requirements</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                              <div
                                className="h-2.5 rounded-full"
                                style={{
                                  width: `${Math.min(100, ((event.actualQuestionsCount || 0) / event.minimumQuestionsRequired) * 100)}%`,
                                  backgroundColor:
                                    (event.actualQuestionsCount || 0) >= event.minimumQuestionsRequired
                                      ? '#059669'
                                      : '#D4AF37',
                                }}
                              />
                            </div>
                            <span className="text-sm font-medium">
                              {event.actualQuestionsCount || 0} / {event.minimumQuestionsRequired}
                            </span>
                          </div>
                          {(event.actualQuestionsCount || 0) < event.minimumQuestionsRequired && (
                            <p className="text-xs text-amber-600 mt-2">
                              {event.minimumQuestionsRequired - (event.actualQuestionsCount || 0)} more
                              questions needed to meet the minimum requirement.
                            </p>
                          )}
                        </div>
                      )}
                  </div>
                ) : (
                  <div className="text-center">
                    <ClipboardCheck className="size-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-1">
                      No Quiz Configured
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Create a quiz to verify participant learning outcomes.
                    </p>
                    <Button
                      className="bg-[#1F4D3F] hover:bg-[#1F4D3F]/90 text-white"
                      onClick={() => router.push(`/ace/quizzes/new?event_id=${eventId}`)}
                    >
                      <Plus className="size-4 mr-2" />
                      Create Quiz
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---- Feedback Tab ---- */}
          <TabsContent value="feedback">
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Feedback ({feedbackResponses.length})
                  </h3>
                  <p className="text-sm text-gray-500">
                    Participant evaluations and ratings
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchFeedback}
                  disabled={feedbackLoading}
                >
                  {feedbackLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    'Refresh'
                  )}
                </Button>
              </div>

              {feedbackLoading && feedbackResponses.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Loader2 className="size-8 animate-spin text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Loading feedback...</p>
                  </CardContent>
                </Card>
              ) : feedbackResponses.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <MessageSquare className="size-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-1">
                      No Feedback Yet
                    </h3>
                    <p className="text-sm text-gray-500">
                      Feedback will appear here once participants complete their evaluations.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Feedback Summary */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {(() => {
                      const avgRating =
                        feedbackResponses.reduce((sum, f) => sum + (f.rating || 0), 0) /
                        feedbackResponses.length;
                      const avgInstructor =
                        feedbackResponses.reduce((sum, f) => sum + (f.instructorRating || 0), 0) /
                        feedbackResponses.length;
                      const avgContent =
                        feedbackResponses.reduce((sum, f) => sum + (f.contentRating || 0), 0) /
                        feedbackResponses.length;
                      const recommendPct =
                        (feedbackResponses.filter((f) => f.wouldRecommend).length /
                          feedbackResponses.length) *
                        100;
                      return (
                        <>
                          <Card>
                            <CardContent className="p-4 text-center">
                              <Star className="size-5 text-[#D4AF37] mx-auto mb-1" />
                              <div className="text-2xl font-bold text-gray-900">
                                {avgRating.toFixed(1)}
                              </div>
                              <p className="text-xs text-gray-500">Overall Rating</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4 text-center">
                              <UserCheck className="size-5 text-[#1F4D3F] mx-auto mb-1" />
                              <div className="text-2xl font-bold text-gray-900">
                                {avgInstructor.toFixed(1)}
                              </div>
                              <p className="text-xs text-gray-500">Instructor</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4 text-center">
                              <BookOpen className="size-5 text-blue-500 mx-auto mb-1" />
                              <div className="text-2xl font-bold text-gray-900">
                                {avgContent.toFixed(1)}
                              </div>
                              <p className="text-xs text-gray-500">Content</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4 text-center">
                              <CheckCircle className="size-5 text-green-500 mx-auto mb-1" />
                              <div className="text-2xl font-bold text-gray-900">
                                {recommendPct.toFixed(0)}%
                              </div>
                              <p className="text-xs text-gray-500">Would Recommend</p>
                            </CardContent>
                          </Card>
                        </>
                      );
                    })()}
                  </div>

                  {/* Individual Feedback */}
                  <div className="space-y-3">
                    {feedbackResponses.map((fb) => (
                      <Card key={fb._id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="size-8 rounded-full bg-[#1F4D3F]/10 flex items-center justify-center text-[#1F4D3F] text-xs font-bold">
                                {fb.participant?.firstName?.[0]}
                                {fb.participant?.lastName?.[0]}
                              </div>
                              <div>
                                <p className="text-sm font-medium">
                                  {fb.participant
                                    ? `${fb.participant.firstName} ${fb.participant.lastName}`
                                    : 'Anonymous'}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {new Date(fb.submittedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`size-3.5 ${
                                    i < (fb.rating || 0)
                                      ? 'text-[#D4AF37] fill-[#D4AF37]'
                                      : 'text-gray-200'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          {fb.comments && (
                            <p className="text-sm text-gray-700 mt-2">{fb.comments}</p>
                          )}
                          {fb.suggestions && (
                            <p className="text-sm text-gray-500 mt-1 italic">
                              Suggestion: {fb.suggestions}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          {/* ---- Certificates Tab ---- */}
          <TabsContent value="certificates">
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Certificates ({certificates.length})
                  </h3>
                  <p className="text-sm text-gray-500">
                    Issued certificates for event participants
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchCertificates}
                  disabled={certificatesLoading}
                >
                  {certificatesLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    'Refresh'
                  )}
                </Button>
              </div>

              {certificatesLoading && certificates.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Loader2 className="size-8 animate-spin text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Loading certificates...</p>
                  </CardContent>
                </Card>
              ) : certificates.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <FileText className="size-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-1">
                      No Certificates Issued
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Issue certificates to eligible participants who have completed all requirements.
                    </p>
                    {registrations.length > 0 && (
                      <p className="text-xs text-gray-400">
                        {registrations.filter((r) => r.attendanceVerified && !r.certificateIssued).length}{' '}
                        participants may be eligible for certificates.
                      </p>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-gray-50">
                            <th className="text-left p-3 font-medium text-gray-600">Certificate #</th>
                            <th className="text-left p-3 font-medium text-gray-600">Participant</th>
                            <th className="text-left p-3 font-medium text-gray-600">CEUs</th>
                            <th className="text-left p-3 font-medium text-gray-600">Category</th>
                            <th className="text-left p-3 font-medium text-gray-600">Status</th>
                            <th className="text-left p-3 font-medium text-gray-600">Issued</th>
                          </tr>
                        </thead>
                        <tbody>
                          {certificates.map((cert) => (
                            <tr key={cert._id} className="border-b last:border-b-0 hover:bg-gray-50">
                              <td className="p-3">
                                <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                                  {cert.certificateNumber}
                                </code>
                              </td>
                              <td className="p-3 font-medium">{cert.participantName}</td>
                              <td className="p-3">
                                <span className="font-semibold text-[#1F4D3F]">
                                  {cert.totalCeus}
                                </span>
                              </td>
                              <td className="p-3 capitalize text-gray-600">
                                {CATEGORY_LABELS[cert.ceCategory] || cert.ceCategory}
                              </td>
                              <td className="p-3">
                                <Badge
                                  className={
                                    cert.status === 'issued'
                                      ? 'bg-green-100 text-green-700 hover:bg-green-100'
                                      : cert.status === 'revoked'
                                        ? 'bg-red-100 text-red-700 hover:bg-red-100'
                                        : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                                  }
                                >
                                  {cert.status}
                                </Badge>
                              </td>
                              <td className="p-3 text-gray-500 text-xs">
                                {cert.issuedAt
                                  ? new Date(cert.issuedAt).toLocaleDateString()
                                  : '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

