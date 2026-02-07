import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/admin/*',
          '/api/',
          '/test/',
          '/test/*',
          '/auth/',
          '/unauthorized',
          '/r/',
          '/presentations/present/',
          '/presentations/view/',
        ],
      },
    ],
    sitemap: 'https://behaviorschool.com/sitemap.xml',
  }
}
