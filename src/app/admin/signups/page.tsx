"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
import { 
  Users, 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  Search, 
  Download,
  Eye,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";

interface SignupSubmission {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organization: string;
  role: string;
  caseloadSize: string;
  currentChallenges: string;
  status: 'new' | 'contacted' | 'qualified' | 'enrolled' | 'rejected';
  submittedAt: string;
  notes?: string;
}

export default function AdminSignupsPage() {
  const [signups, setSignups] = useState<SignupSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedSignup, setSelectedSignup] = useState<SignupSubmission | null>(null);

  useEffect(() => {
    fetchSignups();
  }, []);

  const fetchSignups = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/signups');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSignups(result.data);
        } else {
          console.error('Failed to fetch signups:', result.message);
          setSignups([]);
        }
      } else {
        console.error('HTTP error:', response.status);
        setSignups([]);
      }
    } catch (error) {
      console.error('Error fetching signups:', error);
      setSignups([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredSignups = signups.filter(signup => {
    const matchesSearch = 
      signup.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      signup.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      signup.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      signup.organization.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || signup.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'enrolled': return 'bg-emerald-100 text-emerald-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Clock className="w-4 h-4" />;
      case 'contacted': return <Mail className="w-4 h-4" />;
      case 'qualified': return <CheckCircle className="w-4 h-4" />;
      case 'enrolled': return <Users className="w-4 h-4" />;
      case 'rejected': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Organization', 'Role', 'Caseload', 'Challenges', 'Status', 'Submitted'];
    const csvContent = [
      headers.join(','),
      ...filteredSignups.map(signup => [
        `${signup.firstName} ${signup.lastName}`,
        signup.email,
        signup.organization,
        signup.role,
        signup.caseloadSize,
        signup.currentChallenges,
        signup.status,
        new Date(signup.submittedAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `signups-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading signup submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Signup Submissions</h1>
              <p className="text-slate-600">Manage and track Behavior School Operating System applications</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={exportToCSV}
                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or organization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="enrolled">Enrolled</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="flex items-end">
              <div className="text-sm text-slate-600">
                {filteredSignups.length} of {signups.length} submissions
              </div>
            </div>
          </div>
        </div>

        {/* Signups List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredSignups.map((signup) => (
                  <motion.tr
                    key={signup.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {signup.firstName} {signup.lastName}
                        </div>
                        <div className="text-sm text-slate-500">{signup.email}</div>
                        {signup.phone && (
                          <div className="text-sm text-slate-500">{signup.phone}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{signup.organization}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{signup.role}</div>
                      {signup.caseloadSize && (
                        <div className="text-sm text-slate-500">{signup.caseloadSize} students</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(signup.status)}`}>
                        {getStatusIcon(signup.status)}
                        <span className="ml-1 capitalize">{signup.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {new Date(signup.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedSignup(signup)}
                          className="text-emerald-600 hover:text-emerald-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredSignups.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No submissions found</h3>
            <p className="text-slate-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedSignup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">
                  {selectedSignup.firstName} {selectedSignup.lastName}
                </h2>
                <button
                  onClick={() => setSelectedSignup(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 mb-2">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span className="text-sm">{selectedSignup.email}</span>
                      </div>
                      {selectedSignup.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-slate-400" />
                          <span className="text-sm">{selectedSignup.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-slate-500 mb-2">Professional Details</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-slate-400" />
                        <span className="text-sm">{selectedSignup.organization}</span>
                      </div>
                      <div className="text-sm">
                        <strong>Role:</strong> {selectedSignup.role}
                      </div>
                      {selectedSignup.caseloadSize && (
                        <div className="text-sm">
                          <strong>Caseload:</strong> {selectedSignup.caseloadSize} students
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {selectedSignup.currentChallenges && (
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 mb-2">Current Challenges</h3>
                    <p className="text-sm text-slate-900 bg-slate-50 p-3 rounded-lg">
                      {selectedSignup.currentChallenges}
                    </p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 mb-2">Status</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedSignup.status)}`}>
                      {getStatusIcon(selectedSignup.status)}
                      <span className="ml-1 capitalize">{selectedSignup.status}</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-slate-500 mb-2">Submitted</h3>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-sm">
                        {new Date(selectedSignup.submittedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedSignup.notes && (
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 mb-2">Notes</h3>
                    <p className="text-sm text-slate-900 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                      {selectedSignup.notes}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-3 pt-4 border-t">
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                    Mark as Contacted
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Schedule Call
                  </button>
                  <button className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors">
                    Add Notes
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
