import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { isValidAdminSessionToken } from '@/lib/adminSession'
import { getConvexUrl } from '@/lib/convex'

export const dynamic = 'force-dynamic'

const COOKIE_NAME = 'bs_admin_session'

type IntegrationStatus = 'connected' | 'partial' | 'missing'

type IntegrationStatusItem = {
  id: string
  label: string
  status: IntegrationStatus
  message: string
  nextStep: string
  envVars: string[]
  impact: string
}


async function isAdminAuthenticated() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  return isValidAdminSessionToken(token)
}

function hasEnv(...names: string[]) {
  return names.some((name) => Boolean(process.env[name]?.trim()))
}

function item({
  id,
  label,
  status,
  message,
  nextStep,
  envVars,
  impact,
}: IntegrationStatusItem): IntegrationStatusItem {
  return { id, label, status, message, nextStep, envVars, impact }
}

function buildIntegrationStatus() {
  const hasConvexUrl = Boolean(getConvexUrl())
  const hasGoogleJson = hasEnv('BST_GOOGLE_SERVICE_ACCOUNT_JSON')
  const hasGooglePair =
    hasEnv('BST_GSC_SERVICE_ACCOUNT_EMAIL', 'GOOGLE_CLIENT_EMAIL') &&
    hasEnv('BST_GSC_PRIVATE_KEY', 'GOOGLE_PRIVATE_KEY')
  const hasGoogleIdentity = hasGoogleJson || hasGooglePair
  const hasGscSite = hasEnv('BST_GSC_SITE_URL')
  const hasAhrefsToken = hasEnv('AHREFS_API_TOKEN', 'BST_AHREFS_API_TOKEN')
  const hasAhrefsTarget = hasEnv('BST_AHREFS_TARGET')
  const hasDailySecret = hasEnv('BST_DAILY_MONITOR_SECRET')
  const hasSiteUrl = hasEnv('BST_MARKETING_SITE_URL', 'URL')
  const hasSocialPublisher = hasEnv('BST_SOCIAL_POST_WEBHOOK_URL')
  const hasSocialFeedback = hasEnv('BST_SOCIAL_FEEDBACK_WEBHOOK_URL')

  const items: IntegrationStatusItem[] = [
    item({
      id: 'convex-admin',
      label: 'Convex admin storage',
      status: hasConvexUrl ? 'connected' : 'missing',
      message: hasConvexUrl
        ? 'Server-side admin storage is configured through Convex.'
        : 'Admin storage is not configured.',
      nextStep: hasConvexUrl
        ? 'Keep monitoring daily event volume and admin workflow completion in Convex.'
        : 'Set NEXT_PUBLIC_CONVEX_URL in production.',
      envVars: ['NEXT_PUBLIC_CONVEX_URL'],
      impact: 'Without storage, conversion and SEO decisions are based on incomplete evidence.',
    }),
    item({
      id: 'daily-monitor',
      label: 'Daily growth monitor',
      status: hasDailySecret && hasSiteUrl ? 'connected' : hasDailySecret || hasSiteUrl ? 'partial' : 'missing',
      message: hasDailySecret && hasSiteUrl
        ? 'Scheduled Netlify functions can call the protected daily growth endpoints.'
        : hasDailySecret || hasSiteUrl
          ? 'The monitor has only part of the required configuration.'
          : 'The daily self-improvement loop cannot run automatically yet.',
      nextStep: hasDailySecret && hasSiteUrl
        ? 'Check the next scheduled function run and confirm a persisted daily report appears.'
        : 'Set BST_DAILY_MONITOR_SECRET and BST_MARKETING_SITE_URL in Netlify.',
      envVars: ['BST_DAILY_MONITOR_SECRET', 'BST_MARKETING_SITE_URL or URL'],
      impact: 'This is what turns daily traffic, SEO, social, customer, and competitor signals into a task list.',
    }),
    item({
      id: 'search-console',
      label: 'Google Search Console',
      status: hasGoogleIdentity && hasGscSite ? 'connected' : hasGoogleIdentity || hasGscSite ? 'partial' : 'missing',
      message: hasGoogleIdentity && hasGscSite
        ? 'Search Console imports can collect queries, pages, impressions, clicks, CTR, and position.'
        : hasGoogleIdentity || hasGscSite
          ? 'Search Console is only partially configured.'
          : 'Organic search query data is not connected.',
      nextStep: hasGoogleIdentity && hasGscSite
        ? 'Run the SEO metrics collector and review query movement before changing page copy.'
        : 'Add service-account credentials and BST_GSC_SITE_URL for behaviorstudytools.com.',
      envVars: [
        'BST_GOOGLE_SERVICE_ACCOUNT_JSON or service-account email/private key pair',
        'BST_GSC_SITE_URL',
      ],
      impact: 'This tells us which pass-exam and study-intent searches are starting to work.',
    }),
    item({
      id: 'ahrefs',
      label: 'Ahrefs competitor/keyword data',
      status: hasAhrefsToken ? (hasAhrefsTarget ? 'connected' : 'partial') : 'missing',
      message: hasAhrefsToken
        ? hasAhrefsTarget
          ? 'Ahrefs organic keyword imports can run against the configured target.'
          : 'Ahrefs has a token and will use the default behaviorstudytools.com target unless overridden.'
        : 'Ahrefs keyword collection is not connected.',
      nextStep: hasAhrefsToken
        ? 'Run the SEO metrics collector and compare new keyword opportunities against current pages.'
        : 'Set BST_AHREFS_API_TOKEN or AHREFS_API_TOKEN.',
      envVars: ['BST_AHREFS_API_TOKEN or AHREFS_API_TOKEN', 'BST_AHREFS_TARGET'],
      impact: 'This helps find competitor and keyword gaps before competitors outrank the pages.',
    }),
    item({
      id: 'social-publishing',
      label: 'Social publishing webhook',
      status: hasSocialPublisher ? 'connected' : 'missing',
      message: hasSocialPublisher
        ? 'Queued social posts can be sent to the publishing workflow.'
        : 'The admin can draft posts, but it cannot publish them automatically.',
      nextStep: hasSocialPublisher
        ? 'Send one test post through the queue and confirm the published URL is saved.'
        : 'Set BST_SOCIAL_POST_WEBHOOK_URL to the publishing automation endpoint.',
      envVars: ['BST_SOCIAL_POST_WEBHOOK_URL'],
      impact: 'This reduces manual posting and keeps the daily campaign cadence consistent.',
    }),
    item({
      id: 'social-feedback',
      label: 'Social feedback webhook',
      status: hasSocialFeedback ? 'connected' : 'missing',
      message: hasSocialFeedback
        ? 'Published post feedback can be imported back into the growth loop.'
        : 'Social posts can be logged, but platform results need manual entry.',
      nextStep: hasSocialFeedback
        ? 'Import feedback for one published post and confirm clicks or comments appear in the daily brief.'
        : 'Set BST_SOCIAL_FEEDBACK_WEBHOOK_URL or keep using manual feedback entry.',
      envVars: ['BST_SOCIAL_FEEDBACK_WEBHOOK_URL'],
      impact: 'This tells us which hooks produce clicks, signups, saves, and objections worth turning into page copy.',
    }),
  ]

  const counts = items.reduce(
    (acc, current) => {
      acc[current.status] += 1
      return acc
    },
    { connected: 0, partial: 0, missing: 0 } as Record<IntegrationStatus, number>,
  )
  const nextCriticalAction =
    items.find((current) => current.status === 'missing') ||
    items.find((current) => current.status === 'partial') ||
    null

  return {
    generatedAt: new Date().toISOString(),
    ready: counts.missing === 0 && counts.partial === 0,
    counts,
    nextCriticalAction,
    items,
  }
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({
    success: true,
    status: buildIntegrationStatus(),
  })
}
