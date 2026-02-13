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
  X,
  DollarSign,
  Calendar,
  TrendingUp,
  Edit2,
  ExternalLink,
  ChevronDown,
  UserPlus,
} from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  role: string | null;
  type: 'lead' | 'customer' | 'partner' | 'prospect';
  source: 'website' | 'conference' | 'referral' | 'email' | 'social';
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'inactive';
  tags: string[];
  notes: string;
  lastContactDate: string | null;
  createdAt: string;
  updatedAt: string;
  stripeCustomerId: string | null;
  revenue: number;
}

export default function CRMPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Form state for add/edit
  const [formData, setFormData] = useState<Partial<Contact>>({
    name: '',
    email: '',
    phone: '',
    company: '',
    role: '',
    type: 'lead',
    source: 'website',
    status: 'new',
    tags: [],
    notes: '',
    revenue: 0,
  });

  useEffect(() => {
    fetchContacts();
  }, [searchQuery, typeFilter, statusFilter, sourceFilter, selectedTags, sortBy, sortOrder]);

  const fetchContacts = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (typeFilter) params.append('type', typeFilter);
      if (statusFilter) params.append('status', statusFilter);
      if (sourceFilter) params.append('source', sourceFilter);
      if (selectedTags.length > 0) params.append('tags', selectedTags.join(','));
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const response = await fetch(`/api/crm?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setContacts(data.contacts);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = async () => {
    try {
      const response = await fetch('/api/crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowAddModal(false);
        resetForm();
        fetchContacts();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to add contact');
      }
    } catch (error) {
      console.error('Error adding contact:', error);
      alert('Failed to add contact');
    }
  };

  const handleUpdateContact = async (contact: Contact) => {
    try {
      const response = await fetch('/api/crm', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact),
      });

      if (response.ok) {
        fetchContacts();
        setSelectedContact(null);
      }
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      role: '',
      type: 'lead',
      source: 'website',
      status: 'new',
      tags: [],
      notes: '',
      revenue: 0,
    });
  };

  const allTags = Array.from(new Set(contacts.flatMap((c) => c.tags))).sort();

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      lead: 'bg-blue-900 text-blue-300',
      customer: 'bg-emerald-900 text-emerald-300',
      partner: 'bg-purple-900 text-purple-300',
      prospect: 'bg-amber-900 text-amber-300',
    };
    return colors[type] || 'bg-slate-700 text-slate-300';
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      new: 'bg-slate-700 text-slate-300',
      contacted: 'bg-blue-900 text-blue-300',
      qualified: 'bg-purple-900 text-purple-300',
      converted: 'bg-emerald-900 text-emerald-300',
      inactive: 'bg-slate-800 text-slate-400',
    };
    return colors[status] || 'bg-slate-700 text-slate-300';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading CRM...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-100 mb-2">Business CRM</h1>
              <p className="text-slate-400">
                {contacts.length} contacts | Total revenue: ${contacts.reduce((sum, c) => sum + c.revenue, 0).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <UserPlus className="w-5 h-5" />
              Add Contact
            </button>
          </div>

          {/* Search and Filters */}
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search by name, email, company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <Filter className="w-5 h-5" />
                Filters
                {(typeFilter || statusFilter || sourceFilter || selectedTags.length > 0) && (
                  <span className="ml-1 px-2 py-0.5 bg-emerald-600 text-white text-xs rounded-full">
                    {[typeFilter, statusFilter, sourceFilter].filter(Boolean).length + selectedTags.length}
                  </span>
                )}
              </button>

              {/* Sort */}
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-');
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder);
                }}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="updatedAt-desc">Recently Updated</option>
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="revenue-desc">Highest Revenue</option>
                <option value="revenue-asc">Lowest Revenue</option>
              </select>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Type</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">All Types</option>
                    <option value="lead">Lead</option>
                    <option value="customer">Customer</option>
                    <option value="partner">Partner</option>
                    <option value="prospect">Prospect</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="converted">Converted</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Source</label>
                  <select
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">All Sources</option>
                    <option value="website">Website</option>
                    <option value="conference">Conference</option>
                    <option value="referral">Referral</option>
                    <option value="email">Email</option>
                    <option value="social">Social</option>
                  </select>
                </div>

                {/* Tags */}
                {allTags.length > 0 && (
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-slate-400 mb-2">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            selectedTags.includes(tag)
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Contact Cards Grid */}
        {contacts.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No contacts found</p>
            <p className="text-slate-600 text-sm mt-2">Try adjusting your filters or add a new contact</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contacts.map((contact) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-emerald-600 transition-all cursor-pointer"
                onClick={() => setSelectedContact(contact)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-slate-100 mb-1 truncate">
                      {contact.name}
                    </h3>
                    <p className="text-sm text-slate-400 truncate">{contact.email}</p>
                  </div>
                </div>

                {/* Company & Role */}
                {(contact.company || contact.role) && (
                  <div className="mb-4 space-y-1">
                    {contact.company && (
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Building2 className="w-4 h-4" />
                        <span className="truncate">{contact.company}</span>
                      </div>
                    )}
                    {contact.role && (
                      <p className="text-sm text-slate-500 pl-6 truncate">{contact.role}</p>
                    )}
                  </div>
                )}

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(contact.type)}`}>
                    {contact.type}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(contact.status)}`}>
                    {contact.status}
                  </span>
                </div>

                {/* Tags */}
                {contact.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {contact.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                    {contact.tags.length > 3 && (
                      <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs rounded">
                        +{contact.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>{contact.source}</span>
                  {contact.revenue > 0 && (
                    <span className="text-emerald-400 font-medium">${contact.revenue}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add Contact Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-100">Add Contact</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="email@example.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Company</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Company name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Job title"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="lead">Lead</option>
                      <option value="customer">Customer</option>
                      <option value="partner">Partner</option>
                      <option value="prospect">Prospect</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Source</label>
                    <select
                      value={formData.source}
                      onChange={(e) => setFormData({ ...formData, source: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="website">Website</option>
                      <option value="conference">Conference</option>
                      <option value="referral">Referral</option>
                      <option value="email">Email</option>
                      <option value="social">Social</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="converted">Converted</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags?.join(', ')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="BCBA, RBT, CalABA"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Additional notes..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleAddContact}
                    disabled={!formData.name || !formData.email}
                    className="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Contact
                  </button>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="px-6 py-3 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Detail Panel */}
      <AnimatePresence>
        {selectedContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedContact(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, x: 100 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              exit={{ scale: 0.9, opacity: 0, x: 100 }}
              className="bg-slate-900 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-100 mb-1">{selectedContact.name}</h2>
                  <p className="text-slate-400">{selectedContact.email}</p>
                </div>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Contact Info */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase mb-3">Contact Information</h3>
                  <div className="space-y-3">
                    {selectedContact.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-slate-500" />
                        <a href={`tel:${selectedContact.phone}`} className="text-slate-300 hover:text-emerald-400">
                          {selectedContact.phone}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-slate-500" />
                      <a href={`mailto:${selectedContact.email}`} className="text-slate-300 hover:text-emerald-400">
                        {selectedContact.email}
                      </a>
                    </div>
                    {selectedContact.company && (
                      <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-slate-500" />
                        <span className="text-slate-300">
                          {selectedContact.company}
                          {selectedContact.role && ` - ${selectedContact.role}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Classification */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase mb-3">Classification</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded ${getTypeColor(selectedContact.type)}`}>
                      {selectedContact.type}
                    </span>
                    <span className={`px-3 py-1 rounded ${getStatusColor(selectedContact.status)}`}>
                      {selectedContact.status}
                    </span>
                    <span className="px-3 py-1 rounded bg-slate-800 text-slate-300">
                      {selectedContact.source}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                {selectedContact.tags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-400 uppercase mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedContact.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-slate-800 text-slate-300 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Revenue */}
                {selectedContact.revenue > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-400 uppercase mb-3">Revenue</h3>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-emerald-500" />
                      <span className="text-2xl font-bold text-emerald-400">
                        ${selectedContact.revenue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedContact.notes && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-400 uppercase mb-3">Notes</h3>
                    <p className="text-slate-300 whitespace-pre-wrap">{selectedContact.notes}</p>
                  </div>
                )}

                {/* Timestamps */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase mb-3">Timeline</h3>
                  <div className="space-y-2 text-sm text-slate-400">
                    <div>
                      <span className="font-medium">Created:</span>{' '}
                      {new Date(selectedContact.createdAt).toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Updated:</span>{' '}
                      {new Date(selectedContact.updatedAt).toLocaleString()}
                    </div>
                    {selectedContact.lastContactDate && (
                      <div>
                        <span className="font-medium">Last Contact:</span>{' '}
                        {new Date(selectedContact.lastContactDate).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Stripe Link */}
                {selectedContact.stripeCustomerId && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-400 uppercase mb-3">Stripe</h3>
                    <a
                      href={`https://dashboard.stripe.com/customers/${selectedContact.stripeCustomerId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300"
                    >
                      View in Stripe
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-800">
                <button
                  onClick={() => {
                    // TODO: Implement inline editing
                    alert('Edit functionality coming soon!');
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <Edit2 className="w-5 h-5" />
                  Edit Contact
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
