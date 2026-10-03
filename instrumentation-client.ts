import * as Sentry from '@sentry/nextjs';
import { readAnalyticsConsent } from '@/lib/analytics-consent';
import { initPostHog } from '@/lib/posthog-client';

// Returning visitors who already accepted analytics can be tracked immediately.
// Everyone else waits for the banner so PostHog does not set cookies or call home.
if (readAnalyticsConsent() === 'granted') {
  initPostHog();
}

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,

  // 10% performance sampling — stays well within free tier (5k errors, 10k perf txns/mo)
  tracesSampleRate: 0.1,

  // Only send Sentry events in production to avoid noise
  enabled: process.env.NODE_ENV === 'production',

  // FERPA compliance: strip all user-identifying context before sending to Sentry cloud
  beforeSend(event) {
    delete event.user;
    if (event.request) {
      delete event.request.data;
      delete event.request.cookies;
      delete event.request.headers;
    }
    return event;
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
