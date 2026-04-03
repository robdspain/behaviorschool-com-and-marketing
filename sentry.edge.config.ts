import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,

  // Lower sample rate for edge runtime
  tracesSampleRate: 0.1,

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
