const DEFAULT_DELIVERY_CONVEX_URL = 'https://precious-clownfish-797.convex.cloud';
const DEFAULT_CONTENT_CONVEX_URL = 'https://modest-malamute-868.convex.cloud';

export type ConvexNewsletterStatus = 'pending' | 'subscribed' | 'unsubscribed';

export type ConvexNewsletterInput = {
  email: string;
  name?: string;
  source?: string;
  page?: string;
  tags?: string[];
};

export function normalizeNewsletterEmail(email: string) {
  return String(email || '').trim().toLowerCase();
}

export function isValidNewsletterEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function subscribeToNewsletter(input: ConvexNewsletterInput) {
  const email = normalizeNewsletterEmail(input.email);

  if (!isValidNewsletterEmail(email)) {
    throw new Error('invalid_email');
  }

  const pageTag = input.page ? `page:${input.page.slice(0, 80)}` : '';
  const response = await fetch(`${getDeliveryConvexUrl()}/api/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      path: 'newsletterActions:requestSubscription',
      args: {
        email,
        name: input.name || undefined,
        source: input.source || 'behaviorschool.com',
        tags: Array.from(new Set(['newsletter', 'behaviorschool.com', pageTag, ...(input.tags || [])].filter(Boolean))),
      },
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error('Convex newsletter subscribe failed:', data);
    throw new Error('newsletter_unavailable');
  }

  return {
    success: true,
    isNew: data?.value?.isNew ?? true,
    status: data?.value?.status || 'pending',
    message:
      data?.value?.status === 'subscribed'
        ? 'You are already subscribed.'
        : 'Check your inbox to confirm your subscription. We will send the latest issue as soon as you confirm.',
  };
}

export async function confirmNewsletterSubscription(email: string) {
  const normalizedEmail = normalizeNewsletterEmail(email);

  if (!isValidNewsletterEmail(normalizedEmail)) {
    throw new Error('invalid_email');
  }

  const response = await fetch(`${getContentConvexUrl()}/api/mutation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      path: 'newsletter:confirmSubscription',
      args: { email: normalizedEmail },
    }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    console.error('Convex newsletter confirm failed:', data);
    throw new Error('newsletter_unavailable');
  }

  return { success: true, email: normalizedEmail };
}

export async function unsubscribeFromNewsletter(email: string) {
  const normalizedEmail = normalizeNewsletterEmail(email);
  if (!isValidNewsletterEmail(normalizedEmail)) {
    throw new Error('invalid_email');
  }

  const response = await fetch(`${getContentConvexUrl()}/api/mutation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      path: 'newsletter:unsubscribeFromNewsletter',
      args: { email: normalizedEmail },
    }),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    console.error('Convex newsletter unsubscribe failed:', data);
    throw new Error('newsletter_unavailable');
  }
  return { success: true };
}

function getDeliveryConvexUrl() {
  return String(
    process.env.ROBSPAIN_NEWSLETTER_CONVEX_URL ||
      DEFAULT_DELIVERY_CONVEX_URL
  ).replace(/\/$/, '');
}

function getContentConvexUrl() {
  return String(
    process.env.NEWSLETTER_CONVEX_URL ||
      process.env.CONVEX_URL ||
      process.env.NEXT_PUBLIC_CONVEX_URL ||
      DEFAULT_CONTENT_CONVEX_URL
  ).replace(/\/$/, '');
}
