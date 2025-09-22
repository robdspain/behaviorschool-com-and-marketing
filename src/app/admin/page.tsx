"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
import { 
  Users, 
  Mail, 
  TrendingUp, 
  ArrowRight,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

interface Signup {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  status: 'new' | 'contacted' | 'qualified' | 'enrolled' | 'rejected';
  submittedAt: string;
}

interface DashboardStats {
  totalSignups: number;
  newSignups: number;
  contactedSignups: number;
  qualifiedSignups: number;
  enrolledSignups: number;
  recentSignups: Signup[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSignups: 0,
    newSignups: 0,
    contactedSignups: 0,
    qualifiedSignups: 0,
    enrolledSignups: 0,
    recentSignups: []
  } as DashboardStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/admin/signups');
        
        if (!response.ok) {
          throw new Error('Failed to fetch signup data');
        }
        
        const result = await response.json();
        
        if (result.success && result.data) {
          const signups = result.data;
          
          // Calculate stats from real data
          const totalSignups = signups.length;
          const newSignups = signups.filter((s: Signup) => s.status === 'new').length;
          const contactedSignups = signups.filter((s: Signup) => s.status === 'contacted').length;
          const qualifiedSignups = signups.filter((s: Signup) => s.status === 'qualified').length;
          const enrolledSignups = signups.filter((s: Signup) => s.status === 'enrolled').length;
          
          // Get recent signups (last 5)
          const recentSignups = signups.slice(0, 5);
          
          setStats({
            totalSignups,
            newSignups,
            contactedSignups,
            qualifiedSignups,
            enrolledSignups,
            recentSignups
          });
        } else {
          // Fallback to mock data if API fails
          console.warn('API returned no data, using mock data');
          setStats({
            totalSignups: 0,
            newSignups: 0,
            contactedSignups: 0,
            qualifiedSignups: 0,
            enrolledSignups: 0,
            recentSignups: []
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fallback to empty stats if there's an error
        setStats({
          totalSignups: 0,
          newSignups: 0,
          contactedSignups: 0,
          qualifiedSignups: 0,
          enrolledSignups: 0,
          recentSignups: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
        <p className="text-slate-600">Overview of Behavior School Operating System applications</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6 border border-slate-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Signups</p>
              <p className="text-3xl font-bold text-slate-900">{stats.totalSignups}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-6 border border-slate-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">New Applications</p>
              <p className="text-3xl font-bold text-blue-600">{stats.newSignups}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-6 border border-slate-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Contacted</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.contactedSignups}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm p-6 border border-slate-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Qualified</p>
              <p className="text-3xl font-bold text-green-600">{stats.qualifiedSignups}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Signups */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg shadow-sm border border-slate-200"
      >
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Recent Applications</h2>
            <Link
              href="/admin/signups"
              className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>

        <div className="divide-y divide-slate-200">
          {stats.recentSignups.length > 0 ? (
            stats.recentSignups.map((signup: Signup) => (
              <div key={signup.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-slate-600">
                        {signup.firstName[0]}{signup.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {signup.firstName} {signup.lastName}
                      </p>
                      <p className="text-sm text-slate-600">{signup.email}</p>
                      <p className="text-sm text-slate-500">{signup.organization}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(signup.status)}`}>
                      {getStatusIcon(signup.status)}
                      <span className="ml-1 capitalize">{signup.status}</span>
                    </span>
                    <span className="text-sm text-slate-500">
                      {new Date(signup.submittedAt).toLocaleDateString()}
                    </span>
                    <Link
                      href={`/admin/signups?id=${signup.id}`}
                      className="text-emerald-600 hover:text-emerald-700"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center">
              <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No applications yet</h3>
              <p className="text-slate-600">Applications will appear here once they start coming in.</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Link
          href="/admin/signups"
          className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Manage Signups</h3>
              <p className="text-sm text-slate-600">View and manage all applications</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/leads"
          className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Leads</h3>
              <p className="text-sm text-slate-600">Lead magnets & email captures</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/users"
          className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">User Management</h3>
              <p className="text-sm text-slate-600">Manage user accounts and permissions</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/analytics"
          className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Analytics</h3>
              <p className="text-sm text-slate-600">View detailed analytics and reports</p>
            </div>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}

