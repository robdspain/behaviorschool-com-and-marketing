'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
  Building2,
  User,
  Shield,
  CreditCard,
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Upload,
  Globe,
  Phone,
  Mail,
} from 'lucide-react';

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------

interface BasicInfoData {
  providerName: string;
  providerType: 'individual' | 'organization';
  primaryEmail: string;
  primaryPhone: string;
  website: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface CoordinatorData {
  coordinatorName: string;
  coordinatorEmail: string;
  bacbId: string;
  yearsCertified: number;
  certificationDate: string;
  expirationDate: string;
}

interface LegalEntityData {
  ein: string;
  incorporationDocUrl: string;
  businessLicenseUrl: string;
}

interface LeadershipAttestationData {
  attestorName: string;
  attestorTitle: string;
  attestorEmail: string;
  attestsLegalEntity: boolean;
  attestsCoordinatorAppointment: boolean;
  attestsComplianceCommitment: boolean;
  signatureUrl: string;
}

interface FormData {
  basicInfo: BasicInfoData;
  coordinator: CoordinatorData;
  legalEntity: LegalEntityData;
  leadershipAttestation: LeadershipAttestationData;
  paymentComplete: boolean;
}

const STEPS = [
  { id: 1, label: 'Basic Info', icon: Building2 },
  { id: 2, label: 'Coordinator', icon: User },
  { id: 3, label: 'Legal Entity', icon: FileText },
  { id: 4, label: 'Attestation', icon: Shield },
  { id: 5, label: 'Payment', icon: CreditCard },
  { id: 6, label: 'Review', icon: CheckCircle },
];

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC',
];

// --------------------------------------------------------------------------
// Progress Indicator
// --------------------------------------------------------------------------

function StepIndicator({
  currentStep,
  isOrganization,
}: {
  currentStep: number;
  isOrganization: boolean;
}) {
  const visibleSteps = isOrganization
    ? STEPS
    : STEPS.filter((s) => s.id !== 3);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {visibleSteps.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                    isCompleted
                      ? 'border-[#1F4D3F] bg-[#1F4D3F] text-white'
                      : isCurrent
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                        : 'border-gray-300 bg-white text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-medium ${
                    isCurrent
                      ? 'text-[#D4AF37]'
                      : isCompleted
                        ? 'text-[#1F4D3F]'
                        : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {idx < visibleSteps.length - 1 && (
                <div
                  className={`mx-2 hidden h-0.5 w-12 sm:block lg:w-20 ${
                    currentStep > step.id ? 'bg-[#1F4D3F]' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// Step 1: Basic Info
// --------------------------------------------------------------------------

function StepBasicInfo({
  data,
  onUpdate,
  errors,
}: {
  data: BasicInfoData;
  onUpdate: (data: Partial<BasicInfoData>) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#1F4D3F]">
          Provider Information
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter basic information about the ACE provider organization or
          individual.
        </p>
      </div>

      <div className="space-y-4">
        {/* Provider Name */}
        <div className="space-y-2">
          <Label htmlFor="providerName">
            Provider Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="providerName"
            placeholder="e.g., Behavior Analysis Institute"
            value={data.providerName}
            onChange={(e) => onUpdate({ providerName: e.target.value })}
          />
          {errors.providerName && (
            <p className="text-sm text-red-500">{errors.providerName}</p>
          )}
        </div>

        {/* Provider Type */}
        <div className="space-y-2">
          <Label>
            Provider Type <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => onUpdate({ providerType: 'individual' })}
              className={`flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-colors ${
                data.providerType === 'individual'
                  ? 'border-[#1F4D3F] bg-[#1F4D3F]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <User
                className={`h-6 w-6 ${
                  data.providerType === 'individual'
                    ? 'text-[#1F4D3F]'
                    : 'text-gray-400'
                }`}
              />
              <div>
                <p className="font-medium">Individual</p>
                <p className="text-xs text-muted-foreground">
                  Single BCBA provider
                </p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => onUpdate({ providerType: 'organization' })}
              className={`flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-colors ${
                data.providerType === 'organization'
                  ? 'border-[#1F4D3F] bg-[#1F4D3F]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Building2
                className={`h-6 w-6 ${
                  data.providerType === 'organization'
                    ? 'text-[#1F4D3F]'
                    : 'text-gray-400'
                }`}
              />
              <div>
                <p className="font-medium">Organization</p>
                <p className="text-xs text-muted-foreground">
                  Company or institution
                </p>
              </div>
            </button>
          </div>
        </div>

        <Separator />

        {/* Contact Info */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="primaryEmail">
              Primary Email <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="primaryEmail"
                type="email"
                placeholder="contact@example.com"
                value={data.primaryEmail}
                onChange={(e) => onUpdate({ primaryEmail: e.target.value })}
                className="pl-10"
              />
            </div>
            {errors.primaryEmail && (
              <p className="text-sm text-red-500">{errors.primaryEmail}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="primaryPhone">Phone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="primaryPhone"
                type="tel"
                placeholder="(555) 123-4567"
                value={data.primaryPhone}
                onChange={(e) => onUpdate({ primaryPhone: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="website"
              type="url"
              placeholder="https://www.example.com"
              value={data.website}
              onChange={(e) => onUpdate({ website: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        <Separator />

        {/* Address */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Address</Label>
          <div className="space-y-2">
            <Input
              placeholder="Address Line 1"
              value={data.addressLine1}
              onChange={(e) => onUpdate({ addressLine1: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Input
              placeholder="Address Line 2 (optional)"
              value={data.addressLine2}
              onChange={(e) => onUpdate({ addressLine2: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="col-span-2 md:col-span-1">
              <Input
                placeholder="City"
                value={data.city}
                onChange={(e) => onUpdate({ city: e.target.value })}
              />
            </div>
            <div>
              <select
                value={data.state}
                onChange={(e) => onUpdate({ state: e.target.value })}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <option value="">State</option>
                {US_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Input
                placeholder="ZIP Code"
                value={data.zipCode}
                onChange={(e) => onUpdate({ zipCode: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// Step 2: Coordinator
// --------------------------------------------------------------------------

function StepCoordinator({
  data,
  onUpdate,
  errors,
}: {
  data: CoordinatorData;
  onUpdate: (data: Partial<CoordinatorData>) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#1F4D3F]">
          ACE Coordinator
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The ACE Coordinator must be an active BCBA who oversees all CE
          activities. They must have maintained certification for the required
          period.
        </p>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertTitle>Coordinator Requirements</AlertTitle>
        <AlertDescription>
          The coordinator must be a Board Certified Behavior Analyst (BCBA) in
          good standing with active certification throughout the provider
          approval period.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="coordinatorName">
              Coordinator Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="coordinatorName"
              placeholder="Jane Doe"
              value={data.coordinatorName}
              onChange={(e) => onUpdate({ coordinatorName: e.target.value })}
            />
            {errors.coordinatorName && (
              <p className="text-sm text-red-500">{errors.coordinatorName}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="coordinatorEmail">
              Coordinator Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="coordinatorEmail"
              type="email"
              placeholder="coordinator@example.com"
              value={data.coordinatorEmail}
              onChange={(e) => onUpdate({ coordinatorEmail: e.target.value })}
            />
            {errors.coordinatorEmail && (
              <p className="text-sm text-red-500">{errors.coordinatorEmail}</p>
            )}
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="bacbId">
              BACB Certification ID <span className="text-red-500">*</span>
            </Label>
            <Input
              id="bacbId"
              placeholder="1-XX-XXXXX"
              value={data.bacbId}
              onChange={(e) => onUpdate({ bacbId: e.target.value })}
            />
            {errors.bacbId && (
              <p className="text-sm text-red-500">{errors.bacbId}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="yearsCertified">
              Years Certified <span className="text-red-500">*</span>
            </Label>
            <Input
              id="yearsCertified"
              type="number"
              min={0}
              placeholder="5"
              value={data.yearsCertified || ''}
              onChange={(e) =>
                onUpdate({ yearsCertified: parseInt(e.target.value) || 0 })
              }
            />
            {errors.yearsCertified && (
              <p className="text-sm text-red-500">{errors.yearsCertified}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="certificationDate">Certification Date</Label>
            <Input
              id="certificationDate"
              type="date"
              value={data.certificationDate}
              onChange={(e) =>
                onUpdate({ certificationDate: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expirationDate">Certification Expiration</Label>
            <Input
              id="expirationDate"
              type="date"
              value={data.expirationDate}
              onChange={(e) => onUpdate({ expirationDate: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// Step 3: Legal Entity (organizations only)
// --------------------------------------------------------------------------

function StepLegalEntity({
  data,
  onUpdate,
  errors,
}: {
  data: LegalEntityData;
  onUpdate: (data: Partial<LegalEntityData>) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#1F4D3F]">
          Legal Entity Verification
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Organization providers must verify their legal entity status. Provide
          your EIN and supporting documentation.
        </p>
      </div>

      <Alert>
        <FileText className="h-4 w-4" />
        <AlertTitle>Required for Organizations</AlertTitle>
        <AlertDescription>
          All organization providers must submit legal entity documentation as
          part of the 2026 BACB requirements. This includes an EIN and
          incorporation documents.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ein">
            Employer Identification Number (EIN){' '}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            id="ein"
            placeholder="XX-XXXXXXX"
            value={data.ein}
            onChange={(e) => onUpdate({ ein: e.target.value })}
          />
          {errors.ein && <p className="text-sm text-red-500">{errors.ein}</p>}
          <p className="text-xs text-muted-foreground">
            Format: XX-XXXXXXX (9 digits with a dash)
          </p>
        </div>

        <Separator />

        {/* Incorporation Document Upload */}
        <div className="space-y-2">
          <Label>Incorporation Document</Label>
          <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 transition-colors hover:border-[#1F4D3F]/50">
            <div className="text-center">
              <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">
                Upload incorporation document
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                PDF, PNG, or JPG up to 10MB
              </p>
              <Button variant="outline" className="mt-4" type="button">
                Select File
              </Button>
            </div>
          </div>
        </div>

        {/* Business License Upload */}
        <div className="space-y-2">
          <Label>Business License</Label>
          <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 transition-colors hover:border-[#1F4D3F]/50">
            <div className="text-center">
              <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">
                Upload business license
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                PDF, PNG, or JPG up to 10MB
              </p>
              <Button variant="outline" className="mt-4" type="button">
                Select File
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// Step 4: Leadership Attestation
// --------------------------------------------------------------------------

function StepLeadershipAttestation({
  data,
  onUpdate,
  errors,
}: {
  data: LeadershipAttestationData;
  onUpdate: (data: Partial<LeadershipAttestationData>) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#1F4D3F]">
          Leadership Attestation
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          A member of leadership must attest to the provider&#39;s compliance
          commitment and verify the coordinator appointment.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="attestorName">
              Attestor Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="attestorName"
              placeholder="John Smith"
              value={data.attestorName}
              onChange={(e) => onUpdate({ attestorName: e.target.value })}
            />
            {errors.attestorName && (
              <p className="text-sm text-red-500">{errors.attestorName}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="attestorTitle">
              Title / Position <span className="text-red-500">*</span>
            </Label>
            <Input
              id="attestorTitle"
              placeholder="e.g., Executive Director"
              value={data.attestorTitle}
              onChange={(e) => onUpdate({ attestorTitle: e.target.value })}
            />
            {errors.attestorTitle && (
              <p className="text-sm text-red-500">{errors.attestorTitle}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="attestorEmail">
            Attestor Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="attestorEmail"
            type="email"
            placeholder="leader@organization.com"
            value={data.attestorEmail}
            onChange={(e) => onUpdate({ attestorEmail: e.target.value })}
          />
          {errors.attestorEmail && (
            <p className="text-sm text-red-500">{errors.attestorEmail}</p>
          )}
        </div>

        <Separator />

        {/* Attestation Checkboxes */}
        <div className="space-y-4">
          <Label className="text-base font-medium">
            Attestation Declarations <span className="text-red-500">*</span>
          </Label>

          <label className="flex items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50 cursor-pointer">
            <input
              type="checkbox"
              checked={data.attestsLegalEntity}
              onChange={(e) =>
                onUpdate({ attestsLegalEntity: e.target.checked })
              }
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#1F4D3F] focus:ring-[#1F4D3F]"
            />
            <div>
              <p className="font-medium text-sm">Legal Entity Verification</p>
              <p className="text-xs text-muted-foreground">
                I attest that this organization is a legally registered entity in
                its jurisdiction and all submitted documentation is accurate and
                current.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50 cursor-pointer">
            <input
              type="checkbox"
              checked={data.attestsCoordinatorAppointment}
              onChange={(e) =>
                onUpdate({
                  attestsCoordinatorAppointment: e.target.checked,
                })
              }
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#1F4D3F] focus:ring-[#1F4D3F]"
            />
            <div>
              <p className="font-medium text-sm">Coordinator Appointment</p>
              <p className="text-xs text-muted-foreground">
                I confirm that the designated ACE Coordinator has been formally
                appointed and has the authority and resources to oversee all
                continuing education activities.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50 cursor-pointer">
            <input
              type="checkbox"
              checked={data.attestsComplianceCommitment}
              onChange={(e) =>
                onUpdate({
                  attestsComplianceCommitment: e.target.checked,
                })
              }
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#1F4D3F] focus:ring-[#1F4D3F]"
            />
            <div>
              <p className="font-medium text-sm">Compliance Commitment</p>
              <p className="text-xs text-muted-foreground">
                I commit to maintaining compliance with all BACB ACE provider
                requirements, including timely certificate issuance, feedback
                review, and accurate recordkeeping.
              </p>
            </div>
          </label>

          {errors.attestations && (
            <p className="text-sm text-red-500">{errors.attestations}</p>
          )}
        </div>

        <Separator />

        {/* Digital Signature Placeholder */}
        <div className="space-y-2">
          <Label>Digital Signature</Label>
          <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8">
            <div className="text-center">
              <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">
                Digital signature capture
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Sign here to complete the attestation
              </p>
              <div className="mt-4 h-20 w-64 mx-auto rounded border bg-gray-50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// Step 5: Payment
// --------------------------------------------------------------------------

function StepPayment({
  paymentComplete,
  onPaymentComplete,
}: {
  paymentComplete: boolean;
  onPaymentComplete: () => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#1F4D3F]">
          Application Fee
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          A one-time application fee is required to process your ACE provider
          application.
        </p>
      </div>

      <Card className="border-[#D4AF37]/30 bg-[#D4AF37]/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-[#1F4D3F]">
                ACE Provider Application Fee
              </p>
              <p className="text-sm text-muted-foreground">
                One-time, non-refundable application processing fee
              </p>
            </div>
            <p className="text-3xl font-bold text-[#1F4D3F]">$400</p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="rounded-lg border p-4">
          <h3 className="font-medium mb-2">Fee Includes:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-[#1F4D3F]" />
              Application review and processing
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-[#1F4D3F]" />
              Coordinator credential verification
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-[#1F4D3F]" />
              Legal entity verification (if applicable)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-[#1F4D3F]" />
              One year of ACE provider status upon approval
            </li>
          </ul>
        </div>

        {paymentComplete ? (
          <Alert className="border-emerald-200 bg-emerald-50">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <AlertTitle className="text-emerald-800">
              Payment Confirmed
            </AlertTitle>
            <AlertDescription className="text-emerald-700">
              Your application fee of $400.00 has been successfully processed.
              You may proceed to the review step.
            </AlertDescription>
          </Alert>
        ) : (
          <Button
            onClick={onPaymentComplete}
            className="w-full bg-[#1F4D3F] hover:bg-[#1F4D3F]/90 h-12 text-base"
          >
            <CreditCard className="mr-2 h-5 w-5" />
            Pay $400.00 with Stripe
          </Button>
        )}

        <p className="text-center text-xs text-muted-foreground">
          Payments are securely processed via Stripe. Your payment information
          is never stored on our servers.
        </p>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// Step 6: Review & Submit
// --------------------------------------------------------------------------

function StepReview({
  formData,
  isSubmitting,
}: {
  formData: FormData;
  isSubmitting: boolean;
}) {
  const { basicInfo, coordinator, legalEntity, leadershipAttestation } =
    formData;
  const isOrg = basicInfo.providerType === 'organization';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#1F4D3F]">
          Review & Submit
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Please review all the information below before submitting your
          provider application.
        </p>
      </div>

      {/* Basic Info Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="h-4 w-4 text-[#1F4D3F]" />
            Provider Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-y-2">
            <span className="text-muted-foreground">Name:</span>
            <span className="font-medium">{basicInfo.providerName}</span>
            <span className="text-muted-foreground">Type:</span>
            <span className="font-medium capitalize">
              {basicInfo.providerType}
            </span>
            <span className="text-muted-foreground">Email:</span>
            <span className="font-medium">{basicInfo.primaryEmail}</span>
            {basicInfo.primaryPhone && (
              <>
                <span className="text-muted-foreground">Phone:</span>
                <span className="font-medium">{basicInfo.primaryPhone}</span>
              </>
            )}
            {basicInfo.website && (
              <>
                <span className="text-muted-foreground">Website:</span>
                <span className="font-medium">{basicInfo.website}</span>
              </>
            )}
            {basicInfo.addressLine1 && (
              <>
                <span className="text-muted-foreground">Address:</span>
                <span className="font-medium">
                  {basicInfo.addressLine1}
                  {basicInfo.addressLine2 && `, ${basicInfo.addressLine2}`}
                  {basicInfo.city && `, ${basicInfo.city}`}
                  {basicInfo.state && `, ${basicInfo.state}`}{' '}
                  {basicInfo.zipCode}
                </span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Coordinator Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-4 w-4 text-[#1F4D3F]" />
            Coordinator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-y-2">
            <span className="text-muted-foreground">Name:</span>
            <span className="font-medium">{coordinator.coordinatorName}</span>
            <span className="text-muted-foreground">Email:</span>
            <span className="font-medium">{coordinator.coordinatorEmail}</span>
            <span className="text-muted-foreground">BACB ID:</span>
            <span className="font-medium font-mono">
              {coordinator.bacbId}
            </span>
            <span className="text-muted-foreground">Years Certified:</span>
            <span className="font-medium">{coordinator.yearsCertified}</span>
            {coordinator.certificationDate && (
              <>
                <span className="text-muted-foreground">Cert. Date:</span>
                <span className="font-medium">
                  {coordinator.certificationDate}
                </span>
              </>
            )}
            {coordinator.expirationDate && (
              <>
                <span className="text-muted-foreground">Cert. Expires:</span>
                <span className="font-medium">
                  {coordinator.expirationDate}
                </span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Legal Entity Summary (orgs only) */}
      {isOrg && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-4 w-4 text-[#1F4D3F]" />
              Legal Entity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-y-2">
              <span className="text-muted-foreground">EIN:</span>
              <span className="font-medium font-mono">
                {legalEntity.ein || 'Not provided'}
              </span>
              <span className="text-muted-foreground">
                Incorporation Doc:
              </span>
              <span className="font-medium">
                {legalEntity.incorporationDocUrl
                  ? 'Uploaded'
                  : 'Not uploaded'}
              </span>
              <span className="text-muted-foreground">Business License:</span>
              <span className="font-medium">
                {legalEntity.businessLicenseUrl
                  ? 'Uploaded'
                  : 'Not uploaded'}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leadership Attestation Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4 text-[#1F4D3F]" />
            Leadership Attestation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-y-2">
            <span className="text-muted-foreground">Attestor:</span>
            <span className="font-medium">
              {leadershipAttestation.attestorName}
            </span>
            <span className="text-muted-foreground">Title:</span>
            <span className="font-medium">
              {leadershipAttestation.attestorTitle}
            </span>
            <span className="text-muted-foreground">Email:</span>
            <span className="font-medium">
              {leadershipAttestation.attestorEmail}
            </span>
          </div>
          <Separator className="my-2" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {leadershipAttestation.attestsLegalEntity ? (
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              <span>Legal Entity Verification</span>
            </div>
            <div className="flex items-center gap-2">
              {leadershipAttestation.attestsCoordinatorAppointment ? (
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              <span>Coordinator Appointment</span>
            </div>
            <div className="flex items-center gap-2">
              {leadershipAttestation.attestsComplianceCommitment ? (
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              <span>Compliance Commitment</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <CreditCard className="h-4 w-4 text-[#1F4D3F]" />
            Payment
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <div className="flex items-center gap-2">
            {formData.paymentComplete ? (
              <>
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span className="font-medium text-emerald-700">
                  $400.00 - Payment confirmed
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <span className="font-medium text-amber-700">
                  $400.00 - Payment pending
                </span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {isSubmitting && (
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertTitle>Submitting Application</AlertTitle>
          <AlertDescription>
            Your provider application is being submitted. Please do not close
            this page.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

// --------------------------------------------------------------------------
// Main Component
// --------------------------------------------------------------------------

export default function NewProviderPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    basicInfo: {
      providerName: '',
      providerType: 'individual',
      primaryEmail: '',
      primaryPhone: '',
      website: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
    },
    coordinator: {
      coordinatorName: '',
      coordinatorEmail: '',
      bacbId: '',
      yearsCertified: 0,
      certificationDate: '',
      expirationDate: '',
    },
    legalEntity: {
      ein: '',
      incorporationDocUrl: '',
      businessLicenseUrl: '',
    },
    leadershipAttestation: {
      attestorName: '',
      attestorTitle: '',
      attestorEmail: '',
      attestsLegalEntity: false,
      attestsCoordinatorAppointment: false,
      attestsComplianceCommitment: false,
      signatureUrl: '',
    },
    paymentComplete: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const isOrganization = formData.basicInfo.providerType === 'organization';

  // Determine the actual step (skip step 3 for individuals)
  function getEffectiveStep(step: number): number {
    if (!isOrganization && step >= 3) return step + 1;
    return step;
  }

  function getDisplayStep(effectiveStep: number): number {
    if (!isOrganization && effectiveStep >= 4) return effectiveStep - 1;
    return effectiveStep;
  }

  const totalSteps = isOrganization ? 6 : 5;

  // Validation per step
  function validateStep(step: number): boolean {
    const newErrors: Record<string, string> = {};
    const effective = getEffectiveStep(step);

    if (effective === 1) {
      if (!formData.basicInfo.providerName.trim())
        newErrors.providerName = 'Provider name is required';
      if (!formData.basicInfo.primaryEmail.trim())
        newErrors.primaryEmail = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.basicInfo.primaryEmail))
        newErrors.primaryEmail = 'Please enter a valid email address';
    }

    if (effective === 2) {
      if (!formData.coordinator.coordinatorName.trim())
        newErrors.coordinatorName = 'Coordinator name is required';
      if (!formData.coordinator.coordinatorEmail.trim())
        newErrors.coordinatorEmail = 'Coordinator email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.coordinator.coordinatorEmail))
        newErrors.coordinatorEmail = 'Please enter a valid email address';
      if (!formData.coordinator.bacbId.trim())
        newErrors.bacbId = 'BACB ID is required';
      if (!formData.coordinator.yearsCertified || formData.coordinator.yearsCertified < 1)
        newErrors.yearsCertified = 'Years certified must be at least 1';
    }

    if (effective === 3 && isOrganization) {
      if (!formData.legalEntity.ein.trim())
        newErrors.ein = 'EIN is required for organizations';
    }

    if (effective === 4) {
      if (!formData.leadershipAttestation.attestorName.trim())
        newErrors.attestorName = 'Attestor name is required';
      if (!formData.leadershipAttestation.attestorTitle.trim())
        newErrors.attestorTitle = 'Attestor title is required';
      if (!formData.leadershipAttestation.attestorEmail.trim())
        newErrors.attestorEmail = 'Attestor email is required';
      if (
        !formData.leadershipAttestation.attestsLegalEntity ||
        !formData.leadershipAttestation.attestsCoordinatorAppointment ||
        !formData.leadershipAttestation.attestsComplianceCommitment
      )
        newErrors.attestations = 'All attestation checkboxes must be checked';
    }

    if (effective === 5) {
      if (!formData.paymentComplete)
        newErrors.payment = 'Payment must be completed before proceeding';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleNext() {
    if (!validateStep(currentStep)) return;
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  }

  function handlePrev() {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // First, we need to create or look up the coordinator as an aceUser
      // For now, we'll send the coordinator info and let the API handle it
      const response = await fetch('/api/ace/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerName: formData.basicInfo.providerName,
          providerType: formData.basicInfo.providerType,
          // The coordinator ID will need to be resolved server-side
          // For now, pass the email so the API can look up / create the user
          coordinatorId: formData.coordinator.coordinatorEmail,
          coordinatorYearsCertified: formData.coordinator.yearsCertified,
          primaryEmail: formData.basicInfo.primaryEmail,
          primaryPhone: formData.basicInfo.primaryPhone || undefined,
          website: formData.basicInfo.website || undefined,
          addressLine1: formData.basicInfo.addressLine1 || undefined,
          addressLine2: formData.basicInfo.addressLine2 || undefined,
          city: formData.basicInfo.city || undefined,
          state: formData.basicInfo.state || undefined,
          zipCode: formData.basicInfo.zipCode || undefined,
          country: formData.basicInfo.country || undefined,
          // Additional data to be processed
          coordinatorName: formData.coordinator.coordinatorName,
          coordinatorBacbId: formData.coordinator.bacbId,
          coordinatorCertificationDate: formData.coordinator.certificationDate || undefined,
          coordinatorExpirationDate: formData.coordinator.expirationDate || undefined,
          // Legal entity (organizations)
          ein: formData.legalEntity.ein || undefined,
          // Leadership attestation
          leadershipName: formData.leadershipAttestation.attestorName || undefined,
          leadershipTitle: formData.leadershipAttestation.attestorTitle || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      // Redirect to the provider detail page
      if (data.provider?._id) {
        router.push(`/ace/providers/${data.provider._id}`);
      } else {
        router.push('/ace/providers');
      }
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function renderStep() {
    const effective = getEffectiveStep(currentStep);

    switch (effective) {
      case 1:
        return (
          <StepBasicInfo
            data={formData.basicInfo}
            onUpdate={(updates) =>
              setFormData((prev) => ({
                ...prev,
                basicInfo: { ...prev.basicInfo, ...updates },
              }))
            }
            errors={errors}
          />
        );
      case 2:
        return (
          <StepCoordinator
            data={formData.coordinator}
            onUpdate={(updates) =>
              setFormData((prev) => ({
                ...prev,
                coordinator: { ...prev.coordinator, ...updates },
              }))
            }
            errors={errors}
          />
        );
      case 3:
        return (
          <StepLegalEntity
            data={formData.legalEntity}
            onUpdate={(updates) =>
              setFormData((prev) => ({
                ...prev,
                legalEntity: { ...prev.legalEntity, ...updates },
              }))
            }
            errors={errors}
          />
        );
      case 4:
        return (
          <StepLeadershipAttestation
            data={formData.leadershipAttestation}
            onUpdate={(updates) =>
              setFormData((prev) => ({
                ...prev,
                leadershipAttestation: {
                  ...prev.leadershipAttestation,
                  ...updates,
                },
              }))
            }
            errors={errors}
          />
        );
      case 5:
        return (
          <StepPayment
            paymentComplete={formData.paymentComplete}
            onPaymentComplete={() =>
              setFormData((prev) => ({ ...prev, paymentComplete: true }))
            }
          />
        );
      case 6:
        return (
          <StepReview formData={formData} isSubmitting={isSubmitting} />
        );
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1F4D3F] text-white">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/ace/providers')}
            className="mb-4 text-green-100 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Providers
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            New Provider Application
          </h1>
          <p className="mt-2 text-green-100">
            Apply to become an ACE Authorized Continuing Education provider
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Step Indicator */}
        <StepIndicator
          currentStep={getEffectiveStep(currentStep)}
          isOrganization={isOrganization}
        />

        {/* Step Content */}
        <Card>
          <CardContent className="p-6 md:p-8">{renderStep()}</CardContent>
        </Card>

        {/* Error Display */}
        {submitError && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Submission Error</AlertTitle>
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 1 || isSubmitting}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <span className="text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </span>

          {currentStep === totalSteps ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.paymentComplete}
              className="bg-[#1F4D3F] hover:bg-[#1F4D3F]/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Submit Application
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="bg-[#1F4D3F] hover:bg-[#1F4D3F]/90"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
