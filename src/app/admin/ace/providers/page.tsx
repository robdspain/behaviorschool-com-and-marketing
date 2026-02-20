'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  User,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Calendar,
  Lock,
  Unlock,
  Edit,
  Plus,
  Loader2,
} from 'lucide-react';
import type { AceProvider, AceProviderType } from '@/lib/ace/types';

export default function ProvidersPage() {
  const [providers, setProviders] = useState<AceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProvider, setEditingProvider] = useState<AceProvider | null>(null);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await fetch('/api/admin/ace/providers');
      const data = await response.json();
      if (data.data) {
        setProviders(data.data);
      }
    } catch (error) {
      console.error('Error fetching providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProviderStatus = (provider: AceProvider) => {
    if (!provider.is_active) return 'Inactive';
    if (!provider.expiration_date) return 'Pending Approval';
    
    const today = new Date();
    const expiration = new Date(provider.expiration_date);
    const graceEnd = provider.grace_period_end_date ? new Date(provider.grace_period_end_date) : null;
    
    if (today <= expiration) return 'Active';
    if (graceEnd && today <= graceEnd) return 'Grace Period';
    return 'Lapsed';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Grace Period': return 'bg-amber-100 text-amber-800';
      case 'Lapsed': return 'bg-red-100 text-red-800';
      case 'Pending Approval': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRenewProvider = async (providerId: string, isLateFee: boolean) => {
    if (!confirm(`Renew provider${isLateFee ? ' with $50 late fee' : ''}?`)) return;

    try {
      const response = await fetch('/api/admin/ace/providers/renew', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider_id: providerId,
          include_late_fee: isLateFee,
        }),
      });

      if (response.ok) {
        await fetchProviders();
        alert('Provider renewed successfully!');
      } else {
        alert('Failed to renew provider');
      }
    } catch (error) {
      console.error('Error renewing provider:', error);
      alert('Failed to renew provider');
    }
  };

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

  const activeCount = providers.filter(p => getProviderStatus(p) === 'Active').length;
  const graceCount = providers.filter(p => getProviderStatus(p) === 'Grace Period').length;
  const lapsedCount = providers.filter(p => getProviderStatus(p) === 'Lapsed').length;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Building2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Provider Management</h1>
              <p className="text-slate-600">Manage ACE providers, renewals, and legal entity verification</p>
            </div>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Provider
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Providers</p>
                <p className="text-3xl font-bold text-slate-900">{providers.length}</p>
              </div>
              <Building2 className="w-10 h-10 text-slate-400" />
            </div>
          </Card>

          <Card className="p-6 bg-green-50 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-800">Active</p>
                <p className="text-3xl font-bold text-green-600">{activeCount}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </Card>

          <Card className="p-6 bg-amber-50 border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-800">Grace Period</p>
                <p className="text-3xl font-bold text-amber-600">{graceCount}</p>
              </div>
              <AlertTriangle className="w-10 h-10 text-amber-600" />
            </div>
          </Card>

          <Card className="p-6 bg-red-50 border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-800">Lapsed</p>
                <p className="text-3xl font-bold text-red-600">{lapsedCount}</p>
              </div>
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
          </Card>
        </div>

        {/* Providers List */}
        {providers.length === 0 ? (
          <Card className="p-12 text-center">
            <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Providers Yet</h3>
            <p className="text-slate-600 mb-6">Create your first ACE provider to get started.</p>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Provider
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {providers.map(provider => {
              const status = getProviderStatus(provider);
              const isOrganization = provider.provider_type === 'organization';
              const needsLegalVerification = isOrganization && !provider.legal_entity_verified;
              const isLapsed = status === 'Lapsed' || status === 'Grace Period';

              return (
                <Card key={provider.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg ${isOrganization ? 'bg-blue-100' : 'bg-emerald-100'}`}>
                          {isOrganization ? (
                            <Building2 className="w-5 h-5 text-blue-600" />
                          ) : (
                            <User className="w-5 h-5 text-emerald-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-slate-900">
                            {provider.provider_name}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {isOrganization ? 'Organization' : 'Individual'} Provider
                            {provider.bacb_provider_number && ` • BACB #${provider.bacb_provider_number}`}
                          </p>
                        </div>
                        <Badge className={getStatusColor(status)}>{status}</Badge>
                        {needsLegalVerification && (
                          <Badge className="bg-orange-100 text-orange-800">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Legal Verification Required
                          </Badge>
                        )}
                      </div>

                      <div className="grid md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-slate-500">Primary Contact</p>
                          <p className="font-medium text-slate-900">{provider.primary_email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Coordinator Years</p>
                          <p className="font-medium text-slate-900">{provider.coordinator_years_certified}+ years</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Expiration</p>
                          <p className="font-medium text-slate-900">
                            {provider.expiration_date 
                              ? new Date(provider.expiration_date).toLocaleDateString()
                              : 'Not set'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Operations</p>
                          <div className="flex items-center gap-2">
                            {provider.can_publish_events ? (
                              <span className="flex items-center text-green-600 text-sm">
                                <Unlock className="w-4 h-4 mr-1" /> Events
                              </span>
                            ) : (
                              <span className="flex items-center text-red-600 text-sm">
                                <Lock className="w-4 h-4 mr-1" /> Events
                              </span>
                            )}
                            {provider.can_issue_certificates ? (
                              <span className="flex items-center text-green-600 text-sm">
                                <Unlock className="w-4 h-4 mr-1" /> Certs
                              </span>
                            ) : (
                              <span className="flex items-center text-red-600 text-sm">
                                <Lock className="w-4 h-4 mr-1" /> Certs
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Legal Entity Verification (Organizations Only) */}
                      {isOrganization && (
                        <div className="bg-slate-50 rounded-lg p-4 mb-4">
                          <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Legal Entity Verification (2026 Requirement)
                          </h4>
                          <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-slate-500">EIN</p>
                              <p className="font-medium">
                                {provider.ein ? (
                                  <span className="flex items-center gap-1 text-green-600">
                                    <CheckCircle className="w-4 h-4" />
                                    {provider.ein}
                                  </span>
                                ) : (
                                  <span className="text-red-600">Missing</span>
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-500">Incorporation Docs</p>
                              <p className="font-medium">
                                {provider.incorporation_doc_url ? (
                                  <span className="flex items-center gap-1 text-green-600">
                                    <CheckCircle className="w-4 h-4" />
                                    Uploaded
                                  </span>
                                ) : (
                                  <span className="text-red-600">Missing</span>
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-500">Leadership Attestation</p>
                              <p className="font-medium">
                                {provider.leadership_attestation_url ? (
                                  <span className="flex items-center gap-1 text-green-600">
                                    <CheckCircle className="w-4 h-4" />
                                    {provider.leadership_name}
                                  </span>
                                ) : (
                                  <span className="text-red-600">Missing</span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Grace Period Alert */}
                      {status === 'Grace Period' && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                          <p className="text-amber-900 font-medium flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Grace Period Ends: {new Date(provider.grace_period_end_date!).toLocaleDateString()}
                          </p>
                          <p className="text-amber-800 text-sm mt-1">
                            A $50 late fee applies. Renew now to restore full operations.
                          </p>
                        </div>
                      )}

                      {/* Lapsed Alert */}
                      {status === 'Lapsed' && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                          <p className="text-red-900 font-medium flex items-center gap-2">
                            <XCircle className="w-4 h-4" />
                            Provider status: LAPSED
                          </p>
                          <p className="text-red-800 text-sm mt-1">
                            Event publishing and certificate issuance are blocked. Renew with $50 late fee to reinstate.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingProvider(provider)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      {isLapsed && (
                        <Button
                          size="sm"
                          onClick={() => handleRenewProvider(provider.id, true)}
                          className="bg-amber-600 hover:bg-amber-700"
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Renew (+$50)
                        </Button>
                      )}
                      {status === 'Active' && provider.expiration_date && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRenewProvider(provider.id, false)}
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Renew Early
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Create/Edit Modal */}
        {(showCreateModal || editingProvider) && (
          <ProviderModal
            provider={editingProvider}
            onClose={() => {
              setShowCreateModal(false);
              setEditingProvider(null);
            }}
            onSuccess={() => {
              setShowCreateModal(false);
              setEditingProvider(null);
              fetchProviders();
            }}
          />
        )}
      </div>
    </div>
  );
}

// Provider Create/Edit Modal
function ProviderModal({
  provider,
  onClose,
  onSuccess,
}: {
  provider: AceProvider | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const isEdit = !!provider;
  const [formData, setFormData] = useState({
    provider_name: provider?.provider_name || '',
    provider_type: provider?.provider_type || 'individual' as AceProviderType,
    bacb_provider_number: provider?.bacb_provider_number || '',
    primary_email: provider?.primary_email || '',
    primary_phone: provider?.primary_phone || '',
    website: provider?.website || '',
    coordinator_years_certified: provider?.coordinator_years_certified || 5,
    ein: provider?.ein || '',
    leadership_name: provider?.leadership_name || '',
    leadership_title: provider?.leadership_title || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/admin/ace/providers', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEdit ? { id: provider.id, ...formData } : formData),
      });

      if (response.ok) {
        onSuccess();
      } else {
        alert(`Failed to ${isEdit ? 'update' : 'create'} provider`);
      }
    } catch (error) {
      console.error('Error saving provider:', error);
      alert(`Failed to ${isEdit ? 'update' : 'create'} provider`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            {isEdit ? 'Edit Provider' : 'Add New Provider'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Provider Name *
              </label>
              <input
                type="text"
                required
                value={formData.provider_name}
                onChange={e => setFormData({ ...formData, provider_name: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="e.g., Behavior School"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Provider Type *
              </label>
              <select
                required
                value={formData.provider_type}
                onChange={e => setFormData({ ...formData, provider_type: e.target.value as AceProviderType })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="individual">Individual (BCBA)</option>
                <option value="organization">Organization</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                BACB Provider Number
              </label>
              <input
                type="text"
                value={formData.bacb_provider_number}
                onChange={e => setFormData({ ...formData, bacb_provider_number: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Assigned by BACB"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Coordinator Years Certified *
              </label>
              <input
                type="number"
                required
                min={5}
                value={formData.coordinator_years_certified}
                onChange={e => setFormData({ ...formData, coordinator_years_certified: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <p className="text-xs text-slate-500 mt-1">Minimum 5 years required</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Primary Email *
              </label>
              <input
                type="email"
                required
                value={formData.primary_email}
                onChange={e => setFormData({ ...formData, primary_email: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Primary Phone
              </label>
              <input
                type="tel"
                value={formData.primary_phone}
                onChange={e => setFormData({ ...formData, primary_phone: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Website
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={e => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="https://..."
            />
          </div>

          {/* Organization-specific fields */}
          {formData.provider_type === 'organization' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
              <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Organization Requirements (2026 BACB)
              </h3>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  EIN (Employer Identification Number) *
                </label>
                <input
                  type="text"
                  required={formData.provider_type === 'organization'}
                  value={formData.ein}
                  onChange={e => setFormData({ ...formData, ein: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="XX-XXXXXXX"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Authorized Officer Name *
                  </label>
                  <input
                    type="text"
                    required={formData.provider_type === 'organization'}
                    value={formData.leadership_name}
                    onChange={e => setFormData({ ...formData, leadership_name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Officer Title *
                  </label>
                  <input
                    type="text"
                    required={formData.provider_type === 'organization'}
                    value={formData.leadership_title}
                    onChange={e => setFormData({ ...formData, leadership_title: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="e.g., CEO, President"
                  />
                </div>
              </div>

              <p className="text-xs text-blue-800">
                Organizations must upload incorporation documents and complete leadership attestation after creation.
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                isEdit ? 'Save Changes' : 'Create Provider'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
