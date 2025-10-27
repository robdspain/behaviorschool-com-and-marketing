'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Award, Edit, X, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { MasterclassCertificateConfig, CertificateConfigFormData } from '@/lib/masterclass/admin-types';

export default function CertificateAdminPage() {
  const [config, setConfig] = useState<MasterclassCertificateConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<CertificateConfigFormData>({
    course_title: '',
    ceu_credits: 1.0,
    bacb_provider_number: '',
    certificate_subtitle: '',
    completion_statement: '',
    signature_name: '',
    signature_title: '',
    organization_name: '',
    organization_website: '',
    introduction_video_url: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/admin/masterclass/certificate');
      const data = await response.json();

      if (data.success) {
        setConfig(data.data);
        setFormData({
          course_title: data.data.course_title,
          ceu_credits: data.data.ceu_credits,
          bacb_provider_number: data.data.bacb_provider_number,
          certificate_subtitle: data.data.certificate_subtitle || '',
          completion_statement: data.data.completion_statement,
          signature_name: data.data.signature_name || '',
          signature_title: data.data.signature_title || '',
          organization_name: data.data.organization_name,
          organization_website: data.data.organization_website,
          introduction_video_url: data.data.introduction_video_url || '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch certificate config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (config) {
      setFormData({
        course_title: config.course_title,
        ceu_credits: config.ceu_credits,
        bacb_provider_number: config.bacb_provider_number,
        certificate_subtitle: config.certificate_subtitle || '',
        completion_statement: config.completion_statement,
        signature_name: config.signature_name || '',
        signature_title: config.signature_title || '',
        organization_name: config.organization_name,
        organization_website: config.organization_website,
        introduction_video_url: config.introduction_video_url || '',
      });
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!config) return;

    setSaving(true);
    try {
      const response = await fetch('/api/admin/masterclass/certificate', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: config.id,
          ...formData,
        }),
      });

      if (response.ok) {
        await fetchConfig();
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to save certificate config:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-slate-200">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/masterclass">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Certificate Settings</h1>
                <p className="text-base text-slate-600 mt-1">
                  Configure certificate template fields and information
                </p>
              </div>
            </div>
            {!isEditing && (
              <Button onClick={handleEdit} className="bg-emerald-600 hover:bg-emerald-700">
                <Edit className="w-4 h-4 mr-2" />
                Edit Settings
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Certificate Preview */}
          <div className="bg-white border-2 border-slate-200 rounded-xl p-8 mb-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Certificate Preview</h2>
                <p className="text-slate-600 mt-1">
                  This is how your certificate information will appear
                </p>
              </div>
            </div>

            <div className="border-2 border-purple-200 rounded-xl p-8 bg-gradient-to-br from-purple-50 to-white">
              <div className="text-center space-y-4">
                <div className="text-sm text-purple-600 font-semibold uppercase tracking-wide">
                  {formData.organization_name}
                </div>
                <h3 className="text-3xl font-bold text-slate-900">
                  Certificate of Completion
                </h3>
                {formData.certificate_subtitle && (
                  <p className="text-lg text-slate-600">{formData.certificate_subtitle}</p>
                )}
                <div className="py-4">
                  <div className="text-2xl font-bold text-slate-900 mb-2">
                    {formData.course_title}
                  </div>
                  <div className="text-sm text-purple-600 font-semibold">
                    {formData.ceu_credits} BACB CEU Credits
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Provider: {formData.bacb_provider_number}
                  </div>
                </div>
                <div className="border-t-2 border-slate-200 pt-4 mt-4">
                  <p className="text-sm text-slate-600 max-w-2xl mx-auto">
                    {formData.completion_statement}
                  </p>
                </div>
                {formData.signature_name && (
                  <div className="flex justify-center gap-8 pt-6">
                    <div className="text-center">
                      <div className="border-t-2 border-slate-900 w-48 mb-2"></div>
                      <div className="font-semibold text-slate-900">{formData.signature_name}</div>
                      {formData.signature_title && (
                        <div className="text-sm text-slate-600">{formData.signature_title}</div>
                      )}
                    </div>
                  </div>
                )}
                <div className="text-xs text-slate-500 pt-4">
                  {formData.organization_website}
                </div>
              </div>
            </div>
          </div>

          {/* Configuration Form */}
          <div className={`bg-white border-2 rounded-xl p-6 ${isEditing ? 'border-emerald-200' : 'border-slate-200'}`}>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Certificate Information</h3>

            <div className="space-y-4">
              {/* Course Title */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Course Title
                </label>
                <input
                  type="text"
                  value={formData.course_title}
                  onChange={(e) => setFormData({ ...formData, course_title: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-600"
                  placeholder="School BCBA Mastery Fundamentals"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Certificate Subtitle (Optional)
                </label>
                <input
                  type="text"
                  value={formData.certificate_subtitle}
                  onChange={(e) => setFormData({ ...formData, certificate_subtitle: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-600"
                  placeholder="Professional Development for School-Based Behavior Analysts"
                />
              </div>

              {/* CEU Credits and Provider Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    CEU Credits
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.ceu_credits}
                    onChange={(e) => setFormData({ ...formData, ceu_credits: parseFloat(e.target.value) })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    BACB Provider Number
                  </label>
                  <input
                    type="text"
                    value={formData.bacb_provider_number}
                    onChange={(e) => setFormData({ ...formData, bacb_provider_number: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-600"
                    placeholder="OP-25-11420"
                  />
                </div>
              </div>

              {/* Completion Statement */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Completion Statement
                </label>
                <textarea
                  value={formData.completion_statement}
                  onChange={(e) => setFormData({ ...formData, completion_statement: e.target.value })}
                  disabled={!isEditing}
                  rows={3}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-600"
                  placeholder="This certificate verifies successful completion..."
                />
              </div>

              {/* Introduction Video URL */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Introduction Video URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.introduction_video_url}
                  onChange={(e) => setFormData({ ...formData, introduction_video_url: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-600"
                  placeholder="https://fast.wistia.net/embed/iframe/..."
                />
                <p className="text-xs text-slate-500 mt-1">
                  Wistia embed URL for the course introduction video
                </p>
              </div>

              {/* Signature */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Signature Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.signature_name}
                    onChange={(e) => setFormData({ ...formData, signature_name: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-600"
                    placeholder="Rob Spain"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Signature Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.signature_title}
                    onChange={(e) => setFormData({ ...formData, signature_title: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-600"
                    placeholder="Founder & Lead Instructor"
                  />
                </div>
              </div>

              {/* Organization */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    value={formData.organization_name}
                    onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-600"
                    placeholder="Behavior School"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Organization Website
                  </label>
                  <input
                    type="text"
                    value={formData.organization_website}
                    onChange={(e) => setFormData({ ...formData, organization_website: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-600"
                    placeholder="behaviorschool.com"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-3 pt-4 border-t-2 border-slate-200">
                  <Button
                    onClick={handleSave}
                    disabled={saving || !formData.course_title || !formData.bacb_provider_number}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Settings
                      </>
                    )}
                  </Button>
                  <Button onClick={handleCancel} variant="outline">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
