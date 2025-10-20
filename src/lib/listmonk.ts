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

