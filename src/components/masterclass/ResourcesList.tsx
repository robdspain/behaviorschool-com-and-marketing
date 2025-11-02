"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, File, Link as LinkIcon, Image, Download } from 'lucide-react';
import type { CourseResource } from '@/lib/masterclass/types';

function iconForType(type: string) {
  const t = type.toLowerCase();
  if (t.includes('pdf')) return FileText;
  if (t.includes('doc')) return File;
  if (t.includes('png') || t.includes('jpg') || t.includes('jpeg') || t.includes('webp')) return Image;
  return LinkIcon;
}

export function ResourcesList({ resources }: { resources: CourseResource[] }) {
  if (!resources?.length) return null;
  return (
    <div className="bg-white border-2 border-slate-200 rounded-xl p-4 sm:p-6">
      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">Section Resources</h3>
      <ul className="space-y-3">
        {resources.map((r) => {
          const Icon = iconForType(r.fileType);
          return (
            <li key={r.id} className="flex items-center justify-between gap-3 border rounded-lg p-3 sm:p-4">
              <div className="flex items-center gap-3 min-w-0">
                <Icon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm sm:text-base font-medium text-slate-900 truncate">{r.name}</p>
                  <p className="text-xs text-slate-500 truncate">{r.url}</p>
                </div>
              </div>
              <a href={r.url} target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  Open
                </Button>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

