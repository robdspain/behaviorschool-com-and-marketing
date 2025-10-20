/*
  Ghost Database Direct Access
  - Connects to Ghost MySQL database on Digital Ocean
  - Replaces Ghost Content API for better reliability
  - Provides same interface as ghost.ts for seamless replacement
*/

import mysql, { RowDataPacket, FieldPacket } from 'mysql2/promise';

// Reuse the same types from ghost.ts for compatibility
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

interface PostRow extends RowDataPacket {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  feature_image: string | null;
  published_at: string | null;
  html: string | null;
  plaintext: string | null;
}

interface PostRowWithAuthor extends PostRow {
  author_id: string | null;
  author_name: string | null;
  author_slug: string | null;
  author_profile_image: string | null;
}

interface TagRow extends RowDataPacket {
  id: string;
  name: string;
  slug: string;
  post_id?: string; // Optional for when joining with posts_tags
}

interface AuthorRow extends RowDataPacket {
  id: string;
  name: string;
  slug: string;
  profile_image: string | null;
}

let connection: mysql.Connection | null = null;

async function getConnection(): Promise<mysql.Connection> {
  if (!connection) {
    connection = await mysql.createConnection({
      host: process.env.GHOST_DB_HOST!,
      port: parseInt(process.env.GHOST_DB_PORT || '25060'),
      user: process.env.GHOST_DB_USER!,
      password: process.env.GHOST_DB_PASSWORD!,
      database: process.env.GHOST_DB_NAME!,
      ssl: process.env.GHOST_DB_SSL === 'true' ? {
        rejectUnauthorized: false
      } : undefined,
      connectTimeout: 10000,
    });
  }
  return connection;
}

function assertServerOnly(): void {
  if (typeof window !== 'undefined') {
    throw new Error('Ghost Database helpers must be called from the server to protect database credentials.');
  }
}

export async function getPosts(
  args: {
    limit?: number;
    page?: number;
    filter?: string;
    tag?: string;
    order?: string;
    include?: string;
  } = {}
): Promise<{ posts: Post[]; meta: { pagination: PaginationMeta } }> {
  assertServerOnly();

  const { limit = 12, page = 1, tag, order = 'published_at DESC' } = args;
  const offset = (page - 1) * limit;

  try {
    const db = await getConnection();

    // Build the query
    let whereClause = 'WHERE p.status = "published" AND p.type = "post"';
    const queryParams: (string | number)[] = [];

    if (tag) {
      whereClause += ' AND EXISTS (SELECT 1 FROM posts_tags pt JOIN tags t ON pt.tag_id = t.id WHERE pt.post_id = p.id AND t.slug = ?)';
      queryParams.push(tag);
    }

    // Get total count for pagination
    const [countResult] = await db.execute(
      `SELECT COUNT(*) as total FROM posts p ${whereClause}`,
      queryParams
    ) as [RowDataPacket[], FieldPacket[]];

    const total = (countResult[0] as { total: number }).total;
    const pages = Math.ceil(total / limit);

    // Get posts with authors
    const [postsResult] = await db.execute(`
      SELECT
        p.id,
        p.title,
        p.slug,
        p.excerpt,
        p.feature_image,
        p.published_at,
        p.html,
        p.plaintext,
        u.id as author_id,
        u.name as author_name,
        u.slug as author_slug,
        u.profile_image as author_profile_image
      FROM posts p
      LEFT JOIN posts_authors pa ON p.id = pa.post_id AND pa.sort_order = 0
      LEFT JOIN users u ON pa.author_id = u.id
      ${whereClause}
      ORDER BY p.${order.replace(' DESC', '').replace(' ASC', '')} ${order.includes('DESC') ? 'DESC' : 'ASC'}
      LIMIT ? OFFSET ?
    `, [...queryParams, limit, offset]) as [PostRowWithAuthor[], FieldPacket[]];

    // Get tags for posts
    const postIds = postsResult.map((p: PostRowWithAuthor) => p.id);
    const tagsMap: Record<string, Tag[]> = {};

    if (postIds.length > 0) {
      const placeholders = postIds.map(() => '?').join(',');
      const [tagsResult] = await db.execute(`
        SELECT
          pt.post_id,
          t.id,
          t.name,
          t.slug
        FROM posts_tags pt
        JOIN tags t ON pt.tag_id = t.id
        WHERE pt.post_id IN (${placeholders})
        ORDER BY pt.sort_order
      `, postIds) as [TagRow[], FieldPacket[]];

      // Group tags by post
      tagsResult.forEach((row: TagRow) => {
        if (!tagsMap[row.post_id!]) {
          tagsMap[row.post_id!] = [];
        }
        tagsMap[row.post_id!].push({
          id: row.id,
          name: row.name,
          slug: row.slug,
          url: `https://ghost.behaviorschool.com/tag/${row.slug}/`
        });
      });
    }

    // Format posts
    const posts: Post[] = postsResult.map((row: PostRowWithAuthor) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      url: `https://ghost.behaviorschool.com/${row.slug}/`,
      excerpt: row.excerpt,
      feature_image: row.feature_image,
      published_at: row.published_at ? new Date(row.published_at).toISOString() : null,
      tags: tagsMap[row.id] || [],
      primary_tag: tagsMap[row.id]?.[0] || null,
      authors: row.author_id ? [{
        id: row.author_id,
        name: row.author_name!,
        slug: row.author_slug!,
        profile_image: row.author_profile_image,
        url: `https://ghost.behaviorschool.com/author/${row.author_slug!}/`
      }] : [],
      primary_author: row.author_id ? {
        id: row.author_id,
        name: row.author_name!,
        slug: row.author_slug!,
        profile_image: row.author_profile_image,
        url: `https://ghost.behaviorschool.com/author/${row.author_slug!}/`
      } : null,
      html: row.html,
      plaintext: row.plaintext
    }));

    return {
      posts,
      meta: {
        pagination: {
          page,
          limit,
          pages,
          total,
          next: page < pages ? page + 1 : null,
          prev: page > 1 ? page - 1 : null,
        }
      }
    };

  } catch (error) {
    console.error('Database error:', error);
    // Return empty result on error
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
  slug: string
): Promise<Post | null> {
  assertServerOnly();

  try {
    const db = await getConnection();

    // Get post with author
    const [postsResult] = await db.execute(`
      SELECT
        p.id,
        p.title,
        p.slug,
        p.excerpt,
        p.feature_image,
        p.published_at,
        p.html,
        p.plaintext,
        u.id as author_id,
        u.name as author_name,
        u.slug as author_slug,
        u.profile_image as author_profile_image
      FROM posts p
      LEFT JOIN posts_authors pa ON p.id = pa.post_id AND pa.sort_order = 0
      LEFT JOIN users u ON pa.author_id = u.id
      WHERE p.slug = ? AND p.status = "published" AND p.type = "post"
      LIMIT 1
    `, [slug]) as [PostRowWithAuthor[], FieldPacket[]];

    if (postsResult.length === 0) {
      return null;
    }

    const postRow = postsResult[0];

    // Get tags for this post
    const [tagsResult] = await db.execute(`
      SELECT
        t.id,
        t.name,
        t.slug
      FROM posts_tags pt
      JOIN tags t ON pt.tag_id = t.id
      WHERE pt.post_id = ?
      ORDER BY pt.sort_order
    `, [postRow.id]) as [TagRow[], FieldPacket[]];

    const tags: Tag[] = tagsResult.map((row: TagRow) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      url: `https://ghost.behaviorschool.com/tag/${row.slug}/`
    }));

    return {
      id: postRow.id,
      title: postRow.title,
      slug: postRow.slug,
      url: `https://ghost.behaviorschool.com/${postRow.slug}/`,
      excerpt: postRow.excerpt,
      feature_image: postRow.feature_image,
      published_at: postRow.published_at ? new Date(postRow.published_at).toISOString() : null,
      tags,
      primary_tag: tags[0] || null,
      authors: postRow.author_id ? [{
        id: postRow.author_id,
        name: postRow.author_name!,
        slug: postRow.author_slug!,
        profile_image: postRow.author_profile_image,
        url: `https://ghost.behaviorschool.com/author/${postRow.author_slug!}/`
      }] : [],
      primary_author: postRow.author_id ? {
        id: postRow.author_id,
        name: postRow.author_name!,
        slug: postRow.author_slug!,
        profile_image: postRow.author_profile_image,
        url: `https://ghost.behaviorschool.com/author/${postRow.author_slug!}/`
      } : null,
      html: postRow.html,
      plaintext: postRow.plaintext
    };

  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
}

export async function getTags(args: { limit?: number } = {}): Promise<Tag[]> {
  assertServerOnly();

  const { limit = 50 } = args;

  try {
    const db = await getConnection();

    const [result] = await db.execute(`
      SELECT id, name, slug
      FROM tags
      WHERE visibility = 'public'
      ORDER BY name
      LIMIT ?
    `, [limit]) as [TagRow[], FieldPacket[]];

    return result.map((row: TagRow) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      url: `https://ghost.behaviorschool.com/tag/${row.slug}/`
    }));

  } catch (error) {
    console.error('Database error:', error);
    return [];
  }
}

export async function getAuthors(): Promise<Author[]> {
  assertServerOnly();

  try {
    const db = await getConnection();

    const [result] = await db.execute(`
      SELECT id, name, slug, profile_image
      FROM users
      WHERE status = 'active'
      ORDER BY name
    `) as [AuthorRow[], FieldPacket[]];

    return result.map((row: AuthorRow) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      profile_image: row.profile_image,
      url: `https://ghost.behaviorschool.com/author/${row.slug}/`
    }));

  } catch (error) {
    console.error('Database error:', error);
    return [];
  }
}