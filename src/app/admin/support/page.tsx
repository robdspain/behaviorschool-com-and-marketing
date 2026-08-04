'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ExternalLink, LifeBuoy } from 'lucide-react';
import Link from 'next/link';
import { AdminSupportInbox } from '@/components/admin/AdminSupportInbox';

export default function AdminSupportPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    document.title = 'Support Inbox | Behavior School Admin';
    fetch('/api/admin/access-check')
      .then((response) => response.json())
      .then((data) => {
        if (!data.authenticated) router.replace('/admin/login?returnTo=/admin/support');
        else setChecking(false);
      })
      .catch(() => router.replace('/admin/login?returnTo=/admin/support'));
  }, [router]);

  if (checking) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">Checking admin access...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link href="/admin" className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-emerald-800 hover:underline">
              <ArrowLeft className="h-4 w-4" /> Admin dashboard
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                <LifeBuoy className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">Central support</p>
                <h1 className="text-3xl font-bold text-slate-950">Support Inbox</h1>
              </div>
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Review product feedback, bug reports, and customer questions from Behavior School and Behavior Study Tools in one queue.
            </p>
          </div>
          <a href="/support" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:underline">
            Open public support form <ExternalLink className="h-4 w-4" />
          </a>
        </header>
        <AdminSupportInbox />
      </div>
    </div>
  );
}
