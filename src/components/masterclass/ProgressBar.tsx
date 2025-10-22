'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle } from 'lucide-react';

interface ProgressBarProps {
  progress: number; // 0-100
  sectionsCompleted: number;
  totalSections: number;
  canGenerateCertificate: boolean;
}

export function ProgressBar({
  progress,
  sectionsCompleted,
  totalSections,
  canGenerateCertificate,
}: ProgressBarProps) {
  return (
    <div className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Progress Info */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-semibold text-slate-900">
                  Course Progress
                </h3>
                <span className="text-xs text-slate-500">
                  {sectionsCompleted} of {totalSections} sections complete
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-emerald-600">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 bg-[length:200%_100%]"
                initial={{ width: 0 }}
                animate={{
                  width: `${progress}%`,
                  backgroundPosition: progress === 100 ? ['0% 50%', '100% 50%'] : '0% 50%',
                }}
                transition={{
                  width: { duration: 0.8, ease: 'easeOut' },
                  backgroundPosition: {
                    duration: 2,
                    repeat: progress === 100 ? Infinity : 0,
                    ease: 'linear',
                  },
                }}
              />
            </div>
          </div>

          {/* Certificate Status */}
          {canGenerateCertificate ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-100 border-2 border-emerald-500 rounded-full"
            >
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-bold text-emerald-700">
                Certificate Ready!
              </span>
            </motion.div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 border border-slate-200 rounded-full">
              <Award className="w-5 h-5 text-slate-400" />
              <span className="text-sm font-medium text-slate-600">
                Complete all sections
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
