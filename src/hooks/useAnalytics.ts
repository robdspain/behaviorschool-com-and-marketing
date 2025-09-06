/**
 * React hook for analytics tracking
 * Provides easy access to analytics functions in React components
 */

import { useCallback, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
  trackConversion,
  trackLead,
  trackDownload,
  trackEmailSignup,
  trackCourseInquiry,
  trackStudyAppSignup,
  trackFormSubmission,
  trackButtonClick,
  trackToolUsage,
  trackScrollDepth,
  trackTimeOnPage,
  ConversionEvent,
  LeadEvent,
} from '@/lib/analytics';

export const useAnalytics = () => {
  const pathname = usePathname();
  const startTimeRef = useRef<number>(Date.now());
  const scrollDepthRef = useRef<Set<number>>(new Set());

  // Track page view on mount
  useEffect(() => {
    startTimeRef.current = Date.now();
    scrollDepthRef.current.clear();
  }, [pathname]);

  // Track time on page when component unmounts
  useEffect(() => {
    return () => {
      const timeOnPage = (Date.now() - startTimeRef.current) / 1000;
      if (timeOnPage > 5) { // Only track if user spent more than 5 seconds
        trackTimeOnPage(timeOnPage, pathname);
      }
    };
  }, [pathname]);

  // Track scroll depth
  const handleScroll = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((scrollTop / scrollHeight) * 100);

    // Track at 25%, 50%, 75%, and 100%
    const milestones = [25, 50, 75, 100];
    milestones.forEach(milestone => {
      if (scrollPercent >= milestone && !scrollDepthRef.current.has(milestone)) {
        scrollDepthRef.current.add(milestone);
        trackScrollDepth(milestone, pathname);
      }
    });
  }, [pathname]);

  // Set up scroll tracking
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Analytics functions
  const trackConversionEvent = useCallback((event: ConversionEvent) => {
    trackConversion(event);
  }, []);

  const trackLeadEvent = useCallback((event: LeadEvent) => {
    trackLead(event);
  }, []);

  const trackDownloadEvent = useCallback((
    resource_name: string,
    user_email?: string
  ) => {
    trackDownload(resource_name, pathname, user_email);
  }, [pathname]);

  const trackEmailSignupEvent = useCallback((
    signup_type: 'newsletter' | 'waitlist' | 'download' = 'newsletter',
    user_email?: string,
    additional_data?: Record<string, any>
  ) => {
    trackEmailSignup(pathname, signup_type, user_email, additional_data);
  }, [pathname]);

  const trackCourseInquiryEvent = useCallback((
    course_name: string,
    inquiry_type: 'info_request' | 'waitlist' | 'application' = 'info_request',
    user_email?: string
  ) => {
    trackCourseInquiry(course_name, pathname, inquiry_type, user_email);
  }, [pathname]);

  const trackStudyAppSignupEvent = useCallback((
    user_email?: string,
    plan_type?: string
  ) => {
    trackStudyAppSignup(pathname, user_email, plan_type);
  }, [pathname]);

  const trackFormSubmissionEvent = useCallback((
    form_name: string,
    success: boolean = true,
    additional_data?: Record<string, any>
  ) => {
    trackFormSubmission(form_name, pathname, success, additional_data);
  }, [pathname]);

  const trackButtonClickEvent = useCallback((
    button_name: string,
    button_location: string,
    additional_data?: Record<string, any>
  ) => {
    trackButtonClick(button_name, pathname, button_location, additional_data);
  }, [pathname]);

  const trackToolUsageEvent = useCallback((
    tool_name: string,
    action: string,
    additional_data?: Record<string, any>
  ) => {
    trackToolUsage(tool_name, action, pathname, additional_data);
  }, [pathname]);

  return {
    // Core tracking functions
    trackConversion: trackConversionEvent,
    trackLead: trackLeadEvent,
    
    // Specific event tracking
    trackDownload: trackDownloadEvent,
    trackEmailSignup: trackEmailSignupEvent,
    trackCourseInquiry: trackCourseInquiryEvent,
    trackStudyAppSignup: trackStudyAppSignupEvent,
    trackFormSubmission: trackFormSubmissionEvent,
    trackButtonClick: trackButtonClickEvent,
    trackToolUsage: trackToolUsageEvent,
    
    // Current page info
    currentPage: pathname,
  };
};
