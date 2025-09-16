/*
  Ghost Hybrid Data Access
  - Tries database first for best performance and reliability
  - Falls back to Ghost API if database is unavailable
  - Provides seamless experience for users
*/

import { getPosts as getPostsFromAPI, getPostBySlug as getPostBySlugFromAPI, getTags as getTagsFromAPI, getAuthors as getAuthorsFromAPI } from './ghost';
import { getPosts as getPostsFromDB, getPostBySlug as getPostBySlugFromDB, getTags as getTagsFromDB, getAuthors as getAuthorsFromDB } from './ghost-db';

// Re-export types from the API module
export type { Post, Tag, Author, PaginationMeta } from './ghost';

export async function getPosts(
  args: {
    limit?: number;
    page?: number;
    filter?: string;
    tag?: string;
    order?: string;
    include?: string;
  } = {}
) {
  // Try database first
  try {
    const dbResult = await getPostsFromDB(args);
    if (dbResult.posts.length > 0 || args.tag) {
      // If we got posts or this was a specific tag query, use DB result
      console.log('Using database for getPosts');
      return dbResult;
    }
  } catch (error) {
    console.log('Database unavailable for getPosts, falling back to API:', error instanceof Error ? error.message : error);
  }

  // Fall back to API
  console.log('Using Ghost API for getPosts');
  return await getPostsFromAPI(args);
}

export async function getPostBySlug(
  slug: string,
  args: { include?: string; formats?: string } = {}
) {
  // Try database first
  try {
    const dbResult = await getPostBySlugFromDB(slug);
    if (dbResult) {
      console.log('Using database for getPostBySlug');
      return dbResult;
    }
  } catch (error) {
    console.log('Database unavailable for getPostBySlug, falling back to API:', error instanceof Error ? error.message : error);
  }

  // Fall back to API
  console.log('Using Ghost API for getPostBySlug');
  return await getPostBySlugFromAPI(slug, args);
}

export async function getTags(args: { limit?: number } = {}) {
  // Try database first
  try {
    const dbResult = await getTagsFromDB(args);
    if (dbResult.length > 0) {
      console.log('Using database for getTags');
      return dbResult;
    }
  } catch (error) {
    console.log('Database unavailable for getTags, falling back to API:', error instanceof Error ? error.message : error);
  }

  // Fall back to API
  console.log('Using Ghost API for getTags');
  return await getTagsFromAPI(args);
}

export async function getAuthors(args = {}) {
  // Try database first
  try {
    const dbResult = await getAuthorsFromDB();
    if (dbResult.length > 0) {
      console.log('Using database for getAuthors');
      return dbResult;
    }
  } catch (error) {
    console.log('Database unavailable for getAuthors, falling back to API:', error instanceof Error ? error.message : error);
  }

  // Fall back to API
  console.log('Using Ghost API for getAuthors');
  return await getAuthorsFromAPI(args);
}