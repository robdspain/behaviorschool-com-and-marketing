"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-client';
import { Loader2, Eye, Clock, Mail, CheckCircle, AlertCircle, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface SignupSubmission {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  organization: string;
  role: string;
  caseloadSize?: string;
  currentChallenges?: string;
  status: 'new' | 'contacted' | 'qualified' | 'enrolled' | 'rejected';
  submittedAt: string;
  notes?: string;
}

export default function AdminSignupsPage() {
  const [signups, setSignups] = useState<SignupSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSignup, setSelectedSignup] = useState<SignupSubmission | null>(null);

  useEffect(() => {
    const fetchSignups = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        const response = await fetch('/api/admin/signups', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch signup submissions');
        }
        
        const result = await response.json();
        
        if (result.success && result.data) {
          setSignups(result.data);
        } else {
          throw new Error(result.message || 'Failed to load signups');
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSignups();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'contacted': return <Mail className="w-4 h-4 text-yellow-500" />;
      case 'qualified': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'enrolled': return <Users className="w-4 h-4 text-emerald-500" />;
      case 'rejected': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Application Submissions</h1>
        <p className="text-slate-600">Manage applications for the Behavior School Operating System</p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {signups.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No applications yet</h3>
              <p className="text-slate-600">Applications will appear here once they start coming in.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Applicant</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Organization</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Submitted</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {signups.map((signup, index) => (
                    <motion.tr 
                      key={signup.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-sm font-medium text-slate-600">
                              {signup.firstName[0]}{signup.lastName[0]}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-900">
                              {signup.firstName} {signup.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{signup.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{signup.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{signup.organization}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(signup.status)}`}>
                          {getStatusIcon(signup.status)}
                          <span className="ml-1 capitalize">{signup.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {new Date(signup.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedSignup(signup)}
                            className="text-emerald-600 hover:text-emerald-700"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {selectedSignup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">Application Details</h2>
                <button
                  onClick={() => setSelectedSignup(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Name</label>
                    <p className="mt-1 text-sm text-slate-900">{selectedSignup.firstName} {selectedSignup.lastName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Email</label>
                    <p className="mt-1 text-sm text-slate-900">{selectedSignup.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Role</label>
                    <p className="mt-1 text-sm text-slate-900">{selectedSignup.role}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Organization</label>
                    <p className="mt-1 text-sm text-slate-900">{selectedSignup.organization}</p>
                  </div>
                </div>

                {selectedSignup.currentChallenges && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Current Challenges</label>
                    <p className="mt-1 text-sm text-slate-900">{selectedSignup.currentChallenges}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700">Status</label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedSignup.status)}`}>
                      {getStatusIcon(selectedSignup.status)}
                      <span className="ml-1 capitalize">{selectedSignup.status}</span>
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Submitted</label>
                  <p className="mt-1 text-sm text-slate-900">{new Date(selectedSignup.submittedAt).toLocaleString()}</p>
                </div>

                {selectedSignup.notes && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Notes</label>
                    <p className="mt-1 text-sm text-slate-900">{selectedSignup.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
