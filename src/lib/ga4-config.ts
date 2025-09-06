/**
 * Google Analytics 4 Configuration
 * Defines conversion events and custom dimensions
 */

export const GA4_EVENTS = {
  // Lead Generation Events
  EMAIL_SIGNUP: 'email_signup',
  DOWNLOAD: 'file_download',
  TOOL_USAGE: 'tool_usage',
  COURSE_INQUIRY: 'course_inquiry',
  STUDY_APP_SIGNUP: 'study_app_signup',
  
  // Engagement Events
  BUTTON_CLICK: 'button_click',
  FORM_SUBMIT: 'form_submit',
  SCROLL_DEPTH: 'scroll_depth',
  TIME_ON_PAGE: 'time_on_page',
  
  // Ecommerce Events
  PURCHASE: 'purchase',
  ADD_TO_CART: 'add_to_cart',
  BEGIN_CHECKOUT: 'begin_checkout',
  
  // Custom Events
  HERO_IMPRESSION: 'hero_impression',
  WAITLIST_MODAL_OPEN: 'waitlist_modal_open',
  CTA_CLICK: 'cta_click',
} as const;

export const GA4_CUSTOM_DIMENSIONS = {
  // User Properties
  USER_TYPE: 'user_type', // 'bcba', 'student', 'teacher', 'parent'
  SIGNUP_SOURCE: 'signup_source', // Page where user signed up
  LEAD_TYPE: 'lead_type', // Type of lead generated
  
  // Content Properties
  RESOURCE_NAME: 'resource_name', // Name of downloaded resource
  TOOL_NAME: 'tool_name', // Name of tool used
  COURSE_NAME: 'course_name', // Name of course inquired about
  
  // Engagement Properties
  BUTTON_LOCATION: 'button_location', // Where button was clicked
  FORM_NAME: 'form_name', // Name of form submitted
  SCROLL_DEPTH: 'scroll_depth', // How far user scrolled
  
  // Business Properties
  COHORT_STATUS: 'cohort_status', // 'open', 'full', 'waitlist'
  PLAN_TYPE: 'plan_type', // Study app plan type
} as const;

export const GA4_CONVERSION_GOALS = {
  // Primary Goals (High Value)
  EMAIL_SIGNUP: {
    event_name: GA4_EVENTS.EMAIL_SIGNUP,
    value: 5,
    currency: 'USD',
    description: 'Email newsletter signup'
  },
  
  DOWNLOAD: {
    event_name: GA4_EVENTS.DOWNLOAD,
    value: 10,
    currency: 'USD',
    description: 'Resource download with email capture'
  },
  
  COURSE_INQUIRY: {
    event_name: GA4_EVENTS.COURSE_INQUIRY,
    value: 25,
    currency: 'USD',
    description: 'Transformation program inquiry'
  },
  
  STUDY_APP_SIGNUP: {
    event_name: GA4_EVENTS.STUDY_APP_SIGNUP,
    value: 15,
    currency: 'USD',
    description: 'Study app signup'
  },
  
  // Secondary Goals (Engagement)
  TOOL_USAGE: {
    event_name: GA4_EVENTS.TOOL_USAGE,
    value: 3,
    currency: 'USD',
    description: 'Tool usage engagement'
  },
  
  BUTTON_CLICK: {
    event_name: GA4_EVENTS.BUTTON_CLICK,
    value: 1,
    currency: 'USD',
    description: 'CTA button click'
  },
  
  SCROLL_DEPTH: {
    event_name: GA4_EVENTS.SCROLL_DEPTH,
    value: 1,
    currency: 'USD',
    description: 'Page engagement (scroll depth)'
  },
} as const;

export const GA4_ECOMMERCE_ITEMS = {
  TRANSFORMATION_PROGRAM: {
    item_id: 'transformation_program',
    item_name: 'Behavior School Operating System - Transformation Program',
    category: 'Professional Development',
    price: 997,
    currency: 'USD'
  },
  
  STUDY_APP_MONTHLY: {
    item_id: 'study_app_monthly',
    item_name: 'BCBA Study App - Monthly Subscription',
    category: 'Study Tools',
    price: 29,
    currency: 'USD'
  },
  
  STUDY_APP_YEARLY: {
    item_id: 'study_app_yearly',
    item_name: 'BCBA Study App - Yearly Subscription',
    category: 'Study Tools',
    price: 299,
    currency: 'USD'
  },
} as const;

/**
 * Initialize GA4 with custom configuration
 */
export const initializeGA4 = (measurementId: string) => {
  if (typeof window === 'undefined') return;

  // Set up custom dimensions
  window.gtag?.('config', measurementId, {
    // Custom dimensions
    custom_map: {
      [GA4_CUSTOM_DIMENSIONS.USER_TYPE]: 'user_type',
      [GA4_CUSTOM_DIMENSIONS.SIGNUP_SOURCE]: 'signup_source',
      [GA4_CUSTOM_DIMENSIONS.LEAD_TYPE]: 'lead_type',
      [GA4_CUSTOM_DIMENSIONS.RESOURCE_NAME]: 'resource_name',
      [GA4_CUSTOM_DIMENSIONS.TOOL_NAME]: 'tool_name',
      [GA4_CUSTOM_DIMENSIONS.COURSE_NAME]: 'course_name',
      [GA4_CUSTOM_DIMENSIONS.BUTTON_LOCATION]: 'button_location',
      [GA4_CUSTOM_DIMENSIONS.FORM_NAME]: 'form_name',
      [GA4_CUSTOM_DIMENSIONS.SCROLL_DEPTH]: 'scroll_depth',
      [GA4_CUSTOM_DIMENSIONS.COHORT_STATUS]: 'cohort_status',
      [GA4_CUSTOM_DIMENSIONS.PLAN_TYPE]: 'plan_type',
    },
    
    // Enhanced measurement
    enhanced_measurement: {
      scrolls: true,
      outbound_clicks: true,
      site_search: true,
      video_engagement: true,
      file_downloads: true,
    },
    
    // Privacy settings
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
};

/**
 * Track conversion goal
 */
export const trackConversionGoal = (
  goalName: keyof typeof GA4_CONVERSION_GOALS,
  additionalData?: Record<string, any>
) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  const goal = GA4_CONVERSION_GOALS[goalName];
  
  window.gtag('event', goal.event_name, {
    event_category: 'conversion',
    event_label: goal.description,
    value: goal.value,
    currency: goal.currency,
    ...additionalData,
  });
};

/**
 * Track ecommerce purchase
 */
export const trackEcommercePurchase = (
  transactionId: string,
  items: Array<keyof typeof GA4_ECOMMERCE_ITEMS>,
  totalValue: number
) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  const purchaseItems = items.map(itemKey => GA4_ECOMMERCE_ITEMS[itemKey]);

  window.gtag('event', 'purchase', {
    transaction_id: transactionId,
    value: totalValue,
    currency: 'USD',
    items: purchaseItems,
  });
};
