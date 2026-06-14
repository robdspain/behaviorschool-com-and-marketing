/**
 * Behavior Study Tools trend research collector.
 *
 * Pulls lightweight Google News RSS search results for BCBA/RBT study topics
 * and stores them as trend_research growth signals before the daily monitor
 * builds its recommendation list.
 */

type HandlerResponse = {
  statusCode: number
  body: string
}

type TrendItem = {
  query: string
  title: string
  link: string
  source: string
  publishedAt: string
}

const TREND_QUERIES = [
  'BCBA exam prep',
  'BCBA mock exam',
  'RBT exam prep',
  'RBT practice test',
  'school based BCBA',
  'behavior analyst certification exam',
]

function decodeXml(value: string) {
  return value
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim()
}

function textBetween(input: string, tag: string) {
  const match = input.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'))
  return match ? decodeXml(match[1]) : ''
}

function parseGoogleNewsRss(xml: string, query: string): TrendItem[] {
  const itemMatches = xml.match(/<item>[\s\S]*?<\/item>/gi) || []
  return itemMatches.slice(0, 5).map((item) => ({
    query,
    title: textBetween(item, 'title'),
    link: textBetween(item, 'link'),
    source: textBetween(item, 'source') || 'Google News',
    publishedAt: textBetween(item, 'pubDate'),
  })).filter((item) => item.title && item.link)
}

function recommendationFor(item: TrendItem) {
  const lower = `${item.query} ${item.title}`.toLowerCase()
  if (lower.includes('rbt')) {
    return 'Create an RBT-focused post that sends candidates to the RBT web path and answers the specific anxiety or scenario in this trend.'
  }
  if (lower.includes('school')) {
    return 'Create a school-based BCBA post and link it to the school-based BCBA study app page or comparison page.'
  }
  if (lower.includes('mock')) {
    return 'Use this trend to refresh mock-exam copy with a direct free mock CTA and a screenshot of the exam flow.'
  }
  return 'Use this trend as a short post idea and connect it to the most relevant BCBA or RBT practice page.'
}

async function fetchTrends() {
  const allItems: TrendItem[] = []
  for (const query of TREND_QUERIES) {
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`
    try {
      const response = await fetch(rssUrl, {
        headers: {
          Accept: 'application/rss+xml, application/xml, text/xml',
          'User-Agent': 'BehaviorStudyToolsGrowthMonitor/1.0',
        },
      })
      if (!response.ok) {
        console.warn('[bst-trend-research] RSS fetch failed:', query, response.status)
        continue
      }
      const xml = await response.text()
      allItems.push(...parseGoogleNewsRss(xml, query))
    } catch (error) {
      console.warn('[bst-trend-research] RSS fetch error:', query, error)
    }
  }

  const seen = new Set<string>()
  return allItems.filter((item) => {
    const key = `${item.title}:${item.link}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  }).slice(0, 20)
}

export const handler = async (): Promise<HandlerResponse> => {
  const secret = process.env.BST_DAILY_MONITOR_SECRET
  const siteUrl = process.env.BST_MARKETING_SITE_URL || process.env.URL || 'https://behaviorschool.com'

  if (!secret) {
    console.warn('[bst-trend-research] BST_DAILY_MONITOR_SECRET is not configured')
    return {
      statusCode: 202,
      body: JSON.stringify({ ok: false, skipped: 'missing_secret' }),
    }
  }

  const items = await fetchTrends()
  if (!items.length) {
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, imported: 0, message: 'No trend items found' }),
    }
  }

  const today = new Date().toISOString().slice(0, 10)
  const signals = items.map((item) => ({
    signalDate: today,
    source: 'trend_research',
    signalType: 'trend_research',
    channel: 'google_news',
    url: item.link,
    keyword: item.query,
    topic: item.title,
    metricName: 'trend_item',
    metricValue: 1,
    metadata: {
      sourceName: item.source,
      publishedAt: item.publishedAt,
      query: item.query,
    },
    recommendation: recommendationFor(item),
    status: 'imported',
  }))

  const endpoint = `${siteUrl.replace(/\/$/, '')}/api/admin/behavior-study-tools/growth-signals`
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ signals }),
  })

  const text = await response.text()
  if (!response.ok) {
    console.error('[bst-trend-research] Signal import failed:', response.status, text)
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, status: response.status, body: text.slice(0, 500) }),
    }
  }

  console.log(`[bst-trend-research] Imported ${signals.length} trend signals`)
  return {
    statusCode: 200,
    body: text,
  }
}
