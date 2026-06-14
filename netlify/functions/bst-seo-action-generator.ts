/**
 * Behavior Study Tools SEO action generator.
 *
 * Converts collected GSC/Ahrefs signals into specific page-improvement actions
 * before the daily growth report chooses the top recommendation.
 */

type HandlerResponse = {
  statusCode: number
  body: string
}

export const handler = async (): Promise<HandlerResponse> => {
  const secret = process.env.BST_DAILY_MONITOR_SECRET
  const siteUrl = process.env.BST_MARKETING_SITE_URL || process.env.URL || 'https://behaviorschool.com'

  if (!secret) {
    console.warn('[bst-seo-action-generator] BST_DAILY_MONITOR_SECRET is not configured')
    return {
      statusCode: 202,
      body: JSON.stringify({ ok: false, skipped: 'missing_secret' }),
    }
  }

  const endpoint = `${siteUrl.replace(/\/$/, '')}/api/admin/behavior-study-tools/seo-actions`
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ action: 'generate', limit: Number(process.env.BST_SEO_ACTION_LIMIT || 20) }),
  })

  const text = await response.text()
  if (!response.ok) {
    console.error('[bst-seo-action-generator] SEO action endpoint failed:', response.status, text)
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, status: response.status, body: text.slice(0, 500) }),
    }
  }

  console.log('[bst-seo-action-generator] SEO page actions generated')
  return {
    statusCode: 200,
    body: text,
  }
}
