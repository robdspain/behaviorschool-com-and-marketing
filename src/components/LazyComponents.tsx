/**
 * Lazy-loaded components to improve initial page load performance
 */

import dynamic from 'next/dynamic';

// Lazy load heavy components that aren't needed immediately
export const LazyDownloadPopup = dynamic(
  () => import('@/components/DownloadPopup'),
  { 
    ssr: false,
    loading: () => <div className="animate-pulse bg-slate-200 rounded-lg h-32 w-full" />
  }
);

export const LazyEmailSignupPopup = dynamic(
  () => import('@/components/ui/email-signup-popup').then(mod => ({ default: mod.EmailSignupPopup })),
  { 
    ssr: false,
    loading: () => <div className="animate-pulse bg-slate-200 rounded-lg h-32 w-full" />
  }
);

export const LazyConversionTrackingDashboard = dynamic(
  () => import('@/components/admin/ConversionTrackingDashboard'),
  { 
    ssr: false,
    loading: () => <div className="animate-pulse bg-slate-200 rounded-lg h-64 w-full" />
  }
);

// Admin components removed during auth rebuild

// Lazy load heavy UI components
export const LazyMotionDiv = dynamic(
  () => import('framer-motion').then(mod => ({ default: mod.motion.div })),
  { 
    ssr: false,
    loading: () => <div />
  }
);

export const LazyAnimatePresence = dynamic(
  () => import('framer-motion').then(mod => ({ default: mod.AnimatePresence })),
  { 
    ssr: false,
    loading: () => <div />
  }
);
