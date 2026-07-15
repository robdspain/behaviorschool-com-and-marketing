'use client';

import { useEffect, useState } from 'react';

type InstructorQualification = {
  id: string;
  is_approved?: boolean;
  created_at?: string;
  user?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  };
  qualification_path?: string;
};

export default function ManageInstructorsPage() {
  const [instructors, setInstructors] = useState<InstructorQualification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch('/api/admin/ace/instructors');
        if (!response.ok) throw new Error('Unable to load instructors');
        const body = await response.json();
        setInstructors(body.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load instructors');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return <div className="container mx-auto p-8">Loading instructors...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Manage Instructors</h1>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qualification Path</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {instructors.map((instructor) => {
              const name = [instructor.user?.first_name, instructor.user?.last_name].filter(Boolean).join(' ') || instructor.user?.email || 'Unknown';
              return (
                <tr key={instructor.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{instructor.qualification_path || 'Not set'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{instructor.created_at || ''}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {instructor.is_approved ? 'Approved' : 'Pending review'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {instructors.length === 0 && (
          <div className="p-8 text-center text-slate-600">No instructor qualifications are stored yet.</div>
        )}
      </div>
    </div>
  );
}
