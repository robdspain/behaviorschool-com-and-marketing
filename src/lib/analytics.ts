/**
 * Analytics and Conversion Tracking Utility
 * Centralized tracking for all conversion events
 */

// Extend the Window interface to include gtag
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer?: any[];
  }
}

export interface ConversionEvent {
  event_name: string;
  event_category: string;
  event_label?: string;
  value?: number;
  currency?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  custom_parameters?: Record<string, any>;
}

export interface LeadEvent extends ConversionEvent {
  lead_type: 'email_signup' | 'download' | 'tool_usage' | 'course_inquiry' | 'study_app_signup';
  source_page: string;
  user_email?: string;
  resource_name?: string;
}

export interface EcommerceEvent extends ConversionEvent {
  transaction_id: string;
  value: number;
  currency: string;
  items: Array<{
    item_id: string;
    item_name: string;
    category: string;
    quantity: number;
    price: number;
  }>;
}

/**
 * Track a conversion event
 */
export const trackConversion = (event: ConversionEvent): void => {
  if (typeof window === 'undefined' || !window.gtag) {
    console.log('Analytics not available:', event);
    return;
  }

  try {
    window.gtag('event', event.event_name, {
      event_category: event.event_category,
      event_label: event.event_label,
      value: event.value,
      currency: event.currency,
      ...event.custom_parameters,
    });

    // Also push to dataLayer for Google Tag Manager
    if (window.dataLayer) {
      window.dataLayer.push({
        event: event.event_name,
        event_category: event.event_category,
        event_label: event.event_label,
        value: event.value,
        currency: event.currency,
        ...event.custom_parameters,
      });
    }

    console.log('Conversion tracked:', event);
  } catch (error) {
    console.error('Error tracking conversion:', error);
  }
};

/**
 * Save event to database via API
 */
const saveEventToDatabase = async (event: {
  event_type: string;
  event_name: string;
  source_page: string;
  user_email?: string;
  resource_name?: string;
  value: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  additional_data?: Record<string, any>;
}): Promise<void> => {
  try {
    await fetch('/api/admin/analytics/conversions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
  } catch (error) {
    console.error('Error saving event to database:', error);
  }
};

/**
 * Track lead generation events
 */
export const trackLead = (event: LeadEvent): void => {
  trackConversion({
    event_name: 'generate_lead',
    event_category: 'lead_generation',
    event_label: event.lead_type,
    value: getLeadValue(event.lead_type),
    custom_parameters: {
      lead_type: event.lead_type,
      source_page: event.source_page,
      user_email: event.user_email,
      resource_name: event.resource_name,
      timestamp: new Date().toISOString(),
    },
  });

  // Also save to database
  saveEventToDatabase({
    event_type: event.lead_type,
    event_name: event.event_name,
    source_page: event.source_page,
    user_email: event.user_email,
    resource_name: event.resource_name,
    value: getLeadValue(event.lead_type),
    additional_data: event.custom_parameters,
  });
};

/**
 * Track ecommerce events (course purchases, subscriptions)
 */
export const trackPurchase = (event: EcommerceEvent): void => {
  if (typeof window === 'undefined' || !window.gtag) {
    console.log('Analytics not available:', event);
    return;
  }

  try {
    window.gtag('event', 'purchase', {
      transaction_id: event.transaction_id,
      value: event.value,
      currency: event.currency,
      items: event.items,
    });

    console.log('Purchase tracked:', event);
  } catch (error) {
    console.error('Error tracking purchase:', error);
  }
};

/**
 * Track page views with enhanced parameters
 */
export const trackPageView = (page_path: string, page_title?: string): void => {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  try {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || 'G-Z3XWL488ZP', {
      page_path,
      page_title,
    });
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};

/**
 * Track tool usage events
 */
export const trackToolUsage = (
  tool_name: string,
  action: string,
  source_page: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  additional_data?: Record<string, any>
): void => {
  trackConversion({
    event_name: 'tool_usage',
    event_category: 'engagement',
    event_label: `${tool_name}_${action}`,
    custom_parameters: {
      tool_name,
      action,
      source_page,
      ...additional_data,
    },
  });

  // Also save to database
  saveEventToDatabase({
    event_type: 'tool_usage',
    event_name: `${tool_name} - ${action}`,
    source_page,
    value: getLeadValue('tool_usage'),
    additional_data: {
      tool_name,
      action,
      ...additional_data,
    },
  });
};

/**
 * Track download events
 */
export const trackDownload = (
  resource_name: string,
  source_page: string,
  user_email?: string
): void => {
  trackLead({
    event_name: 'file_download',
    event_category: 'lead_generation',
    lead_type: 'download',
    source_page,
    user_email,
    resource_name,
    custom_parameters: {
      file_name: resource_name,
      download_type: 'lead_magnet',
    },
  });
};

/**
 * Track email signups
 */
export const trackEmailSignup = (
  source_page: string,
  signup_type: 'newsletter' | 'waitlist' | 'download' = 'newsletter',
  user_email?: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  additional_data?: Record<string, any>
): void => {
  trackLead({
    event_name: 'sign_up',
    event_category: 'lead_generation',
    lead_type: 'email_signup',
    source_page,
    user_email,
    custom_parameters: {
      signup_type,
      ...additional_data,
    },
  });
};

/**
 * Track course inquiries
 */
export const trackCourseInquiry = (
  course_name: string,
  source_page: string,
  inquiry_type: 'info_request' | 'waitlist' | 'application' = 'info_request',
  user_email?: string
): void => {
  trackLead({
    event_name: 'course_inquiry',
    event_category: 'lead_generation',
    lead_type: 'course_inquiry',
    source_page,
    user_email,
    custom_parameters: {
      course_name,
      inquiry_type,
    },
  });
};

/**
 * Track study app signups
 */
export const trackStudyAppSignup = (
  source_page: string,
  user_email?: string,
  plan_type?: string
): void => {
  trackLead({
    event_name: 'study_app_signup',
    event_category: 'lead_generation',
    lead_type: 'study_app_signup',
    source_page,
    user_email,
    custom_parameters: {
      plan_type,
    },
  });
};

/**
 * Get lead value for different lead types
 */
const getLeadValue = (lead_type: string): number => {
  const leadValues: Record<string, number> = {
    email_signup: 5,
    download: 10,
    tool_usage: 3,
    course_inquiry: 25,
    study_app_signup: 15,
  };

  return leadValues[lead_type] || 1;
};

/**
 * Track form submissions
 */
export const trackFormSubmission = (
  form_name: string,
  source_page: string,
  success: boolean = true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  additional_data?: Record<string, any>
): void => {
  trackConversion({
    event_name: success ? 'form_submit_success' : 'form_submit_error',
    event_category: 'engagement',
    event_label: form_name,
    custom_parameters: {
      form_name,
      source_page,
      success,
      ...additional_data,
    },
  });
};

/**
 * Track button clicks
 */
export const trackButtonClick = (
  button_name: string,
  source_page: string,
  button_location: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  additional_data?: Record<string, any>
): void => {
  trackConversion({
    event_name: 'button_click',
    event_category: 'engagement',
    event_label: button_name,
    custom_parameters: {
      button_name,
      source_page,
      button_location,
      ...additional_data,
    },
  });
};

/**
 * Track scroll depth
 */
export const trackScrollDepth = (depth: number, source_page: string): void => {
  trackConversion({
    event_name: 'scroll_depth',
    event_category: 'engagement',
    event_label: `${depth}%`,
    custom_parameters: {
      scroll_depth: depth,
      source_page,
    },
  });
};

/**
 * Track time on page
 */
export const trackTimeOnPage = (time_seconds: number, source_page: string): void => {
  trackConversion({
    event_name: 'time_on_page',
    event_category: 'engagement',
    event_label: `${Math.round(time_seconds)}s`,
    custom_parameters: {
      time_seconds,
      source_page,
    },
  });
};
