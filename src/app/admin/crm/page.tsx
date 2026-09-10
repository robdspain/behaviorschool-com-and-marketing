'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  Phone,
  Mail,
  Building2,
  X,
  DollarSign,
  Calendar,
  Edit2,
  ExternalLink,
  UserPlus,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Clock,
  Linkedin,
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
  followUpDate: string | null;
  linkedInUrl: string | null;
  programInterest: string | null;
  createdAt: string;
  updatedAt: string;
  stripeCustomerId: string | null;
  revenue: number;
}

interface AdminContactRow {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  phone: string | null;
  organization: string | null;
  role: string | null;
  status: string;
  lead_source: string | null;
  tags: string[] | null;
  notes: string | null;
  follow_up_date: string | null;
  last_contacted_at: string | null;
  stripe_customer_id: string | null;
  revenue: number | null;
  created_at: string;
  updated_at: string;
}

const emptyForm: Partial<Contact> = {
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
  followUpDate: '',
  linkedInUrl: '',
  programInterest: '',
};

function getFollowUpStatus(date: string | null): 'overdue' | 'this-week' | 'future' | null {
  if (!date) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  const weekFromNow = new Date(today);
  weekFromNow.setDate(weekFromNow.getDate() + 7);
  if (d < today) return 'overdue';
  if (d <= weekFromNow) return 'this-week';
  return 'future';
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getDaysOverdue(date: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((today.getTime() - d.getTime()) / 86400000));
}

const allowedSources = new Set(['website', 'conference', 'referral', 'email', 'social']);

function splitName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts.shift() ?? '',
    lastName: parts.join(' '),
  };
}

function toLegacyStatus(status: string): Contact['status'] {
  if (status === 'contacted') return 'contacted';
  if (status === 'qualified' || status === 'onboarding') return 'qualified';
  if (status === 'customer') return 'converted';
  if (status === 'inactive' || status === 'churned') return 'inactive';
  return 'new';
}

function fromLegacyStatus(status?: Contact['status']) {
  if (status === 'contacted') return 'contacted';
  if (status === 'qualified') return 'qualified';
  if (status === 'converted') return 'customer';
  if (status === 'inactive') return 'inactive';
  return 'lead';
}

function toLegacyContact(row: AdminContactRow): Contact {
  const source = row.lead_source && allowedSources.has(row.lead_source)
    ? row.lead_source as Contact['source']
    : 'website';
  const tags = row.tags ?? [];

  return {
    id: row.id,
    name: [row.first_name, row.last_name].filter(Boolean).join(' ').trim(),
    email: row.email,
    phone: row.phone,
    company: row.organization,
    role: row.role,
    type: row.status === 'customer' ? 'customer' : 'lead',
    source,
    status: toLegacyStatus(row.status),
    tags,
    notes: row.notes ?? '',
    lastContactDate: row.last_contacted_at,
    followUpDate: row.follow_up_date,
    linkedInUrl: null,
    programInterest: tags.find((tag) => tag.includes('program')) ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    stripeCustomerId: row.stripe_customer_id,
    revenue: row.revenue ?? 0,
  };
}

function toAdminContactPayload(contact: Partial<Contact>) {
  const { firstName, lastName } = splitName(contact.name ?? '');
  const tags = [...(contact.tags ?? [])];
  if (contact.programInterest && !tags.includes(contact.programInterest)) {
    tags.push(contact.programInterest);
  }

  return {
    firstName,
    lastName,
    email: contact.email,
    phone: contact.phone || undefined,
    organization: contact.company || undefined,
    role: contact.role || undefined,
    status: fromLegacyStatus(contact.status),
    leadSource: contact.source || 'website',
    tags,
    notes: contact.notes || undefined,
    followUpDate: contact.followUpDate || undefined,
    stripeCustomerId: contact.stripeCustomerId || undefined,
    revenue: contact.revenue ?? 0,
  };
}

const inputClass =
  'w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-colors';
const labelClass = 'block text-sm font-medium text-slate-700 mb-1.5';

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
  const [showEditModal, setShowEditModal] = useState(false);
  const [editContact, setEditContact] = useState<Contact | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [followUpOpen, setFollowUpOpen] = useState(true);
  const [formData, setFormData] = useState<Partial<Contact>>(emptyForm);

  useEffect(() => {
    fetchContacts();
  }, [searchQuery, typeFilter, statusFilter, sourceFilter, selectedTags, sortBy, sortOrder]);

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/admin/crm/contacts');
      if (response.ok) {
        const data = await response.json() as AdminContactRow[];
        let nextContacts = data.map(toLegacyContact);

        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          nextContacts = nextContacts.filter((contact) =>
            contact.name.toLowerCase().includes(query) ||
            contact.email.toLowerCase().includes(query) ||
            contact.company?.toLowerCase().includes(query)
          );
        }
        if (typeFilter) nextContacts = nextContacts.filter((contact) => contact.type === typeFilter);
        if (statusFilter) nextContacts = nextContacts.filter((contact) => contact.status === statusFilter);
        if (sourceFilter) nextContacts = nextContacts.filter((contact) => contact.source === sourceFilter);
        if (selectedTags.length > 0) {
          nextContacts = nextContacts.filter((contact) =>
            selectedTags.some((tag) => contact.tags.includes(tag))
          );
        }

        nextContacts.sort((a, b) => {
          let aVal: string | number = String(a[sortBy as keyof Contact] ?? '');
          let bVal: string | number = String(b[sortBy as keyof Contact] ?? '');
          if (sortBy === 'createdAt' || sortBy === 'updatedAt' || sortBy === 'lastContactDate' || sortBy === 'followUpDate') {
            aVal = aVal ? new Date(String(aVal)).getTime() : 0;
            bVal = bVal ? new Date(String(bVal)).getTime() : 0;
          }
          if (sortBy === 'revenue') {
            aVal = Number(aVal) || 0;
            bVal = Number(bVal) || 0;
          }
          if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = String(bVal ?? '').toLowerCase();
          }
          if (sortOrder === 'asc') return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
          return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
        });

        setContacts(nextContacts);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = async () => {
    try {
      const response = await fetch('/api/admin/crm/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toAdminContactPayload(formData)),
      });
      if (response.ok) {
        setShowAddModal(false);
        setFormData(emptyForm);
        fetchContacts();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to add contact');
      }
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  const handleUpdateContact = async (contact: Partial<Contact>) => {
    try {
      const response = await fetch(`/api/admin/crm/contacts/${contact.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toAdminContactPayload(contact)),
      });
      if (response.ok) {
        fetchContacts();
        setShowEditModal(false);
        setEditContact(null);
        setSelectedContact(null);
      }
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const openEdit = (contact: Contact) => {
    setEditContact({ ...contact });
    setShowEditModal(true);
  };

  const clearFilters = () => {
    setTypeFilter('');
    setStatusFilter('');
    setSourceFilter('');
    setSelectedTags([]);
    setSearchQuery('');
  };

  const allTags = Array.from(new Set(contacts.flatMap((c) => c.tags))).sort();

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      lead: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200',
      customer: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
      partner: 'bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-200',
      prospect: 'bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200',
    };
    return colors[type] || 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200',
      contacted: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200',
      qualified: 'bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-200',
      converted: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
      inactive: 'bg-slate-100 text-slate-400 ring-1 ring-inset ring-slate-200',
    };
    return colors[status] || 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200';
  };

  // Follow-up queue
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekFromNow = new Date(today);
  weekFromNow.setDate(weekFromNow.getDate() + 7);

  const overdueContacts = contacts.filter(
    (c) => c.followUpDate && new Date(c.followUpDate) < today
  );
  const thisWeekContacts = contacts.filter(
    (c) => c.followUpDate && new Date(c.followUpDate) >= today && new Date(c.followUpDate) <= weekFromNow
  );
  const hasFollowUps = overdueContacts.length > 0 || thisWeekContacts.length > 0;
  const totalRevenue = contacts.reduce((sum, c) => sum + (c.revenue || 0), 0);
  const activeFilterCount =
    [typeFilter, statusFilter, sourceFilter].filter(Boolean).length + selectedTags.length;

  const ContactForm = ({
    data,
    onChange,
    onSubmit,
    onCancel,
    submitLabel,
  }: {
    data: Partial<Contact>;
    onChange: (d: Partial<Contact>) => void;
    onSubmit: () => void;
    onCancel: () => void;
    submitLabel: string;
  }) => (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Name *</label>
        <input type="text" value={data.name || ''} onChange={(e) => onChange({ ...data, name: e.target.value })}
          className={inputClass} placeholder="Full name" />
      </div>
      <div>
        <label className={labelClass}>Email *</label>
        <input type="email" value={data.email || ''} onChange={(e) => onChange({ ...data, email: e.target.value })}
          className={inputClass} placeholder="email@example.com" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Phone</label>
          <input type="tel" value={data.phone || ''} onChange={(e) => onChange({ ...data, phone: e.target.value })}
            className={inputClass} placeholder="(555) 123-4567" />
        </div>
        <div>
          <label className={labelClass}>Company</label>
          <input type="text" value={data.company || ''} onChange={(e) => onChange({ ...data, company: e.target.value })}
            className={inputClass} placeholder="Company name" />
        </div>
      </div>
      <div>
        <label className={labelClass}>Role</label>
        <input type="text" value={data.role || ''} onChange={(e) => onChange({ ...data, role: e.target.value })}
          className={inputClass} placeholder="Job title" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Type</label>
          <select value={data.type} onChange={(e) => onChange({ ...data, type: e.target.value as Contact['type'] })}
            className={inputClass}>
            <option value="lead">Lead</option>
            <option value="customer">Customer</option>
            <option value="partner">Partner</option>
            <option value="prospect">Prospect</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Source</label>
          <select value={data.source} onChange={(e) => onChange({ ...data, source: e.target.value as Contact['source'] })}
            className={inputClass}>
            <option value="website">Website</option>
            <option value="conference">Conference</option>
            <option value="referral">Referral</option>
            <option value="email">Email</option>
            <option value="social">Social</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select value={data.status} onChange={(e) => onChange({ ...data, status: e.target.value as Contact['status'] })}
            className={inputClass}>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="converted">Converted</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Follow-up Date</label>
          <input type="date" value={data.followUpDate || ''} onChange={(e) => onChange({ ...data, followUpDate: e.target.value || null })}
            className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Program Interest</label>
          <input type="text" value={data.programInterest || ''} onChange={(e) => onChange({ ...data, programInterest: e.target.value || null })}
            className={inputClass} placeholder="e.g. transformation-program" />
        </div>
      </div>
      <div>
        <label className={labelClass}>LinkedIn URL</label>
        <input type="url" value={data.linkedInUrl || ''} onChange={(e) => onChange({ ...data, linkedInUrl: e.target.value || null })}
          className={inputClass} placeholder="https://linkedin.com/in/..." />
      </div>
      <div>
        <label className={labelClass}>Tags (comma-separated)</label>
        <input type="text" value={data.tags?.join(', ') || ''} onChange={(e) => onChange({ ...data, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}
          className={inputClass} placeholder="BCBA, RBT, CalABA" />
      </div>
      <div>
        <label className={labelClass}>Notes</label>
        <textarea value={data.notes || ''} onChange={(e) => onChange({ ...data, notes: e.target.value })}
          rows={3} className={inputClass} placeholder="Additional notes..." />
      </div>
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
        <button onClick={onCancel} className="px-6 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors font-medium">
          Cancel
        </button>
        <button onClick={onSubmit} disabled={!data.name || !data.email}
          className="flex-1 bg-emerald-700 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold">
          {submitLabel}
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 text-sm">Loading CRM...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700 mb-1.5">Leads · CRM</p>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Business CRM</h1>
              <p className="text-sm text-slate-500 mt-1.5">
                {contacts.length} contacts
                <span className="mx-2 text-slate-300">|</span>
                ${totalRevenue.toLocaleString()} tracked revenue
                {overdueContacts.length > 0 && (
                  <span className="mx-2 text-slate-300">|</span>
                )}
                {overdueContacts.length > 0 && (
                  <span className="font-medium text-red-700">{overdueContacts.length} need follow-up</span>
                )}
              </p>
            </div>
            <button onClick={() => setShowAddModal(true)}
              className="inline-flex items-center justify-center gap-2 bg-emerald-700 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-800 transition-colors font-semibold text-sm shadow-sm shrink-0">
              <UserPlus className="w-4 h-4" />
              Add Contact
            </button>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <Users className="w-4 h-4 text-emerald-700" />
                </span>
                <span className="text-xs font-medium text-slate-500">Contacts</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 tabular-nums">{contacts.length}</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-emerald-700" />
                </span>
                <span className="text-xs font-medium text-slate-500">Tracked revenue</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 tabular-nums">${totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="flex items-center gap-2.5 mb-2">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${overdueContacts.length > 0 ? 'bg-red-50' : 'bg-slate-100'}`}>
                  <AlertCircle className={`w-4 h-4 ${overdueContacts.length > 0 ? 'text-red-600' : 'text-slate-400'}`} />
                </span>
                <span className="text-xs font-medium text-slate-500">Overdue</span>
              </div>
              <p className={`text-2xl font-bold tabular-nums ${overdueContacts.length > 0 ? 'text-red-700' : 'text-slate-900'}`}>
                {overdueContacts.length}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-amber-700" />
                </span>
                <span className="text-xs font-medium text-slate-500">Due this week</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 tabular-nums">{thisWeekContacts.length}</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search by name, email, company..."
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 focus:bg-white transition-colors" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowFilters(!showFilters)}
                  className={`inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${showFilters || activeFilterCount > 0 ? 'border-emerald-600 text-emerald-700 bg-emerald-50' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                  <Filter className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="px-1.5 py-0.5 bg-emerald-700 text-white text-xs font-semibold rounded-full tabular-nums">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
                <select value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => { const [b, o] = e.target.value.split('-'); setSortBy(b); setSortOrder(o); }}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600">
                  <option value="updatedAt-desc">Recently updated</option>
                  <option value="followUpDate-asc">Upcoming follow-ups</option>
                  <option value="createdAt-desc">Newest first</option>
                  <option value="createdAt-asc">Oldest first</option>
                  <option value="name-asc">Name (A to Z)</option>
                  <option value="name-desc">Name (Z to A)</option>
                  <option value="revenue-desc">Highest revenue</option>
                </select>
              </div>
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Type</label>
                    <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
                      className={inputClass}>
                      <option value="">All types</option>
                      <option value="lead">Lead</option>
                      <option value="customer">Customer</option>
                      <option value="partner">Partner</option>
                      <option value="prospect">Prospect</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Status</label>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                      className={inputClass}>
                      <option value="">All statuses</option>
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="converted">Converted</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Source</label>
                    <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}
                      className={inputClass}>
                      <option value="">All sources</option>
                      <option value="website">Website</option>
                      <option value="conference">Conference</option>
                      <option value="referral">Referral</option>
                      <option value="email">Email</option>
                      <option value="social">Social</option>
                    </select>
                  </div>
                </div>
                {allTags.length > 0 && (
                  <div className="mt-4">
                    <label className={labelClass}>Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map((tag) => (
                        <button key={tag} onClick={() => toggleTag(tag)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${selectedTags.includes(tag) ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="mt-4 text-sm font-medium text-emerald-700 hover:text-emerald-800">
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Follow-up Queue */}
        <div className="mb-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <button onClick={() => setFollowUpOpen(!followUpOpen)}
              className="w-full flex items-center justify-between px-4 sm:px-5 py-3.5 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-amber-700" />
                </span>
                <span className="text-slate-900 font-semibold text-sm sm:text-base">Follow-up queue</span>
                {overdueContacts.length > 0 && (
                  <span className="px-2 py-0.5 bg-red-50 text-red-700 ring-1 ring-inset ring-red-200 text-xs font-semibold rounded-full whitespace-nowrap">
                    {overdueContacts.length} overdue
                  </span>
                )}
                {thisWeekContacts.length > 0 && (
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200 text-xs font-semibold rounded-full whitespace-nowrap hidden sm:inline-block">
                    {thisWeekContacts.length} this week
                  </span>
                )}
              </div>
              {followUpOpen ? <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
            </button>

            <AnimatePresence>
              {followUpOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden">
                  <div className="border-t border-slate-100">
                    {!hasFollowUps ? (
                      <div className="text-center py-8 px-4">
                        <span className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                          <Clock className="w-5 h-5 text-emerald-700" />
                        </span>
                        <p className="text-sm font-medium text-slate-900">All caught up</p>
                        <p className="text-sm text-slate-500 mt-1">No follow-ups scheduled right now.</p>
                      </div>
                    ) : (
                      <ul className="divide-y divide-slate-100">
                        {overdueContacts.map((contact) => {
                          const days = contact.followUpDate ? getDaysOverdue(contact.followUpDate) : 0;
                          return (
                            <li key={contact.id}
                              className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 hover:bg-red-50/40 transition-colors cursor-pointer border-l-[3px] border-l-red-400"
                              onClick={() => setSelectedContact(contact)}>
                              <span className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center shrink-0">
                                {getInitials(contact.name)}
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-slate-900 truncate">{contact.name}</p>
                                <p className="text-xs text-slate-500 truncate">
                                  {[contact.role, contact.company].filter(Boolean).join(' · ') || contact.email}
                                </p>
                              </div>
                              {contact.programInterest && (
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-md hidden lg:inline-block shrink-0">{contact.programInterest}</span>
                              )}
                              <div className="flex items-center gap-1.5 shrink-0">
                                <div className="text-right mr-1">
                                  <p className="text-xs font-semibold text-red-700 tabular-nums">{formatDate(contact.followUpDate!)}</p>
                                  <p className="text-[11px] text-red-600">{days === 0 ? 'Due today' : `${days}d overdue`}</p>
                                </div>
                                <a href={`mailto:${contact.email}`} onClick={(e) => e.stopPropagation()} aria-label={`Email ${contact.name}`}
                                  className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-emerald-700 transition-colors border border-transparent hover:border-slate-200">
                                  <Mail className="w-4 h-4" />
                                </a>
                                <button onClick={(e) => { e.stopPropagation(); openEdit(contact); }} aria-label={`Edit ${contact.name}`}
                                  className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-slate-700 transition-colors border border-transparent hover:border-slate-200">
                                  <Edit2 className="w-4 h-4" />
                                </button>
                              </div>
                            </li>
                          );
                        })}
                        {thisWeekContacts.map((contact) => (
                          <li key={contact.id}
                            className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 hover:bg-amber-50/40 transition-colors cursor-pointer border-l-[3px] border-l-amber-300"
                            onClick={() => setSelectedContact(contact)}>
                            <span className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center shrink-0">
                              {getInitials(contact.name)}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-slate-900 truncate">{contact.name}</p>
                              <p className="text-xs text-slate-500 truncate">
                                {[contact.role, contact.company].filter(Boolean).join(' · ') || contact.email}
                              </p>
                            </div>
                            {contact.programInterest && (
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-md hidden lg:inline-block shrink-0">{contact.programInterest}</span>
                            )}
                            <div className="flex items-center gap-1.5 shrink-0">
                              <p className="text-xs font-medium text-amber-800 tabular-nums mr-1">{formatDate(contact.followUpDate!)}</p>
                              <a href={`mailto:${contact.email}`} onClick={(e) => e.stopPropagation()} aria-label={`Email ${contact.name}`}
                                className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-emerald-700 transition-colors border border-transparent hover:border-slate-200">
                                <Mail className="w-4 h-4" />
                              </a>
                              <button onClick={(e) => { e.stopPropagation(); openEdit(contact); }} aria-label={`Edit ${contact.name}`}
                                className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-slate-700 transition-colors border border-transparent hover:border-slate-200">
                                <Edit2 className="w-4 h-4" />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Contact list */}
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm font-semibold text-slate-900">
            All contacts <span className="ml-1 font-normal text-slate-400 tabular-nums">({contacts.length})</span>
          </h2>
          <p className="text-xs text-slate-400 hidden sm:block">Select a row to view details</p>
        </div>
        {contacts.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm text-center py-14 px-6">
            <span className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-slate-400" />
            </span>
            <p className="text-slate-900 font-semibold">No contacts found</p>
            <p className="text-slate-500 text-sm mt-1.5">Try adjusting your filters or add a new contact to get started.</p>
            <button onClick={() => setShowAddModal(true)}
              className="mt-5 inline-flex items-center gap-2 bg-emerald-700 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-800 transition-colors font-semibold text-sm">
              <UserPlus className="w-4 h-4" />
              Add Contact
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Column headers, desktop only */}
            <div className="hidden lg:grid grid-cols-[minmax(0,1.6fr)_minmax(0,1.4fr)_minmax(0,1fr)_auto] gap-4 px-5 py-2.5 bg-slate-50 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <span>Contact</span>
              <span>Organization</span>
              <span>Status</span>
              <span className="text-right w-28">Follow-up</span>
            </div>
            <ul className="divide-y divide-slate-100">
              {contacts.map((contact) => {
                const fuStatus = getFollowUpStatus(contact.followUpDate);
                return (
                  <li key={contact.id}>
                    <div
                      className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedContact(contact)}>
                      <span className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0 ring-1 ring-inset ring-emerald-100">
                        {getInitials(contact.name)}
                      </span>
                      <div className="min-w-0 flex-1 lg:flex-none lg:w-auto lg:grid lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-4 lg:flex-1 lg:items-center">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">{contact.name}</p>
                          <p className="text-xs text-slate-500 truncate">{contact.email}</p>
                          <p className="text-xs text-slate-500 truncate lg:hidden mt-0.5">
                            {[contact.role, contact.company].filter(Boolean).join(' · ')}
                          </p>
                        </div>
                        <div className="min-w-0 hidden lg:block">
                          {contact.company ? (
                            <>
                              <p className="text-sm text-slate-700 truncate flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="truncate">{contact.company}</span>
                              </p>
                              {contact.role && <p className="text-xs text-slate-400 truncate pl-5">{contact.role}</p>}
                            </>
                          ) : (
                            <p className="text-xs text-slate-300">No organization</p>
                          )}
                        </div>
                        <div className="hidden lg:flex flex-wrap items-center gap-1.5 min-w-0">
                          <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold capitalize ${getTypeColor(contact.type)}`}>{contact.type}</span>
                          <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold capitalize ${getStatusColor(contact.status)}`}>{contact.status}</span>
                          {contact.tags.slice(0, 1).map((tag) => (
                            <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[11px] rounded-md truncate max-w-28">{tag}</span>
                          ))}
                          {contact.tags.length > 1 && (
                            <span className="text-[11px] text-slate-400">+{contact.tags.length - 1}</span>
                          )}
                        </div>
                      </div>
                      {/* Mobile pills */}
                      <div className="flex lg:hidden flex-wrap gap-1.5 max-w-24 justify-end shrink-0">
                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold capitalize ${getStatusColor(contact.status)}`}>{contact.status}</span>
                      </div>
                      <div className="hidden sm:flex flex-col items-end shrink-0 w-28">
                        {contact.followUpDate && fuStatus ? (
                          <>
                            <span className={`text-xs font-semibold tabular-nums ${fuStatus === 'overdue' ? 'text-red-700' : fuStatus === 'this-week' ? 'text-amber-800' : 'text-slate-500'}`}>
                              {formatDate(contact.followUpDate)}
                            </span>
                            {fuStatus === 'overdue' && (
                              <span className="mt-0.5 px-1.5 py-px bg-red-50 text-red-700 ring-1 ring-inset ring-red-200 text-[10px] font-semibold rounded">Overdue</span>
                            )}
                          </>
                        ) : (
                          <span className="text-xs text-slate-300">No date</span>
                        )}
                        {contact.revenue > 0 && (
                          <span className="text-xs font-semibold text-emerald-700 tabular-nums mt-0.5">${contact.revenue.toLocaleString()}</span>
                        )}
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); openEdit(contact); }} aria-label={`Edit ${contact.name}`}
                        className="p-2 hover:bg-white rounded-lg text-slate-300 hover:text-slate-600 transition-colors shrink-0 border border-transparent hover:border-slate-200 hover:shadow-sm">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {/* Add Contact Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-[2px] flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}>
            <motion.div initial={{ scale: 0.96, opacity: 0, y: 12 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.96, opacity: 0, y: 12 }}
              transition={{ duration: 0.18 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-xl"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">Add contact</h2>
                <button onClick={() => setShowAddModal(false)} aria-label="Close" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <p className="text-sm text-slate-500 mb-5">Add a new person to the CRM pipeline.</p>
              <ContactForm data={formData} onChange={setFormData} onSubmit={handleAddContact}
                onCancel={() => { setShowAddModal(false); setFormData(emptyForm); }} submitLabel="Add Contact" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Contact Modal */}
      <AnimatePresence>
        {showEditModal && editContact && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-[2px] flex items-center justify-center z-50 p-4"
            onClick={() => setShowEditModal(false)}>
            <motion.div initial={{ scale: 0.96, opacity: 0, y: 12 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.96, opacity: 0, y: 12 }}
              transition={{ duration: 0.18 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-xl"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">Edit contact</h2>
                <button onClick={() => setShowEditModal(false)} aria-label="Close" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <p className="text-sm text-slate-500 mb-5">Update details for {editContact.name}.</p>
              <ContactForm data={editContact} onChange={(d) => setEditContact(d as Contact)}
                onSubmit={() => handleUpdateContact(editContact)}
                onCancel={() => { setShowEditModal(false); setEditContact(null); }} submitLabel="Save Changes" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Detail Panel */}
      <AnimatePresence>
        {selectedContact && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-[2px] flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedContact(null)}>
            <motion.div initial={{ scale: 0.96, opacity: 0, y: 12 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.96, opacity: 0, y: 12 }}
              transition={{ duration: 0.18 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-xl"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4 min-w-0">
                  <span className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-800 text-sm font-bold flex items-center justify-center shrink-0 ring-1 ring-inset ring-emerald-100">
                    {getInitials(selectedContact.name)}
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 truncate">{selectedContact.name}</h2>
                    <p className="text-sm text-slate-500 truncate">{selectedContact.email}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedContact(null)} aria-label="Close" className="p-2 hover:bg-slate-100 rounded-lg transition-colors shrink-0">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Contact information</h3>
                  <div className="space-y-3">
                    {selectedContact.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <a href={`tel:${selectedContact.phone}`} className="text-sm text-slate-700 hover:text-emerald-700">{selectedContact.phone}</a>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <a href={`mailto:${selectedContact.email}`} className="text-sm text-slate-700 hover:text-emerald-700">{selectedContact.email}</a>
                    </div>
                    {selectedContact.company && (
                      <div className="flex items-center gap-3">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-700">{selectedContact.company}{selectedContact.role ? ` · ${selectedContact.role}` : ''}</span>
                      </div>
                    )}
                    {selectedContact.linkedInUrl && (
                      <div className="flex items-center gap-3">
                        <Linkedin className="w-4 h-4 text-slate-400" />
                        <a href={selectedContact.linkedInUrl} target="_blank" rel="noopener noreferrer"
                          className="text-sm text-slate-700 hover:text-blue-700 flex items-center gap-1">
                          LinkedIn Profile <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {selectedContact.followUpDate && (
                  <div>
                    <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Follow-up</h3>
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${getFollowUpStatus(selectedContact.followUpDate) === 'overdue' ? 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200' : 'bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200'}`}>
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(selectedContact.followUpDate)}</span>
                      {getFollowUpStatus(selectedContact.followUpDate) === 'overdue' && <span className="text-xs font-semibold">Overdue</span>}
                    </div>
                    {selectedContact.programInterest && <p className="mt-2 text-sm text-slate-500">Interest: {selectedContact.programInterest}</p>}
                  </div>
                )}

                <div>
                  <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Classification</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize ${getTypeColor(selectedContact.type)}`}>{selectedContact.type}</span>
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize ${getStatusColor(selectedContact.status)}`}>{selectedContact.status}</span>
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium capitalize ring-1 ring-inset ring-slate-200">{selectedContact.source}</span>
                  </div>
                </div>

                {selectedContact.tags.length > 0 && (
                  <div>
                    <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedContact.tags.map((tag) => (
                        <span key={tag} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedContact.revenue > 0 && (
                  <div>
                    <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Revenue</h3>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-emerald-700" />
                      <span className="text-2xl font-bold text-emerald-700 tabular-nums">${selectedContact.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {selectedContact.notes && (
                  <div>
                    <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Notes</h3>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap bg-slate-50 border border-slate-100 rounded-lg p-3">{selectedContact.notes}</p>
                  </div>
                )}

                <div>
                  <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Timeline</h3>
                  <div className="space-y-1.5 text-sm text-slate-500">
                    <div>Created: {new Date(selectedContact.createdAt).toLocaleString()}</div>
                    <div>Updated: {new Date(selectedContact.updatedAt).toLocaleString()}</div>
                    {selectedContact.lastContactDate && <div>Last contact: {new Date(selectedContact.lastContactDate).toLocaleString()}</div>}
                  </div>
                </div>

                {selectedContact.stripeCustomerId && (
                  <div>
                    <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Stripe</h3>
                    <a href={`https://dashboard.stripe.com/customers/${selectedContact.stripeCustomerId}`}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:text-emerald-800">
                      View in Stripe <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100">
                <button onClick={() => { const c = selectedContact; setSelectedContact(null); openEdit(c); }}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-700 text-white px-6 py-2.5 rounded-xl hover:bg-emerald-800 transition-colors font-semibold text-sm">
                  <Edit2 className="w-4 h-4" />
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
