'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  Calendar,
  Plus,
  Filter,
  Search,
  ArrowRight,
  Circle,
  AlertCircle,
  User,
  X
} from 'lucide-react';
import Link from 'next/link';

interface Task {
  id: string;
  title: string;
  description: string | null;
  contact_name: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'completed' | 'overdue';
  task_type: string;
  created_at: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'overdue'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/admin/crm/tasks');
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskStatus = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newStatus = task.status === 'completed' ? 'pending' : 'completed';

    try {
      const response = await fetch(`/api/admin/crm/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setTasks(tasks.map(t => 
          t.id === taskId ? { ...t, status: newStatus } : t
        ));
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || task.status === filter;
    const matchesSearch = searchQuery === '' || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.contact_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const overdueCount = tasks.filter(t => t.status === 'overdue').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      urgent: 'bg-red-100 text-red-700',
      high: 'bg-orange-100 text-orange-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-blue-100 text-blue-700'
    };
    return colors[priority] || 'bg-slate-100 text-slate-700';
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'urgent' || priority === 'high') {
      return <AlertCircle className="w-4 h-4" />;
    }
    return <Clock className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
            <Link href="/admin/crm" className="hover:text-slate-900">CRM</Link>
            <ArrowRight className="w-4 h-4" />
            <span>Tasks & Follow-ups</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Tasks & Follow-ups</h1>
          <p className="text-slate-600 mt-1">Manage your to-do list and reminders</p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors">
          <Plus className="w-5 h-5" />
          Add Task
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-600">Pending Tasks</h3>
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900">{pendingCount}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-600">Overdue</h3>
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-red-600">{overdueCount}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-600">Completed</h3>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900">{completedCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No tasks found</h3>
            <p className="text-slate-600 mb-6">
              {tasks.length === 0
                ? 'Get started by adding your first task'
                : 'Try adjusting your search or filter'}
            </p>
            {tasks.length === 0 && (
              <button className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700">
                <Plus className="w-5 h-5" />
                Add Task
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className="flex-shrink-0 mt-1"
                  >
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-400 hover:text-slate-600" />
                    )}
                  </button>

                  {/* Task Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3
                          className={`font-medium text-slate-900 mb-1 ${
                            task.status === 'completed' ? 'line-through text-slate-500' : ''
                          }`}
                        >
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-sm text-slate-600 mb-2">{task.description}</p>
                        )}
                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex items-center gap-1 text-slate-600">
                            <User className="w-4 h-4" />
                            {task.contact_name}
                          </div>
                          <div className="flex items-center gap-1 text-slate-600">
                            <Calendar className="w-4 h-4" />
                            {new Date(task.due_date).toLocaleDateString()}
                          </div>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                              task.priority
                            )}`}
                          >
                            {getPriorityIcon(task.priority)}
                            {task.priority}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <button
                        onClick={() => setSelectedTask(task)}
                        className="flex-shrink-0 text-slate-400 hover:text-slate-600"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Task Detail Modal */}
      <AnimatePresence>
        {selectedTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedTask(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-slate-900">{selectedTask.title}</h2>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {selectedTask.description && (
                <p className="text-slate-700 mb-6">{selectedTask.description}</p>
              )}

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-slate-600 mb-1">Contact</p>
                  <p className="text-slate-900">{selectedTask.contact_name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-600 mb-1">Due Date</p>
                    <p className="text-slate-900">{new Date(selectedTask.due_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-600 mb-1">Priority</p>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${getPriorityColor(
                        selectedTask.priority
                      )}`}
                    >
                      {getPriorityIcon(selectedTask.priority)}
                      {selectedTask.priority}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-600 mb-1">Status</p>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      selectedTask.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-700'
                        : selectedTask.status === 'overdue'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {selectedTask.status}
                  </span>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <p className="text-xs text-slate-500">
                    Created: {new Date(selectedTask.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => toggleTaskStatus(selectedTask.id)}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  {selectedTask.status === 'completed' ? 'Mark as Pending' : 'Mark as Complete'}
                </button>
                <button className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                  Edit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
