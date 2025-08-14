/*
  Ghost Content API helpers
  - Reads env: GHOST_CONTENT_URL, GHOST_CONTENT_KEY
  - Exports: getPosts, getPostBySlug, getTags, getAuthors
  - Uses Next.js fetch revalidation (default 60s, override via { next: { revalidate } })
  - Ensures server-only usage to avoid leaking the content key to the client
*/

// Minimal types for the fields we commonly use
export interface Tag {
  id: string;
  name: string;
  slug: string;
  url?: string;
}

export interface Author {
  id: string;
  name: string;
  slug: string;
  profile_image?: string | null;
  url?: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  url?: string;
  excerpt?: string | null;
  feature_image?: string | null;
  published_at?: string | null;
  tags?: Tag[];
  authors?: Author[];
  primary_tag?: Tag | null;
  primary_author?: Author | null;
  html?: string | null;
  plaintext?: string | null;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  pages: number;
  total: number;
  next?: number | null;
  prev?: number | null;
}

export class GhostAPIError extends Error {
  public readonly status?: number;
  public readonly url: string;
  public readonly details?: unknown;

  constructor(message: string, options: { status?: number; url: string; details?: unknown }) {
    super(message);
    this.name = 'GhostAPIError';
    this.status = options.status;
    this.url = options.url;
    this.details = options.details;
  }
}

function assertServerOnly(): void {
  if (typeof window !== 'undefined') {
    throw new Error('Ghost Content API helpers must be called from the server to protect the content key.');
  }
}

function getEnv(name: 'GHOST_CONTENT_URL' | 'GHOST_CONTENT_KEY'): string | null {
  const raw = process.env[name] || '';
  const value = raw.trim();
  if (!value) return null;
  // Treat common placeholders as unset to avoid build-time failures
  const placeholders = [
    'REPLACE_WITH_CONTENT_API_KEY',
    'YOUR_GHOST_CONTENT_API_KEY',
    'REPLACE_ME',
    'YOUR_KEY_HERE',
  ];
  if (placeholders.includes(value)) return null;
  return value;
}

function getApiBaseUrl(): string {
  const base = getEnv('GHOST_CONTENT_URL');
  if (!base) {
    throw new Error('GHOST_CONTENT_URL is not configured');
  }
  return `${base.replace(/\/$/, '')}/ghost/api/content`;
}

type NextRevalidate = { next?: { revalidate?: number } };

function resolveRevalidate(next?: NextRevalidate['next']): number {
  const DEFAULT_REVALIDATE_SECONDS = 60;
  const value = next?.revalidate;
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : DEFAULT_REVALIDATE_SECONDS;
}

async function fetchGhost<TResponse>(
  endpoint: string,
  params: Record<string, string | number | undefined>,
  revalidateSeconds: number
): Promise<TResponse> {
  const apiBase = getApiBaseUrl();
  const key = getEnv('GHOST_CONTENT_KEY');
  
  if (!key) {
    throw new Error('GHOST_CONTENT_KEY is not configured');
  }

  const url = new URL(`${apiBase}/${endpoint.replace(/^\//, '')}`);
  // Required key
  url.searchParams.set('key', key);
  // User params
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && `${v}`.length > 0) {
      url.searchParams.set(k, String(v));
    }
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: { Accept: 'application/json' },
    // Next.js App Router revalidation
    next: { revalidate: revalidateSeconds },
  } as RequestInit & { next: { revalidate: number } });

  if (!response.ok) {
    let details: unknown = undefined;
    let message = `Ghost API request failed with status ${response.status}`;
    try {
      const errorBody = (await response.json()) as { errors?: Array<{ message?: string; context?: string }> };
      if (errorBody?.errors && errorBody.errors.length > 0) {
        const first = errorBody.errors[0];
        if (first?.message) message = first.message;
        details = errorBody;
      }
    } catch {
      // Non-JSON error; ignore
    }
    throw new GhostAPIError(message, { status: response.status, url: url.toString(), details });
  }

  try {
    return (await response.json()) as TResponse;
  } catch {
    throw new GhostAPIError('Failed to parse Ghost API response as JSON', {
      status: response.status,
      url: url.toString(),
      details: undefined,
    });
  }
}

// ===== Public helpers =====

export async function getPosts(
  args: {
    limit?: number;
    page?: number;
    filter?: string;
    tag?: string;
    order?: string;
    include?: string; // e.g., 'tags,authors'
  } & NextRevalidate = {}
): Promise<{ posts: Post[]; meta: { pagination: PaginationMeta } }> {
  assertServerOnly();
  
  // Return empty results if Ghost is not configured
  const ghostUrl = getEnv('GHOST_CONTENT_URL');
  const ghostKey = getEnv('GHOST_CONTENT_KEY');
  if (!ghostUrl || !ghostKey) {
    return {
      posts: [],
      meta: {
        pagination: {
          page: 1,
          limit: args.limit || 12,
          pages: 0,
          total: 0,
          next: null,
          prev: null,
        }
      }
    };
  }

  const { limit = 12, page = 1, filter, tag, order, include = 'tags,authors', next } = args;

  let combinedFilter = filter?.trim();
  if (tag && tag.trim().length > 0) {
    combinedFilter = combinedFilter && combinedFilter.length > 0 ? `${combinedFilter}+tag:${tag}` : `tag:${tag}`;
  }

  const revalidate = resolveRevalidate(next);
  type PostsResponse = { posts: Post[]; meta: { pagination: PaginationMeta } };
  try {
    return await fetchGhost<PostsResponse>(
      'posts/',
      {
        limit,
        page,
        include,
        filter: combinedFilter,
        order,
      },
      revalidate
    );
  } catch (err) {
    // Fail-soft: when Ghost is misconfigured or unavailable, surface no posts instead of failing the build
    return {
      posts: [],
      meta: {
        pagination: {
          page: 1,
          limit,
          pages: 0,
          total: 0,
          next: null,
          prev: null,
        },
      },
    };
  }
}

export async function getPostBySlug(
  slug: string,
  args: { include?: string; formats?: string } & NextRevalidate = {}
): Promise<Post | null> {
  assertServerOnly();
  const { include = 'tags,authors', formats = 'html,plaintext', next } = args;
  const revalidate = resolveRevalidate(next);
  type PostBySlugResponse = { posts: Post[] };
  try {
    const data = await fetchGhost<PostBySlugResponse>(
      `posts/slug/${encodeURIComponent(slug)}/`,
      { include, formats },
      revalidate
    );
    return Array.isArray(data.posts) && data.posts.length > 0 ? data.posts[0] : null;
  } catch {
    return null;
  }
}

export async function getTags(args: { limit?: number } & NextRevalidate = {}): Promise<Tag[]> {
  assertServerOnly();
  const { limit = 50, next } = args;
  const revalidate = resolveRevalidate(next);
  type TagsResponse = { tags: Tag[] };
  try {
    const data = await fetchGhost<TagsResponse>('tags/', { limit }, revalidate);
    return data.tags ?? [];
  } catch {
    return [];
  }
}

export async function getAuthors(args: NextRevalidate = {}): Promise<Author[]> {
  assertServerOnly();
  const revalidate = resolveRevalidate(args.next);
  type AuthorsResponse = { authors: Author[] };
  try {
    const data = await fetchGhost<AuthorsResponse>('authors/', {}, revalidate);
    return data.authors ?? [];
  } catch {
    return [];
  }
}


