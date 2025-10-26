"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Edit, Archive, ArchiveRestore, Plus, Save, X, Clock, Power, FileText, Eye } from "lucide-react";

interface EmailTemplate {
  id: string;
  name: string;
  description: string | null;
  subject: string;
  body_text: string | null;
  body_html: string | null;
  category: string;
  is_active: boolean;
  send_delay_minutes: number;
  archived: boolean;
  archived_at: string | null;
  archived_by: string | null;
  created_at: string;
  updated_at: string;
}

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [archivingId, setArchivingId] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    subject: "",
    body_text: "",
    body_html: "",
    category: "signup",
    send_delay_minutes: 0,
    is_active: true
  });

  useEffect(() => {
    // Set page title
    document.title = 'Email Templates | Behavior School Admin'

    fetchTemplates();
  }, [showArchived]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const url = `/api/admin/email-templates?show_archived=${showArchived}`;
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setTemplates(data.templates || []);
      } else {
        setError(data.error || 'Failed to fetch templates');
      }
    } catch (err) {
      setError('Network error loading templates');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      description: template.description || "",
      subject: template.subject,
      body_text: template.body_text || "",
      body_html: template.body_html || "",
      category: template.category,
      send_delay_minutes: template.send_delay_minutes,
      is_active: template.is_active
    });
    setIsCreating(false);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingTemplate(null);
    setFormData({
      name: "",
      description: "",
      subject: "",
      body_text: "",
      body_html: "",
      category: "signup",
      send_delay_minutes: 0,
      is_active: true
    });
  };

  const handleCancel = () => {
    setEditingTemplate(null);
    setIsCreating(false);
    setFormData({
      name: "",
      description: "",
      subject: "",
      body_text: "",
      body_html: "",
      category: "signup",
      send_delay_minutes: 0,
      is_active: true
    });
  };

  const handleSave = async () => {
    try {
      setError(null);
      setSuccess(null);

      if (isCreating) {
        const response = await fetch('/api/admin/email-templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
          setSuccess('Template created successfully');
          fetchTemplates();
          handleCancel();
        } else {
          setError(data.error || 'Failed to create template');
        }
      } else if (editingTemplate) {
        const response = await fetch(`/api/admin/email-templates/${editingTemplate.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
          setSuccess('Template updated successfully');
          fetchTemplates();
          handleCancel();
        } else {
          setError(data.error || 'Failed to update template');
        }
      }
    } catch (err) {
      setError('Network error saving template');
    }
  };

  const handleArchive = async (id: string, currentlyArchived: boolean) => {
    if (!confirm(currentlyArchived ? 'Restore this template from archive?' : 'Archive this template?')) return;

    setArchivingId(id);
    try {
      setError(null);
      const response = await fetch(`/api/admin/email-templates/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archived: !currentlyArchived })
      });

      if (response.ok) {
        setSuccess(currentlyArchived ? 'Template restored successfully' : 'Template archived successfully');

        // Remove from list immediately
        if (!currentlyArchived && !showArchived) {
          setTemplates(prev => prev.filter(t => t.id !== id));
        } else if (currentlyArchived && showArchived) {
          setTemplates(prev => prev.filter(t => t.id !== id));
        } else {
          fetchTemplates();
        }
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to archive template');
      }
    } catch (err) {
      setError('Network error archiving template');
    } finally {
      setArchivingId(null);
    }
  };

  const formatDelay = (minutes: number): string => {
    if (minutes === 0) return 'Immediate';
    if (minutes < 60) return `${minutes} minutes`;
    if (minutes === 60) return '1 hour';
    if (minutes < 1440) return `${Math.floor(minutes / 60)} hours`;
    if (minutes === 1440) return '1 day';
    return `${Math.floor(minutes / 1440)} days`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading email templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
              <Mail className="w-10 h-10 text-emerald-600" />
              Email Templates
            </h1>
            <p className="text-slate-600">Manage automated email sequences for signup flow</p>
          </div>
          <button
            onClick={() => setShowArchived(!showArchived)}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              showArchived
                ? 'bg-orange-100 text-orange-700 border-2 border-orange-300'
                : 'bg-slate-100 text-slate-700 border-2 border-slate-300 hover:bg-slate-200'
            }`}
          >
            <Archive className="w-4 h-4" />
            {showArchived ? 'Viewing Archived' : 'Show Archived'}
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
          >
            <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3"
          >
            <Save className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-emerald-800 font-medium">Success</p>
              <p className="text-emerald-600 text-sm">{success}</p>
            </div>
            <button onClick={() => setSuccess(null)} className="text-emerald-400 hover:text-emerald-600">
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {/* Create Button */}
        {!editingTemplate && !isCreating && (
          <div className="mb-6">
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Create New Template
            </button>
          </div>
        )}

        {/* Editor Form */}
        {(editingTemplate || isCreating) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {isCreating ? 'Create New Template' : 'Edit Template'}
            </h2>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g., signup_immediate_confirmation"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="signup">Signup</option>
                    <option value="notification">Notification</option>
                    <option value="marketing">Marketing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Brief description of when this email is sent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Subject *
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Use ${firstName}, ${lastName}, ${email} for personalization"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Send Delay (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.send_delay_minutes}
                    onChange={(e) => setFormData({ ...formData, send_delay_minutes: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="0 for immediate"
                    min="0"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {formatDelay(formData.send_delay_minutes)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <Power className="w-4 h-4" />
                    Status
                  </label>
                  <select
                    value={formData.is_active ? 'active' : 'inactive'}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'active' })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Plain Text Body
                </label>
                <textarea
                  value={formData.body_text}
                  onChange={(e) => setFormData({ ...formData, body_text: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm"
                  placeholder="Plain text version of the email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  HTML Body
                </label>
                <textarea
                  value={formData.body_html}
                  onChange={(e) => setFormData({ ...formData, body_html: e.target.value })}
                  rows={12}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm"
                  placeholder="HTML version of the email"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Available variables: $&#123;firstName&#125;, $&#123;lastName&#125;, $&#123;email&#125;, $&#123;phone&#125;, $&#123;role&#125;, $&#123;currentChallenges&#125;
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                  <Save className="w-5 h-5" />
                  {isCreating ? 'Create Template' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 bg-slate-200 text-slate-700 px-6 py-3 rounded-lg hover:bg-slate-300 transition-colors font-medium"
                >
                  <X className="w-5 h-5" />
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Templates List */}
        <div className="space-y-4">
          {templates.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">No templates found</h3>
              <p className="text-slate-500 mb-6">Create your first email template to get started</p>
              <button
                onClick={handleCreate}
                className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                <Plus className="w-5 h-5" />
                Create Template
              </button>
            </div>
          ) : (
            templates.map((template) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-900">{template.name}</h3>
                      {template.is_active ? (
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">
                          Inactive
                        </span>
                      )}
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                        {template.category}
                      </span>
                    </div>

                    {template.description && (
                      <p className="text-slate-600 mb-3">{template.description}</p>
                    )}

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail className="w-4 h-4" />
                        <span className="font-medium">Subject:</span>
                        <span className="text-slate-800">{template.subject}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">Delay:</span>
                        <span className="text-slate-800">{formatDelay(template.send_delay_minutes)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => setPreviewTemplate(template)}
                      className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Preview email"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleEdit(template)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit template"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleArchive(template.id, template.archived)}
                      disabled={archivingId === template.id}
                      className={`p-2 rounded-lg transition-colors ${
                        template.archived
                          ? 'text-orange-600 hover:bg-orange-50'
                          : 'text-slate-600 hover:bg-slate-100'
                      } disabled:opacity-50`}
                      title={template.archived ? "Restore from archive" : "Archive template"}
                    >
                      {template.archived ? (
                        <ArchiveRestore className="w-5 h-5" />
                      ) : (
                        <Archive className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewTemplate(null)}
        >
          <div
            className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="border-b border-slate-200 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Eye className="w-6 h-6 text-emerald-600" />
                  Email Preview
                </h3>
                <p className="text-sm text-slate-600 mt-1">{previewTemplate.name}</p>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            {/* Subject Line */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-slate-500 mt-1" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-500 uppercase">Subject</p>
                  <p className="text-slate-900 font-medium">{previewTemplate.subject}</p>
                </div>
              </div>
            </div>

            {/* Email Content */}
            <div className="flex-1 overflow-auto p-6">
              {previewTemplate.body_html ? (
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <div className="mb-4 pb-4 border-b border-slate-200">
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                      HTML Preview
                    </span>
                  </div>
                  <iframe
                    srcDoc={previewTemplate.body_html}
                    className="w-full min-h-[500px] border-0"
                    title="Email HTML Preview"
                    sandbox="allow-same-origin allow-top-navigation"
                  />
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                  <div className="mb-4 pb-4 border-b border-slate-200">
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                      Text Preview
                    </span>
                  </div>
                  <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans">
                    {previewTemplate.body_text || 'No content'}
                  </pre>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-200 p-4 flex justify-end gap-3">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 border-2 border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleEdit(previewTemplate);
                  setPreviewTemplate(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
