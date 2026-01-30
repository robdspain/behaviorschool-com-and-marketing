'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

interface Deal {
  id: string;
  title: string;
  contact_name: string;
  value: number;
  stage: string;
  probability: number;
  expected_close_date: string;
  created_at: string;
}

export default function PipelinePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStage, setSelectedStage] = useState('all');

  const stages = [
    { id: 'all', name: 'All Deals', color: 'slate' },
    { id: 'qualification', name: 'Qualification', color: 'blue' },
    { id: 'proposal', name: 'Proposal', color: 'purple' },
    { id: 'negotiation', name: 'Negotiation', color: 'orange' },
    { id: 'closed_won', name: 'Closed Won', color: 'green' },
    { id: 'closed_lost', name: 'Closed Lost', color: 'red' }
  ];

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const response = await fetch('/api/admin/crm/deals');
      if (response.ok) {
        const data = await response.json();
        setDeals(data);
      }
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDeals = selectedStage === 'all'
    ? deals
    : deals.filter(d => d.stage === selectedStage);

  const totalValue = filteredDeals.reduce((sum, deal) => sum + deal.value, 0);
  const averageValue = filteredDeals.length > 0 ? totalValue / filteredDeals.length : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading pipeline...</p>
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
            <span>Sales Pipeline</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Sales Pipeline</h1>
          <p className="text-slate-600 mt-1">Track deals through your sales process</p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors">
          <Plus className="w-5 h-5" />
          Add Deal
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-600">Total Pipeline Value</h3>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900">${totalValue.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-600">Active Deals</h3>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900">{filteredDeals.length}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-600">Average Deal Size</h3>
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900">${Math.round(averageValue).toLocaleString()}</p>
        </div>
      </div>

      {/* Stage Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {stages.map((stage) => (
            <button
              key={stage.id}
              onClick={() => setSelectedStage(stage.id)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                selectedStage === stage.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {stage.name}
              <span className="ml-2 text-xs">
                ({deals.filter(d => stage.id === 'all' || d.stage === stage.id).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Deals List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {filteredDeals.length === 0 ? (
          <div className="p-12 text-center">
            <DollarSign className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No deals found</h3>
            <p className="text-slate-600 mb-6">
              {deals.length === 0
                ? 'Get started by adding your first deal'
                : 'Try adjusting your filter'}
            </p>
            {deals.length === 0 && (
              <button className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700">
                <Plus className="w-5 h-5" />
                Add Deal
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Deal</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Contact</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Value</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Stage</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Probability</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Expected Close</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredDeals.map((deal) => (
                  <motion.tr
                    key={deal.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <p className="font-medium text-slate-900">{deal.title}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-slate-700">{deal.contact_name}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-semibold text-slate-900">${deal.value.toLocaleString()}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {deal.stage.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-200 rounded-full h-2 w-16">
                          <div
                            className="bg-emerald-600 h-2 rounded-full"
                            style={{ width: `${deal.probability}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-slate-700">{deal.probability}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(deal.expected_close_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-600 hover:bg-slate-100 rounded transition-colors" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-600 hover:bg-slate-100 rounded transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
