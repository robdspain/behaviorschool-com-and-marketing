"use client";

// Email Templates Admin Panel - TypeScript compliant
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Edit, Trash2, Save, XCircle } from "lucide-react";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body_html: string | null;
  body_text: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export default function EmailTemplatesAdminPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewTemplateForm, setShowNewTemplateForm] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    subject: "",
    body_html: "",
    body_text: "",
    description: "",
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/email-templates");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTemplates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch templates");
    } finally {
      setLoading(false);
    }
  };

  const handleNewTemplateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewTemplate({ ...newTemplate, [e.target.name]: e.target.value });
  };

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);

    try {
      const response = await fetch("/api/admin/email-templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTemplate),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      await response.json(); // Assuming the API returns the created template
      setShowNewTemplateForm(false);
      setNewTemplate({
        name: "",
        subject: "",
        body_html: "",
        body_text: "",
        description: "",
      });
      fetchTemplates(); // Refresh the list
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to create template");
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Email Templates Admin</h1>

        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">Manage your application&apos;s email templates here.</p>
          <button
            onClick={() => setShowNewTemplateForm(!showNewTemplateForm)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            {showNewTemplateForm ? "Cancel Add" : "Add New Template"}
          </button>
        </div>

        {showNewTemplateForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-blue-50 p-4 rounded-md mb-6 border border-blue-200"
          >
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Add New Email Template</h2>
            {formError && <p className="text-red-600 mb-4">Error: {formError}</p>}
            <form onSubmit={handleCreateTemplate} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Template Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newTemplate.name}
                  onChange={handleNewTemplateChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={newTemplate.subject}
                  onChange={handleNewTemplateChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="body_html" className="block text-sm font-medium text-gray-700">HTML Body</label>
                <textarea
                  id="body_html"
                  name="body_html"
                  value={newTemplate.body_html}
                  onChange={handleNewTemplateChange}
                  rows={6}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="body_text" className="block text-sm font-medium text-gray-700">Plain Text Body</label>
                <textarea
                  id="body_text"
                  name="body_text"
                  value={newTemplate.body_text}
                  onChange={handleNewTemplateChange}
                  rows={6}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={newTemplate.description}
                  onChange={handleNewTemplateChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowNewTemplateForm(false)}
                  className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <XCircle className="w-5 h-5 mr-2" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formSubmitting ? "Saving..." : <><Save className="w-5 h-5 mr-2" /> Save Template</>}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {loading && <p className="text-center text-gray-600">Loading templates...</p>}
        {error && <p className="text-center text-red-600">Error: {error}</p>}

        {!loading && !error && templates.length === 0 && (
          <p className="text-center text-gray-600">No email templates found. Add one above!</p>
        )}

        {!loading && !error && templates.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {templates.map((template) => (
                  <tr key={template.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{template.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{template.subject}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{template.description || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-4"><Edit className="w-4 h-4 inline" /> Edit</button>
                      <button className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4 inline" /> Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
