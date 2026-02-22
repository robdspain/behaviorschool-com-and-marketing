'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  UserPlus,
  Search,
  GraduationCap,
  ShieldCheck,
  Clock,
  XCircle,
  Users,
  Loader2,
  ChevronRight,
} from 'lucide-react';

interface InstructorQualification {
  _id: string;
  userId: string;
  providerId: string;
  isBcba: boolean;
  isBcbaD: boolean;
  isPhDAba: boolean;
  certificationNumber?: string;
  qualificationPath?: string;
  expertiseBasis?: string;
  isApproved: boolean;
  verifiedAt?: number;
  verifiedBy?: string;
  createdAt: number;
  updatedAt: number;
  user?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    bacbId?: string;
  };
}

const QUALIFICATION_PATH_LABELS: Record<string, string> = {
  active_bcba: 'Active BCBA',
  doctorate_behavior_analysis: 'Doctorate in Behavior Analysis',
  doctorate_with_coursework: 'Doctorate + Coursework',
  doctorate_with_mentorship: 'Doctorate + Mentorship',
  doctorate_with_publications: 'Doctorate + Publications',
  doctorate_with_postdoc_hours: 'Doctorate + Postdoc Hours',
};

const EXPERTISE_BASIS_LABELS: Record<string, string> = {
  five_years_practice: '5+ Years Practice',
  three_years_teaching: '3+ Years Teaching',
  published_research: 'Published Research',
};

function getStatusInfo(qual: InstructorQualification) {
  if (!qual.verifiedAt) {
    return { label: 'Pending Review', variant: 'outline' as const, color: 'text-amber-600 border-amber-300 bg-amber-50' };
  }
  if (qual.isApproved) {
    return { label: 'Approved', variant: 'default' as const, color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
  }
  return { label: 'Rejected', variant: 'destructive' as const, color: 'bg-red-100 text-red-800 border-red-200' };
}

export default function InstructorsPage() {
  const router = useRouter();
  const [qualifications, setQualifications] = useState<InstructorQualification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // For demo purposes, use a default provider ID. In production, this would come from auth context.
  const providerId = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('provider_id')
    : null;

  useEffect(() => {
    async function fetchInstructors() {
      if (!providerId) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/ace/instructors?provider_id=${providerId}`);
        const data = await res.json();
        if (data.success) {
          setQualifications(data.qualifications || []);
        }
      } catch (error) {
        console.error('Error fetching instructors:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchInstructors();
  }, [providerId]);

  const filteredQualifications = useMemo(() => {
    let filtered = qualifications;

    // Filter by tab
    if (activeTab === 'pending') {
      filtered = filtered.filter((q) => !q.verifiedAt);
    } else if (activeTab === 'approved') {
      filtered = filtered.filter((q) => q.isApproved && q.verifiedAt);
    } else if (activeTab === 'rejected') {
      filtered = filtered.filter((q) => !q.isApproved && q.verifiedAt);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((q) => {
        const name = `${q.user?.firstName || ''} ${q.user?.lastName || ''}`.toLowerCase();
        const email = (q.user?.email || '').toLowerCase();
        return name.includes(query) || email.includes(query);
      });
    }

    return filtered;
  }, [qualifications, activeTab, searchQuery]);

  const counts = useMemo(() => ({
    all: qualifications.length,
    pending: qualifications.filter((q) => !q.verifiedAt).length,
    approved: qualifications.filter((q) => q.isApproved && q.verifiedAt).length,
    rejected: qualifications.filter((q) => !q.isApproved && q.verifiedAt).length,
  }), [qualifications]);

  if (!providerId) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Provider Selected</h2>
              <p className="text-gray-500">
                Please provide a provider_id parameter to view instructor qualifications.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#1F4D3F' }}>
              Instructor Management
            </h1>
            <p className="text-gray-500 mt-1">
              Manage instructor qualifications and approvals for your ACE provider.
            </p>
          </div>
          <Button
            onClick={() => router.push(`/ace/instructors/new?provider_id=${providerId}`)}
            className="text-white"
            style={{ backgroundColor: '#1F4D3F' }}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Instructor
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-100">
                <Users className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{counts.all}</p>
                <p className="text-sm text-gray-500">Total Instructors</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-50">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{counts.pending}</p>
                <p className="text-sm text-gray-500">Pending Review</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">{counts.approved}</p>
                <p className="text-sm text-gray-500">Approved</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-50">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{counts.rejected}</p>
                <p className="text-sm text-gray-500">Rejected</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter and Search */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-lg">Instructor Qualifications</CardTitle>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>

          <div className="px-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">
                  All ({counts.all})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pending ({counts.pending})
                </TabsTrigger>
                <TabsTrigger value="approved">
                  Approved ({counts.approved})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Rejected ({counts.rejected})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
                <CardContent className="px-0 pt-4">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                      <span className="ml-3 text-gray-500">Loading instructors...</span>
                    </div>
                  ) : filteredQualifications.length === 0 ? (
                    <div className="text-center py-12">
                      <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No instructors found</h3>
                      <p className="text-gray-500">
                        {searchQuery
                          ? 'No instructors match your search criteria.'
                          : 'Get started by adding your first instructor.'}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Name</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Email</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Qualification Path</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Expertise Basis</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Verified</th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-gray-500"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredQualifications.map((qual) => {
                            const statusInfo = getStatusInfo(qual);
                            return (
                              <tr
                                key={qual._id}
                                className="hover:bg-gray-50 cursor-pointer transition-colors"
                                onClick={() => router.push(`/ace/instructors/${qual._id}?provider_id=${providerId}`)}
                              >
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white" style={{ backgroundColor: '#1F4D3F' }}>
                                      {(qual.user?.firstName?.[0] || '?')}{(qual.user?.lastName?.[0] || '')}
                                    </div>
                                    <span className="font-medium text-gray-900">
                                      {qual.user?.firstName} {qual.user?.lastName}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-600">
                                  {qual.user?.email}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-600">
                                  {qual.qualificationPath
                                    ? QUALIFICATION_PATH_LABELS[qual.qualificationPath] || qual.qualificationPath
                                    : '-'}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-600">
                                  {qual.expertiseBasis
                                    ? EXPERTISE_BASIS_LABELS[qual.expertiseBasis] || qual.expertiseBasis
                                    : '-'}
                                </td>
                                <td className="py-3 px-4">
                                  <Badge className={statusInfo.color}>
                                    {statusInfo.label}
                                  </Badge>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-500">
                                  {qual.verifiedAt
                                    ? new Date(qual.verifiedAt).toLocaleDateString()
                                    : '-'}
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <ChevronRight className="w-4 h-4 text-gray-400 inline-block" />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      </div>
    </div>
  );
}
