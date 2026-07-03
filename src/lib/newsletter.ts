import { listmonkFetch, upsertListmonkSubscriber } from '@/lib/listmonk';

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || 'https://quixotic-fox-157.convex.cloud';

type SubscribeNewsletterInput = {
  email: string;
  name?: string;
  source?: string;
  tags?: string[];
  page?: string;
  sendWelcome?: boolean;
};

type SyncResult = {
  ok: boolean;
  skipped?: boolean;
  status?: number;
  error?: string;
};

export type SubscribeNewsletterResult = {
  ok: boolean;
  email: string;
  isNew?: boolean;
  message: string;
  sync: {
    listmonk: SyncResult;
    convex: SyncResult;
    supabase: SyncResult;
    welcomeEmail?: SyncResult;
  };
};

export function normalizeNewsletterEmail(email: string) {
  return String(email || '').trim().toLowerCase();
}

export function isValidNewsletterEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function parseListIds() {
  const raw =
    process.env.LISTMONK_NEWSLETTER_LIST_ID ||
    process.env.LISTMONK_DEFAULT_LIST_ID ||
    '';

  return raw
    .split(',')
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isInteger(value) && value > 0);
}

function mergeUnique<T>(items: T[]) {
  return Array.from(new Set(items.filter(Boolean)));
}

function escapeListmonkQueryValue(value: string) {
  return value.replace(/'/g, "''");
}

async function syncListmonk(input: Required<Pick<SubscribeNewsletterInput, 'email'>> & Omit<SubscribeNewsletterInput, 'email'>): Promise<SyncResult> {
  const listIds = parseListIds();
  const attribs = {
    source: input.source || 'behaviorschool.com',
    page: input.page,
    tags: input.tags || [],
    site: 'behaviorschool.com',
    subscribed_at: new Date().toISOString(),
  };

  const result = await upsertListmonkSubscriber({
    email: input.email,
    name: input.name,
    lists: listIds,
    attribs,
    preconfirm: true,
  });

  if (!result.ok) {
    return { ok: false, status: result.status, error: JSON.stringify(result.body || {}) };
  }

  if (listIds.length === 0) {
    return { ok: true, status: result.status, skipped: true };
  }

  try {
    const query = `subscribers.email = '${escapeListmonkQueryValue(input.email)}'`;
    const searchRes = await listmonkFetch(`/api/subscribers?per_page=1&query=${encodeURIComponent(query)}`);
    const searchJson = await searchRes.json().catch(() => null) as any;
    const subscriber = searchJson?.data?.results?.[0];

    if (!subscriber?.id) {
      return { ok: true, status: result.status };
    }

    await listmonkFetch('/api/subscribers/lists', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ids: [subscriber.id],
        action: 'add',
        target_list_ids: listIds,
        status: 'confirmed',
      }),
    });

    await listmonkFetch(`/api/subscribers/${subscriber.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: input.name || subscriber.name || '',
        status: 'enabled',
        attribs,
        preconfirm_subscriptions: true,
      }),
    });
  } catch (error) {
    return { ok: false, status: result.status, error: String(error) };
  }

  return { ok: true, status: result.status };
}

async function syncConvex(input: Required<Pick<SubscribeNewsletterInput, 'email'>> & Omit<SubscribeNewsletterInput, 'email'>): Promise<SyncResult & { isNew?: boolean }> {
  try {
    const response = await fetch(`${CONVEX_URL}/api/mutation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: 'newsletter:subscribeToNewsletter',
        args: {
          email: input.email,
          name: input.name || undefined,
          source: input.source || 'behaviorschool.com',
          tags: mergeUnique(['behaviorschool.com', 'newsletter', ...(input.tags || [])]),
        },
      }),
    });

    const json = await response.json().catch(() => ({}));
    if (!response.ok) {
      return { ok: false, status: response.status, error: json?.error || json?.message || 'convex_error' };
    }

    return { ok: true, status: response.status, isNew: json?.value?.isNew };
  } catch (error) {
    return { ok: false, error: String(error) };
  }
}

async function syncSupabase(input: Required<Pick<SubscribeNewsletterInput, 'email'>> & Omit<SubscribeNewsletterInput, 'email'>): Promise<SyncResult> {
  try {
    const { createSupabaseAdminClient } = await import('@/lib/supabase-admin');
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase
      .from('newsletter_subscribers')
      .upsert({
        email: input.email,
        source: input.source || 'behaviorschool.com',
        subscribed_at: new Date().toISOString(),
        status: 'active',
      }, { onConflict: 'email' });

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true };
  } catch (error) {
    return { ok: false, skipped: true, error: String(error) };
  }
}

export async function subscribeToNewsletter(input: SubscribeNewsletterInput): Promise<SubscribeNewsletterResult> {
  const email = normalizeNewsletterEmail(input.email);

  if (!isValidNewsletterEmail(email)) {
    throw new Error('invalid_email');
  }

  const normalizedInput = {
    ...input,
    email,
    tags: mergeUnique(['newsletter', ...(input.tags || [])]),
  };

  const [listmonk, convex, supabase] = await Promise.all([
    syncListmonk(normalizedInput),
    syncConvex(normalizedInput),
    syncSupabase(normalizedInput),
  ]);

  let welcomeEmail: SyncResult | undefined;
  if (input.sendWelcome) {
    const { sendWelcomeEmail } = await import('@/lib/email');
    const result = await sendWelcomeEmail(email);
    welcomeEmail = result.success
      ? { ok: true }
      : { ok: false, error: String(result.error || 'welcome_email_failed') };
  }

  const ok = listmonk.ok || convex.ok || supabase.ok;
  if (!ok) {
    throw new Error('newsletter_sync_failed');
  }

  return {
    ok,
    email,
    isNew: convex.isNew,
    message: convex.isNew === false
      ? 'You are already on the newsletter list.'
      : 'You are in. Watch for the next Behavior School newsletter.',
    sync: {
      listmonk,
      convex,
      supabase,
      ...(welcomeEmail ? { welcomeEmail } : {}),
    },
  };
}
