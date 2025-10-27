'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Video,
  HelpCircle,
  Award,
  Users,
  TrendingUp,
  ArrowRight,
  Plus,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MasterclassStats {
  totalEnrollments: number;
  completedEnrollments: number;
  certificatesIssued: number;
  recentEnrollments: number;
  completionRate: number;
  totalSections: number;
  totalQuestions: number;
}

export default function MasterclassAdminPage() {
  const [stats, setStats] = useState<MasterclassStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/masterclass/stats');
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const managementCards = [
    {
      title: 'Design Course',
      description: 'Organize sections and questions with drag & drop',
      icon: Video,
      href: '/admin/masterclass/design',
      color: 'emerald',
      stat: stats ? `${stats.totalSections} sections, ${stats.totalQuestions} questions` : '...',
    },
    {
      title: 'Certificate Settings',
      description: 'Configure certificate template and fields',
      icon: Award,
      href: '/admin/masterclass/certificate',
      color: 'purple',
      stat: 'Template config',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-slate-200">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Masterclass Management</h1>
                <p className="text-base text-slate-600 mt-1">
                  Manage your free CEU masterclass course
                </p>
              </div>
            </div>
            <Link href="/masterclass" target="_blank">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                View Live Course
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Enrollments */}
          <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                Total Enrollments
              </h3>
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            {loading ? (
              <div className="h-12 bg-slate-100 rounded animate-pulse"></div>
            ) : (
              <>
                <p className="text-3xl font-bold text-slate-900">{stats?.totalEnrollments || 0}</p>
                <p className="text-sm text-emerald-600 mt-1">
                  +{stats?.recentEnrollments || 0} this week
                </p>
              </>
            )}
          </div>

          {/* Completions */}
          <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                Completions
              </h3>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            {loading ? (
              <div className="h-12 bg-slate-100 rounded animate-pulse"></div>
            ) : (
              <>
                <p className="text-3xl font-bold text-slate-900">{stats?.completedEnrollments || 0}</p>
                <p className="text-sm text-slate-600 mt-1">
                  {stats?.completionRate || 0}% completion rate
                </p>
              </>
            )}
          </div>

          {/* Certificates */}
          <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                Certificates
              </h3>
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            {loading ? (
              <div className="h-12 bg-slate-100 rounded animate-pulse"></div>
            ) : (
              <>
                <p className="text-3xl font-bold text-slate-900">{stats?.certificatesIssued || 0}</p>
                <p className="text-sm text-slate-600 mt-1">CEUs issued</p>
              </>
            )}
          </div>

          {/* Course Content */}
          <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                Course Content
              </h3>
              <GraduationCap className="w-5 h-5 text-orange-600" />
            </div>
            {loading ? (
              <div className="h-12 bg-slate-100 rounded animate-pulse"></div>
            ) : (
              <>
                <p className="text-3xl font-bold text-slate-900">{stats?.totalSections || 0}</p>
                <p className="text-sm text-slate-600 mt-1">
                  {stats?.totalQuestions || 0} quiz questions
                </p>
              </>
            )}
          </div>
        </div>

        {/* Management Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Manage Course Content</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {managementCards.map((card) => {
              const Icon = card.icon;
              const colorClasses = {
                emerald: 'hover:border-emerald-300',
                blue: 'hover:border-blue-300',
                purple: 'hover:border-purple-300',
              };
              const iconBgClasses = {
                emerald: 'bg-emerald-100',
                blue: 'bg-blue-100',
                purple: 'bg-purple-100',
              };
              const iconColorClasses = {
                emerald: 'text-emerald-600',
                blue: 'text-blue-600',
                purple: 'text-purple-600',
              };

              return (
                <Link
                  key={card.href}
                  href={card.href}
                  className={`block p-6 bg-white border-2 border-slate-200 rounded-xl transition-all hover:shadow-lg ${
                    colorClasses[card.color as keyof typeof colorClasses]
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-14 h-14 rounded-xl ${
                          iconBgClasses[card.color as keyof typeof iconBgClasses]
                        } flex items-center justify-center`}
                      >
                        <Icon
                          className={`w-7 h-7 ${
                            iconColorClasses[card.color as keyof typeof iconColorClasses]
                          }`}
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-slate-900">{card.title}</h3>
                        <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-700 rounded-full">
                          {card.stat}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{card.description}</p>
                      <div
                        className={`text-sm font-semibold flex items-center gap-1 ${
                          iconColorClasses[card.color as keyof typeof iconColorClasses]
                        }`}
                      >
                        Manage
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/admin/masterclass/design">
              <Button variant="outline" className="w-full justify-start">
                <Video className="w-4 h-4 mr-2" />
                Design Course
              </Button>
            </Link>
            <Link href="/admin/masterclass/certificate">
              <Button variant="outline" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                Configure Certificate
              </Button>
            </Link>
            <Link href="/masterclass" target="_blank">
              <Button variant="outline" className="w-full justify-start">
                <GraduationCap className="w-4 h-4 mr-2" />
                View Course
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
