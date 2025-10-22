'use client';

import React from 'react';
import { CheckCircle, Circle, Lock, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { MASTERCLASS_COURSE } from '@/lib/masterclass/config';

interface SectionStatus {
  id: number;
  title: string;
  videoCompleted: boolean;
  quizPassed: boolean;
  isLocked: boolean;
  isCurrent: boolean;
}

interface SidebarNavigationProps {
  currentSection: number;
  sections: SectionStatus[];
  progress: number; // 0-100
  onSectionClick: (sectionId: number) => void;
}

export function SidebarNavigation({
  currentSection,
  sections,
  progress,
  onSectionClick,
}: SidebarNavigationProps) {
  return (
    <div className="h-full flex flex-col bg-slate-50 border-r border-slate-200">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-5 h-5 text-emerald-600" />
          <h2 className="font-bold text-slate-900 text-sm">School BCBA Mastery</h2>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="font-medium">Overall Progress</span>
            <span className="font-bold text-slate-900">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Section List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {sections.map((section, index) => {
          const sectionConfig = MASTERCLASS_COURSE.sections.find(s => s.id === section.id);
          const isComplete = section.videoCompleted && section.quizPassed;

          return (
            <button
              key={section.id}
              onClick={() => !section.isLocked && onSectionClick(section.id)}
              disabled={section.isLocked}
              className={`
                w-full text-left p-4 rounded-xl transition-all duration-200
                ${section.isCurrent
                  ? 'bg-emerald-100 border-2 border-emerald-500 shadow-md'
                  : section.isLocked
                  ? 'bg-slate-100 border border-slate-200 opacity-60 cursor-not-allowed'
                  : 'bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-sm'
                }
              `}
            >
              <div className="flex items-start gap-3">
                {/* Section Number/Status Icon */}
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm
                  ${isComplete
                    ? 'bg-emerald-500 text-white'
                    : section.isCurrent
                    ? 'bg-emerald-600 text-white'
                    : section.isLocked
                    ? 'bg-slate-300 text-slate-500'
                    : 'bg-slate-200 text-slate-700'
                  }
                `}>
                  {isComplete ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : section.isLocked ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    section.id
                  )}
                </div>

                {/* Section Info */}
                <div className="flex-1 min-w-0">
                  <h3 className={`
                    font-semibold text-sm mb-1 line-clamp-2
                    ${section.isCurrent ? 'text-emerald-900' : 'text-slate-900'}
                  `}>
                    {section.title}
                  </h3>
                  <p className="text-xs text-slate-500 mb-2">{sectionConfig?.duration}</p>

                  {/* Progress Indicators */}
                  <div className="flex items-center gap-3 text-xs">
                    <div className={`flex items-center gap-1 ${section.videoCompleted ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {section.videoCompleted ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <Circle className="w-3 h-3" />
                      )}
                      <span className="font-medium">Video</span>
                    </div>
                    <div className={`flex items-center gap-1 ${section.quizPassed ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {section.quizPassed ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <Circle className="w-3 h-3" />
                      )}
                      <span className="font-medium">Quiz</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Section Indicator */}
              {section.isCurrent && (
                <div className="mt-3 pt-3 border-t border-emerald-200">
                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-700">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    Currently Active
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Earn 1.0 BACB CEU</span>
          </div>
          <p className="text-xs text-slate-500">
            Provider: OP-25-11420
          </p>
        </div>
      </div>
    </div>
  );
}
