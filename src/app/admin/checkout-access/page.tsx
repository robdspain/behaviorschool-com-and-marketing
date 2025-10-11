'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';

interface ApprovedUser {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  approved_by: string | null;
  notes: string | null;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

interface AccessLog {
  id: string;
  access_type: string;
  identifier: string;
  success: boolean;
  ip_address: string | null;
  created_at: string;
  error_message: string | null;
}

export default function CheckoutAccessPage() {
  const [approvedUsers, setApprovedUsers] = useState<ApprovedUser[]>([]);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');

  const [newUser, setNewUser] = useState({
    email: '',
    firstName: '',
    lastName: '',
    notes: '',
    expiresInDays: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [usersRes, logsRes, passwordRes] = await Promise.all([
        fetch('/api/admin/checkout-access/users'),
        fetch('/api/admin/checkout-access/logs'),
        fetch('/api/admin/checkout-access/password'),
      ]);

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setApprovedUsers(usersData);
      }

      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setAccessLogs(logsData);
      }

      if (passwordRes.ok) {
        const passwordData = await passwordRes.json();
        setCurrentPassword(passwordData.password);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/admin/checkout-access/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        setNewUser({ email: '', firstName: '', lastName: '', notes: '', expiresInDays: '' });
        setShowAddForm(false);
        fetchData();
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/admin/checkout-access/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      });
      fetchData();
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this user?')) return;

    try {
      await fetch(`/api/admin/checkout-access/users/${userId}`, {
        method: 'DELETE',
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleUpdatePassword = async () => {
    const newPassword = prompt('Enter new checkout password:', currentPassword);
    if (!newPassword) return;

    try {
      const response = await fetch('/api/admin/checkout-access/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      });

      if (response.ok) {
        setCurrentPassword(newPassword);
        alert('Password updated successfully!');
      }
    } catch (error) {
      console.error('Error updating password:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Checkout Access Management</h1>
        <p className="text-slate-600">Manage who can access the checkout page</p>
      </div>

      {/* Master Password */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-md p-6 mb-6"
      >
        <h2 className="text-xl font-bold text-slate-900 mb-4">Master Checkout Password</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="bg-slate-100 px-4 py-3 rounded-lg font-mono text-lg">
              {currentPassword || 'Not set'}
            </div>
          </div>
          <button
            onClick={handleUpdatePassword}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Change Password
          </button>
        </div>
        <p className="text-sm text-slate-600 mt-2">
          Share this password with users after onboarding calls to grant checkout access.
        </p>
      </motion.div>

      {/* Approved Users */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-md p-6 mb-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">Approved Users</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add User
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddUser} className="mb-6 p-4 bg-slate-50 rounded-lg">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input
                type="email"
                placeholder="Email *"
                required
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="px-4 py-2 border border-slate-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="First Name"
                value={newUser.firstName}
                onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                className="px-4 py-2 border border-slate-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={newUser.lastName}
                onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                className="px-4 py-2 border border-slate-300 rounded-lg"
              />
              <input
                type="number"
                placeholder="Expires in days (optional)"
                value={newUser.expiresInDays}
                onChange={(e) => setNewUser({ ...newUser, expiresInDays: e.target.value })}
                className="px-4 py-2 border border-slate-300 rounded-lg"
              />
            </div>
            <textarea
              placeholder="Notes (optional)"
              value={newUser.notes}
              onChange={(e) => setNewUser({ ...newUser, notes: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg mb-4"
              rows={2}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Add User
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {approvedUsers.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No approved users yet</p>
          ) : (
            approvedUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">
                      {user.first_name && user.last_name
                        ? `${user.first_name} ${user.last_name}`
                        : user.email}
                    </span>
                    {user.is_active ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <p className="text-sm text-slate-600">{user.email}</p>
                  {user.notes && <p className="text-xs text-slate-500 mt-1">{user.notes}</p>}
                  {user.expires_at && (
                    <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Expires: {new Date(user.expires_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleActive(user.id, user.is_active)}
                    className={`px-3 py-1 rounded text-sm ${
                      user.is_active
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {user.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* Access Logs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Access Attempts</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Time</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Identifier</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Result</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">IP</th>
              </tr>
            </thead>
            <tbody>
              {accessLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-500">
                    No access attempts yet
                  </td>
                </tr>
              ) : (
                accessLogs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-700">
                        {log.access_type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-900">{log.identifier}</td>
                    <td className="py-3 px-4">
                      {log.success ? (
                        <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 flex items-center gap-1 w-fit">
                          <CheckCircle className="w-3 h-3" />
                          Success
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 flex items-center gap-1 w-fit">
                          <XCircle className="w-3 h-3" />
                          {log.error_message || 'Failed'}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">{log.ip_address || 'N/A'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
