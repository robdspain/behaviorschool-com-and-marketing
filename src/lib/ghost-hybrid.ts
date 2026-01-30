/*
  File-Based Blog Data Access
  - Replaces Ghost CMS with markdown files
  - Posts stored in content/blog/
  - Backward compatible with existing Ghost API types
*/

import { getAllPosts, getPostBySlug as getPostFromFile, getPublishedPosts, markdownToHtml } from './blog';

// Types for backward compatibility with Ghost
export interface Post {
  id: string;
  slug: string;
  title: string;
  html: string;
  excerpt: string | null;
  feature_image: string | null;
  published_at: string;
  updated_at: string;
  tags: Tag[];
  authors: Author[];
  reading_time: number;
  meta_title?: string | null;
  meta_description?: string | null;
  og_image?: string | null;
  twitter_image?: string | null;
}

export interface Tag {
  name: string;
  slug: string;
}

export interface Author {
  name: string;
  slug: string;
  profile_image?: string | null;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  pages: number;
  total: number;
  next: number | null;
  prev: number | null;
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
): Promise<{ posts: Post[]; meta: PaginationMeta }> {
  try {
    // Get posts from markdown files
    let posts = getPublishedPosts();

    // Filter by tag if specified
    if (args.tag) {
      posts = posts.filter(post => 
        post.tags?.some(tag => 
          tag.toLowerCase().replace(/\s+/g, '-') === args.tag?.toLowerCase()
        )
      );
    }

    // Apply limit
    const limit = args.limit || 15;
    const page = args.page || 1;
    const start = (page - 1) * limit;
    const end = start + limit;

    const paginatedPosts = posts.slice(start, end);

    // Transform to Ghost API format
    const transformedPosts: Post[] = await Promise.all(
      paginatedPosts.map(async (post) => {
        const fullPost = getPostFromFile(post.slug);
        const html = fullPost ? await markdownToHtml(fullPost.content) : '';

        return {
          id: post.slug,
          slug: post.slug,
          title: post.title,
          html,
          excerpt: post.excerpt || null,
          feature_image: post.featured_image || null,
          published_at: post.date,
          updated_at: post.date,
          tags: (post.tags || []).map(tag => ({
            name: tag,
            slug: tag.toLowerCase().replace(/\s+/g, '-')
          })),
          authors: [{
            name: post.author || 'Rob Spain',
            slug: (post.author || 'rob-spain').toLowerCase().replace(/\s+/g, '-'),
            profile_image: null
          }],
          reading_time: Math.ceil((fullPost?.content.split(/\s+/).length || 0) / 200), // ~200 words per minute
          meta_title: post.excerpt || null,
          meta_description: post.excerpt || null,
          og_image: post.featured_image || null,
          twitter_image: post.featured_image || null,
        };
      })
    );

    const meta: PaginationMeta = {
      page,
      limit,
      pages: Math.ceil(posts.length / limit),
      total: posts.length,
      next: end < posts.length ? page + 1 : null,
      prev: page > 1 ? page - 1 : null,
    };

    return { posts: transformedPosts, meta };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return {
      posts: [],
      meta: {
        page: 1,
        limit: 15,
        pages: 0,
        total: 0,
        next: null,
        prev: null,
      }
    };
  }
}

export async function getPostBySlug(
  slug: string,
  args: { include?: string; formats?: string } = {}
): Promise<Post | null> {
  try {
    const post = getPostFromFile(slug);

    if (!post || post.status !== 'published') {
      return null;
    }

    const html = await markdownToHtml(post.content);

    return {
      id: post.slug,
      slug: post.slug,
      title: post.title,
      html,
      excerpt: post.excerpt || null,
      feature_image: post.featured_image || null,
      published_at: post.date,
      updated_at: post.date,
      tags: (post.tags || []).map(tag => ({
        name: tag,
        slug: tag.toLowerCase().replace(/\s+/g, '-')
      })),
      authors: [{
        name: post.author || 'Rob Spain',
        slug: (post.author || 'rob-spain').toLowerCase().replace(/\s+/g, '-'),
        profile_image: null
      }],
      reading_time: Math.ceil(post.content.split(/\s+/).length / 200),
      meta_title: post.meta_title || null,
      meta_description: post.meta_description || null,
      og_image: post.featured_image || null,
      twitter_image: post.featured_image || null,
    };
  } catch (error) {
    console.error(`Error fetching post ${slug}:`, error);
    return null;
  }
}

export async function getTags(): Promise<Tag[]> {
  try {
    const posts = getAllPosts();
    const tagSet = new Set<string>();

    posts.forEach(post => {
      post.tags?.forEach(tag => tagSet.add(tag));
    });

    return Array.from(tagSet).map(tag => ({
      name: tag,
      slug: tag.toLowerCase().replace(/\s+/g, '-')
    }));
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

export async function getAuthors(): Promise<Author[]> {
  try {
    const posts = getAllPosts();
    const authorSet = new Set<string>();

    posts.forEach(post => {
      if (post.author) {
        authorSet.add(post.author);
      }
    });

    return Array.from(authorSet).map(author => ({
      name: author,
      slug: author.toLowerCase().replace(/\s+/g, '-'),
      profile_image: null
    }));
  } catch (error) {
    console.error('Error fetching authors:', error);
    return [{
      name: 'Rob Spain',
      slug: 'rob-spain',
      profile_image: null
    }];
  }
}
