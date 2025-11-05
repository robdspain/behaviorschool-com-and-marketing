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
  updated_at?: string | null;
  status?: 'draft' | 'published';
  tags?: Tag[];
  authors?: Author[];
  primary_tag?: Tag | null;
  primary_author?: Author | null;
  html?: string | null;
  plaintext?: string | null;
  // SEO metadata fields
  meta_title?: string | null;
  meta_description?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
  twitter_title?: string | null;
  twitter_description?: string | null;
  twitter_image?: string | null;
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

// Helper function to fix broken image URLs in posts
function fixBrokenImageUrls(post: Post): Post {
  const brokenPatterns = [
    'ghost.behaviorschool.com/content/images/',
    'behaviorschool.ghost.io/content/images/'
  ];
  
  // Fix feature image
  if (post.feature_image && brokenPatterns.some(pattern => post.feature_image?.includes(pattern))) {
    post.feature_image = '/thumbnails/hero-thumb.webp';
  }
  
  // Fix HTML content
  if (post.html) {
    const brokenImageRegexes = [
      /https?:\/\/ghost\.behaviorschool\.com\/content\/images\/[^"'\s]*/g,
      /https?:\/\/behaviorschool\.ghost\.io\/content\/images\/[^"'\s]*/g
    ];
    
    let fixedHtml = post.html;
    brokenImageRegexes.forEach(regex => {
      fixedHtml = fixedHtml.replace(regex, '/thumbnails/hero-thumb.webp');
    });
    
    post.html = fixedHtml;
  }
  
  return post;
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
    const result = await fetchGhost<PostsResponse>(
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
    
    // Fix broken image URLs in posts from Ghost API
    result.posts = result.posts.map(post => fixBrokenImageUrls(post));
    
    return result;
  } catch (error) {
    // Try RSS fallback when API key is invalid
    if (error instanceof GhostAPIError && error.details && 
        typeof error.details === 'object' && 
        'errors' in error.details &&
        Array.isArray(error.details.errors) &&
        error.details.errors.some((e: { code?: string }) => e?.code === 'UNKNOWN_CONTENT_API_KEY')) {
      
      try {
        return await getPostsFromRSS({ limit, page });
      } catch (rssError) {
        console.error('RSS fallback failed:', rssError);
      }
    }
    
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
    const post = Array.isArray(data.posts) && data.posts.length > 0 ? data.posts[0] : null;
    
    // Fix broken image URLs in the post
    return post ? fixBrokenImageUrls(post) : null;
  } catch (error) {
    // Try RSS fallback when API key is invalid
    if (error instanceof GhostAPIError && error.details && 
        typeof error.details === 'object' && 
        'errors' in error.details &&
        Array.isArray(error.details.errors) &&
        error.details.errors.some((e: { code?: string }) => e?.code === 'UNKNOWN_CONTENT_API_KEY')) {
      
      try {
        return await getPostBySlugFromRSS(slug);
      } catch (rssError) {
        console.error('RSS fallback failed for post:', rssError);
      }
    }
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

// RSS fallback function for when API key is invalid
async function getPostsFromRSS(args: { limit?: number; page?: number }): Promise<{ posts: Post[]; meta: { pagination: PaginationMeta } }> {
  const { limit = 12, page = 1 } = args;
  const ghostUrl = getEnv('GHOST_CONTENT_URL');
  
  if (!ghostUrl) {
    throw new Error('GHOST_CONTENT_URL not configured');
  }

  const rssUrl = `${ghostUrl.replace(/\/$/, '')}/rss/`;
  const response = await fetch(rssUrl, {
    next: { revalidate: 60 }
  });

  if (!response.ok) {
    throw new Error(`RSS fetch failed: ${response.status}`);
  }

  const rssText = await response.text();
  const posts = parseRSSPosts(rssText, limit, page);
  
  return {
    posts,
    meta: {
      pagination: {
        page,
        limit,
        pages: Math.ceil(posts.length / limit),
        total: posts.length,
        next: page * limit < posts.length ? page + 1 : null,
        prev: page > 1 ? page - 1 : null,
      }
    }
  };
}

function parseRSSPosts(rssXML: string, limit: number, page: number): Post[] {
  const posts: Post[] = [];
  
  // Simple RSS parsing - extract items
  const itemMatches = rssXML.match(/<item>([\s\S]*?)<\/item>/g) || [];
  
  itemMatches.forEach((item, index) => {
    try {
      const title = extractRSSField(item, 'title');
      const link = extractRSSField(item, 'link');
      const description = extractRSSField(item, 'description');
      const pubDate = extractRSSField(item, 'pubDate');
      const creator = extractRSSField(item, 'dc:creator');
      const guid = extractRSSField(item, 'guid');
      const content = extractRSSField(item, 'content:encoded');
      
      
      if (title && link) {
        // Extract slug from link
        const urlParts = link.split('/');
        const slug = urlParts[urlParts.length - 2] || urlParts[urlParts.length - 1] || `post-${index}`;
        
        // Extract feature image from content
        const imageMatch = item.match(/<media:content[^>]*url="([^"]*)"[^>]*>/);
        let featureImage = imageMatch ? imageMatch[1] : null;
        
        // If no media:content, try to extract from content:encoded img tags
        if (!featureImage) {
          const contentImageMatch = content?.match(/<img[^>]*src="([^"]*)"[^>]*>/);
          featureImage = contentImageMatch ? contentImageMatch[1] : null;
        }
        
        // Fix broken Ghost image URLs - use fallback if image is from Ghost content/images
        if (featureImage && featureImage.includes('/content/images/')) {
          // Check if it's a broken Ghost image URL
          const brokenPatterns = [
            'ghost.behaviorschool.com/content/images/',
            'behaviorschool.ghost.io/content/images/'
          ];
          
          const isBrokenImage = brokenPatterns.some(pattern => featureImage?.includes(pattern));
          
          if (isBrokenImage) {
            // Use a fallback image instead of broken Ghost images
            featureImage = '/thumbnails/hero-thumb.webp';
          }
        }

        // Parse categories as tags
        const categoryMatches = item.match(/<category><!\[CDATA\[(.*?)\]\]><\/category>/g) || [];
        const tags = categoryMatches.map((cat, i) => {
          const name = cat.match(/<category><!\[CDATA\[(.*?)\]\]><\/category>/)?.[1] || '';
          return {
            id: `tag-${i}`,
            name: cleanRSSContent(name),
            slug: name.toLowerCase().replace(/\s+/g, '-')
          };
        });

        posts.push({
          id: guid || `rss-${index}`,
          title: cleanRSSContent(title),
          slug,
          url: link,
          excerpt: description ? cleanRSSContent(description).substring(0, 200) : null,
          feature_image: featureImage,
          published_at: pubDate ? new Date(pubDate).toISOString() : null,
          primary_author: creator ? {
            id: 'rss-author',
            name: cleanRSSContent(creator),
            slug: creator.toLowerCase().replace(/\s+/g, '-')
          } : null,
          tags: tags,
          primary_tag: tags.length > 0 ? tags[0] : null,
          html: content ? cleanRSSContentForHTML(content) : null,
          plaintext: content ? cleanRSSContent(content) : null
        });
      }
    } catch (error) {
      console.warn('Failed to parse RSS item:', error);
    }
  });

  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return posts.slice(startIndex, endIndex);
}

function extractRSSField(item: string, fieldName: string): string | null {
  const regex = new RegExp(`<${fieldName}[^>]*>(.*?)<\/${fieldName}>`, 'is');
  const match = item.match(regex);
  return match ? match[1].trim() : null;
}

// RSS fallback function for individual posts
async function getPostBySlugFromRSS(slug: string): Promise<Post | null> {
  const ghostUrl = getEnv('GHOST_CONTENT_URL');
  
  if (!ghostUrl) {
    throw new Error('GHOST_CONTENT_URL not configured');
  }

  const rssUrl = `${ghostUrl.replace(/\/$/, '')}/rss/`;
  const response = await fetch(rssUrl, {
    next: { revalidate: 60 }
  });

  if (!response.ok) {
    throw new Error(`RSS fetch failed: ${response.status}`);
  }

  const rssText = await response.text();
  const posts = parseRSSPosts(rssText, 100, 1); // Get more posts to find the right one
  
  // Find the post with matching slug
  const post = posts.find(p => p.slug === slug);
  
  return post || null;
}

function cleanRSSContent(content: string | null): string {
  if (!content) return '';
  
  return content
    // Remove CDATA wrappers
    .replace(/^<!\[CDATA\[([\s\S]*?)\]\]>$/, '$1')
    .replace(/CDATA\[(.*?)\]/g, '$1')
    // Decode HTML entities
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    // Remove HTML tags for excerpts
    .replace(/<[^>]*>/g, '')
    // Clean up extra whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanRSSContentForHTML(content: string | null): string {
  if (!content) return '';
  
  let cleanedContent = content
    // Remove CDATA wrappers
    .replace(/^<!\[CDATA\[([\s\S]*?)\]\]>$/, '$1')
    .replace(/CDATA\[(.*?)\]/g, '$1')
    // Decode HTML entities
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&#x2013;/g, '–')
    .replace(/&#x2014;/g, '—')
    .replace(/&apos;/g, "'")
    // Remove malformed HTML tags at the beginning
    .replace(/^<h1 id><\/h1>/g, '')
    .replace(/^<h1 id=""?><\/h1>/g, '')
    .replace(/^<[^>]*\s+id><\/[^>]*>/g, '')
    // Keep HTML tags but clean up
    .trim();
  
  // Fix broken image URLs in HTML content
  const brokenImagePatterns = [
    /https?:\/\/ghost\.behaviorschool\.com\/content\/images\/[^"'\s]*/g,
    /https?:\/\/behaviorschool\.ghost\.io\/content\/images\/[^"'\s]*/g
  ];
  
  brokenImagePatterns.forEach(pattern => {
    cleanedContent = cleanedContent.replace(pattern, '/thumbnails/hero-thumb.webp');
  });
  
  return cleanedContent;
}


