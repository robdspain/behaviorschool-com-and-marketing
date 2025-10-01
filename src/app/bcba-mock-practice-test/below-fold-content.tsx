"use client";

import { Suspense } from "react";
import {
  TestTakingStrategies,
  CommonPitfalls,
  StudySchedule,
  FAQSection,
  RelatedResources,
} from "./lazy-sections";

export default function BelowFoldContent() {
  return (
    <div className="bg-white/0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <Suspense fallback={<div className="animate-pulse h-48 bg-gray-100 rounded-xl" />}>
          <TestTakingStrategies />
        </Suspense>
        <Suspense fallback={<div className="animate-pulse h-48 bg-gray-100 rounded-xl" />}>
          <CommonPitfalls />
        </Suspense>
        <Suspense fallback={<div className="animate-pulse h-48 bg-gray-100 rounded-xl" />}>
          <StudySchedule />
        </Suspense>
        <Suspense fallback={<div className="animate-pulse h-48 bg-gray-100 rounded-xl" />}>
          <FAQSection />
        </Suspense>
        <Suspense fallback={<div className="animate-pulse h-48 bg-gray-100 rounded-xl" />}>
          <RelatedResources />
        </Suspense>
      </div>
    </div>
  );
}

