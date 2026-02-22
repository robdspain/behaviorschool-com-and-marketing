'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  AlertTriangle,
  Info,
  Award,
  Calendar,
  BookOpen,
  Users,
  Shield,
  MapPin,
  ClipboardCheck,
  UserCheck,
  Eye,
  Loader2,
  Plus,
  Trash2,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  calculateCEUs,
  calculateMinimumQuestions,
  validateDuration,
  validateJournalClubCEUs,
  validatePodcastCEUs,
  formatCredits,
  getCEUCalculationSummary,
} from '@/lib/ace/ceu-calculator';
import type {
  AceEventCategory,
  AceEventModality,
  AceEventType,
  AceEventSubtype,
  AceVerificationMethod,
} from '@/lib/ace/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface WizardFormData {
  // Step 1: Type & Category
  event_type: AceEventType;
  ce_category: AceEventCategory;
  event_subtype: AceEventSubtype;

  // Step 2: Basic Info
  title: string;
  description: string;
  modality: AceEventModality;
  duration_minutes: number;

  // Step 3: Schedule
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  timezone: string;
  registration_deadline: string;

  // Step 4: Learning Objectives
  learning_objectives: string[];

  // Step 5: Disclosures
  instructor_affiliations: string;
  conflicts_of_interest: string;
  commercial_support: string;
  publication_date: string;

  // Step 6: Logistics
  location: string;
  online_meeting_url: string;
  max_participants: string;
  fee: string;
  content_url: string;

  // Step 7: Verification
  verification_method: AceVerificationMethod;
  passing_score_percentage: number;

  // Step 8: Instructors
  lead_instructor_email: string;
  co_presenter_emails: string[];

  // Meta
  provider_id: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STEPS = [
  { number: 1, title: 'Event Type', icon: Award },
  { number: 2, title: 'Basic Info', icon: BookOpen },
  { number: 3, title: 'Schedule', icon: Calendar },
  { number: 4, title: 'Objectives', icon: ClipboardCheck },
  { number: 5, title: 'Disclosures', icon: Shield },
  { number: 6, title: 'Logistics', icon: MapPin },
  { number: 7, title: 'Assessment', icon: ClipboardCheck },
  { number: 8, title: 'Instructors', icon: UserCheck },
  { number: 9, title: 'Review', icon: Eye },
];

const INITIAL_FORM: WizardFormData = {
  event_type: 'ce',
  ce_category: 'learning',
  event_subtype: 'standard',
  title: '',
  description: '',
  modality: 'synchronous',
  duration_minutes: 60,
  start_date: '',
  start_time: '09:00',
  end_date: '',
  end_time: '10:00',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  registration_deadline: '',
  learning_objectives: ['', '', ''],
  instructor_affiliations: '',
  conflicts_of_interest: '',
  commercial_support: '',
  publication_date: '',
  location: '',
  online_meeting_url: '',
  max_participants: '',
  fee: '0',
  content_url: '',
  verification_method: 'quiz_completion',
  passing_score_percentage: 80,
  lead_instructor_email: '',
  co_presenter_emails: [],
  provider_id: '',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CreateEventWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<WizardFormData>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // CEU calculation
  const ceuSummary = useMemo(
    () =>
      getCEUCalculationSummary(
        form.duration_minutes,
        form.event_type,
        form.event_subtype
      ),
    [form.duration_minutes, form.event_type, form.event_subtype]
  );

  // Minimum questions calculation
  const minQuestions = useMemo(
    () => calculateMinimumQuestions(ceuSummary.ceus),
    [ceuSummary.ceus]
  );

  // ---- Form helpers ----

  function updateField<K extends keyof WizardFormData>(
    field: K,
    value: WizardFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function addObjective() {
    setForm((prev) => ({
      ...prev,
      learning_objectives: [...prev.learning_objectives, ''],
    }));
  }

  function removeObjective(index: number) {
    if (form.learning_objectives.length <= 3) return;
    setForm((prev) => ({
      ...prev,
      learning_objectives: prev.learning_objectives.filter(
        (_, i) => i !== index
      ),
    }));
  }

  function updateObjective(index: number, value: string) {
    setForm((prev) => ({
      ...prev,
      learning_objectives: prev.learning_objectives.map((obj, i) =>
        i === index ? value : obj
      ),
    }));
  }

  function addCoPresenter() {
    setForm((prev) => ({
      ...prev,
      co_presenter_emails: [...prev.co_presenter_emails, ''],
    }));
  }

  function removeCoPresenter(index: number) {
    setForm((prev) => ({
      ...prev,
      co_presenter_emails: prev.co_presenter_emails.filter(
        (_, i) => i !== index
      ),
    }));
  }

  function updateCoPresenter(index: number, value: string) {
    setForm((prev) => ({
      ...prev,
      co_presenter_emails: prev.co_presenter_emails.map((e, i) =>
        i === index ? value : e
      ),
    }));
  }

  // ---- Navigation ----

  function goNext() {
    if (currentStep < STEPS.length) setCurrentStep((s) => s + 1);
  }

  function goPrev() {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  }

  function goToStep(step: number) {
    if (step >= 1 && step <= STEPS.length) setCurrentStep(step);
  }

  // ---- Submit ----

  async function handleSubmit(asDraft: boolean) {
    setSubmitting(true);
    setSubmitError(null);

    try {
      // Build start/end dates
      const startDateTime = form.start_date && form.start_time
        ? `${form.start_date}T${form.start_time}:00`
        : form.start_date;
      const endDateTime = form.end_date && form.end_time
        ? `${form.end_date}T${form.end_time}:00`
        : form.end_date || undefined;

      const payload = {
        provider_id: form.provider_id || undefined,
        title: form.title,
        description: form.description,
        ce_category: form.ce_category,
        modality: form.modality,
        event_type: form.event_type,
        event_subtype: form.event_subtype,
        duration_minutes: form.duration_minutes,
        total_ceus: ceuSummary.ceus,
        start_date: startDateTime,
        end_date: endDateTime,
        registration_deadline: form.registration_deadline || undefined,
        max_participants: form.max_participants
          ? Number(form.max_participants)
          : undefined,
        location: form.location || undefined,
        online_meeting_url: form.online_meeting_url || undefined,
        fee: form.fee ? Number(form.fee) : 0,
        verification_method: form.verification_method,
        passing_score_percentage: form.passing_score_percentage,
        learning_objectives: form.learning_objectives.filter(
          (o) => o.trim().length > 0
        ),
        instructor_affiliations: form.instructor_affiliations || undefined,
        conflicts_of_interest: form.conflicts_of_interest || 'None',
      };

      const res = await fetch('/api/ace/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to create event');
      }

      // If submitting for approval, change status
      if (!asDraft && json.data?._id) {
        await fetch(`/api/ace/events/${json.data._id}/status`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'pending_approval' }),
        });
      }

      router.push(`/ace/events/${json.data?._id || ''}`);
    } catch (err: any) {
      setSubmitError(err.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  }

  // ---- Step Content Renderers ----

  function renderStep1() {
    return (
      <div className="space-y-8">
        {/* Event Type Selection */}
        <div>
          <Label className="text-base font-semibold text-gray-900">
            Event Type
          </Label>
          <p className="text-sm text-gray-500 mt-1 mb-4">
            Select whether this is a Continuing Education (CE) or Professional
            Development (PD) event.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => updateField('event_type', 'ce')}
              className={`p-6 rounded-lg border-2 text-left transition-all ${
                form.event_type === 'ce'
                  ? 'border-[#1F4D3F] bg-[#1F4D3F]/5 ring-1 ring-[#1F4D3F]/20'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`size-10 rounded-full flex items-center justify-center ${
                    form.event_type === 'ce'
                      ? 'bg-[#1F4D3F] text-white'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  <Award className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    CE - Continuing Education
                  </h3>
                  <p className="text-xs text-gray-500">
                    For BCBAs and BCaBAs
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Continuing Education events issue CEUs recognized by the BACB
                for BCBA and BCaBA credential holders.
              </p>
            </button>

            <button
              type="button"
              onClick={() => updateField('event_type', 'pd')}
              className={`p-6 rounded-lg border-2 text-left transition-all ${
                form.event_type === 'pd'
                  ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`size-10 rounded-full flex items-center justify-center ${
                    form.event_type === 'pd'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  <BookOpen className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    PD - Professional Development
                  </h3>
                  <p className="text-xs text-gray-500">For RBTs only</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Professional Development events for Registered Behavior
                Technicians. Issues PDUs, not CEUs.
              </p>
            </button>
          </div>

          {form.event_type === 'pd' && (
            <Alert className="mt-4 border-orange-200 bg-orange-50">
              <AlertTriangle className="size-4 text-orange-600" />
              <AlertTitle className="text-orange-800">
                PD Events Cannot Issue CEUs
              </AlertTitle>
              <AlertDescription className="text-orange-700">
                Professional Development events issue PDUs (Professional
                Development Units) only. These are for RBTs and cannot be used
                toward BCBA or BCaBA certification renewal.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <Separator />

        {/* CE Category */}
        <div>
          <Label className="text-base font-semibold text-gray-900">
            Category
          </Label>
          <p className="text-sm text-gray-500 mt-1 mb-4">
            Select the content category for this event.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(
              [
                {
                  value: 'learning',
                  label: 'Learning',
                  desc: 'General behavior analysis content',
                },
                {
                  value: 'ethics',
                  label: 'Ethics',
                  desc: 'Ethics code and professional conduct',
                },
                {
                  value: 'supervision',
                  label: 'Supervision',
                  desc: 'Supervision practices and training',
                },
                {
                  value: 'teaching',
                  label: 'Teaching',
                  desc: 'Teaching and instruction methods',
                },
              ] as const
            ).map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => updateField('ce_category', cat.value)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  form.ce_category === cat.value
                    ? 'border-[#1F4D3F] bg-[#1F4D3F]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-gray-900">{cat.label}</div>
                <div className="text-xs text-gray-500 mt-1">{cat.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Event Subtype */}
        <div>
          <Label className="text-base font-semibold text-gray-900">
            Event Subtype
          </Label>
          <p className="text-sm text-gray-500 mt-1 mb-4">
            Select the format of your event.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(
              [
                {
                  value: 'standard',
                  label: 'Standard',
                  desc: 'Traditional CE/PD event (workshop, seminar, webinar)',
                },
                {
                  value: 'journal_club',
                  label: 'Journal Club',
                  desc: 'Discussion of published research articles (max 1 CEU/article)',
                },
                {
                  value: 'podcast',
                  label: 'Podcast',
                  desc: 'Audio/video content episode (max 1 CEU/episode)',
                },
              ] as const
            ).map((sub) => (
              <button
                key={sub.value}
                type="button"
                onClick={() => updateField('event_subtype', sub.value)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  form.event_subtype === sub.value
                    ? 'border-[#1F4D3F] bg-[#1F4D3F]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-gray-900">{sub.label}</div>
                <div className="text-xs text-gray-500 mt-1">{sub.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderStep2() {
    const durationValidation = validateDuration(form.duration_minutes);

    return (
      <div className="space-y-6">
        {/* Title */}
        <div>
          <Label htmlFor="title" className="text-sm font-medium">
            Event Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="e.g., Evidence-Based Strategies for Reducing Problem Behavior"
            className="mt-1.5"
          />
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description" className="text-sm font-medium">
            Description <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Provide a detailed description of the event content, target audience, and what participants will learn..."
            rows={6}
            className="mt-1.5"
          />
          <div className="flex justify-between mt-1.5">
            <p className="text-xs text-gray-500">
              Minimum 500 characters recommended for BACB compliance
            </p>
            <p
              className={`text-xs ${
                form.description.length >= 500
                  ? 'text-green-600'
                  : 'text-gray-400'
              }`}
            >
              {form.description.length}/500
            </p>
          </div>
        </div>

        {/* Modality */}
        <div>
          <Label className="text-sm font-medium">
            Modality <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-3 gap-3 mt-1.5">
            {(
              [
                { value: 'in_person', label: 'In-Person', icon: MapPin },
                { value: 'synchronous', label: 'Live Online', icon: Users },
                {
                  value: 'asynchronous',
                  label: 'On-Demand / Async',
                  icon: BookOpen,
                },
              ] as const
            ).map((mod) => (
              <button
                key={mod.value}
                type="button"
                onClick={() => updateField('modality', mod.value)}
                className={`flex items-center gap-2 p-3 rounded-lg border-2 text-sm transition-all ${
                  form.modality === mod.value
                    ? 'border-[#1F4D3F] bg-[#1F4D3F]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <mod.icon className="size-4" />
                {mod.label}
              </button>
            ))}
          </div>
        </div>

        {/* Duration & CEU Calculator */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="duration" className="text-sm font-medium">
              Duration (minutes) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="duration"
              type="number"
              min={1}
              value={form.duration_minutes}
              onChange={(e) =>
                updateField('duration_minutes', Number(e.target.value))
              }
              className="mt-1.5"
            />
            {!durationValidation.valid && (
              <p className="text-xs text-red-500 mt-1">
                {durationValidation.message}
              </p>
            )}
            {durationValidation.valid && durationValidation.message && (
              <p className="text-xs text-yellow-600 mt-1">
                {durationValidation.message}
              </p>
            )}
          </div>

          {/* Auto-calculated CEUs */}
          <Card className="border-[#D4AF37]/30 bg-[#D4AF37]/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="size-5 text-[#D4AF37]" />
                <span className="font-semibold text-gray-900">
                  Auto-Calculated Credits
                </span>
              </div>
              <div className="text-3xl font-bold text-[#1F4D3F]">
                {formatCredits(ceuSummary.ceus, form.event_type)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                FLOOR({form.duration_minutes} / 25) x 0.5 ={' '}
                {ceuSummary.ceus.toFixed(1)} {ceuSummary.label}
              </p>
              {ceuSummary.warnings.length > 0 && (
                <div className="mt-2 space-y-1">
                  {ceuSummary.warnings.map((w, i) => (
                    <p key={i} className="text-xs text-yellow-700 flex items-start gap-1">
                      <AlertTriangle className="size-3 mt-0.5 shrink-0" />
                      {w}
                    </p>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {form.duration_minutes < 25 && form.duration_minutes > 0 && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="size-4 text-yellow-600" />
            <AlertTitle className="text-yellow-800">
              Insufficient Duration
            </AlertTitle>
            <AlertDescription className="text-yellow-700">
              Events must be at least 25 minutes to earn any CEUs/PDUs. The
              current duration of {form.duration_minutes} minutes would award 0
              credits.
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  }

  function renderStep3() {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Start Date */}
          <div>
            <Label htmlFor="start_date" className="text-sm font-medium">
              Start Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="start_date"
              type="date"
              value={form.start_date}
              onChange={(e) => updateField('start_date', e.target.value)}
              className="mt-1.5"
            />
          </div>

          {/* Start Time */}
          <div>
            <Label htmlFor="start_time" className="text-sm font-medium">
              Start Time
            </Label>
            <Input
              id="start_time"
              type="time"
              value={form.start_time}
              onChange={(e) => updateField('start_time', e.target.value)}
              className="mt-1.5"
            />
          </div>

          {/* End Date */}
          <div>
            <Label htmlFor="end_date" className="text-sm font-medium">
              End Date
            </Label>
            <Input
              id="end_date"
              type="date"
              value={form.end_date}
              onChange={(e) => updateField('end_date', e.target.value)}
              className="mt-1.5"
            />
          </div>

          {/* End Time */}
          <div>
            <Label htmlFor="end_time" className="text-sm font-medium">
              End Time
            </Label>
            <Input
              id="end_time"
              type="time"
              value={form.end_time}
              onChange={(e) => updateField('end_time', e.target.value)}
              className="mt-1.5"
            />
          </div>
        </div>

        {/* Timezone */}
        <div>
          <Label htmlFor="timezone" className="text-sm font-medium">
            Timezone
          </Label>
          <select
            id="timezone"
            value={form.timezone}
            onChange={(e) => updateField('timezone', e.target.value)}
            className="mt-1.5 w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Chicago">Central Time (CT)</option>
            <option value="America/Denver">Mountain Time (MT)</option>
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
            <option value="America/Anchorage">Alaska Time (AKT)</option>
            <option value="Pacific/Honolulu">Hawaii Time (HT)</option>
            <option value="UTC">UTC</option>
          </select>
        </div>

        <Separator />

        {/* Registration Deadline */}
        <div>
          <Label htmlFor="reg_deadline" className="text-sm font-medium">
            Registration Deadline
          </Label>
          <p className="text-xs text-gray-500 mt-0.5 mb-1.5">
            Optional. Last date participants can register for this event.
          </p>
          <Input
            id="reg_deadline"
            type="date"
            value={form.registration_deadline}
            onChange={(e) =>
              updateField('registration_deadline', e.target.value)
            }
            className="max-w-xs"
          />
        </div>
      </div>
    );
  }

  function renderStep4() {
    return (
      <div className="space-y-6">
        <div>
          <Label className="text-base font-semibold text-gray-900">
            Learning Objectives
          </Label>
          <p className="text-sm text-gray-500 mt-1">
            Define at least 3 measurable learning objectives. Each should
            describe what participants will be able to do after the event.
          </p>
        </div>

        <Alert className="border-blue-200 bg-blue-50">
          <Info className="size-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Format Hint</AlertTitle>
          <AlertDescription className="text-blue-700">
            Start each objective with: &quot;Participants will be able to...&quot;
            followed by an action verb (identify, describe, apply, analyze,
            evaluate, create).
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          {form.learning_objectives.map((obj, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="flex items-center justify-center size-7 rounded-full bg-[#1F4D3F]/10 text-[#1F4D3F] text-xs font-bold mt-1 shrink-0">
                {index + 1}
              </div>
              <Textarea
                value={obj}
                onChange={(e) => updateObjective(index, e.target.value)}
                placeholder={`e.g., Participants will be able to identify three evidence-based strategies for...`}
                rows={2}
                className="flex-1"
              />
              {form.learning_objectives.length > 3 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeObjective(index)}
                  className="mt-1 text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                >
                  <Trash2 className="size-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          onClick={addObjective}
          className="w-full border-dashed"
        >
          <Plus className="size-4 mr-2" />
          Add Another Objective
        </Button>

        {form.learning_objectives.filter((o) => o.trim().length > 0).length <
          3 && (
          <p className="text-sm text-yellow-600 flex items-center gap-1.5">
            <AlertTriangle className="size-4" />
            Minimum 3 learning objectives required (
            {form.learning_objectives.filter((o) => o.trim().length > 0).length}
            /3 completed)
          </p>
        )}
      </div>
    );
  }

  function renderStep5() {
    return (
      <div className="space-y-6">
        <div>
          <Label className="text-base font-semibold text-gray-900">
            Disclosures & Transparency
          </Label>
          <p className="text-sm text-gray-500 mt-1">
            BACB requires transparency about instructor affiliations, conflicts
            of interest, and commercial support.
          </p>
        </div>

        {/* Instructor Affiliations */}
        <div>
          <Label htmlFor="affiliations" className="text-sm font-medium">
            Instructor Affiliations
          </Label>
          <p className="text-xs text-gray-500 mt-0.5 mb-1.5">
            List any relevant affiliations of the instructor(s) with
            organizations, companies, or institutions.
          </p>
          <Textarea
            id="affiliations"
            value={form.instructor_affiliations}
            onChange={(e) =>
              updateField('instructor_affiliations', e.target.value)
            }
            placeholder="e.g., University of ABC, XYZ Consulting Group"
            rows={3}
          />
        </div>

        {/* Conflicts of Interest */}
        <div>
          <Label htmlFor="conflicts" className="text-sm font-medium">
            Conflicts of Interest Disclosure
          </Label>
          <p className="text-xs text-gray-500 mt-0.5 mb-1.5">
            Disclose any financial relationships or conflicts of interest.
            Enter &quot;None&quot; if there are none.
          </p>
          <Textarea
            id="conflicts"
            value={form.conflicts_of_interest}
            onChange={(e) =>
              updateField('conflicts_of_interest', e.target.value)
            }
            placeholder='e.g., "None" or describe any financial interests, sponsorships, or relationships'
            rows={3}
          />
        </div>

        {/* Commercial Support */}
        <div>
          <Label htmlFor="commercial" className="text-sm font-medium">
            Commercial Support Acknowledgment
          </Label>
          <p className="text-xs text-gray-500 mt-0.5 mb-1.5">
            If any commercial entity has provided financial or in-kind support,
            acknowledge it here.
          </p>
          <Textarea
            id="commercial"
            value={form.commercial_support}
            onChange={(e) =>
              updateField('commercial_support', e.target.value)
            }
            placeholder='e.g., "None" or describe commercial support received'
            rows={3}
          />
        </div>

        {/* Publication Date (for async) */}
        {form.modality === 'asynchronous' && (
          <div>
            <Label htmlFor="pub_date" className="text-sm font-medium">
              Publication Date
            </Label>
            <p className="text-xs text-gray-500 mt-0.5 mb-1.5">
              When was this asynchronous content originally published or last
              updated?
            </p>
            <Input
              id="pub_date"
              type="date"
              value={form.publication_date}
              onChange={(e) =>
                updateField('publication_date', e.target.value)
              }
              className="max-w-xs"
            />
          </div>
        )}
      </div>
    );
  }

  function renderStep6() {
    return (
      <div className="space-y-6">
        {/* In-person location */}
        {form.modality === 'in_person' && (
          <div>
            <Label htmlFor="location" className="text-sm font-medium">
              Venue / Location <span className="text-red-500">*</span>
            </Label>
            <p className="text-xs text-gray-500 mt-0.5 mb-1.5">
              Full address or venue name with address.
            </p>
            <Textarea
              id="location"
              value={form.location}
              onChange={(e) => updateField('location', e.target.value)}
              placeholder="e.g., Conference Center, 123 Main St, Suite 200, City, State 12345"
              rows={2}
            />
          </div>
        )}

        {/* Online meeting URL */}
        {form.modality === 'synchronous' && (
          <div>
            <Label htmlFor="meeting_url" className="text-sm font-medium">
              Online Meeting URL <span className="text-red-500">*</span>
            </Label>
            <p className="text-xs text-gray-500 mt-0.5 mb-1.5">
              Link to the Zoom, Teams, or other meeting platform.
            </p>
            <Input
              id="meeting_url"
              type="url"
              value={form.online_meeting_url}
              onChange={(e) =>
                updateField('online_meeting_url', e.target.value)
              }
              placeholder="https://zoom.us/j/..."
              className="mt-1"
            />
          </div>
        )}

        {/* Content URL (for async) */}
        {form.modality === 'asynchronous' && (
          <div>
            <Label htmlFor="content_url" className="text-sm font-medium">
              Content URL
            </Label>
            <p className="text-xs text-gray-500 mt-0.5 mb-1.5">
              Link to the on-demand content (video, audio, course page).
            </p>
            <Input
              id="content_url"
              type="url"
              value={form.content_url}
              onChange={(e) => updateField('content_url', e.target.value)}
              placeholder="https://..."
              className="mt-1"
            />
          </div>
        )}

        <Separator />

        {/* Max Participants */}
        <div>
          <Label htmlFor="max_participants" className="text-sm font-medium">
            Maximum Participants
          </Label>
          <p className="text-xs text-gray-500 mt-0.5 mb-1.5">
            Leave blank for unlimited capacity.
          </p>
          <Input
            id="max_participants"
            type="number"
            min={1}
            value={form.max_participants}
            onChange={(e) => updateField('max_participants', e.target.value)}
            placeholder="Unlimited"
            className="max-w-xs"
          />
        </div>

        {/* Fee */}
        <div>
          <Label htmlFor="fee" className="text-sm font-medium">
            Registration Fee ($)
          </Label>
          <p className="text-xs text-gray-500 mt-0.5 mb-1.5">
            Enter 0 for free events.
          </p>
          <div className="relative max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              $
            </span>
            <Input
              id="fee"
              type="number"
              min={0}
              step={0.01}
              value={form.fee}
              onChange={(e) => updateField('fee', e.target.value)}
              className="pl-7"
            />
          </div>
        </div>
      </div>
    );
  }

  function renderStep7() {
    return (
      <div className="space-y-6">
        <div>
          <Label className="text-base font-semibold text-gray-900">
            Verification & Assessment
          </Label>
          <p className="text-sm text-gray-500 mt-1">
            Configure how participants verify their attendance and demonstrate
            learning.
          </p>
        </div>

        {/* Verification Method */}
        <div>
          <Label className="text-sm font-medium">Verification Method</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
            {(
              [
                {
                  value: 'quiz_completion',
                  label: 'Quiz Completion',
                  desc: 'Participants must pass a knowledge assessment quiz',
                },
                {
                  value: 'attendance_log',
                  label: 'Attendance Log',
                  desc: 'Sign-in/sign-out tracking with timestamps',
                },
                {
                  value: 'verification_code',
                  label: 'Verification Code',
                  desc: 'Instructor provides a code during the event',
                },
                {
                  value: 'time_on_task',
                  label: 'Time on Task',
                  desc: 'Track time spent engaging with content (async)',
                },
                {
                  value: 'check_in_prompts',
                  label: 'Check-in Prompts',
                  desc: 'Periodic engagement prompts during content',
                },
              ] as const
            ).map((method) => (
              <button
                key={method.value}
                type="button"
                onClick={() =>
                  updateField('verification_method', method.value)
                }
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  form.verification_method === method.value
                    ? 'border-[#1F4D3F] bg-[#1F4D3F]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-sm text-gray-900">
                  {method.label}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {method.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Passing Score */}
        <div>
          <Label htmlFor="passing_score" className="text-sm font-medium">
            Passing Score Percentage
          </Label>
          <p className="text-xs text-gray-500 mt-0.5 mb-1.5">
            Minimum score required to pass the assessment (default: 80%).
          </p>
          <div className="flex items-center gap-2 max-w-xs">
            <Input
              id="passing_score"
              type="number"
              min={50}
              max={100}
              value={form.passing_score_percentage}
              onChange={(e) =>
                updateField(
                  'passing_score_percentage',
                  Number(e.target.value)
                )
              }
            />
            <span className="text-gray-500">%</span>
          </div>
        </div>

        {/* Minimum questions info (for async) */}
        {form.modality === 'asynchronous' && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <ClipboardCheck className="size-5 text-blue-600" />
                <span className="font-semibold text-blue-900">
                  Minimum Questions Required
                </span>
              </div>
              <p className="text-sm text-blue-800">
                For asynchronous events, BACB requires a minimum of{' '}
                <strong>3 questions per CEU/PDU</strong> awarded.
              </p>
              <div className="mt-2 text-2xl font-bold text-blue-900">
                {minQuestions} questions minimum
              </div>
              <p className="text-xs text-blue-700 mt-1">
                Based on {ceuSummary.ceus.toFixed(1)} {ceuSummary.label} ({' '}
                {ceuSummary.ceus.toFixed(1)} / 0.5 x 3 = {minQuestions}{' '}
                questions)
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  function renderStep8() {
    return (
      <div className="space-y-6">
        <div>
          <Label className="text-base font-semibold text-gray-900">
            Instructor Assignment
          </Label>
          <p className="text-sm text-gray-500 mt-1">
            Assign the lead instructor and any co-presenters for this event.
          </p>
        </div>

        {/* Lead Instructor */}
        <div>
          <Label htmlFor="lead_instructor" className="text-sm font-medium">
            Lead Instructor Email <span className="text-red-500">*</span>
          </Label>
          <p className="text-xs text-gray-500 mt-0.5 mb-1.5">
            The lead instructor must have verified qualifications on file.
          </p>
          <Input
            id="lead_instructor"
            type="email"
            value={form.lead_instructor_email}
            onChange={(e) =>
              updateField('lead_instructor_email', e.target.value)
            }
            placeholder="instructor@example.com"
          />
        </div>

        <Separator />

        {/* Co-Presenters */}
        <div>
          <Label className="text-sm font-medium">Co-Presenters</Label>
          <p className="text-xs text-gray-500 mt-0.5 mb-3">
            Optional. Add additional presenters for this event.
          </p>

          {form.co_presenter_emails.length > 0 && (
            <div className="space-y-2 mb-3">
              {form.co_presenter_emails.map((email, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      updateCoPresenter(index, e.target.value)
                    }
                    placeholder="copresenter@example.com"
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCoPresenter(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <Button
            variant="outline"
            onClick={addCoPresenter}
            className="border-dashed"
          >
            <Plus className="size-4 mr-2" />
            Add Co-Presenter
          </Button>
        </div>
      </div>
    );
  }

  function renderStep9() {
    const filledObjectives = form.learning_objectives.filter(
      (o) => o.trim().length > 0
    );

    return (
      <div className="space-y-6">
        <div>
          <Label className="text-base font-semibold text-gray-900">
            Review & Submit
          </Label>
          <p className="text-sm text-gray-500 mt-1">
            Review all event details before submitting.
          </p>
        </div>

        {/* Event Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Type & Category */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500">
                Event Type & Category
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge
                  className={
                    form.event_type === 'pd'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-[#1F4D3F]/10 text-[#1F4D3F]'
                  }
                >
                  {form.event_type === 'pd' ? 'PD' : 'CE'}
                </Badge>
                <span className="text-sm capitalize">
                  {form.ce_category}
                </span>
                <span className="text-xs text-gray-400">|</span>
                <span className="text-sm capitalize">
                  {form.event_subtype.replace('_', ' ')}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Credits */}
          <Card className="border-[#D4AF37]/30 bg-[#D4AF37]/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500">
                Credits Awarded
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Award className="size-5 text-[#D4AF37]" />
                <span className="text-2xl font-bold text-[#1F4D3F]">
                  {formatCredits(ceuSummary.ceus, form.event_type)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {form.duration_minutes} minutes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Basic Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500">
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-xs text-gray-400">Title</span>
              <p className="font-medium text-gray-900">
                {form.title || '(Not set)'}
              </p>
            </div>
            <div>
              <span className="text-xs text-gray-400">Description</span>
              <p className="text-sm text-gray-700 line-clamp-3">
                {form.description || '(Not set)'}
              </p>
            </div>
            <div className="flex gap-6">
              <div>
                <span className="text-xs text-gray-400">Modality</span>
                <p className="text-sm capitalize">
                  {form.modality.replace('_', ' ')}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-400">Duration</span>
                <p className="text-sm">{form.duration_minutes} min</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500">
              Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex gap-6">
              <div>
                <span className="text-xs text-gray-400">Start</span>
                <p className="text-sm">
                  {form.start_date
                    ? `${form.start_date} ${form.start_time}`
                    : '(Not set)'}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-400">End</span>
                <p className="text-sm">
                  {form.end_date
                    ? `${form.end_date} ${form.end_time}`
                    : '(Not set)'}
                </p>
              </div>
            </div>
            {form.registration_deadline && (
              <div>
                <span className="text-xs text-gray-400">
                  Registration Deadline
                </span>
                <p className="text-sm">{form.registration_deadline}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Learning Objectives */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500">
              Learning Objectives ({filledObjectives.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filledObjectives.length > 0 ? (
              <ol className="list-decimal list-inside space-y-1">
                {filledObjectives.map((obj, i) => (
                  <li key={i} className="text-sm text-gray-700">
                    {obj}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-gray-400">(None set)</p>
            )}
          </CardContent>
        </Card>

        {/* Logistics */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500">
              Logistics & Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex gap-6 flex-wrap">
              {form.location && (
                <div>
                  <span className="text-xs text-gray-400">Location</span>
                  <p className="text-sm">{form.location}</p>
                </div>
              )}
              {form.online_meeting_url && (
                <div>
                  <span className="text-xs text-gray-400">Meeting URL</span>
                  <p className="text-sm truncate max-w-[200px]">
                    {form.online_meeting_url}
                  </p>
                </div>
              )}
              <div>
                <span className="text-xs text-gray-400">Fee</span>
                <p className="text-sm">
                  {Number(form.fee) > 0 ? `$${form.fee}` : 'Free'}
                </p>
              </div>
              {form.max_participants && (
                <div>
                  <span className="text-xs text-gray-400">Max Capacity</span>
                  <p className="text-sm">{form.max_participants}</p>
                </div>
              )}
              <div>
                <span className="text-xs text-gray-400">
                  Verification Method
                </span>
                <p className="text-sm capitalize">
                  {form.verification_method.replace(/_/g, ' ')}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-400">Passing Score</span>
                <p className="text-sm">{form.passing_score_percentage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Error */}
        {submitError && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="size-4 text-red-600" />
            <AlertTitle className="text-red-800">
              Submission Error
            </AlertTitle>
            <AlertDescription className="text-red-700">
              {submitError}
            </AlertDescription>
          </Alert>
        )}

        {/* Submit Buttons */}
        <div className="flex items-center gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => handleSubmit(true)}
            disabled={submitting}
            className="flex-1"
          >
            {submitting ? (
              <Loader2 className="size-4 mr-2 animate-spin" />
            ) : null}
            Save as Draft
          </Button>
          <Button
            onClick={() => handleSubmit(false)}
            disabled={submitting}
            className="flex-1 bg-[#1F4D3F] hover:bg-[#1F4D3F]/90 text-white"
          >
            {submitting ? (
              <Loader2 className="size-4 mr-2 animate-spin" />
            ) : (
              <Check className="size-4 mr-2" />
            )}
            Submit for Approval
          </Button>
        </div>
      </div>
    );
  }

  // Map step number to renderer
  const stepRenderers: Record<number, () => React.ReactNode> = {
    1: renderStep1,
    2: renderStep2,
    3: renderStep3,
    4: renderStep4,
    5: renderStep5,
    6: renderStep6,
    7: renderStep7,
    8: renderStep8,
    9: renderStep9,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/ace/events')}
            >
              <ArrowLeft className="size-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-[#1F4D3F]">
                Create New Event
              </h1>
              <p className="text-sm text-gray-500">
                Step {currentStep} of {STEPS.length}:{' '}
                {STEPS[currentStep - 1]?.title}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
          {/* Step sidebar */}
          <nav className="hidden lg:block">
            <div className="sticky top-6 space-y-1">
              {STEPS.map((step) => {
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;
                const StepIcon = step.icon;

                return (
                  <button
                    key={step.number}
                    onClick={() => goToStep(step.number)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-colors ${
                      isActive
                        ? 'bg-[#1F4D3F] text-white'
                        : isCompleted
                          ? 'text-[#1F4D3F] hover:bg-[#1F4D3F]/5'
                          : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    <div
                      className={`size-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : isCompleted
                            ? 'bg-[#1F4D3F]/10 text-[#1F4D3F]'
                            : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="size-3.5" />
                      ) : (
                        step.number
                      )}
                    </div>
                    <span className="truncate">{step.title}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Progress bar (mobile) */}
          <div className="lg:hidden">
            <div className="flex items-center gap-1">
              {STEPS.map((step) => (
                <div
                  key={step.number}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    currentStep >= step.number
                      ? 'bg-[#1F4D3F]'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Step Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#1F4D3F]">
                {STEPS[currentStep - 1]?.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stepRenderers[currentStep]?.()}

              {/* Navigation Buttons (not on review step) */}
              {currentStep < 9 && (
                <div className="flex items-center justify-between mt-8 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={goPrev}
                    disabled={currentStep === 1}
                  >
                    <ArrowLeft className="size-4 mr-2" />
                    Previous
                  </Button>
                  <span className="text-sm text-gray-400">
                    {currentStep} / {STEPS.length}
                  </span>
                  <Button
                    onClick={goNext}
                    className="bg-[#1F4D3F] hover:bg-[#1F4D3F]/90 text-white"
                  >
                    Next
                    <ArrowRight className="size-4 ml-2" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
