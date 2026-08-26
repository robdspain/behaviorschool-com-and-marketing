import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { subscribeToNewsletter } from '../../src/lib/convex-newsletter'
import { newsletterSourceReviewProgress, summarizeNewsletterAcquisition } from '../../src/lib/newsletter-acquisition'

test('Behavior School signup enters the canonical RobSpain delivery audience with source tags', async () => {
  const originalFetch = global.fetch
  const originalUrl = process.env.ROBSPAIN_NEWSLETTER_CONVEX_URL
  let requestUrl = ''
  let requestBody: Record<string, any> = {}

  process.env.ROBSPAIN_NEWSLETTER_CONVEX_URL = 'https://delivery.example'
  global.fetch = (async (input, init) => {
    requestUrl = String(input)
    requestBody = JSON.parse(String(init?.body || '{}'))
    return new Response(JSON.stringify({ value: { status: 'pending', isNew: true } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }) as typeof fetch

  try {
    const result = await subscribeToNewsletter({
      email: ' Reader@Example.com ',
      source: 'behaviorschool-blog:/blog/fba',
      page: '/blog/fba',
      tags: ['blog-signup'],
    })

    assert.equal(requestUrl, 'https://delivery.example/api/action')
    assert.equal(requestBody.path, 'newsletterActions:requestSubscription')
    assert.equal(requestBody.args.email, 'reader@example.com')
    assert.equal(requestBody.args.source, 'behaviorschool-blog:/blog/fba')
    assert.deepEqual(requestBody.args.tags, ['newsletter', 'behaviorschool.com', 'page:/blog/fba', 'blog-signup'])
    assert.equal(result.isNew, true)
    assert.equal(result.status, 'pending')
  } finally {
    global.fetch = originalFetch
    if (originalUrl === undefined) delete process.env.ROBSPAIN_NEWSLETTER_CONVEX_URL
    else process.env.ROBSPAIN_NEWSLETTER_CONVEX_URL = originalUrl
  }
})

test('source summary returns aggregate confirmed conversions without contact details', () => {
  const launchAt = 1_000
  const summary = summarizeNewsletterAcquisition(
    33,
    [
      { source: 'behaviorschool-blog:/blog/fba', confirmedAt: 1_200, updatedAt: 1_200 },
      { source: 'verified-import', confirmedAt: 500, updatedAt: 500 },
    ],
    [{ source: 'behaviorschool-blog:/blog/fba', updatedAt: 1_300 }],
    launchAt,
    50,
  )

  assert.deepEqual(summary, {
    available: true,
    launchAt,
    targetConfirmed: 50,
    confirmedTotal: 33,
    confirmedSinceLaunch: 1,
    remainingToTarget: 17,
    pendingSinceLaunch: 1,
    sources: [
      { source: 'behaviorschool-blog:/blog/fba', requested: 2, confirmed: 1, pending: 1, confirmationRate: 0.5 },
    ],
    allSources: [
      { source: 'behaviorschool-blog:/blog/fba', requested: 2, confirmed: 1, pending: 1, confirmationRate: 0.5 },
      { source: 'verified-import', requested: 1, confirmed: 1, pending: 0, confirmationRate: 1 },
    ],
  })
  assert.doesNotMatch(JSON.stringify(summary), /@/)
})

test('admin reporting keeps delivery counts on the canonical RobSpain audience', async () => {
  const controlRoute = await readFile('src/app/api/admin/newsletter/control/route.ts', 'utf8')
  const marketingRoute = await readFile('src/app/api/admin/transformation-marketing/overview/route.ts', 'utf8')
  const dashboard = await readFile('src/app/admin/newsletter/page.tsx', 'utf8')

  assert.match(controlRoute, /deliveryAudience/)
  assert.match(controlRoute, /deliveryDashboard\.audience\.subscribed/)
  assert.match(marketingRoute, /Canonical RobSpain\.com newsletter audience/)
  assert.doesNotMatch(marketingRoute, /weeklyNewsletter:subscriberReadinessForAdmin/)
  assert.match(dashboard, /Every count below comes from the same confirmed RobSpain delivery database/)
})

test('signup surfaces expose confirmation delivery and recovery states', async () => {
  const primaryRoute = await readFile('src/app/api/newsletter/route.ts', 'utf8')
  const embeddedRoute = await readFile('src/app/api/newsletter/subscribe/route.ts', 'utf8')
  const popup = await readFile('src/components/ui/email-signup-popup.tsx', 'utf8')
  const embeddedSignup = await readFile('src/components/NewsletterSignup.tsx', 'utf8')

  for (const route of [primaryRoute, embeddedRoute]) {
    assert.match(route, /confirmationSent/)
    assert.match(route, /retryAfterSeconds/)
  }
  assert.match(popup, /disabled=\{isSubmitting\}/)
  assert.match(popup, /We could not start your subscription/)
  assert.match(popup, /variant:outcome-specific-v1/)
  assert.match(embeddedSignup, /Request a fresh confirmation link/)
  assert.match(embeddedSignup, /Send me the weekly brief/)
})

test('newsletter admin exposes welcome progress and personalized reader responses', async () => {
  const controlRoute = await readFile('src/app/api/admin/newsletter/control/route.ts', 'utf8')
  const dashboard = await readFile('src/app/admin/newsletter/page.tsx', 'utf8')
  const newsletterAdmin = await readFile('src/lib/newsletter-admin.ts', 'utf8')

  assert.match(controlRoute, /deliveryDashboard\.onboarding/)
  assert.match(controlRoute, /newsletter\/start\//)
  assert.match(dashboard, /New-reader welcome sequence/)
  assert.match(dashboard, /Recent welcome-form responses/)
  assert.match(dashboard, /mailto:/)
  assert.match(newsletterAdmin, /welcomeSent: number/)
  assert.match(newsletterAdmin, /responses: Array/)
})

test('source review becomes ready only after two post-launch sends', () => {
  const launchAt = 1_000
  assert.deepEqual(
    newsletterSourceReviewProgress([{ sentAt: 900 }, { sentAt: 1_100 }, { sentAt: null }], launchAt),
    { sentIssuesSinceLaunch: 1, reviewIssueTarget: 2, reviewReady: false },
  )
  assert.deepEqual(
    newsletterSourceReviewProgress([{ sentAt: 1_100 }, { sentAt: 1_200 }], launchAt),
    { sentIssuesSinceLaunch: 2, reviewIssueTarget: 2, reviewReady: true },
  )
})
