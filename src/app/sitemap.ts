import { MetadataRoute } from 'next'

// Cache sitemap for 1 hour to reduce server load from crawler requests
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://behaviorschool.com'
  const currentDate = new Date().toISOString()
  const normalize = (p: string) => {
    try {
      let path = p.trim()
      if (!path.startsWith('/')) path = '/' + path
      if (path !== '/' && path.endsWith('/')) path = path.replace(/\/+$/, '')
      return path
    } catch { return p }
  }
  // Legacy paths that now permanently redirect. Never include these in the sitemap.
  const legacyRedirectPaths = new Set<string>([
    '/bcba-mock-practice-test',
    '/free-bcba-mock-practice-test',
    '/school-based-bcba',
    '/bcba-study-tools',
    '/bcbas-in-schools',
    '/school-bcba/job-guide',
  ])
  // Hard noindex paths: pages intentionally kept out of sitemap
  const hardNoindexPaths = new Set<string>([
    '/resources',
  ])

  // Load admin indexing settings and exclude any paths explicitly set to noindex
  const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL || baseUrl
  let noindex = new Set<string>()
  let includeSitemap = new Set<string>()
  let deleted = new Set<string>()
  try {
    const res = await fetch(`${siteOrigin}/api/admin/indexing`, { cache: 'no-store' })
    const json = await res.json().catch(() => ({ items: [] }))
    const nset = new Set<string>()
    const iset = new Set<string>()
    const dset = new Set<string>()
    for (const it of json.items || []) {
      if (it && typeof it.path === 'string') {
        if (it.index === false) nset.add(it.path)
        if (it.in_sitemap === true) iset.add(it.path)
        if (it.deleted === true) dset.add(it.path)
      }
    }
    noindex = nset
    includeSitemap = iset
    deleted = dset
  } catch {
    // If indexing API fails, default to including all entries
  }

  const entries: MetadataRoute.Sitemap = [
    // Homepage - Highest Priority
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },

    // Core Service Pages - High Priority
    {
      url: `${baseUrl}/transformation-program`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/bcba-exam-prep`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/behavior-study-tools`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/supervisors`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },

    // School BCBA Hub - High Priority
    {
      url: `${baseUrl}/school-bcba`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/school-bcba/vs-school-based-bcba`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/school-bcba/job-guide-2025`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/school-bcba/salary-by-state`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/school-bcba/how-to-become`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    // Tools and Resources
    {
      url: `${baseUrl}/iep-goals`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    // Removed redirecting legacy URLs from sitemap:
    // - /school-based-bcba -> /school-bcba
    // - /free-bcba-mock-practice-test -> /free-bcba-practice-exam
    // - /bcba-mock-practice-test -> /bcba-practice-exam
    {
      url: `${baseUrl}/behavior-plans`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/iep-behavior-goals`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/iep-goal-qualitychecker`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },

    // Main Navigation Pages
    {
      url: `${baseUrl}/products`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/community`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/bacb-ace-provider`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.75,
    },

    // Blog and Content
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // Removed legacy blog route that redirects: /bcbas-in-schools -> /school-bcba
    {
      url: `${baseUrl}/bcba-study-fluency`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/bcba-mock-exam-guide`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/free-bcba-practice-exam`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/values-goal-assistant-landing`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },

    // Study Tools
    {
      url: `${baseUrl}/study`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },

    // Engagement Pages
    {
      url: `${baseUrl}/signup`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.65,
    },
    {
      url: `${baseUrl}/subscribe`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },

    // Additional Important Pages
    {
      url: `${baseUrl}/school-based-behavior-support`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/act-matrix`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/the-act-matrix-a-framework-for-school-based-bcbas`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // /resources intentionally excluded until ready (noindex)
    // /templates intentionally excluded until ready (noindex)

    // Legal Pages
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Filter out any entries whose path is configured as noindex in admin
  const filteredBase = entries.filter((e) => {
    try {
      const url = new URL(e.url)
      const path = normalize(url.pathname || '/')
      const pathAlt = path.endsWith('/') ? path.slice(0, -1) : path + '/'
      return !noindex.has(path) && !noindex.has(pathAlt) &&
             !deleted.has(path) && !deleted.has(pathAlt) &&
             !legacyRedirectPaths.has(path) && !legacyRedirectPaths.has(pathAlt) &&
             !hardNoindexPaths.has(path)
    } catch {
      return true
    }
  })

  // Add any admin-approved sitemap entries that aren't already present
  const existingPaths = new Set<string>()
  for (const e of filteredBase) {
    try {
      const u = new URL(e.url)
      existingPaths.add(normalize(u.pathname || '/'))
    } catch {}
  }
  const dynamicAdds: MetadataRoute.Sitemap = []
  for (const p of includeSitemap) {
    const path = normalize(p)
    if (noindex.has(path) || deleted.has(path)) continue
    if (legacyRedirectPaths.has(path) || hardNoindexPaths.has(path)) continue
    if (!existingPaths.has(path)) {
      dynamicAdds.push({
        url: `${baseUrl}${path}`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    }
  }

  return [...filteredBase, ...dynamicAdds]
}
