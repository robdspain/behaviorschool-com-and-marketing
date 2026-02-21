'use client';

import { useState } from 'react';

const mockInstructors = [
  { id: '1', name: 'Dr. Jane Smith', qualification: 'PhD, BCBA-D', status: 'Pending Approval', submissionDate: '2024-10-20' },
  { id: '2', name: 'John Doe', qualification: 'BCBA', status: 'Approved', submissionDate: '2024-09-15' },
  { id: '3', name: 'Dr. Emily White', qualification: 'PhD in Behavior Analysis', status: 'Rejected', submissionDate: '2024-10-18' },
];

export default function ManageInstructorsPage() {
  const [instructors, setInstructors] = useState(mockInstructors);

  const handleApprove = (id: string) => {
    setInstructors(instructors.map(inst => inst.id === id ? { ...inst, status: 'Approved' } : inst));
  };

  const handleReject = (id: string) => {
    setInstructors(instructors.map(inst => inst.id === id ? { ...inst, status: 'Rejected' } : inst));
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Manage Instructors</h1>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qualification</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submission Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {instructors.map((instructor) => (
              <tr key={instructor.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{instructor.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{instructor.qualification}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{instructor.submissionDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    instructor.status === 'Approved' ? 'bg-green-100 text-green-800' :
                    instructor.status === 'Pending Approval' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {instructor.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button onClick={() => handleApprove(instructor.id)} className="text-indigo-600 hover:text-indigo-900 disabled:text-gray-400" disabled={instructor.status === 'Approved'}>Approve</button>
                  <button onClick={() => handleReject(instructor.id)} className="text-red-600 hover:text-red-900 disabled:text-gray-400" disabled={instructor.status === 'Rejected'}>Reject</button>
                  <a href="#" className="text-gray-600 hover:text-gray-900">View Docs</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
