/**
 * Behavior Study Tools daily growth monitor.
 *
 * Runs the self-improvement report once per day and persists a snapshot into
 * behavior_study_tools_growth_signals. Configure BST_DAILY_MONITOR_SECRET in
 * Netlify and set the same secret for the Next.js API route.
 */

type HandlerResponse = {
  statusCode: number
  body: string
}

export const handler = async (): Promise<HandlerResponse> => {
  const secret = process.env.BST_DAILY_MONITOR_SECRET
  const siteUrl = process.env.BST_MARKETING_SITE_URL || process.env.URL || 'https://behaviorschool.com'

  if (!secret) {
    console.warn('[bst-daily-growth-monitor] BST_DAILY_MONITOR_SECRET is not configured')
    return {
      statusCode: 202,
      body: JSON.stringify({ ok: false, skipped: 'missing_secret' }),
    }
  }

  const endpoint = `${siteUrl.replace(/\/$/, '')}/api/admin/behavior-study-tools/daily-growth-report?persist=1`
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${secret}`,
      Accept: 'application/json',
    },
  })

  const text = await response.text()
  if (!response.ok) {
    console.error('[bst-daily-growth-monitor] Report endpoint failed:', response.status, text)
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, status: response.status, body: text.slice(0, 500) }),
    }
  }

  console.log('[bst-daily-growth-monitor] Daily report snapshot created')
  return {
    statusCode: 200,
    body: text,
  }
}
