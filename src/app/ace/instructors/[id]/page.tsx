'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  XCircle,
  Clock,
  ShieldCheck,
  ShieldX,
  User,
  GraduationCap,
  Award,
  FileText,
  ExternalLink,
  Loader2,
  AlertCircle,
  Calendar,
  Hash,
  Building2,
  BookOpen,
  Briefcase,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

interface Qualification {
  _id: string;
  userId: string;
  providerId: string;
  isBcba: boolean;
  isBcbaD: boolean;
  isPhDAba: boolean;
  certificationNumber?: string;
  certificationDate?: number;
  certificationExpiration?: number;
  cvUrl?: string;
  transcriptUrl?: string;
  certificationProofUrl?: string;
  qualificationPath?: string;
  expertiseBasis?: string;
  yearsExperienceInSubject?: number;
  yearsTeachingSubject?: number;
  isApproved: boolean;
  verifiedBy?: string;
  verifiedAt?: number;
  qualificationReviewNotes?: string;
  createdAt: number;
  updatedAt: number;
  user?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    bacbId?: string;
    role: string;
  };
  provider?: {
    _id: string;
    providerName: string;
  };
  verifier?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

const QUALIFICATION_PATH_LABELS: Record<string, string> = {
  active_bcba: 'Active BCBA',
  doctorate_behavior_analysis: 'Doctorate in Behavior Analysis',
  doctorate_with_coursework: 'Doctorate + Qualifying Coursework',
  doctorate_with_mentorship: 'Doctorate + Mentorship',
  doctorate_with_publications: 'Doctorate + Publications',
  doctorate_with_postdoc_hours: 'Doctorate + Postdoctoral Hours',
};

const EXPERTISE_BASIS_LABELS: Record<string, string> = {
  five_years_practice: '5+ Years Practice Experience',
  three_years_teaching: '3+ Years University Teaching',
  published_research: 'Published Research',
};

const QUALIFICATION_PATH_DESCRIPTIONS: Record<string, string> = {
  active_bcba: 'This instructor holds an active BCBA certification from the BACB, meeting the base qualification requirement.',
  doctorate_behavior_analysis: 'This instructor holds a doctoral degree in behavior analysis or a closely related field.',
  doctorate_with_coursework: 'This instructor holds a doctoral degree in another field and has completed qualifying coursework in behavior analysis.',
  doctorate_with_mentorship: 'This instructor holds a doctoral degree and was mentored by a qualified behavior analyst.',
  doctorate_with_publications: 'This instructor holds a doctoral degree and has published research in behavior analysis.',
  doctorate_with_postdoc_hours: 'This instructor holds a doctoral degree and has completed supervised postdoctoral hours in behavior analysis.',
};

// ============================================================================
// Component
// ============================================================================

export default function InstructorDetailPage() {
  const router = useRouter();
  const params = useParams();
  const qualificationId = params.id as string;

  const [qualification, setQualification] = useState<Qualification | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(null);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const providerId = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('provider_id')
    : null;

  useEffect(() => {
    async function fetchQualification() {
      try {
        const res = await fetch(`/api/ace/instructors/${qualificationId}`);
        const data = await res.json();
        if (data.success) {
          setQualification(data.qualification);
        }
      } catch (error) {
        console.error('Error fetching qualification:', error);
      } finally {
        setLoading(false);
      }
    }

    if (qualificationId) {
      fetchQualification();
    }
  }, [qualificationId]);

  // ============================================================================
  // Review handlers
  // ============================================================================

  async function handleReview(action: 'approve' | 'reject') {
    if (action === 'reject' && !reviewNotes.trim()) {
      setReviewError('Notes are required when rejecting a qualification.');
      return;
    }

    setSubmittingReview(true);
    setReviewError('');
    setReviewSuccess('');

    try {
      // In production, reviewerId would come from auth context
      const reviewerId = qualification?.user?._id;
      if (!reviewerId) {
        throw new Error('Unable to determine reviewer ID');
      }

      const res = await fetch(`/api/ace/instructors/${qualificationId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          notes: reviewNotes || undefined,
          reviewerId,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit review');
      }

      setReviewSuccess(`Qualification ${action === 'approve' ? 'approved' : 'rejected'} successfully.`);
      setReviewAction(null);

      // Refresh data
      const refreshRes = await fetch(`/api/ace/instructors/${qualificationId}`);
      const refreshData = await refreshRes.json();
      if (refreshData.success) {
        setQualification(refreshData.qualification);
      }
    } catch (err: any) {
      setReviewError(err.message || 'An unexpected error occurred');
    } finally {
      setSubmittingReview(false);
    }
  }

  // ============================================================================
  // Render helpers
  // ============================================================================

  function getStatusBadge() {
    if (!qualification) return null;

    if (!qualification.verifiedAt) {
      return (
        <Badge className="text-amber-700 bg-amber-100 border-amber-200">
          <Clock className="w-3 h-3 mr-1" />
          Pending Review
        </Badge>
      );
    }
    if (qualification.isApproved) {
      return (
        <Badge className="text-emerald-700 bg-emerald-100 border-emerald-200">
          <ShieldCheck className="w-3 h-3 mr-1" />
          Approved
        </Badge>
      );
    }
    return (
      <Badge className="text-red-700 bg-red-100 border-red-200">
        <ShieldX className="w-3 h-3 mr-1" />
        Rejected
      </Badge>
    );
  }

  function renderQualificationChecklist() {
    if (!qualification) return null;

    const items = [
      {
        label: 'Qualification path selected',
        met: !!qualification.qualificationPath,
      },
      {
        label: 'Subject-matter expertise documented',
        met: !!qualification.expertiseBasis,
      },
      {
        label: 'CV uploaded',
        met: !!qualification.cvUrl,
      },
      {
        label: 'Transcripts uploaded',
        met: !!qualification.transcriptUrl,
      },
      {
        label: 'Certification proof uploaded',
        met: !!qualification.certificationProofUrl,
      },
      ...(qualification.qualificationPath === 'active_bcba'
        ? [
          {
            label: 'BCBA certification number provided',
            met: !!qualification.certificationNumber,
          },
          {
            label: 'Certification dates provided',
            met: !!(qualification.certificationDate && qualification.certificationExpiration),
          },
          {
            label: 'Certification is current',
            met: !!(qualification.certificationExpiration && qualification.certificationExpiration > Date.now()),
          },
        ]
        : []),
      ...(qualification.expertiseBasis === 'five_years_practice'
        ? [{
          label: '5+ years experience documented',
          met: !!(qualification.yearsExperienceInSubject && qualification.yearsExperienceInSubject >= 5),
        }]
        : []),
      ...(qualification.expertiseBasis === 'three_years_teaching'
        ? [{
          label: '3+ years teaching documented',
          met: !!(qualification.yearsTeachingSubject && qualification.yearsTeachingSubject >= 3),
        }]
        : []),
    ];

    const metCount = items.filter((i) => i.met).length;

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Qualification Checklist</CardTitle>
            <Badge variant="outline" className="text-gray-600">
              {metCount}/{items.length} complete
            </Badge>
          </div>
          <CardDescription>
            Requirements that must be met for this qualification to be approved.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                {item.met ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                )}
                <span className={`text-sm ${item.met ? 'text-gray-900' : 'text-gray-400'}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // ============================================================================
  // Loading / Not Found
  // ============================================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!qualification) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-12 text-center">
              <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Qualification Not Found</h2>
              <p className="text-gray-500 mb-6">
                The instructor qualification you are looking for does not exist or has been removed.
              </p>
              <Button
                variant="outline"
                onClick={() => router.push(`/ace/instructors${providerId ? `?provider_id=${providerId}` : ''}`)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Instructors
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ============================================================================
  // Main Render
  // ============================================================================

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/ace/instructors${providerId ? `?provider_id=${providerId}` : ''}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white" style={{ backgroundColor: '#1F4D3F' }}>
              {(qualification.user?.firstName?.[0] || '?')}{(qualification.user?.lastName?.[0] || '')}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {qualification.user?.firstName} {qualification.user?.lastName}
              </h1>
              <p className="text-gray-500">{qualification.user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge()}
          </div>
        </div>

        {/* Review Success/Error Messages */}
        {reviewSuccess && (
          <Alert className="mb-6 border-emerald-200 bg-emerald-50">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <AlertTitle className="text-emerald-800">Success</AlertTitle>
            <AlertDescription className="text-emerald-700">{reviewSuccess}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Qualification Path Visualization */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" style={{ color: '#1F4D3F' }} />
                  <CardTitle className="text-base">Qualification Path</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {qualification.qualificationPath ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border-2" style={{ borderColor: '#1F4D3F', backgroundColor: 'rgba(31, 77, 63, 0.03)' }}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: '#1F4D3F' }}>
                          {qualification.qualificationPath === 'active_bcba' ? '1' :
                            qualification.qualificationPath === 'doctorate_behavior_analysis' ? '2' : '3'}
                        </div>
                        <h3 className="font-semibold text-gray-900">
                          {QUALIFICATION_PATH_LABELS[qualification.qualificationPath]}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 ml-10">
                        {QUALIFICATION_PATH_DESCRIPTIONS[qualification.qualificationPath]}
                      </p>
                    </div>

                    {/* Path-specific details */}
                    {qualification.qualificationPath === 'active_bcba' && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex items-start gap-2">
                          <Hash className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500">Certification Number</p>
                            <p className="text-sm font-medium text-gray-900">
                              {qualification.certificationNumber || 'Not provided'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500">Certification Date</p>
                            <p className="text-sm font-medium text-gray-900">
                              {qualification.certificationDate
                                ? new Date(qualification.certificationDate).toLocaleDateString()
                                : 'Not provided'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500">Expiration Date</p>
                            <p className="text-sm font-medium text-gray-900">
                              {qualification.certificationExpiration
                                ? new Date(qualification.certificationExpiration).toLocaleDateString()
                                : 'Not provided'}
                            </p>
                            {qualification.certificationExpiration && qualification.certificationExpiration < Date.now() && (
                              <p className="text-xs text-red-500 font-medium">Expired</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {qualification.isBcba && (
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">BCBA</Badge>
                        {qualification.isBcbaD && (
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">BCBA-D</Badge>
                        )}
                      </div>
                    )}
                    {qualification.isPhDAba && (
                      <Badge className="bg-purple-100 text-purple-800 border-purple-200">PhD/Doctorate</Badge>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No qualification path selected.</p>
                )}
              </CardContent>
            </Card>

            {/* Subject-Matter Expertise */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" style={{ color: '#D4AF37' }} />
                  <CardTitle className="text-base">Subject-Matter Expertise</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {qualification.expertiseBasis ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {EXPERTISE_BASIS_LABELS[qualification.expertiseBasis]}
                      </h3>
                      {qualification.expertiseBasis === 'five_years_practice' && (
                        <div className="flex items-center gap-2 mt-2">
                          <Briefcase className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {qualification.yearsExperienceInSubject || 0} years of practice experience
                          </span>
                        </div>
                      )}
                      {qualification.expertiseBasis === 'three_years_teaching' && (
                        <div className="flex items-center gap-2 mt-2">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {qualification.yearsTeachingSubject || 0} years of university teaching
                          </span>
                        </div>
                      )}
                      {qualification.expertiseBasis === 'published_research' && (
                        <div className="flex items-center gap-2 mt-2">
                          <BookOpen className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Published research in the subject area
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No expertise basis documented.</p>
                )}
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <CardTitle className="text-base">Supporting Documents</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { label: 'Curriculum Vitae (CV)', url: qualification.cvUrl, icon: User },
                    { label: 'Official Transcripts', url: qualification.transcriptUrl, icon: GraduationCap },
                    { label: 'Certification Proof', url: qualification.certificationProofUrl, icon: ShieldCheck },
                  ].map((doc) => {
                    const DocIcon = doc.icon;
                    return (
                      <div key={doc.label} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <DocIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{doc.label}</span>
                        </div>
                        {doc.url ? (
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm font-medium"
                            style={{ color: '#1F4D3F' }}
                          >
                            View
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <Badge variant="outline" className="text-gray-400">Not uploaded</Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Approval Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Approval Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Qualification Submitted</p>
                      <p className="text-xs text-gray-500">
                        {new Date(qualification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {qualification.verifiedAt ? (
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${
                        qualification.isApproved ? 'bg-emerald-100' : 'bg-red-100'
                      }`}>
                        {qualification.isApproved ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {qualification.isApproved ? 'Qualification Approved' : 'Qualification Rejected'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(qualification.verifiedAt).toLocaleString()}
                          {qualification.verifier && (
                            <> by {qualification.verifier.firstName} {qualification.verifier.lastName}</>
                          )}
                        </p>
                        {qualification.qualificationReviewNotes && (
                          <p className="text-sm text-gray-600 mt-1 p-2 bg-gray-50 rounded">
                            &ldquo;{qualification.qualificationReviewNotes}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Pending Review</p>
                        <p className="text-xs text-gray-500">Awaiting coordinator review</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Instructor Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Instructor Details</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-gray-500">Full Name</dt>
                    <dd className="font-medium text-gray-900">
                      {qualification.user?.firstName} {qualification.user?.lastName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Email</dt>
                    <dd className="font-medium text-gray-900">{qualification.user?.email}</dd>
                  </div>
                  {qualification.user?.phone && (
                    <div>
                      <dt className="text-gray-500">Phone</dt>
                      <dd className="font-medium text-gray-900">{qualification.user.phone}</dd>
                    </div>
                  )}
                  {qualification.user?.bacbId && (
                    <div>
                      <dt className="text-gray-500">BACB ID</dt>
                      <dd className="font-medium text-gray-900">{qualification.user.bacbId}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-gray-500">Role</dt>
                    <dd>
                      <Badge variant="outline" className="capitalize">{qualification.user?.role}</Badge>
                    </dd>
                  </div>
                  {qualification.provider && (
                    <div>
                      <dt className="text-gray-500">Provider</dt>
                      <dd className="font-medium text-gray-900">{qualification.provider.providerName}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>

            {/* Qualification Checklist */}
            {renderQualificationChecklist()}

            {/* Review Actions */}
            {!qualification.verifiedAt && (
              <Card className="border-2" style={{ borderColor: '#D4AF37' }}>
                <CardHeader>
                  <CardTitle className="text-base">Review Actions</CardTitle>
                  <CardDescription>
                    Approve or reject this instructor qualification.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reviewNotes">Review Notes</Label>
                    <Textarea
                      id="reviewNotes"
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Add notes about this review (required for rejection)..."
                      rows={3}
                    />
                  </div>

                  {reviewError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{reviewError}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleReview('approve')}
                      disabled={submittingReview}
                      className="flex-1 text-white bg-emerald-600 hover:bg-emerald-700"
                    >
                      {submittingReview ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4 mr-1" />
                          Approve
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => handleReview('reject')}
                      disabled={submittingReview}
                      variant="destructive"
                      className="flex-1"
                    >
                      {submittingReview ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <ShieldX className="w-4 h-4 mr-1" />
                          Reject
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* If already reviewed, show review summary */}
            {qualification.verifiedAt && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Review Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-3 text-sm">
                    <div>
                      <dt className="text-gray-500">Decision</dt>
                      <dd className="font-medium">
                        {qualification.isApproved ? (
                          <span className="text-emerald-700">Approved</span>
                        ) : (
                          <span className="text-red-700">Rejected</span>
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Reviewed On</dt>
                      <dd className="font-medium text-gray-900">
                        {new Date(qualification.verifiedAt).toLocaleDateString()}
                      </dd>
                    </div>
                    {qualification.verifier && (
                      <div>
                        <dt className="text-gray-500">Reviewed By</dt>
                        <dd className="font-medium text-gray-900">
                          {qualification.verifier.firstName} {qualification.verifier.lastName}
                        </dd>
                      </div>
                    )}
                    {qualification.qualificationReviewNotes && (
                      <div>
                        <dt className="text-gray-500">Notes</dt>
                        <dd className="text-gray-700 mt-1 p-2 bg-gray-50 rounded text-sm">
                          {qualification.qualificationReviewNotes}
                        </dd>
                      </div>
                    )}
                  </dl>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
