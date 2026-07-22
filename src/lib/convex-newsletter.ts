const DEFAULT_CONVEX_URL = 'https://modest-malamute-868.convex.cloud';

export type ConvexNewsletterStatus = 'pending' | 'subscribed' | 'unsubscribed';

export type ConvexNewsletterInput = {
  email: string;
  name?: string;
  source?: string;
  page?: string;
  tags?: string[];
  status?: ConvexNewsletterStatus;
  sendWelcome?: boolean;
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

  const response = await fetch(`${getConvexUrl()}/api/mutation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      path: 'newsletter:subscribeToNewsletter',
      args: {
        email,
        name: input.name || undefined,
        source: input.source || 'behaviorschool.com',
        tags: input.tags || ['newsletter'],
        status: input.status || 'pending',
        metadata: {
          page: input.page,
          site: 'behaviorschool.com',
        },
      },
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error('Convex newsletter subscribe failed:', data);
    throw new Error('newsletter_unavailable');
  }

  if (input.sendWelcome) {
    const { sendWelcomeEmail } = await import('@/lib/email');
    await sendWelcomeEmail(email);
  }

  return {
    success: true,
    isNew: data?.value?.isNew ?? true,
    status: data?.value?.status || input.status || 'pending',
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

  const response = await fetch(`${getConvexUrl()}/api/mutation`, {
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

function getConvexUrl() {
  return String(
    process.env.NEWSLETTER_CONVEX_URL ||
      process.env.CONVEX_URL ||
      process.env.NEXT_PUBLIC_CONVEX_URL ||
      DEFAULT_CONVEX_URL
  ).replace(/\/$/, '');
}
