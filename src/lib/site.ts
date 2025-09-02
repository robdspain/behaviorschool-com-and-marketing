export function getSiteUrl(): string {
  const fromEnv = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv && typeof fromEnv === 'string') {
    return fromEnv.replace(/\/$/, '');
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, '')}`;
  }
  return 'http://localhost:3000';
}

export function getAbsoluteUrl(path: string): string {
  const base = getSiteUrl();
  if (!path) return base;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/')) return `${base}${path}`;
  return `${base}/${path}`;
}

export const siteName = 'Behavior School';

