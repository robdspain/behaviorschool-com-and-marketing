/**
 * Behavior Study Tools SEO draft generator.
 *
 * Converts queued SEO page-improvement actions into approval-ready content
 * drafts for the admin dashboard.
 */

type HandlerResponse = {
  statusCode: number
  body: string
}

export const handler = async (): Promise<HandlerResponse> => {
  const secret = process.env.BST_DAILY_MONITOR_SECRET
  const siteUrl = process.env.BST_MARKETING_SITE_URL || process.env.URL || 'https://behaviorschool.com'

  if (!secret) {
    console.warn('[bst-seo-draft-generator] BST_DAILY_MONITOR_SECRET is not configured')
    return {
      statusCode: 202,
      body: JSON.stringify({ ok: false, skipped: 'missing_secret' }),
    }
  }

  const endpoint = `${siteUrl.replace(/\/$/, '')}/api/admin/behavior-study-tools/seo-drafts`
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ action: 'generate', limit: Number(process.env.BST_SEO_DRAFT_LIMIT || 10) }),
  })

  const text = await response.text()
  if (!response.ok) {
    console.error('[bst-seo-draft-generator] SEO draft endpoint failed:', response.status, text)
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, status: response.status, body: text.slice(0, 500) }),
    }
  }

  console.log('[bst-seo-draft-generator] SEO content drafts generated')
  return {
    statusCode: 200,
    body: text,
  }
}
