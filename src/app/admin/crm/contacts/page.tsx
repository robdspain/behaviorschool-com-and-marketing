'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  Building2,
  Tag,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Star,
  StarOff,
  X
} from 'lucide-react';

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  organization: string | null;
  role: string | null;
  status: string;
  lead_score: number;
  priority: string;
  tags: string[] | null;
  created_at: string;
  last_contacted_at: string | null;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [contacts, searchQuery, statusFilter]);

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/admin/crm/contacts');
      if (response.ok) {
        const data = await response.json();
        setContacts(data);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterContacts = () => {
    let filtered = contacts;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.first_name?.toLowerCase().includes(query) ||
          c.last_name?.toLowerCase().includes(query) ||
          c.email?.toLowerCase().includes(query) ||
          c.organization?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    setFilteredContacts(filtered);
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      lead: 'bg-blue-100 text-blue-700',
      contacted: 'bg-yellow-100 text-yellow-700',
      qualified: 'bg-purple-100 text-purple-700',
      onboarding: 'bg-orange-100 text-orange-700',
      customer: 'bg-green-100 text-green-700',
      churned: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      urgent: 'text-red-600',
      high: 'text-orange-600',
      medium: 'text-yellow-600',
      low: 'text-gray-600'
    };
    return colors[priority] || 'text-gray-600';
  };

  const handleDelete = async (contactId: string) => {
    try {
      const response = await fetch(`/api/admin/crm/contacts/${contactId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setContacts(contacts.filter((c) => c.id !== contactId));
        setDeleteConfirm(null);
      } else {
        alert('Failed to delete contact');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Error deleting contact');
    }
  };

  const handleArchive = async (contactId: string) => {
    try {
      const response = await fetch(`/api/admin/crm/contacts/${contactId}/archive`, {
        method: 'POST',
      });
      
      if (response.ok) {
        // Refresh contacts list
        fetchContacts();
      } else {
        alert('Failed to archive contact');
      }
    } catch (error) {
      console.error('Error archiving contact:', error);
      alert('Error archiving contact');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Contacts</h1>
          <p className="text-slate-600">{filteredContacts.length} total contacts</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Contact
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="lead">Lead</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="onboarding">Onboarding</option>
              <option value="customer">Customer</option>
              <option value="churned">Churned</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contacts List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {filteredContacts.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No contacts found</h3>
            <p className="text-slate-600 mb-6">
              {contacts.length === 0
                ? 'Get started by adding your first contact'
                : 'Try adjusting your search or filters'}
            </p>
            {contacts.length === 0 && (
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700"
              >
                <Plus className="w-5 h-5" />
                Add Contact
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Contact Info</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Organization</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Score</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredContacts.map((contact) => (
                  <motion.tr
                    key={contact.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-emerald-700">
                            {contact.first_name[0]}{contact.last_name[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {contact.first_name} {contact.last_name}
                          </p>
                          <p className="text-xs text-slate-500">{contact.role || 'No role'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail className="w-4 h-4" />
                          {contact.email}
                        </div>
                        {contact.phone && (
                          <div className="flex items-center gap-2 text-slate-600 mt-1">
                            <Phone className="w-4 h-4" />
                            {contact.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        {contact.organization || 'N/A'}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          contact.status
                        )}`}
                      >
                        {contact.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-200 rounded-full h-2 w-16">
                          <div
                            className="bg-emerald-600 h-2 rounded-full"
                            style={{ width: `${contact.lead_score}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-slate-700">{contact.lead_score}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedContact(contact)}
                          className="p-2 text-slate-600 hover:bg-slate-100 rounded transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-slate-600 hover:bg-slate-100 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleArchive(contact.id)}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                          title="Archive"
                        >
                          <StarOff className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(contact.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
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

      {/* Contact Detail Modal */}
      <AnimatePresence>
        {selectedContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedContact(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {selectedContact.first_name} {selectedContact.last_name}
                  </h2>
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="p-2 hover:bg-slate-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-medium mt-2 ${getStatusColor(
                    selectedContact.status
                  )}`}
                >
                  {selectedContact.status}
                </span>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-slate-700">
                      <Mail className="w-5 h-5 text-slate-400" />
                      <span>{selectedContact.email}</span>
                    </div>
                    {selectedContact.phone && (
                      <div className="flex items-center gap-3 text-slate-700">
                        <Phone className="w-5 h-5 text-slate-400" />
                        <span>{selectedContact.phone}</span>
                      </div>
                    )}
                    {selectedContact.organization && (
                      <div className="flex items-center gap-3 text-slate-700">
                        <Building2 className="w-5 h-5 text-slate-400" />
                        <span>{selectedContact.organization}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Lead Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Lead Score</p>
                      <p className="text-lg font-semibold text-slate-900">{selectedContact.lead_score}/100</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Priority</p>
                      <p className={`text-lg font-semibold capitalize ${getPriorityColor(selectedContact.priority)}`}>
                        {selectedContact.priority}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedContact.tags && selectedContact.tags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedContact.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-200">
                  <p className="text-xs text-slate-500">
                    Created: {new Date(selectedContact.created_at).toLocaleDateString()}
                  </p>
                  {selectedContact.last_contacted_at && (
                    <p className="text-xs text-slate-500 mt-1">
                      Last contacted: {new Date(selectedContact.last_contacted_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Delete Contact</h3>
                  <p className="text-sm text-slate-600">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-slate-700 mb-6">
                Are you sure you want to permanently delete this contact? All associated data will be removed.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
