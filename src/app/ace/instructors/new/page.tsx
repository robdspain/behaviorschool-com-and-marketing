'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Circle,
  AlertCircle,
  Upload,
  User,
  GraduationCap,
  Award,
  FileText,
  ClipboardCheck,
  Loader2,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

type QualificationPath =
  | 'active_bcba'
  | 'doctorate_behavior_analysis'
  | 'doctorate_with_coursework'
  | 'doctorate_with_mentorship'
  | 'doctorate_with_publications'
  | 'doctorate_with_postdoc_hours';

type ExpertiseBasis =
  | 'five_years_practice'
  | 'three_years_teaching'
  | 'published_research';

interface FormData {
  // Step 1: Basic Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bacbId: string;

  // Step 2: Qualification Path
  qualificationPath: QualificationPath | '';
  // BCBA fields
  certificationNumber: string;
  certificationDate: string;
  certificationExpiration: string;
  // Doctorate fields
  doctorateType: string;
  institution: string;
  graduationYear: string;
  major: string;
  // Doctorate + Experience subfields
  courseworkDescription: string;
  mentorSupervisorName: string;
  mentorYears: string;
  publicationsCount: string;
  publicationsList: string;
  postdocHours: string;

  // Step 3: Subject-Matter Expertise
  expertiseBasis: ExpertiseBasis | '';
  practiceYears: string;
  practiceDescription: string;
  teachingYears: string;
  teachingInstitution: string;
  teachingDescription: string;
  researchPublicationCount: string;
  researchDescription: string;

  // Step 4: Document Uploads (placeholders)
  cvUrl: string;
  transcriptUrl: string;
  certificationProofUrl: string;
  verificationLetterUrl: string;
}

const INITIAL_FORM: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  bacbId: '',
  qualificationPath: '',
  certificationNumber: '',
  certificationDate: '',
  certificationExpiration: '',
  doctorateType: '',
  institution: '',
  graduationYear: '',
  major: '',
  courseworkDescription: '',
  mentorSupervisorName: '',
  mentorYears: '',
  publicationsCount: '',
  publicationsList: '',
  postdocHours: '',
  expertiseBasis: '',
  practiceYears: '',
  practiceDescription: '',
  teachingYears: '',
  teachingInstitution: '',
  teachingDescription: '',
  researchPublicationCount: '',
  researchDescription: '',
  cvUrl: '',
  transcriptUrl: '',
  certificationProofUrl: '',
  verificationLetterUrl: '',
};

const STEPS = [
  { id: 1, title: 'Basic Info', icon: User },
  { id: 2, title: 'Qualification Path', icon: GraduationCap },
  { id: 3, title: 'Subject-Matter Expertise', icon: Award },
  { id: 4, title: 'Documents', icon: FileText },
  { id: 5, title: 'Review & Submit', icon: ClipboardCheck },
];

// ============================================================================
// Component
// ============================================================================

export default function NewInstructorPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const providerId = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('provider_id')
    : null;

  // ============================================================================
  // Helpers
  // ============================================================================

  function updateForm(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // ============================================================================
  // Validation
  // ============================================================================

  const stepValidation = useMemo(() => {
    const step1Valid = !!(form.firstName && form.lastName && form.email);

    const isActiveBcba = form.qualificationPath === 'active_bcba';
    const isDoctorate = form.qualificationPath === 'doctorate_behavior_analysis';
    const isDoctorateWithExp = [
      'doctorate_with_coursework',
      'doctorate_with_mentorship',
      'doctorate_with_publications',
      'doctorate_with_postdoc_hours',
    ].includes(form.qualificationPath);

    let step2Valid = false;
    if (isActiveBcba) {
      step2Valid = !!(form.certificationNumber && form.certificationDate && form.certificationExpiration);
    } else if (isDoctorate) {
      step2Valid = !!(form.doctorateType && form.institution && form.graduationYear && form.major);
    } else if (isDoctorateWithExp) {
      const baseValid = !!(form.doctorateType && form.institution && form.graduationYear && form.major);
      let subValid = false;
      if (form.qualificationPath === 'doctorate_with_coursework') {
        subValid = !!form.courseworkDescription;
      } else if (form.qualificationPath === 'doctorate_with_mentorship') {
        subValid = !!(form.mentorSupervisorName && form.mentorYears);
      } else if (form.qualificationPath === 'doctorate_with_publications') {
        subValid = !!(form.publicationsCount && form.publicationsList);
      } else if (form.qualificationPath === 'doctorate_with_postdoc_hours') {
        subValid = !!form.postdocHours;
      }
      step2Valid = baseValid && subValid;
    }

    let step3Valid = false;
    if (form.expertiseBasis === 'five_years_practice') {
      step3Valid = !!(form.practiceYears && Number(form.practiceYears) >= 5 && form.practiceDescription);
    } else if (form.expertiseBasis === 'three_years_teaching') {
      step3Valid = !!(form.teachingYears && Number(form.teachingYears) >= 3 && form.teachingInstitution && form.teachingDescription);
    } else if (form.expertiseBasis === 'published_research') {
      step3Valid = !!(form.researchPublicationCount && form.researchDescription);
    }

    const step4Valid = true; // Documents are optional placeholders

    return {
      1: step1Valid,
      2: step2Valid,
      3: step3Valid,
      4: step4Valid,
      5: step1Valid && step2Valid && step3Valid,
    };
  }, [form]);

  // ============================================================================
  // Submit
  // ============================================================================

  async function handleSubmit() {
    if (!providerId) return;
    setSubmitting(true);
    setError('');

    try {
      // First get or create user
      const userRes = await fetch('/api/ace/instructors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // We'll need to create the user first, then submit qualification
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          bacbId: form.bacbId,
          providerId,
          // Qualification data
          isBcba: form.qualificationPath === 'active_bcba',
          isBcbaD: false,
          isPhDAba: form.qualificationPath === 'doctorate_behavior_analysis' ||
            form.qualificationPath?.startsWith('doctorate_with_'),
          certificationNumber: form.certificationNumber || undefined,
          certificationDate: form.certificationDate ? new Date(form.certificationDate).getTime() : undefined,
          certificationExpiration: form.certificationExpiration ? new Date(form.certificationExpiration).getTime() : undefined,
          qualificationPath: form.qualificationPath || undefined,
          expertiseBasis: form.expertiseBasis || undefined,
          yearsExperienceInSubject: form.practiceYears ? Number(form.practiceYears) : undefined,
          yearsTeachingSubject: form.teachingYears ? Number(form.teachingYears) : undefined,
          cvUrl: form.cvUrl || undefined,
          transcriptUrl: form.transcriptUrl || undefined,
          certificationProofUrl: form.certificationProofUrl || undefined,
        }),
      });

      const data = await userRes.json();

      if (!userRes.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit qualification');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  }

  // ============================================================================
  // Render: Step Indicators
  // ============================================================================

  function renderStepIndicators() {
    return (
      <div className="flex items-center justify-center gap-0 mb-8">
        {STEPS.map((step, idx) => {
          const isCompleted = stepValidation[step.id as keyof typeof stepValidation] && currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const StepIcon = step.icon;

          return (
            <div key={step.id} className="flex items-center">
              <button
                type="button"
                onClick={() => setCurrentStep(step.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isCurrent
                    ? 'bg-[#1F4D3F]/10 text-[#1F4D3F] font-medium'
                    : isCompleted
                      ? 'text-emerald-600'
                      : 'text-gray-400'
                }`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium border-2 ${
                  isCurrent
                    ? 'border-[#1F4D3F] text-[#1F4D3F]'
                    : isCompleted
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : 'border-gray-300 text-gray-400'
                }`}>
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.id}
                </div>
                <span className="hidden lg:inline text-sm">{step.title}</span>
              </button>
              {idx < STEPS.length - 1 && (
                <div className={`w-8 h-px ${isCompleted ? 'bg-emerald-400' : 'bg-gray-200'}`} />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // ============================================================================
  // Render: Step 1 - Basic Info
  // ============================================================================

  function renderStep1() {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Instructor Information</h2>
          <p className="text-sm text-gray-500">Enter the instructor's basic contact information.</p>
        </div>

        <Separator />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={form.firstName}
              onChange={(e) => updateForm('firstName', e.target.value)}
              placeholder="Enter first name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={form.lastName}
              onChange={(e) => updateForm('lastName', e.target.value)}
              placeholder="Enter last name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => updateForm('email', e.target.value)}
            placeholder="instructor@example.com"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => updateForm('phone', e.target.value)}
              placeholder="(555) 000-0000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bacbId">BACB ID</Label>
            <Input
              id="bacbId"
              value={form.bacbId}
              onChange={(e) => updateForm('bacbId', e.target.value)}
              placeholder="e.g., 1-23-45678"
            />
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // Render: Step 2 - Qualification Path
  // ============================================================================

  function renderStep2() {
    const paths: { value: QualificationPath; label: string; description: string; group: string }[] = [
      {
        value: 'active_bcba',
        label: 'Path 1: Active BCBA',
        description: 'Currently holds an active BCBA certification from the BACB.',
        group: 'bcba',
      },
      {
        value: 'doctorate_behavior_analysis',
        label: 'Path 2: Doctorate in Behavior Analysis',
        description: 'Holds a doctoral degree (PhD, PsyD, EdD) in behavior analysis or a closely related field.',
        group: 'doctorate',
      },
      {
        value: 'doctorate_with_coursework',
        label: 'Path 3a: Doctorate + Qualifying Coursework',
        description: 'Doctorate in another field with qualifying behavior analysis coursework.',
        group: 'doctorate_plus',
      },
      {
        value: 'doctorate_with_mentorship',
        label: 'Path 3b: Doctorate + Mentorship',
        description: 'Doctorate with mentorship from a qualified behavior analyst.',
        group: 'doctorate_plus',
      },
      {
        value: 'doctorate_with_publications',
        label: 'Path 3c: Doctorate + Publications',
        description: 'Doctorate with published research in behavior analysis.',
        group: 'doctorate_plus',
      },
      {
        value: 'doctorate_with_postdoc_hours',
        label: 'Path 3d: Doctorate + Postdoctoral Hours',
        description: 'Doctorate with supervised postdoctoral hours in behavior analysis.',
        group: 'doctorate_plus',
      },
    ];

    const showBcbaFields = form.qualificationPath === 'active_bcba';
    const showDoctorateFields = form.qualificationPath !== '' && form.qualificationPath !== 'active_bcba';
    const showCourseworkFields = form.qualificationPath === 'doctorate_with_coursework';
    const showMentorshipFields = form.qualificationPath === 'doctorate_with_mentorship';
    const showPublicationsFields = form.qualificationPath === 'doctorate_with_publications';
    const showPostdocFields = form.qualificationPath === 'doctorate_with_postdoc_hours';

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Qualification Path</h2>
          <p className="text-sm text-gray-500">
            Select the qualification path that best describes the instructor's credentials.
          </p>
        </div>

        <Separator />

        <div className="space-y-3">
          {paths.map((path) => (
            <label
              key={path.value}
              className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                form.qualificationPath === path.value
                  ? 'border-[#1F4D3F] bg-[#1F4D3F]/5 ring-1 ring-[#1F4D3F]'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="qualificationPath"
                value={path.value}
                checked={form.qualificationPath === path.value}
                onChange={(e) => updateForm('qualificationPath', e.target.value)}
                className="mt-0.5 accent-[#1F4D3F]"
              />
              <div>
                <p className="font-medium text-gray-900">{path.label}</p>
                <p className="text-sm text-gray-500 mt-0.5">{path.description}</p>
              </div>
            </label>
          ))}
        </div>

        {/* BCBA Certification Fields */}
        {showBcbaFields && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-medium text-gray-900">BCBA Certification Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="certNumber">Certification Number *</Label>
                <Input
                  id="certNumber"
                  value={form.certificationNumber}
                  onChange={(e) => updateForm('certificationNumber', e.target.value)}
                  placeholder="e.g., 1-23-45678"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="certDate">Certification Date *</Label>
                <Input
                  id="certDate"
                  type="date"
                  value={form.certificationDate}
                  onChange={(e) => updateForm('certificationDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="certExpiry">Expiration Date *</Label>
                <Input
                  id="certExpiry"
                  type="date"
                  value={form.certificationExpiration}
                  onChange={(e) => updateForm('certificationExpiration', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Doctorate Fields */}
        {showDoctorateFields && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-medium text-gray-900">Doctorate Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="docType">Degree Type *</Label>
                <select
                  id="docType"
                  value={form.doctorateType}
                  onChange={(e) => updateForm('doctorateType', e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  <option value="">Select degree type</option>
                  <option value="PhD">PhD</option>
                  <option value="PsyD">PsyD</option>
                  <option value="EdD">EdD</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="institution">Institution *</Label>
                <Input
                  id="institution"
                  value={form.institution}
                  onChange={(e) => updateForm('institution', e.target.value)}
                  placeholder="University name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gradYear">Graduation Year *</Label>
                <Input
                  id="gradYear"
                  type="number"
                  value={form.graduationYear}
                  onChange={(e) => updateForm('graduationYear', e.target.value)}
                  placeholder="e.g., 2020"
                  min="1960"
                  max="2030"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="major">Major / Field of Study *</Label>
                <Input
                  id="major"
                  value={form.major}
                  onChange={(e) => updateForm('major', e.target.value)}
                  placeholder="e.g., Behavior Analysis"
                />
              </div>
            </div>

            {/* Coursework sub-fields */}
            {showCourseworkFields && (
              <div className="mt-4 space-y-3 p-3 bg-white rounded border border-gray-200">
                <h4 className="text-sm font-medium text-gray-800">Qualifying Coursework</h4>
                <div className="space-y-2">
                  <Label htmlFor="coursework">Description of Qualifying Coursework *</Label>
                  <Textarea
                    id="coursework"
                    value={form.courseworkDescription}
                    onChange={(e) => updateForm('courseworkDescription', e.target.value)}
                    placeholder="Describe relevant coursework completed..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Coursework Documentation</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-sm text-gray-500">
                    <Upload className="w-5 h-5 mx-auto mb-2 text-gray-400" />
                    File upload will be available after initial setup
                  </div>
                </div>
              </div>
            )}

            {/* Mentorship sub-fields */}
            {showMentorshipFields && (
              <div className="mt-4 space-y-3 p-3 bg-white rounded border border-gray-200">
                <h4 className="text-sm font-medium text-gray-800">Mentorship Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mentorName">Supervisor/Mentor Name *</Label>
                    <Input
                      id="mentorName"
                      value={form.mentorSupervisorName}
                      onChange={(e) => updateForm('mentorSupervisorName', e.target.value)}
                      placeholder="Name of supervising mentor"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mentorYears">Years of Mentorship *</Label>
                    <Input
                      id="mentorYears"
                      type="number"
                      value={form.mentorYears}
                      onChange={(e) => updateForm('mentorYears', e.target.value)}
                      placeholder="e.g., 3"
                      min="1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Mentorship Documentation</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-sm text-gray-500">
                    <Upload className="w-5 h-5 mx-auto mb-2 text-gray-400" />
                    File upload will be available after initial setup
                  </div>
                </div>
              </div>
            )}

            {/* Publications sub-fields */}
            {showPublicationsFields && (
              <div className="mt-4 space-y-3 p-3 bg-white rounded border border-gray-200">
                <h4 className="text-sm font-medium text-gray-800">Published Research</h4>
                <div className="space-y-2">
                  <Label htmlFor="pubCount">Number of Publications *</Label>
                  <Input
                    id="pubCount"
                    type="number"
                    value={form.publicationsCount}
                    onChange={(e) => updateForm('publicationsCount', e.target.value)}
                    placeholder="e.g., 5"
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pubList">Publication List *</Label>
                  <Textarea
                    id="pubList"
                    value={form.publicationsList}
                    onChange={(e) => updateForm('publicationsList', e.target.value)}
                    placeholder="List publications (one per line)..."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Publications Documentation</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-sm text-gray-500">
                    <Upload className="w-5 h-5 mx-auto mb-2 text-gray-400" />
                    File upload will be available after initial setup
                  </div>
                </div>
              </div>
            )}

            {/* Postdoctoral Hours sub-fields */}
            {showPostdocFields && (
              <div className="mt-4 space-y-3 p-3 bg-white rounded border border-gray-200">
                <h4 className="text-sm font-medium text-gray-800">Postdoctoral Hours</h4>
                <div className="space-y-2">
                  <Label htmlFor="postdocHours">Total Supervised Postdoc Hours *</Label>
                  <Input
                    id="postdocHours"
                    type="number"
                    value={form.postdocHours}
                    onChange={(e) => updateForm('postdocHours', e.target.value)}
                    placeholder="e.g., 1500"
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hours Documentation</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-sm text-gray-500">
                    <Upload className="w-5 h-5 mx-auto mb-2 text-gray-400" />
                    File upload will be available after initial setup
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // Render: Step 3 - Subject-Matter Expertise
  // ============================================================================

  function renderStep3() {
    const options: { value: ExpertiseBasis; label: string; description: string }[] = [
      {
        value: 'five_years_practice',
        label: 'Option A: 5+ Years Practice Experience',
        description: 'At least 5 years of practice experience in the subject area being taught.',
      },
      {
        value: 'three_years_teaching',
        label: 'Option B: 3+ Years Teaching at University',
        description: 'At least 3 years of teaching experience at a college or university in the subject area.',
      },
      {
        value: 'published_research',
        label: 'Option C: Published Research',
        description: 'Published research demonstrating expertise in the subject area being taught.',
      },
    ];

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Subject-Matter Expertise</h2>
          <p className="text-sm text-gray-500">
            How does this instructor demonstrate subject-matter expertise in their teaching area?
          </p>
        </div>

        <Separator />

        <div className="space-y-3">
          {options.map((option) => (
            <label
              key={option.value}
              className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                form.expertiseBasis === option.value
                  ? 'border-[#1F4D3F] bg-[#1F4D3F]/5 ring-1 ring-[#1F4D3F]'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="expertiseBasis"
                value={option.value}
                checked={form.expertiseBasis === option.value}
                onChange={(e) => updateForm('expertiseBasis', e.target.value)}
                className="mt-0.5 accent-[#1F4D3F]"
              />
              <div>
                <p className="font-medium text-gray-900">{option.label}</p>
                <p className="text-sm text-gray-500 mt-0.5">{option.description}</p>
              </div>
            </label>
          ))}
        </div>

        {/* Practice Experience Fields */}
        {form.expertiseBasis === 'five_years_practice' && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-medium text-gray-900">Practice Experience Details</h3>
            <div className="space-y-2">
              <Label htmlFor="practiceYears">Years of Practice Experience *</Label>
              <Input
                id="practiceYears"
                type="number"
                value={form.practiceYears}
                onChange={(e) => updateForm('practiceYears', e.target.value)}
                placeholder="Minimum 5 years"
                min="5"
              />
              {form.practiceYears && Number(form.practiceYears) < 5 && (
                <p className="text-sm text-red-500">Minimum 5 years required</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="practiceDesc">Description of Practice Experience *</Label>
              <Textarea
                id="practiceDesc"
                value={form.practiceDescription}
                onChange={(e) => updateForm('practiceDescription', e.target.value)}
                placeholder="Describe your practice experience in the subject area..."
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Teaching Experience Fields */}
        {form.expertiseBasis === 'three_years_teaching' && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-medium text-gray-900">Teaching Experience Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="teachYears">Years of Teaching Experience *</Label>
                <Input
                  id="teachYears"
                  type="number"
                  value={form.teachingYears}
                  onChange={(e) => updateForm('teachingYears', e.target.value)}
                  placeholder="Minimum 3 years"
                  min="3"
                />
                {form.teachingYears && Number(form.teachingYears) < 3 && (
                  <p className="text-sm text-red-500">Minimum 3 years required</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="teachInst">Institution *</Label>
                <Input
                  id="teachInst"
                  value={form.teachingInstitution}
                  onChange={(e) => updateForm('teachingInstitution', e.target.value)}
                  placeholder="University or college name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="teachDesc">Description of Teaching Experience *</Label>
              <Textarea
                id="teachDesc"
                value={form.teachingDescription}
                onChange={(e) => updateForm('teachingDescription', e.target.value)}
                placeholder="Describe your teaching experience, courses taught, etc..."
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Published Research Fields */}
        {form.expertiseBasis === 'published_research' && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-medium text-gray-900">Published Research Details</h3>
            <div className="space-y-2">
              <Label htmlFor="resPubCount">Number of Relevant Publications *</Label>
              <Input
                id="resPubCount"
                type="number"
                value={form.researchPublicationCount}
                onChange={(e) => updateForm('researchPublicationCount', e.target.value)}
                placeholder="e.g., 5"
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resDesc">Research Description *</Label>
              <Textarea
                id="resDesc"
                value={form.researchDescription}
                onChange={(e) => updateForm('researchDescription', e.target.value)}
                placeholder="Describe your published research in the subject area..."
                rows={3}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // Render: Step 4 - Document Uploads
  // ============================================================================

  function renderStep4() {
    const documents = [
      {
        id: 'cvUrl',
        label: 'Curriculum Vitae (CV)',
        description: 'Current CV showing qualifications, publications, and experience.',
        value: form.cvUrl,
        field: 'cvUrl' as keyof FormData,
      },
      {
        id: 'transcriptUrl',
        label: 'Official Transcripts',
        description: 'Academic transcripts from degree-granting institution.',
        value: form.transcriptUrl,
        field: 'transcriptUrl' as keyof FormData,
      },
      {
        id: 'certProofUrl',
        label: 'Certification Proof',
        description: 'Copy of active certification (BCBA, doctorate, etc.).',
        value: form.certificationProofUrl,
        field: 'certificationProofUrl' as keyof FormData,
      },
      {
        id: 'verLetterUrl',
        label: 'Verification Letters',
        description: 'Letters verifying employment, teaching, or mentorship experience.',
        value: form.verificationLetterUrl,
        field: 'verificationLetterUrl' as keyof FormData,
      },
    ];

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Document Uploads</h2>
          <p className="text-sm text-gray-500">
            Upload supporting documents for the instructor's qualification. Documents can also be submitted later.
          </p>
        </div>

        <Separator />

        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <Label className="text-sm font-medium">{doc.label}</Label>
                  <p className="text-xs text-gray-500 mt-0.5">{doc.description}</p>
                </div>
                {doc.value ? (
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Uploaded</Badge>
                ) : (
                  <Badge variant="outline" className="text-gray-500">Not uploaded</Badge>
                )}
              </div>
              <div className="mt-3">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">
                    Drag and drop or click to upload
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PDF, DOC, or image files (max 10MB)
                  </p>
                  <Input
                    type="text"
                    value={doc.value}
                    onChange={(e) => updateForm(doc.field, e.target.value)}
                    placeholder="Or paste document URL here..."
                    className="mt-3 max-w-md mx-auto"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Document submission is optional at this stage</AlertTitle>
          <AlertDescription>
            You can submit the qualification first and upload documents later.
            However, all documents must be provided before the qualification can be approved.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // ============================================================================
  // Render: Step 5 - Review & Submit
  // ============================================================================

  function renderStep5() {
    const QUAL_PATH_LABELS: Record<string, string> = {
      active_bcba: 'Active BCBA',
      doctorate_behavior_analysis: 'Doctorate in Behavior Analysis',
      doctorate_with_coursework: 'Doctorate + Qualifying Coursework',
      doctorate_with_mentorship: 'Doctorate + Mentorship',
      doctorate_with_publications: 'Doctorate + Publications',
      doctorate_with_postdoc_hours: 'Doctorate + Postdoctoral Hours',
    };

    const EXPERTISE_LABELS: Record<string, string> = {
      five_years_practice: '5+ Years Practice Experience',
      three_years_teaching: '3+ Years University Teaching',
      published_research: 'Published Research',
    };

    const checklist = [
      { label: 'Basic information provided', complete: stepValidation[1] },
      { label: 'Qualification path selected and documented', complete: stepValidation[2] },
      { label: 'Subject-matter expertise documented', complete: stepValidation[3] },
      { label: 'Supporting documents (optional)', complete: !!(form.cvUrl || form.transcriptUrl || form.certificationProofUrl) },
    ];

    const allRequired = stepValidation[1] && stepValidation[2] && stepValidation[3];

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Review & Submit</h2>
          <p className="text-sm text-gray-500">
            Review the instructor qualification details before submitting for review.
          </p>
        </div>

        <Separator />

        {/* Validation Checklist */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3">Completion Checklist</h3>
          <div className="space-y-2">
            {checklist.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                {item.complete ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-300" />
                )}
                <span className={`text-sm ${item.complete ? 'text-gray-900' : 'text-gray-400'}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Sections */}
        <div className="space-y-4">
          {/* Basic Info Summary */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Instructor Information</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)}>
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <dt className="text-gray-500">Name</dt>
                  <dd className="font-medium text-gray-900">{form.firstName} {form.lastName}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Email</dt>
                  <dd className="font-medium text-gray-900">{form.email}</dd>
                </div>
                {form.phone && (
                  <div>
                    <dt className="text-gray-500">Phone</dt>
                    <dd className="font-medium text-gray-900">{form.phone}</dd>
                  </div>
                )}
                {form.bacbId && (
                  <div>
                    <dt className="text-gray-500">BACB ID</dt>
                    <dd className="font-medium text-gray-900">{form.bacbId}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          {/* Qualification Path Summary */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Qualification Path</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setCurrentStep(2)}>
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-gray-500">Selected Path</dt>
                  <dd className="font-medium text-gray-900">
                    {form.qualificationPath ? QUAL_PATH_LABELS[form.qualificationPath] : 'Not selected'}
                  </dd>
                </div>
                {form.qualificationPath === 'active_bcba' && form.certificationNumber && (
                  <>
                    <div>
                      <dt className="text-gray-500">Certification Number</dt>
                      <dd className="font-medium text-gray-900">{form.certificationNumber}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Valid</dt>
                      <dd className="font-medium text-gray-900">
                        {form.certificationDate} to {form.certificationExpiration}
                      </dd>
                    </div>
                  </>
                )}
                {form.doctorateType && (
                  <>
                    <div>
                      <dt className="text-gray-500">Degree</dt>
                      <dd className="font-medium text-gray-900">{form.doctorateType} in {form.major}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Institution</dt>
                      <dd className="font-medium text-gray-900">{form.institution} ({form.graduationYear})</dd>
                    </div>
                  </>
                )}
              </dl>
            </CardContent>
          </Card>

          {/* Expertise Summary */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Subject-Matter Expertise</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setCurrentStep(3)}>
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-gray-500">Expertise Basis</dt>
                  <dd className="font-medium text-gray-900">
                    {form.expertiseBasis ? EXPERTISE_LABELS[form.expertiseBasis] : 'Not selected'}
                  </dd>
                </div>
                {form.expertiseBasis === 'five_years_practice' && form.practiceYears && (
                  <div>
                    <dt className="text-gray-500">Years of Experience</dt>
                    <dd className="font-medium text-gray-900">{form.practiceYears} years</dd>
                  </div>
                )}
                {form.expertiseBasis === 'three_years_teaching' && form.teachingYears && (
                  <>
                    <div>
                      <dt className="text-gray-500">Years Teaching</dt>
                      <dd className="font-medium text-gray-900">{form.teachingYears} years</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Institution</dt>
                      <dd className="font-medium text-gray-900">{form.teachingInstitution}</dd>
                    </div>
                  </>
                )}
                {form.expertiseBasis === 'published_research' && form.researchPublicationCount && (
                  <div>
                    <dt className="text-gray-500">Publications</dt>
                    <dd className="font-medium text-gray-900">{form.researchPublicationCount} publication(s)</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          {/* Documents Summary */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Documents</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setCurrentStep(4)}>
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {[
                  { label: 'CV', value: form.cvUrl },
                  { label: 'Transcripts', value: form.transcriptUrl },
                  { label: 'Certification Proof', value: form.certificationProofUrl },
                  { label: 'Verification Letters', value: form.verificationLetterUrl },
                ].map((doc) => (
                  <div key={doc.label} className="flex items-center justify-between">
                    <span className="text-gray-600">{doc.label}</span>
                    {doc.value ? (
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                        Uploaded
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-400">
                        Not provided
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {!allRequired && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Incomplete submission</AlertTitle>
            <AlertDescription>
              Please complete all required steps before submitting. Check the completion checklist above.
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  }

  // ============================================================================
  // Success Screen
  // ============================================================================

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#1F4D3F' }}>
              <Check className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Qualification Submitted</h2>
            <p className="text-gray-500 mb-6">
              The instructor qualification for {form.firstName} {form.lastName} has been submitted
              and is pending review by the ACE coordinator.
            </p>
            <div className="space-y-3">
              <Button
                className="w-full text-white"
                style={{ backgroundColor: '#1F4D3F' }}
                onClick={() => router.push(`/ace/instructors?provider_id=${providerId}`)}
              >
                View All Instructors
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setForm(INITIAL_FORM);
                  setCurrentStep(1);
                  setSuccess(false);
                }}
              >
                Add Another Instructor
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ============================================================================
  // Main Render
  // ============================================================================

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/ace/instructors?provider_id=${providerId}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#1F4D3F' }}>
              Add Instructor Qualification
            </h1>
            <p className="text-sm text-gray-500">
              Submit a new instructor qualification for review.
            </p>
          </div>
        </div>

        {/* Step Indicators */}
        {renderStepIndicators()}

        {/* Form Card */}
        <Card>
          <CardContent className="p-6">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
            {currentStep === 5 && renderStep5()}

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep < 5 ? (
                <Button
                  onClick={() => setCurrentStep((s) => Math.min(5, s + 1))}
                  className="text-white"
                  style={{ backgroundColor: '#1F4D3F' }}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={submitting || !stepValidation[5]}
                  className="text-white"
                  style={{ backgroundColor: '#D4AF37' }}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Submit for Review
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
