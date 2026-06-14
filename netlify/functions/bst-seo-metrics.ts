/**
 * Behavior Study Tools SEO metrics collector.
 *
 * Pulls Google Search Console and Ahrefs-style organic keyword movement before
 * the daily growth monitor creates its recommendation snapshot.
 */

type HandlerResponse = {
  statusCode: number
  body: string
}

export const handler = async (): Promise<HandlerResponse> => {
  const secret = process.env.BST_DAILY_MONITOR_SECRET
  const siteUrl = process.env.BST_MARKETING_SITE_URL || process.env.URL || 'https://behaviorschool.com'

  if (!secret) {
    console.warn('[bst-seo-metrics] BST_DAILY_MONITOR_SECRET is not configured')
    return {
      statusCode: 202,
      body: JSON.stringify({ ok: false, skipped: 'missing_secret' }),
    }
  }

  const endpoint = `${siteUrl.replace(/\/$/, '')}/api/admin/behavior-study-tools/seo-metrics`
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ limit: Number(process.env.BST_SEO_COLLECTION_LIMIT || 100) }),
  })

  const text = await response.text()
  if (!response.ok) {
    console.error('[bst-seo-metrics] SEO endpoint failed:', response.status, text)
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, status: response.status, body: text.slice(0, 500) }),
    }
  }

  console.log('[bst-seo-metrics] SEO signals collected')
  return {
    statusCode: 200,
    body: text,
  }
}
