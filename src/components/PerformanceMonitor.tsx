"use client";

import { useEffect } from 'react';

/**
 * Performance monitoring component
 * Tracks Core Web Vitals and reports to analytics
 */
export default function PerformanceMonitor() {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') return;

    // Track Core Web Vitals
    const trackWebVitals = () => {
      // Track Largest Contentful Paint (LCP)
      const trackLCP = () => {
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          
          if (window.gtag) {
            window.gtag('event', 'web_vitals', {
              event_category: 'Performance',
              event_label: 'LCP',
              value: Math.round(lastEntry.startTime),
              non_interaction: true,
            });
          }
        }).observe({ entryTypes: ['largest-contentful-paint'] });
      };

      // Track First Input Delay (FID)
      const trackFID = () => {
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach((entry) => {
            if (window.gtag) {
              window.gtag('event', 'web_vitals', {
                event_category: 'Performance',
                event_label: 'FID',
                value: Math.round(entry.processingStart - entry.startTime),
                non_interaction: true,
              });
            }
          });
        }).observe({ entryTypes: ['first-input'] });
      };

      // Track Cumulative Layout Shift (CLS)
      const trackCLS = () => {
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach((entry) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          
          if (window.gtag) {
            window.gtag('event', 'web_vitals', {
              event_category: 'Performance',
              event_label: 'CLS',
              value: Math.round(clsValue * 1000),
              non_interaction: true,
            });
          }
        }).observe({ entryTypes: ['layout-shift'] });
      };

      // Track First Contentful Paint (FCP)
      const trackFCP = () => {
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach((entry) => {
            if (window.gtag) {
              window.gtag('event', 'web_vitals', {
                event_category: 'Performance',
                event_label: 'FCP',
                value: Math.round(entry.startTime),
                non_interaction: true,
              });
            }
          });
        }).observe({ entryTypes: ['paint'] });
      };

      // Initialize tracking
      if ('PerformanceObserver' in window) {
        trackLCP();
        trackFID();
        trackCLS();
        trackFCP();
      }
    };

    // Track page load performance
    const trackPageLoad = () => {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation && window.gtag) {
          // Track page load time
          window.gtag('event', 'page_load_time', {
            event_category: 'Performance',
            event_label: 'Page Load',
            value: Math.round(navigation.loadEventEnd - navigation.fetchStart),
            non_interaction: true,
          });

          // Track DOM content loaded time
          window.gtag('event', 'dom_content_loaded', {
            event_category: 'Performance',
            event_label: 'DOM Content Loaded',
            value: Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart),
            non_interaction: true,
          });
        }
      });
    };

    // Initialize performance tracking
    trackWebVitals();
    trackPageLoad();

    // Track resource loading performance
    const trackResourcePerformance = () => {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 1000) { // Only track slow resources (>1s)
            if (window.gtag) {
              window.gtag('event', 'slow_resource', {
                event_category: 'Performance',
                event_label: entry.name,
                value: Math.round(entry.duration),
                non_interaction: true,
              });
            }
          }
        });
      });

      observer.observe({ entryTypes: ['resource'] });
    };

    // Track resource performance
    if ('PerformanceObserver' in window) {
      trackResourcePerformance();
    }

  }, []);

  return null; // This component doesn't render anything
}
