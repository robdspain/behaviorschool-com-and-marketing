// Sentry is loaded after the page has finished loading so the SDK (about 120 KB)
// stays out of the critical path. Errors thrown before it loads are not captured.
type SentryModule = typeof import('@sentry/nextjs');

let sentry: SentryModule | null = null;

async function initSentry() {
  const Sentry = await import('@sentry/nextjs');
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,

    // 10% performance sampling, stays well within free tier (5k errors, 10k perf txns/mo)
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
  sentry = Sentry;
}

function scheduleSentry() {
  const start = () => {
    const idle = (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => void }).requestIdleCallback;
    if (idle) idle(() => void initSentry(), { timeout: 4000 });
    else setTimeout(() => void initSentry(), 2000);
  };
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
}

if (typeof window !== 'undefined') scheduleSentry();

export const onRouterTransitionStart: SentryModule['captureRouterTransitionStart'] = (...args) => {
  sentry?.captureRouterTransitionStart(...args);
};
