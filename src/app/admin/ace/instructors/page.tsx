'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  GraduationCap,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Upload,
  Edit,
  Plus,
  Search,
  Loader2,
  Building2,
  BookOpen,
  Briefcase,
} from 'lucide-react';
import type {
  AceInstructorQualification,
  AceInstructorQualificationPath,
  AceExpertiseBasis,
  AceUser,
} from '@/lib/ace/types';

interface InstructorWithUser extends AceInstructorQualification {
  user?: AceUser;
}

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState<InstructorWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState<InstructorWithUser | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending' | 'expired'>('all');

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      const response = await fetch('/api/admin/ace/instructors');
      const data = await response.json();
      if (data.data) {
        setInstructors(data.data);
      }
    } catch (error) {
      console.error('Error fetching instructors:', error);
    } finally {
      setLoading(false);
    }
  };

  const getQualificationPathLabel = (path: AceInstructorQualificationPath | undefined) => {
    const labels: Record<AceInstructorQualificationPath, string> = {
      active_bcba: 'Active BCBA',
      doctorate_behavior_analysis: 'Doctorate in Behavior Analysis',
      doctorate_with_coursework: 'Doctorate + Qualifying Coursework',
      doctorate_with_mentorship: 'Doctorate + Mentorship (2+ yrs)',
      doctorate_with_publications: 'Doctorate + Publications',
      doctorate_with_postdoc_hours: 'Doctorate + 1800+ Postdoc Hours',
    };
    return path ? labels[path] : 'Not specified';
  };

  const getExpertiseBasisLabel = (basis: AceExpertiseBasis | undefined) => {
    const labels: Record<AceExpertiseBasis, string> = {
      five_years_practice: '5+ Years Practice',
      three_years_teaching: '3+ Years Teaching',
      published_research: 'Published Research',
    };
    return basis ? labels[basis] : 'Not specified';
  };

  const isExpired = (instructor: InstructorWithUser) => {
    if (!instructor.certification_expiration) return false;
    return new Date(instructor.certification_expiration) < new Date();
  };

  const filteredInstructors = instructors.filter(i => {
    const matchesSearch = !searchTerm || 
      i.user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.user?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    
    if (filter === 'all') return true;
    if (filter === 'approved') return i.is_approved;
    if (filter === 'pending') return !i.is_approved && !isExpired(i);
    if (filter === 'expired') return isExpired(i);
    return true;
  });

  const approvedCount = instructors.filter(i => i.is_approved).length;
  const pendingCount = instructors.filter(i => !i.is_approved && !isExpired(i)).length;
  const expiredCount = instructors.filter(isExpired).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <GraduationCap className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Instructor Qualifications</h1>
              <p className="text-slate-600">Verify instructor credentials per 2026 BACB requirements</p>
            </div>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Instructor
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Instructors</p>
                <p className="text-3xl font-bold text-slate-900">{instructors.length}</p>
              </div>
              <GraduationCap className="w-10 h-10 text-slate-400" />
            </div>
          </Card>

          <Card className="p-6 bg-green-50 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-800">Approved</p>
                <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </Card>

          <Card className="p-6 bg-amber-50 border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-800">Pending Review</p>
                <p className="text-3xl font-bold text-amber-600">{pendingCount}</p>
              </div>
              <Clock className="w-10 h-10 text-amber-600" />
            </div>
          </Card>

          <Card className="p-6 bg-red-50 border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-800">Expired Certs</p>
                <p className="text-3xl font-bold text-red-600">{expiredCount}</p>
              </div>
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
          </Card>
        </div>

        {/* 2026 Requirements Info */}
        <Card className="p-6 mb-8 bg-indigo-50 border-indigo-200">
          <h3 className="font-semibold text-indigo-900 mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            2026 BACB Instructor Requirements
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-indigo-800 mb-2">Qualification Path (One Required)</h4>
              <ul className="text-sm text-indigo-700 space-y-1">
                <li>• Active BCBA certification</li>
                <li>• PhD/EdD in Behavior Analysis</li>
                <li>• Doctorate + qualifying coursework, mentorship, publications, or 1800+ postdoc hours</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-indigo-800 mb-2">Subject-Matter Expertise (One Required)</h4>
              <ul className="text-sm text-indigo-700 space-y-1">
                <li>• 5+ years practicing in subject area</li>
                <li>• 3+ years teaching at university level</li>
                <li>• Published research in subject area</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'approved', 'pending', 'expired'] as const).map(f => (
              <Button
                key={f}
                variant={filter === f ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(f)}
                className={filter === f && f === 'expired' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Instructors List */}
        {filteredInstructors.length === 0 ? (
          <Card className="p-12 text-center">
            <GraduationCap className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No instructors found</h3>
            <p className="text-slate-600 mb-6">
              {searchTerm ? 'Try a different search term' : 'Add your first instructor to get started.'}
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredInstructors.map(instructor => (
              <Card key={instructor.id} className={`p-6 ${isExpired(instructor) ? 'bg-red-50 border-red-200' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-slate-900">
                        {instructor.user?.first_name} {instructor.user?.last_name}
                      </h3>
                      {instructor.is_approved ? (
                        <Badge className="bg-green-500">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Approved
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                      {isExpired(instructor) && (
                        <Badge className="bg-red-600">
                          <XCircle className="w-3 h-3 mr-1" />
                          Expired
                        </Badge>
                      )}
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-4">
                      <div>
                        <p className="text-sm text-slate-500 mb-2">Qualification Path</p>
                        <Badge variant="outline" className="text-sm">
                          {getQualificationPathLabel(instructor.qualification_path)}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-2">Expertise Basis</p>
                        <Badge variant="outline" className="text-sm">
                          {getExpertiseBasisLabel(instructor.expertise_basis)}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-2">Years Experience</p>
                        <span className="font-medium text-slate-900">
                          {instructor.years_experience_in_subject || instructor.years_teaching_subject || 'N/A'} years
                        </span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500">Email</p>
                        <p className="font-medium text-slate-900">{instructor.user?.email}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Certification #</p>
                        <p className="font-medium text-slate-900">{instructor.certification_number || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Institution</p>
                        <p className="font-medium text-slate-900">{instructor.institution_name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Cert Expires</p>
                        <p className={`font-medium ${isExpired(instructor) ? 'text-red-700' : 'text-slate-900'}`}>
                          {instructor.certification_expiration 
                            ? new Date(instructor.certification_expiration).toLocaleDateString()
                            : 'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* Document Status */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Badge variant={instructor.cv_url ? 'default' : 'outline'} className="text-xs">
                        <FileText className="w-3 h-3 mr-1" />
                        CV {instructor.cv_url ? '✓' : '✗'}
                      </Badge>
                      <Badge variant={instructor.transcript_url ? 'default' : 'outline'} className="text-xs">
                        <FileText className="w-3 h-3 mr-1" />
                        Transcript {instructor.transcript_url ? '✓' : '✗'}
                      </Badge>
                      <Badge variant={instructor.certification_proof_url ? 'default' : 'outline'} className="text-xs">
                        <FileText className="w-3 h-3 mr-1" />
                        Cert Proof {instructor.certification_proof_url ? '✓' : '✗'}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedInstructor(instructor)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      {instructor.is_approved ? 'View' : 'Review'}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Review/Edit Modal */}
        {selectedInstructor && (
          <InstructorReviewModal
            instructor={selectedInstructor}
            onClose={() => setSelectedInstructor(null)}
            onSuccess={() => {
              setSelectedInstructor(null);
              fetchInstructors();
            }}
          />
        )}
      </div>
    </div>
  );
}

// Instructor Review Modal
function InstructorReviewModal({
  instructor,
  onClose,
  onSuccess,
}: {
  instructor: InstructorWithUser;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [isApproved, setIsApproved] = useState(instructor.is_approved);
  const [qualificationNotes, setQualificationNotes] = useState(instructor.qualification_review_notes || '');
  const [expertiseNotes, setExpertiseNotes] = useState(instructor.expertise_review_notes || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/admin/ace/instructors', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qualification_id: instructor.id,
          is_approved: isApproved,
          qualification_review_notes: qualificationNotes,
          expertise_review_notes: expertiseNotes,
          verified_at: isApproved ? new Date().toISOString() : null,
        }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        alert('Failed to save review');
      }
    } catch (error) {
      console.error('Error saving review:', error);
      alert('Failed to save review');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Review Instructor Qualifications</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>

        {/* Instructor Info */}
        <div className="bg-slate-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-slate-900 mb-3">
            {instructor.user?.first_name} {instructor.user?.last_name}
          </h3>
          <p className="text-slate-600">{instructor.user?.email}</p>
        </div>

        {/* Qualification Details */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card className="p-4">
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Qualification Path
            </h4>
            <div className="space-y-2 text-sm">
              <p><span className="text-slate-500">Path:</span> {instructor.qualification_path || 'Not set'}</p>
              {instructor.is_bcba && <p className="text-green-600">✓ Active BCBA</p>}
              {instructor.doctorate_type && (
                <>
                  <p><span className="text-slate-500">Degree:</span> {instructor.doctorate_type}</p>
                  <p><span className="text-slate-500">Institution:</span> {instructor.institution_name}</p>
                  <p><span className="text-slate-500">Year:</span> {instructor.graduation_year}</p>
                </>
              )}
              {instructor.mentorship_years && (
                <p><span className="text-slate-500">Mentorship:</span> {instructor.mentorship_years} years</p>
              )}
              {instructor.postdoc_hours && (
                <p><span className="text-slate-500">Postdoc Hours:</span> {instructor.postdoc_hours}</p>
              )}
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Subject-Matter Expertise
            </h4>
            <div className="space-y-2 text-sm">
              <p><span className="text-slate-500">Basis:</span> {instructor.expertise_basis || 'Not set'}</p>
              {instructor.years_experience_in_subject && (
                <p><span className="text-slate-500">Practice Exp:</span> {instructor.years_experience_in_subject} years</p>
              )}
              {instructor.years_teaching_subject && (
                <p><span className="text-slate-500">Teaching Exp:</span> {instructor.years_teaching_subject} years</p>
              )}
              {instructor.publications_count && (
                <p><span className="text-slate-500">Publications:</span> {instructor.publications_count}</p>
              )}
            </div>
          </Card>
        </div>

        {/* Documents */}
        <Card className="p-4 mb-6">
          <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Uploaded Documents
          </h4>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-3 border rounded-lg">
              <p className="text-sm text-slate-500 mb-1">CV/Resume</p>
              {instructor.cv_url ? (
                <a href={instructor.cv_url} target="_blank" className="text-indigo-600 hover:underline text-sm">
                  View Document →
                </a>
              ) : (
                <span className="text-red-600 text-sm">Not uploaded</span>
              )}
            </div>
            <div className="p-3 border rounded-lg">
              <p className="text-sm text-slate-500 mb-1">Transcript</p>
              {instructor.transcript_url ? (
                <a href={instructor.transcript_url} target="_blank" className="text-indigo-600 hover:underline text-sm">
                  View Document →
                </a>
              ) : (
                <span className="text-red-600 text-sm">Not uploaded</span>
              )}
            </div>
            <div className="p-3 border rounded-lg">
              <p className="text-sm text-slate-500 mb-1">Certification Proof</p>
              {instructor.certification_proof_url ? (
                <a href={instructor.certification_proof_url} target="_blank" className="text-indigo-600 hover:underline text-sm">
                  View Document →
                </a>
              ) : (
                <span className="text-red-600 text-sm">Not uploaded</span>
              )}
            </div>
          </div>
        </Card>

        {/* Review Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Qualification Review Notes
            </label>
            <textarea
              rows={3}
              value={qualificationNotes}
              onChange={e => setQualificationNotes(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Notes on qualification path verification..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Expertise Review Notes
            </label>
            <textarea
              rows={3}
              value={expertiseNotes}
              onChange={e => setExpertiseNotes(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Notes on subject-matter expertise verification..."
            />
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
            <input
              type="checkbox"
              id="approved"
              checked={isApproved}
              onChange={e => setIsApproved(e.target.checked)}
              className="w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="approved" className="font-medium text-slate-900">
              Approve this instructor&apos;s qualifications
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="flex-1 bg-indigo-600 hover:bg-indigo-700">
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Review'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
