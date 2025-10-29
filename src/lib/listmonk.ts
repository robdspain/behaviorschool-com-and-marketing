// Listmonk API helper utilities
// Centralizes configuration and authenticated fetch to the Listmonk server

interface ListmonkConfig {
  url: string;
  username?: string;
  password?: string;
}

export function getListmonkConfig(): ListmonkConfig | null {
  const url = process.env.LISTMONK_URL || '';
  const username = process.env.LISTMONK_USERNAME || '';
  const password = process.env.LISTMONK_PASSWORD || '';

  if (!url) return null;

  return {
    url: url.replace(/\/$/, ''),
    username: username || undefined,
    password: password || undefined,
  };
}

export async function listmonkFetch(path: string, init: RequestInit = {}) {
  const cfg = getListmonkConfig();
  if (!cfg) throw new Error('Listmonk is not configured. Set LISTMONK_URL.');

  const headers = new Headers(init.headers || {});
  headers.set('Accept', 'application/json');

  // Use Basic auth if username/password provided
  if (cfg.username && cfg.password) {
    const token = Buffer.from(`${cfg.username}:${cfg.password}`).toString('base64');
    headers.set('Authorization', `Basic ${token}`);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const res = await fetch(`${cfg.url}${path}`, {
      ...init,
      headers,
      signal: controller.signal,
    });
    return res;
  } finally {
    clearTimeout(timeout);
  }
}

// Create a subscriber in Listmonk and subscribe to lists.
// If the subscriber already exists, this will return gracefully without throwing.
export async function upsertListmonkSubscriber(opts: {
  email: string;
  name?: string;
  lists?: number[];
  attribs?: Record<string, unknown>;
  preconfirm?: boolean; // preconfirm_subscriptions
  status?: 'enabled' | 'blocklisted';
}): Promise<{ ok: boolean; status: number; body?: unknown }> {
  const { email, name = '', lists, attribs, preconfirm = true, status = 'enabled' } = opts;

  // Validate config exists before attempting
  const cfg = getListmonkConfig();
  if (!cfg) {
    return { ok: false, status: 0, body: { error: 'listmonk_not_configured' } };
  }

  const payload: Record<string, unknown> = {
    email,
    name,
    status,
    preconfirm_subscriptions: preconfirm,
  };
  if (attribs) payload.attribs = attribs;
  if (lists && lists.length > 0) payload.lists = lists;

  try {
    const res = await listmonkFetch('/api/subscribers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      // If already exists (409), treat as success for idempotency
      if (res.status === 409) {
        return { ok: true, status: res.status };
      }
    }

    // Try to parse response if JSON
    let body: unknown = undefined;
    try {
      body = await res.json();
    } catch {}
    return { ok: res.ok, status: res.status, body };
  } catch (e) {
    // Network or timeout; do not throw to avoid breaking callers
    return { ok: false, status: 0, body: { error: 'network_error', details: String(e) } };
  }
}

