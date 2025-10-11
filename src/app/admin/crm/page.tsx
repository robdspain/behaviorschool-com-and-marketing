'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  Calendar,
  Target,
  Activity,
  Plus
} from 'lucide-react';
import Link from 'next/link';

interface Activity {
  id: string;
  activity_type: string;
  subject: string;
  contact_name: string;
  activity_date: string;
}

interface Task {
  id: string;
  title: string;
  contact_name: string;
  priority: string;
  due_date: string;
}

interface CRMStats {
  totalContacts: number;
  activeDeals: number;
  totalPipelineValue: number;
  pendingTasks: number;
  contactsByStatus: { [key: string]: number };
  dealsByStage: { [key: string]: number };
  recentActivities: Activity[];
  upcomingTasks: Task[];
}

export default function CRMDashboard() {
  const [stats, setStats] = useState<CRMStats>({
    totalContacts: 0,
    activeDeals: 0,
    totalPipelineValue: 0,
    pendingTasks: 0,
    contactsByStatus: {},
    dealsByStage: {},
    recentActivities: [],
    upcomingTasks: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCRMData();
  }, []);

  const fetchCRMData = async () => {
    try {
      const response = await fetch('/api/admin/crm/dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching CRM data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading CRM...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">CRM Dashboard</h1>
        <p className="text-slate-600">Manage your customer relationships and sales pipeline</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-slate-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Contacts</p>
              <p className="text-3xl font-bold text-slate-900">{stats.totalContacts}</p>
              <p className="text-xs text-slate-500 mt-1">Active leads & customers</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-slate-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Active Deals</p>
              <p className="text-3xl font-bold text-emerald-600">{stats.activeDeals}</p>
              <p className="text-xs text-slate-500 mt-1">In pipeline</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-slate-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Pipeline Value</p>
              <p className="text-3xl font-bold text-green-600">
                ${stats.totalPipelineValue.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 mt-1">Potential revenue</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-slate-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Pending Tasks</p>
              <p className="text-3xl font-bold text-orange-600">{stats.pendingTasks}</p>
              <p className="text-xs text-slate-500 mt-1">Need attention</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link
          href="/admin/crm/contacts"
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-all transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8" />
            <span className="text-2xl font-bold">{stats.totalContacts}</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Contacts</h3>
          <p className="text-blue-100 text-sm">View and manage all contacts, leads, and customers</p>
        </Link>

        <Link
          href="/admin/crm/pipeline"
          className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-all transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8" />
            <span className="text-2xl font-bold">{stats.activeDeals}</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Sales Pipeline</h3>
          <p className="text-emerald-100 text-sm">Track deals through your sales process</p>
        </Link>

        <Link
          href="/admin/crm/tasks"
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-all transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <CheckCircle2 className="w-8 h-8" />
            <span className="text-2xl font-bold">{stats.pendingTasks}</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Tasks & Follow-ups</h3>
          <p className="text-orange-100 text-sm">Manage your to-do list and reminders</p>
        </Link>
      </div>

      {/* Contact Status Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8"
      >
        <h2 className="text-xl font-bold text-slate-900 mb-4">Contact Status Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(stats.contactsByStatus).map(([status, count]) => (
            <div key={status} className="text-center p-4 bg-slate-50 rounded-lg">
              <p className="text-2xl font-bold text-slate-900">{count}</p>
              <p className="text-sm text-slate-600 capitalize mt-1">{status}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-slate-200"
        >
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity
              </h2>
              <Link
                href="/admin/crm/activities"
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                View All
              </Link>
            </div>
          </div>
          <div className="divide-y divide-slate-200">
            {stats.recentActivities.length > 0 ? (
              stats.recentActivities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="p-4 hover:bg-slate-50">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                      {activity.activity_type === 'call' && <Phone className="w-4 h-4 text-slate-600" />}
                      {activity.activity_type === 'email' && <Mail className="w-4 h-4 text-slate-600" />}
                      {activity.activity_type === 'meeting' && <Calendar className="w-4 h-4 text-slate-600" />}
                      {activity.activity_type === 'note' && <Activity className="w-4 h-4 text-slate-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{activity.subject}</p>
                      <p className="text-sm text-slate-600">{activity.contact_name}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(activity.activity_date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600">No recent activities</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Upcoming Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-slate-200"
        >
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Upcoming Tasks
              </h2>
              <Link
                href="/admin/crm/tasks"
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                View All
              </Link>
            </div>
          </div>
          <div className="divide-y divide-slate-200">
            {stats.upcomingTasks.length > 0 ? (
              stats.upcomingTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="p-4 hover:bg-slate-50">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{task.title}</p>
                      <p className="text-sm text-slate-600">{task.contact_name}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          task.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                          task.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {task.priority}
                        </span>
                        <span className="text-xs text-slate-500">
                          Due: {new Date(task.due_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600">No upcoming tasks</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <button className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors">
          <Plus className="w-5 h-5" />
          Add Contact
        </button>
        <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" />
          Create Deal
        </button>
        <button className="flex items-center justify-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors">
          <Plus className="w-5 h-5" />
          Add Task
        </button>
      </motion.div>
    </div>
  );
}
