import { getSiteUrl } from "@/lib/site";

export async function GET() {
  const SITE_URL = getSiteUrl();
  const today = new Date().toISOString().slice(0, 10);

  const urls: Array<{ loc: string; changefreq: string; priority: number }> = [
    { loc: `${SITE_URL}/`, changefreq: 'weekly', priority: 1.0 },
    { loc: `${SITE_URL}/transformation-program`, changefreq: 'weekly', priority: 0.95 },
    { loc: `${SITE_URL}/behavior-study-tools`, changefreq: 'weekly', priority: 0.95 },
    { loc: `${SITE_URL}/bcba-exam-prep`, changefreq: 'weekly', priority: 0.9 },
    { loc: `${SITE_URL}/supervisors`, changefreq: 'weekly', priority: 0.9 },
    { loc: `${SITE_URL}/iep-goals`, changefreq: 'monthly', priority: 0.85 },
    { loc: `${SITE_URL}/behavior-plans`, changefreq: 'monthly', priority: 0.85 },
    { loc: `${SITE_URL}/iep-behavior-goals`, changefreq: 'monthly', priority: 0.85 },
    { loc: `${SITE_URL}/school-based-behavior-support`, changefreq: 'monthly', priority: 0.85 },
    { loc: `${SITE_URL}/products`, changefreq: 'weekly', priority: 0.8 },
    { loc: `${SITE_URL}/community`, changefreq: 'monthly', priority: 0.75 },
    { loc: `${SITE_URL}/about`, changefreq: 'monthly', priority: 0.7 },
    { loc: `${SITE_URL}/blog`, changefreq: 'weekly', priority: 0.7 },
    { loc: `${SITE_URL}/study`, changefreq: 'weekly', priority: 0.8 },
    { loc: `${SITE_URL}/signup`, changefreq: 'monthly', priority: 0.65 },
    { loc: `${SITE_URL}/subscribe`, changefreq: 'monthly', priority: 0.6 },
    { loc: `${SITE_URL}/contact`, changefreq: 'monthly', priority: 0.6 },
    { loc: `${SITE_URL}/privacy`, changefreq: 'monthly', priority: 0.3 },
    { loc: `${SITE_URL}/terms`, changefreq: 'monthly', priority: 0.3 },
    { loc: `${SITE_URL}/act-matrix`, changefreq: 'monthly', priority: 0.7 },
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map(u => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`).join('\n') +
    `\n</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400',
    },
  });
}

