'use client';

import { useEffect, useState } from 'react';

// Mock data - replace with actual API calls
const mockProviderData = {
  name: 'Behavior School',
  bacbProviderNumber: 'OP-21-3333',
  coordinator: 'Rob Spain',
  renewalDate: '2025-10-23',
  complianceScore: 98,
};

const mockEvents = [
  { id: '1', title: 'Introduction to ACT', status: 'Approved', participants: 30, date: '2024-11-15' },
  { id: '2', title: 'Advanced FBA Techniques', status: 'Pending Approval', participants: 0, date: '2024-12-01' },
  { id: '3', title: 'Ethics in Supervision', status: 'Completed', participants: 25, date: '2024-10-01' },
];

export default function ProviderDashboardPage() {
  const [providerData, setProviderData] = useState(mockProviderData);
  const [events, setEvents] = useState(mockEvents);

  // TODO: Fetch real data from API
  // useEffect(() => {
  //   // Fetch provider data
  //   // Fetch events
  // }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Provider Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Provider Information</h2>
          <p><strong>Name:</strong> {providerData.name}</p>
          <p><strong>BACB #:</strong> {providerData.bacbProviderNumber}</p>
          <p><strong>Coordinator:</strong> {providerData.coordinator}</p>
          <p><strong>Renewal Date:</strong> {providerData.renewalDate}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold mb-2">Compliance Score</h2>
          <div className="text-6xl font-bold text-green-600">{providerData.complianceScore}%</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
          <div className="space-y-2">
            <button className="w-full text-left p-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Create New Event</button>
            <button className="w-full text-left p-2 bg-gray-200 rounded hover:bg-gray-300">Manage Instructors</button>
            <button className="w-full text-left p-2 bg-gray-200 rounded hover:bg-gray-300">View Audit Reports</button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Events</h2>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Edit</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{event.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      event.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      event.status === 'Pending Approval' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.participants}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href="#" className="text-indigo-600 hover:text-indigo-900">Manage</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
