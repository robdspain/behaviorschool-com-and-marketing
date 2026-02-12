import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'content/blog');

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author?: string;
  featured_image?: string;
  tags?: string[];
  status: 'published' | 'draft';
  meta_title?: string;
  meta_description?: string;
}

export interface BlogPostMetadata {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author?: string;
  featured_image?: string;
  tags?: string[];
  status: 'published' | 'draft';
}

// Ensure directory exists
if (!fs.existsSync(postsDirectory)) {
  fs.mkdirSync(postsDirectory, { recursive: true });
}

export function getAllPostSlugs(): string[] {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => fileName.replace(/\.md$/, ''));
  } catch (error) {
    console.error('Error reading posts directory:', error);
    return [];
  }
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || 'Untitled',
      excerpt: data.excerpt || '',
      content,
      date: data.date || new Date().toISOString(),
      author: data.author,
      featured_image: data.featured_image,
      tags: data.tags || [],
      status: data.status || 'draft',
      meta_title: data.meta_title,
      meta_description: data.meta_description,
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

export function getAllPosts(): BlogPostMetadata[] {
  const slugs = getAllPostSlugs();
  const posts = slugs
    .map(slug => {
      const post = getPostBySlug(slug);
      if (!post) return null;
      
      // Return metadata only (no content)
      return {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        date: post.date,
        author: post.author,
        featured_image: post.featured_image,
        tags: post.tags,
        status: post.status,
      };
    })
    .filter((post): post is BlogPostMetadata => post !== null)
    .sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));

  return posts;
}

export function getPublishedPosts(): BlogPostMetadata[] {
  return getAllPosts().filter(post => post.status === 'published');
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(remarkGfm).use(html, { sanitize: false }).process(markdown);
  return result.toString();
}

export function savePost(slug: string, frontmatter: any, content: string): void {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContent = matter.stringify(content, frontmatter);
  fs.writeFileSync(fullPath, fileContent, 'utf8');
}

export function deletePost(slug: string): boolean {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error deleting post ${slug}:`, error);
    return false;
  }
}
