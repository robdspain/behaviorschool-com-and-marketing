'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Calendar,
  Award,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Loader2,
  Mail,
  Shield,
  BookOpen,
  MessageSquare,
  FileText,
  RefreshCw,
  Ban,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RegistrationDetail {
  _id: string;
  eventId: string;
  participantId: string;
  confirmationCode: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  feeAmount?: number;
  feePaid: boolean;
  paymentDate?: number;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  credentialType?: string;
  attendanceVerified: boolean;
  quizCompleted: boolean;
  feedbackCompleted: boolean;
  certificateIssued: boolean;
  createdAt: number;
  updatedAt: number;
  participant?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    bacbId?: string;
    credentialType?: string;
    phone?: string;
    organization?: string;
  } | null;
  event?: {
    _id: string;
    title: string;
    startDate: number;
    endDate?: number;
    eventType?: string;
    totalCeus: number;
    ceCategory: string;
    modality: string;
    status: string;
    provider?: {
      _id: string;
      providerName: string;
    } | null;
  } | null;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bgColor: string }
> = {
  confirmed: {
    label: 'Confirmed',
    color: 'text-green-700',
    bgColor: 'bg-green-100 border-green-200',
  },
  pending: {
    label: 'Pending',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100 border-yellow-200',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'text-red-700',
    bgColor: 'bg-red-100 border-red-200',
  },
  completed: {
    label: 'Completed',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100 border-blue-200',
  },
};

const CREDENTIAL_LABELS: Record<string, string> = {
  bcba: 'BCBA',
  bcaba: 'BCaBA',
  rbt: 'RBT',
  other: 'Other',
  pending: 'Pending',
};

const CATEGORY_LABELS: Record<string, string> = {
  learning: 'Learning',
  ethics: 'Ethics',
  supervision: 'Supervision',
  teaching: 'Teaching',
};

const MODALITY_LABELS: Record<string, string> = {
  in_person: 'In Person',
  synchronous: 'Live Online',
  asynchronous: 'Self-Paced',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function RegistrationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const regId = params.id as string;

  const [registration, setRegistration] = useState<RegistrationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // Fetch registration details
  useEffect(() => {
    async function fetchRegistration() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/ace/registrations/${regId}`);
        if (!res.ok) {
          throw new Error('Registration not found');
        }
        const data = await res.json();
        setRegistration(data.registration);
      } catch (err) {
        console.error('Failed to fetch registration:', err);
        setError('Unable to load registration details.');
      } finally {
        setLoading(false);
      }
    }
    fetchRegistration();
  }, [regId]);

  // Update completion flag
  async function updateCompletion(field: string, value: boolean) {
    if (!registration) return;
    setUpdating(true);
    setUpdateMessage(null);
    try {
      const res = await fetch(`/api/ace/registrations/${regId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });

      if (!res.ok) throw new Error('Update failed');
      const data = await res.json();
      setRegistration(data.registration);
      setUpdateMessage(`${field.replace(/([A-Z])/g, ' $1').trim()} updated successfully.`);
      setTimeout(() => setUpdateMessage(null), 3000);
    } catch (err) {
      console.error('Update error:', err);
      setUpdateMessage('Failed to update. Please try again.');
    } finally {
      setUpdating(false);
    }
  }

  // Cancel registration
  async function handleCancel() {
    if (!registration) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/ace/registrations/${regId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (!res.ok) throw new Error('Cancel failed');
      const data = await res.json();
      setRegistration(data.registration);
      setShowCancelDialog(false);
      setUpdateMessage('Registration cancelled successfully.');
    } catch (err) {
      console.error('Cancel error:', err);
      setUpdateMessage('Failed to cancel registration.');
    } finally {
      setUpdating(false);
    }
  }

  // Issue certificate (placeholder)
  async function handleIssueCertificate() {
    if (!registration) return;
    setUpdating(true);
    try {
      // First, issue the certificate via the certificates API
      const certRes = await fetch('/api/ace/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: registration.eventId,
          participant_id: registration.participantId,
        }),
      });

      if (certRes.ok) {
        // Mark certificate as issued on registration
        await updateCompletion('certificateIssued', true);
        setUpdateMessage('Certificate issued successfully.');
      } else {
        const data = await certRes.json();
        setUpdateMessage(data.error || 'Failed to issue certificate. Check eligibility.');
      }
    } catch (err) {
      console.error('Certificate issue error:', err);
      setUpdateMessage('Failed to issue certificate.');
    } finally {
      setUpdating(false);
    }
  }

  // Resend confirmation (placeholder)
  async function handleResendConfirmation() {
    setUpdateMessage('Confirmation email resend is not yet implemented.');
    setTimeout(() => setUpdateMessage(null), 3000);
  }

  // ---------------------------------------------------------------------------
  // Render: Loading
  // ---------------------------------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render: Error
  // ---------------------------------------------------------------------------

  if (error || !registration) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Registration Not Found
          </h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link href="/ace/registrations">
            <Button className="bg-[#1F4D3F] hover:bg-[#1F4D3F]/90">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Registrations
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[registration.status] || STATUS_CONFIG.pending;

  // ---------------------------------------------------------------------------
  // Render: Detail
  // ---------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/ace/registrations"
            className="inline-flex items-center text-sm text-gray-500 hover:text-[#1F4D3F] transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Registrations
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Registration Detail
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Confirmation Code:{' '}
                <code className="font-mono bg-gray-100 px-2 py-0.5 rounded text-[#1F4D3F] font-bold">
                  {registration.confirmationCode}
                </code>
              </p>
            </div>
            <Badge
              variant="outline"
              className={`text-sm px-3 py-1 ${statusCfg.bgColor} ${statusCfg.color}`}
            >
              {statusCfg.label}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Update message */}
        {updateMessage && (
          <Alert className="mb-6 border-[#1F4D3F]/20 bg-[#1F4D3F]/5">
            <CheckCircle2 className="h-4 w-4 text-[#1F4D3F]" />
            <AlertDescription className="text-[#1F4D3F]">
              {updateMessage}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Participant Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-[#1F4D3F]" />
                Participant Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-gray-500 text-xs">Name</p>
                  <p className="font-medium">
                    {registration.participant
                      ? `${registration.participant.firstName} ${registration.participant.lastName}`
                      : 'Unknown'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Email</p>
                  <p className="font-medium">{registration.participant?.email || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">BACB ID</p>
                  <p className="font-medium">{registration.participant?.bacbId || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Credential</p>
                  <p className="font-medium">
                    {CREDENTIAL_LABELS[registration.credentialType || ''] ||
                      registration.credentialType ||
                      '-'}
                  </p>
                </div>
                {registration.participant?.phone && (
                  <div>
                    <p className="text-gray-500 text-xs">Phone</p>
                    <p className="font-medium">{registration.participant.phone}</p>
                  </div>
                )}
                {registration.participant?.organization && (
                  <div>
                    <p className="text-gray-500 text-xs">Organization</p>
                    <p className="font-medium">{registration.participant.organization}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Event Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#1F4D3F]" />
                Event Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500 text-xs">Event</p>
                <p className="font-medium">{registration.event?.title || 'Unknown'}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-gray-500 text-xs">Date</p>
                  <p className="font-medium">
                    {registration.event?.startDate
                      ? new Date(registration.event.startDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Type</p>
                  <p className="font-medium">
                    {registration.event?.eventType === 'pd' ? 'PD' : 'CE'} -{' '}
                    {CATEGORY_LABELS[registration.event?.ceCategory || ''] || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">
                    {registration.event?.eventType === 'pd' ? 'PDUs' : 'CEUs'}
                  </p>
                  <p className="font-medium text-[#1F4D3F]">
                    {registration.event?.totalCeus || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Modality</p>
                  <p className="font-medium">
                    {MODALITY_LABELS[registration.event?.modality || ''] || '-'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-[#1F4D3F]" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-gray-500 text-xs">Amount</p>
                  <p className="font-medium">
                    {registration.feeAmount && registration.feeAmount > 0
                      ? `$${registration.feeAmount.toFixed(2)}`
                      : 'Free'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Payment Status</p>
                  <Badge
                    variant="outline"
                    className={
                      registration.feePaid
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : registration.feeAmount && registration.feeAmount > 0
                          ? 'bg-orange-50 text-orange-700 border-orange-200'
                          : 'bg-gray-50 text-gray-500 border-gray-200'
                    }
                  >
                    {registration.feePaid
                      ? 'Paid'
                      : registration.feeAmount && registration.feeAmount > 0
                        ? 'Unpaid'
                        : 'N/A'}
                  </Badge>
                </div>
                {registration.paymentDate && (
                  <div>
                    <p className="text-gray-500 text-xs">Payment Date</p>
                    <p className="font-medium">
                      {new Date(registration.paymentDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {registration.stripeSessionId && (
                  <div>
                    <p className="text-gray-500 text-xs">Stripe Session</p>
                    <p className="font-mono text-xs truncate">
                      {registration.stripeSessionId}
                    </p>
                  </div>
                )}
                {registration.stripePaymentIntentId && (
                  <div className="col-span-2">
                    <p className="text-gray-500 text-xs">Stripe Payment Intent</p>
                    <p className="font-mono text-xs truncate">
                      {registration.stripePaymentIntentId}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Completion Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#1F4D3F]" />
                Completion Tracking
              </CardTitle>
              <CardDescription className="text-xs">
                Toggle completion flags for this registration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Attendance */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2
                    className={`h-5 w-5 ${
                      registration.attendanceVerified
                        ? 'text-green-500'
                        : 'text-gray-300'
                    }`}
                  />
                  <div>
                    <Label className="font-medium">Attendance Verified</Label>
                    <p className="text-xs text-gray-500">
                      Participant attended the event
                    </p>
                  </div>
                </div>
                <Switch
                  checked={registration.attendanceVerified}
                  onCheckedChange={(checked) =>
                    updateCompletion('attendanceVerified', checked)
                  }
                  disabled={updating || registration.status === 'cancelled'}
                />
              </div>

              <Separator />

              {/* Quiz */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen
                    className={`h-5 w-5 ${
                      registration.quizCompleted
                        ? 'text-green-500'
                        : 'text-gray-300'
                    }`}
                  />
                  <div>
                    <Label className="font-medium">Quiz Completed</Label>
                    <p className="text-xs text-gray-500">
                      Post-event quiz passed
                    </p>
                  </div>
                </div>
                <Switch
                  checked={registration.quizCompleted}
                  onCheckedChange={(checked) =>
                    updateCompletion('quizCompleted', checked)
                  }
                  disabled={updating || registration.status === 'cancelled'}
                />
              </div>

              <Separator />

              {/* Feedback */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare
                    className={`h-5 w-5 ${
                      registration.feedbackCompleted
                        ? 'text-green-500'
                        : 'text-gray-300'
                    }`}
                  />
                  <div>
                    <Label className="font-medium">Feedback Submitted</Label>
                    <p className="text-xs text-gray-500">
                      Participant submitted event feedback
                    </p>
                  </div>
                </div>
                <Switch
                  checked={registration.feedbackCompleted}
                  onCheckedChange={(checked) =>
                    updateCompletion('feedbackCompleted', checked)
                  }
                  disabled={updating || registration.status === 'cancelled'}
                />
              </div>

              <Separator />

              {/* Certificate */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Award
                    className={`h-5 w-5 ${
                      registration.certificateIssued
                        ? 'text-[#D4AF37]'
                        : 'text-gray-300'
                    }`}
                  />
                  <div>
                    <Label className="font-medium">Certificate Issued</Label>
                    <p className="text-xs text-gray-500">
                      CE/PD certificate generated and sent
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!registration.certificateIssued && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleIssueCertificate}
                      disabled={updating || registration.status === 'cancelled'}
                      className="text-xs gap-1"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Issue
                    </Button>
                  )}
                  <Switch
                    checked={registration.certificateIssued}
                    onCheckedChange={(checked) =>
                      updateCompletion('certificateIssued', checked)
                    }
                    disabled={updating || registration.status === 'cancelled'}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Registration Metadata */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Registration Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500 text-xs">Registration ID</p>
                <p className="font-mono text-xs truncate">{registration._id}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Created</p>
                <p className="font-medium">
                  {new Date(registration.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Last Updated</p>
                <p className="font-medium">
                  {new Date(registration.updatedAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Status</p>
                <p className="font-medium">{statusCfg.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={handleResendConfirmation}
            disabled={updating || registration.status === 'cancelled'}
            className="gap-2"
          >
            <Mail className="h-4 w-4" />
            Resend Confirmation Email
          </Button>

          <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
                disabled={
                  updating ||
                  registration.status === 'cancelled' ||
                  registration.status === 'completed'
                }
              >
                <Ban className="h-4 w-4" />
                Cancel Registration
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cancel Registration</DialogTitle>
                <DialogDescription>
                  Are you sure you want to cancel this registration? This will release
                  the participant&apos;s spot and cannot be easily undone.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm text-gray-600">
                  <strong>Participant:</strong>{' '}
                  {registration.participant
                    ? `${registration.participant.firstName} ${registration.participant.lastName}`
                    : 'Unknown'}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Event:</strong> {registration.event?.title || 'Unknown'}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Code:</strong> {registration.confirmationCode}
                </p>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowCancelDialog(false)}
                >
                  Keep Registration
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleCancel}
                  disabled={updating}
                  className="gap-2"
                >
                  {updating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Ban className="h-4 w-4" />
                  )}
                  Cancel Registration
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
