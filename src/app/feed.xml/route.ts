import { getPosts } from "@/lib/ghost-hybrid";

export async function GET() {
  const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://behaviorschool.com";

  try {
    // Get latest blog posts from Ghost CMS
    const { posts } = await getPosts({ 
      limit: 20, 
      order: "published_at DESC", 
      include: "tags,authors" 
    });

    const rssItems = posts.map((post) => {
      const pubDate = post.published_at ? new Date(post.published_at).toUTCString() : new Date().toUTCString();
      const author = post.authors?.[0]?.name || "Behavior School";
      const tags = post.tags?.map(tag => tag.name).join(", ") || "";

      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt || ''}]]></description>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid>${SITE_URL}/blog/${post.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>${author}</author>
      <category>${tags}</category>
    </item>`;
    }).join('');

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="https://www.w3.org/2005/Atom">
  <channel>
    <title>Behavior School Blog</title>
    <description>Tools, training, and community to help school-based BCBAs thrive — from functional assessments to supervision systems that work in real classrooms.</description>
    <link>${SITE_URL}</link>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/Logos/logo-gold-transparent.webp</url>
      <title>Behavior School</title>
      <link>${SITE_URL}</link>
    </image>
    <managingEditor>info@behaviorschool.com (Behavior School)</managingEditor>
    <webMaster>info@behaviorschool.com (Behavior School)</webMaster>
    <copyright>Copyright ${new Date().getFullYear()} Behavior School. All rights reserved.</copyright>
    <category>Education</category>
    <category>Behavior Analysis</category>
    <category>Special Education</category>
    ${rssItems}
  </channel>
</rss>`;

    return new Response(rssXml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    
    // Return a basic RSS feed if there's an error with Ghost CMS
    const basicRssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="https://www.w3.org/2005/Atom">
  <channel>
    <title>Behavior School Blog</title>
    <description>Tools, training, and community to help school-based BCBAs thrive — from functional assessments to supervision systems that work in real classrooms.</description>
    <link>${SITE_URL}</link>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
  </channel>
</rss>`;

    return new Response(basicRssXml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  }
}

export const revalidate = 3600; // Revalidate every hour
