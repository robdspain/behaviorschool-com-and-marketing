'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Monitor,
  Clock,
  Award,
  DollarSign,
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Loader2,
  CalendarPlus,
  Mail,
  BookOpen,
  Shield,
  User,
  Copy,
  Check,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  validateRegistrationEligibility,
  getCredentialTypeLabel,
  getEventTypeLabel,
} from '@/lib/ace/registration-validation';
import type {
  AceCredentialType,
  AceEventCategory,
  AceEventModality,
  AceEventType,
} from '@/lib/ace/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface EventDetail {
  _id: string;
  title: string;
  description?: string;
  totalCeus: number;
  ceCategory: AceEventCategory;
  modality: AceEventModality;
  eventType?: AceEventType;
  startDate: number;
  endDate?: number;
  maxParticipants?: number;
  currentParticipants?: number;
  fee?: number;
  status: string;
  learningObjectives?: string[];
  location?: string;
  onlineMeetingUrl?: string;
  instructorQualificationsSummary?: string;
  instructorAffiliations?: string;
  conflictsOfInterest?: string;
  verificationMethod?: string;
  provider?: {
    _id: string;
    providerName: string;
    bacbProviderNumber?: string;
  } | null;
  instructors?: Array<{
    _id: string;
    firstName: string;
    lastName: string;
    role?: string;
  }>;
}

type PageState = 'loading' | 'form' | 'submitting' | 'confirmation' | 'error';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MODALITY_LABELS: Record<AceEventModality, string> = {
  in_person: 'In Person',
  synchronous: 'Live Online',
  asynchronous: 'Self-Paced',
};

const CATEGORY_LABELS: Record<AceEventCategory, string> = {
  learning: 'Learning',
  ethics: 'Ethics',
  supervision: 'Supervision',
  teaching: 'Teaching',
};

const CREDENTIAL_OPTIONS: { value: AceCredentialType; label: string }[] = [
  { value: 'bcba', label: 'BCBA - Board Certified Behavior Analyst' },
  { value: 'bcaba', label: 'BCaBA - Board Certified Assistant Behavior Analyst' },
  { value: 'rbt', label: 'RBT - Registered Behavior Technician' },
  { value: 'other', label: 'Other' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function EventRegistrationPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  // Page state
  const [pageState, setPageState] = useState<PageState>('loading');
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [bacbId, setBacbId] = useState('');
  const [credentialType, setCredentialType] = useState<AceCredentialType | ''>('');
  const [formError, setFormError] = useState<string | null>(null);
  const [eligibilityError, setEligibilityError] = useState<string | null>(null);

  // Confirmation state
  const [confirmationCode, setConfirmationCode] = useState('');
  const [registrationId, setRegistrationId] = useState('');
  const [requiresPayment, setRequiresPayment] = useState(false);
  const [copied, setCopied] = useState(false);

  // Computed
  const eventIsFull =
    event?.maxParticipants !== undefined &&
    event?.maxParticipants !== null &&
    (event?.currentParticipants || 0) >= event.maxParticipants;

  const spotsRemaining =
    event?.maxParticipants !== undefined && event?.maxParticipants !== null
      ? Math.max(0, event.maxParticipants - (event?.currentParticipants || 0))
      : null;

  // Fetch event
  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`/api/ace/registrations?event_id=${eventId}`);
        // We need the event details, not registrations. Use the event details endpoint.
        const eventRes = await fetch(`/api/ace/events/${eventId}`);
        if (!eventRes.ok) {
          // Try alternate: the getWithDetails pattern
          setFetchError('Unable to load event details.');
          setPageState('error');
          return;
        }
        const data = await eventRes.json();
        setEvent(data.event || data);
        setPageState('form');
      } catch (err) {
        console.error('Error loading event:', err);
        setFetchError('Unable to load event details. Please try again.');
        setPageState('error');
      }
    }
    fetchEvent();
  }, [eventId]);

  // Credential eligibility check
  useEffect(() => {
    if (!credentialType || !event?.eventType) {
      setEligibilityError(null);
      return;
    }
    const result = validateRegistrationEligibility(
      credentialType as AceCredentialType,
      event.eventType
    );
    if (!result.eligible) {
      setEligibilityError(result.reason || 'You are not eligible for this event type.');
    } else {
      setEligibilityError(null);
    }
  }, [credentialType, event?.eventType]);

  // Submit registration
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setFormError('Please fill in all required fields.');
      return;
    }

    if (!credentialType) {
      setFormError('Please select your credential type.');
      return;
    }

    if (eligibilityError) {
      setFormError(eligibilityError);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError('Please enter a valid email address.');
      return;
    }

    setPageState('submitting');

    try {
      // If event is full, join waitlist
      if (eventIsFull) {
        const res = await fetch('/api/ace/registrations/waitlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_id: eventId,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim().toLowerCase(),
            bacbId: bacbId.trim() || undefined,
            credentialType,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          setFormError(data.error || 'Failed to join waitlist.');
          setPageState('form');
          return;
        }

        setConfirmationCode(data.confirmation_code);
        setRegistrationId(data.registration_id);
        setRequiresPayment(false);
        setPageState('confirmation');
        return;
      }

      // Normal registration
      const res = await fetch('/api/ace/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: eventId,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim().toLowerCase(),
          bacbId: bacbId.trim() || undefined,
          credentialType,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        // Check if already registered
        if (data.confirmation_code) {
          setConfirmationCode(data.confirmation_code);
          setFormError(
            `You are already registered for this event. Your confirmation code is: ${data.confirmation_code}`
          );
          setPageState('form');
          return;
        }
        setFormError(data.error || 'Registration failed. Please try again.');
        setPageState('form');
        return;
      }

      setConfirmationCode(data.confirmation_code);
      setRegistrationId(data.registration_id);
      setRequiresPayment(data.requires_payment || false);

      // If requires payment, redirect to Stripe checkout
      if (data.requires_payment) {
        const checkoutRes = await fetch('/api/ace/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            registration_id: data.registration_id,
            event_id: eventId,
            email: email.trim().toLowerCase(),
          }),
        });

        const checkoutData = await checkoutRes.json();
        if (checkoutData.checkout_url) {
          window.location.href = checkoutData.checkout_url;
          return;
        }
        // If checkout creation failed, still show confirmation
      }

      setPageState('confirmation');
    } catch (err) {
      console.error('Registration error:', err);
      setFormError('An unexpected error occurred. Please try again.');
      setPageState('form');
    }
  }

  // Copy confirmation code
  function copyCode() {
    navigator.clipboard.writeText(confirmationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Generate Google Calendar URL
  function getCalendarUrl(): string {
    if (!event) return '#';
    const start = new Date(event.startDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const end = event.endDate
      ? new Date(event.endDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
      : new Date(event.startDate + 2 * 60 * 60 * 1000)
          .toISOString()
          .replace(/[-:]/g, '')
          .split('.')[0] + 'Z';
    const details = `Confirmation Code: ${confirmationCode}\n${event.description || ''}`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(event.location || 'Online')}`;
  }

  // ---------------------------------------------------------------------------
  // Render: Loading
  // ---------------------------------------------------------------------------

  if (pageState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-6 w-96 mb-8" />
          <Card>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-40 w-full mt-4" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render: Error
  // ---------------------------------------------------------------------------

  if (pageState === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Event Not Found</h2>
          <p className="text-gray-500 mb-6">{fetchError}</p>
          <Link href="/ace/events/browse">
            <Button className="bg-[#1F4D3F] hover:bg-[#1F4D3F]/90">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Browse Events
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render: Confirmation
  // ---------------------------------------------------------------------------

  if (pageState === 'confirmation' && event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Success Banner */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {eventIsFull ? 'Added to Waitlist!' : 'Registration Confirmed!'}
            </h1>
            <p className="text-gray-600">
              {eventIsFull
                ? 'You have been added to the waitlist. We will contact you if a spot opens up.'
                : requiresPayment
                  ? 'Your registration is pending payment. Complete checkout to confirm.'
                  : 'You are registered for this event. Check your email for details.'}
            </p>
          </div>

          {/* Confirmation Code Card */}
          <Card className="mb-6 border-[#1F4D3F]/20">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">Confirmation Code</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl font-mono font-bold text-[#1F4D3F] tracking-wider">
                    {confirmationCode}
                  </span>
                  <button
                    onClick={copyCode}
                    className="p-2 text-gray-400 hover:text-[#1F4D3F] transition-colors"
                    title="Copy code"
                  >
                    {copied ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Save this code for your records
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Event Details Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <BookOpen className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">{event.title}</p>
                  <p className="text-gray-500">
                    {event.eventType === 'pd' ? 'PD' : 'CE'} - {CATEGORY_LABELS[event.ceCategory]}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
                <span>
                  {new Date(event.startDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                  {' at '}
                  {new Date(event.startDate).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {event.modality === 'in_person' ? (
                  <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                ) : (
                  <Monitor className="h-4 w-4 text-gray-400 shrink-0" />
                )}
                <span>
                  {MODALITY_LABELS[event.modality]}
                  {event.location ? ` - ${event.location}` : ''}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Award className="h-4 w-4 text-[#D4AF37] shrink-0" />
                <span>
                  {event.totalCeus} {event.eventType === 'pd' ? 'PDUs' : 'CEUs'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* What to Expect */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">What to Expect</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <Mail className="h-4 w-4 text-[#1F4D3F] mt-0.5 shrink-0" />
                  <span>A confirmation email will be sent to <strong>{email}</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#1F4D3F] mt-0.5 shrink-0" />
                  <span>Attend the event and have your attendance verified</span>
                </li>
                {event.verificationMethod === 'quiz_completion' && (
                  <li className="flex items-start gap-2">
                    <BookOpen className="h-4 w-4 text-[#1F4D3F] mt-0.5 shrink-0" />
                    <span>Complete the post-event quiz with a passing score</span>
                  </li>
                )}
                <li className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-[#1F4D3F] mt-0.5 shrink-0" />
                  <span>Submit feedback and receive your certificate</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={getCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button variant="outline" className="w-full gap-2">
                <CalendarPlus className="h-4 w-4" />
                Add to Calendar
              </Button>
            </a>
            <Link href="/ace/registrations/lookup" className="flex-1">
              <Button variant="outline" className="w-full gap-2">
                <Search className="h-4 w-4" />
                Look Up Registrations
              </Button>
            </Link>
            <Link href="/ace/events/browse" className="flex-1">
              <Button className="w-full gap-2 bg-[#1F4D3F] hover:bg-[#1F4D3F]/90">
                Browse More Events
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render: Form
  // ---------------------------------------------------------------------------

  if (!event) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back nav */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link
            href="/ace/events/browse"
            className="inline-flex items-center text-sm text-gray-500 hover:text-[#1F4D3F] transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Events
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Summary (Sidebar) */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Card className="sticky top-8">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant="secondary"
                    className={
                      event.eventType === 'pd'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-[#1F4D3F]/10 text-[#1F4D3F]'
                    }
                  >
                    {event.eventType === 'pd' ? 'PD' : 'CE'}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {CATEGORY_LABELS[event.ceCategory]}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{event.title}</CardTitle>
                {event.provider?.providerName && (
                  <CardDescription>
                    by {event.provider.providerName}
                    {event.provider.bacbProviderNumber && (
                      <span className="block text-xs mt-0.5">
                        Provider #{event.provider.bacbProviderNumber}
                      </span>
                    )}
                  </CardDescription>
                )}
              </CardHeader>

              <Separator />

              <CardContent className="pt-4 space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
                  <span>
                    {new Date(event.startDate).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  {event.modality === 'in_person' ? (
                    <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                  ) : event.modality === 'synchronous' ? (
                    <Monitor className="h-4 w-4 text-gray-400 shrink-0" />
                  ) : (
                    <Clock className="h-4 w-4 text-gray-400 shrink-0" />
                  )}
                  <span>
                    {MODALITY_LABELS[event.modality]}
                    {event.location ? ` - ${event.location}` : ''}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-[#D4AF37] shrink-0" />
                  <span className="font-medium text-[#1F4D3F]">
                    {event.totalCeus} {event.eventType === 'pd' ? 'PDUs' : 'CEUs'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="font-medium">
                    {!event.fee || event.fee === 0
                      ? 'Free'
                      : `$${event.fee.toFixed(2)}`}
                  </span>
                </div>

                {spotsRemaining !== null && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400 shrink-0" />
                    <span
                      className={
                        eventIsFull
                          ? 'text-red-600 font-medium'
                          : spotsRemaining <= 5
                            ? 'text-orange-600 font-medium'
                            : 'text-gray-600'
                      }
                    >
                      {eventIsFull
                        ? 'Event Full - Waitlist Available'
                        : `${spotsRemaining} spot${spotsRemaining !== 1 ? 's' : ''} remaining`}
                    </span>
                  </div>
                )}

                {/* Instructors */}
                {event.instructors && event.instructors.length > 0 && (
                  <>
                    <Separator className="my-2" />
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                        Instructor{event.instructors.length > 1 ? 's' : ''}
                      </p>
                      {event.instructors.map((inst) => (
                        <div key={inst._id} className="flex items-center gap-2">
                          <User className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-gray-700">
                            {inst.firstName} {inst.lastName}
                            {inst.role === 'lead' && (
                              <span className="text-xs text-gray-400 ml-1">(Lead)</span>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Learning Objectives */}
                {event.learningObjectives && event.learningObjectives.length > 0 && (
                  <>
                    <Separator className="my-2" />
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                        Learning Objectives
                      </p>
                      <ul className="space-y-1">
                        {event.learningObjectives.map((obj, i) => (
                          <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                            <span className="text-[#D4AF37] mt-0.5">*</span>
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                {/* Disclosures */}
                {(event.instructorAffiliations || event.conflictsOfInterest) && (
                  <>
                    <Separator className="my-2" />
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                        Disclosures
                      </p>
                      {event.instructorAffiliations && (
                        <p className="text-xs text-gray-500 mb-1">
                          <span className="font-medium">Affiliations: </span>
                          {event.instructorAffiliations}
                        </p>
                      )}
                      {event.conflictsOfInterest && (
                        <p className="text-xs text-gray-500">
                          <span className="font-medium">Conflicts of Interest: </span>
                          {event.conflictsOfInterest}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Registration Form */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  {eventIsFull ? 'Join Waitlist' : 'Register for Event'}
                </CardTitle>
                <CardDescription>
                  {eventIsFull
                    ? 'This event is currently full. Join the waitlist and we will notify you if a spot opens up.'
                    : 'Complete the form below to register. All fields marked with * are required.'}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {eventIsFull && (
                  <Alert className="mb-6 border-orange-200 bg-orange-50">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <AlertTitle className="text-orange-800">Event Full</AlertTitle>
                    <AlertDescription className="text-orange-700">
                      This event has reached maximum capacity. You can join the waitlist and
                      we will contact you if a spot becomes available.
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">
                        First Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Enter your first name"
                        required
                        disabled={pageState === 'submitting'}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">
                        Last Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter your last name"
                        required
                        disabled={pageState === 'submitting'}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      disabled={pageState === 'submitting'}
                    />
                    <p className="text-xs text-gray-500">
                      Confirmation and certificate will be sent to this address
                    </p>
                  </div>

                  {/* BACB ID */}
                  <div className="space-y-2">
                    <Label htmlFor="bacbId">BACB ID (Optional)</Label>
                    <Input
                      id="bacbId"
                      value={bacbId}
                      onChange={(e) => setBacbId(e.target.value)}
                      placeholder="e.g., 1-23-45678"
                      disabled={pageState === 'submitting'}
                    />
                    <p className="text-xs text-gray-500">
                      Your BACB certification number, if applicable
                    </p>
                  </div>

                  {/* Credential Type */}
                  <div className="space-y-2">
                    <Label htmlFor="credentialType">
                      Credential Type <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="credentialType"
                      value={credentialType}
                      onChange={(e) =>
                        setCredentialType(e.target.value as AceCredentialType)
                      }
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                      required
                      disabled={pageState === 'submitting'}
                    >
                      <option value="">Select your credential...</option>
                      {CREDENTIAL_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Eligibility Warning */}
                  {eligibilityError && (
                    <Alert className="border-red-200 bg-red-50" variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Not Eligible</AlertTitle>
                      <AlertDescription>{eligibilityError}</AlertDescription>
                    </Alert>
                  )}

                  {/* Eligibility Success */}
                  {credentialType && !eligibilityError && event.eventType && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertTitle className="text-green-800">Eligible</AlertTitle>
                      <AlertDescription className="text-green-700">
                        Your credential ({getCredentialTypeLabel(credentialType as AceCredentialType)})
                        is eligible for this{' '}
                        {event.eventType === 'pd' ? 'Professional Development' : 'Continuing Education'}{' '}
                        event.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Payment Info */}
                  {event.fee && event.fee > 0 && !eventIsFull && (
                    <div className="bg-gray-50 rounded-lg p-4 border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Event Fee</p>
                          <p className="text-sm text-gray-500">
                            You will be redirected to a secure checkout after registration
                          </p>
                        </div>
                        <p className="text-xl font-bold text-[#1F4D3F]">
                          ${event.fee.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Form Error */}
                  {formError && (
                    <Alert className="border-red-200 bg-red-50" variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{formError}</AlertDescription>
                    </Alert>
                  )}

                  {/* Submit */}
                  <Button
                    type="submit"
                    className={`w-full h-12 text-base font-medium ${
                      eventIsFull
                        ? 'bg-gray-700 hover:bg-gray-800'
                        : 'bg-[#1F4D3F] hover:bg-[#1F4D3F]/90'
                    }`}
                    disabled={pageState === 'submitting' || !!eligibilityError}
                  >
                    {pageState === 'submitting' ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        {eventIsFull ? 'Joining Waitlist...' : 'Registering...'}
                      </>
                    ) : eventIsFull ? (
                      'Join Waitlist'
                    ) : event.fee && event.fee > 0 ? (
                      `Register & Pay $${event.fee.toFixed(2)}`
                    ) : (
                      'Register Now'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

