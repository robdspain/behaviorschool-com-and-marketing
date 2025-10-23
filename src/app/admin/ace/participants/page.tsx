'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Search, CheckCircle, XCircle, Edit, Loader2 } from 'lucide-react';
import type { AceUser, AceCredentialType } from '@/lib/ace/types';
import { getCredentialTypeLabel } from '@/lib/ace/registration-validation';

export default function ParticipantsManagementPage() {
  const [participants, setParticipants] = useState<AceUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<AceUser | null>(null);

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    try {
      const response = await fetch('/api/admin/ace/participants');
      const data = await response.json();
      if (data.data) {
        setParticipants(data.data);
      }
    } catch (error) {
      console.error('Error fetching participants:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredParticipants = participants.filter(p =>
    p.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.bacb_id && p.bacb_id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Participant Management</h1>
              <p className="text-slate-600">Manage participant credentials and verification</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or BACB ID..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <p className="text-slate-600 text-sm">Total Participants</p>
            <p className="text-2xl font-bold text-slate-900">{participants.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-slate-600 text-sm">BCBAs</p>
            <p className="text-2xl font-bold text-emerald-600">
              {participants.filter(p => p.credential_type === 'bcba').length}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-slate-600 text-sm">RBTs</p>
            <p className="text-2xl font-bold text-blue-600">
              {participants.filter(p => p.credential_type === 'rbt').length}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-slate-600 text-sm">Pending Verification</p>
            <p className="text-2xl font-bold text-amber-600">
              {participants.filter(p => !p.credential_verified).length}
            </p>
          </Card>
        </div>

        {/* Participants List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {filteredParticipants.map(participant => (
              <Card key={participant.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {participant.first_name} {participant.last_name}
                      </h3>
                      {participant.credential_verified ? (
                        <Badge variant="default" className="bg-emerald-500">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <XCircle className="w-3 h-3 mr-1" />
                          Unverified
                        </Badge>
                      )}
                      {participant.credential_type && (
                        <Badge variant="outline">
                          {participant.credential_type.toUpperCase()}
                        </Badge>
                      )}
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500">Email</p>
                        <p className="font-medium text-slate-900">{participant.email}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">BACB ID</p>
                        <p className="font-medium text-slate-900">
                          {participant.credential_number || participant.bacb_id || 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500">Credential Type</p>
                        <p className="font-medium text-slate-900">
                          {participant.credential_type 
                            ? getCredentialTypeLabel(participant.credential_type)
                            : 'Not set'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingUser(participant)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {filteredParticipants.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">No participants found</p>
          </div>
        )}

        {/* Edit Modal */}
        {editingUser && (
          <EditCredentialModal
            user={editingUser}
            onClose={() => setEditingUser(null)}
            onSuccess={() => {
              setEditingUser(null);
              fetchParticipants();
            }}
          />
        )}
      </div>
    </div>
  );
}

// Edit Credential Modal
function EditCredentialModal({
  user,
  onClose,
  onSuccess,
}: {
  user: AceUser;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    credential_type: user.credential_type || 'pending',
    credential_number: user.credential_number || user.bacb_id || '',
    credential_verified: user.credential_verified || false,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/admin/ace/participants', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          ...formData,
          credential_verified_at: formData.credential_verified ? new Date().toISOString() : null,
        }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        alert('Failed to update credential');
      }
    } catch (error) {
      console.error('Error updating credential:', error);
      alert('Failed to update credential');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Edit Credential</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-sm font-medium text-slate-700 mb-1">Participant</p>
            <p className="text-slate-900">
              {user.first_name} {user.last_name}
            </p>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Credential Type *
            </label>
            <select
              required
              value={formData.credential_type}
              onChange={e => setFormData({ ...formData, credential_type: e.target.value as AceCredentialType })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="pending">Pending Verification</option>
              <option value="bcba">BCBA - Board Certified Behavior Analyst</option>
              <option value="bcaba">BCaBA - Board Certified Assistant Behavior Analyst</option>
              <option value="rbt">RBT - Registered Behavior Technician</option>
              <option value="other">Other Credential</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Credential Number (BACB ID)
            </label>
            <input
              type="text"
              value={formData.credential_number}
              onChange={e => setFormData({ ...formData, credential_number: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="e.g., 1-23-12345"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="verified"
              checked={formData.credential_verified}
              onChange={e => setFormData({ ...formData, credential_verified: e.target.checked })}
              className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
            />
            <label htmlFor="verified" className="text-sm font-medium text-slate-700">
              Credential is verified
            </label>
          </div>

          <p className="text-xs text-slate-500">
            Only verified participants can register for events. Verify credentials by checking against BACB registry.
          </p>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={saving}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

