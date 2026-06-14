/**
 * Behavior Study Tools social publisher.
 *
 * Generates today's post from the marketing plan/daily report and publishes
 * due queued posts through BST_SOCIAL_POST_WEBHOOK_URL when configured.
 */

type HandlerResponse = {
  statusCode: number
  body: string
}

export const handler = async (): Promise<HandlerResponse> => {
  const secret = process.env.BST_DAILY_MONITOR_SECRET
  const siteUrl = process.env.BST_MARKETING_SITE_URL || process.env.URL || 'https://behaviorschool.com'

  if (!secret) {
    console.warn('[bst-social-publisher] BST_DAILY_MONITOR_SECRET is not configured')
    return {
      statusCode: 202,
      body: JSON.stringify({ ok: false, skipped: 'missing_secret' }),
    }
  }

  const endpoint = `${siteUrl.replace(/\/$/, '')}/api/admin/behavior-study-tools/social-posts`
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ action: 'run_daily' }),
  })

  const text = await response.text()
  if (!response.ok) {
    console.error('[bst-social-publisher] Social post run failed:', response.status, text)
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, status: response.status, body: text.slice(0, 500) }),
    }
  }

  console.log('[bst-social-publisher] Social post run complete')
  return {
    statusCode: 200,
    body: text,
  }
}
