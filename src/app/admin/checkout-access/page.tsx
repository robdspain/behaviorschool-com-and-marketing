'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Lock,
  Mail,
  Plus,
  Trash2,
  UserCheck,
  Clock,
  Send,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface CheckoutAccess {
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
  error_message: string | null;
  created_at: string;
}

export default function CheckoutAccessPage() {
  const [password, setPassword] = useState('SchoolBCBA2025');
  const [showPassword, setShowPassword] = useState(false);
  const [approvedUsers, setApprovedUsers] = useState<CheckoutAccess[]>([]);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // New user form
  const [newUser, setNewUser] = useState({
    email: '',
    first_name: '',
    last_name: '',
    notes: '',
    expires_at: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [passwordRes, usersRes, logsRes] = await Promise.all([
        fetch('/api/admin/checkout-access/password'),
        fetch('/api/admin/checkout-access/users'),
        fetch('/api/admin/checkout-access/logs'),
      ]);

      if (passwordRes.ok) {
        const passwordData = await passwordRes.json();
        setPassword(passwordData.password);
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setApprovedUsers(usersData.users);
      }

      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setAccessLogs(logsData.logs);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/checkout-access/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        showSuccess('Password updated successfully!');
      }
    } catch (error) {
      console.error('Error updating password:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const addUser = async () => {
    if (!newUser.email) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/checkout-access/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        showSuccess('User added successfully!');
        setNewUser({ email: '', first_name: '', last_name: '', notes: '', expires_at: '' });
        fetchData();
      }
    } catch (error) {
      console.error('Error adding user:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to remove this user?')) return;

    try {
      const response = await fetch(`/api/admin/checkout-access/users?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showSuccess('User removed successfully!');
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const toggleUserActive = async (user: CheckoutAccess) => {
    try {
      const response = await fetch('/api/admin/checkout-access/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, is_active: !user.is_active }),
      });

      if (response.ok) {
        showSuccess('User status updated!');
        fetchData();
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const sendInvitationEmail = async (user: CheckoutAccess) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/checkout-access/send-invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
        }),
      });

      if (response.ok) {
        showSuccess(`Invitation email sent to ${user.email}!`);
      } else {
        alert('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Checkout Access Management</h1>
        <p className="text-slate-600">
          Manage who can access the transformation program checkout page
        </p>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <p className="text-emerald-700">{successMessage}</p>
        </div>
      )}

      {/* Master Password Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Master Checkout Password
          </CardTitle>
          <CardDescription>
            This password can be shared with users after their onboarding call to grant them access to checkout.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-2">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button onClick={updatePassword} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Update Password'}
            </Button>
          </div>
          <p className="text-sm text-slate-500 mt-4">
            Checkout URL: <span className="font-mono bg-slate-100 px-2 py-1 rounded">
              https://behaviorschool.com/transformation-program/checkout
            </span>
          </p>
        </CardContent>
      </Card>

      {/* Add New User Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            Add Approved User
          </CardTitle>
          <CardDescription>
            Pre-approve specific users by email. They can access checkout without the password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="user@example.com"
              />
            </div>
            <div>
              <Label htmlFor="expires_at">Expiration Date (Optional)</Label>
              <Input
                id="expires_at"
                type="date"
                value={newUser.expires_at}
                onChange={(e) => setNewUser({ ...newUser, expires_at: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={newUser.first_name}
                onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={newUser.last_name}
                onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newUser.notes}
                onChange={(e) => setNewUser({ ...newUser, notes: e.target.value })}
                placeholder="Add any notes about this user..."
                rows={2}
              />
            </div>
          </div>
          <Button onClick={addUser} disabled={isSaving || !newUser.email}>
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </CardContent>
      </Card>

      {/* Approved Users List */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Approved Users ({approvedUsers.length})</CardTitle>
          <CardDescription>
            Users who can access checkout by entering their email
          </CardDescription>
        </CardHeader>
        <CardContent>
          {approvedUsers.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No approved users yet</p>
          ) : (
            <div className="space-y-4">
              {approvedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <p className="font-medium text-slate-900">
                        {user.first_name} {user.last_name}
                      </p>
                      <span className="text-slate-600">{user.email}</span>
                      {user.expires_at && (
                        <span className="text-sm text-orange-600 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Expires: {new Date(user.expires_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {user.notes && (
                      <p className="text-sm text-slate-500 mt-1">{user.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`active-${user.id}`} className="text-sm">
                        Active
                      </Label>
                      <Switch
                        id={`active-${user.id}`}
                        checked={user.is_active}
                        onCheckedChange={() => toggleUserActive(user)}
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => sendInvitationEmail(user)}
                      disabled={isSaving}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Invitation
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteUser(user.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Access Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Access Attempts</CardTitle>
          <CardDescription>
            Monitor all checkout access attempts (last 50)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {accessLogs.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No access attempts yet</p>
          ) : (
            <div className="space-y-2">
              {accessLogs.map((log) => (
                <div
                  key={log.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    log.success ? 'bg-emerald-50' : 'bg-red-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {log.success ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {log.access_type === 'email' ? (
                          <>
                            <Mail className="w-4 h-4 inline mr-1" />
                            Email: {log.identifier}
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4 inline mr-1" />
                            Password attempt
                          </>
                        )}
                      </p>
                      {log.error_message && (
                        <p className="text-xs text-red-600">{log.error_message}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm text-slate-500">
                    <p>{new Date(log.created_at).toLocaleString()}</p>
                    {log.ip_address && (
                      <p className="text-xs">{log.ip_address}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
