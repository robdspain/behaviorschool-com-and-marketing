/**
 * Behavior Study Tools social feedback refresh.
 *
 * Pulls engagement and conversion feedback for published social posts after
 * the daily publisher runs, then stores those metrics as growth signals.
 */

type HandlerResponse = {
  statusCode: number
  body: string
}

declare const process: {
  env: Record<string, string | undefined>
}

export const handler = async (): Promise<HandlerResponse> => {
  const secret = process.env.BST_DAILY_MONITOR_SECRET
  const siteUrl = process.env.BST_MARKETING_SITE_URL || process.env.URL || 'https://behaviorschool.com'

  if (!secret) {
    console.warn('[bst-social-feedback-refresh] BST_DAILY_MONITOR_SECRET is not configured')
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
    body: JSON.stringify({ action: 'refresh_feedback', limit: Number(process.env.BST_SOCIAL_FEEDBACK_LIMIT || 20) }),
  })

  const text = await response.text()
  if (!response.ok) {
    console.error('[bst-social-feedback-refresh] Feedback refresh failed:', response.status, text)
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, status: response.status, body: text.slice(0, 500) }),
    }
  }

  console.log('[bst-social-feedback-refresh] Social feedback refresh complete')
  return {
    statusCode: 200,
    body: text,
  }
}
