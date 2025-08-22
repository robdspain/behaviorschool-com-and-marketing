import { getPosts } from "@/lib/ghost";

export async function GET() {
  const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://behaviorschool.com";

  try {
    // Get latest blog posts from Ghost CMS
    const { posts } = await getPosts({ 
      limit: 20, 
      order: "published_at desc", 
      include: "tags,authors" 
    });

    const feedItems = posts.map((post) => {
      const author = post.authors?.[0] || { name: "Behavior School" };
      const tags = post.tags?.map(tag => tag.name) || [];

      return {
        id: `${SITE_URL}/blog/${post.slug}`,
        url: `${SITE_URL}/blog/${post.slug}`,
        title: post.title,
        summary: post.excerpt || '',
        content_html: post.html || '',
        content_text: post.plaintext || '',
        date_published: post.published_at,
        date_modified: post.published_at,
        author: {
          name: author.name,
          url: ('url' in author && author.url) ? author.url : `${SITE_URL}/about`,
        },
        tags: tags,
        image: post.feature_image,
      };
    });

    const jsonFeed = {
      version: "https://jsonfeed.org/version/1.1",
      title: "Behavior School Blog",
      description: "Tools, training, and community to help school-based BCBAs thrive — from functional assessments to supervision systems that work in real classrooms.",
      home_page_url: SITE_URL,
      feed_url: `${SITE_URL}/feed.json`,
      language: "en-us",
      icon: `${SITE_URL}/Logos/logo-gold-transparent.webp`,
      favicon: `${SITE_URL}/favicon.ico`,
      authors: [
        {
          name: "Behavior School",
          url: `${SITE_URL}/about`,
        }
      ],
      items: feedItems,
    };

    return new Response(JSON.stringify(jsonFeed, null, 2), {
      headers: {
        'Content-Type': 'application/feed+json; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating JSON feed:', error);
    
    // Return a basic JSON feed if there's an error
    const basicJsonFeed = {
      version: "https://jsonfeed.org/version/1.1",
      title: "Behavior School Blog",
      description: "Tools, training, and community to help school-based BCBAs thrive — from functional assessments to supervision systems that work in real classrooms.",
      home_page_url: SITE_URL,
      feed_url: `${SITE_URL}/feed.json`,
      language: "en-us",
      items: [],
    };

    return new Response(JSON.stringify(basicJsonFeed, null, 2), {
      headers: {
        'Content-Type': 'application/feed+json; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  }
}

export const revalidate = 3600; // Revalidate every hour