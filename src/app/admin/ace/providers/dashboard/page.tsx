'use client';

import { useEffect, useMemo, useState } from 'react';

type Provider = {
  id: string;
  provider_name: string;
  bacb_provider_number: string | null;
  primary_email: string;
  expiration_date: string | null;
  can_publish_events: boolean;
  can_issue_certificates: boolean;
  is_active: boolean;
};

export default function ProviderDashboardPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch('/api/admin/ace/providers');
        if (!response.ok) throw new Error('Unable to load providers');
        const body = await response.json();
        setProviders(body.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load providers');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const stats = useMemo(() => ({
    total: providers.length,
    active: providers.filter(provider => provider.is_active).length,
    blocked: providers.filter(provider => !provider.can_publish_events || !provider.can_issue_certificates).length,
  }), [providers]);

  if (loading) {
    return <div className="container mx-auto p-8">Loading provider dashboard...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Provider Dashboard</h1>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Providers</h2>
          <p className="text-4xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Active</h2>
          <p className="text-4xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Operations Blocked</h2>
          <p className="text-4xl font-bold text-amber-600">{stats.blocked}</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Primary Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operations</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {providers.map((provider) => (
              <tr key={provider.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {provider.provider_name}
                  {provider.bacb_provider_number && (
                    <span className="ml-2 text-xs text-gray-500">{provider.bacb_provider_number}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{provider.primary_email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{provider.expiration_date || 'Not set'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {provider.can_publish_events && provider.can_issue_certificates ? 'Enabled' : 'Blocked'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {providers.length === 0 && (
          <div className="p-8 text-center text-slate-600">No providers are stored yet.</div>
        )}
      </div>
    </div>
  );
}
