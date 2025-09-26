"use client";

import { lazy } from 'react';

// Lazy load components that are below the fold
export const TestTakingStrategies = lazy(() => import('./sections/test-taking-strategies').then(module => ({ default: module.TestTakingStrategies })));
export const CommonPitfalls = lazy(() => import('./sections/common-pitfalls').then(module => ({ default: module.CommonPitfalls })));
export const StudySchedule = lazy(() => import('./sections/study-schedule').then(module => ({ default: module.StudySchedule })));
export const FAQSection = lazy(() => import('./sections/faq-section').then(module => ({ default: module.FAQSection })));
export const RelatedResources = lazy(() => import('./sections/related-resources').then(module => ({ default: module.RelatedResources })));